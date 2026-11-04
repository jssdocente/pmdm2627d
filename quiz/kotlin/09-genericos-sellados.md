---
bloque: 9
titulo: Genéricos y tipos sellados
apuntes: temas/00-android/00-kotlin/26-sealed-classes.md
---

## kt-gen-001 {dificultad=1 tipo=salida ancla=25-genericos.md#1-clases-genericas}

¿Qué imprime este programa?

```kotlin
class Caja<T>(val contenido: T) {
    fun abrir() = "Contiene: $contenido"
}

fun main() {
    println(Caja(42).abrir())
    println(Caja(listOf("a", "b")).abrir())
}
```

### A ✔

```text
Contiene: 42
Contiene: [a, b]
```

> Correcto. `T` se **infiere** en cada caso: `Caja<Int>` y `Caja<List<String>>`. La misma clase sirve para cualquier tipo sin duplicar código.

### B

Error de compilación: hay que indicar el tipo, `Caja<Int>(42)`.

> Se puede escribir, pero no hace falta: el compilador deduce `T` a partir del argumento.

### C

```text
Contiene: 42
Contiene: T
```

> `T` es solo un parámetro de tipo. En ejecución, `contenido` es la lista real, y se imprime su `toString()`.

### D

Error de compilación: una `Caja` no puede contener una lista.

> `T` no tiene restricciones (*upper bound*), así que admite cualquier tipo, incluidas colecciones.

## kt-gen-002 {dificultad=2 tipo=compila error ancla=25-genericos.md#3-restricciones-de-tipo-upper-bounds}

¿Qué ocurre al compilar este programa?

```kotlin
fun <T : Number> doble(x: T): Double = x.toDouble() * 2

fun main() {
    println(doble(3))
    println(doble("3"))
}
```

### A ✔

Error de compilación en `doble("3")`: `String` no es subtipo de `Number`.

> Correcto. `T : Number` es una **restricción de tipo** (*upper bound*): solo se aceptan `Int`, `Double`, `Long`… Gracias a ella se puede llamar a `x.toDouble()` dentro de la función.

### B

Compila e imprime `6.0` y `6.0`, porque `"3"` se convierte en número.

> Kotlin no convierte `String` a número implícitamente: habría que usar `"3".toInt()`.

### C

Compila, pero lanza `ClassCastException` en la segunda llamada.

> La restricción se comprueba **en compilación**: el código no llega a ejecutarse.

### D

Error de compilación en la declaración: no se puede llamar a `toDouble()` sobre `T`.

> Sin la restricción sería así. Con `T : Number`, el compilador sabe que `T` tiene todos los métodos de `Number`, incluido `toDouble()`.

## kt-gen-003 {dificultad=2 tipo=salida ancla=25-genericos.md#2-funciones-genericas}

¿Qué imprime este programa?

```kotlin
fun <T> primeroO(lista: List<T>, defecto: T): T = lista.firstOrNull() ?: defecto

fun main() {
    println(primeroO(emptyList(), "nada"))
    println(primeroO(listOf(7, 8), 0))
}
```

### A ✔

```text
nada
7
```

> Correcto. `firstOrNull()` devuelve `null` si la lista está vacía, y Elvis aporta el valor por defecto. En la segunda llamada devuelve el primer elemento, 7. `T` se infiere como `String` y como `Int`.

### B

```text
null
7
```

> El operador Elvis (`?:`) sustituye ese `null` por `defecto`, que es `"nada"`.

### C

Lanza `NoSuchElementException` en la primera llamada.

> Eso lo haría `first()`. La variante `firstOrNull()` devuelve `null` en lugar de lanzar una excepción.

### D

Error de compilación: `emptyList()` necesita el tipo explícito.

> El compilador lo deduce del segundo argumento: como `defecto` es `String`, `T` es `String` y `emptyList()` es `List<String>`.

## kt-sealed-004 {dificultad=2 tipo=salida ancla=5-el-patron-universal-de-arquitectura-en-android-uistate}

¿Qué imprime este programa?

```kotlin
sealed interface UiState {
    data object Cargando : UiState
    data class Exito(val juegos: List<String>) : UiState
    data class Error(val mensaje: String) : UiState
}

fun pintar(estado: UiState) = when (estado) {
    UiState.Cargando -> "Cargando…"
    is UiState.Exito -> "${estado.juegos.size} juegos"
    is UiState.Error -> "Error: ${estado.mensaje}"
}

fun main() {
    println(pintar(UiState.Exito(listOf("Tetris", "Celeste"))))
    println(pintar(UiState.Error("sin red")))
}
```

### A ✔

```text
2 juegos
Error: sin red
```

