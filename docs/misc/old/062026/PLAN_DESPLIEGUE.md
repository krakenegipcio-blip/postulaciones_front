---NOTA HUMANA: ES PREFERIBLE DESPLEGAR UN BACKEND EN EXPRESS.JS EN RENDER Y YA, PARA NO COMPLICAR LA VIDA DE LOS DESARROLLADORES futures QUE TENGAN QUE HACERLE MODIFICACIONES AL BACKEND

# 🚀 Plan de Despliegue — Postulaciones Análisis

> Documento que evalúa las opciones de despliegue del proyecto y detalla la estrategia elegida.



## 📋 Arquitectura Actual (Local)

| Componente       | Tecnología                          |
| ---------------- | ----------------------------------- |
| **Frontend**     | Vite + React + TypeScript + Tailwind |
| **Backend**      | Express (Node.js) con `pg` directo  |
| **Base de Datos** | PostgreSQL local                   |
| **Comunicación** | REST API en `/api/*` con proxy de Vite |

### Estructura relevante

```
postulaciones_analisis_final/
├── src/                  # Frontend React
├── server/
│   ├── index.ts          # API Express (~311 líneas, CRUD completo)
│   └── db.ts             # Pool de conexión PostgreSQL (usa DATABASE_URL)
├── vite.config.ts        # Proxy de /api → localhost:3001
└── package.json          # Scripts: dev:frontend, dev:backend, dev (concurrently)
```

**Punto clave**: `db.ts` ya usa `process.env.DATABASE_URL`, lo que facilita apuntar a cualquier base remota sin cambios de código.

---

## 🔍 Opciones Evaluadas

### Opción A — Vercel (Full Stack) + Neon Database

> Frontend y backend desplegados en Vercel. Base de datos en Neon.

| Aspecto          | Detalle                                                  |
| ---------------- | -------------------------------------------------------- |
| **Frontend**     | Vercel sirve el build estático de Vite automáticamente   |
| **Backend**      | Express se convierte en **Vercel Serverless Functions**  |
| **Base de datos** | Neon PostgreSQL (serverless, connection string compatible) |
| **Plataformas**  | 2 (Vercel + Neon)                                        |
| **Costo**        | Free tier generoso en ambos                               |
| **Cold start**   | ~200ms por función serverless                            |

#### ⚠️ Cambio requerido

Vercel es **serverless** — no soporta un servidor Express con `app.listen()` persistente. Se debe reestructurar `server/index.ts` en funciones individuales dentro de una carpeta `/api/`.

---

### Opción B — Vercel (Frontend) + Render (Backend) + Neon Database

> Frontend en Vercel, API Express en Render, base de datos en Neon.

| Aspecto          | Detalle                                                    |
| ---------------- | ---------------------------------------------------------- |
| **Frontend**     | Vercel sirve el build estático de Vite                     |
| **Backend**      | Express se sube **tal cual** a Render como Web Service     |
| **Base de datos** | Neon PostgreSQL                                           |
| **Plataformas**  | 3 (Vercel + Render + Neon)                                 |
| **Costo**        | Free tier en los 3                                         |
| **Cold start**   | **~30 segundos** en Render free (el servicio se duerme tras 15 min de inactividad) |

#### ✅ Ventaja

El backend Express funciona **sin cambios** de código. Solo se sube y se configura la variable `DATABASE_URL`.

#### ⚠️ Desventajas

- Render free tiene **cold starts muy largos** (~30s), lo que da mala experiencia de usuario.
- Hay que manejar **CORS en producción** (dominios diferentes para front y back).
- Tres plataformas = más configuración y puntos de fallo.

---

### Opción C — NestJS en Render + Vercel (Frontend) + Neon

> Reescribir el backend en NestJS y desplegarlo en Render.

| Aspecto          | Detalle                                          |
| ---------------- | ------------------------------------------------ |
| **Esfuerzo**     | **Alto** — reescritura completa del backend      |
| **Beneficio**    | Estructura más formal (módulos, DTOs, pipes)     |
| **¿Vale la pena?** | **No para este proyecto** — la API es CRUD simple |

> [!CAUTION]
> Crear un backend NestJS sería **sobre-ingeniería** para este caso. La API actual tiene ~311 líneas y cubre todo lo necesario. NestJS añadiría complejidad innecesaria sin beneficio real.

---

## 📊 Tabla Comparativa Final

| Criterio              | Opción A (Vercel + Neon) | Opción B (Vercel + Render + Neon) | Opción C (NestJS + Render) |
| --------------------- | :----------------------: | :-------------------------------: | :------------------------: |
| Esfuerzo de migración | 🟡 Medio                | 🟢 Bajo                          | 🔴 Alto                   |
| Performance           | 🟢 Excelente             | 🔴 Cold starts largos            | 🔴 Cold starts largos     |
| Costo                 | 🟢 Gratis                | 🟢 Gratis                        | 🟢 Gratis                 |
| Complejidad ops       | 🟢 2 plataformas         | 🟡 3 plataformas + CORS          | 🟡 3 plataformas + CORS   |
| Escalabilidad         | 🟢 Auto-scale serverless | 🟡 Limitada en free tier         | 🟡 Limitada en free tier  |
| Mantenimiento         | 🟢 Simple                | 🟡 Moderado                      | 🔴 Mayor código base      |

