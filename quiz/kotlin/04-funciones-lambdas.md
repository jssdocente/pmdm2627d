---
bloque: 4
titulo: Funciones y lambdas
apuntes: temas/00-android/00-kotlin/13-funciones-lambdas.md
---

## kt-fun-001 {dificultad=1 tipo=salida ancla=13-parametros-con-valores-por-defecto-y-argumentos-con-nombre}

¿Qué imprime este programa?

```kotlin
fun saludo(nombre: String, saludo: String = "Hola", fin: String = "!") =
    "$saludo, $nombre$fin"

fun main() {
    println(saludo("Ana", fin = "?"))
}
```

### A ✔

`Hola, Ana?`

> Correcto. `saludo` toma su valor por defecto (`"Hola"`) y `fin` se pasa **por nombre**, aunque haya un parámetro intermedio sin indicar.

### B

`?, Ana!`

> Al usar `fin = "?"` el valor va a `fin`, no al siguiente parámetro por posición. Los argumentos con nombre no dependen del orden.

### C

`Hola, Ana!`

> `fin` sí se ha indicado: vale `"?"`. Su valor por defecto solo se usa cuando no se pasa.

### D

Error de compilación: no se puede omitir `saludo` si se pasa `fin`.

> Con argumentos con nombre puedes saltarte cualquier parámetro que tenga valor por defecto. En Java harían falta sobrecargas.

## kt-fun-002 {dificultad=2 tipo=salida ancla=14-numero-variable-de-argumentos-vararg-y-el-operador-spread}

¿Qué imprime este programa?

```kotlin
fun suma(vararg n: Int) = n.sum()

fun main() {
    val extra = intArrayOf(3, 4)
    println(suma(1, 2, *extra))
}
```

### A ✔

`10`

> Correcto. `vararg` recoge cualquier número de argumentos en un array. El operador ***spread*** (`*`) «desempaqueta» `extra` como si se hubiese escrito `suma(1, 2, 3, 4)`.

### B

`3`

> No se ignora `extra`: el `*` mete sus elementos en la lista de argumentos.

### C

Error de compilación: no se puede mezclar valores sueltos con un array.

> Precisamente para eso existe `*`: permite combinar valores sueltos y arrays en la misma llamada.

### D

Error de compilación: falta el `*` al declarar `vararg`.

> El `*` se usa al **llamar** (para expandir un array), no al declarar. La declaración correcta es `vararg n: Int`.

## kt-fun-003 {dificultad=2 tipo=compila error ancla=11-inmutabilidad-de-los-parametros}

¿Qué ocurre al compilar esta función?

```kotlin
fun doblar(x: Int): Int {
    x = x * 2
    return x
}
```

### A ✔

Error de compilación: los parámetros de una función son de solo lectura (`val`).

> Correcto. En Kotlin los parámetros son siempre `val`. Si necesitas modificar el valor, usa una variable local: `val resultado = x * 2`.

### B

Compila: dentro de la función `x` es una copia local y se puede modificar.

> En Java sí se podía reasignar un parámetro. Kotlin lo prohíbe para evitar errores: los parámetros no se pueden reasignar.

### C

Compila, pero el cambio no se ve fuera de la función.

> No llega a compilar. Que el cambio no fuese visible fuera sería cierto en Java, pero aquí el compilador lo rechaza antes.

### D

Error de compilación: falta declarar `x` como `var x: Int`.

> En la lista de parámetros no se puede escribir `var` (ni `val`). Los parámetros son de solo lectura siempre.

## kt-fun-004 {dificultad=2 tipo=salida ancla=paso-4-descomposicion-en-tipo-firma-vs-valor-lambda}

¿Qué imprime este código?

```kotlin
val operar: (Int, Int) -> Int = { a, b -> a * b }
val alCuadrado: (Int) -> Int = { it * it }
println(operar(3, alCuadrado(2)))
```

### A ✔

`12`

> Correcto. Primero `alCuadrado(2)` = `4`; después `operar(3, 4)` = `3 * 4` = `12`. Las lambdas guardadas en variables se invocan como funciones normales.

### B

`36`

> Ese sería `alCuadrado(operar(3, 2))`. Aquí se eleva al cuadrado el 2, no el producto.

### C

`7`

