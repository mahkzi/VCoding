# Contexto para asistentes de IA — Schemaweek

Este archivo orienta a cualquier asistente de IA que trabaje en el repositorio. Resume el proyecto, las decisiones ya tomadas y las reglas de trabajo. Si algo de lo que se pide contradice este archivo, el `README.md` o `docs/Alcance.md`, hay que señalarlo antes de implementar.

## Proyecto

Schemaweek es una aplicación web para estudiantes que organizan materias, clases, tareas, fechas de entrega y actividades personales dentro de una planificación semanal.

El objetivo no es solo administrar tareas, sino ayudar al estudiante a **organizar su tiempo teniendo en cuenta sus horarios disponibles y su carga académica**. El problema que resuelve no es saber qué hacer, sino saber cuándo hacerlo.

## Estado actual

| Versión | Contenido | Estado |
|---|---|---|
| V1 | Maquetación HTML y CSS | Página principal construida |
| V2 | JavaScript | Parcial: crear, completar y eliminar tareas. Sin persistencia |
| V3 | Organización semanal (horas disponibles, sobrecarga) | Pendiente |
| V4 | Migración a React | Pendiente |
| V5 | Backend | Pendiente |

Regla: el proyecto avanza por versiones. No se adelantan funcionalidades de una versión posterior sin que se pida de forma explícita.

## Estilo

Estilo académico, con tono profesional que no canse la vista.

- Tema claro con paleta suave. Sin modo oscuro por ahora.
- Fondo gris muy suave en lugar de blanco puro; texto en gris azulado oscuro; un solo color de acento desaturado.
- Títulos con tipografía serif de sistema; texto en sans-serif de sistema. Sin fuentes web ni librerías externas.
- Interfaces simples: el usuario debe entender su semana rápidamente.
- La información de horarios debe ser principalmente visual.
- Accesibilidad: contraste de texto de al menos 4,5:1, foco visible, navegación por teclado y prioridad expresada con texto además de color.

Tokens de diseño (definidos en `docs/css/base.css`):

| Token | Valor |
|---|---|
| `--color-bg` | `#f4f5f7` |
| `--color-surface` | `#ffffff` |
| `--color-text` | `#1f2933` |
| `--color-text-muted` | `#52606d` |
| `--color-accent` | `#2f5d8a` |
| `--color-danger` | `#8a2f2f` |
| `--font-heading` | Georgia, 'Times New Roman', serif |
| `--font-body` | system-ui, sans-serif |

Los colores, espacios y tipografías salen siempre de las variables CSS, nunca de valores sueltos.

## Reglas de negocio

- La aplicación **informa y ayuda a decidir**; no toma decisiones importantes por el usuario. En una primera versión no elimina ni modifica tareas automáticamente.
- Las tareas, materias y actividades deben estar relacionadas entre sí.
- Tiempo ocupado: bloques fijos del usuario (clases, trabajo). Tiempo disponible: lo que queda libre para estudiar o hacer tareas.
- Sobrecarga: se compara el tiempo disponible con el tiempo requerido por las tareas pendientes y se advierte si el segundo supera al primero. Es una funcionalidad de la V3.
- Prioridades: alta, media y baja. Alta para exámenes próximos, entregas cercanas o tareas atrasadas; media para estudio y ejercicios; baja para lecturas complementarias y actividades sin fecha inmediata.
- Una tarea tiene: título, descripción, materia, duración estimada, prioridad, fecha límite y estado.

## Reglas de cálculo vigentes

- Pendientes y completadas: conteo según el estado de cada tarea.
- Horas estimadas pendientes: suma de la duración de las tareas pendientes.
- Progreso: completadas sobre el total, redondeado a entero; 0 si no hay tareas.
- Próxima entrega: la tarea pendiente con la fecha límite más cercana que sea hoy o posterior. Las pendientes vencidas se señalan como Overdue y no cuentan como próxima entrega.
- Una tarea está vencida si está pendiente y su fecha límite es anterior a hoy.

## Fuera de alcance

- Conexión con otras aplicaciones.
- Verificación con Facebook.
- Pagos dentro de la aplicación.
- Audio y vídeo.
- Hasta que se pida expresamente: calendario, horarios, materias como entidad propia, estadísticas, perfil, registro, filtros, cambio de semana y persistencia.

## Estructura del repositorio

```text
schemaweek/
├── docs/
│   ├── index.html
│   ├── css/
│   │   ├── style.css        importa los módulos
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── js/
│   │   └── script.js
│   └── Alcance.md
├── ai-context.md
└── README.md
```

La carpeta `docs/` contiene el código de la aplicación y no se publica con GitHub Pages: es una elección organizativa que sigue el `README.md`.

## Convenciones de código

- Todo el código y la interfaz en **inglés**: clases, ids, identificadores, valores de datos y textos de pantalla. `lang=en` en el HTML.
- Documentación del proyecto y mensajes de commit en **español**.
- HTML semántico; un único `h1`; todo control de formulario con su `label`.
- CSS mobile-first, con clases en notación BEM (`bloque__elemento--modificador`). Sin `!important`, sin selectores por id y sin estilos en línea. Cada clase definida debe existir en el HTML o ser asignada por JavaScript.
- JavaScript en un único archivo, como script clásico con `defer` y dentro de una función autoejecutable con `'use strict'`. No se usan módulos ES porque no funcionan al abrir el archivo directamente desde el sistema de archivos.
- El texto del usuario se inserta con `textContent`, nunca con `innerHTML`.
- Las fechas AAAA-MM-DD se convierten con una función local; `new Date` con esa cadena se interpreta en UTC y desplaza el día en la zona horaria de Argentina.
- Sin dependencias externas: ni librerías, ni fuentes web, ni CDN.
- Sin código muerto, sin `console.log` y sin comentarios que describan lo obvio.

## Contrato entre HTML, CSS y JavaScript

Los ids y las clases de `docs/index.html` son el contrato con el CSS y el JavaScript. No deben renombrarse sin actualizar los otros dos archivos.

| Qué | Selector |
|---|---|
| Formulario de tarea | `#task-form` |
| Lista de tareas | `#task-list` |
| Plantilla de tarea | `#task-template` |
| Estado vacío | `#empty-state` |
| Estadísticas | `#stat-pending`, `#stat-completed`, `#stat-hours` |
| Progreso | `#progress`, `#progress-text` |
| Próxima entrega | `#next-due` |

Modelo de datos de una tarea, solo en memoria: `id`, `title`, `description`, `subject`, `durationHours`, `priority` (`high`, `medium` o `low`), `dueDate` (AAAA-MM-DD), `completed` y `createdAt`.

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

- El código vive en `docs/`, no en la raíz.
- La acción principal de esta etapa es gestionar tareas: crear, completar y eliminar, con un resumen derivado.
- La materia es un campo de texto libre dentro de la tarea; todavía no es una entidad.
- No hay persistencia: al recargar la página, las tareas se pierden. `localStorage` queda para la V2.
- La navegación de la página usa anclas internas, porque las demás páginas aún no existen.

## Pendientes conocidos

- Un título o una materia con solo espacios se acepta y genera una tarea con el campo vacío.
- Tras eliminar una tarea, el foco del teclado queda sin destino definido.
- Persistencia con `localStorage`.
- Páginas restantes de la V1: calendario, materias, tareas y perfil.
- Cálculo de horas disponibles y detección de sobrecarga (V3).