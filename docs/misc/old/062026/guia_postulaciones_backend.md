# 🚀 Guía Completa: Backend Express.js Separado + Migración del Frontend

> Documento operativo para crear `postulaciones_backend` como proyecto Express.js independiente y adaptar `postulaciones_analisis_final` (frontend) para consumirlo.

---

## 📐 Arquitectura: Antes vs Después

```mermaid
graph LR
    subgraph "ANTES — Monolito"
        A["postulaciones_analisis_final/"]
        A --> B["src/ (React + Vite)"]
        A --> C["server/ (Express API)"]
        A --> D["PostgreSQL Local"]
        B -- "Proxy /api → :3001" --> C
        C --> D
    end
```

```mermaid
graph LR
    subgraph "DESPUÉS — Separados"
        E["postulaciones_analisis_final/"]
        F["postulaciones_backend/"]
        E -- "fetch http://localhost:3001/api/*" --> F
        F --> G["PostgreSQL Local"]
    end
```

| Componente | Antes | Después |
|---|---|---|
| Frontend | `postulaciones_analisis_final/` con proxy Vite | `postulaciones_analisis_final/` apuntando a URL del backend |
| Backend | `server/` dentro del mismo repo | `postulaciones_backend/` — repo independiente |
| Base de datos | Igual | Igual (misma PostgreSQL local) |
| Comunicación | Proxy Vite `/api` → `localhost:3001` | Llamadas directas con CORS habilitado |

---

# PARTE 1: Setup del Backend (`postulaciones_backend`)

## Paso 1 — Inicializar el proyecto Node.js

```powershell
# Navegar a la carpeta del backend (ya existe con .git)
cd c:\Users\djara\Documents\REPOSITORIOSyLABORAL\POSTULACIONES\postulaciones_backend

# Inicializar package.json
npm init -y
```

Después de ejecutar `npm init -y`, editar el `package.json` generado para que quede así:

```json
{
  "name": "postulaciones_backend",
  "version": "1.0.0",
  "description": "Backend Express.js para gestión de postulaciones laborales",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

> [!IMPORTANT]
> `"type": "module"` es necesario para usar `import/export` en Node.js, igual que en el proyecto actual.

---

## Paso 2 — Instalar dependencias

```powershell
# Dependencias de producción
npm install express cors pg dotenv

# Dependencias de desarrollo
npm install -D typescript tsx @types/express @types/cors @types/pg @types/node
```

### Tabla de dependencias

| Paquete | Tipo | Propósito |
|---|---|---|
| `express` | prod | Framework HTTP para la API REST |
| `cors` | prod | Permitir peticiones cross-origin desde el frontend |
| `pg` | prod | Driver de PostgreSQL (pool de conexiones) |
| `dotenv` | prod | Cargar variables de entorno desde `.env` |
| `typescript` | dev | Compilador TypeScript |
| `tsx` | dev | Ejecutar `.ts` en desarrollo con hot-reload (`tsx watch`) |
| `@types/express` | dev | Tipos TypeScript para Express |
| `@types/cors` | dev | Tipos TypeScript para CORS |
| `@types/pg` | dev | Tipos TypeScript para pg |
| `@types/node` | dev | Tipos TypeScript para Node.js |

---

## Paso 3 — Configurar TypeScript

```powershell
npx tsc --init
```

Luego editar el `tsconfig.json` generado para que quede así:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Paso 4 — Crear la estructura de carpetas

```powershell
# Crear estructura del proyecto
mkdir src
mkdir src\routes
mkdir src\config
```

La estructura final será:

```
postulaciones_backend/
├── src/
│   ├── index.ts              # Entry point — app.listen()
│   ├── config/
│   │   └── db.ts             # Pool de conexión PostgreSQL
│   └── routes/
│       ├── postulaciones.ts  # CRUD postulaciones + filtros + paginación
│       ├── dashboard.ts      # Endpoint de análisis/dashboard
│       └── catalogs.ts       # CRUD genérico de catálogos (9 tablas)
├── .env                      # Variables de entorno (NO commitear)
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Paso 5 — Crear `.gitignore`

```gitignore
node_modules/
dist/
.env
```

---

## Paso 6 — Crear `.env`

```env
DATABASE_URL="postgresql://postgres:yes120yes@localhost:5432/postgres"
PORT=3001
```

> [!WARNING]
> Esta es la misma connection string que tienes en el frontend actual. En producción (ej: Render), cambiarás esto por la URL de tu base de datos remota (Neon, Supabase, etc.).