> Correcto. `when` elige la rama según el subtipo real y hace ***smart cast***: dentro de `is UiState.Exito` se puede usar `estado.juegos` directamente.

### B

Error de compilación: falta la rama `else` en el `when`.

> Con un tipo `sealed` el compilador conoce **todos** los subtipos posibles. Si están todos cubiertos, `else` no hace falta.

### C

Error de compilación: `estado` es `UiState` y no tiene `juegos`.

> Tras `is UiState.Exito`, el compilador trata `estado` como `Exito` (*smart cast*), así que `juegos` es accesible.

### D

```text
Exito(juegos=[Tetris, Celeste])
Error(mensaje=sin red)
```

> `pintar` no imprime el objeto: devuelve el texto que construye cada rama del `when`.

## kt-sealed-005 {dificultad=2 tipo=concepto ancla=3-la-combinacion-perfecta-polimorfismo-when-smart-casting}

¿Por qué un `when` sobre una `sealed interface` **no** necesita rama `else` si cubre todos sus subtipos?

### A ✔

Porque los subtipos de un tipo sellado solo pueden declararse en su mismo módulo y paquete, así que el compilador los conoce todos.

> Correcto. La jerarquía es **cerrada**: nadie puede añadir subtipos desde fuera. Por eso el compilador puede comprobar que el `when` es exhaustivo y avisar cuando aparece un subtipo nuevo.

### B

Porque `when` nunca necesita `else` cuando se usa como expresión.

> Al contrario: como expresión **sí** necesita ser exhaustivo. Con un `Int` o un `String` sería obligatorio poner `else`.

### C

Porque las interfaces selladas no pueden tener subtipos.

> Sí los tienen, y precisamente para eso existen. Lo que hacen es **limitar** dónde se pueden declarar.

### D

Porque si falta un caso, `when` devuelve `null` automáticamente.

> Kotlin nunca devuelve `null` por un caso no cubierto: si no puede garantizar que el `when` es exhaustivo, da error de compilación.

## kt-sealed-006 {dificultad=3 tipo=salida ancla=sintaxis-moderna-con-data-object-y-data-class}

¿Qué imprime este programa?

```kotlin
sealed interface Resultado {
    data object Vacio : Resultado
    object SinDatos : Resultado
}

fun main() {
    println(Resultado.Vacio)
    println(Resultado.SinDatos.toString().contains("SinDatos@"))
}
```

### A ✔

```text
Vacio
true
```

> Correcto. `data object` genera un `toString()` legible que devuelve solo su nombre. Un `object` normal usa el `toString()` heredado: clase y dirección de memoria (`Resultado$SinDatos@1b6d3586`). Por eso en los `UiState` se prefiere `data object`.

### B

```text
Resultado.Vacio
true
```

> El `toString()` de un `data object` devuelve el nombre simple, sin el prefijo del tipo padre.

### C

```text
Vacio
false
```

> Un `object` normal **no** tiene `toString()` legible: imprime el nombre de la clase de la JVM seguido de `@` y un *hash*.

### D

Error de compilación: un `object` no puede ser subtipo de una `sealed interface`.

> Sí puede: los subtipos de un tipo sellado pueden ser `object`, `data object`, `class` o `data class`.

## kt-gen-007 {dificultad=2 tipo=salida ancla=25-genericos.md#2-funciones-genericas}

¿Qué imprime este programa?

```kotlin
fun <A, B> invertir(par: Pair<A, B>): Pair<B, A> = Pair(par.second, par.first)

fun main() {
    println(invertir(1 to "uno"))
}
```

### A ✔

`(uno, 1)`

> Correcto. Una función puede tener **varios** parámetros de tipo. Aquí `A` = `Int` y `B` = `String`, y el resultado es `Pair<String, Int>`.

### B

`(1, uno)`

> La función intercambia los dos componentes.

### C

Error de compilación: una función solo puede tener un parámetro de tipo.

> Puede tener varios, separados por comas: `<A, B>`.

### D

`uno1`

> `Pair` se imprime con paréntesis y una coma: `(uno, 1)`.

## kt-gen-008 {dificultad=2 tipo=salida ancla=25-genericos.md#3-restricciones-de-tipo-upper-bounds}

¿Qué imprime este programa?

```kotlin
fun <T : Comparable<T>> mayor(a: T, b: T) = if (a > b) a else b

fun main() {
    println(mayor("pera", "manzana"))
    println(mayor(3, 7))
}
```

### A ✔

```text
pera
7
```

> Correcto. La restricción `T : Comparable<T>` permite usar `>` dentro de la función. Los `String` se comparan alfabéticamente (`p` va después de `m`) y los `Int`, numéricamente.

