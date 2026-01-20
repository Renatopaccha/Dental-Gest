"""
Vistas de la API REST para productos.

Proporciona endpoints de solo lectura para el catálogo público.
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para listar categorías.
    
    Endpoints:
        GET /api/categories/        - Lista todas las categorías
        GET /api/categories/{id}/   - Detalle de una categoría
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'  # Permite buscar por slug en lugar de ID


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para listar productos.
    
    Endpoints:
        GET /api/products/          - Lista todos los productos
        GET /api/products/{id}/     - Detalle de un producto
    
    Filtros disponibles:
        - ?category={id}            - Filtrar por categoría
        - ?in_stock=true            - Solo productos en stock
        - ?search={texto}           - Buscar en nombre y descripción
        - ?ordering=price           - Ordenar por precio (use -price para descendente)
    """
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    # Configuración de filtros
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'stock_count', 'name']
    ordering = ['-created_at']  # Orden por defecto
    
    def get_queryset(self):
        """
        Filtra productos según query parameters.
        
        Ejemplos:
            /api/products/?category=1
            /api/products/?in_stock=true
        """
        queryset = super().get_queryset()
        
        # Filtrar por categoría
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filtrar por stock
        in_stock = self.request.query_params.get('in_stock')
        if in_stock is not None:
            if in_stock.lower() == 'true':
                queryset = queryset.filter(in_stock=True)
            elif in_stock.lower() == 'false':
                queryset = queryset.filter(in_stock=False)
        
        return queryset
