# Bloque 4: Colecciones Funcionales, Mappers y Scope Functions

En este cuarto bloque trabajarás con la biblioteca de operaciones funcionales de Kotlin (`map`, `filter`, `groupBy`, etc.), la inmutabilidad de colecciones y las 5 funciones de ámbito (*Scope Functions*). Estas herramientas te permitirán transformar datos entre capas (patrón **Data Mapper** de Clean Architecture) y configurar objetos de forma limpia y concisa.

📁 **Paquete de trabajo:** `package b04_colecciones`  
Ubicación en tu proyecto: `src/main/kotlin/b04_colecciones/`

---

## 🟢 Nivel Básico (Colecciones Inmutables y Filtros)

### Ejercicio 4.1: Inmutabilidad en Listas y el Operador `+`
📄 **Archivo:** `E01_ListasInmutables.kt`

#### 1. Enunciado y Requisitos
1. Declara una lista inmutable `listaJuegos: List<String>` con 3 títulos.
2. En lugar de convertirla a `MutableList` y hacer `add()`, utiliza el operador funcional **`+`** para generar una nueva lista inmutable que incluya dos juegos adicionales.
3. Utiliza `filterNot` para eliminar un juego específico generando una tercera lista inmutable.
4. Muestra por consola las tres listas comprobando que la lista original no ha cambiado en ningún momento.

#### 2. Salida Esperada en Consola
```text
Original: [Zelda, Metroid, Mario]
Con añadidos: [Zelda, Metroid, Mario, Pokemon, Kirby]
Sin Metroid: [Zelda, Mario, Pokemon, Kirby]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val original: List<String> = listOf("Zelda", "Metroid", "Mario")

        // Inmutabilidad: derivamos nuevas listas con operadores funcionales
        val conAnadidos: List<String> = original + listOf("Pokemon", "Kirby")
        val sinMetroid: List<String> = conAnadidos.filterNot { it == "Metroid" }

        println("Original: $original")
        println("Con añadidos: $conAnadidos")
        println("Sin Metroid: $sinMetroid")
    }
    ```

---

### Ejercicio 4.2: Transformaciones con `map` y `filter`
📄 **Archivo:** `E02_MapFilterBasico.kt`

#### 1. Enunciado y Requisitos
Dada una lista de precios brutos en dólares: `val preciosDolares = listOf(15.0, 4.5, 60.0, 8.0, 35.0, 120.0)`
1. Filtra los precios para conservar únicamente los superiores a 10.0 $.
2. Transforma cada precio a euros multiplicándolo por el factor de conversión `0.92`.
3. Devuelve una lista de cadenas formateadas con 2 decimales y el sufijo `"€"`.
4. Realiza todo el proceso en un único pipeline funcional encadenado.

#### 2. Salida Esperada en Consola
```text
Precios en euros (>10$): [13.80 €, 55.20 €, 32.20 €, 110.40 €]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val preciosDolares = listOf(15.0, 4.5, 60.0, 8.0, 35.0, 120.0)

        val preciosEuros = preciosDolares
            .filter { it > 10.0 }
            .map { it * 0.92 }
            .map { "%.2f €".format(it) }

        println("Precios en euros (>10$): $preciosEuros")
    }
    ```

---

## 🟡 Nivel Intermedio (Agrupaciones y Scope Functions)

### Ejercicio 4.3: Agrupación con `groupBy` y Estadísticas
📄 **Archivo:** `E03_GroupByEstadisticas.kt`

#### 1. Enunciado y Requisitos
1. Modela una `data class ItemInventario(val nombre: String, val categoria: String, val valorMonedas: Int)`.
2. Crea una lista con al menos 6 items de diferentes categorías (`"Arma"`, `"Armadura"`, `"Consumible"`).
3. Utiliza **`groupBy`** para organizar los elementos por su categoría en un `Map<String, List<ItemInventario>>`.
4. Recorre el mapa calculando la suma total del valor en monedas de los items de cada categoría.

