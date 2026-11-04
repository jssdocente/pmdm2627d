---
bloque: 10
titulo: Scope functions
apuntes: temas/00-android/00-kotlin/31-scope-functions.md
---

## kt-scope-001 {dificultad=2 tipo=salida ancla=54-run-configuracion-y-computo-de-resultado}

¿Qué imprime este código?

```kotlin
val nombre: String? = "ana"
val saludo = nombre?.run { "Hola, " + replaceFirstChar { it.uppercase() } } ?: "Hola, invitado"
println(saludo)
```

### A ✔

`Hola, Ana`

> Correcto. `nombre` no es nulo, así que `?.run` ejecuta el bloque con el texto como `this` y devuelve el resultado de la lambda. `replaceFirstChar` pone la primera letra en mayúscula.

### B

`Hola, invitado`

> Elvis solo se usa si la izquierda es `null`, y aquí `nombre` vale `"ana"`.

### C

`ana`

> `run` devuelve el **resultado de la lambda** (el saludo construido), no el objeto receptor.

### D

Error de compilación: dentro de `run` hay que escribir `it.replaceFirstChar`.

> En `run` el objeto es `this`, que se puede omitir. El `it` que aparece dentro es el parámetro de la lambda de `replaceFirstChar` (el carácter).

## kt-scope-002 {dificultad=2 tipo=salida ancla=53-also-efectos-secundarios-side-effects-y-logging}

¿Qué imprime este código?

```kotlin
val r = listOf(1, 2, 3)
    .also { println("Tamaño: ${it.size}") }
    .map { it * 10 }
println(r)
```

### A ✔

```text
Tamaño: 3
[10, 20, 30]
```

> Correcto. `also` ejecuta un efecto secundario (aquí, un *log*) y devuelve **el mismo objeto**, así que la cadena continúa con la lista original.

### B

```text
[10, 20, 30]
```

> El `println` de dentro de `also` sí se ejecuta: es justo su propósito. Lo que no hace es cambiar el valor que pasa al `map`.

### C

Error de compilación: `map` no se puede aplicar al resultado de `also`.

> `also` devuelve el receptor (la `List<Int>`), así que se puede seguir encadenando cualquier operación de lista.

### D

```text
Tamaño: 3
kotlin.Unit
```

> Eso pasaría si `also` devolviese el resultado de la lambda (`println` devuelve `Unit`). Pero `also` siempre devuelve el objeto original.

## kt-scope-003 {dificultad=3 tipo=salida ancla=dimension-2-retornar-el-objeto-o-el-resultado-de-la-lambda}

¿Qué imprime este código?

```kotlin
val x = "kotlin"
    .let { it.length }
    .run { this * 2 }
println(x)
```

### A ✔

`12`

> Correcto. `let` devuelve el resultado de su lambda: `6` (un `Int`). Después `run` se aplica **sobre ese `Int`** (`this = 6`) y devuelve `12`.

### B

`kotlinkotlin`

> Tras `let`, el valor ya no es el `String`, sino su longitud. `run` trabaja sobre el `Int` 6.

### C

`6`

> `run` también devuelve el resultado de su lambda, `this * 2`, así que el valor se duplica.

### D

Error de compilación: no se pueden encadenar dos *scope functions*.

> Son funciones de extensión normales y se pueden encadenar. Cada una trabaja sobre lo que devolvió la anterior.

## kt-scope-004 {dificultad=1 tipo=concepto ancla=3-tabla-maestra-de-seleccion-rapida}

¿Qué dos *scope functions* devuelven **el propio objeto** sobre el que se llaman (y no el resultado de la lambda)?

### A ✔

`apply` y `also`

> Correcto. Ambas devuelven el receptor, por eso se usan para **configurar** (`apply`, con `this`) o para **efectos secundarios** como *logs* (`also`, con `it`) sin cortar la cadena.

### B

`let` y `run`

> Estas devuelven el **resultado de la lambda** (su última expresión). Sirven para transformar o calcular algo a partir del objeto.

### C

`with` y `let`

> Las dos devuelven el resultado de la lambda. `with` se diferencia en que no es una extensión: el objeto se pasa como argumento.

### D

`run` y `also`

> Solo `also` devuelve el objeto. `run` devuelve el resultado de la lambda.

