---
bloque: 3
titulo: Bucles y rangos
apuntes: temas/00-android/00-kotlin/12.2-bucles-iteracion.md
---

## kt-buc-001 {dificultad=2 tipo=salida ancla=23-cuenta-atras-inversa-downto}

¿Qué imprime este código?

```kotlin
for (i in 3..1) print(i)
println("fin")
```

### A ✔

`fin`

> Correcto. `3..1` es un rango **vacío**: `..` siempre cuenta hacia arriba y 3 ya es mayor que 1. El bucle no se ejecuta ninguna vez. Para contar hacia atrás se usa `3 downTo 1`.

### B

`321fin`

> Eso imprimiría `for (i in 3 downTo 1)`. El operador `..` no cambia de sentido aunque el inicio sea mayor que el final.

### C

`123fin`

> Kotlin no reordena los extremos del rango: `3..1` no equivale a `1..3`, simplemente está vacío.

### D

Lanza `IllegalArgumentException` porque el rango está mal definido.

> Un rango vacío es perfectamente válido y no lanza nada: el `for` no hace ninguna vuelta.

## kt-buc-002 {dificultad=1 tipo=salida ancla=5-el-modismo-agil-repeatn}

¿Qué imprime este código?

```kotlin
repeat(3) { print(it) }
```

### A ✔

`012`

> Correcto. `repeat(n)` ejecuta la lambda `n` veces y le pasa el índice de la vuelta, que empieza en **0**: `0`, `1`, `2`.

### B

`123`

> El índice que recibe `it` empieza en 0, igual que los índices de listas y arrays.

### C

`333`

> `it` no es el número de repeticiones, sino el índice de la vuelta actual.

### D

`0123`

> `repeat(3)` da **tres** vueltas (0, 1 y 2), no cuatro.

## kt-buc-003 {dificultad=3 tipo=salida ancla=4-control-de-flujo-con-etiquetas-labels}

¿Qué imprime este código?

```kotlin
externo@ for (i in 1..3) {
    for (j in 1..3) {
        if (j == 2) continue@externo
        if (i == 3) break@externo
        print("$i$j ")
    }
}
```

### A ✔

`11 21`

> Correcto. Para `i = 1` e `i = 2` solo se imprime con `j = 1`: al llegar a `j = 2`, `continue@externo` salta a la siguiente `i`. Con `i = 3` y `j = 1`, `break@externo` termina **los dos** bucles.

### B

`11 21 31`

> Con `i = 3` la comprobación `i == 3` se hace **antes** del `print`, así que `31` nunca llega a imprimirse.

### C

`11 13 21 23`

> `continue@externo` no salta solo la vuelta de `j`: pasa directamente a la siguiente vuelta del bucle **etiquetado** (el de `i`). Por eso `j = 3` no llega a ejecutarse.

### D

`11`

> `continue@externo` no termina el bucle externo, solo pasa a su siguiente vuelta. El que lo termina es `break@externo`, y eso ocurre con `i = 3`.

## kt-buc-004 {dificultad=2 tipo=salida ancla=31-bucle-while-comprobacion-previa}

¿Qué imprime este código?

```kotlin
var n = 1
while (n < 100) {
    n *= 3
}
println(n)
```

### A ✔

`243`

> Correcto. `n` vale 1, 3, 9, 27, 81 y 243. Con 81 la condición `81 < 100` aún es cierta, así que se multiplica otra vez. Con 243 la condición es falsa y el bucle termina.

### B

`81`

> La condición se comprueba **antes** de cada vuelta. Con `n = 81` se cumple `n < 100`, así que se hace una vuelta más.

### C

`100`

> El bucle no se detiene «en» 100: solo deja de repetir cuando la condición es falsa, y en ese momento `n` ya es 243.

### D

Nunca termina (bucle infinito).

> `n` crece en cada vuelta (`n *= 3`), así que en algún momento deja de ser menor que 100.

## kt-buc-005 {dificultad=2 tipo=salida ancla=25-iteracion-sobre-cadenas-y-colecciones-con-indice}

¿Qué imprime este código?

```kotlin
val letras = listOf("a", "b", "c", "d")
for ((i, letra) in letras.withIndex()) {
    if (i % 2 == 0) print(letra)
}
```