### B

```text
manzana
7
```

> «pera» es mayor alfabéticamente que «manzana», porque la `p` va después de la `m`.

### C

Error de compilación: no se puede usar `>` con un tipo genérico.

> Sin la restricción no se podría. Con `T : Comparable<T>`, el compilador sabe que `T` se puede comparar.

### D

```text
pera
3
```

> 7 es mayor que 3.

## kt-gen-009 {dificultad=1 tipo=salida ancla=25-genericos.md#1-clases-genericas}

¿Qué imprime este programa?

```kotlin
class Repositorio<T> {
    private val items = mutableListOf<T>()
    fun guardar(x: T) { items += x }
    fun todos(): List<T> = items
}

fun main() {
    val repo = Repositorio<String>()
    repo.guardar("Zelda")
    repo.guardar("Hades")
    println(repo.todos())
}
```

### A ✔

`[Zelda, Hades]`

> Correcto. La misma clase sirve para guardar cualquier tipo. Al crear `Repositorio<String>`, `T` es `String`.

### B

`[]`

> `guardar` añade a la lista interna, y `todos()` devuelve esa misma lista.

### C

Error de compilación: hay que indicar `T` al declarar la clase.

> `T` se indica al **crear** la instancia (`Repositorio<String>()`), no en la declaración.

### D

`2`

> Se imprime la lista, no su tamaño.

## kt-gen-010 {dificultad=1 tipo=compila error ancla=25-genericos.md#1-clases-genericas}

¿Qué ocurre al compilar este programa?

```kotlin
class Caja<T>(var contenido: T)

fun main() {
    val caja = Caja("texto")
    caja.contenido = 5
}
```

### A ✔

Error de compilación: `caja` es una `Caja<String>` y no admite un `Int`.

> Correcto. El tipo se infiere al crearla (`T` = `String`) y queda fijo. Los genéricos dan flexibilidad al declarar y **seguridad de tipos** al usar.

### B

Compila: como es genérica, admite cualquier tipo en todo momento.

> Una vez creada, la instancia tiene un tipo concreto. Para admitir cualquier cosa habría que crear una `Caja<Any>`.

### C

Compila, pero lanza `ClassCastException`.

> El error se detecta en compilación.

### D

Error de compilación: `contenido` es `val`.

> Es `var`. El problema es el tipo del valor.

## kt-gen-011 {dificultad=3 tipo=concepto ancla=25-genericos.md#41-covarianza-con-out-productores-de-datos}

¿Por qué en Kotlin se puede asignar una `List<String>` a una variable de tipo `List<Any>`?

### A ✔

Porque `List` es **covariante** (`List<out E>`): solo produce elementos, nunca los recibe, así que es seguro tratarla como lista de un supertipo.

> Correcto. Como una `List` de solo lectura no permite añadir elementos, nadie podrá meter un `Int` en la lista de `String`. Por eso el compilador lo permite.

### B

Porque Kotlin convierte automáticamente cualquier tipo genérico.

> No es automático para todos: con `MutableList` la misma asignación **no** compila.

### C

Porque `String` y `Any` son el mismo tipo.

> `String` es un **subtipo** de `Any`, no el mismo tipo.

### D

No se puede: da error de compilación.

> Con `List` (covariante) sí se puede. El error aparece con `MutableList`, que es invariante.

## kt-gen-012 {dificultad=3 tipo=compila error ancla=25-genericos.md#4-varianza-en-kotlin-covarianza-out-y-contravarianza-in}

¿Qué ocurre al compilar esta línea?

```kotlin
val objetos: MutableList<Any> = mutableListOf<String>("a")
```

### A ✔

Error de compilación: `MutableList` es **invariante**, así que una `MutableList<String>` no es una `MutableList<Any>`.

> Correcto. Si se permitiera, se podría hacer `objetos.add(5)` y meter un `Int` en una lista que en realidad es de `String`. La invarianza lo impide.

### B

Compila, porque `String` es subtipo de `Any`.

> Eso funciona con `List` (covariante, de solo lectura), pero no con `MutableList`.

### C

Compila, pero `add(5)` lanzaría `ClassCastException` al ejecutar.

> Kotlin evita ese problema en compilación: la asignación ya no compila.

### D

Error de compilación: `mutableListOf` necesita un tamaño inicial.

> `mutableListOf` no necesita tamaño. El error está en los tipos.

## kt-gen-013 {dificultad=2 tipo=salida ancla=25-genericos.md#2-funciones-genericas}

¿Qué imprime este programa?

```kotlin
fun <T> List<T>.segundo(): T? = if (size >= 2) this[1] else null

fun main() {
    println(listOf(5).segundo())
    println(listOf("a", "b").segundo())
}
```

