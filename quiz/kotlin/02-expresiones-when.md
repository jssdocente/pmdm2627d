---
bloque: 2
titulo: Expresiones, if y when
apuntes: temas/00-android/00-kotlin/12.1-when.md
---

## kt-when-001 {dificultad=1 tipo=salida ancla=3-when-sin-argumento-el-modo-if-else-if-inteligente}

¿Qué imprime este código?

```kotlin
val x = 15
val r = when {
    x % 15 == 0 -> "FizzBuzz"
    x % 3 == 0 -> "Fizz"
    x % 5 == 0 -> "Buzz"
    else -> x.toString()
}
println(r)
```

### A ✔

`FizzBuzz`

> Correcto. Un `when` sin argumento evalúa las condiciones **en orden** y se queda con la **primera** que sea cierta. `15 % 15 == 0` ya es verdadera.

### B

`Fizz`

> `15` también es múltiplo de 3, pero esa rama está después. `when` no sigue comprobando ramas una vez encuentra una verdadera.

### C

`FizzBuzzFizzBuzz`

> `when` ejecuta **una sola rama**: no hay «caída» (*fall-through*) entre ramas como en el `switch` de Java sin `break`.

### D

`15`

> La rama `else` solo se usa cuando ninguna condición anterior se cumple, y aquí se cumple la primera.

## kt-when-002 {dificultad=2 tipo=salida ancla=5-when-para-comprobar-rangos-y-colecciones}

¿Qué imprime este programa?

```kotlin
fun clasificar(c: Char) = when (c) {
    in "aeiou" -> "vocal"
    in 'a'..'z' -> "consonante"
    else -> "otro"
}

fun main() {
    println(listOf('e', 'k', '7').map { clasificar(it) })
}
```

### A ✔

`[vocal, consonante, otro]`

> Correcto. `in` comprueba la pertenencia a **cualquier cosa** que tenga `contains`: un `String` (sus caracteres) o un rango de `Char`. Las ramas se evalúan en orden: `'e'` entra en la primera y `'k'` en la segunda.

### B

`[consonante, consonante, otro]`

> `'e'` está en `"aeiou"`, y esa rama va antes. `when` se queda con la **primera** rama que coincide, aunque `'e'` también esté en `'a'..'z'`.

### C

`[vocal, consonante, consonante]`

> `'7'` no está en el rango `'a'..'z'` (los dígitos van antes que las letras en la tabla de caracteres), así que cae en `else`.

### D

Error de compilación: `in` no se puede usar con un `String`.

> `String` implementa `contains(Char)`, así que `c in "aeiou"` es válido y muy idiomático.

## kt-when-003 {dificultad=2 tipo=compila error ancla=2-when-como-expresion-su-primer-superpoder}

¿Qué ocurre al compilar este fragmento?

```kotlin
val nivel = 3
val texto: String = when (nivel) {
    1 -> "Bajo"
    2 -> "Medio"
}
println(texto)
```

### A ✔

Error de compilación: el `when` usado como expresión debe ser exhaustivo y falta `else`.

> Correcto. Si `when` **devuelve un valor**, debe cubrir todos los casos posibles. Con un `Int` eso solo se consigue con una rama `else`.

### B

Compila e imprime una cadena vacía.

> Kotlin no inventa un valor por defecto. Si `nivel` no coincide con ninguna rama, `texto` no tendría valor, y por eso el compilador lo rechaza.

### C

Compila, pero lanza una excepción porque `3` no tiene rama.

> El problema se detecta **en compilación**. Esa es la gracia: el compilador garantiza que la expresión siempre produce un `String`.

### D

Compila e imprime `null`.

> `texto` es de tipo `String` (no anulable), así que no puede valer `null`. Aunque fuese `String?`, `when` seguiría necesitando `else`.