### A ✔

`ac`

> Correcto. `withIndex()` da pares (índice, valor) que se desestructuran en `(i, letra)`. Los índices pares son 0 y 2: `a` y `c`.

### B

`bd`

> Los índices empiezan en 0: `a` está en la posición 0 (par) y `b` en la 1 (impar).

### C

`0a2c`

> Solo se imprime `letra`, no `i`. El índice se usa en la condición, pero no se muestra.

### D

Error de compilación: no se puede desestructurar en un `for`.

> Sí se puede: `for ((i, x) in lista.withIndex())` es la forma idiomática de recorrer con índice. También se usa con mapas: `for ((k, v) in mapa)`.

## kt-buc-006 {dificultad=1 tipo=concepto ancla=22-rango-semiabierto-until}

¿Cuál de estas expresiones recorre los números del **1 al 9**, ambos incluidos?

### A ✔

`1 until 10`

> Correcto. `until` crea un rango semiabierto: incluye el inicio y **excluye** el final. Es típico con índices: `0 until lista.size`.

### B

`1..10`

> `..` es un rango **cerrado**: incluye el 10. Recorrería del 1 al 10.

### C

`0 until 9`

> Este recorre del 0 al 8: incluye el 0 y excluye el 9.

### D

`9 downTo 1 step 1`

> Recorre los mismos números, pero **del 9 al 1**: el orden es inverso. La pregunta pide ir del 1 al 9.

## kt-buc-007 {dificultad=1 tipo=salida ancla=25-iteracion-sobre-cadenas-y-colecciones-con-indice}

¿Qué imprime este código?

```kotlin
for (c in "hola") print(c.uppercaseChar())
```

### A ✔

`HOLA`

> Correcto. Un `String` se puede recorrer con `for` carácter a carácter. Cada `c` es un `Char`, y `uppercaseChar()` lo pasa a mayúscula.

### B

`hola`

> `uppercaseChar()` devuelve la versión en mayúscula de cada carácter, y es eso lo que se imprime.

### C

Error de compilación: no se puede recorrer un `String` con `for`.

> `String` es iterable: `for (c in texto)` es la forma idiomática de recorrer sus caracteres.

### D

```text
H
O
L
A
```

> Se usa `print`, que no añade salto de línea; `println` sí lo añadiría.

## kt-buc-008 {dificultad=2 tipo=salida ancla=25-iteracion-sobre-cadenas-y-colecciones-con-indice}

¿Qué imprime este código?

```kotlin
val letras = listOf("a", "b", "c")
for (i in letras.indices.reversed()) print(letras[i])
```

### A ✔

`cba`

> Correcto. `indices` es el rango de índices válidos (`0..2`) y `reversed()` lo recorre al revés: 2, 1, 0.

### B

`abc`

> `reversed()` invierte el orden del rango de índices.

### C

Lanza `IndexOutOfBoundsException`.

> `indices` solo contiene índices válidos (0 a `size - 1`), así que nunca se sale de la lista.

### D

`210`

> Se imprime `letras[i]` (el elemento), no el índice `i`.

## kt-buc-009 {dificultad=2 tipo=salida ancla=31-bucle-while-comprobacion-previa}

¿Qué imprime este código?

```kotlin
var i = 0
while (true) {
    i += 2
    if (i > 5) break
}
println(i)
```

### A ✔

`6`

> Correcto. `i` vale 2, 4 y 6. Con 6 se cumple `i > 5` y `break` sale del bucle.

### B

`5`

> `i` crece de 2 en 2 (2, 4, 6) y nunca vale 5.

### C

`4`

> Con `i = 4`, la condición `4 > 5` es falsa, así que se da otra vuelta.

### D

Nunca termina (bucle infinito).

> `while (true)` sería infinito sin `break`, pero aquí `break` termina el bucle cuando `i` supera 5.

## kt-buc-010 {dificultad=1 tipo=salida ancla=2-el-bucle-for-y-las-progresiones-numericas}

¿Qué imprime este código?

```kotlin
for (i in 1..5) {
    if (i % 2 == 0) continue
    print(i)
}
```

### A ✔

`135`

> Correcto. `continue` salta al **siguiente** valor del bucle sin ejecutar el `print`, así que los pares se omiten.

