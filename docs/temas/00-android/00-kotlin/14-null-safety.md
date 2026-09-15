# Seguridad contra Nulos (Null Safety) en Kotlin

En 1965, Sir Tony Hoare inventó la referencia nula (`null`) para el lenguaje ALGOL W y décadas más tarde la describió como su **"error del billón de dólares"** (*The Billion Dollar Mistake*), debido a la incontable cantidad de fallos, vulnerabilidades y caídas de sistemas causadas por el temido `NullPointerException` (NPE) en lenguajes como Java.

En el desarrollo de aplicaciones Android con Java, el `NullPointerException` ha sido históricamente la causa número uno de cierre inesperado (*crash*) de apps en producción. **Kotlin nació con el objetivo explícito de eliminar el NPE del código en tiempo de compilación**.

---

## 1. Tipos No Anulables vs Tipos Anulables

En Kotlin, el sistema de tipos distingue de forma tajante entre referencias que pueden almacenar `null` y referencias que jamás pueden ser nulas:

### 1.1. Tipos No Anulables (Por defecto)
Cualquier tipo declarado de forma estándar **garantiza que siempre contiene un valor real**. Si intentas asignarle `null`, el código ni siquiera compilará:

```kotlin
var nombre: String = "Elena"
// nombre = null // ERROR de compilación: Null can not be a value of a non-null type String

println(nombre.length) // 100% SEGURO: El compilador garantiza que no habrá NPE
```

### 1.2. Tipos Anulables (`?`)
Si necesitas que una variable pueda carecer de valor (por ejemplo, al esperar una respuesta de red, consultar un campo opcional en una base de datos o leer el input de un formulario), debes indicarlo explícitamente añadiendo el sufijo `?` al tipo:

```kotlin
var apellido: String? = "García"
apellido = null // Válido: el tipo String? acepta valores de tipo String y también null
```

!!! warning "Restricción de acceso"
    Kotlin **no permite invocar métodos o propiedades directamente sobre un tipo anulable**, porque eso podría causar un NPE:
    ```kotlin
    val longitud = apellido.length // ERROR: Only safe (?.) or non-null asserted (!!.) calls are allowed
    ```

---

## 2. Operadores para el Manejo Seguro de Nulos

Para trabajar con variables anulables sin riesgo, Kotlin proporciona operadores específicos:

### 2.1. Llamada Segura (*Safe Call Operator* `?.`)
El operador `?.` comprueba si la variable es nula antes de acceder a la propiedad o método:
- Si la variable **no es nula**, ejecuta la llamada normalmente.
- Si la variable **es nula**, detiene la evaluación y devuelve `null` sin lanzar ninguna excepción.

```kotlin
val ciudad: String? = null
val longitud: Int? = ciudad?.length // longitud valdrá 'null', pero la app NO se cierra
```

Las llamadas seguras pueden encadenarse elegantemente para navegar por objetos complejos:

```kotlin
// En Java requeriría 4 comprobaciones if anidadas:
val codigoPostal = usuario?.direccion?.municipio?.codigoPostal
```

### 2.2. Operador Elvis (`?:`)
El operador Elvis (llamado así porque el símbolo `?:` recuerda al peinado de Elvis Presley) permite definir un **valor de respaldo o por defecto** en caso de que la expresión a su izquierda resulte ser `null`:

```kotlin
val apodo: String? = null

// Si apodo no es nulo, toma su longitud. Si es nulo, devuelve 0.
val longitudApodo: Int = apodo?.length ?: 0
println(longitudApodo) // Imprime 0
```

#### Elvis con Sentencias de Control (`return` o `throw`)
En Kotlin, `return` y `throw` son expresiones que devuelven el tipo `Nothing`. Esto permite usar el operador Elvis para abortar una función si un argumento requerido es nulo:

```kotlin
fun procesarPedido(idPedido: String?) {
    // Si idPedido es null, sale inmediatamente de la función
    val id = idPedido ?: return

    println("Procesando pedido número: $id")
}

fun autenticar(token: String?) {
    val tokenValido = token ?: throw IllegalArgumentException("Token de sesión obligatorio")
    println("Sesión iniciada con: $tokenValido")
}
```

### 2.3. Operador de Aserción No Nula (*Not-Null Assertion* `!!`)
El operador `!!` convierte forzosamente cualquier tipo anulable `T?` a su versión no anulable `T`. 

```kotlin
val entradaUsuario: String? = null
// val texto = entradaUsuario!!.uppercase() // ¡LANZA NullPointerException y cierra la app!
```

!!! danger "Evita el uso de !!"
    Utilizar `!!` es indicarle al compilador: *"Confía ciegamente en mí, sé con certeza absoluta que esto no es null"*. Si te equivocas, la aplicación sufrirá un crash inmediato. En proyectos profesionales y en este curso, **el uso de `!!` se considera un antipatrón o code smell**. Úsalo solo en pruebas unitarias muy controladas.