### A ✔

```text
null
b
```

> Correcto. Es una **función de extensión genérica**: funciona con listas de cualquier tipo. Devuelve `T?` para poder indicar con `null` que no hay segundo elemento.

### B

Lanza `IndexOutOfBoundsException` en la primera línea.

> La función comprueba el tamaño antes de acceder a `this[1]`.

### C

```text
5
b
```

> En `listOf(5)` el único elemento está en la posición 0; no hay posición 1.

### D

```text
null
a
```

> `this[1]` es el **segundo** elemento: `"b"`.

## kt-sealed-014 {dificultad=2 tipo=salida ancla=31-when-como-expresion-devolver-un-valor}

¿Qué imprime este programa?

```kotlin
sealed interface Resultado
data class Ok(val valor: Int) : Resultado
data class Fallo(val error: String) : Resultado

fun procesar(r: Resultado) = when (r) {
    is Ok -> r.valor * 2
    is Fallo -> -1
}

fun main() {
    println(listOf(Ok(5), Fallo("x"), Ok(1)).sumOf { procesar(it) })
}
```

### A ✔

`11`

> Correcto. `Ok(5)` → 10, `Fallo` → −1 y `Ok(1)` → 2. La suma es 11. El `when` es exhaustivo sin `else` porque `Resultado` está sellada.

### B

`12`

> El `Fallo` no aporta 0, sino −1.

### C

`6`

> Cada `Ok` aporta el **doble** de su valor.

### D

Error de compilación: falta `else` en el `when`.

> Con un tipo sellado y todos los subtipos cubiertos, `else` no es necesario.

## kt-sealed-015 {dificultad=2 tipo=compila error ancla=3-la-combinacion-perfecta-polimorfismo-when-smart-casting}

¿Qué ocurre al compilar este programa?

```kotlin
sealed interface Forma
class Circulo : Forma
class Cuadrado : Forma

fun nombre(f: Forma) = when (f) {
    is Circulo -> "círculo"
}

fun main() {
    println(nombre(Circulo()))
}
```

### A ✔

Error de compilación: el `when` no es exhaustivo porque falta el caso `Cuadrado`.

> Correcto. El compilador conoce todos los subtipos de `Forma` y detecta que falta uno. Esta comprobación es la gran ventaja de los tipos sellados.

### B

Compila e imprime `círculo`.

> Aunque la llamada use un `Circulo`, la función debe funcionar para **cualquier** `Forma`.

### C

Compila, pero lanza una excepción si se pasa un `Cuadrado`.

> El fallo se detecta en compilación, no en ejecución.

### D

Error de compilación: una `sealed interface` no puede tener clases normales como subtipos.

> Puede tener clases, `data class`, `object` y `data object`.

## kt-sealed-016 {dificultad=3 tipo=salida ancla=32-jerarquias-anidadas}

¿Qué imprime este programa?

```kotlin
sealed interface Evento {
    sealed interface Red : Evento
    data object SinConexion : Red
    data class Timeout(val segundos: Int) : Red
    data object Logout : Evento
}

fun mensaje(e: Evento) = when (e) {
    is Evento.Red -> "problema de red"
    Evento.Logout -> "sesión cerrada"
}

fun main() {
    println(mensaje(Evento.Timeout(3)))
}
```

### A ✔

`problema de red`

> Correcto. Las jerarquías selladas se pueden **anidar**. La rama `is Evento.Red` cubre a la vez `SinConexion` y `Timeout`, y con `Logout` el `when` ya es exhaustivo.

### B

Error de compilación: falta la rama `Timeout`.

> No hace falta: `Timeout` es un `Red`, y la rama `is Evento.Red` lo cubre.

### C

`Timeout(segundos=3)`

> Se imprime el texto que devuelve `mensaje`, no el evento.

### D

`sesión cerrada`

> Un `Timeout` no es `Logout`.

## kt-sealed-017 {dificultad=2 tipo=concepto ancla=4-cuadro-comparativo-enum-class-vs-sealed-interface}

¿Cuándo conviene una `sealed interface` en lugar de un `enum class`?

### A ✔

Cuando cada caso necesita **datos distintos** (por ejemplo, `Exito(val datos)` y `Error(val mensaje)`) o puede haber varias instancias de un mismo caso.

> Correcto. Las constantes de un `enum` tienen todas las mismas propiedades y son únicas. Los subtipos de un tipo sellado pueden tener cada uno su propia forma.

### B

Cuando los casos son un conjunto fijo de valores sin datos, como los días de la semana.

> Ese es el caso típico de `enum`.

### C

Cuando se quiere usar `when` sin `else`.

