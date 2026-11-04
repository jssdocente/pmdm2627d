---
bloque: 6
titulo: Colecciones
apuntes: temas/00-android/00-kotlin/42-listas.md
---

## kt-col-001 {dificultad=1 tipo=salida ancla=3-inmutabilidad-y-adicion-funcional-de-elementos}

¿Qué imprime este código?

```kotlin
val nums = listOf(5, 2, 8, 1)
val ordenados = nums.sorted()
println(ordenados)
println(nums)
```

### A ✔

```text
[1, 2, 5, 8]
[5, 2, 8, 1]
```

> Correcto. `sorted()` **no modifica** la lista: devuelve una lista nueva ordenada. `nums` sigue igual, como todas las operaciones funcionales sobre `List`.

### B

```text
[1, 2, 5, 8]
[1, 2, 5, 8]
```

> `nums` es de solo lectura y `sorted()` devuelve una **copia**. Solo `sort()` sobre una `MutableList` ordena «en el sitio».

### C

```text
[8, 5, 2, 1]
[5, 2, 8, 1]
```

> `sorted()` ordena de menor a mayor. Para el orden inverso se usa `sortedDescending()`.

### D

Error de compilación: `listOf` crea una lista inmutable que no se puede ordenar.

> Una lista inmutable no se puede **modificar**, pero sí se puede crear otra ordenada a partir de ella, que es lo que hace `sorted()`.

## kt-col-002 {dificultad=1 tipo=salida ancla=43-maps.md#modificacion-de-elementos-de-un-map}

¿Qué imprime este código?

```kotlin
val stock = mutableMapOf("manzanas" to 3)
stock["peras"] = 5
stock["manzanas"] = 10
println(stock)
```

### A ✔

`{manzanas=10, peras=5}`

> Correcto. Con `mapa[clave] = valor` se **añade** la clave si no existe o se **sustituye** el valor si ya existe. Las claves no se repiten.

### B

`{manzanas=3, peras=5, manzanas=10}`

> Un mapa no puede tener claves repetidas: asignar a una clave existente reemplaza su valor.

### C

`{manzanas=13, peras=5}`

> La asignación **sustituye** el valor, no lo suma. Para sumar habría que escribir `stock["manzanas"] = stock.getValue("manzanas") + 10`.

### D

Error de compilación: `[]` solo sirve para leer valores de un mapa.

> En un `MutableMap` el operador `[]` también sirve para escribir: equivale a `put(clave, valor)`.

## kt-col-003 {dificultad=3 tipo=salida ancla=44-sets.md}

¿Qué imprime este código?

```kotlin
val s = setOf(3, 1, 3, 2, 1)
println(s.size)
println(s)
```

### A ✔

```text
3
[3, 1, 2]
```

> Correcto. Un `Set` no admite duplicados, así que quedan 3 elementos. `setOf` mantiene el **orden de inserción** (de la primera aparición): 3, 1, 2.

### B

```text
5
[3, 1, 3, 2, 1]
```

> Los duplicados se descartan al crear el `Set`: es su propiedad principal.

### C

```text
3
[1, 2, 3]
```

> `setOf` no ordena: conserva el orden en que aparecen los elementos por primera vez. Un conjunto ordenado se obtendría con `sortedSetOf`.

### D

Lanza `IllegalArgumentException` por elementos duplicados.

> Los duplicados no son un error en un `Set`: simplemente se ignoran.

## kt-col-004 {dificultad=2 tipo=salida ancla=44-agrupacion-y-ordenacion-groupby-y-sortedby}

¿Qué imprime este código?

```kotlin
val palabras = listOf("sol", "luna", "mar", "cielo")
println(palabras.groupBy { it.length })
```

### A ✔

`{3=[sol, mar], 4=[luna], 5=[cielo]}`

> Correcto. `groupBy` crea un `Map` cuya **clave** es el resultado de la lambda (la longitud) y cuyo **valor** es la lista de elementos con esa clave.

### B

`{sol=3, luna=4, mar=3, cielo=5}`

