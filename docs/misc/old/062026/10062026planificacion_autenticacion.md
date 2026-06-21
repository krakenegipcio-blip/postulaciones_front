# Planificación de Autenticación Simple (Actualizada)
10-06-2026
Esta planificación detalla la creación de un sistema de autenticación "Simple" (Solo Email y Contraseña, sin OTP ni recuperación) utilizando tecnologías modernas, seguras y profesionales: **Zustand** para el manejo de estado global, **React Hook Form + Zod** para la validación de formularios, y **JWT mediante HttpOnly Cookies** para mayor seguridad.

---

## 1. Decisiones Técnicas Adoptadas
1. **Frontend State Management:** Se utilizará **Zustand**. Es ligero, extremadamente popular, más simple de configurar que Redux, y el estándar actual en ecosistemas de React/Next.js.
2. **Validación de Formularios:** Se utilizará **React Hook Form** integrado con **Zod**. Es la solución más profesional hoy en día ya que garantiza tipado estricto (Type-Safety) y previene re-renderizados innecesarios, haciéndola la opción más performante.
3. **Almacenamiento del Token:** Se utilizará un enfoque seguro. El JWT se almacenará en una **Cookie HttpOnly**. Esto mitiga el riesgo de ataques XSS (Cross-Site Scripting) ya que el token no es accesible mediante JavaScript. El estado del usuario en la UI se controlará con Zustand.
4. **Backend Estructura:** Se creará un nuevo archivo de rutas `auth.ts` dentro de la carpeta existente `src/routes/` del backend, y un middleware dedicado en `src/middleware/`.
5. **Aislamiento de Datos por Usuario (Multi-tenancy):** **¡Punto Crítico!** Toda la data de la aplicación (postulaciones, empresas, cargos, etc.) deberá pertenecer exclusivamente a un usuario. Se agregarán llaves foráneas (`usuario_id`) a las tablas existentes para garantizar que cada usuario vea únicamente su propia información.

---

## 2. Backend (`postulaciones_backend`)

### 2.1. Instalación de Dependencias
Ejecutar en la terminal dentro de `postulaciones_backend`:
```bash
npm install bcrypt jsonwebtoken cookie-parser
npm install -D @types/bcrypt @types/jsonwebtoken @types/cookie-parser
```

### 2.2. Base de Datos (PostgreSQL) - Nuevas Tablas y Relaciones
**1. Crear la tabla `usuarios`:**
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Alterar tablas existentes (Aislamiento de Datos):**
Se deberá añadir el campo `usuario_id` a todas las tablas principales que almacenen data generada por el usuario (ej: `postulaciones`, `empresas`, `cargos`, etc.) para vincular esa data a su dueño.
```sql
ALTER TABLE postulaciones ADD COLUMN usuario_id INTEGER;
ALTER TABLE postulaciones ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- (Repetir para las demás tablas pertinentes que deban ser privadas por usuario)
```
*Nota: Si ya hay datos en la base de datos, habrá que definir cómo migrar esos datos (ej: asignárselos a un usuario por defecto o borrar la data de prueba).*

### 2.3. Archivos a Crear y Modificar

#### [CREAR] `src/routes/auth.ts`
- **Contenido:** Definirá los endpoints `POST /register` y `POST /login`.
- **Lógica:** 
  - `register`: Recibe email y password, hashea el password con `bcrypt.hash`, y guarda en la base de datos.
  - `login`: Verifica usuario, comprueba el password con `bcrypt.compare`, firma el JWT incluyendo el `id` del usuario en el payload, y lo retorna en una cookie HttpOnly: `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })`.

#### [CREAR] `src/middleware/authMiddleware.ts`
- **Contenido:** Función que extrae el token de `req.cookies.token`, lo valida con `jwt.verify`. Si es válido, inyecta los datos del usuario en la petición (ej. `req.user = decodedToken`) y permite continuar. Rechaza la solicitud (401) si es inválido.

#### [EDITAR] `src/index.ts`
- **Líneas a agregar:**
  - `import cookieParser from 'cookie-parser';` (Línea ~4)
  - `import authRouter from './routes/auth.js';` (Línea ~10)
  - `app.use(cookieParser());` (Debajo de `app.use(express.json());`, Línea ~16)
  - `app.use('/api/auth', authRouter);` (Antes de las demás rutas, Línea ~18)