> Ambos lo permiten: tanto `enum` como `sealed` hacen que el `when` sea exhaustivo.

### D

Cuando se necesita recorrer todos los casos con `entries`.

> `entries` existe en los `enum`, no en los tipos sellados.

## kt-sealed-018 {dificultad=2 tipo=salida ancla=21-y-cuando-sealed-class}

¿Qué imprime este programa?

```kotlin
sealed class Vehiculo(val ruedas: Int) {
    class Moto : Vehiculo(2)
    class Coche : Vehiculo(4)
}

fun main() {
    val flota = listOf(Vehiculo.Moto(), Vehiculo.Coche(), Vehiculo.Coche())
    println(flota.sumOf { it.ruedas })
}
```

### A ✔

`10`

> Correcto. A diferencia de la interfaz, una `sealed class` puede tener **constructor y estado** comunes. Cada subclase pasa su número de ruedas: 2 + 4 + 4 = 10.

### B

`6`

> La flota tiene **dos** coches.

### C

Error de compilación: no se puede instanciar una `sealed class`.

> No se puede instanciar la propia `Vehiculo`, pero sí sus subclases concretas.

### D

Error de compilación: una `sealed class` no puede tener constructor.

> Sí puede, y esa es una de las razones para elegirla frente a la `sealed interface`.

## kt-sealed-019 {dificultad=3 tipo=concepto ancla=por-que-esta-sinergia-es-revolucionaria}

Tienes un `when` sobre una `sealed interface UiState` que cubre todos sus subtipos, y además le añades una rama `else`. ¿Qué inconveniente tiene ese `else`?

### A ✔

Si más adelante se añade un nuevo subtipo, el compilador **no avisará** de que el `when` no lo trata: el caso nuevo caerá en el `else` sin que nadie se dé cuenta.

> Correcto. La ventaja de los tipos sellados es que el compilador señala todos los `when` que hay que actualizar. Un `else` innecesario anula esa protección.

### B

Ninguno: el `else` siempre es obligatorio.

> Con un tipo sellado cubierto por completo, `else` no es obligatorio.

### C

Da error de compilación porque `else` está prohibido en tipos sellados.

> No está prohibido: compila, pero es mala práctica si ya se cubren todos los casos.

### D

Hace que el `when` sea más lento.

> No hay diferencia de rendimiento apreciable; el problema es de mantenimiento.

## kt-gen-020 {dificultad=1 tipo=salida ancla=25-genericos.md#2-funciones-genericas}

¿Qué imprime este programa?

```kotlin
fun <T> repetir(x: T, veces: Int): List<T> = List(veces) { x }

fun main() {
    println(repetir("ok", 3))
    println(repetir(7, 2))
}
```

### A ✔

```text
[ok, ok, ok]
[7, 7]
```

> Correcto. La misma función genérica sirve para `String` y para `Int`: `T` se infiere en cada llamada.

### B

Error de compilación: `T` no se puede inferir.

> Se infiere a partir del primer argumento.

### C

```text
[ok3]
[72]
```

> `List(veces) { x }` crea una lista de `veces` elementos, todos iguales a `x`.

### D

```text
okokok
77
```

> Se devuelve una lista, no una cadena concatenada.

## kt-gen-021 {dificultad=3 tipo=salida ancla=25-genericos.md#1-clases-genericas}

¿Qué imprime este programa?

```kotlin
class Par<A, B>(val primero: A, val segundo: B) {
    fun <R> transformarPrimero(f: (A) -> R) = Par(f(primero), segundo)
}

fun main() {
    val p = Par(3, "x").transformarPrimero { it * 2 }
    println("${p.primero} ${p.segundo}")
}
```

### A ✔

`6 x`

> Correcto. Un método puede tener **sus propios** parámetros de tipo (`R`) además de los de la clase. El resultado es un `Par<Int, String>` con el primer valor transformado.

### B

`3 x`

> `transformarPrimero` devuelve un par nuevo con `f(primero)`.

### C

Error de compilación: un método no puede declarar un parámetro de tipo distinto de los de la clase.

> Sí puede: `fun <R> ...` dentro de una clase genérica es válido.

### D

`6 xx`

> Solo se transforma el primer valor.

## kt-gen-022 {dificultad=3 tipo=salida ancla=25-genericos.md#42-contravarianza-con-in-consumidores-de-datos}

¿Qué imprime este programa?

```kotlin
interface Impresora<in T> {
    fun imprimir(x: T)
}

class ImpresoraUniversal : Impresora<Any> {
    override fun imprimir(x: Any) = println("-> $x")
}

fun main() {
    val p: Impresora<String> = ImpresoraUniversal()
    p.imprimir("hola")
}
```

