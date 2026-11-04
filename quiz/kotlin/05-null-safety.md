---
bloque: 5
titulo: Null safety
apuntes: temas/00-android/00-kotlin/14-null-safety.md
---

## kt-null-001 {dificultad=1 tipo=salida ancla=21-llamada-segura-safe-call-operator}

¿Qué imprime este código?

```kotlin
val nombre: String? = null
println(nombre?.length)
```

### A ✔

`null`

> Correcto. La llamada segura `?.` comprueba primero si `nombre` es `null`. Como lo es, no llama a `length` y toda la expresión vale `null`.

### B

`0`

> `?.` no sustituye `null` por un valor por defecto. Para obtener `0` habría que añadir el operador Elvis: `nombre?.length ?: 0`.

### C

Lanza `NullPointerException`.

> `?.` existe precisamente para **evitar** la NPE. El que la lanzaría es `nombre!!.length`.

### D

Error de compilación: no se puede acceder a `length` de un `String?`.

> Con `.` normal sería un error, pero `?.` es justo la forma permitida de acceder a miembros de un tipo anulable.

## kt-null-002 {dificultad=2 tipo=salida ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué imprime este código?

```kotlin
val nombres: List<String?> = listOf("Ana", null, "Luis")
println(nombres.filterNotNull().map { it.length })
```

### A ✔

`[3, 4]`

> Correcto. `filterNotNull()` descarta los `null` y además cambia el tipo a `List<String>`, así que en `map` se puede usar `it.length` directamente.

### B

`[3, null, 4]`

> Los `null` ya no están: `filterNotNull()` los elimina antes del `map`.

### C

`[3, 0, 4]`

> Kotlin no convierte `null` en 0. El elemento nulo se elimina, no se transforma.

### D

Error de compilación: `it` es `String?` y no se puede usar `it.length`.

> Lo sería con `nombres.map { it.length }`. `filterNotNull()` devuelve `List<String>` (no anulable), y por eso compila.

## kt-null-003 {dificultad=2 tipo=salida ancla=22-operador-elvis}

¿Qué imprime este programa?

```kotlin
data class Direccion(val ciudad: String?)
data class Usuario(val direccion: Direccion?)

fun main() {
    val u = Usuario(Direccion(null))
    println(u.direccion?.ciudad?.uppercase() ?: "Desconocida")
}
```

### A ✔

`Desconocida`

> Correcto. `direccion` existe, pero `ciudad` es `null`, así que `?.uppercase()` no se ejecuta y la cadena de llamadas seguras vale `null`. Entonces Elvis (`?:`) aporta el valor de reserva.

### B

`null`

> Sería así sin el `?: "Desconocida"`. El operador Elvis sustituye cualquier `null` a su izquierda.

### C

`NULL`

> `uppercase()` no llega a llamarse sobre `null`: `?.` corta la cadena en cuanto encuentra un nulo.

### D

Lanza `NullPointerException`.

> Ningún paso usa `!!` ni accede con `.` a un valor nulo, así que no hay NPE.

## kt-null-004 {dificultad=1 tipo=compila error ancla=12-tipos-anulables}

¿Qué ocurre al compilar este fragmento?

```kotlin
val s: String? = "hola"
println(s.length)
```

### A ✔

Error de compilación: `s` es `String?` y hay que usar `?.` (o comprobar antes que no es `null`).

> Correcto. El compilador mira el **tipo declarado** (`String?`), no el valor actual. Como `s` podría ser `null`, no deja usar `.` directamente.

### B

Compila e imprime `4`, porque `s` no es `null`.

> El compilador no se fía del valor: `s` está declarado como anulable. Si fuese `val s = "hola"` (tipo `String`), sí compilaría.

### C

Compila, pero lanza `NullPointerException`.

> Kotlin detecta el posible nulo **en compilación**. Ese es el objetivo del *null safety*: sacar las NPE de la ejecución.

### D

Compila e imprime `null`.

> Para obtener `null` cuando `s` es nulo habría que escribir `s?.length`. Tal y como está, no compila.

## kt-null-005 {dificultad=3 tipo=salida ancla=3-comprobaciones-y-smart-casts}

¿Qué imprime este programa?

```kotlin
fun largo(s: String?): Int {
    if (s == null) return -1
    return s.length
}

fun main() {
    println(largo(null) + largo("abc"))
}
```

### A ✔

`2`

