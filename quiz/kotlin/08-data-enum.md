---
bloque: 8
titulo: Data classes y enum classes
apuntes: temas/00-android/00-kotlin/23-data-classes.md
---

## kt-dc-001 {dificultad=1 tipo=salida ancla=23-metodos-componentn-para-desestructuracion}

¿Qué imprime este programa?

```kotlin
data class Partida(val jugador: String, val puntos: Int, val nivel: Int)

fun main() {
    val (_, puntos, nivel) = Partida("Ana", 1200, 4)
    println(puntos / nivel)
}
```

### A ✔

`300`

> Correcto. La desestructuración reparte las propiedades **en orden**: `_` ignora la primera (`jugador`), `puntos` recibe 1200 y `nivel` recibe 4. 1200 / 4 = 300.

### B

Error de compilación: `_` no es un nombre de variable válido.

> `_` es la forma de indicar que **no te interesa** un componente. Así no hace falta declarar una variable que no vas a usar.

### C

`0`

> No se asigna por nombre a partir del segundo componente: `_` ocupa la primera posición, y `puntos` y `nivel` reciben los valores correctos.

### D

Error de compilación: hay que desestructurar todas las propiedades con nombre.

> Se pueden omitir componentes con `_`, e incluso desestructurar solo los primeros: `val (j, p) = partida`.

## kt-dc-002 {dificultad=2 tipo=salida ancla=23-metodos-componentn-para-desestructuracion}

¿Qué imprime este programa?

```kotlin
data class Juego(val titulo: String, val nota: Int)

fun main() {
    val juegos = listOf(Juego("Celeste", 94), Juego("Hades", 93))
    for ((titulo, nota) in juegos) {
        print("$titulo:$nota ")
    }
}
```

### A ✔

`Celeste:94 Hades:93`

> Correcto. Una `data class` genera `component1()`, `component2()`… en el orden del constructor, y eso permite **desestructurar** cada elemento en el `for`.

### B

`Juego(titulo=Celeste, nota=94):null Juego(titulo=Hades, nota=93):null`

> La desestructuración no asigna el objeto entero a la primera variable: reparte sus propiedades en orden.

### C

`94:Celeste 93:Hades`

> Se desestructura **por posición** (orden del constructor), no por nombre: `titulo` recibe `component1()`, que es el título.

### D

Error de compilación: solo se pueden desestructurar `Pair` y `Map.Entry`.

> Cualquier clase con funciones `componentN()` se puede desestructurar, y las `data class` las generan automáticamente.

## kt-dc-003 {dificultad=2 tipo=salida ancla=22-equals-y-hashcode-basados-en-contenido}

¿Qué imprime este programa?

```kotlin
data class Casilla(val fila: Int, val col: Int)

fun main() {
    val visitadas = setOf(Casilla(1, 2), Casilla(1, 2), Casilla(2, 1))
    println(visitadas.size)
}
```

### A ✔

`2`

> Correcto. El `Set` usa `equals` y `hashCode`, que en una `data class` se basan en el **contenido**. Las dos `Casilla(1, 2)` son iguales y se guarda solo una. `Casilla(2, 1)` es distinta porque el orden de los valores importa.

### B

`3`

> Eso pasaría con una `class` normal: cada objeto solo es igual a sí mismo (identidad). La `data class` compara por contenido.

### C

`1`

> `Casilla(2, 1)` no es igual a `Casilla(1, 2)`: se comparan `fila` con `fila` y `col` con `col`.

### D

Lanza `IllegalArgumentException` por elementos repetidos.

> Un `Set` no lanza nada con duplicados: simplemente no los añade.

## kt-enum-004 {dificultad=1 tipo=salida ancla=24-enum-classes.md#2-enums-con-propiedades-y-metodos}

¿Qué imprime este programa?

```kotlin
enum class Semaforo(val segundos: Int) { ROJO(30), AMBAR(5), VERDE(25) }

fun main() {
    println(Semaforo.entries.sumOf { it.segundos })
    println(Semaforo.AMBAR.ordinal)
}
```

### A ✔

```text
60
1
```

> Correcto. `entries` es la lista de todas las constantes: 30 + 5 + 25 = 60. `ordinal` es la posición de la constante, empezando en 0, así que `AMBAR` es la 1.

### B

```text
60
2
```

> `ordinal` empieza en **0**, como los índices: `ROJO` es 0 y `AMBAR` es 1.

### C

```text
3
1
```

> Se suman los `segundos` de cada constante, no se cuentan. Contarlas sería `entries.size`.