---

## ✅ Decisión: Opción A — Vercel + Neon

> [!IMPORTANT]
> Se elige **Vercel (full stack) + Neon Database** por ofrecer el mejor balance entre esfuerzo, performance y simplicidad operativa.

### Razones principales

1. **La API es CRUD simple** → se mapea 1:1 a serverless functions sin complicaciones
2. **Sin cold starts dolorosos** → ~200ms vs ~30s de Render free
3. **Una sola plataforma de deploy** → menos config, menos CORS, un solo dashboard
4. **`DATABASE_URL` ya está implementado** → Neon funciona sin cambiar `db.ts`
5. **Free tier generoso** → suficiente para un proyecto personal/portfolio

---

## 🛠️ Plan de Ejecución

### Fase 1 — Preparar Neon Database

1. Crear cuenta/proyecto en [neon.tech](https://neon.tech)
2. Crear una base de datos con el mismo esquema actual
3. Exportar datos locales con `pg_dump`
4. Importar datos en Neon con `psql` usando la connection string de Neon
5. Verificar que los datos estén completos

```bash
# Exportar base local
pg_dump -U postgres -d postulaciones --no-owner --no-privileges > dump.sql

# Importar en Neon
psql "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/postulaciones?sslmode=require" < dump.sql
```

---

### Fase 2 — Convertir Backend a Vercel Serverless Functions

Reestructurar `server/index.ts` (Express) en funciones serverless individuales:

```
api/
├── postulaciones/
│   ├── index.ts          # GET (listar) + POST (crear)
│   └── [id].ts           # PUT (editar) + DELETE (eliminar)
├── dashboard.ts          # GET /api/dashboard
└── [table]/
    ├── index.ts           # GET (listar catálogo) + POST (crear)
    └── [id].ts            # PUT (editar) + DELETE (eliminar)
```

**Cambios clave:**
- Cada archivo exporta un handler `export default function(req, res)` en vez de `app.get/post/put/delete`
- Se usa `@neondatabase/serverless` (driver optimizado para serverless) o `pg` con pool configurado
- Se discrimina el método HTTP con `req.method` dentro de cada handler

**Ejemplo de transformación:**

```typescript
// ANTES: server/index.ts (Express)
app.get('/api/postulaciones', async (req, res) => { ... });
app.post('/api/postulaciones', async (req, res) => { ... });

// DESPUÉS: api/postulaciones/index.ts (Vercel Serverless)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // ... misma lógica del GET actual
  } else if (req.method === 'POST') {
    // ... misma lógica del POST actual
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

### Fase 3 — Configurar Vercel

1. Crear `vercel.json` en la raíz del proyecto:

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

2. Configurar variable de entorno en Vercel Dashboard:
   - `DATABASE_URL` → connection string de Neon (con `?sslmode=require`)

3. Conectar repositorio de GitHub a Vercel

---

### Fase 4 — Deploy y Verificación

1. Push a GitHub
2. Vercel detecta el repo y hace deploy automático
3. Verificar:
   - [ ] Frontend carga correctamente
   - [ ] Dashboard muestra datos reales desde Neon
   - [ ] CRUD de postulaciones funciona (crear, editar, eliminar)
   - [ ] CRUD de catálogos funciona (empresa, cargo, estado, etc.)
   - [ ] Filtros y búsqueda funcionan
   - [ ] Paginación funciona

---

## 📦 Dependencias Nuevas

| Paquete                    | Propósito                                  |
| -------------------------- | ------------------------------------------ |
| `@vercel/node`             | Tipos para serverless functions            |
| `@neondatabase/serverless` | *(Opcional)* Driver optimizado para Neon    |

## 📦 Dependencias que se eliminan

| Paquete        | Razón                                      |
| -------------- | ------------------------------------------ |
| `express`      | Ya no se usa servidor Express              |
| `cors`         | Vercel maneja CORS automáticamente         |
| `concurrently` | Ya no hay dos procesos en desarrollo       |
| `tsx`          | Vercel compila TypeScript automáticamente  |

> [!NOTE]
> Las dependencias de desarrollo como `@types/express` y `@types/cors` también se eliminan.

---

## ⏱️ Estimación de Tiempo

| Fase                          | Tiempo estimado |
| ----------------------------- | --------------- |
| Fase 1 — Neon Database        | ~30 min         |
| Fase 2 — Serverless Functions | ~1-2 horas      |
| Fase 3 — Configurar Vercel   | ~15 min         |
| Fase 4 — Deploy y verificar  | ~30 min         |
| **Total**                     | **~2-3 horas**  |

---

## 🔗 Links Útiles

- [Neon — Crear cuenta](https://neon.tech)
- [Vercel — Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel — Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Neon — Conectar desde Vercel](https://neon.tech/docs/guides/vercel)
