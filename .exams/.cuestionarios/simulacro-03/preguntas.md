# Cuestionario de Evaluación: Kotlin

**Módulo:** Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM  
**Curso Académico:** 2026 / 2027  
**Material de referencia:** Apuntes de clase (`docs/temas/00-android/00-kotlin`)

---

## Bloque 01: Fundamentos y Tipos

### Pregunta 01
Observa la siguiente clase y su uso:

```kotlin
class Marcador {
    var puntos: Int = 0
}

fun main() {
    val m = Marcador()
    m.puntos = 10
    println(m.puntos)
}
```

¿Qué ocurrirá al compilar y ejecutar este programa?

- **A)** Error de compilación porque la variable `m` fue declarada con `val`, impidiendo modificar cualquiera de sus propiedades internas.
- **B)** Compila e imprime `10` porque `val` garantiza la inmutabilidad de la referencia (no se puede asignar otro objeto a `m`), pero el estado interno del objeto referenciado puede mutar si sus propiedades son `var`.
- **C)** Error en tiempo de ejecución por acceso ilegal a memoria.
- **D)** Asigna `0` ignorando la modificación de la propiedad.

---

### Pregunta 02
En Kotlin, ¿qué ocurre si intentas comparar un valor de tipo carácter (`Char`) con un número entero (`Int`) directamente mediante `if ('A' == 65)`?

- **A)** Compila y evalúa a `true` porque el código ASCII de `'A'` es 65.
- **B)** Compila y evalúa a `false` porque tienen diferente signo.
- **C)** Error de compilación porque en Kotlin los caracteres (`Char`) son tipos independientes y no se tratan directamente como números; se requiere `if ('A'.code == 65)`.
- **D)** Produce un desbordamiento de memoria (*overflow*).

---

### Pregunta 03
Observa la siguiente condición con operadores lógicos de cortocircuito:

```kotlin
val lista: List<String>? = null
if (lista != null && lista.isNotEmpty()) {
    println("Tiene elementos")
} else {
    println("Vacía o nula")
}
```

¿Por qué este código es completamente seguro frente a `NullPointerException`?

- **A)** Porque el operador `&&` evalúa de izquierda a derecha con cortocircuito: al ser `lista != null` falso, la segunda parte nunca llega a evaluarse.
- **B)** Porque el compilador de Kotlin sustituye automáticamente `&&` por un bloque `try-catch`.
- **C)** No es seguro; lanzará `NullPointerException` al intentar comprobar `lista.isNotEmpty()`.
- **D)** Porque `isNotEmpty()` es una función que maneja nulos internamente.

---

### Pregunta 04
¿Qué método de la biblioteca estándar de Kotlin permite convertir una cadena de texto a entero de forma segura, devolviendo `null` si el texto no representa un número válido en lugar de lanzar una excepción?

- **A)** `.toIntSafe()`
- **B)** `.toIntOrNull()`
- **C)** `.parseInteger()`
- **D)** `.tryToInt()`

---

### Pregunta 05
En Kotlin, ¿cuál es la diferencia entre el operador de igualdad estructural (`==`) y el de igualdad referencial (`===`)?

- **A)** `==` compara referencias de memoria y `===` compara el contenido mediante `equals()`.
- **B)** `==` solo se usa con números enteros y `===` con números decimales.
- **C)** `==` comprueba si el contenido de los objetos es igual invocando internamente a `equals()`, mientras que `===` comprueba si ambas referencias apuntan a la misma dirección física en memoria.
- **D)** Son completamente idénticos y se pueden intercambiar libremente.

---

## Bloque 02: Control de Flujo y Expresiones

### Pregunta 06
¿Qué salida produce la siguiente estructura `when` con valores agrupados por comas?

```kotlin
val diaSemana = 6
val tipo = when (diaSemana) {
    1, 2, 3, 4, 5 -> "Laborable"
    6, 7 -> "Fin de semana"
    else -> "Inválido"
}
println(tipo)
```

