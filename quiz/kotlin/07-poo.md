---
bloque: 7
titulo: POO, object y companion
apuntes: temas/00-android/00-kotlin/21-poo.md
---

## kt-poo-001 {dificultad=2 tipo=salida ancla=el-bloque-init}

¿Qué imprime este programa?

```kotlin
class Jugador(val nombre: String) {
    init {
        println("init: $nombre")
    }

    constructor() : this("Anónimo") {
        println("secundario")
    }
}

fun main() {
    Jugador()
}
```

### A ✔

```text
init: Anónimo
secundario
```

> Correcto. El constructor secundario delega en el primario con `this("Anónimo")`. Primero se ejecuta el primario (con sus bloques `init`) y **después** el cuerpo del secundario.

### B

```text
secundario
init: Anónimo
```

> La delegación `: this(...)` se resuelve **antes** del cuerpo del secundario, así que el `init` va primero.

### C

```text
secundario
```

> Todo constructor secundario debe delegar en el primario, y al hacerlo se ejecutan los bloques `init`.

### D

```text
init: 
secundario
```

> El primario recibe `"Anónimo"` desde la delegación, así que `nombre` ya tiene valor cuando se ejecuta `init`.

## kt-poo-002 {dificultad=1 tipo=compila error ancla=4-modificadores-de-visibilidad-kotlin-vs-java}

¿Qué ocurre al compilar este programa?

```kotlin
class Cuenta {
    private var saldo = 0
    fun ingresar(cantidad: Int) { saldo += cantidad }
}

fun main() {
    val c = Cuenta()
    c.ingresar(50)
    c.saldo = 1000
}
```

### A ✔

Error de compilación: `saldo` es `private` y solo se puede usar dentro de `Cuenta`.

> Correcto. `private` restringe el acceso a la propia clase. Desde fuera solo se puede cambiar el saldo con los métodos públicos, como `ingresar`, que es justo lo que busca la encapsulación.

### B

Compila: `val c` hace que el objeto sea inmutable, pero `saldo` es `var`.

> La visibilidad es independiente de `val`/`var`. Aunque `saldo` sea `var`, `private` impide acceder a él desde `main`.

### C

Compila, porque `main` está en el mismo fichero que la clase.

> Eso pasaría con una declaración `private` **de nivel superior** (visible en todo el fichero). Un miembro `private` de una clase solo es visible dentro de esa clase.

### D

Error de compilación: falta `public` delante de `fun ingresar`.

> En Kotlin la visibilidad por defecto ya es `public`. No hace falta escribirla.

## kt-poo-003 {dificultad=2 tipo=salida ancla=getters-y-setters-personalizados-con-field-backing-field}

¿Qué imprime este programa?

```kotlin
class Termostato {
    var grados: Int = 20
        set(valor) {
            field = valor.coerceIn(10, 30)
        }
}

fun main() {
    val t = Termostato()
    t.grados = 45
    println(t.grados)
}
```

### A ✔

`30`

> Correcto. `t.grados = 45` llama al *setter* personalizado, que limita el valor al rango 10..30 con `coerceIn` y lo guarda en el *backing field* (`field`).

### B

`45`

> La asignación no escribe directamente en la propiedad: pasa por el `set(valor)`, que recorta el valor.

### C

`20`

> El *setter* sí guarda un valor nuevo (`field = ...`). Solo lo ajusta al rango permitido.

### D

Bucle infinito (`StackOverflowError`).

> Eso pasaría si el *setter* hiciese `grados = ...`, porque se llamaría a sí mismo. Usar `field` evita esa recursión.

## kt-poo-004 {dificultad=2 tipo=salida ancla=22-objetos-anonimos.md#1-declaracion-de-objetos-el-patron-singleton-nativo}

¿Qué imprime este programa?

```kotlin
object Contador {
    var n = 0
    fun incrementar() = ++n
}

fun main() {
    Contador.incrementar()
    Contador.incrementar()
    println(Contador.incrementar())
}
```

### A ✔

`3`

> Correcto. `object` declara un ***singleton***: existe **una única instancia**, compartida por todo el programa. Cada llamada incrementa el mismo `n`.

### B

`1`

> No se crea un objeto nuevo en cada llamada: `Contador` es siempre la misma instancia.

### C

`2`

> `++n` incrementa **antes** de devolver, así que la tercera llamada devuelve el valor ya incrementado: 3.

### D

Error de compilación: hay que instanciarlo con `Contador()`.

> Un `object` no tiene constructor: se usa directamente por su nombre. `Contador()` sería un error.