### D

Error de compilación: un `enum` no puede tener propiedades.

> Los `enum class` de Kotlin pueden tener constructor, propiedades y métodos, igual que una clase.

## kt-enum-005 {dificultad=2 tipo=salida excepcion=IllegalArgumentException ancla=24-enum-classes.md#1-declaracion-basica-de-un-enum-class}

¿Qué ocurre al ejecutar este programa?

```kotlin
enum class Color { ROJO, VERDE, AZUL }

fun main() {
    val c = Color.valueOf("Amarillo")
    println(c)
}
```

### A ✔

Lanza `IllegalArgumentException`: no existe ninguna constante con ese nombre.

> Correcto. `valueOf` busca la constante **por su nombre exacto**. Si no existe, lanza una excepción. Una alternativa segura es `Color.entries.find { it.name == texto }`, que devuelve `null`.

### B

Imprime `null`.

> `valueOf` nunca devuelve `null`: su tipo de retorno es `Color` (no anulable). Si no encuentra el nombre, lanza una excepción.

### C

Imprime `ROJO`, la primera constante.

> No hay valor por defecto: el nombre debe coincidir exactamente, incluidas mayúsculas.

### D

Error de compilación: `"Amarillo"` no es un valor del enum.

> El compilador no comprueba el contenido del `String`: el error aparece **en ejecución**.

## kt-enum-006 {dificultad=2 tipo=compila error ancla=24-enum-classes.md#5-el-duo-estrella-enum-y-la-expresion-when-exhaustiva}

¿Qué ocurre al compilar este programa?

```kotlin
enum class Modo { CLARO, OSCURO, SISTEMA }

fun icono(m: Modo) = when (m) {
    Modo.CLARO -> "☀"
    Modo.OSCURO -> "☾"
}

fun main() {
    println(icono(Modo.CLARO))
}
```

### A ✔

Error de compilación: el `when` no es exhaustivo porque falta `Modo.SISTEMA`.

> Correcto. Como `when` devuelve un valor, debe cubrir todos los casos. Con un `enum` el compilador conoce todas las constantes y avisa si falta alguna. Es una gran ventaja: si añades una constante, te señala todos los `when` que hay que actualizar.

### B

Compila e imprime `☀`.

> Que la llamada concreta use `CLARO` no importa: el compilador comprueba la función para **cualquier** valor de `Modo`.

### C

Compila, pero lanza una excepción si se llama con `SISTEMA`.

> El fallo se detecta en compilación. Esa garantía es la razón de usar `enum` (o `sealed`) con `when`.

### D

Error de compilación: en un `when` con `enum` siempre es obligatorio `else`.

> No es obligatorio si se cubren **todas** las constantes. De hecho, es preferible no poner `else` para que el compilador avise cuando se añadan constantes nuevas.

## kt-dc-007 {dificultad=3 tipo=salida ancla=3-el-metodo-copy-y-la-inmutabilidad}

¿Qué imprime este programa?

```kotlin
data class Equipo(val nombre: String, val miembros: MutableList<String>)

fun main() {
    val a = Equipo("A", mutableListOf("Ana"))
    val b = a.copy(nombre = "B")
    b.miembros.add("Luis")
    println(a.miembros)
}
```

### A ✔

`[Ana, Luis]`

> Correcto. `copy()` hace una copia **superficial**: la nueva instancia apunta a **la misma** lista mutable. Modificarla desde `b` se ve también desde `a`. Por eso en una `data class` conviene usar colecciones inmutables (`List`).

### B

`[Ana]`

> `copy()` no clona en profundidad las propiedades: copia la referencia a la lista, no la lista.

### C

Error de compilación: no se puede modificar una propiedad `val`.

> `miembros` es `val` (no se puede reasignar), pero la lista a la que apunta es mutable.

### D

`[Luis]`

> `add` añade al final; no sustituye el contenido.

## kt-dc-008 {dificultad=2 tipo=salida ancla=22-equals-y-hashcode-basados-en-contenido}

¿Qué imprime este programa?

```kotlin
data class Punto(val x: Int, val y: Int)

fun main() {
    println(Punto(1, 2).hashCode() == Punto(1, 2).hashCode())
    println(Punto(1, 2).hashCode() == Punto(2, 1).hashCode())
}
```

### A ✔

```text
true
false
```

> Correcto. El `hashCode()` generado se calcula a partir del **contenido y del orden** de las propiedades: dos puntos iguales tienen el mismo, y `Punto(2, 1)` (otro contenido) tiene uno distinto. Así funcionan bien como claves de `HashMap` o en un `HashSet`.

