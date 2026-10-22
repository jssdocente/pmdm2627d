# Cuestionario de Evaluación: Kotlin

**Módulo:** Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM  
**Curso Académico:** 2026 / 2027  
**Material de referencia:** Apuntes de clase (`docs/temas/00-android/00-kotlin`)

---

## Bloque 01: Fundamentos y Tipos

### Pregunta 01
Observa el siguiente fragmento de código:

```kotlin
val numeros = mutableListOf(1, 2, 3)
numeros.add(4)
numeros = mutableListOf(5, 6)
```

¿Qué ocurrirá al compilar este programa?

- **A)** Compila y ejecuta correctamente porque la lista es de tipo `MutableList`.
- **B)** Error de compilación en la línea 3 porque `numeros` está declarada con `val`, impidiendo reasignar la referencia a una nueva lista.
- **C)** Error de compilación en la línea 2 porque una variable `val` prohíbe invocar métodos que modifiquen el estado interno del objeto.
- **D)** Error en tiempo de ejecución (`UnsupportedOperationException`).

---

### Pregunta 02
¿Qué tipo de dato infiere el compilador de Kotlin para la variable `factor` en la siguiente declaración?

```kotlin
val factor = 3.14
```

- **A)** `Float`
- **B)** `Number`
- **C)** `Double`
- **D)** `BigDecimal`

---

### Pregunta 03
¿Cuál es la salida de ejecutar las siguientes operaciones aritméticas enteras en Kotlin?

```kotlin
val a = 7
val b = 2
val cociente = a / b
println(cociente)
```

- **A)** `3` porque la división entre dos enteros en Kotlin realiza una división entera truncada.
- **B)** `3.5` porque Kotlin promociona automáticamente la operación a número decimal.
- **C)** Error de compilación porque los enteros no admiten el operador `/` sin convertir previamente a `Double`.
- **D)** `3.0`

---

### Pregunta 04
Observa el siguiente código con plantillas de cadenas:

```kotlin
val usuario = "antonio"
println("Longitud: $usuario.length")
```

¿Qué imprimirá en la consola?

- **A)** `Longitud: 7`
- **B)** `Longitud: antonio.length`
- **C)** Error de compilación porque no se puede acceder a miembros dentro de comillas.
- **D)** `Longitud: 0`

---

### Pregunta 05
¿Por qué la guía oficial de Kotlin y las buenas prácticas de desarrollo móvil recomiendan declarar las propiedades y variables preferentemente con `val` en lugar de `var`?

- **A)** Porque las variables declaradas con `val` consumen la mitad de memoria en la JVM.
- **B)** Porque `var` solo se permite dentro del ámbito de bucles `for` y `while`.
- **C)** Porque las variables declaradas con `val` pueden cambiar de tipo en tiempo de ejecución.
- **D)** Porque promueve la inmutabilidad, hace el código más predecible, previene efectos secundarios accidentales y facilita la programación concurrente segura.

---

## Bloque 02: Control de Flujo y Expresiones

### Pregunta 06
¿Qué valor contendrá la variable `puerto` tras ejecutarse este bloque en Kotlin?

```kotlin
val entrada = "8080abc"
val puerto = try {
    entrada.toInt()
} catch (e: NumberFormatException) {
    80
}
println(puerto)
```

- **A)** `null`
- **B)** `80` porque `try-catch` es una expresión que devuelve el valor de la rama evaluada.
- **C)** Lanza la excepción `NumberFormatException` sin capturarla.
- **D)** Error de compilación porque `try-catch` no puede asignarse a una variable en Kotlin.

---

### Pregunta 07
¿Qué salida produce el siguiente bloque `when` con comprobación de tipos?

```kotlin
fun clasificar(item: Any): String = when (item) {
    is String -> "Texto de tamaño ${item.length}"
    is Int -> "Entero: ${item * 2}"
    else -> "Desconocido"
}

fun main() {
    println(clasificar("Hola"))
}
```