## kt-poo-005 {dificultad=2 tipo=salida ancla=22-objetos-anonimos.md#el-patron-factory-method-metodo-factoria}

¿Qué imprime este programa?

```kotlin
class Usuario private constructor(val nombre: String) {
    companion object {
        var creados = 0
        fun crear(nombre: String): Usuario {
            creados++
            return Usuario(nombre.trim())
        }
    }
}

fun main() {
    val u = Usuario.crear("  Ana ")
    Usuario.crear("Luis")
    println("${u.nombre}-${Usuario.creados}")
}
```

### A ✔

`Ana-2`

> Correcto. El constructor es privado, así que los objetos solo se crean con el método factoría del `companion object`, que limpia el nombre y cuenta las creaciones. `creados` pertenece a la **clase**, no a cada objeto.

### B

`  Ana -2`

> `crear` aplica `trim()` antes de construir el objeto, así que se eliminan los espacios.

### C

`Ana-1`

> `creados` es compartido por la clase y ya se han hecho **dos** llamadas a `crear` cuando se imprime.

### D

Error de compilación: el constructor es `private` y no se puede llamar desde el `companion`.

> El `companion object` está **dentro** de la clase, así que puede usar sus miembros privados, incluido el constructor. Desde `main` sí sería un error.

## kt-poo-006 {dificultad=3 tipo=salida ancla=la-magia-de-kotlin-delegacion-de-interfaces-by}

¿Qué imprime este programa?

```kotlin
interface Sonido {
    fun hacer(): String
}

class Ladrido : Sonido {
    override fun hacer() = "Guau"
}

class Perro(sonido: Sonido) : Sonido by sonido {
    fun saludar() = hacer() + "!"
}

fun main() {
    println(Perro(Ladrido()).saludar())
}
```

### A ✔

`Guau!`

> Correcto. `Sonido by sonido` **delega** la implementación de la interfaz en el objeto recibido: el compilador genera `hacer()` en `Perro`, que llama a `sonido.hacer()`.

### B

Error de compilación: `Perro` no implementa `hacer()`.

> Con `by` no hace falta escribirlo: el compilador lo implementa reenviando la llamada al objeto delegado.

### C

`!`

> `hacer()` no devuelve una cadena vacía: devuelve lo que devuelve el `Ladrido` delegado, `"Guau"`.

### D

Error de compilación: una clase no puede heredar de `Ladrido` sin `open`.

> `Perro` no hereda de `Ladrido`: implementa `Sonido` y **delega** en un objeto `Ladrido`. Es composición, no herencia.

## kt-poo-007 {dificultad=2 tipo=salida ancla=multiples-interfaces-superar-la-herencia-simple}

¿Qué imprime este programa?

```kotlin
interface Volador {
    fun volar() = "vuela"
}

abstract class Ave(val nombre: String) {
    abstract fun canto(): String
    fun presentar() = "$nombre: ${canto()}"
}

class Pato : Ave("Pato"), Volador {
    override fun canto() = "cuac"
}

fun main() {
    val p = Pato()
    println(p.presentar() + " y " + p.volar())
}
```

### A ✔

`Pato: cuac y vuela`

> Correcto. `Pato` hereda de **una** clase abstracta e implementa una interfaz. Solo está obligado a implementar `canto()`; `volar()` tiene una implementación por defecto en la interfaz.

### B

Error de compilación: `Pato` debe implementar `volar()`.

> Los métodos de una interfaz **con cuerpo** no son obligatorios: se heredan tal cual si no se sobrescriben.

### C

Error de compilación: una clase no puede heredar de una clase y de una interfaz a la vez.

> Kotlin, como Java, permite **una** superclase y **varias** interfaces: `: Ave("Pato"), Volador`.

### D

`Pato:  y vuela`

> `presentar()` llama a `canto()`, que se resuelve en tiempo de ejecución con la implementación de `Pato` (polimorfismo): `"cuac"`.

## kt-poo-008 {dificultad=1 tipo=salida ancla=1-clases-y-constructor-primario-idiomatico}

¿Qué imprime este programa?

```kotlin
class Punto(val x: Int, val y: Int) {
    fun mover(dx: Int) = Punto(x + dx, y)
}

fun main() {
    val p = Punto(1, 1).mover(2)
    println("${p.x},${p.y}")
}
```

### A ✔

`3,1`

> Correcto. `mover` no modifica el punto original (sus propiedades son `val`): devuelve un **nuevo** `Punto` con `x` desplazada.

