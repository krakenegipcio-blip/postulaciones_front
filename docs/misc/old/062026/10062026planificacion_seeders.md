# Planificación de Seeders (Datos Iniciales por Usuario)

Cuando un nuevo usuario se registra en la plataforma, su entorno se inicializará automáticamente con estos datos por defecto. Esto le permitirá comenzar a usar la aplicación de inmediato sin tener que configurar manualmente los catálogos básicos.

---

## 1. Catálogos Generales (Múltiples Opciones)

### Estado (Etapas de una postulación)
*Basados en los estados típicos y los que actualmente existen en el sistema.*
- **En Espera** (Color: `#f59e0b` - Ámbar)
- **Entrevista** (Color: `#3b82f6` - Azul)
- **Rechazado** (Color: `#ef4444` - Rojo)
- **Finalizado / Contratado** (Color: `#22c55e` - Verde)
- **Pausa** (Color: `#6b7280` - Gris)
- **Sin Postular** (Color: `#6366f1` - Índigo)

### Modalidad
- **Presencial** (Color: `#10b981` - Verde Esmeralda)
- **Remoto** (Color: `#3b82f6` - Azul)
- **Híbrido** (Color: `#f59e0b` - Ámbar)

### Nivel de Experiencia
1. **Trainee**
2. **Junior**
3. **Semi Senior**
4. **Senior**

### Cargos Principales
*Se precargarán los roles más comunes en la industria tech.*
- Sin especificar
- Full Stack Developer
- Frontend Developer
- Backend Developer
- DevOps Engineer
- Data Engineer
- Mobile Developer
- QA Engineer
- Ciberseguridad

### Métodos de Evaluación
*Formatos comunes de evaluación técnica.*
- **Entrevista Técnica** (Color: `#8b5cf6` - Púrpura)
- **Prueba Online** (Color: `#3b82f6` - Azul)
- **Prueba Técnica Práctica (Take-home)** (Color: `#f59e0b` - Naranja)
- **Coding Challenge** (Color: `#06b6d4` - Cian)
- **Pair Programming** (Color: `#ec4899` - Rosa)
- **Plataforma Externa (Evalart, HackerRank, etc.)** (Color: `#22c55e` - Verde)

### Fases de Seguimiento (Pipeline de postulaciones)
*Pasos estándar por los que pasa una postulación.*
- **Postulación enviada** (Color: `#22c55e`, Icono: `send`)
- **Contacto inicial** (Color: `#38bdf8`, Icono: `phone`)
- **Prueba técnica** (Color: `#8b5cf6`, Icono: `file-code`)
- **Entrevista RRHH** (Color: `#06b6d4`, Icono: `users`)
- **Entrevista técnica** (Color: `#6366f1`, Icono: `monitor-code`)
- **Entrevista final** (Color: `#f59e0b`, Icono: `handshake`)
- **Feedback recibido** (Color: `#14b8a6`, Icono: `message-square`)
- **Oferta recibida** (Color: `#eab308`, Icono: `badge-dollar-sign`)
- **Rechazo** (Final: Sí, Color: `#ef4444`, Icono: `x-circle`)
- **Contratado** (Final: Sí, Color: `#22c55e`, Icono: `badge-check`)
- **Desistido** (Final: Sí, Color: `#94a3b8`, Icono: `circle-slash`)

### Tecnologías (Top 15 Principales)
*Se insertará una lista base de las tecnologías más demandadas.*
- **JavaScript** (`#f7df1e`)
- **TypeScript** (`#3178c6`)
- **React** (`#61dafb`)
- **Angular** (`#dd0031`)
- **Node.js** (`#68a063`)
- **Python** (`#3776ab`)
- **Java** (`#f89820`)
- **PostgreSQL** (`#336791`)
- **MySQL** (`#4479a1`)
- **MongoDB** (`#47a248`)
- **Docker** (`#2496ed`)
- **AWS** (`#ff9900`)
- **Azure** (`#0078d4`)
- **Git** (`#f34f29`)
- **Inglés** (`#6b7280`)

---

## 2. Catálogos con Valores Únicos / Restringidos

Según lo acordado, estas tablas tendrán valores iniciales muy limitados para forzar/motivar al usuario a crear los suyos propios a medida que usa la plataforma:

### Empresa
Solo se creará un registro por defecto:
- **Sin especificar**

### Plataforma (Origen de la postulación)
- **Sin Especificar**
- **Presencial**
- **Correo Electrónico**

### Ubicación
*Lugares predefinidos para la postulación.*
Solo se creará un registro por defecto:
- **Sin especificar**

---

## Próximos Pasos (No implementados aún)
Cuando apruebes esta lista, el siguiente paso lógico a nivel de código será:
1. Crear una función `createInitialSeeds(usuarioId: number)` en el backend.
2. Llamar a esta función automáticamente justo después de que un usuario se registre exitosamente (`POST /api/auth/register`).