> Correcto. `largo(null)` devuelve `-1` y `largo("abc")` devuelve `3`: `-1 + 3 = 2`. Tras el `return` temprano, el compilador sabe que `s` no es nulo (*smart cast*) y permite `s.length`.

### B

Error de compilación: hay que escribir `s?.length`.

> No hace falta. Después de `if (s == null) return ...`, el resto de la función solo se ejecuta si `s` no es nulo, y el compilador lo trata como `String`.

### C

`3`

> Hay que sumar los dos resultados, y el de `largo(null)` es `-1`, no `0`.

### D

Lanza `NullPointerException` en la llamada `largo(null)`.

> Pasar `null` está permitido porque el parámetro es `String?`, y la función lo comprueba antes de usarlo.

## kt-null-006 {dificultad=1 tipo=salida ancla=5-el-modismo-estrella-en-android-objetolet}

¿Qué imprime este código?

```kotlin
val correo: String? = null
correo?.let { println("Enviando a $it") }
println("Fin")
```

### A ✔

`Fin`

> Correcto. `?.let { }` solo ejecuta la lambda si el valor **no** es `null`. Como `correo` es nulo, se salta el bloque y solo se imprime `Fin`.

### B

```text
Enviando a null
Fin
```

> Eso pasaría con `correo.let { ... }` (sin `?`), porque `let` se ejecutaría con `it = null`. El `?.` es lo que evita entrar.

### C

Lanza `NullPointerException`.

> `?.let` es el modismo para trabajar con valores anulables **sin** riesgo de NPE.

### D

No imprime nada.

> Solo se salta el bloque `let`. El `println("Fin")` va después y se ejecuta siempre.

## kt-null-007 {dificultad=1 tipo=salida ancla=22-operador-elvis}

¿Qué imprime este código?

```kotlin
val s: String? = "Kotlin"
println(s?.length ?: 0)
```

### A ✔

`6`

> Correcto. `s` no es nulo, así que `s?.length` vale 6 y Elvis no interviene. El valor por defecto (0) solo se usaría si la izquierda fuese `null`.

### B

`0`

> El operador Elvis solo aporta su valor cuando la parte izquierda es `null`, y aquí no lo es.

### C

`null`

> `s` tiene valor, así que la llamada segura sí devuelve la longitud.

### D

Error de compilación: no se puede combinar `?.` con `?:`.

> Es la combinación más habitual: llamada segura y, si da `null`, un valor por defecto.

## kt-null-008 {dificultad=2 tipo=salida ancla=3-comprobaciones-y-smart-casts}

¿Qué imprime este código?

```kotlin
val s: String? = "hola"
if (s != null && s.length > 3) println("largo") else println("corto")
```

### A ✔

`largo`

> Correcto. Tras `s != null &&`, en la parte derecha el compilador ya sabe que `s` no es nulo (*smart cast*), así que `s.length` está permitido. «hola» tiene 4 letras.

### B

Error de compilación: hay que escribir `s?.length`.

> No hace falta: `&&` evalúa la derecha solo si la izquierda es cierta, y el compilador lo tiene en cuenta.

### C

`corto`

> «hola» tiene 4 caracteres, y 4 > 3.

### D

Lanza `NullPointerException`.

> Si `s` fuese `null`, `&&` ni siquiera evaluaría `s.length` (cortocircuito).

## kt-null-009 {dificultad=1 tipo=compila error ancla=11-tipos-no-anulables-por-defecto}

¿Qué ocurre al compilar este fragmento?

```kotlin
var nombre: String = "Ana"
nombre = null
```

### A ✔

Error de compilación: `String` no admite `null`; habría que declarar `String?`.

> Correcto. En Kotlin los tipos son **no anulables por defecto**. Para permitir `null` hay que indicarlo con `?`.

### B

Compila, porque `nombre` es `var`.

> `var` permite reasignar, pero solo con valores del tipo declarado, y `null` no es un `String`.

### C

Compila, pero lanza `NullPointerException` al usar `nombre`.

> Kotlin impide el `null` en compilación: el error nunca llega a la ejecución.

### D

Compila con un aviso (*warning*).

> No es un aviso, es un error: es justo la base del *null safety*.

## kt-null-010 {dificultad=2 tipo=salida ancla=22-operador-elvis}

¿Qué imprime este código?

```kotlin
val lista: List<Int>? = null
println(lista?.size ?: "sin lista")
```

