"""
Serializadores para la API REST de productos.

Convierte los modelos Django a formato JSON para el frontend de Next.js.
Incluye campos calculados como current_price y discount_percentage.
"""
from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializador para categorías.
    
    Incluye conteo de productos en cada categoría.
    """
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count']
    
    def get_product_count(self, obj):
        """Devuelve la cantidad de productos en la categoría."""
        return obj.products.count()


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializador para productos.
    
    Incluye información adicional calculada:
    - Nombre de la categoría
    - Precio actual (con descuento si aplica)
    - Porcentaje de descuento
    - Estado de stock textual
    - URL completa de la imagen
    """
    # Campos de relación
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    # Campos calculados (properties del modelo)
    current_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    
    # URL de imagen
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'discount_price',
            'current_price',
            'has_discount',
            'discount_percentage',
            'category',
            'category_name',
            'category_slug',
            'stock_count',
            'in_stock',
            'stock_status',
            'image',
            'image_url',
            'created_at',
            'updated_at',
        ]
    
    def get_image_url(self, obj):
        """
        Devuelve la URL absoluta de la imagen del producto.
        
        Esto es necesario para que el frontend Next.js pueda cargar las imágenes
        desde el servidor Django.
        """
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback sin request context
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None


class ProductListSerializer(serializers.ModelSerializer):
    """
    Serializador simplificado para listados de productos.
    
    Incluye solo los campos necesarios para las tarjetas de producto,
    optimizando el tamaño de la respuesta.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'discount_price',
            'current_price',
            'has_discount',
            'discount_percentage',
            'category_name',
            'stock_count',
            'in_stock',
            'stock_status',
            'image_url',
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None