### A ✔

`-> hola`

> Correcto. Con `in T` la interfaz es **contravariante**: solo **consume** valores de tipo `T`. Una impresora capaz de imprimir cualquier cosa (`Any`) sirve también donde se pide una de `String`.

### B

Error de compilación: una `Impresora<Any>` no es una `Impresora<String>`.

> Sin `in` sería así. La contravarianza permite justo esta asignación.

### C

Lanza `ClassCastException`.

> Es seguro: cualquier `String` es también un `Any`.

### D

`-> String`

> Se imprime el valor recibido, no su tipo.

## kt-gen-023 {dificultad=3 tipo=compila error ancla=25-genericos.md#41-covarianza-con-out-productores-de-datos}

¿Qué ocurre al compilar esta clase?

```kotlin
class Caja<out T>(var contenido: T)
```

### A ✔

Error de compilación: un parámetro `out T` no puede aparecer en una propiedad `var`, porque el *setter* **recibiría** un `T`.

> Correcto. `out` significa que la clase solo **produce** `T`. Una propiedad `var` también lo consume (al asignarla), así que no es compatible. Con `val contenido: T` sí compilaría.

### B

Compila sin problemas.

> El compilador comprueba que `T` solo se use en posiciones de salida.

### C

Error de compilación: `out` solo se puede usar en interfaces.

> `out` se puede usar en clases e interfaces.

### D

Compila, pero `contenido` se vuelve de solo lectura.

> No llega a compilar.

## kt-gen-024 {dificultad=2 tipo=salida ancla=25-genericos.md#2-funciones-genericas}

¿Qué imprime este código?

```kotlin
val mezcla = listOf(1, "a", 2.5, 3)
println(mezcla.filterIsInstance<Int>())
```

### A ✔

`[1, 3]`

> Correcto. La lista es `List<Any>`, y `filterIsInstance<Int>()` se queda con los elementos de ese tipo y devuelve directamente una `List<Int>`.

### B

`[1, 2.5, 3]`

> 2.5 es un `Double`, no un `Int`.

### C

`[1, 2, 3]`

> No se convierte nada: solo se seleccionan los que ya son `Int`.

### D

Error de compilación: no se pueden mezclar tipos en una lista.

> Se puede: el tipo inferido es `List<Any>`.

## kt-gen-025 {dificultad=2 tipo=salida ancla=25-genericos.md#3-restricciones-de-tipo-upper-bounds}

¿Qué imprime este programa?

```kotlin
fun <T : Number> media(valores: List<T>) = valores.sumOf { it.toDouble() } / valores.size

fun main() {
    println(media(listOf(1, 2, 3, 4)))
    println(media(listOf(0.5, 1.5)))
}
```

### A ✔

```text
2.5
1.0
```

> Correcto. Gracias a la restricción `T : Number`, la misma función sirve para listas de `Int` y de `Double`, y puede usar `toDouble()` con cualquiera.

### B

```text
2
1.0
```

> La suma se hace en `Double`, así que la media de los `Int` también tiene decimales.

### C

Error de compilación: no se puede llamar a `toDouble()` sobre `T`.

> La restricción garantiza que `T` es un `Number`, que tiene `toDouble()`.

### D

Error de compilación: hacen falta dos funciones, una para `Int` y otra para `Double`.

> Evitar esa duplicación es justo lo que permiten los genéricos.

## kt-gen-026 {dificultad=1 tipo=concepto ancla=25-genericos.md#1-clases-genericas}

¿Qué ventaja tiene una clase genérica `Caja<T>` frente a una `Caja` que guarde el contenido como `Any`?

### A ✔

Que el compilador conoce el tipo exacto del contenido: no hacen falta conversiones (*casts*) y se detectan los errores de tipo en compilación.

> Correcto. Con `Any` habría que convertir al leer (`contenido as String`), y un error solo aparecería en ejecución.

### B

Que ocupa menos memoria.

> La ventaja es la seguridad de tipos, no la memoria.

### C

Que puede guardar varios valores a la vez.

> Una `Caja<T>` sigue guardando un solo valor.

### D

Ninguna: son equivalentes.

> Con `Any` se pierde la información del tipo y se necesitan conversiones arriesgadas.

## kt-sealed-027 {dificultad=3 tipo=salida ancla=32-jerarquias-anidadas}

¿Qué imprime este programa?

```kotlin
sealed interface Expr
data class Num(val v: Int) : Expr
data class Suma(val a: Expr, val b: Expr) : Expr

fun evaluar(e: Expr): Int = when (e) {
    is Num -> e.v
    is Suma -> evaluar(e.a) + evaluar(e.b)
}

fun main() {
    println(evaluar(Suma(Num(2), Suma(Num(3), Num(4)))))
}
```