- **A)** `Texto de tamaño 4`
- **B)** `Entero: 8`
- **C)** Error de compilación porque `item` debe ser casteado explícitamente a `String` dentro de la rama.
- **D)** `Desconocido`

---

### Pregunta 08
¿Cómo se itera sobre los **índices válidos** de una lista de cadenas `val nombres = listOf("Ana", "Luis", "Carlos")` en un bucle `for`?

- **A)** `for (i in nombres.length)`
- **B)** `for (i = 0; i < nombres.size; i++)`
- **C)** `for (i in nombres.indices)`
- **D)** `for (index of nombres)`

---

### Pregunta 09
¿Cuál es la salida de evaluar la siguiente condición de rango inverso con el operador `!in`?

```kotlin
val x = 12
if (x !in 1..10) {
    print("Fuera de rango")
} else {
    print("Dentro de rango")
}
```

- **A)** `Dentro de rango`
- **B)** `Fuera de rango`
- **C)** Error de compilación porque el operador `!in` no existe en Kotlin.
- **D)** Error de compilación porque los rangos solo pueden usarse dentro de estructuras `when`.

---

### Pregunta 10
Observa el siguiente bucle `do-while`:

```kotlin
var contador = 10
do {
    print("$contador ")
    contador++
} while (contador < 5)
```

¿Qué imprimirá en la consola?

- **A)** No imprime nada porque la condición `10 < 5` es falsa desde el inicio.
- **B)** `10 ` porque el cuerpo del bucle `do-while` se ejecuta al menos una vez antes de evaluar la condición.
- **C)** Bucle infinito.
- **D)** `10 11 `

---

## Bloque 03: Seguridad ante Nulos (Null Safety)

### Pregunta 11
Dada la variable `val direccion: String? = null`, ¿cuál es el resultado de evaluar `direccion?.uppercase()`?

- **A)** `null`
- **B)** Cadena vacía `""`
- **C)** Lanza una excepción `NullPointerException`.
- **D)** Error de compilación porque `uppercase()` no se puede llamar sobre variables que puedan ser nulas.

---

### Pregunta 12
¿Qué imprimirá por consola el siguiente encadenamiento de operadores Elvis (`?:`)?

```kotlin
val config1: String? = null
val config2: String? = null
val configDefecto = "Produccion"

val activa = config1 ?: config2 ?: configDefecto
println(activa)
```

- **A)** `null`
- **B)** `config1`
- **C)** `Produccion`
- **D)** Error de compilación porque el operador Elvis solo puede utilizarse una vez por instrucción.

---

### Pregunta 13
Observa la siguiente comprobación de nulos tradicional:

```kotlin
fun imprimirTam(cadena: String?) {
    if (cadena != null) {
        println(cadena.length)
    }
}
```

¿Por qué compila `cadena.length` sin necesidad de escribir `cadena?.length` o `cadena!!.length` dentro del `if`?

- **A)** Porque dentro de las funciones todas las variables se vuelven no anulables automáticamente.
- **B)** Porque el compilador de Kotlin aplica *Smart Cast* (conversión inteligente) al verificar previamente que la variable local no es nula.
- **C)** Porque `length` es una propiedad estática accesible independientemente de si el objeto existe.
- **D)** No compila; Kotlin exige obligatoriamente `?.` en todo momento para tipos anulables.

---

### Pregunta 14
Dada la siguiente firma de función:

```kotlin
fun buscarPorId(id: Int): String?
```

¿Cuál de las siguientes asignaciones provocará un **error de compilación**?

- **A)** `val resultado: String? = buscarPorId(1)`
- **B)** `val resultado = buscarPorId(1)`
- **C)** `val resultado: String = buscarPorId(1)`
- **D)** `val resultado: Any? = buscarPorId(1)`

---

### Pregunta 15
¿Cuál es la principal desventaja de abusar del operador de aserción no nula (`!!`) en el código de una aplicación Kotlin?

