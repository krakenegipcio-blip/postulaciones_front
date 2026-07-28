# Plan de Implementación - 27/07/2026

## 1. Preguntas Frecuentes en Seguimiento
Se integrará la capacidad de asociar preguntas frecuentes directamente desde el formulario de cada paso de seguimiento (SeguimientoTimeline), permitiendo tanto seleccionar preguntas existentes como crear nuevas.

### Frontend
- **SeguimientoTimeline.tsx**:
  - Implementar un buscador/creador de preguntas similar al de Tecnologías.
  - Al seleccionar una pregunta, se asociará al paso de seguimiento.
  - Al crear una nueva, se enviará al backend, se recargará el catálogo y se seleccionará automáticamente.
  - Mostrar las preguntas seleccionadas con un diseño similar a las tecnologías/métodos.

### Backend
- La tabla `preguntas_frecuentes` ya existe.
- La tabla intermedia `seguimiento_pregunta` ya existe.
- El endpoint `POST /api/postulaciones/:id/seguimiento` ya maneja `preguntas_ids`.
- El endpoint `GET /api/postulaciones/:id/seguimiento` ya retorna las preguntas asociadas.

---

## 2. Orden en Fases de Seguimiento
Se permitirá especificar un orden personalizado para las fases de seguimiento, facilitando la inserción de pasos intermedios.

### Base de Datos
- La tabla `fase_seguimiento` ya tiene una columna `orden_default`. Se usará esta columna para la lógica de reordenamiento.

### Frontend
- **FasesPage.tsx**: (Opcional, si no existe) Permitir editar el campo `orden_default`.
- **SeguimientoTimeline.tsx**: 
  - Al agregar un nuevo paso, la lógica por defecto será "después del último" según el orden.
  - Se debe asegurar que la interfaz refleje este orden.

### Backend
- El endpoint genérico de catálogos ya permite actualizar registros.

---

## Dudas y Observaciones
1. **Creación de Preguntas**: ¿La creación de una pregunta desde el seguimiento debe incluir la respuesta de inmediato o puede quedar solo la pregunta para completarse luego? (Se asume creación rápida solo con texto de la pregunta por ahora).
2. **Impacto en "Orden"**: Si muevo una fase a un orden intermedio, ¿deseas que el sistema reajuste automáticamente los órdenes de las fases posteriores o se hará de forma manual?
3. **Ubicación UI**: Se solicita "arriba de notas". Se ajustará el layout del formulario de seguimiento para cumplir con esto.
