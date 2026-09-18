# Programación Orientada a Objetos Idiomática en Kotlin

Como estudiantes de 2º de DAM, ya domináis los fundamentos de la Programación Orientada a Objetos en Java: encapsulación, constructores, métodos de acceso, herencia, interfaces y polimorfismo. Sin embargo, en Java estos conceptos suelen conllevar una gran cantidad de código repetitivo (*boilerplate*): declaraciones redundantes de atributos, constructores sobrecargados extensos, y decenas de métodos *getter* y *setter*.

Kotlin conserva toda la potencia de la POO, pero reduce drásticamente el código necesario y adopta decisiones de diseño más seguras, modernas y expresivas.

---

## 1. Clases y Constructor Primario Idiomático

En Kotlin, el **constructor primario** forma parte directa de la cabecera de la clase. Al declarar los parámetros con `val` o `var` en la propia cabecera, Kotlin crea automáticamente las propiedades (atributos) y los inicializa con los argumentos recibidos.

Compara la concisión de ambos lenguajes para el mismo modelo de datos:

=== "Kotlin"
    ```kotlin
    // Declaración de clase, 3 propiedades y constructor primario en una sola línea:
    class Videojuego(val titulo: String, var precio: Double, val plataforma: String = "Android")

    fun main() {
        // En Kotlin NO existe la palabra clave 'new':
        val juego = Videojuego("Hollow Knight", 14.99)

        println(juego.titulo) // Lectura directa (llama internamente al getter)
        juego.precio = 9.99   // Modificación permitida porque es 'var' (llama al setter)
        // juego.titulo = "Otro" // ERROR de compilación: 'titulo' es inmutable ('val')
    }
    ```

=== "Java"
    ```java
    // Equivalente estricto en Java (aproximadamente 30 líneas de boilerplate):
    public class Videojuego {
        private final String titulo;
        private double precio;
        private final String plataforma;

        // Constructor primario (sin soporte nativo para valores por defecto)
        public Videojuego(String titulo, double precio, String plataforma) {
            this.titulo = titulo;
            this.precio = precio;
            this.plataforma = plataforma;
        }

        // Sobrecarga manual para simular el valor por defecto de 'plataforma'
        public Videojuego(String titulo, double precio) {
            this(titulo, precio, "Android");
        }

        public String getTitulo() { return titulo; }
        public double getPrecio() { return precio; }
        public void setPrecio(double precio) { this.precio = precio; }
        public String getPlataforma() { return plataforma; }
    }

    // Uso en Java:
    Videojuego juego = new Videojuego("Hollow Knight", 14.99);
    System.out.println(juego.getTitulo());
    juego.setPrecio(9.99);
    ```

!!! tip "Diferencias Clave frente a Java"
    - **Sin `new`:** La instanciación se realiza llamando a la clase como si fuera una función: `Videojuego(...)`.
    - **Menos ruido:** Se pasa de 30 líneas a 1 sola línea, reduciendo la superficie de posibles errores y facilitando el mantenimiento.
    - **Valores por defecto:** `plataforma: String = "Android"` evita la sobrecarga manual de múltiples constructores.

---

## 2. El Bloque de Inicialización: `init` y Constructores Secundarios

### El Bloque `init`
Dado que el constructor primario se declara en la cabecera y no tiene cuerpo con llaves `{ ... }`, cualquier lógica de validación o inicialización que deba ejecutarse al instanciar el objeto se ubica dentro de uno o varios bloques **`init`**:

=== "Kotlin"
    ```kotlin
    class Personaje(val nombre: String, var puntosVida: Int) {

        init {
            // Se ejecuta inmediatamente tras instanciar el objeto
            require(nombre.isNotBlank()) { "El nombre del personaje no puede estar vacío." }
            require(puntosVida > 0) { "Los puntos de vida iniciales deben ser mayores que cero." }
            println("-> Personaje '$nombre' instanciado con $puntosVida PV.")
        }
    }
    ```

=== "Java"
    ```java
    public class Personaje {
        private final String nombre;
        private int puntosVida;

        public Personaje(String nombre, int puntosVida) {
            if (nombre == null || nombre.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre no puede estar vacío.");
            }
            if (puntosVida <= 0) {
                throw new IllegalArgumentException("Los PV iniciales deben ser > 0.");
            }
            this.nombre = nombre;
            this.puntosVida = puntosVida;
            System.out.println("-> Personaje '" + nombre + "' instanciado.");
        }
    }
    ```

### Constructores Secundarios vs Valores por Defecto
En Java, si quieres permitir crear un objeto con menos parámetros, sobrecargas constructores con `this(...)`. En Kotlin puedes crear constructores secundarios con la palabra `constructor`, pero **la forma idiomática recomendada es usar parámetros con valores por defecto**:

=== "Kotlin (Idiomático)"
    ```kotlin
    // Parámetro con valor por defecto: NO necesitas constructor secundario
    class Enemigo(val tipo: String, var daño: Int = 10)
    ```

