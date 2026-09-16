# Bloque 3: POO Idiomática, Data Classes y Tipos Sellados

En este tercer bloque dominarás la Programación Orientada a Objetos moderna en Kotlin: el diseño sin código repetitivo (*boilerplate*), las clases inmutables de datos (`data class`), los objetos únicos (`object`), las jerarquías selladas (`sealed interface`) para modelar estados de pantalla (**UiState**) y la varianza en tipos genéricos.

📁 **Paquete de trabajo:** `package b03_poo_sealed`  
Ubicación en tu proyecto: `src/main/kotlin/b03_poo_sealed/`

!!! info "📚 Apuntes Teóricos de Referencia"
    Para resolver las actividades de este bloque, puedes consultar los siguientes temas de los apuntes:

    - [Programación Orientada a Objetos (Clases, Herencia e Interfaces)](../21-poo.md)
    - [Singletons y Companion Object (Objetos y Factorías)](../22-objetos-anonimos.md)
    - [Data Classes (Modelos de Datos Inmutables)](../23-data-classes.md)
    - [Enum Classes (Tipos Enumerados y `.entries`)](../24-enum-classes.md)
    - [Genéricos (Parámetros de Tipo y Covarianza)](../25-genericos.md)
    - [Tipos Sellados (Sealed Classes/Interfaces y UI State)](../26-sealed-classes.md)

---

## 🟢 Nivel Básico (POO Idiomática, Constructores y Propiedades)

