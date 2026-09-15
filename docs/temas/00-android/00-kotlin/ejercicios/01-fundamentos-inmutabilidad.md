# Bloque 1: Fundamentos, Inmutabilidad y Control de Flujo

En este primer bloque comenzarás a programar en el proyecto único **`pmdm-kotlin-lab`** de IntelliJ IDEA. El objetivo es interiorizar las diferencias sintácticas clave respecto a Java y asimilar la **inmutabilidad** como principio de diseño fundamental para el desarrollo móvil.

📁 **Paquete de trabajo:** `package b01_fundamentos`  
Ubicación en tu proyecto: `src/main/kotlin/b01_fundamentos/`

---

## 🟢 Nivel Básico (Consolidación Sintáctica y Tipado)

### Ejercicio 1.1: Variables Inmutables vs Mutables
📄 **Archivo:** `E01_VariablesInmutabilidad.kt`

#### 1. Enunciado y Requisitos

1. Declara una variable inmutable (`val`) con el nombre de tu aplicación favorita y otra con su versión inicial (entero `1`).

2. Declara una variable mutable (`var`) que registre el número de descargas inicial (ej. `1000`).

3. Simula que la aplicación recibe 350 descargas más, actualizando la variable mutable.

4. Intenta reasignar la versión a `2` para comprobar el error del compilador; después, comenta la línea errónea explicando en un comentario por qué falla.

5. Imprime un informe final formateado usando *String Templates* (`$variable`).

#### 2. Salida Esperada en Consola

```text
=== ESTADO DE LA APLICACIÓN ===
App: GameVault
Versión: 1 (Inmutable)
Descargas totales: 1350
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val nombreApp: String = "GameVault"
        val version: Int = 1
        var descargas: Int = 1000

        // Actualizamos la variable mutable
        descargas += 350

        // version = 2 // ERROR: Val cannot be reassigned (las referencias 'val' son de solo lectura)

        println("""
            === ESTADO DE LA APLICACIÓN ===
            App: $nombreApp
            Versión: $version (Inmutable)
            Descargas totales: $descargas
        """.trimIndent())
    }
    ```

---

### Ejercicio 1.2: Inferencia de Tipos y Tipos Numéricos
📄 **Archivo:** `E02_InferenciaYTipos.kt`

#### 1. Enunciado y Requisitos

1. Declara variables utilizando **inferencia de tipos** (sin indicar el tipo explícito) para:

    - Título de un juego (`String`).

    - Precio en euros (`Double`).

    - Puntos de experiencia (`Int`).

    - Si está disponible en Android (`Boolean`).

2. Muestra el tipo deducido por Kotlin imprimiendo la propiedad `::class.simpleName` de cada variable.

3. Declara una variable con guiones bajos para mejorar la legibilidad de un número grande (ej. `val puntuacionRecord = 1_500_000`).

#### 2. Salida Esperada en Consola

```text
Título: Hollow Knight (Tipo: String)
Precio: 14.99 (Tipo: Double)
Experiencia: 4500 (Tipo: Int)
Disponible: true (Tipo: Boolean)
Récord histórico: 1500000 pts
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val titulo = "Hollow Knight"
        val precio = 14.99
        val experiencia = 4500
        val disponible = true
        val puntuacionRecord = 1_500_000

        println("Título: $titulo (Tipo: ${titulo::class.simpleName})")
        println("Precio: $precio (Tipo: ${precio::class.simpleName})")
        println("Experiencia: $experiencia (Tipo: ${experiencia::class.simpleName})")
        println("Disponible: $disponible (Tipo: ${disponible::class.simpleName})")
        println("Récord histórico: $puntuacionRecord pts")
    }
    ```

---

### Ejercicio 1.3: *String Templates* y Expresiones Embebidas
📄 **Archivo:** `E03_StringTemplates.kt`

#### 1. Enunciado y Requisitos

1. Declara variables inmutables para el nombre de un jugador (`String`), su nivel actual (`Int`) y sus monedas de oro (`Int`).

2. Muestra un mensaje que interpole las variables simples usando `$nombre`.

