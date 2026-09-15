# Programación Orientada a Objetos Idiomática en Kotlin

Como estudiantes de 2º de DAM, ya domináis los fundamentos de la Programación Orientada a Objetos en Java: encapsulación, herencia, interfaces y polimorfismo. Sin embargo, en Java estos conceptos conllevan una gran cantidad de código repetitivo (*boilerplate*): declaraciones redundantes de atributos, constructores extensos, y decenas de métodos *getter* y *setter*.

Kotlin conserva toda la potencia de la POO, pero reduce drásticamente el código necesario y adopta decisiones de diseño más seguras y modernas.

---

## 1. Clases y Constructor Primario Idiomático

En Kotlin, el **constructor primario** forma parte directa de la cabecera de la clase. Al declarar los parámetros con `val` o `var` en la propia cabecera, Kotlin crea automáticamente las propiedades y las inicializa con los valores recibidos:

```kotlin
// Sintaxis idiomática en una sola línea:
// Declara la clase, define 2 propiedades (una inmutable, una mutable) y su constructor
class Videojuego(val titulo: String, var precio: Double, val plataforma: String = "Android")

fun main() {
    // No existe la palabra clave 'new' en Kotlin
    val juego = Videojuego("Hollow Knight", 14.99)

    println(juego.titulo) // Acceso directo: Hollow Knight
    juego.precio = 9.99   // Modificación permitida porque es 'var'
    // juego.titulo = "Otro" // ERROR: 'titulo' es 'val'
}
```

!!! info "Comparativa con Java"
    El código anterior en Java requeriría aproximadamente 25 líneas: 3 atributos privados, un constructor de 3 argumentos y 5 métodos `getters`/`setters`. En Kotlin se expresa de forma concisa y segura en una única línea.

---

## 2. El Bloque de Inicialización: `init`

Dado que el constructor primario no puede contener código ejecutable (solo declara parámetros), cualquier lógica de validación o inicialización que deba ejecutarse al instanciar el objeto se coloca dentro de uno o varios bloques `init`:

```kotlin
class Personaje(val nombre: String, var puntosVida: Int) {

    init {
        require(nombre.isNotBlank()) { "El nombre del personaje no puede estar vacío." }
        require(puntosVida > 0) { "Los puntos de vida iniciales deben ser mayores que cero." }
        println("-> Personaje '$nombre' instanciado con $puntosVida PV.")
    }
}
```

### Constructores Secundarios
Si se necesitan constructores alternativos, pueden declararse con la palabra clave `constructor`. En Kotlin, **todo constructor secundario debe delegar obligatoriamente en el constructor primario** mediante `this(...)`:

```kotlin
class Enemigo(val tipo: String, var daño: Int) {

    // Constructor secundario que asigna daño por defecto según dificultad
    constructor(tipo: String) : this(tipo, daño = 10) {
        println("Enemigo básico creado con daño estándar.")
    }
}
```

---

## 3. Propiedades y Acceso (`field`)

En Kotlin, **todas las propiedades son públicas por defecto**, pero no accedes directamente al campo de memoria, sino a través de *getters* y *setters* generados de forma transparente por el compilador:

- Para propiedades `val`: se genera automáticamente un *getter*.
- Para propiedades `var`: se generan automáticamente un *getter* y un *setter*.

### Getters y Setters Personalizados
Si necesitas añadir validación o formateo al leer o modificar una propiedad, puedes implementar tu propio `get()` o `set()`. Dentro del setter, la palabra reservada `field` (*Backing Field*) representa el valor real almacenado en memoria:

```kotlin
class CuentaBancaria {
    var saldo: Double = 0.0
        set(nuevoValor) {
            if (nuevoValor >= 0) {
                field = nuevoValor // 'field' evita una recursión infinita
            } else {
                println("Error: El saldo no puede ser negativo.")
            }
        }

    // Propiedad calculada (no almacena valor en memoria, solo calcula al pedirla)
    val tieneFondos: Boolean
        get() = saldo > 0.0
}
```

---

## 4. Modificadores de Visibilidad

Kotlin ofrece cuatro modificadores de visibilidad:

| Modificador | En Clases y Miembros | En Archivos (Nivel Superior) |
| :--- | :--- | :--- |
| **`public` (por defecto)** | Visible desde cualquier parte del proyecto. | Visible en todo el proyecto. |
| **`private`** | Visible únicamente dentro de la clase que lo declara. | Visible solo dentro del mismo archivo `.kt`. |
| **`protected`** | Visible en la clase y en sus subclases. | *No aplicable a nivel de archivo.* |
| **`internal`** | **Visible en todo el módulo actual.** | **Visible en todo el módulo actual.** |

!!! tip "El modificador `internal` en Android"
    El modificador `internal` es sumamente útil en la arquitectura modular de Android (cuando una app se divide en módulos Gradle como `:core`, `:database`, `:feature-login`). Permite que las clases se comuniquen libremente dentro del mismo módulo sin exponer detalles internos al resto de la aplicación.

---

## 5. Herencia: `final` por Defecto y la Palabra Clave `open`

En Java, las clases son heredables y los métodos son sobrescribibles a menos que se use la palabra `final`. 

En la ingeniería de software moderna, esto suele provocar problemas de acoplamiento. Siguiendo el principio de diseño de Joshua Bloch (*"Diseña y documenta para la herencia, o prohíbela"*), **en Kotlin todas las clases y métodos son `final` por defecto**:

- Para permitir que una clase pueda ser heredada, debes marcarla explícitamente como **`open`**.
- Para permitir que un método pueda ser sobrescrito, debes marcarlo como **`open`**.
- La subclase que sobrescribe el método debe indicar obligatoriamente **`override`**.

```kotlin
// Clase base abierta a la herencia
open class Vehiculo(val marca: String, val modelo: String) {
    open fun acelerar() {
        println("El vehículo está acelerando...")
    }
}

// Subclase que hereda e invoca el constructor de la clase base
class Coche(marca: String, modelo: String, val puertas: Int) : Vehiculo(marca, modelo) {

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

---

## 6. Clases Abstractas e Interfaces

### Clases Abstractas (`abstract`)
No pueden instanciarse directamente y pueden contener tanto métodos abstractos (sin cuerpo) como métodos implementados:

```kotlin
abstract class FormaGeometrica {
    abstract fun calcularArea(): Double

    fun imprimirDescripcion() {
        println("Área calculada: ${calcularArea()} cm²")
    }
}
```

### Interfaces (`interface`)
Definen contratos que las clases deben cumplir. En Kotlin, **las interfaces pueden contener implementaciones por defecto** para sus métodos:

```kotlin
interface Reproducible {
    fun reproducir() // Método abstracto

    fun pausar() {   // Implementación por defecto opcional
        println("Reproducción pausada por defecto.")
    }
}

class Cancion(val titulo: String) : Reproducible {
    override fun reproducir() {
        println("Reproduciendo pista musical: $titulo")
    }
    // No está obligada a implementar pausar(), usará la implementación por defecto
}
```

---

## 7. Retos Prácticos

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
