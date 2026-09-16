# Programación Asíncrona con Corrutinas en Kotlin

En el desarrollo de aplicaciones móviles, la **concurrencia asíncrona** es un requisito innegociable. Una aplicación móvil debe realizar operaciones que toman tiempo (descargar imágenes, consultar una API REST, leer una base de datos local SQLite/Room) sin **congelar jamás la pantalla** ni bloquear la interacción del usuario a 60 o 120 fotogramas por segundo.

Históricamente en Java y Android se utilizaban hilos manuales (`Thread`), manejadores (`Handler`), `AsyncTask` o complejas librerías de callbacks reactivos (`RxJava`). Kotlin revolucionó este panorama introduciendo las **corrutinas** (*Coroutines*): una solución elegante y ligera que permite escribir **código asíncrono no bloqueante con la misma sencillez y legibilidad que el código secuencial síncrono**.

---

## 1. La Analogía del Camarero: ¿Por qué bloquear un hilo es fatal?

Imagina un restaurante concurrido:

```mermaid
flowchart LR
    subgraph Malo ["Enfoque Bloqueante (Sin Corrutinas)"]
        Cam1[Camarero / Main Thread] -->|Pide café a cocina| Cocina1[Espera 5 min quieto sin atender]
        Cocina1 -->|App se congela| ANR[Error ANR: App Not Responding]
    end
```

- **El Hilo Principal (*Main Thread* o Hilo de UI):** Es el **único camarero** del restaurante. Su trabajo vital es escuchar al usuario (toques en la pantalla, gestos, teclado) y redibujar los componentes visuales.

- **La Tarea Pesada:** Es un pedido complejo (por ejemplo, descargar el catálogo de juegos desde un servidor).

### El Enfoque Bloqueante (Sin Corrutinas)

Si el camarero toma el pedido, se mete a la cocina y se queda allí de pie 4 segundos esperando a que termine la máquina de café:

- Durante esos 4 segundos, **nadie atiende el comedor**.

- Si un cliente intenta pulsar un botón, la app no responde.

- El sistema operativo Android detecta que el hilo principal lleva más de 5 segundos sin procesar eventos y lanza el temido diálogo del sistema: **ANR (Application Not Responding)**, cerrando la app a la fuerza.

### El Enfoque con Corrutinas (No Bloqueante)
Con corrutinas, el camarero pasa la comanda a la cocina (lanza una corrutina en segundo plano) y **vuelve inmediatamente a la sala a seguir atendiendo a los clientes**. 
Cuando la cocina termina, la corrutina avisa al camarero, quien recoge el plato y lo entrega en la mesa sin haber dejado de atender la sala en ningún momento.

---

## 2. Corrutinas vs Hilos Tradicionales (*Threads*)

A menudo se confunden, pero su coste en recursos es drásticamente distinto:

| Característica | Hilo Tradicional (`Thread` del SO) | Corrutina de Kotlin |
| :--- | :--- | :--- |
| **Peso en memoria** | **Pesado** (consume ~1 MB de memoria de pila por hilo) | **Ultraligero** (consume unos pocos bytes en memoria) |
| **Creación** | Muy costosa (requiere intervención del kernel del SO) | Prácticamente instantánea (gestionada en espacio de usuario) |
| **Escalabilidad** | Crear 5.000 hilos colapsa la memoria de un teléfono móvil (`OutOfMemoryError`). | Puedes lanzar **100.000 corrutinas** simultáneamente sin problema. |
| **Concepto clave** | "Hilos de hardware/SO" | "Hilos virtuales cooperativos" que se ejecutan sobre un grupo de hilos reales. |

---

## 3. Funciones de Suspensión (`suspend fun`)

El bloque de construcción fundamental de las corrutinas es la palabra clave **`suspend`**.

Para entender por qué las funciones de suspensión supusieron una auténtica revolución en el desarrollo móvil y en la industria del software, es imprescindible recordar cómo se programaban las tareas asíncronas antes de su llegada.

### 3.1. ¿De Dónde Venimos? El Infierno de los Callbacks (*Callback Hell*)