3. Muestra una segunda línea que calcule dentro de la propia plantilla `${ ... }` el nivel que tendrá tras subir 1 nivel y las monedas duplicadas.

4. Muestra la longitud del nombre del jugador utilizando `${nombre.length}`.

#### 2. Salida Esperada en Consola

```text
Jugador: Kaelen | Nivel: 9 | Oro: 250
Próximo nivel: 10 | Oro duplicado: 500
Longitud del nombre: 6 caracteres
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val jugador = "Kaelen"
        val nivel = 9
        val oro = 250

        println("Jugador: $jugador | Nivel: $nivel | Oro: $oro")
        println("Próximo nivel: ${nivel + 1} | Oro duplicado: ${oro * 2}")
        println("Longitud del nombre: ${jugador.length} caracteres")
    }
    ```

---

### Ejercicio 1.4: Cadenas Multilínea (*Raw Strings*)
📄 **Archivo:** `E04_CadenasMultilinea.kt`

#### 1. Enunciado y Requisitos

1. Crea una ficha de personaje utilizando una cadena delimitada por tres comillas dobles (`"""...""".trimIndent()`).

2. La ficha debe tener un borde superior e inferior de guiones y mostrar estadísticas tabuladas (Fuerza, Agilidad, Inteligencia) calculando el total de atributos en la propia plantilla.

3. Comprueba que no es necesario escapar comillas ni saltos de línea con `\n`.

#### 2. Salida Esperada en Consola

```text
====================================
        FICHA DE PERSONAJE          
====================================
Clase: Mago de Batalla
- Fuerza: 12
- Agilidad: 18
- Inteligencia: 35
------------------------------------
Poder total acumulado: 65 pts
====================================
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val clase = "Mago de Batalla"
        val fuerza = 12
        val agilidad = 18
        val inteligencia = 35

        val ficha = """
            ====================================
                    FICHA DE PERSONAJE          
            ====================================
            Clase: $clase
            - Fuerza: $fuerza
            - Agilidad: $agilidad
            - Inteligencia: $inteligencia
            ------------------------------------
            Poder total acumulado: ${fuerza + agilidad + inteligencia} pts
            ====================================
        """.trimIndent()

        println(ficha)
    }
    ```

---

### Ejercicio 1.5: Conversión Explícita de Tipos Numéricos
📄 **Archivo:** `E05_ConversionTipos.kt`

#### 1. Enunciado y Requisitos

1. En Kotlin no existen conversiones implícitas automáticas entre números para evitar pérdidas silenciosas de precisión. Declara un entero `val pesoGramos: Int = 2500`.

2. Convierte explícitamente el peso a kilogramos (`Double`) dividiendo por `1000.0` mediante `pesoGramos.toDouble() / 1000`.

3. Declara una cadena `val textoPrecio = "49"` y conviértela a entero con `.toInt()`.

4. Declara una cadena no numérica `val textoInvalido = "gratis"` y utiliza `.toIntOrNull() ?: 0` para evitar que el programa lance una excepción `NumberFormatException`.

#### 2. Salida Esperada en Consola

```text
Peso en gramos: 2500 -> En kilos: 2.5 kg
Precio parseado: 49 €
Precio con fallback seguro: 0 €
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val pesoGramos: Int = 2500
        val pesoKilos: Double = pesoGramos.toDouble() / 1000

        val textoPrecio = "49"
        val precioInt: Int = textoPrecio.toInt()

        val textoInvalido = "gratis"
        val precioSeguro: Int = textoInvalido.toIntOrNull() ?: 0

        println("Peso en gramos: $pesoGramos -> En kilos: $pesoKilos kg")
        println("Precio parseado: $precioInt €")
        println("Precio con fallback seguro: $precioSeguro €")
    }
    ```

---

### Ejercicio 1.6: Bucles Idiomáticos sobre Rangos y Progresiones
📄 **Archivo:** `E06_BuclesRangos.kt`

#### 1. Enunciado y Requisitos

1. Realiza una cuenta atrás para el despegue de una nave espacial desde `5` hasta `1` utilizando el operador de progresión descendente **`downTo`**.

