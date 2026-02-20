"""
Configuración del Admin Panel para el módulo de Finanzas.

Incluye:
- ExpenseAdmin: Gestión de gastos con filtros por categoría y fecha
- SaleAdmin: Gestión de ventas con cálculo de ganancias
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Expense, Sale


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """Admin para gestión de gastos operativos."""
    
    list_display = [
        'concept',
        'formatted_amount',
        'category',
        'date',
        'has_receipt',
        'created_at'
    ]
    list_filter = ['category', 'date']
    search_fields = ['concept', 'notes']
    date_hierarchy = 'date'
    ordering = ['-date', '-created_at']
    
    fieldsets = (
        ('Información del Gasto', {
            'fields': ('concept', 'amount', 'category', 'date')
        }),
        ('Documentación', {
            'fields': ('receipt', 'notes'),
            'classes': ('collapse',)
        }),
    )

    def formatted_amount(self, obj):
        """Mostrar monto con formato de moneda."""
        return f"${obj.amount:,.2f}"
    formatted_amount.short_description = "Monto"
    formatted_amount.admin_order_field = 'amount'

    def has_receipt(self, obj):
        """Indicador visual de si tiene comprobante."""
        if obj.receipt:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: gray;">—</span>')
    has_receipt.short_description = "Comprobante"


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    """Admin para gestión de ventas manuales."""
    
    list_display = [
        'product',
        'quantity',
        'formatted_unit_price',
        'formatted_total',
        'formatted_profit',
        'sale_date',
        'customer_name'
    ]
    list_filter = ['sale_date', 'product__category', 'product__brand']
    search_fields = ['product__name', 'customer_name', 'notes']
    date_hierarchy = 'sale_date'
    ordering = ['-sale_date', '-created_at']
    autocomplete_fields = ['product']
    readonly_fields = ['total', 'profit_display']
    
    fieldsets = (
        ('Producto', {
            'fields': ('product', 'quantity')
        }),
        ('Precios', {
            'fields': ('unit_price', 'unit_cost', 'total', 'profit_display')
        }),
        ('Detalles de la Venta', {
            'fields': ('sale_date', 'customer_name', 'notes')
        }),
    )

    def formatted_unit_price(self, obj):
        """Precio unitario formateado."""
        return f"${obj.unit_price:,.2f}"
    formatted_unit_price.short_description = "Precio Unit."
    formatted_unit_price.admin_order_field = 'unit_price'

    def formatted_total(self, obj):
        """Total formateado."""
        return f"${obj.total:,.2f}"
    formatted_total.short_description = "Total"
    formatted_total.admin_order_field = 'total'

    def formatted_profit(self, obj):
        """Ganancia formateada con color."""
        profit = obj.profit
        if profit > 0:
            color = 'green'
        elif profit < 0:
            color = 'red'
        else:
            color = 'gray'
        formatted_value = f"${profit:,.2f}"
        margin = obj.profit_margin_percentage
        return format_html(
            '<span style="color: {};">{} ({}%)</span>',
            color,
            formatted_value,
            margin
        )
    formatted_profit.short_description = "Ganancia"

    def profit_display(self, obj):
        """Campo readonly para mostrar ganancia en el formulario."""
        if obj.pk:
            return f"${obj.profit:,.2f} ({obj.profit_margin_percentage}%)"
        return "Se calculará al guardar"
    profit_display.short_description = "Ganancia calculada"