#### 2. Salida Esperada en Consola
```text
=== RESUMEN POR CATEGORÍA ===
Categoría: Arma (2 items) -> Valor total: 450 monedas
Categoría: Armadura (2 items) -> Valor total: 600 monedas
Categoría: Consumible (2 items) -> Valor total: 80 monedas
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    data class ItemInventario(val nombre: String, val categoria: String, val valorMonedas: Int)

    fun main() {
        val inventario = listOf(
            ItemInventario("Espada Larga", "Arma", 250),
            ItemInventario("Arco Elfico", "Arma", 200),
            ItemInventario("Peto de Hierro", "Armadura", 400),
            ItemInventario("Escudo de Roble", "Armadura", 200),
            ItemInventario("Poción Curativa", "Consumible", 50),
            ItemInventario("Antídoto Menor", "Consumible", 30)
        )

        val agrupadosPorCategoria = inventario.groupBy { it.categoria }

        println("=== RESUMEN POR CATEGORÍA ===")
        for ((categoria, items) in agrupadosPorCategoria) {
            val valorTotal = items.sumOf { it.valorMonedas }
            println("Categoría: $categoria (${items.size} items) -> Valor total: $valorTotal monedas")
        }
    }
    ```

---

### Ejercicio 4.4: Inicialización con `apply` vs Transformación con `let`
📄 **Archivo:** `E04_ScopeFunctionsApplyLet.kt`

#### 1. Enunciado y Requisitos
1. Modela una clase mutable de configuración:
   ```kotlin
   class ConfiguradorPerfil {
       var nick: String = ""
       var temaOscuro: Boolean = false
       var volumenEfectos: Int = 100
   }
   ```
2. Utiliza **`apply`** para inicializar las 3 propiedades de una sola vez devolviendo la instancia configurada.
3. Utiliza **`let`** sobre la instancia resultante para transformar el objeto en una cadena resumen formateada y retornarla.

#### 2. Salida Esperada en Consola
```text
Resumen Perfil: [GhostHunter] | DarkMode: true | SFX Volume: 75%
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    class ConfiguradorPerfil {
        var nick: String = ""
        var temaOscuro: Boolean = false
        var volumenEfectos: Int = 100
    }

    fun main() {
        // 'apply' devuelve el propio objeto ConfiguradorPerfil configurado:
        val perfil = ConfiguradorPerfil().apply {
            nick = "GhostHunter"
            temaOscuro = true
            volumenEfectos = 75
        }

        // 'let' toma el objeto (it) y devuelve el resultado de la última expresión:
        val resumen = perfil.let {
            "Resumen Perfil: [${it.nick}] | DarkMode: ${it.temaOscuro} | SFX Volume: ${it.volumenEfectos}%"
        }

        println(resumen)
    }
    ```

---

## 🔴 Nivel Avanzado (Mappers y Pipeline de Clean Architecture)

### Ejercicio 4.5: Auditoría con `also` y Cómputo con `run`
📄 **Archivo:** `E05_AlsoRunAudit.kt`

#### 1. Enunciado y Requisitos
Dada una lista de puntuaciones `listOf(1200, 850, 2400, 450, 1900)`:
1. Utiliza `filter` para quedarte con las superiores a 1000.
2. Intercala **`also`** para registrar en consola el número de partidas clasificadas antes de continuar la cadena (efecto secundario sin romper el flujo).
3. Utiliza **`run`** al final del pipeline para calcular y devolver la media de las puntuaciones filtradas.

#### 2. Salida Esperada en Consola
```text
[LOG]: Partidas que superan el umbral: 3
Promedio de puntuaciones top: 1833.33 pts
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val puntuaciones = listOf(1200, 850, 2400, 450, 1900)

        val promedioTop = puntuaciones
            .filter { it > 1000 }
            .also { println("[LOG]: Partidas que superan el umbral: ${it.size}") }
            .run { this.average() } // 'run' ejecuta el cálculo en el contexto de la lista filtrada

        println("Promedio de puntuaciones top: ${"%.2f".format(promedioTop)} pts")
    }
    ```

---

