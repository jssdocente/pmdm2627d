# Singletons, Companion Object y Objetos Anónimos en Kotlin

En Java, cuando se necesita compartir un recurso único a nivel global se implementa el patrón **Singleton** (lo que requiere constructores privados, variables estáticas y bloqueos para evitar problemas en multihilo), y cuando se necesitan métodos o constantes globales se recurre a la palabra clave `static`.

Kotlin no dispone de la palabra clave `static`. En su lugar, aborda estas necesidades mediante la palabra reservada **`object`** a través de tres mecanismos diferenciados y elegantes:

1. **Declaración de Objetos (*Object Declarations*):** Singletons nativos con nombre.

2. **Objetos Compañeros (*Companion Objects*):** Miembros estáticos asociados a una clase.

3. **Expresiones de Objeto (*Object Expressions*):** Objetos anónimos e instancias puntuales de interfaces.

---

## 1. Declaración de Objetos: El Patrón Singleton Nativo

### ¿Qué es el Patrón Singleton y qué problema resuelve?

El patrón **Singleton** es uno de los patrones creacionales clásicos descritos por la "Banda de los Cuatro" (GoF). Su propósito fundamental es:

1. **Garantizar que una clase tenga una única instancia** en toda la memoria de la aplicación durante su ciclo de vida.

2. **Proporcionar un punto de acceso global** a dicha instancia sin requerir pasarla manualmente por cada constructor o parámetro.

Se utiliza habitualmente para gestionar recursos compartidos costosos: una base de datos local, un cliente de red, un gestor de configuración o una caché en memoria.

