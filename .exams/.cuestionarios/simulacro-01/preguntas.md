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
- **B)** Error de compilación en la línea 3 porque las variables declaradas con `val` son de solo lectura y no pueden reasignarse.
- **C)** Imprime `100` ignorando la reasignación silenciosamente.
- **D)** Error en tiempo de ejecución (`IllegalStateException`).

---

### Pregunta 02
¿Qué ocurre al compilar el siguiente fragmento en Kotlin?

```kotlin
val entero: Int = 42
val largo: Long = entero
```

- **A)** Compila correctamente porque `Long` tiene mayor capacidad que `Int` y se amplía automáticamente.
- **B)** Compila solo si la variable `largo` se declara con `var`.
- **C)** Da error de compilación porque en Kotlin no existe conversión implícita de tipos numéricos; debe usarse `entero.toLong()`.
- **D)** Muestra una advertencia (*warning*) pero compila y ejecuta normalmente.

---

### Pregunta 03
Observa el siguiente fragmento con plantillas de cadenas (*string templates*):

```kotlin
val producto = "Portátil"
val precio = 800
println("El precio de $producto con IVA es: ${precio * 1.21}€")
```

¿Qué regla de sintaxis se aplica aquí respecto al uso del símbolo `$`?

- **A)** Para interpolar variables simples basta con `$nombre`, pero para evaluar expresiones complejas u operaciones se debe usar obligatoriamente `${expresion}`.
- **B)** Ambas variables requerían obligatoriamente llaves `${producto}` para poder compilar.
- **C)** Kotlin no admite operaciones aritméticas dentro de las plantillas de cadenas.
- **D)** El símbolo `$` debe ser escapado siempre con `\$` si va seguido de llaves.

---

### Pregunta 04
¿Qué salida produce el siguiente código con cadenas multilínea (*raw strings*)?

```kotlin
val mensaje = """
    |Bienvenido
    |a Kotlin
""".trimMargin()
print(mensaje.replace("\n", " "))
```

- **A)** `|Bienvenido |a Kotlin`
- **B)** `Bienvenido a Kotlin`
- **C)** `    Bienvenido     a Kotlin`
- **D)** Error de compilación porque `trimMargin()` requiere especificar un prefijo de forma obligatoria.

---

### Pregunta 05
¿Cuál de las siguientes afirmaciones sobre la inferencia y el sistema de tipos de Kotlin es **verdadera**?

- **A)** Kotlin es un lenguaje de tipado dinámico, por lo que una variable declarada con `var x = 10` puede almacenar después `"diez"`.
- **B)** En Kotlin existen los tipos primitivos de Java (`int`, `double`, `boolean`) como palabras reservadas en minúscula.
- **C)** Si no se especifica el tipo explícito en una variable, el compilador siempre le asigna el tipo `Any?`.
- **D)** Kotlin es de tipado estático: el compilador infiere el tipo en tiempo de compilación y no permite asignarle posteriormente valores de un tipo incompatible.

---

## Bloque 02: Control de Flujo y Expresiones

### Pregunta 06
¿Qué imprimirá en consola este programa?

```kotlin
val edad = 16
val estado = if (edad >= 18) "Mayor de edad" else "Menor de edad"
println(estado)
```

- **A)** `Mayor de edad`
- **B)** `Menor de edad`
- **C)** Error de compilación porque en Kotlin no se puede asignar un `if` directamente a una variable.
- **D)** `null`

---

### Pregunta 07
¿Cuál es la salida por consola tras ejecutar el siguiente bloque `when`?

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
- **C)** `Notable`
- **D)** Error de compilación por tener una rama duplicada para el valor 7.

---

### Pregunta 08
Observa el siguiente uso de `when` sin argumento:

```kotlin
val puntuacion = 85
val nivel = when {
    puntuacion >= 90 -> "A"
    puntuacion >= 80 -> "B"
    else -> "C"
}
println(nivel)
```

¿Por qué es válida esta construcción en Kotlin?

- **A)** Porque un `when` sin argumento evalúa las ramas como condiciones booleanas secuenciales, sustituyendo limpiamente a una cadena de `if - else if`.
- **B)** Porque `puntuacion` se asume automáticamente como argumento implícito si es la única variable local.
- **C)** No es válida; `when` siempre exige una variable entre paréntesis para comparar.
- **D)** Compila únicamente si la rama `else` devuelve `null`.