- **A)** `Fin de semana` porque en una misma rama de `when` se pueden combinar múltiples condiciones separadas por comas.
- **B)** Error de compilación porque las ramas de `when` solo pueden recibir un único valor por línea.
- **C)** `Laborable`
- **D)** `Inválido`

---

### Pregunta 07
Observa la siguiente asignación condicional:

```kotlin
val calificacion = 6
val estado = if (calificacion >= 5) "Aprobado"
```

¿Qué error produce el compilador de Kotlin en este código?

- **A)** Error porque no se puede asignar una cadena a una variable inferida.
- **B)** Error de compilación porque cuando `if` se utiliza como expresión (para devolver un valor y asignarlo), la rama `else` es estrictamente obligatoria.
- **C)** Compila asignando `null` si la calificación es menor a 5.
- **D)** Error de sintaxis en el operador `>=`.

---

### Pregunta 08
¿Qué imprimirá en consola este bucle que recorre directamente los caracteres de un `String`?

```kotlin
val lenguaje = "Kotlin"
for (c in lenguaje) {
    if (c == 't') break
    print(c)
}
```

- **A)** `Ko`
- **B)** `Kot`
- **C)** `Kotlin`
- **D)** Error de compilación porque para iterar un `String` se debe convertir obligatoriamente a lista con `toList()`.

---

### Pregunta 09
¿Cuál es la salida del siguiente bucle `while`?

```kotlin
var n = 5
while (n > 2) {
    n--
    print("$n ")
}
```

- **A)** `5 4 3 2 `
- **B)** `5 4 3 `
- **C)** `4 3 2 `
- **D)** `4 3 `

---

### Pregunta 10
Observa el siguiente `when` que evalúa una variable de tipo booleano:

```kotlin
val conectado = true
val mensaje = when (conectado) {
    true -> "En línea"
    false -> "Desconectado"
}
```

¿Por qué no es necesaria la rama `else` en este bloque?

- **A)** Porque la variable vale `true` en el momento de compilar.
- **B)** Porque `when` es exhaustivo al cubrir todos los posibles valores del tipo evaluado (los dos estados de un `Boolean`).
- **C)** Sí es necesaria; cualquier `when` como expresión exige siempre `else`.
- **D)** Porque `when` infiere una rama `else` vacía por defecto.

---

## Bloque 03: Seguridad ante Nulos (Null Safety)

### Pregunta 11
¿Qué ocurre al ejecutar la siguiente función cuando el parámetro `token` es `null`?

```kotlin
fun autenticar(token: String?) {
    val tokenValido = token ?: throw IllegalArgumentException("Token requerido")
    println("Token aceptado: $tokenValido")
}
```

- **A)** Asigna una cadena vacía a `tokenValido` y continúa.
- **B)** Se produce un error de compilación porque el operador Elvis no admite la palabra `throw`.
- **C)** Lanza inmediatamente la excepción `IllegalArgumentException("Token requerido")` interrumpiendo el flujo.
- **D)** Imprime `Token aceptado: null`.

---

### Pregunta 12
¿Por qué la función de extensión `.isNullOrEmpty()` puede invocarse sobre una variable `val texto: String? = null` directamente sin usar el operador de llamada segura (`texto?.isNullOrEmpty()`)?

- **A)** Porque en Kotlin las funciones de extensión pueden definirse sobre receptores anulables (`fun CharSequence?.isNullOrEmpty(): Boolean`), gestionando el caso de `null` en su interior.
- **B)** Porque el compilador convierte automáticamente todas las funciones de biblioteca a funciones seguras.
- **C)** Es una errata; el código genera un error de compilación estricto si no se coloca `?.`.
- **D)** Porque `String?` se transforma en `Object` en tiempo de compilación.

---

### Pregunta 13
¿Cuál es el valor final de la variable `numero` tras evaluar este fragmento?

```kotlin
val dato: Any = "PMDM"
val numero: Int = dato as? Int ?: -1
println(numero)
```

