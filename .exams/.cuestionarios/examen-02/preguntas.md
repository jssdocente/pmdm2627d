# Cuestionario de Evaluación: Kotlin

**Módulo:** Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM  
**Curso Académico:** 2026 / 2027  
**Material de referencia:** Apuntes de clase (`docs/temas/00-android/00-kotlin`)

---

## Bloque 01: Fundamentos y Tipos

### Pregunta 01
Observa el siguiente fragmento de código con colecciones:

```kotlin
val lista = mutableListOf("A", "B", "C")
lista.add("D")
lista = mutableListOf("X", "Y")
```

¿Qué ocurrirá al intentar compilar este programa?

- **A)** Compila y ejecuta correctamente porque la colección fue declarada como `MutableList`.
- **B)** Error de compilación en la tercera línea porque la variable `lista` se declaró con `val`, impidiendo reasignar la referencia a una nueva instancia.
- **C)** Error de compilación en la segunda línea porque una variable `val` prohíbe invocar métodos que modifiquen el contenido del objeto.
- **D)** Error en tiempo de ejecución (`UnsupportedOperationException`).

---

### Pregunta 02
¿Qué tipo de dato infiere el compilador de Kotlin para la variable `temperatura` en la siguiente declaración con el sufijo `f`?

```kotlin
val temperatura = 36.6f
```

- **A)** `Float`
- **B)** `Double`
- **C)** `Number`
- **D)** `BigDecimal`

---

### Pregunta 03
¿Qué salida produce el siguiente código con cadenas multilínea (*raw strings*) y la función `trimMargin()`?

```kotlin
val texto = """
    |PMDM
    |2º DAM
""".trimMargin()
print(texto.replace("\n", " - "))
```

- **A)** `|PMDM - |2º DAM`
- **B)** `    PMDM -     2º DAM`
- **C)** `PMDM - 2º DAM`
- **D)** Error de compilación porque `trimMargin()` requiere especificar obligatoriamente un delimitador entre paréntesis.

---

### Pregunta 04
¿Qué devolverá la función `.toIntOrNull()` al intentar convertir la cadena `"100pts"` a número entero?

```kotlin
val valor = "100pts".toIntOrNull()
println(valor)
```

- **A)** `100` ignorando las letras finales.
- **B)** `null` de forma segura, evitando lanzar la excepción `NumberFormatException`.
- **C)** `0` como valor por defecto.
- **D)** Lanza una excepción `IllegalArgumentException`.

---

## Bloque 02: Control de Flujo y Expresiones

### Pregunta 05
¿Qué valor contendrá la variable `resultado` tras evaluarse este bloque `try-catch` como expresión?

```kotlin
val entrada = "abc"
val resultado = try {
    entrada.toInt()
} catch (e: NumberFormatException) {
    -1
}
println(resultado)
```

- **A)** `null`
- **B)** `-1` porque en Kotlin `try-catch` es una expresión que devuelve el valor de la rama ejecutada.
- **C)** Lanza la excepción `NumberFormatException` sin control.
- **D)** Error de compilación porque `try` no puede asignarse directamente a una variable.

---

### Pregunta 06
¿Qué salida produce el siguiente bloque `when` con comprobación de tipo mediante `is`?

```kotlin
fun describir(elemento: Any): String = when (elemento) {
    is String -> "Texto con ${elemento.length} caracteres"
    is Int -> "Entero multiplicado: ${elemento * 2}"
    else -> "Tipo no contemplado"
}

fun main() {
    println(describir(15))
}
```

- **A)** `Entero multiplicado: 30`
- **B)** `Texto con 2 caracteres`
- **C)** Error de compilación porque `elemento` debe ser casteado manualmente con `(Int) elemento`.
- **D)** `Tipo no contemplado`

---

### Pregunta 07
¿Qué secuencia exacta de números imprime este bucle decreciente por consola?

```kotlin
for (i in 10 downTo 4 step 3) {
    print("$i ")
}
```

- **A)** `10 7 4 1 `
- **B)** `4 7 10 `
- **C)** `10 7 4 `
- **D)** `10 7 `

---

### Pregunta 08
Dada la lista `val frutas = listOf("Manzana", "Plátano", "Naranja")`, ¿cuál es la forma canónica de recorrer sus **posiciones o índices** en un bucle `for`?

