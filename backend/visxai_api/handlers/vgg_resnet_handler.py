import torch
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import json
from typing import Dict, Any, Optional, List
import numpy as np
from ..model_registry import ModelHandler

class VGGResNetHandler(ModelHandler):
    """Handler for VGG16 and ResNet50 pretrained models."""
    
    def __init__(self, architecture: str):
        self.architecture = architecture.lower()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load pretrained model
        if self.architecture == 'vgg16':
            self.model = models.vgg16(pretrained=True)
        elif self.architecture == 'resnet50':
            self.model = models.resnet50(pretrained=True)
        else:
            raise ValueError(f"Unsupported architecture: {architecture}")
        
        self.model.to(self.device)
        self.model.eval()
        
        # ImageNet preprocessing
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        
        # Load ImageNet class labels
        self.class_labels = self._load_imagenet_labels()
        
        # Storage for feature maps
        self.feature_maps = {}
        self._register_hooks()
    
    def _load_imagenet_labels(self) -> List[str]:
        """Load ImageNet class labels."""
        import os
        json_path = os.path.join(os.path.dirname(__file__), '..', 'imagenet_classes.json')
        try:
            with open(json_path, 'r') as f:
                class_dict = json.load(f)
                # Return first label for each class
                return [class_dict[str(i)][0] for i in range(1000)]
        except Exception as e:
            print(f"Warning: Could not load ImageNet labels: {e}")
            return [f"class_{i}" for i in range(1000)]
    
    def _register_hooks(self):
        """Register forward hooks to capture feature maps."""
        self.hooks = []
        
        if self.architecture == 'vgg16':
            # Capture from all learnable layers (13 conv + 3 fc = 16)
            # Features (Conv layers): [0, 2, 5, 7, 10, 12, 14, 17, 19, 21, 24, 26, 28]
            # Classifier (FC layers): [0, 3, 6] (Indices in classifier module)
            
            # Conv layers in features module
            conv_indices = [0, 2, 5, 7, 10, 12, 14, 17, 19, 21, 24, 26, 28]
            for i, idx in enumerate(conv_indices):
                hook = self.model.features[idx].register_forward_hook(
                    self._get_activation(f'conv_{i+1}')
                )
                self.hooks.append(hook)
                
            # FC layers in classifier module
            fc_indices = [0, 3, 6]
            for i, idx in enumerate(fc_indices):
                hook = self.model.classifier[idx].register_forward_hook(
                    self._get_activation(f'fc_{i+1}')
                )
                self.hooks.append(hook)

        elif self.architecture == 'resnet50':
            # Capture from each residual block
            for name, layer in [('layer1', self.model.layer1),
                               ('layer2', self.model.layer2),
                               ('layer3', self.model.layer3),
                               ('layer4', self.model.layer4)]:
                hook = layer.register_forward_hook(self._get_activation(name))
                self.hooks.append(hook)
    
    def _get_activation(self, name: str):
        """Create hook function to capture activations."""
        def hook(model, input, output):
            self.feature_maps[name] = output.detach()
        return hook
    
    def _tensor_to_base64(self, tensor: torch.Tensor) -> str:
        """Convert a tensor to base64 encoded PNG."""
        # Normalize to 0-255
        tensor = tensor.cpu().numpy()
        
        # Handle 1D tensors (FC layers) by reshaping to square-ish
        if len(tensor.shape) == 1:
            size = int(np.ceil(np.sqrt(tensor.shape[0])))
            padded = np.zeros(size * size)
            padded[:tensor.shape[0]] = tensor
            tensor = padded.reshape(size, size)
            
        tensor = (tensor - tensor.min()) / (tensor.max() - tensor.min() + 1e-8)
        tensor = (tensor * 255).astype(np.uint8)
        
        # Convert to PIL Image
        img = Image.fromarray(tensor, mode='L')
        
        # Encode to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    
    def predict(self, data: Any) -> Dict[str, Any]:
        """
        Predict class probabilities for an input image.
        
        Args:
            data: Dict with 'image' key containing base64 encoded image
        
        Returns:
            Dict with predictions and feature maps
        """
        # Clear previous feature maps
        self.feature_maps = {}
        
        # Decode image
        if isinstance(data, dict) and 'image' in data:
            image_data = data['image']
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        else:
            raise ValueError("Invalid input data format")
        
        # Preprocess
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Forward pass
        with torch.no_grad():
            output = self.model(input_tensor)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
        # Get top 5 predictions
        top5_prob, top5_idx = torch.topk(probabilities, 5)
        
        predictions = []
        for i in range(5):
            predictions.append({
                'label': self.class_labels[top5_idx[i].item()],
                'score': float(top5_prob[i].item())
            })
        
        # Extract feature maps (limit to first 16 channels per layer for performance)
        feature_data = {}
        
        # Define layer order for VGG16 to ensure sorted output
        layer_order = [f'conv_{i+1}' for i in range(13)] + [f'fc_{i+1}' for i in range(3)]
        
        for layer_id in layer_order:
            if layer_id not in self.feature_maps:
                continue
                
            fmap = self.feature_maps[layer_id]
            # Take first image from batch
            fmap = fmap[0]
            
            channels = []
            total_channels = 0
            
            if len(fmap.shape) == 3: # Conv layer (C, H, W)
                total_channels = fmap.shape[0]
                num_channels = min(16, total_channels)
                for i in range(num_channels):
                    channels.append(self._tensor_to_base64(fmap[i]))
            elif len(fmap.shape) == 1: # FC layer (N)
                # For FC layers, we just visualize the whole vector as one "map"
                total_channels = 1
                channels.append(self._tensor_to_base64(fmap))
            
            feature_data[layer_id] = {
                'maps': channels,
                'total': total_channels
            }
        
        return {
            'top_class': predictions[0]['label'],
            'probabilities': predictions,
            'feature_maps': feature_data
        }
    
    def get_features(self, data: Any, layer_id: Optional[str] = None) -> Dict[str, Any]:
        """Get feature maps for a specific layer."""
        if layer_id and layer_id in self.feature_maps:
            return {
                'layer_id': layer_id,
                'feature_maps': self.feature_maps[layer_id]
            }
        return {'feature_maps': self.feature_maps}
    
    def generate_adversarial(self, data: Any, epsilon: float = 0.01) -> Dict[str, Any]:
        """Generate adversarial example (placeholder)."""
        return {
            'message': 'Adversarial generation not yet implemented'
        }
    
    def get_gradcam(self, data: Any) -> Dict[str, Any]:
        """
        Generate Grad-CAM visualization for a specific layer.
        
        Args:
            data: Dict with 'image' (base64), 'layer_index' (int), and optional 'class_idx' (int)
        
        Returns:
            Dict with 'heatmap' (base64), 'class_idx', 'layer_name', 'available_layers'
        """
        try:
            # Get parameters
            layer_index = data.get('layer_index', 0)
            if isinstance(layer_index, str):
                layer_index = int(layer_index)
            class_idx = data.get('class_idx', None)
            if class_idx is not None and isinstance(class_idx, str):
                class_idx = int(class_idx)
            
            # Decode image
            if isinstance(data, dict) and 'image' in data:
                image_data = data['image']
                if ',' in image_data:
                    image_data = image_data.split(',')[1]
                try:
                    image_bytes = base64.b64decode(image_data)
                    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
                except Exception as e:
                    raise ValueError(f"Failed to decode image: {str(e)}")
            else:
                raise ValueError("Invalid input data format: 'image' field is required")
            
            # Get available conv layer indices
            if self.architecture == 'vgg16':
                conv_indices = [0, 2, 5, 7, 10, 12, 14, 17, 19, 21, 24, 26, 28]
                if layer_index < 0 or layer_index >= len(conv_indices):
                    raise ValueError(f"Layer index {layer_index} out of range. Available: 0-{len(conv_indices)-1}")
                target_layer_index = conv_indices[layer_index]
                target_layer = self.model.features[target_layer_index]
                layer_name = f'conv_{layer_index + 1}'
                available_layers = [f'conv_{i+1}' for i in range(len(conv_indices))]
            elif self.architecture == 'resnet50':
                # For ResNet, use layer blocks
                layer_blocks = [self.model.layer1, self.model.layer2, self.model.layer3, self.model.layer4]
                if layer_index < 0 or layer_index >= len(layer_blocks):
                    raise ValueError(f"Layer index {layer_index} out of range. Available: 0-{len(layer_blocks)-1}")
                target_layer = layer_blocks[layer_index]
                layer_name = f'layer{layer_index + 1}'
                available_layers = [f'layer{i+1}' for i in range(len(layer_blocks))]
            else:
                raise ValueError(f"Grad-CAM not supported for architecture: {self.architecture}")
            
            # Storage for activations and gradients
            activations = {}
            gradients = {}
            
            def forward_hook(module, inp, out):
                # Store activation and register backward hook on it
                activations['value'] = out
                # Register hook on the output tensor to capture gradients
                out.register_hook(lambda grad: gradients.update({'value': grad}))
            
            # Register forward hook (backward hook is registered on the tensor in forward_hook)
            h1 = target_layer.register_forward_hook(forward_hook)
            h2 = None  # No separate backward hook needed
            
            try:
                # Ensure model is in eval mode but allows gradients
                self.model.eval()
                for param in self.model.parameters():
                    param.requires_grad = False  # Don't update model weights
                
                # Preprocess image
                x = self.transform(img).unsqueeze(0).to(self.device)
                x.requires_grad_(True)
                
                # Forward pass
                output = self.model(x)
                
                # Determine target class
                if class_idx is None:
                    score, idx = output.max(1)
                    class_idx = int(idx.item())
                else:
                    score = output[0, class_idx]
                
                # Get activations
                if 'value' not in activations:
                    raise ValueError("Forward hook did not capture activations")
                
                A = activations['value']  # [1, C, H, W]
                
                # Backward pass
                self.model.zero_grad()
                score.backward(retain_graph=False)
                
                # Check if gradients were captured
                if 'value' not in gradients:
                    raise ValueError(f"Gradient hook failed. Input grad exists: {x.grad is not None}, Activations shape: {A.shape}")
                
                G = gradients['value']    # [1, C, H, W]
                
                # Ensure G has the same shape as A (handle potential dimension mismatches)
                if G.shape != A.shape:
                    print(f"Warning: Gradient shape {G.shape} != Activation shape {A.shape}, attempting to match...")
                    if len(G.shape) == len(A.shape):
                        # Try to match by interpolation if dimensions are close
                        if G.shape[2:] != A.shape[2:]:
                            G = F.interpolate(G, size=A.shape[2:], mode='bilinear', align_corners=False)
                    else:
                        raise ValueError(f"Cannot match gradient shape {G.shape} to activation shape {A.shape}")
                
                # Compute Grad-CAM
                # Global average pooling of gradients
                alpha = G.mean(dim=(2, 3), keepdim=True)  # [1, C, 1, 1]
                
                # Weighted combination
                cam = (alpha * A).sum(dim=1, keepdim=True)  # [1, 1, H, W]
                cam = F.relu(cam)  # Apply ReLU
                
                # Resize to input size (224x224)
                cam = F.interpolate(cam, size=(224, 224), mode='bilinear', align_corners=False)
                cam = cam.squeeze().detach().cpu().numpy()
                
                # Normalize to [0, 1]
                cam_min = cam.min()
                cam_max = cam.max()
                if cam_max - cam_min < 1e-8:
                    # If all values are the same, create a uniform heatmap
                    cam = np.ones_like(cam) * 0.5
                else:
                    cam = (cam - cam_min) / (cam_max - cam_min)
                
                # Convert to base64 heatmap image (colormap: jet-like)
                # Simple jet-like colormap: blue -> cyan -> green -> yellow -> red
                def apply_jet_colormap(data):
                    """Apply jet-like colormap without matplotlib."""
                    data = np.clip(data, 0, 1)
                    h, w = data.shape
                    rgb = np.zeros((h, w, 3), dtype=np.uint8)
                    
                    # Blue to cyan (0 -> 0.25)
                    mask1 = data < 0.25
                    rgb[mask1, 0] = 0
                    rgb[mask1, 1] = (data[mask1] * 4 * 255).astype(np.uint8)
                    rgb[mask1, 2] = 255
                    
                    # Cyan to green (0.25 -> 0.5)
                    mask2 = (data >= 0.25) & (data < 0.5)
                    rgb[mask2, 0] = 0
                    rgb[mask2, 1] = 255
                    rgb[mask2, 2] = ((1 - (data[mask2] - 0.25) * 4) * 255).astype(np.uint8)
                    
                    # Green to yellow (0.5 -> 0.75)
                    mask3 = (data >= 0.5) & (data < 0.75)
                    rgb[mask3, 0] = ((data[mask3] - 0.5) * 4 * 255).astype(np.uint8)
                    rgb[mask3, 1] = 255
                    rgb[mask3, 2] = 0
                    
                    # Yellow to red (0.75 -> 1.0)
                    mask4 = data >= 0.75
                    rgb[mask4, 0] = 255
                    rgb[mask4, 1] = ((1 - (data[mask4] - 0.75) * 4) * 255).astype(np.uint8)
                    rgb[mask4, 2] = 0
                    
                    return rgb
                
                cam_colored = apply_jet_colormap(cam)
                
                # Convert to PIL Image
                heatmap_img = Image.fromarray(cam_colored, 'RGB')
                
                # Encode to base64
                buffer = io.BytesIO()
                heatmap_img.save(buffer, format='PNG')
                heatmap_str = base64.b64encode(buffer.getvalue()).decode()
                
                return {
                    'heatmap': f"data:image/png;base64,{heatmap_str}",
                    'class_idx': class_idx,
                    'class_label': self.class_labels[class_idx],
                    'layer_name': layer_name,
                    'layer_index': layer_index,
                    'available_layers': available_layers,
                    'heatmap_data': cam.tolist()  # Raw heatmap data for 3D visualization
                }
            
            finally:
                # Remove hooks
                if h1 is not None:
                    h1.remove()
                # Note: Tensor hooks are automatically removed when the tensor is garbage collected
        
        except Exception as e:
            import traceback
            error_msg = f"Grad-CAM error: {str(e)}\n{traceback.format_exc()}"
            print(error_msg)  # Log to console
            raise ValueError(error_msg)