---

### Pregunta 09
¿Qué secuencia exacta de números imprime este bucle en la consola?

```kotlin
for (i in 1 until 7 step 2) {
    print("$i ")
}
```

- **A)** `1 3 5 7 `
- **B)** `1 2 3 4 5 6 `
- **C)** `1 3 5 `
- **D)** `2 4 6 `

---

### Pregunta 10
¿Qué salida produce por consola el siguiente bucle decreciente con paso personalizado?

```kotlin
for (num in 8 downTo 2 step 3) {
    print("$num ")
}
```

- **A)** `8 6 4 2 `
- **B)** `8 5 2 `
- **C)** `2 5 8 `
- **D)** `8 5 `

---

## Bloque 03: Seguridad ante Nulos (Null Safety)

### Pregunta 11
¿Qué ocurrirá al intentar compilar la siguiente línea de código?

```kotlin
var ciudad: String = "Madrid"
ciudad = null
```

- **A)** Compila y la variable pasa a tener valor nulo.
- **B)** Error de compilación porque el tipo `String` no es anulable; para admitir `null` debe declararse como `String?`.
- **C)** Compila con una advertencia (*warning*) de tipo inseguro.
- **D)** Lanza un error en tiempo de ejecución (`NullPointerException`).

---

### Pregunta 12
¿Cuál es la salida al evaluar la siguiente llamada segura encadenada?

```kotlin
val apellidos: String? = null
val inicial = apellidos?.firstOrNull()?.uppercase()
println(inicial)
```

- **A)** `null`
- **B)** Cadena vacía `""`
- **C)** Lanza `NullPointerException` en `.firstOrNull()`
- **D)** Error de compilación porque no se pueden encadenar operadores `?.`

---

### Pregunta 13
¿Qué valor devolverá la función `obtenerNombre` al ser invocada con un usuario con nombre nulo?

```kotlin
fun obtenerNombre(nombre: String?): String {
    val valor = nombre ?: return "Desconocido"
    return "Usuario: $valor"
}
```

- **A)** `Usuario: null`
- **B)** `Usuario: Desconocido`
- **C)** Lanza una excepción `IllegalArgumentException`.
- **D)** `"Desconocido"` porque el operador Elvis permite usar `return` para salir anticipadamente de la función si la izquierda es nula.

---

### Pregunta 14
¿Qué consecuencia tiene ejecutar la siguiente instrucción sobre una variable con valor `null`?

```kotlin
val dato: String? = null
val longitud = dato!!.length
```

- **A)** Asigna `0` a la variable `longitud`.
- **B)** Asigna `null` a la variable `longitud`.
- **C)** Lanza inmediatamente una excepción `NullPointerException` en tiempo de ejecución.
- **D)** El compilador detiene la compilación marcando error de sintaxis en el operador `!!`.

---

### Pregunta 15
¿Qué valor contendrá la variable `resultado` tras ejecutar este código?

```kotlin
val objeto: Any = 123
val resultado: String? = objeto as? String
println(resultado)
```

- **A)** `null`
- **B)** `"123"`
- **C)** Error en tiempo de ejecución (`ClassCastException`).
- **D)** Error de compilación porque no se puede convertir `Any` a `String?`.

---

## Bloque 04: Funciones, Lambdas y Extensiones

### Pregunta 16
Observa la siguiente función:

```kotlin
fun multiplicar(a: Int, b: Int = 2) = a * b
```

¿Cuál de las siguientes afirmaciones es **verdadera**?

- **A)** Requiere la palabra clave `return` obligatoria antes de `a * b`.
- **B)** Es una función de expresión única (*single-expression function*) y el tipo de retorno `Int` es inferido automáticamente por el compilador.
- **C)** Da error de compilación porque los parámetros por defecto solo se permiten en funciones con cuerpo en bloque `{}`.
- **D)** Solo puede ser invocada pasando obligatoriamente ambos parámetros: `multiplicar(4, 2)`.

---

### Pregunta 17
Dada la siguiente función con parámetros nombrados y por defecto:

```kotlin
fun configurar(modo: String = "Oscuro", sonido: Boolean = true, volumen: Int = 50) {
    print("$modo - $sonido - $volumen")
}
```

¿Qué imprimirá la llamada `configurar(volumen = 80)`?

