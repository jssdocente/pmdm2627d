# Singletons, Companion Object y Objetos Anónimos en Kotlin

En Java, cuando se necesita compartir un recurso único a nivel global se implementa el patrón **Singleton** (lo que requiere constructores privados, variables estáticas y bloqueos para evitar problemas en multihilo), y cuando se necesitan métodos o constantes globales se recurre a la palabra clave `static`.

Kotlin no dispone de la palabra clave `static`. En su lugar, aborda estas necesidades mediante la palabra reservada **`object`** a través de tres mecanismos diferenciados y elegantes:

1. **Declaración de Objetos (*Object Declarations*):** Singletons nativos con nombre.
2. **Objetos Compañeros (*Companion Objects*):** Miembros estáticos asociados a una clase.
3. **Expresiones de Objeto (*Object Expressions*):** Objetos anónimos e instancias puntuales de interfaces.

---

## 1. Declaración de Objetos: El Patrón Singleton Nativo

En Kotlin, crear un Singleton seguro ante hilos (*Thread-Safe*) y con inicialización perezosa (*Lazy Initialization*) solo requiere cambiar la palabra clave `class` por `object`:

```kotlin
object GestorSesion {
    var usuarioActivo: String? = null
    var tokenAutenticacion: String? = null

    fun estaAutenticado(): Boolean = tokenAutenticacion != null

    fun cerrarSesion() {
        usuarioActivo = null
        tokenAutenticacion = null
        println("Sesión cerrada con éxito.")
    }
}

fun main() {
    // Se accede directamente por su nombre, sin instanciar (no hay constructor)
    GestorSesion.usuarioActivo = "mario_bros"
    GestorSesion.tokenAutenticacion = "JWT_SECURE_TOKEN_888"

    println("¿Logueado? ${GestorSesion.estaAutenticado()}") // true
    GestorSesion.cerrarSesion()
}
```

### Características de una Declaración de Objeto:
- **Instancia única:** El compilador garantiza que existirá exactamente una sola instancia en toda la memoria de la aplicación.
- **Sin constructores:** No puede tener constructor primario ni secundario (no se puede instanciar con `()`).
- **Puede heredar e implementar interfaces:** Puede heredar de clases abiertas e implementar contratos de interfaces.

---

## 2. El Objeto Compañero (*Companion Object*)

Dado que en Kotlin no existe `static`, ¿dónde colocamos las constantes globales, las etiquetas de *logging* (`TAG`) o los métodos factoría que en Java pertenecían a la clase y no a la instancia?

La respuesta es el **`companion object`**: un objeto especial que se declara dentro de una clase y cuyos miembros pueden invocarse directamente utilizando el nombre de la clase contenedora:

```kotlin
class ClienteHttp(val urlBase: String) {

    // Miembros asociados a la clase (equivalente conceptual a 'static' en Java)
    companion object {
        const val TAG = "CLIENTE_HTTP_LOG"
        const val TIMEOUT_SEGUNDOS = 30

        // Método factoría para crear instancias preconfiguradas
        fun crearParaProduccion(): ClienteHttp {
            println("[$TAG]: Creando cliente para entorno de producción")
            return ClienteHttp("https://api.gamevault.com/v1")
        }
    }

    fun realizarPeticion(endpoint: String) {
        println("Conectando a: $urlBase/$endpoint")
    }
}

fun main() {
    // Acceso directo a constantes y métodos del companion object sin crear instancias:
    println("Timeout configurado: ${ClienteHttp.TIMEOUT_SEGUNDOS} segundos")
    println("Tag para Logcat: ${ClienteHttp.TAG}")

    // Invocación del método factoría:
    val clienteProd = ClienteHttp.crearParaProduccion()
    clienteProd.realizarPeticion("juegos")
}
```

!!! tip "Uso habitual en Android"
    En el desarrollo Android, el `companion object` se utiliza de forma constante para:
    - Definir la constante `TAG` de cada clase para filtrar mensajes en el **Logcat**.
    - Definir métodos `newInstance()` para crear `Fragments`.
    - Definir constantes de argumentos de navegación en Jetpack Compose (`const val ARG_GAME_ID = "gameId"`).

---

## 3. Expresiones de Objeto (*Object Expressions* / Objetos Anónimos)

