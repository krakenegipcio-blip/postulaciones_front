# Sistema de Roles

## Duda: ¿Existen los roles creador, demo, premium y basico en el app? ¿Para empezar, la app maneja roles?

**Respuesta corta:** No, actualmente la aplicación **no maneja roles**. 

Revisando el código base actual (tanto el modelo de la base de datos como el store de autenticación en Zustand), los usuarios únicamente poseen un `id` y un `email`. 

Implementar esto implicará algunos cambios en la arquitectura de la app (agregar una tabla/columna de roles, middlewares, etc.). Sin embargo, la estrategia será **modificar lo menos posible el código actual**. 

Por esta razón, la lógica de roles y permisos se basará simplemente en **"puede acceder al módulo X o no"** (siendo los "módulos" cada uno de los ítems que se ven en la barra lateral del menú). 

Al mantener los roles "Demo", "Premium" y "Básico" exactamente iguales con acceso a todo lo que existe actualmente, la única modificación de UI real será **ocultar los módulos exclusivos del rol "Creador"** para el resto de los usuarios.

---

## Resumen de Funcionalidades por Rol

Una vez se implemente este sistema, los permisos se distribuirán de la siguiente manera:

### 1. Rol "Creador"
Este es un rol de super-administrador pensado para tu uso personal. Sus características incluyen:
- Acceso a herramientas y opciones de debuggeo.
- **Módulo "Respaldo y Restauración":** Se agregará una nueva categoría en la barra lateral por debajo de "Principal" llamada **"Base de Datos"**. Allí estará la sección exclusiva que permite exportar (respaldar enviando un JSON por correo a través de Resend) y restaurar la base de datos a partir de un JSON.
- **Módulo "CVs Por Área":** Se agregará esta nueva sección directamente dentro de la categoría **"Principal"**. Tendrá acceso exclusivo a la funcionalidad de almacenar y organizar diferentes Currículums Vitaes separados por el "Área" a la que se postule, incluyendo las cuentas de las páginas de empleo asociadas a cada área.

### 2. Roles "Demo", "Premium" y "Básico"
- Por el momento, estos tres perfiles **serán exactamente iguales** en cuanto a características y permisos dentro del sistema.
- Representarán al usuario estándar y tendrán acceso a todos los módulos actuales, pero **no verán ni tendrán acceso** a la categoría "Base de Datos" ni a la sección "CVs Por Área", las cuales estarán ocultas y protegidas.
