# Cuestionario de Evaluación: Kotlin

**Módulo:** Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM  
**Curso Académico:** 2026 / 2027  
**Material de referencia:** Apuntes de clase (`docs/temas/00-android/00-kotlin`)

---

## Bloque 01: Fundamentos y Tipos

### Pregunta 01
¿Cuál es el resultado de intentar compilar y ejecutar el siguiente código en Kotlin?

```kotlin
fun main() {
    val total = 100
    total = 150
    println(total)
}
```

- **A)** Imprime `150` porque dentro de una función las variables son mutables por defecto.
- **B)** Error de compilación en la línea 3 porque las variables declaradas con `val` son referencias de solo lectura y no pueden reasignarse.
- **C)** Imprime `100` ignorando la segunda asignación.
- **D)** Error en tiempo de ejecución (`IllegalStateException`).

---

### Pregunta 02
¿Qué ocurre al compilar el siguiente fragmento en Kotlin?

```kotlin
val entero: Int = 42
val largo: Long = entero
```

- **A)** Compila correctamente porque `Long` tiene mayor capacidad que `Int` y se promociona automáticamente.
- **B)** Compila únicamente si la variable `largo` se declara con `var`.
- **C)** Error de compilación porque en Kotlin no existe conversión implícita entre tipos numéricos; debe llamarse explícitamente a `entero.toLong()`.
- **D)** Muestra una advertencia (*warning*) pero compila y ejecuta normalmente.

---

### Pregunta 03
Observa el siguiente uso de plantillas de cadenas (*string templates*):

```kotlin
val base = 100
val iva = 0.21
println("Total a pagar: ${base * (1 + iva)} euros")
```

¿Qué regla de sintaxis se aplica para evaluar la operación matemática dentro de la cadena?

- **A)** Las expresiones complejas u operaciones aritméticas requieren delimitarse obligatoriamente entre llaves tras el símbolo de dólar: `${expresion}`.
- **B)** Solo se permite usar variables simples; las operaciones aritméticas deben precalcularse fuera del texto.
- **C)** El símbolo `$` debe ser escapado obligatoriamente con `\$` si va acompañado de llaves.
- **D)** Se debe utilizar el operador de concatenación `+` de Java.

---

### Pregunta 04
¿Cuál es la salida de evaluar la siguiente división entre dos números enteros en Kotlin?

```kotlin
val resultado = 9 / 2
println(resultado)
```

- **A)** `4.5`
- **B)** `4` porque la división entre dos enteros realiza una división entera truncada.
- **C)** `4.0`
- **D)** Error de compilación porque 9 no es múltiplo de 2.

---

## Bloque 02: Control de Flujo y Expresiones

### Pregunta 05
¿Qué imprimirá en consola este programa?

```kotlin
val edad = 16
val estado = if (edad >= 18) "Mayor de edad" else "Menor de edad"
println(estado)
```

- **A)** `Mayor de edad`
- **B)** `Menor de edad`
- **C)** Error de compilación porque en Kotlin no se puede asignar un bloque `if` a una variable.
- **D)** `null`

---

### Pregunta 06
¿Cuál es la salida por consola tras evaluar la siguiente expresión `when`?

```kotlin
val nota = 7
val resultado = when (nota) {
    in 9..10 -> "Sobresaliente"
    in 7..8 -> "Notable"
    7 -> "Siete exacto"
    else -> "Aprobado o suspenso"
}
println(resultado)
```

- **A)** `Siete exacto`
- **B)** `Sobresaliente`
- **C)** `Notable` porque las ramas de `when` se comprueban secuencialmente y la condición de rango `in 7..8` se cumple primero.
- **D)** Error de compilación por duplicidad de rama para el valor 7.

---

### Pregunta 07
¿Qué secuencia exacta de números imprime este bucle en la consola?

```kotlin
for (i in 1 until 7 step 2) {
    print("$i ")
}
```

- **A)** `1 3 5 ` porque `until` excluye el límite superior (llega hasta 6) y `step 2` salta de dos en dos.
- **B)** `1 3 5 7 `
- **C)** `1 2 3 4 5 6 `
- **D)** `2 4 6 `

---

### Pregunta 08
Observa el siguiente bloque `when` sin argumento:

```kotlin
val puntuacion = 85
val nivel = when {
    puntuacion >= 90 -> "A"
    puntuacion >= 80 -> "B"
    else -> "C"
}
println(nivel)
```

¿Qué imprimirá en consola?

- **A)** `A`
- **B)** `B`
- **C)** `C`
- **D)** Error de compilación porque `when` exige obligatoriamente un argumento entre paréntesis.

---

## Bloque 03: Seguridad ante Nulos (Null Safety)

### Pregunta 09
Dada la variable `val apellidos: String? = null`, ¿cuál es el resultado de evaluar `apellidos?.length`?

- **A)** `null`
- **B)** `0`
- **C)** Lanza una excepción `NullPointerException`.
- **D)** Error de compilación.

---

### Pregunta 10
¿Qué valor contendrá la variable `puerto` tras ejecutarse este código con el operador Elvis (`?:`)?

```kotlin
val puertoConfigurado: Int? = null
val puerto = puertoConfigurado ?: 8080
println(puerto)
```

- **A)** `null`
- **B)** `0`
- **C)** `8080` porque al ser la expresión de la izquierda nula, el operador Elvis evalúa y devuelve el valor alternativo de la derecha.
- **D)** Lanza una excepción `IllegalArgumentException`.

---

### Pregunta 11
¿Qué consecuencia tiene ejecutar la siguiente instrucción sobre una variable con valor nulo?

```kotlin
val entrada: String? = null
val tam = entrada!!.length
```

- **A)** Asigna `0` a la variable `tam`.
- **B)** Lanza inmediatamente una excepción `NullPointerException` en tiempo de ejecución.
- **C)** Asigna `null` a la variable `tam`.
- **D)** El compilador bloquea la compilación impidiendo el uso del operador `!!`.

---

### Pregunta 12
¿Qué valor contendrá la variable `resultado` tras ejecutar este código?

```kotlin
val objeto: Any = 123
val resultado: String? = objeto as? String
println(resultado)
```

- **A)** `null` porque el operador de casteo seguro `as?` devuelve `null` si el tipo no es compatible, evitando lanzar excepción.
- **B)** `"123"`
- **C)** Lanza una excepción `ClassCastException`.
- **D)** Error de compilación.

---

## Bloque 04: Funciones, Lambdas y Extensiones

### Pregunta 13
Observa la siguiente función:

```kotlin
fun doble(x: Int) = x * 2
```

¿Cuál de las siguientes afirmaciones es **verdadera**?

- **A)** Da error de compilación porque le faltan las llaves `{}`.
- **B)** Es una función de expresión única (*single-expression function*) y el tipo de retorno `Int` es inferido automáticamente por el compilador.
- **C)** Debe llevar obligatoriamente la palabra clave `return` antes de `x * 2`.
- **D)** El compilador le asigna por defecto el tipo de retorno `Unit`.

---

### Pregunta 14
Dada la siguiente función con parámetros por defecto:

```kotlin
fun saludar(prefijo: String = "Hola", nombre: String, veces: Int = 1) {
    repeat(veces) { print("$prefijo $nombre; ") }
}
```

¿Cuál es la salida de invocar `saludar(nombre = "Ana", veces = 2)`?

- **A)** `Ana Ana; `
- **B)** `Hola Ana; `
- **C)** `Hola Ana; Hola Ana; `
- **D)** Error de compilación porque los parámetros por defecto deben ir forzosamente al final.

---

### Pregunta 15
¿Cuál es la sintaxis canónica y correcta para declarar una **función de extensión** sobre la clase `String` que devuelva si la cadena tiene más de 5 caracteres?

- **A)** `extension fun String.esLarga(): Boolean = this.length > 5`
- **B)** `fun String.esLarga(): Boolean = this.length > 5`
- **C)** `fun String::esLarga(): Boolean = this.length > 5`
- **D)** `fun esLarga(this: String): Boolean = this.length > 5`

---

### Pregunta 16
¿Qué imprimirá por consola el siguiente fragmento aprovechando la convención de *trailing lambda* y el parámetro implícito `it`?

```kotlin
val numeros = listOf(1, 2, 3)
val resultado = numeros.map { it * 2 }
println(resultado)
```