### A ✔

`sin lista`

> Correcto. `lista` es `null`, así que `lista?.size` vale `null` y Elvis aporta `"sin lista"`. El resultado puede ser `Int` o `String`, por lo que su tipo es `Any`, y `println` lo imprime sin problema.

### B

`0`

> Elvis aporta el valor que hay a su derecha, `"sin lista"`. No hay ningún 0 implícito.

### C

Error de compilación: los dos lados de `?:` deben ser del mismo tipo.

> No es obligatorio: si los tipos son distintos, el resultado toma un tipo común (aquí, `Any`).

### D

`null`

> Precisamente para evitar ese `null` está el operador Elvis.

## kt-null-011 {dificultad=1 tipo=salida ancla=5-el-modismo-estrella-en-android-objetolet}

¿Qué imprime este código?

```kotlin
val n: Int? = null
println(n?.let { it * it } ?: -1)
```

### A ✔

`-1`

> Correcto. Como `n` es `null`, `?.let` no ejecuta la lambda y devuelve `null`, así que Elvis aporta −1.

### B

`0`

> La lambda no llega a ejecutarse, y no hay ningún valor por defecto 0.

### C

`null`

> El `?: -1` sustituye ese `null` por −1.

### D

Lanza `NullPointerException`.

> `?.let` evita llamar a la lambda con un nulo, así que no hay NPE.

## kt-null-012 {dificultad=2 tipo=salida ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué imprime este código?

```kotlin
val entradas = listOf("1", "x", "3")
println(entradas.mapNotNull { it.toIntOrNull() })
```

### A ✔

`[1, 3]`

> Correcto. `mapNotNull` transforma cada elemento y **descarta** los resultados `null`. `"x".toIntOrNull()` es `null`, así que desaparece.

### B

`[1, null, 3]`

> Eso daría `map`. La variante `NotNull` filtra los nulos después de transformar.

### C

`[1, 0, 3]`

> Los nulos se eliminan, no se convierten en 0.

### D

Lanza `NumberFormatException` con `"x"`.

> Se usa `toIntOrNull()`, que devuelve `null` en lugar de lanzar la excepción.

## kt-null-013 {dificultad=2 tipo=salida ancla=21-llamada-segura-safe-call-operator}

¿Qué imprime este código?

```kotlin
val palabras = listOf("sol", "luna")
println(palabras.firstOrNull { it.length > 5 }?.uppercase())
```

### A ✔

`null`

> Correcto. Ninguna palabra tiene más de 5 letras, así que `firstOrNull` devuelve `null`, y la llamada segura `?.uppercase()` no se ejecuta.

### B

`LUNA`

> «luna» tiene 4 letras, que no es más de 5.

### C

Lanza `NoSuchElementException`.

> Eso lo haría `first { }`. La variante `firstOrNull` devuelve `null` si no encuentra nada.

### D

Error de compilación: hay que escribir `.uppercase()` sin `?`.

> `firstOrNull` devuelve `String?`, así que sin `?.` no compilaría.

## kt-null-014 {dificultad=2 tipo=salida ancla=12-tipos-anulables}

¿Qué imprime este código?

```kotlin
val aceptado: Boolean? = null
if (aceptado == true) println("sí") else println("no")
```

### A ✔

`no`

> Correcto. Con un `Boolean?`, comparar con `== true` es la forma segura: si vale `null` o `false`, la condición es falsa.

### B

`sí`

> `null == true` es falso, así que se ejecuta el `else`.

### C

Lanza `NullPointerException`.

> `==` en Kotlin es seguro con nulos: nunca lanza NPE.

### D

Error de compilación: no se puede comparar un `Boolean?` con `true`.

> Sí se puede, y es la forma recomendada. Lo que no compila es `if (aceptado)` directamente.

## kt-null-015 {dificultad=2 tipo=compila error ancla=12-tipos-anulables}

¿Qué ocurre al compilar este fragmento?

```kotlin
val aceptado: Boolean? = true
if (aceptado) println("sí")
```

### A ✔

Error de compilación: la condición de un `if` debe ser `Boolean`, no `Boolean?`.

> Correcto. Un `Boolean?` puede ser `null`, y `if` no sabría qué hacer en ese caso. Hay que escribir `if (aceptado == true)`.

### B

Compila e imprime `sí`.

> Aunque ahora valga `true`, el tipo declarado es anulable y el compilador lo rechaza.