!!! info "Referencia Externa: Patrón Singleton en la Industria"
    Para conocer a fondo el diagrama UML, su aplicabilidad teórica y sus variantes en distintos lenguajes, puedes consultar la guía interactiva de [Refactoring Guru: Patrón Singleton](https://refactoring.guru/es/design-patterns/singleton).

---

### La Pesadilla de Java vs la Solución Nativa de Kotlin

En Java, implementar un Singleton *Thread-Safe* (seguro ante múltiples hilos de ejecución concurrentes) requiere escribir una gran cantidad de código propenso a errores (*Double-Checked Locking* con variables `volatile` y bloques `synchronized`).

En Kotlin, el compilador y la JVM lo resuelven de forma **nativa y segura con una sola palabra reservada: `object`**:

=== "Kotlin (Nativo con `object`)"
    ```kotlin
    // El compilador genera automáticamente una clase final con una instancia estática única
    // y la inicializa de forma perezosa y segura ante hilos durante la carga de clases.
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
        // Se accede directamente por su nombre, sin instanciar con () ni llamar a getInstance()
        GestorSesion.usuarioActivo = "mario_bros"
        GestorSesion.tokenAutenticacion = "JWT_SECURE_TOKEN_888"

        println("¿Logueado? ${GestorSesion.estaAutenticado()}") // true
        GestorSesion.cerrarSesion()
    }
    ```

=== "Java (Boilerplate y Doble Bloqueo Sincronizado)"
    ```java
    public class GestorSesionJava {
        // 1. Variable estática única marcada como volatile para evitar problemas de caché de CPU
        private static volatile GestorSesionJava instance;

        private String usuarioActivo;
        private String tokenAutenticacion;

        // 2. Constructor privado para impedir que nadie haga 'new GestorSesionJava()'
        private GestorSesionJava() {}

        // 3. Método de acceso global con doble bloqueo sincronizado (Double-Checked Locking)
        public static GestorSesionJava getInstance() {
            if (instance == null) {
                synchronized (GestorSesionJava.class) {
                    if (instance == null) {
                        instance = new GestorSesionJava();
                    }
                }
            }
            return instance;
        }

        public boolean estaAutenticado() {
            return tokenAutenticacion != null;
        }

        public void cerrarSesion() {
            this.usuarioActivo = null;
            this.tokenAutenticacion = null;
            System.out.println("Sesión cerrada con éxito.");
        }
    }
    ```

### Características Clave de una Declaración de Objeto en Kotlin:

- **Instancia única garantizada:** El compilador asegura que existirá exactamente una sola instancia en toda la memoria de la aplicación.
- **Sin constructores:** No puede tener constructores primarios ni secundarios; no se puede hacer `GestorSesion()`.
- **Herencia e interfaces:** Puede heredar de clases abiertas (`open class`) e implementar interfaces (`interface`), lo que permite que un Singleton actúe como implementación concreta de un contrato.

!!! warning "Cuidado con el Antipatrón: Estado Global Mutable y Testing"
    Aunque `object` es extremadamente cómodo, abusar de Singletons para guardar **estado mutable global** se considera un *antipatrón* en aplicaciones móviles grandes:

    - **Acoplamiento oculto:** Cualquier parte de la app puede modificar el estado sin que las demás se enteren.
    - **Imposible de testear con Mocks:** En pruebas unitarias, no puedes sustituir fácilmente un `object` por una implementación falsa de prueba (*Mock*).

    En Android moderno, la alternativa arquitectural recomendada es **gestionar el ciclo de vida de instancias únicas mediante Inyección de Dependencias** (usando la función `single { ... }` de **Koin** o Hilt), como veremos en el bloque de Arquitectura.

---

## 2. El Objeto Compañero (*Companion Object*) y el Patrón Factory Method

Dado que en Kotlin no existe la palabra reservada `static`, ¿dónde colocamos las constantes globales, las etiquetas de *logging* (`TAG`) o los métodos factoría que en Java pertenecían a la clase y no a la instancia?

La respuesta es el **`companion object`**: un objeto especial que se declara dentro de una clase y cuyos miembros pueden invocarse directamente utilizando el nombre de la clase contenedora.

### El Patrón Factory Method (Método Factoría)

Uno de los usos más elegantes y profesionales del `companion object` es implementar el patrón **Factory Method**: en lugar de permitir la instanciación directa mediante constructores públicos ambiguos, la clase define su constructor como `private` y expone métodos factoría estáticos con nombres semánticos que describen claramente la variante que se está construyendo.

!!! info "Referencia Externa: Patrón Factory Method"
    Puedes consultar la explicación conceptual, estructura y casos de uso del patrón en [Refactoring Guru: Patrón Factory Method](https://refactoring.guru/es/design-patterns/factory-method). Para explorar más soluciones estructurales, consulta el catálogo completo de [Refactoring Guru: Patrones de Diseño](https://refactoring.guru/es/design-patterns).

```kotlin
class ClienteHttp private constructor(val urlBase: String, val timeoutSegundos: Int) {

    // Miembros asociados a la clase (equivalente conceptual y superior a 'static' en Java)
    companion object {
        const val TAG = "CLIENTE_HTTP_LOG"
        private const val TIMEOUT_DEFECTO = 30

        // Factoría 1: Cliente preconfigurado para producción
        fun crearParaProduccion(): ClienteHttp {
            println("[$TAG]: Inicializando cliente seguro de Producción")
            return ClienteHttp(urlBase = "https://api.gamevault.com/v1", timeoutSegundos = TIMEOUT_DEFECTO)
        }

        // Factoría 2: Cliente preconfigurado para entorno local de pruebas (Mock)
        fun crearParaDesarrolloLocal(puerto: Int = 8080): ClienteHttp {
            println("[$TAG]: Inicializando cliente para pruebas locales en puerto $puerto")
            return ClienteHttp(urlBase = "http://10.0.2.2:$puerto", timeoutSegundos = 5)
        }
    }

    fun realizarPeticion(endpoint: String) {
        println("Conectando a: $urlBase/$endpoint (Timeout: ${timeoutSegundos}s)")
    }
}

fun main() {
    // Acceso directo a constantes del companion object sin crear instancias:
    println("Tag para Logcat: ${ClienteHttp.TAG}")

    // Invocación expresiva de los Métodos Factoría:
    val clienteProd = ClienteHttp.crearParaProduccion()
    clienteProd.realizarPeticion("juegos")

    val clienteMock = ClienteHttp.crearParaDesarrolloLocal(8080)
    clienteMock.realizarPeticion("usuarios/test")
}
```

!!! tip "Uso habitual en Android"
    En el desarrollo Android, el `companion object` y el patrón Factory Method se utilizan de forma constante para:

    - Definir la constante `TAG` de cada clase para filtrar mensajes en el **Logcat**.
    - Implementar el patrón `newInstance()` para crear `Fragments` con argumentos empaquetados en un `Bundle`.
    - Definir métodos factoría en clases de datos (`User.fromDto(apiDto)`).
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