> Ese sería el resultado de `associateWith { it.length }`: un valor por elemento. `groupBy` agrupa varios elementos bajo la misma clave.

### C

`[[sol, mar], [luna], [cielo]]`

> `groupBy` devuelve un `Map`, no una lista de listas. Las claves (3, 4, 5) forman parte del resultado.

### D

`{3=mar, 4=luna, 5=cielo}`

> Al agrupar no se pierde ningún elemento: cada clave guarda **todos** los elementos que la comparten, en una lista.

## kt-col-005 {dificultad=2 tipo=salida ancla=48-partition-bifurcacion-en-dos-listas-simultaneas}

¿Qué imprime este código?

```kotlin
val (pares, impares) = (1..6).partition { it % 2 == 0 }
println("$pares $impares")
```

### A ✔

`[2, 4, 6] [1, 3, 5]`

> Correcto. `partition` devuelve un `Pair`: primero los elementos que **cumplen** la condición y después los que no. La desestructuración `val (a, b)` los separa.

### B

`[1, 3, 5] [2, 4, 6]`

> El primer elemento del `Pair` siempre es el de los que **cumplen** el predicado (`it % 2 == 0`, los pares).

### C

`[2, 4, 6]`

> `partition` no descarta los que no cumplen la condición (eso es `filter`): los guarda en la segunda lista.

### D

Error de compilación: no se puede desestructurar el resultado de `partition`.

> `Pair` tiene `component1()` y `component2()`, así que admite `val (a, b) = ...`.

## kt-col-006 {dificultad=2 tipo=salida ancla=5-programacion-fluent-pipelines-de-transformacion-encadenados}

¿Qué imprime este código?

```kotlin
val notas = listOf("Zelda" to 95, "Mario" to 90, "Tetris" to 88)
val total = notas.filter { it.second >= 90 }.sumOf { it.second }
println(total)
```

### A ✔

`185`

> Correcto. `filter` deja `Zelda` (95) y `Mario` (90), porque `>=` incluye el 90. Después `sumOf` suma sus segundas componentes: 95 + 90 = 185.

### B

`95`

> `>= 90` también incluye el 90 de `Mario`. Con `> 90` sí quedaría solo `Zelda`.

### C

`273`

> Esa es la suma de las tres. `filter` va antes que `sumOf` y elimina `Tetris` (88).

### D

`[Zelda, Mario]`

> `sumOf` no devuelve los elementos, sino la **suma** de lo que devuelve la lambda para cada uno.

## kt-col-007 {dificultad=3 tipo=concepto ejecutable ancla=41-arrays.md#operaciones-con-arrays}

¿Qué muestra por consola este código?

```kotlin
val numeros = arrayOf(1, 2, 3)
println(numeros)
println(numeros.contentToString())
```

### A ✔

Algo como `[Ljava.lang.Integer;@1b6d3586` y después `[1, 2, 3]`.

> Correcto. Los `Array` de Kotlin son arrays de la JVM y **no** redefinen `toString()`: se imprime el tipo y una dirección. Para ver el contenido hay que usar `contentToString()` (o trabajar con `List`).

### B

`[1, 2, 3]` dos veces.

> Las `List` sí se imprimen bonitas, pero los `Array` no. Esta diferencia es una trampa habitual.

### C

`123` y después `[1, 2, 3]`.

> `println` no recorre el array ni concatena sus elementos: llama a su `toString()`, que no está redefinido.

### D

Error de compilación: no se puede imprimir un `Array` directamente.

> Compila sin problemas, porque cualquier objeto se puede imprimir. Lo que pasa es que el resultado no es legible.

## kt-col-008 {dificultad=1 tipo=salida ancla=1-creacion-de-listas-listof-vs-mutablelistof}

¿Qué imprime este código?

```kotlin
val cola = mutableListOf(1, 2, 3)
cola.removeAt(0)
cola.add(9)
println(cola)
```

### A ✔

`[2, 3, 9]`

> Correcto. `removeAt(0)` elimina el elemento de la **posición** 0 (el 1) y `add` añade al final.

### B

`[1, 3, 9]`