### B

`1,1`

> `p` es el objeto que **devuelve** `mover`, no el original.

### C

`3,3`

> Solo se desplaza la `x`; la `y` se copia tal cual.

### D

Error de compilación: no se puede crear un `Punto` dentro de la propia clase.

> Un método puede crear instancias de su propia clase sin problema.

## kt-poo-009 {dificultad=1 tipo=salida ancla=1-clases-y-constructor-primario-idiomatico}

¿Qué imprime este programa?

```kotlin
class Jugador(val nombre: String, var vidas: Int = 3)

fun main() {
    val j = Jugador("Ana")
    j.vidas--
    println("${j.nombre} ${j.vidas}")
}
```

### A ✔

`Ana 2`

> Correcto. `vidas` toma su valor por defecto (3) y, como es `var`, se puede decrementar.

### B

`Ana 3`

> `j.vidas--` modifica la propiedad, y se imprime después.

### C

Error de compilación: falta el argumento `vidas`.

> Los parámetros del constructor también pueden tener valores por defecto, así que no hace falta pasarlo.

### D

Error de compilación: `j` es `val` y no se puede modificar.

> `val j` impide reasignar la variable `j`, pero no modificar las propiedades `var` del objeto.

## kt-poo-010 {dificultad=1 tipo=salida ancla=3-propiedades-y-acceso-field}

¿Qué imprime este programa?

```kotlin
class Rectangulo(val ancho: Int, val alto: Int) {
    val area: Int
        get() = ancho * alto
}

fun main() {
    println(Rectangulo(2, 3).area)
}
```

### A ✔

`6`

> Correcto. `area` es una propiedad **calculada**: su *getter* personalizado se evalúa cada vez que se lee, a partir de `ancho` y `alto`.

### B

`0`

> La propiedad no tiene un valor almacenado que empiece en 0: su valor sale del `get()`.

### C

Error de compilación: hay que llamarla como función, `area()`.

> Se accede como a cualquier propiedad, sin paréntesis, aunque por dentro ejecute código.

### D

Error de compilación: falta inicializar `area`.

> Una propiedad con *getter* personalizado que no usa `field` no necesita valor inicial.

## kt-poo-011 {dificultad=2 tipo=compila error ancla=1-clases-y-constructor-primario-idiomatico}

¿Qué ocurre al compilar este código?

```kotlin
class Persona(nombre: String) {
    fun saludar() = "Hola, $nombre"
}
```

### A ✔

Error de compilación: `nombre` no es una propiedad (le falta `val` o `var`), así que no existe dentro de los métodos.

> Correcto. Sin `val` o `var`, un parámetro del constructor solo se puede usar en los inicializadores y en los bloques `init`. Para usarlo en los métodos hay que declararlo como propiedad: `class Persona(val nombre: String)`.

### B

Compila: todos los parámetros del constructor son propiedades.

> Solo lo son los que llevan `val` o `var`. Esta es una diferencia importante.

### C

Compila, pero `nombre` vale `null` dentro de `saludar()`.

> El problema se detecta en compilación: `nombre` no se encuentra.

### D

Error de compilación: falta un constructor vacío.

> Kotlin no exige un constructor vacío. El error está en el uso de `nombre`.

## kt-poo-012 {dificultad=3 tipo=salida ancla=el-bloque-init}

¿Qué imprime este programa?

```kotlin
class Demo {
    val x = 1.also { println("x") }
    init { println("init") }
    val y = 2.also { println("y") }
}

fun main() {
    Demo()
}
```

### A ✔

```text
x
init
y
```

> Correcto. Los inicializadores de propiedades y los bloques `init` se ejecutan **en el orden en que aparecen** en la clase.

### B

```text
init
x
y
```

> `init` no tiene prioridad: se ejecuta en su posición, después de inicializar `x`.

### C

```text
x
y
init
```

> Las propiedades no se inicializan todas antes de los `init`: todo sigue el orden del código.

### D

```text
init
```

> Las expresiones `also` de los inicializadores también se ejecutan e imprimen.

## kt-poo-013 {dificultad=2 tipo=salida ancla=getters-y-setters-personalizados-con-field-backing-field}

¿Qué imprime este programa?

```kotlin
class Contador {
    var valor = 0
        private set

    fun incrementar() { valor++ }
}

fun main() {
    val c = Contador()
    c.incrementar()
    c.incrementar()
    println(c.valor)
}
```

### A ✔

`2`

> Correcto. `private set` deja la propiedad **legible** desde fuera, pero solo modificable desde dentro de la clase, a través de `incrementar()`.

