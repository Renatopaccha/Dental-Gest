"""
URLs para el módulo de Finanzas.

Endpoints disponibles:
- /api/finance/dashboard/ - Métricas del dashboard
- /api/finance/expenses/ - CRUD de gastos
- /api/finance/sales/ - CRUD de ventas
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardStatsView, ExpenseViewSet, SaleViewSet

# Router para ViewSets
router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'sales', SaleViewSet, basename='sale')

urlpatterns = [
    # Dashboard endpoint
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # ViewSets (expenses, sales)
    path('', include(router.urls)),
]