> `removeAt` recibe un **índice**, no un valor. El índice 0 es el primer elemento, el 1.

### C

`[9, 2, 3]`

> `add(elemento)` añade al **final**. Para insertar al principio se usaría `add(0, 9)`.

### D

`[2, 3]`

> El `add(9)` también se ejecuta y añade el 9 al final.

## kt-col-009 {dificultad=2 tipo=salida ancla=3-inmutabilidad-y-adicion-funcional-de-elementos}

¿Qué imprime este código?

```kotlin
val base = listOf(1, 2, 3)
val ampliada = base + 4
println("$base $ampliada")
```

### A ✔

`[1, 2, 3] [1, 2, 3, 4]`

> Correcto. Sobre una lista de solo lectura, `+` **no modifica** la original: crea una lista nueva con el elemento añadido.

### B

`[1, 2, 3, 4] [1, 2, 3, 4]`

> `base` es inmutable y `+` devuelve una copia; la original no cambia.

### C

Error de compilación: `listOf` no permite añadir elementos.

> No permite **modificarla** (`add`), pero sí crear otra lista con `+`.

### D

`[1, 2, 3] [5, 6, 7]`

> `+` sobre una lista no suma a cada elemento: añade el 4 como un elemento más.

## kt-col-010 {dificultad=2 tipo=salida ancla=43-busqueda-y-verificacion-find-any-all}

¿Qué imprime este código?

```kotlin
val n = listOf(3, 6, 9)
println("${n.all { it % 3 == 0 }} ${n.any { it > 8 }} ${n.none { it > 5 }}")
```

### A ✔

`true true false`

> Correcto. Todos son múltiplos de 3 (`all`), alguno es mayor que 8 (`any`, el 9), y no es cierto que **ninguno** sea mayor que 5 (`none`), porque 6 y 9 lo son.

### B

`true false false`

> `any { it > 8 }` es cierto: basta con un elemento, y el 9 cumple.

### C

`true true true`

> `none` devuelve `true` solo si **ningún** elemento cumple la condición, y aquí cumplen dos.

### D

`false true false`

> 3, 6 y 9 son todos divisibles entre 3, así que `all` es `true`.

## kt-col-011 {dificultad=2 tipo=salida ancla=44-agrupacion-y-ordenacion-groupby-y-sortedby}

¿Qué imprime este código?

```kotlin
val juegos = listOf("Hades" to 2020, "Celeste" to 2018, "Tetris" to 1984)
println(juegos.sortedBy { it.second }.map { it.first })
```

### A ✔

`[Tetris, Celeste, Hades]`

> Correcto. `sortedBy` ordena de menor a mayor según el año (`second`), y `map` se queda con el nombre (`first`).

### B

`[Hades, Celeste, Tetris]`

> `sortedBy` es ascendente: el año más antiguo (1984) va primero.

### C

`[Celeste, Hades, Tetris]`

> Ese es el orden alfabético. Aquí se ordena por `it.second`, el año.

### D

`[1984, 2018, 2020]`

> El `map { it.first }` final transforma cada par en su nombre.

## kt-col-012 {dificultad=2 tipo=salida ancla=45-flatmap-aplanando-colecciones-anidadas}

¿Qué imprime este código?

```kotlin
println(listOf("ab", "cd").flatMap { it.toList() })
```

### A ✔

`[a, b, c, d]`

> Correcto. Para cada elemento, la lambda devuelve una lista (`['a','b']` y `['c','d']`), y `flatMap` las **une en una sola** lista plana.

### B

`[[a, b], [c, d]]`

> Eso daría `map`. `flatMap` aplana el resultado: quita el nivel de anidamiento.

### C

`[ab, cd]`

> La lambda convierte cada cadena en su lista de caracteres, y `flatMap` junta todos esos caracteres.

### D

`abcd`

> El resultado es una `List<Char>`, que se imprime con corchetes y comas.

## kt-col-013 {dificultad=3 tipo=salida ancla=46-distinct-y-distinctby-eliminacion-de-duplicados}

¿Qué imprime este código?