## kt-expr-004 {dificultad=2 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val n = 4
val r = if (n > 3) {
    println("grande")
    n * 10
} else {
    0
}
println(r)
```

### A ✔

```text
grande
40
```

> Correcto. `if` es una **expresión**: el valor de cada bloque es su **última expresión**. Se ejecuta el `println` y el bloque vale `n * 10`, es decir, `40`.

### B

```text
40
```

> El `println("grande")` también se ejecuta: forma parte del bloque. Lo que no se usa como valor es su resultado, solo la última línea (`n * 10`).

### C

```text
grande
kotlin.Unit
```

> El valor del bloque es la **última** expresión (`n * 10`), no la primera. `Unit` sería el valor si el bloque terminase en el `println`.

### D

Error de compilación: un `if` con llaves no puede devolver un valor.

> Puede: con o sin llaves, `if`/`else` es una expresión en Kotlin. Por eso no existe el operador ternario `?:` de Java.

## kt-when-005 {dificultad=1 tipo=salida ancla=1-el-caso-basico-when-como-un-switch-mejorado}

¿Qué imprime este código?

```kotlin
val dia = "sábado"
when (dia) {
    "sábado", "domingo" -> println("Fin de semana")
    else -> println("Laborable")
}
```

### A ✔

`Fin de semana`

> Correcto. Una rama de `when` puede agrupar varios valores separados por comas: se elige si el argumento coincide con **cualquiera** de ellos.

### B

`Laborable`

> `"sábado"` coincide con el primer valor de la rama. Además, `when` compara `String` por contenido, sin problemas.

### C

Error de compilación: una rama no puede tener dos valores.

> Sí puede: `"sábado", "domingo" ->` es la forma de agrupar casos (en Java se apilaban varios `case`).

### D

No imprime nada, porque falta `break`.

> En `when` no existe `break` entre ramas: se ejecuta solo la rama elegida y se sale.

## kt-expr-006 {dificultad=1 tipo=concepto ancla=12-expresiones-vs-sentencias.md#diferencias-entre-expresiones-y-sentencias}

¿Cuál es la forma idiomática en Kotlin de escribir este código Java?

```java
int max = a > b ? a : b;
```

### A ✔

`val max = if (a > b) a else b`

> Correcto. En Kotlin `if` es una expresión que devuelve un valor, así que sustituye al operador ternario.

### B

`val max = a > b ? a : b`

> Kotlin **no tiene** operador ternario. `?:` existe, pero es el operador Elvis (para valores nulos), no un ternario.

### C

`val max = when a > b -> a else -> b`

> Esa sintaxis no existe. Con `when` sería `when { a > b -> a; else -> b }`, pero para dos casos lo idiomático es `if`.

### D

`val max = (a > b).then(a).otherwise(b)`

> `Boolean` no tiene esos métodos. No hace falta ninguna función: `if` ya devuelve un valor.

## kt-when-007 {dificultad=2 tipo=salida ancla=3-when-sin-argumento-el-modo-if-else-if-inteligente}

¿Qué imprime este código?

```kotlin
val temperatura = 25
val sensacion = when {
    temperatura < 10 -> "frío"
    temperatura < 25 -> "templado"
    else -> "calor"
}
println(sensacion)
```

### A ✔

`calor`

> Correcto. `25 < 25` es falso (el límite no se incluye), así que ninguna de las dos primeras condiciones se cumple y se usa `else`.

### B

`templado`

> Cuidado con el límite: `<` es estricto. Para incluir 25 haría falta `<=`.

### C

`frío`

> 25 no es menor que 10. Las condiciones se evalúan en orden y la primera ya es falsa.

### D

Error de compilación: un `when` sin argumento necesita `else` en todas las ramas.

> Basta con una rama `else` al final para que la expresión sea exhaustiva.

## kt-expr-008 {dificultad=2 tipo=salida ancla=12-expresiones-vs-sentencias.md#sentencias}

¿Qué imprime este código?

```kotlin
val n = 7
when (n) {
    1 -> println("uno")
    2 -> println("dos")
}
println("fin")
```

### A ✔

`fin`

> Correcto. Aquí `when` se usa como **sentencia** (su valor no se guarda), así que no tiene por qué ser exhaustivo: si ninguna rama coincide, no hace nada.

### B

Error de compilación: falta la rama `else`.

> `else` solo es obligatorio cuando `when` se usa como **expresión** (su resultado se asigna o se devuelve). Como sentencia es opcional.

### C

Lanza una excepción porque 7 no tiene rama.

> Un `when` sin coincidencias no lanza nada: simplemente no ejecuta ninguna rama.

### D

```text
dos
fin
```

> `when` no elige «la más cercana»: solo ejecuta una rama si el valor coincide exactamente.

## kt-when-009 {dificultad=1 tipo=salida ancla=5-when-para-comprobar-rangos-y-colecciones}

¿Qué imprime este código?

```kotlin
val vip = listOf("ana", "luis")
val usuario = "luis"
val acceso = when (usuario) {
    in vip -> "Acceso VIP"
    else -> "Acceso general"
}
println(acceso)
```

### A ✔

`Acceso VIP`

> Correcto. `in vip` comprueba si el valor está contenido en la lista. `"luis"` está en ella.

### B

`Acceso general`

> `in` busca en toda la colección, no solo en el primer elemento.

### C

Error de compilación: `in` solo funciona con rangos numéricos.

> `in` funciona con cualquier tipo que tenga `contains`: rangos, listas, conjuntos, cadenas…

### D

Error de compilación: hay que escribir `vip.contains(usuario) ->`.

> Dentro de `when (usuario)` la forma idiomática es `in vip`. Equivale a `vip.contains(usuario)`.

## kt-expr-010 {dificultad=2 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val nota = 4.7
val resultado = if (nota >= 5) "aprobado"
                else if (nota >= 4.5) "casi"
                else "suspenso"
println(resultado)
```

