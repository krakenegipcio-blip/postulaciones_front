# 🚀 Migración de Base de Datos Local → Neon DB (Cloud)

> **Fecha:** 18 de Junio 2026  
> **Proyecto:** Postulaciones Análisis Final  
> **Objetivo:** Migrar la base de datos PostgreSQL local a Neon DB en la nube con todos los datos actualizados.

---

## 📋 Resumen del Plan

| Paso | Descripción | Estado |
|------|-------------|--------|
| 1 | Exportar dump de la DB local | ✅ Completado |
| 2 | Crear base de datos en Neon DB | ✅ Completado |
| 3 | Conectar DBeaver a Neon DB | ⬜ Pendiente |
| 4 | Restaurar el dump en Neon DB | ⬜ Pendiente |
| 5 | Verificar datos migrados | ⬜ Pendiente |

---

## 1️⃣ Exportar Dump de la DB Local (Ya completado)

El dump ya fue generado y se encuentra en:

```
docs/misc/dumps/dump-postgres-202606181823.sql
```

Este archivo contiene:
- **14 tablas**: `empresa`, `cargo`, `estado`, `plataforma`, `modalidad`, `ubicacion`, `tecnologia`, `metodo_evaluacion`, `postulacion`, `postulacion_tecnologia`, `postulacion_metodo`, `nivel_experiencia`, `fase_seguimiento`, `postulacion_seguimiento`, `usuarios`
- **Funciones**: `update_fecha_actualizacion()`
- **Triggers** y **constraints** asociados
- **Todos los datos** actuales (INSERT statements)

> [!NOTE]
> Si necesitas regenerar el dump en el futuro, usa:
> ```bash
> pg_dump -U postgres -d postgres -F p -f dump-postgres-YYYYMMDD.sql
> ```

---

## 2️⃣ Base de Datos Neon DB (Ya creada)

La base de datos en Neon DB ya está creada con los siguientes datos de conexión:

### Datos de conexión Neon DB

| Parámetro | Valor |
|-----------|-------|
| **Host (con pooler)** | `ep-wandering-poetry-ah4wxqi1-pooler.c-3.us-east-1.aws.neon.tech` |
| **Host (directo)** | `ep-wandering-poetry-ah4wxqi1.c-3.us-east-1.aws.neon.tech` |
| **Puerto** | `5432` |
| **Database** | `neondb` |
| **Usuario (Role)** | `neondb_owner` |
| **Password** | `npg_ALT2in3cRzBl` |
| **Branch** | `production` (Default) |
| **SSL Mode** | `require` |

### Connection String (con pooler)

```
postgresql://neondb_owner:npg_ALT2in3cRzBl@ep-wandering-poetry-ah4wxqi1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

> [!IMPORTANT]
> **Pooler vs Directo:** El host con `-pooler` usa connection pooling (recomendado para aplicaciones). Para migraciones/restauraciones pesadas, se recomienda usar la conexión **directa** (sin `-pooler`).

---

## 3️⃣ Conectar DBeaver a Neon DB

### Paso a paso:

1. **Abrir DBeaver** y hacer clic en el ícono de **Nueva Conexión** (enchufe con `+`) o ir a `Archivo → Nuevo → Conexión de Base de Datos`.

2. **Seleccionar PostgreSQL** como tipo de driver y hacer clic en `Siguiente`.

3. **Configurar la pestaña "General":**

   En la sección **Server**, asegúrate de tener seleccionado **"Connect by: Host"** y llenar los campos:

   | Campo | Valor |
   |-------|-------|
   | **Host** | `ep-wandering-poetry-ah4wxqi1-pooler.c-3.us-east-1.aws.neon.tech` |
   | **Port** | `5432` |
   | **Database** | `neondb` |

   En la sección **Authentication**:

   | Campo | Valor |
   |-------|-------|
   | **Authentication** | `Username/password` |
   | **Nombre de usuario** | `neondb_owner` |
   | **Contraseña** | `npg_ALT2in3cRzBl` |
   | **Save password** | ✅ (marcar) |

4. **Configurar SSL (OBLIGATORIO para Neon DB):**

   - Hacer clic en la pestaña **"SSH, SSL..."** en la parte superior.
   - Ir a la sub-pestaña **"SSL"**.
   - Marcar la casilla **"Use SSL"** / **"Usar SSL"**.
   - En **SSL Mode** seleccionar: **`require`**.
   - **NO** es necesario cargar certificados, Neon DB usa certificados públicos.

   > [!CAUTION]
   > Si no configuras SSL, la conexión será **rechazada** por Neon DB. Este paso es obligatorio.

5. **Probar la conexión:**

   - Hacer clic en el botón **"Probar conexión..."** (esquina inferior izquierda).
   - Si todo está correcto, verás un mensaje de **"Conectado"** con la versión de PostgreSQL.
   - Si falla, verificar que SSL esté habilitado y que los datos de host/usuario/contraseña sean correctos.

6. **Finalizar:**

   - Hacer clic en **"Finalizar"** para guardar la conexión.
   - La nueva conexión aparecerá en el **Navegador de Bases de Datos** con el nombre del host de Neon.

> [!TIP]
> Puedes renombrar la conexión haciendo clic derecho → **Renombrar** y ponerle algo como `NeonDB - Postulaciones (Cloud)` para identificarla fácilmente.

---

## 4️⃣ Restaurar el Dump en Neon DB

### Opción A: Usando `psql` desde la terminal (RECOMENDADO)

Esta es la forma más confiable para restaurar un dump `.sql`.

#### Paso 1: Limpiar el dump para compatibilidad con Neon DB

El dump tiene algunas sentencias que **no son compatibles** con Neon DB y deben eliminarse/modificarse antes de restaurar:

> [!WARNING]
> Neon DB **no permite** las siguientes operaciones:
> - `ALTER ... OWNER TO postgres` → El owner en Neon es `neondb_owner`, no `postgres`.
> - `\restrict` → Comando no estándar que puede causar errores.
> - Operaciones sobre roles que no existen en Neon.

#### Paso 2: Crear un dump limpio

Crear una copia del dump y hacer las siguientes modificaciones:

```powershell
# Copiar el dump original
Copy-Item "docs\misc\dumps\dump-postgres-202606181823.sql" "docs\misc\dumps\dump-neondb-clean.sql"
```

Luego editar `dump-neondb-clean.sql` y:

1. **Eliminar** la línea `\restrict ...` al inicio del archivo.
2. **Reemplazar** todas las ocurrencias de `OWNER TO postgres` por `OWNER TO neondb_owner`.
3. **Eliminar** las líneas de `GRANT` y `REVOKE` al final del archivo (si las hay) que referencien roles que no existen en Neon.

**O automatizar con PowerShell:**

```powershell
# Leer el dump
$content = Get-Content "docs\misc\dumps\dump-postgres-202606181823.sql" -Raw