### B

`1`

> `continue` no termina el bucle (eso es `break`): solo se salta la vuelta actual.

### C

`24`

> La condición detecta los pares y **los salta**. Se imprimen los impares.

### D

`12345`

> Para los pares, `continue` impide que se llegue al `print`.

## kt-buc-011 {dificultad=3 tipo=salida ancla=4-control-de-flujo-con-etiquetas-labels}

¿Qué imprime este código?

```kotlin
listOf(1, 2, 3, 4).forEach {
    if (it == 3) return@forEach
    print(it)
}
println("!")
```

### A ✔

`124!`

> Correcto. `return@forEach` sale **solo de la lambda** de esa vuelta, así que equivale a un `continue`. El recorrido sigue con el 4 y después se imprime `!`.

### B

`12!`

> `return@forEach` no detiene el recorrido: solo termina la ejecución de la lambda para el 3.

### C

`12`

> Eso pasaría con un `return` sin etiqueta dentro de `main`: saldría de la función entera y el `!` no llegaría a imprimirse.

### D

Error de compilación: no se puede usar `return` dentro de una lambda.

> Con etiqueta (`return@forEach`) sí se puede: indica que se vuelve de la lambda, no de la función.

## kt-buc-012 {dificultad=2 tipo=salida ancla=5-el-modismo-agil-repeatn}

¿Qué imprime este código?

```kotlin
var total = 0
repeat(3) { i ->
    repeat(2) { total += i }
}
println(total)
```

### A ✔

`6`

> Correcto. El `repeat` externo da `i` = 0, 1 y 2. Para cada uno, el interno suma `i` dos veces: (0 + 1 + 2) × 2 = 6.

### B

`3`

> El `repeat` interno suma `i` **dos** veces en cada vuelta externa.

### C

`12`

> Los índices de `repeat` empiezan en 0, no en 1: se suman 0, 1 y 2.

### D

Error de compilación: no se puede anidar `repeat`.

> `repeat` es una función normal que recibe una lambda, y se puede anidar. Nombrar el parámetro (`i ->`) evita confundir los dos `it`.

## kt-buc-013 {dificultad=2 tipo=salida ancla=61-ejemplo-practico-suma-de-numeros-pares}

¿Qué imprime este código?

```kotlin
println((1..10).filter { it % 2 == 0 }.sum())
```

### A ✔

`30`

> Correcto. `filter` deja los pares del 1 al 10 (2, 4, 6, 8, 10) y `sum()` los suma: 30. Es la versión declarativa de un bucle con acumulador.

### B

`55`

> Esa es la suma de todos los números del 1 al 10. `filter` descarta los impares.

### C

`25`

> 25 es la suma de los **impares**. La condición `it % 2 == 0` selecciona los pares.

### D

`[2, 4, 6, 8, 10]`

> `sum()` reduce la lista a un único número.

## kt-buc-014 {dificultad=1 tipo=salida ancla=21-rango-inclusivo}

¿Qué imprime este código?

```kotlin
println('c' in 'a'..'e')
println(10 in 1..9)
```

### A ✔

```text
true
false
```

> Correcto. Los rangos también funcionan con `Char`, y `in` comprueba la pertenencia: `'c'` está entre `'a'` y `'e'`, y 10 está fuera de `1..9`.

### B

```text
false
false
```

> `'a'..'e'` es un rango de caracteres válido que incluye `'c'`.

### C

Error de compilación: no existen rangos de `Char`.

> Sí existen: `'a'..'z'` es un `CharRange` y se puede recorrer o usar con `in`.

### D

```text
true
true
```

> `1..9` termina en 9 (incluido), así que el 10 queda fuera.

## kt-buc-015 {dificultad=2 tipo=salida ancla=22-rango-semiabierto-until}

¿Qué imprime este código?

```kotlin
val pesos = listOf(10, 20, 30)
var suma = 0
for (i in 0 until pesos.size) {
    suma += pesos[i] * i
}
println(suma)
```

### A ✔

`80`

> Correcto. `0 until size` recorre los índices 0, 1 y 2: 10·0 + 20·1 + 30·2 = 0 + 20 + 60 = 80.

### B

`140`

> Los índices empiezan en 0, así que el primer término es 10·0 = 0.

