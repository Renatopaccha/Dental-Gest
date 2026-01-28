from rest_framework import serializers
from .models import Category, Product, ProductImage, Brand

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.count()


class BrandSerializer(serializers.ModelSerializer):
    """Serializador de marcas."""
    product_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'image', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.count()
    
    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order']
    
    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class ProductSerializer(serializers.ModelSerializer):
    """Serializador de DETALLE"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True, allow_null=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    
    image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'current_price', 'has_discount', 'discount_percentage',
            'category', 'category_name', 'category_slug',
            'brand', 'brand_name', 'brand_slug',
            'target_audience',
            'stock_count', 'in_stock', 'stock_status',
            'image', 'images', 'created_at', 'updated_at',
        ]
    
    def get_image(self, obj):
        # 1. Intentar imagen principal
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        # 2. Fallback: Intentar primera imagen de galería
        first_gallery = obj.images.first()
        if first_gallery and first_gallery.image:
            return f"http://127.0.0.1:8000{first_gallery.image.url}"
        return None

class ProductListSerializer(serializers.ModelSerializer):
    """Serializador de CATÁLOGO"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True, allow_null=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    
    image = serializers.SerializerMethodField()
    image_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'discount_price', 
            'current_price', 'has_discount', 'discount_percentage',
            'category_name', 'category_slug',
            'brand_name', 'brand_slug',
            'target_audience',
            'stock_count', 'in_stock', 'stock_status',
            'image', 'image_count',
        ]
    
    def get_image(self, obj):
        # LÓGICA SMART IMAGE
        # 1. Si el dueño subió foto principal, usala.
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        
        # 2. Si no, busca la primera de la galería automáticamente.
        first_gallery = obj.images.first()
        if first_gallery and first_gallery.image:
            return f"http://127.0.0.1:8000{first_gallery.image.url}"
            
        # 3. Si no hay nada, retorna None (el frontend mostrará placeholder).
        return None
    
    def get_image_count(self, obj):
        return obj.images.count()
