from django.apps import AppConfig

class VisxaiApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'visxai_api'

    def ready(self):
        from .model_registry import ModelRegistry
        from .handlers.cnn_handler import CNNHandler
        from .handlers.mnist_handler import MNISTHandler
        from .handlers.placeholder_handler import PlaceholderHandler
        from .handlers.vgg_resnet_handler import VGGResNetHandler

        # Register Models
        ModelRegistry.register("voxelstack", CNNHandler("vgg16"))
        ModelRegistry.register("mnist", MNISTHandler())
        ModelRegistry.register("vgg16", VGGResNetHandler("vgg16"))
        ModelRegistry.register("resnet50", VGGResNetHandler("resnet50"))
        
        # Register Placeholders
        placeholders = [
            "patchflow", "latentmorph", "attentiocore", "chronocoil",
            "transflow", "hypersector", "fractallogic", "simplefit",
            "graphweaver", "gridwalker"
        ]
        for name in placeholders:
            ModelRegistry.register(name, PlaceholderHandler(name))