- **A)** `0`
- **B)** `-1` porque `dato as? Int` falla de forma segura devolviendo `null`, y el operador Elvis `?:` toma el valor por defecto `-1`.
- **C)** Lanza una excepción `ClassCastException`.
- **D)** Error de compilación porque no se puede encadenar `as?` con `?:`.

---

### Pregunta 14
¿Qué imprimirá en consola este código al evaluar la plantilla de texto con una variable nula?

```kotlin
val usuario: String? = null
println("Hola, $usuario!")
```

- **A)** Lanza una excepción `NullPointerException`.
- **B)** `Hola, null!` porque las plantillas de cadenas convierten el valor `null` a su representación en texto `"null"`.
- **C)** `Hola, !` omitiendo el valor silenciosamente.
- **D)** Error de compilación al interpolar variables anulables sin el operador `?`.

---

### Pregunta 15
Observa el siguiente bloque con comprobación de tipo y smart cast:

```kotlin
fun procesar(objeto: Any) {
    when (objeto) {
        is String -> println("Longitud: ${objeto.length}")
        is List<*> -> println("Elementos: ${objeto.size}")
        else -> println("Otro tipo")
    }
}
```

¿Qué característica del compilador de Kotlin permite acceder a `objeto.length` directamente en la primera rama?

- **A)** El *Smart Cast* automático: al validar la condición `is String`, el compilador promociona la variable `objeto` a tipo `String` dentro de ese ámbito.
- **B)** La reflexión dinámica en tiempo de ejecución.
- **C)** La herencia múltiple de la clase `Any`.
- **D)** El uso de métodos virtuales no tipados.

---

## Bloque 04: Funciones, Lambdas y Extensiones

### Pregunta 16
Observa la siguiente función que recibe una acción de retorno (*callback*):

```kotlin
fun ejecutarDescarga(url: String, alTerminar: () -> Unit) {
    println("Descargando $url...")
    alTerminar()
}
```

¿Cuál es la forma más idiomática de invocar esta función en Kotlin?

- **A)** `ejecutarDescarga("http://servidor.com", new Function() { public void call() {} })`
- **B)** `ejecutarDescarga("http://servidor.com") { println("Finalizada") }`
- **C)** `ejecutarDescarga("http://servidor.com", alTerminar = println("Finalizada"))`
- **D)** `ejecutarDescarga: "http://servidor.com" -> { println("Finalizada") }`

---

### Pregunta 17
Dada la firma de función `fun calcular(n: Int, formula: (Int) -> Int): Int`, ¿cuál de las siguientes lambdas eleva el número al cuadrado correctamente al ser pasada como argumento?

- **A)** `{ n -> return n * n }`
- **B)** `{ it ^ 2 }`
- **C)** `{ it * it }`
- **D)** `(it) -> it * it`

---

### Pregunta 18
Deseas crear una función de extensión sobre el tipo anulable `String?` que devuelva una cadena vacía si la referencia es nula o el propio valor en caso contrario. ¿Cuál es la sintaxis correcta?

- **A)** `fun String?.oVacio(): String = this ?: ""`
- **B)** `fun String.oVacio(): String? = this ?: ""`
- **C)** `extension fun String?.oVacio() { return this ?: "" }`
- **D)** `fun ?String.oVacio(): String = this ?: ""`

---

### Pregunta 19
En Kotlin, ¿cómo se pasa la función de biblioteca `println` como argumento de orden superior a un método `forEach` utilizando una **referencia a función**?

```kotlin
val nombres = listOf("Ana", "Pedro", "Lucia")
// ¿Cómo se imprime cada elemento idiomáticamente?
```

- **A)** `nombres.forEach(println())`
- **B)** `nombres.forEach(::println)`
- **C)** `nombres.forEach(-> println)`
- **D)** `nombres.forEach(println::invoke)`

---

### Pregunta 20
Observa la siguiente función con un valor por defecto calculado dinámicamente:

```kotlin
fun registrarEvento(mensaje: String, timestamp: Long = System.currentTimeMillis()) {
    println("[$timestamp] $mensaje")
}
```

