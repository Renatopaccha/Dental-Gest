"""
Vistas API para el módulo de Inteligencia Financiera.

Incluye:
- DashboardStatsView: Métricas de negocio en tiempo real
- ExpenseViewSet: CRUD de gastos
- SaleViewSet: CRUD de ventas
"""
from decimal import Decimal
from datetime import timedelta

from django.db.models import Sum, Count, F, Value
from django.db.models.functions import Coalesce
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from products.models import Product
from .models import Expense, Sale
from .serializers import (
    ExpenseSerializer,
    SaleSerializer,
    DashboardStatsSerializer
)


class DashboardStatsView(APIView):
    """
    Dashboard con métricas de negocio en tiempo real.
    
    Retorna:
    - Ingresos del mes actual vs mes anterior
    - Gastos totales del mes
    - Costo de productos vendidos (COGS)
    - Ganancia neta real
    - Top 5 productos más vendidos
    - Alertas de stock crítico
    """
    permission_classes = [AllowAny]  # Cambiar a IsAdminUser en producción
    
    def get(self, request):
        now = timezone.now()
        
        # Calcular inicio del mes actual y anterior
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        # ========================================
        # INGRESOS
        # ========================================
        
        # Ingresos mes actual
        current_revenue = Sale.objects.filter(
            sale_date__gte=current_month_start
        ).aggregate(
            total=Coalesce(Sum('total'), Value(Decimal('0')))
        )['total']
        
        # Ingresos mes anterior
        previous_revenue = Sale.objects.filter(
            sale_date__gte=previous_month_start,
            sale_date__lt=current_month_start
        ).aggregate(
            total=Coalesce(Sum('total'), Value(Decimal('0')))
        )['total']
        
        # Calcular porcentaje de cambio
        revenue_change = self._calculate_percentage_change(
            float(current_revenue),
            float(previous_revenue)
        )
        
        # ========================================
        # GASTOS
        # ========================================
        
        total_expenses = Expense.objects.filter(
            date__gte=current_month_start.date()
        ).aggregate(
            total=Coalesce(Sum('amount'), Value(Decimal('0')))
        )['total']
        
        # ========================================
        # COSTO DE PRODUCTOS VENDIDOS (COGS)
        # ========================================
        
        # Sumamos quantity * unit_cost para todas las ventas del mes
        cogs_result = Sale.objects.filter(
            sale_date__gte=current_month_start,
            unit_cost__isnull=False
        ).aggregate(
            total=Sum(F('quantity') * F('unit_cost'))
        )
        cogs = cogs_result['total'] or Decimal('0')
        
        # ========================================
        # GANANCIA NETA
        # ========================================
        
        net_profit = current_revenue - cogs - total_expenses
        
        # ========================================
        # CONTEO DE VENTAS
        # ========================================
        
        total_sales_count = Sale.objects.filter(
            sale_date__gte=current_month_start
        ).count()
        
        # ========================================
        # TOP 5 PRODUCTOS MÁS VENDIDOS
        # ========================================
        
        top_products = Sale.objects.filter(
            sale_date__gte=current_month_start
        ).values(
            'product__id',
            'product__name'
        ).annotate(
            total_sold=Sum('quantity'),
            revenue=Sum('total')
        ).order_by('-total_sold')[:5]
        
        # Formatear para el serializador
        top_products_formatted = [
            {
                'product_id': p['product__id'],
                'product_name': p['product__name'],
                'total_sold': p['total_sold'],
                'revenue': p['revenue']
            }
            for p in top_products
        ]
        
        # ========================================
        # ALERTAS DE STOCK CRÍTICO
        # ========================================
        
        # Productos con menos de 5 unidades pero más de 0
        critical_stock = Product.objects.filter(
            stock_count__lt=5,
            stock_count__gt=0
        ).values('id', 'name', 'stock_count')[:10]
        
        # Productos agotados
        out_of_stock = Product.objects.filter(
            stock_count=0
        ).values('id', 'name', 'stock_count')[:10]
        
        # Combinar alertas
        alerts = list(critical_stock) + list(out_of_stock)
        
        # ========================================
        # RESPUESTA
        # ========================================
        
        data = {
            'current_month_revenue': current_revenue,
            'previous_month_revenue': previous_revenue,
            'revenue_change_percentage': revenue_change,
            'total_expenses': total_expenses,
            'cost_of_goods_sold': cogs,
            'net_profit': net_profit,
            'total_sales_count': total_sales_count,
            'top_products': top_products_formatted,
            'critical_stock_alerts': alerts,
        }
        
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)
    
    def _calculate_percentage_change(self, current: float, previous: float) -> float:
        """Calcular porcentaje de cambio entre dos valores."""
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return round(((current - previous) / previous) * 100, 2)


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de gastos.
    
    Endpoints:
    - GET /api/finance/expenses/ - Listar gastos
    - POST /api/finance/expenses/ - Crear gasto
    - GET /api/finance/expenses/{id}/ - Detalle de gasto
    - PUT /api/finance/expenses/{id}/ - Actualizar gasto
    - DELETE /api/finance/expenses/{id}/ - Eliminar gasto
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [AllowAny]  # Cambiar a IsAdminUser en producción
    
    def get_queryset(self):
        """Permitir filtrar por categoría y rango de fechas."""
        queryset = super().get_queryset()
        
        # Filtrar por categoría
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filtrar por rango de fechas
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset


class SaleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de ventas manuales.
    
    Endpoints:
    - GET /api/finance/sales/ - Listar ventas
    - POST /api/finance/sales/ - Registrar venta (descuenta stock automáticamente)
    - GET /api/finance/sales/{id}/ - Detalle de venta
    - PUT /api/finance/sales/{id}/ - Actualizar venta
    - DELETE /api/finance/sales/{id}/ - Eliminar venta
    """
    queryset = Sale.objects.select_related('product').all()
    serializer_class = SaleSerializer
    permission_classes = [AllowAny]  # Cambiar a IsAdminUser en producción
    
    def get_queryset(self):
        """Permitir filtrar por producto y rango de fechas."""
        queryset = super().get_queryset()
        
        # Filtrar por producto
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        # Filtrar por rango de fechas
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(sale_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(sale_date__lte=end_date)
        
        return queryset