2. Itera sobre un rango que excluya el límite superior usando **`until`** (ej. de `0 until 4` para recorrer índices de una pantalla).

3. Imprime números pares del `2` al `10` utilizando el modificador **`step 2`**.

4. Comprueba con el operador **`in`** si el nivel `7` está dentro del rango `1..10`.

#### 2. Salida Esperada en Consola

```text
Cuenta atrás: 5 4 3 2 1 ¡Despegue!
Índices hasta 4 (sin incluirlo): 0 1 2 3
Pares hasta 10: 2 4 6 8 10
¿Nivel 7 dentro del rango 1..10?: true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        print("Cuenta atrás: ")
        for (i in 5 downTo 1) {
            print("$i ")
        }
        println("¡Despegue!")

        print("Índices hasta 4 (sin incluirlo): ")
        for (i in 0 until 4) {
            print("$i ")
        }
        println()

        print("Pares hasta 10: ")
        for (i in 2..10 step 2) {
            print("$i ")
        }
        println()

        val nivel = 7
        val enRango = nivel in 1..10
        println("¿Nivel $nivel dentro del rango 1..10?: $enRango")
    }
    ```

---

### Ejercicio 1.7: Igualdad Estructural (`==`) vs Referencial (`===`)
📄 **Archivo:** `E07_IgualdadEstructuralReferencial.kt`

#### 1. Enunciado y Requisitos

A diferencia de Java (donde `==` compara direcciones de memoria y exige `.equals()`), en Kotlin **`==` compara el contenido** y **`===` compara la referencia**.

1. Declara dos cadenas creadas de forma separada: `val s1 = "Android"` y `val s2 = buildString { append("And"); append("roid") }`.

2. Compara ambas cadenas con `==` (debe ser `true` porque tienen el mismo contenido).

3. Compara ambas cadenas con `===` (debe ser `false` porque son dos objetos distintos en el Heap).

4. Declara `val s3 = s1` y comprueba con `===` que ambas apuntan a la misma dirección de memoria.

#### 2. Salida Esperada en Consola

```text
Contenido s1: 'Android' | Contenido s2: 'Android'
¿Mismo contenido (==)? true
¿Misma referencia en memoria (===)? false
¿s1 y s3 apuntan al mismo objeto (===)? true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val s1 = "Android"
        val s2 = buildString { append("And"); append("roid") }
        val s3 = s1

        println("Contenido s1: '$s1' | Contenido s2: '$s2'")
        println("¿Mismo contenido (==)? ${s1 == s2}")
        println("¿Misma referencia en memoria (===)? ${s1 === s2}")
        println("¿s1 y s3 apuntan al mismo objeto (===)? ${s1 === s3}")
    }
    ```

---

## 🟡 Nivel Intermedio (Control de Flujo Expresivo y Estado)

### Ejercicio 1.8: `if` como Expresión (Sustituto del Operador Ternario)
📄 **Archivo:** `E08_IfComoExpresion.kt`

#### 1. Enunciado y Requisitos

1. Declara una variable `val bateriaPorcentaje: Int = 18`.

2. Asigna a una variable inmutable `val modoAhorro: String` el resultado directo de una expresión `if-else` sin usar variables mutables intermedias:

    - Si `bateriaPorcentaje <= 15`: `"ACTIVADO_CRITICO"`

    - Si `bateriaPorcentaje in 16..30`: `"ACTIVADO_MODERADO"`

    - En cualquier otro caso: `"DESACTIVADO"`

3. Imprime el estado del dispositivo.

#### 2. Salida Esperada en Consola

```text
Batería al 18% -> Modo de ahorro: ACTIVADO_MODERADO
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val bateriaPorcentaje = 18

        val modoAhorro = if (bateriaPorcentaje <= 15) {
            "ACTIVADO_CRITICO"
        } else if (bateriaPorcentaje in 16..30) {
            "ACTIVADO_MODERADO"
        } else {
            "DESACTIVADO"
        }

        println("Batería al $bateriaPorcentaje% -> Modo de ahorro: $modoAhorro")
    }
    ```

---