```kotlin
val nombres = listOf("Ana", "alberto", "Luis", "lola")
println(nombres.distinctBy { it.first().lowercaseChar() })
```

### A ✔

`[Ana, Luis]`

> Correcto. `distinctBy` usa la clave que devuelve la lambda (la inicial en minúscula) y conserva el **primer** elemento de cada clave: `a` → `Ana` y `l` → `Luis`.

### B

`[Ana, alberto, Luis, lola]`

> Con `distinct()` sí se mantendrían todos, porque son cadenas distintas. `distinctBy` compara solo por la clave.

### C

`[alberto, lola]`

> Se conserva la **primera** aparición de cada clave, no la última.

### D

`[a, l]`

> `distinctBy` devuelve los elementos originales, no las claves.

## kt-col-014 {dificultad=1 tipo=salida ancla=47-take-y-drop-seleccion-y-descarte-por-cantidad}

¿Qué imprime este código?

```kotlin
println((1..10).toList().drop(7).take(2))
```

### A ✔

`[8, 9]`

> Correcto. `drop(7)` descarta los 7 primeros (queda `[8, 9, 10]`) y `take(2)` se queda con los 2 primeros de lo que queda.

### B

`[1, 2]`

> `drop(7)` se aplica primero y elimina los siete primeros elementos.

### C

`[7, 8]`

> `drop(7)` elimina 7 **elementos** (del 1 al 7), así que el primero que queda es el 8.

### D

`[9, 10]`

> `take` se queda con los primeros, no con los últimos (eso sería `takeLast`).

## kt-col-015 {dificultad=2 tipo=salida ancla=43-maps.md#acceso-a-elementos-de-un-map}

¿Qué imprime este código?

```kotlin
val stock = mapOf("peras" to 3)
println(stock["kiwis"])
println(stock.getOrDefault("kiwis", 0))
```

### A ✔

```text
null
0
```

> Correcto. Acceder con `[]` a una clave que no existe devuelve `null` (el tipo es `Int?`). `getOrDefault` permite indicar un valor de reserva.

### B

Lanza `NoSuchElementException` en la primera línea.

> Eso lo haría `getValue("kiwis")`. El operador `[]` devuelve `null` sin lanzar nada.

### C

```text
0
0
```

> El acceso con `[]` no tiene valor por defecto: devuelve `null`.

### D

```text
3
0
```

> `[]` busca exactamente la clave indicada, no devuelve otra.

## kt-col-016 {dificultad=1 tipo=salida ancla=43-maps.md#iteracion-sobre-un-map}

¿Qué imprime este código?

```kotlin
val puntos = mapOf("x" to 1, "y" to 2)
for ((clave, valor) in puntos) print("$clave$valor ")
```

### A ✔

`x1 y2`

> Correcto. Cada entrada del mapa se desestructura en `(clave, valor)`. `mapOf` conserva el orden de inserción.

### B

`x y`

> Se imprimen tanto la clave como el valor de cada entrada.

### C

`1 2`

> Primero va la clave y después el valor: `"$clave$valor"`.

### D

Error de compilación: un `Map` no se puede recorrer con `for`.

> Un `Map` se puede recorrer: cada vuelta es una entrada (`Map.Entry`) que admite desestructuración.

## kt-col-017 {dificultad=3 tipo=salida ancla=44-sets.md#operaciones-con-sets}

¿Qué imprime este código?

```kotlin
val a = setOf(1, 2, 3)
val b = setOf(2, 3, 4)
println(a intersect b)
println(a union b)
println(a subtract b)
```

### A ✔

```text
[2, 3]
[1, 2, 3, 4]
[1]
```

> Correcto. Son las operaciones de conjuntos: elementos **comunes** (`intersect`), **todos** sin repetir (`union`), y los de `a` que **no** están en `b` (`subtract`).

### B

```text
[2, 3]
[1, 2, 3, 2, 3, 4]
[1]
```

> Un `Set` nunca tiene duplicados, así que la unión no repite el 2 ni el 3.

### C

```text
[1, 4]
[1, 2, 3, 4]
[4]
```

