# Requerimientos y Prioridades (26 de Julio de 2026)

Este documento detalla los nuevos requerimientos solicitados para la aplicación, ordenados según su nivel de prioridad para su futura implementación. No se ha escrito código, solo se ha elaborado este documento de diseño previo a la programación.

## Orden de Prioridades

### 1. Área ⭐⭐⭐⭐⭐ OK!
- **Descripción**: Permite filtrar y agrupar mejor los trabajos y postulaciones según su área (ej. Desarrollo, Diseño, Marketing, etc.).
- **Detalle Técnico**: Requiere la creación de un nuevo mantenedor (CRUD de área) para que los usuarios puedan gestionar sus propias áreas o seleccionar de áreas predefinidas.

### 2. Duración ⭐⭐⭐⭐☆ OK!
- **Descripción**: Permite especificar el tipo de duración de la oferta de trabajo.
- **Valores Iniciales**: Permanente, Proyecto, Esporádico / Por día.
- **Detalle Técnico**: También requiere un mantenedor (CRUD de duración) para que se puedan agregar o modificar estos valores en el futuro.

### 3. Respaldo de CVs por Área (Roles)
- **Descripción**: Permite realizar un respaldo de los currículums agrupados por área, así como de las "cuentas de páginas de búsqueda de empleo" (que en sí es una tabla) asociadas a cada área, con sus respectivos CVs.
- **Detalle Técnico**:
  - Implica la **implementación de Roles** en la aplicación (similares a "tipos de subscripción").
  - Esta funcionalidad es **exclusiva del rol "Creador"**.
  - Este es un requerimiento ligeramente más complejo dado que involucra múltiples tablas y generación de respaldos empaquetados.

### 4. Respaldo Base de Datos (DB)
- **Descripción**: Funcionalidad para generar un "dump" (respaldo) completo de la base de datos del usuario y enviarlo a su correo electrónico.
- **Detalle Técnico**:
  - También es **exclusivo del rol "Creador"**.
  - Se utilizará **Resend** para la integración y envío de correos electrónicos con el archivo adjunto o el enlace de descarga del respaldo.

### 5. Preguntas Frecuentes ⭐⭐⭐☆☆
- **Descripción**: Una nueva sección dentro de la aplicación para resolver dudas comunes.
- **Impacto**: Agrega valor al usuario final pero no afecta la lógica principal de la aplicación ni la arquitectura de la base de datos de manera crítica.


*************************************************
COMPLETADOS:
### 1. Área ⭐⭐⭐⭐⭐
- **Descripción**: Permite filtrar y agrupar mejor los trabajos y postulaciones según su área (ej. Desarrollo, Diseño, Marketing, etc.).
- **Detalle Técnico**: Requiere la creación de un nuevo mantenedor (CRUD de área) para que los usuarios puedan gestionar sus propias áreas o seleccionar de áreas predefinidas.

### 2. Duración ⭐⭐⭐⭐☆
- **Descripción**: Permite especificar el tipo de duración de la oferta de trabajo.
- **Valores Iniciales**: Permanente, Proyecto, Esporádico / Por día.
- **Detalle Técnico**: También requiere un mantenedor (CRUD de duración) para que se puedan agregar o modificar estos valores en el futuro.
