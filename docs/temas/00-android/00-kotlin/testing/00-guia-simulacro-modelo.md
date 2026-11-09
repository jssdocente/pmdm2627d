# Guía modelo: examen práctico resuelto (HeroAcademy)

Esta guía recorre un examen práctico de Kotlin ya resuelto, para que sepas **qué tendrás que hacer, en qué orden y cómo comprobar que está bien**. Los simulacros y el examen siguen este mismo formato, con otros datos y otros ejercicios.

---

## 1. Qué vas a hacer

La prueba es un proyecto de consola con dos partes. En cada una programas en un fichero y compruebas el resultado de una forma distinta:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/mapa-examen.svg"
<figcaption>Las dos partes valen lo mismo. La primera se comprueba con tests; la segunda, con lo que imprime la consola.</figcaption>
</figure>

El orden recomendado es este:

1. **Abre el proyecto y lanza los tests.** Comprueba que todo arranca antes de escribir nada.

2. **Haz la Parte 1, método a método**, hasta que los tests pasen en verde.

3. **Haz la Parte 2**, comparando la consola con la salida esperada.

4. **Repasa el código** con la [comprobación final](#7-comprobacion-final).

Las dos partes puntúan por separado, pero conviene empezar por la primera: en este modelo, `main` llama a los métodos del servicio, y si alguno sigue con `TODO` el programa se detiene con un `NotImplementedError`.

---

## 2. Descarga el modelo y pruébalo

Descarga el [proyecto resuelto](../../../../_res/00-ejemplo-modelo-resuelto.zip) y descomprímelo. En el examen trabajarás con **IntelliJ IDEA**, y desde él puedes hacer las dos comprobaciones: lanzar los tests y ejecutar el programa. Gradle por terminal hace lo mismo y es la alternativa si el IDE da problemas.

=== "IntelliJ IDEA"

    1. **Abre el proyecto:** *File → Open* y elige la carpeta `00-ejemplo-modelo-resuelto`. Espera a que IntelliJ termine de cargar Gradle (la barra inferior deja de mostrar progreso).

    2. **Lanza los tests:** abre `src/test/kotlin/service/HeroeServiceTest.kt` y pulsa el **▶** verde del margen, junto a `class HeroeServiceTest`. También puedes pulsar con el botón derecho sobre la carpeta `src/test/kotlin` y elegir *Run 'Tests in…'*. El ▶ de cada `@Test` lanza solo ese test.

    3. **Ejecuta el programa:** abre `src/main/kotlin/app/Main.kt` y pulsa el **▶** junto a `fun main()`. La salida aparece en el panel *Run*.

    Los tests y el programa también se pueden lanzar desde el panel *Gradle* (el icono del elefante, a la derecha): *Tasks → verification → test* y *Tasks → application → run*.

=== "Terminal (macOS / Linux)"

    ```bash
    cd 00-ejemplo-modelo-resuelto
    ./gradlew test
    ./gradlew run
    ```

=== "Terminal (Windows)"

    ```powershell
    cd 00-ejemplo-modelo-resuelto
    .\gradlew.bat test
    .\gradlew.bat run
    ```

Si todo va bien, los tests pasan (en IntelliJ, `Tests passed: 8 of 8 tests`; en la terminal, `BUILD SUCCESSFUL`) y el programa imprime la [salida del apartado 6.4](#64-la-salida-que-debes-obtener).

!!! warning "Este proyecto ya está resuelto"
    En el examen recibirás los métodos con `TODO` y los tests en rojo. Aquí todo está hecho y en verde, así que **no verás el punto de partida** hasta que lo prepares tú, como se explica a continuación.

!!! tip "Practica con él como si fuera un examen"
    Haz una copia del proyecto y deja sin programar los cinco métodos de `HeroeService.kt`, cambiando cada cuerpo por un `TODO`:

    ```kotlin
    fun calcularPoderMedio(heroes: List<Heroe>): Double =
        TODO("Pendiente de implementar")
    ```

    Al lanzar los tests verás los 8 en rojo: `Tests failed: 8 of 8 tests` en IntelliJ y `8 tests completed, 8 failed` en la terminal. Ese es el estado inicial de la Parte 1. Resuélvelo sin mirar esta guía y compara después.

---

## 3. Qué recibes: el proyecto

Solo programas en dos ficheros. El resto te dice qué tienes que conseguir o te da los datos con los que trabajar:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/ficheros-proyecto.svg"
<figcaption>Los ficheros que importan. Los tests no se cambian: son la definición de lo que debe hacer tu código.</figcaption>
</figure>

El proyecto modelo gestiona una academia de héroes. Este es su modelo de datos, en `model/Heroe.kt`:

```kotlin
package model

enum class RolHeroe {
    GUERRERO,
    MAGO,
    EXPLORADOR,
    SANADOR
}

data class Heroe(
    val id: String,
    val nombre: String,
    val rol: RolHeroe,
    val nivel: Int,
    val poder: Int,
    val mentor: String? = null // puede no tener mentor
)

sealed interface AccionResultado {
    data class Exito(val mensaje: String, val heroeActualizado: Heroe) : AccionResultado
    data class Error(val motivo: String) : AccionResultado
}
```

Tanto los tests como `main` usan estos seis héroes. Tenlos a mano, porque todos los ejemplos de esta guía salen de ellos:

| ID | Nombre | Rol | Nivel | Poder | Mentor |
|----|--------|-----|-------|-------|--------|
| H01 | Aria | `MAGO` | 5 | 85 | Gandalf |
| H02 | Thorin | `GUERRERO` | 8 | 120 | `null` |
| H03 | Kael | `MAGO` | 3 | 45 | Gandalf |
| H04 | Lyra | `SANADOR` | 6 | 95 | Elrond |
| H05 | Vex | `MAGO` | 7 | 110 | Saruman |
| H06 | Brom | `GUERRERO` | 4 | 70 | `null` |

---

## 4. La regla de estilo: pipelines, no bucles

Lo que se evalúa no es solo que funcione, sino **cómo** procesas las colecciones. En 1º de DAM recorrías la lista con un bucle y llenabas otra a mano. Aquí encadenas operaciones que describen la transformación:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/imperativo-vs-pipeline.svg"
<figcaption>El mismo método resuelto de las dos formas. Cada color es el mismo paso. Los parámetros <code>rolBuscado</code> y <code>nivelMinimo</code> se abrevian como <code>rol</code> y <code>min</code>.</figcaption>
</figure>

!!! warning "Criterio de corrección: penalización por estilo imperativo"
    El uso innecesario de bucles (`for`, `while`) con acumuladores mutables (`var`, `mutableListOf()` + `.add()`) para procesar colecciones supone una **penalización del 50 % de la nota de ese ejercicio**, aunque el test pase en verde.

---

## 5. Parte 1 (TDD): del rojo al verde

Recibes los tests ya programados. Tu trabajo es cambiar cada `TODO` de `HeroeService.kt` por un pipeline, sin tocar los tests.

### 5.1. El ciclo de trabajo

Trabaja **un método cada vez** y lanza los tests después de cada uno. Así sabes qué ha arreglado cada cambio:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/ciclo-rojo-verde.svg"
<figcaption>Datos reales de este modelo. El número de fallos baja de forma desigual porque no todos los métodos tienen el mismo número de tests.</figcaption>
</figure>

| Método | Tests | Qué exigen los tests |
|--------|:-----:|----------------------|
| `obtenerNombresHeroesDestacados` | 2 | Filtrar, ordenar y pasar a mayúsculas; lista vacía si nadie cumple |
| `calcularPoderMedio` | 2 | La media correcta; `0.0` si la lista está vacía |
| `contarHeroesPorRol` | 1 | Cuántos hay de cada rol; sin entrada para los roles sin héroes |
| `obtenerMentoresUnicos` | 1 | Sin `null`, sin duplicados y por orden alfabético |
| `buscarHeroePorId` | 2 | Encontrar ignorando mayúsculas; `null` si no existe o el id es nulo o está en blanco |

!!! info "Cómo leer el resultado de los tests"
    Hay dos tipos de fallo, y conviene distinguirlos:

    - `NotImplementedError` significa que ese método todavía tiene el `TODO`.

    - `AssertionFailedError` significa que el método devuelve algo, pero no lo que se espera.

    === "IntelliJ IDEA"

        El panel inferior muestra el árbol de tests con ✔ verdes y ✖ rojos, y el recuento arriba (`Tests failed: 2 of 8 tests`). Pulsa un test en rojo para ver su mensaje y la línea donde falla; si es una comparación, el enlace *Click to see difference* muestra lo esperado y lo obtenido uno al lado del otro.

    === "Terminal"

        Cuando todo pasa, Gradle **no muestra ningún recuento**: solo `BUILD SUCCESSFUL`. Cuando algo falla, indica cuántos tests han fallado y cuáles, pero solo te da la línea del test. El detalle está en `build/reports/tests/test/index.html`.

    Por ejemplo, si olvidas ordenar en el pipeline 1, el mensaje es este:

    ```text
    expected: <[VEX, ARIA]> but was: <[ARIA, VEX]>
    ```

### 5.2. Pipeline 1: filtrar, ordenar y transformar

Debe devolver los nombres en mayúsculas de los héroes de un rol con al menos cierto nivel, de mayor a menor poder. Cada operación es un paso del enunciado:

```kotlin
fun obtenerNombresHeroesDestacados(
    heroes: List<Heroe>,
    rolBuscado: RolHeroe,
    nivelMinimo: Int
): List<String> =
    heroes
        .filter { it.rol == rolBuscado && it.nivel >= nivelMinimo }
        .sortedByDescending { it.poder }
        .map { it.nombre.uppercase() }
```

Así recorren los datos esas tres operaciones:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/pipeline-traza.svg"
<figcaption>Cada operación devuelve una lista nueva, que es la entrada de la siguiente. La lista <code>heroes</code> no cambia.</figcaption>
</figure>

Este es el test que lo comprueba. Lee siempre los tests antes de programar: dicen exactamente qué entrada se usa y qué salida se espera.

```kotlin
@Test
fun `obtenerNombresHeroesDestacados filtra por rol, nivel minimo y ordena por poder descendente`() {
    val resultado = service.obtenerNombresHeroesDestacados(
        heroes = heroesMuestra,
        rolBuscado = RolHeroe.MAGO,
        nivelMinimo = 5
    )

    val esperado = listOf("VEX", "ARIA")
    assertEquals(esperado, resultado, "Debe devolver los nombres en mayúsculas ordenados por poder descendente")
}
```

Repasa: [`filter`](../42-listas.md#42-filter-filtrado-por-condicion), [`map`](../42-listas.md#41-map-transformacion-elemento-a-elemento) y [`sortedBy`](../42-listas.md#44-agrupacion-y-ordenacion-groupby-y-sortedby).

### 5.3. Pipeline 2: una media segura con la lista vacía

Debe calcular el poder medio y devolver `0.0` si no hay héroes. El caso límite se resuelve primero; así el resto de la función se ocupa solo del caso normal:

```kotlin
fun calcularPoderMedio(heroes: List<Heroe>): Double {
    if (heroes.isEmpty()) return 0.0
    return heroes.map { it.poder }.average()
}
```

Con los seis héroes, el resultado es `525 / 6 = 87.5`.

### 5.4. Pipeline 3: agrupar y contar

Debe devolver cuántos héroes hay de cada rol. Se hace en dos pasos: `groupBy` reparte la lista en grupos y `mapValues` resume cada grupo.

```kotlin
fun contarHeroesPorRol(heroes: List<Heroe>): Map<RolHeroe, Int> =
    heroes
        .groupBy { it.rol }
        .mapValues { (_, listaDeRol) -> listaDeRol.size }
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/groupby-mapvalues.svg"
<figcaption>El mapa intermedio guarda listas; <code>mapValues</code> mantiene las claves y cambia cada lista por su tamaño.</figcaption>
</figure>

Repasa: [`groupBy` + `mapValues`](../43-maps.md#groupby-mapvalues), con más variantes. Para contar también sirve [`groupingBy` y `eachCount`](../43-maps.md#groupingby-eachcount).

### 5.5. Pipeline 4: quitar los nulos con `mapNotNull`

Debe devolver los mentores sin repetir y por orden alfabético. `mapNotNull` extrae el dato y descarta los `null` en un solo paso, y además el resultado ya es de tipo `List<String>`, no `List<String?>`:

```kotlin
fun obtenerMentoresUnicos(heroes: List<Heroe>): List<String> =
    heroes
        .mapNotNull { it.mentor }
        .distinct()
        .sorted()
```

Paso a paso con los seis héroes:

| Tras | Resultado |
|------|-----------|
| `mapNotNull` | `[Gandalf, Gandalf, Elrond, Saruman]` |
| `distinct` | `[Gandalf, Elrond, Saruman]` |
| `sorted` | `[Elrond, Gandalf, Saruman]` |

### 5.6. Pipeline 5: buscar un elemento que puede no existir

Debe localizar un héroe por su id sin distinguir mayúsculas, y devolver `null` si el id es nulo, está en blanco o no coincide con ninguno. Por eso el tipo de retorno es `Heroe?`:

```kotlin
fun buscarHeroePorId(heroes: List<Heroe>, idBuscado: String?): Heroe? {
    if (idBuscado.isNullOrBlank()) return null
    return heroes.find { it.id.equals(idBuscado.trim(), ignoreCase = true) }
}
```

Repasa: [`find`, `any` y `all`](../42-listas.md#43-busqueda-y-verificacion-find-any-all).

---

## 6. Parte 2 (funcionalidad): `Main.kt`

Aquí no hay tests: se comprueba ejecutando el programa (el ▶ junto a `fun main()` en IntelliJ, o `./gradlew run`) y comparando la consola con la salida esperada. Las funciones son tres, y cada una trabaja una idea distinta.

### 6.1. Una tabla con `joinToString`

Una función que devuelve el texto se puede probar y reutilizar; una que va imprimiendo línea a línea, no. Por eso se construye una sola cadena: `map` convierte cada héroe en una fila y `joinToString` las une.

```kotlin
fun generarInformeHeroes(heroes: List<Heroe>): String {
    val cabecera = "ID    | NOMBRE     | ROL        | NIVEL | PODER | MENTOR\n" +
                   "------------------------------------------------------------------"

    val filas = heroes.map { h ->
        val mentorTexto = h.mentor ?: "(Sin mentor)"
        "%-5s | %-10s | %-10s | %-5d | %-5d | %s".format(
            h.id,
            h.nombre,
            h.rol.name,
            h.nivel,
            h.poder,
            mentorTexto
        )
    }.joinToString("\n")

    return "$cabecera\n$filas"
}
```

!!! tip "Una forma más corta"
    `joinToString` admite la transformación directamente, sin el `map` previo: `heroes.joinToString("\n") { h -> ... }`. El resultado es el mismo.

### 6.2. Cambiar el estado con `copy()`

Las propiedades de `Heroe` son `val`, así que un héroe no se modifica: se crea otro con los cambios. `promocionarHeroe` comprueba primero si el cambio es válido y devuelve el resultado, sin imprimir nada:

```kotlin
fun promocionarHeroe(heroe: Heroe, nuevoNivel: Int, incrementoPoder: Int): AccionResultado {
    if (nuevoNivel <= heroe.nivel) {
        return AccionResultado.Error(
            "El nuevo nivel ($nuevoNivel) debe ser estrictamente superior al actual (${heroe.nivel})"
        )
    }

    val heroePromocionado = heroe.copy(
        nivel = nuevoNivel,
        poder = heroe.poder + incrementoPoder
    )

    return AccionResultado.Exito(
        mensaje = "¡${heroe.nombre} asciende con éxito al nivel $nuevoNivel!",
        heroeActualizado = heroePromocionado
    )
}
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/copy-inmutable.svg"
<figcaption>Promoción de Aria con <code>nuevoNivel = 6</code> e <code>incrementoPoder = 20</code>. Es el mismo patrón con el que cambiarás el estado de una pantalla en Compose.</figcaption>
</figure>

Repasa: [`copy()` y la inmutabilidad](../23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad).

### 6.3. Decidir con un `when` exhaustivo

`AccionResultado` es un `sealed interface`: el compilador conoce todos sus casos. Por eso `when` puede cubrirlos sin `else`, y dentro de cada rama ya puedes usar las propiedades de ese caso:

```kotlin
fun mostrarResultado(resultado: AccionResultado) {
    when (resultado) {
        is AccionResultado.Exito -> {
            println("✅ ÉXITO: ${resultado.mensaje}")
            println("   -> Poder final: ${resultado.heroeActualizado.poder} pts")
        }
        is AccionResultado.Error -> {
            println("❌ RECHAZADO: ${resultado.motivo}")
        }
    }
}
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/testing/images/when-sealed.svg"
<figcaption>Una función decide y otra muestra. Los dos casos que ejecuta <code>main</code>, con lo que imprime cada uno.</figcaption>
</figure>

Repasa: [`sealed interface`](../26-sealed-classes.md).

### 6.4. La salida que debes obtener

Al ejecutar el programa, el panel *Run* de IntelliJ (o la terminal, con `./gradlew run`) debe mostrar esto:

```text
==========================================================
          🏛️  HERO ACADEMY DASHBOARD (KOTLIN)
==========================================================

--- 1. TABLÓN OFICIAL DE ALUMNOS (PIPELINE FORMAT) ---
ID    | NOMBRE     | ROL        | NIVEL | PODER | MENTOR
------------------------------------------------------------------
H01   | Aria       | MAGO       | 5     | 85    | Gandalf
H02   | Thorin     | GUERRERO   | 8     | 120   | (Sin mentor)
H03   | Kael       | MAGO       | 3     | 45    | Gandalf
H04   | Lyra       | SANADOR    | 6     | 95    | Elrond
H05   | Vex        | MAGO       | 7     | 110   | Saruman
H06   | Brom       | GUERRERO   | 4     | 70    | (Sin mentor)

--- 2. ANÁLISIS RÁPIDO DE LA ACADEMIA ---
-> Poder medio del escuadrón: 87,50 pts
-> Mentores activos: Elrond, Gandalf, Saruman
-> Distribución por roles: {MAGO=3, GUERRERO=2, SANADOR=1}
-> Magos de élite (niv >= 5): [VEX, ARIA]

--- 3. SIMULACIÓN DE PROMOCIÓN DE RANGO (IMMUTABLE STATE) ---
✅ ÉXITO: ¡Aria asciende con éxito al nivel 6!
   -> Poder final: 105 pts
❌ RECHAZADO: El nuevo nivel (4) debe ser estrictamente superior al actual (5)
```

!!! note "`87,50` o `87.50`"
    `%.2f` usa el idioma del sistema: con el ordenador en español sale `87,50` y en inglés, `87.50`. No es un error de tu código.

---

## 7. Comprobación final

Antes de entregar, repasa esta lista:

- [ ] Pasan todos los tests: `Tests passed: 8 of 8 tests` en IntelliJ, o `BUILD SUCCESSFUL` con `./gradlew test`.

- [ ] No has cambiado ningún test para que pase.

- [ ] No queda ningún `TODO` en `HeroeService.kt` ni en `Main.kt`.

- [ ] El programa termina sin errores y su salida coincide con la esperada.

- [ ] No procesas ninguna colección con un bucle y una lista auxiliar.

- [ ] Los cambios de estado usan `copy()`, y el `when` sobre el `sealed interface` no tiene `else`.

!!! tip "Sigue practicando"
    La [práctica de código y TDD](../../../evaluacion/practica-codigo.md) trabaja con este mismo esquema en el navegador: un esqueleto con `TODO`, sus tests y un botón para ejecutarlos.
