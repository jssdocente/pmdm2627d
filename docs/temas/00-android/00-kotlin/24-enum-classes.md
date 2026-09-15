# Clases de Enumeración (Enum Classes) en Kotlin

Las enumeraciones (`enum class`) en Kotlin permiten definir un conjunto fijo y delimitado de constantes con nombre que representan valores únicos y discretos de un dominio (por ejemplo: días de la semana, estados de un pedido, niveles de dificultad o direcciones cardinales).

Al igual que en Java, los *enums* en Kotlin son clases completas con capacidades avanzadas: pueden tener propiedades, métodos propios, constructores e implementar interfaces.

---

## 1. Declaración Básica de un `enum class`

La sintaxis fundamental combina las palabras clave `enum` y `class`:

```kotlin
enum class Dificultad {
    FACIL,
    NORMAL,
    DIFICIL,
    PESADILLA
}

fun main() {
    val modoSeleccionado = Dificultad.DIFICIL
    println("Modo actual: $modoSeleccionado") // DIFICIL
}
```

---

## 2. Enums con Propiedades y Métodos

Cada constante de un enum es una instancia de la propia clase. Por tanto, podemos definir un constructor primario para asociar datos o configuraciones específicas a cada valor:

```kotlin
enum class NivelUsuario(val nivelAcceso: Int, val prefijo: String) {
    INVITADO(nivelAcceso = 0, prefijo = "GUEST"),
    ESTUDIANTE(nivelAcceso = 1, prefijo = "STD"),
    DOCENTE(nivelAcceso = 5, prefijo = "PROF"),
    ADMINISTRADOR(nivelAcceso = 10, prefijo = "ROOT"); // El punto y coma ';' es obligatorio antes de declarar métodos

    fun tienePermisosAdmin(): Boolean {
        return this.nivelAcceso >= 10
    }

    fun formatearEtiqueta(): String {
        return "[$prefijo] - Nivel: $nivelAcceso"
    }
}

fun main() {
    val miRol = NivelUsuario.DOCENTE
    println(miRol.formatearEtiqueta()) // [PROF] - Nivel: 5
    println("¿Es admin? ${miRol.tienePermisosAdmin()}") // false
}
```

---

## 3. Iteración Moderna: `.entries` vs `.values()`

Tradicionalmente, para recorrer todas las constantes de un enum se utilizaba el método `.values()`, el cual crea un nuevo array en memoria en cada llamada.

A partir de **Kotlin 1.9+**, la forma oficial y eficiente recomendada es la propiedad **`.entries`**, que devuelve una lista inmutable preasignada sin coste de memoria adicional:

```kotlin
fun main() {
    // Forma idiomática moderna (Kotlin 1.9+):
    for (nivel in NivelUsuario.entries) {
        println("${nivel.name}: ${nivel.formatearEtiqueta()}")
    }

    // Propiedades comunes de cada constante:
    val rol = NivelUsuario.ADMINISTRADOR
    println("Nombre textual: ${rol.name}")     // "ADMINISTRADOR"
    println("Posición ordinal: ${rol.ordinal}") // 3 (índice base 0)
}
```

---

## 4. Implementación de Interfaces

Las clases de enumeración **no pueden heredar de otras clases** (porque todas heredan internamente de la clase abstracta `java.lang.Enum`), pero **sí pueden implementar interfaces**:

```kotlin
interface Describible {
    fun describir(): String
}

enum class EstadoServidor : Describible {
    OPERATIVO {
        override fun describir() = "El servidor responde con normalidad a las peticiones."
    },
    MANTENIMIENTO {
        override fun describir() = "Servidor temporalmente fuera de línea por actualización."
    },
    CAIDO {
        override fun describir() = "Error crítico: El servidor no responde a las llamadas."
    }
}
```

---

## 5. El Dúo Estrella: `enum` y la Expresión `when` Exhaustiva

Cuando evalúas una variable de tipo `enum` dentro de una expresión `when`, el compilador de Kotlin comprueba si has cubierto **todas y cada una de las constantes del enum**:

- Si cubres todos los casos, **no necesitas rama `else`**.
- Si en el futuro añades una nueva constante al enum (ej. `MODO_SUPERVIVENCIA`), **el código de los `when` fallará en tiempo de compilación**, obligándote a gestionarlo y evitando que olvides casos en tu aplicación.

```kotlin
fun calcularMultiplicadorPuntos(dificultad: Dificultad): Double {
    return when (dificultad) {
        Dificultad.FACIL -> 1.0
        Dificultad.NORMAL -> 1.5
        Dificultad.DIFICIL -> 2.5
        Dificultad.PESADILLA -> 4.0
        // No se necesita rama 'else' porque el compilador verifica la exhaustividad total
    }
}
```

---

## 6. Retos Prácticos

### 🟢 Reto 1: Semáforo y duración (Básico)
Crea un `enum class Semaforo(val duracionSegundos: Int, val codigoColorHex: String)` con los valores `ROJO` (60 s, `"#FF0000"`), `AMARILLO` (5 s, `"#FFFF00"`) y `VERDE` (45 s, `"#00FF00"`). Recorre sus elementos mediante `.entries` imprimiendo su información.

??? tip "Ver solución"
    ```kotlin
    enum class Semaforo(val duracionSegundos: Int, val codigoColorHex: String) {
        ROJO(60, "#FF0000"),
        AMARILLO(5, "#FFFF00"),
        VERDE(45, "#00FF00")
    }

    fun main() {
        for (fase in Semaforo.entries) {
            println("Fase ${fase.name} (${fase.codigoColorHex}): dura ${fase.duracionSegundos} segundos.")
        }
    }
    ```

### 🟡 Reto 2: Control de flujo con when exhaustivo (Intermedio)
Crea una función `obtenerMensajeEstado(estado: EstadoServidor): String` que devuelva una cadena personalizada utilizando una expresión `when` sin rama `else`.

??? tip "Ver solución"
    ```kotlin
    fun obtenerMensajeEstado(estado: EstadoServidor): String {
        return when (estado) {
            EstadoServidor.OPERATIVO -> "🟢 Todos los servicios funcionan al 100%."
            EstadoServidor.MANTENIMIENTO -> "🟡 Tareas de mantenimiento programadas en curso."
            EstadoServidor.CAIDO -> "🔴 ¡Alerta roja! Contactar inmediatamente con el administrador."
        }
    }

    fun main() {
        println(obtenerMensajeEstado(EstadoServidor.OPERATIVO))
        println(obtenerMensajeEstado(EstadoServidor.CAIDO))
    }
    ```
