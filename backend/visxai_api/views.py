from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .model_registry import ModelRegistry

class UnifiedModelView(APIView):
    """
    Unified endpoint for all model interactions.
    Route: /api/models/<model_name>/<action>/
    """

    def post(self, request, model_name, action):
        handler = ModelRegistry.get_handler(model_name)
        if not handler:
            return Response({"error": f"Model '{model_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        # In a real app, we would handle image uploads here (request.FILES)

        try:
            if action == 'predict':
                result = handler.predict(data)
            elif action == 'features':
                layer_id = request.query_params.get('layer_id')
                result = handler.get_features(data, layer_id)
            elif action == 'adversarial':
                epsilon = float(request.data.get('epsilon', 0.01))
                result = handler.generate_adversarial(data, epsilon)
            elif action == 'gradcam':
                result = handler.get_gradcam(data)
            elif action == 'train':
                if hasattr(handler, 'train_step'):
                    result = handler.train_step(data)
                else:
                    return Response({"error": "Training not supported for this model."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": f"Action '{action}' not supported."}, status=status.HTTP_400_BAD_REQUEST)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Error in {action} for {model_name}: {str(e)}")
            print(error_trace)
            return Response({
                "error": str(e),
                "traceback": error_trace if settings.DEBUG else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, model_name, action):
        """Handle GET requests for features/metadata."""
        handler = ModelRegistry.get_handler(model_name)
        if not handler:
            return Response({"error": f"Model '{model_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if action == 'features':
            layer_id = request.query_params.get('layer_id')
            result = handler.get_features({}, layer_id) # Empty data for mock
            return Response(result, status=status.HTTP_200_OK)
            
        return Response({"error": "GET not supported for this action."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
