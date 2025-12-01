import torch
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
        """Generate Grad-CAM visualization (placeholder)."""
        return {
            'message': 'Grad-CAM not yet implemented'
        }
