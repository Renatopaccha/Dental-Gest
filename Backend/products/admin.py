"""
Configuración del panel de administración para productos odontológicos.

Panel personalizado para usuarios no técnicos con:
- Vista de lista con thumbnails
- Filtros por categoría y stock
- Búsqueda por nombre
- Formularios organizados
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin para gestionar categorías de productos.
    """
    list_display = ['name', 'slug', 'product_count', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']
    
    def product_count(self, obj):
        """Muestra la cantidad de productos en la categoría."""
        count = obj.products.count()
        return count
    product_count.short_description = "Productos"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin personalizado para gestión de productos.
    
    Diseñado para ser usado por el dueño del negocio sin conocimientos técnicos.
    Incluye vista de thumbnails, filtros útiles y búsqueda.
    """
    
    # =========================================================================
    # CONFIGURACIÓN DE LISTA
    # =========================================================================
    
    list_display = [
        'thumbnail_preview',
        'name',
        'category',
        'price_display',
        'discount_display',
        'stock_count',
        'stock_status_icon',
        'created_at',
    ]
    list_display_links = ['thumbnail_preview', 'name']
    list_filter = ['category', 'in_stock', 'created_at']
    search_fields = ['name', 'description']
    list_per_page = 20
    
    # =========================================================================
    # CONFIGURACIÓN DE FORMULARIO
    # =========================================================================
    
    fieldsets = (
        ('📦 Información del Producto', {
            'fields': ('name', 'description', 'category')
        }),
        ('💰 Precio y Stock', {
            'fields': ('price', 'discount_price', 'stock_count'),
            'description': 'Si estableces un precio de oferta, se mostrará como descuento en la tienda.'
        }),
        ('🖼️ Imagen', {
            'fields': ('image', 'image_preview'),
            'description': 'Sube una foto del producto (JPG o PNG). Tamaño recomendado: 800x800px.'
        }),
        ('📊 Información del Sistema', {
            'classes': ('collapse',),
            'fields': ('in_stock', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['in_stock', 'created_at', 'updated_at', 'image_preview']
    
    # =========================================================================
    # MÉTODOS PERSONALIZADOS PARA LA LISTA
    # =========================================================================
    
    def thumbnail_preview(self, obj):
        """
        Muestra una miniatura de la imagen del producto en la lista.
        """
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" '
                'style="object-fit: cover; border-radius: 8px; border: 1px solid #ddd;" />',
                obj.image.url
            )
        return format_html(
            '<div style="width: 50px; height: 50px; background: #f0f0f0; '
            'border-radius: 8px; display: flex; align-items: center; '
            'justify-content: center; color: #999; font-size: 10px;">Sin imagen</div>'
        )
    thumbnail_preview.short_description = "Foto"
    
    def price_display(self, obj):
        """Muestra el precio en formato de moneda."""
        return format_html('<strong>${}</strong>', obj.price)
    price_display.short_description = "Precio"
    price_display.admin_order_field = 'price'
    
    def discount_display(self, obj):
        """Muestra el precio de oferta y porcentaje de descuento."""
        if obj.discount_price:
            return format_html(
                '<span style="color: #28a745; font-weight: bold;">'
                '${} <small style="background: #dc3545; color: white; '
                'padding: 2px 6px; border-radius: 4px;">-{}%</small></span>',
                obj.discount_price, obj.discount_percentage
            )
        return format_html('<span style="color: #999;">—</span>')
    discount_display.short_description = "Oferta"
    
    def stock_status_icon(self, obj):
        """
        Muestra un indicador visual del estado de stock.
        
        - 🟢 Verde: En Stock (5+ unidades)
        - 🟡 Amarillo: Poco Stock (1-4 unidades)
        - 🔴 Rojo: Agotado (0 unidades)
        """
        if obj.stock_count == 0:
            color = "#dc3545"  # Rojo
            text = "Agotado"
            icon = "❌"
        elif obj.stock_count < 5:
            color = "#ffc107"  # Amarillo
            text = "Poco Stock"
            icon = "⚠️"
        else:
            color = "#28a745"  # Verde
            text = "En Stock"
            icon = "✅"
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} {}</span>',
            color, icon, text
        )
    stock_status_icon.short_description = "Estado"
    stock_status_icon.admin_order_field = 'stock_count'
    
    def image_preview(self, obj):
        """
        Muestra una vista previa grande de la imagen en el formulario de edición.
        """
        if obj.image:
            return format_html(
                '<img src="{}" width="300" style="border-radius: 8px; '
                'box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.image.url
            )
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


# =============================================================================
# PERSONALIZACIÓN DEL ADMIN SITE
# =============================================================================

admin.site.site_header = "🦷 Dental GEST_EC - Administración"
admin.site.site_title = "Dental GEST_EC"
admin.site.index_title = "Panel de Control"
