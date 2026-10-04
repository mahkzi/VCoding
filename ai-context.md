# Contexto para asistentes de IA — Schemaweek

Este archivo orienta a cualquier asistente de IA que trabaje en el repositorio. Resume el proyecto, las decisiones ya tomadas y las reglas de trabajo. Si algo de lo que se pide contradice este archivo, el `README.md` o `docs/Alcance.md`, hay que señalarlo antes de implementar.

## Proyecto

Schemaweek es una aplicación web para estudiantes que organizan materias, clases, tareas, fechas de entrega y actividades personales dentro de una planificación semanal.

El objetivo no es solo administrar tareas, sino ayudar al estudiante a **organizar su tiempo teniendo en cuenta sus horarios disponibles y su carga académica**. El problema que resuelve no es saber qué hacer, sino saber cuándo hacerlo.

## Estado actual

| Versión | Contenido | Estado |
|---|---|---|
| V1 | Maquetación HTML y CSS | Página principal construida. Faltan calendario, materias, tareas y perfil |
| V2 | JavaScript | Crear, completar, eliminar y deshacer tareas, con persistencia en `localStorage`. Faltan filtros y cambio de semana |
| V3 | Organización semanal (horas disponibles, sobrecarga) | Pendiente |
| V4 | Migración a React | Pendiente |
| V5 | Backend | Pendiente |

Regla: el proyecto avanza por versiones. No se adelantan funcionalidades de una versión posterior sin que se pida de forma explícita.

El código de la V2 está implementado pero **no fue verificado en un navegador**. Ver `docs/registro-de-errores.md`.

## Estilo

Estilo académico, con tono profesional que no canse la vista.

- Tema claro con paleta suave. Sin modo oscuro por ahora.
- Fondo gris muy suave en lugar de blanco puro; texto en gris azulado oscuro; un solo color de acento desaturado.
- Títulos con tipografía serif de sistema; texto en sans-serif de sistema. Sin fuentes web ni librerías externas.
- Interfaces simples: el usuario debe entender su semana rápidamente.
- La información de horarios debe ser principalmente visual.
- Accesibilidad: contraste de texto de al menos 4,5:1, foco visible, navegación por teclado, objetivos táctiles de al menos 24 px, controles con `label` real y prioridad expresada con texto además de color.

Tokens de diseño, todos definidos en `docs/css/base.css`:

| Grupo | Tokens |
|---|---|
| Color | `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-danger`, `--color-priority-*` |
| Tipografía | `--font-heading` (Georgia, 'Times New Roman', serif), `--font-body` (system-ui, sans-serif), `--font-size-xs` a `--font-size-3xl` |
| Espacio y forma | `--space-1` a `--space-5`, `--radius`, `--shadow` |
| Layout | `--container-width`, `--aside-width` |
| Controles | `--size-control`, `--control-padding-inline`, `--progress-height`, `--progress-min-width`, `--transition` |

Los colores, espacios, tamaños de fuente y duraciones salen siempre de las variables CSS, nunca de valores sueltos. Si falta un token, se agrega a `base.css`.

## Reglas de negocio

- La aplicación **informa y ayuda a decidir**; no toma decisiones importantes por el usuario. En una primera versión no elimina ni modifica tareas automáticamente.
- Las tareas, materias y actividades deben estar relacionadas entre sí.
- Tiempo ocupado: bloques fijos del usuario (clases, trabajo). Tiempo disponible: lo que queda libre para estudiar o hacer tareas.
- Sobrecarga: se compara el tiempo disponible con el tiempo requerido por las tareas pendientes y se advierte si el segundo supera al primero. Es una funcionalidad de la V3.
- Prioridades: alta, media y baja. Alta para exámenes próximos, entregas cercanas o tareas atrasadas; media para estudio y ejercicios; baja para lecturas complementarias y actividades sin fecha inmediata.
- Una tarea tiene: título, descripción, materia, duración estimada, prioridad, fecha límite y estado. El estado se modela con el booleano `completed` (pendiente o completada).
- La fecha límite no incluye hora: solo la fecha.
- Se permite crear tareas con fecha límite pasada, para poder cargar trabajo atrasado. Nacen marcadas como vencidas.

