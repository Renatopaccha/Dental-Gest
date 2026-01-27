"""
URLs para la aplicación de productos.

Configura las rutas de la API REST usando Django REST Framework Router.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, BrandViewSet

# Crear router y registrar viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'products', ProductViewSet, basename='product')

# Las URLs se incluyen automáticamente del router
urlpatterns = [
    path('', include(router.urls)),
]
