"""
Serializadores para la API REST de productos.
CORREGIDO: Ahora el campo 'image' devuelve la URL completa directamente.
"""
from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.count()

class ProductImageSerializer(serializers.ModelSerializer):
    """Serializador para galería."""
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order']
    
    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializador de DETALLE (Un solo producto).
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    # Precios
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    
    # IMÁGENES: Sobrescribimos 'image' para que sea la URL completa
    image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'current_price', 'has_discount', 'discount_percentage',
            'category', 'category_name', 'category_slug',
            'stock_count', 'in_stock', 'stock_status',
            'image',    # <--- Ahora esto tendrá la URL completa
            'images',
            'created_at', 'updated_at',
        ]
    
    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class ProductListSerializer(serializers.ModelSerializer):
    """
    Serializador de LISTADO (Catálogo).
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    
    # CORRECCIÓN PRINCIPAL AQUÍ:
    # Cambiamos 'image_url' por 'image' para coincidir con el Frontend
    image = serializers.SerializerMethodField()
    image_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'discount_price', 
            'current_price', 'has_discount', 'discount_percentage',
            'category_name', 'stock_count', 'in_stock', 'stock_status',
            'image',       # <--- El frontend busca esto
            'image_count',
        ]
    
    def get_image(self, obj):
        if obj.image:
            # Construye la URL absoluta manualmente para asegurar que funcione
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None
    
    def get_image_count(self, obj):
        return obj.images.count()
