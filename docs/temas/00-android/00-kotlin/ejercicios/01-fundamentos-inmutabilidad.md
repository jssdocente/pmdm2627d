# Bloque 1: Fundamentos, Inmutabilidad y Control de Flujo

En este primer bloque comenzarás a programar en el proyecto único **`pmdm-kotlin-lab`** de IntelliJ IDEA. El objetivo es interiorizar las diferencias sintácticas clave respecto a Java y asimilar la **inmutabilidad** como principio de diseño fundamental para el desarrollo móvil.

📁 **Paquete de trabajo:** `package b01_fundamentos`  
Ubicación en tu proyecto: `src/main/kotlin/b01_fundamentos/`

!!! info "📚 Apuntes Teóricos de Referencia"
    Para resolver las actividades de este bloque, puedes consultar los siguientes temas de los apuntes:

    - [Variables, Tipos de Datos e Inmutabilidad](../11-variables-tipos-datos.md)
    - [Expresiones vs Sentencias (If y Rangos)](../12-expresiones-vs-sentencias.md)
    - [Estructura When (Condicionales Expresivos)](../12.1-when.md)
    - [Null Safety e Inicialización Tardía (`lateinit` y `by lazy`)](../14-null-safety.md)

---

## 🟢 Nivel Básico (Consolidación Sintáctica y Tipado)