---

## Paso 7 — Crear los archivos del backend

### 7.1 — `src/config/db.ts` (Conexión a PostgreSQL)

```typescript
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

---

### 7.2 — `src/routes/catalogs.ts` (CRUD genérico de catálogos)

Este archivo maneja las 9 tablas de catálogos con rutas dinámicas:

```typescript
import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

const ALLOWED_TABLES = [
  'empresa', 'cargo', 'estado', 'plataforma',
  'modalidad', 'ubicacion', 'tecnologia',
  'metodo_evaluacion', 'nivel_experiencia',
];

// GET /api/:table
router.get('/:table', async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Tabla no permitida' });
  try {
    if (table === 'tecnologia') {
      const { rows } = await pool.query(`
        SELECT t.*, row_to_json(p.*) as padre
        FROM tecnologia t LEFT JOIN tecnologia p ON t.id_padre = p.id
        ORDER BY t.orden ASC, t.nombre ASC
      `);
      return res.json(rows);
    }
    const orderBy = table === 'cargo' ? 'orden ASC, nombre ASC'
      : (table === 'nivel_experiencia' ? 'orden ASC, nombre ASC' : 'id ASC');
    const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
    res.json(rows);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// POST /api/:table
router.post('/:table', async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Tabla no permitida' });
  try {
    const keys = Object.keys(req.body);
    const vals = Object.values(req.body);
    const ph = keys.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await pool.query(
      `INSERT INTO ${table} (${keys.join(',')}) VALUES (${ph}) RETURNING *`, vals
    );
    res.json(rows[0]);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// PUT /api/:table/:id
router.put('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Tabla no permitida' });
  try {
    const keys = Object.keys(req.body);
    const vals = [...Object.values(req.body), id];
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    await pool.query(`UPDATE ${table} SET ${sets} WHERE id = $${vals.length}`, vals);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/:table/:id
router.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Tabla no permitida' });
  try {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
```

---

### 7.3 — `src/routes/postulaciones.ts` (CRUD de postulaciones)

```typescript
import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// GET /api/postulaciones (con filtros, paginación, ordenamiento)
router.get('/', async (req, res) => {
  try {
    const { page = '1', per_page = '15', sort_col = 'id', sort_dir = 'asc',
            id_empresa, id_estado, id_modalidad, id_cargo, sueldo_min, sueldo_max,
            search, tecnologias } = req.query as Record<string, string>;

    const allowedSort = ['id', 'id_empresa', 'id_cargo', 'id_estado', 'id_modalidad', 'sueldo_ofrecido', 'fecha_postulacion'];
    const col = allowedSort.includes(sort_col) ? `p.${sort_col}` : 'p.id';
    const dir = sort_dir === 'desc' ? 'DESC' : 'ASC';

    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (id_empresa) { conditions.push(`p.id_empresa = $${idx++}`); params.push(Number(id_empresa)); }
    if (id_estado) { conditions.push(`p.id_estado = $${idx++}`); params.push(Number(id_estado)); }
    if (id_modalidad) { conditions.push(`p.id_modalidad = $${idx++}`); params.push(Number(id_modalidad)); }
    if (id_cargo) { conditions.push(`p.id_cargo = $${idx++}`); params.push(Number(id_cargo)); }
    if (sueldo_min) { conditions.push(`p.sueldo_ofrecido >= $${idx++}`); params.push(Number(sueldo_min)); }
    if (sueldo_max) { conditions.push(`p.sueldo_ofrecido <= $${idx++}`); params.push(Number(sueldo_max)); }
    if (search) {
      conditions.push(`(e.nombre ILIKE $${idx} OR c.nombre ILIKE $${idx} OR EXISTS (
        SELECT 1 FROM postulacion_tecnologia pt2 JOIN tecnologia t2 ON pt2.id_tecnologia = t2.id
        WHERE pt2.id_postulacion = p.id AND t2.nombre ILIKE $${idx}
      ))`);
      params.push(`%${search}%`);
      idx++;
    }
    if (tecnologias) {
      const tecIds = tecnologias.split(',').map(Number).filter(n => !isNaN(n));
      if (tecIds.length > 0) {
        conditions.push(`p.id IN (
          SELECT id_postulacion FROM postulacion_tecnologia
          WHERE id_tecnologia = ANY($${idx++})
          GROUP BY id_postulacion HAVING COUNT(DISTINCT id_tecnologia) = $${idx++}
        )`);
        params.push(tecIds, tecIds.length);
      }
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (Number(page) - 1) * Number(per_page);

    // Count
    const countQ = `SELECT COUNT(*) as total FROM postulacion p
      LEFT JOIN empresa e ON p.id_empresa = e.id
      LEFT JOIN cargo c ON p.id_cargo = c.id
      ${where}`;
    const { rows: countRows } = await pool.query(countQ, params);
    const total = Number(countRows[0].total);

    // Main query
    const mainQ = `
      SELECT p.*,
        row_to_json(e) as empresa, row_to_json(c) as cargo,
        row_to_json(s) as estado, row_to_json(pl) as plataforma,
        row_to_json(m) as modalidad, row_to_json(u) as ubicacion,
        row_to_json(ne) as nivel_experiencia
      FROM postulacion p
      LEFT JOIN empresa e ON p.id_empresa = e.id
      LEFT JOIN cargo c ON p.id_cargo = c.id
      LEFT JOIN estado s ON p.id_estado = s.id
      LEFT JOIN plataforma pl ON p.id_plataforma = pl.id
      LEFT JOIN modalidad m ON p.id_modalidad = m.id
      LEFT JOIN ubicacion u ON p.id_ubicacion = u.id
      LEFT JOIN nivel_experiencia ne ON p.id_nivel = ne.id
      ${where}
      ORDER BY ${col} ${dir}
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    params.push(Number(per_page), offset);
    const { rows } = await pool.query(mainQ, params);

    // Load tecnologias & metodos
    const ids = rows.map(r => r.id);
    if (ids.length > 0) {
      const { rows: tecRows } = await pool.query(
        `SELECT pt.id_postulacion, t.id, t.nombre, t.color_hex
         FROM postulacion_tecnologia pt JOIN tecnologia t ON pt.id_tecnologia = t.id
         WHERE pt.id_postulacion = ANY($1)`, [ids]
      );
      const { rows: metRows } = await pool.query(
        `SELECT pm.id_postulacion, me.id, me.nombre, me.color_hex
         FROM postulacion_metodo pm JOIN metodo_evaluacion me ON pm.id_metodo_evaluacion = me.id
         WHERE pm.id_postulacion = ANY($1)`, [ids]
      );
      const tecMap: Record<number, any[]> = {};
      const metMap: Record<number, any[]> = {};
      tecRows.forEach(r => { (tecMap[r.id_postulacion] ??= []).push({ id: r.id, nombre: r.nombre, color_hex: r.color_hex }); });
      metRows.forEach(r => { (metMap[r.id_postulacion] ??= []).push({ id: r.id, nombre: r.nombre, color_hex: r.color_hex }); });
      rows.forEach(r => { r.tecnologias = tecMap[r.id] ?? []; r.metodos = metMap[r.id] ?? []; });
    }

    res.json({ rows, total });
  } catch (err: any) { console.error(err); res.status(500).json({ error: err.message }); }
});

// POST /api/postulaciones (con transacción)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { tecnologias, metodos, ...payload } = req.body;
    await client.query('BEGIN');

    const keys = Object.keys(payload);
    const vals = Object.values(payload);
    const ph = keys.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await client.query(
      `INSERT INTO postulacion (${keys.join(',')}) VALUES (${ph}) RETURNING id`, vals
    );
    const id = rows[0].id;

    if (tecnologias?.length > 0) {
      const tecVals = tecnologias.map((_: number, i: number) => `($1, $${i + 2})`).join(',');
      await client.query(
        `INSERT INTO postulacion_tecnologia (id_postulacion, id_tecnologia) VALUES ${tecVals}`,
        [id, ...tecnologias]
      );
    }
    if (metodos?.length > 0) {
      const metVals = metodos.map((_: number, i: number) => `($1, $${i + 2})`).join(',');
      await client.query(
        `INSERT INTO postulacion_metodo (id_postulacion, id_metodo_evaluacion) VALUES ${metVals}`,
        [id, ...metodos]
      );
    }

    await client.query('COMMIT');
    res.json({ id });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error(err); res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

// PUT /api/postulaciones/:id (con transacción)
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const postId = Number(req.params.id);
    const { tecnologias, metodos, ...payload } = req.body;
    await client.query('BEGIN');

    const keys = Object.keys(payload);
    const vals = Object.values(payload);
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    vals.push(postId);
    await client.query(`UPDATE postulacion SET ${sets} WHERE id = $${vals.length}`, vals);

    // Reemplazar relaciones
    await client.query('DELETE FROM postulacion_tecnologia WHERE id_postulacion = $1', [postId]);
    if (tecnologias?.length > 0) {
      const tecVals = tecnologias.map((_: number, i: number) => `($1, $${i + 2})`).join(',');
      await client.query(
        `INSERT INTO postulacion_tecnologia (id_postulacion, id_tecnologia) VALUES ${tecVals}`,
        [postId, ...tecnologias]
      );
    }
    await client.query('DELETE FROM postulacion_metodo WHERE id_postulacion = $1', [postId]);
    if (metodos?.length > 0) {
      const metVals = metodos.map((_: number, i: number) => `($1, $${i + 2})`).join(',');
      await client.query(
        `INSERT INTO postulacion_metodo (id_postulacion, id_metodo_evaluacion) VALUES ${metVals}`,
        [postId, ...metodos]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error(err); res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

// DELETE /api/postulaciones/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM postulacion WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
```

---

### 7.4 — `src/routes/dashboard.ts` (Endpoint de análisis)

```typescript
import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const { rows: [{ total }] } = await pool.query('SELECT COUNT(*)::int as total FROM postulacion');

    const { rows: tecnologias } = await pool.query(`
      SELECT t.id, t.nombre, t.color_hex, COUNT(*)::int as count
      FROM postulacion_tecnologia pt JOIN tecnologia t ON pt.id_tecnologia = t.id
      GROUP BY t.id, t.nombre, t.color_hex ORDER BY count DESC LIMIT 12
    `);

    const { rows: [inglesRow] } = await pool.query(`
      SELECT COUNT(*)::int as count FROM postulacion_tecnologia pt
      JOIN tecnologia t ON pt.id_tecnologia = t.id WHERE t.nombre = 'Inglés'
    `);
    const conIngles = inglesRow?.count ?? 0;

    const { rows: cargos } = await pool.query(`
      SELECT c.nombre, COUNT(*)::int as count FROM postulacion p
      JOIN cargo c ON p.id_cargo = c.id GROUP BY c.nombre ORDER BY count DESC LIMIT 8
    `);

    // Stack combos
    const { rows: tecRel } = await pool.query(`
      SELECT pt.id_postulacion, t.nombre FROM postulacion_tecnologia pt
      JOIN tecnologia t ON pt.id_tecnologia = t.id
    `);
    const postTecMap: Record<number, string[]> = {};
    tecRel.forEach(r => { (postTecMap[r.id_postulacion] ??= []).push(r.nombre); });
    const comboMap: Record<string, number> = {};
    Object.values(postTecMap).forEach(names => {
      const sorted = [...names].sort();
      for (let i = 0; i < sorted.length; i++)
        for (let j = i + 1; j < sorted.length; j++) {
          const key = `${sorted[i]} + ${sorted[j]}`;
          comboMap[key] = (comboMap[key] ?? 0) + 1;
        }
    });
    const stacks = Object.entries(comboMap).map(([stack, count]) => ({ stack, count }))
      .sort((a, b) => b.count - a.count).slice(0, 8);

    const { rows: metodos } = await pool.query(`
      SELECT me.nombre, me.color_hex, COUNT(*)::int as count
      FROM postulacion_metodo pm JOIN metodo_evaluacion me ON pm.id_metodo_evaluacion = me.id
      GROUP BY me.nombre, me.color_hex ORDER BY count DESC
    `);

    const { rows: porEstado } = await pool.query(`
      SELECT s.nombre, s.color_hex, COUNT(*)::int as count FROM postulacion p
      JOIN estado s ON p.id_estado = s.id GROUP BY s.nombre, s.color_hex ORDER BY count DESC
    `);

    const { rows: porModalidad } = await pool.query(`
      SELECT m.nombre, m.color_hex, COUNT(*)::int as count FROM postulacion p
      JOIN modalidad m ON p.id_modalidad = m.id GROUP BY m.nombre, m.color_hex ORDER BY count DESC
    `);

    res.json({
      totalPostulaciones: total, conIngles, sinIngles: total - conIngles,
      tecnologias, cargos, stacks, metodos, porEstado, porModalidad,
    });
  } catch (err: any) { console.error(err); res.status(500).json({ error: err.message }); }
});

export default router;
```

---

### 7.5 — `src/index.ts` (Entry point)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import postulacionesRouter from './routes/postulaciones.js';
import dashboardRouter from './routes/dashboard.js';
import catalogsRouter from './routes/catalogs.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas específicas PRIMERO (deben ir antes de las genéricas)
app.use('/api/postulaciones', postulacionesRouter);
app.use('/api/dashboard', dashboardRouter);

// Rutas genéricas de catálogos AL FINAL
app.use('/api', catalogsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ API Server corriendo en http://localhost:${port}`);
});
```

> [!IMPORTANT]
> **Orden de rutas**: Las rutas específicas (`/api/postulaciones`, `/api/dashboard`) se montan **antes** que las genéricas (`/api/:table`). Esto es crítico porque Express evalúa las rutas en orden y `/:table` capturaría `postulaciones` y `dashboard` si estuviera primero.

---

## Paso 8 — Ejecutar el backend

```powershell
# Desde postulaciones_backend/
npm run dev
```

Deberías ver:
```
✅ API Server corriendo en http://localhost:3001
```

### Verificar que funciona:

```powershell
# En otra terminal:
curl http://localhost:3001/api/health
# → { "status": "ok", "timestamp": "..." }

curl http://localhost:3001/api/empresa
# → [{ "id": 1, "nombre": "Sin especificar", ... }, ...]

curl http://localhost:3001/api/postulaciones?page=1&per_page=5
# → { "rows": [...], "total": N }
```

---

## Resumen de comandos (en orden)

```powershell
cd c:\Users\djara\Documents\REPOSITORIOSyLABORAL\POSTULACIONES\postulaciones_backend

npm init -y
npm install express cors pg dotenv
npm install -D typescript tsx @types/express @types/cors @types/pg @types/node
npx tsc --init

mkdir src
mkdir src\routes
mkdir src\config

# ... crear los archivos listados arriba ...

npm run dev
```

---

# PARTE 2: Checklist de Migración del Frontend

## 📋 Inventario de Endpoints (todos deben funcionar igual)

| # | Método | Endpoint | Usado por |
|---|--------|----------|-----------|
| 1 | `GET` | `/api/postulaciones?page=&per_page=&sort_col=&sort_dir=&...` | `usePostulaciones.ts` |
| 2 | `POST` | `/api/postulaciones` | `PostulacionForm.tsx` |
| 3 | `PUT` | `/api/postulaciones/:id` | `PostulacionForm.tsx` |
| 4 | `DELETE` | `/api/postulaciones/:id` | `PostulacionesPage.tsx` |
| 5 | `GET` | `/api/dashboard` | `AnalisisPage.tsx` |
| 6 | `GET` | `/api/empresa` | `useData.ts` → `useEmpresas()` |
| 7 | `POST` | `/api/empresa` | `PostulacionForm.tsx` (inline create) |
| 8 | `PUT` | `/api/empresa/:id` | `EmpresasPage.tsx` |
| 9 | `DELETE` | `/api/empresa/:id` | `EmpresasPage.tsx` |
| 10 | `GET` | `/api/cargo` | `useData.ts` → `useCargos()` |
| 11 | `POST` | `/api/cargo` | `PostulacionForm.tsx` (inline create) |
| 12 | `PUT` | `/api/cargo/:id` | `CargosPage.tsx` |
| 13 | `DELETE` | `/api/cargo/:id` | `CargosPage.tsx` |
| 14 | `GET` | `/api/estado` | `useData.ts` → `useEstados()` |
| 15 | `POST/PUT/DELETE` | `/api/estado[/:id]` | `EstadosPage.tsx` |
| 16 | `GET` | `/api/plataforma` | `useData.ts` → `usePlataformas()` |
| 17 | `POST/PUT/DELETE` | `/api/plataforma[/:id]` | `PlataformasPage.tsx` |
| 18 | `GET` | `/api/modalidad` | `useData.ts` → `useModalidades()` |
| 19 | `POST/PUT/DELETE` | `/api/modalidad[/:id]` | `ModalidadesPage.tsx` |
| 20 | `GET` | `/api/ubicacion` | `useData.ts` → `useUbicaciones()` |
| 21 | `POST/PUT/DELETE` | `/api/ubicacion[/:id]` | `UbicacionesPage.tsx` |
| 22 | `GET` | `/api/tecnologia` | `useData.ts` → `useTecnologias()` |
| 23 | `POST` | `/api/tecnologia` | `PostulacionForm.tsx` + `TecnologiasPage.tsx` |
| 24 | `PUT/DELETE` | `/api/tecnologia/:id` | `TecnologiasPage.tsx` |
| 25 | `GET` | `/api/metodo_evaluacion` | `useData.ts` → `useMetodos()` |
| 26 | `POST/PUT/DELETE` | `/api/metodo_evaluacion[/:id]` | `MetodosPage.tsx` |
| 27 | `GET` | `/api/nivel_experiencia` | `useData.ts` → `useNiveles()` |
| 28 | `POST/PUT/DELETE` | `/api/nivel_experiencia[/:id]` | `NivelesPage.tsx` |

---

## ✅ Checklist Paso a Paso

### Fase A — Preparar variable de entorno en el frontend

- [ ] **A.1** Crear archivo `.env` en la raíz de `postulaciones_analisis_final/` (si no existe ya uno adecuado) con:
  ```env
  VITE_API_URL=http://localhost:3001/api
  ```
  > En producción esto será la URL del backend desplegado (ej: `https://postulaciones-backend.onrender.com/api`)

---

### Fase B — Modificar `src/lib/api.ts` (el punto más crítico)

- [ ] **B.1** Cambiar la constante `API_URL` de:
  ```typescript
  // ANTES
  const API_URL = '/api';
  ```
  A:
  ```typescript
  // DESPUÉS
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  ```

> [!IMPORTANT]
> Este es **el único cambio funcional necesario** en el frontend. Toda la lógica de `apiFetch()` y los tipos ya están correctos. Al cambiar la URL base, todas las llamadas (hooks, páginas, formularios) se redirigirán automáticamente al backend separado.

**Archivos que usan `apiFetch` y se benefician automáticamente:**

| Archivo | Llamadas que hace |
|---|---|
| [useData.ts](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/hooks/useData.ts) | `apiFetch('/{table}')` para los 9 catálogos |
| [usePostulaciones.ts](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/hooks/usePostulaciones.ts) | `apiFetch('/postulaciones?...')` |
| [PostulacionesPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/PostulacionesPage.tsx) | `apiFetch('/postulaciones/:id', DELETE)` |
| [PostulacionForm.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/components/postulaciones/PostulacionForm.tsx) | `apiFetch('/postulaciones', POST/PUT)`, `apiFetch('/empresa', POST)`, `apiFetch('/cargo', POST)`, `apiFetch('/tecnologia', POST)` |
| [AnalisisPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/AnalisisPage.tsx) | `apiFetch('/dashboard')` |
| [TecnologiasPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/TecnologiasPage.tsx) | `apiFetch('/tecnologia[/:id]', GET/POST/PUT/DELETE)` |
| [EmpresasPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/EmpresasPage.tsx) | `apiFetch('/empresa[/:id]', POST/PUT/DELETE)` |
| [CargosPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/CargosPage.tsx) | `apiFetch('/cargo[/:id]', POST/PUT/DELETE)` |
| [EstadosPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/EstadosPage.tsx) | `apiFetch('/estado[/:id]', POST/PUT/DELETE)` |
| [MetodosPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/MetodosPage.tsx) | `apiFetch('/metodo_evaluacion[/:id]', POST/PUT/DELETE)` |
| [PlataformasPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/PlataformasPage.tsx) | `apiFetch('/plataforma[/:id]', POST/PUT/DELETE)` |
| [ModalidadesPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/ModalidadesPage.tsx) | `apiFetch('/modalidad[/:id]', POST/PUT/DELETE)` |
| [UbicacionesPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/UbicacionesPage.tsx) | `apiFetch('/ubicacion[/:id]', POST/PUT/DELETE)` |
| [NivelesPage.tsx](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/src/pages/NivelesPage.tsx) | `apiFetch('/nivel_experiencia[/:id]', POST/PUT/DELETE)` |

---

### Fase C — Eliminar el proxy de Vite

- [ ] **C.1** Modificar [vite.config.ts](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/vite.config.ts), eliminar la sección `server.proxy`:

  ```diff
   export default defineConfig({
     plugins: [react()],
     optimizeDeps: {
       exclude: ['lucide-react'],
     },
  -  server: {
  -    proxy: {
  -      '/api': 'http://localhost:3001',
  -    },
  -  },
   });
  ```

  > El proxy ya no es necesario porque el frontend ahora hace llamadas directas con la URL completa del backend.

---

### Fase D — Eliminar la carpeta `server/` del frontend

- [ ] **D.1** Eliminar la carpeta `postulaciones_analisis_final/server/` completa:
  ```powershell
  Remove-Item -Recurse -Force c:\Users\djara\Documents\REPOSITORIOSyLABORAL\POSTULACIONES\postulaciones_analisis_final\server
  ```
  
  Archivos eliminados:
  - `server/index.ts` (314 líneas — toda la API Express)
  - `server/db.ts` (11 líneas — pool de conexión)

---

### Fase E — Limpiar dependencias del frontend

- [ ] **E.1** Desinstalar paquetes de backend del `package.json` del frontend:

  ```powershell
  cd c:\Users\djara\Documents\REPOSITORIOSyLABORAL\POSTULACIONES\postulaciones_analisis_final
  
  # Dependencias de producción que ya no necesita el frontend
  npm uninstall express cors pg dotenv
  
  # Dependencias de desarrollo que ya no necesita el frontend
  npm uninstall @types/express @types/cors @types/pg concurrently tsx
  ```

  **Dependencias que se eliminan:**

  | Paquete | Razón |
  |---|---|
  | `express` | El backend ya no vive aquí |
  | `cors` | Solo se usa en el backend |
  | `pg` | Solo se usa en el backend |
  | `dotenv` | Solo se usaba para el server |
  | `@types/express` | Ya no hay código Express |
  | `@types/cors` | Ya no hay código CORS |
  | `@types/pg` | Ya no hay código pg |
  | `concurrently` | Ya no se corren dos procesos juntos |
  | `tsx` | Ya no hay TypeScript de servidor para ejecutar |

---

### Fase F — Actualizar scripts del `package.json` del frontend

- [ ] **F.1** Modificar la sección `scripts` de [package.json](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/package.json):

  ```diff
   "scripts": {
  -  "dev:frontend": "vite",
  -  "dev:backend": "tsx watch server/index.ts",
  -  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
  +  "dev": "vite",
     "build": "vite build",
     "lint": "eslint .",
     "preview": "vite preview",
     "typecheck": "tsc --noEmit -p tsconfig.app.json"
   }
  ```

---

### Fase G — Actualizar `.env` del frontend

- [ ] **G.1** Reemplazar contenido de [.env](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/.env):

  ```diff
  -DATABASE_URL="postgresql://postgres:yes120yes@localhost:5432/postgres"
  -PORT=3001
  +VITE_API_URL=http://localhost:3001/api
  ```

  > En Vite, las variables de entorno deben empezar con `VITE_` para ser accesibles en el código del cliente mediante `import.meta.env.VITE_*`.

---

### Fase H — Actualizar `.gitignore` del frontend

- [ ] **H.1** Verificar que `.env` esté en [.gitignore](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/.gitignore) (ya debería estar).

---

### Fase I — Verificación Final

- [ ] **I.1** Arrancar el backend en una terminal:
  ```powershell
  cd c:\Users\djara\Documents\REPOSITORIOSyLABORAL\POSTULACIONES\postulaciones_backend
  npm run dev
  # → ✅ API Server corriendo en http://localhost:3001
  ```

- [ ] **I.2** Arrancar el frontend en otra terminal:
  ```powershell
  cd c:\Users\djara\Documents\REPOSITORIOSyLABORAL\POSTULACIONES\postulaciones_analisis_final
  npm run dev
  # → Vite arranca en http://localhost:5173
  ```

- [ ] **I.3** Verificar cada funcionalidad:

  | # | Funcionalidad | Cómo verificar |
  |---|---|---|
  | 1 | Lista de postulaciones | Abrir app → ver tabla con datos |
  | 2 | Paginación | Cambiar de página en la tabla |
  | 3 | Ordenamiento | Click en cabecera de columna (id, empresa, etc.) |
  | 4 | Filtros | Abrir panel de filtros → filtrar por estado, empresa, etc. |
  | 5 | Búsqueda | Escribir en la barra de búsqueda |
  | 6 | Crear postulación | Click "Agregar" → llenar formulario → Guardar |
  | 7 | Editar postulación | Click ícono de editar → modificar → Guardar |
  | 8 | Ver detalle | Click ícono de ojo → verificar modo solo lectura |
  | 9 | Eliminar postulación | Click ícono de basura → confirmar |
  | 10 | Dashboard/Análisis | Ir a "Análisis" → verificar gráficos y datos |
  | 11 | CRUD Empresas | Ir a Empresas → crear, editar, eliminar |
  | 12 | CRUD Cargos | Ir a Cargos → crear, editar, eliminar |
  | 13 | CRUD Estados | Ir a Estados → crear, editar, eliminar |
  | 14 | CRUD Plataformas | Ir a Plataformas → crear, editar, eliminar |
  | 15 | CRUD Modalidades | Ir a Modalidades → crear, editar, eliminar |
  | 16 | CRUD Ubicaciones | Ir a Ubicaciones → crear, editar, eliminar |
  | 17 | CRUD Tecnologías | Ir a Tecnologías → crear, editar, eliminar (con padre y color) |
  | 18 | CRUD Métodos Eval. | Ir a Métodos → crear, editar, eliminar |
  | 19 | CRUD Niveles | Ir a Niveles → crear, editar, eliminar |
  | 20 | Crear empresa inline | En formulario de postulación → escribir empresa nueva → click "+" |
  | 21 | Crear cargo inline | En formulario de postulación → escribir cargo nuevo → click "+" |
  | 22 | Crear tecnología inline | En formulario de postulación → escribir tecnología nueva → click "+" |

- [ ] **I.4** Verificar en la consola del navegador (F12) que **NO haya errores de CORS** ni errores de red.

---

## 🏗️ Resumen de archivos modificados en el frontend

| Archivo | Cambio |
|---|---|
| `src/lib/api.ts` | Cambiar `API_URL` para usar `import.meta.env.VITE_API_URL` |
| `vite.config.ts` | Eliminar sección `server.proxy` |
| `package.json` | Actualizar scripts, eliminar dependencias de backend |
| `.env` | Reemplazar `DATABASE_URL` por `VITE_API_URL` |
| `server/` (carpeta) | **ELIMINAR** completamente |

**Archivos que NO se modifican** (funcionan automáticamente porque todos pasan por `apiFetch`):

- Todos los hooks (`useData.ts`, `usePostulaciones.ts`)
- Todas las 11 páginas
- Todos los componentes (`PostulacionForm.tsx`, `FilterPanel.tsx`, etc.)
- Store (`filterStore.ts`)
- Componentes UI (`Badge`, `Modal`, `Pagination`, etc.)

---

## 🎯 Notas para Despliegue (Producción)

Cuando vayas a desplegar en producción:

| Componente | Plataforma sugerida | Configuración |
|---|---|---|
| **Backend** | Render (Web Service) | Subir `postulaciones_backend/`, configurar `DATABASE_URL` y `PORT` |
| **Frontend** | Vercel / Netlify | Subir `postulaciones_analisis_final/`, configurar `VITE_API_URL` apuntando al backend en Render |
| **Base de datos** | Neon / Supabase | Migrar datos con `pg_dump` / `psql` |

> [!TIP]
> En producción, configura CORS en el backend para aceptar solo el dominio de tu frontend:
> ```typescript
> app.use(cors({ origin: 'https://tu-frontend.vercel.app' }));
> ```

---

## 📊 Schema SQL de referencia

Para crear la base de datos en un entorno nuevo, usa el schema completo que está en:
[schema.sql](file:///c:/Users/djara/Documents/REPOSITORIOSyLABORAL/POSTULACIONES/postulaciones_analisis_final/docs/old/Pasos_Inciales/schema.sql)

**Tablas del sistema:**

| Tabla | Tipo | Campos clave |
|---|---|---|
| `empresa` | Catálogo | `id`, `nombre` |
| `cargo` | Catálogo | `id`, `nombre`, `orden` |
| `estado` | Catálogo | `id`, `nombre`, `color_hex` |
| `plataforma` | Catálogo | `id`, `nombre` |
| `modalidad` | Catálogo | `id`, `nombre`, `color_hex` |
| `ubicacion` | Catálogo | `id`, `nombre` |
| `tecnologia` | Catálogo (jerárquico) | `id`, `nombre`, `id_padre`, `color_hex`, `orden` |
| `nivel_experiencia` | Catálogo | `id`, `nombre`, `orden` |
| `metodo_evaluacion` | Catálogo | `id`, `nombre`, `color_hex` |
| `postulacion` | Principal | `id`, `descripcion`, FK's a todos los catálogos, `sueldo_ofrecido`, `sueldo_pedido`, `fecha_postulacion`, etc. |
| `postulacion_tecnologia` | Pivot M:N | `id_postulacion`, `id_tecnologia` |
| `postulacion_metodo` | Pivot M:N | `id_postulacion`, `id_metodo_evaluacion` |