¿Cuándo se evalúa la expresión `System.currentTimeMillis()`?

- **A)** Cada vez que se invoca a `registrarEvento(mensaje)` sin proporcionar el segundo argumento.
- **B)** Una única vez al iniciar la aplicación en memoria.
- **C)** En tiempo de compilación.
- **D)** Nunca, produce un error de compilación porque los valores por defecto deben ser constantes literales.

---

### Pregunta 21
¿Cuál de las siguientes funciones de una sola línea (*single-expression function*) devuelve correctamente el estado de un semáforo según su color?

- **A)** `fun semaforo(color: String): String { when(color) { "Rojo" -> "Parar" else -> "Avanzar" } }`
- **B)** `fun semaforo(color: String) = return when(color) { "Rojo" -> "Parar" else -> "Avanzar" }`
- **C)** `fun semaforo(color: String) = when(color) { "Rojo" -> "Parar" else -> "Avanzar" }`
- **D)** `fun semaforo(color: String): when(color) = { "Rojo" -> "Parar" else -> "Avanzar" }`

---

## Bloque 05: POO (Herencia, Polimorfismo e Interfaces)

### Pregunta 22
Dada la clase base `open class Componente`, ¿cuál es la sintaxis correcta para declarar una clase derivada `Boton` que hereda de ella con constructor vacío?

- **A)** `class Boton : Componente`
- **B)** `class Boton : Componente()`
- **C)** `class Boton extends Componente()`
- **D)** `class Boton implements Componente`

---

### Pregunta 23
Dada una superclase con una propiedad abierta:

```kotlin
open class Vehiculo {
    open val ruedas: Int = 4
}
```

¿Puede una subclase `Moto` sobrescribir dicha propiedad?

- **A)** No, en Kotlin solo se pueden sobrescribir métodos, nunca propiedades.
- **B)** Sí, declarando `override val ruedas: Int = 2` en la subclase.
- **C)** Solo si la propiedad en la clase base fue declarada con `var`.
- **D)** Sí, pero obligatoriamente dentro del bloque `init`.

---

### Pregunta 24
Observa el siguiente uso de polimorfismo mediante interfaces:

```kotlin
interface Volador {
    fun volar()
}

class Avion : Volador {
    override fun volar() = println("Avión volando")
    fun aterrizar() = println("Aterrizando")
}

fun main() {
    val transporte: Volador = Avion()
    transporte.volar()
    // transporte.aterrizar() // Línea en cuestión
}
```

¿Qué ocurriría si descomentas la línea `transporte.aterrizar()`?

- **A)** Error de compilación porque la variable de referencia es de tipo `Volador`, y la interfaz `Volador` no declara el método `aterrizar()`.
- **B)** Compila y ejecuta normalmente porque el objeto real en memoria es un `Avion`.
- **C)** Lanza una excepción `NoSuchMethodException` en tiempo de ejecución.
- **D)** Se invoca un método vacío por defecto.

---

### Pregunta 25
¿Cuál es la forma correcta en Kotlin para que una clase `Documento` implemente dos interfaces distintas (`Imprimible` y `Exportable`)?

- **A)** `class Documento implements Imprimible, Exportable`
- **B)** `class Documento : Imprimible & Exportable`
- **C)** `class Documento : Imprimible, Exportable`
- **D)** `class Documento : Imprimible extends Exportable`

---

### Pregunta 26
Si una clase derivada sobrescribe un método de la clase base con `override fun pintar()`, ¿pueden las clases que hereden de esta subclase volver a sobrescribir dicho método?

- **A)** No, en Kotlin un método marcado con `override` queda cerrado automáticamente para siempre.
- **B)** Sí, porque en Kotlin un método con `override` permanece abierto (`open`) implícitamente a menos que se declare explícitamente como `final override fun pintar()`.
- **C)** Solo si la clase base original era una interfaz.
- **D)** Sí, pero requiere eliminar la palabra `override`.