> `intersect` es lo común (2 y 3), y `subtract` se queda con los de `a` (el 1), no con los de `b`.

### D

Error de compilación: hay que escribir `a.intersect(b)`.

> Son funciones `infix`, así que se pueden escribir sin punto ni paréntesis: `a intersect b`.

## kt-col-018 {dificultad=2 tipo=salida ancla=49-operaciones-de-agregacion-sumof-maxbyornull-count-average}

¿Qué imprime este código?

```kotlin
val notas = listOf(4, 8, 6)
println(notas.average())
println(notas.count { it >= 5 })
```

### A ✔

```text
6.0
2
```

> Correcto. `average()` siempre devuelve un `Double` (18 / 3 = 6.0). `count { }` cuenta los elementos que cumplen la condición: 8 y 6.

### B

```text
6
2
```

> `average()` devuelve `Double` aunque los elementos sean `Int`, así que se imprime `6.0`.

### C

```text
6.0
3
```

> `count { it >= 5 }` solo cuenta los que cumplen; el 4 no cumple.

### D

```text
18
2
```

> `average()` es la media, no la suma (que sería `sum()`).

## kt-col-019 {dificultad=1 tipo=salida ancla=49-operaciones-de-agregacion-sumof-maxbyornull-count-average}

¿Qué imprime este código?

```kotlin
val frutas = listOf("kiwi", "banana", "uva")
println(frutas.maxByOrNull { it.length })
```

### A ✔

`banana`

> Correcto. `maxByOrNull` devuelve el **elemento** que tiene el mayor valor según la lambda (la longitud), o `null` si la lista está vacía.

### B

`6`

> Se devuelve el elemento, no el valor de comparación. Para obtener 6 se usaría `maxOf { it.length }`.

### C

`uva`

> «uva» es la última alfabéticamente, pero aquí se compara por longitud.

### D

`null`

> Solo devolvería `null` si la lista estuviese vacía.

## kt-col-020 {dificultad=3 tipo=salida ancla=41-arrays.md#modificacion-de-elementos-de-un-array}

¿Qué imprime este código?

```kotlin
val a = intArrayOf(1, 2, 3)
val b = a
b[0] = 99
println(a[0])
```

### A ✔

`99`

> Correcto. `val b = a` no copia el array: `a` y `b` son dos referencias **al mismo** objeto. Modificar por una se ve por la otra. Para copiar se usaría `a.copyOf()`.

### B

`1`

> Eso pasaría si `b` fuera una copia. La asignación solo copia la referencia.

### C

Error de compilación: `b` es `val` y no se puede modificar.

> `val` impide reasignar `b`, pero no modificar el contenido del array al que apunta.

### D

Lanza `UnsupportedOperationException`.

> Los arrays siempre son modificables: no existe una versión de solo lectura.

## kt-col-021 {dificultad=2 tipo=compila error ancla=43-maps.md#modificacion-de-elementos-de-un-map}

¿Qué ocurre al compilar este fragmento?

```kotlin
val precios = mapOf("pan" to 1)
precios["leche"] = 2
```

### A ✔

Error de compilación: `mapOf` crea un `Map` de solo lectura, sin operación de escritura.

> Correcto. Para añadir o cambiar entradas hace falta un `MutableMap` (`mutableMapOf`).

### B

Compila y añade la entrada `leche=2`.

> Un `Map` de solo lectura no tiene el operador `[]=`.

### C

Compila, pero lanza `UnsupportedOperationException` al ejecutar.

> El error se detecta antes: el tipo `Map` no tiene operación `set`.

### D

Error de compilación: `precios` es `val`.

> `val` solo impide reasignar la variable. El problema es que el tipo `Map` es de solo lectura.

## kt-col-022 {dificultad=2 tipo=salida ancla=43-maps.md#operaciones-con-maps}

¿Qué imprime este código?

```kotlin
println(listOf("ana", "luis").associateWith { it.length })
```

### A ✔

`{ana=3, luis=4}`

> Correcto. `associateWith` crea un `Map` cuyas **claves** son los elementos y cuyos **valores** son el resultado de la lambda.

