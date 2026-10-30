# Plantilla: Guía de Sesión (una clase)

Las **guías de sesión** son documentos cortos, uno por clase, que el alumnado sigue durante la sesión. **No sustituyen a los apuntes**: los ordenan en el tiempo y enlazan a ellos (con ancla a la sección concreta). Si una explicación necesita más de 4-5 líneas, su sitio son los apuntes, no la guía.

## Ubicación y nombres

- Carpeta: `docs/temas/NN/sesiones/` (una por UT).
- Índice de la UT: `docs/temas/NN/sesiones/index.md` con la tabla de todas las sesiones previstas (las no redactadas aparecen sin enlace y marcadas como *pendiente*).
- Fichero por clase: `sNN-tema-corto.md` (p. ej. `s01-theming-material3.md`). La numeración es correlativa dentro de la UT.
- Título: `# **Sesión N.NN · Título**` (UT.número, p. ej. `Sesión 3.01`).
- Darlas de alta en `mkdocs.yml`, dentro de la UT, en el grupo `"Guía de clases"`.

## Proyecto de clase

- Cada UT tiene **su propio proyecto de clase**, que se construye en directo sesión a sesión (no son los proyectos de codelabs resueltos de `.projects/utN-lab/`).
- Parte siempre de la plantilla del curso `docs/temas/02/codelabs/res/ProyectoComposeBase` (IntelliJ 2026.2, AGP 9.1.1, compileSdk 37), renombrando paquete, `rootProject.name`, tema y `app_name`.
- Vive en `.projects/utN-clase/<nombre>/` como **repositorio Git propio** (ignorado por el repo de apuntes) y se publica en GitHub. Cada sesión tiene dos tags: `sN.MM-inicio` y `sN.MM-fin`. El fin de una sesión es el inicio de la siguiente.
- Antes de crear el tag de fin: `./gradlew assembleDebug` debe pasar y la captura de «lo que vas a construir» se toma del emulador (`docs/temas/NN/sesiones/images/`).
- UT2: `FichaJuego` (`.projects/ut2-clase/fichajuego`).

## Duración

- Sesión estándar: **120 min**. Toda guía debe poder darse también en **90 min**.
- Los bloques que se pueden saltar para la versión corta se marcan con `⏩` en la agenda y en su encabezado, y suman **unos 30 min**. Lo que se salta pasa a «Para casa» como «Termina los bloques X e Y si no dio tiempo en clase».
- **La guía la leen los alumnos:** el icono `⏩` va **sin explicación**. No menciones nunca la versión de 1 h 30 min, «versión corta», «sáltate» ni totales alternativos; la ficha dice solo «Duración: 2 h».
- Reparto orientativo: 10 min de arranque, 70-80 min de explicación + práctica guiada alternadas (bloques de 15-25 min, nunca más de 20 min seguidos de exposición), 15-20 min de práctica autónoma, 5-10 min de cierre.

## Estructura obligatoria

1. **Título + una frase** que diga qué se va a conseguir hoy.
2. **Ficha** (`!!! abstract "Ficha de la sesión"`): duración, unidad, apuntes de referencia (enlaces), proyecto/código, requisitos previos.
3. **🎯 Objetivos** (3-4 viñetas, «Al terminar la clase sabrás…»).
4. **✅ Antes de empezar** (preparación: proyecto abierto, emulador, rama…).
5. **⏱️ Agenda**: tabla `| # | Min | Bloque | Apuntes |`. Marcar `⏩` los bloques recortables. Fila final con el total.
6. **Bloques** (`## N · Título (MM min)`): por bloque, 2-4 ideas clave muy breves, el enlace con ancla al apartado de los apuntes (`[3A.1 §1.2](../a-diseno/3a.1-....md#ancla)`), y un `!!! example "Manos a la obra"` con pasos numerados. Un *gotcha* por bloque como máximo (`!!! warning`).
7. **🧪 Comprobación rápida** (*ticket de salida*): 3-4 preguntas cortas con la respuesta plegada en `??? success "Respuesta"`.
8. **🏠 Para casa**: los bloques ⏩ que no dio tiempo a hacer, el reto de consolidación y la lectura previa de la próxima sesión.
9. **➡️ Próxima sesión**: enlace y una línea.

## Reglas

- Enlaces relativos al `.md` con ancla. Comprobar los anclajes con `mkdocs build` (MkDocs avisa de anclas inexistentes).
- Código: solo fragmentos mínimos (≤ 15 líneas) que se escriben en directo; el código completo vive en los apuntes/codelabs.
- Segunda persona del singular dirigida al alumno («abre», «comprueba»).
- Formato estricto de listas de `AGENTS.md` (línea en blanco antes de cada lista, pasos numerados separados por línea en blanco, sublistas a 4 espacios).
