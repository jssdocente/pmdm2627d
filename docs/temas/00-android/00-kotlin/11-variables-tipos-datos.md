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

*(Nota pedagógica: Las colecciones como `listOf()` y `mutableListOf()` se abordarán en detalle en el Bloque 4. Aquí las utilizamos únicamente a modo de ejemplo intuitivo para diferenciar una variable inmutable de un objeto interno mutable).*

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

## 7. Adelanto: ¿Qué ocurre si no podemos inicializar una variable de inmediato?

Hasta ahora hemos visto que en Kotlin **toda variable local debe tener un valor asignado antes de poder utilizarse**:

```kotlin
val nombre = "Laura" // Correcto
var contador: Int    // Declarada sin valor inicial
// println(contador) // ERROR de compilación: Variable 'contador' must be initialized
```

!!! info "Para más adelante: Android y Programación Orientada a Objetos"
    Cuando lleguemos a los temas de **Clases** y al desarrollo en **Android**, descubriremos que en ocasiones ciertas propiedades de una clase no pueden tener valor en el instante exacto de su creación (por ejemplo, botones o vistas de interfaz que dependen de que el sistema operativo cargue la pantalla).

    Para esos casos avanzados, Kotlin proporciona mecanismos como:

    - **`lateinit var` (Inicialización tardía):** Permite posponer la asignación de una propiedad asegurando que recibirá valor antes de su primer acceso.
    - **`by lazy` (Inicialización perezosa):** Permite calcular el valor de una constante `val` únicamente en el momento en que se consulte por primera vez.

    *No te preocupes por su sintaxis ahora: las abordaremos con calma y ejemplos prácticos en su bloque correspondiente.*

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

A continuación tienes pequeños ejercicios prácticos para consolidar los conceptos básicos vistos en este tema:

### 🟢 Reto 1: Variables `val` y `var` (Reasignación básica)
Declara una constante inmutable `val nombreJuego = "Zelda"` y una variable mutable `var vidas = 3`. 
Resta una vida al jugador e imprime en consola un mensaje indicando el juego y las vidas restantes.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val nombreJuego = "Zelda"
        var vidas = 3

        // Restamos una vida
        vidas -= 1

        println("En $nombreJuego te quedan $vidas vidas.")
    }
    ```

### 🟢 Reto 2: Plantillas de Cadenas (*String Templates*) y Expresiones
Declara el precio de un artículo (`val precio = 12.5`) y la cantidad comprada (`val cantidad = 4`). 
Imprime en una sola línea el total a pagar calculando la multiplicación directamente dentro de una expresión `${...}`. Muestra también la longitud del nombre del producto `val producto = "Teclado"` usando `${producto.length}`.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val producto = "Teclado"
        val precio = 12.5
        val cantidad = 4

        println("Producto: $producto (${producto.length} letras)")
        println("Total a pagar por $cantidad unidades: ${precio * cantidad} €")
    }
    ```

### 🟡 Reto 3: Conversión Explícita de Tipos
En Kotlin, un número entero no se convierte automáticamente en decimal.
Declara una variable entera `val distanciaMetros = 100` y una cadena de texto `val textoPuntuacion = "250"`.
1. Convierte `distanciaMetros` a `Double` usando `.toDouble()` y divídelo entre 3.
2. Convierte `textoPuntuacion` a `Int` usando `.toInt()` y súmale 50 puntos de bonificación.
3. Muestra ambos resultados en consola.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        // Conversión de Int a Double
        val distanciaMetros: Int = 100
        val distanciaTercio: Double = distanciaMetros.toDouble() / 3

        // Conversión de String a Int
        val textoPuntuacion: String = "250"
        val puntuacionFinal: Int = textoPuntuacion.toInt() + 50

        println("Un tercio de la distancia: $distanciaTercio metros")
        println("Puntuación con bonus: $puntuacionFinal puntos")
    }
    ```

### 🟡 Reto 4: Bloques de Texto Multilínea (`"""`)
Declara variables para tu nombre y tu lenguaje favorito. Imprime una tarjeta de presentación en tres líneas limpias utilizando comillas triples `"""` y la función `.trimIndent()`, sin necesidad de usar `\n`.

??? tip "Ver solución"
    ```kotlin
    fun main() {
        val alumno = "Marcos"
        val lenguaje = "Kotlin"

        val tarjeta = """
            ==============================
            Alumno   : $alumno
            Lenguaje : $lenguaje
            Módulo   : PMDM (Android)
            ==============================
        """.trimIndent()

        println(tarjeta)
    }
    ```
