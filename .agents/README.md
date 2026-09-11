# Configuración de Agentes IA (`.agents/`)

Esta carpeta contiene las instrucciones de contexto, normas pedagógicas y especificaciones técnicas para los asistentes de inteligencia artificial (como Google Antigravity / Gemini CLI) que asisten en la creación y mantenimiento del contenido docente de este repositorio.

---

## Estructura de la Carpeta

```
.agents/
├── AGENTS.md                          # Regla y contexto principal descubierto automáticamente por el agente
├── README.md                          # Este documento informativo
└── context/                           # Documentos de referencia detallados
    ├── pmdm_curriculum.md             # Plan formativo, competencias, bloques y proyecto GameVault
    ├── mkdocs_stack.md                # Configuración de MkDocs Material, Docker y extensiones
    └── pedagogical_styleguide.md      # Guía pedagógica, estructura de lecciones y estándares de código
```

---

## Archivos de Contexto

1. **[`AGENTS.md`](./AGENTS.md):**
   Punto de entrada principal. Describe la identidad del módulo (PMDM 2º DAM, Curso 26/27), el rol del asistente para el profesor Jesús García, directrices técnicas clave y comandos para el servidor local.

2. **[`context/pmdm_curriculum.md`](./context/pmdm_curriculum.md):**
   Detalle de las unidades didácticas:
   - Bloque 1: Android Nativo (Kotlin moderno, herramientas Gradle/Manifest, Jetpack Compose, Arquitectura MVVM/Clean, Room, Koin, Firebase y proyecto GameVault).
   - Bloque 2: Programación multimedia y videojuegos (Unity y C#).

3. **[`context/mkdocs_stack.md`](./context/mkdocs_stack.md):**
   Especificaciones del renderizador MkDocs con tema Material:
   - Configuración del contenedor Docker (`docker compose up -d` en puerto `8005`).
   - Sintaxis de extensiones activas: Admonitions (`!!! note`), Tabs (`=== "Tab"`), Diagramas Mermaid (`mermaid`), Lightbox (`glightbox`) y resaltado de sintaxis con anotaciones de código.
   - Flujo CI/CD con GitHub Actions hacia GitHub Pages.

4. **[`context/pedagogical_styleguide.md`](./context/pedagogical_styleguide.md):**
   Pautas de redacción orientadas a alumnos de Formación Profesional de Grado Superior:
   - Tono didáctico y resolución de errores típicos ("gotchas").
   - Estructura estándar de las lecciones.
   - Convenciones de código para Kotlin, Jetpack Compose y Unity C#.