- **A)** `null - null - 80`
- **B)** `Oscuro - true - 80`
- **C)** Error de compilación porque los parámetros anteriores (`modo` y `sonido`) no fueron especificados.
- **D)** Error de compilación porque los argumentos por defecto deben llamarse en el orden en que fueron declarados.

---

### Pregunta 18
¿Cuál es la forma correcta y canónica de declarar una **función de extensión** sobre `String` que devuelva la misma cadena entre corchetes?

- **A)** `extension fun String.enmarcar(): String = "[$this]"`
- **B)** `fun String::enmarcar(): String = "[$this]"`
- **C)** `fun String.enmarcar(): String = "[$this]"`
- **D)** `fun enmarcar(this: String): String = "[$this]"`

---

### Pregunta 19
¿En qué consiste la convención *Trailing Lambda* en Kotlin?

- **A)** Si el último parámetro de una función es una lambda, dicha expresión lambda puede escribirse fuera de los paréntesis de la llamada a la función.
- **B)** Las lambdas deben declararse obligatoriamente al final de cada archivo fuente.
- **C)** Las funciones que reciben lambdas solo pueden ejecutarse de manera asíncrona.
- **D)** Obliga a nombrar todos los parámetros de la lambda con el prefijo `trailing_`.

---

### Pregunta 20
¿Qué imprimirá por consola el siguiente fragmento de código?

```kotlin
val numeros = listOf(1, 2, 3)
val resultado = numeros.map { it * 2 }
println(resultado)
```

- **A)** `[1, 2, 3]`
- **B)** `12`
- **C)** `[2, 4, 6]`
- **D)** Error de compilación porque `it` debe declararse explícitamente entre paréntesis.

---

### Pregunta 21
Dada la siguiente función de orden superior:

```kotlin
fun operar(x: Int, operacion: (Int) -> Int): Int {
    return operacion(x)
}
```

¿Cuál de las siguientes invocaciones es sintácticamente **incorrecta** en Kotlin?

- **A)** `operar(5, { n -> n + 1 })`
- **B)** `operar(5): { it + 1 }`
- **C)** `operar(5) { it * 3 }`
- **D)** `operar(5) { n -> n * n }`

---

## Bloque 05: POO (Herencia, Polimorfismo e Interfaces)

### Pregunta 22
Observa la siguiente jerarquía de clases:

```kotlin
class Dispositivo(val modelo: String)

class Smartphone(modelo: String, val bateria: Int) : Dispositivo(modelo)
```

¿Qué error se producirá al intentar compilar este código?

- **A)** Error porque `Smartphone` debe usar la palabra reservada `extends`.
- **B)** Error porque en Kotlin las clases son `final` por defecto; `Dispositivo` debe declararse explícitamente como `open class`.
- **C)** Error porque `bateria` no puede ser declarada en el constructor primario.
- **D)** Error porque el constructor de `Smartphone` debe invocar a `super()` dentro de un bloque `init`.

---

### Pregunta 23
Dada la siguiente clase base:

```kotlin
open class Figura {
    open fun area(): Double = 0.0
}
```

¿Cómo debe declarar una clase derivada `Circulo` la sobrescritura del método `area()`?

- **A)** `open fun area(): Double = Math.PI * r * r`
- **B)** `@Override fun area(): Double = Math.PI * r * r`
- **C)** `fun area(): Double override = Math.PI * r * r`
- **D)** `override fun area(): Double = Math.PI * r * r`

---

### Pregunta 24
¿Cuál de las siguientes afirmaciones sobre las **clases abstractas** (`abstract class`) en Kotlin es **verdadera**?

- **A)** No se pueden instanciar directamente y sus métodos abstractos deben ser implementados obligatoriamente por las clases derivadas no abstractas.
- **B)** Requieren obligatoriamente la palabra clave `open` antes de `abstract` para poder ser heredadas.
- **C)** No pueden contener métodos con implementación concreta (con cuerpo).
- **D)** No pueden definir constructores primarios con parámetros.

---

### Pregunta 25
¿Cuál es la salida en consola del siguiente programa basado en polimorfismo?

```kotlin
open class Impresora {
    open fun imprimir() = "Imprimiendo en blanco y negro"
}

class ImpresoraColor : Impresora() {
    override fun imprimir() = "Imprimiendo a color"
}

fun main() {
    val equipo: Impresora = ImpresoraColor()
    println(equipo.imprimir())
}
```