## Reglas de cálculo vigentes

- Pendientes y completadas: conteo según el estado de cada tarea.
- Horas estimadas pendientes: suma de la duración de las tareas pendientes.
- Progreso: completadas sobre el total, redondeado a entero; 0 si no hay tareas.
- Una tarea está vencida si está pendiente y su fecha límite es anterior a hoy. El resumen muestra la cantidad de vencidas.
- Una tarea vence hoy si está pendiente y su fecha límite es hoy.
- Próxima entrega: la tarea pendiente con la fecha límite más cercana que sea hoy o posterior. Las vencidas no cuentan. Si no hay próxima entrega pero sí vencidas, el resumen lo indica con la cantidad de vencidas.
- Orden de la lista: pendientes primero; luego fecha límite ascendente; a igual fecha, prioridad (alta, media, baja); a igual prioridad, fecha de creación.
- "Hoy" se recalcula al volver a la pestaña y a medianoche.

## Fuera de alcance

- Conexión con otras aplicaciones, incluida la integración con calendarios externos.
- Verificación con Facebook.
- Pagos dentro de la aplicación.
- Audio y vídeo.

Todavía no incluido en esta etapa, hasta que se pida expresamente: calendario propio, horarios, materias como entidad propia, estadísticas, perfil, registro, filtros y cambio de semana. Estas funcionalidades sí forman parte del proyecto en versiones posteriores.

## Estructura del repositorio

```text
schemaweek/
├── docs/
│   ├── index.html
│   ├── favicon.svg
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── js/
│   │   └── script.js
│   ├── Alcance.md
│   └── registro-de-errores.md
├── .editorconfig
├── ai-context.md
└── README.md
```

La carpeta `docs/` contiene el código de la aplicación. **Pendiente de decisión:** desde dónde se publica con GitHub Pages. GitHub Pages solo sirve desde la raíz o desde `/docs`, así que la afirmación de que `docs/` no se publica no es segura. Mientras tanto, no mover archivos ni tocar el `index.html` de la raíz.

## Convenciones de código

- **Interfaz en español**: textos de pantalla, mensajes de validación y `lang="es"`. Fechas y números con la configuración regional `es-AR`.
- **Código en inglés**: clases, ids, identificadores y valores de datos (por ejemplo, `high`, `medium`, `low`).
- Documentación del proyecto y mensajes de commit en **español**.
- HTML semántico; un único `h1`; todo control de formulario con su `label` real, incluidos los checkbox.
- CSS mobile-first, con clases en notación BEM (`bloque__elemento--modificador`). Sin `!important`, sin selectores por id, sin selectores de elemento dentro de componentes y sin estilos en línea. Cada clase definida debe existir en el HTML o ser asignada por JavaScript.
- Los estilos se cargan con tres `<link>` en el HTML (`base.css`, `layout.css`, `components.css`), en ese orden. No se usa `@import`.
- JavaScript en un único archivo, como script clásico con `defer` y dentro de una función autoejecutable con `'use strict'`. No se usan módulos ES porque no funcionan al abrir el archivo directamente desde el sistema de archivos. Esta regla y la de no usar dependencias rigen hasta la V3; la V4 (React) las revisa.
- El texto del usuario se inserta con `textContent`, nunca con `innerHTML`.
- Las fechas AAAA-MM-DD se convierten con una función local; `new Date` con esa cadena se interpreta en UTC y desplaza el día en la zona horaria de Argentina.
- Los datos leídos de `localStorage` se validan antes de usarse; los registros inválidos se descartan.
- Sin dependencias externas: ni librerías, ni fuentes web, ni CDN. Rige hasta la V3.
- Sin código muerto, sin `console.log` y sin comentarios que describan lo obvio.
- Indentación de 2 espacios en todos los archivos (ver `.editorconfig`).

