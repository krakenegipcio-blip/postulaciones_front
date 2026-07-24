# Funcionalidad: Bundles de Valores por Defecto

## 1. Objetivo
Permitir a los usuarios crear conjuntos de "Valores por Defecto" (Bundles) para autocompletar rápidamente el formulario de "Nueva Postulación". De esta forma, si el usuario está buscando trabajo en dos rubros diferentes (ej. Informática y Comida Rápida), puede aplicar un bundle con un solo clic y pre-llenar campos como Modalidad, Sueldo Solicitado, Nivel, etc.

## 2. Campos afectados
Al momento de agregar una nueva postulación, el bundle podrá asignar valores iniciales a los siguientes campos:
- Empresa
- Cargo
- Nivel
- Plataforma
- Fecha Postulación (Opcionalmente "Hoy" u otra regla)
- Ubicación
- Modalidad
- Sueldo Ofrecido
- Sueldo Solicitado
- Estado

*(Nota: La URL queda exenta ya que siempre es única para cada postulación).*

## 3. Propuesta de Modelo de Datos

Existen dos formas principales de modelar esto en la base de datos:

### Opción A: Modelo EAV (Tabla Intermedia) - *Sugerido inicialmente*
Se crearían tres entidades lógicas:
1. **Bundle**: Tabla principal con el nombre del bundle (ej. "Informática").
2. **Campo**: Tabla o diccionario con los campos disponibles (Cargo, Nivel, etc.).
3. **Bundle_Valor**: Tabla intermedia que asocia un Bundle, un Campo y su Valor.

**Pros**: Altamente dinámico (se pueden añadir campos futuros sin tocar columnas).
**Contras**: Consultas SQL muy complejas, validaciones de tipos de datos difíciles (mezcla de IDs con montos de sueldo).

### Opción B: Tabla Única de Bundle (Recomendada)
Dado que los campos de una postulación son fijos y conocidos, lo más limpio y estándar es tener una sola tabla que replique la estructura de la postulación pero para valores "plantilla".

```sql
CREATE TABLE bundle_postulacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Ej: "Informática"
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Valores por defecto (NULL significa "Sin especificar")
    id_empresa INT REFERENCES empresa(id) ON DELETE SET NULL,
    id_cargo INT REFERENCES cargo(id) ON DELETE SET NULL,
    id_nivel INT REFERENCES nivel_experiencia(id) ON DELETE SET NULL,
    id_plataforma INT REFERENCES plataforma(id) ON DELETE SET NULL,
    id_ubicacion INT REFERENCES ubicacion(id) ON DELETE SET NULL,
    id_modalidad INT REFERENCES modalidad(id) ON DELETE SET NULL,
    id_estado INT REFERENCES estado(id) ON DELETE SET NULL,
    sueldo_ofrecido INT,
    sueldo_pedido INT,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Pros**: Consultas SQL simples, el frontend la consume exactamente igual que una postulación real, mantiene la integridad relacional (si se borra un cargo, se borra del bundle gracias al `SET NULL`).

## 4. UI / UX Propuesta

### 4.1 Pantalla "Valores Default" (Configuraciones)
Se utilizará la pantalla base ya creada (`ValoresDefaultPage.tsx`).
- Mostrará una lista/grilla de Bundles creados por el usuario.
- Tendrá un botón para "Crear Bundle".
- Al editar un Bundle, se reutilizará un diseño de formulario muy similar al de "Nueva Postulación", pero donde todos los campos tendrán como primera opción "Sin valor por defecto".

### 4.2 Modal "Nueva Postulación"
- Se agregará una pequeña botonera o menú desplegable en la parte superior del modal que diga **"Aplicar Bundle: [Seleccionar]"**.
- Al seleccionar "Informática", el formulario reactivamente autocompletará todos los valores definidos en ese bundle.
- El campo "Fecha Postulación" seguirá inicializándose con el día actual por defecto, a menos que el usuario especifique otra lógica.

## 5. Tareas a Ejecutar
1. **Backend**:
   - Crear script SQL para la tabla `bundle_postulacion`.
   - Crear los endpoints CRUD en `/api/bundles`.
2. **Frontend**:
   - Crear las llamadas a la API en `src/lib/api.ts` y hook `useBundles`.
   - Implementar la UI de `ValoresDefaultPage` (Listado y formulario de bundle).
   - Modificar `PostulacionForm.tsx` para incluir el selector de Bundles y aplicar los valores al estado local del formulario cuando sea una *Nueva Postulación*.