### B

```text
true
true
```

> Los valores son los mismos pero en otro orden, y el `hashCode` generado tiene en cuenta la posición de cada propiedad.

### C

```text
false
false
```

> En el primer par, `x` e `y` coinciden, así que el `hashCode` generado es el mismo.

### D

```text
false
true
```

> El primer par tiene el mismo contenido, así que su `hashCode` coincide.

## kt-dc-009 {dificultad=2 tipo=salida ancla=22-equals-y-hashcode-basados-en-contenido}

¿Qué imprime este programa?

```kotlin
data class Casilla(val fila: Int, val col: Int)

fun main() {
    val visitas = mutableMapOf<Casilla, Int>()
    visitas[Casilla(0, 0)] = 1
    visitas[Casilla(0, 0)] = (visitas[Casilla(0, 0)] ?: 0) + 1
    println(visitas.size)
    println(visitas[Casilla(0, 0)])
}
```

### A ✔

```text
1
2
```

> Correcto. Al ser `data class`, dos `Casilla(0, 0)` son iguales y tienen el mismo `hashCode`, así que sirven como **la misma clave** del mapa. Por eso las *data class* son buenas claves.

### B

```text
2
1
```

> Con una clase normal sí habría dos claves distintas. Con `data class` se reconoce la misma clave.

### C

```text
1
null
```

> Se busca con un objeto nuevo, pero igual en contenido, así que el mapa encuentra la entrada.

### D

Lanza `NullPointerException`.

> El operador Elvis cubre el caso en que la clave no existe.

## kt-dc-010 {dificultad=1 tipo=salida ancla=23-metodos-componentn-para-desestructuracion}

¿Qué imprime este programa?

```kotlin
data class Punto(val x: Int, val y: Int)

fun main() {
    println(Punto(3, 4).component2())
}
```

### A ✔

`4`

> Correcto. Una `data class` genera `component1()`, `component2()`… en el orden del constructor. `component2()` es `y`.

### B

`3`

> `component1()` sería `x`. Los números empiezan en 1, no en 0.

### C

Error de compilación: `component2()` no existe.

> Se genera automáticamente en toda `data class` para cada propiedad del constructor primario.

### D

`Punto(x=3, y=4)`

> `component2()` devuelve un solo valor, no el objeto.

## kt-dc-011 {dificultad=1 tipo=compila error ancla=1-declaracion-de-una-data-class}

¿Qué ocurre al compilar este programa?

```kotlin
data class Punto(val x: Int, val y: Int)

fun main() {
    val p = Punto(1, 2)
    p.x = 5
}
```

### A ✔

Error de compilación: `x` es `val` y no se puede reasignar.

> Correcto. Las propiedades `val` de una `data class` son de solo lectura. Para «cambiar» un valor se crea otra instancia (por ejemplo, con `copy`).

### B

Compila: en una `data class` todas las propiedades son mutables.

> `data` no cambia la mutabilidad: la decide `val` o `var`.

### C

Compila, pero el cambio se ignora.

> Kotlin no ignora asignaciones: si no están permitidas, no compilan.

### D

Error de compilación: `p` es `val`.

> El error está en la propiedad `x`, no en la variable `p`.

## kt-dc-012 {dificultad=2 tipo=salida ancla=1-declaracion-de-una-data-class}

¿Qué imprime este programa?

```kotlin
data class Alumno(val nombre: String, val nota: Double)

fun main() {
    val clase = listOf(Alumno("Ana", 7.5), Alumno("Luis", 9.0), Alumno("Eva", 8.2))
    println(clase.sortedByDescending { it.nota }.first().nombre)
}
```

### A ✔

`Luis`

> Correcto. `sortedByDescending` ordena de mayor a menor nota, y `first()` toma el primero: Luis, con 9.0.

### B

`Ana`

> Ana es la primera de la lista original, pero se ordena antes de tomar el primero.

### C

`Eva`

> Eva tiene 8.2, menos que Luis.

### D

`9.0`

> Se imprime `.nombre`, no la nota.

## kt-enum-013 {dificultad=1 tipo=salida ancla=24-enum-classes.md#3-iteracion-moderna-entries-vs-values}

¿Qué imprime este programa?

```kotlin
enum class Talla { S, M, L }

fun main() {
    println(Talla.entries.map { it.name.lowercase() })
}
```

### A ✔

`[s, m, l]`

> Correcto. `entries` es la lista de constantes en orden de declaración, y `name` es el nombre de cada una como `String`.