- **A)** `Imprimiendo en blanco y negro`
- **B)** `Imprimiendo a color`
- **C)** Error de compilación porque la variable es de tipo `Impresora` y no puede contener una `ImpresoraColor`.
- **D)** Error en tiempo de ejecución por incompatibilidad de tipos.

---

### Pregunta 26
Observa la siguiente interfaz:

```kotlin
interface Reproductor {
    fun reproducir()
    fun pausar() {
        println("Reproducción en pausa")
    }
}
```

Si una clase `AudioPlayer` implementa la interfaz `Reproductor`, ¿qué método está **obligada** a implementar?

- **A)** Únicamente `reproducir()`, ya que `pausar()` tiene una implementación por defecto en la interfaz.
- **B)** Ambos métodos obligatoriamente, ya que las interfaces no permiten código ejecutable.
- **C)** Ninguno; las clases que implementan interfaces en Kotlin no tienen métodos obligatorios.
- **D)** Solo `pausar()`, debiendo marcar `reproducir()` como descartado.

---

### Pregunta 27
Si una clase implementa dos interfaces (`A` y `B`) que definen un método con la misma firma e implementación por defecto `fun accion()`, ¿cómo resuelve la clase la colisión de forma explícita?

- **A)** No se puede resolver; Kotlin prohíbe implementar interfaces con métodos que compartan nombre.
- **B)** El compilador elige automáticamente la primera interfaz listada en la declaración.
- **C)** Sobrescribiendo el método y llamando a `super<A>.accion()` o `super<B>.accion()`.
- **D)** Declarando la clase como `sealed class`.

---

### Pregunta 28
¿Cómo se realiza correctamente la invocación al constructor de la clase base `Elemento(id)` desde una clase derivada `Boton`?

- **A)** `class Boton(val id: Int) extends Elemento(id)`
- **B)** `class Boton(id: Int, val texto: String) : Elemento(id)`
- **C)** `class Boton(id: Int, val texto: String) : Elemento { super(id) }`
- **D)** `class Boton(id: Int) : super.Elemento(id)`

---

## Bloque 06: Data Class vs Class Estándar

### Pregunta 29
¿Qué métodos genera automáticamente el compilador de Kotlin para una `data class` a partir de las propiedades declaradas en su constructor primario?

- **A)** Solo `getters` y `setters` públicos.
- **B)** `serialize()`, `deserialize()` y `clone()`.
- **C)** `equals()`, `hashCode()`, `toString()` y `copy()`.
- **D)** `compareTo()`, `finalize()` y `iterator()`.

---

### Pregunta 30
Observa el siguiente código y la comparación de objetos:

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
- **B)** `false - true`
- **C)** `false - false`
- **D)** `true - false`

---

### Pregunta 31
¿Cuál es la salida de ejecutar este fragmento con el método `copy()`?

```kotlin
data class Usuario(val id: Int, val nombre: String, val activo: Boolean)

fun main() {
    val user1 = Usuario(1, "Carlos", true)
    val user2 = user1.copy(activo = false)
    println("${user1.activo} y ${user2.activo}")
}
```

- **A)** `false y false`
- **B)** `true y false`
- **C)** Error de compilación porque las propiedades declaradas con `val` no se pueden modificar con `copy()`.
- **D)** Error en tiempo de ejecución.

---

### Pregunta 32
¿Cuál de los siguientes requisitos es **estrictamente obligatorio** al declarar una `data class` en Kotlin?

- **A)** El constructor primario debe tener al menos un parámetro, y todos sus parámetros deben estar marcados con `val` o `var`.
- **B)** La clase debe ser declarada obligatoriamente con el modificador `open`.
- **C)** No puede implementar interfaces.
- **D)** Debe definir explícitamente un método `copy()` en su cuerpo.

---

### Pregunta 33
Desde el punto de vista del diseño de software, ¿cuándo es preferible utilizar una **`class` estándar** en lugar de una **`data class`**?

- **A)** Cuando se requiere transferir datos entre capas de una aplicación (DTOs).
- **B)** Cuando la clase solo contiene atributos inmutables y actúa como contenedor de valores.
- **C)** Las `data class` han reemplazado por completo a las clases estándar y deben usarse siempre.
- **D)** Cuando la clase representa un servicio, controlador o componente con lógica de negocio compleja, estado mutable y donde la identidad referencial importa más que la igualdad de sus campos.