> `operar` multiplica (`a * b`), no suma.

### D

Error de compilación: `it` solo puede usarse en lambdas sin tipo declarado.

> `it` es el nombre implícito del parámetro en **cualquier** lambda de un solo parámetro. El tipo `(Int) -> Int` de la variable le indica al compilador que `it` es `Int`.

## kt-fun-005 {dificultad=3 tipo=salida ancla=22-galeria-practica-de-descomposicion-paso-a-paso}

¿Qué imprime este programa?

```kotlin
fun multiplicador(factor: Int): (Int) -> Int = { it * factor }

fun main() {
    val triple = multiplicador(3)
    println(triple(triple(2)))
}
```

### A ✔

`18`

> Correcto. `multiplicador(3)` **devuelve una función** que multiplica por 3. `triple(2)` = 6 y `triple(6)` = 18.

### B

`6`

> `triple` se aplica **dos veces**: sobre 2 y luego sobre el resultado, 6.

### C

`9`

> Se multiplica el **argumento** por 3, no 3 por 3. `triple(2)` es 6, y no se eleva nada al cuadrado.

### D

Error de compilación: una función no puede devolver otra función.

> Sí puede: `(Int) -> Int` es un tipo como cualquier otro. Las funciones que reciben o devuelven funciones se llaman de **orden superior**.

## kt-fun-006 {dificultad=1 tipo=salida ancla=51-anatomia-de-una-funcion-de-extension-y-el-receptor-this}

¿Qué imprime este programa?

```kotlin
fun String.gritar() = uppercase() + "!"

fun main() {
    println("hola".gritar())
}
```

### A ✔

`HOLA!`

> Correcto. Es una **función de extensión**: añade `gritar()` a `String` sin heredar de ella. Dentro, `this` es la cadena receptora, así que `uppercase()` se aplica a `"hola"`.

### B

Error de compilación: `String` es `final` y no se puede extender.

> Las funciones de extensión **no** usan herencia, así que funcionan también con clases `final` como `String`. Se resuelven de forma estática.

### C

`hola!`

> Dentro de la extensión, `uppercase()` equivale a `this.uppercase()`: se aplica al receptor `"hola"`.

### D

Error de compilación: falta `this` delante de `uppercase()`.

> En una extensión, igual que en un método, `this` se puede omitir al acceder a miembros del receptor.

## kt-fun-007 {dificultad=1 tipo=salida ancla=13-parametros-con-valores-por-defecto-y-argumentos-con-nombre}

¿Qué imprime este programa?

```kotlin
fun area(base: Int, altura: Int) = base * altura / 2

fun main() {
    println(area(altura = 4, base = 5))
}
```

### A ✔

`10`

> Correcto. Con argumentos con nombre el orden de la llamada no importa: `base` = 5 y `altura` = 4, así que 5 · 4 / 2 = 10.

### B

`20`

> Falta dividir entre 2: la función calcula `base * altura / 2`, y el orden de los argumentos no cambia la fórmula.

### C

Error de compilación: los argumentos deben ir en el orden de la declaración.

> Con argumentos **con nombre** se puede usar cualquier orden.

### D

`10.0`

> Todos los valores son `Int`, así que la división es entera y el resultado es `Int`.

## kt-fun-008 {dificultad=2 tipo=salida ancla=paso-4-descomposicion-en-tipo-firma-vs-valor-lambda}

¿Qué imprime este código?

```kotlin
val esLarga: (String) -> Boolean = { it.length > 4 }
val palabras = listOf("sol", "planeta", "mar", "galaxia")
println(palabras.count(esLarga))
```

### A ✔

`2`

> Correcto. La lambda guardada en `esLarga` tiene tipo `(String) -> Boolean`, justo el que espera `count`, así que se puede pasar como argumento. Cumplen «planeta» y «galaxia».

### B

`4`

> `count` con un predicado solo cuenta los elementos que lo cumplen.

### C

Error de compilación: hay que escribir `count { esLarga(it) }`.

> Esa forma también funciona, pero no hace falta: una variable de tipo función se puede pasar directamente.

### D

`[planeta, galaxia]`

> Eso sería `filter(esLarga)`. `count` devuelve un número.

## kt-fun-009 {dificultad=2 tipo=salida ancla=paso-4-descomposicion-en-tipo-firma-vs-valor-lambda}

