# Taller de Testing 4: Deck Builder RPG con TDD (Colecciones Funcionales y Scopes)

En el [Reto 4.16 de Colecciones y Scope Functions](../ejercicios/04-colecciones-scope-functions.md#reto-416-deck-builder-rpg-saqueo-y-forja-de-cartas) construiste el motor de saqueo y forja de cartas para un juego de rol táctico, sustituyendo los bucles tradicionales por **pipelines puramente funcionales** (`flatMap`, `distinctBy`, `filter`, `partition`, `groupBy`, `sortedByDescending`, `take`).

En este cuarto taller continuaremos aplicando **TDD (*Test-Driven Development*)** para dominar cuatro habilidades clave del desarrollo profesional de software con Kotlin y Android:

1. **Testing de Pipelines Funcionales Inmutables:** Cómo verificar transformaciones complejas en cadena sobre colecciones anidadas garantizando que la colección de origen permanece inmutable.
2. **Testing de Agrupaciones y Reducciones (`groupBy`, `sumOf`):** Cómo comprobar mapas derivados (`Map<K, V>`) y agregados aritméticos verificando claves presentes, conteos y totales sin usar bucles `for`.
3. **Testing de Ordenaciones y Selección con Límites (`sortedByDescending`, `take`):** Cómo asegurar que los filtros de selección respetan las prioridades de negocio y toleran situaciones límite (listas vacías o con menos cartas de las solicitadas).
4. **Testing de Inicialización y Callbacks con Scope Functions (`apply`, `also`):** Cómo verificar que un objeto de dominio (`MazoCombate`) queda configurado con precisión y dispara sus auditorías reactivas.

---

## 1. El Entorno de Trabajo Aislado

Para que tu código original en `b04_colecciones/Reto04_DeckBuilder.kt` permanezca inalterado y evitar colisiones de firmas en la JVM (*Platform declaration clash*), este taller se desarrollará en el subpaquete:

📁 **Paquete de trabajo:** `package b04_colecciones.tdd`

```text
pmdm-kotlin-lab/
└── src/
    ├── main/kotlin/b04_colecciones/tdd/
    │   └── ForjadorMazo.kt         <-- Entidades y funciones puras a implementar con TDD
    │
    └── test/kotlin/b04_colecciones/tdd/
        └── ForjadorMazoTest.kt     <-- Suite de pruebas unitarias automatizadas
```

---

## 2. Fase 1: El Contrato y el Esqueleto Inicial en Rojo

---

### Paso 1: Crear el esqueleto en `src/main`

Crea el archivo `ForjadorMazo.kt` en la ruta:  
📁 `src/main/kotlin/b04_colecciones/tdd/ForjadorMazo.kt`

Copia el contrato con las firmas de datos y funciones dejando sus cuerpos con `TODO()`:

```kotlin
package b04_colecciones.tdd

// ============================================================================
// CONTRATO DEL FORJADOR DE MAZOS RPG (TDD)
// Tu objetivo es implementar los pipelines funcionales hasta que todos los tests pasen.
// ============================================================================

data class Carta(
    val id: String,
    val nombre: String,
    val elemento: String,
    val poder: Int,
    val esAtaque: Boolean
)

class MazoCombate {
    var cartas: List<Carta> = emptyList()

    val poderTotal: Int
        get() = cartas.sumOf { it.poder }
}

/**
 * Misión 1:
 * Aplana los cofres (flatMap), elimina duplicados por id (distinctBy)
 * y descarta cartas rotas o malditas con poder <= 0 (filter).
 */
fun purificarBotin(cofres: List<List<Carta>>): List<Carta> {
    TODO("Misión 1: Implementar purificación funcional con flatMap, distinctBy y filter")
}

/**
 * Misión 2:
 * Divide la lista en un par: First = Ofensivas (esAtaque == true), Second = Defensivas (esAtaque == false).
 */
fun separarPorRol(cartas: List<Carta>): Pair<List<Carta>, List<Carta>> {
    TODO("Misión 2: Implementar partición con partition { it.esAtaque }")
}

/**
 * Misión 3:
 * Agrupa las cartas ofensivas por elemento y calcula el poder total de cada uno.
 * Retorna un mapa: Clave = Elemento (String), Valor = Poder acumulado (Int).
 */
fun calcularSinergiasAtaque(ofensivas: List<Carta>): Map<String, Int> {
    TODO("Misión 3: Implementar agrupación con groupBy y sumOf")
}

/**
 * Misión 4:
 * Ordena descendentemente por poder y toma las primeras 'cantidad' cartas.
 */
fun seleccionarCartasElite(cartas: List<Carta>, cantidad: Int): List<Carta> {
    TODO("Misión 4: Implementar ordenación y límite con sortedByDescending y take")
}

/**
 * Misión 5:
 * Ensambla una instancia de MazoCombate asignando las cartas mediante apply
 * y notificando a la lambda de auditoría con also si se proporciona.
 */
fun forjarMazo(
    topAtaque: List<Carta>,
    topDefensa: List<Carta>,
    onAudit: ((MazoCombate) -> Unit)? = null
): MazoCombate {
    TODO("Misión 5: Ensamblar con apply y also")
}
```

---

### Paso 2: Crear la Suite de Pruebas en `src/test`

Crea el archivo `ForjadorMazoTest.kt` en la ruta:  
📁 `src/test/kotlin/b04_colecciones/tdd/ForjadorMazoTest.kt`

Pega la siguiente batería completa de pruebas unitarias:

```kotlin
package b04_colecciones.tdd

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ForjadorMazoTest {

    // ========================================================================
    // 🧹 BLOQUE 1: PURIFICACIÓN DEL BOTÍN (flatMap, distinctBy, filter)
    // ========================================================================

    @Test
    fun `purificarBotin aplana cofres anidados en una unica lista`() {
        val cofre1 = listOf(Carta("C-01", "Chispa", "Fuego", 20, true))
        val cofre2 = listOf(Carta("C-02", "Barrera", "Luz", 30, false))
        val cofres = listOf(cofre1, cofre2)

        val resultado = purificarBotin(cofres)

        assertEquals(2, resultado.size)
        assertEquals(listOf("C-01", "C-02"), resultado.map { it.id })
    }

    @Test
    fun `purificarBotin elimina cartas duplicadas por identificador id`() {
        val cartaOriginal = Carta("C-01", "Bola de Fuego", "Fuego", 65, true)
        val cartaDuplicada = Carta("C-01", "Bola de Fuego", "Fuego", 65, true)
        val cofres = listOf(listOf(cartaOriginal), listOf(cartaDuplicada))

        val resultado = purificarBotin(cofres)

        assertEquals(1, resultado.size)
        assertEquals("C-01", resultado.first().id)
    }

    @Test
    fun `purificarBotin descarta cartas con poder menor o igual a cero`() {
        val rota = Carta("C-08", "Poción Rota", "Neutro", 0, false)
        val maldita = Carta("C-03", "Maldición Oscura", "Sombra", -20, true)
        val valida = Carta("C-04", "Rayo", "Rayo", 80, true)
        val cofres = listOf(listOf(rota, maldita, valida))

        val resultado = purificarBotin(cofres)

        assertEquals(1, resultado.size)
        assertEquals("C-04", resultado.first().id)
        assertTrue(resultado.all { it.poder > 0 })
    }

    // ========================================================================
    // ⚔️ BLOQUE 2: PARTICIÓN POR ROL TÁCTICO (partition)
    // ========================================================================

    @Test
    fun `separarPorRol divide exactamente entre ofensivas y defensivas`() {
        val cartas = listOf(
            Carta("C-01", "Ataque 1", "Fuego", 50, esAtaque = true),
            Carta("C-02", "Escudo 1", "Luz", 40, esAtaque = false),
            Carta("C-03", "Ataque 2", "Rayo", 70, esAtaque = true)
        )

        val (ofensivas, defensivas) = separarPorRol(cartas)

        assertEquals(2, ofensivas.size)
        assertEquals(1, defensivas.size)
        assertTrue(ofensivas.all { it.esAtaque })
        assertTrue(defensivas.none { it.esAtaque })
    }

    // ========================================================================
    // 🔮 BLOQUE 3: ANÁLISIS DE SINERGIAS ELEMENTALES (groupBy, sumOf)
    // ========================================================================

    @Test
    fun `calcularSinergiasAtaque agrupa y totaliza el poder por cada elemento`() {
        val ofensivas = listOf(
            Carta("C-01", "Fuego Menor", "Fuego", 40, true),
            Carta("C-02", "Fuego Mayor", "Fuego", 60, true),
            Carta("C-03", "Rayo Veloz", "Rayo", 80, true)
        )

        val sinergias = calcularSinergiasAtaque(ofensivas)

        assertEquals(2, sinergias.size)
        assertEquals(100, sinergias["Fuego"])
        assertEquals(80, sinergias["Rayo"])
    }

    @Test
    fun `calcularSinergiasAtaque devuelve mapa vacio ante lista vacia`() {
        val sinergias = calcularSinergiasAtaque(emptyList())

        assertTrue(sinergias.isEmpty())
    }

    // ========================================================================
    // 🏆 BLOQUE 4: SELECCIÓN DE CARTAS DE ÉLITE (sortedByDescending, take)
    // ========================================================================

    @Test
    fun `seleccionarCartasElite ordena descendentemente por poder y limita la cantidad`() {
        val cartas = listOf(
            Carta("C-01", "Baja", "Fuego", 20, true),
            Carta("C-02", "Maxima", "Fuego", 90, true),
            Carta("C-03", "Media", "Fuego", 60, true),
            Carta("C-04", "Minima", "Fuego", 10, true)
        )

        val top2 = seleccionarCartasElite(cartas, cantidad = 2)

        assertEquals(2, top2.size)
        assertEquals(listOf(90, 60), top2.map { it.poder })
    }

    @Test
    fun `seleccionarCartasElite no falla si se solicitan mas cartas de las disponibles`() {
        val cartas = listOf(Carta("C-01", "Unica", "Fuego", 50, true))

        val resultado = seleccionarCartasElite(cartas, cantidad = 5)

        assertEquals(1, resultado.size)
        assertEquals(50, resultado.first().poder)
    }

    // ========================================================================
    // 🛡️ BLOQUE 5: ENSAMBLADO DEL MAZO Y SCOPE FUNCTIONS (apply, also)
    // ========================================================================

    @Test
    fun `forjarMazo ensambla las cartas y calcula correctamente el poder total`() {
        val ataque = listOf(Carta("C-01", "Ataque", "Fuego", 90, true))
        val defensa = listOf(Carta("C-02", "Defensa", "Hielo", 70, false))

        val mazo = forjarMazo(ataque, defensa)

        assertEquals(2, mazo.cartas.size)
        assertEquals(160, mazo.poderTotal)
    }

    @Test
    fun `forjarMazo dispara la auditoria through also pasando el mazo configurado`() {
        val ataque = listOf(Carta("C-01", "Ataque", "Fuego", 100, true))
        var mazoAuditado: MazoCombate? = null

        val mazoCreado = forjarMazo(ataque, emptyList(), onAudit = { auditado ->
            mazoAuditado = auditado
        })

        assertEquals(mazoCreado, mazoAuditado)
        assertEquals(100, mazoAuditado?.poderTotal)
    }
}
```

---

### Paso 3: Arrancar en Rojo

Ejecuta en tu terminal la suite del subpaquete:

```bash
./gradlew test --tests "b04_colecciones.tdd.ForjadorMazoTest"
```

El compilador de Kotlin resolverá los tipos y las firmas, pero la ejecución se detendrá con un **fallo en ROJO esperado**:

```text
ForjadorMazoTest > purificarBotin aplana cofres anidados en una unica lista() FAILED
    kotlin.NotImplementedError: An operation is not implemented: Misión 1
```

---

## 3. Fase 2: Misiones en Verde Paso a Paso

---

### Misión 1: Purificación Funcional (`flatMap`, `distinctBy`, `filter`)

Abre `ForjadorMazo.kt` y reemplaza el cuerpo de `purificarBotin`:

```kotlin
fun purificarBotin(cofres: List<List<Carta>>): List<Carta> {
    return cofres
        .flatMap { it }
        .distinctBy { it.id }
        .filter { it.poder > 0 }
}
```

Ejecuta los tests del Bloque 1:

```bash
./gradlew test --tests "*purificarBotin*"
```

**Resultado:** ¡Los 3 tests de purificación pasan a **VERDE**!

---

### Misión 2: Partición de Roles Tácticos (`partition`)

Implementa `separarPorRol` aprovechando la función de orden superior `partition`:

```kotlin
fun separarPorRol(cartas: List<Carta>): Pair<List<Carta>, List<Carta>> {
    return cartas.partition { it.esAtaque }
}
```

Ejecuta el test de partición:

```bash
./gradlew test --tests "*separarPorRol*"
```

**Resultado:** ¡El test del Bloque 2 pasa a **VERDE**!

---

### Misión 3: Agrupación y Sumas con `groupBy` y `sumOf`

Implementa `calcularSinergiasAtaque` transformando las cartas agrupadas por escuela mágica:

```kotlin
fun calcularSinergiasAtaque(ofensivas: List<Carta>): Map<String, Int> {
    return ofensivas
        .groupBy { it.elemento }
        .mapValues { (_, cartasDelElemento) -> cartasDelElemento.sumOf { it.poder } }
}
```

Ejecuta los tests de sinergias:

```bash
./gradlew test --tests "*calcularSinergiasAtaque*"
```

**Resultado:** ¡Los tests del Bloque 3 pasan a **VERDE**!

---

### Misión 4: Selección de Élite con `sortedByDescending` y `take`

Implementa `seleccionarCartasElite`:

```kotlin
fun seleccionarCartasElite(cartas: List<Carta>, cantidad: Int): List<Carta> {
    return cartas
        .sortedByDescending { it.poder }
        .take(cantidad)
}
```

Ejecuta los tests de selección:

```bash
./gradlew test --tests "*seleccionarCartasElite*"
```

**Resultado:** ¡Los tests del Bloque 4 pasan a **VERDE**!

---

### Misión 5: Ensamblado y Auditoría con `apply` y `also`

Implementa `forjarMazo` aplicando las Scope Functions idiomáticas:

```kotlin
fun forjarMazo(
    topAtaque: List<Carta>,
    topDefensa: List<Carta>,
    onAudit: ((MazoCombate) -> Unit)? = null
): MazoCombate {
    return MazoCombate().apply {
        cartas = topAtaque + topDefensa
    }.also { mazoConfigurado ->
        onAudit?.invoke(mazoConfigurado)
    }
}
```

---

## 4. Fase 3: Verificación 100% Verde en Gradle

Lanza la suite de pruebas completa en tu terminal:

```bash
./gradlew test --tests "b04_colecciones.tdd.ForjadorMazoTest"
```

### Salida esperada en consola:

```text
> Task :compileKotlin UP-TO-DATE
> Task :compileTestKotlin UP-TO-DATE
> Task :testClasses UP-TO-DATE
> Task :test

BUILD SUCCESSFUL in 385ms
3 actionable tasks: 1 executed, 2 up-to-date
```

Abre en tu navegador el informe interactivo de Gradle:  
📁 `pmdm-kotlin-lab/build/reports/tests/test/index.html`

Comprobarás que los **10 tests del forjador están en verde brillante (100% de éxito)**. El pipeline funcional es matemáticamente infalible frente a duplicados, valores negativos y listas vacías.

---

## 5. Fase 4: Ensamblado del Juego en `main()`

Añade al final de `src/main/kotlin/b04_colecciones/tdd/ForjadorMazo.kt` la simulación en consola para disfrutar del resultado:

```kotlin
fun main() {
    println("=== SIMULADOR DE SAQUEO: DECK BUILDER RPG (TDD) ===\n")

    // Cofres simulados de la incursión
    val cofre1 = listOf(
        Carta("C-01", "Bola de Fuego", "Fuego", 65, true),
        Carta("C-02", "Muro de Hielo", "Hielo", 70, false),
        Carta("C-03", "Maldición Oscura", "Sombra", -20, true) // Maldita
    )
    val cofre2 = listOf(
        Carta("C-01", "Bola de Fuego", "Fuego", 65, true), // Duplicada
        Carta("C-04", "Rayo Fulminante", "Rayo", 80, true),
        Carta("C-05", "Meteoro Ígneo", "Fuego", 90, true)
    )
    val cofre3 = listOf(
        Carta("C-06", "Escudo Divino", "Luz", 50, false),
        Carta("C-07", "Ventisca Glacial", "Hielo", 65, true),
        Carta("C-08", "Poción Rota", "Neutro", 0, false) // Rota
    )

    val cofres = listOf(cofre1, cofre2, cofre3)
    println("Botín inicial en 3 cofres: ${cofres.sumOf { it.size }} cartas.")

    // 1. Purificación
    val purificadas = purificarBotin(cofres)
    println("Cartas purificadas válidas: ${purificadas.size}\n")

    // 2. Partición táctica
    val (ofensivas, defensivas) = separarPorRol(purificadas)

    // 3. Sinergias elementales
    println("--- ANÁLISIS DE SINERGIAS DE ATAQUE ---")
    val sinergias = calcularSinergiasAtaque(ofensivas)
    sinergias.forEach { (elemento, poderTotal) ->
        println("Escuela $elemento: $poderTotal puntos de daño acumulado")
    }

    // 4. Selección de élite
    val topAtaque = seleccionarCartasElite(ofensivas, cantidad = 3)
    val topDefensa = seleccionarCartasElite(defensivas, cantidad = 2)

    // 5. Forja del mazo final con auditoría reactiva
    val mazoFinal = forjarMazo(topAtaque, topDefensa) { mazo ->
        println("\n[AUDITORÍA]: Mazo forjado exitosamente con ${mazo.cartas.size} cartas.")
    }

    println("\n--- ALINEACIÓN DEL MAZO ACTIVO ---")
    mazoFinal.cartas.forEachIndexed { index, carta ->
        val rol = if (carta.esAtaque) "ATAQUE" else "DEFENSA"
        println("${index + 1}. [$rol | ${carta.elemento}] ${carta.nombre} - Poder: ${carta.poder}")
    }
    println("Potencia total del mazo: ${mazoFinal.poderTotal} pts")
}
```

Ejecuta `fun main()` y contempla la elegancia de una arquitectura guiada por pruebas: código conciso, sin efectos secundarios y 100% testeado.
