"""
Modelos de datos para el catálogo de productos odontológicos.

Incluye:
- Category: Categorías de productos
- Product: Productos con lógica de stock y precios de oferta
- ProductImage: Imágenes adicionales para galería
"""
from decimal import Decimal
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify


class Category(models.Model):
    """Categoría de productos odontológicos."""
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nombre",
        help_text="Nombre de la categoría (ej: Instrumentos, Kits)"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        blank=True,
        verbose_name="Slug",
        help_text="Identificador URL-friendly (se genera automáticamente)"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Descripción",
        help_text="Descripción opcional de la categoría"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Producto del catálogo de suministros odontológicos."""
    name = models.CharField(
        max_length=200,
        verbose_name="Nombre del producto",
        help_text="Nombre descriptivo del producto"
    )
    description = models.TextField(
        verbose_name="Descripción",
        help_text="Descripción detallada del producto"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Precio regular ($)",
        help_text="Precio normal en dólares"
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Precio de oferta ($)",
        help_text="Precio con descuento (dejar vacío si no hay oferta)"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name="Categoría",
        help_text="Categoría a la que pertenece el producto"
    )
    stock_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Cantidad en stock",
        help_text="Número de unidades disponibles"
    )
    in_stock = models.BooleanField(
        default=False,
        editable=False,
        verbose_name="En stock",
        help_text="Indica si hay unidades disponibles (se calcula automáticamente)"
    )
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name="Imagen principal",
        help_text="Foto principal del producto (formatos: JPG, PNG)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Última actualización"
    )

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def clean(self):
        if self.discount_price is not None and self.discount_price >= self.price:
            raise ValidationError({
                'discount_price': 'El precio de oferta debe ser menor que el precio regular.'
            })

    def save(self, *args, **kwargs):
        self.in_stock = self.stock_count > 0
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def current_price(self) -> Decimal:
        if self.discount_price is not None:
            return self.discount_price
        return self.price

    @property
    def has_discount(self) -> bool:
        return self.discount_price is not None

    @property
    def discount_percentage(self) -> int:
        if self.discount_price is not None and self.price > 0:
            discount = ((self.price - self.discount_price) / self.price) * 100
            return int(discount)
        return 0

    @property
    def stock_status(self) -> str:
        if self.stock_count == 0:
            return "Agotado"
        elif self.stock_count < 5:
            return "Poco Stock"
        return "En Stock"


class ProductImage(models.Model):
    """
    Imágenes adicionales para la galería del producto.
    
    Permite subir múltiples fotos de diferentes ángulos desde el admin.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Producto"
    )
    image = models.ImageField(
        upload_to='products/gallery/',
        verbose_name="Imagen",
        help_text="Imagen adicional del producto (ángulo extra)"
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Orden",
        help_text="Orden de aparición en la galería"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de subida"
    )

    class Meta:
        verbose_name = "Imagen de producto"
        verbose_name_plural = "Imágenes de producto"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"Imagen de {self.product.name}"