- **A)** `for (i in 0..frutas.size)`
- **B)** `for (i in frutas.indices)`
- **C)** `for (i in frutas.length)`
- **D)** `for (index of frutas)`

---

## Bloque 03: Seguridad ante Nulos (Null Safety)

### Pregunta 09
Observa la siguiente cadena de llamadas seguras con operador `?.`:

```kotlin
val direccion: String? = null
val inicial = direccion?.trim()?.firstOrNull()?.uppercase()
println(inicial)
```

¿Qué valor se imprimirá en consola?

- **A)** `null` porque el operador `?.` interrumpe la evaluación de la cadena en cuanto encuentra un valor nulo y propaga `null`.
- **B)** Cadena vacía `""`.
- **C)** Lanza una excepción `NullPointerException` en `.trim()`.
- **D)** Error de compilación por encadenar más de dos operadores `?.`.

---

### Pregunta 10
¿Qué ocurrirá al invocar la función `validarUsuario` pasando un argumento con valor nulo?

```kotlin
fun validarUsuario(nombre: String?): String {
    val nombreValido = nombre ?: return "Usuario Anónimo"
    return "Usuario: $nombreValido"
}
```

- **A)** Imprime `Usuario: null`.
- **B)** Lanza una excepción `NullPointerException`.
- **C)** Error de compilación porque la palabra clave `return` no puede utilizarse a la derecha del operador Elvis `?:`.
- **D)** Devuelve `"Usuario Anónimo"` porque el operador Elvis ejecuta el `return` anticipado al ser `nombre` igual a `null`.

---

### Pregunta 11
Observa la siguiente función:

```kotlin
fun procesarMensaje(msg: String?) {
    if (msg != null) {
        println(msg.uppercase())
    }
}
```

¿Por qué el compilador permite llamar a `msg.uppercase()` sin usar `?.` ni `!!` dentro del bloque `if`?

- **A)** Porque en Kotlin todos los métodos de `String` admiten llamadas sobre nulos.
- **B)** Porque el compilador aplica *Smart Cast* (conversión inteligente) al haber verificado previamente que la variable inmutable no es nula.
- **C)** Porque las funciones convierten sus parámetros en no anulables automáticamente.
- **D)** Es un error de compilación; el operador `?.` es siempre obligatorio.

---

### Pregunta 12
¿Qué valor contendrá la variable `numero` tras evaluar la siguiente instrucción con *safe cast*?

```kotlin
val dato: Any = "PMDM 2026"
val numero: Int? = dato as? Int
println(numero)
```

- **A)** `null`
- **B)** `0`
- **C)** Lanza una excepción `ClassCastException`.
- **D)** Error de compilación porque no se puede convertir `Any` a `Int?`.

---

## Bloque 04: Funciones, Lambdas y Extensiones

### Pregunta 13
Dada la siguiente función:

```kotlin
fun crearPerfil(nombre: String, activo: Boolean = true, rol: String = "Alumno") {
    print("$nombre - $activo - $rol")
}
```

¿Qué imprimirá en consola la llamada `crearPerfil(rol = "Profesor", nombre = "Carlos")`?

- **A)** Error de compilación porque los argumentos deben pasarse en el mismo orden en que fueron declarados.
- **B)** `Carlos - true - Profesor`
- **C)** `Carlos - false - Profesor`
- **D)** Error de compilación porque falta especificar el parámetro `activo`.

---

### Pregunta 14
Al declarar una función de extensión sobre una clase:

```kotlin
fun String.primerCaracter(): Char? = this.firstOrNull()
```

¿A qué hace referencia la palabra clave `this` dentro del cuerpo de la función?

- **A)** A la clase que contiene la función de extensión.
- **B)** Al hilo de ejecución actual.
- **C)** A la instancia concreta del objeto receptor (`String`) sobre la que se está invocando la función.
- **D)** A una función anónima.

---

### Pregunta 15
Dada una función que recibe una lambda como último parámetro:

```kotlin
fun repetir(veces: Int, accion: (Int) -> Unit) {
    for (i in 1..veces) accion(i)
}
```

¿Cuál es la forma más idiomática de invocarla aprovechando la convención de *trailing lambda*?

- **A)** `repetir(3) { print("$it ") }`
- **B)** `repetir(3, { print("$it ") })`
- **C)** `repetir: 3 { print("$it ") }`
- **D)** `repetir(3) -> { print("$it ") }`