### Ejercicio 1.9: `when` con Múltiples Casos y Rangos
📄 **Archivo:** `E09_WhenCasosAgrupados.kt`

#### 1. Enunciado y Requisitos

1. Crea una función `tipoDeDia(diaSemana: Int): String` que reciba un número del 1 al 7.

2. Utiliza `when` agrupando casos separados por comas (`,`) para los días laborales (1 a 5) y los fines de semana (6 y 7).

3. Añade una rama `else` para números fuera de rango.

4. Comprueba desde `main()` los días 2, 6 y 9.

#### 2. Salida Esperada en Consola

```text
Día 2 -> Día laborable (Toca programar en Android)
Día 6 -> Fin de semana (Tiempo de ocio o videojuegos)
Día 9 -> Número de día no válido
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun tipoDeDia(diaSemana: Int): String {
        return when (diaSemana) {
            1, 2, 3, 4, 5 -> "Día laborable (Toca programar en Android)"
            6, 7 -> "Fin de semana (Tiempo de ocio o videojuegos)"
            else -> "Número de día no válido"
        }
    }

    fun main() {
        listOf(2, 6, 9).forEach { d ->
            println("Día $d -> ${tipoDeDia(d)}")
        }
    }
    ```

---

### Ejercicio 1.10: `when` sin Argumento y Condiciones Complejas
📄 **Archivo:** `E10_WhenSinArgumento.kt`

#### 1. Enunciado y Requisitos

1. Cuando las condiciones a evaluar involucran múltiples variables diferentes, `when` se puede utilizar **sin argumento entre paréntesis**.

2. Declara `val edad = 20`, `val tieneEntrada = true` y `val esSocioVip = false`.

3. Determina el estado de acceso mediante un `when { ... }` donde cada rama es una condición booleana arbitraria.

#### 2. Salida Esperada en Consola

```text
Evaluando condiciones de acceso...
Resultado: Acceso estándar concedido a zona general.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val edad = 20
        val tieneEntrada = true
        val esSocioVip = false

        println("Evaluando condiciones de acceso...")

        val mensajeAcceso = when {
            edad < 18 -> "Acceso denegado a menores de edad."
            esSocioVip -> "Acceso VIP preferente sin colas."
            tieneEntrada -> "Acceso estándar concedido a zona general."
            else -> "Acceso denegado: debe adquirir una entrada en taquilla."
        }

        println("Resultado: $mensajeAcceso")
    }
    ```

---

### Ejercicio 1.11: Control de Bucles Anidados con Etiquetas (*Labels*)
📄 **Archivo:** `E11_BuclesConEtiquetas.kt`

#### 1. Enunciado y Requisitos

En tableros de juegos 2D (matrices), cuando encontramos la casilla objetivo queremos detener inmediatamente el bucle externo sin usar banderas booleanas `encontrado = true`.

1. Declara una matriz de 3x3 representada como una lista de listas de enteros:
   `listOf(listOf(1, 2, 3), listOf(4, 99, 6), listOf(7, 8, 9))`

2. Recorre las filas y columnas buscando el número secreto `99`.

3. Utiliza una etiqueta **`searchLoop@`** en el bucle exterior para realizar un **`break@searchLoop`** en cuanto encuentres el número.

4. Imprime las coordenadas (fila y columna) donde fue hallado.

#### 2. Salida Esperada en Consola

```text
Buscando en matriz 3x3...
Examinando [0,0] = 1
Examinando [0,1] = 2
Examinando [0,2] = 3
Examinando [1,0] = 4
Examinando [1,1] = 99 -> ¡Tesoro encontrado! Abortando búsqueda.
Objetivo hallado en fila 1, columna 1.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val tablero = listOf(
            listOf(1, 2, 3),
            listOf(4, 99, 6),
            listOf(7, 8, 9)
        )

        var posX = -1
        var posY = -1

        println("Buscando en matriz 3x3...")

        // Etiqueta para controlar el bucle exterior
        searchLoop@ for (f in tablero.indices) {
            for (c in tablero[f].indices) {
                val valor = tablero[f][c]
                print("Examinando [$f,$c] = $valor")
                if (valor == 99) {
                    println(" -> ¡Tesoro encontrado! Abortando búsqueda.")
                    posX = f
                    posY = c
                    break@searchLoop // Sale directamente de ambos bucles
                }
                println()
            }
        }

        println("Objetivo hallado en fila $posX, columna $posY.")
    }
    ```

