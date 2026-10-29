# Auditoría UX y Rediseño - Registro de Notas de Estudiantes

## 1. Tabla de Auditoría de las 5 Heurísticas de UX

| Heurística | Problema en el Código Original | Solución Aplicada en el Rediseño |
| :--- | :--- | :--- |
| **1. Visibilidad del estado del sistema** | Al registrar o eliminar a un estudiante no había retroalimentación visual inmediata. | Se incorporó una zona de anuncios con `aria-live="polite"` que despliega notificaciones flotantes (*toasts*) confirmando cada acción (ej. "Estudiante registrado correctamente"). |
| **2. Control y libertad del usuario** | La eliminación de un estudiante mediante el botón "Eliminar" se ejecutaba de forma directa e irreversible. | Se añadió un temporizador con la opción de **"Deshacer"** en la notificación para recuperar al estudiante eliminado antes de borrarlo definitivamente. |
| **3. Prevención de errores** | El botón "Registrar Estudiante" permitía clics aun con campos vacíos o notas fuera de rango (0 a 20). | El botón de envío se mantiene **deshabilitado (`disabled`)** por defecto hasta que los tres campos (`nombre`, `curso`, `nota`) contengan valores válidos. |
| **4. Consistencia y estándares** | Los colores y tamaños estaban dispersos en el CSS con valores fijos; los botones eran de tamaños desiguales y pequeños (`padding: 4px 8px`). | Se centralizó la paleta de colores y espaciados mediante **variables CSS en `:root`**, se mantuvo un único `<h1>` principal y un área táctil uniforme. |
| **5. Reconocimiento antes que recordar** | No existía una clara distinción visual entre estudiantes aprobados y desaprobados en la lista global. | Se implementaron indicadores visuales claros (etiquetas de estado con contraste adecuado y bordes de color) e iconos para identificar el estado al instante sin requerir lectura completa. |

---

## 2. Justificación de Cambios por Leyes de UX

* **Ley de Fitts** (Facilidad y velocidad de alcance):
  * **Cambio**: Todos los botones de la aplicación (incluyendo el botón "Eliminar" de cada fila y "Registrar Estudiante") tienen una **altura mínima de 44px** y un área táctil amplia con margen de separación, facilitando el clic en escritorio y dispositivos táctiles.
* **Ley de Hick** (Reducción del tiempo de decisión):
  * **Cambio**: Se simplificó la interfaz agrupando los controles del formulario verticalmente y presentando un resumen compacto del promedio general separado de la lista interactiva.
* **Ley de Miller** (Carga cognitiva limitada a 7 ± 2 elementos):
  * **Cambio**: La información de cada estudiante se fragmentó (*chunking*) en bloques estructurados (Nombre | Curso | Nota | Estado) en lugar de una sola cadena de texto contigua, reduciendo el esfuerzo mental para procesar la lista.

---

## 3. Especificaciones Tecnicas y Accesibilidad (WCAG)

1. **Variables CSS en `:root`**:
   ```css
   :root {
     --color-primary: #1d4ed8;
     --color-success: #15803d;
     --color-danger: #b91c1c;
     --color-bg: #f8fafc;
     --color-surface: #ffffff;
     --color-text: #0f172a;
     --color-border: #94a3b8;
     --focus-ring: #2563eb;
     --spacing-sm: 8px;
     --spacing-md: 16px;
     --spacing-lg: 24px;
   }