### B

`[S, M, L]`

> `lowercase()` pasa cada nombre a minúsculas.

### C

`[0, 1, 2]`

> Eso sería `ordinal`. `name` es el texto de la constante.

### D

Error de compilación: hay que usar `values()`.

> `values()` sigue existiendo, pero desde Kotlin 1.9 lo recomendado es `entries`.

## kt-enum-014 {dificultad=2 tipo=salida ancla=24-enum-classes.md#2-enums-con-propiedades-y-metodos}

¿Qué imprime este programa?

```kotlin
enum class Planeta(val gravedad: Double) {
    TIERRA(9.8), MARTE(3.7);

    fun peso(masa: Double) = masa * gravedad
}

fun main() {
    println(Planeta.MARTE.peso(10.0))
}
```

### A ✔

`37.0`

> Correcto. Cada constante tiene su propio valor de `gravedad`, y el método `peso` lo usa: 10 · 3.7 = 37.0.

### B

`98.0`

> Se llama sobre `MARTE`, así que se usa su gravedad (3.7), no la de la Tierra.

### C

Error de compilación: un `enum` no puede tener métodos.

> Puede tener métodos y propiedades. El `;` separa las constantes del resto del cuerpo.

### D

`37`

> `masa * gravedad` es un `Double`, así que se imprime con decimal.

## kt-enum-015 {dificultad=3 tipo=salida ancla=24-enum-classes.md#1-declaracion-basica-de-un-enum-class}

¿Qué imprime este programa?

```kotlin
enum class Talla { S, M, L }

fun main() {
    println(Talla.S < Talla.L)
    println(Talla.entries.maxOrNull())
}
```

### A ✔

```text
true
L
```

> Correcto. Las constantes de un `enum` son comparables **por su orden de declaración** (`ordinal`). `S` va antes que `L`, y la «mayor» es la última.

### B

Error de compilación: no se pueden comparar constantes de un `enum` con `<`.

> Todo `enum` implementa `Comparable` usando el orden de declaración.

### C

```text
false
S
```

> No se compara alfabéticamente ni por tamaño real, sino por posición: `S` (0) < `L` (2).

### D

```text
true
2
```

> `maxOrNull()` devuelve la constante (`L`), no su `ordinal`.

## kt-enum-016 {dificultad=2 tipo=salida ancla=24-enum-classes.md#4-implementacion-de-interfaces}

¿Qué imprime este programa?

```kotlin
interface Describible {
    fun describir(): String
}

enum class Estado(private val texto: String) : Describible {
    ACTIVO("en marcha"), PARADO("detenido");

    override fun describir() = "${name.lowercase()}: $texto"
}

fun main() {
    println(Estado.PARADO.describir())
}
```

### A ✔

`parado: detenido`

> Correcto. Un `enum` puede implementar interfaces. Cada constante tiene su `texto` y comparte la implementación de `describir()`.

### B

Error de compilación: un `enum` no puede implementar interfaces.

> Sí puede, igual que cualquier clase.

### C

`PARADO: detenido`

> `name` es `"PARADO"`, pero se pasa a minúsculas con `lowercase()`.

### D

`parado: en marcha`

> Cada constante tiene su propio `texto`: el de `PARADO` es `"detenido"`.

## kt-enum-017 {dificultad=1 tipo=salida ancla=24-enum-classes.md#5-el-duo-estrella-enum-y-la-expresion-when-exhaustiva}

¿Qué imprime este programa?

```kotlin
enum class Dia { LUNES, MARTES, SABADO, DOMINGO }

fun esFinde(d: Dia) = when (d) {
    Dia.SABADO, Dia.DOMINGO -> true
    Dia.LUNES, Dia.MARTES -> false
}

fun main() {
    println(Dia.entries.count { esFinde(it) })
}
```

### A ✔

`2`

> Correcto. El `when` cubre las cuatro constantes (no necesita `else`), y solo `SABADO` y `DOMINGO` devuelven `true`.

### B

Error de compilación: falta `else` en el `when`.

> Con un `enum`, si se cubren **todas** las constantes, el `when` es exhaustivo sin `else`.

### C

`4`

> `count { }` solo cuenta las constantes que hacen la condición verdadera.

### D

`true`

> `count` devuelve un número, no un `Boolean`.

## kt-enum-018 {dificultad=3 tipo=salida ancla=24-enum-classes.md#2-enums-con-propiedades-y-metodos}

¿Qué imprime este programa?