=== "Kotlin (Constructor Secundario)"
    ```kotlin
    class Enemigo(val tipo: String, var daño: Int) {
        // En Kotlin, todo constructor secundario debe delegar obligatoriamente en el primario:
        constructor(tipo: String) : this(tipo, daño = 10) {
            println("Enemigo básico creado con daño estándar.")
        }
    }
    ```

=== "Java"
    ```java
    public class Enemigo {
        private final String tipo;
        private int daño;

        public Enemigo(String tipo, int daño) {
            this.tipo = tipo;
            this.daño = daño;
        }

        // Sobrecarga de constructor obligatoria:
        public Enemigo(String tipo) {
            this(tipo, 10);
        }
    }
    ```

---

## 3. Propiedades y Acceso (`field`)

En Java, los atributos de clase son campos planos en memoria (`fields`), y la encapsulación se implementa mediante métodos explícitos `getX()` y `setX()`.

En Kotlin, **todas las variables de una clase son propiedades**:
- Cada propiedad `val` genera automáticamente un campo privado y un *getter*.
- Cada propiedad `var` genera automáticamente un campo privado, un *getter* y un *setter*.
- La sintaxis `objeto.propiedad` **no es un acceso directo al atributo**, sino una llamada transparente generada por el compilador hacia su getter/setter.

### Getters y Setters Personalizados con `field` (Backing Field)
Si necesitas añadir validación o formateo, puedes implementar tu propio `get()` o `set()`. Dentro del setter, la palabra reservada **`field`** hace referencia directa al valor real en memoria para evitar llamadas recursivas infinitas:

=== "Kotlin"
    ```kotlin
    class CuentaBancaria {
        var saldo: Double = 0.0
            set(nuevoValor) {
                if (nuevoValor >= 0) {
                    field = nuevoValor // 'field' escribe en la memoria real
                } else {
                    println("Error: El saldo no puede ser negativo.")
                }
            }

        // Propiedad calculada (no ocupa memoria, se recalcula al consultarla):
        val tieneFondos: Boolean
            get() = saldo > 0.0
    }

    fun main() {
        val cuenta = CuentaBancaria()
        cuenta.saldo = 150.0 // Ejecuta internamente el setter personalizado
        println(cuenta.tieneFondos) // Ejecuta el getter: true
    }
    ```

=== "Java"
    ```java
    public class CuentaBancaria {
        private double saldo = 0.0;

        public double getSaldo() {
            return saldo;
        }

        public void setSaldo(double nuevoValor) {
            if (nuevoValor >= 0) {
                this.saldo = nuevoValor;
            } else {
                System.out.println("Error: El saldo no puede ser negativo.");
            }
        }

        // Método que simula la propiedad calculada:
        public boolean isTieneFondos() {
            return this.saldo > 0.0;
        }
    }
    ```

!!! info "Interoperabilidad Transparente con Java"
    Si llamas a una clase de Kotlin desde un archivo Java, Kotlin expone automáticamente los métodos estándar: `cuenta.getSaldo()`, `cuenta.setSaldo(150.0)` y `cuenta.isTieneFondos()`. La integración entre ambos lenguajes en Android es del 100%.

---

## 4. Modificadores de Visibilidad: Kotlin vs Java

En Java, si no indicas ningún modificador de visibilidad, el acceso es de paquete (*Package-Private*). En Kotlin, el diseño parte de premisas más seguras y orientadas a proyectos modulares:

| Modificador | En Kotlin | En Java | Diferencia Conceptual |
| :--- | :--- | :--- | :--- |
| **Por Defecto** | **`public`** | **`package-private` (amigable)** | En Kotlin todo es visible por defecto salvo restricción explícita. |
| **`public`** | Visible en todo el proyecto. | Visible en todo el proyecto. | Idéntico. |
| **`private`** | Visible solo en la clase o en el archivo `.kt`. | Visible solo en la clase. | En Kotlin puedes declarar funciones o clases `private` a nivel de archivo. |
| **`protected`** | Visible en la clase y en sus **subclases únicamente**. | Visible en subclases **Y en cualquier clase del mismo paquete**. | En Java `protected` no es seguro dentro del mismo paquete; en Kotlin es estricto. |
| **`internal`** | **Visible en todo el módulo Gradle.** | *No existe equivalente directo.* | Fundamental en Android para encapsular librerías y submódulos. |

!!! tip "¿Por qué `internal` es vital en Android?"
    En Android moderno dividimos los proyectos en módulos Gradle (ej. `:core-network`, `:database`, `:feature-perfil`). El modificador `internal` permite que los componentes de la base de datos se comuniquen libremente entre sí sin exponer sus clases internas al resto de la aplicación.

---

## 5. Herencia: `final` por Defecto y la Palabra Clave `open`

En Java, todas las clases y métodos son abiertos y heredables a menos que los selles expresamente con la palabra clave `final`. En proyectos grandes, esto a menudo conduce a herencias imprevistas y código frágil.

Kotlin adopta el principio de ingeniería de Joshua Bloch (*"Diseña y documenta para la herencia, o prohíbela"*): **en Kotlin todas las clases y métodos son `final` por defecto**:

- Para permitir que una clase pueda ser heredada, debes marcarla como **`open`**.
- Para permitir que un método pueda ser sobrescrito, debes marcarlo como **`open`**.
- La subclase que sobrescribe un método debe incluir obligatoriamente la palabra clave **`override`** (a diferencia de Java, donde `@Override` es una anotación opcional):

=== "Kotlin"
    ```kotlin
    // Clase base abierta a la herencia
    open class Vehiculo(val marca: String, val modelo: String) {
        // Método abierto a ser sobrescrito
        open fun acelerar() {
            println("El vehículo está acelerando...")
        }
    }

    // Subclase: hereda con ':' e invoca el constructor de Vehiculo
    class Coche(marca: String, modelo: String, val puertas: Int) : Vehiculo(marca, modelo) {

        // 'override' es una palabra reservada obligatoria en Kotlin
        override fun acelerar() {
            super.acelerar()
            println("El coche $marca acelera con motor de combustión.")
        }
    }

    fun main() {
        val miCoche = Coche("Toyota", "Corolla", 5)
        miCoche.acelerar()
    }
    ```

=== "Java"
    ```java
    // En Java las clases son heredables por defecto:
    public class Vehiculo {
        private String marca;
        private String modelo;

        public Vehiculo(String marca, String modelo) {
            this.marca = marca;
            this.modelo = modelo;
        }

        // En Java los métodos son sobrescribibles por defecto:
        public void acelerar() {
            System.out.println("El vehículo está acelerando...");
        }
    }

    public class Coche extends Vehiculo {
        private int puertas;

        public Coche(String marca, String modelo, int puertas) {
            super(marca, modelo);
            this.puertas = puertas;
        }

        @Override // En Java es solo una anotación informativa/opcional
        public void acelerar() {
            super.acelerar();
            System.out.println("El coche acelera con motor de combustión.");
        }
    }
    ```

---

## 6. Clases Abstractas e Interfaces

En el diseño orientado a objetos existen dos herramientas fundamentales para definir abstracciones: las clases abstractas y las interfaces. Aunque ninguna de las dos permite crear instancias directamente, responden a necesidades pedagógicas y de modelado distintas.

---

### Clases Abstractas (`abstract`): Jerarquías con Identidad Común

Una **clase abstracta** representa un concepto genérico o incompleto que sirve de molde base para otras clases. 

Se utiliza cuando varias clases comparten tanto **estructura interna** (propiedades y constructor) como **lógica de negocio**, pero tienen operaciones cuyo cálculo o comportamiento varía radicalmente en cada caso.

#### Reglas de las Clases Abstractas:
1. **No se pueden instanciar directamente:** Intentar hacer `val f = FormaGeometrica("Rojo")` produce un error de compilación inmediato.
2. **Métodos abstractos:** Se declaran con `abstract` y no tienen cuerpo `{}`. Obligan a las subclases a implementarlos obligatoriamente mediante la palabra clave `override`.
3. **Métodos concretos:** Una clase abstracta puede tener métodos normales con cuerpo completo que todas las subclases heredan y reutilizan sin necesidad de reescribirlos.
4. **Constructor con estado:** Puede tener un constructor primario con propiedades que las subclases deben alimentar al heredar.

#### Ejemplo Completo: Jerarquía de Formas Geométricas

Observa cómo se define la clase base abstracta y cómo dos clases concretas (`Circulo` y `Rectangulo`) heredan de ella e implementan su método abstracto:

=== "Kotlin"
    ```kotlin
    // 1. Clase base abstracta: no se puede instanciar
    abstract class FormaGeometrica(val color: String) {

        // Método abstracto: cada figura calculará su área de forma distinta
        abstract fun calcularArea(): Double

        // Método concreto: lógica compartida por todas las formas hijas
        fun imprimirFicha() {
            println("Forma de color $color | Área: ${String.format("%.2f", calcularArea())} cm²")
        }
    }

    // 2. Subclase concreta: Circulo
    // Invoca el constructor de la clase abstracta ': FormaGeometrica(color)'
    class Circulo(color: String, val radio: Double) : FormaGeometrica(color) {
        // Obligatorio implementar 'calcularArea()' con 'override'
        override fun calcularArea(): Double = Math.PI * radio * radio
    }

    // 3. Subclase concreta: Rectangulo
    class Rectangulo(color: String, val base: Double, val altura: Double) : FormaGeometrica(color) {
        override fun calcularArea(): Double = base * altura
    }

    fun main() {
        // val error = FormaGeometrica("Azul") // ERROR: No se puede instanciar

        // Creamos una colección polimórfica usando el tipo abstracto:
        val figuras: List<FormaGeometrica> = listOf(
            Circulo(color = "Rojo", radio = 5.0),
            Rectangulo(color = "Azul", base = 4.0, altura = 6.0),
            Circulo(color = "Verde", radio = 2.5)
        )

        println("--- FICHAS DE FIGURAS ---")
        for (figura in figuras) {
            // Reutiliza 'imprimirFicha()' y ejecuta el 'calcularArea()' de cada subtipo:
            figura.imprimirFicha()
        }
    }
    ```

