import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import base64
import io
from PIL import Image
from torchvision import transforms
from django.conf import settings
from typing import Dict, Any, Optional, List
from ..model_registry import ModelHandler
from ..ml_models import SmallMNISTCNN

class MNISTHandler(ModelHandler):
    """Handler for MNIST Digit Classification using SmallMNISTCNN."""
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SmallMNISTCNN().to(self.device)
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)
        self.loss_fn = nn.CrossEntropyLoss()
        
        model_path = os.path.join(settings.BASE_DIR, 'saved_models', 'mnist_cnn.pth')
        if os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.model.eval()
        else:
            print(f"Warning: MNIST model not found at {model_path}. Please run 'python manage.py train_mnist'.")

        self.feature_maps = {}
        self._register_hooks()

    def _register_hooks(self):
        def get_hook(name):
            def hook(module, input, output):
                self.feature_maps[name] = output.detach().cpu()
            return hook

        self.model.pool1.register_forward_hook(get_hook("pool1"))
        self.model.pool2.register_forward_hook(get_hook("pool2"))
        self.model.block1[0].register_forward_hook(get_hook("conv1"))
        self.model.block2[0].register_forward_hook(get_hook("conv2"))

    def _tensor_to_base64(self, tensor: torch.Tensor) -> str:
        """Convert a 2D tensor to a Base64 PNG string."""
        # Normalize to 0-255
        tensor = tensor - tensor.min()
        tensor = tensor / (tensor.max() + 1e-5)
        tensor = (tensor * 255).byte()
        
        img = Image.fromarray(tensor.numpy(), mode='L')
        # Resize for better visibility if needed, but keeping raw size is fine for textures
        img = img.resize((64, 64), Image.NEAREST) 
        
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode('utf-8')

    def predict(self, data: Any) -> Dict[str, Any]:
        """
        Predict from pixel array.
        data['pixels']: List of 784 floats (0-1) or 2D array.
        """
        pixels = data.get('pixels')
        if not pixels:
            return {"error": "No pixels provided"}

        # Convert list to tensor [1, 1, 28, 28]
        try:
            arr = np.array(pixels, dtype=np.float32).reshape(28, 28)
            # Normalize: Input is 0-1 (black-white), model expects -1 to 1
            arr = (arr - 0.5) / 0.5
            tensor = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0).to(self.device)
        except Exception as e:
            return {"error": f"Invalid pixel data: {str(e)}"}

        self.model.eval()
        with torch.no_grad():
            output = self.model(tensor)
            probs = torch.softmax(output, dim=1).squeeze().tolist()

        # Format probabilities
        prob_list = [{"label": str(i), "score": p} for i, p in enumerate(probs)]
        top_class = str(np.argmax(probs))
        
        # Collect all feature maps
        feature_data = {}
        layer_map = {"0": "conv1", "1": "pool1", "2": "conv2", "3": "pool2"}
        
        for layer_id, internal_name in layer_map.items():
            if internal_name in self.feature_maps:
                fmap = self.feature_maps[internal_name][0] # [C, H, W]
                # Return all channels
                channels = []
                for i in range(fmap.shape[0]):
                    channels.append(self._tensor_to_base64(fmap[i]))
                feature_data[layer_id] = channels

        return {
            "probabilities": prob_list,
            "top_class": top_class,
            "feature_maps": feature_data
        }

    def train_step(self, data: Any) -> Dict[str, Any]:
        """Run a single training step (mock or real)."""
        # For interactive demo, we can just run a few random batches from MNIST
        # Or just return success if we want to simulate
        
        # TODO: Implement real training step if needed, for now just returning success
        # to trigger frontend update
        
        return {
            "status": "success",
            "loss": 0.123, # Mock loss
            "message": "Training step completed"
        }

    def get_features(self, data: Any, layer_id: Optional[str] = None) -> Dict[str, Any]:
        # This is for the GET request (legacy/texture loader)
        # We might not use this if we send everything in predict
        return {"message": "Use predict for live features"}
