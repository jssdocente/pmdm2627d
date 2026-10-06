# Bloque 2: Funciones, Lambdas y Null Safety

En este segundo bloque dominarás la sintaxis de funciones de orden superior, la manipulación segura de valores nulos y el diseño de eventos mediante lambdas. En **Jetpack Compose**, cada interacción de usuario (como un clic en un botón) se comunica a la lógica mediante lambdas (*State Hoisting*).

📁 **Paquete de trabajo:** `package b02_funciones_lambdas`  
Ubicación en tu proyecto: `src/main/kotlin/b02_funciones_lambdas/`

!!! info "📚 Apuntes Teóricos de Referencia"
    Para resolver las actividades de este bloque, puedes consultar los siguientes temas de los apuntes:

    - [Funciones y Lambdas (Enfoque Compose)](../13-funciones-lambdas.md)
    - [Null Safety (Seguridad ante Nulos)](../14-null-safety.md)
    - [Scope Functions (`takeIf`, `let`, etc.)](../31-scope-functions.md)

---

## 🌱 Fase 0: Calentamiento Guiado (Gimnasio de Sintaxis)

Esta fase contiene **15 micro-ejercicios atómicos** diseñados para que interiorices el sistema de tipos seguros ante nulos (*Null Safety*), domines el operador Elvis en cascada y mecanices las funciones idiomáticas antes de construir lógica compleja.

📁 **Archivos de trabajo para esta fase:**  

- `E00_CalentamientoNullSafety.kt` (Niveles 1 y 2)  
- `E00_CalentamientoFunciones.kt` (Nivel 3)  
Ubicados en: `src/main/kotlin/b02_funciones_lambdas/`

---

### 🔹 Nivel 1: Null Safety y Llamadas Seguras

#### Ejercicio 0.1: Tipos No Nulos vs Nulos (`String` vs `String?`)
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Tipos Nulables vs No Nulables](../14-null-safety.md#1-tipos-nulables-vs-no-nulables)

##### 1. Concepto y Código Resuelto
En Java, cualquier objeto puede ser `null`, lo que genera el infame `NullPointerException` (el "error del billón de dólares"). En Kotlin, las variables no pueden ser nulas por defecto; para permitir nulos, debe agregarse explícitamente `?` al tipo.

=== "Kotlin"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        // Tipo no nulo: el compilador garantiza que NUNCA contendrá null
        val tituloJuego: String = "Elden Ring"
        // tituloJuego = null // ❌ ERROR DE COMPILACIÓN

        // Tipo nulo: explicitly declaramos que puede no tener valor
        var subtitulo: String? = "Shadow of the Erdtree"
        println("Título: $tituloJuego | Subtítulo: $subtitulo")

        subtitulo = null // ✅ Válido porque es String?
        println("Título: $tituloJuego | Subtítulo tras borrar: $subtitulo")
    }
    ```

=== "Java"
    ```java
    public class NullSafetyJava {
        public static void main(String[] args) {
            // En Java no hay distinción a nivel de compilador entre variables seguras y nulas:
            String tituloJuego = "Elden Ring";
            String subtitulo = "Shadow of the Erdtree";

            subtitulo = null; // Válido en Java, pero puede lanzar NullPointerException en cualquier llamada posterior
            System.out.println("Subtítulo longitud: " + subtitulo.length()); // 💥 CRASH: NullPointerException
        }
    }
    ```

##### 2. Salida en Consola
```text
Título: Elden Ring | Subtítulo: Shadow of the Erdtree
Título: Elden Ring | Subtítulo tras borrar: null
```

---

#### Ejercicio 0.2: Operador de Llamada Segura (`?.`)
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Llamada Segura (?. )](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Concepto y Código Resuelto
En lugar de escribir engorrosos bloques `if (variable != null)` para proteger cada acceso a propiedad o método, Kotlin utiliza `?.`. Si la referencia es nula, no se produce error: simplemente evalúa la expresión completa a `null`.

=== "Kotlin"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val apodo: String? = null

        // Llamada segura: si 'apodo' es null, no lanza excepción; devuelve null
        val longitud: Int? = apodo?.length
        println("Longitud calculada con seguridad: $longitud")

        val apodoMayus: String? = apodo?.uppercase()
        println("Texto en mayúsculas: $apodoMayus")
    }
    ```

=== "Java"
    ```java
    public class SafeCallJava {
        public static void main(String[] args) {
            String apodo = null;

            // En Java requiere comprobaciones defensivas constantes:
            Integer longitud = null;
            if (apodo != null) {
                longitud = apodo.length();
            }
            System.out.println("Longitud calculada con seguridad: " + longitud);
        }
    }
    ```

##### 2. Salida en Consola
```text
Longitud calculada con seguridad: null
Texto en mayúsculas: null
```

---

#### Ejercicio 0.3: Encadenamiento de Llamadas Seguras
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Encadenamiento de Operadores Seguros](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Enunciado y Requisitos
Dadas tres clases sencillas anidadas:
```kotlin
class Arma(val nombre: String)
class Inventario(val armaEquipada: Arma?)
class Jugador(val inventario: Inventario?)
```

1. Instancia un jugador con inventario nulo: `val p1 = Jugador(inventario = null)`.
2. Instancia un jugador con inventario y arma: `val p2 = Jugador(Inventario(Arma("Espada Maestra")))`.
3. Obtén el nombre del arma en una sola línea encadenando llamadas seguras `p1.inventario?.armaEquipada?.nombre`.

##### 2. Salida Esperada
```text
Arma jugador 1: null
Arma jugador 2: Espada Maestra
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    class Arma(val nombre: String)
    class Inventario(val armaEquipada: Arma?)
    class Jugador(val inventario: Inventario?)

    fun main() {
        val p1 = Jugador(inventario = null)
        val p2 = Jugador(Inventario(Arma("Espada Maestra")))

        println("Arma jugador 1: ${p1.inventario?.armaEquipada?.nombre}")
        println("Arma jugador 2: ${p2.inventario?.armaEquipada?.nombre}")
    }
    ```

---

#### Ejercicio 0.4: Conversión Segura a Entero con `.toIntOrNull()`
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Conversiones Numéricas](../11-variables-tipos-datos.md)

##### 1. Enunciado y Requisitos
En Java, `Integer.parseInt("abc")` lanza una excepción no comprobada `NumberFormatException`. En Kotlin, `.toIntOrNull()` devuelve `null` elegantemente si la cadena no es numérica.

1. Prueba a convertir `"2026"` y `"gratis"` usando `.toIntOrNull()`.
2. Imprime el resultado de ambas conversiones.

##### 2. Salida Esperada
```text
Año parseado: 2026
Precio parseado: null
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val anio = "2026".toIntOrNull()
        val precio = "gratis".toIntOrNull()

        println("Año parseado: $anio")
        println("Precio parseado: $precio")
    }
    ```

---

