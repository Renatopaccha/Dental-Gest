"""
URL configuration for dental_api project.

Incluye:
- Panel de administración en /admin/
- API REST en /api/
- Archivos media en desarrollo (CRÍTICO para imágenes)
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Panel de administración
    path('admin/', admin.site.urls),
    
    # API REST - Productos
    path('api/', include('products.urls')),
    
    # API REST - Finanzas
    path('api/finance/', include('finance.urls')),
]

# CRÍTICO: Servir archivos media en desarrollo
# Sin esto, las imágenes subidas desde el admin NO se mostrarán
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
