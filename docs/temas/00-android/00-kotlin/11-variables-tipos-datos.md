# Variables, Tipos de Datos e Inmutabilidad en Kotlin

En Kotlin, el diseño del sistema de tipos busca **concisión, seguridad en tiempo de compilación y predictibilidad**. A diferencia de Java, Kotlin prescinde de las palabras clave para primitivos (`int`, `boolean`), trata todos los tipos como objetos de primera clase y sitúa a la **inmutabilidad** en el centro de su arquitectura.

---

## 1. Declaración de Variables: `val` vs `var`

Kotlin ofrece dos palabras clave para declarar variables:

- **`val` (Value / Inmutable):** Define una referencia de solo lectura. Una vez asignado su valor, **no puede reasignarse**. Equivale a una variable `final` en Java.
- **`var` (Variable / Mutable):** Define una referencia cuyo valor puede cambiar a lo largo del tiempo mediante reasignación.

```kotlin
val identificador: Int = 101 // No puede cambiar de valor
// identificador = 102        // ERROR de compilación: Val cannot be reassigned

var contador: Int = 0        // Puede reasignarse
contador += 1                // Válido
```

!!! tip "Regla de oro idiomática"
    En Kotlin y en el desarrollo Android moderno, **usa `val` por defecto siempre**. Utiliza `var` únicamente cuando exista una justificación clara de cambio de estado continuo (por ejemplo, contadores o acumuladores en bucles locales).

---

## 2. Inferencia de Tipos

Kotlin es un lenguaje de **tipado estático**. Sin embargo, su compilador es capaz de deducir (*inferir*) el tipo de dato analizando el valor de la asignación inicial:

```kotlin
// Declaración explícita (innecesariamente verbosa en este caso)
val nombre: String = "Link"
val nivel: Int = 50

// Declaración con inferencia de tipos (preferida)
val alias = "Zelda" // El compilador infiere String
val puntuacion = 9800 // El compilador infiere Int
val factorMultiplicador = 1.75 // El compilador infiere Double
```

!!! warning "Inferencia no significa tipado dinámico"
    Una vez que el compilador asigna un tipo a una variable (ya sea explícito o inferido), ese tipo queda fijado para siempre. No es posible asignar un tipo diferente a posteriori:
    ```kotlin
    var edad = 20
    // edad = "veinte" // ERROR de compilación: Type mismatch. Required: Int, Found: String
    ```

---

## 3. La Inmutabilidad en el Desarrollo Moderno

En la programación tradicional en Java es habitual crear objetos mutables y alterar sus propiedades mediante *setters* en cualquier parte del código. Aunque parece cómodo, este enfoque es una de las mayores fuentes de errores (*bugs*) en aplicaciones móviles.

### 3.1. Inmutabilidad de la Referencia vs Inmutabilidad del Objeto

Uno de los errores más comunes al iniciarse en Kotlin es confundir una variable declarada con `val` con una estructura de datos inmutable:

```kotlin
// 1. Variable 'val' con objeto MUTABLE
val usuariosConectados = mutableListOf("Ana", "Carlos")
usuariosConectados.add("Elena") // ¡VÁLIDO! El contenido de la lista ha mutado.
// usuariosConectados = mutableListOf() // ERROR: La referencia 'val' no se puede reasignar.

// 2. Variable 'val' con objeto INMUTABLE (Solo lectura)
val rolesPermitidos = listOf("ADMIN", "USER", "GUEST")
// rolesPermitidos.add("SUPERADMIN") // ERROR: listOf() no dispone de método add()
```

Podemos clasificar el estado según esta matriz:

| Variable | Objeto / Contenido | ¿Se puede reasignar la variable? | ¿Se pueden modificar los datos internos? | Ejemplo en Kotlin |
| :--- | :--- | :--- | :--- | :--- |
| **`val`** | Inmutable | ❌ No | ❌ No | `val lista = listOf(1, 2)` |
| **`val`** | Mutable | ❌ No | ✅ Sí | `val lista = mutableListOf(1, 2)` |
| **`var`** | Inmutable | ❌ Sí | ❌ No | `var lista = listOf(1, 2)` |
| **`var`** | Mutable | ✅ Sí | ✅ Sí | `var lista = mutableListOf(1, 2)` |

### 3.2. ¿Por qué la inmutabilidad es crítica en entornos móviles?

1. **Eliminación de efectos secundarios (*Side Effects*):**
   Cuando una función recibe un objeto inmutable, tenemos la certeza absoluta de que ninguna otra parte del sistema podrá alterar sus datos mientras se procesa. El código se vuelve determinista y predecible.
2. **Seguridad en Concurrencia (*Thread Safety* sin bloqueos):**
   En Android, la aplicación ejecuta constantemente tareas en segundo plano (peticiones de red con Retrofit/Ktor, lecturas de base de datos con Room, sensores) mientras el hilo principal dibuja la interfaz a 60/120 fps. Si dos hilos acceden al mismo dato mutable, se producen **condiciones de carrera (*Race Conditions*)** que requieren bloqueos pesados (`synchronized`, semáforos) capaces de congelar la pantalla. Los datos inmutables pueden leerse desde 100 hilos concurrentes simultáneamente sin riesgo alguno.
