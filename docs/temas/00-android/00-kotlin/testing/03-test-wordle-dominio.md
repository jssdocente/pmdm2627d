# Taller de Testing 3: Wordle Engine con TDD (Dominio, Data Classes y Excepciones)

En el [Reto 3.19 de POO y Tipos Sellados](../ejercicios/03-poo-sealed-types.md#reto-319-el-motor-de-wordle-en-consola-poo-data-classes-y-dominio) modelaste el núcleo de validación para el juego de palabras **Wordle**, apoyándote en `enum class`, `data class` y el patrón de estado inmutable `PartidaWordle`.

En este tercer taller continuaremos aplicando la metodología **TDD (*Test-Driven Development*)** para abordar tres competencias fundamentales del testing profesional en Kotlin y Android:

1. **Testing de Excepciones y Precondiciones:** Cómo verificar con **`assertFailsWith<T>`** que el sistema rechaza entradas inválidas y lanza excepciones controladas ante incumplimiento de contratos (`require`).
2. **Igualdad Estructural en Data Classes:** Cómo `assertEquals` aprovecha el método `equals()` generado automáticamente por Kotlin para comparar estructuras complejas celda a celda sin escribir comparadores manuales.
3. **Testing de Modelos de Estado (`UiState`):** Cómo comprobar que la evolución de un estado inmutable mediante **`.copy()`** actualiza de forma matemáticamente exacta las propiedades calculadas (`intentosRestantes`, `esVictoria`, `esFinDePartida`).

---

## 1. El Entorno de Trabajo Aislado

Para garantizar que tu código original de consola en `b03_poo_sealed/Reto03_WordleEngine.kt` continúe intacto y sin colisiones de nombres, este taller se desarrollará en el subpaquete dedicado:

📁 **Paquete de trabajo:** `package b03_poo_sealed.tdd`

```text
pmdm-kotlin-lab/
└── src/
    ├── main/kotlin/b03_poo_sealed/tdd/
    │   └── MotorWordle.kt         <-- Entidades y lógica a implementar guiado por tests
    │
    └── test/kotlin/b03_poo_sealed/tdd/
        └── MotorWordleTest.kt     <-- Suite de pruebas que define los requisitos oficiales
```

---

## 2. Fase 1: El Contrato y el Esqueleto Inicial en Rojo

---

### Paso 1: Crear el esqueleto en `src/main`

Crea el archivo `MotorWordle.kt` en la ruta:  
📁 `src/main/kotlin/b03_poo_sealed/tdd/MotorWordle.kt`

Copia el contrato con las firmas y tipos preparados, dejando los cuerpos con `TODO()`:

```kotlin
package b03_poo_sealed.tdd

// ============================================================================
// CONTRATO DEL MOTOR DE WORDLE (TDD)
// Tu objetivo es implementar la lógica hasta que todos los tests pasen a verde.
// ============================================================================

enum class EstadoLetra(val icono: String) {
    VERDE("🟩"),
    AMARILLO("🟨"),
    GRIS("⬛")
}

data class EvaluacionLetra(
    val caracter: Char,
    val estado: EstadoLetra
)

data class PartidaWordle(
    val palabraSecreta: String,
    val intentosMaximos: Int = 6,
    val intentosRealizados: List<List<EvaluacionLetra>> = emptyList()
) {
    val intentosRestantes: Int
        get() = TODO("Misión 3: Calcular intentos restantes")

    val esVictoria: Boolean
        get() = TODO("Misión 3: Calcular si la última fila está 100% verde")

    val esFinDePartida: Boolean
        get() = TODO("Misión 3: Calcular si ha ganado o se han agotado los intentos")
}

fun evaluarIntento(palabraSecreta: String, intentoRaw: String): List<EvaluacionLetra> {
    TODO("Misión 1 y 2: Validar longitud con require y mapear a List<EvaluacionLetra>")
}
```

---

### Paso 2: Crear la Suite de Pruebas en `src/test`

Crea el archivo `MotorWordleTest.kt` en la ruta paralela:  
📁 `src/test/kotlin/b03_poo_sealed/tdd/MotorWordleTest.kt`

Pega la suite completa de pruebas de contrato:

```kotlin
package b03_poo_sealed.tdd

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class MotorWordleTest {

    // ========================================================================
    // 💥 BLOQUE 1: PRUEBAS DE PRECONDICIONES Y EXCEPCIONES (require)
    // ========================================================================

    @Test
    fun `un intento con longitud diferente a la palabra secreta lanza IllegalArgumentException`() {
        val secreta = "COMPOSE" // 7 letras
        val intentoCorto = "HOLA" // 4 letras

        // assertFailsWith verifica que el bloque arroje exactamente la excepción esperada
        assertFailsWith<IllegalArgumentException> {
            evaluarIntento(secreta, intentoCorto)
        }
    }

    @Test
    fun `un intento con longitud excesiva tambien lanza IllegalArgumentException`() {
        val secreta = "KOTLIN" // 6 letras
        val intentoLargo = "KOTLINAZO" // 9 letras

        assertFailsWith<IllegalArgumentException> {
            evaluarIntento(secreta, intentoLargo)
        }
    }

    // ========================================================================
    // 🎯 BLOQUE 2: PRUEBAS DEL ALGORITMO DE COINCIDENCIA POSICIONAL
    // ========================================================================

    @Test
    fun `intento identico califica todas las letras con EstadoLetra VERDE`() {
        val secreta = "KOTLIN"
        val intento = "KOTLIN"

        val evaluacion = evaluarIntento(secreta, intento)

        // Verificamos que todas las celdas sean verdes
        assertTrue(evaluacion.all { it.estado == EstadoLetra.VERDE })
        assertEquals(6, evaluacion.size)
    }

    @Test
    fun `letras ausentes se califican con EstadoLetra GRIS`() {
        val secreta = "CASA"
        val intento = "ZZZZ"

        val evaluacion = evaluarIntento(secreta, intento)

        assertTrue(evaluacion.all { it.estado == EstadoLetra.GRIS })
    }

    @Test
    fun `intento con letras presentes en posicion distinta califica con AMARILLO`() {
        // En "ROMA" y "AMOR": todas las letras existen pero ninguna en la misma posición
        val secreta = "ROMA"
        val intento = "AMOR"

        val evaluacion = evaluarIntento(secreta, intento)

        // Todas deben ser amarillas
        assertTrue(evaluacion.all { it.estado == EstadoLetra.AMARILLO })
    }

    @Test
    fun `evaluacion combinada reconoce simultaneamente verdes, amarillos y grises`() {
        // Secreta: C O M P O S E
        // Intento: C O M P A S S
        // C: Verde (pos 0)
        // O: Verde (pos 1)
        // M: Verde (pos 2)
        // P: Verde (pos 3)
        // A: Gris (no existe en COMPOSE)
        // S: Amarillo (existe en posición 5)
        // S: Amarillo (existe en posición 5)
        val secreta = "COMPOSE"
        val intento = "COMPASS"

        val evaluacion = evaluarIntento(secreta, intento)

        val estadosEsperados = listOf(
            EstadoLetra.VERDE,
            EstadoLetra.VERDE,
            EstadoLetra.VERDE,
            EstadoLetra.VERDE,
            EstadoLetra.GRIS,
            EstadoLetra.AMARILLO,
            EstadoLetra.AMARILLO
        )

        val estadosObtenidos = evaluacion.map { it.estado }
        assertEquals(estadosEsperados, estadosObtenidos)
    }

    @Test
    fun `la evaluacion normaliza minusculas a mayusculas de forma transparente`() {
        val secreta = "kotlin"
        val intento = "KOTLIN"

        val evaluacion = evaluarIntento(secreta, intento)

        assertTrue(evaluacion.all { it.estado == EstadoLetra.VERDE })
        assertEquals('K', evaluacion.first().caracter)
    }

    // ========================================================================
    // 📦 BLOQUE 3: PRUEBAS DEL MODELO DE ESTADO INMUTABLE (PartidaWordle)
    // ========================================================================

    @Test
    fun `partida nueva inicia con 6 intentos restantes y sin estado de fin`() {
        val partida = PartidaWordle(palabraSecreta = "COMPOSE")

        assertEquals(6, partida.intentosRestantes)
        assertFalse(partida.esVictoria)
        assertFalse(partida.esFinDePartida)
    }

    @Test
    fun `anexar un intento con copy reduce los intentos restantes`() {
        val partidaInicial = PartidaWordle(palabraSecreta = "COMPOSE")
        val intentoFicticio = listOf(
            EvaluacionLetra('K', EstadoLetra.GRIS),
            EvaluacionLetra('O', EstadoLetra.VERDE)
        )

        // Mutación inmutable con copy
        val partidaSiguiente = partidaInicial.copy(
            intentosRealizados = partidaInicial.intentosRealizados + intentoFicticio
        )

        assertEquals(5, partidaSiguiente.intentosRestantes)
        assertEquals(1, partidaSiguiente.intentosRealizados.size)
        assertFalse(partidaSiguiente.esVictoria)
    }

    @Test
    fun `partida detecta victoria cuando la ultima fila es 100 por ciento verde`() {
        val partida = PartidaWordle(
            palabraSecreta = "JAVA",
            intentosRealizados = listOf(
                listOf(
                    EvaluacionLetra('J', EstadoLetra.VERDE),
                    EvaluacionLetra('A', EstadoLetra.VERDE),
                    EvaluacionLetra('V', EstadoLetra.VERDE),
                    EvaluacionLetra('A', EstadoLetra.VERDE)
                )
            )
        )

        assertTrue(partida.esVictoria)
        assertTrue(partida.esFinDePartida)
        assertEquals(5, partida.intentosRestantes)
    }

    @Test
    fun `partida detecta fin de juego por derrota al consumir los 6 intentos sin victoria`() {
        val filaGris = listOf(
            EvaluacionLetra('Z', EstadoLetra.GRIS),
            EvaluacionLetra('Z', EstadoLetra.GRIS)
        )

        val partidaAgotada = PartidaWordle(
            palabraSecreta = "OK",
            intentosMaximos = 6,
            intentosRealizados = List(6) { filaGris } // 6 intentos fallidos
        )

        assertEquals(0, partidaAgotada.intentosRestantes)
        assertFalse(partidaAgotada.esVictoria)
        assertTrue(partidaAgotada.esFinDePartida)
    }
}
```

---

### Paso 3: Arrancar en Rojo

Abre tu terminal y ejecuta la suite de pruebas del subpaquete:

```bash
./gradlew test --tests "b03_poo_sealed.tdd.MotorWordleTest"
```

Comprobarás que el proyecto compila limpiamente, pero la ejecución se detiene con un **fallo controlado en ROJO**:

```text
MotorWordleTest > un intento con longitud diferente a la palabra secreta lanza IllegalArgumentException() FAILED
    kotlin.NotImplementedError: An operation is not implemented: Misión 1 y 2
```

---

## 3. Fase 2: Misión Verde Paso a Paso

---

### Misión 1: Precondiciones y Excepciones con `require`

Abre `src/main/kotlin/b03_poo_sealed/tdd/MotorWordle.kt` y añade la normalización a mayúsculas y la cláusula `require` al inicio de `evaluarIntento`:

```kotlin
fun evaluarIntento(palabraSecreta: String, intentoRaw: String): List<EvaluacionLetra> {
    val secreta = palabraSecreta.uppercase()
    val intento = intentoRaw.uppercase()

    require(secreta.length == intento.length) {
        "La longitud del intento (${intento.length}) debe coincidir con la palabra secreta (${secreta.length})."
    }

    TODO("Misión 2: Mapear letras a List<EvaluacionLetra>")
}
```

Ejecuta los tests del Bloque 1 en la terminal:

```bash
./gradlew test --tests "*IllegalArgumentException*"
```

**Resultado:** ¡Los 2 tests de excepciones pasan a **VERDE**! `assertFailsWith` captura la excepción lanzada por `require` y comprueba que coincide con el tipo esperado.

---

### Misión 2: Algoritmo de Coincidencias con `mapIndexed` y `when`

Completa la función `evaluarIntento` recorriendo el intento posicionalmente y asignando el `EstadoLetra` adecuado:

```kotlin
fun evaluarIntento(palabraSecreta: String, intentoRaw: String): List<EvaluacionLetra> {
    val secreta = palabraSecreta.uppercase()
    val intento = intentoRaw.uppercase()

    require(secreta.length == intento.length) {
        "La longitud del intento (${intento.length}) debe coincidir con la palabra secreta (${secreta.length})."
    }

    return intento.mapIndexed { i, c ->
        val estado = when {
            c == secreta[i] -> EstadoLetra.VERDE
            c in secreta -> EstadoLetra.AMARILLO
            else -> EstadoLetra.GRIS
        }
        EvaluacionLetra(c, estado)
    }
}
```

Lanza los tests de evaluación:

```bash
./gradlew test --tests "*evaluacion*"
```

**Resultado:** ¡Todos los tests de clasificación posicional del Bloque 2 pasan a **VERDE**!

---

### Misión 3: Propiedades Calculadas de `PartidaWordle`

Ahora implementamos las propiedades calculadas dentro del cuerpo de la `data class PartidaWordle`:

```kotlin
data class PartidaWordle(
    val palabraSecreta: String,
    val intentosMaximos: Int = 6,
    val intentosRealizados: List<List<EvaluacionLetra>> = emptyList()
) {
    val intentosRestantes: Int
        get() = intentosMaximos - intentosRealizados.size

    val esVictoria: Boolean
        get() = intentosRealizados.lastOrNull()?.all { it.estado == EstadoLetra.VERDE } ?: false

    val esFinDePartida: Boolean
        get() = esVictoria || intentosRestantes <= 0
}
```

---

## 4. Fase 3: Verificación 100% Verde en Gradle

Lanza toda la suite de pruebas completa:

```bash
./gradlew test --tests "b03_poo_sealed.tdd.MotorWordleTest"
```

### Salida esperada en consola:

```text
> Task :compileKotlin UP-TO-DATE
> Task :compileTestKotlin UP-TO-DATE
> Task :testClasses UP-TO-DATE
> Task :test

BUILD SUCCESSFUL in 390ms
3 actionable tasks: 1 executed, 2 up-to-date
```

Abre el informe visual HTML en tu navegador web:  
📁 `pmdm-kotlin-lab/build/reports/tests/test/index.html`

Comprobarás que los **10 tests de la suite están en verde (100% de éxito)**. El motor de dominio y las entidades de datos están matemáticamente blindados.

---

## 5. Fase 4: Ensamblado del Juego en `main()`

Ahora que las entidades y el motor han demostrado su solidez ante cualquier caso límite, montar el juego en consola es seguro y directo. Añade al final de `MotorWordle.kt`:

```kotlin
fun main() {
    var partida = PartidaWordle(palabraSecreta = "COMPOSE")
    println("=== WORDLE CLI (TDD VERIFICADO) ===")
    println("Palabra secreta fijada: ${partida.palabraSecreta} (${partida.palabraSecreta.length} letras)\n")

    val intentosSimulados = listOf("KOTLINS", "COMPASS", "COMPOSE")

    for (palabra in intentosSimulados) {
        if (partida.esFinDePartida) break

        val evaluacion = evaluarIntento(partida.palabraSecreta, palabra)

        // Mutación inmutable con copy() delegando la fila directamente:
        partida = partida.copy(
            intentosRealizados = partida.intentosRealizados + evaluacion
        )

        val turnoActual = partida.intentosRealizados.size
        println("Intento $turnoActual: ${palabra.map { "$it" }.joinToString(" ")}")
        println(evaluacion.joinToString(" ") { it.estado.icono })
        println("Intentos restantes: ${partida.intentosRestantes}\n")

        if (partida.esVictoria) {
            println("🏆 ¡ENHORABUENA! Has resuelto el Wordle en $turnoActual intentos.")
            return
        }
    }

    if (!partida.esVictoria) {
        println("💀 Has agotado tus intentos. La palabra era: ${partida.palabraSecreta}")
    }
}
```

Ejecuta `fun main()` y observa cómo el juego fluye con total elegancia respaldado por una suite de pruebas unitarias profesional.