## kt-scope-005 {dificultad=2 tipo=salida ancla=51-apply-configuracion-e-inicializacion-de-objetos}

¿Qué imprime este programa?

```kotlin
data class Ajustes(var tema: String = "claro", var tamano: Int = 12)

fun main() {
    val a = Ajustes()
        .apply { tema = "oscuro" }
        .also { it.tamano = 16 }
    println(a)
}
```

### A ✔

`Ajustes(tema=oscuro, tamano=16)`

> Correcto. `apply` modifica el objeto con `this` y lo devuelve. `also` recibe ese mismo objeto como `it`, lo modifica y también lo devuelve. Los dos cambios se aplican sobre la misma instancia.

### B

`Ajustes(tema=oscuro, tamano=12)`

> `also` también modifica el objeto: `it` es una referencia a la misma instancia, no una copia.

### C

`Ajustes(tema=claro, tamano=12)`

> `apply` y `also` no trabajan sobre copias: modifican el objeto y lo devuelven.

### D

`kotlin.Unit`

> Ni `apply` ni `also` devuelven `Unit`: devuelven el objeto receptor, así que `a` es el `Ajustes` configurado.

## kt-scope-006 {dificultad=2 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val entrada: String? = "  42 "
val numero = entrada?.trim()?.toIntOrNull()?.let { it + 1 } ?: 0
println(numero)
```

### A ✔

`43`

> Correcto. `trim()` deja `"42"`, `toIntOrNull()` lo convierte en `42`, y `let` devuelve `42 + 1`. Como no hay ningún `null` en la cadena, Elvis no interviene.

### B

`0`

> Elvis solo se usa si la izquierda es `null`. Aquí todos los pasos tienen éxito: `"  42 ".trim()` es un número válido.

### C

`421`

> Tras `toIntOrNull()` el valor es un `Int`, así que `it + 1` es una suma, no una concatenación.

### D

`42`

> `let` devuelve el resultado de su lambda (`it + 1`), no el valor original.

## kt-scope-007 {dificultad=2 tipo=salida ancla=51-apply-configuracion-e-inicializacion-de-objetos}

¿Qué imprime este código?

```kotlin
val lista = mutableListOf<Int>().apply {
    add(1)
    add(2)
}.map { it * 3 }
println(lista)
```

### A ✔

`[3, 6]`

> Correcto. `apply` configura la lista (con `this` implícito, por eso basta con `add`) y la **devuelve**, así que se puede encadenar `map`.

### B

`[1, 2]`

> El `map` se aplica sobre la lista que devuelve `apply`, ya con 1 y 2.

### C

`[]`

> Los `add` de dentro de `apply` modifican la propia lista que se devuelve.

### D

Error de compilación: `map` no se puede aplicar a lo que devuelve `apply`.

> `apply` devuelve el receptor, una `MutableList<Int>`, así que admite cualquier operación de lista.

## kt-scope-008 {dificultad=1 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val nombre = "ana"
val saludo = nombre.let { n -> "Hola, ${n.uppercase()}" }
println(saludo)
```

### A ✔

`Hola, ANA`

> Correcto. En `let` el objeto llega como parámetro de la lambda. Se puede usar `it` o darle un nombre más claro (`n ->`). `let` devuelve el resultado de la lambda.

### B

`ana`

> `let` no devuelve el objeto original, sino lo que devuelve la lambda.

### C

Error de compilación: dentro de `let` hay que usar `it`.

> `it` es solo el nombre por defecto. Se puede elegir otro nombre escribiéndolo antes de la flecha.

### D

`Hola, ana`

> Se aplica `uppercase()` al nombre dentro de la plantilla.

## kt-scope-009 {dificultad=3 tipo=salida ancla=53-also-efectos-secundarios-side-effects-y-logging}

¿Qué imprime este código?

```kotlin
val x = 5.also { it + 100 }
println(x)
```

### A ✔

`5`

> Correcto. `also` **siempre** devuelve el objeto original. El resultado de la lambda (`105`) se descarta. Por eso `also` sirve para efectos secundarios, no para transformar.

### B

`105`

> Eso devolvería `let`. `also` ignora el valor de la lambda.

### C

`kotlin.Unit`