### A ✔

`casi`

> Correcto. Toda la cadena `if / else if / else` es una única expresión. Como 4.7 no llega a 5 pero sí a 4.5, vale `"casi"`.

### B

`suspenso`

> La segunda condición (`nota >= 4.5`) sí se cumple, así que no se llega al `else` final.

### C

`aprobado`

> 4.7 es menor que 5, así que la primera condición es falsa.

### D

Error de compilación: `else if` no se puede usar como expresión.

> Sí se puede, siempre que haya un `else` final que garantice un valor en todos los casos.

## kt-when-011 {dificultad=2 tipo=salida ancla=2-when-como-expresion-su-primer-superpoder}

¿Qué imprime este programa?

```kotlin
fun signo(n: Int) = when {
    n > 0 -> 1
    n < 0 -> -1
    else -> 0
}

fun main() {
    println(signo(-5) + signo(0) + signo(9))
}
```

### A ✔

`0`

> Correcto. `signo(-5)` = −1, `signo(0)` = 0 y `signo(9)` = 1. La suma es 0. La función tiene cuerpo de expresión (`=`) que devuelve directamente el valor del `when`.

### B

`2`

> `signo(-5)` devuelve −1, no 1: la rama `n < 0` resta.

### C

`4`

> La función devuelve el **signo** (−1, 0 o 1), no el número.

### D

Error de compilación: una función con `=` no puede contener un `when`.

> Una función de expresión única admite cualquier expresión, incluido un `when` de varias líneas.

## kt-expr-012 {dificultad=2 tipo=concepto ancla=12-expresiones-vs-sentencias.md#diferencias-entre-expresiones-y-sentencias}

¿Cuál de estas construcciones es una **sentencia** en Kotlin (no produce un valor utilizable)?

### A ✔

La asignación `x = 5`

> Correcto. En Kotlin la asignación no es una expresión: no se puede escribir `val y = (x = 5)`, a diferencia de Java o C.

### B

`if (a > b) a else b`

> `if` con `else` es una expresión: devuelve el valor de la rama elegida.

### C

`when (x) { 1 -> "uno" else -> "otro" }`

> `when` también es una expresión cuando tiene sus ramas completas.

### D

`try { texto.toInt() } catch (e: Exception) { 0 }`

> `try` también es una expresión: vale el resultado del bloque `try` o el del `catch`.

