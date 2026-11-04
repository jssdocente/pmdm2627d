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