---

### Pregunta 27
¿En qué momento exacto se ejecuta el bloque `init` de una clase en Kotlin?

- **A)** Inmediatamente después de que se evalúa el constructor primario y se inicializan las propiedades en el orden en que aparecen en el código.
- **B)** Únicamente cuando se invoca a un constructor secundario.
- **C)** Antes de que se asigne cualquier parámetro del constructor primario.
- **D)** De forma perezosa (*lazy*) la primera vez que se accede a un método de la clase.

---

### Pregunta 28
Observa la siguiente función que recibe una clase abstracta:

```kotlin
abstract class Forma {
    abstract fun calcularArea(): Double
}

fun mostrarArea(f: Forma) {
    println("Área: ${f.calcularArea()}")
}
```

¿Qué principio de la orientación a objetos permite que `mostrarArea` procese indistintamente instancias de `Circulo` o `Triangulo` sin conocer su tipo concreto?

- **A)** Encapsulamiento
- **B)** Delegación
- **C)** Polimorfismo
- **D)** Sobrecarga estática de métodos

---

## Bloque 06: Data Class vs Class Estándar

### Pregunta 29
Observa la comparación entre dos instancias distintas creadas con los mismos valores:

```kotlin
data class Punto(val x: Int, val y: Int)

val p1 = Punto(5, 10)
val p2 = Punto(5, 10)

println("${p1 == p2} y ${p1 === p2}")
```

¿Qué imprime en pantalla este fragmento?

- **A)** `true y true`
- **B)** `true y false` porque `==` compara sus valores estructurales (iguales), mientras que `===` compara sus referencias en memoria (dos objetos distintos).
- **C)** `false y false`
- **D)** `false y true`

---

### Pregunta 30
Dada la siguiente `data class`:

```kotlin
data class Contacto(val nombre: String, val email: String, val telefono: String)
val c1 = Contacto("Laura", "laura@mail.com", "600111222")
```

¿Cómo se crea una nueva instancia modificando simultáneamente el email y el teléfono sin alterar el nombre?

- **A)** `val c2 = c1.copy(email = "nuevo@mail.com", telefono = "600333444")`
- **B)** `val c2 = c1.clone(email = "nuevo@mail.com", telefono = "600333444")`
- **C)** `c1.email = "nuevo@mail.com"; c1.telefono = "600333444"`
- **D)** `val c2 = Contacto(c1, email = "nuevo@mail.com", telefono = "600333444")`

---

### Pregunta 31
¿Puede una `data class` implementar una interfaz en Kotlin?

- **A)** No, las `data class` tienen prohibido interactuar con interfaces.
- **B)** Solo si la interfaz no contiene métodos con implementación por defecto.
- **C)** Sí, una `data class` puede implementar una o múltiples interfaces y proporcionar la implementación requerida para sus miembros.
- **D)** Solo si todas las propiedades de la interfaz son de tipo numérico.

---

### Pregunta 32
¿Por qué **no es recomendable** utilizar una `data class` para modelar entidades complejas de base de datos con relaciones bidireccionales circulares (por ejemplo, `Autor` tiene lista de `Libros` y `Libro` tiene referencia a `Autor`)?

- **A)** Porque el compilador de Kotlin no permite colecciones dentro de una `data class`.
- **B)** Porque los métodos autogenerados `toString()`, `equals()` y `hashCode()` provocarán una recursión infinita y lanzarán un error `StackOverflowError` en tiempo de ejecución.
- **C)** Porque las `data class` solo admiten hasta 3 propiedades en el constructor primario.
- **D)** Porque las `data class` consumen más memoria que las interfaces.

---

### Pregunta 33
Si en un sistema empresarial necesitas que dos objetos de la clase `Cliente` sean considerados iguales **únicamente si su atributo `codigoCliente` coincide** (ignorando si su nombre o dirección han cambiado), ¿qué enfoque de diseño es el más apropiado?