### A ✔

`9`

> Correcto. Una jerarquía sellada sirve para modelar estructuras **recursivas**, como un árbol de expresiones. `evaluar` recorre el árbol: 2 + (3 + 4) = 9.

### B

`5`

> La suma interior (3 + 4) también se evalúa.

### C

Error de compilación: una `data class` no puede contener otra del mismo tipo sellado.

> Sí puede: `Suma` contiene dos `Expr`, que pueden ser `Num` o `Suma`.

### D

Lanza `StackOverflowError`.

> La recursión termina al llegar a los `Num`.

## kt-sealed-028 {dificultad=1 tipo=salida ancla=5-el-patron-universal-de-arquitectura-en-android-uistate}

¿Qué imprime este programa?

```kotlin
sealed interface Estado {
    data object Cargando : Estado
    data class Listo(val n: Int) : Estado
}

fun main() {
    val historial = listOf(Estado.Cargando, Estado.Listo(3), Estado.Cargando)
    println(historial.count { it is Estado.Cargando })
}
```

### A ✔

`2`

> Correcto. `is` comprueba el subtipo de cada elemento. Hay dos `Cargando` en la lista (que son, de hecho, el mismo objeto).

### B

`1`

> Aunque `Cargando` sea un único objeto, aparece dos veces en la lista.

### C

`3`

> `Listo(3)` no es `Cargando`.

### D

Error de compilación: no se puede usar `is` con un `data object`.

> Se puede (aunque con un `object` también vale `==`).

## kt-sealed-029 {dificultad=2 tipo=compila error ancla=2-la-solucion-de-kotlin-tipos-sellados-polimorfismo-restringido}

¿Qué ocurre al compilar este programa?

```kotlin
sealed class Estado

fun main() {
    val e = Estado()
}
```

### A ✔

Error de compilación: una `sealed class` es abstracta y no se puede instanciar directamente.

> Correcto. Solo se pueden crear instancias de sus subclases concretas.

### B

Compila y crea un `Estado` vacío.

> Las clases selladas son implícitamente abstractas.

### C

Error de compilación: falta `open`.

> `open` no cambiaría nada: el problema es que la clase es abstracta.

### D

Compila, pero lanza una excepción al ejecutar.

> No llega a compilar.

## kt-sealed-030 {dificultad=2 tipo=salida ancla=sintaxis-moderna-con-data-object-y-data-class}

¿Qué imprime este programa?

```kotlin
sealed interface Pago {
    val importe: Double
}
data class Tarjeta(override val importe: Double, val ultimos: String) : Pago
data class Bizum(override val importe: Double) : Pago

fun main() {
    val pagos: List<Pago> = listOf(Tarjeta(20.0, "1234"), Bizum(5.5))
    println(pagos.sumOf { it.importe })
}
```

### A ✔

`25.5`

> Correcto. Una `sealed interface` puede declarar propiedades **comunes** que todos los subtipos implementan, así que se pueden usar sin `when`. Cada subtipo añade además sus propios datos.

### B

Error de compilación: hay que hacer `when` para acceder a `importe`.

> `importe` está declarada en la interfaz, así que es accesible en cualquier `Pago`.

### C

`20.0`

> Se suman los dos pagos.

### D

Error de compilación: una interfaz sellada no puede tener propiedades.

> Puede declararlas, sin guardar estado.

## kt-sealed-031 {dificultad=3 tipo=salida ancla=31-when-como-expresion-devolver-un-valor}

¿Qué imprime este programa?

```kotlin
sealed interface Resultado<out T> {
    data class Ok<T>(val valor: T) : Resultado<T>
    data object Error : Resultado<Nothing>
}

fun <T> Resultado<T>.valorO(defecto: T): T = when (this) {
    is Resultado.Ok -> valor
    Resultado.Error -> defecto
}

fun main() {
    println(Resultado.Ok(5).valorO(0) + Resultado.Error.valorO(7))
}
```

### A ✔

`12`

> Correcto. Es el patrón de `Result` genérico. `Error` es un `Resultado<Nothing>`, y gracias a `out T` sirve como `Resultado` de cualquier tipo. `Ok(5)` aporta 5 y `Error` aporta el valor por defecto, 7.

### B

`5`

> `Error.valorO(7)` devuelve el valor por defecto, 7.

### C

Error de compilación: un `Resultado<Nothing>` no puede usarse como `Resultado<Int>`.

> Con `out T` sí: `Nothing` es subtipo de todo, así que `Resultado<Nothing>` es subtipo de `Resultado<Int>`.