### C

Lanza `IndexOutOfBoundsException`.

> `until` excluye `pesos.size` (3), así que el último índice es 2, que es válido.

### D

`60`

> Hay que sumar todos los términos: 0 + 20 + 60.

## kt-buc-016 {dificultad=2 tipo=compila error ancla=2-el-bucle-for-y-las-progresiones-numericas}

¿Qué ocurre al compilar este fragmento?

```kotlin
for (i in 1..3) {
    i = i + 1
    println(i)
}
```

### A ✔

Error de compilación: la variable del `for` es de solo lectura (`val`).

> Correcto. En cada vuelta, `i` toma el siguiente valor del rango y no se puede modificar dentro del cuerpo. Si necesitas otro valor, usa una variable local.

### B

Compila e imprime `2`, `3` y `4`.

> En Java se podía modificar la variable de un `for`. En Kotlin la variable del bucle es inmutable.

### C

Compila e imprime `2` y `4`, porque se salta valores.

> No llega a compilar. Para saltar valores se usa `step`.

### D

Bucle infinito.

> El rango tiene un número fijo de elementos; además, este código no compila.

## kt-buc-017 {dificultad=3 tipo=salida ancla=32-bucle-do-while-comprobacion-posterior}

¿Qué imprime este código?

```kotlin
var x = 3
do {
    x -= 2
} while (x > 0)
println(x)
```

### A ✔

`-1`

> Correcto. `x` pasa de 3 a 1 (como `1 > 0`, se repite) y de 1 a −1 (como `-1 > 0` es falso, termina).

### B

`1`

> Con `x = 1` la condición `1 > 0` aún es cierta, así que se hace otra vuelta.

### C

`0`

> `x` baja de 2 en 2 desde 3 (3, 1, −1) y nunca vale 0.

### D

`3`

> En un `do-while` el cuerpo se ejecuta al menos una vez, así que `x` cambia seguro.

## kt-buc-018 {dificultad=2 tipo=salida ancla=25-iteracion-sobre-cadenas-y-colecciones-con-indice}

¿Qué imprime este código?

```kotlin
var vocales = 0
for (c in "programacion") {
    if (c in "aeiou") vocales++
}
println(vocales)
```

### A ✔

`5`

> Correcto. En «programacion» las vocales son o, a, a, i, o: 5. `c in "aeiou"` comprueba si el carácter está en la cadena.

### B

`4`

> Hay que contar cada aparición: la `a` y la `o` aparecen dos veces.

### C

`3`

> El contador suma **cada** vocal que aparece, no las vocales distintas.

### D

Error de compilación: `in` no se puede usar con `String`.

> `String` tiene `contains(Char)`, así que `c in "aeiou"` es válido.

## kt-buc-019 {dificultad=1 tipo=salida ancla=21-rango-inclusivo}

¿Qué imprime este código?

```kotlin
for (i in 1..3) println("*".repeat(i))
```

### A ✔

```text
*
**
***
```

> Correcto. En cada vuelta se repite el asterisco `i` veces: 1, 2 y 3.

### B

```text
***
***
***
```

> `repeat(i)` usa el valor de `i` de cada vuelta, que va cambiando.

### C

```text
******
```

> Se usa `println`, que escribe cada resultado en una línea distinta.

### D

```text
*
**
```

> `1..3` incluye el 3, así que hay tres vueltas.

## kt-buc-020 {dificultad=1 tipo=salida ancla=6-comparativa-a-fondo-nivel-imperativo-vs-nivel-declarativo}

¿Qué imprime este código?

```kotlin
var mayor = Int.MIN_VALUE
for (x in listOf(3, 7, 2)) {
    if (x > mayor) mayor = x
}
println(mayor)
```

### A ✔

`7`

> Correcto. Es el algoritmo imperativo clásico del máximo. Se empieza con el menor `Int` posible para que cualquier elemento lo supere. La versión declarativa sería `listOf(3, 7, 2).max()`.

### B

`2`

> `mayor` solo se actualiza cuando aparece un valor más grande, así que el 2 final no lo sustituye.

### C

`-2147483648`

> Ese es el valor inicial, pero el primer elemento ya lo supera.

### D

`3`

> Al llegar al 7, se actualiza `mayor`.

