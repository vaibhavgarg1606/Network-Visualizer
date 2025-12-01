from django.urls import path
from .views import UnifiedModelView

urlpatterns = [
    path('models/<str:model_name>/<str:action>/', UnifiedModelView.as_view(), name='unified_model_view'),
]
