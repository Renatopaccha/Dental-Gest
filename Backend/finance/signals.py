"""
Django Signals para automatización del módulo de finanzas.

Implementa:
- Descuento automático de stock al registrar una venta
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Sale


@receiver(post_save, sender=Sale)
def update_stock_on_sale(sender, instance, created, **kwargs):
    """
    Descontar stock automáticamente cuando se crea una venta.
    
    Solo se ejecuta para ventas NUEVAS (created=True).
    La validación de stock suficiente se hace en Sale.clean()
    """
    if created:
        product = instance.product
        product.stock_count -= instance.quantity
        # Usar update_fields para evitar llamar save() completo
        # Esto también actualiza in_stock automáticamente
        product.save(update_fields=['stock_count', 'in_stock'])