# Eliminar la línea \restrict
$content = $content -replace '(?m)^\\restrict.*$\r?\n', ''

# Reemplazar OWNER TO postgres por OWNER TO neondb_owner
$content = $content -replace 'OWNER TO postgres', 'OWNER TO neondb_owner'

# Guardar el dump limpio
$content | Set-Content "docs\misc\dumps\dump-neondb-clean.sql" -Encoding UTF8
```

#### Paso 3: Ejecutar la restauración

```powershell
# Usando psql (debe estar en el PATH)
psql "postgresql://neondb_owner:npg_ALT2in3cRzBl@ep-wandering-poetry-ah4wxqi1.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" -f "docs\misc\dumps\dump-neondb-clean.sql"
```

> [!IMPORTANT]
> Para la restauración, usa la conexión **directa** (sin `-pooler` en el host) para evitar problemas con transacciones largas.

### Opción B: Usando DBeaver (Alternativa visual)

1. **Conectarte a Neon DB** desde DBeaver (paso 3 de esta guía).
2. Abrir un **nuevo editor SQL** (clic derecho en la conexión → `Editor SQL → Nuevo editor SQL`).
3. **Abrir el archivo** `dump-neondb-clean.sql` (el limpio, no el original).
4. **Ejecutar todo el script**: `Ctrl + Alt + X` o botón **"Ejecutar Script SQL"**.
5. Esperar a que termine la ejecución.

> [!NOTE]
> DBeaver puede tardar más que `psql` para scripts grandes. Si hay errores, se mostrarán en la pestaña de resultados.

---

## 5️⃣ Verificar Datos Migrados

Una vez restaurado el dump, verificar que los datos estén completos:

### Queries de verificación (ejecutar en DBeaver conectado a Neon DB)

```sql
-- Contar registros en tablas principales
SELECT 'empresa' AS tabla, COUNT(*) AS registros FROM empresa
UNION ALL SELECT 'cargo', COUNT(*) FROM cargo
UNION ALL SELECT 'estado', COUNT(*) FROM estado
UNION ALL SELECT 'plataforma', COUNT(*) FROM plataforma
UNION ALL SELECT 'modalidad', COUNT(*) FROM modalidad
UNION ALL SELECT 'ubicacion', COUNT(*) FROM ubicacion
UNION ALL SELECT 'tecnologia', COUNT(*) FROM tecnologia
UNION ALL SELECT 'metodo_evaluacion', COUNT(*) FROM metodo_evaluacion
UNION ALL SELECT 'postulacion', COUNT(*) FROM postulacion
UNION ALL SELECT 'postulacion_tecnologia', COUNT(*) FROM postulacion_tecnologia
UNION ALL SELECT 'postulacion_metodo', COUNT(*) FROM postulacion_metodo
UNION ALL SELECT 'nivel_experiencia', COUNT(*) FROM nivel_experiencia
UNION ALL SELECT 'fase_seguimiento', COUNT(*) FROM fase_seguimiento
UNION ALL SELECT 'postulacion_seguimiento', COUNT(*) FROM postulacion_seguimiento
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuarios
ORDER BY tabla;
```

### Conteos esperados (según dump actual)

| Tabla | Registros esperados |
|-------|-------------------|
| empresa | 22 |
| cargo | 11 |
| estado | 7 |
| plataforma | 9 |
| modalidad | 3 |
| ubicacion | ~5 |
| tecnologia | ~57 |
| metodo_evaluacion | 7 |
| postulacion | ~22 |
| nivel_experiencia | 4 |
| fase_seguimiento | 11 |
| usuarios | ~1 |

---

## 🔄 Próximos Pasos (Pendientes)

Una vez la DB esté migrada y verificada:

- [ ] Actualizar el `.env` del API backend con la connection string de Neon DB
- [ ] Desplegar el API (pendiente decisión de plataforma)
- [ ] Desplegar el Frontend (pendiente decisión de plataforma)
- [ ] Verificar que la aplicación funcione end-to-end con la DB en la nube

---

## 📝 Notas Adicionales

- **Neon DB Free Tier** incluye: 0.5 GiB de almacenamiento, 1 proyecto, 10 branches.
- **Connection Pooling** está habilitado (usa el host con `-pooler` para la app en producción).
- **Backups**: Neon DB incluye point-in-time recovery automático.
- El dump original se mantiene en `docs/misc/dumps/` como respaldo histórico.