### B

`{3=ana, 4=luis}`

> Ese sería `associateBy { it.length }`, que usa el resultado de la lambda como clave.

### C

`[3, 4]`

> Eso sería `map { it.length }`. `associateWith` devuelve un mapa.

### D

`[(ana, 3), (luis, 4)]`

> Esa es una lista de pares (`map { it to it.length }`). `associateWith` produce un `Map`.

## kt-col-023 {dificultad=2 tipo=salida ancla=49-operaciones-de-agregacion-sumof-maxbyornull-count-average}

¿Qué imprime este código?

```kotlin
println(listOf(1, 2, 3).fold(10) { acumulado, x -> acumulado + x })
```

### A ✔

`16`

> Correcto. `fold` parte de un valor inicial (10) y lo va combinando con cada elemento: 10 + 1 + 2 + 3 = 16.

### B

`6`

> El valor inicial 10 también forma parte del resultado.

### C

`[11, 12, 13]`

> `fold` reduce la lista a **un único valor**; no la transforma elemento a elemento.

### D

`60`

> La lambda suma; no multiplica.

## kt-col-024 {dificultad=3 tipo=salida ancla=49-operaciones-de-agregacion-sumof-maxbyornull-count-average}

¿Qué imprime este código?

```kotlin
println(listOf("a", "b", "c").reduce { acumulado, s -> s + acumulado })
```

### A ✔

`cba`

> Correcto. `reduce` empieza con el primer elemento como acumulado (`"a"`). Después: `"b" + "a"` = `"ba"`, y `"c" + "ba"` = `"cba"`. Como la lambda pone el nuevo elemento **delante**, el resultado sale invertido.

### B

`abc`

> La lambda concatena `s + acumulado`, es decir, el elemento nuevo va primero.

### C

`a`

> `reduce` combina todos los elementos, no solo el primero.

### D

Error de compilación: `reduce` solo funciona con números.

> Funciona con cualquier tipo, siempre que la lambda devuelva el mismo tipo que los elementos.

## kt-col-025 {dificultad=2 tipo=salida ancla=4-operaciones-funcionales-imprescindibles}

¿Qué imprime este código?

```kotlin
println((1..7).chunked(3))
```

### A ✔

`[[1, 2, 3], [4, 5, 6], [7]]`

> Correcto. `chunked(n)` divide la colección en trozos de tamaño `n`. El último puede ser más pequeño.

### B

`[[1, 2, 3], [4, 5, 6]]`

> El 7 sobrante no se pierde: forma un último trozo.

### C

`[[1, 4, 7], [2, 5], [3, 6]]`

> Los trozos se forman con elementos consecutivos, no repartiendo.

### D

`[3, 3, 1]`

> Se devuelven las listas, no sus tamaños.

## kt-col-026 {dificultad=3 tipo=salida ancla=44-agrupacion-y-ordenacion-groupby-y-sortedby}

¿Qué imprime este código?

```kotlin
val palabras = listOf("bb", "a", "ccc", "dd")
println(palabras.sortedWith(compareBy({ it.length }, { it })))
```

### A ✔

`[a, bb, dd, ccc]`

> Correcto. `compareBy` con varios criterios ordena primero por el primero (la longitud) y, en caso de empate, por el siguiente (orden alfabético). `bb` y `dd` empatan en longitud, y `bb` va antes.

### B

`[a, bb, ccc, dd]`

> Ese es el orden alfabético puro. Aquí el primer criterio es la longitud.

### C

`[a, dd, bb, ccc]`

> En caso de empate de longitud se aplica el segundo criterio, el alfabético.

### D

`[ccc, bb, dd, a]`

> `compareBy` ordena de menor a mayor.

## kt-col-027 {dificultad=1 tipo=salida ancla=2-acceso-y-recorrido-de-elementos}

¿Qué imprime este código?

```kotlin
val letras = listOf("x", "y", "z")
println("${"y" in letras} ${letras.indexOf("z")} ${letras.indexOf("w")}")
```

### A ✔

