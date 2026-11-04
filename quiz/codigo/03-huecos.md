---
tipo: huecos
titulo: Completa los huecos
apuntes: temas/00-android/00-kotlin
---

## kc-hue-01 Los aprobados, de mejor a peor {tema=ordenar dificultad=1 ancla=42-listas.md}

Completa el *pipeline* para que devuelva los **nombres** de los alumnos aprobados (nota ≥ 5), **de mayor a menor nota**.

### Código

```kotlin
data class Alumno(val nombre: String, val nota: Double)

fun nombresAprobados(alumnos: List<Alumno>): List<String> =
    alumnos
        .[[filter]] { it.nota >= 5.0 }
        .[[sortedByDescending]] { it.nota }
        .[[map]] { it.nombre }
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class AprobadosTest {
    @Test
    fun aprobadosDeMayorAMenorNota() {
        val alumnos = listOf(Alumno("Ana", 6.5), Alumno("Luis", 4.0), Alumno("Sara", 9.0))
        assertEquals(listOf("Sara", "Ana"), nombresAprobados(alumnos))
    }
}
```

### Explicación

- `filter` conserva los elementos que cumplen la condición.
- `sortedByDescending` ordena de mayor a menor según el campo indicado (`sortedBy` lo haría al revés).
- `map` transforma cada `Alumno` en su `nombre`. Va al final: si fuera antes, ya no tendrías la nota para filtrar ni ordenar.

## kc-hue-02 Gasto por categoría {tema=agrupar dificultad=2 ancla=43-maps.md}

Completa la función para que devuelva cuánto se ha gastado en **cada categoría**.

### Código

```kotlin
enum class Categoria { COMIDA, TRANSPORTE, OCIO }

data class Gasto(val concepto: String, val categoria: Categoria, val importe: Double)

fun gastoPorCategoria(gastos: List<Gasto>): Map<Categoria, Double> =
    gastos
        .[[groupBy]] { it.categoria }
        .[[mapValues]] { (_, lista) -> lista.[[sumOf]] { it.importe } }
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class GastosTest {
    @Test
    fun sumaElImporteDeCadaCategoria() {
        val gastos = listOf(
            Gasto("menú", Categoria.COMIDA, 12.0),
            Gasto("bus", Categoria.TRANSPORTE, 1.5),
            Gasto("cine", Categoria.OCIO, 8.0),
            Gasto("cena", Categoria.COMIDA, 20.0),
        )
        val esperado = mapOf(Categoria.COMIDA to 32.0, Categoria.TRANSPORTE to 1.5, Categoria.OCIO to 8.0)
        assertEquals(esperado, gastoPorCategoria(gastos))
    }
}
```

### Explicación

Es el patrón **agrupar y agregar**, uno de los más frecuentes:

- `groupBy { it.categoria }` crea un `Map<Categoria, List<Gasto>>`.
- `mapValues` cambia cada lista por un valor calculado y mantiene la clave. La desestructuración `(_, lista)` ignora la clave y nombra la lista.
- `sumOf { it.importe }` suma un campo de cada elemento.

## kc-hue-03 Búsqueda segura {tema=nulos dificultad=2 ancla=14-null-safety.md}

Completa `buscarSocio`. Si el nombre es `null` o está en blanco devuelve `null`. Si no, devuelve el primer socio con ese nombre **sin distinguir mayúsculas**, o `null` si no hay ninguno.

### Código

```kotlin
data class Socio(val numero: Int, val nombre: String)

fun buscarSocio(socios: List<Socio>, nombre: String?): Socio? {
    if (nombre.[[isNullOrBlank]]()) return [[null]]
    return socios.[[find|firstOrNull]] { it.nombre.equals(nombre, ignoreCase = [[true]]) }
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.Test

class BuscarSocioTest {
    private val socios = listOf(Socio(1, "Irene"), Socio(2, "Omar"))

    @Test
    fun encuentraSinDistinguirMayusculas() {
        assertEquals(2, buscarSocio(socios, "OMAR")?.numero)
    }

    @Test
    fun nombreNuloEnBlancoOInexistenteDevuelveNull() {
        assertNull(buscarSocio(socios, null))
        assertNull(buscarSocio(socios, " "))
        assertNull(buscarSocio(socios, "Pablo"))
    }
}
```

### Explicación