### Ejercicio 1.1: Variables Inmutables vs Mutables
📄 **Archivo:** `E01_VariablesInmutabilidad.kt`  
📚 **Teoría de referencia:** [Declaración de Variables: val vs var](../11-variables-tipos-datos.md#1-declaracion-de-variables-val-vs-var)

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

### Ejercicio 1.2: Inferencia de Tipos y Tipos Fuerte
📄 **Archivo:** `E02_InferenciaYTipos.kt`  
📚 **Teoría de referencia:** [Inferencia de Tipos](../11-variables-tipos-datos.md#2-inferencia-de-tipos) y [Tipos de Datos](../11-variables-tipos-datos.md#4-tipos-de-datos-en-kotlin)

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

### Ejercicio 1.3: *String Templates* y Expresiones Complejas
📄 **Archivo:** `E03_StringTemplates.kt`  
📚 **Teoría de referencia:** [Plantillas de Cadenas (String Templates)](../11-variables-tipos-datos.md#51-plantillas-de-cadenas-string-templates)

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

### Ejercicio 1.4: Cadenas Multilínea (*Raw Strings*) y `.trimIndent()`
📄 **Archivo:** `E04_CadenasMultilinea.kt`  
📚 **Teoría de referencia:** [Cadenas Multilínea (Raw Strings)](../11-variables-tipos-datos.md#52-cadenas-multilinea-raw-strings)

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

### Ejercicio 1.5: Tipos Numéricos y Conversión Explícita
📄 **Archivo:** `E05_ConversionTipos.kt`  
📚 **Teoría de referencia:** [Conversión Explícita de Tipos](../11-variables-tipos-datos.md#6-conversion-explicita-de-tipos)

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
📚 **Teoría de referencia:** [Expresiones y Sentencias: Rangos en Bucles](../12-expresiones-vs-sentencias.md#expresiones)

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
📚 **Teoría de referencia:** [Igualdad Estructural (==) vs Referencial (===)](../11-variables-tipos-datos.md#53-igualdad-estructural-vs-referencial)

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
📚 **Teoría de referencia:** [Expresiones vs Sentencias: If como Expresión](../12-expresiones-vs-sentencias.md#expresiones)

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
📚 **Teoría de referencia:** [When: Comprobar Rangos](../12.1-when.md#5-when-para-comprobar-rangos-y-colecciones) y [When como Expresión](../12.1-when.md#2-when-como-expresion-su-primer-superpoder)

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
        for (d in 1..7) {
            println("Día $d -> ${tipoDeDia(d)}")
        }
        println("Día 9 -> ${tipoDeDia(9)}")
    }
    ```

---

### Ejercicio 1.10: `when` sin Argumento y Condiciones Complejas
📄 **Archivo:** `E10_WhenSinArgumento.kt`  
📚 **Teoría de referencia:** [When sin Argumento (Modo Inteligente)](../12.1-when.md#3-when-sin-argumento-el-modo-if-else-if-inteligente)

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
📚 **Teoría de referencia:** [Diferencias entre Expresiones y Sentencias](../12-expresiones-vs-sentencias.md#diferencias-entre-expresiones-y-sentencias)

#### 1. Enunciado y Requisitos

En videojuegos, al escanear una cuadrícula 2D (por ejemplo, filas y columnas de un mapa de baldosas), cuando encontramos la casilla objetivo queremos detener inmediatamente la búsqueda sin banderas booleanas complejas (`encontrado = true`).

1. Itera sobre una cuadrícula de coordenadas del `1` al `4` para filas (`f`) y del `1` al `4` para columnas (`c`) usando bucles `for` anidados con rangos.

2. En cada casilla, calcula un código de balda con `val codigoSector = f * 10 + c` (ej. `11`, `12`, `13`...).

3. Utiliza una etiqueta **`searchLoop@`** en el bucle exterior para realizar un **`break@searchLoop`** en cuanto encuentres el sector secreto `23`.

4. Imprime las coordenadas donde fue hallado y comprueba que no se siguen evaluando las filas posteriores.

#### 2. Salida Esperada en Consola

```text
Escaneando cuadrícula 4x4...
Sector [1,1] -> Código 11
Sector [1,2] -> Código 12
Sector [1,3] -> Código 13
Sector [1,4] -> Código 14
Sector [2,1] -> Código 21
Sector [2,2] -> Código 22
Sector [2,3] -> ¡SECTOR SECRETO ENCONTRADO! Abortando escaneo.
Objetivo hallado en Fila 2, Columna 3.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        println("Escaneando cuadrícula 4x4...")

        var filaObjetivo = -1
        var colObjetivo = -1

        // Etiqueta 'searchLoop@' para controlar el bucle exterior
        searchLoop@ for (f in 1..4) {
            for (c in 1..4) {
                val codigoSector = f * 10 + c
                if (codigoSector == 23) {
                    println("Sector [$f,$c] -> ¡SECTOR SECRETO ENCONTRADO! Abortando escaneo.")
                    filaObjetivo = f
                    colObjetivo = c
                    break@searchLoop // Detiene ambos bucles de golpe
                }
                println("Sector [$f,$c] -> Código $codigoSector")
            }
        }

        println("Objetivo hallado en Fila $filaObjetivo, Columna $colObjetivo.")
    }
    ```

---

### Ejercicio 1.12: Inicialización Diferida: `lateinit` vs `by lazy`
📄 **Archivo:** `E12_LateinitLazy.kt`  
📚 **Teoría de referencia:** [Inicialización Especial: by lazy vs lateinit](../11-variables-tipos-datos.md#7-inicializacion-especial-lateinit-vs-by-lazy)

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

### Ejercicio 1.13: Inmutabilidad de Cadenas y Derivación de Estados
📄 **Archivo:** `E13_InmutabilidadCadenasEstado.kt`  
📚 **Teoría de referencia:** [La Inmutabilidad en el Desarrollo Moderno](../11-variables-tipos-datos.md#3-la-inmutabilidad-en-el-desarrollo-moderno)

#### 1. Enunciado y Requisitos

En Kotlin, los objetos `String` son **estrictamente inmutables**: una vez creados en memoria, sus caracteres internos no pueden modificarse jamás. Cualquier transformación genera un nuevo objeto en memoria.

1. Declara una cadena inmutable `val tituloBase: String = "The Legend of Zelda"`.

2. Aplica sobre ella `.uppercase()` y almacena el resultado en `val tituloMayus: String`.

3. Concatena `tituloBase + " : Echoes of Wisdom"` en `val tituloCompleto: String`.

4. Imprime `tituloBase` y comprueba que permanece 100% inalterado (inmutabilidad).

5. Modela un patrón de estado de pantalla con `var estadoActual: String = "CARGANDO"`. Simula el avance del juego reasignándole un nuevo estado inmutable: `estadoActual = "JUGANDO"`.

6. Comprueba con el operador de identidad referencial **`===`** que cada estado es un objeto diferente en memoria.

#### 2. Salida Esperada en Consola

```text
Título base (inalterado): The Legend of Zelda
Título mayúsculas (nuevo objeto): THE LEGEND OF ZELDA
Título completo (nuevo objeto): The Legend of Zelda : Echoes of Wisdom
Estado inicial: CARGANDO
Estado derivado: JUGANDO
¿El estado derivado es un objeto diferente (===)? true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val tituloBase: String = "The Legend of Zelda"

        // Las transformaciones no alteran el String original, devuelven uno nuevo:
        val tituloMayus: String = tituloBase.uppercase()
        val tituloCompleto: String = tituloBase + " : Echoes of Wisdom"

        println("Título base (inalterado): $tituloBase")
        println("Título mayúsculas (nuevo objeto): $tituloMayus")
        println("Título completo (nuevo objeto): $tituloCompleto")

        // Derivación de nuevo estado inmutable (patrón base de Compose):
        var estadoActual: String = "CARGANDO"
        println("Estado inicial: $estadoActual")

        val estadoAnterior = estadoActual
        estadoActual = "JUGANDO" // Reasignamos la referencia a una nueva cadena inmutable
        println("Estado derivado: $estadoActual")

        println("¿El estado derivado es un objeto diferente (===)? ${estadoActual !== estadoAnterior}")
    }
    ```

---

### Reto 1.14: Combate RPG por Turnos (*Héroe vs Dragón Carmesí*)
📄 **Archivo:** `Reto01_CombateRpg.kt`  
📚 **Teoría de referencia:** [La Inmutabilidad en el Desarrollo Moderno](../11-variables-tipos-datos.md#3-la-inmutabilidad-en-el-desarrollo-moderno) y [When como Expresión](../12.1-when.md#2-when-como-expresion-su-primer-superpoder)

#### 1. Contexto y Misión

El reino de Kotlinia se encuentra bajo la amenaza del temible **Dragón Carmesí**, una criatura milenaria que asola las fortalezas del norte. Tu misión como desarrollador es programar el motor central de combate por turnos (*Battle Loop*) para un juego de rol (RPG) en consola, donde el **Héroe** deberá medir su ingenio táctico contra la bestia.

Este reto representa el proyecto culminante del Bloque 1. En él pondrás a prueba, de forma integrada, **todos los fundamentos aprendidos**:

- Declaración inmutable (`val`) frente a estado mutable (`var`).
- Control de flujo sin efectos secundarios (`when` e `if` evaluados como expresiones).
- Ciclos indeterminados de ejecución (`while`).
- *String Templates* y manipulación inmutable de texto (`.repeat()`, `.padEnd()`).
- Operadores seguros de rango y funciones de acotación matemática (`.coerceAtLeast()`, `.coerceAtMost()`).

##### 🎮 La Dinámica del Combate Explicada

El combate se disputa en un **duelo directo frente a frente** cerrado en un bucle continuo por turnos.

!!! info "ℹ️ Aclaración sobre el Combate (Sin Posiciones Espaciales ni Tablero)"
    En este reto **no existen posiciones físicas, coordenadas ni movimiento en una cuadrícula o mapa**. Los dos contendientes están situados cara a cara. Lo que evoluciona en cada asalto no es su posición en el espacio, sino sus **recursos numéricos**: sus puntos de vida, su reserva de energía y su inventario de botiquines curativos.

###### A. Los Combatientes y sus Recursos

| Combatiente | Puntos de Vida (HP) | Reserva de Energía (Maná) | Inventario de Curación |
| :--- | :--- | :--- | :--- |
| **Héroe de Kotlinia** | **100 HP** iniciales / máx. | **30 Puntos de Energía** | **2 Pociones Curativas** en su zurrón |
| **Dragón Carmesí** | **150 HP** iniciales / máx. | Inagotable (fuerza bruta, coste 0) | Escamas blindadas (gran resistencia) |

###### B. Glosario de Conceptos Clave del Juego

Para que la mecánica del juego se entienda a la perfección:

1. **Puntos de Vida (HP - *Health Points*):**  
   Miden la salud restante del combatiente. El Héroe comienza con 100 HP y el Dragón con 150 HP. Cada impacto recibido resta vida. Si la vida de cualquiera de los dos cae a 0, el combate termina inmediatamente.

2. **Energía (tradicionalmente llamada *Maná* en los juegos de rol):**  
   Es el combustible o reserva especial que tiene el Héroe para ejecutar su ataque mágico demoledor (*Lanza de Hielo*).

    - El Héroe comienza con **30 puntos de energía**.

    - Cada lanzamiento de *Lanza de Hielo* consume **15 puntos de energía**.

    - Por tanto, el Héroe solo puede usar este ataque un máximo de **2 veces** en toda la partida ($30 / 15 = 2$).

    - Una vez agotada la energía (o si le quedan menos de 15 puntos), ya no puede lanzar magia y debe recurrir a su espada básica, que no consume energía.

3. **Pociones Curativas (Botiquines de Emergencia):**  
   Son dosis medicinales de un solo uso que el Héroe lleva en su zurrón:

    - El Héroe parte con un inventario limitado de **2 pociones**.

    - **Efecto:** Al tomar una poción, recupera de inmediato **+35 HP** de vida, con un tope de seguridad: la vida nunca puede sobrepasar los 100 HP iniciales (no existe la sobrecuración).

    - **Gasto:** Cada uso gasta una poción (`pociones--`). Si el contador llega a `0`, las existencias se agotan y ya no podrá curarse en lo que reste de batalla.

    - **Criterio de uso:** El Héroe es previsor y solo recurre a una poción cuando su salud es crítica (**40 HP o menos**) y todavía le quedan existencias.

###### C. Ciclo de Vida de Cada Turno (Paso a Paso)

Cada iteración del bucle de combate ejecuta cronológicamente las siguientes fases:

1. **Apertura y Panel de Estado (HUD):**  
   Al arrancar cada turno se imprime en consola el estado visual de ambos contrincantes: barras de salud proporcionales dibujadas en bloques ASCII (ej. `[████████  ]`), vida numérica actual/máxima, energía restante y pociones en bolsa.

2. **Fase de Decisión y Acción del Héroe:**  
   El Héroe dispone de un repertorio de 3 tácticas posibles. Para esta simulación, el motor de combate evalúa su situación mediante una expresión `when` que aplica una toma de decisiones estratégica:

    - **Opción 1: Beber Poción Curativa (Prioridad Supervivencia):** Si la vida del héroe cae a **40 HP o menos** y aún conserva pociones (`pociones > 0`), bebe una de ellas: recupera de golpe **+35 HP** (acotada al máximo de 100 HP) y gasta una unidad de su zurrón.

    - **Opción 2: Lanza de Hielo (Ataque Mágico con Gasto de Energía):** Si la salud del héroe es segura y dispone de al menos **15 puntos de energía**, invoca este hechizo: consume **15 de energía** e inflige un daño crítico masivo aleatorio de **35 a 45 HP** al Dragón.

    - **Opción 3: Golpe de Espada (Ataque Físico Básico):** Si la vida es estable pero no hay energía suficiente, asesta un mandoble con su espada: coste 0 de energía e inflige entre **18 y 25 HP** de daño aleatorio al Dragón.

3. **Fase de Comprobación de Impacto (Regla Crucial del Juego):**  
   Inmediatamente tras el golpe del héroe, se verifica la vida del Dragón. Si los puntos de vida del dragón llegan a **0 HP o menos**, ¡el dragón ha muerto! En ese instante se cancela el turno: **el dragón derrotado NO contraataca** y la partida concluye.

4. **Fase de Contraataque del Dragón:**  
   Si el Dragón continúa con vida tras recibir el ataque, ruge ferozmente y desata su **Aliento Ígneo**, reduciendo la vida del héroe en un valor aleatorio de **15 a 22 HP**.

5. **Fase de Cierre y Avance de Turno:**  
   Se verifica si el Héroe sigue en pie. Si ambos contrincantes tienen más de 0 HP, se incrementa el contador de asaltos (`turno++`) y se inicia la siguiente ronda.

###### D. Desenlace Final (Condiciones de Victoria y Derrota)

El bucle termina automáticamente en el momento en que uno de los dos combatientes agota su salud:

- **🏆 Victoria Heroica:** Si la vida del dragón llega a 0, se imprime un cartel de triunfo indicando el número total de asaltos que duró la batalla.

- **💀 Derrota en Batalla:** Si la vida del héroe llega a 0, se imprime un cartel de derrota anunciando la caída del adalid.

---

#### 2. Requisitos Funcionales

Para que el simulador funcione con precisión, tu código debe ceñirse a los siguientes requisitos técnicos (sin emplear colecciones ni clases del Bloque 2 en adelante):

1. **RF-01 (Inmutabilidad y Constantes de Reglas):** Declara como constantes inmutables (`val`) las reglas invariables del combate: `maxHeroeHp = 100`, `maxDragonHp = 150`, `maxHeroeEnergia = 30` y `costeEnergiaHechizo = 15`.

2. **RF-02 (Estado Vivo Mutable):** Declara como variables mutables (`var`) exclusivamente los estados que varían asalto a asalto: `heroeHp`, `heroeEnergia`, `pociones`, `dragonHp` y `turno`.

3. **RF-03 (Motor de Batalla con Bucle Indeterminado):** Controla el combate mediante un bucle `while (heroeHp > 0 && dragonHp > 0)`.

4. **RF-04 (Estrategia de IA con when sin Argumento):** Determina el código de acción del héroe (`1`, `2` o `3`) mediante un `when` que evalúe las condiciones booleanas de prioridad (vida crítica $\le 40$ con pociones disponibles, energía suficiente $\ge 15$, o espada por defecto).

5. **RF-05 (Modificación Segura de Recursos):** Emplea un segundo `when (accion)` para aplicar la deducción de energía (`heroeEnergia -= costeEnergiaHechizo`), el decremento de existencias de pociones (`pociones--`) y los impactos de daño en la vida.

6. **RF-06 (Tiradas Aleatorias de Daño):** Genera los valores de daño dentro de los rangos oficiales mediante `(min..max).random()`: espada `18..25`, hechizo `35..45` y dragón `15..22`.

7. **RF-07 (Blindaje de Límites Numéricos):** Evita vidas negativas usando `.coerceAtLeast(0)` en los cálculos de daño, y evita la sobrecuración por encima de 100 HP usando `.coerceAtMost(maxHeroeHp)` al beber pociones.

8. **RF-08 (HUD con Manipulación Inmutable de Cadenas):** Genera las barras gráficas calculando el número de bloques sólidos con regla de tres entera `(hp * tamañoBarra) / maxHp` y aplicando `.repeat(bloques).padEnd(tamañoBarra, ' ')`.

9. **RF-09 (Resolución y Veredicto):** Al finalizar el bucle, evalúa mediante una expresión `if (heroeHp > 0)` el mensaje final de victoria o derrota.

---

??? info "📊 Ver Modelo Mental del Juego (Diagrama de Flujo del Combate)"
    ```mermaid
    flowchart TD
        Inicio(["Inicio: Inicializar HP, Energía y Pociones"]) --> Bucle{"¿Ambos siguen con vida?<br/>(Héroe y Dragón HP > 0)"}
        Bucle -- "Sí" --> HUD["Mostrar HUD: Barras ASCII, Vida y Energía"]
        HUD --> Decision{"Evaluar Táctica con when"}
        
        Decision -- "Vida crítica (<= 40) y con pociones" --> Pocion["Beber Poción (+35 HP, -1 Poción)"]
        Decision -- "Energía disponible (>= 15)" --> Magia["Lanza de Hielo (-15 Energía, Daño 35-45)"]
        Decision -- "Por defecto" --> Espada["Golpe de Espada (Coste 0, Daño 18-25)"]
        
        Pocion --> CheckDragon{"¿Dragón derrotado?<br/>(Dragón HP <= 0)"}
        Magia --> CheckDragon
        Espada --> CheckDragon
        
        CheckDragon -- "Sí: Dragón cae" --> Victoria(["🏆 Victoria Heroica"])
        CheckDragon -- "No: Sigue vivo" --> AtaqueDragon["Aliento Ígneo del Dragón (Daño 15-22)"]
        
        AtaqueDragon --> CheckHeroe{"¿Héroe sobrevive?<br/>(Héroe HP > 0)"}
        CheckHeroe -- "Sí: En pie" --> SigTurno["Incrementar Turno (turno++)"] --> Bucle
        CheckHeroe -- "No: Cae en batalla" --> Derrota(["💀 Derrota en Batalla"])
        
        Bucle -- "No" --> Fin(["Fin del Combate"])
    ```

??? question "🧠 Preguntas de Reflexión Previa (Aprender a Pensar)"
    Antes de mirar el código o las pistas, reflexiona sobre estas cuestiones de diseño:

    - **¿Por qué la vida del Héroe debe ser `var` pero su vida máxima debe ser `val`?**  
      La vida máxima es una regla fija de las mecánicas del juego; si la hicieras mutable, un error en un cálculo de daño podría alterar el tope de la partida accidentalmente.

    - **¿Cómo evitar que la vida del dragón muestre valores negativos como `-12 HP`?**  
      En lugar de un `if (hp < 0) hp = 0`, Kotlin provee `hp.coerceAtLeast(0)`, que acota el valor inferior de forma concisa.

    - **¿Por qué un `while` y no un `for`?**  
      Un bucle `for` se usa cuando sabemos el número exacto de iteraciones (ej. 10 veces). La duración de una batalla es indeterminada: depende de las tiradas aleatorias de daño y de la estrategia, por lo que `while` con condición de parada es la estructura natural.

??? tip "💡 Pistas Progresivas de Ayuda (Abrir solo si te atascas)"
    === "Pista 1: Generación de Valores Aleatorios"
        En Kotlin puedes obtener un entero aleatorio dentro de un rango sin librerías externas:
        ```kotlin
        val danoEspada = (18..25).random()
        val danoMagia = (35..45).random()
        val danoDragon = (15..22).random()
        ```
    === "Pista 2: Dibujar las Barras de Vida"
        Puedes calcular cuántos bloques sólidos dibujar con una regla de tres simple y `.repeat()`:
        ```kotlin
        val bloquesHeroe = (heroeHp * 10) / maxHeroeHp
        val barraHeroe = "█".repeat(bloquesHeroe).padEnd(10, ' ')
        ```
    === "Pista 3: Esqueleto del Bucle Principal"
        La estructura básica del combate tiene esta forma:
        ```kotlin
        while (heroeHp > 0 && dragonHp > 0) {
            println("\n=== TURNO #$turno ===")
            // 1. Dibujar barras con vida y energía
            // 2. when con la acción del héroe
            // 3. if (dragonHp > 0) -> contraataque dragón
            turno++
        }
        ```

??? example "🖥️ Ver Salida Esperada en Consola (Ejemplo de Partida)"
    ```text
    ==================================================
            ⚔️ BATALLA: HÉROE VS DRAGÓN CARMESÍ ⚔️     
    ==================================================

    === TURNO #1 ===
    HÉROE  [██████████] 100/100 HP | Energía: 30/30 | Pociones: 2
    DRAGÓN [███████████████] 150/150 HP
    -> Héroe lanza Ataque Especial 'Lanza de Hielo' (-15 Energía) -> ¡41 de daño crítico al Dragón!
    -> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe 19 de daño!

    === TURNO #2 ===
    HÉROE  [████████  ] 81/100 HP | Energía: 15/30 | Pociones: 2
    DRAGÓN [██████████     ] 109/150 HP
    -> Héroe lanza Ataque Especial 'Lanza de Hielo' (-15 Energía) -> ¡38 de daño crítico al Dragón!
    -> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe 21 de daño!

    === TURNO #3 ===
    HÉROE  [██████    ] 60/100 HP | Energía: 0/30 | Pociones: 2
    DRAGÓN [███████        ] 71/150 HP
    -> Héroe asesta Golpe de Espada -> ¡22 de daño al Dragón!
    -> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe 20 de daño!

    === TURNO #4 ===
    HÉROE  [████      ] 40/100 HP | Energía: 0/30 | Pociones: 2
    DRAGÓN [█████          ] 49/150 HP
    -> Héroe bebe una Poción Curativa (+35 HP). Pociones restantes: 1
    -> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe 17 de daño!

    === TURNO #5 ===
    HÉROE  [█████     ] 58/100 HP | Energía: 0/30 | Pociones: 1
    DRAGÓN [█████          ] 49/150 HP
    -> Héroe asesta Golpe de Espada -> ¡25 de daño al Dragón!
    -> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe 18 de daño!

    === TURNO #6 ===
    HÉROE  [████      ] 40/100 HP | Energía: 0/30 | Pociones: 1
    DRAGÓN [██             ] 24/150 HP
    -> Héroe bebe una Poción Curativa (+35 HP). Pociones restantes: 0
    -> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe 16 de daño!

    === TURNO #7 ===
    HÉROE  [█████     ] 59/100 HP | Energía: 0/30 | Pociones: 0
    DRAGÓN [██             ] 24/150 HP
    -> Héroe asesta Golpe de Espada -> ¡24 de daño al Dragón!

    ==================================================
                  🏆 ¡VICTORIA HEROICA! 🏆            
    El temible Dragón Carmesí ha sido derrotado en 7 turnos.
    ==================================================
    ```

??? tip "💻 Ver Solución Comentada Paso a Paso"
    ```kotlin
    package b01_fundamentos

    fun main() {
        println("""
            ==================================================
                    ⚔️ BATALLA: HÉROE VS DRAGÓN CARMESÍ ⚔️     
            ==================================================
        """.trimIndent())

        // 1. Constantes inmutables de combate (reglas fijas)
        val maxHeroeHp = 100
        val maxDragonHp = 150
        val maxHeroeEnergia = 30 // Reserva de combustible para habilidades especiales
        val costeEnergiaHechizo = 15 // Cada uso consume 15 puntos de energía

        // 2. Variables mutables de estado vivo (cambian en cada turno)
        var heroeHp = maxHeroeHp
        var heroeEnergia = maxHeroeEnergia
        var pociones = 2 // Inventario limitado de botiquines curativos (2 dosis en total)
        var dragonHp = maxDragonHp
        var turno = 1

        // 3. Bucle de combate que continúa mientras ambos sigan vivos
        while (heroeHp > 0 && dragonHp > 0) {
            println("\n=== TURNO #$turno ===")

            // Renderizado de barras de vida proporcionales usando .repeat()
            val bloquesHeroe = (heroeHp * 10) / maxHeroeHp
            val barraHeroe = "█".repeat(bloquesHeroe).padEnd(10, ' ')

            val bloquesDragon = (dragonHp * 15) / maxDragonHp
            val barraDragon = "█".repeat(bloquesDragon).padEnd(15, ' ')

            println("HÉROE  [$barraHeroe] $heroeHp/$maxHeroeHp HP | Energía: $heroeEnergia/$maxHeroeEnergia | Pociones: $pociones")
            println("DRAGÓN [$barraDragon] $dragonHp/$maxDragonHp HP")

            // 4. Decisión táctica evaluada con when sin argumento (Bloque 1 puro)
            val accion = when {
                heroeHp <= 40 && pociones > 0 -> 3 // Prioridad 1: Curarse si la vida baja de 40 y quedan pociones
                heroeEnergia >= costeEnergiaHechizo -> 2 // Prioridad 2: Ataque especial con energía mientras alcance
                else -> 1                          // En otro caso: Golpe básico de espada (coste 0)
            }

            // 5. Ejecución de la acción seleccionada
            when (accion) {
                1 -> {
                    val danoEspada = (18..25).random()
                    dragonHp = (dragonHp - danoEspada).coerceAtLeast(0)
                    println("-> Héroe asesta Golpe de Espada -> ¡$danoEspada de daño al Dragón!")
                }
                2 -> {
                    if (heroeEnergia >= costeEnergiaHechizo) {
                        heroeEnergia -= costeEnergiaHechizo
                        val danoMagico = (35..45).random()
                        dragonHp = (dragonHp - danoMagico).coerceAtLeast(0)
                        println("-> Héroe lanza Ataque Especial 'Lanza de Hielo' (-$costeEnergiaHechizo Energía) -> ¡$danoMagico de daño crítico al Dragón!")
                    } else {
                        println("-> ¡Héroe intenta lanzar ataque especial sin energía suficiente y pierde el turno!")
                    }
                }
                3 -> {
                    if (pociones > 0) {
                        pociones--
                        val curacion = 35
                        heroeHp = (heroeHp + curacion).coerceAtMost(maxHeroeHp)
                        println("-> Héroe bebe una Poción Curativa (+35 HP). Pociones restantes: $pociones")
                    } else {
                        println("-> ¡Héroe busca en su bolsa pero no le quedan pociones!")
                    }
                }
            }

            // 6. Contraataque del Dragón (solo si sigue con vida tras el ataque del héroe)
            if (dragonHp > 0) {
                val danoDragon = (15..22).random()
                heroeHp = (heroeHp - danoDragon).coerceAtLeast(0)
                println("-> Dragón contraataca con Aliento Ígneo -> ¡Héroe recibe $danoDragon de daño!")
            }

            turno++
        }

        // 7. Desenlace del combate al salir del bucle
        println("\n==================================================")
        if (heroeHp > 0) {
            println("              🏆 ¡VICTORIA HEROICA! 🏆            ")
            println("El temible Dragón Carmesí ha sido derrotado en $turno turnos.")
        } else {
            println("              💀 ¡HAS SIDO DERROTADO! 💀          ")
            println("El Héroe ha caído en batalla frente al Dragón Carmesí.")
        }
        println("==================================================")
    }
    ```