## kt-expr-013 {dificultad=3 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val r = try {
    println("intento")
    10
} finally {
    println("limpieza")
}
println(r)
```

### A ✔

```text
intento
limpieza
10
```

> Correcto. El bloque `finally` se ejecuta **siempre** al salir del `try`, pero **no** aporta el valor de la expresión: el valor de `try` es la última expresión del bloque `try` (10).

### B

```text
intento
10
```

> `finally` se ejecuta siempre, haya excepción o no.

### C

```text
intento
limpieza
kotlin.Unit
```

> El valor de la expresión lo da el bloque `try`, no el `finally`.

### D

Error de compilación: un `try` sin `catch` no puede usarse como expresión.

> `try` puede ir con `catch`, con `finally` o con ambos, y en todos los casos es una expresión.

## kt-expr-014 {dificultad=2 tipo=compila error ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué ocurre al compilar este fragmento?

```kotlin
val activo = true
val texto = if (activo) "sí"
println(texto)
```

### A ✔

Error de compilación: un `if` usado como expresión debe tener rama `else`.

> Correcto. Si `activo` fuera `false`, `texto` no tendría valor. Por eso el compilador exige `else` cuando el `if` produce un valor.

### B

Compila e imprime `sí`.

> Aunque aquí `activo` sea `true`, el compilador exige que la expresión tenga valor en **todos** los casos.

### C

Compila, y si `activo` fuese `false`, `texto` valdría `null`.

> Kotlin no rellena con `null` la rama que falta: da un error de compilación.

### D

Compila, y si `activo` fuese `false`, `texto` valdría `""`.

> No existe un valor por defecto: hay que escribir el `else`.

## kt-when-015 {dificultad=2 tipo=salida ancla=2-when-como-expresion-su-primer-superpoder}

¿Qué imprime este código?

```kotlin
val r = when (2) {
    1 -> "a"
    2 -> {
        println("dos")
        "b"
    }
    else -> "c"
}
println(r)
```

### A ✔

```text
dos
b
```

> Correcto. Una rama puede ser un bloque `{ }`: se ejecuta entero y el valor de la rama es su **última expresión** (`"b"`).

### B

```text
b
```

> El `println("dos")` también se ejecuta al entrar en la rama. Lo que no se usa como valor es su resultado.

### C

```text
dos
kotlin.Unit
```

> El valor del bloque es la **última** línea, `"b"`, no el `println`.

### D

Error de compilación: una rama de `when` no puede tener varias líneas.

> Sí puede, si se encierra entre llaves.

## kt-when-016 {dificultad=3 tipo=salida ancla=5-when-para-comprobar-rangos-y-colecciones}

¿Qué imprime este código?

```kotlin
val edad = 65
val grupo = when (edad) {
    in 0..17 -> "menor"
    in 18..64 -> "adulto"
    !in 0..120 -> "edad no válida"
    else -> "senior"
}
println(grupo)
```

### A ✔

`senior`

> Correcto. 65 no está en `0..17` ni en `18..64`, y la rama `!in 0..120` no se cumple porque 65 **sí** está en ese rango. Así que se llega a `else`.

### B

`adulto`

> El rango `18..64` incluye el 64, pero no el 65.

### C

`edad no válida`

> `!in 0..120` se cumple solo si la edad está **fuera** del rango. 65 está dentro.

### D

Error de compilación: `!in` no se puede usar en una rama de `when`.

> `!in` es válido en `when`: comprueba que el valor **no** pertenece al rango o colección.

## kt-when-017 {dificultad=2 tipo=salida ancla=4-when-para-comprobar-tipos-con-smart-casting}

¿Qué imprime este programa?

```kotlin
fun tamano(x: Any) = when (x) {
    is String -> x.length
    is List<*> -> x.size
    else -> 0
}

