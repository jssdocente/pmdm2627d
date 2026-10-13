# Bloque 4: Colecciones Funcionales, Mappers y Scope Functions

En este cuarto bloque trabajarás con la biblioteca de operaciones funcionales de Kotlin (`map`, `filter`, `groupBy`, etc.), la inmutabilidad de colecciones y las 5 funciones de ámbito (*Scope Functions*: `let`, `run`, `with`, `apply`, `also`). Estas herramientas son el motor para transformar datos entre capas (patrón **Data Mapper** de Clean Architecture) y estructurar pipelines declarativos sin bucles imperativos.

📁 **Paquete de trabajo:** `package b04_colecciones`  
Ubicación en tu proyecto: `src/main/kotlin/b04_colecciones/`

!!! info "📚 Apuntes Teóricos de Referencia"
    Para resolver las actividades de este bloque, puedes consultar los siguientes temas de los apuntes:

    - [Listas y Operaciones Funcionales](../42-listas.md)
    - [Conjuntos (Sets) y Unicidad](../44-sets.md)
    - [Mapas (Diccionarios y Agrupaciones)](../43-maps.md)
    - [Arrays en Kotlin](../41-arrays.md)
    - [Scope Functions (`let`, `run`, `with`, `apply`, `also`)](../31-scope-functions.md)

---

## 🌱 Fase 0: Calentamiento Guiado (Gimnasio de Sintaxis)

Esta fase contiene **5 micro-ejercicios atómicos** para mecanizar la inmutabilidad de colecciones en Kotlin, el adiós a los bucles `for` imperativos mediante transformaciones funcionales directas y las primeras funciones de ámbito.

📁 **Archivo de trabajo para esta fase:** `E00_CalentamientoColecciones.kt`  
Ubicación: `src/main/kotlin/b04_colecciones/`

---

### 🔹 Nivel 1: Listas Inmutables y Transformaciones

#### Ejercicio 0.1: `listOf` Inmutable vs `ArrayList` de Java
📄 **Archivo:** `E00_CalentamientoColecciones.kt`  
📚 **Teoría de referencia:** [Creación de Listas: listOf vs mutableListOf](../42-listas.md#1-creacion-de-listas-listof-vs-mutablelistof)

##### 1. Concepto y Código Resuelto
En Java, las listas son mutables por defecto (`new ArrayList<>()`). En Kotlin, la función estándar `listOf()` crea una lista **estrictamente de solo lectura** (`List<T>`), impidiendo adiciones o modificaciones accidentales.

=== "Kotlin"
    ```kotlin
    package b04_colecciones

    fun main() {
        // Lista inmutable de solo lectura:
        val consolas = listOf("PlayStation 5", "Nintendo Switch", "Xbox Series X")

        println("Consolas disponibles: $consolas")
        println("Total catálogo: ${consolas.size} consolas")

        // consolas.add("Steam Deck") // ❌ ERROR DE COMPILACIÓN: No existe método add() en List
    }
    ```

=== "Java"
    ```java
    import java.util.ArrayList;
    import java.util.List;

    public class ListasJava {
        public static void main(String[] args) {
            // En Java, las listas estándar permiten mutación libre:
            List<String> consolas = new ArrayList<>();
            consolas.add("PlayStation 5");
            consolas.add("Nintendo Switch");
            consolas.add("Xbox Series X");

            System.out.println("Consolas disponibles: " + consolas);
            System.out.println("Total catálogo: " + consolas.size() + " consolas");
        }
    }
    ```

##### 2. Salida en Consola
```text
Consolas disponibles: [PlayStation 5, Nintendo Switch, Xbox Series X]
Total catálogo: 3 consolas
```

---

#### Ejercicio 0.2: `mutableListOf` y el Operador Funcional `+`
📄 **Archivo:** `E00_CalentamientoColecciones.kt`  
📚 **Teoría de referencia:** [Inmutabilidad y Adición Funcional (+)](../42-listas.md#3-inmutabilidad-y-adicion-funcional-de-elementos)

##### 1. Enunciado y Código de Partida

En Kotlin se puede crear una lista mutable con `mutableListOf()`, pero el enfoque preferido en programación funcional es mantener listas inmutables y derivar una **nueva lista** con un elemento añadido utilizando el operador matemático **`+`**.

1. Partiendo de `inventarioBase`, genera una nueva lista inmutable `inventarioAmpliado` sumando `"Elixir Mágico"` mediante el operador `+`.
2. Muestra ambas listas por consola y comprueba que la lista base original no ha sufrido mutación.

Copia esta plantilla de partida en tu archivo y completa el bloque marcado con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val inventarioBase = listOf("Poción", "Antídoto")

    // TODO: Genera una nueva lista sumando "Elixir Mágico" con el operador funcional '+'
    val inventarioAmpliado: List<String> = TODO("Derivar nueva lista con operador '+'")

    println("Inventario base (intacto): $inventarioBase")
    println("Inventario ampliado (+): $inventarioAmpliado")
}
```

##### 2. Salida Esperada
```text
Inventario base (intacto): [Poción, Antídoto]
Inventario ampliado (+): [Poción, Antídoto, Elixir Mágico]
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val inventarioBase = listOf("Poción", "Antídoto")

        // El operador '+' no muta la lista original; retorna una nueva lista inmutable:
        val inventarioAmpliado = inventarioBase + "Elixir Mágico"

        println("Inventario base (intacto): $inventarioBase")
        println("Inventario ampliado (+): $inventarioAmpliado")
    }
    ```

---

#### Ejercicio 0.3: Transformación Declarativa con `.map { }`
📄 **Archivo:** `E00_CalentamientoColecciones.kt`  
📚 **Teoría de referencia:** [Transformación con map](../42-listas.md#4-transformaciones-con-map-y-mapindexed)

##### 1. Concepto y Código Resuelto
En Java tradicional, transformar una lista requiere crear una lista vacía, iterar con un bucle `for` y añadir los elementos convertidos uno a uno. En Kotlin, `.map { }` aplica una transformación elemento a elemento y devuelve la nueva lista en una sola expresión.

=== "Kotlin"
    ```kotlin
    package b04_colecciones

    fun main() {
        val preciosDolares = listOf(10.0, 20.0, 50.0)

        // Convertimos cada precio a Euros aplicando la tasa de cambio con .map:
        val preciosEuros = preciosDolares.map { it * 0.92 }

        println("Precios originales en USD: $preciosDolares")
        println("Precios convertidos a EUR: $preciosEuros")
    }
    ```

=== "Java (Bucle Tradicional)"
    ```java
    import java.util.ArrayList;
    import java.util.Arrays;
    import java.util.List;
    import java.util.stream.Collectors;

    public class MapJava {
        public static void main(String[] args) {
            List<Double> preciosDolares = Arrays.asList(10.0, 20.0, 50.0);

            // En Java tradicional se requiere bucle manual acumulador:
            List<Double> preciosEuros = new ArrayList<>();
            for (Double precio : preciosDolares) {
                preciosEuros.add(precio * 0.92);
            }

            System.out.println("Precios originales en USD: " + preciosDolares);
            System.out.println("Precios convertidos a EUR: " + preciosEuros);
        }
    }
    ```

##### 2. Salida en Consola
```text
Precios originales en USD: [10.0, 20.0, 50.0]
Precios convertidos a EUR: [9.2, 18.4, 46.0]
```

---

#### Ejercicio 0.4: Filtrado Declarativo con `.filter { }`
📄 **Archivo:** `E00_CalentamientoColecciones.kt`  
📚 **Teoría de referencia:** [Filtrado con filter](../42-listas.md#5-filtrado-con-filter-y-variantes)

##### 1. Enunciado y Código de Partida

1. Dada la lista de calificaciones `notas`, filtra únicamente las notas aprobadas (calificación ≥ 5.0) en la lista inmutable `aprobados`.
2. Muestra los aprobados y calcula la cantidad total de alumnos que han aprobado con `.size`.

Copia esta plantilla de partida en tu archivo y completa el bloque marcado con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val notas = listOf(4.5, 7.0, 3.2, 9.5, 6.0, 2.0, 8.8)

    // TODO: Filtra solo las notas aprobadas (>= 5.0) usando .filter { ... }
    val aprobados: List<Double> = TODO("Filtrar con notas.filter { ... }")

    println("Notas aprobadas: $aprobados (Total: ${aprobados.size} alumnos)")
}
```

##### 2. Salida Esperada
```text
Notas aprobadas: [7.0, 9.5, 6.0, 8.8] (Total: 4 alumnos)
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val notas = listOf(4.5, 7.0, 3.2, 9.5, 6.0, 2.0, 8.8)

        // Filtramos solo los elementos que cumplan el predicado:
        val aprobados = notas.filter { it >= 5.0 }

        println("Notas aprobadas: $aprobados (Total: ${aprobados.size} alumnos)")
    }
    ```

---

#### Ejercicio 0.5: Configuración Fluida con `.apply` y Trazas con `.also`
📄 **Archivo:** `E00_CalentamientoColecciones.kt`  
📚 **Teoría de referencia:** [Scope Functions](../31-scope-functions.md)

##### 1. Enunciado y Código de Partida

1. Modela una clase mutable de configuración `ConfiguradorAlerta`.
2. Instancia y configura el objeto en un solo paso utilizando `.apply { ... }` asignando `titulo = "Descarga de Recursos"` y `prioridad = 250`.
3. Encadena inmediatamente un bloque `.also { ... }` para imprimir un mensaje de traza informando de que la alerta ha sido preparada.

Copia esta plantilla de partida en tu archivo y completa el bloque marcado con `TODO(...)`:

```kotlin
package b04_colecciones

class ConfiguradorAlerta {
    var titulo: String = ""
    var prioridad: Int = 0
}

fun main() {
    // TODO: Instancia ConfiguradorAlerta(), configúralo con .apply y añade logging con .also
    val alerta: ConfiguradorAlerta = TODO("Encadenar .apply { ... }.also { ... }")

    println("Alerta configurada: ${alerta.titulo} (Prioridad: ${alerta.prioridad})")
}
```

##### 2. Salida Esperada
```text
[TRAZA DE LOG]: Alerta preparada para Descarga de Recursos
Alerta configurada: Descarga de Recursos (Prioridad: 250)
```

##### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    class ConfiguradorAlerta {
        var titulo: String = ""
        var prioridad: Int = 0
    }

    fun main() {
        val alerta = ConfiguradorAlerta().apply {
            // 'this' es el objeto configurado:
            titulo = "Descarga de Recursos"
            prioridad = 250
        }.also {
            // 'it' es el objeto recién configurado, ideal para logging sin alterar el retorno:
            println("[TRAZA DE LOG]: Alerta preparada para ${it.titulo}")
        }

        println("Alerta configurada: ${alerta.titulo} (Prioridad: ${alerta.prioridad})")
    }
    ```

---

## 🟢 Nivel Básico (Colecciones Inmutables y Filtros)

### Ejercicio 4.1: Inmutabilidad en Listas y el Operador `+`
📄 **Archivo:** `E01_ListasInmutables.kt`  
📚 **Teoría de referencia:** [Creación de Listas: listOf() vs mutableListOf()](../42-listas.md#1-creacion-de-listas-listof-vs-mutablelistof) y [Inmutabilidad y Adición (+)](../42-listas.md#3-inmutabilidad-y-adicion-funcional-de-elementos)

#### 1. Enunciado y Código de Partida

1. Partiendo de la lista inmutable `original` con 3 títulos de juegos, utiliza el operador funcional **`+`** para derivar una nueva lista inmutable `conAnadidos` que sume `"Pokemon"` y `"Kirby"` (sin usar `MutableList` ni `add()`).
2. Utiliza **`filterNot`** para derivar una tercera lista inmutable `sinMetroid` que excluya el título `"Metroid"`.
3. Muestra por consola las tres listas comprobando que la lista original no ha sufrido modificaciones.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E01_ListasInmutables.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val original: List<String> = listOf("Zelda", "Metroid", "Mario")

    // 1. TODO: Deriva una nueva lista inmutable sumando "Pokemon" y "Kirby" con el operador '+'
    val conAnadidos: List<String> = TODO("Sumar elementos con operador '+'")

    // 2. TODO: Deriva una tercera lista inmutable excluyendo "Metroid" con filterNot
    val sinMetroid: List<String> = TODO("Excluir elemento con filterNot")

    println("Original: $original")
    println("Con añadidos: $conAnadidos")
    println("Sin Metroid: $sinMetroid")
}
```

#### 2. Salida Esperada en Consola

```text
Original: [Zelda, Metroid, Mario]
Con añadidos: [Zelda, Metroid, Mario, Pokemon, Kirby]
Sin Metroid: [Zelda, Mario, Pokemon, Kirby]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val original: List<String> = listOf("Zelda", "Metroid", "Mario")

        // Inmutabilidad: derivamos nuevas listas con operadores funcionales
        val conAnadidos: List<String> = original + listOf("Pokemon", "Kirby")
        val sinMetroid: List<String> = conAnadidos.filterNot { it == "Metroid" }

        println("Original: $original")
        println("Con añadidos: $conAnadidos")
        println("Sin Metroid: $sinMetroid")
    }
    ```

---

### Ejercicio 4.2: Transformaciones con `map` y `filter`
📄 **Archivo:** `E02_MapFilterBasico.kt`  
📚 **Teoría de referencia:** [map: Transformación elemento a elemento](../42-listas.md#41-map-transformacion-elemento-a-elemento) y [filter: Filtrado por condición](../42-listas.md#42-filter-filtrado-por-condicion)

#### 1. Enunciado y Código de Partida

Dada una lista de precios brutos en dólares:

1. Filtra los precios para conservar únicamente los superiores a `10.0` $.
2. Transforma cada precio a euros multiplicándolo por la tasa de cambio `0.92`.
3. Convierte cada valor a cadena formateada con dos decimales y el sufijo `"€"` (`"%.2f €".format(...)`).
4. Estructura todo el procesamiento en un único **pipeline funcional encadenado**.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E02_MapFilterBasico.kt` y completa el bloque marcado con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val preciosDolares = listOf(15.0, 4.5, 60.0, 8.0, 35.0, 120.0)

    // TODO: Encadena .filter (> 10.0), .map (* 0.92) y .map ("%.2f €".format(...))
    val preciosEuros: List<String> = TODO("Construir pipeline funcional encadenado")

    println("Precios en euros (>10$): $preciosEuros")
}
```

#### 2. Salida Esperada en Consola

```text
Precios en euros (>10$): [13.80 €, 55.20 €, 32.20 €, 110.40 €]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val preciosDolares = listOf(15.0, 4.5, 60.0, 8.0, 35.0, 120.0)

        val preciosEuros = preciosDolares
            .filter { it > 10.0 }
            .map { it * 0.92 }
            .map { "%.2f €".format(it) }

        println("Precios en euros (>10$): $preciosEuros")
    }
    ```

---

### Ejercicio 4.3: Conjuntos (`Set`) para Unicidad y Operaciones Matemáticas
📄 **Archivo:** `E03_ConjuntosYOperaciones.kt`  
📚 **Teoría de referencia:** [Operaciones con Sets](../44-sets.md#operaciones-con-sets)

#### 1. Enunciado y Código de Partida

1. Partiendo de `listaConDuplicados`, genera un `Set<String>` inmutable mediante **`.toSet()`** para purgar duplicados automáticamente.
2. Compara las etiquetas únicas de la tienda con los géneros favoritos del usuario realizando las tres operaciones de conjuntos en formato infijo:
    - **`intersect` (Intersección):** Etiquetas presentes en ambas colecciones.
    - **`union` (Unión):** Colección combinada total sin duplicados.
    - **`subtract` (Diferencia):** Géneros favoritos del usuario que aún no están disponibles en la tienda.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E03_ConjuntosYOperaciones.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val listaConDuplicados = listOf("RPG", "Acción", "Indie", "RPG", "Aventura", "Indie")
    val favoritosUsuario: Set<String> = setOf("Acción", "Estrategia", "RPG", "Terror")

    // 1. TODO: Convierte la lista con duplicados en un Set inmutable
    val tagsTienda: Set<String> = TODO("Convertir con toSet()")

    println("Etiquetas únicas tienda: $tagsTienda")
    println("Géneros favoritos usuario: $favoritosUsuario")

    // 2. TODO: Calcula la intersección entre tagsTienda y favoritosUsuario
    val coincidencias: Set<String> = TODO("Operación intersect")

    // 3. TODO: Calcula la unión de ambos catálogos
    val todas: Set<String> = TODO("Operación union")

    // 4. TODO: Calcula los favoritos que faltan en la tienda (favoritosUsuario subtract tagsTienda)
    val faltantes: Set<String> = TODO("Operación subtract")

    println("Coincidencias (intersect): $coincidencias")
    println("Catálogo combinado (union): $todas")
    println("Pendientes por encontrar (subtract): $faltantes")
}
```

#### 2. Salida Esperada en Consola

```text
Etiquetas únicas tienda: [RPG, Acción, Indie, Aventura]
Géneros favoritos usuario: [Acción, Estrategia, RPG, Terror]
Coincidencias (intersect): [RPG, Acción]
Catálogo combinado (union): [RPG, Acción, Indie, Aventura, Estrategia, Terror]
Pendientes por encontrar (subtract): [Estrategia, Terror]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val listaConDuplicados = listOf("RPG", "Acción", "Indie", "RPG", "Aventura", "Indie")
        val tagsTienda: Set<String> = listaConDuplicados.toSet()
        val favoritosUsuario: Set<String> = setOf("Acción", "Estrategia", "RPG", "Terror")

        println("Etiquetas únicas tienda: $tagsTienda")
        println("Géneros favoritos usuario: $favoritosUsuario")

        // Operaciones de conjuntos
        val coincidencias = tagsTienda intersect favoritosUsuario
        val todas = tagsTienda union favoritosUsuario
        val faltantes = favoritosUsuario subtract tagsTienda

        println("Coincidencias (intersect): $coincidencias")
        println("Catálogo combinado (union): $todas")
        println("Pendientes por encontrar (subtract): $faltantes")
    }
    ```

---

### Ejercicio 4.4: Mapas Asociativos (`Map`) y Acceso Seguro
📄 **Archivo:** `E04_MapasYValoresPorDefecto.kt`  
📚 **Teoría de referencia:** [Acceso a elementos de un Map](../43-maps.md#acceso-a-elementos-de-un-map) y [Operaciones con Maps](../43-maps.md#operaciones-con-maps)

#### 1. Enunciado y Código de Partida

1. Modela un inventario inmutable de munición `inventario` con 3 tipos de armas.
2. Demuestra el acceso seguro frente a valores ausentes:
    - Consulta directa mediante operador de indexación (`[]`).
    - Consulta con valor de sustitución estático mediante **`getOrDefault`**.
    - Consulta con bloque de cálculo dinámico mediante **`getOrElse`**.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E04_MapasYValoresPorDefecto.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val inventario: Map<String, Int> = mapOf(
        "Pistola" to 45,
        "Escopeta" to 12,
        "Rifle" to 30
    )

    // 1. TODO: Consulta directa de "Pistola"
    val municionPistola: Int? = TODO("Consultar inventario[\"Pistola\"]")

    // 2. TODO: Acceso directo a una clave inexistente "Lanzacohetes" (retorna null)
    val municionLanzacohetesDirecto: Int? = TODO("Consultar inventario[\"Lanzacohetes\"]")

    // 3. TODO: Consulta con getOrDefault para "Lanzacohetes" con valor por defecto 0
    val municionLanzacohetesSeguro: Int = TODO("Consultar con inventario.getOrDefault(...)")

    // 4. TODO: Consulta con getOrElse para "Arco" suministrando una reserva calculada de 5
    val municionArco: Int = TODO("Consultar con inventario.getOrElse(...) { ... }")

    println("Munición Pistola: $municionPistola")
    println("Munición Lanzacohetes (directo): $municionLanzacohetesDirecto")
    println("Munición Lanzacohetes (getOrDefault): $municionLanzacohetesSeguro")
    println("Munición Arco (getOrElse con lógica): $municionArco (suministro base)")
}
```

#### 2. Salida Esperada en Consola

```text
Munición Pistola: 45
Munición Lanzacohetes (directo): null
Munición Lanzacohetes (getOrDefault): 0
Munición Arco (getOrElse con lógica): 5 (suministro base)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val inventario: Map<String, Int> = mapOf(
            "Pistola" to 45,
            "Escopeta" to 12,
            "Rifle" to 30
        )

        println("Munición Pistola: ${inventario["Pistola"]}")
        println("Munición Lanzacohetes (directo): ${inventario["Lanzacohetes"]}")
        println("Munición Lanzacohetes (getOrDefault): ${inventario.getOrDefault("Lanzacohetes", 0)}")

        val municionArco = inventario.getOrElse("Arco") {
            // Se ejecuta solo si la clave no existe
            val baseReserva = 5
            baseReserva
        }
        println("Munición Arco (getOrElse con lógica): $municionArco (suministro base)")
    }
    ```

---