```kotlin
enum class Nivel(val xpMinima: Int) { NOVATO(0), MEDIO(100), EXPERTO(500) }

fun main() {
    val xp = 250
    println(Nivel.entries.last { xp >= it.xpMinima })
}
```

### A ✔

`MEDIO`

> Correcto. Cumplen la condición `NOVATO` (0) y `MEDIO` (100), pero no `EXPERTO` (500). `last { }` devuelve la **última** constante que cumple, en orden de declaración.

### B

`NOVATO`

> `NOVATO` también cumple, pero `last` busca la última que cumple, no la primera.

### C

`EXPERTO`

> 250 no llega a 500, así que `EXPERTO` no cumple la condición.

### D

Lanza `NoSuchElementException`.

> Solo se lanzaría si ninguna constante cumpliera la condición.

## kt-enum-019 {dificultad=2 tipo=concepto ancla=24-enum-classes.md#1-declaracion-basica-de-un-enum-class}

¿En qué caso es más adecuado un `enum class` que una `data class`?

### A ✔

Para un **conjunto cerrado de valores fijos** conocidos de antemano, como los estados de un pedido o los niveles de dificultad.

> Correcto. Un `enum` tiene un número fijo de instancias, declaradas en el propio código. Una `data class` sirve para crear tantas instancias como haga falta con datos distintos.

### B

Para guardar los datos de cada usuario que se registra en la app.

> Los usuarios son ilimitados y cada uno tiene datos distintos: eso es una `data class`.

### C

Para cualquier clase que necesite `toString()`.

> Ambas generan un `toString()` útil; ese no es el criterio para elegir.

### D

Para poder usar `copy()`.

> `copy()` es de las `data class`. Los `enum` no lo tienen, porque sus instancias son fijas.

## kt-dc-020 {dificultad=2 tipo=salida ancla=21-tostring-descriptivo-y-legible}

¿Qué imprime este programa?

```kotlin
data class Precio(val centimos: Int) {
    override fun toString() = "${centimos / 100},${"%02d".format(centimos % 100)} €"
}

fun main() {
    println(listOf(Precio(1250), Precio(305)))
}
```

### A ✔

`[12,50 €, 3,05 €]`

> Correcto. Si la `data class` define su propio `toString()`, el compilador **no** genera el suyo. La lista usa ese `toString()` para cada elemento. `%02d` rellena con un cero (`05`).

### B

`[Precio(centimos=1250), Precio(centimos=305)]`

> Ese sería el `toString()` generado, pero la clase lo sobrescribe.

### C

`[12,5 €, 3,5 €]`

> `%02d` garantiza dos dígitos: 50 se queda en `50` y 5 pasa a ser `05`.

### D

Error de compilación: una `data class` no puede sobrescribir `toString()`.

> Sí puede: los métodos generados solo se crean si no los defines tú.

## kt-dc-021 {dificultad=2 tipo=salida ancla=1-declaracion-de-una-data-class}

¿Qué imprime este programa?

```kotlin
data class Ajustes(val tema: String = "claro", val tamano: Int = 14)

fun main() {
    println(Ajustes(tamano = 18) == Ajustes("claro", 18))
}
```

### A ✔

`true`

> Correcto. Los valores por defecto y los argumentos con nombre también funcionan en el constructor de una `data class`. Los dos objetos tienen el mismo contenido, así que `==` es `true`.

### B

`false`

> `==` compara el contenido, no la forma de construirlos. Ambos son `Ajustes(tema=claro, tamano=18)`.

### C

Error de compilación: hay que indicar todos los parámetros.

> Los que tienen valor por defecto se pueden omitir.

### D

Error de compilación: no se pueden usar argumentos con nombre en un constructor.

> Se pueden usar en cualquier llamada, también en constructores.

## kt-dc-022 {dificultad=1 tipo=salida ancla=22-equals-y-hashcode-basados-en-contenido}

¿Qué imprime este programa?

```kotlin
data class Carta(val palo: String, val numero: Int)

fun main() {
    val mano = listOf(Carta("oros", 1), Carta("copas", 7))
    println(Carta("copas", 7) in mano)
}
```

### A ✔

`true`

> Correcto. `in` (es decir, `contains`) usa `equals`, que en una `data class` compara el contenido. La carta nueva es igual a la que hay en la lista.

### B

`false`

> Sería `false` con una clase normal, que compara por identidad. La `data class` compara por contenido.

### C

Error de compilación: `in` solo funciona con rangos.

> `in` funciona con cualquier colección.

### D