### D

`7`

> `Ok(5)` también aporta su valor.

## kt-sealed-032 {dificultad=2 tipo=concepto ancla=pruebalo-booleanos-frente-a-sealed-interface}

En un ViewModel, ¿qué ventaja tiene modelar el estado con una `sealed interface UiState` (`Cargando`, `Exito`, `Error`) frente a varios `Boolean` (`cargando`, `hayError`…)?

### A ✔

Que hace imposibles los **estados contradictorios** (por ejemplo, cargando y con error a la vez) y obliga a la interfaz a tratar todos los casos.

> Correcto. Con booleanos independientes caben combinaciones absurdas. Con un tipo sellado, el estado es exactamente uno de los casos y el `when` exhaustivo lo garantiza.

### B

Que ocupa menos memoria.

> La ventaja es de diseño y seguridad, no de memoria.

### C

Que permite cambiar el estado sin recomponer la interfaz.

> Recomponer cuando cambia el estado es justo lo que se busca.

### D

Que no hace falta usar `StateFlow`.

> Se suele combinar con `StateFlow<UiState>`.

## kt-sealed-033 {dificultad=1 tipo=salida ancla=sintaxis-moderna-con-data-object-y-data-class}

¿Qué imprime este programa?

```kotlin
sealed interface Estado {
    data object Cargando : Estado
}

fun main() {
    println("Estado: ${Estado.Cargando}")
}
```

### A ✔

`Estado: Cargando`

> Correcto. `data object` genera un `toString()` que devuelve su nombre, así que se puede mostrar o registrar directamente.

### B

`Estado: Estado.Cargando`

> El `toString()` de un `data object` es solo su nombre simple.

### C

Algo como `Estado: Estado$Cargando@1b6d3586`

> Eso sería con un `object` normal, sin `data`.

### D

Error de compilación: no se puede usar un `object` en una plantilla.

> En una plantilla se puede usar cualquier valor: se llama a su `toString()`.

## kt-gen-034 {dificultad=2 tipo=salida ancla=25-genericos.md#2-funciones-genericas}

¿Qué imprime este programa?

```kotlin
fun <T, R> transformar(lista: List<T>, f: (T) -> R): List<R> {
    val resultado = mutableListOf<R>()
    for (x in lista) resultado.add(f(x))
    return resultado
}

fun main() {
    println(transformar(listOf("a", "bb")) { it.length })
}
```

### A ✔

`[1, 2]`

> Correcto. Es una versión casera de `map`: `T` es el tipo de entrada (`String`) y `R` el de salida (`Int`). Así funciona por dentro la biblioteca estándar.

### B

`[a, bb]`

> La función aplica `f` a cada elemento.

### C

Error de compilación: el compilador no puede inferir `R`.

> Lo infiere a partir de la lambda, que devuelve un `Int`.

### D

`3`

> Se devuelve una lista con un resultado por elemento.

## kt-gen-035 {dificultad=2 tipo=compila error ancla=25-genericos.md#3-restricciones-de-tipo-upper-bounds}

¿Qué ocurre al compilar esta función?

```kotlin
fun <T> longitud(x: T) = x.length
```

### A ✔

Error de compilación: `T` podría ser cualquier tipo, y no todos tienen `length`.

> Correcto. Sin restricciones, de `T` solo se sabe que es `Any?`. Para usar `length` habría que restringirlo (`T : CharSequence`) o no hacer la función genérica.

### B

Compila, y falla en ejecución si `T` no tiene `length`.

> Kotlin comprueba los genéricos en compilación.

### C

Compila, porque `T` se infiere como `String`.

> Dentro de la función no se sabe con qué tipo se va a llamar.

### D

Error de compilación: una función genérica no puede tener cuerpo de expresión.

> Puede. El problema es `.length`.

## kt-gen-036 {dificultad=2 tipo=salida ancla=25-genericos.md#4-varianza-en-kotlin-covarianza-out-y-contravarianza-in}

¿Qué imprime este programa?

```kotlin
fun contar(lista: List<*>) = lista.size

fun main() {
    println(contar(listOf(1, "a", null)) + contar(listOf(2.5)))
}
```

### A ✔

`4`

> Correcto. `List<*>` («lista de algo») acepta listas de **cualquier** tipo cuando no importa cuál es. Se pueden leer cosas que no dependen del tipo, como `size`.

### B

`3`

> También se suma la segunda lista, de un elemento.

### C

Error de compilación: hay que indicar el tipo de los elementos.

> El `*` (proyección estrella) indica precisamente que el tipo no importa.

### D

`2`

> `contar` devuelve el tamaño de cada lista, no 1 por lista.