### C

Compila, y si fuese `null` se trataría como `false`.

> Kotlin no hace esa conversión implícita: obliga a decidir explícitamente qué significa `null`.

### D

Compila con un aviso.

> Es un error de tipos, no un aviso.

## kt-null-016 {dificultad=3 tipo=salida ancla=21-llamada-segura-safe-call-operator}

¿Qué imprime este código?

```kotlin
val s: String? = null
println(s.isNullOrEmpty())
println(s.orEmpty().length)
```

### A ✔

```text
true
0
```

> Correcto. `isNullOrEmpty()` y `orEmpty()` son funciones de extensión declaradas **sobre `String?`**, así que se pueden llamar con `.` sobre un nulo. `orEmpty()` convierte `null` en `""`.

### B

Error de compilación: hay que usar `?.` porque `s` es anulable.

> Para la mayoría de métodos sería así, pero estas extensiones están pensadas para recibir nulos y se llaman con `.` normal.

### C

Lanza `NullPointerException` en la primera línea.

> Una extensión sobre `String?` comprueba ella misma si el receptor es `null`, así que no hay NPE.

### D

```text
false
0
```

> `null` cuenta como «nulo o vacío», así que la primera línea es `true`.

## kt-null-017 {dificultad=2 tipo=concepto ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué tipo describe «una lista que **siempre existe**, pero cuyos **elementos** pueden ser `null`»?

### A ✔

`List<String?>`

> Correcto. El `?` va en el tipo del **elemento**: la lista no es nula, pero puede contener `null` en su interior.

### B

`List<String>?`

> Aquí el `?` afecta a la **lista**: la variable puede ser `null`, pero si existe, sus elementos no son nulos.

### C

`List?<String>`

> Esa sintaxis no existe: el `?` va al final del tipo al que afecta.

### D

`List<String>`

> Ni la lista ni sus elementos admiten `null`.

## kt-null-018 {dificultad=2 tipo=salida ancla=3-comprobaciones-y-smart-casts}

¿Qué imprime este programa?

```kotlin
fun describir(x: Int?) = when (x) {
    null -> "nada"
    0 -> "cero"
    else -> "valor $x"
}

fun main() {
    println(describir(null) + ", " + describir(5))
}
```

### A ✔

`nada, valor 5`

> Correcto. `when` puede tener una rama `null`. Las ramas se evalúan en orden: `null` coincide con la primera y `5` acaba en `else`.

### B

`nada, cero`

> La rama `0` solo coincide con el valor 0 exacto.

### C

Lanza `NullPointerException` al comparar `null` con 0.

> En Kotlin las comparaciones de `when` son seguras con nulos.

### D

Error de compilación: un `when` no puede tener una rama `null`.

> Sí puede: es la forma idiomática de tratar el caso nulo dentro de un `when`.

## kt-null-019 {dificultad=1 tipo=salida ancla=22-operador-elvis}

¿Qué imprime este código?

```kotlin
val apodo: String? = null
val nombre: String? = null
println(apodo ?: nombre ?: "Anónimo")
```

### A ✔

`Anónimo`

> Correcto. Los operadores Elvis se pueden encadenar: se usa el primer valor no nulo de izquierda a derecha. Los dos primeros son `null`.

### B

`null`

> El último valor de la cadena (`"Anónimo"`) no es nulo, así que nunca se llega a `null`.

### C

Error de compilación: no se pueden encadenar dos `?:`.

> Sí se puede, y es útil para tener varios valores de reserva.

### D

Una cadena vacía.

> Elvis no inventa valores: devuelve el primero que no sea `null`.

## kt-null-020 {dificultad=2 tipo=compila error ancla=12-tipos-anulables}

¿Qué ocurre al compilar este programa?

```kotlin
fun saludar(nombre: String) = println("Hola, $nombre")

fun main() {
    val usuario: String? = "Ana"
    saludar(usuario)
}
```

### A ✔

Error de compilación: se pasa un `String?` donde se espera un `String`.

> Correcto. Un `String?` podría ser `null`, y la función no lo admite. Habría que comprobarlo antes (`if (usuario != null)`) o usar `usuario?.let { saludar(it) }`.

### B

Compila e imprime `Hola, Ana`.

> El compilador se basa en los **tipos**, no en el valor concreto de `usuario`.

### C

Compila, pero lanza `NullPointerException`.