> `also` no devuelve `Unit`: devuelve el receptor, 5.

### D

Error de compilación: `also` no se puede usar con un `Int`.

> Las *scope functions* son extensiones genéricas que funcionan con cualquier tipo.

## kt-scope-010 {dificultad=2 tipo=salida ancla=54-run-configuracion-y-computo-de-resultado}

¿Qué imprime este código?

```kotlin
val total = run {
    val a = 3
    val b = 4
    a * b
}
println(total)
```

### A ✔

`12`

> Correcto. `run` sin receptor ejecuta un bloque y devuelve su última expresión. Sirve para agrupar variables temporales sin que «contaminen» el ámbito exterior.

### B

Error de compilación: `run` necesita un objeto receptor.

> Existe una versión sin receptor (`run { }`) además de la extensión (`objeto.run { }`).

### C

`kotlin.Unit`

> El valor del bloque es la última expresión, `a * b`.

### D

`7`

> La última expresión multiplica: 3 · 4.

## kt-scope-011 {dificultad=3 tipo=salida ancla=dimension-2-retornar-el-objeto-o-el-resultado-de-la-lambda}

¿Qué imprime este código?

```kotlin
val r = "kotlin".apply { uppercase() }
println(r)
```

### A ✔

`kotlin`

> Correcto. `apply` devuelve el **receptor**. `uppercase()` no modifica el `String` (los `String` son inmutables), sino que devuelve uno nuevo, y ese resultado se descarta.

### B

`KOTLIN`

> Eso devolvería `run { uppercase() }` o `let { it.uppercase() }`. `apply` devuelve el objeto original.

### C

`kotlin.Unit`

> `apply` devuelve el receptor, no `Unit`.

### D

Error de compilación: `apply` solo se puede usar con objetos mutables.

> Funciona con cualquier objeto. Otra cosa es que con objetos inmutables no tenga mucho sentido.

## kt-scope-012 {dificultad=2 tipo=salida ancla=55-with-agrupacion-de-llamadas-sobre-un-objeto}

¿Qué imprime este programa?

```kotlin
data class Pedido(val unidades: Int, val precio: Double)

fun main() {
    val total = with(Pedido(3, 2.5)) {
        unidades * precio
    }
    println(total)
}
```

### A ✔

`7.5`

> Correcto. Dentro de `with` las propiedades del objeto se usan directamente (es `this`), y `with` devuelve el resultado de la lambda: 3 · 2.5.

### B

`Pedido(unidades=3, precio=2.5)`

> `with` devuelve el resultado de la lambda, no el objeto.

### C

Error de compilación: hay que escribir `it.unidades`.

> En `with` el objeto es `this`, así que no hace falta prefijo.

### D

`7`

> `Int * Double` da `Double`: 7.5.

## kt-scope-013 {dificultad=1 tipo=concepto ancla=dimension-1-this-o-it}

¿En qué dos *scope functions* el objeto se recibe como `it` (y no como `this`)?

### A ✔

`let` y `also`

> Correcto. En estas el objeto es el **parámetro** de la lambda (`it`). En `apply`, `run` y `with` es el **receptor** (`this`).

### B

`apply` y `run`

> En estas el objeto es `this`: se accede a sus miembros sin prefijo.

### C

`with` y `run`

> Las dos usan `this`.

### D

`apply` y `also`

> Comparten que devuelven el objeto, pero `apply` usa `this` y `also` usa `it`.

## kt-scope-014 {dificultad=2 tipo=salida ancla=53-also-efectos-secundarios-side-effects-y-logging}

¿Qué imprime este código?

```kotlin
val menor = listOf(3, 1, 2)
    .sorted()
    .also { println("ordenada: $it") }
    .first()
println(menor)
```

### A ✔

```text
ordenada: [1, 2, 3]
1
```

> Correcto. `also` permite «asomarse» a un paso intermedio de la cadena (por ejemplo, para hacer *log*) sin alterarla. Después `first()` toma el menor.

### B

```text
ordenada: [3, 1, 2]
1
```

> `also` va después de `sorted()`, así que ve la lista ya ordenada.

### C

```text
1
```

> El `println` de dentro de `also` también se ejecuta.

### D

```text
ordenada: [1, 2, 3]
kotlin.Unit
```

