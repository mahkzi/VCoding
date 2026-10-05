# Schemaweek

> Organizador semanal para estudiantes

Schemaweek es una aplicación web orientada a estudiantes que necesitan organizar sus materias, clases, tareas, fechas de entrega y actividades personales dentro de una planificación semanal.

El objetivo principal no es solamente administrar tareas, sino ayudar al estudiante a **organizar su tiempo teniendo en cuenta sus horarios disponibles y su carga académica**.

---

## Objetivo del proyecto

Schemaweek permite que un estudiante pueda:

- Registrar sus materias.
- Definir sus horarios fijos.
- Crear tareas y trabajos prácticos.
- Establecer fechas límite.
- Indicar una duración estimada para cada tarea.
- Organizar actividades dentro de la semana.
- Visualizar el tiempo ocupado y disponible.
- Consultar sus próximas entregas.
- Detectar semanas con una carga de trabajo elevada.
- Consultar estadísticas sobre la distribución de su tiempo.

### Problema que busca resolver

Un estudiante puede tener muchas obligaciones diferentes:

- Clases.
- Trabajo.
- Estudio.
- Trabajos prácticos.
- Exámenes.
- Actividades personales.

El problema no siempre es saber **qué** tiene que hacer, sino saber **cuándo puede hacerlo**.

Schemaweek busca resolver ese problema mostrando las obligaciones del estudiante dentro de una misma planificación semanal.

---

# Concepto principal

El funcionamiento de Schemaweek se basa en cuatro elementos principales:

```text
                    Schemaweek
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
      HORARIOS        TAREAS       MATERIAS
          │             │             │
          └─────────────┼─────────────┘
                        ↓
                SEMANA ORGANIZADA
                        │
                        ↓
                 TIEMPO DISPONIBLE
```

La aplicación conoce los horarios ocupados del estudiante y sus tareas pendientes para ayudarlo a visualizar cómo distribuir su tiempo.

---

# Funcionalidades principales

## 1. Resumen

El Resumen será la pantalla principal de la aplicación.

Debe mostrar un resumen rápido de la situación semanal del usuario.

### Información posible

- Semana actual.
- Cantidad de tareas pendientes.
- Tareas completadas.
- Horas ocupadas.
- Horas disponibles.
- Horas destinadas al estudio.
- Próximas entregas.
- Actividades importantes.
- Nivel de carga semanal.

Ejemplo conceptual:

```text
┌─────────────────────────────────────┐
│             TU SEMANA               │
├─────────────────────────────────────┤
│                                     │
│  32h        12h          18h        │
│ Ocupado    Estudio     Disponible   │
│                                     │
│ Tareas                              │
│ ████████████░░░░ 75%                │
│                                     │
│ Próxima entrega                     │
│ 🔴 Trabajo SQL                     │
│    Mañana ·                         │
│                                     │
└─────────────────────────────────────┘
```

---

# 2. Calendario semanal

El calendario será uno de los componentes principales de Schemaweek.

Permitirá visualizar las actividades distribuidas durante la semana.

Ejemplo:

```text
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ LUN  │ MAR  │ MIE  │ JUE  │ VIE  │ SAB  │
├──────┼──────┼──────┼──────┼──────┼──────┤
│      │ 📐   │      │ 💻   │      │      │
│ 💼   │      │ 💼   │      │ 💼   │ 📚   │
│      │ 📚   │      │ 📚   │      │      │
│ 🏋   │      │ 🏋   │      │      │      │
└──────┴──────┴──────┴──────┴──────┴──────┘
```

Las actividades podrán diferenciarse visualmente según su categoría.

Por ejemplo:

- Clase.
- Estudio.
- Tarea.
- Trabajo.
- Actividad personal.

---

# 3. Horarios

El usuario podrá registrar sus actividades fijas.

Ejemplo:

```text
Lunes
09:00 - 17:00 → Trabajo

Martes
08:00 - 10:00 → Matemática
18:00 - 20:00 → Programación

Miércoles
09:00 - 17:00 → Trabajo

Jueves
18:00 - 20:00 → Programación

Viernes
09:00 - 17:00 → Trabajo
```

Estos bloques representan tiempo ocupado.

A partir de ellos, la aplicación podrá determinar qué espacios quedan disponibles para estudiar o realizar tareas.

---

# 4. Materias

El usuario podrá registrar las materias que está cursando.

Ejemplo:

| Materia | Horas de cursada | Horas de estudio |
|---|---:|---:|
| Programación | 4 h | 6 h |
| Matemática | 4 h | 5 h |
| Base de Datos | 3 h | 4 h |
| Inglés | 2 h | 3 h |

Cada materia podrá contener información adicional:

- Nombre.
- Profesor.
- Horarios.
- Color identificativo.
- Horas semanales.
- Próximo examen.
- Próximas entregas.

---

# 5. Tareas

El usuario podrá crear tareas asociadas a una materia.

Cada tarea debería poder tener:

- Título.
- Descripción.
- Materia.
- Duración estimada.
- Prioridad.
- Fecha límite.
- Estado.

Ejemplo:

```text
┌──────────────────────────────────┐
│ Nueva tarea                      │
├──────────────────────────────────┤
│                                  │
│ Trabajo práctico de SQL          │
│                                  │
│ Materia: Base de Datos           │
│ Duración: 2 horas                │
│ Prioridad: Alta                  │
│ Fecha límite: 08/10              │
│                                  │
│ [ Crear tarea ]                  │
└──────────────────────────────────┘
```

---

# 6. Prioridades

Las tareas podrán tener diferentes niveles de prioridad.

### Alta

Ejemplos:

- Examen próximo.
- Trabajo práctico con entrega cercana.
- Tarea atrasada.

### Media

Ejemplos:

- Estudiar para una evaluación futura.
- Completar ejercicios.

### Baja

Ejemplos:

- Lecturas complementarias.
- Actividades que no tienen una fecha inmediata.

La aplicación podrá utilizar estas prioridades para facilitar la organización visual.

---

# 7. Tiempo disponible

Esta es una de las funcionalidades centrales del proyecto.

La aplicación debe diferenciar entre:

**Tiempo ocupado**

```text
Trabajo
09:00 ───────── 17:00
```

y:

**Tiempo disponible**

```text
17:00 ───────── 18:00
        DISPONIBLE

18:00 ───────── 20:00
        DISPONIBLE
```

Esto permitirá que el usuario pueda visualizar dónde tiene espacio para estudiar o realizar tareas.

---

# 8. Detección de sobrecarga

Schemaweek podrá comparar:

```text
Horas disponibles
        VS
Horas necesarias
```

Por ejemplo:

```text
Tiempo disponible:    15 h

Trabajo pendiente:
Programación           5 h
Matemática             4 h
Base de Datos          6 h
Inglés                 3 h
──────────────────────────
Total                  18 h
```

Resultado:

```text
Tiempo disponible: 15 h
Tiempo requerido:  18 h

Diferencia: +3 h
```

La aplicación podrá mostrar una advertencia indicando que la semana tiene una carga superior al tiempo disponible.

Importante: en una primera versión, la aplicación no debería decidir automáticamente qué tareas eliminar o modificar. Su función será **informar y ayudar al usuario a tomar la decisión**.

---

# 9. Vista de materias

La aplicación tendrá una sección específica para visualizar las materias.

Ejemplo:

```text
┌─────────────────┐
│ 📘 Programación │
│                 │
│ 4 tareas        │
│ 72% completado  │
│                 │
│ Próxima entrega │
│ 10/10           │
└─────────────────┘

┌─────────────────┐
│ 📗 Matemática   │
│                 │
│ 3 tareas        │
│ 45% completado  │
│                 │
│ Parcial         │
│ 15/10           │
└─────────────────┘
```

Al ingresar a una materia, el usuario podrá consultar:

- Tareas.
- Próximas entregas.
- Exámenes.
- Horarios.
- Progreso.

---

# 10. Estadísticas

Las estadísticas serán una funcionalidad posterior.

Podrán mostrar cómo se distribuye el tiempo del estudiante.

Ejemplo:

```text
HORAS POR CATEGORÍA

Estudio       ████████████  12h
Cursada       ██████         6h
Trabajo       █████████████ 15h
Personal      █████          5h
```

También podrán mostrarse estadísticas sobre las tareas:

```text
TAREAS

Completadas       14
Pendientes         6
Vencidas           1

Progreso

████████████████░░░░ 82%
```

---

# Flujo principal del usuario

El flujo inicial de Schemaweek podría ser:

```text
        REGISTRO / INICIO
                │
                ↓
        CONFIGURAR PERFIL
                │
                ↓
        AGREGAR MATERIAS
                │
                ↓
       AGREGAR HORARIOS FIJOS
                │
                ↓
         CREAR TAREAS
                │
                ↓
       ORGANIZAR LA SEMANA
                │
                ↓
        VER TIEMPO DISPONIBLE
                │
                ↓
      CONSULTAR CARGA SEMANAL
```

