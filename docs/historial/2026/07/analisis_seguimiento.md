# Análisis de Error: Falla en la adición de pasos de Seguimiento

## Problema reportado
El usuario no puede agregar pasos de seguimiento a sus postulaciones en el frontend. El botón `+ Paso` de la sección "Seguimiento" (timeline) se encuentra deshabilitado, impidiendo registrar entrevistas, llamadas u otros métodos.

## Causa raíz
La causa de este error es un problema de integridad entre el esquema de base de datos de producción (`neon_proyecto`) y el código del backend. 

Específicamente:
1. En el frontend, la habilitación del botón `+ Paso` depende de que se cargue la lista de fases del catálogo:
   `disabled={sortedFases.length === 0}` (en `SeguimientoTimeline.tsx`).
2. El frontend utiliza el hook `useFasesSeguimiento()` que hace un `GET` a `/api/fase_seguimiento`.
3. En el backend (`catalogs.ts`), todas las peticiones a los catálogos realizan la consulta con la restricción por usuario:
   `SELECT * FROM ${table} WHERE usuario_id = $1 ORDER BY ${orderBy}`
4. En la base de datos real, la tabla `fase_seguimiento` **no tiene** la columna `usuario_id`.
5. Esto ocasiona un error a nivel de base de datos (`column "usuario_id" does not exist`) resultando en una respuesta HTTP 500 por parte del backend.
6. El frontend captura el error de red, manteniendo la lista de fases en un arreglo vacío (`[]`). Esto ocasiona que el botón de añadir pasos permanezca deshabilitado por siempre.

## Contexto e Inconsistencias 
Tras investigar el código del backend, se detectó una inconsistencia en cómo se planificó y cómo se actualizó la función `fase_seguimiento`:

- En el archivo original de base de datos (`sql/seguimiento.sql`), la tabla `fase_seguimiento` fue creada **sin** la columna `usuario_id`. 
- Sin embargo, en `src/utils/seeders.ts`, la función `createInitialSeeds` sí está inyectando valores iniciales asumiendo que el campo `usuario_id` existe:
  `INSERT INTO fase_seguimiento (..., usuario_id) VALUES (..., $6)`

Esto sugiere que, en algún punto del desarrollo, se decidió que `fase_seguimiento` debía ser un catálogo individual por usuario (al igual que tecnologías, estado y empresas), y se actualizó el seeder. No obstante, **nunca se corrió la migración para añadir la columna `usuario_id` a la tabla en la base de datos de producción**.

## Soluciones posibles

Se recomienda aplicar alguna de estas 2 soluciones dependiendo de la lógica de negocio final que se desee tener:

**Opción 1: Hacer que el catálogo de fases sea local a cada usuario (Recomendado)**
- **DB**: Alterar la tabla en base de datos para añadir el campo faltante:
  `ALTER TABLE fase_seguimiento ADD COLUMN usuario_id INT REFERENCES usuarios(id);` 
- **Backend/Scripts**: Correr el seeder para que cada usuario tenga las opciones base cargadas o modificar el backend para proveer fases globales predeterminadas si el usuario no tiene ninguna creada.

**Opción 2: Mantener el catálogo de fases global para todos los usuarios**
- **Backend**: Modificar `catalogs.ts` para que si la variable `table` es `fase_seguimiento`, la consulta omita el filtro `WHERE usuario_id = $1`.
- **Backend**: Actualizar el `seeders.ts` para que no inserte datos en el catálogo `fase_seguimiento` cada vez que se crea un usuario (ya que todas las fases serían compartidas).