3. **Facilidad de Depuración y Pruebas Unitarias:**
   Un estado inmutable representa una instantánea fija de la aplicación en un instante de tiempo. Esto permite reproducir errores con total fidelidad en los tests unitarios.

!!! info "Anticipo: Inmutabilidad y Jetpack Compose"
    En el bloque de **Jetpack Compose** comprobaremos que la inmutabilidad es el motor que permite la **recomposición reactiva**: Compose solo actualiza la pantalla si detecta que la instancia del estado ha cambiado. Si mutamos una propiedad interna de un objeto, Compose no se percatará del cambio y la interfaz parecerá "congelada".

---

## 4. Tipos de Datos en Kotlin

En Kotlin no existen tipos primitivos con sintaxis especial como `int` o `double` en Java. **Todo en Kotlin es un objeto** con métodos y propiedades. En tiempo de compilación, el compilador de Kotlin optimiza estos tipos y los mapea a los primitivos eficientes de la máquina virtual Java (JVM) siempre que es posible.

### 4.1. Tipos Numéricos

| Tipo | Tamaño en memoria | Rango aproximado | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`Byte`** | 8 bits | -128 a 127 | `val b: Byte = 100` |
| **`Short`** | 16 bits | -32.768 a 32.767 | `val s: Short = 20000` |
| **`Int`** | 32 bits | -2³¹ a 2³¹ - 1 (aprox. 2.100 millones) | `val i = 42` |
| **`Long`** | 64 bits | -2⁶³ a 2⁶³ - 1 | `val l = 1000L` |
| **`Float`** | 32 bits (precisión simple) | ~6-7 dígitos decimales | `val f = 3.14f` |
| **`Double`** | 64 bits (doble precisión) | ~15-16 dígitos decimales | `val d = 3.1415926535` |

```kotlin
// Los números admiten guiones bajos para mejorar la legibilidad visual
val unMillon = 1_000_000
val tarjetaCredito = 1234_5678_9012_3456L
```

### 4.2. Caracteres y Booleanos

- **`Char`:** Representa un carácter Unicode individual de 16 bits delimitado por comillas simples (`'`). A diferencia de Java, un `Char` no puede tratarse directamente como un número entero sin conversión explícita.
- **`Boolean`:** Representa valores de verdad lógica: `true` o `false`.

```kotlin
val letra: Char = 'A'
val activado: Boolean = true
```

---

## 5. Cadenas de Texto (`String`)

En Kotlin, al igual que en Java, las cadenas `String` son **completamente inmutables**. Cualquier operación de transformación (como concatenar o reemplazar) devuelve una nueva instancia en memoria.

### 5.1. Plantillas de Cadenas (*String Templates*)

En lugar de recurrir a la concatenación tradicional con el operador `+`, Kotlin permite interpolar variables y expresiones directamente dentro del literal de cadena mediante el símbolo `$`:

```kotlin
val usuario = "Sofía"
val intentos = 3

// Interpolación simple de variable
println("Bienvenida, $usuario. Te quedan $intentos intentos.")

// Interpolación de expresiones arbitrarias con llaves ${ ... }
val precio = 19.99
val unidades = 3
println("Total a pagar: ${precio * unidades} €")
println("Longitud del nombre: ${usuario.length}")
```

### 5.2. Cadenas Multilínea (*Raw Strings*)

Delimitadas por tres comillas dobles (`"""`), preservan saltos de línea y caracteres especiales sin necesidad de escapar con `\n` ni `\"`. El método `.trimIndent()` elimina la sangría común del bloque:

```kotlin
val querySql = """
    SELECT id, titulo, calificacion
    FROM videojuegos
    WHERE plataforma = 'Android'
    ORDER BY calificacion DESC
""".trimIndent()

println(querySql)
```

### 5.3. Igualdad Estructural (`==`) vs Referencial (`===`)

En Java, comparar dos strings con `==` suele ser un error habitual porque compara punteros de memoria, obligando a usar `.equals()`. En Kotlin:

- **`==` (Igualdad estructural):** Invoca internamente a `.equals()` de forma segura ante nulos. Compara si el contenido de ambos objetos es idéntico.
- **`===` (Igualdad referencial):** Compara si ambas variables apuntan exactamente a la misma posición de memoria física.

```kotlin
val s1 = String(charArrayOf('H', 'o', 'l', 'a'))
val s2 = String(charArrayOf('H', 'o', 'l', 'a'))

println(s1 == s2)  // true -> El contenido es idéntico
println(s1 === s2) // false -> Son dos instancias distintas en el heap
```

---

## 6. Conversión Explícita de Tipos

Kotlin **no realiza conversiones implícitas de ensanchamiento numérico** para evitar pérdidas sutiles de precisión y errores en tiempo de ejecución. Cada tipo numérico proporciona funciones de conversión directa:

```kotlin
val entero: Int = 100
// val largo: Long = entero // ERROR de compilación: Type mismatch

val largo: Long = entero.toLong() // Válido y explícito
val decimal: Double = entero.toDouble()
val texto: String = entero.toString()

val textoNumero = "250"
val numeroParseado: Int = textoNumero.toInt()
```

---

## 7. Inicialización Especial: `lateinit` vs `by lazy`

En el ciclo de vida de componentes Android (como `Activity` o `Fragment`), las variables frecuentemente no pueden inicializarse en el momento de instanciar la clase, sino en métodos del ciclo de vida como `onCreate()` o cuando se consuman por primera vez.

### `lateinit var` (Inicialización Tardía)
Se utiliza para variables mutables que garantizamos que se inicializarán antes de su primer uso. Evita tener que declararlas como tipos anulables (`String? = null`).

```kotlin
class PerfilActivity {
    // Garantizamos que se inicializará antes de leerse
    lateinit var idSesion: String

    fun onCreate() {
        idSesion = "TOKEN_XYZ_123"
    }

    fun mostrarId() {
        if (::idSesion.isInitialized) {
            println(idSesion)
        }
    }
}
```

### `by lazy` (Inicialización Perezosa)
Se utiliza para variables de solo lectura (`val`). El bloque lambda no se ejecuta hasta que la variable se lee por primera vez en el código. A partir de ese momento, el resultado queda cacheado:

```kotlin
val conexionBaseDatos: String by lazy {
    println("Configurando conexión pesada...")
    "CONEXION_ACTIVA_SQLITE"
}

// En este punto, 'conexionBaseDatos' aún no se ha evaluado.
println(conexionBaseDatos) // Imprime mensaje y retorna valor.
println(conexionBaseDatos) // Solo retorna el valor cacheado (sin volver a evaluar).
```

---

## 8. Errores Frecuentes (*Gotchas*)

!!! danger "Gotcha 1: Confundir inmutabilidad de variable con inmutabilidad de colección"
    Declarar `val lista = ArrayList<String>()` no impide que cualquiera añada elementos con `lista.add("hack")`. Si quieres una colección verdaderamente inmutable, usa `listOf(...)`.

!!! danger "Gotcha 2: Desbordamiento en conversión numérica"
    Kotlin no avisa si conviertes un número grande a un tipo menor si sobrepasa su rango:
    ```kotlin
    val numeroGrande: Int = 300
    val byteTruncado: Byte = numeroGrande.toByte() // Se produce desbordamiento (44)
    ```

---

## 9. Retos Prácticos

### 🟢 Reto 1: Conversión y plantillas (Básico)
Declara una variable inmutable con tu nombre, otra con el año de nacimiento (entero) y calcula tu edad aproximada en una cadena de texto multilínea que muestre tu perfil formateado utilizando *String Templates*.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val nombre = "Lucía"
        val anioNacimiento = 2004
        val anioActual = 2026

        val perfil = """
            =========================
            FICHA DE ALUMNO/A
            Nombre: $nombre
            Año Nacimiento: $anioNacimiento
            Edad aproximada: ${anioActual - anioNacimiento} años
            =========================
        """.trimIndent()

        println(perfil)
    }
    ```

### 🟡 Reto 2: Inmutabilidad defensiva (Intermedio)
Dada una lista mutable de calificaciones de un estudiante, escribe un bloque de código que garantice que la vista pública exponga una versión de solo lectura que impida modificaciones externas accidentales.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        // Estado interno privado modificable
        val notasInternas = mutableListOf(8.5, 9.0, 7.2)

        // Exposición pública de solo lectura (Casting hacia List inmutable)
        val notasPublicas: List<Double> = notasInternas

        // notasPublicas.add(10.0) // ERROR de compilación: add no existe en List
        notasInternas.add(9.8) // Solo el propietario del estado interno puede mutar

        println("Notas visibles: $notasPublicas")
    }
    ```

### 🔴 Reto 3: Inicialización segura en Android (Avanzado)
Diseña una clase `ConfiguracionJuego` que cargue la configuración pesada desde una cadena simulada usando inicialización perezosa (`by lazy`), y que posea una propiedad `lateinit` para el identificador del jugador actual que verifique si está inicializado antes de imprimir un informe.

??? tip "Ver solución"
    ```kotlin
    class ConfiguracionJuego {
        lateinit var idJugador: String

        val recursosGraficos: String by lazy {
            println("-> Cargando texturas 3D en memoria...")
            "TEXTURAS_4K_CARGADAS"
        }

        fun mostrarEstado() {
            if (::idJugador.isInitialized) {
                println("Jugador: $idJugador")
            } else {
                println("Advertencia: Jugador aún no autenticado.")
            }
            println("Estado de recursos: $recursosGraficos")
        }
    }

    fun main() {
        val juego = ConfiguracionJuego()
        juego.mostrarEstado() // Avisa que no está autenticado y carga recursos por primera vez
        juego.idJugador = "Player_One"
        juego.mostrarEstado() // Ya está autenticado; recursos ya estaban en memoria
    }
    ```
