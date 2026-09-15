# Bloque 3: POO, Data Classes, Tipos Sellados y Wordle

En este tercer bloque de actividades pondrás en práctica la **Programación Orientada a Objetos idiomática en Kotlin**: cómo eliminar el código repetitivo de Java mediante constructores primarios, cómo modelar estados seguros mediante `data class` y `sealed interface`, y cómo utilizar `companion object` para definir miembros estáticos.

📁 **Paquete de trabajo:** `package b03_poo_sealed`  
Ubicación en tu proyecto: `src/main/kotlin/b03_poo_sealed/`

---

## 🟢 Nivel Básico (Consolidación POO)

### Ejercicio 3.1: Constructor Primario y Bloque `init`
📄 **Archivo:** `E01_ConstructorPrimarioInit.kt`

#### 1. Enunciado y Requisitos
1. Diseña una clase `PersonajeJuego` con constructor primario en la cabecera que contenga:
   - `val nombre: String`
   - `var nivel: Int = 1`
   - `var puntosVida: Int = 100`
2. En el bloque `init`, valida mediante `require()` que:
   - El nombre no esté en blanco (`nombre.isNotBlank()`).
   - El nivel sea al menos 1 (`nivel >= 1`).
   - Los puntos de vida iniciales sean estrictamente positivos (`puntosVida > 0`).
3. Añade un método `recibirDano(cantidad: Int)` que reste vida asegurando que nunca baje de 0 (`puntosVida = (puntosVida - cantidad).coerceAtLeast(0)`).

#### 2. Salida Esperada en Consola
```text
-> Héroe 'Artorias' creado con éxito (Nivel 5, 120 PV).
Artorias recibe 40 de daño. PV restantes: 80
Artorias recibe 100 de daño. PV restantes: 0 (¡Derrotado!)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    class PersonajeJuego(
        val nombre: String,
        var nivel: Int = 1,
        var puntosVida: Int = 100
    ) {
        init {
            require(nombre.isNotBlank()) { "El nombre no puede estar vacío." }
            require(nivel >= 1) { "El nivel debe ser al menos 1." }
            require(puntosVida > 0) { "Los puntos de vida deben ser positivos." }
            println("-> Héroe '$nombre' creado con éxito (Nivel $nivel, $puntosVida PV).")
        }

        fun recibirDano(cantidad: Int) {
            puntosVida = (puntosVida - cantidad).coerceAtLeast(0)
            val estado = if (puntosVida == 0) "(¡Derrotado!)" else ""
            println("$nombre recibe $cantidad de daño. PV restantes: $puntosVida $estado")
        }
    }

    fun main() {
        val heroe = PersonajeJuego("Artorias", nivel = 5, puntosVida = 120)
        heroe.recibirDano(40)
        heroe.recibirDano(100)
    }
    ```

---

### Ejercicio 3.2: Data Classes y Generación de Copias con `.copy()`
📄 **Archivo:** `E02_DataClassesCopy.kt`

#### 1. Enunciado y Requisitos
1. Modela una `data class VideojuegoItem(val id: Long, val titulo: String, val precio: Double, val enOferta: Boolean = false)`.
2. Crea una instancia de un videojuego a precio normal (`49.99 €`).
3. Utiliza el método `.copy()` para generar una nueva instancia que represente el juego en rebajas con un precio rebajado a `29.99 €` y `enOferta = true`.
4. Comprueba mediante `println` que el objeto original permanece inalterado.
5. Utiliza la sintaxis de **desestructuración** para extraer el título y el precio rebajado en dos variables independientes.

#### 2. Salida Esperada en Consola
```text
Original: VideojuegoItem(id=1, titulo=Dark Souls, precio=49.99, enOferta=false)
Rebajado: VideojuegoItem(id=1, titulo=Dark Souls, precio=29.99, enOferta=true)
Desestructuración -> Dark Souls en oferta por solo 29.99 €
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    data class VideojuegoItem(
        val id: Long,
        val titulo: String,
        val precio: Double,
        val enOferta: Boolean = false
    )

    fun main() {
        val original = VideojuegoItem(1L, "Dark Souls", 49.99)

        // Obtenemos una nueva instancia inmutable modificada:
        val rebajado = original.copy(precio = 29.99, enOferta = true)

        println("Original: $original")
        println("Rebajado: $rebajado")

        // Desestructuración automática provista por la data class:
        val (_, titulo, precioOferta) = rebajado
        println("Desestructuración -> $titulo en oferta por solo $precioOferta €")
    }
    ```

---

## 🟡 Nivel Intermedio (Companion Objects y Enums)

### Ejercicio 3.3: `companion object` para Constantes y Métodos Factoría
📄 **Archivo:** `E03_CompanionObjectTags.kt`

#### 1. Enunciado y Requisitos
1. Diseña una clase `ConexionServidor private constructor(val url: String, val puerto: Int)` con constructor primario privado (impidiendo instanciación directa arbitraria).
2. En su `companion object`, define:
   - Una constante `TAG = "SERVER_NET"`
   - Un método factoría `paraDesarrollo(): ConexionServidor` que apunte a `"http://localhost"` y puerto `8080`.
   - Un método factoría `paraProduccion(): ConexionServidor` que apunte a `"https://api.gamevault.es"` y puerto `443`.