> `also` devuelve la lista, y `first()` se aplica sobre ella.

## kt-scope-015 {dificultad=1 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val r = 2.let { it * 10 }.let { it + 1 }
println(r)
```

### A ✔

`21`

> Correcto. Cada `let` devuelve el resultado de su lambda: 2 → 20 → 21.

### B

`2`

> `let` no devuelve el original: transforma el valor en cada paso.

### C

`30`

> Primero se multiplica (20) y luego se suma 1.

### D

`3`

> La primera `let` multiplica por 10 antes de sumar.

## kt-scope-016 {dificultad=2 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val config: MutableMap<String, String>? = null
config?.apply { put("tema", "oscuro") }
println(config)
```

### A ✔

`null`

> Correcto. Con `?.` la *scope function* solo se ejecuta si el objeto no es nulo. `config` es `null`, así que el bloque no se ejecuta y el mapa no se crea.

### B

`{tema=oscuro}`

> `apply` no crea objetos: trabaja sobre uno que ya exista, y aquí no hay ninguno.

### C

Lanza `NullPointerException`.

> `?.apply` evita llamar al bloque cuando el receptor es nulo.

### D

`{}`

> No se crea ningún mapa vacío: `config` sigue siendo `null`.

## kt-scope-017 {dificultad=1 tipo=salida ancla=51-apply-configuracion-e-inicializacion-de-objetos}

¿Qué imprime este programa?

```kotlin
class Ventana {
    var ancho = 0
    var alto = 0
    override fun toString() = "${ancho}x$alto"
}

fun main() {
    val v = Ventana().apply {
        ancho = 800
        alto = 600
    }
    println(v)
}
```

### A ✔

`800x600`

> Correcto. Es el uso típico de `apply`: crear un objeto y configurar sus propiedades en un bloque, recibiendo el objeto ya configurado.

### B

`0x0`

> Las asignaciones dentro de `apply` modifican el propio objeto que se devuelve.

### C

Error de compilación: hay que escribir `this.ancho`.

> `this` es implícito dentro de `apply`, así que no hace falta.

### D

`kotlin.Unit`

> `apply` devuelve el receptor, que es la `Ventana`.

## kt-scope-018 {dificultad=3 tipo=compila error ancla=55-with-agrupacion-de-llamadas-sobre-un-objeto}

¿Qué ocurre al compilar este fragmento?

```kotlin
val n = "hola".with { length }
println(n)
```

### A ✔

Error de compilación: `with` no es una función de extensión; el objeto se pasa como argumento, `with("hola") { length }`.

> Correcto. Es la diferencia de `with` con las demás *scope functions*: no se llama con punto sobre el objeto.

### B

Compila e imprime `4`.

> Con `"hola".run { length }` sí sería así. `with` se escribe distinto.

### C

Compila e imprime `hola`.

> No llega a compilar.

### D

Error de compilación: `length` necesita paréntesis.

> `length` es una propiedad, no una función. El error está en cómo se llama a `with`.

## kt-scope-019 {dificultad=2 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
import java.util.Locale

val texto = 100.0
    .let { it * 1.21 }
    .let { String.format(Locale.US, "%.2f €", it) }
println(texto)
```

### A ✔

`121.00 €`

> Correcto. Cada `let` transforma el valor anterior: primero se aplica el IVA (121.0) y después se le da formato con dos decimales.

### B

`121.0 €`

> `%.2f` siempre muestra **dos** decimales.

### C

`100.00 €`

> El primer `let` multiplica por 1.21 antes de dar formato.

### D

`121,00 €`

> Con `Locale.US` el separador decimal es el punto.

## kt-scope-020 {dificultad=1 tipo=concepto ancla=4-guia-visual-cual-debo-elegir-en-3-preguntas}

Acabas de crear un objeto y quieres **asignar varias de sus propiedades** en un bloque y quedarte con el objeto ya configurado. ¿Qué *scope function* es la idiomática?

### A ✔

`apply`

> Correcto. `apply` da acceso al objeto como `this` (asignaciones sin prefijo) y devuelve el propio objeto: es la función de configuración por excelencia.

### B

`let`

> `let` devuelve el resultado de la lambda, no el objeto, y lo recibe como `it`.

### C

`also`

> `also` también devuelve el objeto, pero está pensada para efectos secundarios (como *logs*), con `it`.

### D

`with`

> `with` devuelve el resultado de la lambda, así que habría que terminar con `this` para obtener el objeto.

## kt-scope-021 {dificultad=2 tipo=salida ancla=3-tabla-maestra-de-seleccion-rapida}

¿Qué imprime este código?

```kotlin
val lista = mutableListOf(1)
    .also { it.add(2) }
    .apply { add(3) }