Lanza una excepción por comparar objetos distintos.

> Comparar objetos nunca lanza excepciones.

## kt-dc-023 {dificultad=2 tipo=salida ancla=23-metodos-componentn-para-desestructuracion}

¿Qué imprime este programa?

```kotlin
data class Marca(val nombre: String, val puntos: Int)

fun main() {
    val marcas = listOf(Marca("ana", 10), Marca("luis", 7))
    println(marcas.map { (nombre, puntos) -> "$nombre:$puntos" })
}
```

### A ✔

`[ana:10, luis:7]`

> Correcto. Los parámetros de una lambda también se pueden desestructurar escribiéndolos **entre paréntesis**: `{ (a, b) -> ... }`.

### B

Error de compilación: una lambda de `map` solo puede tener un parámetro.

> `(nombre, puntos)` es **un** parámetro desestructurado, no dos parámetros.

### C

`[Marca(nombre=ana, puntos=10), Marca(nombre=luis, puntos=7)]`

> `map` devuelve lo que construye la lambda, no los objetos originales.

### D

`[ana, luis]`

> La lambda usa las dos componentes.

## kt-dc-024 {dificultad=3 tipo=salida ancla=22-equals-y-hashcode-basados-en-contenido}

¿Qué imprime este programa?

```kotlin
data class Contador(var valor: Int)

fun main() {
    val c = Contador(1)
    val conjunto = hashSetOf(c)
    c.valor = 2
    println(c in conjunto)
}
```

### A ✔

`false`

> Correcto, y es una trampa real. El `HashSet` guardó `c` según su `hashCode` cuando valía 1. Al cambiar `valor`, cambia su `hashCode` y el conjunto lo busca en otro sitio, así que no lo encuentra aunque es el mismo objeto. Por eso las propiedades de una `data class` deberían ser `val`.

### B

`true`

> Es el mismo objeto, pero el `HashSet` lo busca por su `hashCode` actual, que ya no coincide con el que tenía al guardarlo.

### C

Error de compilación: una `data class` no puede tener propiedades `var`.

> Puede tenerlas, aunque no es recomendable por problemas como este.

### D

Lanza `ConcurrentModificationException`.

> No hay ningún recorrido en marcha. El fallo es silencioso: devuelve `false`.

## kt-dc-025 {dificultad=2 tipo=salida ancla=3-el-metodo-copy-y-la-inmutabilidad}

¿Qué imprime este programa?

```kotlin
data class Tarea(val id: Int, val hecha: Boolean)

fun main() {
    val tareas = listOf(Tarea(1, false), Tarea(2, false))
    val nuevas = tareas.map { if (it.id == 2) it.copy(hecha = true) else it }
    println(nuevas.count { it.hecha })
    println(tareas.count { it.hecha })
}
```

### A ✔

```text
1
0
```

> Correcto. Es el patrón de **actualización inmutable** que se usa en el estado de Compose: no se modifica la tarea, se crea una lista nueva en la que la tarea 2 se sustituye por una copia marcada como hecha. La lista original no cambia.

### B

```text
1
1
```

> `copy` crea un objeto nuevo; la tarea de la lista original sigue con `hecha = false`.

### C

```text
0
0
```

> En `nuevas` la tarea 2 se ha sustituido por su copia con `hecha = true`.

### D

Error de compilación: `hecha` es `val` y no se puede cambiar.

> No se cambia: `copy` crea un objeto nuevo con ese valor distinto.

## kt-dc-026 {dificultad=3 tipo=compila error ancla=4-requisitos-y-restricciones-de-las-data-classes}

¿Qué ocurre al compilar esta declaración?

```kotlin
open data class Animal(val nombre: String)
```

### A ✔

Error de compilación: una `data class` no puede ser `open` (ni `abstract`).

> Correcto. Las `data class` son siempre `final`. Si se pudiera heredar de ellas, el `equals` generado podría romperse al comparar una clase padre con una hija.

### B

Compila, y se puede heredar de `Animal`.

> El modificador `open` es incompatible con `data`.

### C

Compila, pero las subclases no heredan `copy()`.

> No llega a compilar.

### D

Error de compilación: falta `val` en el parámetro.

> El parámetro sí lleva `val`. El problema es `open`.

## kt-enum-027 {dificultad=1 tipo=salida ancla=24-enum-classes.md#1-declaracion-basica-de-un-enum-class}

¿Qué imprime este programa?

```kotlin
enum class Color { ROJO, VERDE, AZUL }

fun main() {
    println(Color.valueOf("VERDE").ordinal)
}
```

