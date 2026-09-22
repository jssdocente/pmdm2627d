# Taller de Testing 2: El Ahorcado con TDD (Desarrollo Guiado por Pruebas)

En el taller anterior del [Combate RPG](./01-test-combate-rpg.md) aprendiste a realizar **testing retrospectivo**: tomaste un código que ya funcionaba en consola y lo refactorizaste para extraer funciones puras que pudieran ser probadas con JUnit y Gradle.

En este segundo taller daremos el gran salto metodológico que aplican los equipos de ingeniería de élite: **TDD (*Test-Driven Development* o Desarrollo Guiado por Pruebas)**.

---

## 1. La Filosofía TDD: El Ciclo Rojo → Verde → Refactorizar

En TDD, **el test se escribe antes que el código de producción**. El flujo de trabajo se divide en tres fases iterativas (*Red-Green-Refactor*):

```mermaid
flowchart LR
    Rojo["🔴 1. ROJO (Red)<br>Escribir un test que falla<br>(define el requisito)"] --> Verde["🟢 2. VERDE (Green)<br>Escribir el código mínimo<br>para que el test pase"]
    Verde --> Refactor["🔵 3. REFACTOR<br>Limpiar y optimizar código<br>manteniendo el verde"]
    Refactor --> Rojo
```

1. **🔴 Rojo (*Red*):** Se define la prueba unitaria que describe un requisito exacto. Como la función aún no está implementada, el test compila pero **falla** al ejecutarse.
2. **🟢 Verde (*Green*):** Escribes la solución mínima necesaria para satisfacer la aserción y conseguir que el test pase con éxito.
3. **🔵 Refactorizar (*Refactor*):** Limpias la sintaxis, eliminas duplicidades o mejoras el rendimiento sabiendo que la suite de tests te protege contra cualquier error involuntario.

!!! tip "¿Cómo encaja esto con tu proyecto `pmdm-kotlin-lab`?"
    Para evitar conflictos de firmas con tu juego original de consola del Bloque 2 (`Reto02_AhorcadoJuego.kt`), este taller se desarrolla en un subpaquete limpio y aislado:  
    📁 **`package b02_funciones_lambdas.tdd`**

---

## 2. Fase 1: El Contrato Inicial (Tu Punto de Partida en Rojo)

En un entorno profesional, el arquitecto de software o el líder técnico define el **contrato de interfaz** y la **suite de pruebas de aceptación**. Tu misión como desarrollador es implementar la lógica hasta conseguir el semáforo verde.

---

### Paso 1: Crear el esqueleto en `src/main`

Crea el archivo `MotorAhorcado.kt` en la siguiente ruta exacta:  
📁 `src/main/kotlin/b02_funciones_lambdas/tdd/MotorAhorcado.kt`

Pega el siguiente esqueleto con las firmas de función vacías que lanzan `TODO()`:

```kotlin
package b02_funciones_lambdas.tdd

// ============================================================================
// CONTRATO DEL MOTOR DE AHORCADO (TDD)
// Tu objetivo es sustituir cada TODO() por la lógica que haga pasar los tests.
// ============================================================================

/**
 * Devuelve la palabra con las letras acertadas visibles y las no probadas sustituidas
 * por guiones bajos '_', separadas entre sí por un espacio en blanco.
 * Ejemplo: "KOTLIN" con probadas "OI" -> "_ O _ _ I _"
 */
fun String.enmascarar(probadas: String): String {
    TODO("Misión 1: Implementar función de extensión enmascarar")
}

/**
 * Determina si la totalidad de los caracteres de la palabra secreta están presentes
 * dentro de la cadena acumulada de letras probadas.
 */
fun String.estaAdivinada(probadas: String): Boolean {
    TODO("Misión 2: Implementar función de extensión estaAdivinada")
}

/**
 * Analiza el intento del jugador gestionando Null Safety y disparando el callback adecuado:
 * - alErrorInput: si letraInput es null (no altera vidas ni probadas).
 * - alRepetir: si la letra ya estaba en letrasProbadas (no altera vidas).
 * - alAcertar: si la letra es nueva y pertenece a la palabra secreta (no altera vidas).
 * - alFallar: si la letra es nueva y NO pertenece a la palabra (decrementa vidas en 1).
 */
fun procesarIntento(
    letraInput: Char?,
    palabraSecreta: String,
    letrasProbadas: String,
    vidasActuales: Int,
    alAcertar: (letra: Char, nuevasProbadas: String) -> Unit,
    alFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit,
    alRepetir: (letra: Char) -> Unit,
    alErrorInput: () -> Unit
) {
    TODO("Misión 3: Implementar lógica de orden superior con callbacks y Null Safety")
}
```

