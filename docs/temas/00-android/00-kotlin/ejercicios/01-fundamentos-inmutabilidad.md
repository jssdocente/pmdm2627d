# Bloque 1: Fundamentos, Inmutabilidad y Control de Flujo

En este primer bloque comenzarás a programar en el proyecto único **`pmdm-kotlin-lab`** de IntelliJ IDEA. El objetivo es interiorizar las diferencias sintácticas clave respecto a Java y asimilar la **inmutabilidad** como principio de diseño fundamental para el desarrollo móvil.

📁 **Paquete de trabajo:** `package b01_fundamentos`  
Ubicación en tu proyecto: `src/main/kotlin/b01_fundamentos/`

---

## 🟢 Nivel Básico (Consolidación Sintáctica)

### Ejercicio 1.1: Variables Inmutables vs Mutables
📄 **Archivo:** `E01_VariablesInmutabilidad.kt`

#### 1. Enunciado y Requisitos
1. Declara una variable inmutable (`val`) con el nombre de tu aplicación favorita y otra con su versión inicial (entero `1`).
2. Declara una variable mutable (`var`) que registre el número de descargas inicial (ej. `1000`).
3. Simula que la aplicación recibe 350 descargas más, actualizando la variable mutable.
4. Intenta reasignar la versión a `2` para comprobar el error del compilador; después, corrige el código comentando la línea errónea y explicando en un comentario por qué falla.
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

### Ejercicio 1.2: Inferencia de Tipos y Cadenas Multilínea
📄 **Archivo:** `E02_InferenciaYTipos.kt`

#### 1. Enunciado y Requisitos
1. Declara variables utilizando **inferencia de tipos** (sin indicar el tipo explícito) para:
   - Título de un juego (`String`).
   - Precio en euros (`Double`).
   - Calificación de 0 a 100 (`Byte` o `Int`).
   - Si está disponible en Android (`Boolean`).
2. Muestra la ficha técnica del juego utilizando un literal de cadena multilínea (`"""...""".trimIndent()`), calculando en la propia plantilla el precio con un 21% de IVA añadido mediante `${precio * 1.21}`.

#### 2. Salida Esperada en Consola
```text
FICHA TÉCNICA DEL JUEGO:
- Título: Hollow Knight
- Precio base: 14.99 € (PVP con IVA: 18.14 €)
- Puntuación: 95/100
- Disponible en Android: true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val titulo = "Hollow Knight"
        val precio = 14.99
        val puntuacion = 95
        val disponibleAndroid = true

        val ficha = """
            FICHA TÉCNICA DEL JUEGO:
            - Título: $titulo
            - Precio base: $precio € (PVP con IVA: ${"%.2f".format(precio * 1.21)} €)
            - Puntuación: $puntuacion/100
            - Disponible en Android: $disponibleAndroid
        """.trimIndent()

        println(ficha)
    }
    ```

---

## 🟡 Nivel Intermedio (Aplicación de Lógica y Control de Flujo)

### Ejercicio 1.3: `if` como Expresión y Operador Ternario
📄 **Archivo:** `E03_IfComoExpresion.kt`

#### 1. Enunciado y Requisitos
En Java se utiliza el operador ternario `condicion ? valor1 : valor2`. En Kotlin no existe porque `if-else` es una expresión que devuelve valor.
1. Declara una variable inmutable `edadUsuario: Int`.
2. Asigna a una variable `categoriaAcceso: String` el resultado de un `if-else` evaluado como expresión:
   - Si tiene menos de 13 años: `"RESTRINGIDO"`.
   - Si tiene entre 13 y 17 años: `"JUVENIL"`.
   - Si tiene 18 o más: `"ADULTO_COMPLETO"`.
3. Imprime el resultado asegurando que no se use ninguna variable intermedia mutable.

#### 2. Salida Esperada en Consola
```text
Usuario con 16 años -> Acceso concedido: JUVENIL
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        val edadUsuario = 16

        // Asignación directa del resultado de la expresión if-else:
        val categoriaAcceso = if (edadUsuario < 13) {
            "RESTRINGIDO"
        } else if (edadUsuario in 13..17) {
            "JUVENIL"
        } else {
            "ADULTO_COMPLETO"
        }

        println("Usuario con $edadUsuario años -> Acceso concedido: $categoriaAcceso")
    }
    ```

