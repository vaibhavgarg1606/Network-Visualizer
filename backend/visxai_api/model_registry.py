from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class ModelHandler(ABC):
    """Base class for all model handlers."""
    
    @abstractmethod
    def predict(self, data: Any) -> Dict[str, Any]:
        """Run prediction on the input data."""
        pass

    @abstractmethod
    def get_features(self, data: Any, layer_id: Optional[str] = None) -> Dict[str, Any]:
        """Retrieve feature maps or internal representations."""
        pass

    def generate_adversarial(self, data: Any, epsilon: float = 0.01) -> Dict[str, Any]:
        """Generate an adversarial example (optional)."""
        return {"error": "Adversarial generation not supported for this model."}

    def get_gradcam(self, data: Any) -> Dict[str, Any]:
        """Generate Grad-CAM heatmap (optional)."""
        return {"error": "Grad-CAM not supported for this model."}


class ModelRegistry:
    """Singleton registry to manage model handlers."""
    _instance = None
    _handlers: Dict[str, ModelHandler] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
        return cls._instance

    @classmethod
    def register(cls, name: str, handler: ModelHandler):
        """Register a model handler."""
        cls._handlers[name.lower()] = handler

    @classmethod
    def get_handler(cls, name: str) -> Optional[ModelHandler]:
        """Retrieve a model handler by name."""
        return cls._handlers.get(name.lower())

    @classmethod
    def list_models(cls) -> List[str]:
        """List all registered models."""
        return list(cls._handlers.keys())
