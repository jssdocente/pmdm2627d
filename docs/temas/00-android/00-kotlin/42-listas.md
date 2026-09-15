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

La biblioteca estándar de Kotlin cuenta con un riquísimo catálogo de funciones de extensión para transformar y consultar listas sin necesidad de escribir bucles manuales:

### 4.1. `map`: Transformación elemento a elemento
Aplica una función a cada elemento y produce una nueva lista con los resultados:

```kotlin
val preciosDolares = listOf(10.0, 20.0, 50.0)
val preciosEuros = preciosDolares.map { it * 0.92 }
println(preciosEuros) // [9.2, 18.4, 46.0]
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
println(porCategoria["Accesorios"]) // Lista con Mando Pro y Funda Switch
```

---

## 5. Retos Prácticos

### 🟢 Reto 1: Transformación de nombres (Básico)
Dada una lista `listOf("juan", "maría", "pedro")`, utiliza `map` para obtener una nueva lista donde cada nombre tenga la primera letra en mayúscula (`capitalize()` / `replaceFirstChar { it.uppercase() }`).

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