---

# Estructura de navegación

La aplicación podría contar inicialmente con:

```text
Schemaweek
│
├── Resumen
│
├── Calendario
│
├── Materias
│
├── Tareas
│
├── Horarios
│
└── Perfil
```

Posteriormente podrían agregarse:

```text
├── Estadísticas
├── Hábitos
└── Configuración
```

---

# Desarrollo por versiones

El proyecto debe desarrollarse progresivamente.

No se recomienda intentar implementar todas las funcionalidades desde el inicio.

## V1 — Maquetación

Tecnologías:

- HTML
- CSS

Objetivo:

Construir la interfaz visual sin lógica compleja.

Páginas iniciales:

```text
docs/
├── index.html
├── calendario.html
├── materias.html
├── tareas.html
└── perfil.html
```

Funcionalidades:

- Resumen.
- Calendario.
- Lista de tareas.
- Materias.
- Formularios visuales.
- Diseño responsive básico.

---

## V2 — JavaScript

Agregar comportamiento dinámico.

Funcionalidades:

- Crear tareas.
- Eliminar tareas.
- Completar tareas.
- Crear materias.
- Crear horarios.
- Filtrar tareas.
- Cambiar de semana.
- Guardar información mediante `localStorage`.

En esta etapa, Schemaweek debería convertirse en una aplicación funcional aunque todavía no tenga backend.

---

## V3 — Organización semanal

Agregar lógica relacionada con la planificación.

Funcionalidades:

- Cálculo de horas disponibles.
- Cálculo de horas ocupadas.
- Cálculo de tiempo necesario.
- Detección de sobrecarga.
- Próximas fechas límite.
- Resumen semanal.
- Indicadores de progreso.

---

## V4 — React

Migrar la aplicación a React.

Una posible estructura:

```text
src/
├── components/
│   ├── Sidebar/
│   ├── Header/
│   ├── Calendar/
│   ├── TaskCard/
│   ├── SubjectCard/
│   ├── TimeBlock/
│   └── WeeklySummary/
│
├── pages/
│   ├── Resumen/
│   ├── Calendar/
│   ├── Subjects/
│   └── Tasks/
│
├── services/
├── hooks/
├── types/
└── utils/
```

---

## V5 — Backend

Finalmente se podrá agregar persistencia en servidor.

Modelo conceptual:

```text
Usuario
│
├── Materias
│     ├── Tareas
│     └── Exámenes
│
├── Horarios
│
└── Actividades
```

Funcionalidades posibles:

- Registro.
- Inicio de sesión.
- Persistencia de datos.
- Sincronización entre dispositivos.
- Gestión de usuarios.
- Base de datos.

---

# Funcionalidades futuras

Una vez desarrollado el núcleo de la aplicación, podrían agregarse:

- Recordatorios.
- Notificaciones.
- Modo oscuro.
- Hábitos.
- Estadísticas avanzadas.
- Repetición de tareas.
- Arrastrar y soltar actividades.
- Vista diaria.
- Vista mensual.
- Diferentes perfiles de estudiante.
- Exportación del calendario.

Estas funcionalidades no forman parte del núcleo inicial y deberían evaluarse después de completar las versiones principales.

---

# Principios del proyecto

Schemaweek debería priorizar:

### Simplicidad

El usuario debe poder entender su semana rápidamente.

### Visualización

La información relacionada con horarios debe ser principalmente visual.

### Organización

Las tareas, materias y actividades deben estar relacionadas entre sí.

### Control del usuario

La aplicación debe ayudar a organizar, pero no tomar decisiones importantes automáticamente.

### Escalabilidad

La arquitectura debe permitir pasar de una aplicación estática a una aplicación completa con React y backend.

---

# Propuesta de valor

La propuesta central de Schemaweek es:

> **Schemaweek permite a los estudiantes organizar sus materias, clases, tareas y actividades personales dentro de una planificación semanal, mostrando cuánto tiempo tienen disponible y alertando cuando la carga de trabajo supera el tiempo disponible.**

El proyecto busca transformar una lista de obligaciones en una **visión completa de la semana del estudiante**.

---

# Estado del proyecto

V1 y V2 en desarrollo


## Lo que no va a incluir:

1. Conexión a otras aplicaciones
2. Verificación con Facebook
3. Pagos en la aplicación
4. Audios ni vídeos.
