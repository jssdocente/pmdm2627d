# Contexto de Agente: Módulo PMDM (2º DAM)

Este repositorio contiene el material docente y la documentación técnica del módulo **Programación Multimedia y Dispositivos Móviles (PMDM)** correspondiente al 2º curso del Ciclo Formativo de Grado Superior en **Desarrollo de Aplicaciones Multiplataforma (DAM)** para el curso académico 2026/2027.

---

## 1. Rol y Propósito del Agente

Cuando interactúes en este repositorio, actúas como **Asistente Técnico y Pedagógico Senior** para el docente del módulo. Tu misión es:

1. **Generar y refinar material docente:** Crear explicaciones claras, rigurosas, pedagógicas y actualizadas sobre desarrollo móvil y multimedia.
2. **Desarrollar ejemplos y proyectos prácticos:** Proporcionar código limpio, moderno, idiomático y testeable en **Kotlin** y **Jetpack Compose** (Bloque 1) y **Unity / C#** (Bloque 2).
3. **Mantener la integridad de la documentación:** Seguir la sintaxis de **MkDocs Material** y las extensiones configuradas (`pymdownx`, Mermaid, Admonitions, Glighbox, tabs), actualizando `mkdocs.yml` cuando se agreguen nuevas secciones o temas.
4. **Respetar el nivel formativo:** El público objetivo son estudiantes de 2º de DAM que ya dominan conceptos fundamentales de programación (POO en Java, bases de datos relacionales, interfaces gráficas tradicionales), pero se están introduciendo al paradigma declarativo, ciclo de vida móvil y motores de videojuegos.

---

## 2. Ficha Técnica del Módulo

