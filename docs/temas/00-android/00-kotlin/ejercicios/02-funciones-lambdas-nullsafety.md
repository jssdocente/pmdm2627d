# Bloque 2: Funciones, Lambdas y Null Safety

En este segundo bloque de actividades dominarás el motor que hace funcionar la sintaxis declarativa de **Jetpack Compose**: las expresiones lambda, el paso de funciones de orden superior y la eliminación definitiva de excepciones de puntero nulo mediante los operadores de **Null Safety**.

📁 **Paquete de trabajo:** `package b02_funciones_lambdas`  
Ubicación en tu proyecto: `src/main/kotlin/b02_funciones_lambdas/`

---

## 🟢 Nivel Básico (Consolidación Sintáctica)

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
En Jetpack Compose, componentes como `Button` o `Text` tienen múltiples parámetros configurables con valores sensatos por defecto.
1. Implementa una función `renderizarBoton(texto: String, colorHex: String = "#6200EE", habilitado: Boolean = true, paddingDp: Int = 16)` que imprima una representación textual del botón.
2. Realiza 3 llamadas distintas:
   - Una pasando únicamente el texto obligatorio.
   - Otra cambiando solo el color.
   - Otra deshabilitando el botón y cambiando el padding mediante argumentos con nombre.

#### 2. Salida Esperada en Consola
```text
[BOTÓN]: "Aceptar" | Color: #6200EE | Activo: true | Padding: 16dp
[BOTÓN]: "Cancelar" | Color: #B00020 | Activo: true | Padding: 16dp
[BOTÓN]: "Guardar" | Color: #6200EE | Activo: false | Padding: 24dp
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
        println("""[BOTÓN]: "$texto" | Color: $colorHex | Activo: $habilitado | Padding: ${paddingDp}dp""")
    }

    fun main() {
        renderizarBoton("Aceptar")
        renderizarBoton("Cancelar", colorHex = "#B00020")
        renderizarBoton(texto = "Guardar", habilitado = false, paddingDp = 24)
    }
    ```

---

## 🟡 Nivel Intermedio (Lambdas y Null Safety)

### Ejercicio 2.3: Lambdas y Parámetro Implícito `it`
📄 **Archivo:** `E03_LambdasEIt.kt`

#### 1. Enunciado y Requisitos
1. Declara una función de orden superior `transformarLista(numeros: List<Int>, operacion: (Int) -> Int): List<Int>`.
2. Dentro de la función, recorre la lista aplicando la lambda a cada número y retorna una nueva lista inmutable con los resultados.
3. Invoca la función desde `main()` usando la **sintaxis de lambda colgante (*Trailing Lambda*)** y el parámetro implícito `it` para:
   - Calcular el cuadrado de cada número (`{ it * it }`).
   - Restar 1 a cada número (`{ it - 1 }`).

#### 2. Salida Esperada en Consola
```text
Originales: [2, 4, 6, 8]
Cuadrados: [4, 16, 36, 64]
Menos uno: [1, 3, 5, 7]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun transformarLista(numeros: List<Int>, operacion: (Int) -> Int): List<Int> {
        val resultado = mutableListOf<Int>()
        for (n in numeros) {
            resultado.add(operacion(n))
        }
        return resultado.toList() // Retornamos copia de solo lectura
    }

    fun main() {
        val lista = listOf(2, 4, 6, 8)

        // Trailing lambda syntax: la lambda se coloca fuera de los paréntesis ()
        val cuadrados = transformarLista(lista) { it * it }
        val restados = transformarLista(lista) { it - 1 }

        println("Originales: $lista")
        println("Cuadrados: $cuadrados")
        println("Menos uno: $restados")
    }
    ```

---

### Ejercicio 2.4: Null Safety: Safe Call (`?.`), Elvis (`?:`) y `let`
📄 **Archivo:** `E04_NullSafetyElvis.kt`

#### 1. Enunciado y Requisitos
1. Simula la lectura de un perfil de usuario procedente de un formulario web donde varios campos pueden llegar como `null`:
   - `email: String?`
   - `apodo: String?`
   - `puntosExtra: Int?`
2. Implementa una función `formatearPerfil(email: String?, apodo: String?, puntosExtra: Int?)`:
   - El apodo debe mostrarse tal cual si existe, o `"Jugador Anónimo"` si es nulo (usar operador Elvis `?:`).
   - Los puntos extra deben sumarse a un bono base de 100 puntos; si son nulos, el total debe ser 100.
   - Si el email no es nulo, imprime un mensaje de confirmación enviándole un correo usando `email?.let { ... }`.

