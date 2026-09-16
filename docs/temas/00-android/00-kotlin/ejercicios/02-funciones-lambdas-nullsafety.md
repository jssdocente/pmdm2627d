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
📚 **Teoría de referencia:** [Declaración de Funciones e Inmutabilidad de Parámetros](../13-funciones-lambdas.md#11-inmutabilidad-de-los-parametros)

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

### Ejercicio 2.4: Tipos de Función y Lambdas Básicas
📄 **Archivo:** `E04_TiposDeFuncion.kt`  
📚 **Teoría de referencia:** [Tipos de Función y Sintaxis de Lambdas](../13-funciones-lambdas.md#2-tipos-de-funcion-y-funciones-lambda)

#### 1. Enunciado y Requisitos

1. Declara una variable inmutable `val duplicar: (Int) -> Int` asignándole una expresión lambda explícita `{ numero: Int -> numero * 2 }`.

2. Declara otra variable `val formatearPrecio: (Double, String) -> String` que reciba un importe y una moneda y devuelva el texto formateado.

3. Ejecuta ambas lambdas pasándoles distintos valores.

#### 2. Salida Esperada en Consola

```text
Doble de 8: 16
Precio formateado: 29.99 €
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val duplicar: (Int) -> Int = { numero -> numero * 2 }
        val formatearPrecio: (Double, String) -> String = { importe, moneda -> "$importe $moneda" }

        println("Doble de 8: ${duplicar(8)}")
        println("Precio formateado: ${formatearPrecio(29.99, "€")}")
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

### Ejercicio 2.8: Sintaxis de Lambda Colgante (*Trailing Lambda*) y State Hoisting
📄 **Archivo:** `E08_TrailingLambdaStateHoisting.kt`  
📚 **Teoría de referencia:** [Sintaxis de Lambda Colgante](../13-funciones-lambdas.md#41-regla-1-sintaxis-de-lambda-colgante-trailing-lambda-syntax) y [Elevación de Estado (State Hoisting)](../13-funciones-lambdas.md#42-regla-2-elevacion-de-estado-state-hoisting-mediante-callbacks-lambda)

#### 1. Enunciado y Requisitos

En Jetpack Compose, componentes como `Button(onClick = { ... })` sacan la lambda fuera del paréntesis cuando es el último parámetro (*Trailing Lambda*).

1. Define una función `SimuladorBotonCompose(texto: String, alHacerClic: (String) -> Unit)`.

2. En `main()`, invoca a `SimuladorBotonCompose` utilizando la sintaxis de trailing lambda: `SimuladorBotonCompose("Comprar") { accion -> ... }`.

3. Modifica una variable de estado en el llamador simulando la técnica de elevación de estado (*State Hoisting*).

#### 2. Salida Esperada en Consola

```text
Estado inicial: Carrito vacío
[Simulador Compose]: Botón 'Añadir al Carrito' pulsado por el usuario.
Estado tras el clic (State Hoisting): Producto 'Elden Ring' añadido
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    // Componente que no almacena estado propio, solo lo delega hacia arriba
    fun SimuladorBotonCompose(texto: String, alHacerClic: (String) -> Unit) {
        println("[Simulador Compose]: Botón '$texto' pulsado por el usuario.")
        alHacerClic(texto)
    }

    fun main() {
        var estadoCarrito = "Carrito vacío"
        println("Estado inicial: $estadoCarrito")

        // Trailing lambda: el bloque va fuera de los paréntesis
        SimuladorBotonCompose("Añadir al Carrito") { boton ->
            estadoCarrito = "Producto 'Elden Ring' añadido"
        }

        println("Estado tras el clic (State Hoisting): $estadoCarrito")
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

### Ejercicio 2.11: Fábricas de Lambdas y Closures
📄 **Archivo:** `E11_FabricaDeFunciones.kt`  
📚 **Teoría de referencia:** [Tipos de Función (Function Types)](../13-funciones-lambdas.md#21-tipos-de-funcion-function-types)

#### 1. Enunciado y Requisitos

En programación funcional, una función puede construir y devolver otra función recordando las variables del entorno donde fue creada (*Closure*).

1. Diseña una función `crearMultiplicadorDificultad(multiplicador: Double): (Int) -> Int`.

2. La función debe devolver una lambda que reciba el daño base de un enemigo y devuelva el daño ajustado al nivel de dificultad elegido.

3. En `main()`, crea un `modoFacil` (multiplicador `0.75`), un `modoNormal` (`1.0`) y un `modoPesadilla` (`2.5`).

4. Aplica las tres funciones a un golpe base de 100 puntos.

#### 2. Salida Esperada en Consola

```text
Daño base del jefe: 100
- Modo Fácil: 75 pts
- Modo Normal: 100 pts
- Modo Pesadilla: 250 pts
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun crearMultiplicadorDificultad(multiplicador: Double): (Int) -> Int {
        // La lambda captura 'multiplicador' en su closure:
        return { danoBase -> (danoBase * multiplicador).toInt() }
    }

    fun main() {
        val modoFacil = crearMultiplicadorDificultad(0.75)
        val modoNormal = crearMultiplicadorDificultad(1.0)
        val modoPesadilla = crearMultiplicadorDificultad(2.5)

        val danoJefe = 100
        println("Daño base del jefe: $danoJefe")
        println("- Modo Fácil: ${modoFacil(danoJefe)} pts")
        println("- Modo Normal: ${modoNormal(danoJefe)} pts")
        println("- Modo Pesadilla: ${modoPesadilla(danoJefe)} pts")
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

### Ejercicio 2.13: Funciones de Extensión
📄 **Archivo:** `E13_FuncionesExtension.kt`  
📚 **Teoría de referencia:** [Funciones de Extensión](../13-funciones-lambdas.md#5-funciones-de-extension-extension-functions)

#### 1. Enunciado y Requisitos

1. Las funciones de extensión permiten añadir métodos a clases existentes (incluso de librerías externas) sin heredar de ellas.

2. Define una función de extensión `fun Double.aMonedaEuro(): String` que devuelva el número con dos decimales y el símbolo `"€"`.

3. Define una función de extensión `fun String.esCorreoValido(): Boolean` que compruebe si contiene `'@'` y termina en `".com"` o `".es"`.

4. Pruébalas en `main()`.

#### 2. Salida Esperada en Consola

```text
Precio del pase de batalla: 19.99 €
¿'alumno@ies.es' es correo válido?: true
¿'sin_arroba.es' es correo válido?: false
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun Double.aMonedaEuro(): String = "%.2f €".format(this)

    fun String.esCorreoValido(): Boolean =
        this.contains('@') && (this.endsWith(".com") || this.endsWith(".es"))

    fun main() {
        val precio = 19.99
        println("Precio del pase de batalla: ${precio.aMonedaEuro()}")

        val c1 = "alumno@ies.es"
        val c2 = "sin_arroba.es"

        println("¿'$c1' es correo válido?: ${c1.esCorreoValido()}")
        println("¿'$c2' es correo válido?: ${c2.esCorreoValido()}")
    }
    ```

---

## 🔴 Nivel Avanzado (Reto Lúdico)

### Reto 2.14: El Juego del Ahorcado Funcional (*Hangman con Callbacks y Null Safety*)
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
| **Palabra Secreta** | `val palabraSecreta: String` | La palabra oculta a resolver (ej. `"KOTLIN"`). |
| **Letras Probadas** | `var letrasProbadas: String` | Cadena inmutable acumuladora con todas las letras intentadas. |
| **Marcador de Vidas** | `var vidasRestantes: Int` | Inicia en `6`. Cada fallo resta `1`. Si llega a `0`, se pierde. |
| **Máscara de Visualización** | Obtenida con `.enmascarar()` | Muestra las letras acertadas y guiones bajos `_` en las ocultas. |

###### B. Ciclo de Vida de Cada Intento (Paso a Paso)

En cada ronda, el jugador propone una letra (`letraInput: Char?`). Dado que la entrada puede proceder de un teclado, formulario o sensor, este carácter es potencialmente nulo. La función de orden superior `procesarIntento(...)` analiza la jugada y ejecuta la respuesta adecuada mediante callbacks:

1. **Fase 1 — Validación con Null Safety (Cláusula de Guarda):**  
   Si `letraInput` es nulo (`null`), se invoca de inmediato el callback **`alErrorInput()`** y la ejecución finaliza con un `return`. El turno no penaliza al jugador con pérdida de vidas.

2. **Fase 2 — Normalización y Comprobación de Repetición:**  
   La letra se normaliza a mayúsculas (`uppercaseChar()`). Si la letra ya existe dentro de `letrasProbadas` (`letra in letrasProbadas`), se invoca el callback **`alRepetir(letra)`** informando al jugador, sin modificar las vidas ni las letras probadas.

3. **Fase 3 — Resolución del Intento (Acierto o Fallo):**  
   Si la letra es nueva, se concatena a la cadena de intentos (`nuevasProbadas = letrasProbadas + letra`):

    - **Acierto:** Si la letra está en la palabra secreta (`letra in palabraSecreta`), se invoca el callback **`alAcertar(letra, nuevasProbadas)`**. Las vidas se mantienen intactas.

    - **Fallo:** Si la letra no pertenece a la palabra secreta, se decrementa el contador de vidas (`vidasRestantes - 1`) y se invoca el callback **`alFallar(letra, nuevasProbadas, vidasRestantes)`**.

4. **Fase 4 — Comprobación de Fin de Partida:**  
   Tras cada intento, se evalúa si la partida ha alcanzado una condición terminal:

    - **🏆 Victoria:** Si la función de extensión `.estaAdivinada(letrasProbadas)` devuelve `true`, significa que todas las letras de la palabra secreta están descubiertas.

    - **💀 Derrota:** Si `vidasRestantes <= 0`, el ahorcado se completa y la partida termina en derrota.

---

#### 2. Requisitos Funcionales

Para completar el reto de forma rigurosa respetando el nivel pedagógico del Bloque 2:

1. **RF-01 (Prohibición de Clases y Colecciones Avanzadas):** Queda terminantemente prohibido el uso de `class`, `data class`, `List`, `Set` o `Map`. El estado debe gestionarse exclusivamente con cadenas inmutables (`String`) y tipos primitivos.

2. **RF-02 (Función de Extensión de Enmascaramiento):** Implementa `fun String.enmascarar(probadas: String): String` que devuelva la palabra formateada con las letras acertadas visibles y las no probadas sustituidas por un guion bajo `'_'`, separadas por espacios (ej. `"_ O _ _ _ _"`).

3. **RF-03 (Función de Extensión de Verificación de Victoria):** Implementa `fun String.estaAdivinada(probadas: String): Boolean` que determine si la totalidad de los caracteres de la palabra están presentes en `probadas`.

4. **RF-04 (Función de Orden Superior con 4 Callbacks Tipados):** Define `fun procesarIntento(...)` recibiendo los parámetros de estado y 4 funciones lambda para los eventos:

    - `alAcertar: (letra: Char, nuevasProbadas: String) -> Unit`

    - `alFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit`

    - `alRepetir: (letra: Char) -> Unit`

    - `alErrorInput: () -> Unit`

5. **RF-05 (Manejo Estricto de Null Safety):** Extrae el carácter seguro utilizando llamada segura y operador Elvis (`letraInput?.uppercaseChar() ?: run { ...; return }`).

6. **RF-06 (Simulación Completa de Partida en `main()`):** Ejecuta una partida simulada que cubra obligatoriamente los cuatro posibles caminos de ejecución: un acierto, un fallo, una letra repetida, una entrada nula (`null`) y una secuencia final que culmine en victoria.

---

??? info "📊 Ver Modelo Mental del Reto (Diagrama de Flujo con Lambdas)"
    ```mermaid
    flowchart TD
        Entrada(["letraInput: Char?"]) --> NullCheck{"¿letraInput != null?<br/>(letraInput?.uppercaseChar())"}
        
        NullCheck -- "Es null" --> CallbackError["Invocar lambda: alErrorInput()"]
        NullCheck -- "Válido" --> YaProbada{"¿letra in letrasProbadas?"}
        
        YaProbada -- "Sí" --> CallbackRepetir["Invocar lambda: alRepetir(letra)"]
        YaProbada -- "No" --> Acierto{"¿letra in palabraSecreta?"}
        
        Acierto -- "Sí" --> CallbackAcierto["Invocar lambda: alAcertar(letra, probadas + letra)"]
        Acierto -- "No" --> CallbackFallo["Invocar lambda: alFallar(letra, probadas + letra, vidas - 1)"]
    ```

??? question "🧠 Preguntas de Reflexión Previa (Aprender a Pensar)"
    Antes de examinar la solución o las pistas, reflexiona sobre estos principios de diseño funcional:

    - **¿Cómo acumulamos letras sin utilizar un `Set<Char>`?**  
      En Kotlin, un `String` es una secuencia inmutable de caracteres. Puedes acumular letras en una variable `var letrasProbadas = ""` y concatenar nuevas letras con `letrasProbadas += letra`. El operador `in` comprueba pertenencia de un `Char` en un `String` de forma instantánea.

    - **¿Por qué emplear callbacks en lugar de retornar códigos de estado enteros (ej. 0 = OK, 1 = Error)?**  
      En interfaces reactivas modernas como Jetpack Compose o Flutter, los componentes no consultan códigos de retorno, sino que emiten eventos hacia arriba (*event bubbling*) mediante lambdas (`onClick`, `onValueChange`). Este patrón desacopla la lógica del juego de la presentación.

    - **¿Por qué la cláusula de guarda con Elvis utiliza `?: run { ... return }`?**  
      Permite ejecutar un bloque de código secundario (el callback de error) y forzar la salida inmediata de la función sin anidar bloques `if-else` profundos, manteniendo el código plano y legible.

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
            alErrorInput()
            return
        }
        ```

    === "Pista 3: Comprobación de Victoria con `.all`"
        Para saber si el jugador ha adivinado la palabra completa de forma declarativa:
        ```kotlin
        fun String.estaAdivinada(probadas: String): Boolean =
            this.all { c -> c in probadas }
        ```

??? example "🖥️ Ver Salida Esperada en Consola (Ejemplo de Partida)"
    ```text
    === EL AHORCADO KOTLIN (LAMBDAS & NULL SAFETY) ===
    Palabra: _ _ _ _ _ _ | Vidas: 6 | Letras probadas: ''

    -> Intentando con 'O'...
    ¡Acierto! La letra 'O' está en la palabra.
    Palabra: _ O _ _ _ _ | Vidas: 6 | Letras probadas: 'O'

    -> Intentando con 'Z'...
    ¡Fallo! La letra 'Z' no está. Vidas restantes: 5
    Palabra: _ O _ _ _ _ | Vidas: 5 | Letras probadas: 'OZ'

    -> Intentando con null (entrada no válida)...
    [ALERTA NULL]: No se ha introducido ninguna letra válida.

    -> Intentando con 'K', 'T', 'L', 'I', 'N'...
    ¡VICTORIA! 🎉 Has completado la palabra secreta: KOTLIN
    ```

??? tip "💻 Ver Solución Comentada Paso a Paso"
    ```kotlin
    package b02_funciones_lambdas

    // 1. Función de extensión sobre String para ocultar caracteres
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
        alAcertar: (letra: Char, nuevasProbadas: String) -> Unit,
        alFallar: (letra: Char, nuevasProbadas: String, vidasRestantes: Int) -> Unit,
        alRepetir: (letra: Char) -> Unit,
        alErrorInput: () -> Unit
    ) {
        // Cláusula de guarda con Null Safety: safe call y elvis con return
        val letra = letraInput?.uppercaseChar() ?: run {
            alErrorInput()
            return
        }

        if (letra in letrasProbadas) {
            alRepetir(letra)
            return
        }

        val nuevasProbadas = letrasProbadas + letra

        if (letra in palabraSecreta) {
            alAcertar(letra, nuevasProbadas)
        } else {
            val nuevasVidas = vidasActuales - 1
            alFallar(letra, nuevasProbadas, nuevasVidas)
        }
    }

    fun main() {
        println("=== EL AHORCADO KOTLIN (LAMBDAS & NULL SAFETY) ===")

        val palabraSecreta = "KOTLIN"
        var letrasProbadas = ""
        var vidasRestantes = 6

        println("Palabra: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes | Letras probadas: '$letrasProbadas'")

        // Intento 1: Acierto
        println("\n-> Intentando con 'O'...")
        procesarIntento(
            letraInput = 'O',
            palabraSecreta = palabraSecreta,
            letrasProbadas = letrasProbadas,
            vidasActuales = vidasRestantes,
            alAcertar = { letra, nuevasProbadas ->
                letrasProbadas = nuevasProbadas
                println("¡Acierto! La letra '$letra' está en la palabra.")
            },
            alFallar = { _, nuevasProbadas, nuevasVidas ->
                letrasProbadas = nuevasProbadas
                vidasRestantes = nuevasVidas
            },
            alRepetir = { println("La letra '$it' ya había sido probada.") },
            alErrorInput = { println("[ERROR]: Letra nula") }
        )
        println("Palabra: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes | Letras probadas: '$letrasProbadas'")

        // Intento 2: Fallo
        println("\n-> Intentando con 'Z'...")
        procesarIntento(
            letraInput = 'Z',
            palabraSecreta = palabraSecreta,
            letrasProbadas = letrasProbadas,
            vidasActuales = vidasRestantes,
            alAcertar = { _, nuevasProbadas -> letrasProbadas = nuevasProbadas },
            alFallar = { letra, nuevasProbadas, nuevasVidas ->
                letrasProbadas = nuevasProbadas
                vidasRestantes = nuevasVidas
                println("¡Fallo! La letra '$letra' no está. Vidas restantes: $nuevasVidas")
            },
            alRepetir = { println("La letra '$it' ya había sido probada.") },
            alErrorInput = { println("[ERROR]: Letra nula") }
        )
        println("Palabra: ${palabraSecreta.enmascarar(letrasProbadas)} | Vidas: $vidasRestantes | Letras probadas: '$letrasProbadas'")

        // Intento 3: Entrada Nula
        println("\n-> Intentando con null (entrada no válida)...")
        procesarIntento(
            letraInput = null,
            palabraSecreta = palabraSecreta,
            letrasProbadas = letrasProbadas,
            vidasActuales = vidasRestantes,
            alAcertar = { _, _ -> },
            alFallar = { _, _, _ -> },
            alRepetir = {},
            alErrorInput = { println("[ALERTA NULL]: No se ha introducido ninguna letra válida.") }
        )

        // Intento 4: Secuencia de letras ganadoras
        println("\n-> Intentando con 'K', 'T', 'L', 'I', 'N'...")
        val letrasRestantes = "KTLIN"
        for (i in 0 until letrasRestantes.length) {
            val charActual = letrasRestantes[i]
            procesarIntento(
                letraInput = charActual,
                palabraSecreta = palabraSecreta,
                letrasProbadas = letrasProbadas,
                vidasActuales = vidasRestantes,
                alAcertar = { _, nuevasProbadas -> letrasProbadas = nuevasProbadas },
                alFallar = { _, _, _ -> },
                alRepetir = {},
                alErrorInput = {}
            )
        }

        if (palabraSecreta.estaAdivinada(letrasProbadas)) {
            println("¡VICTORIA! 🎉 Has completado la palabra secreta: $palabraSecreta")
        }
    }
    ```