---

### Pregunta 16
¿Qué tipo de dato devuelve por defecto una función en Kotlin que realiza una acción pero no produce ningún valor de retorno útil?

- **A)** `void`
- **B)** `Unit`
- **C)** `Nothing`
- **D)** `null`

---

### Pregunta 17
¿Qué imprimirá por consola el siguiente fragmento que evalúa una lambda multilínea?

```kotlin
val operacion = { x: Int ->
    val cuadrado = x * x
    val doble = x * 2
    cuadrado + doble
}
println(operacion(3))
```

- **A)** `9`
- **B)** `6`
- **C)** `Unit`
- **D)** `15` porque en una expresión lambda de Kotlin el resultado de la última expresión evaluada es automáticamente el valor de retorno.

---

## Bloque 05: POO (Herencia, Polimorfismo e Interfaces)

### Pregunta 18
Dadas las dos siguientes clases:

```kotlin
class Servidor(val ip: String)

class ServidorWeb(ip: String, val puerto: Int) : Servidor(ip)
```

¿Qué error se producirá al intentar compilar este archivo?

- **A)** Error porque la clase derivada debe usar la palabra reservada `extends`.
- **B)** Error de compilación porque en Kotlin las clases son `final` por defecto; `Servidor` debe declararse explícitamente con `open class`.
- **C)** Error porque `puerto` no puede declararse con `val` en el constructor.
- **D)** Error de compilación porque falta llamar a `super()` dentro del bloque `init`.

---

### Pregunta 19
¿Qué palabra clave exige obligatoriamente Kotlin al sobrescribir un método o propiedad abierta de una superclase o interfaz?

- **A)** `override`
- **B)** `@Override`
- **C)** `open`
- **D)** `virtual`

---

### Pregunta 20
Observa el siguiente ejemplo de polimorfismo dinámico:

```kotlin
open class Tarea {
    open fun ejecutar() = print("Ejecutando tarea base; ")
}

class TareaBackup : Tarea() {
    override fun ejecutar() = print("Realizando copia de seguridad; ")
}

fun main() {
    val tareas: List<Tarea> = listOf(Tarea(), TareaBackup())
    tareas.forEach { it.ejecutar() }
}
```

¿Qué salida se mostrará por consola?

- **A)** `Ejecutando tarea base; Ejecutando tarea base; `
- **B)** `Ejecutando tarea base; Realizando copia de seguridad; `
- **C)** Error de compilación porque una lista de tipo `Tarea` no puede contener objetos de la subclase `TareaBackup`.
- **D)** Error en tiempo de ejecución por incompatibilidad de tipos.

---

### Pregunta 21
Dada la siguiente interfaz:

```kotlin
interface Conectable {
    fun conectar()
    fun desconectar() {
        println("Desconectado por defecto")
    }
}
```

Si una clase `BaseDatos` implementa `Conectable`, ¿qué métodos debe implementar obligatoriamente?

- **A)** Ambos métodos obligatoriamente.
- **B)** Únicamente `desconectar()`.
- **C)** Únicamente `conectar()`, ya que `desconectar()` proporciona una implementación por defecto en la interfaz.
- **D)** Ninguno; las interfaces en Kotlin tienen todos los métodos opcionales.

---

### Pregunta 22
Si una clase implementa dos interfaces (`A` y `B`) que definen un método con la misma firma `fun sincronizar()`, ¿cómo invoca explícitamente la implementación de la interfaz `A` para resolver la colisión?

- **A)** `A.super.sincronizar()`
- **B)** `super<A>.sincronizar()`
- **C)** `super.sincronizar(A)`
- **D)** `this<A>.sincronizar()`

---

## Bloque 06: Data Class vs Class Estándar

### Pregunta 23
¿Cuál es la salida de imprimir por pantalla una instancia de la siguiente `data class`?

```kotlin
data class Servidor(val host: String, val puerto: Int)

fun main() {
    val s = Servidor("192.168.1.1", 8080)
    println(s)
}
```

- **A)** `Servidor(host=192.168.1.1, puerto=8080)`
- **B)** Una referencia hexadecimal como `Servidor@4f3f5b24`.
- **C)** `[192.168.1.1, 8080]`
- **D)** Error de compilación porque falta implementar un método `toString()` explícito.

---