¿Qué imprime este programa?

```kotlin
fun ejecutar(veces: Int, accion: () -> Unit) {
    repeat(veces) { accion() }
}

fun main() {
    var contador = 0
    ejecutar(3) { contador += 5 }
    println(contador)
}
```

### A ✔

`15`

> Correcto. La lambda se pasa como último argumento fuera de los paréntesis y `ejecutar` la invoca 3 veces. La lambda puede modificar `contador` porque lo «captura» (*closure*).

### B

`5`

> `accion()` se llama dentro de `repeat(veces)`, es decir, 3 veces.

### C

`0`

> Las lambdas en Kotlin sí pueden modificar variables `var` del ámbito que las rodea.

### D

Error de compilación: una lambda no puede modificar una variable externa.

> Eso ocurre en Java (variables *effectively final*). En Kotlin las lambdas pueden modificar las variables que capturan.

## kt-fun-010 {dificultad=2 tipo=salida ancla=2-el-puente-pedagogico-de-la-funcion-tradicional-a-la-lambda}

¿Qué imprime este programa?

```kotlin
fun esPar(n: Int) = n % 2 == 0

fun main() {
    println(listOf(1, 2, 3, 4).filter(::esPar))
}
```

### A ✔

`[2, 4]`

> Correcto. `::esPar` es una **referencia a función**: se pasa la función ya declarada en lugar de escribir la lambda `{ esPar(it) }`.

### B

`[1, 3]`

> `filter` conserva los elementos para los que la función devuelve `true`, es decir, los pares.

### C

Error de compilación: `filter` necesita una lambda entre llaves.

> `filter` espera una función `(Int) -> Boolean`, y `::esPar` encaja con ese tipo.

### D

`[false, true, false, true]`

> Eso sería `map(::esPar)`. `filter` no transforma: selecciona.

## kt-fun-011 {dificultad=3 tipo=salida ancla=22-galeria-practica-de-descomposicion-paso-a-paso}

¿Qué imprime este programa?

```kotlin
fun contador(): () -> Int {
    var n = 0
    return { ++n }
}

fun main() {
    val c1 = contador()
    c1()
    c1()
    val c2 = contador()
    println("${c1()} ${c2()}")
}
```

### A ✔

`3 1`

> Correcto. Cada llamada a `contador()` crea una variable `n` nueva y una lambda que la **captura**. `c1` ya se ha llamado dos veces (va por 3) y `c2` tiene su propia `n` (empieza en 1).

### B

`3 4`

> `c1` y `c2` no comparten `n`: cada llamada a `contador()` crea la suya.

### C

`1 1`

> `n` no se reinicia en cada llamada a la lambda: la lambda conserva la variable capturada entre llamadas.

### D

Error de compilación: la variable `n` deja de existir al salir de `contador()`.

> Al capturarla en la lambda, `n` sigue viva mientras la lambda exista. Esto se llama *closure*.

## kt-fun-012 {dificultad=1 tipo=compila error ancla=13-parametros-con-valores-por-defecto-y-argumentos-con-nombre}

¿Qué ocurre al compilar este programa?

```kotlin
fun suma(a: Int, b: Int) = a + b

fun main() {
    println(suma(1))
}
```

### A ✔

Error de compilación: falta el valor del parámetro `b`.

> Correcto. Solo se pueden omitir los parámetros que tienen valor por defecto. Habría que declarar `b: Int = 0` para poder llamar a `suma(1)`.

### B

Imprime `1`, porque `b` vale 0 por defecto.

> Los parámetros no tienen un valor por defecto salvo que se declare explícitamente.

### C

Lanza una excepción al ejecutar.

> El error lo detecta el **compilador**, no aparece en ejecución.

### D

Imprime `null`.

> `b` es de tipo `Int` (no anulable), y además la llamada ni siquiera compila.

## kt-fun-013 {dificultad=2 tipo=salida ancla=1-declaracion-clasica-de-funciones}

¿Qué imprime este programa?

```kotlin
fun saluda() {
    println("hola")
}

fun main() {
    val r = saluda()
    println(r)
}
```

### A ✔

```text
hola
kotlin.Unit
```