---

### Paso 2: Crear la Suite de Pruebas en `src/test`

Crea el archivo `MotorAhorcadoTest.kt` en la siguiente ruta paralela de pruebas:  
📁 `src/test/kotlin/b02_funciones_lambdas/tdd/MotorAhorcadoTest.kt`

Copia la suite completa de pruebas:

```kotlin
package b02_funciones_lambdas.tdd

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlin.test.fail

class MotorAhorcadoTest {

    // ========================================================================
    // 🎭 MISIÓN 1: PRUEBAS DE LA MÁSCARA VISUAL (enmascarar)
    // ========================================================================

    @Test
    fun `enmascarar palabra sin letras probadas solo muestra guiones bajos`() {
        val palabra = "KOTLIN"
        val probadas = ""

        val resultado = palabra.enmascarar(probadas)

        assertEquals("_ _ _ _ _ _", resultado)
    }

    @Test
    fun `enmascarar palabra con aciertos parciales descubre solo las letras acertadas`() {
        val palabra = "KOTLIN"
        val probadas = "OI"

        val resultado = palabra.enmascarar(probadas)

        assertEquals("_ O _ _ I _", resultado)
    }

    @Test
    fun `enmascarar palabra con todas las letras probadas la muestra totalmente visible`() {
        val palabra = "JAVA"
        val probadas = "AJV"

        val resultado = palabra.enmascarar(probadas)

        assertEquals("J A V A", resultado)
    }

    // ========================================================================
    // 🏆 MISIÓN 2: PRUEBAS DE CONDICIÓN DE VICTORIA (estaAdivinada)
    // ========================================================================

    @Test
    fun `palabra no esta adivinada si faltan letras por descubrir`() {
        val palabra = "KOTLIN"
        val probadas = "KTLN" // Falta la 'O' y la 'I'

        assertFalse(palabra.estaAdivinada(probadas))
    }

    @Test
    fun `palabra esta adivinada cuando todas sus letras estan en probadas`() {
        val palabra = "KOTLIN"
        val probadas = "KOTLINXYZ"

        assertTrue(palabra.estaAdivinada(probadas))
    }

    // ========================================================================
    // ⚡ MISIÓN 3: PRUEBAS DE EVENTOS CON CALLBACKS Y NULL SAFETY
    // ========================================================================

    @Test
    fun `entrada nula invoca unicamente alErrorInput sin penalizar vidas ni letras`() {
        var errorInvocado = false

        procesarIntento(
            letraInput = null,
            palabraSecreta = "KOTLIN",
            letrasProbadas = "A",
            vidasActuales = 6,
            alAcertar = { _, _ -> fail("No debía invocarse alAcertar con input null") },
            alFallar = { _, _, _ -> fail("No debía invocarse alFallar con input null") },
            alRepetir = { fail("No debía invocarse alRepetir con input null") },
            alErrorInput = { errorInvocado = true }
        )

        assertTrue(errorInvocado, "Debió ejecutarse el callback alErrorInput")
    }

    @Test
    fun `proponer letra repetida invoca unicamente alRepetir con la letra normalizada`() {
        var letraRepetida: Char? = null

        procesarIntento(
            letraInput = 'o', // En minúscula para probar normalización
            palabraSecreta = "KOTLIN",
            letrasProbadas = "AO",
            vidasActuales = 6,
            alAcertar = { _, _ -> fail("No debía invocarse alAcertar con letra repetida") },
            alFallar = { _, _, _ -> fail("No debía invocarse alFallar con letra repetida") },
            alRepetir = { letra -> letraRepetida = letra },
            alErrorInput = { fail("No debía invocarse alErrorInput con letra válida") }
        )

        assertEquals('O', letraRepetida, "Debió avisar de la repetición con la letra en mayúsculas")
    }

    @Test
    fun `acertar letra nueva invoca alAcertar con nuevas probadas y vidas intactas`() {
        var letraAcertada: Char? = null
        var probadasActualizadas = ""

        procesarIntento(
            letraInput = 'k',
            palabraSecreta = "KOTLIN",
            letrasProbadas = "A",
            vidasActuales = 5,
            alAcertar = { letra, nuevasProbadas ->
                letraAcertada = letra
                probadasActualizadas = nuevasProbadas
            },
            alFallar = { _, _, _ -> fail("No debía fallar con una letra correcta") },
            alRepetir = { fail("No debía repetir una letra nueva") },
            alErrorInput = { fail("No debía dar error de input") }
        )

        assertEquals('K', letraAcertada)
        assertEquals("AK", probadasActualizadas)
    }

    @Test
    fun `fallar letra nueva invoca alFallar restando exactamente una vida`() {
        var letraFallada: Char? = null
        var probadasActualizadas = ""
        var vidasRestantes = -1

        procesarIntento(
            letraInput = 'Z',
            palabraSecreta = "KOTLIN",
            letrasProbadas = "A",
            vidasActuales = 6,
            alAcertar = { _, _ -> fail("No debía acertar con letra inexistente") },
            alFallar = { letra, nuevasProbadas, vidas ->
                letraFallada = letra
                probadasActualizadas = nuevasProbadas
                vidasRestantes = vidas
            },
            alRepetir = { fail("No debía repetir una letra nueva") },
            alErrorInput = { fail("No debía dar error de input") }
        )

        assertEquals('Z', letraFallada)
        assertEquals("AZ", probadasActualizadas)
        assertEquals(5, vidasRestantes, "Un fallo debe reducir las vidas de 6 a 5")
    }
}
```

