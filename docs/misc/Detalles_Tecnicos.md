10_06_2026

detalles authenticacion:

Token Storage (Seguridad): Recomendé descartar localStorage y usar Cookies HttpOnly. Esta es la medida de seguridad estándar en la industria ya que previene por completo que los ataques XSS (Scripts maliciosos) puedan robar tu token, dado que no son accesibles desde JavaScript.

State Management: Para sustituir el rol del localStorage en el frontend, introduje Zustand. Es actualmente la alternativa más popular y querida frente a Redux: es muchísimo más ligero, no requiere boilerplate y se integra maravillosamente.

Formularios Profesionales: Añadimos React Hook Form + Zod. Esto no solo valida perfectamente todo (como que el email sea un email o que el password tenga 6 caracteres mínimos), sino que lo hace garantizando el tipado seguro (Type-Safety) y evitando que todo el componente se vuelva a renderizar en cada tecla que presionas.