### B

`0`

> `incrementar()` está dentro de la clase, así que sí puede modificar `valor`.

### C

Error de compilación: no se puede leer `c.valor` porque es privada.

> Solo el *setter* es privado; el *getter* sigue siendo público.

### D

`1`

> `incrementar()` se llama dos veces.

## kt-poo-014 {dificultad=2 tipo=compila error ancla=getters-y-setters-personalizados-con-field-backing-field}

¿Qué ocurre al compilar este programa?

```kotlin
class Contador {
    var valor = 0
        private set
}

fun main() {
    val c = Contador()
    c.valor = 10
}
```

### A ✔

Error de compilación: el *setter* de `valor` es privado.

> Correcto. `private set` impide asignar la propiedad desde fuera de la clase. Así la clase controla cómo cambia su estado.

### B

Compila, porque `valor` es `var`.

> `var` indica que la propiedad tiene *setter*, pero su visibilidad es `private`.

### C

Compila, pero la asignación se ignora.

> Kotlin no ignora asignaciones: si no están permitidas, no compilan.

### D

Error de compilación: `c` es `val`.

> `val c` solo impide reasignar `c`. El error está en la visibilidad del *setter*.

## kt-poo-015 {dificultad=1 tipo=salida ancla=22-objetos-anonimos.md#2-el-objeto-companero-companion-object-y-el-patron-factory-method}

¿Qué imprime este programa?

```kotlin
class Config {
    companion object {
        const val MAX = 5
    }
}

fun main() {
    println(Config.MAX * 2)
}
```

### A ✔

`10`

> Correcto. Los miembros del `companion object` se usan a través del **nombre de la clase**, sin crear instancias, como los `static` de Java.

### B

Error de compilación: hay que crear un `Config()` para acceder a `MAX`.

> Los miembros del `companion` pertenecen a la clase, no a cada instancia.

### C

Error de compilación: hay que escribir `Config.Companion.MAX`.

> Esa forma también funciona, pero no es obligatoria: `Config.MAX` es la habitual.

### D

`5`

> Se imprime `MAX * 2`.

## kt-poo-016 {dificultad=2 tipo=salida ancla=22-objetos-anonimos.md#3-expresiones-de-objeto-object-expressions-objetos-anonimos}

¿Qué imprime este programa?

```kotlin
interface Saludo {
    fun hola(): String
}

fun main() {
    val s = object : Saludo {
        override fun hola() = "hola desde un objeto anónimo"
    }
    println(s.hola())
}
```

### A ✔

`hola desde un objeto anónimo`

> Correcto. `object : Saludo { }` es una **expresión de objeto**: crea al momento un objeto de una clase sin nombre que implementa la interfaz.

### B

Error de compilación: no se puede instanciar una interfaz.

> No se instancia la interfaz: se crea un objeto anónimo que la **implementa**.

### C

Error de compilación: `object` solo sirve para declarar *singletons*.

> `object` también se usa como **expresión**, para crear objetos anónimos (como las clases anónimas de Java).

### D

`Saludo`

> Se imprime lo que devuelve `hola()`, no el nombre de la interfaz.

## kt-poo-017 {dificultad=3 tipo=salida ancla=5-herencia-final-por-defecto-y-la-palabra-clave-open}

¿Qué imprime este programa?

```kotlin
open class Animal {
    open fun sonido() = "..."
    fun hablar() = "Dice ${sonido()}"
}

class Gato : Animal() {
    override fun sonido() = super.sonido() + "miau"
}

fun main() {
    val a: Animal = Gato()
    println(a.hablar())
}
```

### A ✔

`Dice ...miau`

> Correcto. `hablar()` llama a `sonido()`, que se resuelve en el objeto real (`Gato`). La versión de `Gato` llama primero a la del padre con `super.sonido()` y le añade `"miau"`.

### B

`Dice ...`

> Aunque la variable sea de tipo `Animal`, el objeto es un `Gato` y se ejecuta su `sonido()`.

### C

`Dice miau`

> `super.sonido()` añade delante el resultado de la versión del padre, `"..."`.

### D

Error de compilación: `hablar()` no es `open` y `Gato` no puede usarlo.

> No ser `open` significa que no se puede **sobrescribir**, pero se hereda y se puede llamar.

## kt-poo-018 {dificultad=2 tipo=salida ancla=interfaces-interface-el-contrato-de-capacidades}

¿Qué imprime este programa?

