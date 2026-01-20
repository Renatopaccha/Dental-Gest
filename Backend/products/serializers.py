"""
Serializadores para la API REST de productos.

Convierte los modelos Django a formato JSON para el frontend de Next.js.
Incluye campos calculados y galería de imágenes.
"""
from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """Serializador para categorías."""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializador para imágenes adicionales de la galería."""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'order']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializador completo para productos.
    
    Incluye:
    - Información de categoría
    - Precios con descuento
    - Imagen principal + galería de imágenes adicionales
    """
    # Campos de relación
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    # Campos calculados
    current_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    
    # Imagen principal
    image_url = serializers.SerializerMethodField()
    
    # Galería de imágenes adicionales
    images = ProductImageSerializer(many=True, read_only=True)
    
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
            'images',  # Galería de imágenes adicionales
            'created_at',
            'updated_at',
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None


class ProductListSerializer(serializers.ModelSerializer):
    """Serializador simplificado para listados de productos."""
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
    image_count = serializers.SerializerMethodField()
    
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
            'image_count',
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None
    
    def get_image_count(self, obj):
        """Devuelve el número de imágenes adicionales."""
        return obj.images.count()