=== "Java"
    ```java
    // 1. Clase base abstracta en Java
    public abstract class FormaGeometrica {
        private final String color;

        public FormaGeometrica(String color) {
            this.color = color;
        }

        public abstract double calcularArea();

        public void imprimirFicha() {
            System.out.printf("Forma de color %s | Área: %.2f cm²%n", color, calcularArea());
        }

        public String getColor() { return color; }
    }

    // 2. Subclase Circulo en Java
    public class Circulo extends FormaGeometrica {
        private final double radio;

        public Circulo(String color, double radio) {
            super(color);
            this.radio = radio;
        }

        @Override
        public double calcularArea() {
            return Math.PI * radio * radio;
        }
    }

    // 3. Subclase Rectangulo en Java
    public class Rectangulo extends FormaGeometrica {
        private final double base;
        private final double altura;

        public Rectangulo(String color, double base, double altura) {
            super(color);
            this.base = base;
            this.altura = altura;
        }

        @Override
        public double calcularArea() {
            return base * altura;
        }
    }
    ```

---

### Interfaces (`interface`): El Contrato de Capacidades

A diferencia de una clase abstracta (que define **qué es un objeto** en una jerarquía biológica o de familia), una **interfaz** define **qué sabe hacer un objeto**, funcionando como un **contrato formal de capacidades**.

```
Una clase abstracta define la ESENCIA o NATURALEZA (Ejemplo: 'Coche' ES UN 'Vehiculo').
Una interfaz define una CAPACIDAD o HABILIDAD (Ejemplo: 'Coche' y 'Bicicleta' son 'Conducibles').
```

#### ¿Para qué se utiliza una interfaz?

1. **Unificar comportamientos entre clases no emparentadas:**
   Dos clases completamente distintas pueden implementar la misma interfaz. Por ejemplo, en una aplicación multimedia para móvil, tanto una `Cancion` como un `StreamingEnDirecto` son elementos que el reproductor de sonido puede controlar, aunque internamente funcionen de manera radicalmente distinta.

2. **Polimorfismo limpio sin acoplamiento:**
   El reproductor del móvil solo necesita saber que el elemento cumple con la interfaz `Reproducible`, sin importarle cómo gestiona la memoria o de dónde descarga los datos:

=== "Kotlin"
    ```kotlin
    // Contrato: cualquier elemento que se pueda reproducir en la app
    interface Reproducible {
        val titulo: String // Propiedad abstracta (no requiere la palabra 'abstract')

        fun reproducir()   // Método abstracto (no requiere la palabra 'abstract')

        // Método con implementación por defecto:
        fun pausar() {
            println("⏸️ Reproducción de '$titulo' en pausa.")
        }
    }

    // Pista musical descargada en el dispositivo:
    class Cancion(
        override val titulo: String,
        val artista: String,
        val duracionSegundos: Int
    ) : Reproducible {

        override fun reproducir() {
            println("🎵 Reproduciendo pista de audio local: '$titulo' de $artista ($duracionSegundos seg)")
        }
    }

    // Emisión en vivo por internet:
    class StreamingEnDirecto(
        override val titulo: String,
        val urlServidor: String
    ) : Reproducible {

        override fun reproducir() {
            println("📡 Conectando al buffer de streaming en vivo: '$titulo' [$urlServidor]")
        }
    }

    // Función polimórfica: gestiona cualquier contenido sin saber qué tipo concreto es
    fun reproducirContenido(elemento: Reproducible) {
        println("\n>>> El reproductor inicia nuevo contenido:")
        elemento.reproducir()
        elemento.pausar()
    }

    fun main() {
        val tema = Cancion("Blinding Lights", "The Weeknd", 200)
        val directo = StreamingEnDirecto("Radio DAM FM", "https://stream.dam.es/live")

        reproducirContenido(tema)
        reproducirContenido(directo)
    }
    ```

=== "Java"
    ```java
    public interface Reproducible {
        String getTitulo(); // En Java se define como método getter

        void reproducir();

        default void pausar() { // En Java es obligatorio usar la palabra clave 'default'
            System.out.println("⏸️ Reproducción de '" + getTitulo() + "' en pausa.");
        }
    }

    public class Cancion implements Reproducible {
        private final String titulo;
        private final String artista;
        private final int duracionSegundos;

        public Cancion(String titulo, String artista, int duracionSegundos) {
            this.titulo = titulo;
            this.artista = artista;
            this.duracionSegundos = duracionSegundos;
        }

        @Override
        public String getTitulo() { return titulo; }

        @Override
        public void reproducir() {
            System.out.println("🎵 Reproduciendo pista de audio local: '" + titulo + "' de " + artista);
        }
    }

    public class StreamingEnDirecto implements Reproducible {
        private final String titulo;
        private final String urlServidor;

        public StreamingEnDirecto(String titulo, String urlServidor) {
            this.titulo = titulo;
            this.urlServidor = urlServidor;
        }

        @Override
        public String getTitulo() { return titulo; }

        @Override
        public void reproducir() {
            System.out.println("📡 Conectando a streaming en vivo: '" + titulo + "' [" + urlServidor + "]");
        }
    ```