#### 2. Salida Esperada en Consola
```text
=== FICHA DEL JUGADOR ===
Apodo: CazadorNocturno
Puntuación total: 150 pts
-> Correo de bienvenida enviado a: cazador@dam.es
--------------------------
=== FICHA DEL JUGADOR ===
Apodo: Jugador Anónimo
Puntuación total: 100 pts
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun formatearPerfil(email: String?, apodo: String?, puntosExtra: Int?) {
        println("=== FICHA DEL JUGADOR ===")
        val nombreVisible = apodo ?: "Jugador Anónimo"
        val puntuacionFinal = 100 + (puntosExtra ?: 0)

        println("Apodo: $nombreVisible")
        println("Puntuación total: $puntuacionFinal pts")

        // Modismo Android: ejecutar bloque solo si email no es nulo
        email?.let { direccion ->
            println("-> Correo de bienvenida enviado a: $direccion")
        }
    }

    fun main() {
        formatearPerfil("cazador@dam.es", "CazadorNocturno", 50)
        println("--------------------------")
        formatearPerfil(null, null, null)
    }
    ```

---

## 🔴 Nivel Avanzado (Extensiones y Reto Lúdico)

### Ejercicio 2.5: Funciones de Extensión
📄 **Archivo:** `E05_ExtensionFunctions.kt`

#### 1. Enunciado y Requisitos
1. Crea una función de extensión sobre la clase estándar `String` llamada `formatearComoTitulo(): String` que convierta una frase a formato título (la primera letra de cada palabra en mayúscula y el resto en minúscula).
2. Crea una función de extensión sobre `Double` llamada `aMonedaEuros(): String` que formatee el número con 2 decimales y el símbolo `"€"` (ej. `19.5.aMonedaEuros()` -> `"19,50 €"`).

#### 2. Salida Esperada en Consola
```text
Título limpio: The Legend Of Zelda: Tears Of The Kingdom
Precio formateado: 69.99 €
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b02_funciones_lambdas

    fun String.formatearComoTitulo(): String {
        return this.split(" ")
            .filter { it.isNotBlank() }
            .joinToString(" ") { palabra ->
                palabra.lowercase().replaceFirstChar { it.uppercase() }
            }
    }

    fun Double.aMonedaEuros(): String = "%.2f €".format(this)

    fun main() {
        val juegoSucio = "the legend OF zelda: tears OF the kingdom"
        println("Título limpio: ${juegoSucio.formatearComoTitulo()}")

        val precio = 69.99
        println("Precio formateado: ${precio.aMonedaEuros()}")
    }
    ```

---

### Reto 2.6: El Juego del Ahorcado Funcional (*Hangman*)
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

    fun procesarLetra(partida: PartidaAhorcado, letraIngresada: Char): IntentoResultado {
        val letra = letraIngresada.uppercaseChar()

        if (letra in partida.letrasProbadas) {
            return IntentoResultado.YaProbada
        }

        val nuevasLetras = partida.letrasProbadas + letra

        return if (letra in partida.palabraSecreta) {
            val haGanado = partida.palabraSecreta.all { it in nuevasLetras }
            if (haGanado) {
                IntentoResultado.Victoria(partida.palabraSecreta)
            } else {
                IntentoResultado.LetraAcertada(partida.copy(letrasProbadas = nuevasLetras))
            }
        } else {
            val nuevasVidas = partida.vidasRestantes - 1
            if (nuevasVidas <= 0) {
                IntentoResultado.Derrota(partida.palabraSecreta)
            } else {
                IntentoResultado.LetraFallada(partida.copy(letrasProbadas = nuevasLetras, vidasRestantes = nuevasVidas))
            }
        }
    }

    fun main() {
        var partida = PartidaAhorcado("KOTLIN")
        println("=== EL AHORCADO KOTLIN ===")
        println("Palabra: ${partida.palabraSecreta.ocultar(partida.letrasProbadas)} | Vidas: ${partida.vidasRestantes}")

        val intentosSimulados = listOf('o', 'z', 'k', 't', 'l', 'i', 'n')

        for (intento in intentosSimulados) {
            println("-> Probamos '${intento.uppercaseChar()}'...")
            when (val res = procesarLetra(partida, intento)) {
                is IntentoResultado.LetraAcertada -> {
                    partida = res.nuevaPartida
                    println("¡Acierto! -> ${partida.palabraSecreta.ocultar(partida.letrasProbadas)} (Vidas: ${partida.vidasRestantes})")
                }
                is IntentoResultado.LetraFallada -> {
                    partida = res.nuevaPartida
                    println("¡Fallo! -> ${partida.palabraSecreta.ocultar(partida.letrasProbadas)} (Vidas: ${partida.vidasRestantes})")
                }
                is IntentoResultado.YaProbada -> println("Letra ya intentada anteriormente.")
                is IntentoResultado.Victoria -> {
                    println("¡VICTORIA! 🎉 Has completado la palabra: ${res.palabra}")
                    break
                }
                is IntentoResultado.Derrota -> {
                    println("¡GAME OVER! 💀 La palabra secreta era: ${res.palabra}")
                    break
                }
            }
        }
    }
    ```