#### Ejercicio 0.5: Casteo Seguro con `as?` (Evitando ClassCastException)
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Casteo Seguro: as?](../14-null-safety.md#4-casteo-seguro-as)

##### 1. Enunciado y Requisitos

1. Declara una variable `val datoGenerico: Any = 12345` (un entero almacenado como `Any`).
2. Intenta castearlo a `String` de forma forzada usando `as String` dentro de un comentario explicando por qué fallaría.
3. Utiliza el operador de casteo seguro **`as? String`**, que devolverá `null` en lugar de romper el programa.

##### 2. Salida Esperada
```text
Resultado de casteo seguro a String: null
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val datoGenerico: Any = 12345

        // val textoForzado: String = datoGenerico as String // ❌ CRASH: ClassCastException (Integer cannot be cast to String)
        val textoSeguro: String? = datoGenerico as? String

        println("Resultado de casteo seguro a String: $textoSeguro")
    }
    ```

---

### 🔹 Nivel 2: El Operador Elvis (`?:`) y Series Concatenadas

#### Ejercicio 0.6: El Operador Elvis Básico (Valor de Respaldo)
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Operador Elvis (?:)](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Concepto y Código Resuelto
El operador Elvis `?:` toma el valor de la izquierda si no es nulo; si la izquierda es nula, evalúa y devuelve la expresión de la derecha.

=== "Kotlin"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val bioRecibida: String? = null

        // Si bioRecibida es null, se asigna el valor de fallback:
        val biografia = bioRecibida ?: "Sin biografía disponible."
        println("Perfil: $biografia")
    }
    ```

=== "Java"
    ```java
    public class ElvisBasicoJava {
        public static void main(String[] args) {
            String bioRecibida = null;

            // En Java requiere operador ternario comprobando != null:
            String biografia = (bioRecibida != null) ? bioRecibida : "Sin biografía disponible.";
            System.out.println("Perfil: " + biografia);
        }
    }
    ```

##### 2. Salida en Consola
```text
Perfil: Sin biografía disponible.
```

---

#### Ejercicio 0.7: Serie de 2 Operadores Elvis Concatenados
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Encadenamiento de Operadores Elvis](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Enunciado y Requisitos
Un sistema de autenticación intenta identificar al usuario con la siguiente prioridad:

1. `nombrePerfil`
2. `emailRegistro`
3. Si ambos son nulos, `"Invitado"`

Declara `val nombrePerfil: String? = null` y `val emailRegistro: String? = "gamer@pmdm.es"`. Resuélvelo en una sola línea encadenando dos operadores Elvis.

##### 2. Salida Esperada
```text
Usuario autenticado: gamer@pmdm.es
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val nombrePerfil: String? = null
        val emailRegistro: String? = "gamer@pmdm.es"

        // Cascada de 2 operadores Elvis:
        val usuarioFinal: String = nombrePerfil ?: emailRegistro ?: "Invitado"

        println("Usuario autenticado: $usuarioFinal")
    }
    ```

---

#### Ejercicio 0.8: Serie de 3 Operadores Elvis Concatenados
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Encadenamiento de Operadores Elvis](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Enunciado y Requisitos
Para mostrar el identificador público en un chat multijugador, se consulta:

1. `apodoPersonalizado: String?`
2. `nickCuenta: String?`
3. `telefonoAnonimizado: String?`
4. Valor por defecto: `"Jugador Anónimo"`

Simula que las tres primeras variables son nulas y comprueba que se aplica el valor final. Luego asigna un valor a `nickCuenta` y comprueba que se detiene en el primer no nulo.

##### 2. Salida Esperada
```text
Identificador en chat: Jugador Anónimo
Identificador tras registrar cuenta: PixelHero99
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        var apodoPersonalizado: String? = null
        var nickCuenta: String? = null
        var telefonoAnonimizado: String? = null

        // Cascada de 3 operadores Elvis:
        var tagVisible = apodoPersonalizado ?: nickCuenta ?: telefonoAnonimizado ?: "Jugador Anónimo"
        println("Identificador en chat: $tagVisible")

        nickCuenta = "PixelHero99"
        tagVisible = apodoPersonalizado ?: nickCuenta ?: telefonoAnonimizado ?: "Jugador Anónimo"
        println("Identificador tras registrar cuenta: $tagVisible")
    }
    ```

---

#### Ejercicio 0.9: Serie de 4 Operadores Elvis Concatenados (Resolución de Configuración)
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Encadenamiento de Operadores Elvis](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Enunciado y Requisitos
Un cliente de base de datos determina el host del servidor comprobando en estricto orden de prioridad:

1. `hostArgumentoCLI: String?`
2. `hostVariableEntorno: String?`
3. `hostFicheroConfiguracion: String?`
4. `hostPreferenciaUsuario: String?`
5. Host local definitivo: `"127.0.0.1"`

Configura el escenario donde solo `hostFicheroConfiguracion = "db.internal.gamevault.com"` tiene valor y resuelve el host final en una sola expresión.

##### 2. Salida Esperada
```text
Host seleccionado para la conexión: db.internal.gamevault.com
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val hostArgumentoCLI: String? = null
        val hostVariableEntorno: String? = null
        val hostFicheroConfiguracion: String? = "db.internal.gamevault.com"
        val hostPreferenciaUsuario: String? = null

        // Cascada de 4 operadores Elvis concatenados:
        val hostFinal: String = hostArgumentoCLI
            ?: hostVariableEntorno
            ?: hostFicheroConfiguracion
            ?: hostPreferenciaUsuario
            ?: "127.0.0.1"

        println("Host seleccionado para la conexión: $hostFinal")
    }
    ```

---

#### Ejercicio 0.10: Elvis como Cláusula de Guarda y Excepción
📄 **Archivo:** `E00_CalentamientoNullSafety.kt`  
📚 **Teoría de referencia:** [Operador Elvis como Cláusula de Guarda](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

##### 1. Enunciado y Requisitos
A la derecha de un operador Elvis se puede colocar una expresión de tipo `Nothing`, como `return` (para salir de una función) o `error(...)` (para lanzar `IllegalStateException`).

1. Crea una función `procesarToken(token: String?)`.
2. Utiliza el operador Elvis para guardar en `val tokenValido` el token recibido, o ejecuta `return` anticipado con un mensaje de aviso si es nulo.
3. Comprueba el comportamiento invocándola con `null` y con `"TOKEN_XYZ"`.

##### 2. Salida Esperada
```text
[ERROR]: Token nulo. Proceso abortado.
[OK]: Procesando token válido: TOKEN_XYZ
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun procesarToken(token: String?) {
        // Cláusula de guarda con Elvis y bloque run con return:
        val tokenValido = token ?: run {
            println("[ERROR]: Token nulo. Proceso abortado.")
            return
        }

        println("[OK]: Procesando token válido: $tokenValido")
    }

    fun main() {
        procesarToken(null)
        procesarToken("TOKEN_XYZ")
    }
    ```

---

### 🔹 Nivel 3: Funciones Idiomáticas y Lambdas

#### Ejercicio 0.11: Parámetros con Valores por Defecto
📄 **Archivo:** `E00_CalentamientoFunciones.kt`  
📚 **Teoría de referencia:** [Valores por Defecto](../13-funciones-lambdas.md#13-parametros-con-valores-por-defecto-y-argumentos-con-nombre)

##### 1. Concepto y Código Resuelto
En Java, ofrecer variantes de un método requiere escribir múltiples sobrecargas (*overloads*) que se llaman entre sí (*telescoping methods*). En Kotlin, basta asignar valores por defecto en la cabecera.

=== "Kotlin"
    ```kotlin
    package b02_funciones_lambdas

    // Una sola función cubre todos los casos posibles de invocación:
    fun conectarServidor(host: String = "localhost", puerto: Int = 8080, ssl: Boolean = false) {
        val protocolo = if (ssl) "https" else "http"
        println("Conectando a: $protocolo://$host:$puerto")
    }

    fun main() {
        conectarServidor()                                  // Usa todos los valores por defecto
        conectarServidor("api.gamevault.es")                // Personaliza solo el host
        conectarServidor("api.gamevault.es", 443, true)    // Personaliza todos los parámetros
    }
    ```

=== "Java (Sobrecarga de Métodos)"
    ```java
    public class DefaultParamsJava {
        // En Java se requieren 3 métodos sobrecargados:
        public static void conectarServidor() {
            conectarServidor("localhost", 8080, false);
        }

        public static void conectarServidor(String host) {
            conectarServidor(host, 8080, false);
        }

        public static void conectarServidor(String host, int puerto, boolean ssl) {
            String protocolo = ssl ? "https" : "http";
            System.out.println("Conectando a: " + protocolo + "://" + host + ":" + puerto);
        }

        public static void main(String[] args) {
            conectarServidor();
            conectarServidor("api.gamevault.es");
            conectarServidor("api.gamevault.es", 443, true);
        }
    }
    ```

##### 2. Salida en Consola
```text
Conectando a: http://localhost:8080
Conectando a: http://api.gamevault.es:8080
Conectando a: https://api.gamevault.es:443
```

---

#### Ejercicio 0.12: Argumentos con Nombre (*Named Arguments*)
📄 **Archivo:** `E00_CalentamientoFunciones.kt`  
📚 **Teoría de referencia:** [Argumentos con Nombre](../13-funciones-lambdas.md#13-parametros-con-valores-por-defecto-y-argumentos-con-nombre)

##### 1. Concepto y Código Resuelto
En llamadas a métodos con múltiples booleanos o enteros (ej. `crearVentana(true, false, false, true)`), Java resulta ilegible sin mirar la documentación. En Kotlin, se puede indicar el nombre del argumento y alterar el orden a conveniencia.

=== "Kotlin"
    ```kotlin
    package b02_funciones_lambdas

    fun configurarBoton(texto: String, visible: Boolean = true, habilitado: Boolean = true, color: String = "Azul") {
        println("Botón '$texto' -> Visible: $visible, Habilitado: $habilitado, Color: $color")
    }

    fun main() {
        // Invocación alterando el orden y usando nombres de argumento explícitos (estilo Jetpack Compose):
        configurarBoton(
            color = "Rojo",
            texto = "Eliminar Partida",
            habilitado = false
        )
    }
    ```

=== "Java"
    ```java
    public class NamedArgsJava {
        // En Java no existen los argumentos con nombre; el orden posicional es estricto y ciego:
        public static void main(String[] args) {
            // El lector no sabe qué significa cada boolean sin consultar el método:
            configurarBoton("Eliminar Partida", true, false, "Rojo");
        }

        public static void configurarBoton(String texto, boolean visible, boolean habilitado, String color) {
            System.out.println("Botón '" + texto + "' -> Visible: " + visible + ", Habilitado: " + habilitado + ", Color: " + color);
        }
    }
    ```

##### 2. Salida en Consola
```text
Botón 'Eliminar Partida' -> Visible: true, Habilitado: false, Color: Rojo
```

---

#### Ejercicio 0.13: Funciones de Expresión Única (`=`)
📄 **Archivo:** `E00_CalentamientoFunciones.kt`  
📚 **Teoría de referencia:** [Funciones de Expresión Única](../13-funciones-lambdas.md#12-funciones-de-expresion-unica-single-expression-functions)

##### 1. Enunciado y Requisitos

1. Declara en una sola línea con `=` una función `esMayorDeEdad(edad: Int): Boolean`.
2. Declara en una sola línea una función `calcularPrecioConIva(precioBase: Double): Double` (aplicando el 21%).
3. Comprueba ambas funciones desde `main()`.

##### 2. Salida Esperada
```text
¿Edad 20 es mayor de edad?: true
Precio con IVA de 50.0€: 60.5€
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun esMayorDeEdad(edad: Int): Boolean = edad >= 18

    fun calcularPrecioConIva(precioBase: Double): Double = precioBase * 1.21

    fun main() {
        println("¿Edad 20 es mayor de edad?: ${esMayorDeEdad(20)}")
        println("Precio con IVA de 50.0€: ${calcularPrecioConIva(50.0)}€")
    }
    ```

---

#### Ejercicio 0.14: El Modismo `objeto?.let { }`
📄 **Archivo:** `E00_CalentamientoFunciones.kt`  
📚 **Teoría de referencia:** [El Modismo objeto?.let](../14-null-safety.md#5-el-modismo-estrella-en-android-objetolet)

##### 1. Enunciado y Requisitos

1. Declara una variable `val correoUsuario: String? = "alumno@ies.es"`.
2. Utiliza `correoUsuario?.let { ... }` para ejecutar una simulación de envío de correo únicamente cuando no sea nulo.
3. Dentro del bloque, el valor seguro se referencia con el parámetro implícito `it`.
4. Asigna `null` a la variable y verifica que el bloque no se ejecuta.

##### 2. Salida Esperada
```text
Enviando código de verificación a: alumno@ies.es
(Con correo nulo no se imprime nada)
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        var correoUsuario: String? = "alumno@ies.es"

        correoUsuario?.let {
            println("Enviando código de verificación a: $it")
        }

        correoUsuario = null
        correoUsuario?.let {
            println("Esto nunca se imprimirá porque es nulo: $it")
        }
    }
    ```

---

#### Ejercicio 0.15: *Trailing Lambda* y el Parámetro Implícito `it`
📄 **Archivo:** `E00_CalentamientoFunciones.kt`  
📚 **Teoría de referencia:** [Sintaxis de Trailing Lambda](../13-funciones-lambdas.md#23-sintaxis-de-lambda-colgante-trailing-lambda-syntax)

##### 1. Enunciado y Requisitos
En Kotlin, si el último parámetro de una función es una lambda, las llaves `{ }` se pueden colocar **fuera de los paréntesis** `()`. Si además la lambda tiene un único parámetro, este se nombra automáticamente como `it`.

1. Define una función `repetirAccion(veces: Int, accion: (Int) -> Unit)`.
2. Invócala utilizando la sintaxis de *trailing lambda* imprimiendo `Paso actual: $it`.

##### 2. Salida Esperada
```text
Paso actual: 1
Paso actual: 2
Paso actual: 3
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun repetirAccion(veces: Int, accion: (Int) -> Unit) {
        for (i in 1..veces) {
            accion(i) // Invocación de la lambda recibida
        }
    }

    fun main() {
        // Sintaxis de Trailing Lambda: las llaves van fuera de los paréntesis
        repetirAccion(3) {
            println("Paso actual: $it")
        }
    }
    ```

---

## 🟢 Nivel Básico (Funciones, Parámetros y Lambdas Simples)

### Ejercicio 2.1: Funciones de Expresión Única y Argumentos con Nombre
📄 **Archivo:** `E01_FuncionesExpresionUnica.kt`  
📚 **Teoría de referencia:** [Funciones de Expresión Única](../13-funciones-lambdas.md#12-funciones-de-expresion-unica-single-expression-functions)

#### 1. Enunciado y Requisitos

1. Define en una sola línea (`=`) una función `calcularDanoTotal(ataqueBase: Int, critico: Boolean, bonusArma: Int = 0): Int`:

    - Si `critico` es `true`, el ataque base se duplica antes de sumar el bonus.

2. Invoca a la función en `main()` utilizando **argumentos con nombre (*Named Arguments*)** alterando deliberadamente el orden de los parámetros para comprobar su legibilidad.

#### 2. Salida Esperada en Consola

```text
Daño normal: 45
Daño crítico con arma legendaria: 110
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    // Función concisa de expresión única sin llaves {} ni palabra clave return:
    fun calcularDanoTotal(ataqueBase: Int, critico: Boolean, bonusArma: Int = 0): Int =
        (if (critico) ataqueBase * 2 else ataqueBase) + bonusArma

    fun main() {
        val golpe1 = calcularDanoTotal(ataqueBase = 45, critico = false)
        val golpe2 = calcularDanoTotal(bonusArma = 30, critico = true, ataqueBase = 40)

        println("Daño normal: $golpe1")
        println("Daño crítico con arma legendaria: $golpe2")
    }
    ```

---

### Ejercicio 2.2: Parámetros por Defecto al Estilo Compose
📄 **Archivo:** `E02_ParametrosDefectoModifiers.kt`  
📚 **Teoría de referencia:** [Parámetros con Valores por Defecto y Argumentos con Nombre](../13-funciones-lambdas.md#13-parametros-con-valores-por-defecto-y-argumentos-con-nombre)

#### 1. Enunciado y Requisitos

1. Implementa una función `renderizarBoton(texto: String, colorHex: String = "#6200EE", habilitado: Boolean = true, paddingDp: Int = 16)` que imprima una representación textual del botón.

2. Realiza 3 llamadas distintas:

    - Una pasando únicamente el texto obligatorio.

    - Otra cambiando solo el color.

    - Otra deshabilitando el botón y cambiando el padding mediante argumentos con nombre.

#### 2. Salida Esperada en Consola

```text
Boton [Texto: 'Comenzar', Color: #6200EE, Habilitado: true, Padding: 16dp]
Boton [Texto: 'Eliminar', Color: #B00020, Habilitado: true, Padding: 16dp]
Boton [Texto: 'Guardar', Color: #6200EE, Habilitado: false, Padding: 32dp]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun renderizarBoton(
        texto: String,
        colorHex: String = "#6200EE",
        habilitado: Boolean = true,
        paddingDp: Int = 16
    ) {
        println("Boton [Texto: '$texto', Color: $colorHex, Habilitado: $habilitado, Padding: ${paddingDp}dp]")
    }

    fun main() {
        // En Compose, casi todos los composables tienen parámetros por defecto como Modifier = Modifier
        renderizarBoton("Comenzar")
        renderizarBoton("Eliminar", colorHex = "#B00020")
        renderizarBoton("Guardar", habilitado = false, paddingDp = 32)
    }
    ```

---

### Ejercicio 2.3: Número Variable de Argumentos (`vararg`)
📄 **Archivo:** `E03_Varargs.kt`  
📚 **Teoría de referencia:** [Número Variable de Argumentos (vararg) y Operador Spread](../13-funciones-lambdas.md#14-numero-variable-de-argumentos-vararg-y-el-operador-spread)

#### 1. Enunciado y Requisitos

1. Crea una función `calcularPuntuacionTotal(nombreJugador: String, vararg bonificaciones: Int): Int`.

2. La función debe sumar todas las bonificaciones recibidas e imprimir el resumen.

3. En `main()`, invócala pasando una lista de enteros sueltos.

4. Luego, pasa un array de enteros utilizando el **operador spread (`*`)** para descomprimirlo.

#### 2. Salida Esperada en Consola

```text
Jugador Mario: 350 pts extra
Jugador Luigi: 600 pts extra (usando spread operator)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun calcularPuntuacionTotal(nombreJugador: String, vararg bonificaciones: Int): Int {
        val total = bonificaciones.sum()
        println("Jugador $nombreJugador: $total pts extra")
        return total
    }

    fun main() {
        calcularPuntuacionTotal("Mario", 100, 50, 200)

        val extrasLuigi = intArrayOf(200, 200, 200)
        // El operador asterisco (*) desempaqueta el array en argumentos independientes:
        calcularPuntuacionTotal("Luigi", *extrasLuigi)
    }
    ```

---

### Ejercicio 2.4: Deconstrucción de Funciones y Tipos de Función
📄 **Archivo:** `E04_TiposDeFuncion.kt`  
📚 **Teoría de referencia:** [De la Función Tradicional a la Lambda: El Camino Paso a Paso](../13-funciones-lambdas.md#2-de-la-funcion-tradicional-a-la-lambda-el-camino-paso-a-paso)

#### 1. Enunciado y Requisitos

En Kotlin, una función es un ciudadano de primera clase: puede almacenarse en variables, pasarse como argumento y devolverse como resultado. Para dominar las lambdas, es esencial interiorizar la escalera de simplificación sintáctica:

1. **Deconstrucción de una operación en 4 pasos:**

    - **Paso 1:** Define una función tradicional con nombre `fun calcularDescuento(precio: Double): Double` que aplique un 10% de descuento (`precio * 0.90`).

    - **Paso 2:** Transfórmala en una **función anónima** asignada a una variable `val descuentoAnonimo = fun(precio: Double): Double = ...`.

    - **Paso 3:** Conviértela en una **expresión lambda explícita** `val descuentoLambda: (Double) -> Double = { precio: Double -> precio * 0.90 }`.

    - **Paso 4:** Sintetízala a la **forma idiomática con `it`** `val descuentoIdiomatico: (Double) -> Double = { it * 0.90 }`.

2. **Tipo de función de múltiples parámetros:**

    - Declara una variable `val formatearPrecio: (Double, String) -> String` especificando su tipo formal a la izquierda y el cuerpo lambda a la derecha `{ importe, moneda -> "$importe $moneda" }`.

3. En `main()`, ejecuta cada variante con un precio base de `100.0` y comprueba que todas producen exactamente el mismo resultado (`90.0`).

#### 2. Salida Esperada en Consola

```text
=== DECONSTRUCCIÓN DE FUNCIONES (Precio base: 100.0 €) ===
1. Función tradicional: 90.0 €
2. Función anónima en variable: 90.0 €
3. Lambda con tipos explícitos: 90.0 €
4. Lambda idiomática con it: 90.0 €
Precio con divisa formateado: 90.0 EUR
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    // Paso 1: Función tradicional con nombre
    fun calcularDescuento(precio: Double): Double {
        return precio * 0.90
    }

    fun main() {
        val precioBase = 100.0

        // Paso 2: Función anónima almacenada en variable
        val descuentoAnonimo = fun(precio: Double): Double {
            return precio * 0.90
        }

        // Paso 3: Expresión lambda con tipos declarados
        val descuentoLambda: (Double) -> Double = { precio: Double -> precio * 0.90 }

        // Paso 4: Expresión lambda idiomática con 'it' (un solo parámetro)
        val descuentoIdiomatico: (Double) -> Double = { it * 0.90 }

        // Tipo de función con 2 parámetros: (Double, String) -> String
        val formatearPrecio: (Double, String) -> String = { importe, moneda -> "$importe $moneda" }

        println("=== DECONSTRUCCIÓN DE FUNCIONES (Precio base: $precioBase €) ===")
        println("1. Función tradicional: ${calcularDescuento(precioBase)} €")
        println("2. Función anónima en variable: ${descuentoAnonimo(precioBase)} €")
        println("3. Lambda con tipos explícitos: ${descuentoLambda(precioBase)} €")
        println("4. Lambda idiomática con it: ${descuentoIdiomatico(precioBase)} €")

        val precioFinal = descuentoIdiomatico(precioBase)
        println("Precio con divisa formateado: ${formatearPrecio(precioFinal, "EUR")}")
    }
    ```

---

### Ejercicio 2.5: Validaciones Idiomáticas con `takeIf` y `takeUnless`
📄 **Archivo:** `E05_TakeIfTakeUnless.kt`  
📚 **Teoría de referencia:** [Operadores para el Manejo Seguro de Nulos](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos) y [Scope Functions](../31-scope-functions.md#1-tabla-maestra-de-seleccion-rapida)

#### 1. Enunciado y Requisitos

Las funciones `takeIf` y `takeUnless` devuelven el objeto receptor si se cumple el predicado lambda, o `null` si no se cumple. Son ideales para validar entradas de texto en formularios de usuario.

1. Declara un texto de entrada de usuario `val nombreInput = "  Link  "`.

2. Utiliza `.trim().takeIf { it.isNotBlank() }` para obtener el texto limpio o `null` si estuviera en blanco.

3. Declara una edad `val edadUsuario = 15`.

4. Utiliza `edadUsuario.takeUnless { it < 18 }` para comprobar si el usuario no es menor de edad.

5. Combina con el operador Elvis `?:` para emitir mensajes por defecto en caso de fallo de validación.

#### 2. Salida Esperada en Consola

```text
Nombre validado: Link
Nombre vacío validado: [Entrada inválida]
Edad para juego pegi 18: No cumple el requisito de edad
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val nombreInput = "  Link  "
        val nombreValidado = nombreInput.trim().takeIf { it.isNotBlank() }
        println("Nombre validado: $nombreValidado")

        val entradaVacia = "   "
        val vaciaValidada = entradaVacia.trim().takeIf { it.isNotBlank() } ?: "[Entrada inválida]"
        println("Nombre vacío validado: $vaciaValidada")

        val edadUsuario = 15
        val edadAprobada = edadUsuario.takeUnless { it < 18 }
        println("Edad para juego pegi 18: ${edadAprobada?.let { "Apto" } ?: "No cumple el requisito de edad"}")
    }
    ```

---

### Ejercicio 2.6: Funciones de Orden Superior Propias y Callbacks
📄 **Archivo:** `E06_FuncionOrdenSuperiorPropia.kt`  
📚 **Teoría de referencia:** [Funciones de Orden Superior](../13-funciones-lambdas.md#3-funciones-de-orden-superior-higher-order-functions)

#### 1. Enunciado y Requisitos

Una función de orden superior es aquella que recibe otra función como parámetro o devuelve una función. Este patrón es la base de las operaciones en Android (como reintentar peticiones a un servidor o responder a eventos de interfaz).

1. Crea una función `ejecutarConReintentos(maxIntentos: Int, operacion: (intentoActual: Int) -> Boolean): Boolean`.

2. La función debe ejecutar en un bucle la lambda `operacion` pasándole el número de intento actual (`1..maxIntentos`).

3. Si la lambda devuelve `true`, imprime un mensaje de éxito y devuelve `true` inmediatamente.

4. Si agota todos los intentos sin éxito, imprime un mensaje de error y devuelve `false`.

5. En `main()`, simula una conexión de red que falla en los intentos 1 y 2 pero tiene éxito en el intento 3.

#### 2. Salida Esperada en Consola

```text
Iniciando operación con máximo 3 intentos...
[Intento 1/3]: Fallo de conexión de red. Reintentando...
[Intento 2/3]: Fallo de conexión de red. Reintentando...
[Intento 3/3]: ¡Conexión establecida con éxito!
Resultado final: Operación completada con éxito.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun ejecutarConReintentos(
        maxIntentos: Int,
        operacion: (intentoActual: Int) -> Boolean
    ): Boolean {
        for (intento in 1..maxIntentos) {
            val exito = operacion(intento)
            if (exito) {
                return true
            }
        }
        println("[ERROR]: Se han agotado los $maxIntentos intentos permitidos.")
        return false
    }

    fun main() {
        println("Iniciando operación con máximo 3 intentos...")

        val resultado = ejecutarConReintentos(maxIntentos = 3) { intento ->
            if (intento < 3) {
                println("[Intento $intento/3]: Fallo de conexión de red. Reintentando...")
                false
            } else {
                println("[Intento $intento/3]: ¡Conexión establecida con éxito!")
                true
            }
        }

        if (resultado) {
            println("Resultado final: Operación completada con éxito.")
        } else {
            println("Resultado final: No se pudo conectar al servidor.")
        }
    }
    ```

---

## 🟡 Nivel Intermedio (State Hoisting, Null Safety y Extensiones)

### Ejercicio 2.7: El Parámetro Implícito `it`
📄 **Archivo:** `E07_ParametroImplicitoIt.kt`  
📚 **Teoría de referencia:** [El Parámetro Implícito it](../13-funciones-lambdas.md#23-el-parametro-implicito-it)

#### 1. Enunciado y Requisitos

Cuando una expresión lambda tiene **exactamente un parámetro**, Kotlin permite omitir su declaración explícita y su flecha `->`. El compilador genera automáticamente una variable implícita llamada **`it`**.

1. Declara una función `transformarTexto(entrada: String, transformador: (String) -> String): String`.

2. La función debe devolver el resultado de aplicar la lambda `transformador` sobre la cadena `entrada`.

3. En `main()`, invoca a `transformarTexto` dos veces utilizando la sintaxis concisa de `it`:

    - Una para convertir el texto a mayúsculas: `{ it.uppercase() }`.

    - Otra para rodear el texto con corchetes de diseño: `{ "[[ $it ]]" }`.

#### 2. Salida Esperada en Consola

```text
Texto original: 'gamevault'
Transformación a mayúsculas: 'GAMEVAULT'
Transformación con marco: '[[ gamevault ]]'
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun transformarTexto(entrada: String, transformador: (String) -> String): String {
        return transformador(entrada)
    }

    fun main() {
        val original = "gamevault"
        println("Texto original: '$original'")

        // 'it' hace referencia al único parámetro que recibe la lambda:
        val mayusculas = transformarTexto(original) { it.uppercase() }
        val enmarcado = transformarTexto(original) { "[[ $it ]]" }

        println("Transformación a mayúsculas: '$mayusculas'")
        println("Transformación con marco: '$enmarcado'")
    }
    ```

---

### Ejercicio 2.8: Invocación Progresiva de Lambdas (Convencional, *Trailing Lambda* y `::`)
📄 **Archivo:** `E08_InvocacionLambdasTrailing.kt`  
📚 **Teoría de referencia:** [Cómo Invocar una Función de Orden Superior: La Evolución Gradual](../13-funciones-lambdas.md#32-como-invocarla-de-la-llamada-convencional-a-la-trailing-lambda)

#### 1. Enunciado y Requisitos

En Kotlin, la llamada a funciones de orden superior cuenta con reglas sintácticas diseñadas para que el código sea limpio y fluido. Practica las cuatro formas posibles de invocar funciones que reciben lambdas:

1. **Diseño de funciones de soporte:**

    - Define una función `procesarPerfil(nombre: String, transformador: (String) -> String): String` que aplique `transformador` sobre `nombre`.

    - Define una función `ejecutarAuditoria(accion: () -> Unit)` que reciba **únicamente una lambda**, imprima un encabezado `"[AUDITORÍA]: Iniciando chequeo..."`, invoque la lambda y finalice con `"[AUDITORÍA]: Finalizado."`.

    - Define una función nombrada tradicional `fun limpiarEspaciosYMayusculas(texto: String): String = texto.trim().uppercase()`.

2. **Invocación en 4 variantes desde `main()`:**

    - **Paso A (Llamada convencional):** Invoca a `procesarPerfil` pasando la lambda dentro de los paréntesis ordinarios `procesarPerfil("  neo_matrix  ", { it.trim() })`.

    - **Paso B (*Trailing Lambda*):** Invoca a `procesarPerfil` extrayendo la última lambda fuera de los paréntesis `procesarPerfil("  neo_matrix  ") { "[TAG]: ${it.trim()}" }`.

    - **Paso C (Parámetro único sin paréntesis):** Invoca a `ejecutarAuditoria` omitiendo completamente los paréntesis `()`.

    - **Paso D (Referencia a función existente `::`):** Invoca a `procesarPerfil` reutilizando la función `limpiarEspaciosYMayusculas` mediante el operador `::` sin declarar una nueva lambda.

#### 2. Salida Esperada en Consola

```text
=== EVOLUCIÓN DE LLAMADAS CON LAMBDAS ===
Paso A (Convencional con paréntesis): 'neo_matrix'
Paso B (Trailing Lambda fuera de paréntesis): '[TAG]: neo_matrix'

[AUDITORÍA]: Iniciando chequeo...
Paso C: Base de datos verificada sin errores.
[AUDITORÍA]: Finalizado.

Paso D (Referencia directa ::): 'NEO_MATRIX'
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    // Función de orden superior con parámetro ordinario + lambda al final:
    fun procesarPerfil(nombre: String, transformador: (String) -> String): String {
        return transformador(nombre)
    }

    // Función de orden superior donde la lambda es el ÚNICO parámetro:
    fun ejecutarAuditoria(accion: () -> Unit) {
        println("[AUDITORÍA]: Iniciando chequeo...")
        accion()
        println("[AUDITORÍA]: Finalizado.")
    }

    // Función nombrada reutilizable:
    fun limpiarEspaciosYMayusculas(texto: String): String = texto.trim().uppercase()

    fun main() {
        println("=== EVOLUCIÓN DE LLAMADAS CON LAMBDAS ===")

        // Paso A: Lambda como argumento ordinario dentro de los paréntesis ()
        val r1 = procesarPerfil("  neo_matrix  ", { it.trim() })
        println("Paso A (Convencional con paréntesis): '$r1'")

        // Paso B: Trailing Lambda -> la última lambda se extrae FUERA de ()
        val r2 = procesarPerfil("  neo_matrix  ") { "[TAG]: ${it.trim()}" }
        println("Paso B (Trailing Lambda fuera de paréntesis): '$r2'")

        println()

        // Paso C: Si la lambda es el único parámetro, se OMITEN los paréntesis ()
        ejecutarAuditoria {
            println("Paso C: Base de datos verificada sin errores.")
        }

        println()

        // Paso D: Referencia a función existente con :: (sin abrir llaves {})
        val r3 = procesarPerfil("  neo_matrix  ", ::limpiarEspaciosYMayusculas)
        println("Paso D (Referencia directa ::): '$r3'")
    }
    ```

---

### Ejercicio 2.9: Safe Call (`?.`), Elvis (`?:`) y Cláusulas de Guarda
📄 **Archivo:** `E09_NullSafetyBasico.kt`  
📚 **Teoría de referencia:** [Llamada Segura (?. ) y Operador Elvis (?:)](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

#### 1. Enunciado y Requisitos

1. Modela una variable `val nickname: String? = null`.

2. Muestra la longitud del apodo de forma segura usando el operador de llamada segura **`?.`**.

3. Proporciona un valor por defecto usando el operador Elvis **`?:`** para que muestre `"Anónimo"` si es nulo.

4. Utiliza el operador Elvis como **cláusula de guarda** para terminar la ejecución de una función si un parámetro obligatorio es nulo (`val id = idRecibido ?: return`).

#### 2. Salida Esperada en Consola

```text
Longitud de nickname nulo: null
Nombre visible en perfil: Anónimo
[ERROR]: ID de usuario no proporcionado. Cancelando sincronización.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun sincronizarUsuario(id: String?) {
        // Cláusula de guarda con Elvis y return anticipado
        val idValido = id ?: run {
            println("[ERROR]: ID de usuario no proporcionado. Cancelando sincronización.")
            return
        }
        println("Sincronizando datos del usuario $idValido...")
    }

    fun main() {
        val nickname: String? = null

        println("Longitud de nickname nulo: ${nickname?.length}")
        println("Nombre visible en perfil: ${nickname ?: "Anónimo"}")

        sincronizarUsuario(null)
    }
    ```

---

### Ejercicio 2.10: El Modismo Idiomático `objeto?.let { ... }`
📄 **Archivo:** `E10_ObjetoLet.kt`  
📚 **Teoría de referencia:** [El Modismo Estrella en Android: objeto?.let](../14-null-safety.md#5-el-modismo-estrella-en-android-objetolet)

#### 1. Enunciado y Requisitos

1. Crea una función `enviarNotificacionPush(mensaje: String?)`.

2. En lugar de comprobar `if (mensaje != null)`, utiliza el modismo estándar de Kotlin **`mensaje?.let { ... }`** para ejecutar el envío únicamente cuando haya un mensaje válido.

3. Comprueba el comportamiento invocando la función con un mensaje válido y con `null`.

#### 2. Salida Esperada en Consola

```text
Llamada 1:
[PUSH ENVIADO]: Tu partida ha sido guardada en la nube.
Llamada 2:
(No se envía nada porque el mensaje era nulo)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun enviarNotificacionPush(mensaje: String?) {
        // Solo entra al bloque si no es nulo y hace Smart Cast de 'it' a String no nula
        mensaje?.let { textoNoNulo ->
            println("[PUSH ENVIADO]: $textoNoNulo")
        }
    }

    fun main() {
        println("Llamada 1:")
        enviarNotificacionPush("Tu partida ha sido guardada en la nube.")

        println("Llamada 2:")
        enviarNotificacionPush(null)
        println("(No se envía nada porque el mensaje era nulo)")
    }
    ```

---

### Ejercicio 2.11: Fábricas de Lambdas y Clausuras (*Closures*) Mutables
📄 **Archivo:** `E11_FabricaDeFunciones.kt`  
📚 **Teoría de referencia:** [Clausuras (Closures): Captura y Modificación de Variables](../13-funciones-lambdas.md#33-clausuras-closures-captura-y-modificacion-de-variables-del-entorno)

#### 1. Enunciado y Requisitos

En Kotlin, una lambda forma un **Closure (clausura)** con su entorno léxico: recuerda y puede utilizar las variables declaradas fuera de su cuerpo. A diferencia de Java (donde las variables capturadas deben ser forzosamente `final`), **Kotlin permite mutar variables locales `var` externas directamente**.

1. **Parte A — Fábrica de Funciones (Captura Inmutable):**

    - Diseña una función `crearMultiplicadorDificultad(multiplicador: Double): (Int) -> Int`.

    - Debe devolver una lambda que reciba el daño base de un enemigo y devuelva el daño escalado al multiplicador.

    - En `main()`, genera tres instancias: `modoFacil` (`0.75`), `modoNormal` (`1.0`) y `modoPesadilla` (`2.5`).

2. **Parte B — Clausura Mutable y Acumulador de Estado:**

    - En `main()`, declara dos variables locales mutables: `var totalDanoRecibido = 0` y `var contadorAtaques = 0`.

    - Diseña una lambda `val registrarImpacto: (Int) -> Unit = { ... }` que capture y **mute directamente** ambas variables externas, incrementando el contador y sumando el daño al total acumulado.

    - Simula 3 ataques consecutivos de `50`, `120` y `80` puntos llamando a `registrarImpacto` y verifica cómo el estado exterior se actualiza de forma reactiva.

#### 2. Salida Esperada en Consola

```text
=== PARTE A: FÁBRICA DE FUNCIONES Y ESCALADO ===
Daño base del jefe: 100
- Modo Fácil (0.75x): 75 pts
- Modo Normal (1.0x): 100 pts
- Modo Pesadilla (2.5x): 250 pts

=== PARTE B: CLOSURE MUTABLE (ACUMULADOR) ===
[Impacto #1]: +50 pts | Daño acumulado: 50
[Impacto #2]: +120 pts | Daño acumulado: 170
[Impacto #3]: +80 pts | Daño acumulado: 250
Total final en ámbito exterior: 250 pts recibidos en 3 impactos.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    // Parte A: Fábrica de funciones -> Devuelve una lambda que encapsula 'multiplicador'
    fun crearMultiplicadorDificultad(multiplicador: Double): (Int) -> Int {
        return { danoBase -> (danoBase * multiplicador).toInt() }
    }

    fun main() {
        println("=== PARTE A: FÁBRICA DE FUNCIONES Y ESCALADO ===")
        val modoFacil = crearMultiplicadorDificultad(0.75)
        val modoNormal = crearMultiplicadorDificultad(1.0)
        val modoPesadilla = crearMultiplicadorDificultad(2.5)

        val danoJefe = 100
        println("Daño base del jefe: $danoJefe")
        println("- Modo Fácil (0.75x): ${modoFacil(danoJefe)} pts")
        println("- Modo Normal (1.0x): ${modoNormal(danoJefe)} pts")
        println("- Modo Pesadilla (2.5x): ${modoPesadilla(danoJefe)} pts")

        println("\n=== PARTE B: CLOSURE MUTABLE (ACUMULADOR) ===")
        // Variables locales del ámbito exterior:
        var totalDanoRecibido = 0
        var contadorAtaques = 0

        // La lambda captura y MODIFICA directamente las variables externas:
        val registrarImpacto: (Int) -> Unit = { dano ->
            contadorAtaques++
            totalDanoRecibido += dano
            println("[Impacto #$contadorAtaques]: +$dano pts | Daño acumulado: $totalDanoRecibido")
        }

        registrarImpacto(50)
        registrarImpacto(120)
        registrarImpacto(80)

        // Verificamos que las variables de main() reflejan las mutaciones de la lambda:
        println("Total final en ámbito exterior: $totalDanoRecibido pts recibidos en $contadorAtaques impactos.")
    }
    ```

---

### Ejercicio 2.12: Casteo Seguro con `as?`
📄 **Archivo:** `E12_CasteoSeguro.kt`  
📚 **Teoría de referencia:** [Comprobaciones, Smart Casts y Casteo Seguro (as?)](../14-null-safety.md#3-comprobaciones-y-smart-casts)

#### 1. Enunciado y Requisitos

1. Crea una función `procesarRespuestaServidor(respuesta: Any)` que reciba un objeto genérico `Any`.

2. Utiliza el operador de casteo seguro **`as? String`** para intentar tratar la respuesta como texto sin provocar excepciones `ClassCastException`.

3. Si es una cadena, imprime su contenido en mayúsculas; si no lo es, imprime `"Respuesta en formato binario o numérico ignorada"`.

#### 2. Salida Esperada en Consola

```text
Resultado: MENSAJE RECIBIDO CON ÉXITO
Resultado: Formato de respuesta no soportado (devuelve null con seguridad)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun procesarRespuestaServidor(respuesta: Any) {
        // as? devuelve null si el casteo falla, evitando crasheos
        val textoSeguro: String? = respuesta as? String

        val salida = textoSeguro?.uppercase() ?: "Formato de respuesta no soportado (devuelve null con seguridad)"
        println("Resultado: $salida")
    }

    fun main() {
        procesarRespuestaServidor("Mensaje recibido con éxito")
        procesarRespuestaServidor(404)
    }
    ```

---

### Ejercicio 2.13: Funciones de Extensión y el Receptor `this`
📄 **Archivo:** `E13_FuncionesExtension.kt`  
📚 **Teoría de referencia:** [Funciones de Extensión](../13-funciones-lambdas.md#5-funciones-de-extension-extension-functions)

#### 1. Enunciado y Requisitos

En Kotlin, las **funciones de extensión** permiten añadir nuevas funciones a tipos existentes (incluso clases del sistema como `String`, `Int` o `Double`) sin tener acceso a su código fuente ni recurrir a la herencia. 

El tipo que precede al punto (`String.`, `Int.`) se denomina **tipo receptor (*receiver type*)**. Dentro del cuerpo de la función de extensión, la palabra reservada **`this`** representa la instancia concreta sobre la que se realiza la invocación (*receiver object*).

1. **El Concepto de `this`, Formateo y `Locale` (`java.util.Locale`):**

    - **¿Qué es un `Locale`?** La clase `java.util.Locale` representa una región geográfica, política o cultural específica (idioma y país). Afecta directamente al formateo numérico: en países anglosajones (como EE. UU. o Reino Unido) el separador de decimales es el punto (`19.99`), mientras que en España y gran parte de Europa se utiliza la coma decimal (`19,99`).
    - **¿Por qué es crucial especificarlo?** Si usamos `"%.2f".format(this)` sin indicar un `Locale`, Kotlin utiliza el `Locale.getDefault()` del sistema operativo donde se ejecute el código. Esto puede provocar comportamientos impredecibles en Android según el idioma configurado en el teléfono del usuario o causar fallos en tests automáticos.
    - **Sintaxis de formato con `Locale`:** En Kotlin podemos pasar el `Locale` directamente como primer argumento de `.format()` sobre una plantilla de texto: `"%.2f €".format(locale, this)` (o de forma estática `String.format(locale, "%.2f €", this)`).
    - **Requisito:** Define una función de extensión `fun Double.aMonedaEuro(locale: Locale = Locale("es", "ES")): String` que formatee el número decimal con dos decimales y el sufijo `"€"`. Al recibir un parámetro con valor por defecto `Locale("es", "ES")`, permite obtener por defecto el estándar español con coma decimal (`"19,99 €"`), pero ofrece la flexibilidad de forzar cualquier otro (como `Locale.US` para `"19.99 €"`).
    - Define también una función de extensión `fun Int.aFormatoMinutosYSegundos(): String` que interprete el entero en `this` como una cantidad de segundos y lo convierta a una cadena con formato `"MM:SS"` (por ejemplo, `125` segundos se convierte en `"02:05"` y `59` en `"00:59"`).

2. **Extensiones con Parámetros Adicionales y Valores por Defecto:**

    - Define una función de extensión `fun String.truncar(longitudMaxima: Int, sufijo: String = "..."): String`.
    - Si la longitud de la cadena (`this.length`) es menor o igual a `longitudMaxima`, devuelve `this` sin cambios.
    - Si supera el límite, extrae los primeros caracteres con `this.take(longitudMaxima)` y concatena el `sufijo`.

3. **Extensiones sobre Tipos Nulables (`String?`):**

    - Define una función de extensión `fun String?.oPorDefecto(valorDefecto: String): String`.
    - Fíjate en que el receptor es `String?` (puede ser nulo). Dentro del cuerpo, `this` tiene tipo `String?`. Utiliza el operador Elvis para devolver `this ?: valorDefecto`.
    - Comprueba desde `main()` que esta función puede invocarse directamente sobre una variable con valor `null` sin provocar ningún `NullPointerException`.

#### 2. Salida Esperada en Consola

```text
=== 1. EL RECEPTOR 'THIS' EN TIPOS NUMÉRICOS (CON LOCALE) ===
Precio formateado (ES - por defecto con coma): 19,99 €
Precio formateado (US - forzado con punto): 19.99 €
Duración de partida (125 seg): 02:05
Duración de partida (59 seg): 00:59

=== 2. EXTENSIÓN CON PARÁMETROS ADICIONALES ===
Texto corto: 'Elden Ring'
Texto truncado: 'The Legend of Zelda: Tears of the Kingdom...'
Texto truncado con sufijo personalizado: 'The Legend of Zelda: Tears of the Kingdom [LEER MÁS]'

=== 3. EXTENSIÓN SOBRE TIPO NULABLE (String?) ===
Valor seguro con texto real: 'Jugador_Activo'
Valor seguro con null: 'Invitado_Temporal'
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    import java.util.Locale

    // 1. Extensiones numéricas utilizando 'this' y formato seguro con Locale:
    fun Double.aMonedaEuro(locale: Locale = Locale("es", "ES")): String {
        // 'this' es la instancia concreta de Double; pasamos 'locale' a format()
        return "%.2f €".format(locale, this)
    }

    fun Int.aFormatoMinutosYSegundos(): String {
        // 'this' representa los segundos totales
        val minutos = this / 60
        val segundosRestantes = this % 60
        return "%02d:%02d".format(minutos, segundosRestantes)
    }

    // 2. Extensión con parámetros adicionales y valores por defecto:
    fun String.truncar(longitudMaxima: Int, sufijo: String = "..."): String {
        // Podemos usar 'this.length' o directamente 'length' (this implícito)
        return if (this.length <= longitudMaxima) {
            this
        } else {
            "${this.take(longitudMaxima)}$sufijo"
        }
    }

    // 3. Extensión sobre tipo NULABLE (String?):
    // ¡En Kotlin podemos invocar extensiones sobre null de forma totalmente segura!
    fun String?.oPorDefecto(valorDefecto: String): String {
        // Dentro de la función, 'this' es de tipo String?, por lo que aplicamos Elvis:
        return this ?: valorDefecto
    }

    fun main() {
        println("=== 1. EL RECEPTOR 'THIS' EN TIPOS NUMÉRICOS (CON LOCALE) ===")
        val precio = 19.99
        // Llamada usando el Locale por defecto configurado (España, coma decimal):
        println("Precio formateado (ES - por defecto con coma): ${precio.aMonedaEuro()}")
        // Llamada forzando Locale internacional (EE.UU., punto decimal):
        println("Precio formateado (US - forzado con punto): ${precio.aMonedaEuro(Locale.US)}")

        val tiempo1 = 125
        val tiempo2 = 59
        println("Duración de partida ($tiempo1 seg): ${tiempo1.aFormatoMinutosYSegundos()}")
        println("Duración de partida ($tiempo2 seg): ${tiempo2.aFormatoMinutosYSegundos()}")

        println("\n=== 2. EXTENSIÓN CON PARÁMETROS ADICIONALES ===")
        val tituloCorto = "Elden Ring"
        val tituloLargo = "The Legend of Zelda: Tears of the Kingdom"

        println("Texto corto: '${tituloCorto.truncar(20)}'")
        println("Texto truncado: '${tituloLargo.truncar(25)}'")
        println("Texto truncado con sufijo personalizado: '${tituloLargo.truncar(25, " [LEER MÁS]")}'")

        println("\n=== 3. EXTENSIÓN SOBRE TIPO NULABLE (String?) ===")
        val nickValido: String? = "Jugador_Activo"
        val nickNulo: String? = null

        // Ambas llamadas son seguras; nickNulo no lanza NullPointerException:
        println("Valor seguro con texto real: '${nickValido.oPorDefecto("Invitado_Temporal")}'")
        println("Valor seguro con null: '${nickNulo.oPorDefecto("Invitado_Temporal")}'")
    }
    ```

---

### Ejercicio 2.14: Pipeline Funcional Concatenado (con Función Terminal `collect`)
📄 **Archivo:** `E14_PipelineFuncionalCollect.kt`  
📚 **Teoría de referencia:** [Taller Práctico: Creando un Pipeline Funcional Concatenado (con Función Terminal collect)](../13-funciones-lambdas.md#34-taller-practico-creando-un-pipeline-funcional-concatenado-con-funcion-terminal-collect)

#### 1. Enunciado y Requisitos

En el desarrollo moderno con Kotlin y en las arquitecturas reactivas de Android (como los **Kotlin Flows** o las secuencias de colecciones), el procesamiento de datos se organiza como un **pipeline**: una secuencia de operaciones intermedias concatenadas con el operador punto `.` que culmina con una **operación terminal** (`collect`) encargada de desencadenar la ejecución y recuperar o consumir los resultados.

1. **Operación Intermedia de Filtrado (`filtrar`):**

    - Implementa una función de extensión `fun List<Int>.filtrar(criterio: (Int) -> Boolean): List<Int>`.
    - Debe recorrer la lista receptora y retornar una nueva lista con los elementos que cumplan el predicado `criterio`.

2. **Operación Intermedia de Transformación (`transformar`):**

    - Implementa una función de extensión `fun List<Int>.transformar(transformacion: (Int) -> String): List<String>`.
    - Debe mapear cada elemento numérico al texto devuelto por la lambda `transformacion`.

3. **Operaciones Terminales de Recolección (`collect`):**

    - **Variante 1 (`collect(separador: String = ", "): String`):** Recupera y condensa todos los elementos resultantes en un único **`String` resumen**. Debe indicarse explícitamente a los alumnos que la implementen apoyándose en la función de unión de colecciones de Kotlin **`joinToString(...)`** (familia `join...`), permitiendo configurar el separador textual mediante un valor por defecto.
    - **Variante 2 (`collect(accion: (String) -> Unit)`):** Recupera y entrega cada elemento uno a uno a la lambda `accion` para su consumo reactivo inmediato.

4. **El Pipeline en Acción desde `main()`:**

    - Dada la lista `val puntuaciones = listOf(35, 80, 95, 42, 60, 20, 100, 75)`:
    - **Contraste con el estilo tradicional:** Comenta la diferencia entre almacenar pasos intermedios en variables sueltas y escribir en **Modo Pipeline Fluido**.
    - **Caso 1:** Concatena `.filtrar { it >= 60 }.transformar { "Jugador con $it pts" }.collect()` para obtener el `String` resumen con los aprobados (mostrando tanto la versión por defecto en una línea como la versión en lista vertical con separador `"\n - "`).
    - **Caso 2:** Concatena con consumo reactivo directo mediante `.collect { println(...) }` para puntuaciones sobresalientes (`>= 95`).
    - **Caso 3:** Concatena utilizando una referencia a función existente con el operador `::`.

#### 2. Salida Esperada en Consola

```text
=== 1. MODO PIPELINE: OBTENER UN STRING RESUMEN CON COLLECT (JOINTOSTRING) ===
Resumen de aprobados en una línea:
Jugador con 80 pts, Jugador con 95 pts, Jugador con 60 pts, Jugador con 100 pts, Jugador con 75 pts

Resumen en formato lista vertical:
 - Jugador con 80 pts
 - Jugador con 95 pts
 - Jugador con 60 pts
 - Jugador con 100 pts
 - Jugador con 75 pts

=== 2. MODO PIPELINE: CONSUMO REACTIVO CON LAMBDA EN COLLECT ===
[ALERTA VIP]: Nivel superado con 95 pts
[ALERTA VIP]: Nivel superado con 100 pts

=== 3. MODO PIPELINE: REFERENCIA A MÉTODO (::) ===
Jugador con 80 pts
Jugador con 95 pts
Jugador con 60 pts
Jugador con 100 pts
Jugador con 75 pts
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    // 1. Operación intermedia de extensión: Filtrar
    fun List<Int>.filtrar(criterio: (Int) -> Boolean): List<Int> {
        val resultado = mutableListOf<Int>()
        for (item in this) {
            if (criterio(item)) {
                resultado.add(item)
            }
        }
        return resultado
    }

    // 2. Operación intermedia de extensión: Transformar
    fun List<Int>.transformar(transformacion: (Int) -> String): List<String> {
        val resultado = mutableListOf<String>()
        for (item in this) {
            resultado.add(transformacion(item))
        }
        return resultado
    }

    // 3. Operación terminal: Variante 1 -> Genera un String resumen apoyándose en joinToString
    fun List<String>.collect(separador: String = ", "): String {
        return this.joinToString(separator = separador)
    }

    // 3. Operación terminal: Variante 2 -> Procesa/consume cada elemento reactivamente
    fun List<String>.collect(accion: (String) -> Unit) {
        for (item in this) {
            accion(item)
        }
    }

    fun esPuntuacionAprobada(puntos: Int): Boolean = puntos >= 60

    fun main() {
        val puntuaciones = listOf(35, 80, 95, 42, 60, 20, 100, 75)

        // ❌ ENFOQUE TRADICIONAL SIN PIPELINE (Variables intermedias innecesarias):
        // val paso1 = puntuaciones.filtrar { it >= 60 }
        // val paso2 = paso1.transformar { "Jugador con $it pts" }
        // val listaFinal = paso2.collect()

        println("=== 1. MODO PIPELINE: OBTENER UN STRING RESUMEN CON COLLECT (JOINTOSTRING) ===")
        // ✔️ ENFOQUE PIPELINE FLUIDO: Concatenación con '.' y cierre con collect() produciendo un String:
        val resumenLinea: String = puntuaciones
            .filtrar { it >= 60 }
            .transformar { "Jugador con $it pts" }
            .collect() // Usa separador por defecto ", " gracias a joinToString

        println("Resumen de aprobados en una línea:\n$resumenLinea")

        val resumenLista: String = puntuaciones
            .filtrar { it >= 60 }
            .transformar { "Jugador con $it pts" }
            .collect(separador = "\n - ")

        println("\nResumen en formato lista vertical:\n - $resumenLista")

        println("\n=== 2. MODO PIPELINE: CONSUMO REACTIVO CON LAMBDA EN COLLECT ===")
        puntuaciones
            .filtrar { it >= 95 }
            .transformar { "[ALERTA VIP]: Nivel superado con $it pts" }
            .collect { alerta ->
                println(alerta)
            }

        println("\n=== 3. MODO PIPELINE: REFERENCIA A MÉTODO (::) ===")
        puntuaciones
            .filtrar(::esPuntuacionAprobada)
            .transformar { "Jugador con $it pts" }
            .collect(::println)
    }
    ```

---

### Ejercicio 2.15: La "Trilogía de Nulabilidad" en Colecciones
📄 **Archivo:** `E15_ColeccionesNullables.kt`  
📚 **Teoría de referencia:** [Null Safety en Colecciones](../14-null-safety.md)

#### 1. Enunciado y Requisitos
Al consumir APIs REST o bases de datos móviles, la nulabilidad en colecciones tiene dos dimensiones ortogonales:

1. **`List<String?>`:** La lista existe con seguridad (no es nula), pero puede albergar elementos nulos en su interior.
2. **`List<String>?`:** La lista completa puede ser nula (no existir), pero si existe, todos sus elementos son cadenas válidas.
3. **`List<String?>?`:** La lista completa puede ser nula, y si existe, sus elementos también pueden ser nulos.

Simula la recepción de un JSON de servidor:

1. Declara `val listaElementosNulos: List<String?> = listOf("Zelda", null, "Mario", null, "Metroid")`.
2. Utiliza la función idiomática **`.filterNotNull()`** para obtener una lista limpia de tipo `List<String>`.
3. Declara una función `procesarListaOpcional(lista: List<String>?)` que utilice el operador de llamada segura `?.` y Elvis `?:` para imprimir el tamaño de la lista o `"Lista ausente (null)"`.

#### 2. Salida Esperada en Consola
```text
Lista original con nulos: [Zelda, null, Mario, null, Metroid]
Lista depurada con filterNotNull: [Zelda, Mario, Metroid]
Tamaño lista existente: 3 elementos
Tamaño lista ausente: Lista ausente (null)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun procesarListaOpcional(lista: List<String>?) {
        val resumen = lista?.let { "${it.size} elementos" } ?: "Lista ausente (null)"
        println("Tamaño lista: $resumen")
    }

    fun main() {
        // 1. Lista no nula que contiene elementos nulos:
        val listaElementosNulos: List<String?> = listOf("Zelda", null, "Mario", null, "Metroid")
        println("Lista original con nulos: $listaElementosNulos")

        // 2. filterNotNull() descarta los nulos y devuelve un List<String> no nulo:
        val listaLimpia: List<String> = listaElementosNulos.filterNotNull()
        println("Lista depurada con filterNotNull: $listaLimpia")

        // 3. Prueba con lista potencialmente nula:
        print("Tamaño lista existente: ")
        procesarListaOpcional(listaLimpia)

        print("Tamaño lista ausente: ")
        procesarListaOpcional(null)
    }
    ```

---

### Ejercicio 2.16: El Operador `!!` y Análisis de *Code Smell*
📄 **Archivo:** `E16_AsercionNoNulaCodeSmell.kt`  
📚 **Teoría de referencia:** [El Operador de Aserción No Nula (!!)](../14-null-safety.md#3-el-operador-de-asercion-no-nula)

#### 1. Enunciado y Requisitos
El operador de afirmación `!!` le dice al compilador: *"Sé más que tú; te juro que esta variable no es nula, y si lo es, mátame el programa"*. En la industria se considera un **Code Smell** (código con mal olor) porque reactiva los `NullPointerException` que Kotlin busca erradicar.

1. Declara una función `calcularLongitudPeligrosa(texto: String?): Int` que utilice `texto!!.length`. Comenta en su KDoc por qué está desaconsejada.
2. Refactoriza esa función a una versión segura `calcularLongitudSegura(texto: String?): Int` utilizando el operador Elvis `?: 0`.
3. Implementa una tercera variante `calcularLongitudConAsercionSemantica(texto: String?): Int` utilizando la función oficial **`requireNotNull(texto) { "El texto no puede ser nulo en esta operación" }`**, que lanza un `IllegalArgumentException` con mensaje explicativo en lugar de un NPE ciego.

#### 2. Salida Esperada en Consola
```text
Longitud segura con Elvis (null -> 0): 0
Longitud segura con Elvis ("Kotlin" -> 6): 6
Capturada excepción semántica: El texto no puede ser nulo en esta operación
```

#### 3. Solución Comentada
??? tip "Ver solución comentada y comparativa"
    ```kotlin
    package b02_funciones_lambdas

    // ❌ DESACONSEJADO: Rompe la promesa de seguridad de Kotlin
    fun calcularLongitudPeligrosa(texto: String?): Int {
        return texto!!.length // Si texto es null -> java.lang.NullPointerException
    }

    // ✅ RECOMENDADO 1: Fallback suave con Elvis
    fun calcularLongitudSegura(texto: String?): Int {
        return texto?.length ?: 0
    }

    // ✅ RECOMENDADO 2: Falla rápido con mensaje explicativo de depuración
    fun calcularLongitudConAsercionSemantica(texto: String?): Int {
        val seguro = requireNotNull(texto) { "El texto no puede ser nulo en esta operación" }
        return seguro.length
    }

    fun main() {
        println("Longitud segura con Elvis (null -> 0): ${calcularLongitudSegura(null)}")
        println("Longitud segura con Elvis (\"Kotlin\" -> 6): ${calcularLongitudSegura("Kotlin")}")

        try {
            calcularLongitudConAsercionSemantica(null)
        } catch (e: IllegalArgumentException) {
            println("Capturada excepción semántica: ${e.message}")
        }
    }
    ```

---

## 🔴 Nivel Avanzado (Reto Lúdico)

### Reto 2.17: El Juego del Ahorcado Funcional (*Hangman con Callbacks y Null Safety*)
📄 **Archivo:** `Reto02_AhorcadoJuego.kt`  
📚 **Teoría de referencia:** [Funciones de Orden Superior](../13-funciones-lambdas.md#3-funciones-de-orden-superior-higher-order-functions) y [Operadores para el Manejo Seguro de Nulos](../14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)

#### 1. Contexto y Misión

En este reto construirás la lógica central del clásico juego de palabras **El Ahorcado**, aplicando el paradigma funcional de Kotlin y los mecanismos de **Null Safety** aprendidos en el Bloque 2.

La meta formativa es trasladar la arquitectura de eventos y estado de **Jetpack Compose** a un ejercicio puro de consola:

- Funciones de extensión para enriquecer tipos existentes (`String`).
- Funciones de orden superior que delegan el resultado de eventos a través de lambdas (*callbacks*).
- Operadores de seguridad ante nulos (`?.`, operador Elvis `?:`, retorno anticipado seguro).
- Tipos básicos inmutables (`String`, `Char`, `Int`, `Boolean`), **sin utilizar colecciones (`Set`/`List`) ni clases personalizadas**.

##### 🎮 La Dinámica del Juego Explicada

El jugador debe descubrir una palabra secreta oculta adivinando sus letras una a una antes de agotar sus **6 vidas disponibles**.

###### A. Componentes y Recursos de la Partida

| Elemento | Tipo de Dato | Función en el Juego |
| :--- | :--- | :--- |
| **Palabra Secreta** | `val palabraSecreta: String` | Obtenida al azar mediante un `when` con `(1..4).random()` (ej. `"KOTLIN"`, `"COMPOSE"`). |
| **Letras Probadas** | `var letrasProbadas: String` | Cadena inmutable acumuladora con todas las letras intentadas. |
| **Marcador de Vidas** | `var vidasRestantes: Int` | Inicia en `6`. Cada fallo resta `1`. Si llega a `0`, se pierde la partida. |
| **Máscara de Visualización** | Obtenida con `.enmascarar()` | Muestra las letras acertadas y guiones bajos `_` en las ocultas (ej. `"_ O _ _ _ _"`). |
| **Bolsas de Caracteres** | `val bancoVocales: String`<br/>`val bancoConsonantes: String` | Cadenas con letras disponibles (`"AEIOU?"` y `"RSTLNPMBCDFGHJKLZ?"`) donde `'?'` simula una entrada nula. |

###### B. Ciclo de Vida de Cada Intento (Paso a Paso)

En cada ronda, el bucle principal simula a un jugador inteligente de consola mediante una estrategia por turnos, delegando la evaluación completa de cada jugada en el método central **`procesarIntento(...)`**:

1. **Selección de Letra según el Turno:**  
   - Si el turno es **múltiplo de 3 (`turno % 3 == 0`)**, se extrae un carácter aleatorio de `bancoVocales`.
   - En cualquier otro caso, se extrae de `bancoConsonantes`.
   - Si el carácter sorteado es el comodín `'?'`, se pasa un valor `null` al parámetro `letraInput` de `procesarIntento` para poner a prueba el mecanismo de **Null Safety**. En caso contrario, se pasa el carácter en mayúsculas.

2. **Fase 1 — Validación con Null Safety (Cláusula de Guarda en `procesarIntento`):**  
   Si `letraInput` es nulo (`null`), se invoca de inmediato el callback **`onErrorInput()`** y la ejecución finaliza con un `return`. El turno no penaliza al jugador con pérdida de vidas.

3. **Fase 2 — Normalización y Comprobación de Repetición:**  
   La letra se normaliza a mayúsculas (`uppercaseChar()`). Si la letra ya existe dentro de `letrasProbadas` (`letra in letrasProbadas`), se invoca el callback **`onRepetir(letra)`** informando al jugador, sin modificar las vidas ni las letras probadas.

4. **Fase 3 — Resolución del Intento (Acierto o Fallo):**  
   Si la letra es nueva, se concatena a la cadena de intentos (`nuevasProbadas = letrasProbadas + letra`):

    - **Acierto:** Si la letra está en la palabra secreta (`letra in palabraSecreta`), se invoca el callback **`onAcertar(letra, nuevasProbadas)`**. Las vidas se mantienen intactas.

    - **Fallo:** Si la letra no pertenece a la palabra secreta, se decrementa el contador de vidas (`vidasRestantes - 1`) y se invoca el callback **`onFallar(letra, nuevasProbadas, vidasRestantes)`**.

5. **Fase 4 — Comprobación de Fin de Partida:**  
   Tras cada intento, se evalúa si la partida ha alcanzado una condición terminal:

    - **🏆 Victoria:** Si la función de extensión `.estaAdivinada(letrasProbadas)` devuelve `true`, significa que todas las letras de la palabra secreta están descubiertas.

    - **💀 Derrota:** Si `vidasRestantes <= 0`, el ahorcado se completa y la partida termina en derrota.

---

#### 2. Requisitos Funcionales

Para completar el reto de forma rigurosa respetando el nivel pedagógico del Bloque 2:

1. **RF-01 (Prohibición de Clases y Colecciones Avanzadas):** Queda terminantemente prohibido el uso de `class`, `data class`, `List`, `Set`, `Map` o `Array`. El estado y las bolsas de letras deben gestionarse exclusivamente con cadenas inmutables (`String`) y tipos primitivos.

2. **RF-02 (Función de Extensión de Enmascaramiento):** Implementa `fun String.enmascarar(probadas: String): String` que devuelva la palabra formateada con las letras acertadas visibles y las no probadas sustituidas por un guion bajo `'_'`, separadas por espacios (ej. `"_ O _ _ _ _"`).

3. **RF-03 (Función de Extensión de Verificación de Victoria):** Implementa `fun String.estaAdivinada(probadas: String): Boolean` que determine si la totalidad de los caracteres de la palabra están presentes en `probadas`.

4. **RF-04 (Función Central de Juego `procesarIntento` con Callbacks Reactivos):**

    Toda la lógica de evaluación del turno debe residir en el método `procesarIntento`. Esta función no debe contener sentencias `println()` ni gestionar la consola: su única responsabilidad es analizar el intento recibido y delegar el control y la actualización del estado al bucle principal mediante 4 funciones lambda (*callbacks*), siguiendo el patrón *State Hoisting* de Jetpack Compose:

    ```kotlin
    fun procesarIntento(
        letraInput: Char?,
        palabraSecreta: String,
        letrasProbadas: String,
        vidasActuales: Int,
        onAcertar: (letra: Char, nuevasProbadas: String) -> Unit,
        onFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit,
        onRepetir: (letra: Char) -> Unit,
        onErrorInput: () -> Unit
    )
    ```

    **Parámetros de estado y entrada:**

    - **`letraInput: Char?`**: El carácter propuesto en el turno actual. Se define expresamente como nulable (`Char?`) para poner a prueba el mecanismo de seguridad ante nulos (*Null Safety*) cuando se reciba una entrada no válida o el comodín `'?'`.
    - **`palabraSecreta: String`**: La palabra oculta que el jugador debe descubrir.
    - **`letrasProbadas: String`**: Cadena acumuladora con las letras intentadas hasta este turno.
    - **`vidasActuales: Int`**: Número de vidas disponibles antes de evaluar el intento actual.

    **Parámetros de eventos (*callbacks* reactivos tipados con prefijo `on...`):**

    - **`onAcertar: (letra: Char, nuevasProbadas: String) -> Unit`**: Se invoca cuando la letra introducida es válida, nueva y está presente en la palabra secreta. Recibe la letra acertada y la nueva cadena actualizada de letras probadas (`letrasProbadas + letra`). Las vidas se mantienen intactas.
    - **`onFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit`**: Se invoca cuando la letra introducida es válida, nueva y NO pertenece a la palabra secreta. Recibe la letra errónea, la cadena de probadas actualizada y las vidas restantes reducidas en 1 (`vidasActuales - 1`).
    - **`onRepetir: (letra: Char) -> Unit`**: Se invoca cuando la letra ya figuraba previamente en `letrasProbadas`. Notifica al jugador sin penalizar vidas ni modificar las letras probadas.
    - **`onErrorInput: () -> Unit`**: Se invoca de inmediato si `letraInput` es `null`, abortando el procesamiento de forma segura mediante un retorno anticipado sin penalizar vidas ni alterar el estado.

5. **RF-05 (Manejo Estricto de Null Safety en `procesarIntento`):** Dentro del cuerpo de `procesarIntento`, extrae el carácter seguro utilizando llamada segura y el operador Elvis con retorno anticipado (`val letra = letraInput?.uppercaseChar() ?: run { onErrorInput(); return }`).

6. **RF-06 (Bucle Dinámico de Partida en `main()` e Invocación a `procesarIntento`):** Implementa en `main()` un bucle `while (vidasRestantes > 0 && !palabraSecreta.estaAdivinada(letrasProbadas))` que seleccione la palabra secreta con un `when ((1..4).random())`, alterne vocales en múltiplos de 3 (`turno % 3 == 0`) y consonantes en los demás, gestione el comodín `'?'` para pasar `null` a `procesarIntento(...)`, e implemente las 4 lambdas pasadas como argumento para actualizar el estado del juego (`letrasProbadas`, `vidasRestantes`) e imprimir la retroalimentación en consola.

---

??? info "📊 Ver Modelo Mental del Reto (Diagrama de Flujo con Lambdas)"
    ```mermaid
    flowchart TD
        Entrada(["letraInput: Char?"]) --> NullCheck{"¿letraInput != null?<br/>(letraInput?.uppercaseChar())"}
        
        NullCheck -- "Es null" --> CallbackError["Invocar lambda: onErrorInput()"]
        NullCheck -- "Válido" --> YaProbada{"¿letra in letrasProbadas?"}
        
        YaProbada -- "Sí" --> CallbackRepetir["Invocar lambda: onRepetir(letra)"]
        YaProbada -- "No" --> Acierto{"¿letra in palabraSecreta?"}
        
        Acierto -- "Sí" --> CallbackAcierto["Invocar lambda: onAcertar(letra, probadas + letra)"]
        Acierto -- "No" --> CallbackFallo["Invocar lambda: onFallar(letra, probadas + letra, vidas - 1)"]
    ```

??? question "🧠 Preguntas de Reflexión Previa (Aprender a Pensar)"
    Antes de examinar la solución o las pistas, reflexiona sobre estos principios de diseño funcional:

    - **¿Cómo simulamos valores `null` aleatorios si solo usamos cadenas de texto (`String`)?**  
      Un `String` contiene caracteres primitivos `Char` no nulos. Para simular entradas nulas del usuario sin colecciones, introducimos un carácter comodín (como `'?'`). Al tomar un carácter con `.random()`, si coincide con `'?'` generamos un valor `null` (`if (char == '?') null else char`), poniendo a prueba el control de nulos (*Null Safety*).

    - **¿Por qué alternar consonantes y vocales con `turno % 3 == 0`?**  
      Aplica el operador módulo visto en el Bloque 1 para modelar una estrategia de juego clásica: probar dos consonantes frecuentes por cada vocal, en lugar de jugadas estáticas o repetitivas.

    - **¿Por qué prefijar los callbacks con `on...` (`onAcertar`, `onFallar`, etc.) en lugar de `al...`?**  
      Es el estándar absoluto en Kotlin y en **Jetpack Compose** (`onClick`, `onValueChange`, `onDismissRequest`). En la arquitectura declarativa de Compose, los eventos siempre fluyen hacia arriba a través de lambdas nombradas con `on`.

    - **¿Por qué la cláusula de guarda con Elvis utiliza `?: run { ... return }`?**  
      Permite invocar el callback de error y forzar la salida inmediata de la función sin anidar bloques `if-else` profundos, manteniendo el código plano y legible.

??? tip "💡 Pistas Progresivas de Ayuda (Abrir solo si te atascas)"
    === "Pista 1: Enmascarar caracteres sobre String"
        Un `String` se puede mapear directamente carácter a carácter y unirse con `.joinToString(" ")`:
        ```kotlin
        fun String.enmascarar(probadas: String): String =
            this.map { c -> if (c in probadas) c else '_' }.joinToString(" ")
        ```

    === "Pista 2: Validación con Null Safety y Elvis"
        Usa el operador Elvis para capturar si la entrada es nula antes de procesar:
        ```kotlin
        val letra = letraInput?.uppercaseChar() ?: run {
            onErrorInput()
            return
        }
        ```

    === "Pista 3: Comprobación de Victoria con `.all`"
        Para saber si el jugador ha adivinado la palabra completa de forma declarativa:
        ```kotlin
        fun String.estaAdivinada(probadas: String): Boolean =
            this.all { c -> c in probadas }
        ```

??? example "🖥️ Ver Salida Esperada en Consola (Ejemplo de Partida Dinámica)"
    ```text
    === EL AHORCADO KOTLIN (LAMBDAS & NULL SAFETY) ===
    Palabra: _ _ _ _ _ _ | Vidas: 6 | Letras probadas: ''

    --- Turno 1 [CONSONANTE] -> Letra propuesta: R ---
      ¡Acierto! La letra 'R' está en la palabra secreta.
      Estado: _ _ _ _ _ _ | Vidas: 6 | Probadas: 'R'

    --- Turno 2 [CONSONANTE] -> Letra propuesta: S ---
      ¡Fallo! La letra 'S' NO está en la palabra secreta. Vidas restantes: 5
      Estado: _ _ _ _ _ _ | Vidas: 5 | Probadas: 'RS'

    --- Turno 3 [VOCAL] -> Letra propuesta: null (error de entrada) ---
      [ALERTA NULL SAFETY]: Entrada no válida recibida. Turno omitido sin penalización.
      Estado: _ _ _ _ _ _ | Vidas: 5 | Probadas: 'RS'

    --- Turno 4 [CONSONANTE] -> Letra propuesta: R ---
      La letra 'R' ya había sido probada previamente. No pierdes vidas.
      Estado: _ _ _ _ _ _ | Vidas: 5 | Probadas: 'RS'

    ... (turnos sucesivos) ...

    🏆 ¡VICTORIA! Has completado la palabra secreta: KOTLIN
    ```

??? tip "💻 Ver Solución Comentada Paso a Paso"
    ```kotlin
    package b02_funciones_lambdas

    // 1. Función de extensión sobre String para enmascarar caracteres
    fun String.enmascarar(probadas: String): String {
        return this.map { c -> if (c in probadas) c else '_' }.joinToString(" ")
    }

    // 2. Función de extensión sobre String para comprobar condición de victoria
    fun String.estaAdivinada(probadas: String): Boolean {
        return this.all { c -> c in probadas }
    }

    // 3. Función de orden superior con lambdas y Null Safety estricto
    fun procesarIntento(
        letraInput: Char?,
        palabraSecreta: String,
        letrasProbadas: String,
        vidasActuales: Int,
        onAcertar: (letra: Char, nuevasProbadas: String) -> Unit,
        onFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit,
        onRepetir: (letra: Char) -> Unit,
        onErrorInput: () -> Unit
    ) {
        // Cláusula de guarda con Null Safety: llamada segura y elvis con return
        val letra = letraInput?.uppercaseChar() ?: run {
            onErrorInput()
            return
        }

        // Si ya fue probada, notificamos y salimos sin penalizar vidas
        if (letra in letrasProbadas) {
            onRepetir(letra)
            return
        }

        val nuevasProbadas = letrasProbadas + letra

        // Verificamos pertenencia a la palabra secreta
        if (letra in palabraSecreta) {
            onAcertar(letra, nuevasProbadas)
        } else {
            val nuevasVidas = vidasActuales - 1
            onFallar(letra, nuevasProbadas, nuevasVidas)
        }
    }

    fun main() {
        // Banco de palabras resuelto sin colecciones (usando when y random del Bloque 1):
        val palabraSecreta = when ((1..4).random()) {
            1 -> "KOTLIN"
            2 -> "COMPOSE"
            3 -> "ANDROID"
            else -> "CORRUTINA"
        }

        // Bolsas de letras en String (el comodín '?' simula una entrada nula):
        val bancoVocales = "AEIOU?"
        val bancoConsonantes = "RSTLNPMBCDFGHJKLZ?"

        var letrasProbadas = ""
        var vidasRestantes = 6
        var turno = 1

        println("=== EL AHORCADO KOTLIN (LAMBDAS & NULL SAFETY) ===")
        println("Palabra: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes | Letras probadas: ''\n")

        // Bucle dinámico de partida: continúa hasta ganar o agotar vidas
        while (vidasRestantes > 0 && !palabraSecreta.estaAdivinada(letrasProbadas)) {
            // Regla: múltiplo de 3 toca vocal; en caso contrario, consonante
            val esTurnoVocal = (turno % 3 == 0)
            val tipoLetra = if (esTurnoVocal) "VOCAL" else "CONSONANTE"
            val bolsaLetras = if (esTurnoVocal) bancoVocales else bancoConsonantes

            val charSorteado = bolsaLetras.random()
            val letraTurno: Char? = if (charSorteado == '?') null else charSorteado

            println("--- Turno $turno [$tipoLetra] -> Letra propuesta: ${letraTurno ?: "null (error de entrada)"} ---")

            procesarIntento(
                letraInput = letraTurno,
                palabraSecreta = palabraSecreta,
                letrasProbadas = letrasProbadas,
                vidasActuales = vidasRestantes,
                onAcertar = { letra, nuevasProbadas ->
                    letrasProbadas = nuevasProbadas
                    println("  ¡Acierto! La letra '$letra' está en la palabra secreta.")
                },
                onFallar = { letra, nuevasProbadas, nuevasVidas ->
                    letrasProbadas = nuevasProbadas
                    vidasRestantes = nuevasVidas
                    println("  ¡Fallo! La letra '$letra' NO está en la palabra secreta. Vidas restantes: $nuevasVidas")
                },
                onRepetir = { letra ->
                    println("  La letra '$letra' ya había sido probada previamente. No pierdes vidas.")
                },
                onErrorInput = {
                    println("  [ALERTA NULL SAFETY]: Entrada no válida recibida. Turno omitido sin penalización.")
                }
            )

            println("  Estado: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes | Probadas: '$letrasProbadas'\n")
            turno++
        }

        // Resolución final
        if (palabraSecreta.estaAdivinada(letrasProbadas)) {
            println("🏆 ¡VICTORIA! 🎉 Has completado la palabra secreta: $palabraSecreta")
        } else {
            println("💀 ¡DERROTA! 🪢 Te has quedado sin vidas. La palabra era: $palabraSecreta")
        }
    }
    ```

---

### 🧪 ¿Cómo desarrollar este juego mediante TDD (Test-Driven Development)?

!!! tip "Siguiente Nivel de Calidad: TDD, Lambdas y Verificación de Callbacks"
    ¿Quieres experimentar la metodología de desarrollo que aplican los equipos de ingeniería de élite? En la sección de testing dispones de la suite de pruebas completa para el Ahorcado:

    - Diseña por contratos en un subpaquete limpio (`b02_funciones_lambdas.tdd`).
    - Pasa del **Rojo** al **Verde** implementando las funciones de extensión y el procesador de intentos.
    - Aprende a verificar de forma automática que los callbacks reactivos y las entradas nulas se comportan a la perfección.

    👉 **[Ir al Taller de Testing 2: El Ahorcado con TDD](../testing/02-test-ahorcado-tdd.md)**
