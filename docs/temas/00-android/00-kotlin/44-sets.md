# Sets en Kotlin

Un `Set` es una colección de elementos **únicos**: si añades un elemento repetido, se ignora. Igual que con las listas, Kotlin separa el `Set` de solo lectura, que se crea con `setOf()`, del `MutableSet`, que se crea con `mutableSetOf()`.

```kotlin
val numeros = setOf(1, 2, 2, 3, 3, 3)
println(numeros)      // [1, 2, 3]
println(numeros.size) // 3
```

Para eliminar los duplicados de una lista, `toSet()` la convierte en un conjunto. Si prefieres seguir teniendo una lista, usa [`distinct()`](./42-listas.md#46-distinct-y-distinctby-eliminacion-de-duplicados).

```kotlin
val votos = listOf("rojo", "azul", "rojo")
println(votos.toSet())    // [rojo, azul]
println(votos.distinct()) // [rojo, azul]
```

## Acceso a elementos de un Set

Un `Set` no tiene índices: no existe `numeros[0]`. Lo habitual es preguntar si un elemento está, con `in` o con `contains()`.

```kotlin
val numeros = setOf(1, 2, 3)
println(3 in numeros)        // true
println(numeros.contains(6)) // false
```

## Iteración sobre un Set

Se recorre con un bucle `for` o con `forEach()`. `setOf` conserva el orden de inserción.

```kotlin
val numeros = setOf(1, 2, 3)

for (numero in numeros) {
    println(numero)
}

numeros.forEach { numero ->
    println(numero)
}
```

Las [operaciones funcionales de las listas](./42-listas.md#que-metodo-uso), como `filter`, `map` o `any`, también funcionan sobre un `Set`. Eso sí, `filter` devuelve un `Set` y `map` una `List`, porque al transformar pueden aparecer repetidos.

## Modificación de elementos de un Set

`Set` no tiene métodos para modificarlo. Para eso está `mutableSetOf()`. `add()` devuelve `true` si el elemento era nuevo y `false` si ya estaba.

```kotlin
val numeros = mutableSetOf(1, 2, 3)

println(numeros.add(4)) // true
println(numeros.add(1)) // false
numeros.remove(2)
println(numeros) // [1, 3, 4]
```

Con un `Set` de solo lectura, `+` y `-` devuelven un conjunto nuevo:

```kotlin
val numeros = setOf(1, 2, 3)
println(numeros + 4) // [1, 2, 3, 4]
println(numeros - 1) // [2, 3]
println(numeros)     // [1, 2, 3]
```

## Operaciones con Sets

Son las operaciones de conjuntos de matemáticas. Las tres primeras se pueden escribir como función o de forma infija, y devuelven un `Set` nuevo.

```kotlin
val a = setOf(1, 2, 3)
val b = setOf(2, 3, 4)

println(a union b)     // [1, 2, 3, 4]
println(a intersect b) // [2, 3]
println(a subtract b)  // [1]
println(a.union(b))    // [1, 2, 3, 4]
```

| Quiero saber o calcular… | Cómo se escribe | Con `a` y `b` da |
| :--- | :--- | :--- |
| Todos los elementos de los dos | `a union b` | `[1, 2, 3, 4]` |
| Los elementos comunes | `a intersect b` | `[2, 3]` |
| Los de `a` que no están en `b` | `a subtract b` | `[1]` |
| Los que están solo en uno de los dos | `(a union b) subtract (a intersect b)` | `[1, 4]` |
| Si `a` contiene todos los de `b` | `a.containsAll(b)` | `false` |
| Si tienen algún elemento en común | `a.any { it in b }` | `true` |
| Si no tienen ninguno en común | `a.none { it in b }` | `false` |
| Si está vacío | `a.isEmpty()` | `false` |

```kotlin
val a = setOf(1, 2, 3)
val b = setOf(2, 3, 4)

println((a union b) subtract (a intersect b)) // [1, 4]
println(a.containsAll(b))                     // false
println(a.any { it in b })                    // true
println(a.none { it in b })                   // false
println(a.isEmpty())                          // false
```

`union`, `intersect` y `subtract` también funcionan sobre una lista, pero el resultado siempre es un `Set`:

```kotlin
println(listOf(1, 1, 2) union listOf(2, 3)) // [1, 2, 3]
```

!!! info "Otros lenguajes tienen más métodos"
    Kotlin no incluye métodos como `isSubset` o `symmetricDifference`, habituales en otros lenguajes. Se escriben combinando los de la tabla.
