# Respaldo y Restauración de la Base de Datos PostgreSQL

Este documento explica cómo realizar un respaldo (backup) y una restauración de la base de datos `postgres` utilizada en el proyecto. 

He generado un respaldo actual de la base de datos en esta misma carpeta, el cual puedes encontrar como `postgres_backup.sql`.

## Opción 1: Usando la Línea de Comandos (CLI)

Esta es la forma más directa de respaldar y restaurar la base de datos usando las herramientas nativas de PostgreSQL (`pg_dump` y `psql`).

### Respaldar (Exportar)

Asegúrate de conocer la ruta a los binarios de tu instalación de PostgreSQL (por ejemplo, `C:\Program Files\PostgreSQL\18\bin`).

Abre PowerShell en la raíz de tu proyecto y ejecuta:

```powershell
# 1. Configurar la contraseña temporalmente en la terminal para que no te la pida de forma interactiva
$env:PGPASSWORD="yes120yes"

# 2. Ejecutar pg_dump para exportar la base de datos 'postgres' a un archivo .sql
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -h localhost -p 5432 -d postgres -F p -f docs\postgres_backup.sql
```

### Restaurar (Importar)

Si alguna vez necesitas restaurar este respaldo en tu base de datos (por ejemplo, si se borran datos por error), ejecuta:

```powershell
# 1. Configurar la contraseña temporalmente
$env:PGPASSWORD="yes120yes"

# 2. Ejecutar psql para importar el archivo .sql a la base de datos
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d postgres -f docs\postgres_backup.sql
```

> **Nota:** La ruta `C:\Program Files\PostgreSQL\18\bin` puede variar dependiendo de la versión de PostgreSQL instalada. Asegúrate de que el número de versión coincida con el de tu instalación.

---

## Opción 2: Usando DBeaver

Dado que utilizas DBeaver como administrador de base de datos, puedes respaldar de manera visual y muy sencilla:

### Respaldar (Exportar) en DBeaver

1. Abre DBeaver y asegúrate de estar conectado a la conexión **`postgres localhost:5432`**.
2. En el panel izquierdo (Navegador de base de datos), despliega la conexión y haz clic derecho sobre la base de datos **`postgres`** (o sobre el esquema `public`).
3. Selecciona **Herramientas (Tools)** -> **Respaldo (Backup)**.
4. En la ventana que aparece, selecciona los esquemas o tablas que deseas respaldar (por defecto, asegúrate de marcar `public`). Haz clic en *Siguiente*.
5. En la configuración de formato:
   - Configura el formato a **"Plain"** (texto plano para generar un .sql) o **"Custom"** (comprimido nativo de Postgres).
   - En *Output folder*, elige la carpeta destino, por ejemplo la carpeta `docs` de este proyecto.
6. Haz clic en **Iniciar (Start)** para generar el respaldo.

### Restaurar (Importar) en DBeaver

1. Haz clic derecho sobre la base de datos donde deseas restaurar los datos (en este caso, sobre la base de datos `postgres` de nuevo).
2. Selecciona **Herramientas (Tools)** -> **Restaurar (Restore)** (o *Ejecutar script SQL* si exportaste en texto plano `Plain`).
3. Busca y selecciona el archivo `.sql` generado.
4. Haz clic en **Iniciar** para comenzar a cargar los datos en tu base local.