### Reto 4.6: Data Mappers en Clean Architecture (DTO -> Dominio)
📄 **Archivo:** `Reto04_PipelineDataMappers.kt`

#### 1. Contexto de Clean Architecture
En una app Android conectada a una API REST, los datos que recibimos en formato JSON contienen campos nulos, nombres en inglés y tipos crudos (**DTO - Data Transfer Object**). Antes de que lleguen a la UI o al dominio de nuestra app, debemos limpiarlos y transformarlos (**Data Mapper**).

#### 2. Requisitos Técnicos
1. Modela el DTO crudo de la red:
   ```kotlin
   data class GameDto(
       val raw_id: Long?,
       val raw_name: String?,
       val raw_score: Double?,
       val raw_platform: String?
   )
   ```
2. Modela la entidad limpia de Dominio:
   ```kotlin
   data class Game(
       val id: Long,
       val nombre: String,
       val puntuacion: Int,
       val esMultiplataforma: Boolean
   )
   ```
3. Crea una función de extensión Mapper: `GameDto.toDomain(): Game?`
   - Si `raw_id` o `raw_name` son nulos, devuelve `null` (dato inválido descartado).
   - Redondea `raw_score` a entero; si es nulo, asigna `0`.
   - `esMultiplataforma` será `true` si la plataforma contiene `"Multi"` o `"All"`.
4. Procesa una lista de DTOs simulados utilizando `.mapNotNull { it.toDomain() }` y ordénalos por puntuación descendente.

#### 3. Salida de Ejemplo en Consola
```text
=== PIPELINE DE DATOS CLEAN ARCHITECTURE ===
DTOs recibidos de red: 4 registros
-> Descartados registros corruptos (sin ID o sin nombre)
Entidades de Dominio procesadas (3 juegos válidos):
1. [ID 101] Elden Ring -> 96 pts (Multiplataforma: true)
2. [ID 103] Hades -> 93 pts (Multiplataforma: true)
3. [ID 102] Zelda BotW -> 90 pts (Multiplataforma: false)
```

#### 4. Solución Comentada
??? tip "Ver solución comentada paso a paso"
    ```kotlin
    package b04_colecciones

    data class GameDto(
        val raw_id: Long?,
        val raw_name: String?,
        val raw_score: Double?,
        val raw_platform: String?
    )

    data class Game(
        val id: Long,
        val nombre: String,
        val puntuacion: Int,
        val esMultiplataforma: Boolean
    )

    // Data Mapper como función de extensión:
    fun GameDto.toDomain(): Game? {
        val idValido = this.raw_id ?: return null
        val nombreValido = this.raw_name?.takeIf { it.isNotBlank() } ?: return null

        val scoreEntero = this.raw_score?.toInt() ?: 0
        val esMulti = this.raw_platform?.contains("Multi", ignoreCase = true) == true

        return Game(
            id = idValido,
            nombre = nombreValido,
            puntuacion = scoreEntero,
            esMultiplataforma = esMulti
        )
    }

    fun main() {
        val dtosDeRed = listOf(
            GameDto(101L, "Elden Ring", 96.4, "Multi"),
            GameDto(null, "Juego Corrupto Sin ID", 80.0, "PC"), // Inválido: ID null
            GameDto(102L, "Zelda BotW", 90.0, "Nintendo"),
            GameDto(103L, "Hades", 93.1, "Multiplataforma")
        )

        println("=== PIPELINE DE DATOS CLEAN ARCHITECTURE ===")
        println("DTOs recibidos de red: ${dtosDeRed.size} registros")

        // El operador mapNotNull ejecuta la transformación y descarta los nulls:
        val juegosDominio: List<Game> = dtosDeRed
            .mapNotNull { it.toDomain() }
            .sortedByDescending { it.puntuacion }

        println("Entidades de Dominio procesadas (${juegosDominio.size} juegos válidos):")
        juegosDominio.forEachIndexed { i, juego ->
            println("${i + 1}. [ID ${juego.id}] ${juego.nombre} -> ${juego.puntuacion} pts (Multiplataforma: ${juego.esMultiplataforma})")
        }
    }
    ```