---

## Bloque 07: Funciones de Alcance (Scope Functions)

### Pregunta 34
¿Cuál es el valor que devolverá la invocación de `let` en este código?

```kotlin
val saludo: String? = "Hola Kotlin"
val longitud = saludo?.let {
    println("Procesando: $it")
    it.length
}
```

- **A)** El propio objeto `saludo` (`"Hola Kotlin"`).
- **B)** `Unit`
- **C)** `11` (el resultado de la última expresión dentro del bloque lambda).
- **D)** `null`

---

### Pregunta 35
¿Qué caracteriza a la función de alcance `apply` respecto a su objeto de contexto y su valor de retorno?

- **A)** El objeto de contexto está disponible como `this`, y la función devuelve el propio objeto receptor.
- **B)** El objeto de contexto está disponible como `it`, y la función devuelve el resultado de la lambda.
- **C)** El objeto de contexto está disponible como `this`, y la función devuelve siempre `Unit`.
- **D)** El objeto de contexto está disponible como `it`, y la función devuelve un booleano.

---

### Pregunta 36
¿Cuál es el caso de uso más idiomático de la función `also` en Kotlin?

- **A)** Modificar todas las variables de un objeto y devolver un tipo completamente nuevo.
- **B)** Ejecutar acciones adicionales que no alteran el objeto, como registrar logs o imprimir valores en depuración, devolviendo el objeto receptor intacto.
- **C)** Transformar una lista en un mapa.
- **D)** Sustituir a las comprobaciones de nulos de `if (x != null)`.

---

### Pregunta 37
Observa las siguientes dos funciones de alcance:

```kotlin
class Ventana { var ancho: Int = 800 }

val r1 = Ventana().run { ancho + 200 }
val r2 = Ventana().apply { ancho + 200 }
```

¿Qué valores contienen `r1` y `r2` respectivamente?

- **A)** `r1` es `1000` y `r2` es `1000`
- **B)** `r1` es de tipo `Ventana` y `r2` es `1000`
- **C)** `r1` es `Unit` y `r2` es de tipo `Ventana`
- **D)** `r1` es `1000` (resultado de la expresión) y `r2` es de tipo `Ventana` (el propio objeto receptor)

---

## Bloque 08: Colecciones y Concurrencia Básica

### Pregunta 38
¿Qué ocurrirá al intentar ejecutar la línea marcada con error en el siguiente código?

```kotlin
val lista = listOf(1, 2, 3)
lista.add(4) // Línea problemática
```

- **A)** Se añade el número 4 al final de la lista normalmente.
- **B)** Error de compilación porque `listOf()` devuelve una lista de solo lectura (`List`), que carece de métodos de mutación como `add()`. Para mutarla se debe usar `mutableListOf()`.
- **C)** Lanza una excepción `UnsupportedOperationException` en tiempo de ejecución.
- **D)** Crea una nueva lista con 4 elementos sin modificar la original.

---

### Pregunta 39
¿Cuál es la salida tras aplicar las siguientes operaciones sobre la colección?

```kotlin
val valores = listOf(10, 15, 20, 25, 30)
val resultado = valores
    .filter { it % 2 == 0 }
    .map { it / 2 }

println(resultado)
```

- **A)** `[10, 20, 30]`
- **B)** `[5, 10, 15, 20, 25]`
- **C)** `[5, 10, 15]`
- **D)** `[5, 15]`

---

### Pregunta 40
En Kotlin Coroutines, ¿cuál es la diferencia fundamental entre los constructores (*builders*) `launch` y `async`?

- **A)** `launch` se ejecuta en el hilo principal y `async` se ejecuta siempre en el hilo de fondo.
- **B)** `launch` inicia una corrutina de tipo "dispara y olvida" y devuelve un `Job` (sin valor de retorno), mientras que `async` devuelve un `Deferred<T>` cuyo resultado puede obtenerse llamando a `await()`.
- **C)** `launch` solo puede usarse dentro de un bloque `runBlocking`, mientras que `async` no requiere ningún ámbito.
- **D)** `async` es bloqueante y detiene el hilo actual, mientras que `launch` no es bloqueante.