## kt-buc-021 {dificultad=2 tipo=salida ancla=31-bucle-while-comprobacion-previa}

¿Qué imprime este código?

```kotlin
val s = "abc"
var i = 0
while (i < s.length) {
    print(s[s.length - 1 - i])
    i++
}
```

### A ✔

`cba`

> Correcto. Con `i` = 0, 1 y 2 se accede a las posiciones 2, 1 y 0: la cadena se recorre al revés.

### B

`abc`

> El índice `s.length - 1 - i` empieza por el **final** de la cadena.

### C

Lanza `StringIndexOutOfBoundsException`.

> El índice más alto que se usa es 2, que es válido para `"abc"`.

### D

`cb`

> El bucle da tres vueltas, de `i = 0` a `i = 2`.

## kt-buc-022 {dificultad=1 tipo=salida ancla=25-iteracion-sobre-cadenas-y-colecciones-con-indice}

¿Qué imprime este código?

```kotlin
listOf("a", "b").forEachIndexed { i, v -> print("$i=$v ") }
```

### A ✔

`0=a 1=b`

> Correcto. `forEachIndexed` pasa a la lambda el índice y el elemento, en ese orden.

### B

`a=0 b=1`

> El primer parámetro de la lambda es el **índice** y el segundo, el elemento.

### C

`1=a 2=b`

> Los índices empiezan en 0.

### D

Error de compilación: una lambda no puede tener dos parámetros.

> Puede tener varios; lo que no puede es usar `it` en ese caso.

## kt-buc-023 {dificultad=3 tipo=salida ancla=4-control-de-flujo-con-etiquetas-labels}

¿Qué imprime este código?

```kotlin
buscar@ for (fila in 0..2) {
    for (col in 0..2) {
        if (fila * col == 2) {
            println("($fila,$col)")
            break@buscar
        }
    }
}
```

### A ✔

`(1,2)`

> Correcto. La primera combinación cuyo producto es 2 es fila 1 y columna 2. `break@buscar` termina **los dos** bucles, así que no se busca más (y `(2,1)` no llega a imprimirse).

### B

```text
(1,2)
(2,1)
```

> Con un `break` sin etiqueta se saldría solo del bucle interno y se encontraría también `(2,1)`. La etiqueta sale del externo.

### C

`(2,1)`

> Las filas se recorren en orden, y la fila 1 va antes que la 2.

### D

No imprime nada.

> 1 · 2 = 2, así que sí hay una coincidencia.

## kt-buc-024 {dificultad=2 tipo=salida ancla=5-el-modismo-agil-repeatn}

¿Qué imprime este código?

```kotlin
val sb = StringBuilder()
repeat(3) { sb.append(it).append('-') }
println(sb)
```

### A ✔

`0-1-2-`

> Correcto. `repeat` da los índices 0, 1 y 2, y cada vuelta añade el número y un guion. `append` devuelve el propio `StringBuilder`, por eso se puede encadenar.

### B

`1-2-3-`

> Los índices de `repeat` empiezan en 0.

### C

`0-1-2`

> El guion se añade en **cada** vuelta, también en la última.

### D

`---`

> Antes de cada guion se añade `it`, el índice.

## kt-buc-025 {dificultad=1 tipo=salida ancla=61-ejemplo-practico-suma-de-numeros-pares}

¿Qué imprime este código?

```kotlin
println((1..100).count { it % 10 == 0 })
```

### A ✔

`10`

> Correcto. Los múltiplos de 10 entre 1 y 100 son 10, 20, …, 100: diez números. Un rango admite directamente operaciones como `count`, `filter` o `sum`.

### B

`9`

> El rango `1..100` incluye el 100, que también es múltiplo de 10.

### C

`100`

> `count { }` solo cuenta los elementos que cumplen la condición.

### D

`550`

> Esa sería la **suma** de los múltiplos (`filter { … }.sum()`).

## kt-buc-026 {dificultad=2 tipo=salida ancla=23-cuenta-atras-inversa-downto}

¿Qué imprime este código?

```kotlin
val cuentaAtras = 5 downTo 1
println(cuentaAtras.first)
println(cuentaAtras.last)
println(cuentaAtras.toList())
```

### A ✔

