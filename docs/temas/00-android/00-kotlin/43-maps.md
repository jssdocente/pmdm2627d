# Maps en Kotlin

Un `Map<K, V>` guarda **pares clave-valor**. Cada clave aparece una sola vez y lleva directamente a su valor, sin recorrer la colección. Es el equivalente al `HashMap` de Java, pero, igual que con las [listas](./42-listas.md), Kotlin separa dos interfaces:

- **`Map<K, V>`:** de solo lectura. Se crea con `mapOf()` y no tiene métodos para modificarlo.

- **`MutableMap<K, V>`:** modificable. Se crea con `mutableMapOf()`.

```kotlin
val edades = mapOf("Ana" to 20, "Luis" to 22)
println(edades) // {Ana=20, Luis=22}
```

`"Ana" to 20` crea un `Pair`, y `mapOf` usa cada par como clave y valor. El mapa conserva el orden en que se insertan las claves, y por eso las salidas de esta página salen siempre en ese orden.

---

## ¿Qué método uso? {#que-metodo-uso}

Lo primero es saber de qué partes y qué quieres obtener.

**Tengo una lista y quiero un `Map`** ([explicación](#de-lista-a-map)):

| Quiero… | Método | Devuelve |
| :--- | :--- | :--- |
| Buscar **un** elemento por su clave | [`associateBy { it.id }`](#associateby) | `Map<Int, Producto>` |
| Añadir un dato a cada elemento, que pasa a ser la clave | [`associateWith { it.length }`](#associatewith) | `Map<String, Int>` |
| Elegir yo la clave y el valor | [`associate { it.nombre to it.precio }`](#associate) | `Map<String, Double>` |
| Convertir una lista de pares | [`toMap()`](#tomap) | `Map<K, V>` |
| Repartir en **grupos** | [`groupBy { it.categoria }`](#groupby) | `Map<String, List<Producto>>` |
| **Contar** cuántos hay en cada grupo | [`groupingBy { it.categoria }.eachCount()`](#groupingby-eachcount) | `Map<String, Int>` |
| **Sumar** o resumir cada grupo | [`groupBy { … }.mapValues { … }`](#groupby-mapvalues) | `Map<String, R>` |

**Tengo un `Map` y quiero otro valor o mapa:**

| Quiero… | Método | Devuelve |
| :--- | :--- | :--- |
| Leer una clave que puede no existir | [`mapa[clave]`](#acceso-a-elementos-de-un-map) | `V?` |
| Leerla con un valor de sustitución | [`getOrDefault`, `getOrElse`](#getordefault-getorelse) | `V` |
| Leerla y guardarla si falta (solo `MutableMap`) | [`getOrPut`](#getorput) | `V` |
| Cambiar los **valores** | [`mapValues`](#mapvalues) | `Map<K, R>` |
| Cambiar las **claves** | [`mapKeys`](#mapkeys) | `Map<R, V>` |
| Quedarme con algunas entradas | [`filterKeys`, `filterValues`, `filter`](#filtrar-un-map) | `Map<K, V>` |
| Añadir o quitar sin modificar el original | [`+` y `-`](#mas-menos-map) | `Map<K, V>` |

**Tengo un `Map` y quiero una lista o un resultado:**

| Quiero… | Método | Devuelve |
| :--- | :--- | :--- |
| Solo las claves, solo los valores o las entradas | [`keys`, `values`, `entries`](#keys-values-entries) | `Set<K>`, `Collection<V>`, `Set<Entry<K, V>>` |
| Una lista de pares | [`toList()`](#de-map-a-lista) | `List<Pair<K, V>>` |
| Una lista transformada | [`map { (k, v) -> … }`](#de-map-a-lista) | `List<R>` |
| Ordenar | [`entries.sortedBy { it.value }`](#ordenar-map) | `List<Entry<K, V>>` |
| Sumar, buscar el máximo o contar | [`values.sum()`, `maxByOrNull`, `count`](#resumir-map) | Depende del método |

---

## Acceso a elementos de un Map

Con `mapa[clave]` se obtiene el valor. Si la clave no existe no hay excepción, sino `null`, y por eso el tipo devuelto es `V?`.

```kotlin
val stock = mapOf("Mando" to 3, "Funda" to 0)

println(stock["Mando"])              // 3
println(stock["Cascos"])             // null
println("Mando" in stock)            // true
println(stock.containsKey("Cascos")) // false
println(stock.containsValue(0))      // true
```

`mapa.get(clave)` es lo mismo que `mapa[clave]`. Si estás seguro de que la clave existe, `mapa.getValue(clave)` devuelve `V` y lanza `NoSuchElementException` si no está.

### `getOrDefault` y `getOrElse`: leer con un valor de sustitución {#getordefault-getorelse}

Ambas devuelven `V`, no `V?`, así que evitan comprobar el `null`.

```kotlin
val stock = mapOf("Mando" to 3)

println(stock.getOrDefault("Cascos", 0))     // 0
println(stock.getOrElse("Cascos") { 2 + 3 }) // 5
println(stock.getOrElse("Mando") { 2 + 3 })  // 3
```

- **`getOrDefault(clave, valor)`:** recibe el valor ya calculado.

- **`getOrElse(clave) { … }`:** recibe una lambda que solo se ejecuta si la clave no existe. Conviene cuando calcular el valor de sustitución cuesta.

Ninguna de las dos añade la clave al mapa. Para eso está [`getOrPut`](#getorput).

---

## Iteración sobre un Map

Un `for` puede desestructurar cada entrada en clave y valor, y `forEach` también:

```kotlin
val stock = mapOf("Mando" to 3, "Funda" to 0)

for ((producto, unidades) in stock) {
    println("$producto: $unidades")
}

stock.forEach { (producto, unidades) ->
    println("$producto: $unidades")
}
```

Los dos imprimen `Mando: 3` y `Funda: 0`.

### `keys`, `values` y `entries` {#keys-values-entries}

Son propiedades, no funciones, por eso se escriben sin paréntesis:

```kotlin
val stock = mapOf("Mando" to 3, "Funda" to 0)

println(stock.keys)    // [Mando, Funda]
println(stock.values)  // [3, 0]
println(stock.entries) // [Mando=3, Funda=0]
```

Cada elemento de `entries` es una entrada con las propiedades `key` y `value`. Es lo que recibe la lambda de casi todas las operaciones de esta página: dentro de ella, `it` es la entrada completa, no el valor.

---

## Modificación de elementos de un Map

Un `Map` no tiene métodos para modificarlo. Hay dos caminos: usar un `MutableMap` o crear otro mapa.

### Con un `MutableMap`

```kotlin
val stock = mutableMapOf("Mando" to 3)

stock["Funda"] = 5     // añade la clave
stock["Mando"] = 10    // sustituye el valor
println(stock) // {Mando=10, Funda=5}

stock.remove("Mando")
println(stock) // {Funda=5}
```

### `getOrPut`: leer y guardar si falta {#getorput}

Devuelve el valor de la clave. Si no existe, ejecuta la lambda, **guarda** el resultado en el mapa y lo devuelve. Solo está en `MutableMap`, y es la forma habitual de escribir una caché.

```kotlin
val cache = mutableMapOf<String, Int>()

println(cache.getOrPut("Mando") { 3 }) // 3
println(cache.getOrPut("Mando") { 9 }) // 3
println(cache)                         // {Mando=3}
```

La segunda llamada encuentra la clave, así que su lambda no llega a ejecutarse.

### `+` y `-`: «cambiar» un mapa creando otro {#mas-menos-map}

`+` devuelve un mapa nuevo con la clave añadida o sustituida, y `-` uno nuevo sin ella. El original queda igual, como con el [`+` de las listas](./42-listas.md#3-inmutabilidad-y-adicion-funcional-de-elementos).

```kotlin
val edades = mapOf("Ana" to 20)

println(edades + ("Luis" to 22)) // {Ana=20, Luis=22}
println(edades + ("Ana" to 21))  // {Ana=21}
println(edades - "Ana")          // {}
println(edades)                  // {Ana=20}
```

Si necesitas hacer varios cambios seguidos, `toMutableMap()` crea una copia modificable.

---

## De una lista a un Map {#de-lista-a-map}

Los ejemplos usan este catálogo:

```kotlin
data class Producto(val id: Int, val nombre: String, val categoria: String, val precio: Double)

val catalogo = listOf(
    Producto(1, "Mando", "Accesorios", 70.0),
    Producto(2, "Funda", "Accesorios", 20.0),
    Producto(3, "Cascos", "Audio", 90.0),
    Producto(4, "Altavoz", "Audio", 45.0),
)
```

Lo que decide el método es **qué papel hace cada elemento de la lista** dentro del mapa: el valor, la clave o parte de una lista de valores. Lee el nombre como una frase: `associateBy` asocia cada elemento *por* un dato suyo, y `associateWith` lo asocia *con* un dato.

### `associateBy`: buscar un elemento por su clave {#associateby}

**Cuándo se usa:** tienes una lista de objetos y necesitas encontrar uno a partir de un dato suyo, normalmente el id.

**Qué hace:** la lambda indica **la clave**, y el **elemento completo** es el valor. `catalogo.associateBy { it.id }` se lee «asocia cada producto por su id»:

| Elemento de la lista | La lambda devuelve (clave) | Entrada del mapa |
| :--- | :--- | :--- |
| `Producto(1, "Mando", …)` | `1` | `1` → `Producto(1, "Mando", …)` |
| `Producto(2, "Funda", …)` | `2` | `2` → `Producto(2, "Funda", …)` |

El resultado es un `Map<Int, Producto>`, y buscar es tan sencillo como usar la clave:

```kotlin
val porId = catalogo.associateBy { it.id }

println(porId[3]) // Producto(id=3, nombre=Cascos, categoria=Audio, precio=90.0)
println(porId[9]) // null
```

Con la lista también se puede buscar, pero `find` la recorre elemento a elemento cada vez. El mapa va directo a la clave, y eso se nota cuando se hacen muchas búsquedas:

```kotlin
val porId = catalogo.associateBy { it.id }

println(catalogo.find { it.id == 3 }?.nombre) // Cascos
println(porId[3]?.nombre)                     // Cascos
```

Con una segunda lambda eliges también el valor, en lugar de guardar el elemento completo:

```kotlin
println(catalogo.associateBy({ it.id }, { it.nombre }))
// {1=Mando, 2=Funda, 3=Cascos, 4=Altavoz}
```

!!! warning "Si la clave se repite, solo queda el último"
    Un mapa no admite claves repetidas, así que `associateBy` no da error: cada elemento sustituye al anterior con la misma clave. Úsalo con claves únicas, como un id. Si varios elementos comparten clave, lo que necesitas es [`groupBy`](#groupby).

    ```kotlin
    println(catalogo.associateBy { it.categoria }["Audio"]?.nombre) // Altavoz
    ```

### `associateWith`: añadir un dato a cada elemento {#associatewith}

**Cuándo se usa:** tienes una lista de valores simples, como nombres o ids, y quieres guardar un dato de cada uno.

**Qué hace:** el **elemento** es la clave, y la lambda indica **el valor**. `nombres.associateWith { it.length }` se lee «asocia cada nombre con su longitud»:

| Elemento de la lista (clave) | La lambda devuelve | Entrada del mapa |
| :--- | :--- | :--- |
| `"Ana"` | `3` | `"Ana"` → `3` |
| `"Luisa"` | `5` | `"Luisa"` → `5` |

El resultado es un `Map<String, Int>`:

```kotlin
val nombres = listOf("Ana", "Luisa")
val longitudes = nombres.associateWith { it.length }

println(longitudes)          // {Ana=3, Luisa=5}
println(longitudes["Luisa"]) // 5
```

También sirve para dar a todas las claves el mismo valor inicial, por ejemplo poner varios marcadores a cero:

```kotlin
println(listOf("Ana", "Luisa").associateWith { 0 }) // {Ana=0, Luisa=0}
```

### `associateBy` o `associateWith`: la diferencia {#associateby-o-associatewith}

Con la misma lista y la misma lambda, el mapa sale «dado la vuelta»:

```kotlin
val nombres = listOf("Ana", "Luisa")

println(nombres.associateBy { it.length })   // {3=Ana, 5=Luisa}
println(nombres.associateWith { it.length }) // {Ana=3, Luisa=5}
```

| | La clave es | El valor es | Pregunta que resuelve |
| :--- | :--- | :--- | :--- |
| `associateBy { … }` | Lo que devuelve la lambda | El elemento | ¿Qué elemento tiene este id? |
| `associateWith { … }` | El elemento | Lo que devuelve la lambda | ¿Qué dato tiene este elemento? |

Si lo escribieras en Java con un bucle, la diferencia estaría en los argumentos de `put`:

```java
// associateBy: el elemento es el valor
for (Producto p : catalogo) {
    porId.put(p.getId(), p);
}

// associateWith: el elemento es la clave
for (String n : nombres) {
    longitudes.put(n, n.length());
}
```

### `associate`: elegir clave y valor {#associate}

La lambda devuelve un par con la clave y el valor:

```kotlin
println(catalogo.associate { it.nombre to it.precio })
// {Mando=70.0, Funda=20.0, Cascos=90.0, Altavoz=45.0}
```

!!! tip "Cuál de los tres elegir"
    Elige el más específico que encaje: `associateBy` si el valor es el elemento, `associateWith` si la clave es el elemento, y `associate` solo cuando ninguno de los dos lo es, como aquí, donde la clave es el nombre y el valor el precio.

### `toMap`: de una lista de pares a un mapa {#tomap}

Convierte una lista de `Pair`. Suele aparecer detrás de [`zip`](./42-listas.md#417-zip-unzip), que empareja dos listas:

```kotlin
println(listOf("Ana" to 20, "Luis" to 22).toMap()) // {Ana=20, Luis=22}

val nombres = listOf("Ana", "Luis")
val notas = listOf(8, 4)
println(nombres.zip(notas).toMap()) // {Ana=8, Luis=4}
```

### `groupBy`: repartir en grupos {#groupby}

La lambda calcula la clave, y el valor es la **lista** de todos los elementos con esa clave. A diferencia de `associateBy`, no se pierde ninguno. Equivale a `Collectors.groupingBy` en los *streams* de Java.

```kotlin
println(listOf("sol", "luna", "mar").groupBy { it.length })
// {3=[sol, mar], 4=[luna]}

val porCategoria = catalogo.groupBy { it.categoria }
println(porCategoria.keys)                        // [Accesorios, Audio]
println(porCategoria["Audio"]?.map { it.nombre }) // [Cascos, Altavoz]
```

Con una segunda lambda eliges qué se guarda en cada lista:

```kotlin
println(catalogo.groupBy({ it.categoria }, { it.nombre }))
// {Accesorios=[Mando, Funda], Audio=[Cascos, Altavoz]}
```

### `groupingBy` y `eachCount`: contar por grupos {#groupingby-eachcount}

`groupingBy` no devuelve un mapa, sino un objeto `Grouping` que aún no ha calculado nada. `eachCount()` lo convierte en un mapa con el recuento de cada grupo:

```kotlin
println(listOf("rojo", "azul", "rojo").groupingBy { it }.eachCount())
// {rojo=2, azul=1}
println(catalogo.groupingBy { it.categoria }.eachCount())
// {Accesorios=2, Audio=2}
```

Es más directo que `groupBy { … }.mapValues { it.value.size }`, que da el mismo resultado.

---

## Operaciones con Maps

Todas estas operaciones reciben un mapa y **devuelven otro**. El original no cambia.

### `mapValues`: cambiar los valores {#mapvalues}

Mantiene las claves y sustituye cada valor por lo que devuelve la lambda:

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4)

println(notas.mapValues { it.value * 10 })          // {Ana=80, Luis=40}
println(notas.mapValues { (_, nota) -> nota >= 5 }) // {Ana=true, Luis=false}
println(notas.mapValues { (nombre, nota) -> "$nombre: $nota" })
// {Ana=Ana: 8, Luis=Luis: 4}
```

!!! warning "`it` es la entrada, no el valor"
    `notas.mapValues { it * 10 }` no compila, porque `it` es un `Map.Entry`. Escribe `it.value` o desestructura con `(clave, valor)`. Si no necesitas la clave, usa `_` en su lugar.

### `mapKeys`: cambiar las claves {#mapkeys}

Mantiene los valores y sustituye cada clave. Si dos claves acaban siendo iguales, solo queda la última.

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4)
println(notas.mapKeys { it.key.uppercase() }) // {ANA=8, LUIS=4}
```

### `groupBy` + `mapValues`: resumir cada grupo {#groupby-mapvalues}

Es la combinación más habitual: repartir en grupos y calcular un dato de cada grupo. `groupBy` deja un `Map<K, List<T>>`, y `mapValues` sustituye cada lista por el resumen.

```kotlin
val porCategoria = catalogo.groupBy { it.categoria }
// {Accesorios=[Mando, Funda], Audio=[Cascos, Altavoz]}

println(porCategoria.mapValues { (_, lista) -> lista.size })
// {Accesorios=2, Audio=2}

println(porCategoria.mapValues { (_, lista) -> lista.sumOf { it.precio } })
// {Accesorios=90.0, Audio=135.0}

println(porCategoria.mapValues { (_, lista) -> lista.maxByOrNull { it.precio }?.nombre })
// {Accesorios=Mando, Audio=Cascos}

println(porCategoria.mapValues { (_, lista) -> lista.map { it.nombre } })
// {Accesorios=[Mando, Funda], Audio=[Cascos, Altavoz]}
```

Dentro de la lambda, `productos` es una lista normal, así que sirve cualquier [operación de listas](./42-listas.md#que-metodo-uso).

### `filterKeys`, `filterValues` y `filter`: quedarse con algunas entradas {#filtrar-un-map}

Se diferencian en lo que recibe la condición: la clave, el valor o la entrada completa.

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4, "Alba" to 6)

println(notas.filterKeys { it.startsWith("A") }) // {Ana=8, Alba=6}
println(notas.filterValues { it >= 5 })          // {Ana=8, Alba=6}
println(notas.filter { (nombre, nota) -> nombre != "Ana" && nota >= 5 })
// {Alba=6}
```

Como el resultado es otro mapa, se puede seguir encadenando, por ejemplo con `.keys`:

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4, "Alba" to 6)
println(notas.filterValues { it >= 5 }.keys) // [Ana, Alba]
```

---

## De un Map a una lista {#de-map-a-lista}

`toList()` da una lista de pares, y `map` una lista con lo que devuelva su lambda. Ojo: `map` sobre un mapa devuelve una **lista**, mientras que `mapValues` y `mapKeys` devuelven un mapa.

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4)

println(notas.toList())                                   // [(Ana, 8), (Luis, 4)]
println(notas.map { (nombre, nota) -> "$nombre: $nota" }) // [Ana: 8, Luis: 4]
println(notas.values.toList())                            // [8, 4]
```

### Ordenar un Map {#ordenar-map}

Un `Map` no tiene `sortedBy`: primero hay que pasar por `entries` o `toList()`, y el resultado es una lista. Si después necesitas otra vez un mapa, añade `toMap()`, que respeta el orden.

```kotlin
val notas = mapOf("Luis" to 4, "Ana" to 8, "Alba" to 6)

println(notas.entries.sortedByDescending { it.value }.map { it.key })
// [Ana, Alba, Luis]
println(notas.toList().sortedBy { it.second })
// [(Luis, 4), (Alba, 6), (Ana, 8)]
println(notas.toList().sortedBy { it.second }.toMap())
// {Luis=4, Alba=6, Ana=8}
```

### Resumir un Map en un valor {#resumir-map}

`count`, `any`, `all`, `none` y `maxByOrNull` funcionan directamente sobre el mapa, y su lambda recibe cada entrada. `sum`, `sumOf` y `average` no existen en `Map`: se aplican sobre `values` o `entries`.

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4, "Alba" to 6)

println(notas.count { it.value >= 5 })         // 2
println(notas.any { it.value == 10 })          // false
println(notas.maxByOrNull { it.value }?.key)   // Ana
println(notas.values.sum())                    // 18
println(notas.values.average())                // 6.0
println(notas.entries.sumOf { it.key.length }) // 11
```

---

Para más detalle, consulta en la documentación oficial de Kotlin las [operaciones con mapas](https://kotlinlang.org/docs/map-operations.html), la [asociación](https://kotlinlang.org/docs/collection-transformations.html#associate) y el [agrupamiento](https://kotlinlang.org/docs/collection-grouping.html).

!!! tip "Practícalo en el codelab"

    Pon en práctica este tema con tests que te corrigen al momento: [Codelab de Kotlin, Paso 3](./codelabs/03-colecciones-maps.md).
