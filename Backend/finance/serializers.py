"""
Serializadores para el módulo de Finanzas.

Incluye serializadores para:
- Expense (gastos)
- Sale (ventas)
- Dashboard stats (métricas de negocio)
"""
from rest_framework import serializers
from .models import Expense, Sale


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializador para gastos operativos."""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Expense
        fields = [
            'id',
            'concept',
            'amount',
            'category',
            'category_display',
            'date',
            'receipt',
            'notes',
            'created_at'
        ]
        read_only_fields = ['created_at']


class SaleSerializer(serializers.ModelSerializer):
    """Serializador para ventas manuales."""
    product_name = serializers.CharField(source='product.name', read_only=True)
    profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    profit_margin_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Sale
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'unit_price',
            'unit_cost',
            'total',
            'profit',
            'profit_margin_percentage',
            'sale_date',
            'customer_name',
            'notes',
            'created_at'
        ]
        read_only_fields = ['total', 'profit', 'profit_margin_percentage', 'created_at']


class TopProductSerializer(serializers.Serializer):
    """Serializador para productos más vendidos."""
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    total_sold = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)


class CriticalStockSerializer(serializers.Serializer):
    """Serializador para alertas de stock crítico."""
    id = serializers.IntegerField()
    name = serializers.CharField()
    stock_count = serializers.IntegerField()


class DashboardStatsSerializer(serializers.Serializer):
    """Serializador para las métricas del dashboard."""
    current_month_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    previous_month_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    revenue_change_percentage = serializers.FloatField()
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    cost_of_goods_sold = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_sales_count = serializers.IntegerField()
    top_products = TopProductSerializer(many=True)
    critical_stock_alerts = CriticalStockSerializer(many=True)