3. Prueba ambas factorías desde `main()` imprimiendo sus datos junto con el `TAG`.

#### 2. Salida Esperada en Consola
```text
[SERVER_NET]: Servidor DEV listo en http://localhost:8080
[SERVER_NET]: Servidor PROD listo en https://api.gamevault.es:443
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    class ConexionServidor private constructor(val url: String, val puerto: Int) {

        companion object {
            const val TAG = "SERVER_NET"

            fun paraDesarrollo(): ConexionServidor {
                return ConexionServidor("http://localhost", 8080)
            }

            fun paraProduccion(): ConexionServidor {
                return ConexionServidor("https://api.gamevault.es", 443)
            }
        }

        fun mostrarInfo() = println("[$TAG]: Servidor listo en $url:$puerto")
    }

    fun main() {
        val dev = ConexionServidor.paraDesarrollo()
        val prod = ConexionServidor.paraProduccion()

        dev.mostrarInfo()
        prod.mostrarInfo()
    }
    ```

---

### Ejercicio 3.4: `enum class` con Propiedades y `.entries`
📄 **Archivo:** `E04_EnumEntriesWhen.kt`

#### 1. Enunciado y Requisitos
1. Crea un `enum class CategoriaJuego(val etiqueta: String, val icono: String)` con valores `ACCION`, `RPG`, `ESTRATEGIA`, `INDIE`.
2. En `main()`, recorre todas las categorías utilizando la propiedad moderna **`.entries`** de Kotlin 1.9+.
3. Implementa una función `calcularBonusCategoria(cat: CategoriaJuego): Double` evaluada con un `when` exhaustivo sin `else`.

#### 2. Salida Esperada en Consola
```text
Categorías registradas:
- ACCION (⚔️ Acción) -> Multiplicador: 1.2
- RPG (🛡️ Rol y Aventura) -> Multiplicador: 1.5
- ESTRATEGIA (♟️ Estrategia) -> Multiplicador: 1.1
- INDIE (🎨 Creación Indie) -> Multiplicador: 1.0
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    enum class CategoriaJuego(val etiqueta: String, val icono: String) {
        ACCION("Acción", "⚔️"),
        RPG("Rol y Aventura", "🛡️"),
        ESTRATEGIA("Estrategia", "♟️"),
        INDIE("Creación Indie", "🎨")
    }

    fun calcularBonusCategoria(categoria: CategoriaJuego): Double {
        return when (categoria) {
            CategoriaJuego.ACCION -> 1.2
            CategoriaJuego.RPG -> 1.5
            CategoriaJuego.ESTRATEGIA -> 1.1
            CategoriaJuego.INDIE -> 1.0
        }
    }

    fun main() {
        println("Categorías registradas:")
        for (cat in CategoriaJuego.entries) {
            val bonus = calcularBonusCategoria(cat)
            println("- ${cat.name} (${cat.icono} ${cat.etiqueta}) -> Multiplicador: $bonus")
        }
    }
    ```

---

## 🔴 Nivel Avanzado (Sealed Types y Reto Lúdico)

### Ejercicio 3.5: `sealed interface` y Patrón `UiState`
📄 **Archivo:** `E05_SealedInterfaceUiState.kt`

#### 1. Enunciado y Requisitos
Modela la jerarquía sellada de estados para una pantalla Android:
1. `sealed interface CatalogoUiState`:
   - `data object Cargando : CatalogoUiState`
   - `data class Exito(val items: List<String>) : CatalogoUiState`
   - `data class Error(val mensaje: String) : CatalogoUiState`
2. Implementa una función `renderizarUi(estado: CatalogoUiState)` que evalúe con `when` exhaustivo y compruebe el Smart Casting.

#### 2. Salida Esperada en Consola
```text
⏳ Mostrando CircularProgressIndicator...
✅ Mostrando 2 elementos en LazyColumn: [Elden Ring, Hades]
❌ Error en UI: Error 404 - Servidor no encontrado
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    sealed interface CatalogoUiState {
        data object Cargando : CatalogoUiState
        data class Exito(val items: List<String>) : CatalogoUiState
        data class Error(val mensaje: String) : CatalogoUiState
    }

    fun renderizarUi(estado: CatalogoUiState) {
        when (estado) {
            is CatalogoUiState.Cargando -> println("⏳ Mostrando CircularProgressIndicator...")
            is CatalogoUiState.Exito -> println("✅ Mostrando ${estado.items.size} elementos en LazyColumn: ${estado.items}")
            is CatalogoUiState.Error -> println("❌ Error en UI: ${estado.mensaje}")
        }
    }

    fun main() {
        renderizarUi(CatalogoUiState.Cargando)
        renderizarUi(CatalogoUiState.Exito(listOf("Elden Ring", "Hades")))
        renderizarUi(CatalogoUiState.Error("Error 404 - Servidor no encontrado"))
    }
    ```

---