```kotlin
interface Figura {
    val lados: Int
    fun describir() = "Tengo $lados lados"
}

class Triangulo : Figura {
    override val lados = 3
}

fun main() {
    println(Triangulo().describir())
}
```

### A ✔

`Tengo 3 lados`

> Correcto. Una interfaz puede declarar **propiedades abstractas** que la clase debe implementar con `override`, y métodos con implementación que las usen.

### B

Error de compilación: una interfaz no puede tener propiedades.

> Puede declararlas (sin estado propio): la clase que la implementa les da valor.

### C

`Tengo 0 lados`

> La interfaz no guarda ningún valor: `lados` es el valor que da `Triangulo`, 3.

### D

Error de compilación: falta `override` en `describir()`.

> `describir()` tiene implementación en la interfaz, así que no es obligatorio sobrescribirla.

## kt-poo-019 {dificultad=2 tipo=salida ancla=interfaces-interface-el-contrato-de-capacidades}

¿Qué imprime este programa?

```kotlin
interface Figura { val lados: Int }
class Triangulo : Figura { override val lados = 3 }
class Cuadrado : Figura { override val lados = 4 }

fun main() {
    val figuras: List<Figura> = listOf(Triangulo(), Cuadrado(), Triangulo())
    println(figuras.sumOf { it.lados })
}
```

### A ✔

`10`

> Correcto. Una `List<Figura>` puede contener cualquier objeto que implemente la interfaz. Cada uno aporta su número de lados: 3 + 4 + 3 = 10.

### B

`7`

> La lista tiene **tres** figuras: dos triángulos y un cuadrado.

### C

`0`

> Al leer `it.lados` se usa el valor de cada objeto real, no de la interfaz.

### D

Error de compilación: una lista no puede mezclar `Triangulo` y `Cuadrado`.

> Puede, porque el tipo de la lista es la interfaz común, `Figura`.

## kt-poo-020 {dificultad=3 tipo=salida ancla=22-objetos-anonimos.md#caracteristicas-clave-de-una-declaracion-de-objeto-en-kotlin}

¿Qué imprime este programa?

```kotlin
object Registro {
    init { println("Registro creado") }
    fun log(m: String) = println(m)
}

fun main() {
    println("inicio")
    Registro.log("a")
    Registro.log("b")
}
```

### A ✔

```text
inicio
Registro creado
a
b
```

> Correcto. Un `object` se crea de forma **perezosa**, la primera vez que se usa, y una sola vez. Por eso su `init` se ejecuta después de `inicio` y no se repite.

### B

```text
Registro creado
inicio
a
b
```

> El objeto no se crea al arrancar el programa, sino en su primer uso.

### C

```text
inicio
Registro creado
a
Registro creado
b
```

> Un `object` es un *singleton*: existe una única instancia y su `init` se ejecuta una sola vez.

### D

```text
inicio
a
b
```

> El bloque `init` del `object` sí se ejecuta, en el primer acceso.

## kt-poo-021 {dificultad=2 tipo=concepto ancla=composicion-frente-a-herencia-composicion-sobre-herencia}

¿Qué significa el principio «composición sobre herencia»?

### A ✔

Preferir que una clase **contenga** objetos que le aporten comportamiento (una relación «tiene un») antes que heredar de una superclase («es un»).

> Correcto. La composición es más flexible: el comportamiento se puede cambiar o combinar sin crear jerarquías rígidas. En Kotlin, la delegación con `by` la facilita mucho.

### B

Que la herencia está prohibida en Kotlin.

> No está prohibida: solo hay que marcar las clases como `open`. El principio es una recomendación de diseño.

### C

Que una clase debe heredar de varias clases a la vez.

> Kotlin solo permite **una** superclase. La composición es precisamente la alternativa.

### D

Que hay que usar siempre clases abstractas en lugar de interfaces.

> El principio no habla de clases abstractas frente a interfaces, sino de contener frente a heredar.

## kt-poo-022 {dificultad=2 tipo=salida ancla=constructores-secundarios-vs-valores-por-defecto}

¿Qué imprime este programa?

```kotlin
class Temperatura(val celsius: Double) {
    constructor(fahrenheit: Int) : this((fahrenheit - 32) / 1.8)
}

fun main() {
    println(Temperatura(212).celsius)
}
```

### A ✔

`100.0`

> Correcto. Al pasar un `Int` se elige el constructor secundario, que convierte de Fahrenheit a Celsius y delega en el primario: (212 − 32) / 1.8 = 100.0.

### B

`212.0`