> No llega a compilar: Kotlin no permite pasar un tipo anulable a un parámetro no anulable.

### D

Compila e imprime `Hola, null`.

> Para eso el parámetro debería ser `String?`.

## kt-null-021 {dificultad=3 tipo=salida ancla=21-llamada-segura-safe-call-operator}

¿Qué imprime este programa?

```kotlin
class Perfil(var apodo: String?)

fun main() {
    val p: Perfil? = null
    p?.apodo = "Lucky"
    println(p?.apodo)
}
```

### A ✔

`null`

> Correcto. La llamada segura también sirve para **asignar**: `p?.apodo = ...` solo se ejecuta si `p` no es nulo. Como lo es, no pasa nada y no se lanza ninguna excepción.

### B

`Lucky`

> No existe ningún `Perfil` en el que guardar el apodo: `p` es `null`.

### C

Lanza `NullPointerException`.

> `?.` en el lado izquierdo de una asignación evita la NPE.

### D

Error de compilación: no se puede usar `?.` a la izquierda de `=`.

> Sí se puede: es una asignación segura.

## kt-null-022 {dificultad=1 tipo=salida ancla=5-el-modismo-estrella-en-android-objetolet}

¿Qué imprime este código?

```kotlin
val cupon: String? = "verano10"
cupon?.uppercase()?.let { println("Aplicando $it") }
```

### A ✔

`Aplicando VERANO10`

> Correcto. Cada `?.` continúa solo si el valor anterior no es nulo. `cupon` tiene valor, así que se pasa a mayúsculas y `let` lo recibe como `it`.

### B

`Aplicando verano10`

> `let` recibe el resultado de `uppercase()`, ya en mayúsculas.

### C

No imprime nada.

> `cupon` no es nulo, así que la cadena llega hasta el `let`.

### D

`Aplicando null`

> El bloque `let` solo se ejecuta con un valor no nulo.

## kt-null-023 {dificultad=3 tipo=salida ancla=22-operador-elvis}

¿Qué imprime este código?

```kotlin
val n: Int? = null
val m: Int? = 2
println(n ?: 0 + 5)
println(m ?: 0 + 5)
```

### A ✔

```text
5
2
```

> Correcto. El operador Elvis tiene **menor prioridad** que `+`, así que se lee `n ?: (0 + 5)`. Con `n` nulo da 5. Con `m` = 2, Elvis devuelve 2 y la suma ni se evalúa. Para sumar siempre habría que escribir `(m ?: 0) + 5`.

### B

```text
5
7
```

> Eso sería `(m ?: 0) + 5`. Sin paréntesis, el `+ 5` forma parte del valor por defecto.

### C

```text
0
2
```

> El valor por defecto es `0 + 5`, no solo `0`.

### D

Error de compilación: no se puede mezclar `?:` con `+`.

> Compila, pero la prioridad de los operadores puede engañar.

## kt-null-024 {dificultad=2 tipo=salida ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué imprime este código?

```kotlin
val etiquetas: List<String>? = null
println(etiquetas.orEmpty().size)
```

### A ✔

`0`

> Correcto. `orEmpty()` convierte una lista nula en una lista vacía, así que después se puede trabajar con ella sin `?.`.

### B

`null`

> `orEmpty()` devuelve una lista (vacía), nunca `null`.

### C

Lanza `NullPointerException`.

> `orEmpty()` es una extensión sobre `List?` que comprueba el nulo por dentro.

### D

Error de compilación: hay que escribir `etiquetas?.orEmpty()`.

> `orEmpty()` está declarada sobre el tipo anulable, así que se llama con `.` normal.

## kt-null-025 {dificultad=1 tipo=compila error ancla=11-tipos-no-anulables-por-defecto}

¿Qué ocurre al compilar esta función?

```kotlin
fun buscarNombre(id: Int): String = if (id > 0) "Ana" else null
```

### A ✔

Error de compilación: la función promete devolver `String`, pero una de las ramas devuelve `null`.

> Correcto. Si la función puede no encontrar nada, su tipo de retorno debe ser anulable: `String?`.

### B

Compila, y para ids negativos devuelve `null`.

> El tipo `String` no admite `null`. El compilador lo rechaza.

### C

Compila, y para ids negativos devuelve `""`.

> Kotlin no convierte `null` en una cadena vacía.

### D

Compila, pero lanza `NullPointerException` para ids negativos.