```text
5
1
[5, 4, 3, 2, 1]
```

> Correcto. Una progresión es un objeto: se puede guardar en una variable, consultar su primer y último valor, o convertirla en lista.

### B

```text
1
5
[1, 2, 3, 4, 5]
```

> `downTo` va hacia abajo, así que el primer valor es 5.

### C

Error de compilación: un rango solo se puede usar en un `for`.

> Un rango o progresión es un valor como cualquier otro.

### D

```text
5
1
5 downTo 1
```

> `toList()` crea una lista con todos los valores de la progresión.

## kt-buc-027 {dificultad=2 tipo=salida ancla=22-rango-semiabierto-until}

¿Qué imprime este código?

```kotlin
val vacia = emptyList<String>()
for (i in 0 until vacia.size) print("x")
println("fin")
```

### A ✔

`fin`

> Correcto. `0 until 0` es un rango **vacío**, así que el bucle no se ejecuta. Por eso `until` es tan cómodo con índices: funciona bien con listas vacías.

### B

`xfin`

> `until` excluye el límite, y como el límite es 0, no hay ningún valor.

### C

Lanza `IndexOutOfBoundsException`.

> El bucle no llega a acceder a la lista.

### D

Error de compilación: `emptyList` necesita un tamaño.

> `emptyList<String>()` crea una lista vacía con el tipo indicado.

## kt-buc-028 {dificultad=2 tipo=salida ancla=24-saltos-personalizados-step}

¿Qué imprime este código?

```kotlin
for (c in 'a'..'g' step 2) print(c)
```

### A ✔

`aceg`

> Correcto. Los rangos de caracteres también admiten `step`: se salta de dos en dos letras.

### B

`abcdefg`

> `step 2` toma una letra sí y otra no.

### C

`bdf`

> Se empieza por el primer valor del rango, la `a`.

### D

Error de compilación: `step` solo funciona con números.

> También funciona con `CharRange`, porque los caracteres tienen un orden.

## kt-buc-029 {dificultad=3 tipo=compila error ancla=2-el-bucle-for-y-las-progresiones-numericas}

¿Qué ocurre al compilar este fragmento?

```kotlin
for (x in 1.0..3.0) println(x)
```

### A ✔

Error de compilación: un rango de `Double` no se puede recorrer; solo sirve para comprobar con `in`.

> Correcto. Entre 1.0 y 3.0 hay infinitos números, así que no hay un «siguiente valor» natural. Los rangos de `Double` sirven para `x in 1.0..3.0`, pero no para iterar.

### B

Imprime `1.0`, `2.0` y `3.0`.

> No se asume ningún paso de 1: el rango de `Double` no es iterable.

### C

Imprime valores de 0.1 en 0.1.

> No existe un paso por defecto para decimales.

### D

Bucle infinito.

> No llega a compilar.

## kt-buc-030 {dificultad=2 tipo=salida ancla=2-el-bucle-for-y-las-progresiones-numericas}

¿Qué imprime este código?

```kotlin
var parejas = 0
for (i in 1..3) {
    for (j in i..3) parejas++
}
println(parejas)
```

### A ✔

`6`

> Correcto. El bucle interno empieza en `i`: con `i = 1` da 3 vueltas, con `i = 2` da 2 y con `i = 3` da 1. En total, 3 + 2 + 1 = 6.

### B

`9`

> Serían 9 si el bucle interno empezase siempre en 1. Aquí empieza en `i`.

### C

`3`

> Se cuentan todas las vueltas del bucle **interno**, no las del externo.

### D

`4`

> Hay que sumar las vueltas de cada `i`: 3, 2 y 1.

## kt-buc-031 {dificultad=2 tipo=salida ancla=31-bucle-while-comprobacion-previa}

¿Qué imprime este código?

```kotlin
var n = 1234
var suma = 0
while (n > 0) {
    suma += n % 10
    n /= 10
}
println(suma)
```

### A ✔

`10`

> Correcto. `n % 10` extrae la última cifra y `n /= 10` la elimina (división entera). Se suman 4 + 3 + 2 + 1 = 10.

### B

`1234`

> El bucle suma las **cifras**, no el número.

### C

`4`

> El bucle sigue mientras `n > 0`, así que procesa todas las cifras.

