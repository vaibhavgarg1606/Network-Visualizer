from typing import Dict, Any, Optional
from ..model_registry import ModelHandler

class PlaceholderHandler(ModelHandler):
    """Generic placeholder for unimplemented models."""
    
    def __init__(self, name: str):
        self.name = name

    def predict(self, data: Any) -> Dict[str, Any]:
        return {"message": f"Prediction for {self.name} not implemented yet."}

    def get_features(self, data: Any, layer_id: Optional[str] = None) -> Dict[str, Any]:
        return {"message": f"Features for {self.name} not implemented yet."}
