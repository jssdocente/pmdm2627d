# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Material docente del módulo PMDM (2º DAM, curso 26/27): un sitio MkDocs Material publicado en https://jssdocente.github.io/pmdm2627d, más los proyectos Kotlin/Android que acompañan a los apuntes. Escribe siempre en español.

Las reglas de rol, tono pedagógico, extensiones de MkDocs y, sobre todo, el **formato estricto de listas de Python-Markdown** están en `.agents/AGENTS.md` (con ampliaciones en `.agents/context/`). Son de obligado cumplimiento:

@.agents/AGENTS.md

Ampliaciones bajo demanda: `.agents/context/pedagogical_styleguide.md` (estructura de lección, convenciones Kotlin/Compose/Unity), `.agents/context/mkdocs_stack.md` (sintaxis de admonitions, tabs, anotaciones de código), `.agents/context/pmdm_curriculum.md` (temario y proyecto GameVault), `.agents/context/session_guide.md` (plantilla de las guías de sesión, una por clase de 2 h / 1:30, en `docs/temas/NN/sesiones/`).

## Comandos

```bash
docker compose up -d              # sirve el sitio en http://localhost:8005 con recarga en caliente
docker compose logs -f mkdocs     # ver warnings de MkDocs (enlaces rotos, páginas fuera del nav)
mkdocs build                      # lo mismo que ejecuta CI (requiere mkdocs-material y mkdocs-glightbox)
```

El despliegue es automático: un push a `main` ejecuta `.github/workflows/build-push-mkdocs.yml` y publica en GitHub Pages. `site/` es salida generada (está en .gitignore): no la edites.

Proyectos Kotlin/Gradle (`.exams/*/…`, `.projects/*/…`): cada uno tiene su propio `gradlew`; ejecútalo desde la raíz de ese proyecto, no desde la raíz del repositorio.

```bash
./gradlew test                                  # todos los tests
./gradlew test --tests "service.HeroeServiceTest"   # una sola clase de test
./gradlew run                                   # proyectos de consola (exámenes)
```

Corrección automática de cuestionarios tipo test:

```bash
python3 .exams/.cuestionarios/bin/corregir.py --solucionario <solucionario.yaml> --entregas <carpeta> [--salida reporte.md]
```

## Arquitectura del repositorio

- `mkdocs.yml` → `nav` es la única fuente del menú. Toda página nueva bajo `docs/temas/` debe darse de alta ahí; las entradas comentadas (`# - ...`) son temas de cursos anteriores o pendientes, no las borres. `use_directory_urls: false`, así que los enlaces entre páginas apuntan al `.md` con ruta relativa.
- `docs/temas/00-android/`: base transversal (Kotlin, herramientas Gradle/Manifest, IDE, Compose, arquitectura). `docs/temas/01`…`09`: unidades de trabajo (UT); los ficheros se numeran `N.M-tema.md`. `docs/temas/proyectos/`: GameVault y proyecto intermodular.
- **Patrón laboratorio + codelabs**: cada UT práctica tiene `N.x-laboratorio-retos.md` y `docs/temas/NN/codelabs/NN-nombre.md` (con imágenes en `codelabs/images/`). Cada codelab se corresponde con un paquete del proyecto Android resuelto en `.projects/utN-lab/pmdm-lab-utNN/` (p. ej. `app/src/main/java/com/dam/pmdmlab03/codelabs/codelab01_theming`), que se enlaza desde un drawer de navegación en `MainActivity.kt`. Si cambias el código de un codelab en la doc, mantén coherente el proyecto (y viceversa).
- `.exams/`: exámenes y simulacros de Kotlin. Cada uno tiene una carpeta de **enunciado** (métodos con `TODO("Pendiente de implementar")` + tests completos en `src/test`) y otra `solucion/`. La evaluación es 50 % TDD (que pasen los tests) y 50 % funcionalidad en `Main.kt`; el código esperado usa pipelines declarativos de colecciones, no bucles imperativos. `00-ejemplo-modelo-resuelto/README.md` es la referencia del formato. Nunca pongas la solución en la carpeta del enunciado.
- `.exams/.cuestionarios/<prueba>/`: `preguntas.md`, `solucionario.md` y `solucionario.yaml` (este último es el que lee `corregir.py`).
- Los `.zip` que se ofrecen a los alumnos para descargar viven en `docs/_res/` (p. ej. el modelo de examen resuelto).
- Ignorados/archivo: `_bck/`, `docs/_bck/`, `.others_courses/`, `index_old.md`: material antiguo, no lo uses como referencia salvo que se pida.
