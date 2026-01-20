"""
Modelos de datos para el catálogo de productos odontológicos.

Este módulo define los modelos Category y Product con lógica de stock automática.
"""
from django.db import models
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
    
    Incluye lógica automática para determinar disponibilidad basada en stock_count.
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
        verbose_name="Precio ($)",
        help_text="Precio en dólares con 2 decimales"
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
        editable=False,  # Se calcula automáticamente
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

    def save(self, *args, **kwargs):
        """
        Calcula automáticamente in_stock basado en stock_count.
        
        - stock_count > 0  →  in_stock = True
        - stock_count == 0 →  in_stock = False
        """
        self.in_stock = self.stock_count > 0
        super().save(*args, **kwargs)

    @property
    def stock_status(self):
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
