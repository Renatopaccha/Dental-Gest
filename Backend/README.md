# Backend Django - Dental GEST_EC

API REST y Panel de Administración para el e-commerce de productos odontológicos.

## 🚀 Inicio Rápido

```bash
# Activar entorno virtual
source venv/bin/activate

# Ejecutar servidor
python manage.py runserver 8000
```

## 📍 URLs

- **Admin**: http://localhost:8000/admin/
- **API**: http://localhost:8000/api/

## 🔑 Credenciales Admin

- **Usuario**: admin
- **Contraseña**: admin123

## 📦 Dependencias

- Django 5.2
- Django REST Framework 3.16
- django-cors-headers 4.9
- Pillow 12.1

## 🔌 API Endpoints

```
GET /api/products/           # Lista productos
GET /api/products/{id}/      # Detalle producto
GET /api/categories/         # Lista categorías
GET /api/products/?category=1
GET /api/products/?in_stock=true
GET /api/products/?search=kit
```
