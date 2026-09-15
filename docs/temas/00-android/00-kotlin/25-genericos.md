# Genéricos en Kotlin (Generics)

Los **genéricos** permiten definir clases, interfaces y funciones con **parámetros de tipo**, haciendo que el código sea reutilizable, flexible y estricto respecto a la seguridad de tipos (*Type Safety*), evitando los peligrosos casteos manuales en tiempo de ejecución.

Como estudiantes de 2º DAM, ya conocéis los genéricos en Java (`List<String>`, `ArrayList<T>`). Kotlin comparte esa misma base pero introduce mejoras sustanciales, especialmente en el manejo de la **varianza de tipos** en el sitio de declaración (*Declaration-Site Variance* con `out` e `in`).

---

## 1. Clases Genéricas

Para crear una clase genérica, se especifica uno o más parámetros de tipo entre corchetes angulares `<>` tras el nombre de la clase:

```kotlin
// 'T' representa un tipo genérico que se concretará al instanciar la clase
class Caja<T>(val contenido: T) {
    fun obtenerContenido(): T {
        return contenido
    }
}

fun main() {
    // El compilador infiere los tipos automáticamente a partir del argumento:
    val cajaNumero = Caja(42)            // Tipo inferido: Caja<Int>
    val cajaTexto = Caja("Elden Ring")   // Tipo inferido: Caja<String>

    val valorNumero: Int = cajaNumero.obtenerContenido()
    val valorTexto: String = cajaTexto.obtenerContenido()

    println("Caja numérica: $valorNumero | Caja textual: $valorTexto")
}
```

---

## 2. Funciones Genéricas

Las funciones también pueden declarar sus propios parámetros de tipo antes del nombre de la función:

```kotlin
fun <T> imprimirElemento(etiqueta: String, elemento: T) {
    println("[$etiqueta]: $elemento (Tipo: ${elemento?.let { it::class.simpleName } ?: "Null"})")
}

fun main() {
    imprimirElemento("PUNTUACION", 9500)
    imprimirElemento("USUARIO", "Admin")
    imprimirElemento("FLAG", true)
}
```

---

## 3. Restricciones de Tipo (*Upper Bounds*)

A veces no deseamos aceptar absolutamente cualquier tipo (`Any?`), sino restringir el tipo genérico a una familia concreta de clases que cumplan una condición o implementen una interfaz.

Para ello se utiliza la sintaxis `<T : TipoLimite>`:

```kotlin
// Restringimos 'T' para que deba ser un tipo que implemente Comparable
fun <T : Comparable<T>> obtenerMayor(a: T, b: T): T {
    return if (a > b) a else b
}

fun main() {
    // Funciona con números porque Int implementa Comparable<Int>
    println("Mayor numérico: ${obtenerMayor(15, 42)}") // 42

    // Funciona con textos porque String implementa Comparable<String> (orden alfabético)
    println("Mayor alfabético: ${obtenerMayor("Zelda", "Mario")}") // Zelda
}
```

---

## 4. Varianza en Kotlin: Covarianza (`out`) y Contravarianza (`in`)

En Java, los genéricos son invariantes (`List<String>` no es subtipo de `List<Object>`), lo que obliga a utilizar los complejos comodines de uso (*use-site variance*) como `<? extends T>` o `<? super T>`.

Kotlin simplifica esto permitiendo declarar la varianza en la propia definición de la clase o interfaz (**Declaration-Site Variance**):

### 4.1. Covarianza con `out` (Productores de datos)
Si una clase genérica **solo produce o devuelve datos de tipo `T`** (solo en posiciones de retorno, nunca como argumentos de entrada en sus métodos), se marca con **`out`**. 

Esto hace que `Contenedor<String>` sea tratado como subtipo de `Contenedor<Any>`:

```kotlin
// 'out T': T solo sale de la interfaz, nunca entra como parámetro
interface FuenteDatos<out T> {
    fun emitirDato(): T
}

class EmisorTexto : FuenteDatos<String> {
    override fun emitirDato(): String = "Datos descargados"
}

fun main() {
    val emisorEspecifico: FuenteDatos<String> = EmisorTexto()
    // ¡Permitido gracias a 'out'! FuenteDatos<String> se asigna a FuenteDatos<Any>
    val emisorGenerico: FuenteDatos<Any> = emisorEspecifico

    println(emisorGenerico.emitirDato())
}
```

### 4.2. Contravarianza con `in` (Consumidores de datos)
Si una clase genérica **solo consume datos de tipo `T`** (solo como parámetros de entrada de sus métodos, nunca como valor de retorno), se marca con **`in`**:

```kotlin
// 'in T': T solo entra a los métodos para ser consumido
interface ConsumidorLog<in T> {
    fun registrar(item: T)
}

class ImpresorGeneral : ConsumidorLog<Any> {
    override fun registrar(item: Any) {
        println("[REGISTRO]: ${item.toString()}")
    }
}

fun main() {
    val impresorGeneral: ConsumidorLog<Any> = ImpresorGeneral()
    // ¡Permitido gracias a 'in'! Un ConsumidorLog<Any> puede actuar como ConsumidorLog<String>
    val impresorTextos: ConsumidorLog<String> = impresorGeneral

    impresorTextos.registrar("Mensaje de prueba de la app")
}
```

!!! tip "Regla mnemotécnica (PECS en Kotlin)"
    - **`out` = Productor (Produce / Salida):** El tipo `T` se devuelve. Permite asignar `Subtipo` a `SuperTipo`.
    - **`in` = Consumidor (Consume / Entrada):** El tipo `T` entra como parámetro. Permite asignar `SuperTipo` a `Subtipo`.

---

## 5. Retos Prácticos

### 🟢 Reto 1: Repositorio genérico en memoria (Básico)
Crea una clase genérica `AlmacenEnMemoria<T>` que mantenga una lista interna privada `MutableList<T>` con métodos `guardar(item: T)`, `obtenerTodos(): List<T>` y `tamano(): Int`. Pruébala guardando cadenas y enteros.

??? tip "Ver solución"
    ```kotlin
    class AlmacenEnMemoria<T> {
        private val elementos = mutableListOf<T>()

        fun guardar(item: T) {
            elementos.add(item)
        }

        fun obtenerTodos(): List<T> = elementos.toList() // Retorna copia inmutable

        fun tamano(): Int = elementos.size
    }

    fun main() {
        val repoJuegos = AlmacenEnMemoria<String>()
        repoJuegos.guardar("Portal 2")
        repoJuegos.guardar("Chrono Trigger")
        println("Juegos en almacén (${repoJuegos.tamano()}): ${repoJuegos.obtenerTodos()}")
    }
    ```

### 🟡 Reto 2: Función genérica con filtro y límite (Intermedio)
Escribe una función genérica `filtrarMayoresQue<T : Comparable<T>>(lista: List<T>, umbral: T): List<T>` que reciba una lista de cualquier tipo comparable y devuelva una lista con solo los elementos estrictamente mayores que el umbral.

??? tip "Ver solución"
    ```kotlin
    fun <T : Comparable<T>> filtrarMayoresQue(lista: List<T>, umbral: T): List<T> {
        return lista.filter { it > umbral }
    }

    fun main() {
        val notas = listOf(4.5, 7.0, 9.2, 3.8, 8.0)
        val aprobadosAltos = filtrarMayoresQue(notas, 7.0)
        println("Notas superiores a 7.0: $aprobadosAltos") // [9.2, 8.0]
    }
    ```