"""
Vistas de la API REST para productos.

Proporciona endpoints de solo lectura para el catálogo público.
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Category, Product, Brand
from .serializers import CategorySerializer, ProductSerializer, BrandSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para listar categorías.
    
    Endpoints:
        GET /api/categories/        - Lista todas las categorías
        GET /api/categories/{slug}/ - Detalle de una categoría
    
    Filtros disponibles:
        - ?audience=STUDENT         - Solo categorías para estudiantes + generales
        - ?audience=PROFESSIONAL    - Solo categorías para profesionales + generales
    """
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Category.objects.all()
        
        # Filtrar por audiencia
        audience = self.request.query_params.get('audience')
        if audience:
            audience = audience.upper()
            if audience in ['STUDENT', 'PROFESSIONAL']:
                queryset = queryset.filter(target_audience__in=[audience, 'GENERAL'])
            elif audience == 'GENERAL':
                queryset = queryset.filter(target_audience='GENERAL')
        
        return queryset


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para listar marcas.
    
    Endpoints:
        GET /api/brands/        - Lista todas las marcas
        GET /api/brands/{slug}/ - Detalle de una marca
    
    Filtros disponibles:
        - ?audience=STUDENT         - Solo marcas para estudiantes + generales
        - ?audience=PROFESSIONAL    - Solo marcas para profesionales + generales
    """
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Brand.objects.all()
        
        # Filtrar por audiencia
        audience = self.request.query_params.get('audience')
        if audience:
            audience = audience.upper()
            if audience in ['STUDENT', 'PROFESSIONAL']:
                queryset = queryset.filter(target_audience__in=[audience, 'GENERAL'])
            elif audience == 'GENERAL':
                queryset = queryset.filter(target_audience='GENERAL')
        
        return queryset


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para listar productos.
    
    Endpoints:
        GET /api/products/          - Lista todos los productos
        GET /api/products/{id}/     - Detalle de un producto
    
    Filtros disponibles:
        - ?category={slug o id}     - Filtrar por categoría
        - ?brand={slug o id}        - Filtrar por marca
        - ?min_price={número}       - Precio mínimo
        - ?max_price={número}       - Precio máximo
        - ?in_stock=true            - Solo productos en stock
        - ?search={texto}           - Buscar en nombre y descripción
        - ?ordering=price           - Ordenar por precio (use -price para descendente)
    
    Nota: Si no se envía ningún filtro de categoría, devuelve TODOS los productos
    (lógica "Todo el catálogo" automática).
    """
    queryset = Product.objects.select_related('category', 'brand').all()
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
        
        Filtros acumulativos - se pueden combinar:
            /api/products/?category=resinas&brand=3m&min_price=10&max_price=50
        """
        queryset = super().get_queryset()
        
        # Filtrar por categoría (slug o id)
        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(category__slug=category)
        
        # Filtrar por marca (slug o id)
        brand = self.request.query_params.get('brand')
        if brand:
            if brand.isdigit():
                queryset = queryset.filter(brand_id=brand)
            else:
                queryset = queryset.filter(brand__slug=brand)
        
        # Filtrar por rango de precio
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass
        
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass
        
        # Filtrar por stock
        in_stock = self.request.query_params.get('in_stock')
        if in_stock is not None:
            if in_stock.lower() == 'true':
                queryset = queryset.filter(in_stock=True)
            elif in_stock.lower() == 'false':
                queryset = queryset.filter(in_stock=False)
        
        # Filtrar por audiencia (STUDENT o PROFESSIONAL incluyen GENERAL)
        audience = self.request.query_params.get('audience')
        if audience:
            audience = audience.upper()
            if audience in ['STUDENT', 'PROFESSIONAL']:
                # Incluir productos específicos + productos GENERAL
                queryset = queryset.filter(target_audience__in=[audience, 'GENERAL'])
            elif audience == 'GENERAL':
                queryset = queryset.filter(target_audience='GENERAL')
        
        return queryset
