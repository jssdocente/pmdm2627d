# Arrays en Kotlin

En Kotlin, los arrays se crean con la función `arrayOf()`. Tienen un **tamaño fijo**: no se pueden añadir ni quitar posiciones. Su contenido, en cambio, **sí se puede modificar**, aunque la variable sea `val`.

```kotlin
val numeros = arrayOf(1, 2, 3, 4, 5)
```

Si la lista de valores se calcula, `Array(n) { … }` crea un array de `n` posiciones, y la lambda recibe el índice:

```kotlin
val cuadrados = Array(4) { it * it }
println(cuadrados.joinToString()) // 0, 1, 4, 9
```

!!! tip "¿Array o lista?"
    En la mayoría de los casos usarás [`List`](./42-listas.md). Los arrays quedan para parámetros como el de `main(args: Array<String>)` o para cuando el rendimiento lo exige.

## Acceso a elementos de un array

Puedes acceder a elementos individuales de un array utilizando el operador de indexación `[]` seguido del índice del elemento que deseas acceder.

```kotlin
val numeros = arrayOf(1, 2, 3, 4, 5)
println(numeros[0]) // 1
println(numeros[1]) // 2
```

## Modificación de elementos de un array

Para modificar un elemento de un array, se usa también el operador `[]`.

```kotlin
val numeros = arrayOf(1, 2, 3, 4, 5)
numeros[0] = 10
println(numeros[0]) // 10
```

Un array es un objeto, así que asignarlo a otra variable no lo copia: las dos variables apuntan al mismo array.

```kotlin
val a = intArrayOf(1, 2, 3)
val b = a
b[0] = 99
println(a[0]) // 99
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/colecciones/array-referencia.svg"
<figcaption><code>a</code> y <code>b</code> son dos nombres para el mismo array. Si necesitas una copia independiente, usa <code>a.copyOf()</code>.</figcaption>
</figure>

## Iteración sobre un array

Puedes iterar sobre los elementos de un array utilizando un bucle `for` o la función `forEach()`.

```kotlin
val numeros = arrayOf(1, 2, 3, 4, 5)

for (numero in numeros) {
    println(numero)
}

numeros.forEach { numero ->
    println(numero)
}
```

## Arrays de tipos primitivos

`IntArray`, `DoubleArray`, `BooleanArray` y similares guardan los valores como tipos primitivos de la JVM, sin objetos de por medio, lo que mejora el rendimiento.

```kotlin
val enteros = intArrayOf(1, 2, 3, 4, 5)
val dobles = doubleArrayOf(1.0, 2.0, 3.0, 4.0, 5.0)
val booleanos = booleanArrayOf(true, false, true, false)
```

## Operaciones con arrays

Los arrays tienen `size` para obtener el tamaño, `contains` para comprobar si está un elemento e `indexOf` para obtener su posición. También admiten las [operaciones funcionales de las listas](./42-listas.md#que-metodo-uso), como `filter` o `map`, que devuelven una `List`.

```kotlin
val numeros = arrayOf(1, 2, 3, 4, 5)

println(numeros.size)                   // 5
println(numeros.contains(3))            // true
println(numeros.indexOf(4))             // 3
println(numeros.filter { it % 2 == 0 }) // [2, 4]
```

!!! warning "`println` no muestra el contenido de un array"
    `println(numeros)` imprime algo como `[Ljava.lang.Integer;@1b6d3586`, igual que en Java. Para ver el contenido usa `contentToString()` o `joinToString()`.

    ```kotlin
    val numeros = arrayOf(1, 2, 3)
    println(numeros.contentToString()) // [1, 2, 3]
    println(numeros.joinToString())    // 1, 2, 3
    ```
