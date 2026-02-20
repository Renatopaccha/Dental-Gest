"""
Modelos para el módulo de Inteligencia Financiera.

Incluye:
- Expense: Registro de gastos operativos
- Sale: Registro de ventas manuales con cálculo automático de stock
"""
from decimal import Decimal
from django.db import models
from django.core.exceptions import ValidationError


# Categorías de gastos para análisis financiero
EXPENSE_CATEGORIES = [
    ('MARKETING', 'Marketing'),
    ('LOGISTICS', 'Logística'),
    ('OPERATIONS', 'Operativo'),
    ('INVENTORY', 'Inventario'),
    ('UTILITIES', 'Servicios'),
    ('OTHER', 'Otros'),
]


def receipt_path(instance, filename):
    """Genera ruta para comprobantes de gastos."""
    from uuid import uuid4
    ext = filename.split('.')[-1].lower()
    return f'receipts/{uuid4().hex}.{ext}'


class Expense(models.Model):
    """
    Registro de gastos operativos del negocio.
    Permite categorizar y rastrear todos los egresos.
    """
    concept = models.CharField(
        max_length=200,
        verbose_name="Concepto",
        help_text="Descripción breve del gasto"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Monto ($)",
        help_text="Valor del gasto en dólares"
    )
    category = models.CharField(
        max_length=20,
        choices=EXPENSE_CATEGORIES,
        default='OTHER',
        verbose_name="Categoría",
        help_text="Tipo de gasto para análisis"
    )
    date = models.DateField(
        verbose_name="Fecha del gasto",
        help_text="Cuándo se realizó el gasto"
    )
    receipt = models.FileField(
        upload_to=receipt_path,
        null=True,
        blank=True,
        verbose_name="Comprobante",
        help_text="Factura o recibo (opcional)"
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Notas",
        help_text="Observaciones adicionales"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de registro"
    )

    class Meta:
        verbose_name = "Gasto"
        verbose_name_plural = "Gastos"
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.concept} - ${self.amount} ({self.get_category_display()})"


class Sale(models.Model):
    """
    Registro de ventas manuales (offline o directas).
    Guarda el precio del momento de la venta para historiales precisos.
    """
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT,
        related_name='sales',
        verbose_name="Producto",
        help_text="Producto vendido"
    )
    quantity = models.PositiveIntegerField(
        verbose_name="Cantidad",
        help_text="Número de unidades vendidas"
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Precio unitario de venta ($)",
        help_text="Precio por unidad en el momento de la venta"
    )
    unit_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Costo unitario ($)",
        help_text="Costo del producto (se autocompleta si está disponible)"
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        verbose_name="Total de la venta ($)",
        help_text="Calculado automáticamente"
    )
    sale_date = models.DateTimeField(
        verbose_name="Fecha de venta",
        help_text="Cuándo se realizó la venta"
    )
    customer_name = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Cliente",
        help_text="Nombre del cliente (opcional)"
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Notas",
        help_text="Observaciones de la venta"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de registro"
    )

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"
        ordering = ['-sale_date', '-created_at']

    def __str__(self):
        return f"{self.quantity}x {self.product.name} - ${self.total}"

    def clean(self):
        """Validar que hay suficiente stock antes de guardar."""
        if self.pk is None:  # Solo para nuevas ventas
            if self.product.stock_count < self.quantity:
                raise ValidationError({
                    'quantity': f"Stock insuficiente. Disponible: {self.product.stock_count}, "
                                f"Solicitado: {self.quantity}"
                })

    def save(self, *args, **kwargs):
        # Calcular total automáticamente
        self.total = Decimal(str(self.quantity)) * self.unit_price
        
        # Autocompletar costo unitario si no se proporcionó
        if self.unit_cost is None and self.product.cost_price:
            self.unit_cost = self.product.cost_price
        
        # Validar antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def profit(self) -> Decimal:
        """Ganancia total de esta venta."""
        if self.unit_cost is None:
            return Decimal('0')
        return self.total - (Decimal(str(self.quantity)) * self.unit_cost)

    @property
    def profit_margin_percentage(self) -> int:
        """Porcentaje de margen de ganancia de esta venta."""
        if self.unit_cost is None or self.unit_cost == 0:
            return 0
        cost_total = Decimal(str(self.quantity)) * self.unit_cost
        if cost_total == 0:
            return 0
        return int(((self.total - cost_total) / cost_total) * 100)
