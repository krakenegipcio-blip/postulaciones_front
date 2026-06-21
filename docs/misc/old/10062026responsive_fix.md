# Fix Responsive Design — Postulaciones App

## Checklist de Tareas

### 1. PostulacionesPage — Vista Mobile (Home Principal)
- [x] 1.1 Reemplazar tabla por vista de **tarjetas (cards)** en móvil (`< 768px`), mostrando como dato principal **Empresa** y **Estado**
- [x] 1.2 Implementar **tap para editar** (abrir formulario edición al presionar la card)
- [x] 1.3 Implementar **long-press para eliminar** con mensaje de advertencia previo
- [x] 1.4 **Eliminar botón "Ver detalle"** en móvil (no existe en celular)
- [x] 1.5 Botón "+" solo debe mostrar el icono `+`, **SIN texto "Agregar Postulación"** (en ambos: desktop y móvil)
- [x] 1.6 Botón "Filtros" → **solo icono** (sin texto), aplica tanto en desktop como en mobile
- [x] 1.7 Texto "Vista: Completo" → en celular debe mostrarse en **dos líneas**: `Vista` (salto de línea) `Completo`
- [x] 1.8 Corregir Pagination en móvil (compactar layout)

### 2. Header — Responsive
- [x] 2.1 Hacer que el buscador se oculte o se colapse en pantallas pequeñas (el header ya se ve apretado)

### 3. LoginPage — Responsive
- [x] 3.1 Verificar y corregir padding/margins en pantallas pequeñas
- [x] 3.2 Asegurar que inputs y botones se ajusten correctamente

### 4. RegisterPage — Responsive
- [x] 4.1 Verificar y corregir padding/margins en pantallas pequeñas
- [x] 4.2 Asegurar que inputs y botones se ajusten correctamente

### 5. MaintainerTable — Responsive (Mantenedores)
- [x] 5.1 Hacer tabla scrollable horizontalmente en móvil o adaptar a cards
- [x] 5.2 Ajustar barra de búsqueda y botón "Nuevo" para móvil
- [x] 5.3 Ajustar botón Nuevo a solo icono "+" en móvil (consistencia)

### 6. AnalisisPage — Responsive
- [x] 6.1 Grids de 4 columnas → 2 columnas en tablet, 1 columna en móvil (StatCards)
- [x] 6.2 Grids de 2 columnas → 1 columna en móvil (charts/gráficos)
- [x] 6.3 Ajustar BarH labels (truncar nombres largos, reducir width fijo)

### 7. Componentes UI — Responsive
- [x] 7.1 Modal: asegurar que sea fullscreen o casi-fullscreen en móvil
- [x] 7.2 Drawer: ancho completo en móvil
- [x] 7.3 FilterPanel: ancho completo en móvil
- [x] 7.4 Pagination: layout compacto en móvil

### 8. Verificación Final
- [x] 8.1 Probar en 400px (móvil del screenshot)
- [x] 8.2 Verificar que desktop NO se vea afectado

---

## Explicación Detallada

### 1. PostulacionesPage — Vista Mobile

**Problema actual**: La tabla se muestra tal cual en móvil, comprimiendo todas las columnas en ~400px, resultando en texto cortado e ilegible.

**Solución**: Crear una vista condicional basada en el ancho de pantalla. Usar un hook `useIsMobile()` con `window.matchMedia('(max-width: 768px)')` para detectar móvil.

En móvil, en lugar de `<table>`, se renderiza una **lista de cards**. Cada card muestra:
- **Empresa** (texto principal, grande y visible)
- **Estado** (badge con color)
- Info secundaria: Cargo, Fecha

**Interacciones en móvil**:
- **Tap (click)** → Abre el formulario en modo edición (`openEdit(row, false)`)
- **Long-press (mantener ~700ms)** → Muestra modal de confirmación de eliminación (`setDeleteId(row.id)`)
- **NO** existe el botón "Ver Detalle" en móvil

**Botón "+"**: Eliminar el texto "Agregar Postulación" tanto en desktop como en móvil. Solo se muestra el icono `+` ya que se sobreentiende su función.

**Botón "Filtros"**: Eliminar el texto "Filtros" en ambos (desktop y móvil). Solo se muestra el icono de sliders.

**"Vista: Completo"**: En móvil, el texto se renderiza en dos líneas usando un `flex-col` o `<br/>`.

### 2. Header

El buscador (`w-64`) se aprieta contra el título en móvil. Solución: ocultar el texto del buscador o hacerlo colapsable, y ajustar el ancho a `w-full` con `max-w` en pantallas pequeñas.

### 3-4. Login y Register

Ya usan `max-w-md` con `p-4`, por lo que deberían estar bien. Verificaré que los placeholders de inputs no se corten y que el padding del contenedor externo sea adecuado. Ajustes menores de `p-8` → `p-6 sm:p-8`.

### 5. MaintainerTable

La tabla de mantenedores tiene las mismas limitaciones. En móvil la barra de búsqueda (`w-64`) es demasiado ancha. Solución: hacer `w-full sm:w-64`. El botón "Nuevo" se mantiene compacto.

### 6. AnalisisPage

Los grids `grid-cols-4` y `grid-cols-2` no hacen breakpoint para móvil. Solución:
- KPIs: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Charts: `grid-cols-1 md:grid-cols-2`
- BarH: reducir el `w-36` del label a `w-24 sm:w-36`

### 7. Componentes UI

- **Modal**: En móvil, el modal debe ocupar todo el ancho (`max-w-full` o quitar max-width) y usar `max-h-[100vh]` con `p-2`.
- **Drawer/FilterPanel**: En móvil → `w-full` en vez de `w-80` o `w-[480px]`.
- **Pagination**: Texto "Mostrando X-Y de Z" → ocultar en móvil. Botones "Anterior"/"Siguiente" → iconos. Reducir tamaño.

### Enfoque Clave
- Uso de clases responsive de Tailwind (`sm:`, `md:`, `lg:`) para NO romper la versión desktop
- Hook `useIsMobile` reutilizable para lógica condicional JSX
- Long-press implementado con `onTouchStart`, `onTouchEnd`, y `setTimeout`
