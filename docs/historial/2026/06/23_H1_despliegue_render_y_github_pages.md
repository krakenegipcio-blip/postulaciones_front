# Historial de Despliegue: Render (Backend) y GitHub Pages (Frontend)
Fecha: 23 de Junio de 2026

## Resumen de Tareas Realizadas

### 1. Correcciones en el Backend (Render)
- Se solucionaron los errores de compilación (`tsc`) al desplegar en Render asegurando que `devDependencies` (como Typescript y tipos de Express) estuvieran disponibles durante el `npm run build`.
- Se habilitó la conexión SSL para la base de datos PostgreSQL de producción (Neon) añadiendo `ssl: true` a la configuración de la conexión cuando se está en un entorno de producción.
- Se agregó una ruta raíz y endpoints de verificación de estado (`/api/health` y `/api/prueba_api`) para confirmar que la API responde correctamente tras el despliegue, sin depender de rutas protegidas o que requieran base de datos para probar la conexión básica.

### 2. Correcciones en el Frontend (GitHub Pages)
- Se identificó un problema por el cual el frontend compilado seguía intentando comunicarse con `localhost:3001` a pesar de tener la variable de entorno configurada. Esto ocurría porque el archivo `.env` está ignorado en Git (por buenas prácticas de seguridad) y, por lo tanto, no estaba disponible durante el paso de construcción en GitHub Actions.
- Para solucionarlo, se actualizó el flujo de trabajo (`.github/workflows/deploy.yml`) para **inyectar explícitamente** la variable `VITE_API_URL: https://postulaciones-back.onrender.com/api` durante el paso de `npm run build`. Esto asegura que Vite empaquete la aplicación con la URL correcta del backend de producción.
- Se configuró el flujo de trabajo para usar Node.js v22 y habilitar correctamente la publicación en GitHub Pages.

## Estado Actual
- **Backend:** Desplegado en Render.
- **Frontend:** Desplegado en GitHub Pages y configurado para apuntar al backend en producción en lugar de `localhost`.