> El argumento es un `Int`, así que se usa el constructor secundario, que hace la conversión.

### C

Error de compilación: hay dos constructores con un solo parámetro.

> Se distinguen por el **tipo** del parámetro (`Double` frente a `Int`): es una sobrecarga válida.

### D

`100`

> `celsius` es un `Double`, así que se imprime con decimal.

## kt-poo-023 {dificultad=2 tipo=salida ancla=el-bloque-init}

¿Qué imprime este programa?

```kotlin
class Edad(val valor: Int) {
    init {
        require(valor >= 0) { "La edad no puede ser negativa" }
    }
}

fun main() {
    try {
        Edad(-1)
    } catch (e: IllegalArgumentException) {
        println(e.message)
    }
}
```

### A ✔

`La edad no puede ser negativa`

> Correcto. `init` es el sitio para **validar** los datos del constructor. `require` lanza una `IllegalArgumentException` con el mensaje indicado si la condición es falsa.

### B

No imprime nada: el objeto se crea con valor −1.

> `require` impide crear un objeto en un estado inválido.

### C

`null`

> El mensaje de la excepción es el que devuelve la lambda de `require`.

### D

Error de compilación: no se pueden lanzar excepciones desde `init`.

> Se puede, y es la forma habitual de validar en el constructor.

## kt-poo-024 {dificultad=2 tipo=concepto ancla=4-modificadores-de-visibilidad-kotlin-vs-java}

¿Qué significa el modificador de visibilidad `internal` en Kotlin?

### A ✔

Que la declaración es visible en todo el **módulo** (por ejemplo, el módulo `app` de un proyecto Gradle), pero no fuera de él.

> Correcto. Es útil en librerías: se comparte código entre sus clases sin exponerlo a quien las usa.

### B

Que solo es visible dentro de la propia clase.

> Eso es `private`.

### C

Que es visible en la clase y en sus subclases.

> Eso es `protected`.

### D

Que es visible en el mismo paquete, como la visibilidad por defecto de Java.

> Kotlin no tiene visibilidad de paquete. Su visibilidad por defecto es `public`.

## kt-poo-025 {dificultad=2 tipo=salida ancla=interfaces-interface-el-contrato-de-capacidades}

¿Qué imprime este programa?

```kotlin
interface Nombrable {
    val nombre: String
    val saludo: String
        get() = "Hola, $nombre"
}

class Persona(override val nombre: String) : Nombrable

fun main() {
    println(Persona("Eva").saludo)
}
```

### A ✔

`Hola, Eva`

> Correcto. La clase implementa la propiedad abstracta `nombre` directamente en el constructor (`override val`). `saludo` tiene un *getter* por defecto en la interfaz que la usa.

### B

Error de compilación: `Persona` no implementa `saludo`.

> `saludo` tiene implementación (un *getter*) en la interfaz, así que no es obligatorio implementarla.

### C

Error de compilación: no se puede usar `override` en el constructor.

> Se puede: `override val` en el constructor primario implementa la propiedad de la interfaz.

### D

`Hola, null`

> `nombre` tiene el valor que se pasa al constructor.

## kt-poo-026 {dificultad=2 tipo=compila error ancla=clases-abstractas-abstract-jerarquias-con-identidad-comun}

¿Qué ocurre al compilar esta clase?

```kotlin
class Forma {
    abstract fun area(): Double
}
```

### A ✔

Error de compilación: una clase con miembros abstractos debe declararse `abstract`.

> Correcto. Un método `abstract` no tiene cuerpo, así que la clase que lo contiene no puede ser concreta: hay que escribir `abstract class Forma`.

### B

Compila, y `area()` devuelve 0.0 por defecto.

> Un método abstracto no tiene implementación ni valor por defecto.

### C

Compila, pero no se puede llamar a `area()`.

> No llega a compilar.

### D

Error de compilación: falta `open` en la clase.

> Una clase `abstract` ya es abierta. El problema es que falta `abstract` en la clase.

## kt-poo-027 {dificultad=2 tipo=compila error ancla=4-modificadores-de-visibilidad-kotlin-vs-java}

¿Qué ocurre al compilar este programa?

```kotlin
open class Base {
    protected val secreto = 42
}

fun main() {
    println(Base().secreto)
}
```

### A ✔

Error de compilación: `secreto` es `protected` y solo se puede usar dentro de `Base` y de sus subclases.

> Correcto. `main` no es una subclase, así que no puede acceder. A diferencia de Java, en Kotlin `protected` **no** da acceso al resto del paquete.

### B