---

### Ejercicio 1.12: Inicialización Diferida: `lateinit` vs `by lazy`
📄 **Archivo:** `E12_LateinitLazy.kt`

#### 1. Enunciado y Requisitos

1. Diseña una clase `ServicioJuego`.

2. Declara una propiedad inmutable `val baseDatosLocal: String by lazy { ... }` que imprima un mensaje al inicializarse y devuelva `"SQLITE_ACTIVA"`.

3. Declara una propiedad `lateinit var tokenSesion: String`.

4. Muestra en `main()` cómo `baseDatosLocal` no se evalúa hasta que se accede a ella por primera vez, y cómo `::tokenSesion.isInitialized` permite comprobar si la variable tardía ya tiene valor antes de usarla.

#### 2. Salida Esperada en Consola

```text
ServicioJuego creado.
¿Token inicializado? false
Inicializando token...
¿Token inicializado? true -> Token: JWT_9988
Accediendo por primera vez a baseDatosLocal:
[CARGA PESADA]: Abriendo base de datos SQLite...
Base de datos: SQLITE_ACTIVA
Accediendo por segunda vez (no se repite la carga):
Base de datos: SQLITE_ACTIVA
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    class ServicioJuego {
        lateinit var tokenSesion: String

        val baseDatosLocal: String by lazy {
            println("[CARGA PESADA]: Abriendo base de datos SQLite...")
            "SQLITE_ACTIVA"
        }
    }

    fun main() {
        val servicio = ServicioJuego()
        println("ServicioJuego creado.")

        println("¿Token inicializado? ${servicio::tokenSesion.isInitialized}")
        println("Inicializando token...")
        servicio.tokenSesion = "JWT_9988"
        println("¿Token inicializado? ${servicio::tokenSesion.isInitialized} -> Token: ${servicio.tokenSesion}")

        println("Accediendo por primera vez a baseDatosLocal:")
        println("Base de datos: ${servicio.baseDatosLocal}")

        println("Accediendo por segunda vez (no se repite la carga):")
        println("Base de datos: ${servicio.baseDatosLocal}")
    }
    ```

---

## 🔴 Nivel Avanzado (Gotchas de Memoria y Reto Integrador)

### Ejercicio 1.13: Demostración de la Matriz de Mutabilidad (Los 4 Cuadrantes)
📄 **Archivo:** `E13_MatrizMutabilidad.kt`

#### 1. Enunciado y Requisitos

1. Reproduce mediante código ejecutable los 4 cuadrantes explicados en la teoría:

    - **Cuadrante 1 (`val` + `listOf`):** Referencia inmutable a colección inmutable.

    - **Cuadrante 2 (`val` + `mutableListOf`):** Referencia inmutable a colección mutable (*La trampa habitual*).

    - **Cuadrante 3 (`var` + `listOf`):** Referencia mutable a colección inmutable (*Patrón Compose/State*).

    - **Cuadrante 4 (`var` + `mutableListOf`):** Doble mutabilidad (anti-patrón).

2. En cada cuadrante, intenta reasignar la referencia o modificar los elementos y documenta con comentarios qué permite el compilador y qué prohíbe.

#### 2. Salida Esperada en Consola

