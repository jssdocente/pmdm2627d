# Taller de Testing 3: Wordle Engine con TDD (Arquitectura de Estado, Tipos Sellados y Companion Object)

En el [Reto 3.19 de POO y Tipos Sellados](../ejercicios/03-poo-sealed-types.md#reto-319-el-motor-de-wordle-con-arquitectura-de-estado-state-companion-object-sealed-types) modelaste el motor desacoplado de validación y gestión de estado para el juego de palabras **Wordle**, apoyándote en `enum class`, `sealed interface`, `companion object` y el patrón de estado inmutable `EstadoWordle` (*UiState*).

En este tercer taller continuaremos aplicando la metodología **TDD (*Test-Driven Development*)** para abordar cuatro competencias fundamentales del desarrollo y testing profesional en Kotlin y Android:

1. **Testing de la Factoría Semántica (`companion object`):** Cómo verificar que el método factoría inicializa estados limpios tanto con palabras personalizadas como con el diccionario aleatorio por defecto.
2. **Igualdad Estructural en Data Classes y Enums:** Cómo `assertEquals` y `assertTrue` comprueban la clasificación posicional de letras (`VERDE`, `AMARILLO`, `GRIS`) celda a celda sin comparadores manuales.
3. **Manejo Robusto de Entradas con `sealed interface`:** Cómo verificar que las palabras de longitud inválida no crashean la aplicación, sino que emiten de forma reactiva el evento `EventoWordle.LongitudInvalida` conservando intacto el estado de la partida.
4. **Testing de Transiciones de Estado Inmutables (`procesarIntento`):** Cómo comprobar que la evolución de `EstadoWordle` mediante `.copy()` actualiza de forma matemáticamente exacta los turnos restantes, la lista de intentos y la fase del juego (`EstadoPartida.VICTORIA` o `DERROTA`).

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

enum class EstadoPartida {
    JUGANDO,
    VICTORIA,
    DERROTA
}

sealed interface EventoWordle {
    data class IntentoRegistrado(val turnoActual: Int, val intentosRestantes: Int) : EventoWordle
    data class LongitudInvalida(val longitudRecibida: Int, val longitudEsperada: Int) : EventoWordle
    data class Victoria(val intentosUsados: Int) : EventoWordle
    data class Derrota(val palabraCorrecta: String) : EventoWordle
}

data class EvaluacionLetra(
    val caracter: Char,
    val estado: EstadoLetra
)

data class EstadoWordle(
    val palabraSecreta: String,
    val intentosMaximos: Int = INTENTOS_POR_DEFECTO,
    val intentos: List<List<EvaluacionLetra>> = emptyList(),
    val estado: EstadoPartida = EstadoPartida.JUGANDO
) {
    val turnosRestantes: Int
        get() = TODO("Misión 3: Calcular intentos restantes: intentosMaximos - intentos.size")

    companion object {
        const val INTENTOS_POR_DEFECTO = 6
        const val LONGITUD_PALABRA = 7

        val DICCIONARIO = listOf("COMPOSE", "ANDROID", "KOTLINS", "MODULES", "ROOMBDD")

        fun iniciarPartida(palabra: String? = null): EstadoWordle {
            TODO("Misión 1: Factoría semántica con palabra normalizada o aleatoria de DICCIONARIO")
        }
    }
}

fun evaluarLetras(palabraSecreta: String, intento: String): List<EvaluacionLetra> {
    TODO("Misión 2: Clasificar posicionalmente cada letra con mapIndexed a EstadoLetra")
}

fun EstadoWordle.procesarIntento(
    intentoRaw: String,
    onEvento: (EventoWordle) -> Unit = {}
): EstadoWordle {
    TODO("Misión 4: Validar longitud con evento, evaluar letras, emitir evento y evolucionar estado con .copy()")
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
import kotlin.test.assertFalse
import kotlin.test.assertIs
import kotlin.test.assertTrue

class MotorWordleTest {

    // ========================================================================
    // 🏭 BLOQUE 1: PRUEBAS DEL COMPANION OBJECT Y FACTORÍA
    // ========================================================================

    @Test
    fun `iniciarPartida con palabra explicita normaliza a mayusculas e inicializa estado JUGANDO`() {
        val partida = EstadoWordle.iniciarPartida("compose")

        assertEquals("COMPOSE", partida.palabraSecreta)
        assertEquals(EstadoPartida.JUGANDO, partida.estado)
        assertEquals(6, partida.turnosRestantes)
        assertTrue(partida.intentos.isEmpty())
    }

    @Test
    fun `iniciarPartida sin argumento selecciona una palabra valida del diccionario`() {
        val partida = EstadoWordle.iniciarPartida()

        assertTrue(partida.palabraSecreta in EstadoWordle.DICCIONARIO)
        assertEquals(EstadoWordle.LONGITUD_PALABRA, partida.palabraSecreta.length)
    }

    // ========================================================================
    // 🎯 BLOQUE 2: PRUEBAS DEL ALGORITMO PURO DE EVALUACIÓN POSICIONAL
    // ========================================================================

    @Test
    fun `intento identico califica todas las letras con EstadoLetra VERDE`() {
        val secreta = "KOTLIN"
        val intento = "KOTLIN"

        val evaluacion = evaluarLetras(secreta, intento)

        assertTrue(evaluacion.all { it.estado == EstadoLetra.VERDE })
        assertEquals(6, evaluacion.size)
    }

    @Test
    fun `letras ausentes se califican con EstadoLetra GRIS`() {
        val secreta = "CASA"
        val intento = "ZZZZ"

        val evaluacion = evaluarLetras(secreta, intento)

        assertTrue(evaluacion.all { it.estado == EstadoLetra.GRIS })
    }

    @Test
    fun `letras presentes en distinta posicion se califican con EstadoLetra AMARILLO`() {
        val secreta = "ROMA"
        val intento = "AMOR"

        val evaluacion = evaluarLetras(secreta, intento)

        assertTrue(evaluacion.all { it.estado == EstadoLetra.AMARILLO })
    }

    @Test
    fun `evaluacion combinada reconoce simultaneamente verdes, amarillos y grises`() {
        // Secreta: C O M P O S E
        // Intento: C O M P A S S
        val secreta = "COMPOSE"
        val intento = "COMPASS"

        val evaluacion = evaluarLetras(secreta, intento)

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

    // ========================================================================
    // 🛡️ BLOQUE 3: MANEJO SEGURO DE EVENTOS SELLADOS (SEALED INTERFACE)
    // ========================================================================

    @Test
    fun `un intento con longitud erronea emite LongitudInvalida y no consume turnos`() {
        val partidaInicial = EstadoWordle.iniciarPartida("COMPOSE")
        var eventoCapturado: EventoWordle? = null

        val partidaNueva = partidaInicial.procesarIntento("HOLA") { evento ->
            eventoCapturado = evento
        }

        // 1. Verificamos que el evento emitido sea de tipo LongitudInvalida con payload correcto
        assertIs<EventoWordle.LongitudInvalida>(eventoCapturado)
        val error = eventoCapturado as EventoWordle.LongitudInvalida
        assertEquals(4, error.longitudRecibida)
        assertEquals(7, error.longitudEsperada)

        // 2. Verificamos que el estado permanece intacto
        assertEquals(partidaInicial.turnosRestantes, partidaNueva.turnosRestantes)
        assertTrue(partidaNueva.intentos.isEmpty())
    }

    // ========================================================================
    // 📦 BLOQUE 4: PRUEBAS DE TRANSICIÓN DE ESTADO (procesarIntento)
    // ========================================================================

    @Test
    fun `intento ordinario reduce turnos y emite IntentoRegistrado`() {
        val partidaInicial = EstadoWordle.iniciarPartida("COMPOSE")
        var eventoCapturado: EventoWordle? = null

        val partidaNueva = partidaInicial.procesarIntento("KOTLINS") { evento ->
            eventoCapturado = evento
        }

        assertIs<EventoWordle.IntentoRegistrado>(eventoCapturado)
        val info = eventoCapturado as EventoWordle.IntentoRegistrado
        assertEquals(1, info.turnoActual)
        assertEquals(5, info.intentosRestantes)

        assertEquals(5, partidaNueva.turnosRestantes)
        assertEquals(1, partidaNueva.intentos.size)
        assertEquals(EstadoPartida.JUGANDO, partidaNueva.estado)
    }

    @Test
    fun `adivinar la palabra secreta transiciona a VICTORIA y emite evento Victoria`() {
        val partidaInicial = EstadoWordle.iniciarPartida("COMPOSE")
        var eventoCapturado: EventoWordle? = null

        val partidaGanada = partidaInicial.procesarIntento("COMPOSE") { evento ->
            eventoCapturado = evento
        }

        assertIs<EventoWordle.Victoria>(eventoCapturado)
        assertEquals(1, (eventoCapturado as EventoWordle.Victoria).intentosUsados)
        assertEquals(EstadoPartida.VICTORIA, partidaGanada.estado)
    }

    @Test
    fun `agotar los 6 intentos sin adivinar transiciona a DERROTA y emite evento Derrota`() {
        var partida = EstadoWordle(palabraSecreta = "ANDROID", intentosMaximos = 6)
        var eventoCapturado: EventoWordle? = null

        // Consumir 5 intentos fallidos
        repeat(5) {
            partida = partida.procesarIntento("ZZZZZZZ")
        }
        assertEquals(1, partida.turnosRestantes)
        assertEquals(EstadoPartida.JUGANDO, partida.estado)

        // Intento 6: provoca la derrota
        partida = partida.procesarIntento("XXXXXXX") { evento ->
            eventoCapturado = evento
        }

        assertIs<EventoWordle.Derrota>(eventoCapturado)
        assertEquals("ANDROID", (eventoCapturado as EventoWordle.Derrota).palabraCorrecta)
        assertEquals(0, partida.turnosRestantes)
        assertEquals(EstadoPartida.DERROTA, partida.estado)
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
MotorWordleTest > iniciarPartida con palabra explicita normaliza a mayusculas FAILED
    kotlin.NotImplementedError: An operation is not implemented: Misión 1
```

---

## 3. Fase 2: Misión Verde Paso a Paso

---

### Misión 1: Companion Object y Factoría `iniciarPartida`

Abre `src/main/kotlin/b03_poo_sealed/tdd/MotorWordle.kt` e implementa la factoría en el `companion object`:

```kotlin
companion object {
    const val INTENTOS_POR_DEFECTO = 6
    const val LONGITUD_PALABRA = 7

    val DICCIONARIO = listOf("COMPOSE", "ANDROID", "KOTLINS", "MODULES", "ROOMBDD")

    fun iniciarPartida(palabra: String? = null): EstadoWordle {
        val elegida = palabra?.uppercase() ?: DICCIONARIO.random()
        return EstadoWordle(palabraSecreta = elegida)
    }
}
```

---

### Misión 2: Algoritmo Puro de Coincidencias con `mapIndexed` y `when`

Implementa la función pura `evaluarLetras` para clasificar las posiciones:

```kotlin
fun evaluarLetras(palabraSecreta: String, intento: String): List<EvaluacionLetra> {
    val secreta = palabraSecreta.uppercase()
    val propuesto = intento.uppercase()

    return propuesto.mapIndexed { i, c ->
        val estado = when {
            c == secreta[i] -> EstadoLetra.VERDE
            c in secreta -> EstadoLetra.AMARILLO
            else -> EstadoLetra.GRIS
        }
        EvaluacionLetra(c, estado)
    }
}
```

---

### Misión 3: Propiedad Calculada `turnosRestantes`

Implementa la propiedad calculada dentro de `data class EstadoWordle`:

```kotlin
data class EstadoWordle(
    val palabraSecreta: String,
    val intentosMaximos: Int = INTENTOS_POR_DEFECTO,
    val intentos: List<List<EvaluacionLetra>> = emptyList(),
    val estado: EstadoPartida = EstadoPartida.JUGANDO
) {
    val turnosRestantes: Int
        get() = intentosMaximos - intentos.size
...
```

---

### Misión 4: Transición Inmutable de Estado y Notificación de Eventos

Implementa `procesarIntento` garantizando que los intentos inválidos no rompen la aplicación ni consumen turnos:

```kotlin
fun EstadoWordle.procesarIntento(
    intentoRaw: String,
    onEvento: (EventoWordle) -> Unit = {}
): EstadoWordle {
    if (this.estado != EstadoPartida.JUGANDO) return this

    val intento = intentoRaw.trim().uppercase()

    // 1. Manejo seguro de longitud con evento sellado
    if (intento.length != palabraSecreta.length) {
        onEvento(EventoWordle.LongitudInvalida(intento.length, palabraSecreta.length))
        return this
    }

    // 2. Calificación de letras
    val evaluacion = evaluarLetras(palabraSecreta, intento)
    val nuevosIntentos = this.intentos + listOf(evaluacion)
    val esAciertoPleno = evaluacion.all { it.estado == EstadoLetra.VERDE }

    // 3. Resolución de nueva fase de juego
    val nuevoEstado = when {
        esAciertoPleno -> EstadoPartida.VICTORIA
        nuevosIntentos.size >= intentosMaximos -> EstadoPartida.DERROTA
        else -> EstadoPartida.JUGANDO
    }

    // 4. Emisión de eventos tipados
    when (nuevoEstado) {
        EstadoPartida.VICTORIA -> onEvento(EventoWordle.Victoria(nuevosIntentos.size))
        EstadoPartida.DERROTA -> onEvento(EventoWordle.Derrota(palabraSecreta))
        EstadoPartida.JUGANDO -> onEvento(
            EventoWordle.IntentoRegistrado(
                turnoActual = nuevosIntentos.size,
                intentosRestantes = intentosMaximos - nuevosIntentos.size
            )
        )
    }

    // 5. Retorno inmutable con .copy()
    return this.copy(
        intentos = nuevosIntentos,
        estado = nuevoEstado
    )
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

Comprobarás que los **8 tests de la suite están en verde (100% de éxito)**. El motor de dominio, el companion object y los tipos sellados están completamente blindados.

---

## 5. Fase 4: Ensamblado del Juego en `main()`

Ahora que el motor y la máquina de estados han demostrado su solidez ante cualquier caso límite, montar el juego en consola con la `sealed interface` es seguro y directo. Añade al final de `MotorWordle.kt`:

```kotlin
fun main() {
    var partida = EstadoWordle.iniciarPartida("COMPOSE")
    println("=== WORDLE CLI (TDD & ARQUITECTURA DE ESTADO) ===")
    println("Palabra secreta fijada: ${partida.palabraSecreta} (${partida.palabraSecreta.length} letras)\n")

    val intentosSimulados = listOf("HOLA", "KOTLINS", "COMPASS", "COMPOSE")

    for (palabra in intentosSimulados) {
        if (partida.estado != EstadoPartida.JUGANDO) break

        partida = partida.procesarIntento(palabra) { evento ->
            when (evento) {
                is EventoWordle.LongitudInvalida -> {
                    println("⚠️ Longitud incorrecta: '${palabra}' mide ${evento.longitudRecibida} letras (se esperaban ${evento.longitudEsperada}). Turno no consumido.\n")
                }
                is EventoWordle.IntentoRegistrado -> {
                    val iconos = evaluarLetras(partida.palabraSecreta, palabra).joinToString(" ") { it.estado.icono }
                    println("Intento ${evento.turnoActual}: ${palabra.map { "$it" }.joinToString(" ")}")
                    println(iconos)
                    println("Intentos restantes: ${evento.intentosRestantes}\n")
                }
                is EventoWordle.Victoria -> {
                    val iconos = evaluarLetras(partida.palabraSecreta, palabra).joinToString(" ") { it.estado.icono }
                    println("Intento: ${palabra.map { "$it" }.joinToString(" ")}")
                    println(iconos)
                    println("🏆 ¡ENHORABUENA! Has resuelto el Wordle en ${evento.intentosUsados} intentos.\n")
                }
                is EventoWordle.Derrota -> {
                    println("💀 ¡Has agotado tus intentos! La palabra secreta era: ${evento.palabraCorrecta}\n")
                }
            }
        }
    }
}
```

Ejecuta `fun main()` y observa cómo el juego fluye con total elegancia respaldado por una suite de pruebas unitarias profesional y con un diseño 100% reutilizable en **Jetpack Compose**.