- **A)** Usar una `class` estándar y sobrescribir manualmente `equals()` y `hashCode()` evaluando únicamente la propiedad `codigoCliente`.
- **B)** Usar una `data class` obligatoriamente porque no permite sobrescribir `equals()`.
- **C)** Usar una `enum class`.
- **D)** No es posible en Kotlin personalizar el criterio de igualdad de una clase.

---

## Bloque 07: Funciones de Alcance (Scope Functions)

### Pregunta 34
Deseas inicializar un objeto `TextView` configurando múltiples propiedades consecutivas y obtener como retorno el propio objeto receptor ya configurado. ¿Cuál es la función de alcance más idónea?

- **A)** `let`
- **B)** `with`
- **C)** `apply`
- **D)** `run`

---

### Pregunta 35
Observa el siguiente uso de `run` sobre un objeto receptor:

```kotlin
val resultado = "kotlin".run {
    uppercase().reversed()
}
println(resultado)
```

¿Qué imprimirá en consola?

- **A)** `kotlin`
- **B)** `NILTOK`
- **C)** `Unit`
- **D)** Error de compilación porque `run` no puede llamarse sobre cadenas de texto.

---

### Pregunta 36
¿Qué salida produce el siguiente código que utiliza la función `also` para depuración?

```kotlin
val lista = mutableListOf("A", "B")
val retorno = lista.also {
    it.add("C")
    println("Longitud en also: ${it.size}")
}
println("Retorno es igual a lista: ${retorno === lista}")
```

- **A)** Imprime la longitud y luego `Retorno es igual a lista: true` porque `also` devuelve siempre la instancia receptora original.
- **B)** `Retorno es igual a lista: false` porque `also` crea una copia defensiva.
- **C)** `Retorno es igual a lista: Unit`
- **D)** Error de compilación porque dentro de `also` no se pueden modificar colecciones.

---

### Pregunta 37
De las 5 funciones de alcance de Kotlin, ¿cuáles devuelven el **resultado de la expresión lambda** en lugar del objeto receptor?

- **A)** Únicamente `apply`
- **B)** `apply` y `also`
- **C)** Todas devuelven siempre el objeto receptor.
- **D)** `let`, `run` y `with`

---

## Bloque 08: Colecciones y Concurrencia Básica

### Pregunta 38
Dada la lista `val palabras = listOf("sol", "mar", "cielo", "rio")`, ¿cuál es el resultado de invocar `palabras.groupBy { it.length }`?

- **A)** `[3, 3, 5, 3]`
- **B)** Un mapa `Map<Int, List<String>>` donde la clave `3` asocia a `["sol", "mar", "rio"]` y la clave `5` a `["cielo"]`.
- **C)** Una lista filtrada con las palabras de tamaño 3.
- **D)** Error de compilación porque `groupBy` requiere dos parámetros.

---

### Pregunta 39
¿Cuál es la salida de aplicar `reduce` sobre la siguiente colección numérica?

```kotlin
val numeros = listOf(1, 2, 3, 4)
val total = numeros.reduce { acumulador, elemento -> acumulador * elemento }
println(total)
```

- **A)** `24` porque multiplica acumulativamente todos los elementos de la lista (`1 * 2 * 3 * 4`).
- **B)** `10`
- **C)** `[1, 2, 6, 24]`
- **D)** Error de compilación porque `reduce` solo admite sumas.

---

### Pregunta 40
En el desarrollo de aplicaciones Android con corrutinas de Kotlin, ¿qué despachador (`CoroutineDispatcher`) se debe utilizar para realizar lecturas o escrituras de ficheros locales, operaciones de base de datos con Room o peticiones de red a APIs REST?

- **A)** `Dispatchers.Main`
- **B)** `Dispatchers.Unconfined`
- **C)** `Dispatchers.IO` porque está optimizado para descargar el trabajo intensivo de entrada/salida (I/O) fuera del hilo principal de la interfaz de usuario.
- **D)** `Dispatchers.Default` únicamente para cualquier tipo de tarea sin excepción.