- **A)** Reduce significativamente el rendimiento de la CPU al realizar múltiples comprobaciones reflexivas.
- **B)** Anula la garantía de seguridad en tiempo de compilación frente a nulos, reintroduciendo el riesgo de caídas de la aplicación por `NullPointerException` en tiempo de ejecución.
- **C)** Hace que la variable pase a ser de tipo `Object` de Java.
- **D)** Obliga a envolver la llamada dentro de un bloque `synchronized`.

---

## Bloque 04: Funciones, Lambdas y Extensiones

### Pregunta 16
¿Qué tipo de retorno infiere el compilador para una función que no especifica tipo de salida ni devuelve ningún valor mediante `return`?

- **A)** `Unit`
- **B)** `void`
- **C)** `Nothing`
- **D)** `Any`

---

### Pregunta 17
Dada la función con múltiples parámetros booleanos:

```kotlin
fun crearNotificacion(vibrar: Boolean, sonido: Boolean, led: Boolean) { /* ... */ }
```

¿Qué ventaja aporta el uso de **argumentos con nombre** (`crearNotificacion(sonido = true, vibrar = false, led = true)`) en esta llamada?

- **A)** Acelera la velocidad de compilación del proyecto.
- **B)** Evita errores de intercambio accidental de parámetros y clarifica la intención del código sin necesidad de consultar la definición de la función.
- **C)** Permite que la función se ejecute en un hilo secundario automáticamente.
- **D)** Es un requisito obligatorio en Kotlin si la función tiene más de dos parámetros.

---

### Pregunta 18
¿Qué ocurre si se define una función de extensión con la **misma firma exacta** (mismo nombre y mismos parámetros) que un método miembro ya existente dentro de una clase?

- **A)** El compilador siempre da prioridad al método miembro de la clase, quedando la función de extensión oculta e inaccesible.
- **B)** Se produce un error de compilación inmediato por colisión de nombres.
- **C)** La función de extensión sustituye y sobrescribe el método miembro en todo el programa.
- **D)** Se ejecuta una u otra de forma aleatoria según el orden de importación.

---

### Pregunta 19
Observa la siguiente función que recibe una operación como parámetro:

```kotlin
fun transformar(valor: Int, operacion: (Int) -> String): String {
    return operacion(valor)
}
```

¿Cuál es la forma más idiomática de invocarla aprovechando la convención de trailing lambda?

- **A)** `transformar(10, { it.toString() })`
- **B)** `transformar: 10 { it.toString() }`
- **C)** `transformar(10) { "Valor: $it" }`
- **D)** `transformar(10) -> { "Valor: $it" }`

---

### Pregunta 20
¿Cómo se define el tipo de una lambda que no recibe ningún parámetro y no devuelve ningún resultado útil?

- **A)** `(Void) -> void`
- **B)** `() -> Unit`
- **C)** `-> Unit`
- **D)** `() -> Nothing`

---

### Pregunta 21
¿Qué imprimirá por pantalla el siguiente código que invoca una expresión lambda multilínea?

```kotlin
val calcular = { a: Int, b: Int ->
    val suma = a + b
    val producto = a * b
    producto - suma
}
println(calcular(4, 5))
```

- **A)** `9`
- **B)** `20`
- **C)** `Unit`
- **D)** `11` porque en una lambda el resultado de la última expresión evaluada es automáticamente el valor devuelto.

---

## Bloque 05: POO (Herencia, Polimorfismo e Interfaces)

### Pregunta 22
Dada la siguiente jerarquía:

```kotlin
open class CuentaBancaria(val titular: String) {
    fun obtenerComision(): Double = 5.0
}

class CuentaJoven(titular: String) : CuentaBancaria(titular) {
    override fun obtenerComision(): Double = 0.0 // Línea con error
}
```

¿Por qué falla la compilación de este código?