fun main() {
    println(tamano(listOf(1, 2, 3)) + tamano("ab") + tamano(7))
}
```

### A ✔

`5`

> Correcto. Cada rama `is` hace un *smart cast*: en la de `List<*>` se puede usar `size` y en la de `String`, `length`. 3 + 2 + 0 = 5.

### B

`6`

> `tamano(7)` cae en `else`, que devuelve 0, no 1.

### C

Error de compilación: no se puede comprobar `is List` sin indicar el tipo de los elementos.

> Por eso se escribe `List<*>` (lista de elementos de tipo desconocido): en ejecución no se sabe el tipo genérico.

### D

`3`

> También se suma la longitud de `"ab"`.

## kt-when-018 {dificultad=3 tipo=salida ancla=2-when-como-expresion-su-primer-superpoder}

¿Qué imprime este código?

```kotlin
val texto = when (val n = "12".toIntOrNull()) {
    null -> "no es un número"
    in 0..9 -> "una cifra"
    else -> "varias cifras: $n"
}
println(texto)
```

### A ✔

`varias cifras: 12`

> Correcto. `when (val n = ...)` declara una variable que solo existe dentro del `when`. `"12"` se convierte en 12, que no es `null` ni está en `0..9`.

### B

`una cifra`

> El rango `0..9` no incluye el 12.

### C

`no es un número`

> `"12".toIntOrNull()` sí es un número válido.

### D

Error de compilación: no se puede declarar una variable dentro de `when`.

> Desde Kotlin 1.3 se puede: `when (val x = ...)` limita la variable al propio `when`.

## kt-when-019 {dificultad=2 tipo=salida ancla=2-when-como-expresion-su-primer-superpoder}

¿Qué imprime este código?

```kotlin
val activo = false
val estado = when (activo) {
    true -> "encendido"
    false -> "apagado"
}
println(estado)
```

### A ✔

`apagado`

> Correcto. Un `Boolean` solo tiene dos valores, así que con `true` y `false` el `when` ya es exhaustivo y no necesita `else`.

### B

Error de compilación: falta la rama `else`.

> Con `Boolean` (igual que con `enum` o `sealed`), cubrir todos los valores basta.

### C

`encendido`

> `activo` es `false`.

### D

`false`

> Se imprime el texto de la rama elegida.

## kt-when-020 {dificultad=3 tipo=compila error ancla=1-el-caso-basico-when-como-un-switch-mejorado}

¿Qué ocurre al compilar este fragmento?

```kotlin
val x = 2
val r = when (x) {
    1 -> "uno"
    "dos" -> "dos"
    else -> "otro"
}
```

### A ✔

Error de compilación: `x` es `Int` y la rama `"dos"` es un `String`; nunca podrían ser iguales.

> Correcto. El compilador detecta que comparar un `Int` con un `String` no tiene sentido y lo rechaza.

### B

Compila, y `r` vale `"dos"`.

> 2 (un `Int`) no es igual a `"dos"` (un `String`), y además no compila.

### C

Compila, y `r` vale `"otro"`.

> Sería así en un lenguaje sin comprobación de tipos. Kotlin detecta el problema en compilación.

### D

Compila, pero lanza `ClassCastException`.

> El error es de compilación.

## kt-expr-021 {dificultad=1 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val n = 3
println("Tienes $n ${if (n == 1) "mensaje" else "mensajes"}")
```

### A ✔

`Tienes 3 mensajes`

> Correcto. Como `if` es una expresión, se puede usar dentro de una plantilla `${...}` para elegir el texto.

### B

`Tienes 3 mensaje`

> `n` es 3, así que la condición `n == 1` es falsa.

### C

Error de compilación: no se puede poner un `if` dentro de una plantilla.

> Dentro de `${}` cabe cualquier expresión, también un `if`.

### D

`Tienes 3 true`

> Se imprime el valor de la rama elegida, no la condición.