#### [EDITAR] Rutas Protegidas (Ej: `src/routes/postulaciones.ts` y demás controladores)
- **Líneas a editar:** 
  1. Importar `authMiddleware` y agregarlo a cada definición de ruta.
  2. **Modificar las consultas SQL:** Cambiar todos los `SELECT`, `UPDATE` y `DELETE` para que siempre filtren por `usuario_id`.
     - *Antes:* `SELECT * FROM postulaciones`
     - *Después:* `SELECT * FROM postulaciones WHERE usuario_id = $1`, pasando `req.user.id` como parámetro.
  3. **Modificar los INSERT:** Al crear un nuevo registro, asegurarse de insertar el `req.user.id` en la columna `usuario_id`.

---

## 3. Frontend (`postulaciones_analisis_final`)

### 3.1. Instalación de Dependencias
Ejecutar en la terminal dentro de `postulaciones_analisis_final`:
```bash
npm install zustand react-hook-form @hookform/resolvers zod lucide-react
```

### 3.2. Archivos a Crear y Modificar

#### [CREAR] `src/store/authStore.ts`
- **Contenido:** Creación del store global con Zustand.
- **Lógica:** Tendrá el estado `{ isAuthenticated: boolean, user: null | { id: number, email: string } }` y las acciones `login(user)`, `logout()`. 

#### [CREAR] `src/pages/LoginPage.tsx`
- **Contenido:** Componente visual según el mockup "Registro Postulaciones".
- **Lógica:** Implementa `useForm` con `zodResolver`. Definición del esquema: `z.object({ email: z.string().email(), password: z.string().min(6) })`. Al hacer submit exitoso, llama a `login()` del `authStore`.

#### [CREAR] `src/pages/RegisterPage.tsx`
- **Contenido:** Componente visual según el mockup "Crear cuenta".
- **Lógica:** Implementa `useForm` con esquema Zod que incluya `confirmPassword` y una validación `.refine(data => data.password === data.confirmPassword)`. 

#### [EDITAR] `src/App.tsx`
- **Líneas a editar:** Actualmente la app maneja la navegación con un `useState<Page>`.
  - **Importar:** `import { useAuthStore } from './store/authStore';`, `import LoginPage from './pages/LoginPage';`, `import RegisterPage from './pages/RegisterPage';`
  - **Lógica:** Extraer el estado `const isAuthenticated = useAuthStore(state => state.isAuthenticated);`.
  - **Modificar Render (Aprox Línea 24):** 
    ```tsx
    if (!isAuthenticated) {
      return showRegister ? <RegisterPage onSwitch={() => setShowRegister(false)} /> : <LoginPage onSwitch={() => setShowRegister(true)} />;
    }
    ```
    Si el usuario está logueado, se retorna la estructura original `( <div className="h-screen..."><Sidebar />... )`.

#### [CREAR] `src/lib/axios.ts` o `fetch` interceptor
- Dado que usaremos cookies HttpOnly, es importante configurar las peticiones al backend para que envíen credenciales. Si se usa fetch: `fetch('/api/...', { credentials: 'include' })`.

---

## 4. Resumen de Flujo Final
1. El usuario entra, ve `LoginPage`.
2. Llena sus datos; **React Hook Form y Zod** validan todo localmente.
3. Se envía al backend (`/api/auth/login`).
4. El backend genera el JWT con el `usuario_id` y lo envía en una **Cookie HttpOnly**.
5. El backend responde con un "OK" y los datos del usuario.
6. El frontend llama a **Zustand** `authStore.login(userData)`.
7. `App.tsx` reacciona y renderiza el Dashboard.
8. Para cada petición posterior (ej: pedir las postulaciones), la cookie viaja sola.
9. El middleware del backend lee la cookie, verifica el token, extrae el `usuario_id` y lo deja disponible en la request.
10. El controlador de base de datos hace la consulta SQL pidiendo **únicamente las filas que pertenezcan a ese `usuario_id`**, asegurando total privacidad de datos entre usuarios.

---

## 5. Plan de Ejecución Detallado (Paso a Paso)

