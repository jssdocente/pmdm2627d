# Listas y Operaciones Funcionales en Kotlin

Las listas son la estructura de datos más utilizada en el desarrollo de aplicaciones. A diferencia de Java (donde la interfaz `java.util.List` contiene métodos de mutación como `add()` y `remove()`), Kotlin separa de forma tajante las listas en **dos interfaces diferenciadas**:

1. **`List<T>`:** Colección ordenada de **solo lectura (inmutable)**. No contiene métodos para añadir, eliminar o modificar elementos.

2. **`MutableList<T>`:** Colección ordenada **modificable (mutable)**. Dispone de métodos como `add()`, `remove()`, `clear()`, etc.

---

## 1. Creación de Listas: `listOf()` vs `mutableListOf()`

```kotlin
// 1. Lista de solo lectura (inmutable)
val consolas = listOf("PlayStation 5", "Nintendo Switch", "Xbox Series X")
// consolas.add("Steam Deck") // ERROR de compilación: add() no existe en List

// 2. Lista modificable (mutable)
val inventario = mutableListOf("Poción", "Antídoto")
inventario.add("Espada de Hierro") // Válido
inventario.removeAt(0)             // Elimina "Poción"
```

!!! tip "¿Arrays primitivos o Listas?"
    En Kotlin no existen tipos especiales como *IntList*. Si necesitas rendimiento numérico extremo a nivel de hardware (evitando el *boxing* en la JVM), utiliza arrays primitivos como **`IntArray`** (`intArrayOf(1, 2, 3)`). Para el 99% de las aplicaciones Android y modelos de datos de Compose, la recomendación estándar es usar **`List<T>`**.

---

## 2. Acceso y Recorrido de Elementos

Se puede acceder a los elementos mediante el operador de indexación `[indice]` o con métodos seguros ante índices fuera de rango:

```kotlin
val juegos = listOf("Mario Odyssey", "Metroid Dread", "Zelda BotW")

// Acceso directo por índice (lanza IndexOutOfBoundsException si no existe)
val primerJuego = juegos[0]

// Acceso seguro: devuelve null si el índice no existe
val juegoInexistente = juegos.getOrNull(10) // null (sin excepciones)

// Recorrido convencional con bucle for:
for (juego in juegos) {
    println("Título: $juego")
}

// Recorrido con índice y valor desestructurado:
for ((indice, juego) in juegos.withIndex()) {
    println("Posición #$indice -> $juego")
}
```

---

## 3. Inmutabilidad y Adición Funcional de Elementos (`+`)

¿Cómo añadimos un elemento si estamos trabajando con una lista inmutable `List<T>`? 

En lugar de mutar la lista original, Kotlin ofrece el operador **`+`**, que **crea y devuelve una nueva lista inmutable que contiene todos los elementos originales más el nuevo**:

```kotlin
val listaOriginal: List<String> = listOf("Kotlin", "Android")

// Se genera una nueva lista con 3 elementos; la original queda intacta
val listaActualizada: List<String> = listaOriginal + "Jetpack Compose"

println("Original: $listaOriginal")       // [Kotlin, Android]
println("Actualizada: $listaActualizada") // [Kotlin, Android, Jetpack Compose]
```

!!! info "Clave para Jetpack Compose"
    Esta técnica de derivar una nueva lista con `+` (o `filter`) en lugar de mutar una `MutableList` interna es la forma recomendada en los ViewModels de Android para que Compose detecte cambios en listas de elementos visualizados con `LazyColumn`.

---

## 4. Operaciones Funcionales Imprescindibles

La biblioteca estándar de Kotlin cuenta con un riquísimo catálogo de funciones de extensión para transformar y consultar listas sin necesidad de escribir bucles manuales.

### ¿Qué método uso? {#que-metodo-uso}