## kt-expr-022 {dificultad=2 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val a = 5
val b = 9
val c = 7
val mayor = if (a > b) {
    if (a > c) a else c
} else {
    if (b > c) b else c
}
println(mayor)
```

### A ✔

`9`

> Correcto. `a > b` es falso, así que se evalúa el `else`: `b > c` (9 > 7), y el valor es `b`.

### B

`7`

> Dentro del `else` se compara `b` con `c`, y gana `b`.

### C

`5`

> `a` no es mayor que `b`.

### D

Error de compilación: no se pueden anidar `if` usados como expresión.

> Se pueden anidar: cada `if` interno es la expresión que devuelve su bloque.

## kt-expr-023 {dificultad=1 tipo=salida ancla=12-expresiones-vs-sentencias.md#ejemplo-de-una-funcion-que-usa-sentencias-statement-y-expresiones-expression}

¿Qué imprime este programa?

```kotlin
fun absoluto(n: Int) = if (n < 0) -n else n

fun main() {
    println(absoluto(-4) + absoluto(3))
}
```

### A ✔

`7`

> Correcto. La función devuelve directamente el valor del `if`: 4 + 3 = 7.

### B

`-1`

> `absoluto(-4)` cambia el signo y devuelve 4.

### C

`1`

> Ambos valores se convierten en positivos antes de sumar.

### D

Error de compilación: una función de expresión no puede contener un `if`.

> Puede contener cualquier expresión, y `if`/`else` lo es.

## kt-when-024 {dificultad=2 tipo=salida ancla=1-el-caso-basico-when-como-un-switch-mejorado}

¿Qué imprime este programa?

```kotlin
fun tipo(c: Char) = when (c) {
    'a', 'e', 'i', 'o', 'u' -> "vocal"
    in '0'..'9' -> "dígito"
    else -> "otro"
}

fun main() {
    println("${tipo('7')} ${tipo('e')} ${tipo('#')}")
}
```

### A ✔

`dígito vocal otro`

> Correcto. Una rama puede tener varios valores separados por comas, y otra puede comprobar un rango de caracteres.

### B

`otro vocal otro`

> `'7'` está en el rango de caracteres `'0'..'9'`.

### C

`dígito otro otro`

> `'e'` es uno de los valores de la primera rama.

### D

Error de compilación: no se pueden mezclar valores y rangos en el mismo `when`.

> Cada rama puede usar una forma distinta: valores, `in` rango, `is` tipo…

## kt-when-025 {dificultad=1 tipo=concepto ancla=tabla-comparativa-when-kotlin-vs-switch-java}

¿Cuál de estas afirmaciones sobre `when` frente al `switch` de Java es correcta?

### A ✔

En `when` no hace falta `break`: solo se ejecuta la rama que coincide.

> Correcto. No existe la «caída» (*fall-through*) de una rama a la siguiente, así que se evita un error clásico de Java.

### B

En `when` hay que terminar cada rama con `break`.

> `break` no se usa en `when`: cada rama termina sola.

### C

`when` solo admite valores constantes, igual que `switch`.

> `when` admite rangos, tipos (`is`), colecciones (`in`) y condiciones arbitrarias.

### D

`when` no puede devolver un valor.

> Puede: es una expresión y su resultado se puede asignar.

## kt-when-026 {dificultad=3 tipo=salida ancla=3-when-sin-argumento-el-modo-if-else-if-inteligente}

¿Qué imprime este programa?

```kotlin
fun mayorQueUno(n: Int): Boolean {
    println("compruebo $n")
    return n > 1
}

fun main() {
    val r = when {
        mayorQueUno(1) -> "a"
        mayorQueUno(2) -> "b"
        mayorQueUno(3) -> "c"
        else -> "d"
    }
    println(r)
}
```

### A ✔

```text
compruebo 1
compruebo 2
b
```

> Correcto. `when` evalúa las condiciones **en orden** y se detiene en la primera verdadera. La tercera ni siquiera se llega a evaluar.

### B

```text
compruebo 1
compruebo 2
compruebo 3
b
```

> Una vez encuentra una rama verdadera, `when` no evalúa las siguientes condiciones.

### C

```text
b
```

> Las funciones de las condiciones sí se ejecutan (e imprimen) hasta encontrar la verdadera.

### D

```text
compruebo 1
compruebo 2
compruebo 3
c
```

> `when` se queda con la **primera** rama verdadera, no con la última.

## kt-expr-027 {dificultad=3 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val r = if (true) println("x") else println("y")
println(r)
```