> Correcto. Una función sin tipo de retorno devuelve `Unit`, que es un objeto real (no «nada»). Por eso se puede guardar en `r` e imprimir.

### B

```text
hola
null
```

> Las funciones sin retorno no devuelven `null`, sino el objeto `Unit`.

### C

Error de compilación: no se puede asignar una función `void`.

> En Kotlin no existe `void`: su equivalente es `Unit`, y se puede asignar como cualquier valor.

### D

```text
hola
hola
```

> `r` guarda lo que **devuelve** `saluda()` (`Unit`), no lo que imprime.

## kt-fun-014 {dificultad=1 tipo=salida ancla=paso-2-la-funcion-anonima-anonymous-function}

¿Qué imprime este código?

```kotlin
val doble = fun(x: Int): Int {
    return x * 2
}
println(doble(21))
```

### A ✔

`42`

> Correcto. Es una **función anónima**: una función sin nombre guardada en una variable. A diferencia de las lambdas, usa `return` explícito y declara el tipo de retorno.

### B

`21`

> La función multiplica por 2 y devuelve el resultado.

### C

Error de compilación: una función sin nombre no puede tener `return`.

> En las funciones anónimas `return` es obligatorio (si no tienen cuerpo de expresión). Lo que no lo usa es la lambda.

### D

Error de compilación: falta el nombre de la función.

> Se puede omitir el nombre al usar `fun` como valor: eso es justo una función anónima.

## kt-fun-015 {dificultad=3 tipo=salida ancla=51-anatomia-de-una-funcion-de-extension-y-el-receptor-this}

¿Qué imprime este programa?

```kotlin
fun Int.veces(accion: (Int) -> Unit) {
    for (i in 1..this) accion(i)
}

fun main() {
    3.veces { print(it * it) }
}
```

### A ✔

`149`

> Correcto. `veces` es una extensión de `Int` en la que `this` es el número (3). Recorre 1..3 y llama a la lambda con cada valor, que imprime su cuadrado: 1, 4 y 9.

### B

`123`

> La lambda imprime `it * it`, el cuadrado, no el propio número.

### C

`999`

> `it` es el valor que pasa la función (`i`, de 1 a 3), no el receptor 3.

### D

Error de compilación: no se pueden crear funciones de extensión sobre `Int`.

> Se pueden crear extensiones de cualquier tipo, incluidos `Int`, `String` o `List`.

## kt-fun-016 {dificultad=2 tipo=salida ancla=14-numero-variable-de-argumentos-vararg-y-el-operador-spread}

¿Qué imprime este programa?

```kotlin
fun unir(vararg partes: String, separador: String = "-") =
    partes.joinToString(separador)

fun main() {
    println(unir("a", "b", "c", separador = "+"))
}
```

### A ✔

`a+b+c`

> Correcto. `vararg` recoge `"a"`, `"b"` y `"c"`. Como hay un parámetro **después** del `vararg`, hay que pasarlo **por nombre** para que no se confunda con otro elemento.

### B

`a-b-c`

> El separador se ha indicado (`separador = "+"`), así que no se usa el valor por defecto.

### C

`a-b-c-+`

> Al pasarlo por nombre, `"+"` no se trata como otra parte del `vararg`.

### D

Error de compilación: el `vararg` debe ser el último parámetro.

> No es obligatorio. Pero si hay parámetros después, hay que pasarlos con nombre.

## kt-fun-017 {dificultad=1 tipo=concepto ancla=21-el-parametro-implicito-it}

¿En qué caso se puede usar el nombre implícito `it` dentro de una lambda?

### A ✔

Cuando la lambda tiene exactamente **un** parámetro y no se le ha dado nombre.

> Correcto. `it` es el nombre automático del único parámetro. Si hay dos o más, hay que nombrarlos: `{ a, b -> a + b }`.

### B

En cualquier lambda, tenga los parámetros que tenga.

> Con dos parámetros `it` no existe. Habría que nombrarlos explícitamente.

### C

Solo dentro de `forEach`.

> `it` funciona en cualquier lambda de un parámetro: `map`, `filter`, `let`, `also`, `repeat`…

### D

Solo si la lambda no tiene parámetros.

> Si no hay parámetros, no hay nada a lo que `it` pueda referirse.