| Quiero… | Método | Devuelve |
| :--- | :--- | :--- |
| Transformar cada elemento | [`map`](#41-map-transformacion-elemento-a-elemento), [`mapIndexed`](#411-mapindexed), [`mapNotNull`](#412-filtrar-mas) | `List<R>` |
| Quedarme con algunos elementos | [`filter`](#42-filter-filtrado-por-condicion), [`filterNot`, `filterNotNull`](#412-filtrar-mas) | `List<T>` |
| Separar los que cumplen y los que no | [`partition`](#48-partition-bifurcacion-en-dos-listas-simultaneas) | `Pair<List<T>, List<T>>` |
| Encontrar un elemento | [`find`, `firstOrNull`, `first`](#413-first-firstornull-last) | `T?` o `T` |
| Saber si alguno, todos o ninguno cumple | [`any`, `all`](#43-busqueda-y-verificacion-find-any-all), [`none`](#413-first-firstornull-last) | `Boolean` |
| Ordenar | [`sortedBy`, `sortedByDescending`, `sorted`, `sortedWith`](#410-ordenar) | `List<T>` |
| Quitar repetidos | [`distinct`, `distinctBy`](#46-distinct-y-distinctby-eliminacion-de-duplicados) | `List<T>` |
| Los primeros o los últimos | [`take`, `drop`, `takeLast`](#47-take-y-drop-seleccion-y-descarte-por-cantidad) | `List<T>` |
| Aplanar listas anidadas | [`flatMap`, `flatten`](#45-flatmap-aplanando-colecciones-anidadas) | `List<R>` |
| Trocear en bloques | [`chunked`, `windowed`](#416-chunked-windowed) | `List<List<T>>` |
| Emparejar dos listas | [`zip`, `unzip`](#417-zip-unzip) | `List<Pair<A, B>>` |
| Un solo número: suma, media, máximo, recuento | [`sumOf`, `average`, `maxByOrNull`, `count`](#49-operaciones-de-agregacion-sumof-maxbyornull-count-average) | Un número o `T?` |
| Un solo valor acumulado a mi manera | [`fold`, `reduce`](#415-fold-reduce) | `R` o `T` |
| Un texto con todos los elementos | [`joinToString`](#418-jointostring) | `String` |
| Otro tipo de colección | [`toSet`, `toMutableList`](#419-convertir) | `Set<T>`, `MutableList<T>` |
| **Un `Map`:** buscar por clave, agrupar o contar | [`associateBy`, `groupBy`, `eachCount`…](./43-maps.md#que-metodo-uso) | `Map<K, V>` |

### 4.1. `map`: Transformación elemento a elemento
Aplica una función a cada elemento y produce una nueva lista con los resultados:

```kotlin
val precios = listOf(10.0, 20.0, 50.0)
val mitadDePrecio = precios.map { it / 2 }
println(mitadDePrecio) // [5.0, 10.0, 25.0]
```

### 4.2. `filter`: Filtrado por condición
Devuelve una nueva lista con únicamente los elementos que cumplan el predicado booleano:

```kotlin
val numeros = listOf(1, 2, 3, 4, 5, 6, 7, 8)
val pares = numeros.filter { it % 2 == 0 }
println(pares) // [2, 4, 6, 8]
```

### 4.3. Búsqueda y Verificación: `find`, `any`, `all`
```kotlin
val nombres = listOf("Ana", "Mateo", "Carlos", "Beatriz")

// 'find': Devuelve el primer elemento que cumple la condición, o null
val primerNombreConC = nombres.find { it.startsWith("C") } // "Carlos"

// 'any': Devuelve true si al menos un elemento cumple la condición
val hayNombresLargos = nombres.any { it.length > 6 } // true (Beatriz)

// 'all': Devuelve true si TODOS los elementos cumplen la condición
val todosTienenMasDeDosLetras = nombres.all { it.length > 2 } // true
```

### 4.4. Agrupación y Ordenación: `groupBy` y `sortedBy`
```kotlin
data class Producto(val nombre: String, val categoria: String, val precio: Double)

val catalogo = listOf(
    Producto("Mando Pro", "Accesorios", 69.99),
    Producto("Auriculares Gaming", "Audio", 89.99),
    Producto("Funda Switch", "Accesorios", 19.99),
    Producto("Altavoces", "Audio", 45.0)
)

// Ordenar por precio ascendente
val ordenados = catalogo.sortedBy { it.precio }

// Agrupar en un Map por categoría:
val porCategoria = catalogo.groupBy { it.categoria }
println(porCategoria["Accesorios"]?.map { it.nombre }) // [Mando Pro, Funda Switch]
```

`groupBy` devuelve un `Map`, no una lista. En [Maps](./43-maps.md#groupby) está explicado con más detalle, junto con cómo [resumir cada grupo con `mapValues`](./43-maps.md#groupby-mapvalues) y [contar con `eachCount`](./43-maps.md#groupingby-eachcount).

### 4.5. `flatMap`: Aplanando colecciones anidadas
Cuando cada elemento contiene a su vez una lista (relaciones 1 a N) y deseas obtener una única lista plana con todos los elementos combinados:

```kotlin
data class Desarrollador(val nombre: String, val habilidades: List<String>)

val equipo = listOf(
    Desarrollador("Lucía", listOf("Kotlin", "Compose")),
    Desarrollador("Marcos", listOf("Kotlin", "Corrutinas", "Room")),
    Desarrollador("Elena", listOf("Figma", "Compose"))
)

// flatMap transforma cada elemento en una colección y concatena los resultados
val todasHabilidades = equipo.flatMap { it.habilidades }
println(todasHabilidades)
// [Kotlin, Compose, Kotlin, Corrutinas, Room, Figma, Compose]
```

Si ya tienes una lista de listas, `flatten()` hace lo mismo sin lambda:

```kotlin
println(listOf(listOf(1, 2), listOf(3)).flatten()) // [1, 2, 3]
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/colecciones/lista-map-flatmap-flatten.svg"
<figcaption>Con <code>map</code>, cada desarrollador aporta su lista y el resultado es una lista de listas. <code>flatMap</code> concatena esas listas en una sola. <code>flatten</code> hace solo la parte de concatenar.</figcaption>
</figure>

### 4.6. `distinct` y `distinctBy`: Eliminación de duplicados
```kotlin
// Elimina valores idénticos repetidos:
val habilidadesUnicas = todasHabilidades.distinct()
println(habilidadesUnicas) // [Kotlin, Compose, Corrutinas, Room, Figma]

// Elimina duplicados basándose en una propiedad clave del objeto:
val productosSinDuplicados = catalogo.distinctBy { it.categoria }
```

### 4.7. `take` y `drop`: Selección y descarte por cantidad
Ideales para paginación o para obtener los primeros o últimos puestos de una clasificación:

```kotlin
val puntuaciones = listOf(100, 95, 88, 70, 65, 40)

val podio = puntuaciones.take(3)        // [100, 95, 88] (Primeros 3)
val resto = puntuaciones.drop(3)        // [70, 65, 40] (Descarta los 3 primeros)
val ultimos = puntuaciones.takeLast(2)  // [65, 40] (Últimos 2)
val aprobados = puntuaciones.takeWhile { it >= 50 } // [100, 95, 88, 70, 65]
```

### 4.8. `partition`: Bifurcación en dos listas simultáneas
Divide la colección en un par (`Pair<List<T>, List<T>>`) en una sola pasada: los que cumplen la condición (`first`) y los que no (`second`):

```kotlin
val notas = listOf(4.5, 7.0, 9.2, 3.8, 6.0)
val (aprobadosList, suspensosList) = notas.partition { it >= 5.0 }

println("Aprobados: $aprobadosList") // [7.0, 9.2, 6.0]
println("Suspensos: $suspensosList") // [4.5, 3.8]
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/colecciones/lista-partition.svg"
<figcaption><code>partition</code> devuelve un <code>Pair</code> con dos listas. La desestructuración <code>val (a, b)</code> guarda <code>first</code> en la primera variable y <code>second</code> en la segunda.</figcaption>
</figure>

### 4.9. Operaciones de Agregación: `sumOf`, `maxByOrNull`, `count`, `average`
```kotlin
val precios = listOf(19.99, 49.99, 9.99)

val totalGastado = precios.sumOf { it }          // 79.97
val precioMedio = precios.average()             // 26.656666666666666
val articulosCaros = precios.count { it > 20 }   // 1
val masCaro = catalogo.maxByOrNull { it.precio } // Producto con precio más alto
val masBarato = catalogo.minByOrNull { it.precio } // Producto con precio más bajo
val precioMaximo = catalogo.maxOf { it.precio }  // 89.99 (el valor, no el producto)
```

### 4.10. Ordenar: `sorted`, `sortedByDescending` y `sortedWith` {#410-ordenar}

Ninguna modifica la lista original: todas devuelven una lista nueva.

```kotlin
val numeros = listOf(3, 1, 2)
println(numeros.sorted())           // [1, 2, 3]
println(numeros.sortedDescending()) // [3, 2, 1]

val palabras = listOf("bb", "a", "ccc")
println(palabras.sortedBy { it.length })           // [a, bb, ccc]
println(palabras.sortedByDescending { it.length }) // [ccc, bb, a]
```

Para ordenar por varios criterios, `sortedWith` con `compareBy`: el segundo criterio decide cuando hay empate en el primero. `compareByDescending` y `thenByDescending` ordenan de mayor a menor.

```kotlin
val palabras = listOf("bb", "a", "ab")
println(palabras.sortedWith(compareBy({ it.length }, { it }))) // [a, ab, bb]
println(palabras.sortedWith(compareByDescending<String> { it.length }.thenBy { it }))
// [ab, bb, a]
```

### 4.11. `mapIndexed` y `forEachIndexed`: con el índice {#411-mapindexed}

Son `map` y `forEach` con la posición de cada elemento como primer parámetro de la lambda:

```kotlin
val nombres = listOf("Ana", "Luis")

println(nombres.mapIndexed { i, nombre -> "${i + 1}. $nombre" })
// [1. Ana, 2. Luis]

nombres.forEachIndexed { i, nombre ->
    println("$i: $nombre")
}
```

### 4.12. `filterNot`, `filterNotNull` y `mapNotNull`: filtrar con más precisión {#412-filtrar-mas}

```kotlin
val numeros = listOf(1, 2, 3, 4)
println(numeros.filterNot { it % 2 == 0 }) // [1, 3]

val conNulos: List<String?> = listOf("Ana", null, "Luis")
println(conNulos.filterNotNull()) // [Ana, Luis]

val textos = listOf("1", "dos", "3")
println(textos.mapNotNull { it.toIntOrNull() }) // [1, 3]
```

`filterNotNull` cambia el tipo de `List<String?>` a `List<String>`. `mapNotNull` transforma y descarta a la vez los resultados `null`, en un solo paso.

### 4.13. `first`, `firstOrNull`, `last` y `none` {#413-first-firstornull-last}

```kotlin
val numeros = listOf(1, 2, 3, 4)

println(numeros.first())                 // 1
println(numeros.last())                  // 4
println(numeros.first { it > 2 })        // 3
println(numeros.firstOrNull { it > 10 }) // null
println(numeros.none { it > 10 })        // true
```

`first` lanza `NoSuchElementException` si no encuentra nada, y `firstOrNull` devuelve `null`. `find` es otro nombre para `firstOrNull` con condición. `none` es lo contrario de `any`.

### 4.14. Qué pasa con una lista vacía {#414-lista-vacia}

Muchos fallos vienen de aquí, así que conviene saberlo:

```kotlin
val vacia = emptyList<Int>()

println(vacia.sum())              // 0
println(vacia.average())          // NaN
println(vacia.maxByOrNull { it }) // null
println(vacia.firstOrNull())      // null
println(vacia.all { it > 0 })     // true
println(vacia.any { it > 0 })     // false
```

`first()` y `reduce` lanzan una excepción con una lista vacía.

### 4.15. `fold` y `reduce`: acumular a tu manera {#415-fold-reduce}

Cuando `sumOf` o `count` no bastan, estas dos recorren la lista y combinan cada elemento con un **acumulador**.

```kotlin
val numeros = listOf(1, 2, 3)

println(numeros.reduce { acumulado, n -> acumulado + n })    // 6
println(numeros.fold(100) { acumulado, n -> acumulado + n }) // 106
println(numeros.fold("") { texto, n -> texto + n })          // 123
```

| | `reduce` | `fold` |
| :--- | :--- | :--- |
| **Valor inicial** | El primer elemento | El que le pases |
| **Tipo del resultado** | El de los elementos | El del valor inicial, que puede ser otro |
| **Con una lista vacía** | Lanza una excepción | Devuelve el valor inicial |

Por eso `fold` es la opción más segura. Así funciona paso a paso `fold(100)`: `100 + 1 = 101`, `101 + 2 = 103` y `103 + 3 = 106`.

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/colecciones/lista-reduce-fold.svg"
<figcaption>Cada flecha es una vuelta de la lambda: recibe el acumulado y el elemento, y lo que devuelve es el acumulado de la vuelta siguiente. Solo cambia el punto de partida.</figcaption>
</figure>

### 4.16. `chunked` y `windowed`: trocear en bloques {#416-chunked-windowed}

`chunked` parte la lista en bloques sin solaparse, y `windowed` desliza una ventana sobre ella:

```kotlin
val numeros = listOf(1, 2, 3, 4, 5)

println(numeros.chunked(2))                   // [[1, 2], [3, 4], [5]]
println(numeros.windowed(3))                  // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
println(numeros.windowed(size = 2, step = 2)) // [[1, 2], [3, 4]]
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/colecciones/lista-chunked-windowed.svg"
<figcaption>Cada barra es una de las listas del resultado, colocada bajo los elementos que contiene.</figcaption>
</figure>

`chunked` sirve para paginar, y `windowed` para calcular medias móviles. Observa que el último bloque de `chunked` puede ser más corto, mientras que `windowed` descarta las ventanas incompletas.

### 4.17. `zip` y `unzip`: emparejar listas {#417-zip-unzip}

`zip` empareja dos listas por posición y se detiene al acabarse la más corta. `unzip` hace lo contrario.

```kotlin
val nombres = listOf("Ana", "Luis", "Eva")
val notas = listOf(8, 4)

println(nombres.zip(notas))         // [(Ana, 8), (Luis, 4)]
println(nombres.zip(notas).toMap()) // {Ana=8, Luis=4}

val (izquierda, derecha) = listOf("a" to 1, "b" to 2).unzip()
println(izquierda) // [a, b]
println(derecha)   // [1, 2]
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/colecciones/lista-zip.svg"
<figcaption><code>zip</code> junta el primero con el primero, el segundo con el segundo… Cada par puede convertirse después en una entrada de mapa con <code>toMap()</code>.</figcaption>
</figure>

### 4.18. `joinToString`: de lista a texto {#418-jointostring}

```kotlin
val nombres = listOf("Ana", "Luis")

println(nombres.joinToString())                  // Ana, Luis
println(nombres.joinToString(" | "))             // Ana | Luis
println(nombres.joinToString(" y ") { "- $it" }) // - Ana y - Luis
println(nombres.joinToString(prefix = "[", postfix = "]") { it.uppercase() })
// [ANA, LUIS]
```

La lambda transforma cada elemento antes de unirlo, así que no necesitas un `map` previo.

### 4.19. Convertir entre colecciones {#419-convertir}

Cada `toX()` crea una colección nueva, sin cambiar la original:

```kotlin
val numeros = listOf(1, 1, 2)

println(numeros.toSet())             // [1, 2]
println(numeros.toMutableList() + 3) // [1, 1, 2, 3]
println(setOf(1, 2).toList())        // [1, 2]
println(listOf("a" to 1).toMap())    // {a=1}
```

Para pasar de una lista a un `Map` calculando las claves, consulta [Maps](./43-maps.md#de-lista-a-map), y para el camino inverso, [de un `Map` a una lista](./43-maps.md#de-map-a-lista).

---

## 5. Programación Fluent: Pipelines de Transformación Encadenados

La **programación Fluent** (o interfaz fluida mediante *Method Chaining*) es un estilo de diseño donde las operaciones se encadenan consecutivamente con puntos (`.`). Cada función toma el resultado de la anterior, lo transforma y produce una nueva colección, permitiendo leer el código de izquierda a derecha o de arriba abajo como si fuera una frase en lenguaje natural.

### Comparativa: Enfoque Imperativo Tradicional vs. Pipeline Fluent

Imagina que de una lista de videojuegos queremos:

1. Filtrar solo los juegos de rol ("RPG").

2. Ordenarlos por puntuación de mayor a menor.

3. Extraer solo los títulos en mayúsculas de los 3 mejores.

=== "Estilo Imperativo Tradicional (Bucles e Índices)"
    ```kotlin
    // Muy propenso a errores, código extenso y variables mutables intermedias
    val topTitulos = mutableListOf<String>()
    val rpgs = mutableListOf<Videojuego>()
    
    for (juego in biblioteca) {
        if (juego.genero == "RPG") {
            rpgs.add(juego)
        }
    }
    
    rpgs.sortByDescending { it.puntuacion }
    
    val limite = if (rpgs.size < 3) rpgs.size else 3
    for (i in 0 until limite) {
        topTitulos.add(rpgs[i].titulo.uppercase())
    }
    ```

=== "Estilo Declarativo Fluent (Pipeline Encadenado)"
    ```kotlin
    // Limpio, inmutable, conciso y autodocumentado:
    val topTitulos = biblioteca
        .filter { it.genero == "RPG" }
        .sortedByDescending { it.puntuacion }
        .take(3)
        .map { it.titulo.uppercase() }
    ```

El pipeline Fluent describe **qué** queremos obtener en cada paso en lugar de cómo gestionar punteros, bucles o listas temporales.

---

## 6. Listas Impacientes (*Eager*) vs. Secuencias Perezosas (*Lazy Sequences*)

Aunque los pipelines encadenados con listas son extremadamente cómodos y elegantes, ocultan un **coste computacional invisible** que es vital comprender a fondo en desarrollo móvil.

### El Problema de las Listas Estándar: Evaluación Impaciente (*Eager*)

En Kotlin, las funciones de transformación sobre `List<T>` se ejecutan de forma **impaciente (*eager*)** y **horizontal (por etapas completas)**:

- Cada vez que llamas a `.filter { ... }`, Kotlin recorre la lista completa y **crea una nueva `List` intermedia en memoria RAM**.
- Cuando a continuación llamas a `.map { ... }`, Kotlin vuelve a recorrer la lista completa anterior y crea **otra nueva `List` intermedia en memoria RAM**.
- Si tu colección tiene 100.000 elementos y encadenas 4 operaciones, estás creando y tirando a la basura **3 listas intermedias gigantescas**, consumiendo memoria del smartphone y saturando el recolector de basura (*Garbage Collector*).

```mermaid
flowchart TD
    subgraph Eager["Evaluación Impaciente (List): Procesamiento Horizontal"]
        direction TB
        L0["Lista Original: [1, 2, 3, 4, 5, 6, 7, 8]"] -->|"1. Filtra TODOS los pares"| L1["Lista Intermedia 1: [2, 4, 6, 8] (Crea objeto en RAM)"]
        L1 -->|"2. Multiplica TODOS por 10"| L2["Lista Intermedia 2: [20, 40, 60, 80] (Crea objeto en RAM)"]
        L2 -->|"3. take(2) toma los 2 primeros"| L3["Resultado Final: [20, 40]"]
    end
```

### La Solución: `Sequence<T>` (Los Streams Perezosos de Kotlin)

Una **`Sequence<T>`** evalúa las operaciones de forma **perezosa (*lazy*)** y **vertical (elemento a elemento)**:

- Cada elemento recorre el pipeline completo **de principio a fin antes de que el siguiente elemento comience a procesarse**.
- **No se crean colecciones intermedias en memoria RAM**.
- Si una operación final (como `take(2)`) ya ha conseguido los elementos necesarios, **el pipeline se detiene de inmediato (*short-circuiting*)**, ahorrando procesar el resto de la colección.

```mermaid
flowchart LR
    subgraph Lazy["Evaluación Perezosa (Sequence): Procesamiento Vertical"]
        direction TB
        E1["Elemento 1"] -->|"filter: ¿Es par? NO"| D1["Descartado (No avanza)"]
        E2["Elemento 2"] -->|"filter: SÍ"| M2["map: 2 * 10 = 20"] --> T2["take: Aceptado 1/2"]
        E3["Elemento 3"] -->|"filter: ¿Es par? NO"| D3["Descartado (No avanza)"]
        E4["Elemento 4"] -->|"filter: SÍ"| M4["map: 4 * 10 = 40"] --> T4["take: Aceptado 2/2 -> ¡ALTO!"]
        E5["Elementos 5 al 8"] -.->|"¡Ni siquiera se tocan ni se evalúan!"| Fin["Fin de ejecución"]
    end
```

### El Experimento de los `println()`: La Prueba Irrefutable

Para ver con tus propios ojos cómo se comporta cada modelo, ejecuta este código y observa la salida en consola:

=== "Con Lista Estándar (Impaciente)"
    ```kotlin
    val numeros = listOf(1, 2, 3, 4, 5, 6, 7, 8)

    val resultado = numeros
        .filter { 
            println("  [List Filter]: $it")
            it % 2 == 0 
        }
        .map { 
            println("  [List Map]: $it")
            it * 10 
        }
        .take(2)

    println("Resultado: $resultado")
    ```
    
    **Salida en Consola:**
    ```text
      [List Filter]: 1
      [List Filter]: 2
      [List Filter]: 3
      [List Filter]: 4
      [List Filter]: 5
      [List Filter]: 6
      [List Filter]: 7
      [List Filter]: 8
      [List Map]: 2
      [List Map]: 4
      [List Map]: 6
      [List Map]: 8
    Resultado: [20, 40]
    ```
    *(Observa cómo filtró los 8 números y multiplicó los 4 números pares, para luego quedarse únicamente con 2).*

=== "Con Secuencia (Perezosa con .asSequence())"
    ```kotlin
    val numeros = listOf(1, 2, 3, 4, 5, 6, 7, 8)

    val resultado = numeros
        .asSequence() // Convertimos a evaluación perezosa (Stream)
        .filter { 
            println("  [Sequence Filter]: $it")
            it % 2 == 0 
        }
        .map { 
            println("  [Sequence Map]: $it")
            it * 10 
        }
        .take(2)
        .toList() // Operador terminal que solicita los datos

    println("Resultado: $resultado")
    ```
    
    **Salida en Consola:**
    ```text
      [Sequence Filter]: 1
      [Sequence Filter]: 2
      [Sequence Map]: 2
      [Sequence Filter]: 3
      [Sequence Filter]: 4
      [Sequence Map]: 4
    Resultado: [20, 40]
    ```
    *(¡Magia! En cuanto procesó el número 4, `take(2)` quedó satisfecho y la ejecución terminó. Los números 5, 6, 7 y 8 ni se filtraron ni se tocaron).*

### Operadores Intermedios vs. Operadores Terminales

En una secuencia existen dos clases de operadores:

1. **Operadores Intermedios (Perezosos):**

   - Devuelven otra `Sequence<T>`.
   - **No realizan ningún cómputo inmediatamente**: simplemente construyen la receta de cómo se transformará el dato cuando se le pida.
   - Ejemplos: `filter`, `map`, `take`, `drop`, `distinct`, `sortedBy`.

2. **Operadores Terminales (Ejecutores):**

   - Son los que "tiran de la cuerda" y desencadenan la evaluación elemento a elemento a lo largo de toda la cadena.
   - Devuelven un resultado cerrado (una lista, un número, un booleano o nada).
   - Ejemplos: `toList()`, `toSet()`, `first()`, `find()`, `count()`, `sumOf()`, `forEach()`.

!!! warning "Sin operador terminal no hay ejecución"
    Si escribes `val sec = miLista.asSequence().map { it * 2 }` y nunca invocas un operador terminal como `.toList()` o `.forEach()`, el bloque de código del `map` **nunca llegará a ejecutarse**.

### Equivalencias: Kotlin `Sequence` frente a Java `Stream`

Si ya conoces la API de Streams de Java (de 1º de DAM o *Acceso a Datos*), `Sequence` es su equivalente directo en Kotlin:

| Operación | Java Stream (`java.util.stream.Stream`) | Kotlin Sequence (`kotlin.sequences.Sequence`) |
| :--- | :--- | :--- |
| **Iniciar Stream** | `lista.stream()` | `lista.asSequence()` |
| **Filtrar** | `.filter(x -> x > 0)` | `.filter { it > 0 }` |
| **Mapear** | `.map(x -> x * 2)` | `.map { it * 2 }` |
| **Limitar cantidad** | `.limit(5)` | `.take(5)` |
| **Omitir elementos** | `.skip(3)` | `.drop(3)` |
| **Eliminar duplicados**| `.distinct()` | `.distinct()` o `.distinctBy { it.id }` |
| **Aplanar listas** | `.flatMap(x -> x.getHijos().stream())` | `.flatMap { it.hijos }` |
| **Cerrar a Lista** | `.collect(Collectors.toList())` | `.toList()` |

### ¿Cuándo usar `List` y cuándo usar `Sequence`?

| Criterio | Usar Lista Estándar (`List<T>`) | Usar Secuencia (`Sequence<T>`) |
| :--- | :--- | :--- |
| **Tamaño de la colección** | Pequeña o mediana (**< 1.000 elementos**). | Grande (**> 10.000 elementos**) o desconocida. |
| **Longitud del pipeline** | 1 o 2 operaciones (ej. solo un `filter`). | 3 o más operaciones encadenadas en la misma pasada. |
| **Operaciones con corte** | Raras veces necesario. | Esenciales: `first()`, `find()`, `take(n)`. |
| **Sobrecoste (Overhead)** | Muy bajo en colecciones cortas. | El coste de crear el objeto `Sequence` se amortiza en colecciones grandes. |
| **Contexto típico** | **UI y Jetpack Compose** (listas de pantalla paginadas). | **Procesamiento de ficheros, exportaciones o analítica**. |

### El Puente Hacia `Flow`: De Streams Síncronos a Reactivos

- **`List<T>`**: Colección estática en memoria. Fluent e impaciente.
- **`Sequence<T>`**: Stream síncrono perezoso en CPU. Procesa elemento a elemento bajo demanda pero bloquea el hilo si una operación tarda.
- **`Flow<T>`**: Stream asíncrono y reactivo. La versión con corrutinas de `Sequence`: procesa elemento a elemento a lo largo del tiempo sin bloquear jamás el hilo principal.

---

## 7. Retos Prácticos

### 🟢 Reto 1: Transformación de nombres (Básico)
Dada una lista `listOf("juan", "maría", "pedro")`, utiliza `map` para obtener una nueva lista donde cada nombre tenga la primera letra en mayúscula (`replaceFirstChar { it.uppercase() }`).

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val nombres = listOf("juan", "maría", "pedro")
        val capitalizados = nombres.map { it.replaceFirstChar { c -> c.uppercase() } }
        println(capitalizados) // [Juan, María, Pedro]
    }
    ```

### 🟡 Reto 2: Filtrado y agregación de biblioteca de juegos (Intermedio)
Dada una lista de videojuegos con sus horas de duración `val partidas = listOf("Hades" to 65, "Celeste" to 15, "Witcher 3" to 120, "Inside" to 4)`, filtra los juegos de más de 20 horas y calcula el promedio de duración de esos juegos largos.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val partidas = listOf(
            "Hades" to 65,
            "Celeste" to 15,
            "Witcher 3" to 120,
            "Inside" to 4
        )

        val juegosLargos = partidas.filter { it.second > 20 }
        val promedio = juegosLargos.map { it.second }.average()

        println("Juegos largos: $juegosLargos")
        println("Promedio de horas: $promedio horas")
    }
    ```

### 🔴 Reto 3: Optimización de Gran Volumen con Secuencias y Cortocircuito (Avanzado)
Genera una secuencia infinita o un rango de 1 a 1.000.000 de números. Utiliza un pipeline Fluent para:

1. Filtrar solo los números divisibles por 7.

2. Transformar cada número elevándolo al cuadrado.

3. Tomar únicamente los primeros 5 resultados.

4. Convertir el resultado a una `List<Long>` final e imprimirlo.

Comprueba que el cálculo es instantáneo gracias a la evaluación perezosa y el cortocircuito de `Sequence`.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        // Rango de 1 millón de elementos
        val primerosCincoCuadrados = (1..1_000_000)
            .asSequence() // ¡Clave de rendimiento! No genera listas de 1 millón de elementos
            .filter { it % 7 == 0 }
            .map { it.toLong() * it.toLong() }
            .take(5)
            .toList()

        println("Primeros 5 múltiplos de 7 al cuadrado: $primerosCincoCuadrados")
        // Salida: [49, 196, 441, 784, 1225]
    }
    ```

---

!!! tip "Practícalo en el codelab"

    Pon en práctica este tema con tests que te corrigen al momento: [Codelab de Kotlin, Paso 3](./codelabs/03-colecciones-maps.md).