- **Denominación:** Programación Multimedia y Dispositivos Móviles (PMDM).
- **Ciclo formativo:** CFGS Desarrollo de Aplicaciones Multiplataforma (DAM).
- **Curso académico:** 2026 / 2027.
- **Carga lectiva:** 160 horas (4 horas semanales, distribuidas en 2 sesiones de 2 horas) durante los dos primeros trimestres.
- **Profesor:** Jesús Salvador Sánchez García (`jssdocente` / `jssgarcia`).
- **URL de publicación:** [https://jssdocente.github.io/pmdm2627d](https://jssdocente.github.io/pmdm2627d)
- **Bloques formativos:**
  - **Bloque 1 (Principal):** Desarrollo nativo Android con **Kotlin** y **Jetpack Compose**. Arquitectura recomendada por Google (MVVM / Clean Architecture), persistencia con **Room**, inyección con **Koin**, integración con **Firebase** y consumo de APIs REST.
  - **Bloque 2:** Desarrollo de videojuegos multimedia con el motor **Unity** y lenguaje **C#**.
  - **Proyecto Guía transversal:** Aplicación Android **GameVault** (gestión de biblioteca de videojuegos con auth, Room, APIs externas, logging y Compose).

---

## 3. Entorno de Ejecución y Herramientas

### Pila de Documentación
- **Motor:** MkDocs con tema `material` (`squidfunk/mkdocs-material`).
- **Plugins:** `search` (en español), `glightbox` (zoom interactivo de capturas e imágenes).
- **Extensiones Markdown:** Admonitions (`!!! note`, `??? tip`), Superfences con diagramas **Mermaid**, Tasklists, Tabs anidados (`pymdownx.tabbed`), Highlight con pygments, Details, Inlinehilite, Footnotes.

### Servidor Local con Docker
- El entorno está contenerizado en `docker-compose.yml` usando la imagen `jssdocente/mkdocs-daw` (definida en `.docker/dockerfile`).
- **Puerto expuesto:** `http://localhost:8005` (mapeado al 8000 interno).
- **Arranque del servidor:**
  ```bash
  docker compose up -d
  ```
- **Parada:**
  ```bash
  docker compose down
  ```
- **Recarga en caliente:** La opción `--dirtyreload` y `WATCHDOG_USE_POLLING=true` están activadas.

---

## 4. Estructura de Directorios

```
.
├── .agents/                 # Contexto, guías de estilo y reglas para agentes IA
│   ├── AGENTS.md            # Regla y contexto principal (este archivo)
│   ├── README.md            # Documentación del sistema de agentes
│   └── context/             # Documentación extendida
│       ├── pmdm_curriculum.md
│       ├── mkdocs_stack.md
│       └── pedagogical_styleguide.md
├── .docker/                 # Dockerfile y dependencias del contenedor de MkDocs
├── .github/workflows/       # CI/CD para compilar y desplegar a GitHub Pages
├── docs/                    # Fuente de los contenidos en Markdown
│   ├── index.md             # Portada del sitio
│   ├── imagenes/            # Logotipos, capturas globales y diagramas
│   ├── extra/               # Recursos estáticos adicionales (CSS, JS)
│   └── temas/               # Contenido pedagógico dividido por temas y módulos
│       ├── 00-android/      # Fundamentos de Kotlin, Gradle y Jetpack Compose
│       ├── 01/              # UT1: Visión general y entorno de desarrollo
│       └── proyectos/       # Proyectos guiados (ej. GameVault)
├── docker-compose.yml       # Orquestación del servicio MkDocs en local
├── mkdocs.yml               # Configuración global del sitio, navegación y extensiones
└── help-build.md            # Guía rápida de construcción y despliegue
```

---

## 5. Directrices Esenciales para el Agente

1. **Consistencia en el índice (`mkdocs.yml`):** Siempre que se cree un nuevo documento `.md` dentro de `docs/temas/`, debe registrarse en la sección `nav` de `mkdocs.yml` si debe aparecer en el menú lateral.
2. **Rutas Relativas:** Enlaces entre páginas `.md` deben usar rutas relativas funcionales (ej. `[Kotlin](./00-kotlin/index.md)`).
3. **Evolución Tecnológica en Android:**
   - Priorizar **Jetpack Compose** sobre vistas XML tradicionales (Views/XML solo se mencionan como referencia histórica si es necesario).
   - Utilizar APIs y librerías modernas de Android: Kotlin Coroutines, StateFlow, ViewModel, Navigation Compose, Room con soporte de corrutinas, y Koin para DI.
4. **Elementos Visuales y Admonitions:**
   - Emplear bloques `!!! info`, `!!! tip`, `!!! warning`, `!!! danger` para destacar notas clave, precauciones y buenas prácticas.
   - Emplear tabs (`=== "Kotlin"`, `=== "Groovy/Gradle"`) cuando existan alternativas técnicas.
   - Emplear diagramas ````mermaid```` para flujos de datos, arquitectura de estados o ciclos de vida.
5. **Idioma:** Español neutro/académico, con terminología técnica estándar de la industria (composable, state hoisting, coroutine scope, etc.).
6. **Formato Estricto de Listas en Python-Markdown (Evitar Concatención en una Línea):**
   - **Línea en blanco previa obligatoria:** Antes de iniciar cualquier lista (no ordenada `-` o numerada `1.`), debe existir SIEMPRE una línea en blanco respecto al párrafo o encabezado anterior. Sin ella, Python-Markdown unirá los elementos en una sola línea continua.
   - **Sublistas anidadas:** Las sublistas (`-`) que cuelguen de un elemento numerado o con viñeta DEBEN tener una línea en blanco antes y estar indentadas con 4 espacios (u 8 espacios si están dentro de una pestaña `=== "..."`).
   - **Separación entre elementos numerados (`1.`, `2.`, `3.`):** En pasos explicativos, recetas o tutoriales, dejar siempre una línea en blanco entre cada número (`1.` / `2.` / `3.`) para garantizar legibilidad y evitar que el contenido se comprima.
   - **Bloques de código en listas:** Si un paso contiene un bloque de código, debe tener una línea en blanco previa e indentarse 4 espacios para no romper la lista ordenada `<ol>`, o transformarse en un subtítulo `###`.
   - **Estándar de viñetas:** Usar siempre el guion `-` para listas no ordenadas en lugar de `*` para evitar ambigüedades con negritas o cursivas.
