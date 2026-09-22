# Taller de Testing 1: Testeando el Combate RPG (Fundamentos e Inmutabilidad)

En el [Reto 1.14 del Bloque de Fundamentos](../ejercicios/01-fundamentos-inmutabilidad.md#reto-114-combate-rpg-por-turnos-heroe-vs-dragon-carmesi) programaste una batalla por turnos en consola entre el Héroe de Kotlinia y el Dragón Carmesí.

El juego funciona en pantalla, pero **¿cómo garantizamos que las reglas críticas del combate nunca fallen ante futuras modificaciones?** 

- ¿Qué ocurre si un futuro programador modifica el código y la vida del Dragón queda en `-15 HP` en lugar de `0`?
- ¿Qué ocurre si el Héroe bebe una poción con 90 de vida y su salud sube a `125 HP` superando el máximo?
- ¿Cómo aseguramos que la IA del Héroe tome siempre la decisión táctica correcta bajo presión sin tener que jugar 50 partidas manuales para comprobarlo?

En este taller aprenderás a **refactorizar el código original para hacerlo testeable** y escribirás una **suite completa de pruebas unitarias automatizadas con Gradle**.

---

## 1. Diagnóstico de Testeabilidad: ¿Por qué no podíamos testear el código original?

Revisa cómo estaba planteada la solución dentro de `fun main()`:

```kotlin
// Fragmento del Reto 1.14 original:
while (heroeHp > 0 && dragonHp > 0) {
    // ...
    when (accion) {
        1 -> {
            val danoEspada = (18..25).random() // ❌ Aleatorio incontrolado
            dragonHp = (dragonHp - danoEspada).coerceAtLeast(0) // ❌ Estado atrapado en variable local de main
            println("-> Héroe asesta Golpe de Espada -> ¡$danoEspada de daño!") // ❌ Salida a consola
        }
    }
    // ...
}
```

Si intentáramos escribir un test para ese código tal como está, nos encontraríamos con tres barreras infranqueables:

1. **Atrapamiento en el ámbito local:** Las variables `heroeHp`, `dragonHp` y `pociones` están encerradas dentro de la función `main()`. Un test externo no tiene ninguna forma de leerlas o modificarlas.
2. **Aleatoriedad descontrolada:** Si el daño de la espada se calcula con `(18..25).random()`, en una ejecución hace 19 y en otra 24. No podemos afirmar de forma determinista con `assertEquals` cuál debe ser el valor exacto resultante.
3. **Efectos secundarios mezclados con cálculo:** El cálculo matemático de la vida está soldado con la llamada `println(...)`.

---

## 2. Paso 1: Refactorización a Lógica Pura en `Reto01_CombateRpg.kt`

Para resolver este problema, **separamos las reglas matemáticas y de decisión en funciones puras**. El bucle de consola seguirá funcionando exactamente igual, pero ahora se apoyará en estas funciones delegadas.

Abre tu archivo `src/main/kotlin/b01_fundamentos/Reto01_CombateRpg.kt` y añade las siguientes funciones puras a nivel de archivo (fuera de `main`):

```kotlin
package b01_fundamentos

// ============================================================================
// 🧠 REGLAS PURAS DEL MOTOR DE COMBATE (100% TESTEABLES)
// ============================================================================

/**
 * Aplica un impacto de daño a los puntos de vida actuales.
 * Garantiza que la vida resultante nunca baje de 0 (evita números negativos por overkill).
 */
fun calcularDano(hpActual: Int, dano: Int): Int {
    return (hpActual - dano).coerceAtLeast(0)
}

/**
 * Aplica la recuperación de puntos de vida de una poción curativa.
 * Garantiza que la salud nunca sobrepase el límite máximo permitido (evita sobrecuración).
 */
fun calcularCuracion(hpActual: Int, curacion: Int, maxHp: Int): Int {
    return (hpActual + curacion).coerceAtMost(maxHp)
}

/**
 * Evalúa las condiciones del Héroe y determina su acción estratégica:
 * - Opción 3: Beber poción si la vida es crítica (<= 40) y tiene inventario (> 0).
 * - Opción 2: Lanza de Hielo si dispone de energía suficiente (>= costeHechizo).
 * - Opción 1: Golpe de espada básico por defecto (coste 0).
 */
fun decidirAccionHeroe(hp: Int, energia: Int, pociones: Int, costeHechizo: Int = 15): Int {
    return when {
        hp <= 40 && pociones > 0 -> 3
        energia >= costeHechizo -> 2
        else -> 1
    }
}

/**
 * Calcula el número exacto de caracteres sólidos '█' que corresponden a la barra visual
 * de vida según la proporción entre la salud actual y la salud máxima.
 */
fun calcularBloquesBarra(hpActual: Int, hpMax: Int, longitudTotal: Int): Int {
    if (hpMax <= 0) return 0
    return ((hpActual * longitudTotal) / hpMax).coerceIn(0, longitudTotal)
}
```

### ¿Cómo queda ahora la función `main()`?

Fíjate en cómo el bucle interactivo se simplifica notablemente, delegando el trabajo sucio en las funciones puras que acabamos de definir:

```kotlin
fun main() {
    val maxHeroeHp = 100
    val maxDragonHp = 150
    val maxHeroeEnergia = 30
    val costeEnergiaHechizo = 15

    var heroeHp = maxHeroeHp
    var heroeEnergia = maxHeroeEnergia
    var pociones = 2
    var dragonHp = maxDragonHp
    var turno = 1

    while (heroeHp > 0 && dragonHp > 0) {
        println("\n=== TURNO #$turno ===")

        // El HUD ahora usa la función pura testeable:
        val bloquesHeroe = calcularBloquesBarra(heroeHp, maxHeroeHp, 10)
        val barraHeroe = "█".repeat(bloquesHeroe).padEnd(10, ' ')

        val bloquesDragon = calcularBloquesBarra(dragonHp, maxDragonHp, 15)
        val barraDragon = "█".repeat(bloquesDragon).padEnd(15, ' ')

        println("HÉROE  [$barraHeroe] $heroeHp/$maxHeroeHp HP | Energía: $heroeEnergia/$maxHeroeEnergia | Pociones: $pociones")
        println("DRAGÓN [$barraDragon] $dragonHp/$maxDragonHp HP")

        // La decisión de la IA usa la función pura testeable:
        val accion = decidirAccionHeroe(heroeHp, heroeEnergia, pociones, costeEnergiaHechizo)

        when (accion) {
            1 -> {
                val danoEspada = (18..25).random()
                dragonHp = calcularDano(dragonHp, danoEspada) // <-- Delegación limpia
                println("-> Héroe asesta Golpe de Espada -> ¡$danoEspada de daño al Dragón!")
            }
            2 -> {
                heroeEnergia -= costeEnergiaHechizo
                val danoMagico = (35..45).random()
                dragonHp = calcularDano(dragonHp, danoMagico) // <-- Delegación limpia
                println("-> Héroe lanza Lanza de Hielo -> ¡$danoMagico de daño crítico al Dragón!")
            }
            3 -> {
                pociones--
                heroeHp = calcularCuracion(heroeHp, 35, maxHeroeHp) // <-- Delegación limpia
                println("-> Héroe bebe una Poción Curativa (+35 HP). Pociones restantes: $pociones")
            }
        }

        if (dragonHp > 0) {
            val danoDragon = (15..22).random()
            heroeHp = calcularDano(heroeHp, danoDragon) // <-- Delegación limpia
            println("-> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe $danoDragon de daño!")
        }

        turno++
    }

    // Veredicto final...
}
```

---

## 3. Paso 2: Matriz de Diseño de Casos de Prueba

Antes de tocar una sola línea de código de pruebas, confeccionamos la matriz de casos que garantizarán el blindaje del juego:

| Función a Probar | Escenario / Caso | Entradas (Arrange) | Resultado Esperado (Assert) | Tipo de Caso |
| :--- | :--- | :--- | :--- | :--- |
| `calcularDano` | Daño ordinario | HP: 100, Daño: 25 | **75 HP** | Nominal (*Happy Path*) |
| `calcularDano` | *Overkill* (daño letal masivo) | HP: 15, Daño: 40 | **0 HP** (jamás negativo) | Límite (*Edge Case*) |
| `calcularCuracion` | Curación estándar | HP: 40, Curación: 35, Máx: 100 | **75 HP** | Nominal (*Happy Path*) |
| `calcularCuracion` | Sobrecuración desbordada | HP: 90, Curación: 35, Máx: 100 | **100 HP** (tope alcanzado) | Límite (*Edge Case*) |
| `decidirAccionHeroe` | Salud crítica con pociones | HP: 35, Energía: 30, Pociones: 2 | **Opción 3** (Poción prioritaria) | Prioridad 1 |
| `decidirAccionHeroe` | Salud crítica sin pociones | HP: 30, Energía: 15, Pociones: 0 | **Opción 2** (Magia defensiva) | Prioridad 2 |
| `decidirAccionHeroe` | Recursos agotados en peligro | HP: 20, Energía: 10, Pociones: 0 | **Opción 1** (Espada básica) | Fallback seguro |
| `calcularBloquesBarra` | Mitad exacta de salud | HP: 50, Máx: 100, Longitud: 10 | **5 bloques** | Visual proporcional |
| `calcularBloquesBarra` | Salud a cero | HP: 0, Máx: 100, Longitud: 10 | **0 bloques** | Límite inferior |

---

## 4. Paso 3: Implementación de la Suite en `src/test/kotlin/`

Crea el archivo `Reto01_CombateRpgTest.kt` en la siguiente ruta exacta:  
📁 `src/test/kotlin/b01_fundamentos/Reto01_CombateRpgTest.kt`

Pega el siguiente código, observando la estructura rigurosa **AAA (*Arrange-Act-Assert*)** y el uso de nombres en lenguaje natural:

```kotlin
package b01_fundamentos

import kotlin.test.Test
import kotlin.test.assertEquals

class Reto01_CombateRpgTest {

    // ========================================================================
    // 🛡️ BLOQUE 1: PRUEBAS DE CÁLCULO DE DAÑO Y SALUD
    // ========================================================================

    @Test
    fun `aplicar impacto normal reduce la vida en la cantidad exacta recibida`() {
        // Arrange
        val vidaInicial = 100
        val impacto = 25

        // Act
        val vidaFinal = calcularDano(vidaInicial, impacto)

        // Assert
        assertEquals(75, vidaFinal, "100 HP menos 25 de impacto debe resultar en 75 HP")
    }

    @Test
    fun `un impacto que supera la salud restante no produce puntos de vida negativos`() {
        // Arrange: El dragón tiene 15 HP y recibe un ataque demoledor de 45 HP
        val vidaRestante = 15
        val impactoDemoledor = 45

        // Act
        val vidaFinal = calcularDano(vidaRestante, impactoDemoledor)

        // Assert: Overkill blindado con .coerceAtLeast(0)
        assertEquals(0, vidaFinal, "La salud tras un ataque letal debe ser 0 y nunca negativa")
    }

    // ========================================================================
    // 🧪 BLOQUE 2: PRUEBAS DE CURACIÓN Y LÍMITES SUPERIORES
    // ========================================================================

    @Test
    fun `beber pocion en estado herido recupera la cantidad exacta sin superar el maximo`() {
        // Arrange
        val vidaHerido = 40
        val curacionPocion = 35
        val vidaMaxima = 100

        // Act
        val vidaRecuperada = calcularCuracion(vidaHerido, curacionPocion, vidaMaxima)

        // Assert
        assertEquals(75, vidaRecuperada)
    }

    @Test
    fun `beber pocion con salud casi completa no sobrepasa la vida maxima`() {
        // Arrange: Héroe con 90 HP bebe poción de +35 (90 + 35 = 125, debe topar en 100)
        val vidaCasiLlena = 90
        val curacionPocion = 35
        val vidaMaxima = 100

        // Act
        val vidaTopada = calcularCuracion(vidaCasiLlena, curacionPocion, vidaMaxima)

        // Assert: Sobrecuración evitada con .coerceAtMost(maxHp)
        assertEquals(100, vidaTopada, "La curación jamás debe sobrepasar el tope de 100 HP")
    }

    // ========================================================================
    // 🤖 BLOQUE 3: PRUEBAS DE LA TOMA DE DECISIONES DE LA IA
    // ========================================================================

    @Test
    fun `heroe con vida critica y con pociones en zurron prioriza curarse`() {
        // Arrange: Vida <= 40 y tiene 2 pociones
        val hpCritico = 35
        val energiaSuficiente = 30
        val pocionesDisponibles = 2

        // Act
        val accionElegida = decidirAccionHeroe(hpCritico, energiaSuficiente, pocionesDisponibles)

        // Assert: Opción 3 = Beber poción
        assertEquals(3, accionElegida, "Con vida crítica y existencias, la máxima prioridad es la poción")
    }

    @Test
    fun `heroe con vida critica pero sin pociones recurre a ataque magico si tiene energia`() {
        // Arrange: Vida <= 40 pero sin pociones (0); conserva 20 de energía (coste 15)
        val hpCritico = 30
        val energiaRestante = 20
        val sinPociones = 0

        // Act
        val accionElegida = decidirAccionHeroe(hpCritico, energiaRestante, sinPociones)

        // Assert: Opción 2 = Lanza de Hielo
        assertEquals(2, accionElegida, "Sin pociones disponibles, el héroe debe intentar ataque mágico")
    }

    @Test
    fun `heroe con recursos totalmente agotados realiza ataque basico de espada`() {
        // Arrange: Vida baja, 0 pociones y solo 10 de energía (insuficiente para magia de 15)
        val hpBajo = 25
        val energiaInsuficiente = 10
        val sinPociones = 0

        // Act
        val accionElegida = decidirAccionHeroe(hpBajo, energiaInsuficiente, sinPociones)

        // Assert: Opción 1 = Espada básica
        assertEquals(1, accionElegida, "Sin energía ni pociones, el héroe debe recurrir a la espada")
    }

    // ========================================================================
    // 📊 BLOQUE 4: PRUEBAS DEL HUD Y BARRAS VISUALES
    // ========================================================================

    @Test
    fun `la barra de vida a mitad de salud calcula exactamente la mitad de bloques solidos`() {
        // Arrange: 50 de 100 HP en una barra de 10 caracteres totales
        val hpMitad = 50
        val hpMax = 100
        val tamanoBarra = 10

        // Act
        val bloquesSolidos = calcularBloquesBarra(hpMitad, hpMax, tamanoBarra)

        // Assert
        assertEquals(5, bloquesSolidos, "Al 50% de salud deben pintarse exactamente 5 bloques de 10")
    }

    @Test
    fun `la barra de vida con salud a cero no dibuja ningun bloque solido`() {
        // Arrange
        val hpMuerto = 0
        val hpMax = 100
        val tamanoBarra = 10

        // Act
        val bloquesSolidos = calcularBloquesBarra(hpMuerto, hpMax, tamanoBarra)

        // Assert
        assertEquals(0, bloquesSolidos, "Con 0 HP no debe dibujarse ningún bloque sólido")
    }
}
```

---

## 5. Paso 4: Automatización y Verificación con Gradle

Ahora llega el momento culminante: **ejecutar la batería de pruebas de forma automática**.

Abre la terminal integrada en IntelliJ IDEA (`Alt + F12` / `Option + F12`) y ejecuta el comando de Gradle dirigido a esta clase:

```bash
./gradlew test --tests "b01_fundamentos.Reto01_CombateRpgTest"
```

Si estás en Windows (CMD o PowerShell), utiliza el script por lotes:

```powershell
.\gradlew.bat test --tests "b01_fundamentos.Reto01_CombateRpgTest"
```

### Salida esperada en la consola:

```text
> Task :compileKotlin UP-TO-DATE
> Task :compileJava NO-SOURCE
> Task :processResources NO-SOURCE
> Task :classes UP-TO-DATE
> Task :compileTestKotlin
> Task :compileTestJava NO-SOURCE
> Task :processTestResources NO-SOURCE
> Task :testClasses
> Task :test

BUILD SUCCESSFUL in 412ms
3 actionable tasks: 2 executed, 1 up-to-date
```

### Comprobación del Reporte Visual HTML

Abre en tu navegador web el archivo generado:  
📁 `pmdm-kotlin-lab/build/reports/tests/test/index.html`

Verás la tabla completa con los **8 tests ejecutados en pocos milisegundos**, con un **100% de éxito**.

---

## 6. 🧪 Experimento Pedagógico: Provocar un Fallo Intencionado

Para experimentar el verdadero poder de los tests automatizados frente a las regresiones:

1. Abre `Reto01_CombateRpg.kt`.
2. Modifica intencionadamente la función `calcularCuracion` eliminando la acotación de seguridad `.coerceAtMost(maxHp)`:
   ```kotlin
   // ❌ ERROR INTENCIONADO: Hemos olvidado acotar la vida máxima
   fun calcularCuracion(hpActual: Int, curacion: Int, maxHp: Int): Int {
       return hpActual + curacion
   }
   ```
3. Vuelve a ejecutar en la terminal:
   ```bash
   ./gradlew test --tests "b01_fundamentos.Reto01_CombateRpgTest"
   ```
4. **¡Alerta instantánea!** Gradle detendrá la compilación, fallará con `BUILD FAILED` y te mostrará de inmediato:
   ```text
   Reto01_CombateRpgTest > beber pocion con salud casi completa no sobrepasa la vida maxima() FAILED
       java.lang.AssertionError: La curación jamás debe sobrepasar el tope de 100 HP. Expected <100>, actual <125>.
   ```

El test acaba de salvarte la vida: **ha detectado un error crítico de lógica antes de que el juego llegue a producción o a manos del usuario**.

Restaura el código original con `.coerceAtMost(maxHp)` y comprueba cómo el semáforo vuelve al verde. ¡Bienvenido al desarrollo profesional!