## kt-fun-018 {dificultad=2 tipo=salida ancla=22-galeria-practica-de-descomposicion-paso-a-paso}

¿Qué imprime este programa?

```kotlin
fun aplicar(x: Int, f: (Int) -> Int, g: (Int) -> Int) = g(f(x))

fun main() {
    println(aplicar(2, { it + 3 }, { it * 10 }))
}
```

### A ✔

`50`

> Correcto. Primero `f(2)` = 2 + 3 = 5 y luego `g(5)` = 5 · 10 = 50. La función compone las dos lambdas.

### B

`23`

> Eso sería `f(g(x))`: 2 · 10 + 3. El orden es `g(f(x))`: primero se aplica `f` (sumar 3) y después `g` (multiplicar por 10).

### C

`5`

> Ese es solo `f(2)`. Falta aplicar `g` al resultado: 5 · 10.

### D

Error de compilación: solo la última lambda puede ir entre llaves.

> Las lambdas pueden pasarse entre llaves dentro de los paréntesis. Lo especial de la última es que **además** puede ir fuera.

## kt-fun-019 {dificultad=3 tipo=salida ancla=13-parametros-con-valores-por-defecto-y-argumentos-con-nombre}

¿Qué imprime este programa?

```kotlin
fun rectangulo(ancho: Int, alto: Int = ancho) = ancho * alto

fun main() {
    println(rectangulo(4) + rectangulo(2, 3))
}
```

### A ✔

`22`

> Correcto. El valor por defecto de `alto` puede usar un parámetro anterior. `rectangulo(4)` es un cuadrado de 4 · 4 = 16, y `rectangulo(2, 3)` = 6. En total, 22.

### B

`10`

> En `rectangulo(4)` el alto no es 1: su valor por defecto es el propio `ancho`, 4.

### C

Error de compilación: un valor por defecto no puede depender de otro parámetro.

> Sí puede, siempre que ese parámetro esté declarado **antes**.

### D

`14`

> `rectangulo(4)` vale 16 (4 · 4), no 8.

## kt-fun-020 {dificultad=3 tipo=salida ancla=paso-4-descomposicion-en-tipo-firma-vs-valor-lambda}

¿Qué imprime este código?

```kotlin
val operacion: ((Int) -> Int)? = null
println(operacion?.invoke(3) ?: 0)
```

### A ✔

`0`

> Correcto. Una variable de tipo función también puede ser anulable: `((Int) -> Int)?`. Para llamarla de forma segura se usa `?.invoke(...)`. Como es `null`, Elvis aporta el 0.

### B

`3`

> No hay ninguna función que aplicar: `operacion` es `null`.

### C

Lanza `NullPointerException`.

> `?.invoke` evita llamar a una función nula.

### D

Error de compilación: una función no puede ser `null`.

> El tipo función entre paréntesis seguido de `?` lo permite.

## kt-fun-021 {dificultad=1 tipo=salida ancla=1-declaracion-clasica-de-funciones}

¿Qué imprime este programa?

```kotlin
fun main() {
    fun cuadrado(x: Int) = x * x
    println(cuadrado(cuadrado(2)))
}
```

### A ✔

`16`

> Correcto. Kotlin permite declarar **funciones locales**, dentro de otra función. `cuadrado(2)` = 4 y `cuadrado(4)` = 16.

### B

`8`

> Se eleva al cuadrado dos veces: 2² = 4 y 4² = 16.

### C

Error de compilación: no se puede declarar una función dentro de `main`.

> Las funciones locales están permitidas y solo son visibles dentro de la función que las contiene.

### D

`4`

> La función se aplica dos veces.

## kt-fun-022 {dificultad=1 tipo=salida ancla=12-funciones-de-expresion-unica-single-expression-functions}

¿Qué imprime este programa?

```kotlin
fun factorial(n: Int): Int = if (n <= 1) 1 else n * factorial(n - 1)

fun main() {
    println(factorial(5))
}
```

### A ✔

`120`

> Correcto. Es una función **recursiva**: 5 · 4 · 3 · 2 · 1 = 120. El caso base (`n <= 1`) detiene la recursión.

### B

`15`

> Eso sería la suma (5 + 4 + 3 + 2 + 1). La función multiplica.

### C

`24`