- **A)** Porque `CuentaJoven` no puede tener constructor primario.
- **B)** Porque los métodos son `final` por defecto en Kotlin; `obtenerComision()` en `CuentaBancaria` debe declararse explícitamente como `open fun`.
- **C)** Porque las clases derivadas no pueden devolver valores numéricos menores que la clase base.
- **D)** Porque `override` solo se utiliza con interfaces, nunca con clases normales.

---

### Pregunta 23
A diferencia de Java, donde la anotación `@Override` es opcional, ¿qué regla aplica Kotlin al sobrescribir un método o propiedad de una superclase o interfaz?

- **A)** La palabra clave `override` es obligatoria; omitirla genera un error de compilación.
- **B)** La palabra clave `override` es opcional si el método tiene exactamente el mismo nombre.
- **C)** Se debe utilizar la anotación `@Override` de forma obligatoria.
- **D)** No se permite la sobrescritura a menos que la clase derivada sea una `data class`.

---

### Pregunta 24
¿Cuál de las siguientes afirmaciones sobre las clases abstractas en Kotlin es **verdadera**?

- **A)** Todos los métodos declarados dentro de una `abstract class` deben ser forzosamente abstractos.
- **B)** Una clase abstracta no puede heredar de otra clase base.
- **C)** Puede contener tanto métodos abstractos (sin cuerpo) como métodos concretos con implementación que las clases hijas heredan directamente.
- **D)** Las clases abstractas no permiten definir propiedades con `val` o `var`.

---

### Pregunta 25
Observa el siguiente ejemplo de polimorfismo con una colección:

```kotlin
interface Notificacion {
    fun enviar()
}

class NotificacionEmail : Notificacion {
    override fun enviar() = print("Email ")
}

class NotificacionPush : Notificacion {
    override fun enviar() = print("Push ")
}

fun main() {
    val cola: List<Notificacion> = listOf(NotificacionEmail(), NotificacionPush())
    cola.forEach { it.enviar() }
}
```

¿Qué imprime en consola al ejecutarse `main()`?

- **A)** `Email Email `
- **B)** `Email Push ` gracias al despacho dinámico del método según la instancia concreta de cada elemento.
- **C)** Error de compilación porque una lista no puede contener elementos de tipos de clase distintos, aunque compartan interfaz.
- **D)** Error en tiempo de ejecución.

---

### Pregunta 26
¿Puede una interfaz en Kotlin declarar propiedades?

- **A)** Sí, pueden declarar propiedades abstractas o propiedades con *getter* personalizado, pero nunca pueden almacenar estado directamente (no tienen *backing field*).
- **B)** No, las interfaces en Kotlin solo pueden contener firmas de métodos sin cuerpo.
- **C)** Sí, y pueden almacenar valores por defecto con variables `var` mutables en memoria.
- **D)** Solo si la interfaz se declara como `open interface`.

---

### Pregunta 27
¿Cómo delega un constructor secundario en el constructor primario de la misma clase en Kotlin?

- **A)** Escribiendo `super(...)` en la primera línea del cuerpo del constructor secundario.
- **B)** No es posible tener constructores secundarios si existe un constructor primario.
- **C)** Utilizando la sintaxis `: this(...)` inmediatamente después de la cabecera del constructor secundario.
- **D)** Invocando al método `init(...)` explícitamente.

---

### Pregunta 28
Si una clase hija `Gerente` sobrescribe un método `calcularSalario()` pero desea añadir un bonus al salario base calculado por la clase padre `Empleado`, ¿cómo accede al cálculo de la superclase?

- **A)** Llamando a `parent.calcularSalario()`
- **B)** Llamando a `super.calcularSalario()`
- **C)** Llamando a `base.calcularSalario()`
- **D)** No es posible acceder a la lógica del método padre una vez ha sido sobrescrito.

---

## Bloque 06: Data Class vs Class Estándar