---

## 3. Comprobaciones y *Smart Casts*

Si compruebas mediante un `if` convencional que una variable inmutable no es nula, el compilador de Kotlin realiza un **Smart Cast** (conversión inteligente). Dentro del bloque condicional, la variable se trata automáticamente como de tipo no anulable:

```kotlin
val mensaje: String? = "Bienvenido a PMDM"

if (mensaje != null) {
    // ¡Smart Cast! Aquí dentro 'mensaje' se comporta como 'String', no como 'String?'
    println("Longitud: ${mensaje.length}") // No hace falta usar ?.
}
```

---

## 4. Casteo Seguro de Tipos (`as?`)

Al hacer *casting* de tipos en Java con `(String) objeto`, si el objeto es de otro tipo se lanza una excepción `ClassCastException`. En Kotlin:

- `objeto as String`: Casteo inseguro. Si falla, lanza excepción.
- `objeto as? String`: Casteo seguro. Si el tipo no coincide, devuelve `null` sin fallar.

```kotlin
val valorDesconocido: Any = 12345

val texto: String? = valorDesconocido as? String
println(texto) // Imprime null (en lugar de lanzar un error en tiempo de ejecución)
```

---

## 5. El Modismo Estrella en Android: `objeto?.let { ... }`

La combinación del operador de llamada segura `?.` con la función de ámbito `let` es la forma más idiomática y habitual en Kotlin para ejecutar un bloque de código **únicamente si el objeto no es nulo**:

```kotlin
fun enviarNotificacion(email: String?) {
    email?.let { direccion ->
        // Este bloque SOLO se ejecuta si 'email' NO es null
        println("Enviando correo a: $direccion")
        println("Longitud del correo: ${direccion.length}")
    }
}

enviarNotificacion(null) // No hace nada, no imprime nada y no falla
enviarNotificacion("alumno@dam.es") // Imprime los mensajes
```

---

## 6. Colecciones y Filtrado de Nulos

A veces las APIs externas devuelven listas que contienen elementos nulos. Kotlin ofrece utilidades específicas para sanearlas:

```kotlin
val listaConNulos: List<String?> = listOf("Kotlin", null, "Android", null, "Compose")

// Filtra automáticamente todos los nulos y devuelve List<String> (no anulable)
val listaLimpia: List<String> = listaConNulos.filterNotNull()

println(listaLimpia) // [Kotlin, Android, Compose]
```

---

## 7. Retos Prácticos

### 🟢 Reto 1: Formateo con valor de reserva (Básico)
Dada una variable `telefono: String?` que puede ser nula, escribe una expresión que asigne a `telefonoFormateado` el número telefónico si existe, o `"No proporcionado"` si es nulo.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val telefono: String? = null
        val telefonoFormateado = telefono ?: "No proporcionado"
        println("Teléfono de contacto: $telefonoFormateado")
    }
    ```

### 🟡 Reto 2: Procesamiento seguro de catálogo (Intermedio)
Dada una lista de precios en formato `String?` procedentes de un archivo externo (ej. `listOf("19.99", null, "error", "49.50")`), procesa la lista para obtener una suma total de los precios válidos (convirtiéndolos a `Double` con `toDoubleOrNull()`).

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val preciosEnTexto: List<String?> = listOf("19.99", null, "invalido", "49.50", "10.0")

        var sumaTotal = 0.0

        for (texto in preciosEnTexto) {
            val precio = texto?.toDoubleOrNull() ?: 0.0
            sumaTotal += precio
        }

        println("Total recaudado: $sumaTotal €") // Total recaudado: 79.49 €
    }
    ```

### 🔴 Reto 3: Validación de usuario con guardas Elvis (Avanzado)
Implementa una función `iniciarJuego(nombreUsuario: String?, vidasIniciales: Int?)` que verifique que el nombre tenga al menos 3 caracteres y las vidas sean mayores a 0. Si alguna condición no se cumple por ser nula o inválida, la función debe abortar inmediatamente lanzando un mensaje de error por consola mediante `?: return`.

??? tip "Ver solución"
    ```kotlin
    fun iniciarJuego(nombreUsuario: String?, vidasIniciales: Int?) {
        val usuario = nombreUsuario?.takeIf { it.length >= 3 }
            ?: run {
                println("Error: Nombre de usuario inválido o demasiado corto.")
                return
            }

        val vidas = vidasIniciales?.takeIf { it > 0 }
            ?: run {
                println("Error: Se requiere al menos 1 vida para iniciar partida.")
                return
            }

        println("¡Partida iniciada! Jugador: $usuario con $vidas vidas.")
    }

    fun main() {
        iniciarJuego(null, 3)          // Falla por nombre
        iniciarJuego("Link", 0)        // Falla por vidas
        iniciarJuego("Zelda", 5)       // ¡Partida iniciada!
    }
    ```
