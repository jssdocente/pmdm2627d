# Bloque 2: Funciones, Lambdas y Null Safety

En este segundo bloque dominarás la sintaxis de funciones de orden superior, la manipulación segura de valores nulos y el diseño de eventos mediante lambdas. En **Jetpack Compose**, cada interacción de usuario (como un clic en un botón) se comunica a la lógica mediante lambdas (*State Hoisting*).

📁 **Paquete de trabajo:** `package b02_funciones_lambdas`  
Ubicación en tu proyecto: `src/main/kotlin/b02_funciones_lambdas/`

---

## 🟢 Nivel Básico (Funciones, Parámetros y Lambdas Simples)

### Ejercicio 2.1: Funciones de Expresión Única y Argumentos con Nombre
📄 **Archivo:** `E01_FuncionesExpresionUnica.kt`

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

### Ejercicio 2.6: Funciones de Orden Superior Propias
📄 **Archivo:** `E06_FuncionOrdenSuperiorPropia.kt`

#### 1. Enunciado y Requisitos

1. Crea tu propia función de orden superior `filtrarTitulos(titulos: List<String>, criterio: (String) -> Boolean): List<String>`.

2. La función debe recorrer la lista y devolver una nueva lista solo con aquellos elementos que hagan que la lambda `criterio` devuelva `true`.

3. Invócala para filtrar títulos que comiencen por la letra `'Z'`.

4. Invócala para filtrar títulos con más de 10 caracteres.

#### 2. Salida Esperada en Consola

```text
Catálogo completo: [Zelda, Metroid, Xenoblade, Zork, Celeste]
Empiezan por 'Z': [Zelda, Zork]
Más de 7 letras: [Xenoblade, Celeste]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun filtrarTitulos(titulos: List<String>, criterio: (String) -> Boolean): List<String> {
        val resultado = mutableListOf<String>()
        for (t in titulos) {
            if (criterio(t)) {
                resultado.add(t)
            }
        }
        return resultado.toList()
    }

    fun main() {
        val juegos = listOf("Zelda", "Metroid", "Xenoblade", "Zork", "Celeste")
        println("Catálogo completo: $juegos")

        val conZ = filtrarTitulos(juegos) { it.startsWith("Z") }
        println("Empiezan por 'Z': $conZ")

        val largos = filtrarTitulos(juegos) { it.length > 7 }
        println("Más de 7 letras: $largos")
    }
    ```

---

## 🟡 Nivel Intermedio (State Hoisting, Null Safety y Extensiones)

### Ejercicio 2.7: El Parámetro Implícito `it`
📄 **Archivo:** `E07_ParametroImplicitoIt.kt`

#### 1. Enunciado y Requisitos

1. Crea una lista inmutable de nombres de monstruos: `listOf("Goblin", "Orco", "Dragón", "Esqueleto", "Slime")`.

2. Utiliza la función de extensión `.filter` empleando la variable implícita `it` para conservar los que tengan más de 5 caracteres.

3. Encadena un `.map` usando `it` para convertir los nombres a mayúsculas.

#### 2. Salida Esperada en Consola

```text
Monstruos originales: [Goblin, Orco, Dragón, Esqueleto, Slime]
Monstruos épicos: [GOBLIN, DRAGÓN, ESQUELETO]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun main() {
        val monstruos = listOf("Goblin", "Orco", "Dragón", "Esqueleto", "Slime")

        val epicos = monstruos
            .filter { it.length > 5 }
            .map { it.uppercase() }

        println("Monstruos originales: $monstruos")
        println("Monstruos épicos: $epicos")
    }
    ```

---

### Ejercicio 2.8: Sintaxis de Lambda Colgante (*Trailing Lambda*) y State Hoisting
📄 **Archivo:** `E08_TrailingLambdaStateHoisting.kt`

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

### Reto 2.14: El Juego del Ahorcado Funcional (*Hangman*)
📄 **Archivo:** `Reto02_AhorcadoJuego.kt`

#### 1. Contexto y Objetivos

Construirás la lógica central del clásico juego del Ahorcado aplicando **inmutabilidad de estados**, conjuntos (`Set`), funciones de extensión y tipos sellados (`sealed interface`).

#### 2. Requisitos Funcionales

1. Modela el estado de la partida con una clase inmutable:

    ```kotlin
    data class PartidaAhorcado(
        val palabraSecreta: String,
        val letrasProbadas: Set<Char> = emptySet(),
        val vidasRestantes: Int = 6
    )
    ```

2. Crea una función de extensión `String.ocultar(probadas: Set<Char>): String` que sustituya por un guion bajo `'_'` cualquier letra que aún no haya sido adivinada, separando los caracteres con espacios.

