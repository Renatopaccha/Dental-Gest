"""
URL configuration for dental_api project.

Incluye:
- Panel de administración en /admin/
- API REST en /api/
- Archivos media en desarrollo
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Panel de administración
    path('admin/', admin.site.urls),
    
    # API REST
    path('api/', include('products.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
