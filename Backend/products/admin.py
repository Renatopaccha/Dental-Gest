"""
Configuración del panel de administración para productos odontológicos.

Incluye:
- CategoryAdmin: Gestión de categorías
- ProductAdmin: Gestión de productos con thumbnails, filtros y galería inline
- ProductImageInline: Subida de múltiples imágenes
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, Brand


class ProductImageInline(admin.TabularInline):
    """
    Inline para subir múltiples imágenes de producto.
    Aparece como tabla debajo del formulario principal.
    """
    model = ProductImage
    extra = 3  # Mostrar 3 filas vacías por defecto
    fields = ['image', 'order', 'image_preview']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="80" '
                'style="object-fit: cover; border-radius: 4px;" />',
                obj.image.url
            )
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Admin para gestionar marcas de productos."""
    list_display = ['logo_preview', 'name', 'slug', 'audience_badge', 'product_count', 'created_at']
    list_display_links = ['logo_preview', 'name']
    list_filter = ['target_audience']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'logo_preview_large']
    
    fieldsets = (
        ('Información de la Marca', {
            'fields': ('name', 'slug', 'image', 'logo_preview_large')
        }),
        ('🎯 Audiencia', {
            'fields': ('target_audience',),
            'description': 'Define a quién va dirigida esta marca.'
        }),
        ('Sistema', {
            'classes': ('collapse',),
            'fields': ('created_at',)
        }),
    )
    
    def audience_badge(self, obj):
        """Muestra badge visual para la audiencia objetivo."""
        colors = {
            'STUDENT': ('#3b82f6', '🎓'),
            'PROFESSIONAL': ('#8b5cf6', '👨‍⚕️'),
            'GENERAL': ('#6b7280', '👥'),
        }
        color, icon = colors.get(obj.target_audience, ('#6b7280', '👥'))
        label = dict(obj._meta.get_field('target_audience').choices).get(obj.target_audience, 'General')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; '
            'border-radius: 12px; font-size: 11px; font-weight: 500;">{} {}</span>',
            color, icon, label
        )
    audience_badge.short_description = "Audiencia"
    
    def logo_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="40" height="40" '
                'style="object-fit: contain; border-radius: 4px; background: #f8f8f8;" />',
                obj.image.url
            )
        return format_html(
            '<div style="width: 40px; height: 40px; background: #f0f0f0; '
            'border-radius: 4px; display: flex; align-items: center; '
            'justify-content: center; color: #999; font-size: 10px;">—</div>'
        )
    logo_preview.short_description = "Logo"
    
    def logo_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="150" style="border-radius: 8px; '
                'background: #f8f8f8; padding: 10px;" />',
                obj.image.url
            )
        return "Sin logo"
    logo_preview_large.short_description = "Vista previa"
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = "Productos"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin para gestionar categorías de productos."""
    list_display = ['name', 'slug', 'audience_badge', 'product_count', 'created_at']
    list_filter = ['target_audience']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Información de la Categoría', {
            'fields': ('name', 'slug', 'description')
        }),
        ('🎯 Audiencia', {
            'fields': ('target_audience',),
            'description': 'Define a quién va dirigida esta categoría.'
        }),
        ('Sistema', {
            'classes': ('collapse',),
            'fields': ('created_at',)
        }),
    )
    
    def audience_badge(self, obj):
        """Muestra badge visual para la audiencia objetivo."""
        colors = {
            'STUDENT': ('#3b82f6', '🎓'),
            'PROFESSIONAL': ('#8b5cf6', '👨‍⚕️'),
            'GENERAL': ('#6b7280', '👥'),
        }
        color, icon = colors.get(obj.target_audience, ('#6b7280', '👥'))
        label = dict(obj._meta.get_field('target_audience').choices).get(obj.target_audience, 'General')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; '
            'border-radius: 12px; font-size: 11px; font-weight: 500;">{} {}</span>',
            color, icon, label
        )
    audience_badge.short_description = "Audiencia"
    
    def product_count(self, obj):
        count = obj.products.count()
        return count
    product_count.short_description = "Productos"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin personalizado para gestión de productos.
    Incluye galería de imágenes mediante inline.
    """
    
    # Inline para galería de imágenes
    inlines = [ProductImageInline]
    
    # Configuración de lista
    list_display = [
        'thumbnail_preview',
        'name',
        'category',
        'brand',
        'audience_badge',
        'price_display',
        'discount_display',
        'stock_count',
        'stock_status_icon',
        'image_count',
        'created_at',
    ]
    list_display_links = ['thumbnail_preview', 'name']
    list_filter = ['target_audience', 'category', 'brand', 'in_stock', 'created_at']
    search_fields = ['name', 'description']
    list_per_page = 20
    
    # Configuración de formulario
    fieldsets = (
        ('📦 Información del Producto', {
            'fields': ('name', 'description', 'category', 'brand')
        }),
        ('🎯 Audiencia', {
            'fields': ('target_audience',),
            'description': 'Define a quién va dirigido este producto. Los productos GENERAL aparecen en ambas secciones.'
        }),
        ('💰 Precio y Stock', {
            'fields': ('price', 'discount_price', 'stock_count'),
            'description': 'Si estableces un precio de oferta, se mostrará como descuento en la tienda.'
        }),
        ('🖼️ Imagen Principal', {
            'fields': ('image', 'image_preview'),
            'description': 'Esta es la imagen principal. Usa la sección "Imágenes de producto" abajo para añadir fotos adicionales.'
        }),
        ('📊 Información del Sistema', {
            'classes': ('collapse',),
            'fields': ('in_stock', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['in_stock', 'created_at', 'updated_at', 'image_preview']
    
    def thumbnail_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" '
                'style="object-fit: cover; border-radius: 8px; border: 1px solid #ddd;" />',
                obj.image.url
            )
        return format_html(
            '<div style="width: 50px; height: 50px; background: #f0f0f0; '
            'border-radius: 8px; display: flex; align-items: center; '
            'justify-content: center; color: #999; font-size: 10px;">Sin foto</div>'
        )
    thumbnail_preview.short_description = "Foto"
    
    def price_display(self, obj):
        return format_html('<strong>${}</strong>', obj.price)
    price_display.short_description = "Precio"
    price_display.admin_order_field = 'price'
    
    def discount_display(self, obj):
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
        if obj.stock_count == 0:
            color = "#dc3545"
            text = "Agotado"
            icon = "❌"
        elif obj.stock_count < 5:
            color = "#ffc107"
            text = "Poco Stock"
            icon = "⚠️"
        else:
            color = "#28a745"
            text = "En Stock"
            icon = "✅"
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} {}</span>',
            color, icon, text
        )
    stock_status_icon.short_description = "Estado"
    stock_status_icon.admin_order_field = 'stock_count'
    
    def image_count(self, obj):
        """Muestra el número de imágenes adicionales."""
        count = obj.images.count()
        if count > 0:
            return format_html(
                '<span style="background: #17a2b8; color: white; '
                'padding: 2px 8px; border-radius: 10px;">+{}</span>',
                count
            )
        return format_html('<span style="color: #999;">0</span>')
    image_count.short_description = "Fotos extra"
    
    def audience_badge(self, obj):
        """Muestra badge visual para la audiencia objetivo."""
        colors = {
            'STUDENT': ('#3b82f6', '🎓'),      # Azul - Estudiantes
            'PROFESSIONAL': ('#8b5cf6', '👨‍⚕️'),  # Violeta - Profesionales
            'GENERAL': ('#6b7280', '👥'),       # Gris - Todos
        }
        color, icon = colors.get(obj.target_audience, ('#6b7280', '👥'))
        label = dict(obj._meta.get_field('target_audience').choices).get(obj.target_audience, 'General')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; '
            'border-radius: 12px; font-size: 11px; font-weight: 500;">{} {}</span>',
            color, icon, label
        )
    audience_badge.short_description = "Audiencia"
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="300" style="border-radius: 8px; '
                'box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.image.url
            )
        return "Sin imagen"
    image_preview.short_description = "Vista previa"


# Personalización del Admin Site
admin.site.site_header = "🦷 Dental GEST_EC - Administración"
admin.site.site_title = "Dental GEST_EC"
admin.site.index_title = "Panel de Control"