### Pregunta 29
¿Cuál es la salida de imprimir por consola una instancia de la siguiente `data class`?

```kotlin
data class Articulo(val referencia: String, val stock: Int)

fun main() {
    val a = Articulo("ART-99", 15)
    println(a)
}
```

- **A)** `Articulo(referencia=ART-99, stock=15)`
- **B)** Una dirección de memoria similar a `Articulo@5e2de80c`.
- **C)** `[ART-99, 15]`
- **D)** Error de compilación porque la clase no implementa un método `toString()` explícito.

---

### Pregunta 30
Si se insertan dos instancias de una `data class` con los mismos valores de atributos en un `HashSet`, ¿cuántos elementos contendrá el conjunto?

```kotlin
data class Coordenada(val x: Int, val y: Int)

val conjunto = hashSetOf<Coordenada>()
conjunto.add(Coordenada(10, 20))
conjunto.add(Coordenada(10, 20))
println(conjunto.size)
```

- **A)** `2` porque son dos objetos distintos creados con `new`.
- **B)** Error en tiempo de ejecución por clave duplicada.
- **C)** `1` porque las `data class` generan automáticamente implementaciones consistentes de `equals()` y `hashCode()` basadas en sus propiedades.
- **D)** `0`

---

### Pregunta 31
¿Cuál de las siguientes afirmaciones sobre la herencia en **`data classes`** es **verdadera**?

- **A)** Una `data class` puede heredar de otra `data class`.
- **B)** Una `data class` no puede ser declarada como `open` ni `abstract`; por tanto, ninguna otra clase puede heredar de una `data class`.
- **C)** Las `data class` no pueden implementar interfaces.
- **D)** Una `data class` puede heredar únicamente de clases abstractas que no definan propiedades.

---

### Pregunta 32
Observa la siguiente declaración de `data class` con una propiedad definida fuera del constructor primario:

```kotlin
data class Paciente(val id: Int, val nombre: String) {
    var observaciones: String = ""
}

fun main() {
    val p1 = Paciente(1, "Elena")
    p1.observaciones = "Alergia al polen"
    
    val p2 = Paciente(1, "Elena")
    p2.observaciones = "Sin alergias conocidas"
    
    println(p1 == p2)
}
```

¿Qué imprimirá en consola y por qué?

- **A)** `false` porque la propiedad `observaciones` tiene valores distintos en ambos objetos.
- **B)** Error de compilación porque las `data class` prohíben tener cuerpo con llaves `{}`.
- **C)** Error en tiempo de ejecución al comparar propiedades mutables.
- **D)** `true` porque el compilador solo utiliza las propiedades declaradas en el constructor primario para generar `equals()` y `hashCode()`, ignorando las propiedades del cuerpo.

---

### Pregunta 33
¿Cuál es la principal ventaja técnica de utilizar una `data class` para modelar las entidades de datos (DTOs o modelos de API) en Android con Kotlin?

- **A)** Elimina código repetitivo (*boilerplate*) generando automáticamente `equals()`, `hashCode()`, `toString()` y `copy()` de forma coherente y libre de errores humanos.
- **B)** Permite que los datos se sincronicen automáticamente con la base de datos SQLite sin usar librerías.
- **C)** Convierte automáticamente todas las propiedades de texto a formato JSON en tiempo de compilación.
- **D)** Permite modificar los valores de variables declaradas con `val` en cualquier momento.

---

## Bloque 07: Funciones de Alcance (Scope Functions)

### Pregunta 34
¿Cuál es el uso más idiomático de la combinación `?.let` en Kotlin?

```kotlin
val archivo: File? = obtenerArchivo()
archivo?.let {
    it.readText()
}
```

- **A)** Crear una copia profunda del objeto `archivo`.
- **B)** Ejecutar un bloque de código únicamente si el objeto no es nulo, utilizando `it` como referencia segura ya no anulable dentro del bloque.
- **C)** Forzar la conversión del archivo a tipo no anulable mediante el operador `!!`.
- **D)** Capturar automáticamente las excepciones de lectura de disco.