### Ejercicio 4.5: Búsqueda y Predicados (`find`, `any`, `all`, `none`)
📄 **Archivo:** `E05_BusquedaYPredicados.kt`  
📚 **Teoría de referencia:** [Búsqueda y Verificación: find, any, all](../42-listas.md#43-busqueda-y-verificacion-find-any-all)

#### 1. Enunciado y Código de Partida

Dada la lista de puntuaciones de jugadores:

1. Encuentra con **`firstOrNull`** (o **`find`**) el primer valor estrictamente superior a `400`.
2. Utiliza **`any`** para comprobar si algún jugador alcanzó la categoría legendaria (`>= 900`).
3. Utiliza **`all`** para verificar si todos los participantes superaron el nivel inicial (`>= 50`).
4. Utiliza **`none`** para comprobar que ningún jugador posee puntuación negativa (`< 0`).

Copia esta plantilla con los datos de prueba preparados en tu archivo `E05_BusquedaYPredicados.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val puntuaciones = listOf(120, 85, 450, 990, 310, 60)

    // 1. TODO: Encuentra el primer elemento superior a 400
    val primerDestacado: Int? = TODO("Usar firstOrNull { ... }")

    // 2. TODO: Comprueba si al menos uno supera o iguala 900
    val hayRangoLegendario: Boolean = TODO("Usar any { ... }")

    // 3. TODO: Comprueba si todos superan o igualan 50
    val todosPasaronTutorial: Boolean = TODO("Usar all { ... }")

    // 4. TODO: Comprueba si ninguno tiene puntuación negativa (< 0)
    val sinNegativos: Boolean = TODO("Usar none { ... }")

    println("Puntuaciones: $puntuaciones")
    println("Primer jugador > 400 pts: $primerDestacado")
    println("¿Alguien superó los 900 pts? $hayRangoLegendario")
    println("¿Todos superaron el tutorial (>= 50 pts)? $todosPasaronTutorial")
    println("¿Nadie tiene puntuación negativa? $sinNegativos")
}
```

#### 2. Salida Esperada en Consola

```text
Puntuaciones: [120, 85, 450, 990, 310, 60]
Primer jugador > 400 pts: 450
¿Alguien superó los 900 pts? true
¿Todos superaron el tutorial (>= 50 pts)? true
¿Nadie tiene puntuación negativa? true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val puntuaciones = listOf(120, 85, 450, 990, 310, 60)

        val primerDestacado = puntuaciones.firstOrNull { it > 400 }
        val hayRangoLegendario = puntuaciones.any { it >= 900 }
        val todosPasaronTutorial = puntuaciones.all { it >= 50 }
        val sinNegativos = puntuaciones.none { it < 0 }

        println("Puntuaciones: $puntuaciones")
        println("Primer jugador > 400 pts: $primerDestacado")
        println("¿Alguien superó los 900 pts? $hayRangoLegendario")
        println("¿Todos superaron el tutorial (>= 50 pts)? $todosPasaronTutorial")
        println("¿Nadie tiene puntuación negativa? $sinNegativos")
    }
    ```

---

## 🟡 Nivel Intermedio (Agrupaciones y Scope Functions)

### Ejercicio 4.6: Agrupación con `groupBy` y Estadísticas
📄 **Archivo:** `E06_GroupByEstadisticas.kt`  
📚 **Teoría de referencia:** [Agrupación y Ordenación: groupBy y sortedBy](../42-listas.md#44-agrupacion-y-ordenacion-groupby-y-sortedby)

#### 1. Enunciado y Código de Partida

1. Modela una `data class ItemInventario(val nombre: String, val categoria: String, val valorMonedas: Int)`.
2. Partiendo del catálogo de ítems, utiliza **`groupBy`** para organizar los elementos por su `categoria` en un `Map<String, List<ItemInventario>>`.
3. Recorre el mapa resultante calculando la suma total del valor en monedas de los ítems de cada categoría mediante **`.sumOf { it.valorMonedas }`**.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E06_GroupByEstadisticas.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

data class ItemInventario(val nombre: String, val categoria: String, val valorMonedas: Int)

fun main() {
    val inventario = listOf(
        ItemInventario("Espada Maestra", "Arma", 350),
        ItemInventario("Arco de Madera", "Arma", 100),
        ItemInventario("Escudo Hyliano", "Armadura", 400),
        ItemInventario("Casco de Hierro", "Armadura", 200),
        ItemInventario("Poción de Vida", "Consumible", 50),
        ItemInventario("Elixir de Maná", "Consumible", 30)
    )

    // 1. TODO: Agrupa los items por categoría en un Map<String, List<ItemInventario>> con groupBy
    val porCategoria: Map<String, List<ItemInventario>> = TODO("Agrupar con inventario.groupBy { ... }")

    println("=== RESUMEN POR CATEGORÍA ===")
    // 2. TODO: Itera sobre porCategoria mostrando la categoría, cantidad de items y total acumulado con sumOf
    TODO("Iterar con porCategoria.forEach y calcular total con items.sumOf { ... }")
}
```

#### 2. Salida Esperada en Consola

```text
=== RESUMEN POR CATEGORÍA ===
Categoría: Arma (2 items) -> Valor total: 450 monedas
Categoría: Armadura (2 items) -> Valor total: 600 monedas
Categoría: Consumible (2 items) -> Valor total: 80 monedas
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    data class ItemInventario(val nombre: String, val categoria: String, val valorMonedas: Int)

    fun main() {
        val inventario = listOf(
            ItemInventario("Espada Maestra", "Arma", 350),
            ItemInventario("Arco de Madera", "Arma", 100),
            ItemInventario("Escudo Hyliano", "Armadura", 400),
            ItemInventario("Casco de Hierro", "Armadura", 200),
            ItemInventario("Poción de Vida", "Consumible", 50),
            ItemInventario("Elixir de Maná", "Consumible", 30)
        )

        val porCategoria: Map<String, List<ItemInventario>> = inventario.groupBy { it.categoria }

        println("=== RESUMEN POR CATEGORÍA ===")
        porCategoria.forEach { (cat, items) ->
            val totalValor = items.sumOf { it.valorMonedas }
            println("Categoría: $cat (${items.size} items) -> Valor total: $totalValor monedas")
        }
    }
    ```

---

### Ejercicio 4.7: `partition` y Ordenación Funcional
📄 **Archivo:** `E07_PartitionYSorted.kt`  
📚 **Teoría de referencia:** [Agrupación y Ordenación en Listas](../42-listas.md#44-agrupacion-y-ordenacion-groupby-y-sortedby)

#### 1. Enunciado y Código de Partida

Dada una lista de usuarios registrados:

1. Utiliza **`partition`** con desestructuración de variables `val (premiums, estandar) = ...` para segregar en una sola pasada a los usuarios que tienen `esPremium == true` de los gratuitos.
2. Ordena la lista de usuarios premium de mayor a menor horas jugadas utilizando **`sortedByDescending { it.horasJugadas }`**.
3. Muestra el ranking de usuarios premium indexado y el recuento total de cuentas estándar.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E07_PartitionYSorted.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

data class Usuario(val username: String, val horasJugadas: Int, val esPremium: Boolean)

fun main() {
    val usuarios = listOf(
        Usuario("ZeldaFan", 150, true),
        Usuario("Novato2026", 12, false),
        Usuario("ShadowLink", 240, true),
        Usuario("CasualPlayer", 5, false),
        Usuario("PixelMaster", 45, true)
    )

    // 1. TODO: Divide en dos listas (premiums y estandar) en una sola pasada usando partition
    val (premiums, estandar) = TODO("Particionar con usuarios.partition { ... }")

    // 2. TODO: Ordena a los usuarios premium de mayor a menor horas con sortedByDescending
    val premiumsOrdenados: List<Usuario> = TODO("Ordenar con premiums.sortedByDescending { ... }")

    println("--- USUARIOS PREMIUM (Ordenados por horas) ---")
    premiumsOrdenados.forEachIndexed { i, u ->
        println("${i + 1}. ${u.username}: ${u.horasJugadas} horas")
    }

    println("\n--- USUARIOS ESTÁNDAR ---")
    println("Total cuentas gratuitas: ${estandar.size}")
}
```

#### 2. Salida Esperada en Consola

```text
--- USUARIOS PREMIUM (Ordenados por horas) ---
1. ShadowLink: 240 horas
2. ZeldaFan: 150 horas
3. PixelMaster: 45 horas

--- USUARIOS ESTÁNDAR ---
Total cuentas gratuitas: 2
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    data class Usuario(val username: String, val horasJugadas: Int, val esPremium: Boolean)

    fun main() {
        val usuarios = listOf(
            Usuario("ZeldaFan", 150, true),
            Usuario("Novato2026", 12, false),
            Usuario("ShadowLink", 240, true),
            Usuario("CasualPlayer", 5, false),
            Usuario("PixelMaster", 45, true)
        )

        // Dividimos en dos listas en una sola pasada
        val (premiums, estandar) = usuarios.partition { it.esPremium }

        val premiumsOrdenados = premiums.sortedByDescending { it.horasJugadas }

        println("--- USUARIOS PREMIUM (Ordenados por horas) ---")
        premiumsOrdenados.forEachIndexed { i, u ->
            println("${i + 1}. ${u.username}: ${u.horasJugadas} horas")
        }

        println("\n--- USUARIOS ESTÁNDAR ---")
        println("Total cuentas gratuitas: ${estandar.size}")
    }
    ```

---

### Ejercicio 4.8: Indexación Eficiente con `associateBy` y `associateWith`
📄 **Archivo:** `E08_AssociateByYWith.kt`  
📚 **Teoría de referencia:** [Operaciones con Maps: Creación e Indexación](../43-maps.md#operaciones-con-maps)

#### 1. Enunciado y Código de Partida

En aplicaciones Android frecuentemente recibimos listas de la API y necesitamos convertirlas a mapas indexados por clave primaria (ID) para búsquedas de complejidad O(1) en repositorios o caché.

1. Utiliza **`associateBy { it.id }`** para indexar la lista de personajes en un `Map<String, Personaje>`.
2. Realiza búsquedas seguras en el mapa para los IDs `"P-02"` y `"P-99"`, gestionando la ausencia con el operador Elvis (`?:`).
3. Utiliza **`associateWith`** sobre un conjunto de identificadores para asociar cada clave con el estado textual `"CARGADO"`.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E08_AssociateByYWith.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

data class Personaje(val id: String, val nombre: String, val nivel: Int)

fun main() {
    val lista = listOf(
        Personaje("P-01", "Geralt", 50),
        Personaje("P-02", "Ciri", 45),
        Personaje("P-03", "Yennefer", 60)
    )

    // 1. TODO: Indexa la lista en un Map<String, Personaje> usando associateBy con la propiedad 'id'
    val mapaPorId: Map<String, Personaje> = TODO("Indexar con lista.associateBy { ... }")

    println("Mapa indexado por ID:")
    mapaPorId.forEach { (id, p) -> println("$id -> ${p.nombre} (Nvl ${p.nivel})") }

    // 2. TODO: Realiza búsquedas directas por clave en mapaPorId
    val personajeP02 = TODO("Buscar P-02 en mapaPorId")
    val personajeP99 = TODO("Buscar P-99 en mapaPorId con Elvis para valor no encontrado")

    println("\nBúsqueda instantánea de P-02: $personajeP02")
    println("Búsqueda instantánea de P-99: $personajeP99")

    // 3. TODO: Asocia cada ID del conjunto con el estado fijo \"CARGADO\" mediante associateWith
    val idsConsultados = setOf("P-02", "P-99")
    val estados: Map<String, String> = TODO("Asociar con idsConsultados.associateWith { ... }")
    println("Estados iniciales: $estados")
}
```

#### 2. Salida Esperada en Consola

```text
Mapa indexado por ID:
P-01 -> Geralt (Nvl 50)
P-02 -> Ciri (Nvl 45)
P-03 -> Yennefer (Nvl 60)

Búsqueda instantánea de P-02: Ciri
Búsqueda instantánea de P-99: No encontrado en caché
Estados iniciales: {P-02=CARGADO, P-99=CARGADO}
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    data class Personaje(val id: String, val nombre: String, val nivel: Int)

    fun main() {
        val lista = listOf(
            Personaje("P-01", "Geralt", 50),
            Personaje("P-02", "Ciri", 45),
            Personaje("P-03", "Yennefer", 60)
        )

        // Indexación por clave primaria (ID -> Personaje)
        val mapaPorId: Map<String, Personaje> = lista.associateBy { it.id }

        println("Mapa indexado por ID:")
        mapaPorId.forEach { (id, p) -> println("$id -> ${p.nombre} (Nvl ${p.nivel})") }

        println("\nBúsqueda instantánea de P-02: ${mapaPorId["P-02"]?.nombre ?: "No encontrado"}")
        println("Búsqueda instantánea de P-99: ${mapaPorId["P-99"]?.nombre ?: "No encontrado en caché"}")

        val idsConsultados = setOf("P-02", "P-99")
        val estados = idsConsultados.associateWith { "CARGADO" }
        println("Estados iniciales: $estados")
    }
    ```

---

### Ejercicio 4.9: Aplanado de Jerarquías con `flatten` y `flatMap`
📄 **Archivo:** `E09_FlattenYFlatMap.kt`  
📚 **Teoría de referencia:** [Operaciones Funcionales Imprescindibles en Listas](../42-listas.md#4-operaciones-funcionales-imprescindibles)

#### 1. Enunciado y Código de Partida

1. Modela una `data class Desarrolladora(val nombre: String, val juegosLanzados: List<String>)`.
2. Partiendo de la lista de estudios de desarrollo, utiliza **`flatMap`** para extraer todos los títulos de sus listas internas en una única lista plana `List<String>`.
3. Encadena **`.distinct()`** para eliminar posibles títulos duplicados y **`.sorted()`** para ordenar el catálogo alfabéticamente.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E09_FlattenYFlatMap.kt` y completa el bloque marcado con `TODO(...)`:

```kotlin
package b04_colecciones

data class Desarrolladora(val nombre: String, val juegosLanzados: List<String>)

fun main() {
    val estudios = listOf(
        Desarrolladora("Nintendo", listOf("Zelda Tears of the Kingdom", "Mario Odyssey", "Animal Crossing")),
        Desarrolladora("FromSoftware", listOf("Elden Ring", "Dark Souls")),
        Desarrolladora("Team Cherry", listOf("Hollow Knight"))
    )

    // TODO: Extrae los títulos con flatMap, elimina duplicados con distinct() y ordena con sorted()
    val catalogoUnificado: List<String> = TODO("Pipeline: flatMap + distinct + sorted")

    println("=== CATÁLOGO GLOBAL UNIFICADO (FLATMAP) ===")
    catalogoUnificado.forEach { println("- $it") }
}
```

#### 2. Salida Esperada en Consola

```text
=== CATÁLOGO GLOBAL UNIFICADO (FLATMAP) ===
- Animal Crossing
- Dark Souls
- Elden Ring
- Hollow Knight
- Mario Odyssey
- Zelda Tears of the Kingdom
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    data class Desarrolladora(val nombre: String, val juegosLanzados: List<String>)

    fun main() {
        val estudios = listOf(
            Desarrolladora("Nintendo", listOf("Zelda Tears of the Kingdom", "Mario Odyssey", "Animal Crossing")),
            Desarrolladora("FromSoftware", listOf("Elden Ring", "Dark Souls")),
            Desarrolladora("Team Cherry", listOf("Hollow Knight"))
        )

        // Aplanamos la lista de listas en una sola secuencia de títulos
        val catalogoUnificado = estudios
            .flatMap { it.juegosLanzados }
            .distinct()
            .sorted()

        println("=== CATÁLOGO GLOBAL UNIFICADO (FLATMAP) ===")
        catalogoUnificado.forEach { println("- $it") }
    }
    ```

---

### Ejercicio 4.10: Configuración de Objetos con `apply` y Trazas con `also`
📄 **Archivo:** `E10_ScopeFunctionsApplyAlso.kt`  
📚 **Teoría de referencia:** [apply: Configuración de Objetos](../31-scope-functions.md#21-apply-configuracion-e-inicializacion-de-objetos) y [also: Efectos Secundarios y Logging](../31-scope-functions.md#23-also-efectos-secundarios-side-effects-y-logging)

#### 1. Enunciado y Código de Partida

1. Modela una clase mutable `ConfiguracionJuego` con propiedades `volumenMusica: Int = 100`, `brillo: Int = 50`, `subtitulos: Boolean = false`.
2. Utiliza la función de ámbito **`apply`** para instanciar y configurar el objeto (`volumenMusica = 75`, `brillo = 80`, `subtitulos = true`) en un bloque expresivo sin repetir el nombre de la variable (`this` implícito).
3. Encadena inmediatamente una llamada a **`also`** para imprimir un log de confirmación (*side-effect*) sin modificar el objeto recibido (`it`).

Copia esta plantilla con los datos de prueba preparados en tu archivo `E10_ScopeFunctionsApplyAlso.kt` y completa el bloque marcado con `TODO(...)`:

```kotlin
package b04_colecciones

class ConfiguracionJuego {
    var volumenMusica: Int = 100
    var brillo: Int = 50
    var subtitulos: Boolean = false

    override fun toString(): String =
        "Volumen: $volumenMusica, Brillo: $brillo, Subtítulos: $subtitulos"
}

fun main() {
    // TODO: Instancia ConfiguracionJuego(), configúralo con .apply { ... } y añade log con .also { ... }
    val config: ConfiguracionJuego = TODO("Encadenar apply { ... }.also { ... }")

    println("Estado final -> $config")
}
```

#### 2. Salida Esperada en Consola

```text
[LOG]: Configuración instanciada correctamente en memoria.
Estado final -> Volumen: 75, Brillo: 80, Subtítulos: true
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    class ConfiguracionJuego {
        var volumenMusica: Int = 100
        var brillo: Int = 50
        var subtitulos: Boolean = false

        override fun toString(): String =
            "Volumen: $volumenMusica, Brillo: $brillo, Subtítulos: $subtitulos"
    }

    fun main() {
        // apply ejecuta configuración sobre el receptor (this) y lo devuelve
        // also ejecuta efectos secundarios (it) y devuelve el mismo objeto
        val config = ConfiguracionJuego().apply {
            volumenMusica = 75
            brillo = 80
            subtitulos = true
        }.also {
            println("[LOG]: Configuración instanciada correctamente en memoria.")
        }

        println("Estado final -> $config")
    }
    ```

---

## 🔴 Nivel Avanzado (Arquitectura Limpia y Analítica)

### Ejercicio 4.11: Transformación DTO a Dominio con `run` y `let` (Data Mapper)
📄 **Archivo:** `E11_MapperDtoADominio.kt`  
📚 **Teoría de referencia:** [let: Operaciones Null-Safe](../31-scope-functions.md#22-let-operaciones-null-safe-y-transformaciones-locales) y [run: Cómputo de Resultado](../31-scope-functions.md#24-run-configuracion-y-computo-de-resultado)

#### 1. Enunciado y Código de Partida

En Android Clean Architecture, los datos crudos que llegan de la red (Retrofit DTO) contienen campos nulos o formatos no aptos para la UI. Deben transformarse a modelos de Dominio limpios.

1. Implementa la función de extensión `fun VideojuegoDto.toDomain(): Videojuego?`.
2. Valida mediante cláusulas con operador Elvis que si `id_api` o `raw_title` son nulos, la función aborte devolviendo `null`.
3. Utiliza la función de ámbito **`run`** sobre el DTO para construir el objeto limpio `Videojuego`, calculando la nota sobre 10 dividiendo `score_percent` entre `10.0` y saneando el título con `.trim()`.

Copia esta plantilla con los modelos y casos de prueba preparados en tu archivo `E11_MapperDtoADominio.kt` y completa la función de extensión marcada con `TODO(...)`:

```kotlin
package b04_colecciones

// Modelo de datos de la API (Retrofit DTO con campos anulables)
data class VideojuegoDto(
    val id_api: Long?,
    val raw_title: String?,
    val score_percent: Int?
)

// Modelo puro de Dominio para la app Android (campos obligatorios y limpios)
data class Videojuego(
    val id: Long,
    val titulo: String,
    val puntuacionSobreDiez: Double
)

// TODO: Implementa la función de extensión utilizando let / run / elvis
fun VideojuegoDto.toDomain(): Videojuego? {
    TODO("Validar nulos obligatorios y usar run para retornar Videojuego transformado")
}

fun main() {
    val dtoValido = VideojuegoDto(101L, "  Silksong  ", 98)
    val dtoInvalido = VideojuegoDto(null, "Juego Fantasma", 50)

    println("DTO Válido transformado: ${dtoValido.toDomain()}")
    println("DTO Inválido transformado: ${dtoInvalido.toDomain()}")
}
```

#### 2. Salida Esperada en Consola

```text
DTO Válido transformado: Videojuego(id=101, titulo=Silksong, puntuacionSobreDiez=9.8)
DTO Inválido transformado: null
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    // Modelo de datos de la API (Retrofit DTO)
    data class VideojuegoDto(
        val id_api: Long?,
        val raw_title: String?,
        val score_percent: Int?
    )

    // Modelo puro de Dominio para la app Android
    data class Videojuego(
        val id: Long,
        val titulo: String,
        val puntuacionSobreDiez: Double
    )

    // Mapper utilizando Scope Functions
    fun VideojuegoDto.toDomain(): Videojuego? {
        val validId = this.id_api ?: return null
        val validTitle = this.raw_title ?: return null

        return this.run {
            val nota = (score_percent ?: 0) / 10.0
            Videojuego(
                id = validId,
                titulo = validTitle.trim(),
                puntuacionSobreDiez = nota
            )
        }
    }

    fun main() {
        val dtoValido = VideojuegoDto(101L, "  Silksong  ", 98)
        val dtoInvalido = VideojuegoDto(null, "Juego Fantasma", 50)

        println("DTO Válido transformado: ${dtoValido.toDomain()}")
        println("DTO Inválido transformado: ${dtoInvalido.toDomain()}")
    }
    ```

---

### Ejercicio 4.12: Pipeline Funcional Completo: Analítica de Sesiones
📄 **Archivo:** `E12_PipelineAnaliticaCompleta.kt`  
📚 **Teoría de referencia:** [Tabla Maestra de Scope Functions](../31-scope-functions.md#1-tabla-maestra-de-seleccion-rapida) y [Operaciones Funcionales](../42-listas.md#4-operaciones-funcionales-imprescindibles)

#### 1. Enunciado y Código de Partida

Partiendo del histórico de sesiones de juego:

1. Filtra las sesiones que alcancen al menos `15` minutos (descartar abandonos accidentales).
2. Agrupa por el nombre del `juego` mediante **`groupBy`**.
3. Transforma cada grupo en un `ResumenJuego` calculando:
    - Minutos totales acumulados mediante `.sumOf { it.minutos }`.
    - Porcentaje de partidas completadas con éxito (`(exitos.toDouble() / total) * 100.0`).
4. Ordena el ranking final de mayor a menor tiempo jugado con **`sortedByDescending { it.minutosTotales }`**.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E12_PipelineAnaliticaCompleta.kt` y completa el pipeline marcado con `TODO(...)`:

```kotlin
package b04_colecciones

data class SesionJuego(
    val usuarioId: String,
    val juego: String,
    val minutos: Int,
    val completado: Boolean
)

data class ResumenJuego(
    val juego: String,
    val minutosTotales: Int,
    val porcentajeExito: Double
)

fun main() {
    val sesiones = listOf(
        SesionJuego("U1", "Elden Ring", 120, false),
        SesionJuego("U2", "Elden Ring", 150, true),
        SesionJuego("U3", "Elden Ring", 50, false),
        SesionJuego("U1", "Hollow Knight", 90, true),
        SesionJuego("U4", "Hollow Knight", 90, false),
        SesionJuego("U2", "Celeste", 45, true),
        SesionJuego("U3", "Celeste", 8, true) // Descartada (<15 min)
    )

    // TODO: Encadena .filter, .groupBy, .map y .sortedByDescending
    val ranking: List<ResumenJuego> = TODO("Construir pipeline funcional de analítica")

    println("=== RANKING DE JUEGOS MÁS POPULARES ===")
    ranking.forEachIndexed { i, r ->
        println("${i + 1}. ${r.juego} -> ${r.minutosTotales} min totales | Éxito: ${"%.1f".format(r.porcentajeExito)}%")
    }
}
```

#### 2. Salida Esperada en Consola

```text
=== RANKING DE JUEGOS MÁS POPULARES ===
1. Elden Ring -> 320 min totales | Éxito: 33.3%
2. Hollow Knight -> 180 min totales | Éxito: 50.0%
3. Celeste -> 45 min totales | Éxito: 100.0%
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    data class SesionJuego(
        val usuarioId: String,
        val juego: String,
        val minutos: Int,
        val completado: Boolean
    )

    data class ResumenJuego(
        val juego: String,
        val minutosTotales: Int,
        val porcentajeExito: Double
    )

    fun main() {
        val sesiones = listOf(
            SesionJuego("U1", "Elden Ring", 120, false),
            SesionJuego("U2", "Elden Ring", 150, true),
            SesionJuego("U3", "Elden Ring", 50, false),
            SesionJuego("U1", "Hollow Knight", 90, true),
            SesionJuego("U4", "Hollow Knight", 90, false),
            SesionJuego("U2", "Celeste", 45, true),
            SesionJuego("U3", "Celeste", 8, true) // Descartada (<15 min)
        )

        val ranking: List<ResumenJuego> = sesiones
            .filter { it.minutos >= 15 }
            .groupBy { it.juego }
            .map { (juego, lista) ->
                val totalMin = lista.sumOf { it.minutos }
                val exitos = lista.count { it.completado }
                val porcentaje = (exitos.toDouble() / lista.size) * 100.0
                ResumenJuego(juego, totalMin, porcentaje)
            }
            .sortedByDescending { it.minutosTotales }

        println("=== RANKING DE JUEGOS MÁS POPULARES ===")
        ranking.forEachIndexed { i, r ->
            println("${i + 1}. ${r.juego} -> ${r.minutosTotales} min totales | Éxito: ${"%.1f".format(r.porcentajeExito)}%")
        }
    }
    ```

---

### Ejercicio 4.13: Particionamiento y Paginación con `.chunked()` y `.windowed()`
📄 **Archivo:** `E13_ChunkedWindowed.kt`  
📚 **Teoría de referencia:** [Operaciones Funcionales en Listas](../42-listas.md#4-transformaciones-con-map-y-mapindexed)

#### 1. Enunciado y Código de Partida

En interfaces Android con Jetpack Compose, a menudo necesitamos alimentar cuadrículas de N columnas o simular páginas de resultados:

1. Utiliza **`.chunked(3)`** sobre el catálogo de títulos para dividir la colección en páginas o filas de exactamente 3 juegos por bloque.
2. Dada una serie temporal de mediciones de red `latencias`, utiliza **`.windowed(size = 3, step = 1)`** para calcular el promedio móvil de latencia con `.average()` en cada ventana de 3 mediciones consecutivas.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E13_ChunkedWindowed.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val catalogo = listOf(
        "Zelda", "Mario", "Metroid",
        "Pokemon", "Kirby", "Donkey Kong",
        "Fire Emblem", "Star Fox", "F-Zero"
    )

    println("--- CATÁLOGO PAGINADO EN BLOQUES DE 3 (chunked) ---")
    // 1. TODO: Divide el catálogo en listas de tamaño 3 usando chunked
    val paginas: List<List<String>> = TODO("Usar catalogo.chunked(3)")
    paginas.forEachIndexed { index, pagina ->
        println("Página ${index + 1}: $pagina")
    }

    println("\n--- PROMEDIOS MÓVILES DE LATENCIA (windowed) ---")
    val latencias = listOf(45, 52, 60, 48, 55, 70, 65)
    // 2. TODO: Itera sobre las ventanas deslizantes (size = 3, step = 1) e imprime la media calculada
    TODO("Usar latencias.windowed(size = 3, step = 1) y calcular ventana.average()")
}
```

#### 2. Salida Esperada en Consola

```text
--- CATÁLOGO PAGINADO EN BLOQUES DE 3 (chunked) ---
Página 1: [Zelda, Mario, Metroid]
Página 2: [Pokemon, Kirby, Donkey Kong]
Página 3: [Fire Emblem, Star Fox, F-Zero]

--- PROMEDIOS MÓVILES DE LATENCIA (windowed) ---
Ventana [45, 52, 60] -> Media: 52.3 ms
Ventana [52, 60, 48] -> Media: 53.3 ms
Ventana [60, 48, 55] -> Media: 54.3 ms
Ventana [48, 55, 70] -> Media: 57.7 ms
Ventana [55, 70, 65] -> Media: 63.3 ms
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val catalogo = listOf(
            "Zelda", "Mario", "Metroid",
            "Pokemon", "Kirby", "Donkey Kong",
            "Fire Emblem", "Star Fox", "F-Zero"
        )

        println("--- CATÁLOGO PAGINADO EN BLOQUES DE 3 (chunked) ---")
        val paginas = catalogo.chunked(3)
        paginas.forEachIndexed { index, pagina ->
            println("Página ${index + 1}: $pagina")
        }

        println("\n--- PROMEDIOS MÓVILES DE LATENCIA (windowed) ---")
        val latencias = listOf(45, 52, 60, 48, 55, 70, 65)
        latencias.windowed(size = 3, step = 1).forEach { ventana ->
            val media = ventana.average()
            println("Ventana $ventana -> Media: ${"%.1f".format(media)} ms")
        }
    }
    ```

---

### Ejercicio 4.14: Emparejado y Separación de Listas con `.zip()` y `.unzip()`
📄 **Archivo:** `E14_ZipUnzip.kt`  
📚 **Teoría de referencia:** [Listas y Operaciones Funcionales](../42-listas.md)

#### 1. Enunciado y Código de Partida

Al sincronizar datos recibidos de dos endpoints independientes (ej. nombres y niveles):

1. Utiliza **`.zip()`** sobre las listas `jugadores` y `niveles` para fusionarlas en una lista de pares `List<Pair<String, Int>>`.
2. Convierte la lista de pares resultante en un mapa asociativo `Map<String, Int>` mediante **`.toMap()`**.
3. Dada una lista de coordenadas `coordenadas`, utiliza **`.unzip()`** para desacoplarlas nuevamente en dos listas separadas independientes (`etiquetas` y `posiciones`).

Copia esta plantilla con los datos de prueba preparados en tu archivo `E14_ZipUnzip.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val jugadores = listOf("Cloud", "Tifa", "Barret", "Aerith")
    val niveles = listOf(50, 48, 45, 47)

    // 1. TODO: Fusiona ambas listas en una lista de pares con .zip()
    val pares: List<Pair<String, Int>> = TODO("Fusionar con jugadores.zip(niveles)")
    println("Pares fusionados con zip: $pares")

    // 2. TODO: Transforma la lista de pares en un mapa con .toMap()
    val mapaJugadores: Map<String, Int> = TODO("Convertir con pares.toMap()")
    println("Mapa generado desde pares: $mapaJugadores")

    // 3. TODO: Desacopla la lista de pares de coordenadas en dos listas con .unzip()
    val coordenadas = listOf("X1" to 100, "X2" to 200, "X3" to 300)
    val (etiquetas, posiciones) = TODO("Desacoplar con coordenadas.unzip()")

    println("Desacoplado con unzip:")
    println("- Etiquetas: $etiquetas")
    println("- Posiciones: $posiciones")
}
```

#### 2. Salida Esperada en Consola

```text
Pares fusionados con zip: [(Cloud, 50), (Tifa, 48), (Barret, 45), (Aerith, 47)]
Mapa generado desde pares: {Cloud=50, Tifa=48, Barret=45, Aerith=47}
Desacoplado con unzip:
- Etiquetas: [X1, X2, X3]
- Posiciones: [100, 200, 300]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val jugadores = listOf("Cloud", "Tifa", "Barret", "Aerith")
        val niveles = listOf(50, 48, 45, 47)

        // zip une ambas listas en una de pares Pair<String, Int>:
        val pares = jugadores.zip(niveles)
        println("Pares fusionados con zip: $pares")

        val mapaJugadores = pares.toMap()
        println("Mapa generado desde pares: $mapaJugadores")

        // unzip separa una lista de pares en dos listas independientes:
        val coordenadas = listOf("X1" to 100, "X2" to 200, "X3" to 300)
        val (etiquetas, posiciones) = coordenadas.unzip()

        println("Desacoplado con unzip:")
        println("- Etiquetas: $etiquetas")
        println("- Posiciones: $posiciones")
    }
    ```

---

### Ejercicio 4.15: Acumuladores Funcionales Puros: `.fold()` frente a `.reduce()`
📄 **Archivo:** `E15_FoldVsReduce.kt`  
📚 **Teoría de referencia:** [Operaciones Funcionales en Listas](../42-listas.md#4-operaciones-funcionales-imprescindibles)

#### 1. Enunciado y Código de Partida

Las operaciones de reducción permiten condensar una colección en un único valor acumulado:

- **`reduce`:** No recibe valor inicial; toma el primer elemento de la lista como semilla.
- **`fold`:** Recibe un valor inicial explícito (semilla) y permite acumular hacia un tipo de dato completamente distinto.

1. Calcula la suma total de `monedas` utilizando **`reduce`**.
2. Calcula la suma total de `monedas` partiendo de un saldo previo de `500` usando **`fold(500)`**.
3. Utiliza **`fold`** sobre la lista `personajes` con semilla `StringBuilder("Resumen: ")` para componer una cadena concatenada, demostrando la acumulación hacia un tipo heterogéneo.

Copia esta plantilla con los datos de prueba preparados en tu archivo `E15_FoldVsReduce.kt` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

fun main() {
    val monedas = listOf(10, 25, 50, 100)

    // 1. TODO: Calcula la suma pura con reduce (sin valor inicial)
    val sumaReduce: Int = TODO("Acumular con monedas.reduce { acc, valor -> ... }")
    println("Suma pura con reduce: $sumaReduce")

    // 2. TODO: Calcula la suma con fold partiendo del saldo inicial de 500
    val totalFold: Int = TODO("Acumular con monedas.fold(500) { acc, valor -> ... }")
    println("Suma con saldo inicial (500) con fold: $totalFold")

    // 3. TODO: Concatena los nombres en un StringBuilder acumulador usando fold
    val personajes = listOf("Mario", "Luigi", "Yoshi")
    val textoCompuesto: String = TODO("Acumular en StringBuilder con fold y convertir con toString().trim()")

    println("Texto acumulado con fold: $textoCompuesto")
}
```

#### 2. Salida Esperada en Consola

```text
Suma pura con reduce: 185
Suma con saldo inicial (500) con fold: 685
Texto acumulado con fold: Resumen: [Mario] [Luigi] [Yoshi]
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b04_colecciones

    fun main() {
        val monedas = listOf(10, 25, 50, 100)

        // 1. reduce: sin valor inicial (toma el primer elemento):
        val sumaReduce = monedas.reduce { acc, valor -> acc + valor }
        println("Suma pura con reduce: $sumaReduce")

        // 2. fold: con valor semilla (500 de saldo previo):
        val totalFold = monedas.fold(500) { acc, valor -> acc + valor }
        println("Suma con saldo inicial (500) con fold: $totalFold")

        // 3. fold acumulando hacia un tipo distinto (StringBuilder):
        val personajes = listOf("Mario", "Luigi", "Yoshi")
        val textoCompuesto = personajes.fold(StringBuilder("Resumen: ")) { acc, p ->
            acc.append("[$p] ")
        }.toString().trim()

        println("Texto acumulado con fold: $textoCompuesto")
    }
    ```

---

### Reto 4.16: Memory Match Engine (*Juego de Parejas de Cartas en Cuadrícula*)
📄 **Archivo:** `Reto04_MemoryMatch.kt`  
📚 **Teoría de referencia:** [Listas y Operaciones Funcionales](../42-listas.md), [Sets y Unicidad](../44-sets.md), [Maps y Asociaciones](../43-maps.md) y [Scope Functions](../31-scope-functions.md).

#### 1. Contexto y Misión

En este reto culminante del Bloque 4 programarás el motor lógico para el clásico juego de memoria **Memory Match** (encontrar parejas volteando cartas en una cuadrícula de 4x4).

Este reto está diseñado siguiendo la filosofía de **Clean Architecture y Jetpack Compose**:

- **Lógica desacoplada de la UI:** No hay variables mutables globales ni dependencias de consola soldadas en la lógica; todo el juego se modela mediante un estado inmutable (`MemoryUiState`) y funciones puras que calculan el siguiente estado.
- **Transición directa a Compose:** Cuando los alumnos implementen la pantalla visual en Android, el componente `LazyVerticalGrid(columns = GridCells.Fixed(4))` consumirá exactamente este mismo estado y llamará a estas mismas funciones sin tener que reprogramar la lógica.
- **Preparado para Testing Unitario:** Al no depender de la consola ni de aleatoriedad incontrolada, las reglas pueden verificarse de forma 100% determinista mediante pruebas unitarias automatizadas.

##### 🎮 La Dinámica del Juego

El juego consta de una baraja de **16 cartas** dispuestas en una cuadrícula de **4 filas × 4 columnas**. La baraja contiene exactamente **8 parejas de símbolos** (iconos como `🤖`, `💎`, `⚡`, `⭐`, `🔥`, `🍀`, `🍎`, `🔔`).

1. **Estado inicial:** Todas las cartas comienzan tapadas (`[ #00: ❓ ]`).
2. **Primer volteo del turno:** El jugador elige una primera carta; esta se destapa visualmente (`[ 👀 🤖 ]`).
3. **Segundo volteo del turno:** El jugador elige una segunda carta:
    - **Si los símbolos coinciden:** ¡Pareja encontrada! Ambas cartas quedan resueltas permanentemente (`[ ✅ 🤖 ]`), se vacía la selección activa y se suma 1 al contador de movimientos. Si se completan las 8 parejas, se alcanza la **Victoria**.
    - **Si los símbolos NO coinciden:** Ambas cartas quedan levantadas temporalmente para mostrar el fallo al jugador, se suma 1 al contador de movimientos y se emite feedback de no coincidencia.
4. **Siguiente turno tras fallo:** Cuando el jugador pulsa la siguiente carta, las dos cartas falladas del turno anterior se vuelven a tapar automáticamente y la nueva carta pulsada se convierte en la primera levantada del nuevo asalto.
5. **Cierre de partida:** Al descubrir las 8 parejas, el motor emite el estado final con analítica de precisión calculada mediante operaciones funcionales.

---

#### 2. Requisitos Funcionales y Estructuras de Colecciones

Para que el motor sea idiomático, robusto y testeable, tu solución debe ceñirse con precisión a los siguientes requisitos funcionales, utilizando **específicamente las estructuras y operaciones de colecciones del Bloque 4 indicadas**:

1. **RF-01 (Modelado Inmutable del Dominio):**  

   - Declara `data class Carta(val id: Int, val simbolo: String)`.
   - Modela el resultado de cada jugada con `enum class EstadoJugada { PRIMERA_CARTA, PAREJA_ACERTADA, PAREJA_FALLADA, VICTORIA }`.
   - Modela el estado global inmutable mediante `data class MemoryUiState(val tablero: List<Carta>, val seleccionadasIds: List<Int>, val emparejadasIds: Set<Int>, val movimientos: Int, val ultimoEstado: EstadoJugada)`.

2. **RF-02 (Generación y Duplicación de Baraja con `+` y `mapIndexed`):** 

   Implementa la función `crearBaraja(simbolosBase: List<String>, barajar: Boolean = true): List<Carta>`

   - Duplica la lista base de 8 símbolos usando el operador de adición funcional **`+`** (o `flatMap`).
   - Si `barajar == true`, aplica **`.shuffled()`** (o baraja con una semilla fija `Random(seed)` para tests deterministas).
   - Transforma la lista plana resultante asignando el índice posicional como ID único (`0..15`) mediante **`.mapIndexed { index, simbolo -> Carta(index, simbolo) }`**.

3. **RF-03 (Indexación en Mapa $O(1)$ con `associateBy`):**  

   Implementa la función `indexarTablero(tablero: List<Carta>): Map<Int, Carta>` utilizando **`tablero.associateBy { it.id }`**. Esta indexación permite acceder a cualquier carta por su ID en tiempo constante $O(1)$ durante las comprobaciones de parejas sin iterar la lista.

4. **RF-04 (Estructuración de Cuadrícula con `chunked(4)`):**  

   Implementa la función `estructurarCuadricula(tablero: List<Carta>, columnas: Int = 4): List<List<Carta>>` utilizando **`tablero.chunked(columnas)`**. Esta función parte la lista plana de 16 cartas en 4 filas de 4 cartas para renderizar el HUD en consola y alimentar en el futuro cuadrículas en Jetpack Compose.

5. **RF-05 (Gestión de Aciertos con `Set<Int>` Inmutable):**  

   El campo `emparejadasIds` debe ser estrictamente un **`Set<Int>` inmutable**. Cuando una pareja coincide, se deriva el nuevo conjunto sumando los dos IDs mediante `estado.emparejadasIds + setOf(id1, id2)`, garantizando ausencia de duplicados y consultas ultra-rápidas (`id in emparejadasIds`).

6. **RF-06 (Cálculo de Cartas Pendientes con Diferencia de Conjuntos `subtract`):**  

   Implementa la función `obtenerCartasPendientes(tablero: List<Carta>, emparejadasIds: Set<Int>): Set<Int>` calculando la diferencia teórica de conjuntos mediante el operador infijo **`subtract`**:  
   `val totalIds = tablero.map { it.id }.toSet()`  
   `val pendientes = totalIds subtract emparejadasIds`.

7. **RF-07 (Motor de Decisión Puro `voltearCarta`):**

   Implementa la función pura `voltearCarta(estado: MemoryUiState, idCarta: Int): MemoryUiState`
   
   - **Cláusulas de guarda:** Si `idCarta` ya está en `emparejadasIds` o ya está en `seleccionadasIds`, devuelve el `estado` intacto.
   - **Si `seleccionadasIds.isEmpty()`:** Retorna `estado.copy(seleccionadasIds = listOf(idCarta), ultimoEstado = PRIMERA_CARTA)`.
   - **Si `seleccionadasIds.size == 1`:** Consulta ambas cartas en el mapa (`associateBy`). Si sus símbolos coinciden, suma 1 a `movimientos`, añade ambos IDs a `emparejadasIds`, vacía `seleccionadasIds` y marca `VICTORIA` o `PAREJA_ACERTADA`. Si no coinciden, suma 1 a `movimientos`, deja ambas en `seleccionadasIds` (para mostrarlas visibles en el HUD) y marca `PAREJA_FALLADA`.
   - **Si `seleccionadasIds.size == 2` (turno previo fallado):** Limpia la pareja fallada anterior e inicia el nuevo turno con `idCarta` como única seleccionada (`listOf(idCarta)`).

8. **RF-08 (Analítica de Cierre con `groupBy`, `count` y Scope Functions):**  

   Al concluir la partida, calcula el porcentaje de aciertos por movimiento y agrupa los símbolos utilizando **`groupBy { it.simbolo }`** y **`count`**. Utiliza **`.also { ... }`** para emitir un log de auditoría final confirmando la victoria.

---

#### 3. Código de Partida (Plantilla para el Alumno)

Copia esta plantilla en tu archivo `Reto04_MemoryMatch.kt` dentro de `src/main/kotlin/b04_colecciones/` y completa los bloques marcados con `TODO(...)`:

```kotlin
package b04_colecciones

// ============================================================================
// 1. MODELO DE DATOS Y ESTADO DE UI (100% INMUTABLE)
// ============================================================================

data class Carta(
    val id: Int,
    val simbolo: String
)

enum class EstadoJugada {
    PRIMERA_CARTA,
    PAREJA_ACERTADA,
    PAREJA_FALLADA,
    VICTORIA
}

data class MemoryUiState(
    val tablero: List<Carta>,
    val seleccionadasIds: List<Int>,
    val emparejadasIds: Set<Int>,
    val movimientos: Int,
    val ultimoEstado: EstadoJugada
) {
    val juegoTerminado: Boolean
        get() = emparejadasIds.size == tablero.size && tablero.isNotEmpty()
}

// ============================================================================
// 2. FUNCIONES PURAS DEL MOTOR DE JUEGO (REQUISITOS FUNCIONALES)
// ============================================================================

/**
 * RF-02: Genera la baraja duplicando los símbolos (+), barajando si aplica,
 * y mapeando con mapIndexed para asignar IDs 0..N.
 */
fun crearBaraja(simbolosBase: List<String>, barajar: Boolean = true): List<Carta> {
    TODO("Implementar RF-02 con operador '+', shuffled() y mapIndexed")
}

/**
 * RF-03: Indexa la lista en un Map<Int, Carta> con associateBy para acceso instantáneo O(1).
 */
fun indexarTablero(tablero: List<Carta>): Map<Int, Carta> {
    TODO("Implementar RF-03 con associateBy { it.id }")
}

/**
 * RF-04: Divide el tablero plano de cartas en filas de N columnas usando chunked.
 */
fun estructurarCuadricula(tablero: List<Carta>, columnas: Int = 4): List<List<Carta>> {
    TODO("Implementar RF-04 con chunked(columnas)")
}

/**
 * RF-06: Calcula las cartas que quedan por resolver mediante diferencia de conjuntos (subtract).
 */
fun obtenerCartasPendientes(tablero: List<Carta>, emparejadasIds: Set<Int>): Set<Int> {
    TODO("Implementar RF-06 con toSet() y subtract")
}

/**
 * RF-07: Motor de jugada puro. Recibe el estado actual y el ID pulsado,
 * y retorna un nuevo MemoryUiState con las reglas de volteo y comprobación.
 */
fun voltearCarta(estado: MemoryUiState, idCarta: Int): MemoryUiState {
    TODO("Implementar RF-07 gestionando 0, 1 y 2 cartas seleccionadas con associateBy y copy()")
}

// ============================================================================
// 3. RENDERIZADO VISUAL PARA CONSOLA (COMPATIBLE CON WINDOWS / LINUX / MAC)
// ============================================================================

fun renderizarTableroConsola(estado: MemoryUiState) {
    val filas = estructurarCuadricula(estado.tablero, 4)
    val pendientes = obtenerCartasPendientes(estado.tablero, estado.emparejadasIds)

    println("\n==================================================")
    println("           🧠 MEMORY MATCH - TURNO #${estado.movimientos + 1}")
    println(" Movimientos: ${estado.movimientos} | Parejas: ${estado.emparejadasIds.size / 2}/8 | Pendientes: ${pendientes.size}")
    println("==================================================")

    for (fila in filas) {
        val filaStr = fila.joinToString("  ") { carta ->
            when {
                carta.id in estado.emparejadasIds -> "[ ✅ ${carta.simbolo} ]"
                carta.id in estado.seleccionadasIds -> "[ 👀 ${carta.simbolo} ]"
                else -> "[ #%02d ❓ ]".format(carta.id)
            }
        }
        println("  $filaStr")
    }

    val feedback = when (estado.ultimoEstado) {
        EstadoJugada.PRIMERA_CARTA -> "Primera carta levantada. ¡Busca su pareja!"
        EstadoJugada.PAREJA_ACERTADA -> "✨ ¡PAREJA ENCONTRADA! Sigue así."
        EstadoJugada.PAREJA_FALLADA -> "❌ No coinciden. Se taparán en el siguiente turno."
        EstadoJugada.VICTORIA -> "🏆 ¡VICTORIA TOTAL! Has completado todas las parejas."
    }
    println("📢 Estado: $feedback")
}

// ============================================================================
// 4. SIMULACIÓN CON JUGADAS PREDEFINIDAS EN MAIN
// ============================================================================

fun main() {
    // 8 símbolos base:
    val simbolos = listOf("🤖", "💎", "⚡", "⭐", "🔥", "🍀", "🍎", "🔔")

    // Baraja determinista para que la salida en Windows/Mac/Linux sea idéntica:
    // Parejas fijas: (0,5=🤖), (1,9=💎), (2,8=⚡), (3,11=⭐), (4,12=🔥), (6,14=🍎), (7,15=🔔), (10,13=🍀)
    val barajaFija = listOf(
        "🤖", "💎", "⚡", "⭐", "🔥", "🤖", "🍎", "🔔",
        "⚡", "💎", "🍀", "⭐", "🔥", "🍀", "🍎", "🔔"
    ).mapIndexed { i, s -> Carta(i, s) }

    var estado = MemoryUiState(
        tablero = barajaFija,
        seleccionadasIds = emptyList(),
        emparejadasIds = emptySet(),
        movimientos = 0,
        ultimoEstado = EstadoJugada.PRIMERA_CARTA
    )

    println("=== SIMULADOR DETERMINISTA: MEMORY MATCH ===")
    println("Iniciando tablero 4x4 con 8 parejas listas para descubrir...")

    // Secuencia de jugadas predefinidas para validar el motor turno a turno:
    // Incluye fallos intencionados (0 con 1, 2 con 3) y aciertos sucesivos hasta la victoria.
    val jugadasPredefinidas = listOf(
        0, 1,   // Intento 1: 0 (🤖) vs 1 (💎) -> FALLO
        0, 5,   // Intento 2: 0 (🤖) vs 5 (🤖) -> ¡PAREJA!
        1, 9,   // Intento 3: 1 (💎) vs 9 (💎) -> ¡PAREJA!
        2, 3,   // Intento 4: 2 (⚡) vs 3 (⭐) -> FALLO
        2, 8,   // Intento 5: 2 (⚡) vs 8 (⚡) -> ¡PAREJA!
        3, 11,  // Intento 6: 3 (⭐) vs 11 (⭐) -> ¡PAREJA!
        4, 12,  // Intento 7: 4 (🔥) vs 12 (🔥) -> ¡PAREJA!
        6, 14,  // Intento 8: 6 (🍎) vs 14 (🍎) -> ¡PAREJA!
        7, 15,  // Intento 9: 7 (🔔) vs 15 (🔔) -> ¡PAREJA!
        10, 13  // Intento 10: 10 (🍀) vs 13 (🍀) -> ¡PAREJA FINAL Y VICTORIA!
    )

    for (jugada in jugadasPredefinidas) {
        estado = voltearCarta(estado, jugada)
        // Renderizamos tras cada jugada completa (cuando hay 2 seleccionadas o tras acertar/ganar)
        if (estado.seleccionadasIds.size == 2 || estado.seleccionadasIds.isEmpty()) {
            renderizarTableroConsola(estado)
        }
    }

    // RF-08: Resumen y auditoría final con groupBy y count:
    val parejasPorSimbolo = estado.tablero.groupBy { it.simbolo }
    val precision = (8.0 / estado.movimientos) * 100.0

    println("\n==================================================")
    println("             📊 INFORME FINAL DE PARTIDA          ")
    println("==================================================")
    println("Total movimientos realizados: ${estado.movimientos}")
    println("Precisión de memoria: ${"%.1f".format(precision)}%")
    println("Total parejas verificadas en tablero: ${parejasPorSimbolo.size} símbolos")
    println("Juego completado: ${estado.juegoTerminado}")
}
```

---

#### 4. Salida Esperada en Consola

Al ejecutar el programa con la secuencia de jugadas predefinidas, la consola mostrará la evolución turno a turno:

```text
=== SIMULADOR DETERMINISTA: MEMORY MATCH ===
Iniciando tablero 4x4 con 8 parejas listas para descubrir...

==================================================
           🧠 MEMORY MATCH - TURNO #2
 Movimientos: 1 | Parejas: 0/8 | Pendientes: 16
==================================================
  [ 👀 🤖 ]  [ 👀 💎 ]  [ #02 ❓ ]  [ #03 ❓ ]
  [ #04 ❓ ]  [ #05 ❓ ]  [ #06 ❓ ]  [ #07 ❓ ]
  [ #08 ❓ ]  [ #09 ❓ ]  [ #10 ❓ ]  [ #11 ❓ ]
  [ #12 ❓ ]  [ #13 ❓ ]  [ #14 ❓ ]  [ #15 ❓ ]
📢 Estado: ❌ No coinciden. Se taparán en el siguiente turno.

==================================================
           🧠 MEMORY MATCH - TURNO #3
 Movimientos: 2 | Parejas: 1/8 | Pendientes: 14
==================================================
  [ ✅ 🤖 ]  [ #01 ❓ ]  [ #02 ❓ ]  [ #03 ❓ ]
  [ #04 ❓ ]  [ ✅ 🤖 ]  [ #06 ❓ ]  [ #07 ❓ ]
  [ #08 ❓ ]  [ #09 ❓ ]  [ #10 ❓ ]  [ #11 ❓ ]
  [ #12 ❓ ]  [ #13 ❓ ]  [ #14 ❓ ]  [ #15 ❓ ]
📢 Estado: ✨ ¡PAREJA ENCONTRADA! Sigue así.

... (turnos intermedios) ...

==================================================
           🧠 MEMORY MATCH - TURNO #11
 Movimientos: 10 | Parejas: 8/8 | Pendientes: 0
==================================================
  [ ✅ 🤖 ]  [ ✅ 💎 ]  [ ✅ ⚡ ]  [ ✅ ⭐ ]
  [ ✅ 🔥 ]  [ ✅ 🤖 ]  [ ✅ 🍎 ]  [ ✅ 🔔 ]
  [ ✅ ⚡ ]  [ ✅ 💎 ]  [ ✅ 🍀 ]  [ ✅ ⭐ ]
  [ ✅ 🔥 ]  [ ✅ 🍀 ]  [ ✅ 🍎 ]  [ ✅ 🔔 ]
📢 Estado: 🏆 ¡VICTORIA TOTAL! Has completado todas las parejas.

==================================================
             📊 INFORME FINAL DE PARTIDA          
==================================================
Total movimientos realizados: 10
Precisión de memoria: 80.0%
Total parejas verificadas en tablero: 8 símbolos
Juego completado: true
```

---

#### 5. Solución Comentada Paso a Paso

??? tip "Ver solución comentada completa"
    ```kotlin
    package b04_colecciones

    data class Carta(
        val id: Int,
        val simbolo: String
    )

    enum class EstadoJugada {
        PRIMERA_CARTA,
        PAREJA_ACERTADA,
        PAREJA_FALLADA,
        VICTORIA
    }

    data class MemoryUiState(
        val tablero: List<Carta>,
        val seleccionadasIds: List<Int>,
        val emparejadasIds: Set<Int>,
        val movimientos: Int,
        val ultimoEstado: EstadoJugada
    ) {
        val juegoTerminado: Boolean
            get() = emparejadasIds.size == tablero.size && tablero.isNotEmpty()
    }

    // RF-02: Duplicación, barajado y mapeo indexado
    fun crearBaraja(simbolosBase: List<String>, barajar: Boolean = true): List<Carta> {
        val barajaDuplicada = simbolosBase + simbolosBase
        val barajaProcesada = if (barajar) barajaDuplicada.shuffled() else barajaDuplicada
        return barajaProcesada.mapIndexed { index, simbolo -> Carta(index, simbolo) }
    }

    // RF-03: Indexación instantánea O(1) con associateBy
    fun indexarTablero(tablero: List<Carta>): Map<Int, Carta> {
        return tablero.associateBy { it.id }
    }

    // RF-04: Cuadrícula en bloques de 4 columnas
    fun estructurarCuadricula(tablero: List<Carta>, columnas: Int = 4): List<List<Carta>> {
        return tablero.chunked(columnas)
    }

    // RF-06: Diferencia de conjuntos para cartas pendientes
    fun obtenerCartasPendientes(tablero: List<Carta>, emparejadasIds: Set<Int>): Set<Int> {
        val todosLosIds = tablero.map { it.id }.toSet()
        return todosLosIds subtract emparejadasIds
    }

    // RF-07: Motor de jugada puro con árbol de decisión exhaustivo
    fun voltearCarta(estado: MemoryUiState, idCarta: Int): MemoryUiState {
        // Cláusula de guarda: si la carta ya está emparejada o ya está seleccionada en el turno, no hacer nada
        if (idCarta in estado.emparejadasIds || idCarta in estado.seleccionadasIds) {
            return estado
        }

        val mapaPorId = indexarTablero(estado.tablero)

        return when (estado.seleccionadasIds.size) {
            0 -> {
                // Caso 1: Primera carta volteada
                estado.copy(
                    seleccionadasIds = listOf(idCarta),
                    ultimoEstado = EstadoJugada.PRIMERA_CARTA
                )
            }
            1 -> {
                // Caso 2: Segunda carta volteada -> Comprobar pareja
                val idPrimera = estado.seleccionadasIds.first()
                val carta1 = mapaPorId[idPrimera]
                val carta2 = mapaPorId[idCarta]

                if (carta1 != null && carta2 != null && carta1.simbolo == carta2.simbolo) {
                    val nuevoEmparejadas = estado.emparejadasIds + setOf(idPrimera, idCarta)
                    val victoria = nuevoEmparejadas.size == estado.tablero.size
                    estado.copy(
                        seleccionadasIds = emptyList(),
                        emparejadasIds = nuevoEmparejadas,
                        movimientos = estado.movimientos + 1,
                        ultimoEstado = if (victoria) EstadoJugada.VICTORIA else EstadoJugada.PAREJA_ACERTADA
                    )
                } else {
                    // Fallo: ambas cartas quedan visibles temporalmente para informar al jugador
                    estado.copy(
                        seleccionadasIds = listOf(idPrimera, idCarta),
                        movimientos = estado.movimientos + 1,
                        ultimoEstado = EstadoJugada.PAREJA_FALLADA
                    )
                }
            }
            else -> {
                // Caso 3: Había 2 cartas falladas previas -> Se limpian e inicia un nuevo turno con la nueva carta
                estado.copy(
                    seleccionadasIds = listOf(idCarta),
                    ultimoEstado = EstadoJugada.PRIMERA_CARTA
                )
            }
        }
    }

    fun renderizarTableroConsola(estado: MemoryUiState) {
        val filas = estructurarCuadricula(estado.tablero, 4)
        val pendientes = obtenerCartasPendientes(estado.tablero, estado.emparejadasIds)

        println("\n==================================================")
        println("           🧠 MEMORY MATCH - TURNO #${estado.movimientos + 1}")
        println(" Movimientos: ${estado.movimientos} | Parejas: ${estado.emparejadasIds.size / 2}/8 | Pendientes: ${pendientes.size}")
        println("==================================================")

        for (fila in filas) {
            val filaStr = fila.joinToString("  ") { carta ->
                when {
                    carta.id in estado.emparejadasIds -> "[ ✅ ${carta.simbolo} ]"
                    carta.id in estado.seleccionadasIds -> "[ 👀 ${carta.simbolo} ]"
                    else -> "[ #%02d ❓ ]".format(carta.id)
                }
            }
            println("  $filaStr")
        }

        val feedback = when (estado.ultimoEstado) {
            EstadoJugada.PRIMERA_CARTA -> "Primera carta levantada. ¡Busca su pareja!"
            EstadoJugada.PAREJA_ACERTADA -> "✨ ¡PAREJA ENCONTRADA! Sigue así."
            EstadoJugada.PAREJA_FALLADA -> "❌ No coinciden. Se taparán en el siguiente turno."
            EstadoJugada.VICTORIA -> "🏆 ¡VICTORIA TOTAL! Has completado todas las parejas."
        }
        println("📢 Estado: $feedback")
    }

    fun main() {
        val barajaFija = listOf(
            "🤖", "💎", "⚡", "⭐", "🔥", "🤖", "🍎", "🔔",
            "⚡", "💎", "🍀", "⭐", "🔥", "🍀", "🍎", "🔔"
        ).mapIndexed { i, s -> Carta(i, s) }

        var estado = MemoryUiState(
            tablero = barajaFija,
            seleccionadasIds = emptyList(),
            emparejadasIds = emptySet(),
            movimientos = 0,
            ultimoEstado = EstadoJugada.PRIMERA_CARTA
        )

        println("=== SIMULADOR DETERMINISTA: MEMORY MATCH ===")
        println("Iniciando tablero 4x4 con 8 parejas listas para descubrir...")

        val jugadasPredefinidas = listOf(
            0, 1,   // Intento 1: 0 (🤖) vs 1 (💎) -> FALLO
            0, 5,   // Intento 2: 0 (🤖) vs 5 (🤖) -> ¡PAREJA!
            1, 9,   // Intento 3: 1 (💎) vs 9 (💎) -> ¡PAREJA!
            2, 3,   // Intento 4: 2 (⚡) vs 3 (⭐) -> FALLO
            2, 8,   // Intento 5: 2 (⚡) vs 8 (⚡) -> ¡PAREJA!
            3, 11,  // Intento 6: 3 (⭐) vs 11 (⭐) -> ¡PAREJA!
            4, 12,  // Intento 7: 4 (🔥) vs 12 (🔥) -> ¡PAREJA!
            6, 14,  // Intento 8: 6 (🍎) vs 14 (🍎) -> ¡PAREJA!
            7, 15,  // Intento 9: 7 (🔔) vs 15 (🔔) -> ¡PAREJA!
            10, 13  // Intento 10: 10 (🍀) vs 13 (🍀) -> ¡PAREJA FINAL Y VICTORIA!
        )

        for (jugada in jugadasPredefinidas) {
            estado = voltearCarta(estado, jugada)
            if (estado.seleccionadasIds.size == 2 || estado.seleccionadasIds.isEmpty()) {
                renderizarTableroConsola(estado)
            }
        }

        val parejasPorSimbolo = estado.tablero.groupBy { it.simbolo }
        val precision = (8.0 / estado.movimientos) * 100.0

        println("\n==================================================")
        println("             📊 INFORME FINAL DE PARTIDA          ")
        println("==================================================")
        println("Total movimientos realizados: ${estado.movimientos}")
        println("Precisión de memoria: ${"%.1f".format(precision)}%")
        println("Total parejas verificadas en tablero: ${parejasPorSimbolo.size} símbolos")
        println("Juego completado: ${estado.juegoTerminado}")
    }
    ```

---

### 🧪 ¿Cómo diseñar y blindar este motor mediante TDD?

!!! tip "Siguiente Nivel de Calidad: TDD y Reglas de Colecciones Funcionales"
    ¿Quieres construir y blindar las reglas de este motor aplicando **Test-Driven Development (TDD)** desde cero antes de ejecutar la partida? En la sección de testing dispones del taller práctico guiado paso a paso:

    - Define el contrato inicial en un subpaquete limpio (`b04_colecciones.tdd`) y arranca en **Rojo**.
    - Testea la baraja duplicada (`+`, `mapIndexed`) y la indexación rápida en mapa con `associateBy`.
    - Verifica la partición en cuadrícula con `chunked(4)` y la diferencia de conjuntos con `subtract`.
    - Blinda el árbol de decisiones de volteo de cartas ante aciertos, fallos y clics repetidos.
    - Pasa a **Verde (100% de éxito)** con Gradle en Windows y Linux/Mac antes de jugar en consola.

    👉 **[Ir al Taller de Testing 4: Memory Match con TDD](../testing/04-test-memory-match.md)**