### Pregunta 24
¿Qué ocurrirá al ejecutar el método `copy()` sobre la siguiente instancia de `data class` inmutable?

```kotlin
data class Usuario(val id: Int, val nombre: String, val admin: Boolean)

fun main() {
    val u1 = Usuario(1, "Marcos", false)
    val u2 = u1.copy(admin = true)
    println("${u1.admin} - ${u2.admin}")
}
```

- **A)** `true - true`
- **B)** `false - true` porque `copy()` genera una nueva instancia independiente con el valor modificado sin mutar el objeto original.
- **C)** Error de compilación porque las propiedades declaradas con `val` son inmutables y no admiten copia.
- **D)** Error en tiempo de ejecución.

---

### Pregunta 25
Observa la siguiente `data class` con una propiedad definida en su cuerpo `{}`:

```kotlin
data class Articulo(val codigo: String) {
    var descuento: Double = 0.0
}

fun main() {
    val a1 = Articulo("A-01")
    a1.descuento = 0.10
    
    val a2 = Articulo("A-01")
    a2.descuento = 0.50
    
    println(a1 == a2)
}
```

¿Qué imprimirá en consola este código?

- **A)** `false` porque el descuento es diferente en ambos artículos.
- **B)** Error de compilación porque una `data class` no puede tener llaves `{}`.
- **C)** Error en tiempo de ejecución.
- **D)** `true` porque el método `equals()` autogenerado por el compilador solo tiene en cuenta las propiedades del constructor primario, ignorando las propiedades del cuerpo de la clase.

---

### Pregunta 26
Desde el punto de vista del diseño de software en Android, ¿cuál de los siguientes casos es el más adecuado para utilizar una **`class` estándar** en lugar de una **`data class`**?

- **A)** Para representar un modelo de datos recibido desde una API REST (DTO).
- **B)** Para representar el estado inmutable de una pantalla (*UI State*).
- **C)** Para implementar una clase de servicio o repositorio que gestiona conexiones, base de datos local y lógica de negocio compleja.
- **D)** Las clases estándar no deben usarse nunca en Kotlin moderno.

---

## Bloque 07: Funciones de Alcance (Scope Functions)

### Pregunta 27
Observa el siguiente uso de la función de alcance `with`:

```kotlin
val builder = StringBuilder("PMDM")
val longitud = with(builder) {
    append(" 2026")
    length
}
println(longitud)
```

¿Qué valor contendrá la variable `longitud`?

- **A)** El propio objeto `StringBuilder` receptor.
- **B)** `9` (el resultado evaluado por la última expresión del bloque lambda).
- **C)** `Unit`
- **D)** `4`

---

### Pregunta 28
¿Qué caracteriza a la función de alcance `also` en Kotlin?

- **A)** El objeto de contexto está disponible como `it` y la función devuelve el propio objeto receptor original, siendo idónea para efectos secundarios como depuración o logs.
- **B)** El objeto de contexto está disponible como `this` y devuelve el resultado de la lambda.
- **C)** Devuelve siempre `Unit`.
- **D)** Se utiliza únicamente para transformar tipos de datos.

---

## Bloque 08: Colecciones y Concurrencia Básica

### Pregunta 29
¿Cuál es la diferencia fundamental en Kotlin entre una lista creada con `listOf()` y una creada con `mutableListOf()`?

- **A)** `listOf()` crea una lista en disco y `mutableListOf()` en memoria RAM.
- **B)** `listOf()` devuelve una lista de solo lectura (`List`) que carece de métodos de mutación como `add()` o `remove()`, mientras que `mutableListOf()` devuelve una `MutableList` modificable.
- **C)** `listOf()` solo permite almacenar números y `mutableListOf()` cualquier objeto.
- **D)** No tienen ninguna diferencia; son alias intercambiables.

---

### Pregunta 30
En Kotlin Coroutines, ¿cuál es el significado del modificador `suspend` en una declaración de función como `suspend fun obtenerDatos(): List<String>`?

- **A)** Indica que la función puede pausar su ejecución sin bloquear el hilo subyacente, y solo puede ser llamada desde otra función `suspend` o dentro de un ámbito de corrutina.
- **B)** Convierte a la función en un hilo de ejecución `Thread` de Java de forma automática.
- **C)** Indica que la función solo puede ejecutarse de forma síncrona en el hilo principal.
- **D)** Indica que la función está en desuso (*deprecated*).
