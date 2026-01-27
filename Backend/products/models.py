"""
Modelos de datos para el catálogo de productos odontológicos.

Incluye:
- Category: Categorías de productos
- Product: Productos con lógica de stock y precios de oferta
- ProductImage: Imágenes adicionales para galería
"""
import os
from uuid import uuid4
from decimal import Decimal
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify


def path_and_rename(instance, filename):
    """
    Genera un nombre de archivo único y limpio para las imágenes.
    Evita problemas con caracteres especiales y espacios.
    
    Ejemplo: imagen bonita.jpg -> a1b2c3d4e5f6.jpg
    """
    ext = filename.split('.')[-1].lower()
    filename = f'{uuid4().hex}.{ext}'
    return os.path.join('products/', filename)


def gallery_path_and_rename(instance, filename):
    """
    Genera nombre único para imágenes de la galería.
    Se guardan en una subcarpeta 'gallery'.
    """
    ext = filename.split('.')[-1].lower()
    filename = f'{uuid4().hex}.{ext}'
    return os.path.join('products/gallery/', filename)


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


def brand_path_and_rename(instance, filename):
    """Genera nombre único para logos de marca."""
    ext = filename.split('.')[-1].lower()
    filename = f'{uuid4().hex}.{ext}'
    return os.path.join('brands/', filename)


class Brand(models.Model):
    """Marca de productos odontológicos."""
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nombre",
        help_text="Nombre de la marca (ej: 3M, Hu-Friedy, NSK)"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        blank=True,
        verbose_name="Slug",
        help_text="Identificador URL-friendly (se genera automáticamente)"
    )
    image = models.ImageField(
        upload_to=brand_path_and_rename,
        blank=True,
        null=True,
        verbose_name="Logo",
        help_text="Logo de la marca (opcional)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
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
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name="Marca",
        help_text="Marca del producto (opcional)"
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
    # Usa path_and_rename para nombres de archivo limpios
    image = models.ImageField(
        upload_to=path_and_rename,
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
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Producto"
    )
    # Usa gallery_path_and_rename para nombres limpios
    image = models.ImageField(
        upload_to=gallery_path_and_rename,
        verbose_name="Imagen",
        help_text="Imagen adicional del producto"
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
