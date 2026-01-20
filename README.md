# Dental GEST_EC

E-commerce de suministros odontológicos para profesionales y estudiantes.

## 📁 Estructura del Proyecto

```
Dental-Gest/
├── Backend/               # API Django REST
│   ├── dental_api/        # Configuración Django
│   ├── products/          # App de productos
│   ├── media/             # Imágenes subidas
│   └── venv/              # Entorno virtual
├── Fronted/               # Diseños HTML originales
└── frontend-next/         # Frontend Next.js 14+
```

## 🚀 Cómo Ejecutar

### Backend (Django)
```bash
cd Backend
source venv/bin/activate
python manage.py runserver 8000
```
- **Admin**: http://localhost:8000/admin/ (admin / admin123)
- **API**: http://localhost:8000/api/products/

### Frontend (Next.js)
```bash
cd frontend-next
npm install
npm run dev
```
- **Web**: http://localhost:3000

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products/` | Lista todos los productos |
| GET | `/api/products/{id}/` | Detalle de producto |
| GET | `/api/categories/` | Lista categorías |
| GET | `/api/products/?category=1` | Filtrar por categoría |
| GET | `/api/products/?in_stock=true` | Solo en stock |
| GET | `/api/products/?search=kit` | Buscar |

## 🛠 Tecnologías

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS v4
- **Backend**: Django 5, Django REST Framework, SQLite

## ✨ Características

- ✅ Panel de admin personalizado para el dueño
- ✅ Lógica automática de stock (En Stock / Poco Stock / Agotado)
- ✅ Integración con WhatsApp
- ✅ CORS configurado para desarrollo
- ✅ Modo oscuro en frontend