!!! info "¿Es necesario escribir la palabra clave `abstract` en una interfaz?"
    **No, en una interfaz es redundante.**
    
    - **En una `interface`:** Cualquier método sin cuerpo y cualquier propiedad sin valor ni *getter* es **automáticamente abstracta por defecto**. Puedes escribir `abstract val titulo: String`, pero el compilador te advertirá de que el modificador es redundante.
    - **En una `abstract class`:** Aquí **SÍ es obligatorio** poner la palabra `abstract` tanto en métodos como en propiedades sin inicializar (`abstract val titulo: String`). Si no lo pones, el compilador esperará que inicialices la propiedad con un valor inicial.
    - **Propiedades con implementación en interfaces:** Una interfaz también puede tener una propiedad con código predeterminado si defines un *getter* personalizado:
      ```kotlin
      interface Identificable {
          val id: String // Abstracta implícita: las clases deben proveerla
          val tieneIdValido: Boolean // NO abstracta: implementación por defecto
              get() = id.isNotBlank()
      }
      ```

---

### Múltiples Interfaces (Superar la Herencia Simple)

En Kotlin y en Java, una clase **solo puede heredar de una única superclase** (herencia simple), pero **puede implementar tantas interfaces como necesite**.

Siguiendo con nuestro reproductor, podemos tener una segunda interfaz llamada `Descargable`:

```kotlin
interface Descargable {
    val tamañoMegas: Double
    fun descargarOffline()
}

// Una Canción es Reproducible Y también Descargable:
class Cancion(
    override val titulo: String,
    val artista: String,
    override val tamañoMegas: Double
) : Reproducible, Descargable {

    override fun reproducir() {
        println("🎵 Reproduciendo $titulo")
    }

    override fun descargarOffline() {
        println("⬇️ Descargando '$titulo' ($tamañoMegas MB) a la memoria del móvil...")
    }
}

// Un Streaming se puede reproducir, pero NO se puede descargar:
class StreamingEnDirecto(
    override val titulo: String,
    val urlServidor: String
) : Reproducible {

    override fun reproducir() {
        println("📡 Emitiendo en directo: $titulo")
    }
}
```

### Composición frente a Herencia ("Composición sobre Herencia")

Uno de los principios de diseño de software más célebres y vigentes (popularizado por el libro *Design Patterns* de la banda del GoF y reforzado por Joshua Bloch) establece:

> **"Favorece la composición sobre la herencia de clases."**

A menudo, los desarrolladores noveles tienden a resolver cualquier necesidad creando largas cadenas jerárquicas de herencia (`CocheVoladorAnfibio extends VehiculoVolador extends Vehiculo`). Con el tiempo, esto genera código rígido y difícil de mantener.

#### La Metáfora: ¿"ES UN" o "TIENE UN"?

```
HERENCIA (Relación "ES UN"):
  Un 'Mago' ES UN 'Personaje'.
  -> Vinculación fuerte, rígida y fija en tiempo de compilación.

COMPOSICIÓN (Relación "TIENE UN" o "USA UN"):
  Un 'Mago' TIENE UN 'Ataque' y TIENE UN 'ModoDeDesplazamiento'.
  -> Vinculación débil, modular y configurable en tiempo de ejecución.
```

#### ¿Por qué la Composición es más flexible que la Herencia?

1. **Evita la explosión combinatoria de clases:**
   Si intentas usar herencia para combinar habilidades de juego (`GuerreroCaminante`, `GuerreroVolador`, `MagoCaminante`, `MagoVolador`), el número de clases se multiplica exponencialmente. Con composición, tienes una única clase `Heroe` a la que le inyectas las capacidades que desees.

2. **Permite cambiar el comportamiento en tiempo de ejecución:**
   La herencia es estática: un objeto no puede cambiar su clase base mientras la aplicación está corriendo. Con composición, cambiar el comportamiento es tan fácil como reasignar una propiedad (`heroe.arma = Arco()`).

3. **Facilita las pruebas y el mantenimiento:**
   Cada pieza es pequeña, independiente y se comunica a través de una interfaz limpia.

#### Ejemplo Pedagógico: Sistema de Héroes con Composición

Definimos interfaces para las capacidades y componemos el objeto principal mediante sus piezas:

=== "Kotlin"
    ```kotlin
    // 1. Contratos de comportamiento independientes
    interface Arma {
        fun usar(): String
    }

    interface Movimiento {
        fun mover(): String
    }

    // 2. Implementaciones concretas intercambiables
    class EspadaPesada : Arma {
        override fun usar() = "asesta un tajo demoledor con su Espada (Daño: 45)"
    }

    class ArcoElfico : Arma {
        override fun usar() = "dispara una flecha certera a distancia (Daño: 30)"
    }

    class Caminar : Movimiento {
        override fun mover() = "avanza a pie cautelosamente"
    }

    class Volar : Movimiento {
        override fun mover() = "despliega alas de energía y vuela velozmente"
    }

    // 3. Clase Compuesta: el Héroe 'TIENE' un arma y un modo de movimiento
    class Heroe(
        val nombre: String,
        var arma: Arma,              // Composición: referencia a la interfaz
        var movimiento: Movimiento   // Composición: intercambiable en caliente
    ) {
        fun actuar() {
            println("-> $nombre ${movimiento.mover()} y ${arma.usar()}.")
        }
    }

    fun main() {
        // Creamos un héroe inicial equipado con espada y a pie
        val lancelot = Heroe("Lancelot", EspadaPesada(), Caminar())
        lancelot.actuar()

        // ¡FLEXIBILIDAD DINÁMICA! Cambiamos su comportamiento en tiempo de ejecución:
        println("\n[Lancelot recoge un arco mágico y un hechizo de vuelo]")
        lancelot.arma = ArcoElfico()
        lancelot.movimiento = Volar()
        lancelot.actuar()
    }
    ```