> No llega a compilar.

## kt-null-026 {dificultad=1 tipo=salida ancla=22-operador-elvis}

¿Qué imprime este código?

```kotlin
val stock = mapOf("pan" to 3)
val unidades = (stock["leche"] ?: 0) + 1
println(unidades)
```

### A ✔

`1`

> Correcto. `stock["leche"]` devuelve `null` (la clave no existe), y Elvis lo sustituye por 0 antes de sumar. Los paréntesis son necesarios por la prioridad del Elvis.

### B

`4`

> Se busca `"leche"`, no `"pan"`.

### C

Error de compilación: no se puede sumar a un `Int?`.

> Gracias al Elvis, el resultado del paréntesis es un `Int` no nulo, y ya se puede sumar.

### D

`null`

> Elvis evita el `null`.

## kt-null-027 {dificultad=3 tipo=compila error ancla=3-comprobaciones-y-smart-casts}

¿Qué ocurre al compilar este código?

```kotlin
class Caja(var contenido: String?)

fun mostrar(c: Caja) {
    if (c.contenido != null) {
        println(c.contenido.length)
    }
}
```

### A ✔

Error de compilación: no se puede hacer *smart cast* sobre una propiedad `var`, porque podría cambiar entre la comprobación y el uso.

> Correcto. Otro hilo (o un *setter* personalizado) podría poner `contenido` a `null` justo después del `if`. La solución es copiarla a una variable local (`val texto = c.contenido`) o usar `c.contenido?.let { … }`.

### B

Compila: tras el `if`, `contenido` ya no es nulo.

> Con una variable local sí funcionaría. Con una propiedad mutable, el compilador no puede garantizarlo.

### C

Compila, pero puede lanzar `NullPointerException`.

> No llega a compilar.

### D

Error de compilación: no se puede comparar una propiedad con `null`.

> La comparación es válida. El problema está en usar `.length` sin `?.`.

## kt-null-028 {dificultad=2 tipo=salida ancla=3-comprobaciones-y-smart-casts}

¿Qué imprime este código?

```kotlin
var s: String? = "abc"
if (s != null) {
    println(s.length)
}
```

### A ✔

`3`

> Correcto. Con una variable **local**, aunque sea `var`, el compilador puede seguir su valor y aplica el *smart cast* dentro del `if`.

### B

Error de compilación: el *smart cast* no funciona con `var`.

> Con `var` **locales** sí funciona, siempre que no se modifiquen dentro de una lambda. El problema aparece con propiedades `var` de una clase.

### C

`null`

> `s` no es nulo, y se imprime su longitud.

### D

Lanza `NullPointerException`.

> Se comprueba antes de usarla.

## kt-null-029 {dificultad=3 tipo=salida ancla=5-el-modismo-estrella-en-android-objetolet}

¿Qué imprime este código?

```kotlin
val s: String? = null
val r = s?.let { println(it) }
println(r)
```

### A ✔

`null`

> Correcto. Como `s` es nulo, `?.let` no se ejecuta y toda la expresión vale `null`. Si `s` tuviera valor, `r` valdría `Unit` (lo que devuelve `println`).

### B

`kotlin.Unit`

> Solo valdría `Unit` si la lambda llegara a ejecutarse.

### C

```text
null
null
```

> La lambda no se ejecuta, así que su `println` no imprime nada.

### D

Lanza `NullPointerException`.

> `?.let` es seguro con nulos.

## kt-null-030 {dificultad=2 tipo=salida ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué imprime este código?

```kotlin
val precios = listOf(10, null, 5)
println(precios.sumOf { it ?: 0 })
```

### A ✔

`15`

> Correcto. La lista es `List<Int?>`. Dentro de `sumOf`, cada nulo se sustituye por 0 con Elvis.

### B

Error de compilación: no se puede sumar una lista con nulos.

> Directamente con `sum()` no compilaría, pero con `sumOf { it ?: 0 }` sí.

### C

`null`

> Ningún paso devuelve `null`: los nulos se convierten en 0.

### D

Lanza `NullPointerException`.

> Elvis evita usar el nulo en la suma.

## kt-null-031 {dificultad=1 tipo=salida ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué imprime este código?

```kotlin
val datos = listOf(null, "a", null)
println("${datos.size} ${datos.filterNotNull().size}")
```

### A ✔

`3 1`