### A ✔

`1`

> Correcto. `valueOf` busca la constante por su nombre exacto, y `VERDE` es la segunda (`ordinal` 1, contando desde 0).

### B

`2`

> `ordinal` empieza en 0: `ROJO` es 0 y `VERDE` es 1.

### C

`VERDE`

> Se imprime `ordinal`, no el nombre.

### D

Lanza `IllegalArgumentException`.

> `"VERDE"` sí es el nombre de una constante.

## kt-enum-028 {dificultad=3 tipo=salida ancla=24-enum-classes.md#2-enums-con-propiedades-y-metodos}

¿Qué imprime este programa?

```kotlin
enum class Operacion {
    SUMA {
        override fun aplicar(a: Int, b: Int) = a + b
    },
    RESTA {
        override fun aplicar(a: Int, b: Int) = a - b
    };

    abstract fun aplicar(a: Int, b: Int): Int
}

fun main() {
    println(Operacion.entries.map { it.aplicar(5, 3) })
}
```

### A ✔

`[8, 2]`

> Correcto. Un `enum` puede declarar un método `abstract` que **cada constante** implementa a su manera. Así cada valor del `enum` tiene su propio comportamiento.

### B

Error de compilación: un `enum` no puede tener métodos abstractos.

> Puede, siempre que todas las constantes los implementen.

### C

`[2, 8]`

> `entries` respeta el orden de declaración: `SUMA` primero.

### D

`[8, 8]`

> Cada constante tiene su propia implementación.

## kt-enum-029 {dificultad=2 tipo=salida ancla=24-enum-classes.md#1-declaracion-basica-de-un-enum-class}

¿Qué imprime este programa?

```kotlin
enum class Color { ROJO, VERDE }

fun main() {
    println(Color.ROJO === Color.valueOf("ROJO"))
}
```

### A ✔

`true`

> Correcto. Cada constante de un `enum` es una **única instancia** (como un *singleton*). `valueOf` devuelve esa misma instancia, así que incluso `===` es `true`.

### B

`false`

> `valueOf` no crea un objeto nuevo: devuelve la constante que ya existe.

### C

Error de compilación: no se puede usar `===` con un `enum`.

> Se puede, aunque con `enum` es igual de seguro usar `==`.

### D

Lanza `IllegalArgumentException`.

> `"ROJO"` es un nombre válido.

## kt-enum-030 {dificultad=2 tipo=salida ancla=24-enum-classes.md#3-iteracion-moderna-entries-vs-values}

¿Qué imprime este programa?

```kotlin
enum class Tipo { FRUTA, VERDURA }
data class Producto(val nombre: String, val tipo: Tipo)

fun main() {
    val cesta = listOf(
        Producto("pera", Tipo.FRUTA),
        Producto("col", Tipo.VERDURA),
        Producto("uva", Tipo.FRUTA)
    )
    println(cesta.groupBy { it.tipo }.mapValues { it.value.size })
}
```

### A ✔

`{FRUTA=2, VERDURA=1}`

> Correcto. Un `enum` es una buena clave para agrupar. `groupBy` crea una lista por tipo y `mapValues` la sustituye por su tamaño.

### B

`{FRUTA=[pera, uva], VERDURA=[col]}`

> `mapValues` sustituye cada lista por su tamaño.

### C

`{0=2, 1=1}`

> Las claves son las constantes del `enum`, que se imprimen por su nombre.

### D

`[2, 1]`

> `mapValues` devuelve un `Map`.

## kt-enum-031 {dificultad=1 tipo=salida ancla=24-enum-classes.md#2-enums-con-propiedades-y-metodos}

¿Qué imprime este programa?

```kotlin
enum class Talla(val pecho: Int) { S(90), M(100), L(110) }

fun main() {
    println("${Talla.M} mide ${Talla.M.pecho}")
}
```

### A ✔

`M mide 100`

> Correcto. Al imprimir una constante se muestra su nombre (su `toString()` por defecto es `name`), y `pecho` es la propiedad de esa constante.

### B

`1 mide 100`

> Se imprime el nombre, no el `ordinal`.

### C

`Talla.M mide 100`

> El `toString()` de una constante es solo su nombre, sin el del `enum`.

### D

Error de compilación: hay que escribir `Talla.M.name`.

> `name` también funciona, pero en una plantilla se usa `toString()`, que devuelve el nombre.

## kt-enum-032 {dificultad=3 tipo=salida ancla=24-enum-classes.md#3-iteracion-moderna-entries-vs-values}