=== "Java"
    ```java
    // 1. Interfaces
    public interface Arma {
        String usar();
    }

    public interface Movimiento {
        String mover();
    }

    // 2. Implementaciones
    public class EspadaPesada implements Arma {
        @Override public String usar() { return "asesta un tajo con Espada (Daño: 45)"; }
    }

    public class ArcoElfico implements Arma {
        @Override public String usar() { return "dispara una flecha certera (Daño: 30)"; }
    }

    public class Caminar implements Movimiento {
        @Override public String mover() { return "avanza a pie"; }
    }

    public class Volar implements Movimiento {
        @Override public String mover() { return "vuela velozmente"; }
    }

    // 3. Composición en Java
    public class Heroe {
        private final String nombre;
        private Arma arma;
        private Movimiento movimiento;

        public Heroe(String nombre, Arma arma, Movimiento movimiento) {
            this.nombre = nombre;
            this.arma = arma;
            this.movimiento = movimiento;
        }

        public void setArma(Arma arma) { this.arma = arma; }
        public void setMovimiento(Movimiento movimiento) { this.movimiento = movimiento; }

        public void actuar() {
            System.out.println("-> " + nombre + " " + movimiento.mover() + " y " + arma.usar() + ".");
        }
    }
    ```

---

### La Magia de Kotlin: Delegación de Interfaces (`by`)

En Java, cuando usas composición y quieres que tu clase contenedora implemente la interfaz delegando el trabajo en el objeto interno, tienes que escribir métodos envoltorios manuales (*boilerplate*):

```java
// En Java: cascarón repetitivo obligatorio
public class SuperHeroe implements Arma {
    private final Arma arma;
    public SuperHeroe(Arma arma) { this.arma = arma; }

    @Override
    public String usar() {
        return this.arma.usar(); // Delegación manual tediosa
    }
}
```

En Kotlin, el lenguaje ofrece una característica nativa revolucionaria: **la delegación de clases mediante la palabra clave `by`**. 

El compilador de Kotlin se encarga de implementar automáticamente todos los métodos de la interfaz redirigiéndolos al objeto delegado:

```kotlin
interface Notificador {
    fun enviarMensaje(texto: String)
}

class NotificadorConsola : Notificador {
    override fun enviarMensaje(texto: String) = println("Consola: $texto")
}

// ¡Delegación nativa con 'by'!
// ServicioAlumnos implementa 'Notificador', pero delega todo el trabajo en 'notificador'
class ServicioAlumnos(notificador: Notificador) : Notificador by notificador {

    fun matricularAlumno(nombre: String) {
        // Invocamos directamente 'enviarMensaje' como si fuera nuestro:
        enviarMensaje("Alumno '$nombre' matriculado satisfactoriamente.")
    }
}

fun main() {
    val servicio = ServicioAlumnos(NotificadorConsola())
    servicio.matricularAlumno("Lucía García")
}
```

!!! tip "¿Cuándo usar Clase Abstracta vs Interfaz vs Composición?"
    - **Usa Clase Abstracta:** Para familias biológicas muy cercanas donde un grupo cerrado de clases comparte mucha lógica y estado interno protegido (`Circulo` ES UNA `FormaGeometrica`).
    - **Usa Interfaces:** Para definir contratos de habilidades (`Reproducible`, `Arma`, `Guardable`) que pueden adoptar clases sin ninguna relación de parentesco.
    - **Usa Composición:** Cuando quieras construir objetos complejos combinando capacidades intercambiables como piezas de LEGO, permitiendo cambiar el comportamiento en tiempo de ejecución.

---

## 7. Polimorfismo, Comprobación de Tipos y *Smart Casting*

El **polimorfismo** es uno de los cuatro pilares de la POO: permite interactuar con objetos de diferentes tipos a través de un tipo base común (clase padre o interfaz).

Sin embargo, en ocasiones necesitamos averiguar el tipo concreto de un objeto en tiempo de ejecución para acceder a sus funciones exclusivas. Aquí es donde Kotlin revoluciona la POO eliminando el casteo manual de Java.

### Comprobación de Tipo: `is` (Kotlin) vs `instanceof` (Java)

En Kotlin, el operador **`is`** sustituye al operador `instanceof` de Java, mientras que **`!is`** comprueba si un objeto NO pertenece a determinado tipo:

```kotlin
open class Empleado(val nombre: String, val salarioBase: Double)
class Desarrollador(nombre: String, salarioBase: Double, val lenguajePrincipal: String) : Empleado(nombre, salarioBase) {
    fun programar() {
        println("$nombre está escribiendo código en $lenguajePrincipal.")
    }
}
class Diseñador(nombre: String, salarioBase: Double, val herramienta: String) : Empleado(nombre, salarioBase) {
    fun diseñarMockup() {
        println("$nombre está diseñando interfaces en $herramienta.")
    }
}
```

### El Poder del *Smart Casting*: Adiós al Casteo Manual

Observa la enorme diferencia entre la comprobación tradicional de Java y el *Smart Casting* de Kotlin:

=== "Kotlin (Smart Casting Automático)"
    ```kotlin
    fun asignarTarea(empleado: Empleado) {
        if (empleado is Desarrollador) {
            // ¡SMART CAST! El compilador sabe que aquí 'empleado' es Desarrollador.
            // Accedemos a sus miembros específicos SIN casteo manual:
            println("Asignando ticket en ${empleado.lenguajePrincipal}")
            empleado.programar()
        } else if (empleado is Diseñador) {
            // ¡Smart Cast automático a Diseñador!
            empleado.diseñarMockup()
        } else {
            println("Empleado genérico: ${empleado.nombre}")
        }
    }
    ```

=== "Java (instanceof + Casteo Explícito Manual)"
    ```java
    public void asignarTarea(Empleado empleado) {
        if (empleado instanceof Desarrollador) {
            // En Java es OBLIGATORIO crear una variable y castear explícitamente:
            Desarrollador dev = (Desarrollador) empleado;
            System.out.println("Asignando ticket en " + dev.getLenguajePrincipal());
            dev.programar();
        } else if (empleado instanceof Diseñador) {
            Diseñador dis = (Diseñador) empleado;
            dis.diseñarMockup();
        } else {
            System.out.println("Empleado genérico: " + empleado.getNombre());
        }
    }
    ```

!!! tip "Smart Cast en condiciones lógicas combinadas"
    El compilador de Kotlin es tan avanzado que el Smart Cast funciona incluso dentro de expresiones lógicas con `&&`:
    
    ```kotlin
    // Si la primera condición es 'true', la segunda ya sabe que es Desarrollador:
    if (empleado is Desarrollador && empleado.lenguajePrincipal == "Kotlin") {
        println("¡Candidato ideal para Android!")
    }
    ```

### Casteos Explícitos: Inseguro (`as`) vs Seguro (`as?`)

Si necesitas forzar una conversión de tipo de manera explícita (por ejemplo, al deserializar datos de red o al extraer argumentos de un `Bundle` en Android), compara el manejo de errores:

=== "Kotlin"
    ```kotlin
    val datoDesconocido: Any = 12345

    // 1. Casteo Inseguro ('as'): Lanza ClassCastException si no coincide
    // val texto: String = datoDesconocido as String // ¡EXPLOTA en runtime!

    // 2. Casteo Seguro ('as?'): Devuelve null en lugar de lanzar excepción
    val textoSeguro: String? = datoDesconocido as? String // Vale null (sin crash)

    // Combinado de forma idiomática con el operador Elvis (?:):
    val longitud = (datoDesconocido as? String)?.length ?: 0
    println("Longitud segura: $longitud") // Imprime 0 limpiamente
    ```

=== "Java"
    ```java
    Object datoDesconocido = 12345;

    // En Java todo casteo explícito es inseguro por defecto.
    // Para evitar que la aplicación se cierre forzosamente (crash),
    // debes rodearlo de un bloque try-catch o un if previo:
    String textoSeguro;
    try {
        textoSeguro = (String) datoDesconocido;
    } catch (ClassCastException e) {
        textoSeguro = null;
    }

    int longitud = (textoSeguro != null) ? textoSeguro.length() : 0;
    System.out.println("Longitud segura: " + longitud);
    ```

### ¿Cuándo es posible el Smart Cast? (Regla de Oro)

Para que el compilador aplique el *Smart Casting*, debe tener la **garantía matemática de que la variable no ha cambiado de valor entre la comprobación y el uso**.

Por ello, el Smart Cast se aplica a:
- Variables locales declaradas con **`val`** (inmutables).
- Propiedades privadas o finales de solo lectura (`val`) dentro de la misma clase.

No se puede aplicar a:
- Variables **`var`** que puedan ser reasignadas en cualquier momento por otro hilo concurrente o por otra función.
- Propiedades abiertas (`open`) o con *getters* personalizados (porque cada llamada al getter podría devolver un objeto diferente).

---

## 8. La Gran Comparativa: POO en Java vs Kotlin

A modo de síntesis, la siguiente tabla reúne las diferencias conceptuales y sintácticas fundamentales que encontrarás en el paso de Java a Kotlin:

| Concepto POO | Java | Kotlin | Ventaja de Kotlin |
| :--- | :--- | :--- | :--- |
| **Instanciación** | `new Videojuego(...)` | `Videojuego(...)` | Sintaxis uniforme sin palabra reservada `new`. |
| **Constructor y atributos** | Campos privados + constructor extenso + getters/setters (30 líneas) | Constructor primario en cabecera `class V(val a: Int)` (1 línea) | Cero código repetitivo (*boilerplate*). |
| **Valores por defecto** | Sobrecarga manual de constructores con `this(...)` | Parámetros con valor por defecto `val plat: String = "Android"` | Menos constructores sobrecargados. |
| **Acceso a propiedades** | `objeto.getSaldo()` / `objeto.setSaldo(v)` | `objeto.saldo` / `objeto.saldo = v` | Sintaxis limpia de acceso directo sin romper la encapsulación. |
| **Visibilidad por defecto** | *Package-Private* (visible solo en paquete) | **`public`** | Modelo intuitivo y consistente. |
| **Visibilidad modular** | No existe nativamente a nivel de compilador | **`internal`** (visible solo en el módulo Gradle) | Crucial para arquitecturas modulares en Android. |
| **Herencia de clases** | Clases abiertas por defecto | **`final` por defecto** (requiere `open`) | Evita acoplamiento frágil por diseño. |
| **Sobrescritura de métodos** | Abiertos por defecto; `@Override` es opcional | **`final` por defecto**; `override` es obligatorio | Garantía estricta contra errores tipográficos en firmas. |
| **Interfaces** | Métodos abstractos y `default` | Métodos con cuerpo y **propiedades abstractas** | Permite modelar contratos con atributos requeridos. |
| **Comprobación de tipos** | `if (x instanceof Clase)` | `if (x is Clase)` | Operador más legible y expresivo. |
| **Casteo de tipos** | Manual y ruidoso: `(Clase) x` | **Automático (*Smart Cast*)** o seguro con `as?` | Cero excepciones `ClassCastException` imprevistas. |
| **Composición y delegación** | Métodos delegados escritos a mano (*boilerplate*) | **Nativa con la palabra clave `by`** (`: Interfaz by objeto`) | Composición transparente sin escribir envoltorios manuales. |

---

## 9. Retos Prácticos

### 🟢 Reto 1: Entidad de Dominio (Básico)
Crea una clase `Usuario` con constructor primario que contenga `id: Long`, `email: String` y `esAdmin: Boolean = false`. Añade un bloque `init` que verifique que el correo electrónico contiene el carácter `'@'`.

??? tip "Ver solución"
    ```kotlin
    class Usuario(val id: Long, val email: String, val esAdmin: Boolean = false) {
        init {
            require(email.contains("@")) { "El formato del email es incorrecto." }
        }
    }

    fun main() {
        val user1 = Usuario(1L, "admin@empresa.com", esAdmin = true)
        println("Usuario creado: ${user1.email}")
    }
    ```

### 🟡 Reto 2: Encapsulación con `field` (Intermedio)
Diseña una clase `Termostato` con una propiedad `temperatura` en grados Celsius. El setter debe impedir que la temperatura se ajuste a valores inferiores a -50°C o superiores a 60°C, imprimiendo una advertencia si se intenta. Añade una propiedad calculada `temperaturaFahrenheit`.

??? tip "Ver solución"
    ```kotlin
    class Termostato(temperaturaInicial: Double = 20.0) {
        var temperatura: Double = temperaturaInicial
            set(valor) {
                if (valor in -50.0..60.0) {
                    field = valor
                } else {
                    println("Advertencia: Temperatura fuera de rango operativo seguro.")
                }
            }

        val temperaturaFahrenheit: Double
            get() = (temperatura * 9 / 5) + 32
    }

    fun main() {
        val t = Termostato(22.0)
        println("Temperatura actual: ${t.temperatura}°C (${t.temperaturaFahrenheit}°F)")
        t.temperatura = 100.0 // Rango no permitido
    }
    ```

### 🔴 Reto 3: Jerarquía polimórfica para GameVault (Avanzado)
Diseña una clase base abierta `ItemInventario(val nombre: String, val peso: Double)` con un método abierto `usar()`. Crea dos clases derivadas: `Pocion(nombre: String, peso: Double, val curacion: Int)` y `Arma(nombre: String, peso: Double, val daño: Int)`. Crea una lista polimórfica `List<ItemInventario>` y recórrela invocando el método `usar()` de cada elemento.

??? tip "Ver solución"
    ```kotlin
    open class ItemInventario(val nombre: String, val peso: Double) {
        open fun usar() {
            println("Usando objeto genérico: $nombre")
        }
    }

    class Pocion(nombre: String, peso: Double, val curacion: Int) : ItemInventario(nombre, peso) {
        override fun usar() {
            println("Bebiendo $nombre: ¡Recuperas $curacion puntos de vida!")
        }
    }

    class Arma(nombre: String, peso: Double, val daño: Int) : ItemInventario(nombre, peso) {
        override fun usar() {
            println("Blandiendo $nombre: ¡Infliges $daño puntos de daño!")
        }
    }

    fun main() {
        val inventario: List<ItemInventario> = listOf(
            Pocion("Poción de Salud Menor", 0.5, 50),
            Arma("Espada Maestra", 3.2, 120),
            Pocion("Elixir de Maná", 0.4, 30)
        )

        for (item in inventario) {
            item.usar() // Polimorfismo en acción
        }
    }
    ```