- `isNullOrBlank()` se puede llamar sobre un `String?`: comprueba nulo, vacío y solo espacios a la vez. Después de la guarda, `nombre` ya es `String` (*smart cast*).
- `find` y `firstOrNull` son equivalentes: devuelven el primer elemento que cumple la condición o `null`. No valdría `first`, que lanza una excepción si no encuentra nada.
- `equals(otro, ignoreCase = true)` compara sin distinguir mayúsculas.

## kc-hue-04 Resultado de una devolución {tema=inmutable dificultad=2 ancla=26-sealed-classes.md}

Una biblioteca registra las devoluciones con un tipo sellado. Completa los huecos de `devolver` y `texto`.

### Código

```kotlin
data class Prestamo(val libro: String, val diaInicio: Int, val devuelto: Boolean)

sealed interface Resultado {
    data class Ok(val prestamo: Prestamo) : Resultado
    data class Error(val motivo: String) : Resultado
}

fun devolver(prestamo: Prestamo, dia: Int): Resultado = when {
    prestamo.devuelto -> Resultado.[[Error]]("ya devuelto")
    dia < prestamo.diaInicio -> Resultado.Error("fecha no válida")
    else -> Resultado.Ok(prestamo.[[copy]](devuelto = true))
}

fun texto(r: Resultado): String = when (r) {
    is Resultado.Ok -> "Devuelto: ${r.prestamo.libro}"
    [[is]] Resultado.Error -> "Error: ${r.[[motivo]]}"
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class DevolucionTest {
    private val prestamo = Prestamo("Niebla", diaInicio = 10, devuelto = false)

    @Test
    fun devolverMarcaUnaCopiaComoDevuelta() {
        assertEquals(Resultado.Ok(prestamo.copy(devuelto = true)), devolver(prestamo, 15))
        assertEquals(false, prestamo.devuelto)
    }

    @Test
    fun textoDeCadaResultado() {
        assertEquals("Devuelto: Niebla", texto(devolver(prestamo, 15)))
        assertEquals("Error: fecha no válida", texto(devolver(prestamo, 3)))
        assertEquals("Error: ya devuelto", texto(devolver(prestamo.copy(devuelto = true), 15)))
    }
}
```

### Explicación

- Los casos de error se construyen con `Resultado.Error(…)` y el éxito con `Resultado.Ok(…)`.
- `copy(devuelto = true)` devuelve un préstamo **nuevo**: el original sigue sin devolver, como comprueba el test.
- En `when (r)`, cada rama `is Tipo ->` hace *smart cast*: dentro de la rama `Error` puedes leer `r.motivo` sin conversiones. Como `Resultado` es `sealed`, con las dos ramas basta y no hace falta `else`.

## kc-hue-05 Escribe tú los asserts {tema=tests,validar dificultad=2 ancla=testing/index.md}

Esta vez los huecos están en los **tests**. Complétalos para comprobar que `aplicarDescuento` rebaja bien el precio y que rechaza un porcentaje fuera de rango.

### Código

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test
import kotlin.test.assertFailsWith

data class Producto(val nombre: String, val precio: Double)

fun aplicarDescuento(producto: Producto, porcentaje: Int): Producto {
    require(porcentaje in 1..90) { "porcentaje fuera de rango" }
    return producto.copy(precio = producto.precio * (100 - porcentaje) / 100)
}

class DescuentoTest {
    private val taza = Producto("Taza", 10.0)

    @Test
    fun descuentoDelVeintePorCiento() {
        [[assertEquals]](8.0, aplicarDescuento(taza, 20).[[precio]], 0.001)
    }

    @Test
    fun porcentajeFueraDeRangoLanzaExcepcion() {
        assertFailsWith<[[IllegalArgumentException]]> { aplicarDescuento(taza, 95) }
    }
}
```

### Explicación

- `assertEquals(esperado, real, delta)`: primero el valor **esperado** y después el **real**. Con `Double` se añade un margen de tolerancia, porque los decimales no siempre son exactos.
- Se compara el campo `precio` del producto devuelto.
- `require` lanza `IllegalArgumentException`. `assertFailsWith<Tipo> { … }` hace que el test pase solo si el bloque lanza esa excepción.

## kc-hue-06 Hechas y pendientes {tema=ordenar dificultad=1 ancla=42-listas.md}

Completa `resumen`: divide las tareas en hechas y pendientes de una sola pasada y devuelve cuántas hay de cada tipo.

### Código

```kotlin
data class Tarea(val titulo: String, val hecha: Boolean)

