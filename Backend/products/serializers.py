"""
Serializadores para la API REST de productos.

Convierte los modelos Django a formato JSON para el frontend de Next.js.
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
    - Estado de stock textual
    - URL completa de la imagen
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    stock_status = serializers.CharField(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
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
        
        Esto es necesario para que el frontend Next.js pueda cargar las imágenes.
        """
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