### Ejercicio 3.1: Constructor Primario y Bloque `init`
📄 **Archivo:** `E01_ConstructorPrimarioInit.kt`  
📚 **Teoría de referencia:** [Clases y Constructor Primario Idiomático](../21-poo.md#1-clases-y-constructor-primario-idiomatico)

#### 1. Enunciado y Requisitos

1. Declara una clase `Jugador` cuyo constructor primario declare directamente en la cabecera dos propiedades: `val alias: String` y `var nivel: Int = 1`.

2. Añade un bloque `init` que valide mediante `require(alias.isNotBlank())` que el alias no esté vacío, y que el nivel inicial sea al menos `1`.

3. Instancia dos jugadores válidos en `main()`.

4. Intenta instanciar un jugador con alias en blanco dentro de un bloque `try-catch` para capturar la excepción `IllegalArgumentException`.

#### 2. Salida Esperada en Consola

```text
Jugador creado: Alias=Aloy, Nivel=1
Jugador creado: Alias=Kratos, Nivel=50
Capturado error esperado al crear jugador inválido: Failed requirement.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    class Jugador(
        val alias: String,
        var nivel: Int = 1
    ) {
        init {
            require(alias.isNotBlank()) { "El alias no puede estar vacío o en blanco." }
            require(nivel >= 1) { "El nivel debe ser como mínimo 1." }
        }

        override fun toString(): String = "Jugador(alias='$alias', nivel=$nivel)"
    }

    fun main() {
        val j1 = Jugador("Aloy")
        val j2 = Jugador("Kratos", 50)
        println("Jugador creado: Alias=${j1.alias}, Nivel=${j1.nivel}")
        println("Jugador creado: Alias=${j2.alias}, Nivel=${j2.nivel}")

        try {
            Jugador("   ", 0)
        } catch (e: IllegalArgumentException) {
            println("Capturado error esperado al crear jugador inválido: ${e.message}")
        }
    }
    ```

---

### Ejercicio 3.2: Constructores Secundarios vs Valores por Defecto
📄 **Archivo:** `E02_ConstructoresSecundarios.kt`  
📚 **Teoría de referencia:** [El Bloque de Inicialización: init y Constructores Secundarios](../21-poo.md#2-el-bloque-de-inicializacion-init)

#### 1. Enunciado y Requisitos

En Kotlin casi siempre se prefieren **valores por defecto en el constructor primario**, pero los **constructores secundarios** (`constructor(...) : this(...)`) son necesarios al extender clases de la plataforma Android (como `View(context, attrs)`).

1. Modela una clase `ServidorPartida(val ip: String, val puerto: Int, val sslHabilitado: Boolean)`.

2. Proporciona un constructor secundario que reciba únicamente la dirección `ip` y asigne por defecto el puerto `8080` y `sslHabilitado = false`.

3. Proporciona un segundo constructor secundario que reciba una URL completa (ej. `"https://servidor.es:443"`) y extraiga los datos delegando al constructor primario.

4. Instancia servidores usando ambas vías y muestra sus propiedades.

#### 2. Salida Esperada en Consola

```text
Servidor 1 (Constructor secundario por IP): ServidorPartida(ip='192.168.1.50', puerto=8080, ssl=false)
Servidor 2 (Constructor secundario por URL): ServidorPartida(ip='servidor.es', puerto=443, ssl=true)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    class ServidorPartida(
        val ip: String,
        val puerto: Int,
        val sslHabilitado: Boolean
    ) {
        // Constructor secundario 1: delega en el primario con this(...)
        constructor(ip: String) : this(ip, 8080, false)

        // Constructor secundario 2: parsea una URL simulada
        constructor(urlCompleta: String, esHttps: Boolean) : this(
            ip = urlCompleta.substringAfter("://").substringBefore(":"),
            puerto = urlCompleta.substringAfterLast(":").toIntOrNull() ?: 80,
            sslHabilitado = esHttps
        )

        override fun toString(): String = "ServidorPartida(ip='$ip', puerto=$puerto, ssl=$sslHabilitado)"
    }

    fun main() {
        val s1 = ServidorPartida("192.168.1.50")
        val s2 = ServidorPartida("https://servidor.es:443", esHttps = true)

        println("Servidor 1 (Constructor secundario por IP): $s1")
        println("Servidor 2 (Constructor secundario por URL): $s2")
    }
    ```

---

### Ejercicio 3.3: Getters y Setters Personalizados con `field`
📄 **Archivo:** `E03_GettersSettersField.kt`  
📚 **Teoría de referencia:** [Propiedades y Acceso (field): Getters y Setters](../21-poo.md#3-propiedades-y-acceso-field)

#### 1. Enunciado y Requisitos

1. Modela una clase `BarraDeVida(val maxVida: Int = 100)`.

2. Declara una propiedad mutable `var vidaActual: Int = maxVida`.

3. Implementa un `set(value)` personalizado que asegure que la vida nunca sea menor que `0` ni mayor que `maxVida` utilizando el identificador especial **`field`** (backing field).

4. Añade una propiedad computada de solo lectura `val estaVivo: Boolean` con un `get()` personalizado que devuelva `vidaActual > 0`.

5. Realiza pruebas en `main()` intentando restar más daño del permitido.

#### 2. Salida Esperada en Consola

```text
Vida inicial: 100/100 | ¿Vivo? true
Recibiendo 40 de daño...
Vida: 60/100 | ¿Vivo? true
Recibiendo 9999 de daño letal...
Vida: 0/100 (clamp a 0) | ¿Vivo? false
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    class BarraDeVida(val maxVida: Int = 100) {
        var vidaActual: Int = maxVida
            set(value) {
                // 'field' almacena el valor real en memoria sin provocar recursión infinita
                field = value.coerceIn(0, maxVida)
            }

        // Propiedad computada sin backing field:
        val estaVivo: Boolean
            get() = vidaActual > 0
    }

    fun main() {
        val barra = BarraDeVida(100)
        println("Vida inicial: ${barra.vidaActual}/100 | ¿Vivo? ${barra.estaVivo}")

        println("Recibiendo 40 de daño...")
        barra.vidaActual -= 40
        println("Vida: ${barra.vidaActual}/100 | ¿Vivo? ${barra.estaVivo}")

        println("Recibiendo 9999 de daño letal...")
        barra.vidaActual -= 9999
        println("Vida: ${barra.vidaActual}/100 (clamp a 0) | ¿Vivo? ${barra.estaVivo}")
    }
    ```

---

### Ejercicio 3.4: Interfaces con Implementaciones por Defecto
📄 **Archivo:** `E04_InterfacesPolimorfismo.kt`  
📚 **Teoría de referencia:** [Clases Abstractas e Interfaces](../21-poo.md#6-clases-abstractas-e-interfaces)

#### 1. Enunciado y Requisitos

En Kotlin, las interfaces pueden contener tanto declaraciones de métodos abstractos como **implementaciones por defecto** y propiedades abstractas.

1. Declara una interfaz `Interactuable`:

    - Propiedad abstracta `val descripcion: String`.

    - Método abstracto `fun interactuar(personaje: String): String`.

    - Método con implementación por defecto `fun inspeccionar(): String = "Objeto interactivo: $descripcion"`.

2. Implementa la interfaz en dos clases: `CofreDelTesoro(val monedas: Int)` y `PalancaSecreta(var activada: Boolean)`.

3. Crea una lista polimórfica `List<Interactuable>` y recórrela ejecutando sus métodos.

#### 2. Salida Esperada en Consola

```text
Inspeccionando: Objeto interactivo: Cofre de madera antiguo
Acción: Link abre el Cofre y encuentra 50 monedas de oro.
Inspeccionando: Objeto interactivo: Palanca oxidada en la pared
Acción: Link tira de la palanca. Nueva posición: Activada.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    interface Interactuable {
        val descripcion: String
        fun interactuar(personaje: String): String
        fun inspeccionar(): String = "Objeto interactivo: $descripcion"
    }

    class CofreDelTesoro(val monedas: Int) : Interactuable {
        override val descripcion: String = "Cofre de madera antiguo"
        override fun interactuar(personaje: String): String =
            "$personaje abre el Cofre y encuentra $monedas monedas de oro."
    }

    class PalancaSecreta(var activada: Boolean = false) : Interactuable {
        override val descripcion: String = "Palanca oxidada en la pared"
        override fun interactuar(personaje: String): String {
            activada = !activada
            val estado = if (activada) "Activada" else "Desactivada"
            return "$personaje tira de la palanca. Nueva posición: $estado."
        }
    }

    fun main() {
        val objetos: List<Interactuable> = listOf(
            CofreDelTesoro(50),
            PalancaSecreta()
        )

        objetos.forEach { obj ->
            println("Inspeccionando: ${obj.inspeccionar()}")
            println("Acción: ${obj.interactuar("Link")}")
        }
    }
    ```

---

### Ejercicio 3.5: Herencia con `open` y `override`
📄 **Archivo:** `E05_HerenciaOpenOverride.kt`  
📚 **Teoría de referencia:** [Herencia: final por Defecto y la Palabra Clave open](../21-poo.md#5-herencia-final-por-defecto-y-la-palabra-clave-open)

#### 1. Enunciado y Requisitos

1. En Kotlin, todas las clases son `final` por defecto. Diseña una clase base `open class Enemigo(val nombre: String, val puntosSalud: Int)`.

2. Añade un método `open fun emitirSonidoAtaque()` que imprima un gruñido genérico.

3. Diseña una clase derivada `class BossFinal(nombre: String, salud: Int, val fase: Int) : Enemigo(nombre, salud)`.

4. Sobrescribe el método `emitirSonidoAtaque()` con `override` para que emita un rugido atronador.

#### 2. Salida Esperada en Consola

```text
Enemigo 'Goblin explorador' (30 HP) ataca: *Gruñido básico*
Boss 'Ganon el Conquistador' (500 HP, Fase 2) ataca: *¡RUGIDO DESTRUCTIVO!*
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    open class Enemigo(val nombre: String, val puntosSalud: Int) {
        open fun emitirSonidoAtaque() {
            println("Enemigo '$nombre' ($puntosSalud HP) ataca: *Gruñido básico*")
        }
    }

    class BossFinal(
        nombre: String,
        puntosSalud: Int,
        val fase: Int
    ) : Enemigo(nombre, puntosSalud) {
        override fun emitirSonidoAtaque() {
            println("Boss '$nombre' ($puntosSalud HP, Fase $fase) ataca: *¡RUGIDO DESTRUCTIVO!*")
        }
    }

    fun main() {
        val e1: Enemigo = Enemigo("Goblin explorador", 30)
        val e2: Enemigo = BossFinal("Ganon el Conquistador", 500, fase = 2)

        e1.emitirSonidoAtaque()
        e2.emitirSonidoAtaque()
    }
    ```

---

## 🟡 Nivel Intermedio (Data Classes, Singletons, Enums y Eventos)

### Ejercicio 3.6: Data Classes y Generación de Copias con `.copy()`
📄 **Archivo:** `E06_DataClassesCopy.kt`  
📚 **Teoría de referencia:** [Declaración de Data Classes y Método copy()](../23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad)

#### 1. Enunciado y Requisitos

1. Modela una entidad `data class Videojuego(val id: Long, val titulo: String, val precio: Double, val terminado: Boolean = false)`.

2. En `main()`, crea un videojuego `juego1`.

3. Utiliza la función **`.copy()`** para crear `juego2` con el mismo título e ID, pero marcando `terminado = true` y reduciendo su precio.

4. Demuestra que `juego1` sigue intacto en memoria (inmutabilidad).

5. Utiliza la desestructuración de datos `val (id, titulo, precio) = juego1` para imprimir sus propiedades directamente.

#### 2. Salida Esperada en Consola

```text
Juego original (intacto): Videojuego(id=1, titulo=Celeste, precio=19.99, terminado=false)
Juego modificado con .copy(): Videojuego(id=1, titulo=Celeste, precio=9.99, terminado=true)
Desestructuración: ID=1 | Título=Celeste | Precio=19.99 €
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    data class Videojuego(
        val id: Long,
        val titulo: String,
        val precio: Double,
        val terminado: Boolean = false
    )

    fun main() {
        val juego1 = Videojuego(1L, "Celeste", 19.99, false)

        // Derivamos un nuevo estado sin tocar el original
        val juego2 = juego1.copy(precio = 9.99, terminado = true)

        println("Juego original (intacto): $juego1")
        println("Juego modificado con .copy(): $juego2")

        // Desestructuración automática generada por el compilador (componentN)
        val (id, titulo, precio) = juego1
        println("Desestructuración: ID=$id | Título=$titulo | Precio=$precio €")
    }
    ```

---

### Ejercicio 3.7: `companion object` para Constantes y Factorías
📄 **Archivo:** `E07_CompanionObjectFactory.kt`  
📚 **Teoría de referencia:** [El Objeto Compañero (Companion Object)](../22-objetos-anonimos.md#2-el-objeto-companero-companion-object)

#### 1. Enunciado y Requisitos

1. Crea una clase `TarjetaRed(val mac: String, val ipAsignada: String)` con constructor primario privado (`private constructor(...)`).

2. Define un **`companion object`** que contenga:

    - Una constante `const val PUERTO_DEFECTO: Int = 8080`.

    - Un método factoría `fun crearLocal(): TarjetaRed` que devuelva una tarjeta con MAC `"00:00:00:00"` e IP `"127.0.0.1"`.

3. Accede a la constante y al método factoría directamente a través del nombre de la clase sin instanciarla (sustituto del `static` de Java).

#### 2. Salida Esperada en Consola

```text
Puerto por defecto del sistema: 8080
Tarjeta local instanciada mediante Factoría: MAC=00:00:00:00, IP=127.0.0.1
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    class TarjetaRed private constructor(
        val mac: String,
        val ipAsignada: String
    ) {
        companion object {
            const val PUERTO_DEFECTO: Int = 8080

            fun crearLocal(): TarjetaRed {
                return TarjetaRed("00:00:00:00", "127.0.0.1")
            }
        }

        override fun toString(): String = "MAC=$mac, IP=$ipAsignada"
    }

    fun main() {
        println("Puerto por defecto del sistema: ${TarjetaRed.PUERTO_DEFECTO}")

        val tarjeta = TarjetaRed.crearLocal()
        println("Tarjeta local instanciada mediante Factoría: $tarjeta")
    }
    ```

---

### Ejercicio 3.8: `object` Nativo (Patrón Singleton Thread-Safe)
📄 **Archivo:** `E08_SingletonObject.kt`  
📚 **Teoría de referencia:** [Declaración de Objetos: El Patrón Singleton Nativo](../22-objetos-anonimos.md#1-declaracion-de-objetos-el-patron-singleton-nativo)

#### 1. Enunciado y Requisitos

1. Modela un gestor de sesión de usuario utilizando la palabra clave **`object`**.

2. Declara propiedades para el usuario actual y el tiempo de inicio de sesión.

3. Añade métodos para iniciar sesión y cerrar sesión.

4. Demuestra desde dos llamadas independientes en `main()` que ambas acceden exactamente a la misma instancia en memoria.

#### 2. Salida Esperada en Consola

```text
Sesión iniciada para: Link_Hero
Acceso desde componente A: Usuario activo = Link_Hero
Acceso desde componente B: Usuario activo = Link_Hero
¿Es exactamente la misma instancia en memoria? true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    // En Kotlin, 'object' crea un Singleton seguro en concurrencia sin código boilerplate
    object SesionManager {
        var usuarioActual: String? = null
            private set

        fun iniciarSesion(usuario: String) {
            usuarioActual = usuario
            println("Sesión iniciada para: $usuario")
        }

        fun cerrarSesion() {
            usuarioActual = null
        }
    }

    fun main() {
        SesionManager.iniciarSesion("Link_Hero")

        val ref1 = SesionManager
        val ref2 = SesionManager

        println("Acceso desde componente A: Usuario activo = ${ref1.usuarioActual}")
        println("Acceso desde componente B: Usuario activo = ${ref2.usuarioActual}")
        println("¿Es exactamente la misma instancia en memoria? ${ref1 === ref2}")
    }
    ```

---

### Ejercicio 3.9: `enum class` con Propiedades y `.entries`
📄 **Archivo:** `E09_EnumEntries.kt`  
📚 **Teoría de referencia:** [Enums con Propiedades y Métodos](../24-enum-classes.md#2-enums-con-propiedades-y-metodos) e [Iteración con .entries](../24-enum-classes.md#3-iteracion-moderna-entries-vs-values)

#### 1. Enunciado y Requisitos

1. Modela un `enum class NivelDificultad(val factorMultiplicador: Double, val etiquetaUi: String)`:

    - `FACIL(0.8, "Modo Relajado")`

    - `NORMAL(1.0, "Modo Estándar")`

    - `DIFICIL(1.5, "Modo Desafío")`

    - `PESADILLA(2.5, "Modo Extremo")`

2. En lugar del obsoleto `.values()`, utiliza la propiedad moderna **`.entries`** de Kotlin 1.9+ para listar las dificultades.

3. Evalúa con un `when` exhaustivo una dificultad dada sin necesidad de rama `else`.

#### 2. Salida Esperada en Consola

```text
--- DIFICULTADES DISPONIBLES (usando .entries) ---
- FACIL: Modo Relajado (x0.8)
- NORMAL: Modo Estándar (x1.0)
- DIFICIL: Modo Desafío (x1.5)
- PESADILLA: Modo Extremo (x2.5)

Configuración activa: Modo Desafío -> Daño enemigo amplificado un 150%.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    enum class NivelDificultad(val factorMultiplicador: Double, val etiquetaUi: String) {
        FACIL(0.8, "Modo Relajado"),
        NORMAL(1.0, "Modo Estándar"),
        DIFICIL(1.5, "Modo Desafío"),
        PESADILLA(2.5, "Modo Extremo")
    }

    fun main() {
        println("--- DIFICULTADES DISPONIBLES (usando .entries) ---")
        NivelDificultad.entries.forEach { d ->
            println("- ${d.name}: ${d.etiquetaUi} (x${d.factorMultiplicador})")
        }

        val seleccionada = NivelDificultad.DIFICIL

        val descripcion = when (seleccionada) {
            NivelDificultad.FACIL -> "Modo asistido con daño reducido."
            NivelDificultad.NORMAL -> "Experiencia original diseñada por el equipo."
            NivelDificultad.DIFICIL -> "Daño enemigo amplificado un 150%."
            NivelDificultad.PESADILLA -> "Cualquier golpe puede ser letal. Muerte permanente."
        }

        println("\nConfiguración activa: ${seleccionada.etiquetaUi} -> $descripcion")
    }
    ```

---

### Ejercicio 3.10: Modelado de Eventos con `sealed interface UiEvent`
📄 **Archivo:** `E10_UiEventsSealed.kt`  
📚 **Teoría de referencia:** [Sintaxis Moderna: sealed interface y data object](../26-sealed-classes.md#2-sintaxis-moderna-sealed-interface-y-data-object-kotlin-19) y [Manejo con when Exhaustivo](../26-sealed-classes.md#3-manejo-con-when-exhaustivo-y-smart-casting)

#### 1. Enunciado y Requisitos

En Jetpack Compose, las acciones que el usuario realiza en la pantalla (pulsar botón, teclear texto, confirmar borrado) se representan como una jerarquía sellada de eventos (**UiEvent** o **UserIntent** en MVI).

1. Declara una jerarquía sellada `sealed interface DetalleJuegoUiEvent`:

    - `data class OnTituloCambiado(val nuevoTitulo: String) : DetalleJuegoUiEvent`

    - `data object OnGuardarPulsado : DetalleJuegoUiEvent`

    - `data object OnEliminarPulsado : DetalleJuegoUiEvent`

    - `data class OnConfirmarDialogo(val confirmar: Boolean) : DetalleJuegoUiEvent`

2. Implementa una función `procesarEvento(evento: DetalleJuegoUiEvent)` que utilice `when` exhaustivo para manejar cada acción.

3. Simula en `main()` una secuencia de acciones disparadas desde la UI.

#### 2. Salida Esperada en Consola

```text
[EVENTO PROCESADO]: Actualizando título en borrador a 'Zelda: Echoes of Wisdom'
[EVENTO PROCESADO]: Botón guardar pulsado. Guardando en Room...
[EVENTO PROCESADO]: Botón eliminar pulsado. Mostrando AlertDialog de confirmación.
[EVENTO PROCESADO]: Diálogo respondido: Confirmación = false. Cancelando borrado.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    sealed interface DetalleJuegoUiEvent {
        data class OnTituloCambiado(val nuevoTitulo: String) : DetalleJuegoUiEvent
        data object OnGuardarPulsado : DetalleJuegoUiEvent
        data object OnEliminarPulsado : DetalleJuegoUiEvent
        data class OnConfirmarDialogo(val confirmar: Boolean) : DetalleJuegoUiEvent
    }

    fun procesarEvento(evento: DetalleJuegoUiEvent) {
        when (evento) {
            is DetalleJuegoUiEvent.OnTituloCambiado ->
                println("[EVENTO PROCESADO]: Actualizando título en borrador a '${evento.nuevoTitulo}'")
            DetalleJuegoUiEvent.OnGuardarPulsado ->
                println("[EVENTO PROCESADO]: Botón guardar pulsado. Guardando en Room...")
            DetalleJuegoUiEvent.OnEliminarPulsado ->
                println("[EVENTO PROCESADO]: Botón eliminar pulsado. Mostrando AlertDialog de confirmación.")
            is DetalleJuegoUiEvent.OnConfirmarDialogo ->
                println("[EVENTO PROCESADO]: Diálogo respondido: Confirmación = ${evento.confirmar}. Cancelando borrado.")
        }
    }

    fun main() {
        procesarEvento(DetalleJuegoUiEvent.OnTituloCambiado("Zelda: Echoes of Wisdom"))
        procesarEvento(DetalleJuegoUiEvent.OnGuardarPulsado)
        procesarEvento(DetalleJuegoUiEvent.OnEliminarPulsado)
        procesarEvento(DetalleJuegoUiEvent.OnConfirmarDialogo(confirmar = false))
    }
    ```

---

### Ejercicio 3.11: Delegación de Propiedades con `by` y `Delegates.observable`
📄 **Archivo:** `E11_DelegatedProperties.kt`  
📚 **Teoría de referencia:** [Propiedades y Acceso en Clases](../21-poo.md#3-propiedades-y-acceso-field)

#### 1. Enunciado y Requisitos

Kotlin permite interceptar lecturas y escrituras en variables delegándolas mediante la palabra clave **`by`**.

1. Utiliza `kotlin.properties.Delegates.observable` para crear una propiedad mutable `var puntuacion: Int by Delegates.observable(0) { prop, anterior, nuevo -> ... }`.

2. En la lambda del observador, imprime un mensaje cada vez que cambie el valor indicando el valor antiguo y el nuevo.

3. En `main()`, modifica la puntuación 3 veces y observa cómo se dispara automáticamente el aviso de cambio sin escribir setters manuales.

#### 2. Salida Esperada en Consola

```text
Puntuación inicial: 0
[OBSERVADOR]: 'puntuacion' cambió de 0 a 150
[OBSERVADOR]: 'puntuacion' cambió de 150 a 450
[OBSERVADOR]: 'puntuacion' cambió de 450 a 1000
Puntuación final: 1000
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    import kotlin.properties.Delegates

    class MarcadorPartida {
        var puntuacion: Int by Delegates.observable(0) { prop, anterior, nuevo ->
            println("[OBSERVADOR]: '${prop.name}' cambió de $anterior a $nuevo")
        }
    }

    fun main() {
        val marcador = MarcadorPartida()
        println("Puntuación inicial: ${marcador.puntuacion}")

        marcador.puntuacion = 150
        marcador.puntuacion = 450
        marcador.puntuacion = 1000

        println("Puntuación final: ${marcador.puntuacion}")
    }
    ```

---

## 🔴 Nivel Avanzado (Tipos Sellados, Genéricos y Reto Lúdico)

### Ejercicio 3.12: `sealed interface` y Patrón `UiState`
📄 **Archivo:** `E12_SealedUiState.kt`  
📚 **Teoría de referencia:** [El Patrón Universal de Arquitectura en Android: UiState](../26-sealed-classes.md#5-el-patron-universal-de-arquitectura-en-android-uistate)

#### 1. Enunciado y Requisitos

1. Define la jerarquía sellada recomendada oficialmente por Android para representar los estados de pantalla:

    ```kotlin
    sealed interface CatalogoUiState {
        data object Cargando : CatalogoUiState
        data class Exito(val juegos: List<String>) : CatalogoUiState
        data class Error(val mensaje: String) : CatalogoUiState
    }
    ```

2. Implementa una función `renderizarPantalla(estado: CatalogoUiState)` que evalúe exhaustivamente el estado mediante `when` sin rama `else`.

3. Comprueba el renderizado pasando los tres estados posibles.

#### 2. Salida Esperada en Consola

```text
[PANTALLA]: Mostrando animación de carga (Shimmer/Spinner)...
[PANTALLA]: Renderizando LazyColumn con 3 videojuegos: [Hollow Knight, Celeste, Dead Cells]
[PANTALLA]: Error de conexión: Servidor no disponible (503). Mostrando botón 'Reintentar'.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    sealed interface CatalogoUiState {
        data object Cargando : CatalogoUiState
        data class Exito(val juegos: List<String>) : CatalogoUiState
        data class Error(val mensaje: String) : CatalogoUiState
    }

    fun renderizarPantalla(estado: CatalogoUiState) {
        when (estado) {
            is CatalogoUiState.Cargando -> {
                println("[PANTALLA]: Mostrando animación de carga (Shimmer/Spinner)...")
            }
            is CatalogoUiState.Exito -> {
                println("[PANTALLA]: Renderizando LazyColumn con ${estado.juegos.size} videojuegos: ${estado.juegos}")
            }
            is CatalogoUiState.Error -> {
                println("[PANTALLA]: Error de conexión: ${estado.mensaje}. Mostrando botón 'Reintentar'.")
            }
        }
    }

    fun main() {
        renderizarPantalla(CatalogoUiState.Cargando)
        renderizarPantalla(CatalogoUiState.Exito(listOf("Hollow Knight", "Celeste", "Dead Cells")))
        renderizarPantalla(CatalogoUiState.Error("Servidor no disponible (503)"))
    }
    ```

---

### Ejercicio 3.13: Envoltorio Genérico con Covarianza `out`
📄 **Archivo:** `E13_GenericosVarianzaOut.kt`  
📚 **Teoría de referencia:** [Clases Genéricas](../25-genericos.md#1-clases-genericas) y [Covarianza con out](../25-genericos.md#41-covarianza-con-out-productores-de-datos)

#### 1. Enunciado y Requisitos

1. Define una jerarquía genérica sellada `sealed interface RespuestaApi<out T>` con el modificador de covarianza **`out`**:

    - `data class Exito<T>(val datos: T) : RespuestaApi<T>`

    - `data class Fallo(val codigoHttp: Int, val mensaje: String) : RespuestaApi<Nothing>`

2. Explica por qué el uso de `out` permite que `RespuestaApi<Nothing>` sea subtipo de `RespuestaApi<T>` para cualquier tipo `T`.

3. Demuestra su uso en una función simulada de login que devuelva `RespuestaApi<String>`.

#### 2. Salida Esperada en Consola

```text
Login correcto -> Token de sesión: JWT_TOKEN_SECRETO_2026
Login erróneo -> Error 401: Credenciales inválidas
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b03_poo_sealed

    // 'out T' indica que T solo se produce/devuelve, habilitando polimorfismo seguro
    sealed interface RespuestaApi<out T> {
        data class Exito<out T>(val datos: T) : RespuestaApi<T>
        data class Fallo(val codigoHttp: Int, val mensaje: String) : RespuestaApi<Nothing>
    }

    fun simularLogin(usuario: String, clave: String): RespuestaApi<String> {
        return if (usuario == "admin" && clave == "1234") {
            RespuestaApi.Exito("JWT_TOKEN_SECRETO_2026")
        } else {
            // Gracias a 'out', RespuestaApi<Nothing> encaja perfectamente como RespuestaApi<String>
            RespuestaApi.Fallo(401, "Credenciales inválidas")
        }
    }

    fun main() {
        val r1 = simularLogin("admin", "1234")
        when (r1) {
            is RespuestaApi.Exito -> println("Login correcto -> Token de sesión: ${r1.datos}")
            is RespuestaApi.Fallo -> println("Login erróneo -> Error ${r1.codigoHttp}: ${r1.mensaje}")
        }

        val r2 = simularLogin("hacker", "0000")
        when (r2) {
            is RespuestaApi.Exito -> println("Login correcto -> Token de sesión: ${r2.datos}")
            is RespuestaApi.Fallo -> println("Login erróneo -> Error ${r2.codigoHttp}: ${r2.mensaje}")
        }
    }
    ```

---

### Reto 3.14: El Motor de Wordle en Consola (*POO, Data Classes y Dominio*)
📄 **Archivo:** `Reto03_WordleEngine.kt`  
📚 **Teoría de referencia:** [El Método copy() y la Inmutabilidad](../23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad) y [El Dúo Estrella: enum y when Exhaustivo](../24-enum-classes.md#5-el-duo-estrella-enum-y-la-expresion-when-exhaustiva)

#### 1. Contexto y Misión

En este reto construirás el motor de validación para el popular juego de palabras **Wordle**, aplicando los principios esenciales de **Programación Orientada a Objetos en Kotlin**, **Data Classes** y **Enum Classes** aprendidos a lo largo del Bloque 3.

El propósito formativo es aprender a modelar la lógica de negocio y las entidades de dominio de forma totalmente desacoplada de la interfaz gráfica, tal como se diseñan los modelos de datos y estados de pantalla (**UiState**) en aplicaciones profesionales con **Jetpack Compose**.

##### 🎮 La Dinámica del Juego Explicada

El objetivo del jugador consiste en adivinar una palabra secreta oculta de longitud determinada (en este ejercicio, `"COMPOSE"`, de 7 letras) dentro de un límite de **6 intentos máximos**.

Tras cada intento propuesto por el usuario, el motor compara letra a letra la palabra enviada con la palabra secreta y genera una **evaluación visual** mediante un código de colores icónico.

###### A. Componentes y Recursos de la Partida

| Elemento | Tipo de Dato | Función en el Juego |
| :--- | :--- | :--- |
| **`EstadoLetra`** | `enum class` | Calificación de cada posición (`VERDE`, `AMARILLO`, `GRIS`), con su emoji visual asociado (`"🟩"`, `"🟨"`, `"⬛"`). |
| **`EvaluacionLetra`** | `data class` | Celda individual de la cuadrícula que empareja el carácter probado con su `EstadoLetra`. |
| **`PartidaWordle`** | `data class` | Modelo de estado inmutable de la partida con la palabra secreta, límite de intentos y matriz de evaluaciones acumuladas. |
| **`evaluarIntento()`** | Función pura | Analiza la palabra enviada y devuelve la lista inmutable `List<EvaluacionLetra>`. |

###### B. Reglas de Validación de Letras (Verde, Amarillo y Gris)

Para cada carácter en la posición `i` del intento propuesto, se aplican las siguientes reglas oficiales de Wordle:

1. **🟩 VERDE (Acierto Pleno):**  
   El carácter propuesto coincide de forma idéntica con el carácter de la palabra secreta en esa misma posición exacta (`intento[i] == secreta[i]`).

2. **🟨 AMARILLO (Letra Presente en Posición Distinta):**  
   El carácter propuesto existe dentro de la palabra secreta (`intento[i] in secreta`), pero se encuentra en otra posición diferente.

3. **⬛ GRIS (Letra Ausente):**  
   El carácter propuesto no existe en ninguna posición de la palabra secreta.

###### C. Ciclo de Vida de Cada Intento (Paso a Paso)

Cada intento introducido en el motor sigue cronológicamente las siguientes fases:

1. **Fase de Validación y Normalización de Entrada:**  
   Ambas cadenas se convierten a mayúsculas con `.uppercase()`. Se verifica con `require(secreta.length == intento.length)` que la longitud del intento sea exactamente igual a la de la palabra secreta; si no coinciden, se detiene el proceso con una excepción descriptiva.

2. **Fase de Mapeo Posicional (`mapIndexed`):**  
   Se recorre la cadena caracter a caracter conociendo su índice posicional `(i, c)`. Mediante una expresión `when`, se asigna el estado (`VERDE`, `AMARILLO` o `GRIS`) y se instancia un objeto `EvaluacionLetra(c, estado)`.

3. **Fase de Renderizado y Visualización:**  
   En consola se imprimen dos líneas por intento:
   
    - La palabra del intento con las letras separadas por espacios (ej. `K O T L I N S`).
    
    - La fila de iconos correspondiente dibujada con los emojis de cada celda (ej. `⬛ 🟩 ⬛ ⬛ ⬛ ⬛ 🟨`).

4. **Fase de Comprobación de Fin de Partida:**  
   Se evalúa la lista de evaluaciones generadas:

    - Si todas las celdas tienen el estado `EstadoLetra.VERDE`, ¡se declara la victoria inmediata!

    - Si no, se descuenta un intento y el juego continúa hasta agotar el cupo de 6 rondas.

###### D. Desenlace Final (Condiciones de Victoria y Derrota)

- **🏆 Victoria:** Se alcanza en el momento en que un intento resulta 100% verde (`evaluacion.all { it.estado == EstadoLetra.VERDE }`). Se felicita al jugador indicando el número exacto de intentos requeridos.

- **💀 Derrota:** Se produce si se alcanzan los 6 intentos máximos sin descubrir la palabra. Se desvela la solución oculta.

---

#### 2. Requisitos Funcionales

Para completar el reto con la máxima fidelidad técnica:

1. **RF-01 (Enum Class con Propiedad Visual):** Declara `enum class EstadoLetra(val icono: String)` con las constantes `VERDE("🟩")`, `AMARILLO("🟨")` y `GRIS("⬛")`.

2. **RF-02 (Data Class de Celda):** Modela `data class EvaluacionLetra(val caracter: Char, val estado: EstadoLetra)` para encapsular cada celda evaluada.

3. **RF-03 (Data Class del Estado Global de la Partida):** Modela `data class PartidaWordle(val palabraSecreta: String, val intentosMaximos: Int = 6, val intentosRealizados: List<List<EvaluacionLetra>> = emptyList())` asegurando inmutabilidad en las listas anidadas.

4. **RF-04 (Función Pura de Evaluación):** Implementa `fun evaluarIntento(palabraSecreta: String, intentoRaw: String): List<EvaluacionLetra>` que valide la coincidencia de longitud con `require` y aplique `mapIndexed` junto con una expresión `when` para clasificar cada letra.

5. **RF-05 (Renderizado Formateado e Iconografía):** Muestra cada intento imprimiendo las letras separadas por espacios y en la línea siguiente la cadena de iconos (`iconos = evaluacion.joinToString(" ") { it.estado.icono }`).

6. **RF-06 (Control de Flujo de la Partida en `main()`):** Simula una partida con una lista de intentos progresivos (ej. `"KOTLINS"`, `"COMPASS"`, `"COMPOSE"`), verificando la condición de victoria con `.all` tras cada intento.

---

??? info "📊 Ver Modelo Mental del Reto (Diagrama de Clases y Dominio)"
    Analiza cómo se estructuran las clases y tipos enumerados en la arquitectura del juego:

    ```mermaid
    classDiagram
        class EstadoLetra {
            <<enum>>
            VERDE : "🟩"
            AMARILLO : "🟨"
            GRIS : "⬛"
            +String icono
        }

        class EvaluacionLetra {
            <<data class>>
            +Char caracter
            +EstadoLetra estado
        }

        class PartidaWordle {
            <<data class>>
            +String palabraSecreta
            +Int intentosMaximos
            +List~List~EvaluacionLetra~~ intentosRealizados
        }

        PartidaWordle *-- EvaluacionLetra : contiene matriz de intentos
        EvaluacionLetra --> EstadoLetra : calificada con
    ```

??? question "🧠 Preguntas de Reflexión Previa (Aprender a Pensar)"
    Antes de examinar la solución o las pistas, reflexiona sobre estas decisiones de diseño:

    - **¿Por qué asociar el icono visual (`"🟩"`) directamente al `enum class`?**  
      De esta forma el `enum` encapsula tanto el significado semántico como su representación gráfica. Evita tener que repetir estructuras `when` en la capa de presentación para decidir qué icono pintar.

    - **¿Por qué `data class EvaluacionLetra` en lugar de pares simples `Pair<Char, EstadoLetra>`?**  
      Las `data class` proporcionan nombres descriptivos a los campos (`caracter`, `estado`) en lugar de los genéricos `first` y `second`, mejorando drásticamente la legibilidad y mantenibilidad del código. Además, generan automáticamente `equals()`, `hashCode()` y `toString()`.

    - **¿Cómo comparar las letras eficientemente sin bucles manuales `for`?**  
      Utilizando `intento.mapIndexed { index, char -> ... }`. El parámetro `index` permite verificar si el carácter coincide con `palabraSecreta[index]` (Verde), mientras que el operador de pertenencia `char in palabraSecreta` determina si existe en otra posición (Amarillo).

??? tip "💡 Pistas Progresivas de Ayuda (Abrir solo si te atascas)"
    ??? tip "💡 Pista 1: Validación previa con `require`"
        Asegúrate de que la palabra enviada tenga la misma longitud que la palabra secreta para evitar errores `IndexOutOfBoundsException`:
        ```kotlin
        require(secreta.length == intento.length) { "La longitud del intento debe coincidir con la palabra secreta." }
        ```

    ??? tip "💡 Pista 2: Mapeo posicional con `mapIndexed` y `when`"
        Kotlin ofrece `mapIndexed` para iterar conociendo el índice y el valor simultáneamente:
        ```kotlin
        return intento.mapIndexed { i, c ->
            val estado = when {
                c == secreta[i] -> EstadoLetra.VERDE
                c in secreta -> EstadoLetra.AMARILLO
                else -> EstadoLetra.GRIS
            }
            EvaluacionLetra(c, estado)
        }
        ```

    ??? tip "💡 Pista 3: Detección de Victoria con `.all`"
        Para determinar si el turno actual es ganador, comprueba si la totalidad de las celdas evaluadas tienen el estado verde:
        ```kotlin
        val victoria = evaluacion.all { it.estado == EstadoLetra.VERDE }
        ```

??? info "🖥️ Ver Salida de Ejemplo en Consola"
    ```text
    === WORDLE KOTLIN CLI ===
    Palabra secreta fijada: COMPOSE (7 letras)

    Intento 1: K O T L I N S
    ⬛ 🟩 ⬛ ⬛ ⬛ ⬛ 🟨

    Intento 2: C O M P A S S
    🟩 🟩 🟩 🟩 ⬛ ⬛ 🟨

    Intento 3: C O M P O S E
    🟩 🟩 🟩 🟩 🟩 🟩 🟩

    ¡ENHORABUENA! 🎉 Has resuelto el Wordle en 3 intentos.
    ```

??? tip "Ver solución comentada paso a paso"
    ```kotlin
    package b03_poo_sealed

    enum class EstadoLetra(val icono: String) {
        VERDE("🟩"),
        AMARILLO("🟨"),
        GRIS("⬛")
    }

    data class EvaluacionLetra(
        val caracter: Char,
        val estado: EstadoLetra
    )

    data class PartidaWordle(
        val palabraSecreta: String,
        val intentosMaximos: Int = 6,
        val intentosRealizados: List<List<EvaluacionLetra>> = emptyList()
    )

    fun evaluarIntento(palabraSecreta: String, intentoRaw: String): List<EvaluacionLetra> {
        val secreta = palabraSecreta.uppercase()
        val intento = intentoRaw.uppercase()

        require(secreta.length == intento.length) { 
            "La longitud del intento (${intento.length}) debe coincidir con la palabra secreta (${secreta.length})." 
        }

        return intento.mapIndexed { i, c ->
            val estado = when {
                c == secreta[i] -> EstadoLetra.VERDE
                c in secreta -> EstadoLetra.AMARILLO
                else -> EstadoLetra.GRIS
            }
            EvaluacionLetra(c, estado)
        }
    }

    fun main() {
        val secreta = "COMPOSE"
        println("=== WORDLE KOTLIN CLI ===")
        println("Palabra secreta fijada: COMPOSE (${secreta.length} letras)\n")

        val intentos = listOf("KOTLINS", "COMPASS", "COMPOSE")

        intentos.forEachIndexed { turno, palabra ->
            println("Intento ${turno + 1}: ${palabra.map { "$it" }.joinToString(" ")}")
            val evaluacion = evaluarIntento(secreta, palabra)

            val iconos = evaluacion.joinToString(" ") { it.estado.icono }
            println(iconos)
            println()

            if (evaluacion.all { it.estado == EstadoLetra.VERDE }) {
                println("¡ENHORABUENA! 🎉 Has resuelto el Wordle en ${turno + 1} intentos.")
                return
            }
        }
    }
    ```