## Contrato entre HTML, CSS y JavaScript

Los ids y las clases de `docs/index.html` son el contrato con el CSS y el JavaScript. No deben renombrarse sin actualizar los otros dos archivos.

| Qué | Selector |
|---|---|
| Formulario de tarea | `#task-form` |
| Campos usados por JS | `#title`, `#subject`, `#subject-options` |
| Mensaje de confirmación | `#form-status` |
| Lista de tareas | `#task-list` |
| Encabezado de la lista (destino de foco) | `#tasks-title` |
| Plantilla de tarea | `#task-template` |
| Estado vacío | `#empty-state` |
| Estadísticas | `#stat-pending`, `#stat-completed`, `#stat-overdue`, `#stat-hours` |
| Progreso | `#progress`, `#progress-text` |
| Próxima entrega | `#next-due` |
| Deshacer eliminación | `#undo-notice`, `#undo-message`, `#undo-button` |
| Aviso de almacenamiento | `#storage-warning` |
| Anuncios para lectores de pantalla | `#announcer` |

## Modelo de datos

Una tarea: `id`, `title`, `description`, `subject`, `durationHours`, `priority` (`high`, `medium` o `low`), `dueDate` (AAAA-MM-DD), `completed` y `createdAt`.

Persistencia en `localStorage`:

- Clave: `schemaweek.tasks`.
- Valor: `{ "version": 1, "tasks": [ ... ] }`.
- Si la versión no coincide o el JSON es inválido, se parte de una lista vacía. Todavía no hay migraciones: si se cambia el esquema, se incrementa `version` y se escribe la migración.
- Si el guardado falla, se muestra `#storage-warning`.
- Se sincroniza entre pestañas con el evento `storage`.

## Cómo debe trabajar el asistente

1. **No inventar ni asumir.** Si falta información, se pregunta.
2. **Señalar contradicciones** entre lo pedido y la documentación del proyecto antes de implementar.
3. **Respetar la versión en curso.** No adelantar funcionalidades de versiones posteriores.
4. **Un cambio por vez.** Ante un ajuste, tocar solo lo pedido y mantener el resto.
5. **Mantener limpio el código:** sin comentarios innecesarios ni código sin uso.
6. **Responder en español**, con tono profesional y sin rodeos.
7. **Decir qué se verificó y qué no.** No afirmar que algo funciona en el navegador si solo se revisó por código.

## Commits

Se usan prefijos convencionales con el mensaje en español:

- `feat: implementación de interfaz modular HTML/CSS`
- `feat: agregada lógica JavaScript funcional`
- `docs: actualizar README con el alcance de la entrega`

## Decisiones tomadas

- El código vive en `docs/`, no en la raíz. Pendiente de revisar según cómo se publique.
- La acción principal de esta etapa es gestionar tareas: crear, completar, eliminar y deshacer, con un resumen derivado.
- La materia es un campo de texto libre dentro de la tarea, con sugerencias de las ya usadas; todavía no es una entidad.
- La interfaz está en español y el código en inglés.
- Hay persistencia con `localStorage`.
- No habrá integración con calendarios externos; el calendario será propio.
- Se permiten fechas límite pasadas.
- Se cargan los estilos con `<link>` y no con `@import`.
- La navegación de la página usa anclas internas, porque las demás páginas aún no existen.

## Pendientes conocidos

- Verificar en navegador todo lo implementado (ver `docs/registro-de-errores.md`).
- Decidir la publicación con GitHub Pages y qué hacer con el `index.html` de la raíz.
- Aplicar al `README.md` los cambios indicados en el registro de errores.
- Páginas restantes de la V1: calendario, materias, tareas y perfil.
- Cálculo de horas disponibles y detección de sobrecarga (V3).