### A ✔

```text
x
kotlin.Unit
```

> Correcto. El `if` es una expresión y su valor es el de la rama elegida: lo que devuelve `println("x")`, que es `Unit`.

### B

```text
x
x
```

> `r` guarda lo que **devuelve** `println`, no lo que imprime.

### C

```text
x
null
```

> `println` devuelve `Unit`, no `null`.

### D

Error de compilación: no se puede asignar un `if` cuyas ramas devuelven `Unit`.

> Se puede: el tipo de `r` es simplemente `Unit`.

## kt-when-028 {dificultad=2 tipo=salida ancla=5-when-para-comprobar-rangos-y-colecciones}

¿Qué imprime este código?

```kotlin
val nota = 6.5
val texto = when (nota) {
    in 0.0..4.99 -> "insuficiente"
    in 5.0..6.99 -> "bien"
    else -> "notable o más"
}
println(texto)
```

### A ✔

`bien`

> Correcto. También se pueden usar rangos de `Double` con `in`. 6.5 está entre 5.0 y 6.99.

### B

`notable o más`

> 6.5 está dentro del segundo rango.

### C

Error de compilación: no existen rangos de `Double`.

> Existen (`ClosedFloatingPointRange`), y sirven para comprobar con `in`. Lo que no se puede es recorrerlos con `for`.

### D

`insuficiente`

> 6.5 es mayor que 4.99.

## kt-expr-029 {dificultad=2 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val r = try {
    listOf(1, 2)[5]
} catch (e: IndexOutOfBoundsException) {
    -1
} catch (e: Exception) {
    -2
}
println(r)
```

### A ✔

`-1`

> Correcto. Los `catch` se comprueban en orden, y se usa el **primero** cuyo tipo encaja con la excepción. El índice 5 no existe, así que se lanza `IndexOutOfBoundsException`.

### B

`-2`

> `IndexOutOfBoundsException` también es una `Exception`, pero su `catch` específico va antes.

### C

`2`

> Acceder a un índice que no existe no devuelve el último elemento: lanza una excepción.

### D

Error de compilación: solo se permite un `catch` por `try`.

> Se pueden encadenar varios `catch`, del más concreto al más general.

## kt-expr-030 {dificultad=3 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este programa?

```kotlin
fun dividir(a: Int, b: Int) =
    if (b == 0) throw IllegalArgumentException("divisor cero") else a / b

fun main() {
    try {
        println(dividir(6, 3))
        println(dividir(1, 0))
    } catch (e: IllegalArgumentException) {
        println("error: ${e.message}")
    }
}
```

### A ✔

```text
2
error: divisor cero
```

> Correcto. `throw` también es una expresión (de tipo `Nothing`), así que puede ir en una rama del `if`. La primera llamada funciona, y la segunda lanza la excepción, que se captura.

### B

```text
2
0
```

> Con `b == 0` no se divide: se lanza la excepción.

### C

```text
error: divisor cero
```

> La primera llamada se completa e imprime antes de que falle la segunda.

### D

Error de compilación: `throw` no puede ir dentro de un `if` usado como expresión.

> Sí puede: `throw` es de tipo `Nothing`, que encaja con cualquier tipo esperado.

## kt-expr-031 {dificultad=2 tipo=compila error ancla=12-expresiones-vs-sentencias.md#sentencias}

¿Qué ocurre al compilar este fragmento?

```kotlin
var a = 0
val b = (a = 5)
```

### A ✔

Error de compilación: en Kotlin la asignación no es una expresión y no devuelve ningún valor.

> Correcto. En Java o C, `b = (a = 5)` es válido. Kotlin lo prohíbe para evitar errores como escribir `if (a = 5)` cuando se quería `a == 5`.

### B

Compila, y `a` y `b` valen 5.

> Eso pasaría en Java. En Kotlin la asignación es una sentencia.

### C

Compila, y `b` vale `Unit`.

> No llega a compilar: la asignación no se puede usar como valor.

### D

Compila, y `b` vale `true`.

> Ni compila ni la asignación devuelve un `Boolean`.

## kt-when-032 {dificultad=3 tipo=salida ancla=4-when-para-comprobar-tipos-con-smart-casting}

¿Qué imprime este programa?

```kotlin
fun formatear(x: Any) = when (x) {
    !is String -> "no es texto"
    else -> x.uppercase()
}

