# Clases de Datos (Data Classes) en Kotlin

En cualquier aplicación orientada a datos (como una app Android que consulta una API REST o lee una base de datos local con Room), la mayor parte de las clases representan modelos de información puros: un usuario, un videojuego, una coordenada o un producto.

En Java tradicional, implementar un modelo de datos básico (*POJO*) requería decenas de líneas de código repetitivo: atributos, constructor, métodos *getter* y *setter*, y las implementaciones manuales de `toString()`, `equals()` y `hashCode()`. Si más adelante se añadía un nuevo atributo, había que rehacer manualmente todos esos métodos.

Kotlin resuelve esto de forma revolucionaria mediante la palabra clave **`data class`**.

---

## 1. Declaración de una `data class`

Al anteponer la palabra clave `data` a la definición de una clase, el compilador de Kotlin asume que el propósito principal de esa clase es **almacenar datos** y genera automáticamente los métodos estándar de utilidad:

```kotlin
data class Videojuego(
    val id: Long,
    val titulo: String,
    val precio: Double,
    val plataforma: String = "Android"
)
```

### Instanciación de una Data Class
Para crear una instancia de una `data class`, **se invoca directamente a su constructor primario como en cualquier clase estándar** (no se utiliza la palabra `data` en la llamada):

```kotlin
fun main() {
    // Instanciación limpia y directa:
    val juego1 = Videojuego(1L, "Elden Ring", 59.99, "Multiplataforma")
    val juego2 = Videojuego(2L, "Celeste", 19.99) // Utiliza plataforma por defecto "Android"

    println(juego1) // Videojuego(id=1, titulo=Elden Ring, precio=59.99, plataforma=Multiplataforma)
}
```

---

## 2. Métodos Generados Automáticamente por el Compilador

Por cada `data class`, el compilador de Kotlin genera entre bastidores los siguientes métodos basándose exclusivamente en las propiedades declaradas en el constructor primario:

### 2.1. `toString()` Descriptivo y Legible
Genera una representación textual formateada con el nombre de la clase y el valor de cada propiedad (ideal para depuración y *logging*):
```kotlin
println(juego1) // Imprime: Videojuego(id=1, titulo=Elden Ring, precio=59.99, plataforma=Multiplataforma)
```

### 2.2. `equals()` y `hashCode()` Basados en Contenido
En Java, dos instancias distintas de la misma clase con idénticos valores se consideran diferentes (`==` o `.equals()` compara referencias de memoria por defecto). En una `data class` de Kotlin, dos objetos son iguales si sus propiedades tienen los mismos valores:

```kotlin
val a = Videojuego(1L, "Hades", 24.99)
val b = Videojuego(1L, "Hades", 24.99)

println(a == b)  // true -> Compara el contenido de los campos
println(a === b) // false -> Son instancias físicas diferentes en memoria
```

### 2.3. Métodos `componentN()` para Desestructuración
El compilador genera métodos `component1()`, `component2()`, etc., que permiten descomponer el objeto en variables individuales de forma inmediata:

```kotlin
val (idJuego, nombreJuego, coste) = juego1

println("ID: $idJuego")     // 1
println("Nombre: $nombreJuego") // Elden Ring
println("Coste: $coste €")   // 59.99
```

---

## 3. El Método `copy()` y la Inmutabilidad

Este es, con diferencia, **el superpoder más importante de las data classes en el desarrollo moderno y en Android**.

Aunque una `data class` puede tener propiedades mutables (`var`), la buena práctica universal en desarrollo móvil es **declarar todas sus propiedades como inmutables (`val`)**. 

Cuando necesitas alterar un dato, en lugar de mutar el objeto existente, utilizas el método `.copy()` para **obtener una nueva instancia idéntica pero con los campos deseados modificados**:

```kotlin
val partidaActual = Videojuego(
    id = 10L,
    titulo = "Hollow Knight",
    precio = 14.99,
    plataforma = "Android"
)

// Creamos una nueva instancia en oferta rebajando el precio a 7.49 €
val partidaEnRebajas = partidaActual.copy(precio = 7.49)

println(partidaActual.precio)   // 14.99 (Inalterado)
println(partidaEnRebajas.precio) // 7.49 (Nueva instancia generada)
```

!!! tip "¿Por qué esto es vital en Jetpack Compose?"
    En Jetpack Compose, el estado de una pantalla se modela típicamente con una `data class`:
    ```kotlin
    data class PantallaJuegoUiState(
        val cargando: Boolean = false,
        val juegos: List<Videojuego> = emptyList(),
        val mensajeError: String? = null
    )
    ```
    Cuando se descargan nuevos datos, el `ViewModel` no muta la lista existente, sino que emite una copia:
    `_uiState.update { it.copy(cargando = false, juegos = listaDescargada) }`. Compose detecta la nueva instancia y recompone la pantalla al instante.

---

## 4. Requisitos y Restricciones de las Data Classes

Para que una clase pueda ser `data class`, Kotlin exige cumplir las siguientes reglas:

1. **Constructor primario obligatorio:** Debe tener al menos un parámetro.
2. **Propiedades explícitas:** Todos los parámetros del constructor primario deben marcarse obligatoriamente como `val` o `var`.
3. **No pueden ser abstractas, abiertas ni internas:** Las `data classes` no pueden marcarse como `abstract`, `open`, `sealed` ni `inner`. (Sin embargo, sí pueden implementar interfaces y heredar de otras clases abiertas).

---

## 5. Retos Prácticos

### 🟢 Reto 1: Modelo de datos y copia (Básico)
Crea una `data class` llamada `Cancion` con `titulo: String`, `artista: String`, `duracionSegundos: Int` y `esFavorita: Boolean = false`. Instancia una canción, muestra su `toString()` por consola y utiliza `.copy()` para crear una versión marcada como favorita.

??? tip "Ver solución"
    ```kotlin
    data class Cancion(
        val titulo: String,
        val artista: String,
        val duracionSegundos: Int,
        val esFavorita: Boolean = false
    )

    fun main() {
        val tema1 = Cancion("Stairway to Heaven", "Led Zeppelin", 482)
        println("Canción original: $tema1")

        val temaFavorito = tema1.copy(esFavorita = true)
        println("Canción en favoritos: $temaFavorito")
    }
    ```

### 🟡 Reto 2: Desestructuración en bucle de datos (Intermedio)
Dada una lista de objetos `data class Coordenada(val latitud: Double, val longitud: Double, val etiqueta: String)`, recorre la lista utilizando sintaxis de desestructuración directamente dentro del bucle `for` para imprimir cada punto formateado.

??? tip "Ver solución"
    ```kotlin
    data class Coordenada(val latitud: Double, val longitud: Double, val etiqueta: String)

    fun main() {
        val puntosDeInteres = listOf(
            Coordenada(40.4168, -3.7038, "Madrid"),
            Coordenada(41.3879, 2.16992, "Barcelona"),
            Coordenada(37.3891, -5.9845, "Sevilla")
        )

        // Desestructuración directa en el bucle:
        for ((lat, lon, ciudad) in puntosDeInteres) {
            println("Ciudad: $ciudad -> Coordenadas: [$lat, $lon]")
        }
    }
    ```
