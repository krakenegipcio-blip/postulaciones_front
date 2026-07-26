# Diseño de Base de Datos: Preguntas Frecuentes

Este documento describe la estructura inicial para almacenar las Preguntas Frecuentes (FAQ) en el sistema.

## Tabla: `preguntas_frecuentes`

Esta tabla registrará las preguntas comunes y sus respectivas respuestas.

### Estructura Propuesta

| Columna | Tipo de Dato (PostgreSQL) | Descripción |
| :--- | :--- | :--- |
| `id` | `SERIAL` / `INT` (PK) | Identificador único de la pregunta frecuente. |
| `pregunta` | `TEXT` | El título o enunciado de la pregunta. |
| `respuesta` | `TEXT` | El contenido de la respuesta. |
| `created_at` | `TIMESTAMP` | Fecha y hora en la que se creó el registro. |
| `updated_at` | `TIMESTAMP` | Fecha y hora de la última modificación. |

---

## Sobre la Longitud de los Campos (Tu Duda)

**¿Qué tan largo puede ser un campo de "respuesta" o "pregunta"?**

En bases de datos como PostgreSQL, lo más recomendable para este tipo de campos es utilizar el tipo de dato **`TEXT`** en lugar de `VARCHAR(n)`. 

* **`TEXT`**: Permite almacenar cadenas de caracteres de longitud ilimitada (en la práctica, hasta 1 GB de texto por registro en PostgreSQL). Es ideal para el campo `respuesta`, ya que podrías necesitar escribir párrafos largos, listas, e incluso guardar formato Markdown o HTML en el futuro.
* También se recomienda usar `TEXT` para el campo `pregunta` (en lugar de, por ejemplo, `VARCHAR(255)`), ya que no hay una diferencia de rendimiento real en PostgreSQL entre `TEXT` y `VARCHAR`, y te evitas el problema de que una pregunta muy descriptiva se quede cortada por un límite artificial.

**Conclusión:** Utilizando el tipo `TEXT` para ambos campos, no tendrás que preocuparte por el límite de caracteres; podrás guardar respuestas tan extensas y detalladas como necesites.