Compila e imprime `42`, porque `main` está en el mismo fichero.

> El mismo fichero no da acceso a un miembro `protected`.

### C

Compila, porque la clase es `open`.

> `open` permite heredar, pero no cambia la visibilidad de los miembros.

### D

Compila e imprime `null`.

> El error está en el acceso, no en el valor.

## kt-poo-028 {dificultad=3 tipo=salida ancla=5-herencia-final-por-defecto-y-la-palabra-clave-open}

¿Qué imprime este programa?

```kotlin
open class Base {
    open val nombre: String = "base"
    init {
        println("init con $nombre")
    }
}

class Hija : Base() {
    override val nombre: String = "hija"
}

fun main() {
    Hija()
}
```

### A ✔

`init con null`

> Correcto, y es una trampa clásica. El `init` de `Base` se ejecuta **antes** de inicializar las propiedades de `Hija`. Al leer `nombre` se usa la versión sobrescrita, que todavía no tiene valor, y por eso sale `null` aunque el tipo sea `String`. El IDE avisa: no hay que usar miembros `open` en el constructor.

### B

`init con hija`

> La propiedad de `Hija` aún no se ha inicializado cuando se ejecuta el `init` de `Base`.

### C

`init con base`

> Al ser `open` y estar sobrescrita, se lee la versión de `Hija`, no la de `Base`.

### D

Error de compilación: no se puede usar una propiedad `open` en `init`.

> Compila (con un aviso del IDE), pero da este resultado inesperado.

## kt-poo-029 {dificultad=1 tipo=salida ancla=22-objetos-anonimos.md#2-el-objeto-companero-companion-object-y-el-patron-factory-method}

¿Qué imprime este programa?

```kotlin
class Bala {
    companion object {
        var disparadas = 0
    }
    init {
        disparadas++
    }
}

fun main() {
    repeat(3) { Bala() }
    println(Bala.disparadas)
}
```

### A ✔

`3`

> Correcto. `disparadas` está en el `companion object`, así que la comparten todas las instancias. Cada `init` la incrementa.

### B

`1`

> No hay una copia por objeto: es un único contador de la clase.

### C

`0`

> Cada creación de `Bala` ejecuta su `init`, que incrementa el contador.

### D

Error de compilación: `init` no puede acceder al `companion`.

> La clase puede usar los miembros de su `companion` sin prefijo.

## kt-poo-030 {dificultad=3 tipo=salida ancla=3-propiedades-y-acceso-field}

¿Qué imprime este programa?

```kotlin
class Reloj {
    var tick = 0
    val inicial = tick
    val actual: Int
        get() = tick
}

fun main() {
    val r = Reloj()
    r.tick = 5
    println("${r.inicial} ${r.actual}")
}
```

### A ✔

`0 5`

> Correcto. `inicial` se calcula **una vez**, al crear el objeto (cuando `tick` vale 0). `actual` tiene un *getter* que se evalúa **cada vez** que se lee.

### B

`5 5`

> Un inicializador (`= tick`) copia el valor en ese momento y no se actualiza después.

### C

`0 0`

> El *getter* lee el valor de `tick` en el momento de la consulta: 5.

### D

Error de compilación: `inicial` es `val` y depende de un `var`.

> Es válido: `inicial` copia el valor de `tick` al crearse el objeto.

## kt-poo-031 {dificultad=1 tipo=salida ancla=multiples-interfaces-superar-la-herencia-simple}

¿Qué imprime este programa?

```kotlin
interface Nadador { fun nadar() = "nada" }
interface Corredor { fun correr() = "corre" }

class Triatleta : Nadador, Corredor

fun main() {
    val t = Triatleta()
    println("${t.nadar()} y ${t.correr()}")
}
```

### A ✔

`nada y corre`

> Correcto. Una clase puede implementar **varias** interfaces y hereda sus métodos con cuerpo. Como no hay métodos con el mismo nombre, no hay conflicto.

### B

Error de compilación: una clase solo puede implementar una interfaz.

> La restricción es de **una superclase**. Interfaces se pueden implementar todas las que se quiera.

### C

Error de compilación: la clase debe sobrescribir `nadar()` y `correr()`.

> Tienen implementación por defecto, así que no es obligatorio.

### D

`nada y nada`

> Cada método viene de su propia interfaz.

## kt-poo-032 {dificultad=2 tipo=salida ancla=22-objetos-anonimos.md#1-declaracion-de-objetos-el-patron-singleton-nativo}

¿Qué imprime este programa?