> Ese es el factorial de 4. Aquí se calcula el de 5.

### D

Lanza `StackOverflowError`.

> El caso base `n <= 1` detiene las llamadas.

## kt-fun-023 {dificultad=3 tipo=compila error ancla=12-funciones-de-expresion-unica-single-expression-functions}

¿Qué ocurre al compilar esta función?

```kotlin
fun factorial(n: Int) = if (n <= 1) 1 else n * factorial(n - 1)
```

### A ✔

Error de compilación: una función recursiva necesita declarar su tipo de retorno.

> Correcto. Para inferir el tipo de `factorial`, el compilador necesitaría conocer el tipo de `factorial(n - 1)`, que es justo lo que está calculando. Basta con escribir `: Int`.

### B

Compila, y el tipo de retorno se infiere como `Int`.

> En funciones no recursivas sí se infiere. Con recursión, la inferencia se vuelve circular.

### C

Compila, pero lanza `StackOverflowError`.

> No llega a compilar. Además, el caso base evitaría el desbordamiento.

### D

Error de compilación: una función de expresión única no puede ser recursiva.

> Sí puede, siempre que indique su tipo de retorno.

## kt-fun-024 {dificultad=2 tipo=salida ancla=51-anatomia-de-una-funcion-de-extension-y-el-receptor-this}

¿Qué imprime este programa?

```kotlin
infix fun Int.veces(texto: String) = texto.repeat(this)

fun main() {
    println(3 veces "ja")
}
```

### A ✔

`jajaja`

> Correcto. Una función de extensión de un solo parámetro marcada como `infix` se puede llamar sin punto ni paréntesis. `3 veces "ja"` equivale a `3.veces("ja")`. Así funcionan `to`, `until` o `downTo`.

### B

Error de compilación: falta el punto entre `3` y `veces`.

> Con `infix`, el punto y los paréntesis son opcionales.

### C

`ja3`

> `repeat(this)` repite el texto tantas veces como indica el receptor (3).

### D

`3ja`

> La función devuelve el texto repetido, no lo concatena con el número.

## kt-fun-025 {dificultad=2 tipo=salida ancla=22-galeria-practica-de-descomposicion-paso-a-paso}

¿Qué imprime este programa?

```kotlin
fun contar(lista: List<Int>, condicion: (Int) -> Boolean): Int {
    var c = 0
    for (x in lista) if (condicion(x)) c++
    return c
}

fun main() {
    println(contar(listOf(1, 5, 8, 12)) { it > 4 })
}
```

### A ✔

`3`

> Correcto. `contar` es una función de orden superior: recibe la condición como parámetro. Cumplen 5, 8 y 12.

### B

`4`

> El 1 no es mayor que 4.

### C

`25`

> La función cuenta los elementos; no los suma.

### D

Error de compilación: la lambda debe ir dentro de los paréntesis.

> Si es el último parámetro, la lambda puede ir fuera de los paréntesis.

## kt-fun-026 {dificultad=2 tipo=salida ancla=2-el-puente-pedagogico-de-la-funcion-tradicional-a-la-lambda}

¿Qué imprime este código?

```kotlin
println(listOf("a", "bb", "ccc").map(String::length))
```

### A ✔

`[1, 2, 3]`

> Correcto. `String::length` es una **referencia** a la propiedad `length` de `String`. Equivale a la lambda `{ it.length }`.

### B

`[a, bb, ccc]`

> `map` transforma cada elemento con la función indicada.

### C

Error de compilación: solo se pueden referenciar funciones, no propiedades.

> También se pueden referenciar propiedades con `::`.

### D

`6`

> `map` devuelve una lista con un resultado por elemento.

## kt-fun-027 {dificultad=3 tipo=salida ancla=22-galeria-practica-de-descomposicion-paso-a-paso}

¿Qué imprime este código?

```kotlin
val acciones = mutableListOf<() -> Int>()
for (i in 1..3) {
    acciones.add { i * 10 }
}
println(acciones.map { it() })
```

### A ✔

`[10, 20, 30]`

> Correcto. En cada vuelta, `i` es una variable nueva (es `val`), y cada lambda captura **la suya**. Al ejecutarlas después, cada una recuerda su valor.

### B

`[30, 30, 30]`

