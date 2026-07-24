# Historial: 25 de Junio 2026 - Corrección de Variables de Entorno en Render

## Problema
Al intentar iniciar sesión en la aplicación frontend desplegada, la interfaz mostraba un mensaje de "Error de conexión con el servidor".

## Diagnóstico
Se analizó la comunicación entre el frontend (desplegado en GitHub Pages) y el backend (desplegado en Render). Se identificó que la falla se debía a la falta de variables de entorno críticas en la configuración del servicio de Render.

En Render solo estaban configuradas `DATABASE_URL` y `NODE_ENV`, pero el código del backend requería dos variables adicionales para funcionar correctamente:

1. **`FRONTEND_URL`**: Esta variable es requerida en `src/index.ts` para configurar los orígenes permitidos en CORS (`cors({ origin: allowedOrigins })`). Al no estar definida, el backend rechazaba por seguridad todas las peticiones entrantes desde el dominio del frontend, causando el error de conexión.
2. **`JWT_SECRET`**: Esta variable es utilizada en las rutas y middlewares de autenticación (`src/routes/auth.ts` y `src/middleware/authMiddleware.ts`) para firmar y validar de manera segura los tokens de sesión.

## Solución Aplicada
Se accedió al Dashboard de Render, dentro del entorno de `postulaciones_back`, y se agregaron las siguientes variables en la sección **Environment**:

| KEY | VALUE | Propósito |
|---|---|---|
| `FRONTEND_URL` | `https://krakenegipcio-blip.github.io` | Habilitar CORS para permitir peticiones desde el frontend. |
| `JWT_SECRET` | `groudon678%#` | Clave secreta para la firma y verificación de tokens JWT. |

*(La variable `PORT` no fue necesaria agregarla ya que Render la asigna dinámicamente).*

## Resultado
Una vez guardadas las variables y completado el re-despliegue automático en Render ("Save, rebuild, and deploy"), el problema de CORS quedó solucionado y el inicio de sesión comenzó a funcionar exitosamente, logrando una conexión fluida entre el cliente en GitHub Pages y la API en Render.