`true 2 -1`

> Correcto. `in` comprueba si el elemento está en la lista. `indexOf` devuelve su posición o −1 si no lo encuentra.

### B

`true 3 0`

> Los índices empiezan en 0, y cuando no encuentra el elemento devuelve −1.

### C

`true 2 null`

> `indexOf` devuelve un `Int`, nunca `null`. Indica la ausencia con −1.

### D

Lanza `NoSuchElementException` con `"w"`.

> `indexOf` no lanza excepciones: devuelve −1.

## kt-col-028 {dificultad=2 tipo=salida ancla=43-maps.md#operaciones-con-maps}

¿Qué imprime este código?

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4, "Eva" to 6)
println(notas.filter { it.value >= 5 }.keys)
```

### A ✔

`[Ana, Eva]`

> Correcto. `filter` sobre un `Map` recibe cada entrada (con `key` y `value`) y devuelve otro `Map` con las que cumplen. `keys` es el conjunto de sus claves.

### B

`[8, 6]`

> `keys` son los nombres; los números son los `values`.

### C

`{Ana=8, Eva=6}`

> Se imprime solo `.keys`, no el mapa filtrado.

### D

`[Ana, Luis, Eva]`

> `Luis` tiene un 4 y no pasa el filtro.

## kt-col-029 {dificultad=2 tipo=salida ancla=43-maps.md#operaciones-con-maps}

¿Qué imprime este código?

```kotlin
val notas = mapOf("Ana" to 8, "Luis" to 4)
println(notas.mapValues { it.value * 10 })
```

### A ✔

`{Ana=80, Luis=40}`

> Correcto. `mapValues` conserva las claves y transforma cada valor con la lambda.

### B

`[80, 40]`

> `mapValues` devuelve un `Map`, no una lista. Una lista sería `map { it.value * 10 }`.

### C

`{Ana=8, Luis=4}`

> `mapValues` devuelve un mapa nuevo con los valores transformados.

### D

`{80=Ana, 40=Luis}`

> Las claves no cambian; solo se transforman los valores.

## kt-col-030 {dificultad=3 tipo=salida ancla=43-maps.md#modificacion-de-elementos-de-un-map}

¿Qué imprime este código?

```kotlin
val cache = mutableMapOf<String, Int>()
val a = cache.getOrPut("x") { 5 }
val b = cache.getOrPut("x") { 9 }
println("$a $b $cache")
```

### A ✔

`5 5 {x=5}`

> Correcto. `getOrPut` devuelve el valor si la clave ya existe y, si no, calcula el valor con la lambda, **lo guarda** y lo devuelve. La segunda vez la clave ya existe, así que la lambda `{ 9 }` ni se ejecuta.

### B

`5 9 {x=9}`

> Si la clave existe, no se sustituye su valor.

### C

`5 9 {x=5}`

> La segunda llamada devuelve el valor guardado (5), no el de la lambda.

### D

`null null {}`

> `getOrPut` guarda el valor cuando la clave no existe.

## kt-col-031 {dificultad=2 tipo=salida ancla=44-sets.md#modificacion-de-elementos-de-un-set}

¿Qué imprime este código?

```kotlin
val s = mutableSetOf("a")
println(s.add("b"))
println(s.add("a"))
println(s)
```

### A ✔

```text
true
false
[a, b]
```

> Correcto. `add` devuelve `true` si el elemento se ha añadido y `false` si ya estaba. En un `Set` no se repiten elementos.

### B

```text
true
true
[a, b, a]
```

> Un `Set` no admite duplicados: el segundo `"a"` no se añade.

### C

```text
true
false
[a, b, a]
```

> El duplicado no se guarda.

### D

Lanza `IllegalArgumentException` al añadir un duplicado.

> No hay excepción: simplemente no se añade y devuelve `false`.

## kt-col-032 {dificultad=1 tipo=salida ancla=1-creacion-de-listas-listof-vs-mutablelistof}

¿Qué imprime este código?

```kotlin
println(listOf(1, 2) == listOf(1, 2))
println(listOf(1, 2) == listOf(2, 1))
```

### A ✔

```text
true
false
```

> Correcto. `==` compara las listas por **contenido y orden**. Son dos objetos distintos, pero con los mismos elementos en el mismo orden, así que son iguales.

### B

```text
false
false
```

> En Kotlin `==` compara contenido (`equals`), no si son el mismo objeto.

### C

```text
true
true
```

> En las listas el orden importa. Con conjuntos (`setOf`) sí serían iguales.

### D

Error de compilación: no se pueden comparar listas con `==`.

> Se puede: `List` implementa `equals` por contenido.

## kt-col-033 {dificultad=2 tipo=salida ancla=41-arrays.md#arrays-de-tipos-primitivos}

¿Qué imprime este código?

```kotlin
val cuadrados = Array(4) { it * it }
println(cuadrados.joinToString())
```

### A ✔

`0, 1, 4, 9`

> Correcto. El constructor `Array(n) { ... }` crea un array de tamaño `n` y calcula cada elemento a partir de su índice. `joinToString()` usa `", "` como separador por defecto.

### B

`1, 4, 9, 16`

> Los índices empiezan en 0, así que el primer elemento es 0 · 0.

### C

`[0, 1, 4, 9]`

> `joinToString()` no añade corchetes.

### D

`0, 0, 0, 0`

> La lambda se aplica a cada índice para calcular su valor.

## kt-col-034 {dificultad=1 tipo=compila error ancla=1-creacion-de-listas-listof-vs-mutablelistof}

¿Qué ocurre al compilar este fragmento?

```kotlin
val nums = listOf(1, 2, 3)
nums[0] = 9
```

### A ✔

Error de compilación: una `List` es de solo lectura y no admite asignar por índice.

> Correcto. Para modificar elementos hace falta una `MutableList` (`mutableListOf`).

### B

Compila, y la lista queda `[9, 2, 3]`.

> `List` solo permite leer con `[]`, no escribir.

### C

Compila, pero lanza `UnsupportedOperationException`.

> El error se detecta en compilación, porque `List` no tiene operación `set`.

### D

Error de compilación: el problema es que `nums` es `val`.

> `val` impide reasignar `nums`. El problema es el tipo `List`.

## kt-col-035 {dificultad=3 tipo=salida ancla=43-busqueda-y-verificacion-find-any-all}

¿Qué imprime este código?

```kotlin
val vacia = emptyList<Int>()
println(vacia.all { it > 100 })
println(vacia.any { it > 100 })
```

### A ✔

```text
true
false
```

> Correcto. `all` sobre una colección vacía es `true`: no hay ningún elemento que **incumpla** la condición (es la «verdad vacía» de la lógica). `any` es `false` porque no hay ninguno que la cumpla.

### B

```text
false
false
```

> `all` comprueba que no haya ningún contraejemplo, y en una lista vacía no lo hay.

### C

Lanza `NoSuchElementException`.

> Las dos funciones admiten colecciones vacías sin lanzar nada.

### D

```text
true
true
```

> `any` necesita al menos un elemento que cumpla, y no hay ninguno.

## kt-col-036 {dificultad=3 tipo=salida ancla=44-agrupacion-y-ordenacion-groupby-y-sortedby}

¿Qué imprime este código?

```kotlin
val votos = listOf("rojo", "azul", "rojo", "rojo")
println(votos.groupBy { it }.mapValues { it.value.size })
```

### A ✔

`{rojo=3, azul=1}`

> Correcto. `groupBy { it }` agrupa los elementos iguales (`{rojo=[rojo, rojo, rojo], azul=[azul]}`) y `mapValues` sustituye cada lista por su tamaño. Así se cuentan apariciones.

### B

`{rojo=[rojo, rojo, rojo], azul=[azul]}`

> Ese es el resultado del `groupBy`, antes del `mapValues`.

### C

`{azul=1, rojo=3}`

> El mapa conserva el orden de la primera aparición de cada clave, y `rojo` aparece primero.

### D

`[3, 1]`

> `mapValues` devuelve un `Map`, no una lista.