> Pasaría en lenguajes en los que todas las lambdas comparten la misma variable del bucle. En Kotlin cada vuelta tiene su propio `i`.

### C

`[0, 0, 0]`

> Las lambdas guardan el valor de `i` de su vuelta.

### D

Error de compilación: no se puede guardar una lambda en una lista.

> Las funciones son valores y se pueden guardar en colecciones. Aquí el tipo es `() -> Int`.

## kt-fun-028 {dificultad=3 tipo=salida ancla=13-parametros-con-valores-por-defecto-y-argumentos-con-nombre}

¿Qué imprime este programa?

```kotlin
fun main() {
    var contador = 0
    fun siguiente(n: Int = ++contador) = n
    println("${siguiente()} ${siguiente()} ${siguiente(9)}")
}
```

### A ✔

`1 2 9`

> Correcto. El valor por defecto se evalúa **en cada llamada** en la que no se pasa el argumento. Por eso `++contador` da 1 y luego 2. Con `siguiente(9)` no se evalúa.

### B

`1 1 9`

> El valor por defecto no se calcula una sola vez: se vuelve a evaluar en cada llamada que lo usa.

### C

`1 2 3`

> Cuando se pasa un argumento (9), el valor por defecto no se usa.

### D

`0 0 9`

> `++contador` incrementa antes de devolver el valor, así que el primero es 1.

## kt-fun-029 {dificultad=3 tipo=salida ancla=14-numero-variable-de-argumentos-vararg-y-el-operador-spread}

¿Qué imprime este programa?

```kotlin
fun total(vararg n: Int) = n.size

fun main() {
    val lista = listOf(1, 2, 3)
    println(total(*lista.toIntArray(), 4))
}
```

### A ✔

`4`

> Correcto. El operador *spread* (`*`) solo funciona con **arrays**, por eso la lista se convierte primero con `toIntArray()`. Se pasan 1, 2, 3 y 4: cuatro argumentos.

### B

`2`

> El `*` expande el array en tres argumentos sueltos.

### C

Error de compilación: el `*` no se puede usar con una lista.

> Directamente sobre la lista no, pero aquí se aplica sobre el array que devuelve `toIntArray()`.

### D

`10`

> `total` devuelve cuántos argumentos hay (`size`), no la suma.

## kt-fun-030 {dificultad=1 tipo=concepto ancla=22-galeria-practica-de-descomposicion-paso-a-paso}

¿Qué es una **función de orden superior**?

### A ✔

Una función que recibe otra función como parámetro o que devuelve una función.

> Correcto. `filter`, `map`, `forEach` o `repeat` son funciones de orden superior: reciben una lambda que deciden cuándo y cuántas veces ejecutar.

### B

Una función declarada en el nivel superior del fichero, fuera de cualquier clase.

> Eso es una función de nivel superior (*top-level*), que es otro concepto.

### C

Una función que se llama a sí misma.

> Eso es una función recursiva.

### D

Una función marcada con `open` para que se pueda sobrescribir.

> `open` tiene que ver con la herencia, no con las funciones de orden superior.

## kt-fun-031 {dificultad=1 tipo=salida ancla=paso-4-descomposicion-en-tipo-firma-vs-valor-lambda}

¿Qué imprime este código?

```kotlin
val log: (String) -> Unit = { println("[LOG] $it") }
log("inicio")
log("fin")
```

### A ✔

```text
[LOG] inicio
[LOG] fin
```

> Correcto. `(String) -> Unit` es el tipo de una función que recibe un `String` y no devuelve nada útil. La lambda se llama como una función normal.

### B

```text
[LOG] $it
[LOG] $it
```

> `$it` es una plantilla que se sustituye por el argumento.

### C

No imprime nada: las lambdas solo se ejecutan dentro de `forEach`.

> Una lambda guardada en una variable se ejecuta al llamarla con `()`.

### D

Error de compilación: una lambda que devuelve `Unit` no puede llamar a `println`.

> `Unit` indica que no devuelve un valor útil, pero dentro puede hacer cualquier cosa.

## kt-fun-032 {dificultad=2 tipo=compila error ancla=21-el-parametro-implicito-it}

¿Qué ocurre al compilar esta línea?

```kotlin
val longitud: (Int) -> Int = { it.length }
```

### A ✔

