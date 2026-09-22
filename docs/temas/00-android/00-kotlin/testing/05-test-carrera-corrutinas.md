# Taller de Testing 5: Carrera Espacial con TDD (Corrutinas, StateFlow y SharedFlow)

En el [Reto 5.14 de Concurrencia y Flujos Asíncronos](../ejercicios/05-concurrencia-corrutinas.md#reto-514-carrera-espacial-galactica-space-grand-prix) construiste un simulador concurrente en tiempo real (*Space Grand Prix*) con naves espaciales compitiendo en paralelo, coordinadas mediante un gestor centralizado con **`StateFlow`** y un bus de alertas reactivas con **`SharedFlow`**.

En este quinto y último taller de retos aplicaremos **TDD (*Test-Driven Development*)** sobre el paradigma asíncrono, dominando las técnicas de testing que definen la arquitectura moderna en Android (ViewModels reactivos, StateFlow y pruebas con tiempo virtual):

1. **Testing de Corrutinas sin Retardos con `runTest`:** Cómo testear código que suspende (`suspend fun`) saltándose esperas reales (*virtual time skip*) sin ralentizar la compilación de Gradle.
2. **Testing de Estado Reactivo (`StateFlow`):** Cómo verificar que las emisiones de `_posiciones.update` modifican el estado atómicamente y acotan valores con `.coerceAtMost(50)`.
3. **Testing de Eventos Efímeros de Disparo Único (`SharedFlow`):** Cómo capturar eventos puntuales (*one-off events*) como los turbos hiperespaciales mediante corrutinas recolectoras en segundo plano (`backgroundScope`).
4. **Testing de Detección de Victoria Concurrente:** Cómo asegurar que el veredicto del ganador (`hayGanador`) se emite en el momento exacto en que una nave cruza la meta estelar.

---

## 1. Configuración de Dependencias en Gradle

Para testear flujos reactivos y corrutinas con soporte de tiempo virtual, comprueba que tu archivo `build.gradle.kts` incluya la librería oficial de testing de corrutinas:

```kotlin
dependencies {
    // Librería estándar de testing de Kotlin
    testImplementation(kotlin("test"))

    // Soporte para runTest, TestScope y despachadores virtuales
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.1")
}
```

---

## 2. El Entorno de Trabajo Aislado

Para salvaguardar tu código de consola en `b05_corrutinas/Reto05_CarreraEspacial.kt` sin conflictos de nombres en la JVM, este taller se ubicará en el subpaquete:

📁 **Paquete de trabajo:** `package b05_corrutinas.tdd`

```text
pmdm-kotlin-lab/
└── src/
    ├── main/kotlin/b05_corrutinas/tdd/
    │   └── CarreraManager.kt         <-- Gestor de estado reactivo a implementar
    │
    └── test/kotlin/b05_corrutinas/tdd/
        └── CarreraManagerTest.kt     <-- Suite de pruebas asíncronas con runTest
```

---

## 3. Fase 1: El Contrato y el Esqueleto Inicial en Rojo

---

### Paso 1: Crear el esqueleto en `src/main`

Crea el archivo `CarreraManager.kt` en la ruta:  
📁 `src/main/kotlin/b05_corrutinas/tdd/CarreraManager.kt`

Copia el contrato con las firmas reactivas y deja sus cuerpos con `TODO()`:

```kotlin
package b05_corrutinas.tdd

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

// ============================================================================
// CONTRATO DEL GESTOR DE CARRERA ESPACIAL (TDD ASÍNCRONO)
// Tu objetivo es implementar la reactividad atómica hasta pasar todos los tests.
// ============================================================================

class CarreraManager(val nombresNaves: List<String>) {

    private val _posiciones = MutableStateFlow<Map<String, Int>>(
        nombresNaves.associateWith { 0 }
    )
    val posiciones: StateFlow<Map<String, Int>> = _posiciones.asStateFlow()

    private val _eventos = MutableSharedFlow<String>()
    val eventos: SharedFlow<String> = _eventos.asSharedFlow()

    /**
     * Misión 1 y 2:
     * Actualiza atómicamente la posición sumando el avance acotado a 50 AL.
     * Si avance >= 11, emite un aviso de turbo hacia _eventos.
     */
    suspend fun moverNave(nombre: String, avance: Int) {
        TODO("Misión 1 y 2: Actualizar posiciones con .update y emitir turbo si avance >= 11")
    }

    /**
     * Misión 3:
     * Retorna el nombre de la primera nave que haya alcanzado los 50 AL, o null si ninguna lo ha logrado.
     */
    fun hayGanador(): String? {
        TODO("Misión 3: Detectar nave ganadora con >= 50 AL")
    }
}
```

---

### Paso 2: Crear la Suite de Pruebas en `src/test`

Crea el archivo `CarreraManagerTest.kt` en la ruta:  
📁 `src/test/kotlin/b05_corrutinas/tdd/CarreraManagerTest.kt`

Pega la suite asíncrona completa utilizando `runTest`:

```kotlin
package b05_corrutinas.tdd

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class CarreraManagerTest {

    private val navesPrueba = listOf("Halcón", "Enterprise", "Arwing")

    // ========================================================================
    // 🌌 BLOQUE 1: ESTADO INICIAL Y POSICIONAMIENTO REACTIVO (StateFlow)
    // ========================================================================

    @Test
    fun `al iniciar la carrera todas las naves parten desde la posicion cero`() {
        val manager = CarreraManager(navesPrueba)

        val posicionesIniciales = manager.posiciones.value

        assertEquals(3, posicionesIniciales.size)
        assertTrue(posicionesIniciales.all { it.value == 0 })
    }

    @Test
    fun `moverNave incrementa la distancia recorrida de la nave indicada`() = runTest {
        val manager = CarreraManager(navesPrueba)

        manager.moverNave("Halcón", avance = 8)

        assertEquals(8, manager.posiciones.value["Halcón"])
        assertEquals(0, manager.posiciones.value["Enterprise"])
        assertEquals(0, manager.posiciones.value["Arwing"])
    }

    @Test
    fun `moverNave acota la distancia maxima a cincuenta anos luz`() = runTest {
        val manager = CarreraManager(navesPrueba)

        manager.moverNave("Enterprise", avance = 40)
        manager.moverNave("Enterprise", avance = 25) // Total daría 65

        // Debe quedar acotado exactamente en 50
        assertEquals(50, manager.posiciones.value["Enterprise"])
    }

    @Test
    fun `mover una nave desconocida no altera las naves registradas`() = runTest {
        val manager = CarreraManager(navesPrueba)

        manager.moverNave("NaveFantasma", avance = 15)

        assertEquals(3, manager.posiciones.value.size)
        assertNull(manager.posiciones.value["NaveFantasma"])
    }

    // ========================================================================
    // ⚡ BLOQUE 2: BUS DE EVENTOS EFÍMEROS Y TURBOS (SharedFlow)
    // ========================================================================

    @Test
    fun `un avance menor a once no emite evento de turbo al SharedFlow`() = runTest {
        val manager = CarreraManager(navesPrueba)
        val eventosRecibidos = mutableListOf<String>()

        // Recolector en segundo plano sobre el flujo efímero
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) {
            manager.eventos.collect { eventosRecibidos.add(it) }
        }

        manager.moverNave("Arwing", avance = 10)

        assertTrue(eventosRecibidos.isEmpty())
    }

    @Test
    fun `un avance de once o mas emite alerta de turbo hiperespacial`() = runTest {
        val manager = CarreraManager(navesPrueba)
        val eventosRecibidos = mutableListOf<String>()

        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) {
            manager.eventos.collect { eventosRecibidos.add(it) }
        }

        manager.moverNave("Halcón", avance = 12)

        assertEquals(1, eventosRecibidos.size)
        assertTrue(eventosRecibidos.first().contains("TURBO HIPERESPACIAL"))
        assertTrue(eventosRecibidos.first().contains("Halcón"))
    }

    // ========================================================================
    // 🏆 BLOQUE 3: DETECCIÓN DE GANADOR Y META ESTELAR
    // ========================================================================

    @Test
    fun `hayGanador retorna null mientras ninguna nave alcance los cincuenta anos luz`() = runTest {
        val manager = CarreraManager(navesPrueba)

        manager.moverNave("Halcón", avance = 30)
        manager.moverNave("Enterprise", avance = 49)

        assertNull(manager.hayGanador())
    }

    @Test
    fun `hayGanador retorna el nombre de la nave en cuanto cruza la meta estelar`() = runTest {
        val manager = CarreraManager(navesPrueba)

        manager.moverNave("Arwing", avance = 50)

        assertEquals("Arwing", manager.hayGanador())
    }
}
```

---

### Paso 3: Arrancar en Rojo

Lanza la ejecución de la suite asíncrona en tu terminal:

```bash
./gradlew test --tests "b05_corrutinas.tdd.CarreraManagerTest"
```

Los tests asíncronos se lanzarán de inmediato y la prueba fallará con un **fallo en ROJO esperado**:

```text
CarreraManagerTest > moverNave incrementa la distancia recorrida de la nave indicada() FAILED
    kotlin.NotImplementedError: An operation is not implemented: Misión 1 y 2
```

---

## 4. Fase 2: Misiones en Verde Paso a Paso

---

### Misión 1: Actualización Atómica de `StateFlow` con `.update`

Abre `src/main/kotlin/b05_corrutinas/tdd/CarreraManager.kt` e implementa la actualización concurrente acotando el avance con `.coerceAtMost(50)`:

```kotlin
suspend fun moverNave(nombre: String, avance: Int) {
    if (nombre !in nombresNaves) return

    _posiciones.update { mapaActual ->
        val posActual = mapaActual[nombre] ?: 0
        val nuevaPos = (posActual + avance).coerceAtMost(50)
        mapaActual + (nombre to nuevaPos)
    }

    // Misión 2: Emisión de turbos a continuación...
}
```

Ejecuta los tests del Bloque 1 en la terminal:

```bash
./gradlew test --tests "*moverNave*"
```

**Resultado:** ¡Los tests de posicionamiento y acotación de distancia pasan a **VERDE**!

---

### Misión 2: Emisión Reactiva de Turbos en `SharedFlow`

Completa la función `moverNave` emitiendo el mensaje hacia el bus `_eventos` cuando el salto sea de al menos 11 AL:

```kotlin
suspend fun moverNave(nombre: String, avance: Int) {
    if (nombre !in nombresNaves) return

    _posiciones.update { mapaActual ->
        val posActual = mapaActual[nombre] ?: 0
        val nuevaPos = (posActual + avance).coerceAtMost(50)
        mapaActual + (nombre to nuevaPos)
    }

    if (avance >= 11) {
        _eventos.emit("⚡ ¡TURBO HIPERESPACIAL ACTIVADO POR $nombre! (+$avance AL)")
    }
}
```

Ejecuta los tests del Bloque 2:

```bash
./gradlew test --tests "*turbo*"
```

**Resultado:** ¡Los tests del bus de eventos efímeros pasan a **VERDE**!

---

### Misión 3: Detección de Victoria en `hayGanador`

Implementa la consulta de ganador inspeccionando el estado reactivo actual `_posiciones.value`:

```kotlin
fun hayGanador(): String? {
    return _posiciones.value.entries.firstOrNull { it.value >= 50 }?.key
}
```

---

## 5. Fase 3: Verificación 100% Verde en Gradle

Ejecuta la suite completa de pruebas concurrentes:

```bash
./gradlew test --tests "b05_corrutinas.tdd.CarreraManagerTest"
```

### Salida esperada en consola:

```text
> Task :compileKotlin UP-TO-DATE
> Task :compileTestKotlin UP-TO-DATE
> Task :testClasses UP-TO-DATE
> Task :test

BUILD SUCCESSFUL in 395ms
3 actionable tasks: 1 executed, 2 up-to-date
```

Abre el informe web interactivo de Gradle:  
📁 `pmdm-kotlin-lab/build/reports/tests/test/index.html`

Comprobarás que los **8 tests asíncronos están en verde impecable**. Gracias a `runTest`, todos los tests se han ejecutado en **menos de 400 milisegundos**, demostrando cómo evaluar `StateFlow`, `SharedFlow` y corrutinas concurrentes de forma determinista y ultrarrápida.

---

## 6. Fase 4: Ensamblado del Simulador Concurrente en `main()`

Añade al final de `CarreraManager.kt` la orquestación en tiempo real para disfrutar del gran premio espacial:

```kotlin
import kotlinx.coroutines.delay
import kotlinx.coroutines.joinAll
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    println("""
        ==================================================
              🚀 GRAN PREMIO ESPACIAL: 50 AÑOS LUZ 🚀      
        ==================================================
    """.trimIndent())

    val naves = listOf("Halcón", "Enterprise", "Arwing")
    val manager = CarreraManager(naves)

    // 1. Observador de Eventos Efímeros (SharedFlow)
    val jobEventos = launch {
        manager.eventos.collect { aviso ->
            println("\n$aviso\n")
        }
    }

    // 2. Observador de Pantalla (StateFlow)
    val jobRender = launch {
        manager.posiciones.collect { mapa ->
            println("--- CIRCUITO ESTELAR ---")
            mapa.forEach { (nave, pos) ->
                val barra = "=".repeat(pos / 2)
                println("${nave.padEnd(11)}: $barra> [$pos/50 AL]")
            }
            println()
            delay(200)
        }
    }

    // 3. Lanzamiento de las 3 naves de forma concurrente
    val jobsNaves = naves.map { nave ->
        launch {
            while (manager.hayGanador() == null) {
                delay((150..300).random().toLong())
                val avance = (4..12).random()
                manager.moverNave(nave, avance)
            }
        }
    }

    // 4. Sincronización y cancelación ordenada
    jobsNaves.joinAll()
    jobEventos.cancel()
    jobRender.cancel()

    val campeon = manager.hayGanador()
    println("""
        ==================================================
                   🏆 ¡TENEMOS GANADOR GALÁCTICO! 🏆       
        La nave '$campeon' ha cruzado la meta estelar (50 AL).
        ==================================================
    """.trimIndent())
}
```

Ejecuta `fun main()` y observa cómo el gestor reactivo probado con TDD alimenta el simulador con precisión atómica y total fluidez.
