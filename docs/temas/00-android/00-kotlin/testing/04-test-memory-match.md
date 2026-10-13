# Taller de Testing 4: Memory Match con TDD (Colecciones, Sets y Scopes)

En el [Reto 4.16 de Colecciones y Scope Functions](../ejercicios/04-colecciones-scope-functions.md#reto-416-memory-match-engine-juego-de-parejas-de-cartas-en-cuadricula) diseñaste el motor de estado del clásico **juego de parejas de cartas en cuadrícula 4x4 (Memory Match)**, utilizando operaciones funcionales (`+`, `mapIndexed`, `associateBy`, `chunked`, `subtract`, `apply` y `also`) preparadas para ser consumidas directamente por una interfaz de **Jetpack Compose**.

En este cuarto taller consolidaremos la metodología **TDD (*Test-Driven Development*)** para blindar las reglas de negocio de nuestro motor:

- **Generación y barajado inmutable de colecciones:** Asegurar que cada símbolo se duplica exactamente dos veces con identificadores secuenciales únicos.
- **Indexación eficiente con Mapas (`associateBy`):** Verificar búsquedas directas en tiempo constante O(1) evitando búsquedas lineales `find { ... }`.
- **Estructuración bidimensional con `chunked`:** Comprobar la división de la baraja en matrices listas para cuadrículas (`LazyVerticalGrid`).
- **Control de cartas restantes mediante teoría de conjuntos (`subtract`):** Validar la diferencia de conjuntos inmutables (`Set<Int>`) sin bucles imperativos.
- **Máquina de estados pura y Scope Functions (`apply`, `also`):** Probar las transiciones de estado de volteo, aciertos, fallos y prevención de jugadas inválidas.

---

## 1. El Entorno de Trabajo Aislado

Para no interferir con el archivo de ejercicios original (`b04_colecciones/Reto04_MemoryMatch.kt`), este taller se desarrolla en un subpaquete limpio dentro del módulo de pruebas:

📁 **Paquete de trabajo:** `package b04_colecciones.tdd`

```text
pmdm-kotlin-lab/
└── src/
    ├── main/kotlin/b04_colecciones/tdd/
    │   └── MemoryEngine.kt         <-- Modelo de dominio y funciones puras con TDD
    │
    └── test/kotlin/b04_colecciones/tdd/
        └── MemoryEngineTest.kt     <-- Batería de pruebas unitarias automatizadas
```

---

## 2. Fase 1: El Contrato Inicial en Rojo (Red)

En el ciclo TDD profesional, definimos las estructuras de datos y el contrato de funciones con esqueletos que lanzan `TODO()`. El código compilará pero todos los tests fallarán al ejecutarse.

### Paso 1: Crear el esqueleto en `src/main`

Crea el archivo `MemoryEngine.kt` en la ruta:  
📁 `src/main/kotlin/b04_colecciones/tdd/MemoryEngine.kt`

Copia el contrato con las firmas de datos y funciones dejando sus cuerpos con `TODO()`:

```kotlin
package b04_colecciones.tdd

// ============================================================================
// CONTRATO DEL MOTOR DE MEMORY MATCH (TDD)
// Tu objetivo es implementar las funciones puras hasta que todos los tests pasen.
// ============================================================================

data class Carta(
    val id: Int,
    val simbolo: String
)

enum class EstadoJugada {
    PRIMERA_CARTA,
    PAREJA_ENCONTRADA,
    NO_COINCIDEN,
    JUGADA_INVALIDA
}

data class MemoryUiState(
    val tablero: List<Carta> = emptyList(),
    val seleccionadasIds: List<Int> = emptyList(),
    val emparejadasIds: Set<Int> = emptySet(),
    val movimientos: Int = 0,
    val ultimoEstado: EstadoJugada = EstadoJugada.PRIMERA_CARTA
) {
    val juegoTerminado: Boolean
        get() = tablero.isNotEmpty() && emparejadasIds.size == tablero.size
}

/**
 * Misión 1:
 * Duplica la lista de símbolos base (+), mapea cada elemento asignándole
 * un id secuencial (mapIndexed) y baraja la lista si el flag barajar es true (shuffled).
 */
fun crearBaraja(simbolosBase: List<String>, barajar: Boolean = true): List<Carta> {
    TODO("Implementar duplicación, indexación y barajado")
}

/**
 * Misión 2:
 * Convierte la lista lineal de cartas en un mapa de acceso rápido indexado por id.
 */
fun indexarTablero(tablero: List<Carta>): Map<Int, Carta> {
    TODO("Implementar indexación rápida por id")
}

/**
 * Misión 3:
 * Divide la baraja plana en filas de tamaño fijo para representar la cuadrícula.
 */
fun estructurarCuadricula(tablero: List<Carta>, columnas: Int = 4): List<List<Carta>> {
    TODO("Implementar división en bloques de tamaño fijo")
}

/**
 * Misión 4:
 * Devuelve el conjunto de IDs de cartas que aún no han sido emparejadas usando operaciones de Set.
 */
fun obtenerCartasPendientes(tablero: List<Carta>, emparejadasIds: Set<Int>): Set<Int> {
    TODO("Implementar diferencia de conjuntos inmutables")
}

/**
 * Misión 5:
 * Transición de estado pura al voltear una carta en la partida.
 */
fun voltearCarta(
    estadoActual: MemoryUiState,
    idCartaSeleccionada: Int,
    onJugadaEvaluada: ((MemoryUiState) -> Unit)? = null
): MemoryUiState {
    TODO("Implementar máquina de estados inmutable de volteo")
}

/**
 * Misión 6:
 * Fábrica de inicio que construye el estado inicial configurando tablero y mapa.
 */
fun crearPartidaInicial(simbolosBase: List<String>, barajar: Boolean = false): MemoryUiState {
    TODO("Implementar inicialización de partida")
}
```

---

## 3. Fase 2: Implementación de la Suite de Pruebas Unitarias

Crea el archivo `MemoryEngineTest.kt` en la siguiente ruta exacta:  
📁 `src/test/kotlin/b04_colecciones/tdd/MemoryEngineTest.kt`

Copia la suite de pruebas organizada en 5 bloques funcionales:

```kotlin
package b04_colecciones.tdd

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class MemoryEngineTest {

    private val simbolosPrueba = listOf("A", "B", "C", "D")

    // ========================================================================
    // 🃏 BLOQUE 1: GENERACIÓN Y ESTRUCTURA DE LA BARAJA
    // ========================================================================

    @Test
    fun `crearBaraja genera exactamente el doble de cartas que simbolos base con IDs secuenciales`() {
        val baraja = crearBaraja(simbolosPrueba, barajar = false)

        assertEquals(8, baraja.size, "4 símbolos base deben producir una baraja de 8 cartas")
        
        // Verificar IDs secuenciales únicos del 0 al 7
        val ids = baraja.map { it.id }
        assertEquals((0..7).toList(), ids, "Los IDs deben ser números secuenciales de 0 a 7")
        
        // Cada símbolo debe estar repetido exactamente 2 veces
        val conteoSimbolos = baraja.groupingBy { it.simbolo }.eachCount()
        assertTrue(conteoSimbolos.values.all { it == 2 }, "Cada símbolo debe tener exactamente 2 copias")
    }

    @Test
    fun `crearBaraja sin barajar mantiene el orden concatenado determinista`() {
        val baraja = crearBaraja(simbolosPrueba, barajar = false)

        assertEquals("A", baraja[0].simbolo)
        assertEquals("B", baraja[1].simbolo)
        assertEquals("C", baraja[2].simbolo)
        assertEquals("D", baraja[3].simbolo)
        assertEquals("A", baraja[4].simbolo)
        assertEquals("B", baraja[5].simbolo)
    }

    // ========================================================================
    // 🗺️ BLOQUE 2: TRANSFORMACIONES DE COLECCIONES (MAPAS Y CUADRÍCULAS)
    // ========================================================================

    @Test
    fun `indexarTablero crea un mapa con busqueda instantanea por clave id`() {
        val baraja = crearBaraja(simbolosPrueba, barajar = false)
        val mapa = indexarTablero(baraja)

        assertEquals(8, mapa.size, "El mapa debe contener todas las cartas indexadas")
        assertEquals("A", mapa[0]?.simbolo, "La carta con id 0 debe ser 'A'")
        assertEquals("C", mapa[6]?.simbolo, "La carta con id 6 debe ser 'C'")
        assertEquals(null, mapa[99], "Un ID inexistente debe devolver null de forma segura")
    }

    @Test
    fun `estructurarCuadricula divide el tablero en filas exactas del tamano indicado`() {
        val simbolos8 = listOf("A", "B", "C", "D", "E", "F", "G", "H")
        val tablero16 = crearBaraja(simbolos8, barajar = false)

        val cuadricula = estructurarCuadricula(tablero16, columnas = 4)

        assertEquals(4, cuadricula.size, "Una baraja de 16 cartas en cuadrícula de 4 debe tener 4 filas")
        assertTrue(cuadricula.all { it.size == 4 }, "Cada fila debe contener exactamente 4 cartas")
        assertEquals(0, cuadricula[0][0].id, "La primera carta de la fila 0 debe ser id 0")
        assertEquals(4, cuadricula[1][0].id, "La primera carta de la fila 1 debe ser id 4")
    }

    // ========================================================================
    // 🎯 BLOQUE 3: TEORÍA DE CONJUNTOS (CARTAS PENDIENTES Y COMPLETITUD)
    // ========================================================================

    @Test
    fun `obtenerCartasPendientes calcula la diferencia de conjuntos respecto a las emparejadas`() {
        val baraja = crearBaraja(simbolosPrueba, barajar = false) // IDs 0..7
        val emparejadas = setOf(0, 4) // Pareja de símbolo 'A'

        val pendientes = obtenerCartasPendientes(baraja, emparejadas)

        assertEquals(6, pendientes.size, "De 8 cartas, con 2 emparejadas deben quedar 6 pendientes")
        assertFalse(pendientes.contains(0), "El id 0 no debe figurar en las pendientes")
        assertFalse(pendientes.contains(4), "El id 4 no debe figurar en las pendientes")
        assertTrue(pendientes.containsAll(listOf(1, 2, 3, 5, 6, 7)), "Deben restar los IDs sin emparejar")
    }

    // ========================================================================
    // 🔄 BLOQUE 4: MÁQUINA DE ESTADOS PURA DE VOLTEO DE CARTAS
    // ========================================================================

    @Test
    fun `voltear primera carta registra seleccion sin modificar movimientos`() {
        val estadoInicial = crearPartidaInicial(simbolosPrueba, barajar = false)

        val estado1 = voltearCarta(estadoInicial, idCartaSeleccionada = 0)

        assertEquals(listOf(0), estado1.seleccionadasIds, "Debe registrarse el ID de la primera carta")
        assertEquals(EstadoJugada.PRIMERA_CARTA, estado1.ultimoEstado)
        assertEquals(0, estado1.movimientos, "Voltear la primera carta de un turno no incrementa los movimientos")
    }

    @Test
    fun `voltear dos cartas con simbolos coincidentes suma un movimiento y registra la pareja`() {
        val estadoInicial = crearPartidaInicial(simbolosPrueba, barajar = false)
        // En baraja sin barajar: id 0 es "A", id 4 es "A"
        val estado1 = voltearCarta(estadoInicial, idCartaSeleccionada = 0)
        val estadoFinal = voltearCarta(estado1, idCartaSeleccionada = 4)

        assertEquals(EstadoJugada.PAREJA_ENCONTRADA, estadoFinal.ultimoEstado)
        assertEquals(1, estadoFinal.movimientos, "Completar la evaluación de dos cartas cuenta como 1 movimiento")
        assertTrue(estadoFinal.emparejadasIds.containsAll(listOf(0, 4)), "Ambos IDs deben agregarse a emparejadasIds")
        assertTrue(estadoFinal.seleccionadasIds.isEmpty(), "La lista de selección activa debe reiniciarse")
    }

    @Test
    fun `voltear dos cartas no coincidentes suma un movimiento sin agregarlas a emparejadas`() {
        val estadoInicial = crearPartidaInicial(simbolosPrueba, barajar = false)
        // En baraja sin barajar: id 0 es "A", id 1 es "B"
        val estado1 = voltearCarta(estadoInicial, idCartaSeleccionada = 0)
        val estadoFinal = voltearCarta(estado1, idCartaSeleccionada = 1)

        assertEquals(EstadoJugada.NO_COINCIDEN, estadoFinal.ultimoEstado)
        assertEquals(1, estadoFinal.movimientos, "Un fallo cuenta como 1 movimiento")
        assertTrue(estadoFinal.emparejadasIds.isEmpty(), "No debe agregarse ninguna carta a emparejadasIds")
        assertEquals(listOf(0, 1), estadoFinal.seleccionadasIds, "Ambas cartas quedan temporalmente visibles para el usuario")
    }

    @Test
    fun `voltear una carta ya emparejada o ya seleccionada devuelve JUGADA_INVALIDA sin alterar el estado`() {
        val estadoInicial = crearPartidaInicial(simbolosPrueba, barajar = false)
        val estado1 = voltearCarta(estadoInicial, idCartaSeleccionada = 0)

        // Intento 1: Voltear la misma carta que ya está seleccionada en el turno actual
        val estadoInvalido1 = voltearCarta(estado1, idCartaSeleccionada = 0)
        assertEquals(EstadoJugada.JUGADA_INVALIDA, estadoInvalido1.ultimoEstado)
        assertEquals(0, estadoInvalido1.movimientos, "Una jugada inválida no gasta movimientos")
        assertEquals(listOf(0), estadoInvalido1.seleccionadasIds)

        // Intento 2: Voltear una carta que ya fue descubierta y emparejada
        val estadoEmparejado = estadoInicial.copy(emparejadasIds = setOf(0, 4))
        val estadoInvalido2 = voltearCarta(estadoEmparejado, idCartaSeleccionada = 0)
        assertEquals(EstadoJugada.JUGADA_INVALIDA, estadoInvalido2.ultimoEstado)
    }

    // ========================================================================
    // 🏆 BLOQUE 5: CONDICIÓN DE VICTORIA Y AUDITORÍA REACTIVA
    // ========================================================================

    @Test
    fun `juegoTerminado devuelve true solo cuando todas las cartas han sido emparejadas`() {
        val estadoInicial = crearPartidaInicial(simbolosPrueba, barajar = false)
        assertFalse(estadoInicial.juegoTerminado, "La partida recién iniciada no puede estar terminada")

        val estadoVictoria = estadoInicial.copy(
            emparejadasIds = (0..7).toSet()
        )
        assertTrue(estadoVictoria.juegoTerminado, "Al coincidir el tamaño de emparejadas con el tablero se gana la partida")
    }

    @Test
    fun `voltearCarta ejecuta la auditoria reactiva con el estado resultante exacto`() {
        val estadoInicial = crearPartidaInicial(simbolosPrueba, barajar = false)
        var auditoriaInvocada = false
        var estadoAuditado: MemoryUiState? = null

        voltearCarta(estadoInicial, idCartaSeleccionada = 2) { estado ->
            auditoriaInvocada = true
            estadoAuditado = estado
        }

        assertTrue(auditoriaInvocada, "El callback de auditoría onJugadaEvaluada debe ser invocado")
        assertEquals(listOf(2), estadoAuditado?.seleccionadasIds)
    }
}
```

---

## 3. Fase 3: De Rojo a Verde (Implementación Guiada)

Ahora sustituimos cada `TODO()` de `MemoryEngine.kt` por su solución funcional elegante:

### Misión 1: Baraja Inmutable (`+`, `mapIndexed`, `shuffled`)

```kotlin
fun crearBaraja(simbolosBase: List<String>, barajar: Boolean = true): List<Carta> {
    val simbolosDuplicados = simbolosBase + simbolosBase
    val barajaOrdenada = simbolosDuplicados.mapIndexed { index, simbolo ->
        Carta(id = index, simbolo = simbolo)
    }
    return if (barajar) barajaOrdenada.shuffled() else barajaOrdenada
}
```

---

### Misión 2: Indexación Directa con `associateBy`

```kotlin
fun indexarTablero(tablero: List<Carta>): Map<Int, Carta> {
    return tablero.associateBy { it.id }
}
```

---

### Misión 3: División en Cuadrícula con `chunked`

```kotlin
fun estructurarCuadricula(tablero: List<Carta>, columnas: Int = 4): List<List<Carta>> {
    return tablero.chunked(columnas)
}
```

---

### Misión 4: Cartas Pendientes con `subtract`

```kotlin
fun obtenerCartasPendientes(tablero: List<Carta>, emparejadasIds: Set<Int>): Set<Int> {
    val todosLosIds = tablero.map { it.id }.toSet()
    return todosLosIds.subtract(emparejadasIds)
}
```

---

### Misión 5: Lógica Pura de Volteo y Scopes (`apply`, `also`)

```kotlin
fun voltearCarta(
    estadoActual: MemoryUiState,
    idCartaSeleccionada: Int,
    onJugadaEvaluada: ((MemoryUiState) -> Unit)? = null
): MemoryUiState {
    val mapaCartas = indexarTablero(estadoActual.tablero)
    val cartaSeleccionada = mapaCartas[idCartaSeleccionada]
        ?: return estadoActual.copy(ultimoEstado = EstadoJugada.JUGADA_INVALIDA)

    // Guardia de seguridad: Ignorar cartas ya emparejadas o actualmente seleccionadas
    if (idCartaSeleccionada in estadoActual.emparejadasIds ||
        idCartaSeleccionada in estadoActual.seleccionadasIds
    ) {
        return estadoActual.copy(ultimoEstado = EstadoJugada.JUGADA_INVALIDA)
    }

    val nuevoEstado: MemoryUiState = when (estadoActual.seleccionadasIds.size) {
        0 -> {
            // Primera carta levantada en este turno
            estadoActual.copy(
                seleccionadasIds = listOf(idCartaSeleccionada),
                ultimoEstado = EstadoJugada.PRIMERA_CARTA
            )
        }
        1 -> {
            // Segunda carta levantada: comprobamos coincidencia de símbolos
            val primeraId = estadoActual.seleccionadasIds.first()
            val primeraCarta = mapaCartas.getValue(primeraId)

            if (primeraCarta.simbolo == cartaSeleccionada.simbolo) {
                // ¡Pareja encontrada!
                estadoActual.copy(
                    seleccionadasIds = emptyList(),
                    emparejadasIds = estadoActual.emparejadasIds + setOf(primeraId, idCartaSeleccionada),
                    movimientos = estadoActual.movimientos + 1,
                    ultimoEstado = EstadoJugada.PAREJA_ENCONTRADA
                )
            } else {
                // Fallo: mostramos temporalmente ambas cartas
                estadoActual.copy(
                    seleccionadasIds = listOf(primeraId, idCartaSeleccionada),
                    movimientos = estadoActual.movimientos + 1,
                    ultimoEstado = EstadoJugada.NO_COINCIDEN
                )
            }
        }
        else -> {
            // Si había 2 cartas erróneas visibles, este clic limpia el turno y levanta la nueva
            estadoActual.copy(
                seleccionadasIds = listOf(idCartaSeleccionada),
                ultimoEstado = EstadoJugada.PRIMERA_CARTA
            )
        }
    }

    return nuevoEstado.also { estadoResultante ->
        onJugadaEvaluada?.invoke(estadoResultante)
    }
}
```

---

### Misión 6: Inicialización de Partida

```kotlin
fun crearPartidaInicial(simbolosBase: List<String>, barajar: Boolean = false): MemoryUiState {
    val tablero = crearBaraja(simbolosBase, barajar)
    return MemoryUiState(
        tablero = tablero,
        seleccionadasIds = emptyList(),
        emparejadasIds = emptySet(),
        movimientos = 0,
        ultimoEstado = EstadoJugada.PRIMERA_CARTA
    )
}
```

---

## 4. Fase 4: Verificación 100% Verde en Gradle

Ejecuta las pruebas en la terminal de tu entorno de trabajo:

=== "Windows (PowerShell)"

    ```powershell
    .\gradlew.bat test --tests "b04_colecciones.tdd.MemoryEngineTest"
    ```

=== "Windows (Símbolo del sistema / CMD)"

    ```cmd
    gradlew.bat test --tests "b04_colecciones.tdd.MemoryEngineTest"
    ```

=== "macOS / Linux"

    ```bash
    ./gradlew test --tests "b04_colecciones.tdd.MemoryEngineTest"
    ```

!!! tip "Ejecución visual desde IntelliJ IDEA en Windows"
    En Windows, también puedes abrir directamente el archivo `MemoryEngineTest.kt` en IntelliJ IDEA y pulsar el icono del **doble triángulo verde ▶▶** ubicado junto a la declaración de `class MemoryEngineTest`. IntelliJ ejecutará la batería completa sin necesidad de abrir la consola.

### Salida esperada en consola:

```text
> Task :compileKotlin UP-TO-DATE
> Task :compileTestKotlin UP-TO-DATE
> Task :testClasses UP-TO-DATE
> Task :test

BUILD SUCCESSFUL in 320ms
3 actionable tasks: 1 executed, 2 up-to-date
```

Abre en tu navegador el reporte visual generado por Gradle:  
📁 `pmdm-kotlin-lab/build/reports/tests/test/index.html`

Comprobarás que los **10 tests del motor de cartas están en verde brillante (100% de éxito)**.

---

## 5. 🧪 Experimento Pedagógico: Provocar un Fallo Intencionado

Para experimentar el poder de los tests automatizados frente a errores humanos en lógica de colecciones:

1. Abre `MemoryEngine.kt`.
2. Modifica temporalmente la condición de acierto en `voltearCarta`, comparando los identificadores en lugar de los símbolos:
   ```kotlin
   // ❌ ERROR INTENCIONADO: Se comparan los IDs en lugar de los símbolos
   if (primeraCarta.id == cartaSeleccionada.id) {
       // ...
   ```
3. Vuelve a ejecutar los tests en la consola:

    === "Windows (PowerShell)"

        ```powershell
        .\gradlew.bat test --tests "b04_colecciones.tdd.MemoryEngineTest"
        ```

    === "macOS / Linux"

        ```bash
        ./gradlew test --tests "b04_colecciones.tdd.MemoryEngineTest"
        ```

4. **¡Alerta inmediata!** El test `voltear dos cartas con simbolos coincidentes suma un movimiento y registra la pareja` fallará con un mensaje claro:
   ```text
   MemoryEngineTest > voltear dos cartas con simbolos coincidentes suma un movimiento y registra la pareja() FAILED
       java.lang.AssertionError: Expected <PAREJA_ENCONTRADA>, actual <NO_COINCIDEN>.
   ```
5. Restaura la comparación correcta `primeraCarta.simbolo == cartaSeleccionada.simbolo` y verifica cómo el semáforo vuelve a ponerse en verde al instante.

---

## 6. Fase 5: Simulación Determinista en `main()`

Añade al final de `src/main/kotlin/b04_colecciones/tdd/MemoryEngine.kt` la simulación en consola para visualizar la ejecución completa del juego:

```kotlin
fun main() {
    println("==================================================")
    println("  MEMORY MATCH ENGINE - SIMULACIÓN TDD EN CONSOLA")
    println("==================================================")

    val simbolosBase = listOf("A", "B", "C", "D")
    var estado = crearPartidaInicial(simbolosBase, barajar = false)

    println("Baraja inicial generada: ${estado.tablero.size} cartas.")
    val cuadricula = estructurarCuadricula(estado.tablero, columnas = 4)
    println("Cuadrícula generada: ${cuadricula.size} filas x 4 columnas.")

    val jugadas = listOf(
        Pair(0, 4), // Pareja "A" -> Acierto
        Pair(1, 3), // "B" con "D" -> Fallo
        Pair(1, 5), // Pareja "B" -> Acierto
        Pair(2, 6), // Pareja "C" -> Acierto
        Pair(3, 7)  // Pareja "D" -> Acierto final
    )

    jugadas.forEachIndexed { i, (c1, c2) ->
        println("\n--- Turno ${i + 1}: Voltear cartas [$c1] y [$c2] ---")
        estado = voltearCarta(estado, c1)
        estado = voltearCarta(estado, c2) { postEstado ->
            println("-> Resultado: ${postEstado.ultimoEstado} | Movimientos: ${postEstado.movimientos}")
        }
        val pendientes = obtenerCartasPendientes(estado.tablero, estado.emparejadasIds)
        println("Cartas descubiertas: ${estado.emparejadasIds.size} / ${estado.tablero.size} | Pendientes: ${pendientes.size}")
    }

    if (estado.juegoTerminado) {
        println("\n==================================================")
        println(" ¡VICTORIA! Tablero completado en ${estado.movimientos} movimientos.")
        println("==================================================")
    }
}
```

!!! note "Compatibilidad con la consola de Windows"
    Utilizamos caracteres de texto alfanuméricos simples (`[A]`, `[B]`, etc.) para los símbolos de las cartas para garantizar una visualización perfecta tanto en la consola clásica de Windows (CMD/PowerShell) como en terminales modernas con soporte UTF-8 sin requerir cambios de codificación (`chcp 65001`).