3. Define un `sealed interface IntentoResultado`:

    - `data class LetraAcertada(val nuevaPartida: PartidaAhorcado) : IntentoResultado`

    - `data class LetraFallada(val nuevaPartida: PartidaAhorcado) : IntentoResultado`

    - `data object YaProbada : IntentoResultado`

    - `data class Victoria(val palabra: String) : IntentoResultado`

    - `data class Derrota(val palabra: String) : IntentoResultado`

4. Implementa la función `procesarLetra(partida: PartidaAhorcado, letra: Char): IntentoResultado` que genere una nueva instancia de `partida` con `.copy()` sin mutar la anterior.

#### 3. Salida de Ejemplo en Consola

```text
=== EL AHORCADO KOTLIN ===
Palabra: _ _ _ _ _ _ | Vidas: 6 | Letras probadas: []
-> Turno 1: Probamos 'O'... ¡Acierto!
Palabra: _ O _ _ _ _ | Vidas: 6 | Letras probadas: [O]
-> Turno 2: Probamos 'Z'... ¡Fallo! Pierdes 1 vida.
Palabra: _ O _ _ _ _ | Vidas: 5 | Letras probadas: [O, Z]
-> Turno 3: Probamos 'K', 'T', 'L', 'I', 'N'...
¡VICTORIA! 🎉 Has adivinado la palabra: KOTLIN
```

#### 4. Solución Comentada
??? tip "Ver solución comentada paso a paso"
    ```kotlin
    package b02_funciones_lambdas

    data class PartidaAhorcado(
        val palabraSecreta: String,
        val letrasProbadas: Set<Char> = emptySet(),
        val vidasRestantes: Int = 6
    )

    fun String.ocultar(probadas: Set<Char>): String {
        return this.map { c -> if (c in probadas) c else '_' }.joinToString(" ")
    }

    sealed interface IntentoResultado {
        data class LetraAcertada(val nuevaPartida: PartidaAhorcado) : IntentoResultado
        data class LetraFallada(val nuevaPartida: PartidaAhorcado) : IntentoResultado
        data object YaProbada : IntentoResultado
        data class Victoria(val palabra: String) : IntentoResultado
        data class Derrota(val palabra: String) : IntentoResultado
    }

    fun procesarLetra(partida: PartidaAhorcado, letraRaw: Char): IntentoResultado {
        val letra = letraRaw.uppercaseChar()

        if (letra in partida.letrasProbadas) {
            return IntentoResultado.YaProbada
        }

        val nuevasLetras = partida.letrasProbadas + letra
        val acierto = letra in partida.palabraSecreta

        val nuevaPartida = if (acierto) {
            partida.copy(letrasProbadas = nuevasLetras)
        } else {
            partida.copy(
                letrasProbadas = nuevasLetras,
                vidasRestantes = partida.vidasRestantes - 1
            )
        }

        val todasAdivinadas = partida.palabraSecreta.all { it in nuevaPartida.letrasProbadas }

        return when {
            todasAdivinadas -> IntentoResultado.Victoria(partida.palabraSecreta)
            nuevaPartida.vidasRestantes <= 0 -> IntentoResultado.Derrota(partida.palabraSecreta)
            acierto -> IntentoResultado.LetraAcertada(nuevaPartida)
            else -> IntentoResultado.LetraFallada(nuevaPartida)
        }
    }

    fun main() {
        println("=== EL AHORCADO KOTLIN ===")
        var partida = PartidaAhorcado(palabraSecreta = "KOTLIN")
        println("Palabra: ${partida.palabraSecreta.ocultar(partida.letrasProbadas)} | Vidas: ${partida.vidasRestantes} | Letras probadas: ${partida.letrasProbadas}")

        println("-> Turno 1: Probamos 'O'... ¡Acierto!")
        when (val res = procesarLetra(partida, 'O')) {
            is IntentoResultado.LetraAcertada -> {
                partida = res.nuevaPartida
                println("Palabra: ${partida.palabraSecreta.ocultar(partida.letrasProbadas)} | Vidas: ${partida.vidasRestantes} | Letras probadas: ${partida.letrasProbadas}")
            }
            else -> {}
        }

        println("-> Turno 2: Probamos 'Z'... ¡Fallo! Pierdes 1 vida.")
        when (val res = procesarLetra(partida, 'Z')) {
            is IntentoResultado.LetraFallada -> {
                partida = res.nuevaPartida
                println("Palabra: ${partida.palabraSecreta.ocultar(partida.letrasProbadas)} | Vidas: ${partida.vidasRestantes} | Letras probadas: ${partida.letrasProbadas}")
            }
            else -> {}
        }

        println("-> Turno 3: Probamos 'K', 'T', 'L', 'I', 'N'...")
        listOf('K', 'T', 'L', 'I', 'N').forEach { l ->
            when (val res = procesarLetra(partida, l)) {
                is IntentoResultado.LetraAcertada -> partida = res.nuevaPartida
                is IntentoResultado.Victoria -> println("¡VICTORIA! 🎉 Has adivinado la palabra: ${res.palabra}")
                else -> {}
            }
        }
    }
    ```