---

### Paso 3: Experimentar el Semáforo en Rojo

Abre la terminal y ejecuta la suite del subpaquete:

```bash
./gradlew test --tests "b02_funciones_lambdas.tdd.MotorAhorcadoTest"
```

El resultado debe ser un **fallo rotundo con `BUILD FAILED`**:
```text
MotorAhorcadoTest > enmascarar palabra sin letras probadas solo muestra guiones bajos() FAILED
    kotlin.NotImplementedError: An operation is not implemented: Misión 1: Implementar función de extensión enmascarar
```

¡Excelente! La fase roja está lista. Tienes un contrato cerrado y un marco de pruebas que te guiará hacia la solución correcta.

---

## 3. Fase 2: Misión Verde (Implementación Guiada Paso a Paso)

Ahora avanzaremos implementando una a una las funciones en `MotorAhorcado.kt` hasta conseguir que todos los tests pasen a verde.

---

### Misión 1: Implementar `String.enmascarar`

Abre `src/main/kotlin/b02_funciones_lambdas/tdd/MotorAhorcado.kt`.

Para enmascarar la cadena, necesitamos recorrer cada carácter de `this`: si el carácter ya existe en `probadas`, lo dejamos visible; si no, ponemos `'_'`. Finalmente, unimos los caracteres con espacios usando `.joinToString(" ")`:

```kotlin
fun String.enmascarar(probadas: String): String {
    return this.map { c ->
        if (c in probadas) c else '_'
    }.joinToString(" ")
}
```

Vuelve a lanzar las pruebas de enmascarar:
```bash
./gradlew test --tests "*enmascarar*"
```

**Resultado:** ¡Los 3 primeros tests ya están en **VERDE**!

---

### Misión 2: Implementar `String.estaAdivinada`

Una palabra está adivinada si **todos (`all`)** sus caracteres están presentes dentro de la cadena `probadas`:

```kotlin
fun String.estaAdivinada(probadas: String): Boolean {
    return this.all { c -> c in probadas }
}
```

Lanza las pruebas de victoria:
```bash
./gradlew test --tests "*adivinada*"
```

**Resultado:** ¡Los tests de condición de victoria pasan a **VERDE**!

---

### Misión 3: Implementar `procesarIntento` (Callbacks y Null Safety)

Este es el núcleo reactivo del juego. Observa cómo aplicamos los operadores aprendidos en el Bloque 2:

1. **Llamada segura y Elvis como cláusula de guarda:** `letraInput?.uppercaseChar() ?: run { alErrorInput(); return }`. Si la entrada es `null`, dispara el callback de error y sale de inmediato sin tocar nada más.
2. **Comprobación de repetición:** Si `letra in letrasProbadas`, invocamos `alRepetir(letra)` y salimos con `return`.
3. **Acierto vs Fallo:** Si no estaba repetida, calculamos `val nuevasProbadas = letrasProbadas + letra`:
    - Si `letra in palabraSecreta` → invocamos `alAcertar(letra, nuevasProbadas)`.
    - Si no → invocamos `alFallar(letra, nuevasProbadas, vidasActuales - 1)`.