println(lista)
```

### A ✔

`[1, 2, 3]`

> Correcto. `also` y `apply` devuelven **la misma** lista, así que los dos `add` se acumulan. La diferencia es solo cómo se accede a ella: `it` en `also`, `this` en `apply`.

### B

`[1, 3]`

> El `add(2)` de `also` también modifica la lista, porque `it` es una referencia a ella, no una copia.

### C

`[1]`

> Ninguna de las dos trabaja sobre copias.

### D

Error de compilación: no se pueden encadenar `also` y `apply`.

> Ambas devuelven el receptor, así que se pueden encadenar.

## kt-scope-022 {dificultad=2 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val n = 7
println(n.takeIf { it % 2 == 0 } ?: "impar")
```

### A ✔

`impar`

> Correcto. `takeIf` devuelve el propio objeto si cumple la condición y `null` si no la cumple. 7 no es par, así que da `null` y Elvis aporta `"impar"`.

### B

`7`

> `takeIf` solo devuelve el valor si la condición es verdadera.

### C

`false`

> `takeIf` devuelve el objeto o `null`, no el resultado de la condición.

### D

Error de compilación: `takeIf` solo existe para `String`.

> Es una función genérica que funciona con cualquier tipo.

## kt-scope-023 {dificultad=1 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val total = listOf(2, 3).sum().let { it * it }
println(total)
```

### A ✔

`25`

> Correcto. `let` permite aplicar una transformación al resultado de una expresión sin crear una variable intermedia: (2 + 3)² = 25.

### B

`13`

> Primero se suma (5) y después se eleva al cuadrado; no se suman los cuadrados.

### C

`5`

> `let` devuelve el resultado de su lambda, `it * it`.

### D

`[4, 9]`

> `sum()` reduce la lista a un número antes del `let`.

## kt-scope-024 {dificultad=3 tipo=salida ancla=51-apply-configuracion-e-inicializacion-de-objetos}

¿Qué imprime este programa?

```kotlin
class Perfil {
    var nombre = ""
    fun conNombre(nombre: String) = apply { this.nombre = nombre }
}

fun main() {
    println(Perfil().conNombre("Ana").nombre)
}
```

### A ✔

`Ana`

> Correcto. Dentro de `apply`, `this.nombre` es la propiedad del objeto y `nombre` a secas es el parámetro. `apply` devuelve el propio `Perfil`, lo que permite encadenar llamadas (patrón *builder*).

### B

Una cadena vacía.

> `this.nombre = nombre` asigna el parámetro a la propiedad.

### C

Error de compilación: `nombre` es ambiguo.

> No es ambiguo: el parámetro oculta a la propiedad, y por eso se usa `this.` para referirse a ella.

### D

`kotlin.Unit`

> `apply` devuelve el receptor, el `Perfil`.

## kt-scope-025 {dificultad=3 tipo=salida ancla=53-also-efectos-secundarios-side-effects-y-logging}

¿Qué imprime este código?

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
println("$a $b")
```

### A ✔

`2 1`

> Correcto. Es un modismo para **intercambiar** variables. `b.also { ... }` devuelve el valor de `b` (2) **antes** de que la lambda lo cambie. Dentro, `b` pasa a valer `a` (1), y al final ese 2 se asigna a `a`.

### B

`1 1`

> `also` devuelve el valor que tenía `b` al empezar (2), aunque la lambda modifique `b`.

### C

`2 2`

> Dentro de la lambda, `b` toma el valor antiguo de `a`, que es 1.

### D

`1 2`

> Las dos variables sí cambian.

## kt-scope-026 {dificultad=2 tipo=concepto ancla=55-with-agrupacion-de-llamadas-sobre-un-objeto}

¿En qué se diferencian `with(objeto) { ... }` y `objeto.run { ... }`?

