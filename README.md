# Dental GEST_EC

E-commerce de suministros odontológicos para profesionales y estudiantes.

## 📁 Estructura del Proyecto

```
Dental-Gest/
├── Backend/           # API Django (por implementar)
├── Fronted/           # Diseños HTML originales
│   ├── code.html      # Página de inicio
│   ├── code 2.html    # Detalle de producto
│   └── code 3.html    # Catálogo
└── frontend-next/     # Frontend Next.js 14+
    ├── src/
    │   ├── app/       # Páginas (App Router)
    │   ├── components/# Componentes reutilizables
    │   └── lib/       # Datos y utilidades
    └── public/        # Recursos estáticos
```

## 🚀 Cómo ejecutar el Frontend

```bash
cd frontend-next
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠 Tecnologías

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS v4
- **Backend**: Django (por implementar)

## ✨ Características

- ✅ Diseño moderno y responsivo
- ✅ Modo oscuro
- ✅ Integración con WhatsApp
- ✅ Lógica dinámica de stock (En Stock / Poco Stock / Agotado)
- ✅ Optimización de imágenes con Next.js