```kotlin
fun procesarIntento(
    letraInput: Char?,
    palabraSecreta: String,
    letrasProbadas: String,
    vidasActuales: Int,
    alAcertar: (letra: Char, nuevasProbadas: String) -> Unit,
    alFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit,
    alRepetir: (letra: Char) -> Unit,
    alErrorInput: () -> Unit
) {
    // 1. Cláusula de guarda ante nulos
    val letra = letraInput?.uppercaseChar() ?: run {
        alErrorInput()
        return
    }

    // 2. Comprobación de repetición
    if (letra in letrasProbadas) {
        alRepetir(letra)
        return
    }

    // 3. Letra nueva: evaluar acierto o fallo
    val nuevasProbadas = letrasProbadas + letra

    if (letra in palabraSecreta) {
        alAcertar(letra, nuevasProbadas)
    } else {
        val nuevasVidas = vidasActuales - 1
        alFallar(letra, nuevasProbadas, nuevasVidas)
    }
}
```

---

## 4. Fase 3: Verificación Completa y Semáforo 100% Verde

Lanza ahora toda la suite de pruebas del subpaquete TDD:

```bash
./gradlew test --tests "b02_funciones_lambdas.tdd.MotorAhorcadoTest"
```

### Salida en consola:

```text
> Task :compileKotlin UP-TO-DATE
> Task :compileTestKotlin UP-TO-DATE
> Task :testClasses UP-TO-DATE
> Task :test

BUILD SUCCESSFUL in 350ms
3 actionable tasks: 1 executed, 2 up-to-date
```

Abre el informe HTML en tu navegador:  
📁 `pmdm-kotlin-lab/build/reports/tests/test/index.html`

Verás la suite `b02_funciones_lambdas.tdd.MotorAhorcadoTest` con sus **9 pruebas en verde**. Has completado con éxito el ciclo TDD.

---

## 5. El Ensamblado Final: Jugar desde `main()` con un Motor Blindado

Ahora que tienes la certeza matemática de que tu motor de juego está libre de fallos, montar un bucle interactivo de consola para jugar se convierte en una tarea trivial.

Al final de `MotorAhorcado.kt`, añade la función de ejecución:

```kotlin
fun main() {
    val palabraSecreta = "KOTLIN"
    var letrasProbadas = ""
    var vidasRestantes = 6

    println("=== EL AHORCADO (MOTOR VERIFICADO CON TDD) ===")
    println("Palabra: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes\n")

    val turnosSimulados = listOf('O', 'Z', null, 'K', 'T', 'L', 'I', 'N')

    for (intento in turnosSimulados) {
        println("-> Jugador propone: '$intento'")

        procesarIntento(
            letraInput = intento,
            palabraSecreta = palabraSecreta,
            letrasProbadas = letrasProbadas,
            vidasActuales = vidasRestantes,
            alAcertar = { letra, nuevasProbadas ->
                letrasProbadas = nuevasProbadas
                println("¡Acierto! La letra '$letra' está en la palabra.")
            },
            alFallar = { letra, nuevasProbadas, vidas ->
                letrasProbadas = nuevasProbadas
                vidasRestantes = vidas
                println("¡Fallo! La letra '$letra' no está. Vidas restantes: $vidas")
            },
            alRepetir = { letra ->
                println("La letra '$letra' ya había sido probada.")
            },
            alErrorInput = {
                println("[ALERTA]: Entrada no válida (null). Turno no penalizado.")
            }
        )

        println("Estado: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes\n")

        if (palabraSecreta.estaAdivinada(letrasProbadas)) {
            println("🏆 ¡VICTORIA HEROICA! Has descubierto la palabra secreta: $palabraSecreta")
            return
        }

        if (vidasRestantes <= 0) {
            println("💀 ¡HAS SIDO AHORCADO! La palabra era: $palabraSecreta")
            return
        }
    }
}
```

Pulsa el icono verde ▶ junto a `fun main()` y disfruta de tu juego respaldado al 100% por pruebas unitarias automatizadas.