---

### Pregunta 35
¿En qué se diferencian principalmente las funciones de alcance `apply` y `also`?

- **A)** `apply` devuelve el resultado de la lambda y `also` devuelve el objeto receptor.
- **B)** `apply` se usa exclusivamente con cadenas de texto y `also` con colecciones.
- **C)** Ambas devuelven el propio objeto receptor, pero dentro de `apply` el objeto de contexto es `this` (ideal para inicializar propiedades), mientras que en `also` es `it` (ideal para acciones secundarias como logging o validaciones).
- **D)** `apply` es una función asíncrona y `also` es síncrona.

---

### Pregunta 36
Observa el uso de la función `with`:

```kotlin
val builder = StringBuilder()
val resultado = with(builder) {
    append("Kotlin ")
    append("2.0")
    toString()
}
println(resultado)
```

¿Qué características definen a `with` según este ejemplo?

- **A)** Toma el objeto receptor como argumento explícito `with(receptor)`, expone sus miembros como `this` dentro del bloque y retorna el resultado de la última expresión (`String`).
- **B)** Toma una lista y devuelve un mapa asociativo.
- **C)** Retorna obligatoriamente el propio `StringBuilder` receptor.
- **D)** Lanza un error de compilación porque `with` es una palabra reservada en desuso.

---

### Pregunta 37
¿Cuál es el valor y tipo de la variable `saludo` al utilizar `run` como bloque de código independiente?

```kotlin
val saludo = run {
    val hora = 10
    if (hora < 12) "Buenos días" else "Buenas tardes"
}
```

- **A)** Tipo `Unit` con valor `null`.
- **B)** Tipo `String` con valor `"Buenos días"`.
- **C)** Error de compilación porque `run` requiere obligatoriamente un objeto receptor antes del punto (`objeto.run`).
- **D)** Tipo `Boolean` con valor `true`.

---

## Bloque 08: Colecciones y Concurrencia Básica

### Pregunta 38
Dada la lista `val puntuaciones = listOf(7, 8, 9, 10)`, ¿cuál de las siguientes expresiones evaluará como `true`?

- **A)** `puntuaciones.all { it < 8 }`
- **B)** `puntuaciones.none { it >= 7 }`
- **C)** `puntuaciones.any { it == 10 }`
- **D)** `puntuaciones.all { it % 2 == 0 }`

---

### Pregunta 39
¿Qué diferencia de comportamiento existe entre los métodos `first()` y `firstOrNull()` al buscar un elemento en una colección vacía o donde ningún elemento cumple el predicado?

```kotlin
val listaVacia = emptyList<String>()
val r1 = listaVacia.firstOrNull()
val r2 = listaVacia.first() // ¿Qué ocurre aquí?
```

- **A)** Ambos devuelven siempre `null`.
- **B)** `firstOrNull()` devuelve `null` de forma segura, mientras que `first()` lanza una excepción `NoSuchElementException`.
- **C)** Ambos lanzan una excepción `NullPointerException`.
- **D)** `first()` bloquea el hilo hasta que la lista reciba un elemento de forma asíncrona.

---

### Pregunta 40
En relación con las funciones de suspensión en Kotlin Coroutines, ¿cuál de las siguientes afirmaciones es **verdadera**?

- **A)** Una función declarada con el modificador `suspend` puede pausar su ejecución sin bloquear el hilo subyacente y solo puede ser invocada desde otra función `suspend` o dentro de una corrutina.
- **B)** El modificador `suspend` convierte automáticamente a la función en un hilo de ejecución independiente (`Thread`).
- **C)** Cualquier función ordinaria puede invocar directamente a una función `suspend` sin ningún contexto especial.
- **D)** Una función `suspend` no puede tener parámetros ni devolver valores de retorno.