```text
Cuadrante 1 (val + listOf): [Zelda]
Cuadrante 2 (val + mutableListOf): [Zelda, Metroid]
Cuadrante 3 (var + listOf): [Zelda, Mario]
Cuadrante 4 (var + mutableListOf): [Pokemon]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        // Cuadrante 1: Máxima seguridad
        val listaA = listOf("Zelda")
        // listaA.add("Mario") // Error compilación
        // listaA = listOf("Pokemon") // Error compilación
        println("Cuadrante 1 (val + listOf): $listaA")

        // Cuadrante 2: Trampa frecuente (referencia fija, pero contenido muta)
        val listaB = mutableListOf("Zelda")
        listaB.add("Metroid") // Permitido
        // listaB = mutableListOf("Mario") // Error compilación
        println("Cuadrante 2 (val + mutableListOf): $listaB")

        // Cuadrante 3: Patrón Compose (generamos un estado completamente nuevo)
        var listaC = listOf("Zelda")
        listaC = listaC + "Mario" // Deriva una nueva lista inmutable y reasigna
        println("Cuadrante 3 (var + listOf): $listaC")

        // Cuadrante 4: Anti-patrón caótico
        var listaD = mutableListOf("Zelda")
        listaD.add("Kirby")
        listaD = mutableListOf("Pokemon")
        println("Cuadrante 4 (var + mutableListOf): $listaD")
    }
    ```

---

### Reto 1.14: Simulador de Checkout de Tienda Digital
📄 **Archivo:** `Reto01_CheckoutTienda.kt`

#### 1. Contexto

Vas a implementar el motor de cálculo de precios para un carrito de compras digital en una tienda de videojuegos móviles.

#### 2. Requisitos Funcionales

1. Recibe el precio base de un carrito (ej. `89.90 €`), el número de artículos adquiridos (ej. `3`), y un cupón de descuento en texto (ej. `"VERANO20"` o `null`).

2. **Reglas de Descuento (evaluadas con `when` exhaustivo):**

    - Si el cupón es `"VERANO20"`, aplica un 20% de descuento sobre el total.

    - Si el cupón es `"BIENVENIDA"`, aplica un 10% de descuento.

    - Si el cupón es `null` o desconocido, no aplica descuento por cupón (0%).

3. **Descuento Adicional por Volumen:** Si compra más de 2 artículos, aplica un 5% adicional acumulable sobre el precio con descuento.

4. **Cálculo de IVA:** Añade un 21% de IVA sobre el subtotal final.

5. Imprime el ticket de compra desglosado utilizando cadenas multilínea inmutables.

#### 3. Salida Esperada en Consola

```text
========================================
       TICKET DE COMPRA GAMEVAULT       
========================================
Artículos en cesta: 3
Precio base: 89.90 €
Cupón aplicado: VERANO20 (-20%)
Descuento volumen (>2 uds): -5% adicional
Subtotal con descuentos: 68.32 €
IVA (21%): 14.35 €
----------------------------------------
TOTAL FINAL A COBRAR: 82.67 €
========================================
```

#### 4. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val precioBase = 89.90
        val cantidadArticulos = 3
        val cupon: String? = "VERANO20"

        // 1. Porcentaje de descuento por cupón mediante expresión when
        val porcentajeCupon = when (cupon) {
            "VERANO20" -> 0.20
            "BIENVENIDA" -> 0.10
            else -> 0.00
        }

        // 2. Descuento por volumen
        val porcentajeVolumen = if (cantidadArticulos > 2) 0.05 else 0.00

        // 3. Cálculos de importes (100% inmutables)
        val precioTrasCupon = precioBase * (1 - porcentajeCupon)
        val subtotalConDescuentos = precioTrasCupon * (1 - porcentajeVolumen)
        val iva = subtotalConDescuentos * 0.21
        val totalFinal = subtotalConDescuentos + iva

        val ticket = """
            ========================================
                   TICKET DE COMPRA GAMEVAULT       
            ========================================
            Artículos en cesta: $cantidadArticulos
            Precio base: ${"%.2f".format(precioBase)} €
            Cupón aplicado: ${cupon ?: "Ninguno"} (-${(porcentajeCupon * 100).toInt()}%)
            Descuento volumen (>2 uds): -${(porcentajeVolumen * 100).toInt()}% adicional
            Subtotal con descuentos: ${"%.2f".format(subtotalConDescuentos)} €
            IVA (21%): ${"%.2f".format(iva)} €
            ----------------------------------------
            TOTAL FINAL A COBRAR: ${"%.2f".format(totalFinal)} €
            ========================================
        """.trimIndent()

        println(ticket)
    }
    ```