fun main() {
    println(formatear(3) + " / " + formatear("ok"))
}
```

### A ✔

`no es texto / OK`

> Correcto. `!is` comprueba que **no** sea de ese tipo. En la rama `else` el compilador sabe que `x` sí es un `String` (*smart cast*), así que permite `uppercase()`.

### B

Error de compilación: `x` es `Any` y no tiene `uppercase()`.

> El compilador deduce que, si no se cumple `!is String`, entonces `x` es un `String`.

### C

`no es texto / no es texto`

> `"ok"` sí es un `String`, así que no entra en la primera rama.

### D

`3 / OK`

> El 3 no es un `String`, así que devuelve el texto de la primera rama.

## kt-expr-033 {dificultad=2 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val hora = 14
val franja = if (hora in 6 until 14) "mañana"
             else if (hora in 14 until 21) "tarde"
             else "noche"
println(franja)
```

### A ✔

`tarde`

> Correcto. `6 until 14` excluye el 14, así que la hora 14 entra en el segundo rango (`14 until 21`).

### B

`mañana`

> `until` no incluye el límite superior: el 14 queda fuera de `6 until 14`.

### C

`noche`

> El 14 está en el rango `14 until 21`.

### D

Error de compilación: no se puede usar `until` dentro de un `if`.

> `hora in 6 until 14` es una expresión `Boolean` válida en cualquier condición.

## kt-when-034 {dificultad=1 tipo=concepto ancla=1-el-caso-basico-when-como-un-switch-mejorado}

En Java escribirías `case 1: case 2: return "bajo";` para agrupar dos valores. ¿Cómo se escribe en un `when` de Kotlin?

### A ✔

`1, 2 -> "bajo"`

> Correcto. Los valores de una misma rama se separan con comas.

### B

`1 || 2 -> "bajo"`

> `||` es un operador lógico entre `Boolean`; no sirve para agrupar valores.

### C

`1 -> 2 -> "bajo"`

> Esa sintaxis no es válida.

### D

`case 1, 2 -> "bajo"`

> En `when` no se escribe `case`.

## kt-when-035 {dificultad=1 tipo=salida ancla=2-when-como-expresion-su-primer-superpoder}

¿Qué imprime este código?

```kotlin
println(when (7 % 2) {
    0 -> "par"
    else -> "impar"
})
```

### A ✔

`impar`

> Correcto. `7 % 2` vale 1, que no es 0. Como `when` es una expresión, se puede pasar directamente como argumento de `println`.

### B

`par`

> El resto de dividir 7 entre 2 es 1.

### C

`1`

> Se imprime el texto de la rama elegida, no el valor comparado.

### D

Error de compilación: no se puede pasar un `when` como argumento.

> Se puede, porque es una expresión con valor.

## kt-expr-036 {dificultad=3 tipo=salida ancla=12-expresiones-vs-sentencias.md#expresiones}

¿Qué imprime este código?

```kotlin
val x = if (true) 1 else "uno"
println(x::class.simpleName)
```

### A ✔

`Int`

> Correcto. Como las ramas tienen tipos distintos, el tipo **declarado** de `x` es el supertipo común (`Any`). Pero en ejecución el objeto es el de la rama elegida, un `Int`, y `::class` muestra la clase real.

### B

`Any`

> `Any` es el tipo estático de `x`, pero `::class` informa de la clase **real** del objeto.

### C

Error de compilación: las dos ramas deben ser del mismo tipo.

> No es obligatorio: si no coinciden, el resultado toma el supertipo común.

### D

`String`

> La condición es `true`, así que se elige la primera rama, `1`.