### A ✔

En que `with` no es una función de extensión (el objeto se pasa como argumento), mientras que `run` sí lo es y se puede combinar con `?.` para objetos anulables.

> Correcto. Las dos usan `this` y devuelven el resultado de la lambda. Pero con un valor anulable, `x?.run { }` es cómodo, mientras que `with(x)` obligaría a comprobar el nulo dentro.

### B

En que `with` devuelve el objeto y `run` el resultado de la lambda.

> Las dos devuelven el resultado de la lambda.

### C

En que `with` usa `it` y `run` usa `this`.

> Las dos usan `this`.

### D

No hay ninguna diferencia.

> La forma de llamarlas cambia, y eso afecta al uso con valores anulables.

## kt-scope-027 {dificultad=3 tipo=salida ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

¿Qué imprime este código?

```kotlin
val token: String? = null
val cabecera = token?.let { "Bearer $it" }
    ?: "sin token".also { println("aviso: no hay token") }
println(cabecera)
```

### A ✔

```text
aviso: no hay token
sin token
```

> Correcto. `token` es nulo, así que `?.let` da `null` y se evalúa la parte derecha del Elvis. Ese `also` hace un *log* y devuelve `"sin token"` sin cambiarlo.

### B

```text
sin token
```

> La parte derecha del Elvis se evalúa, y su `also` imprime el aviso.

### C

```text
Bearer null
```

> `?.let` no se ejecuta con un nulo.

### D

```text
aviso: no hay token
kotlin.Unit
```

> `also` devuelve su receptor (`"sin token"`), no `Unit`.

## kt-scope-028 {dificultad=1 tipo=salida ancla=51-apply-configuracion-e-inicializacion-de-objetos}

¿Qué imprime este código?

```kotlin
val sb = StringBuilder().apply { append("a") }.append("b")
println(sb)
```

### A ✔

`ab`

> Correcto. `apply` devuelve el `StringBuilder` (ya con `"a"`), y sobre él se encadena otro `append`.

### B

`a`

> El `append("b")` se aplica después, sobre el mismo objeto.

### C

`b`

> El `append("a")` de dentro de `apply` también modifica el objeto.

### D

Error de compilación: después de `apply` no se puede llamar a métodos.

> `apply` devuelve el receptor, así que se puede seguir encadenando.

## kt-scope-029 {dificultad=2 tipo=salida ancla=55-with-agrupacion-de-llamadas-sobre-un-objeto}

¿Qué imprime este código?

```kotlin
val r = with("hola") {
    println(length)
}
println(r)
```

### A ✔

```text
4
kotlin.Unit
```

> Correcto. `with` devuelve el resultado de la última expresión de la lambda. Aquí es un `println`, que devuelve `Unit`.

### B

```text
4
hola
```

> `with` no devuelve el objeto, sino el resultado de la lambda.

### C

```text
4
4
```

> `r` guarda lo que devuelve `println` (`Unit`), no lo que imprime.

### D

Error de compilación: la lambda de `with` debe devolver un valor.

> Puede terminar en cualquier expresión, también una que devuelva `Unit`.

## kt-scope-030 {dificultad=2 tipo=compila error ancla=dimension-1-this-o-it}

¿Qué ocurre al compilar este fragmento (dentro de `main`)?

```kotlin
"hola".also { println(length) }
```

### A ✔

Error de compilación: en `also` el objeto es `it`, no `this`, así que `length` sin prefijo no se encuentra.

> Correcto. Habría que escribir `it.length`. Con `apply` o `run`, en cambio, `length` funcionaría directamente.

### B

Compila e imprime `4`.

> Con `apply` sí. En `also` el receptor no es `this`.

### C

Compila e imprime `hola`.

> No llega a compilar.

### D

Error de compilación: `also` no se puede usar con un `String`.

> Funciona con cualquier tipo; el problema es `length` sin `it.`.

## kt-scope-031 {dificultad=2 tipo=salida ancla=dimension-1-this-o-it}

¿Qué imprime este código?

```kotlin
val r = "ab".let { it.length.let { it * 10 } }
println(r)
```

### A ✔

`20`

> Correcto. En el `let` interno, `it` es su propio parámetro (la longitud, 2), y «tapa» al `it` externo. 2 · 10 = 20.