fun resumen(tareas: List<Tarea>): Pair<Int, Int> {
    val (hechas, pendientes) = tareas.[[partition]] { it.hecha }
    return hechas.[[size]] [[to]] pendientes.size
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class ResumenTest {
    @Test
    fun cuentaHechasYPendientes() {
        val tareas = listOf(Tarea("a", true), Tarea("b", false), Tarea("c", false))
        assertEquals(1 to 2, resumen(tareas))
    }
}
```

### Explicación

- `partition` devuelve un `Pair` con dos listas: la de los que cumplen la condición y la del resto. `val (a, b) = …` lo desestructura.
- `size` es el número de elementos de una lista.
- `a to b` construye un `Pair`.

## kc-hue-07 Teléfonos de la agenda {tema=nulos dificultad=1 ancla=14-null-safety.md}

Completa la función: devuelve los teléfonos de los contactos que lo tienen, **sin nulos**.

### Código

```kotlin
data class Contacto(val nombre: String, val telefono: String?)

fun telefonos(contactos: List<Contacto>): List<String> =
    contactos.[[mapNotNull]] { it.telefono }
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class AgendaTest {
    @Test
    fun descartaLosContactosSinTelefono() {
        val agenda = listOf(Contacto("Ana", "600111222"), Contacto("Leo", null), Contacto("Eva", "611333444"))
        assertEquals(listOf("600111222", "611333444"), telefonos(agenda))
    }
}
```

### Explicación

`mapNotNull` transforma cada elemento y **descarta** los resultados nulos. Por eso el tipo pasa de `String?` a `String`: equivale a `map { it.telefono }.filterNotNull()`.

## kc-hue-08 Lista de invitados {tema=ordenar dificultad=1 ancla=42-listas.md}

Completa `invitados`: los nombres de los confirmados, en orden alfabético, separados por coma y espacio (por ejemplo, `Ana, Leo`).

### Código

```kotlin
data class Invitado(val nombre: String, val confirmado: Boolean)

fun invitados(lista: List<Invitado>): String =
    lista
        .filter { it.[[confirmado]] }
        .sortedBy { it.nombre }
        .[[joinToString]](separator = [[", "]]) { it.nombre }
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class InvitadosTest {
    @Test
    fun confirmadosOrdenadosYSeparadosPorComas() {
        val lista = listOf(Invitado("Leo", true), Invitado("Iris", false), Invitado("Ana", true))
        assertEquals("Ana, Leo", invitados(lista))
    }
}
```

### Explicación

- Como `confirmado` es un `Boolean`, la condición del filtro puede ser el propio campo.
- `joinToString` une los elementos en un único texto. Su lambda final indica qué texto aporta cada elemento, y `separator` lo que va entre ellos (por defecto `", "`).

## kc-hue-09 Comprobaciones rápidas del stock {tema=ordenar dificultad=1 ancla=42-listas.md}

Completa las tres funciones con la operación de colecciones adecuada: ¿hay **alguno** agotado?, ¿tienen **todos** precio?, ¿no hay **ninguno** de más de 100 €?

### Código

```kotlin
data class Producto(val nombre: String, val precio: Double, val stock: Int)

fun hayAgotados(productos: List<Producto>): Boolean = productos.[[any]] { it.stock == 0 }

fun todosConPrecio(productos: List<Producto>): Boolean = productos.[[all]] { it.precio > 0.0 }

fun ningunoCaro(productos: List<Producto>): Boolean = productos.[[none]] { it.precio > 100.0 }
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class StockTest {
    private val productos = listOf(Producto("Lápiz", 0.8, 0), Producto("Cuaderno", 2.5, 40))

    @Test
    fun comprobaciones() {
        assertEquals(true, hayAgotados(productos))
        assertEquals(true, todosConPrecio(productos))
        assertEquals(true, ningunoCaro(productos))
        assertEquals(false, ningunoCaro(productos + Producto("Mochila", 120.0, 3)))
    }
}
```

### Explicación

- `any`: `true` si al menos uno cumple la condición.
- `all`: `true` si la cumplen todos.
- `none`: `true` si no la cumple ninguno.

Las tres se detienen en cuanto conocen la respuesta, sin recorrer el resto de la lista.

## kc-hue-10 Iniciales de un nombre opcional {tema=nulos dificultad=2 ancla=14-null-safety.md}

Completa `iniciales`: si el nombre no es nulo, devuelve sus iniciales en mayúscula (de `"ada lovelace"`, `"AL"`); si es nulo, `"?"`.

### Código

```kotlin
fun iniciales(nombre: String?): String =
    nombre?.[[let]] { n -> n.split(" ").joinToString("") { it.first().uppercase() } } [[?:]] "?"
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class InicialesTest {
    @Test
    fun inicialesEnMayuscula() {
        assertEquals("AL", iniciales("ada lovelace"))
    }

    @Test
    fun nombreNuloDevuelveInterrogacion() {
        assertEquals("?", iniciales(null))
    }
}
```

### Explicación

- `nombre?.let { … }` ejecuta el bloque solo si `nombre` no es nulo; dentro, `n` es un `String` normal. Si es nulo, toda la expresión vale `null`.
- El operador Elvis `?:` da el valor por defecto cuando lo de la izquierda es `null`.

## kc-hue-11 Comprobar el mensaje de la excepción {tema=tests,validar dificultad=2 ancla=testing/index.md}

Completa el test: además de comprobar que se lanza la excepción, debe comprobar su **mensaje**.

### Código

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

fun reservarPlazas(libres: Int, pedidas: Int): Int {
    require(pedidas > 0) { "cantidad no válida" }
    require(pedidas <= libres) { "no quedan plazas" }
    return libres - pedidas
}

class PlazasTest {
    @Test
    fun pedirMasPlazasDeLasLibresDaUnMensajeClaro() {
        val error = [[assertFailsWith]]<IllegalArgumentException> { reservarPlazas(2, 5) }
        assertEquals("no quedan plazas", error.[[message]])
    }
}
```

### Explicación

`assertFailsWith<Tipo> { … }` no solo comprueba que el bloque lanza esa excepción: además la **devuelve**, así que puedes guardarla y comprobar su `message`. Es útil cuando una función tiene varias validaciones y quieres saber cuál ha saltado.

## kc-hue-12 Formas de pago {tema=inmutable dificultad=2 ancla=26-sealed-classes.md}

Completa la jerarquía de formas de pago y la función que calcula la comisión de cada una.

### Código

```kotlin
[[sealed]] interface Pago {
    data class Tarjeta(val importe: Double) : Pago
    data class Bizum(val importe: Double, val telefono: String) : Pago
    [[data]] object Efectivo : Pago
}

fun comision(pago: Pago): Double = [[when]] (pago) {
    is Pago.Tarjeta -> pago.importe * 0.01
    is Pago.Bizum -> 0.0
    Pago.Efectivo -> 0.0
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class PagoTest {
    @Test
    fun comisionSegunLaFormaDePago() {
        assertEquals(1.5, comision(Pago.Tarjeta(150.0)))
        assertEquals(0.0, comision(Pago.Bizum(20.0, "600000000")))
        assertEquals(0.0, comision(Pago.Efectivo))
    }
}
```

### Explicación

- `sealed` cierra la jerarquía: el compilador conoce todos los subtipos y el `when` no necesita `else`.
- Un caso sin datos se declara como `data object`: hay una sola instancia y se compara directamente (`Pago.Efectivo ->`), sin `is`.
- `when (pago)` usado como expresión devuelve el valor de la rama que coincide.

## kc-hue-13 Buscar por código {tema=agrupar,nulos dificultad=2 ancla=43-maps.md}

Completa `stockDe`: crea un mapa de artículos indexado por su código y devuelve el stock de un código, o `0` si no existe.

### Código

```kotlin
data class Articulo(val codigo: String, val stock: Int)

fun stockDe(articulos: List<Articulo>, codigo: String): Int {
    val porCodigo = articulos.[[associateBy]] { it.codigo }
    return porCodigo[codigo]?.[[stock]] ?: [[0]]
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class StockDeTest {
    private val articulos = listOf(Articulo("A1", 40), Articulo("B7", 3))

    @Test
    fun stockDelCodigoOCeroSiNoExiste() {
        assertEquals(3, stockDe(articulos, "B7"))
        assertEquals(0, stockDe(articulos, "Z9"))
    }
}
```

### Explicación

- `associateBy { clave }` crea un `Map<Clave, Elemento>`: cada artículo queda accesible por su código. A diferencia de `groupBy`, guarda **un** elemento por clave, no una lista.
- Leer un mapa con `mapa[clave]` devuelve `null` si la clave no existe; por eso se sigue con `?.stock` y un valor por defecto con `?:`.
