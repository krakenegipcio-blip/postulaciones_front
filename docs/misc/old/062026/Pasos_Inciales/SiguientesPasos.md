# Siguientes Pasos para Levantar la App

La migración de Supabase a PostgreSQL local + Express ya está completada en el código. Solo faltan estos pasos manuales para que la app funcione:

---

## Paso 1: Crear la Base de Datos en DBeaver

1. Abre **DBeaver** y conéctate a tu PostgreSQL local (`localhost:5432`, usuario `postgres`, contraseña `yes120yes`).
2. En el panel izquierdo, haz **clic derecho** sobre la carpeta **"Databases"** (o "Bases de datos").
3. Selecciona **Crear Nuevo → Base de datos**.
4. En el campo nombre, escribe: **`postulaciones_analisis`**
5. Presiona **Aceptar**.
6. Si no aparece, haz clic derecho en la conexión → **Actualizar** (F5).

---

## Paso 2: Ejecutar el Script SQL (Crear Tablas y Datos Semilla)

1. En DBeaver, haz **doble clic** sobre la nueva base de datos `postulaciones_analisis` para conectarte a ella (o crea una conexión nueva apuntando directamente a ella).
2. Abre un **Editor SQL** (`Alt+S` o clic derecho → Editor SQL → Abrir Editor SQL).
3. Abre el archivo `docs/schema.sql` del proyecto y copia todo su contenido.
4. Pégalo en el Editor SQL de DBeaver.
5. Ejecuta todo el script con **Ctrl+Enter** (o el botón ▶️ "Ejecutar script SQL").
6. Deberías ver en la consola que se crearon 11 tablas + datos semilla sin errores.

---

## Paso 3: Levantar la Aplicación

1. Abre una terminal en VS Code (`Ctrl + ñ`) o tu terminal preferida.
2. Navega al directorio del proyecto:
   ```bash
   cd c:\Users\djara\Documents\REPOSITORIOS\POSTULO-ANALISIS\postulaciones_analisis_final
   ```
3. Ejecuta:
   ```bash
   npm run dev
   ```
4. Esto levantará **dos procesos simultáneamente**:
   - **Backend** (Express + PostgreSQL) en `http://localhost:3001`
   - **Frontend** (Vite + React) en `http://localhost:5173`
5. Abre tu navegador en **http://localhost:5173** y tu app debería estar funcionando con tu base de datos local.

---

## Verificación Rápida

Si todo está bien, deberías poder:
- ✅ Ver las postulaciones (vacías al inicio)
- ✅ Crear una nueva postulación desde el formulario
- ✅ Administrar catálogos (Empresas, Cargos, Tecnologías, etc.) — ya vienen con datos semilla
- ✅ Ver el Panel de Análisis (se llenará cuando haya postulaciones)

---

## Troubleshooting

| Problema | Solución |
|---|---|
| `Error: connect ECONNREFUSED 127.0.0.1:5432` | PostgreSQL no está corriendo. Búscalo en Servicios de Windows (`services.msc`) y asegúrate de que "postgresql-x64-17" esté **iniciado**. |
| `error: password authentication failed` | Revisa que la contraseña en `.env` sea correcta (`yes120yes`). |
| `error: database "postulaciones_analisis" does not exist` | No has completado el **Paso 1**. Crea la base de datos en DBeaver. |
| Las tablas no existen / error de tabla | No has completado el **Paso 2**. Ejecuta `docs/schema.sql` en DBeaver. |
| El frontend carga pero no muestra datos | Revisa la consola del terminal donde se ejecuta el backend para ver errores. |

---

## Archivos Clave de la Nueva Arquitectura

| Archivo | Propósito |
|---|---|
| `.env` | Cadena de conexión a PostgreSQL local |
| `server/db.ts` | Pool de conexiones a la base de datos |
| `server/index.ts` | API REST (Express) — reemplaza todo lo que hacía Supabase |
| `src/lib/api.ts` | Cliente fetch del frontend (reemplaza al cliente Supabase) |
| `docs/schema.sql` | Script SQL para crear las tablas y datos semilla |