> Correcto. Los `null` cuentan como elementos de la lista. `filterNotNull()` los quita y queda solo `"a"`.

### B

`1 1`

> `size` cuenta todos los elementos, también los nulos.

### C

`3 3`

> `filterNotNull()` elimina los dos nulos.

### D

Error de compilación: una lista no puede contener `null`.

> Puede, si su tipo lo permite. Aquí el tipo inferido es `List<String?>`.

## kt-null-032 {dificultad=2 tipo=concepto ancla=23-operador-de-asercion-no-nula-not-null-assertion}

¿Por qué se recomienda evitar el operador `!!` en el código de una app?

### A ✔

Porque le dice al compilador «confía en mí, no es nulo» y, si se equivoca, vuelve a aparecer la `NullPointerException` que el *null safety* quería eliminar.

> Correcto. Casi siempre hay una alternativa más segura: `?.`, `?:`, `let` o una comprobación con `if`.

### B

Porque no compila en Android.

> Compila en cualquier plataforma; el problema es el riesgo en ejecución.

### C

Porque convierte el valor en `null`.

> No convierte nada: si el valor es nulo, lanza una excepción.

### D

Porque es más lento que `?.`.

> La diferencia de rendimiento es irrelevante; el problema es la seguridad.

## kt-null-033 {dificultad=2 tipo=salida ancla=21-llamada-segura-safe-call-operator}

¿Qué imprime este código?

```kotlin
val a: String? = "   "
val b: String? = null
println("${a.isNullOrBlank()} ${a.isNullOrEmpty()} ${b.isNullOrBlank()}")
```

### A ✔

`true false true`

> Correcto. `isNullOrBlank()` es cierto si es nulo, vacío o **solo espacios**. `isNullOrEmpty()` solo si es nulo o vacío (`""`), y `"   "` tiene 3 caracteres.

### B

`true true true`

> Una cadena con espacios **no** está vacía: su longitud es 3.

### C

`false false true`

> «Blank» incluye las cadenas que solo tienen espacios.

### D

Error de compilación: hay que usar `?.` porque son anulables.

> Estas funciones están declaradas sobre `String?`, así que aceptan el nulo directamente.

## kt-null-034 {dificultad=2 tipo=salida ancla=21-llamada-segura-safe-call-operator}

¿Qué imprime este código?

```kotlin
val usuario: String? = "luis"
val tam = usuario?.also { print("Hola ") }?.length
println(tam)
```

### A ✔

`Hola 4`

> Correcto. `also` ejecuta el `print` y devuelve el mismo `String`, así que la cadena continúa con `?.length`.

### B

`4`

> El `print` de dentro de `also` también se ejecuta.

### C

`Hola null`

> `also` devuelve el `String` original, no `Unit`, así que se obtiene su longitud.

### D

Error de compilación: después de `also` no se puede usar `?.`.

> Se puede, y aquí hace falta porque `usuario?.also` puede dar `null`.

## kt-null-035 {dificultad=2 tipo=compila error ancla=6-colecciones-y-filtrado-de-nulos}

¿Qué ocurre al compilar esta línea?

```kotlin
val nombres: List<String> = listOf("Ana", null)
```

### A ✔

Error de compilación: una `List<String>` no admite `null`; el tipo debería ser `List<String?>`.

> Correcto. El *null safety* también se aplica a los **elementos** de las colecciones.

### B

Compila, y la lista contiene `Ana` y `null`.

> El tipo declarado no permite elementos nulos.

### C

Compila, y el `null` se elimina automáticamente.

> Kotlin no elimina elementos: da un error de tipos.

### D

Compila, pero lanza `NullPointerException` al recorrerla.

> El error se detecta en compilación.

## kt-null-036 {dificultad=2 tipo=salida ancla=3-comprobaciones-y-smart-casts}

¿Qué imprime este código?

```kotlin
val x: String? = "hey"
val r = when {
    x == null -> 0
    x.isEmpty() -> 1
    else -> x.length
}
println(r)
```

### A ✔

`3`

> Correcto. Tras la rama `x == null`, en las siguientes el compilador ya sabe que `x` no es nulo (*smart cast*) y permite `x.isEmpty()` y `x.length`.

### B

Error de compilación: hay que usar `x?.isEmpty()`.

> No hace falta: el `when` comprueba el nulo antes, en orden.

### C

`1`

> `"hey"` no está vacía.

### D

`0`

> `x` no es nulo.