Las expresiones de objeto crean instancias de **clases anónimas**, es decir, objetos únicos que no se asocian a un nombre de clase formal. Se utilizan comúnmente cuando necesitamos instanciar una interfaz o extender una clase para un solo uso inmediato (como un *listener* o callback):

```kotlin
interface OnGameDownloadListener {
    fun onProgreso(porcentaje: Int)
    fun onCompletado(archivo: String)
}

fun descargarJuego(nombre: String, listener: OnGameDownloadListener) {
    println("Iniciando descarga de $nombre...")
    listener.onProgreso(50)
    listener.onCompletado("$nombre.apk")
}

fun main() {
    // Creamos una instancia anónima que implementa la interfaz en el acto:
    val miDescargaListener = object : OnGameDownloadListener {
        override fun onProgreso(porcentaje: Int) {
            println("-> Descargando: $porcentaje %")
        }

        override fun onCompletado(archivo: String) {
            println("-> ¡Descarga finalizada! Archivo guardado: $archivo")
        }
    }

    descargarJuego("Cyberpunk 2077", miDescargaListener)
}
```

### Objetos Anónimos Ad-Hoc
También puedes usar `object` para crear estructuras de datos anónimas rápidas y locales sin declarar una clase previa:

```kotlin
val coordenadaTemporal = object {
    val x = 100
    val y = 250
    val descripcion = "Punto de spawn"
}

println("${coordenadaTemporal.descripcion}: (${coordenadaTemporal.x}, ${coordenadaTemporal.y})")
```

---

## 4. Cuadro Comparativo: Cuándo Usar Cada Uno

| Concepto | Sintaxis | Equivalente en Java | Caso de Uso Principal |
| :--- | :--- | :--- | :--- |
| **Object Declaration** | `object MiSingleton { ... }` | Patrón Singleton manual con `getInstance()` | Gestores globales, bases de datos en memoria, servicios únicos. |
| **Companion Object** | `companion object { ... }` dentro de una clase | Miembros `static` (constantes y métodos estáticos) | Constantes `TAG`, métodos factoría, claves de navegación. |
| **Object Expression** | `object : MiInterfaz { ... }` | Clases anónimas (`new MiInterfaz() { ... }`) | Listeners de eventos complejos, callbacks con múltiples métodos. |

---

## 5. Retos Prácticos

### 🟢 Reto 1: Singleton de Configuración de Audio (Básico)
Crea una declaración de objeto `ConfiguracionAudio` que mantenga el `volumenMusica: Int` (entre 0 y 100) y un booleano `estaSilenciado`. Añade un método `silenciar()` y compruébalo desde `main()`.

??? tip "Ver solución"
    ```kotlin
    object ConfiguracionAudio {
        var volumenMusica: Int = 80
        var estaSilenciado: Boolean = false

        fun silenciar() {
            estaSilenciado = true
            println("Audio silenciado por completo.")
        }

        fun reanudar(nuevoVolumen: Int = 50) {
            estaSilenciado = false
            volumenMusica = nuevoVolumen.coerceIn(0, 100)
            println("Audio activo al volumen: $volumenMusica")
        }
    }

    fun main() {
        ConfiguracionAudio.silenciar()
        ConfiguracionAudio.reanudar(75)
    }
    ```

### 🟡 Reto 2: Companion Object para Fábrica de Jugadores (Intermedio)
Crea una clase `Jugador(val nick: String, val nivel: Int, val monedas: Int)`. En su `companion object`, define métodos factoría para `crearNovato(nick: String)` (nivel 1, 100 monedas) y `crearVeterano(nick: String)` (nivel 50, 10.000 monedas).

??? tip "Ver solución"
    ```kotlin
    class Jugador private constructor(val nick: String, val nivel: Int, val monedas: Int) {

        companion object {
            fun crearNovato(nick: String): Jugador {
                return Jugador(nick, nivel = 1, monedas = 100)
            }

            fun crearVeterano(nick: String): Jugador {
                return Jugador(nick, nivel = 50, monedas = 10_000)
            }
        }

        fun mostrarFicha() {
            println("Jugador: $nick | Nivel: $nivel | Monedas: $monedas")
        }
    }

    fun main() {
        val jugador1 = Jugador.crearNovato("Newbie99")
        val jugador2 = Jugador.crearVeterano("ProGamer")

        jugador1.mostrarFicha()
        jugador2.mostrarFicha()
    }
    ```