```kotlin
interface Descuento {
    fun aplicar(precio: Double): Double
}

object SinDescuento : Descuento {
    override fun aplicar(precio: Double) = precio
}

object Rebajas : Descuento {
    override fun aplicar(precio: Double) = precio * 0.8
}

fun main() {
    println(listOf(SinDescuento, Rebajas).map { it.aplicar(50.0) })
}
```

### A ✔

`[50.0, 40.0]`

> Correcto. Un `object` también puede implementar interfaces. Aquí cada uno es una «estrategia» de descuento distinta, y se usan a través de la interfaz común.

### B

`[50.0, 50.0]`

> `Rebajas` multiplica el precio por 0.8.

### C

Error de compilación: un `object` no puede implementar una interfaz.

> Puede, igual que una clase.

### D

`[40.0, 40.0]`

> `SinDescuento` devuelve el precio tal cual.

## kt-poo-033 {dificultad=3 tipo=salida ancla=la-magia-de-kotlin-delegacion-de-interfaces-by}

¿Qué imprime este programa?

```kotlin
interface Saludo {
    fun hola(): String
    fun adios(): String
}

class Basico : Saludo {
    override fun hola() = "hola"
    override fun adios() = "adiós"
}

class Educado(base: Saludo) : Saludo by base {
    override fun hola() = "buenos días"
}

fun main() {
    val e = Educado(Basico())
    println("${e.hola()} / ${e.adios()}")
}
```

### A ✔

`buenos días / adiós`

> Correcto. Con `by`, todos los métodos se delegan en `base`, **salvo** los que la clase sobrescribe. Así se cambia solo una parte del comportamiento.

### B

`hola / adiós`

> `Educado` sobrescribe `hola()`, y esa versión tiene prioridad sobre la delegada.

### C

Error de compilación: no se puede sobrescribir un método delegado.

> Sí se puede: el método propio tiene preferencia sobre la delegación.

### D

`buenos días / buenos días`

> Solo se ha sobrescrito `hola()`; `adios()` sigue delegada.

## kt-poo-034 {dificultad=2 tipo=concepto ancla=getters-y-setters-personalizados-con-field-backing-field}

Dentro de un *setter* personalizado, ¿qué representa `field`?

### A ✔

El campo interno (*backing field*) donde la propiedad guarda realmente su valor.

> Correcto. Hay que usar `field` y no el nombre de la propiedad, porque asignar a la propiedad volvería a llamar al *setter* y provocaría una recursión infinita.

### B

El nuevo valor que se intenta asignar.

> Ese es el parámetro del *setter* (por convención, `value`).

### C

Una variable local temporal que desaparece al salir del *setter*.

> `field` persiste: es donde se almacena el estado de la propiedad.

### D

Una referencia al objeto completo (como `this`).

> `field` se refiere solo al valor de esa propiedad.

## kt-poo-035 {dificultad=2 tipo=salida ancla=getters-y-setters-personalizados-con-field-backing-field}

¿Qué imprime este programa?

```kotlin
class Cuenta {
    var saldo = 0
        set(valor) {
            if (valor >= 0) field = valor
        }
}

fun main() {
    val c = Cuenta()
    c.saldo = 50
    c.saldo = -10
    println(c.saldo)
}
```

### A ✔

`50`

> Correcto. El *setter* solo guarda el valor si no es negativo. La asignación de −10 se ignora y el saldo se queda en 50.

### B

`-10`

> El *setter* filtra los valores negativos.

### C

`0`

> La primera asignación (50) sí es válida y se guarda.

### D

Lanza `IllegalArgumentException`.

> El *setter* no lanza nada: simplemente no actualiza el campo.

## kt-poo-036 {dificultad=2 tipo=salida ancla=22-objetos-anonimos.md#objetos-anonimos-ad-hoc}

¿Qué imprime este programa?

```kotlin
fun main() {
    var clics = 0
    val boton = object {
        fun pulsar() { clics++ }
    }
    boton.pulsar()
    boton.pulsar()
    println(clics)
}
```

### A ✔

`2`

> Correcto. Un objeto anónimo puede **capturar** y modificar las variables del ámbito donde se crea, igual que una lambda.

### B

`0`

> El objeto modifica la variable `clics` externa, no una copia.

### C

Error de compilación: un objeto anónimo debe implementar una interfaz.

> No es obligatorio: `object { ... }` crea un objeto ad hoc con sus propios miembros.

### D

Error de compilación: no se puede modificar una variable externa desde un objeto.

> En Kotlin se puede (en Java, no).
