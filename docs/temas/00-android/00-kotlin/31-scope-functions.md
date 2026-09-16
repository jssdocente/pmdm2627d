# Funciones de Ámbito (Scope Functions) en Kotlin

Las **Scope Functions** (funciones de ámbito) son una de las características más características y elegantes de la biblioteca estándar de Kotlin. Permiten ejecutar un bloque de código **en el contexto de un objeto determinado**.

Al invocar una de estas funciones sobre un objeto mediante una expresión lambda, se crea un ámbito (*scope*) temporal donde puedes acceder al objeto sin tener que repetir su nombre continuamente.

Existen 5 funciones de ámbito en Kotlin: **`let`**, **`run`**, **`with`**, **`apply`** y **`also`**.

---

## 1. Tabla Maestra de Selección Rápida

Aunque las 5 funciones realizan tareas aparentemente similares, difieren exactamente en dos factores fundamentales:

1. **Cómo se referencia el objeto de contexto dentro de la lambda:** Mediante `this` (receptor implícito) o mediante `it` (argumento de la lambda).

2. **Qué valor retorna la función:** El resultado de la última línea de la lambda (*Lambda result*) o el propio objeto de contexto (*Context object*).

| Función | Objeto de Contexto | Valor de Retorno | ¿Es de Extensión? | Cuándo Utilizarla (Regla Mnemotécnica) |
| :--- | :--- | :--- | :--- | :--- |
| **`let`** | **`it`** (o nombre personalizado) | **Resultado de la lambda** | Sí (`obj.let { ... }`) | Ejecutar acciones con valores no nulos (`?.let`) o transformar un objeto localmente. |
| **`apply`** | **`this`** (implícito) | **El propio objeto (`this`)** | Sí (`obj.apply { ... }`) | **Configuración e inicialización** de propiedades de un objeto ("Aplica estas propiedades al objeto"). |
| **`also`** | **`it`** (o nombre personalizado) | **El propio objeto (`it`)** | Sí (`obj.also { ... }`) | **Efectos secundarios adicionales** (como *logging*, métricas o validación) sin alterar el objeto ("Y además haz esto"). |
| **`run`** | **`this`** (implícito) | **Resultado de la lambda** | Sí (`obj.run { ... }`) | Configurar un objeto y calcular/devolver inmediatamente un resultado derivado. |
| **`with`** | **`this`** (implícito) | **Resultado de la lambda** | No (`with(obj) { ... }`) | Agrupar múltiples llamadas a métodos sobre un objeto que ya sabemos que no es nulo. |

---

## 2. Estudio Detallado y Casos de Uso en Android

### 2.1. `apply`: Configuración e Inicialización de Objetos
`apply` devuelve el mismo objeto sobre el que se invoca y dentro de las llaves accedes a sus métodos y propiedades directamente con `this`:

```kotlin
class ConfiguracionGrafica {
    var resolucion: String = "1080p"
    var tasaRefresco: Int = 60
    var sincronizacionVertical: Boolean = true
}

fun main() {
    // Inicialización idiomática limpia sin repetir 'config.xxx':
    val config = ConfiguracionGrafica().apply {
        resolucion = "1440p"
        tasaRefresco = 120
        sincronizacionVertical = false
    }

    println("Configuración lista: ${config.resolucion} @ ${config.tasaRefresco}Hz")
}
```

*Uso típico en Android:* Configurar un `Intent`, un `Bundle`, una `Notification` o las propiedades de un componente gráfico.

---

### 2.2. `let`: Operaciones Null-Safe y Transformaciones Locales
El objeto entra como parámetro (`it`). Retorna el valor de la última expresión del bloque:

```kotlin
fun procesarNombreUsuario(entrada: String?) {
    // Si 'entrada' es null, el bloque no se ejecuta
    val longitudFormateada = entrada?.let { nombre ->
        println("Usuario detectado: ${nombre.trim()}")
        nombre.trim().length // Última línea: se retorna como resultado
    } ?: 0

    println("Longitud válida: $longitudFormateada")
}

fun main() {
    procesarNombreUsuario("   Sofía   ") // Imprime usuario y longitud 5
    procesarNombreUsuario(null)          // Imprime longitud válida: 0
}
```

---

### 2.3. `also`: Efectos Secundarios (*Side Effects*) y Logging
`also` no modifica el valor que fluye a través de una cadena de operaciones; se utiliza para intercalar acciones secundarias como imprimir un log o registrar una métrica:

```kotlin
fun crearDirectorioJuego(nombre: String): String {
    return "/data/user/0/gamevault/files/$nombre"
        .also { ruta -> println("[LOG DEL SISTEMA]: Carpeta calculada -> $ruta") }
        .also { ruta -> println("[AUDITORÍA]: Comprobando permisos en $ruta...") }
}

fun main() {
    val rutaFinal = crearDirectorioJuego("partidas_guardadas")
    println("Ruta obtenida: $rutaFinal")
}
```

---

### 2.4. `run`: Configuración y Cómputo de Resultado
Combina el acceso directo mediante `this` con la devolución del resultado de la última expresión:

```kotlin
class MotorFisicas {
    var gravedad = 9.8
    fun calcularTrayectoria(fuerza: Double, angulo: Double): Double = fuerza * angulo / gravedad
}

fun main() {
    val motor = MotorFisicas()

    val alcanceMaximo = motor.run {
        gravedad = 1.62 // Gravedad lunar para el cálculo
        calcularTrayectoria(100.0, 45.0) // Retorna este valor
    }

    println("Alcance en la luna: $alcanceMaximo metros")
}
```

---

### 2.5. `with`: Agrupación de Llamadas
A diferencia de las otras 4, `with` no es una función de extensión; recibe el objeto como primer parámetro: `with(objeto) { ... }`:

```kotlin
class PersonajeEstadisticas {
    var nivel: Int = 10
    var fuerza: Int = 25
    var defensa: Int = 18
}

fun main() {
    val stats = PersonajeEstadisticas()

    with(stats) {
        println("=== FICHA DEL HÉROE ===")
        println("Nivel: $nivel")
        println("Ataque base: ${fuerza * 2}")
        println("Defensa total: $defensa")
    }
}
```

---

## 3. Retos Prácticos

### 🟢 Reto 1: Inicialización con `apply` (Básico)
Diseña una clase mutable `DialogoConfig` con propiedades `titulo`, `mensaje` y `cancelable: Boolean = true`. Crea una instancia utilizando `apply` para configurar sus tres propiedades e imprímela.

??? tip "Ver solución"
    ```kotlin
    class DialogoConfig {
        var titulo: String = ""
        var mensaje: String = ""
        var cancelable: Boolean = true
    }

    fun main() {
        val alerta = DialogoConfig().apply {
            titulo = "Confirmar Salida"
            mensaje = "¿Deseas cerrar la partida sin guardar?"
            cancelable = false
        }

        println("Diálogo: ${alerta.titulo} (Cancelable: ${alerta.cancelable})")
    }
    ```

### 🟡 Reto 2: Encadenamiento con `let` y `also` (Intermedio)
Dada una lista de números en texto `listOf("10", "20", "invalido", "40")`, utiliza operaciones funcionales encadenadas con `let` para transformar a número y `also` para registrar en consola cada número válido procesado.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val strings = listOf("10", "20", "error", "40")

        val total = strings
            .mapNotNull { it.toIntOrNull() }
            .also { println("Números válidos filtrados: $it") }
            .sum()

        println("Suma total: $total")
    }
    ```