Este es el desglose exacto que seguiremos para implementar el sistema sin fallas, archivo por archivo:

### PASO 1: Backend - Instalación
1. En la terminal de `postulaciones_backend` se ejecutará:
   ```bash
   npm install bcrypt jsonwebtoken cookie-parser
   npm install -D @types/bcrypt @types/jsonwebtoken @types/cookie-parser
   ```

### PASO 2: Backend - Base de Datos (PostgreSQL)
1. Ejecutaremos el siguiente script SQL para crear la tabla de usuarios y aislar la data de `postulacion`:
   ```sql
   CREATE TABLE usuarios (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   ALTER TABLE postulacion ADD COLUMN usuario_id INTEGER;
   ALTER TABLE postulacion ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;
   ```

### PASO 3: Backend - Nuevos Archivos
1. **Crear `src/types/express/index.d.ts`**:
   Para que TypeScript reconozca la propiedad `user` en los Requests.
   ```typescript
   export {};
   declare global {
     namespace Express {
       interface Request {
         user?: { id: number; email: string };
       }
     }
   }
   ```
2. **Crear `src/middleware/authMiddleware.ts`**:
   Tendrá la lógica para leer `req.cookies.token`, usar `jwt.verify()`, e inyectar `req.user = decoded`.
3. **Crear `src/routes/auth.ts`**:
   Tendrá los controladores completos de `POST /register` y `POST /login` con `bcrypt` para las contraseñas.

### PASO 4: Backend - Modificaciones de Código Existente
1. **`src/index.ts`:**
   - **Añadir:** `import cookieParser from 'cookie-parser';` (Línea ~4)
   - **Añadir:** `import authRouter from './routes/auth.js';` (Línea ~10)
   - **Añadir:** `app.use(cookieParser());` (Línea ~16)
   - **Añadir:** `app.use('/api/auth', authRouter);` (Línea ~18)
2. **`src/routes/postulaciones.ts`:**
   - **Añadir:** `import { authMiddleware } from '../middleware/authMiddleware.js';` (Línea 1)
   - **Editar:** `router.get('/', authMiddleware, async (req, res) => {` (Línea 7)
   - **Añadir filtro:** `conditions.push('p.usuario_id = $${idx++}'); params.push(req.user.id);` (Aprox Línea 21)
   - **Editar:** `router.post('/', authMiddleware, async (req, res) => {` (Línea 105)
   - **Inyectar ID:** `payload.usuario_id = req.user.id;` (Línea 112)
   - Aplicar este mismo patrón de `authMiddleware` a `PUT` y `DELETE`, verificando que `WHERE usuario_id = req.user.id`.

### PASO 5: Frontend - Instalación
1. En la terminal de `postulaciones_analisis_final` ejecutaremos:
   ```bash
   npm install zustand react-hook-form @hookform/resolvers zod lucide-react
   ```

### PASO 6: Frontend - Nuevos Archivos
1. **Crear `src/store/authStore.ts`**: Lógica de Zustand con `isAuthenticated`, `user`, y funciones `login`/`logout`.
2. **Crear `src/pages/LoginPage.tsx`**: Formulario de Login diseñado con Tailwind según los mockups.
3. **Crear `src/pages/RegisterPage.tsx`**: Formulario de Registro diseñado con Tailwind según los mockups.

### PASO 7: Frontend - Modificaciones de Código Existente
1. **`src/App.tsx`:**
   - **Añadir Importaciones:** `useAuthStore`, `LoginPage`, `RegisterPage`.
   - **Añadir Estado Local:** `const [showRegister, setShowRegister] = useState(false);`
   - **Añadir Estado Global:** `const isAuthenticated = useAuthStore(s => s.isAuthenticated);`
   - **Modificar Render Principal:** Interceptar si no hay usuario activo:
     ```tsx
     if (!isAuthenticated) {
       return showRegister ? <RegisterPage onSwitch={() => setShowRegister(false)} /> : <LoginPage onSwitch={() => setShowRegister(true)} />;
     }
     ```
2. **(Opcional pero recomendado) Configuración Global de Fetch:** 
   Asegurarnos de que las llamadas al backend lleven `credentials: 'include'` para que la cookie de JWT siempre se envíe al servidor.