### B

`abababababababababab`

> El `it` interno es un `Int` (la longitud), no la cadena.

### C

Error de compilación: no se pueden anidar dos `it`.

> Compila (el IDE puede avisar), y el `it` interno oculta al externo.

### D

`2`

> El `let` interno multiplica por 10.

## kt-scope-032 {dificultad=1 tipo=salida ancla=51-apply-configuracion-e-inicializacion-de-objetos}

¿Qué imprime este código?

```kotlin
val m = mutableMapOf<String, Int>().apply {
    put("a", 1)
    this["b"] = 2
}
println(m)
```

### A ✔

`{a=1, b=2}`

> Correcto. Dentro de `apply`, `put` y `this["b"]` actúan sobre el propio mapa, que es lo que se devuelve.

### B

`{}`

> Los cambios de dentro de `apply` modifican el mapa devuelto.

### C

`{a=1}`

> `this["b"] = 2` también añade una entrada.

### D

Error de compilación: no se puede usar `this` dentro de `apply`.

> `this` es el receptor; normalmente se omite, pero se puede escribir.

## kt-scope-033 {dificultad=1 tipo=concepto ancla=52-let-operaciones-null-safe-y-transformaciones-locales}

Tienes un valor anulable y quieres ejecutar un bloque **solo si no es nulo**, usando el valor dentro como un tipo no anulable. ¿Qué es lo idiomático?

### A ✔

`valor?.let { ... }`

> Correcto. `?.` evita la llamada si es nulo, y dentro de `let`, `it` ya es del tipo no anulable.

### B

`valor.let { ... }`

> Sin `?.`, el bloque se ejecuta también con `null`, y `it` sigue siendo anulable.

### C

`with(valor) { ... }`

> `with` no comprueba el nulo.

### D

`valor!!.also { ... }`

> `!!` lanzaría una NPE si el valor fuese nulo.

## kt-scope-034 {dificultad=2 tipo=salida ancla=54-run-configuracion-y-computo-de-resultado}

¿Qué imprime este código?

```kotlin
val categoria = "17".run { toIntOrNull() ?: 0 }
    .let { if (it >= 18) "adulto" else "menor" }
println(categoria)
```

### A ✔

`menor`

> Correcto. `run` convierte el texto en número (17) y `let` lo clasifica. Cada paso trabaja sobre el resultado del anterior.

### B

`adulto`

> 17 no llega a 18.

### C

`17`

> El último `let` transforma el número en un texto.

### D

Error de compilación: no se pueden encadenar `run` y `let`.

> Se pueden encadenar: cada una devuelve el resultado de su lambda.

## kt-scope-035 {dificultad=1 tipo=salida ancla=53-also-efectos-secundarios-side-effects-y-logging}

¿Qué imprime este código?

```kotlin
val numeros = mutableListOf(3, 1, 2).also { it.sort() }
println(numeros)
```

### A ✔

`[1, 2, 3]`

> Correcto. `also` devuelve la misma lista, y dentro `it.sort()` la ha ordenado en el sitio.

### B

`[3, 1, 2]`

> `sort()` modifica la propia lista, y `also` devuelve esa lista.

### C

`kotlin.Unit`

> `also` devuelve el receptor, no el resultado de `sort()`.

### D

Error de compilación: `sort()` no existe en `MutableList`.

> Existe. `sorted()` crea una copia; `sort()` ordena la propia lista.

## kt-scope-036 {dificultad=2 tipo=salida ancla=55-with-agrupacion-de-llamadas-sobre-un-objeto}

¿Qué imprime este código?

```kotlin
val resumen = with(listOf(4, 8, 6)) {
    "max=${max()} min=${min()} n=$size"
}
println(resumen)
```

### A ✔

`max=8 min=4 n=3`

> Correcto. Dentro de `with`, la lista es `this`, así que se llama a `max()`, `min()` y `size` sin repetir el nombre de la variable.

### B

`max=6 min=4 n=3`

> `max()` es el mayor valor (8), no el último.

### C

Error de compilación: hay que escribir `it.max()`.

> En `with`, el objeto es `this`, así que no hace falta prefijo.

### D

`max=8 min=4 n=18`

> `size` es el número de elementos, no su suma.
