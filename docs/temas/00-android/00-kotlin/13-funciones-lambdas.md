# Funciones, Lambdas y el Paradigma Declarativo en Kotlin

En Kotlin, las funciones son **ciudadanos de primera clase** (*First-Class Citizens*). Esto significa que las funciones pueden asignarse a variables, pasarse como argumentos a otras funciones, retornarse desde funciones y almacenarse en estructuras de datos, exactamente igual que cualquier otro valor como un `Int` o un `String`.

Comprender en profundidad las lambdas y las funciones de orden superior en Kotlin es **el requisito más importante para dominar Jetpack Compose** y el desarrollo moderno en Android.

---

## 1. Declaración de Funciones

La sintaxis básica emplea la palabra clave `fun`, seguida del nombre, parámetros entre paréntesis con su tipo correspondiente y el tipo de retorno:

```kotlin
fun sumar(a: Int, b: Int): Int {
    return a + b
}
```

Si una función no retorna ningún valor útil, su tipo de retorno es `Unit` (equivalente a `void` en Java, pero siendo un objeto real en Kotlin). Puede omitirse la declaración explícita de `Unit`:

```kotlin
fun registrarEvento(mensaje: String): Unit {
    println("[LOG]: $mensaje")
}

// Equivalente simplificado
fun registrarEventoSimple(mensaje: String) {
    println("[LOG]: $mensaje")
}
```

### 1.1. Inmutabilidad de los Parámetros

!!! danger "¡Atención: Diferencia fundamental con Java!"
    En Kotlin, **los parámetros de una función son siempre inmutables (`val`) por definición**. El compilador prohíbe taxativamente la reasignación de parámetros dentro del cuerpo de la función y no permite anteponer `var` en la firma:
    ```kotlin
    fun duplicar(numero: Int): Int {
        // numero = numero * 2 // ERROR de compilación: Val cannot be reassigned
        val resultado = numero * 2 // Correcto: creamos un nuevo valor local
        return resultado
    }
    ```

### 1.2. Funciones de Expresión Única (*Single-Expression Functions*)

Cuando el cuerpo de una función consiste en una única expresión o cálculo, se pueden omitir las llaves `{}` y la sentencia `return`, sustituyéndolas por el operador `=`:

```kotlin
// Versión verbosa con bloque
fun esMayorDeEdad(edad: Int): Boolean {
    return edad >= 18
}

// Versión idiomática de expresión única (el tipo Boolean se infiere)
fun esMayorDeEdad(edad: Int) = edad >= 18
fun multiplicar(x: Int, y: Int) = x * y
```

### 1.3. Parámetros con Valores por Defecto y Argumentos con Nombre

En Java es común sobrecargar métodos creando 4 o 5 variantes del mismo constructor o método con diferente número de argumentos. Kotlin soluciona esto con **valores por defecto**:

```kotlin
fun crearPerfilUsuario(
    nombre: String,
    activo: Boolean = true,
    rol: String = "ESTUDIANTE",
    intentos: Int = 0
) {
    println("Usuario: $nombre | Rol: $rol | Activo: $activo | Intentos: $intentos")
}

// Llamada con todos los parámetros
crearPerfilUsuario("Sofía", false, "ADMIN", 3)

// Llamada omitiendo los valores con valor por defecto
crearPerfilUsuario("Mateo") // Activo = true, Rol = "ESTUDIANTE", Intentos = 0

// Argumentos con nombre (Named Arguments): Mejoran la legibilidad y permiten alterar el orden
crearPerfilUsuario(
    nombre = "Elena",
    rol = "DOCENTE",
    intentos = 1
)
```

---

## 2. Tipos de Función y Funciones Lambda

Una **expresión lambda** (o función anónima) es un bloque de código ejecutable que no tiene nombre y que puede tratarse como un dato.

### 2.1. Tipos de Función (*Function Types*)

Para que una variable o parámetro acepte una función, debemos declarar su **tipo de función**, indicando los tipos de entrada entre paréntesis y el tipo de salida tras una flecha `->`:

- `() -> Unit`: Función que no recibe parámetros y no retorna nada.
- `(Int, Int) -> Int`: Función que recibe dos enteros y devuelve un entero.
- `(String) -> Boolean`: Función que recibe un texto y devuelve un booleano.

### 2.2. Sintaxis de una Lambda

Las lambdas se delimitan siempre entre llaves `{}`. Los parámetros van al principio, separados del cuerpo por una flecha `->`:

```kotlin
// Variable que almacena una lambda con tipo explícito (Int, Int) -> Int
val multiplicacion: (Int, Int) -> Int = { a, b -> a * b }

// Con inferencia de tipos en la variable y tipos explícitos en los parámetros
val division = { a: Double, b: Double -> a / b }

println(multiplicacion(4, 5)) // Imprime 20
println(division(10.0, 2.0))   // Imprime 5.0
```

### 2.3. El Parámetro Implícito `it`

Si una lambda tiene **exactamente un único parámetro**, Kotlin permite omitir su declaración explícita y la flecha `->`. El compilador genera automáticamente una variable local con el nombre reservado `it`:

```kotlin
// Sintaxis explícita
val doblar: (Int) -> Int = { numero -> numero * 2 }

// Sintaxis idiomática simplificada con 'it'
val doblarConIt: (Int) -> Int = { it * 2 }

val esPar: (Int) -> Boolean = { it % 2 == 0 }
```

---

## 3. Funciones de Orden Superior (*Higher-Order Functions*)

Una **función de orden superior** es aquella que recibe otra función como parámetro o devuelve una función como resultado.

```kotlin
fun ejecutarOperacion(a: Int, b: Int, operacion: (Int, Int) -> Int): Int {
    println("-> Ejecutando operación matemática...")
    return operacion(a, b) // Invocamos la función pasada por parámetro
}

fun main() {
    val suma = { x: Int, y: Int -> x + y }
    val resultadoSuma = ejecutarOperacion(10, 5, suma)
    println(resultadoSuma) // 15

    // También podemos pasar una lambda directamente "en línea"
    val resultadoResta = ejecutarOperacion(10, 5, { x, y -> x - y })
    println(resultadoResta) // 5
}
```

---

## 4. Lambdas: El Motor de Jetpack Compose

El diseño visual de **Jetpack Compose** descansa enteramente sobre las convenciones de sintaxis que Kotlin diseñó para las lambdas. Si entiendes estas tres reglas sintácticas, la estructura de Compose te resultará transparente:

### 4.1. Regla 1: Sintaxis de Lambda Colgante (*Trailing Lambda Syntax*)

En Kotlin, **si el último parámetro de una función es una función (lambda), la lambda puede colocarse FUERA de los paréntesis ordinarios `()`**:

```kotlin
// Llamada tradicional (la lambda está dentro de los paréntesis)
ejecutarOperacion(10, 5, { x, y -> x * y })

// Trailing Lambda: La lambda se extrae fuera de los paréntesis
ejecutarOperacion(10, 5) { x, y ->
    x * y
}
```

Si la lambda es el **único parámetro** que recibe la función, **los paréntesis `()` pueden omitirse por completo**:

```kotlin
fun ejecutarEnSegundoPlano(tarea: () -> Unit) {
    tarea()
}

// Omitimos los paréntesis () por completo:
ejecutarEnSegundoPlano {
    println("Descargando actualización en hilo de fondo...")
}
```

#### ¿Cómo se traduce esto en Jetpack Compose?

Al programar en Compose, los botones, tarjetas y pantallas no son etiquetas XML, sino llamadas a funciones de Kotlin que aprovechan esta regla:

```kotlin
// En Jetpack Compose:
// Button tiene como parámetros: onClick: () -> Unit y content: @Composable () -> Unit
Button(onClick = { registrarClic() }) {
    Text(text = "Guardar Partida")
}
```

Fíjate en lo que ocurre:

1. `onClick = { ... }` es una lambda que se pasa como argumento con nombre.

2. `{ Text(...) }` es la última lambda (`content`), por lo que **se extrae fuera de los paréntesis**.

3. El resultado es un código visualmente anidado y limpio que parece un lenguaje de marcado (como HTML/Flutter), pero es **100% código Kotlin estándar**.

---

### 4.2. Regla 2: Elevación de Estado (*State Hoisting*) mediante Callbacks Lambda

En interfaces de usuario modernas, los componentes visuales no deben almacenar ni modificar lógica de negocio directamente. Se diseñan como **componentes sin estado (*Stateless*)**, recibiendo los datos como parámetros y emitiendo eventos hacia el componente superior mediante lambdas:

```kotlin
// Componente desacoplado y reutilizable: no sabe qué hace la acción, solo la notifica
fun CampoTextoJuego(
    textoActual: String,
    alCambiarTexto: (String) -> Unit // Callback lambda
) {
    println("Mostrando input con texto: $textoActual")
    // Cuando el usuario teclea 'Elden Ring', invocamos la lambda:
    alCambiarTexto("Elden Ring")
}

fun main() {
    var tituloJuego = "Zelda"

    // La pantalla padre gestiona el estado real
    CampoTextoJuego(textoActual = tituloJuego) { nuevoTexto ->
        tituloJuego = nuevoTexto
        println("Estado actualizado a: $tituloJuego")
    }
}
```

---

### 4.3. Regla 3: Lambdas con Receptor (*Function Literals with Receiver*)

Una de las características más avanzadas de Kotlin son las lambdas que se ejecutan dentro del ámbito de un objeto receptor específico. Su tipo se define como: `Receptor.() -> TipoRetorno`.

Dentro del cuerpo de esa lambda, la palabra clave `this` apunta automáticamente a la instancia de `Receptor`, permitiendo llamar a sus métodos directamente sin prefijo:

```kotlin
class ConfiguradorCanvas {
    var ancho: Int = 0
    var alto: Int = 0
    var colorFondo: String = "Negro"

    fun renderizar() = println("Canvas $ancho x $alto - Fondo: $colorFondo")
}

// Definimos una función que acepta una lambda con receptor ConfiguradorCanvas
fun construirCanvas(bloque: ConfiguradorCanvas.() -> Unit): ConfiguradorCanvas {
    val canvas = ConfiguradorCanvas()
    canvas.bloque() // Ejecutamos la lambda en el contexto de 'canvas'
    return canvas
}

fun main() {
    // Fíjate cómo asignamos propiedades directamente dentro del bloque:
    val miCanvas = construirCanvas {
        ancho = 1920
        alto = 1080
        colorFondo = "Azul Medianoche"
    }
    miCanvas.renderizar()
}
```

En **Compose**, contenedores como `Row` o `Column` definen su contenido como:
`content: @Composable RowScope.() -> Unit`. Por esta razón, dentro de un `Row` tienes disponible el modificador `Modifier.weight(1f)`, pero fuera de él no compilará.

---

## 5. Funciones de Extensión (*Extension Functions*)

Kotlin permite añadir nuevos métodos a clases existentes (incluso de librerías del sistema como `String`, `List` o clases de Android) **sin necesidad de heredar de ellas ni modificar su código fuente**:

```kotlin
// Añadimos el método 'esEmailValido' a la clase String
fun String.esEmailValido(): Boolean {
    return this.contains("@") && this.contains(".")
}

// Añadimos 'formatearMoneda' a Double
fun Double.formatearEuros(): String {
    return "%.2f €".format(this)
}

fun main() {
    val correo = "alumno@ies.es"
    println(correo.esEmailValido()) // true

    val saldo = 49.9
    println(saldo.formatearEuros()) // 49,90 €
}
```

---

## 6. Rendimiento: Funciones `inline`

Cuando pasas una lambda a una función en la JVM, tradicionalmente se crea una instancia de un objeto anónimo en memoria (consumiendo memoria RAM en el *Heap*).

Para evitar cualquier penalización de rendimiento, Kotlin ofrece el modificador `inline`. El compilador sustituye la llamada a la función y el cuerpo de la lambda directamente en el lugar donde se invoca en el *bytecode*:

```kotlin
inline fun medirTiempo(operacion: () -> Unit) {
    val inicio = System.currentTimeMillis()
    operacion()
    val fin = System.currentTimeMillis()
    println("Tiempo transcurrido: ${fin - inicio} ms")
}
```

---

## 7. Retos Prácticos

### 🟢 Reto 1: Formateador con valores por defecto (Básico)
Crea una función `formatearCabecera` que reciba un título obligatorio y dos parámetros opcionales: `caracterBorde` (por defecto `'*'`) y `longitud` (por defecto `30`). Utiliza llamadas con argumentos con nombre para probar diferentes combinaciones.

??? tip "Ver solución"
    ```kotlin
    fun formatearCabecera(
        titulo: String,
        caracterBorde: Char = '*',
        longitud: Int = 30
    ): String {
        val borde = caracterBorde.toString().repeat(longitud)
        return "$borde\n$titulo\n$borde"
    }

    fun main() {
        println(formatearCabecera("INICIO"))
        println(formatearCabecera(titulo = "GAME OVER", caracterBorde = '=', longitud = 20))
    }
    ```

### 🟡 Reto 2: Extensión y filtrado con lambdas (Intermedio)
Crea una función de extensión sobre `List<Int>` llamada `filtrarPares` que acepte una lambda transformadora `(Int) -> String` y devuelva una lista de cadenas con los números pares procesados.

??? tip "Ver solución"
    ```kotlin
    fun List<Int>.filtrarPares(transformacion: (Int) -> String): List<String> {
        val resultado = mutableListOf<String>()
        for (numero in this) {
            if (numero % 2 == 0) {
                resultado.add(transformacion(numero))
            }
        }
        return resultado
    }

    fun main() {
        val numeros = listOf(1, 2, 3, 4, 5, 6)
        val paresFormateados = numeros.filtrarPares { "Par: $it" }
        println(paresFormateados) // [Par: 2, Par: 4, Par: 6]
    }
    ```

### 🔴 Reto 3: Mini-DSL declarativo al estilo Compose (Avanzado)
Diseña una clase `NotificacionBuilder` con propiedades `titulo`, `mensaje` e `icono`. Implementa una función de orden superior `crearNotificacion(bloque: NotificacionBuilder.() -> Unit): NotificacionBuilder` que permita crear una notificación con sintaxis declarativa limpia idéntica a Compose.

??? tip "Ver solución"
    ```kotlin
    class NotificacionBuilder {
        var titulo: String = ""
        var mensaje: String = ""
        var prioridadAlta: Boolean = false

        fun mostrar() {
            val prefijo = if (prioridadAlta) "URGENTE" else "INFO"
            println("[$prefijo] $titulo: $mensaje")
        }
    }

    fun notificacion(configuracion: NotificacionBuilder.() -> Unit): NotificacionBuilder {
        val builder = NotificacionBuilder()
        builder.configuracion() // Ejecuta la lambda con receptor
        return builder
    }

    fun main() {
        val miAviso = notificacion {
            titulo = "Descarga Finalizada"
            mensaje = "El parche 1.4 de GameVault se ha instalado."
            prioridadAlta = true
        }

        miAviso.mostrar()
    }
    ```