- **A)** `[2, 4, 6]`
- **B)** `[1, 2, 3]`
- **C)** `12`
- **D)** Error de compilación porque `it` debe declararse explícitamente entre paréntesis.

---

### Pregunta 17
Dada la siguiente función de orden superior:

```kotlin
fun operar(x: Int, accion: (Int) -> Int): Int {
    return accion(x)
}
```

¿Cuál es la salida de invocar `println(operar(4) { it + 3 })`?

- **A)** `4`
- **B)** `7`
- **C)** `12`
- **D)** `Unit`

---

## Bloque 05: POO (Herencia, Polimorfismo e Interfaces)

### Pregunta 18
Observa la siguiente jerarquía de clases:

```kotlin
class Vehiculo(val marca: String)

class Coche(marca: String, val puertas: Int) : Vehiculo(marca)
```

¿Qué error se producirá al intentar compilar este código?

- **A)** Error porque `Coche` debe usar la palabra reservada `extends`.
- **B)** Error de compilación porque en Kotlin las clases son `final` por defecto; `Vehiculo` debe declararse explícitamente como `open class`.
- **C)** Error porque `marca` debe llevar `override val` obligatoriamente en la subclase.
- **D)** Error porque el constructor secundario debe invocar a `super()`.

---

### Pregunta 19
Dada la siguiente clase base:

```kotlin
open class Figura {
    open fun area(): Double = 0.0
}
```

¿Cómo debe declarar una clase derivada `Circulo` la sobrescritura del método `area()`?

- **A)** `@Override fun area(): Double = Math.PI * r * r`
- **B)** `open fun area(): Double = Math.PI * r * r`
- **C)** `fun area(): Double override = Math.PI * r * r`
- **D)** `override fun area(): Double = Math.PI * r * r`

---

### Pregunta 20
¿Cuál es la salida en consola del siguiente programa basado en polimorfismo?

```kotlin
open class Animal {
    open fun hablar() = "Sonido genérico"
}

class Perro : Animal() {
    override fun hablar() = "Guau"
}

fun main() {
    val miMascota: Animal = Perro()
    println(miMascota.hablar())
}
```

- **A)** `Sonido genérico`
- **B)** `Guau` gracias a la ligadura dinámica del método sobrescrito según la instancia real instanciada en memoria.
- **C)** Error de compilación porque una variable de tipo `Animal` no puede almacenar un objeto de tipo `Perro`.
- **D)** Error en tiempo de ejecución.

---

### Pregunta 21
Dada la siguiente interfaz con implementación por defecto:

```kotlin
interface Notificador {
    fun enviar(msg: String)
    fun canal(): String = "Correo"
}

class NotificadorSMS : Notificador {
    override fun enviar(msg: String) {
        print("Enviando '$msg' por ${canal()}")
    }
}

fun main() {
    NotificadorSMS().enviar("Aviso")
}
```

¿Cuál es la salida al ejecutar `main()`?

- **A)** `Enviando 'Aviso' por Correo`
- **B)** Error de compilación porque las interfaces en Kotlin no pueden tener métodos con implementación por defecto.
- **C)** Error de compilación porque `NotificadorSMS` no implementa el método `canal()`.
- **D)** `Enviando 'Aviso' por null`

---

### Pregunta 22
¿Cómo se realiza correctamente la llamada al constructor de la clase base `Elemento(id)` desde la clase derivada `Boton`?

- **A)** `class Boton(val id: Int) extends Elemento(id)`
- **B)** `class Boton(id: Int) : super.Elemento(id)`
- **C)** `class Boton(id: Int, val texto: String) : Elemento(id)`
- **D)** `class Boton(id: Int, val texto: String) : Elemento { super(id) }`

---

## Bloque 06: Data Class vs Class Estándar

### Pregunta 23
¿Qué métodos genera automáticamente el compilador de Kotlin para una `data class` a partir de las propiedades declaradas en su constructor primario?

- **A)** `serialize()`, `deserialize()` y `clone()`.
- **B)** `equals()`, `hashCode()`, `toString()` y `copy()`.
- **C)** Solo `getters` y `setters` públicos.
- **D)** `compareTo()` e `iterator()`.

---

### Pregunta 24
Observa la comparación entre dos instancias de una clase normal frente a dos de una `data class`:

```kotlin
class LibroNormal(val isbn: String)
data class LibroData(val isbn: String)

fun main() {
    val l1 = LibroNormal("978-01")
    val l2 = LibroNormal("978-01")
    
    val d1 = LibroData("978-01")
    val d2 = LibroData("978-01")
    
    println("${l1 == l2} - ${d1 == d2}")
}
```

¿Qué imprimirá en consola?

- **A)** `true - true`
- **B)** `false - true` porque la clase estándar usa identidad de memoria por defecto, mientras que la `data class` autogenera `equals()` comparando el valor de sus propiedades.
- **C)** `false - false`
- **D)** `true - false`

---

### Pregunta 25
¿Cuál es el resultado de ejecutar este fragmento con el método `copy()` sobre una `data class` inmutable?

```kotlin
data class Producto(val id: Int, val nombre: String, val precio: Double)

fun main() {
    val original = Producto(1, "Teclado", 50.0)
    val rebajado = original.copy(precio = 35.0)
    println("${original.precio} vs ${rebajado.precio}")
}
```

- **A)** `50.0 vs 35.0` porque `copy()` devuelve una nueva instancia modificada manteniendo el objeto original inalterado.
- **B)** `35.0 vs 35.0`
- **C)** Error de compilación porque las propiedades declaradas con `val` no se pueden modificar mediante `copy()`.
- **D)** Error en tiempo de ejecución.

---

### Pregunta 26
¿Cuál de las siguientes afirmaciones describe con precisión una regla o restricción fundamental de las **`data classes`** en Kotlin?

- **A)** Una `data class` puede declararse como `open` para que otras clases hereden de ella.
- **B)** Las `data class` permiten constructores primarios vacíos sin propiedades.
- **C)** Una `data class` debe tener al menos un parámetro en su constructor primario marcado obligatoriamente con `val` o `var`, y no puede ser `open` ni `abstract`.
- **D)** Una `data class` solo admite propiedades de tipo numérico o texto.

---

## Bloque 07: Funciones de Alcance (Scope Functions)

### Pregunta 27
¿Cuál es la principal diferencia entre las funciones de alcance `apply` y `let`?

- **A)** `apply` devuelve siempre `Unit` y `let` devuelve el propio objeto receptor.
- **B)** `apply` devuelve el propio objeto receptor (`this`), siendo ideal para configuración de objetos, mientras que `let` devuelve el resultado de la última expresión dentro de la lambda.
- **C)** `apply` es una función exclusiva para colecciones y `let` para cadenas.
- **D)** No tienen ninguna diferencia; son sinónimos.

---

### Pregunta 28
¿Cuál es el uso más idiomático de la combinación `?.let` en Kotlin?

```kotlin
val email: String? = obtenerEmail()
email?.let {
    enviarMensaje(it)
}
```

- **A)** Ejecutar el bloque de código únicamente si `email` no es nulo, garantizando que dentro de la lambda `it` es de tipo no nulo (`String`).
- **B)** Convertir la variable a formato JSON.
- **C)** Forzar la conversión del correo a mayúsculas.
- **D)** Reinicializar la variable con un valor por defecto.

---

## Bloque 08: Colecciones y Concurrencia Básica

### Pregunta 29
¿Cuál es el contenido de la lista `resultado` tras ejecutar esta transformación?

```kotlin
val palabras = listOf("sol", "mar", "montaña", "rio")
val resultado = palabras
    .filter { it.length <= 3 }
    .map { it.uppercase() }

println(resultado)
```

- **A)** `[MONTAÑA]`
- **B)** `[sol, mar, rio]`
- **C)** `[SOL, MAR, RIO]`
- **D)** `["sol", "mar", "montaña", "rio"]`

---

### Pregunta 30
En Kotlin Coroutines, si necesitas iniciar una tarea en segundo plano que **devuelva un resultado** para utilizarlo posteriormente en el hilo principal, ¿qué constructor y función debes emplear?

- **A)** Usar el builder `launch` y llamar a `join()`.
- **B)** Usar el builder `async` y obtener el resultado mediante `await()` sobre el objeto `Deferred`.
- **C)** Usar `runBlocking` dentro de cada llamada de red.
- **D)** Usar `Thread.sleep()` con una variable global.