### Reto 3.6: El Motor de Wordle en Consola
📄 **Archivo:** `Reto03_WordleJuego.kt`

#### 1. Contexto y Objetivos
Implementarás el motor de validación del juego **Wordle** (adivinar una palabra de 5 letras en 6 intentos), aplicando `enum class`, `data class`, `sealed interface` y colecciones funcionales.

#### 2. Requisitos Técnicos
1. Define un `enum class LetraResultado(val emoji: String)`:
   - `VERDE("🟩")`: La letra está en la posición exacta.
   - `AMARILLO("🟨")`: La letra está en la palabra pero en otra posición.
   - `GRIS("⬛")`: La letra no está en la palabra.
2. Crea una `data class IntentoWordle(val intento: String, val evaluacion: List<LetraResultado>)`.
3. Define una `sealed interface EstadoWordle`:
   - `data class EnCurso(val intentosRestantes: Int, val historial: List<IntentoWordle>) : EstadoWordle`
   - `data class Victoria(val intentosUsados: Int, val palabra: String) : EstadoWordle`
   - `data class Derrota(val palabraCorrecta: String) : EstadoWordle`
4. Implementa la función `evaluarIntento(palabraSecreta: String, intentoUsuario: String): List<LetraResultado>` utilizando comparaciones funcionales por posición.

#### 3. Salida de Ejemplo en Consola
```text
=== MOTOR DE WORDLE KOTLIN ===
Palabra Secreta: PLAYA (5 letras)
Intento 1: PIANO -> 🟩 ⬛ 🟩 ⬛ 🟨 (P y A exactas, O no existe)
Intento 2: PLAZA -> 🟩 🟩 🟩 ⬛ 🟩 (P, L, A y A exactas)
Intento 3: PLAYA -> 🟩 🟩 🟩 🟩 🟩
¡VICTORIA! 🎉 Adivinaste la palabra PLAYA en 3 intentos.
```

#### 4. Solución Comentada
??? tip "Ver solución comentada paso a paso"
    ```kotlin
    package b03_poo_sealed

    enum class LetraResultado(val emoji: String) {
        VERDE("🟩"),
        AMARILLO("🟨"),
        GRIS("⬛")
    }

    data class IntentoWordle(val palabra: String, val evaluacion: List<LetraResultado>)

    sealed interface EstadoWordle {
        data class EnCurso(val intentosRestantes: Int, val historial: List<IntentoWordle>) : EstadoWordle
        data class Victoria(val intentosUsados: Int, val palabra: String) : EstadoWordle
        data class Derrota(val palabraCorrecta: String) : EstadoWordle
    }

    fun evaluarIntento(secreta: String, intento: String): List<LetraResultado> {
        require(secreta.length == 5 && intento.length == 5) { "Ambas palabras deben tener 5 letras." }

        return intento.mapIndexed { i, caracter ->
            when {
                caracter == secreta[i] -> LetraResultado.VERDE
                caracter in secreta -> LetraResultado.AMARILLO
                else -> LetraResultado.GRIS
            }
        }
    }

    fun jugarTurno(estadoActual: EstadoWordle.EnCurso, secreta: String, intento: String): EstadoWordle {
        val evaluacion = evaluarIntento(secreta, intento.uppercase())
        val nuevoIntento = IntentoWordle(intento.uppercase(), evaluacion)
        val nuevoHistorial = estadoActual.historial + nuevoIntento

        return when {
            evaluacion.all { it == LetraResultado.VERDE } -> {
                EstadoWordle.Victoria(nuevoHistorial.size, secreta)
            }
            estadoActual.intentosRestantes <= 1 -> {
                EstadoWordle.Derrota(secreta)
            }
            else -> {
                estadoActual.copy(
                    intentosRestantes = estadoActual.intentosRestantes - 1,
                    historial = nuevoHistorial
                )
            }
        }
    }

    fun main() {
        val secreta = "PLAYA"
        var estado: EstadoWordle = EstadoWordle.EnCurso(intentosRestantes = 6, historial = emptyList())

        println("=== MOTOR DE WORDLE KOTLIN ===")
        val intentos = listOf("PIANO", "PLAZA", "PLAYA")

        for (intento in intentos) {
            if (estado !is EstadoWordle.EnCurso) break

            println("Probando '$intento'...")
            estado = jugarTurno(estado, secreta, intento)

            when (val actual = estado) {
                is EstadoWordle.EnCurso -> {
                    val ultimo = actual.historial.last()
                    val emojis = ultimo.evaluacion.joinToString(" ") { it.emoji }
                    println("Resultado: $emojis (Te quedan ${actual.intentosRestantes} intentos)")
                }
                is EstadoWordle.Victoria -> {
                    println("🟩 🟩 🟩 🟩 🟩")
                    println("¡VICTORIA! 🎉 Adivinaste la palabra ${actual.palabra} en ${actual.intentosUsados} intentos.")
                }
                is EstadoWordle.Derrota -> {
                    println("¡DERROTA! 💀 La palabra secreta era: ${actual.palabraCorrecta}")
                }
            }
        }
    }
    ```