---

### Ejercicio 1.4: Clasificador con `when` Exhaustivo y Rangos
📄 **Archivo:** `E04_ClasificadorWhen.kt`

#### 1. Enunciado y Requisitos
1. Modela una función evaluadora que reciba la puntuación de un usuario en un juego (de 0 a 100).
2. Utiliza una expresión `when` evaluando **rangos (`in ..`)**:
   - `0..49`: `"Insuficiente - Necesitas entrenar más"`.
   - `50..69`: `"Aceptable - Superas la media"`.
   - `70..89`: `"Notable - Gran dominio del juego"`.
   - `90..100`: `"Sobresaliente - Maestro gamer"`.
   - `else`: `"Puntuación no válida fuera de rango"`.
3. Asigna el resultado directamente a una variable inmutable y pruébalo con los valores `45`, `82` y `105`.

#### 2. Salida Esperada en Consola
```text
Puntos: 45 -> Insuficiente - Necesitas entrenar más
Puntos: 82 -> Notable - Gran dominio del juego
Puntos: 105 -> Puntuación no válida fuera de rango
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun clasificarRendimiento(puntos: Int): String {
        return when (puntos) {
            in 0..49 -> "Insuficiente - Necesitas entrenar más"
            in 50..69 -> "Aceptable - Superas la media"
            in 70..89 -> "Notable - Gran dominio del juego"
            in 90..100 -> "Sobresaliente - Maestro gamer"
            else -> "Puntuación no válida fuera de rango"
        }
    }

    fun main() {
        listOf(45, 82, 105).forEach { pts ->
            println("Puntos: $pts -> ${clasificarRendimiento(pts)}")
        }
    }
    ```

---

## 🔴 Nivel Avanzado (Retos Integradores y Gotchas)

### Ejercicio 1.5: La Matriz de Mutabilidad (El Gran Gotcha)
📄 **Archivo:** `E05_MatrizMutabilidad.kt`

#### 1. Enunciado y Requisitos
Demuestra mediante código ejecutable los 4 cuadrantes de la matriz de mutabilidad:
1. **Caso A (`val` + lista inmutable):** No permite reasignar variable ni añadir elementos.
2. **Caso B (`val` + lista mutable):** No permite reasignar la referencia, pero **sí alterar su contenido interno**.
3. **Caso C (`var` + lista inmutable):** Permite reasignar una nueva lista a la variable, pero la lista existente no puede mutar.
4. **Caso D (`var` + lista mutable):** Permite reasignar variable y mutar contenido.
Acompaña cada caso de un `println` descriptivo.

#### 2. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b01_fundamentos

    fun main() {
        println("=== MATRIZ DE MUTABILIDAD EN KOTLIN ===")

        // Caso A: val + inmutable
        val listaA = listOf("Zelda", "Metroid")
        // listaA.add("Mario") // NO COMPILA: listOf() no tiene add()
        // listaA = listOf()   // NO COMPILA: val no se reasigna
        println("Caso A (val + listOf): Totalmente inmutable -> $listaA")

        // Caso B: val + mutable
        val listaB = mutableListOf("Zelda", "Metroid")
        listaB.add("Mario") // Válido: el objeto muta en el heap
        // listaB = mutableListOf() // NO COMPILA: la referencia val no cambia
        println("Caso B (val + mutableListOf): Contenido mutado -> $listaB")

        // Caso C: var + inmutable
        var listaC = listOf("Zelda")
        listaC = listaC + "Donkey Kong" // Válido: crea una NUEVA lista y reasigna 'var'
        println("Caso C (var + listOf): Reasignada con nueva instancia -> $listaC")

        // Caso D: var + mutable
        var listaD = mutableListOf("Zelda")
        listaD.add("Kirby")
        listaD = mutableListOf("Pokemon")
        println("Caso D (var + mutableListOf): Mutabilidad total -> $listaD")
    }
    ```

---

### Reto 1.6: Simulador de Checkout de Tienda Digital
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
