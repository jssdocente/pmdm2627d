# Banco de preguntas tipo test (práctica pública)

Fuente de la página [Practica Kotlin](../docs/temas/evaluacion/practica-kotlin.md). Al compilar el sitio, el *hook* `hook_mkdocs.py` convierte `kotlin/*.md` en `site/extra/quiz/kotlin.json`, y `docs/extra/js/kt-quiz.js` lo muestra.

> ⚠️ Todo lo que hay aquí es **público** (las soluciones viajan al navegador). Nunca copies preguntas de exámenes o simulacros: esas viven en el repositorio privado.

## Formato

Un fichero por bloque de los apuntes. Cada pregunta es un `##` con id y atributos; cada opción, un `###` (la correcta lleva `✔`); la cita `>` final de cada opción es su realimentación.

````markdown
---
bloque: 3
titulo: Bucles y rangos
apuntes: temas/00-android/00-kotlin/12.2-bucles-iteracion.md
---

## kt-buc-002 {dificultad=1 tipo=salida ancla=5-el-modismo-agil-repeatn}

¿Qué imprime este código?

```kotlin
repeat(3) { print(it) }
```

### A ✔

`012`

> Correcto. `repeat(n)` pasa el índice de la vuelta, que empieza en 0.

### B

`123`

> El índice empieza en 0, como en listas y arrays.
````

Atributos:

- `dificultad`: 1 básica, 2 media, 3 trampa.
- `tipo`: `salida` (qué imprime), `compila` (añade `error` si NO compila) o `concepto`.
- `ancla`: apartado de los apuntes. Puede ser `id` (en la página del bloque) o `otra-pagina.md#id`.
- `excepcion=Nombre`: la ejecución lanza esa excepción.
- `ejecutable` / `noejecutable`: fuerza mostrar u ocultar el botón «▶ Ejecútalo tú» (por defecto aparece en `salida` y `compila`).

En las preguntas `salida`, la respuesta correcta debe ser un bloque ```` ```text ```` o un único `` `código` `` en línea: es lo que compara el verificador.

## Comprobaciones

```bash
python3 quiz/banco.py          # estructura: ids únicos, 3-4 opciones, una ✔, realimentación en todas
```

```bash
python3 quiz/verificar.py --cp ruta/a/kotlinx-coroutines-core-jvm.jar   # compila y ejecuta con kotlinc
```

El verificador necesita `kotlinc` (`sdk install kotlin`). El jar de corrutinas está en la caché de Gradle (`~/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlinx/kotlinx-coroutines-core-jvm/`).

---

# Banco de ejercicios de código (práctica del examen de Kotlin con TDD)

Fuente de la página [Practica Kotlin: código y TDD](../docs/temas/evaluacion/practica-codigo.md). El *hook* `hook_codigo.py` convierte `codigo/*.md` en `site/extra/quiz/codigo.json`, y `docs/extra/js/kt-codigo.js` lo muestra.

> ⚠️ Igual que el banco tipo test, es **público**: los tests «ocultos» y las soluciones viajan al navegador. Los ejercicios deben ser **nuevos**: nada de dominios, enunciados ni tests de exámenes o simulacros (viven en el repositorio privado).

Un fichero por tipo de ejercicio, con `tipo` en la cabecera. Cada ejercicio es un `##` con id, título y atributos: `tema` (uno o varios de `TEMAS` en `codigo.py`, separados por comas; los usa la tanda para filtrar), `dificultad` (1-3) y `ancla` (página de los apuntes, relativa a `apuntes`). El texto hasta la primera `###` es el enunciado.

| Tipo | Secciones `###` | En la página |
| :--- | :--- | :--- |
| `kata` | Código (esqueleto con `TODO(`), Tests, Solución, Pistas | Kotlin Playground con `data-target-platform="junit"`: los tests van como dependencia oculta |
| `error` | Código, Tests, Explicación | Se pulsa la línea marcada con `//! corrige: <línea corregida>` |
| `huecos` | Código con `[[respuesta\|alternativa]]`, Tests, Explicación | Un campo por hueco; se aceptan las alternativas (sin contar los espacios de los extremos) |
| `parsons` | Código en el orden correcto, Tests, Explicación | Se desordenan las líneas; marcas `//!fijo`, `//!distractor` y `//!grupo=x` (líneas consecutivas intercambiables) |
| `defensa` | Respuesta modelo, Cotejo (lista) | Respuesta libre y autoevaluación con la lista de cotejo |

Los tests usan `kotlin.test` (`assertEquals`, `assertFailsWith`…), como en el examen. En los ejercicios `error`, el enunciado lleva el mensaje del test que falla en un bloque ```` ```text ```` con el formato de Playground (`Fail: nombreDelTest: expected:<…> but was:<…>` o `Error: nombreDelTest: mensaje`); el verificador comprueba que es el mensaje real.

```bash
python3 quiz/codigo.py              # estructura: ids únicos, secciones obligatorias, marcas
```

```bash
python3 quiz/verificar_codigo.py    # compila y ejecuta los tests con kotlinc (unos 2-3 minutos)
```

El verificador comprueba que el esqueleto de cada kata compila y falla y que su solución pasa; que el código erróneo falla con el mensaje del enunciado y el corregido pasa; y que los huecos rellenos y los Parsons ordenados pasan sus tests. Usa `kotlinc` y los jar de `kotlin-test` de su instalación, más JUnit 4 y Hamcrest de la caché de Gradle.