En Java tradicional, JavaScript o en las primeras versiones de Android, una función que tardaba tiempo no podía devolver un valor directamente ni bloquear el hilo principal. La solución estándar era el uso de **callbacks** (o escuchadores/*listeners*): le pasabas a la función un objeto con métodos para que te avisara cuando la tarea terminase (`onSuccess` y `onError`).

El problema surgía cuando tenías que ejecutar **varias operaciones asíncronas encadenadas y dependientes**:

1. Autenticar al usuario con credenciales (`login`).
2. Con el `token` obtenido, descargar su perfil (`getProfile`).
3. Con el `id` del perfil, descargar su lista de amigos o compras (`getFriends`).
4. Con los datos finales, actualizar la interfaz de usuario.

En código tradicional, esto se traducía en la temida **Pirámide de la Perdición (*Pyramid of Doom*)**:

```kotlin
// ❌ EL INFIERNO DE LOS CALLBACKS (Código tradicional complejo y frágil)
authService.login(usuario, clave, object : AuthCallback {
    override fun onSuccess(token: String) {
        userService.getProfile(token, object : ProfileCallback {
            override fun onSuccess(perfil: UserProfile) {
                friendsService.getFriends(perfil.id, object : FriendsCallback {
                    override fun onSuccess(amigos: List<Friend>) {
                        actualizarUI(amigos) // ¡Por fin! 4 niveles de indentación
                    }
                    override fun onError(e: Exception) {
                        mostrarErrorAmigos(e) // Manejo de error Nivel 3
                    }
                })
            }
            override fun onError(e: Exception) {
                mostrarErrorPerfil(e) // Manejo de error Nivel 2
            }
        })
    }
    override fun onError(e: Exception) {
        mostrarErrorLogin(e) // Manejo de error Nivel 1
    }
})
```

#### Los 3 Graves Problemas de los Callbacks:

1. **Legibilidad destructiva:** El código se desplaza horizontalmente hacia la derecha de forma descontrolada (*Pyramid of Doom*), haciendo imposible seguir el flujo lógico natural.
2. **Fragmentación del manejo de errores:** No se puede usar un bloque `try-catch` estándar. Cada llamada anidada necesita su propio manejador de fallos (`onError`), duplicando código defensivo en cada nivel.
3. **Fugas de memoria (*Memory Leaks*) y falta de cancelación:** Si el usuario rota la pantalla o pulsa el botón "Atrás" mientras las peticiones 2 o 3 están en vuelo, los callbacks anidados siguen vivos en segundo plano. Cuando intentan actualizar la interfaz de una pantalla destruida, provocan el colapso de la aplicación (`NullPointerException` o `IllegalStateException`).

```mermaid
flowchart TD
    subgraph Hell["El Infierno de los Callbacks (Callback Hell / Pyramid of Doom)"]
        direction TB
        C1["1. authService.login(user, pass)"] -->|"onSuccess(token)"| C2["2. userService.getProfile(token)"]
        C1 -.->|"onError"| E1["Tratar Error Login"]
        C2 -->|"onSuccess(perfil)"| C3["3. friendsService.getFriends(id)"]
        C2 -.->|"onError"| E2["Tratar Error Perfil"]
        C3 -->|"onSuccess(amigos)"| C4["4. actualizarUI(amigos)"]
        C3 -.->|"onError"| E3["Tratar Error Amigos"]
    end

    subgraph Suspend["La Solución con suspend: Flujo Secuencial Directo"]
        direction TB
        S1["val token = authService.login(user, pass)"]
        S2["val perfil = userService.getProfile(token)"]
        S3["val amigos = friendsService.getFriends(perfil.id)"]
        S4["actualizarUI(amigos)"]
        
        S1 --> S2 --> S3 --> S4
        S4 -.->|"Cualquier fallo se captura aquí"| Catch["catch (e: Exception) { mostrarError(e) }"]
    end
```

### 3.2. La Solución con `suspend`: Código Asíncrono con Sintaxis Secuencial

Una función marcada con la palabra clave **`suspend`** puede pausar su ejecución en segundo plano y reanudarse más tarde **sin bloquear el hilo de ejecución** y **sin requerir callbacks anidados**.

Mira exactamente el mismo caso anterior reescrito con funciones `suspend`:

```kotlin
// ✅ CON CORRUTINAS Y FUNCIONES SUSPEND (Limpio, secuencial y seguro)
try {
    val token = authService.login(usuario, clave)         // 1. Pausa y reanuda
    val perfil = userService.getProfile(token)            // 2. Pausa y reanuda
    val amigos = friendsService.getFriends(perfil.id)     // 3. Pausa y reanuda
    actualizarUI(amigos)                                  // 4. Se ejecuta al terminar
} catch (e: Exception) {
    mostrarError(e) // ¡Un único bloque centralizado para todos los errores!
}
```

#### ¿Qué ocurre por debajo? (La magia de la Suspensión)
Cuando el hilo principal llega a `authService.login()`, la corrutina **se suspende** (guarda su estado en memoria). El hilo principal queda inmediatamente libre para seguir respondiendo a los toques del usuario y pintar la pantalla a 60 fps. 

Cuando la respuesta HTTP llega del servidor, el motor de corrutinas "despierta" a la corrutina y reanuda la ejecución en la línea siguiente exactamente donde se quedó. Para el programador, el código se lee de arriba abajo como si fuera síncrono.

### 3.3. Comparativa: Callbacks Tradicionales vs. Funciones `suspend`

| Característica | Callbacks Tradicionales (Java / JS) | Funciones `suspend` (Kotlin Coroutines) |
| :--- | :--- | :--- |
| **Estructura del código** | Anidada en pirámide (*Pyramid of Doom*). | Lineal y secuencial de arriba abajo. |
| **Manejo de excepciones** | Métodos `onError` manuales y dispersos en cada capa. | Bloques `try-catch` estándar y centralizados. |
| **Cancelación** | Manual, complejísima y con alto riesgo de fugas de memoria (*leaks*). | Automática en cascada gracias a la **Concurrencia Estructurada**. |
| **Retorno de datos** | No pueden retornar valores (métodos `void` / `Unit`). | Devuelven tipos de datos directos (`String`, `User`, `List<T>`). |
| **Tareas en paralelo** | Requiere semáforos, contadores o `CountDownLatch`. | Trivial con `async { }` y `.await()`. |

### Ejemplo Práctico: Declaración de una Función `suspend`

```kotlin
import kotlinx.coroutines.delay

// 'delay' es una función de suspensión propia de Kotlin: pausa la corrutina sin congelar el hilo
suspend fun descargarDatosJuegos(): String {
    println("-> Iniciando descarga de catálogo en segundo plano...")
    delay(2000) // Simula una espera de red de 2 segundos de forma NO bloqueante
    return "Catálogo: 120 videojuegos disponibles"
}
```

!!! warning "Regla de compilación de funciones suspend"
    Una función `suspend` **solo puede ser invocada desde dentro de otra función de suspensión o desde el cuerpo de un constructor de corrutina (*Coroutine Builder*)**. Si intentas llamarla desde una función normal ordinaria, el compilador lanzará un error indicando que falta el contexto de corrutina.

---

## 4. Constructores de Corrutinas (*Coroutine Builders*)

Para arrancar una corrutina desde código convencional síncrono, se utilizan los *builders*, los cuales se invocan siempre en el contexto de un ámbito de ejecución (**`CoroutineScope`**):

### 4.1. `launch`: Lanzar y Olvidar (*Fire and Forget*)
Se utiliza cuando se desea ejecutar una tarea en segundo plano y **no se necesita que devuelva un valor directo** (por ejemplo: registrar un log, guardar un ajuste local, enviar una analítica):

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { // 'runBlocking' crea un scope bloqueante solo para pruebas en main
    println("Antes del launch")

    launch {
        delay(1000)
        println("Tarea secundaria completada en segundo plano")
    }

    println("Después del launch (se ejecuta de inmediato)")
}
```

### 4.2. `async` y `await`: Peticiones en Paralelo con Retorno de Valor
Se utiliza cuando **necesitamos un resultado devuelto**. `async` devuelve un objeto `Deferred<T>` (una promesa de que habrá un resultado futuro). Para esperar a que esté listo y extraer el valor se invoca `.await()`:

```kotlin
import kotlinx.coroutines.*

suspend fun obtenerPuntuacion(): Int {
    delay(1000)
    return 950
}

suspend fun obtenerNombreJugador(): String {
    delay(1000)
    return "Zelda"
}

fun main() = runBlocking {
    println("Cargando perfil en paralelo...")

    // Ambas tareas se ejecutan simultáneamente en paralelo:
    val puntuacionDeferred = async { obtenerPuntuacion() }
    val nombreDeferred = async { obtenerNombreJugador() }

    // .await() espera a que ambas finalicen (tardará 1 segundo en total, no 2)
    val nombre = nombreDeferred.await()
    val puntos = puntuacionDeferred.await()

    println("Perfil cargado: $nombre con $puntos puntos.")
}
```

---

## 5. Despachadores en Android (*Dispatchers*)

Un **Dispatcher** indica en qué grupo de hilos (*Thread Pool*) debe ejecutarse una corrutina determinada:

| Despachador | Diseñado para | Ejemplos en Android |
| :--- | :--- | :--- |
| **`Dispatchers.Main`** | Operaciones exclusivas de Interfaz de Usuario (hilo principal). | Actualizar estados de Jetpack Compose, animaciones, navegación. |
| **`Dispatchers.IO`** | Operaciones de Entrada/Salida bloqueantes fuera de CPU. | Consultas SQL con Room, peticiones HTTP de red, lectura/escritura de ficheros. |
| **`Dispatchers.Default`** | Tareas intensivas en cómputo de procesador. | Parseo de JSONs masivos, ordenación de listas gigantescas, compresión o filtros de imagen. |

### Cambio de Contexto Seguro con `withContext`
Permite cambiar temporalmente de hilo para una operación pesada y regresar automáticamente al hilo original:

```kotlin
import kotlinx.coroutines.*

suspend fun cargarCatalogoYActualizarUi() {
    // 1. Cambiamos al hilo de Entrada/Salida para descargar
    val datos = withContext(Dispatchers.IO) {
        println("Descargando en hilo de red: ${Thread.currentThread().name}")
        delay(1500)
        listOf("Metroid", "Pokemon", "Zelda")
    }

    // 2. Al salir de withContext, volvemos automáticamente al hilo original (Main)
    println("Actualizando pantalla en Compose con: $datos")
}
```

---

## 6. Manejo de Errores con `try-catch`

A diferencia de los callbacks antiguos donde las excepciones se perdían entre hilos, en las corrutinas puedes capturar errores de operaciones asíncronas con la sintaxis clásica de `try-catch`:

```kotlin
import kotlinx.coroutines.*

suspend fun descargarConFalloSeguro() {
    try {
        withContext(Dispatchers.IO) {
            delay(1000)
            throw java.io.IOException("Error 503: Servidor de GameVault no disponible")
        }
    } catch (e: java.io.IOException) {
        println("Error capturado limpiamente: ${e.message}")
        // Aquí actualizamos el UiState a CatalogoUiState.Error(...)
    }
}
```

---

## 7. Retos Prácticos

### 🟢 Reto 1: Saludo con retardo (Básico)
Crea una función de suspensión `saludarConRetardo(nombre: String, tiempoMs: Long)` que imprima "Iniciando espera...", espere el tiempo indicado usando `delay()` y luego imprima "¡Hola, $nombre!". Pruébala dentro de un bloque `runBlocking`.

??? tip "Ver solución"
    ```kotlin
    import kotlinx.coroutines.*

    suspend fun saludarConRetardo(nombre: String, tiempoMs: Long) {
        println("Iniciando espera para $nombre...")
        delay(tiempoMs)
        println("¡Hola, $nombre tras ${tiempoMs}ms!")
    }

    fun main() = runBlocking {
        saludarConRetardo("Mario", 1000)
    }
    ```

### 🟡 Reto 2: Descargas concurrentes con `async` (Intermedio)
Simula la carga de un juego descargando en paralelo sus texturas (demora 1.5 s) y sus sonidos (demora 1.0 s). Mide el tiempo total demostrando que no supera los 1.6 segundos al ejecutarse en paralelo.

??? tip "Ver solución"
    ```kotlin
    import kotlinx.coroutines.*

    suspend fun cargarTexturas(): String {
        delay(1500)
        return "Texturas 4K"
    }

    suspend fun cargarSonidos(): String {
        delay(1000)
        return "Efectos SFX"
    }

    fun main() = runBlocking {
        val inicio = System.currentTimeMillis()

        val texturas = async { cargarTexturas() }
        val sonidos = async { cargarSonidos() }

        println("Recursos listos: ${texturas.await()} y ${sonidos.await()}")
        val totalMs = System.currentTimeMillis() - inicio
        println("Tiempo total en paralelo: $totalMs ms (menos de 2 segundos)")
    }
    ```
