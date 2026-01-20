"""
Modelos de datos para el catálogo de productos odontológicos.

Este módulo define los modelos Category y Product con lógica de stock automática
y soporte para precios de oferta (descuentos).
"""
from decimal import Decimal
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify


class Category(models.Model):
    """
    Categoría de productos odontológicos.
    
    Ejemplos: Instrumentos, Kits, Consumibles, Educación
    """
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
        """Genera el slug automáticamente si no existe."""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """
    Producto del catálogo de suministros odontológicos.
    
    Incluye lógica automática para:
    - Determinar disponibilidad basada en stock_count
    - Manejar precios de oferta (discount_price)
    - Calcular porcentaje de descuento
    """
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
        verbose_name="Imagen",
        help_text="Foto del producto (formatos: JPG, PNG)"
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
        """Valida que el precio de oferta sea menor que el precio regular."""
        if self.discount_price is not None and self.discount_price >= self.price:
            raise ValidationError({
                'discount_price': 'El precio de oferta debe ser menor que el precio regular.'
            })

    def save(self, *args, **kwargs):
        """
        Calcula automáticamente in_stock y valida precios.
        """
        self.in_stock = self.stock_count > 0
        self.full_clean()  # Ejecuta validaciones
        super().save(*args, **kwargs)

    @property
    def current_price(self) -> Decimal:
        """
        Devuelve el precio actual (oferta si existe, sino el regular).
        
        Returns:
            Decimal: El precio de oferta si existe, o el precio regular.
        """
        if self.discount_price is not None:
            return self.discount_price
        return self.price

    @property
    def has_discount(self) -> bool:
        """Indica si el producto tiene descuento activo."""
        return self.discount_price is not None

    @property
    def discount_percentage(self) -> int:
        """
        Calcula el porcentaje de descuento.
        
        Returns:
            int: Porcentaje de descuento (0-100), o 0 si no hay descuento.
        """
        if self.discount_price is not None and self.price > 0:
            discount = ((self.price - self.discount_price) / self.price) * 100
            return int(discount)
        return 0

    @property
    def stock_status(self) -> str:
        """
        Devuelve el estado de stock para mostrar en el frontend.
        
        Returns:
            str: 'En Stock', 'Poco Stock' o 'Agotado'
        """
        if self.stock_count == 0:
            return "Agotado"
        elif self.stock_count < 5:
            return "Poco Stock"
        return "En Stock"
