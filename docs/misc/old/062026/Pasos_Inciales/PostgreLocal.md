# Guía: Reinstalación de PostgreSQL y Configuración Local

Esta guía documenta los pasos para realizar una reinstalación limpia de PostgreSQL (por ejemplo, en caso de olvidar la contraseña principal) y cómo configurar la base de datos local usando DBeaver para correr la aplicación.

## 1. Desinstalación Limpia de PostgreSQL (Opción 1)

Si olvidaste la contraseña maestra durante la instalación de PostgreSQL, la forma más segura y rápida de reiniciar desde cero es hacer una desinstalación limpia.

**Pasos:**
1. Ve a la configuración de Windows -> **Aplicaciones** -> **Aplicaciones instaladas** (o "Agregar o quitar programas" en el Panel de Control).
2. Busca **PostgreSQL** en la lista y presiona **Desinstalar**. Sigue el asistente hasta que termine el proceso.
3. **Paso Crítico:** Abre el Explorador de Archivos de Windows y navega a la ruta `C:\Program Files` (o `C:\Archivos de programa`).
4. Busca la carpeta llamada `PostgreSQL` y **elimínala por completo**. 
   *(Nota: Esta carpeta contiene el directorio `data` donde se guarda la configuración de la contraseña vieja. Si no la borras, el nuevo instalador no te pedirá crear una nueva contraseña, asumiendo la instalación anterior).*
5. Vuelve a ejecutar el instalador de PostgreSQL para iniciar la instalación limpia. 
6. Durante el proceso, te pedirá que ingreses una **nueva contraseña**. ¡Asegúrate de anotarla en un lugar seguro!

---

## 2. Creación de la Base de Datos en DBeaver

Una vez instalado PostgreSQL con tu nueva contraseña, debes conectarte al servidor general y crear la base de datos de la aplicación.

**Pasos:**
1. Abre **DBeaver** y haz clic en el botón de **Nueva Conexión** (el icono del enchufe en la esquina superior izquierda).
2. Selecciona **PostgreSQL** y presiona *Siguiente*.
3. En la configuración de conexión (pestaña General), ingresa los siguientes datos:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `postgres` *(OJO: Conéctate primero a la base de datos por defecto porque tu base de datos final aún no existe).*
   - **Username:** `postgres`
   - **Password:** *[La nueva contraseña que creaste en la instalación]*
4. Haz clic en **Finalizar**.
5. En el panel izquierdo ("Navegador de Bases de Datos"), despliega la conexión que acabas de crear.
6. Haz clic derecho sobre la carpeta **Bases de datos** (o *Databases*) y selecciona **Crear Nuevo -> Base de datos**.
7. En el campo "Nombre", escribe: **`postulaciones_analisis`** y presiona **Aceptar**.
8. Si no la ves inmediatamente, haz clic derecho en la conexión y selecciona "Actualizar" (F5).

---

## 3. Configuración para Correr la App Localmente

Con la base de datos `postulaciones_analisis` creada, sigue estos pasos para levantar tu entorno de desarrollo:

1. **Ejecutar los scripts de la base de datos:**
   - En DBeaver, cambia tu conexión activa a la nueva base de datos `postulaciones_analisis` o crea una conexión nueva apuntando directamente a ella.
   - Abre un Editor SQL.
   - Pega y ejecuta los scripts SQL generados por Bolt (para crear las tablas necesarias como `usuarios`, `transacciones`, etc.).
   
2. **Actualizar variables de entorno de la aplicación:**
   - Ve al código de tu aplicación en tu editor de código.
   - Busca el archivo de variables de entorno local (generalmente `.env` o `.env.local`).
   - Asegúrate de que la cadena de conexión (usualmente `DATABASE_URL`) apunte a tu base de datos local usando la nueva contraseña. Ejemplo:
     ```env
     DATABASE_URL="postgresql://postgres:TU_NUEVA_CONTRASEÑA@localhost:5432/postulaciones_analisis"
     ```
3. **Levantar la aplicación:**
   - Abre la terminal en el directorio raíz de tu proyecto.
   - Ejecuta el comando de inicio (ej. `npm run dev` o el comando especificado en tu `package.json`).
   - Tu aplicación ahora debería levantarse y estar conectada a tu instancia local de PostgreSQL.