Error de compilación: según el tipo declarado, `it` es un `Int`, y un `Int` no tiene `length`.

> Correcto. El tipo `(Int) -> Int` fija el tipo del parámetro. Para medir cadenas haría falta `(String) -> Int`.

### B

Compila: `it` se adapta al tipo que se le pase.

> El tipo de `it` lo determina el tipo función declarado, y aquí es `Int`.

### C

Compila, pero lanza una excepción al llamarla.

> El error se detecta en compilación.

### D

Error de compilación: no se puede declarar el tipo de una lambda.

> Sí se puede, y es lo que permite usar `it` sin anotar el parámetro.

## kt-fun-033 {dificultad=2 tipo=salida ancla=13-parametros-con-valores-por-defecto-y-argumentos-con-nombre}

¿Qué imprime este programa?

```kotlin
fun boton(texto: String, alPulsar: () -> Unit) {
    println("[$texto]")
    alPulsar()
}

fun main() {
    boton(texto = "Aceptar") {
        println("pulsado")
    }
}
```

### A ✔

```text
[Aceptar]
pulsado
```

> Correcto. Se puede combinar un argumento con nombre dentro de los paréntesis con una lambda final fuera de ellos. Es justo el estilo de Jetpack Compose: `Button(onClick = { ... }) { Text(...) }`.

### B

```text
pulsado
[Aceptar]
```

> La función imprime primero el texto y después llama a la lambda.

### C

Error de compilación: si se usa un argumento con nombre, la lambda también debe ir con nombre.

> No es necesario: la última lambda puede ir fuera de los paréntesis.

### D

```text
[Aceptar]
```

> `boton` llama a `alPulsar()`, así que también se imprime `pulsado`.

## kt-fun-034 {dificultad=2 tipo=salida ancla=51-anatomia-de-una-funcion-de-extension-y-el-receptor-this}

¿Qué imprime este programa?

```kotlin
val String.iniciales: String
    get() = split(" ").joinToString("") { it.first().toString() }

fun main() {
    println("Ana Belén Ruiz".iniciales)
}
```

### A ✔

`ABR`

> Correcto. También existen las **propiedades de extensión**: se declaran con un *getter* y se usan sin paréntesis. La cadena se divide en palabras y se une la primera letra de cada una.

### B

`Ana`

> Se recorren todas las palabras, no solo la primera.

### C

Error de compilación: no existen las propiedades de extensión.

> Existen, aunque no pueden guardar estado: necesitan un *getter* que calcule el valor.

### D

`A B R`

> El separador de `joinToString("")` es una cadena vacía.

## kt-fun-035 {dificultad=3 tipo=salida ancla=21-el-parametro-implicito-it}

¿Qué imprime este código?

```kotlin
listOf(1, 2).forEach {
    listOf(10, 20).forEach { print(it) }
}
```

### A ✔

`10201020`

> Correcto. En la lambda interna, `it` se refiere a su **propio** parámetro (10 y 20) y «tapa» el `it` externo. Por eso conviene nombrar los parámetros cuando se anidan lambdas.

### B

`1122`

> El `print(it)` está en la lambda interna, así que su `it` es el de la lista interna.

### C

`11021220`

> No se imprime el `it` externo: el interno lo oculta.

### D

Error de compilación: no se puede usar `it` en lambdas anidadas.

> Se puede (como mucho, el IDE avisa), pero el `it` interno oculta al externo.

## kt-fun-036 {dificultad=2 tipo=salida ancla=1-declaracion-clasica-de-funciones}

¿Qué imprime este programa?

```kotlin
fun minMax(lista: List<Int>) = Pair(lista.min(), lista.max())

fun main() {
    val (menor, mayor) = minMax(listOf(4, 1, 9))
    println(mayor - menor)
}
```

### A ✔

`8`

> Correcto. Una función puede devolver varios valores agrupados en un `Pair` (o en una `data class`) y desestructurarlos al recibirlos: 9 − 1 = 8.

### B

`-8`

> Se calcula `mayor - menor`, es decir, 9 − 1.

### C

Error de compilación: una función no puede devolver dos valores.

> Devuelve **un** valor, el `Pair`, que contiene dos.

### D

`(1, 9)`

> Se imprime la diferencia, no el par.