### D

Bucle infinito.

> La división entera hace que `n` llegue a 0 (123, 12, 1, 0).

## kt-buc-032 {dificultad=1 tipo=concepto ancla=32-bucle-do-while-comprobacion-posterior}

¿Qué bucle garantiza que su cuerpo se ejecuta **al menos una vez**?

### A ✔

`do { ... } while (condición)`

> Correcto. La condición se comprueba **después** de cada vuelta, así que la primera siempre se hace. Es útil, por ejemplo, para pedir un dato hasta que sea válido.

### B

`while (condición) { ... }`

> `while` comprueba antes de entrar: si la condición es falsa desde el principio, no se ejecuta nunca.

### C

`for (i in 0 until n) { ... }`

> Si `n` es 0, el rango está vacío y no hay ninguna vuelta.

### D

`repeat(n) { ... }`

> Con `n = 0`, `repeat` no ejecuta la lambda.

## kt-buc-033 {dificultad=3 tipo=salida ancla=4-control-de-flujo-con-etiquetas-labels}

¿Qué imprime este programa?

```kotlin
fun primerPar(lista: List<Int>): Int {
    lista.forEach {
        if (it % 2 == 0) return it
    }
    return -1
}

fun main() {
    println(primerPar(listOf(3, 5, 8, 10)))
}
```

### A ✔

`8`

> Correcto. Un `return` **sin etiqueta** dentro de la lambda de `forEach` sale de la función que la contiene (`primerPar`). Esto es posible porque `forEach` es una función `inline`.

### B

`-1`

> El `return it` no sale solo de la lambda: termina `primerPar` y devuelve 8.

### C

`10`

> Se devuelve el **primer** par encontrado, y el recorrido se detiene ahí.

### D

Error de compilación: no se puede usar `return` dentro de una lambda.

> Dentro de una función `inline` como `forEach` sí se puede, y sale de la función externa. Para salir solo de la lambda se usa `return@forEach`.

## kt-buc-034 {dificultad=2 tipo=salida ancla=25-iteracion-sobre-cadenas-y-colecciones-con-indice}

¿Qué imprime este código?

```kotlin
val numeros = listOf(1, 2, 3)
val letras = listOf("x", "y")
for ((n, l) in numeros.zip(letras)) print("$n$l ")
```

### A ✔

`1x 2y`

> Correcto. `zip` empareja los elementos de dos colecciones por posición y para en la **más corta**. Cada `Pair` se desestructura en el `for`.

### B

`1x 2y 3null`

> `zip` no rellena con `null`: se detiene al acabarse la lista más corta.

### C

Lanza `IndexOutOfBoundsException`.

> `zip` gestiona listas de distinto tamaño sin errores.

### D

`1x 2y 3x`

> No vuelve a empezar la lista corta.

## kt-buc-035 {dificultad=1 tipo=salida ancla=21-rango-inclusivo}

¿Qué imprime este código?

```kotlin
println((1..5).joinToString("-"))
```

### A ✔

`1-2-3-4-5`

> Correcto. `joinToString` une los elementos en un `String`, poniendo entre ellos el separador indicado (y no al final).

### B

`1..5`

> El rango se recorre elemento a elemento al unirlo.

### C

`1-2-3-4-5-`

> El separador va **entre** los elementos, no después del último.

### D

`[1, 2, 3, 4, 5]`

> Ese sería el formato de `toList()`. `joinToString` usa el separador indicado y no añade corchetes.

## kt-buc-036 {dificultad=2 tipo=salida ancla=23-cuenta-atras-inversa-downto}

¿Qué imprime este código?

```kotlin
println(3 in 5 downTo 1)
println(3 in 5..1)
```

### A ✔

```text
true
false
```

> Correcto. `5 downTo 1` contiene los números del 5 al 1, entre ellos el 3. En cambio, `5..1` es un rango **vacío**, así que no contiene nada.

### B

```text
true
true
```

> `5..1` no equivale a `5 downTo 1`: `..` siempre va hacia arriba, así que está vacío.

### C

```text
false
false
```

> `downTo` sí incluye todos los números entre 5 y 1.

### D

Error de compilación: no se puede usar `in` con `downTo`.

> Una progresión decreciente también admite `in`.