¿Qué imprime este programa?

```kotlin
enum class Turno { MANANA, TARDE, NOCHE }

fun Turno.siguiente() = Turno.entries[(ordinal + 1) % Turno.entries.size]

fun main() {
    println(Turno.NOCHE.siguiente())
    println(Turno.MANANA.siguiente())
}
```

### A ✔

```text
MANANA
TARDE
```

> Correcto. Con `ordinal` y el resto (`%`) se avanza de forma **circular**: después de la última constante se vuelve a la primera.

### B

Lanza `IndexOutOfBoundsException` con `NOCHE`.

> `% Turno.entries.size` hace que el índice 3 se convierta en 0.

### C

```text
NOCHE
TARDE
```

> `NOCHE` avanza a la siguiente, que es la primera.

### D

Error de compilación: no se pueden crear funciones de extensión sobre un `enum`.

> Se puede extender cualquier tipo, incluidos los `enum`.

## kt-dc-033 {dificultad=2 tipo=concepto ancla=3-el-metodo-copy-y-la-inmutabilidad}

¿Por qué se recomienda declarar con `val` (y no con `var`) las propiedades de una `data class`?

### A ✔

Porque así el objeto es inmutable: su `equals`/`hashCode` no cambian, se puede compartir sin riesgos y los cambios se hacen creando copias con `copy()`.

> Correcto. Si cambian las propiedades de un objeto que ya está en un `HashSet` o es la clave de un `HashMap`, deja de encontrarse. Y en Compose, el estado inmutable facilita detectar los cambios.

### B

Porque una `data class` no compila con propiedades `var`.

> Compila, pero no es recomendable.

### C

Porque `copy()` solo funciona con propiedades `val`.

> `copy()` funciona con `val` y con `var`.

### D

Porque `val` ocupa menos memoria que `var`.

> La diferencia no es de memoria, sino de seguridad y diseño.

## kt-dc-034 {dificultad=1 tipo=salida ancla=23-metodos-componentn-para-desestructuracion}

¿Qué imprime este código?

```kotlin
val edades = mapOf("Ana" to 20, "Luis" to 31)
println(edades.map { (nombre, edad) -> "$nombre tiene $edad" })
```

### A ✔

`[Ana tiene 20, Luis tiene 31]`

> Correcto. Cada entrada de un `Map` (`Map.Entry`) tiene `component1()` (clave) y `component2()` (valor), así que se puede desestructurar en la lambda.

### B

`{Ana=Ana tiene 20, Luis=Luis tiene 31}`

> `map` sobre un `Map` devuelve una **lista**.

### C

Error de compilación: las entradas de un mapa no se pueden desestructurar.

> Sí se puede, como con `Pair` o las `data class`.

### D

`[Ana, Luis]`

> La lambda construye un texto con la clave y el valor.

## kt-enum-035 {dificultad=2 tipo=salida ancla=24-enum-classes.md#1-declaracion-basica-de-un-enum-class}

¿Qué imprime este programa?

```kotlin
enum class Talla { S, M, L }

fun main() {
    println(listOf(Talla.L, Talla.S, Talla.M).sorted())
}
```

### A ✔

`[S, M, L]`

> Correcto. Las constantes de un `enum` se ordenan por su **orden de declaración**, no alfabéticamente.

### B

`[L, M, S]`

> No se ordenan por nombre, sino por posición: `S` (0), `M` (1), `L` (2).

### C

`[L, S, M]`

> `sorted()` sí ordena: devuelve una lista nueva ordenada.

### D

Error de compilación: no se puede ordenar una lista de constantes de un `enum`.

> Todo `enum` implementa `Comparable`.

## kt-dc-036 {dificultad=3 tipo=salida ancla=22-equals-y-hashcode-basados-en-contenido}

¿Qué imprime este programa?

```kotlin
data class Medida(val valor: Double)

fun main() {
    println(Medida(0.1 + 0.2) == Medida(0.3))
}
```

### A ✔

`false`

> Correcto. El `equals` generado compara cada propiedad con su propio `equals`, y `0.1 + 0.2` no es exactamente `0.3` en coma flotante. La `data class` no arregla los errores de precisión de `Double`.

### B

`true`

> Matemáticamente son iguales, pero en binario `0.1 + 0.2` da `0.30000000000000004`.

### C

Error de compilación: una `data class` no admite propiedades `Double`.

> Admite cualquier tipo.

### D

Lanza `ArithmeticException`.

> La suma de `Double` nunca lanza excepciones.
