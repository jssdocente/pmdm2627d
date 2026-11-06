---
tipo: error
titulo: Encuentra el error
apuntes: temas/00-android/00-kotlin
---

## kc-err-01 Los tres más caros {tema=ordenar dificultad=1 ancla=42-listas.md}

`tresMasCaros` debe devolver los nombres de los tres productos **más caros** que tengan existencias. Al ejecutar los tests, uno falla con este mensaje:

```text
Fail: losTresMasCarosConStock: expected:<[Portátil, Monitor, Teclado]> but was:<[Alfombrilla, Ratón, Teclado]>
```

### Código

```kotlin
data class Producto(val nombre: String, val precio: Double, val stock: Int)

fun tresMasCaros(productos: List<Producto>): List<String> =
    productos
        .filter { it.stock > 0 }
        .sortedBy { it.precio } //! corrige: .sortedByDescending { it.precio }
        .take(3)
        .map { it.nombre }
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class TresMasCarosTest {
    private val productos = listOf(
        Producto("Portátil", 899.0, 2),
        Producto("Monitor", 199.0, 5),
        Producto("Auriculares", 59.0, 0),
        Producto("Teclado", 49.0, 10),
        Producto("Ratón", 19.0, 7),
        Producto("Alfombrilla", 9.0, 20),
    )

    @Test
    fun losTresMasCarosConStock() {
        assertEquals(listOf("Portátil", "Monitor", "Teclado"), tresMasCaros(productos))
    }
}
```

### Explicación

`sortedBy` ordena de **menor a mayor**, así que `take(3)` se queda con los tres más **baratos**. El mensaje lo delata: `but was` muestra justo los productos de menor precio.

Para quedarte con los mayores, ordena con `sortedByDescending { it.precio }` antes de `take(3)`.

## kc-err-02 Media de un grupo vacío {tema=agrupar dificultad=2 ancla=42-listas.md}

`notaMedia` calcula la nota media de los alumnos de un grupo. Si el grupo no tiene alumnos debe devolver `0.0`, pero este test falla:

```text
Fail: grupoSinAlumnosDevuelveCero: expected:<0.0> but was:<NaN>
```

### Código

```kotlin
data class Alumno(val nombre: String, val grupo: String, val nota: Double)

fun notaMedia(alumnos: List<Alumno>, grupo: String): Double {
    val notas = alumnos.filter { it.grupo == grupo }.map { it.nota }
    return notas.average() //! corrige: return if (notas.isEmpty()) 0.0 else notas.average()
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class NotaMediaTest {
    private val alumnos = listOf(
        Alumno("Lucía", "A", 8.0),
        Alumno("Marco", "A", 6.0),
        Alumno("Inés", "B", 9.5),
    )

    @Test
    fun mediaDelGrupo() {
        assertEquals(7.0, notaMedia(alumnos, "A"))
    }

    @Test
    fun grupoSinAlumnosDevuelveCero() {
        assertEquals(0.0, notaMedia(alumnos, "C"))
    }
}
```

### Explicación

`average()` sobre una lista **vacía** no lanza una excepción: devuelve `NaN` (*Not a Number*), porque divide 0 entre 0 elementos. Por eso el test recibe `NaN` en lugar de `0.0`.

El caso vacío hay que tratarlo aparte: `if (notas.isEmpty()) 0.0 else notas.average()`. Que un enunciado diga «si no hay…, devuelve 0» es la señal de que hay un test para ese caso límite.

## kc-err-03 Buscar un socio que no existe {tema=nulos dificultad=1 ancla=42-listas.md}

`buscarPorCodigo` debe devolver el socio con ese código, o `null` si no existe. Este test falla con un error (no con un `Fail`):

```text
Error: codigoInexistenteDevuelveNull: Collection contains no element matching the predicate.
```

### Código

```kotlin
data class Socio(val codigo: String, val nombre: String)

fun buscarPorCodigo(socios: List<Socio>, codigo: String?): Socio? {
    if (codigo.isNullOrBlank()) return null
    return socios.first { it.codigo == codigo } //! corrige: return socios.find { it.codigo == codigo }
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.Test

class BuscarSocioTest {
    private val socios = listOf(Socio("S-01", "Aitana"), Socio("S-02", "Bruno"))

    @Test
    fun encuentraElSocio() {
        assertEquals("Bruno", buscarPorCodigo(socios, "S-02")?.nombre)
    }

    @Test
    fun codigoNuloDevuelveNull() {
        assertNull(buscarPorCodigo(socios, null))
    }

    @Test
    fun codigoInexistenteDevuelveNull() {
        assertNull(buscarPorCodigo(socios, "S-99"))
    }
}
```

### Explicación

`first { … }` **lanza** `NoSuchElementException` si ningún elemento cumple la condición. Un `Error` en el resultado de los tests (en vez de `Fail`) indica justo eso: el código lanzó una excepción antes de llegar al `assert`.

La función devuelve `Socio?`, así que hay que usar la versión que devuelve `null`: `find { … }` (o su equivalente `firstOrNull { … }`).

## kc-err-04 El descuento que no se aplica {tema=inmutable dificultad=2 ancla=23-data-classes.md}

`aplicarDescuento` debe devolver el producto con el precio rebajado. El test falla:

```text
Fail: rebajaUnVeintePorCiento: expected:<80.0> but was:<100.0>
```

### Código

```kotlin
data class Producto(val nombre: String, val precio: Double, val stock: Int)

fun aplicarDescuento(producto: Producto, porcentaje: Int): Producto {
    require(porcentaje in 1..90) { "porcentaje fuera de rango" }
    val rebajado = producto.copy(precio = producto.precio * (100 - porcentaje) / 100)
    return producto //! corrige: return rebajado
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test
import kotlin.test.assertFailsWith

class DescuentoTest {
    @Test
    fun rebajaUnVeintePorCiento() {
        val silla = Producto("Silla", 100.0, 3)
        assertEquals(80.0, aplicarDescuento(silla, 20).precio)
    }

    @Test
    fun porcentajeFueraDeRangoLanzaExcepcion() {
        assertFailsWith<IllegalArgumentException> { aplicarDescuento(Producto("Silla", 100.0, 3), 95) }
    }
}
```

### Explicación

`copy()` no modifica el objeto original: crea uno **nuevo** y lo devuelve. Aquí la copia rebajada se guarda en `rebajado`, pero la función devuelve `producto`, que sigue con el precio de siempre (`100.0`).

Es un error típico cuando se viene de la programación con objetos mutables. Devuelve la copia: `return rebajado`, o directamente `return producto.copy(…)`. El IDE avisa de este tipo de fallos con «variable never used».

## kc-err-05 Una validación al revés {tema=validar dificultad=2 ancla=21-poo.md}

`ultimos` devuelve los `n` eventos más recientes y debe rechazar un `n` que no sea positivo. Pero ahora falla incluso con un valor correcto:

```text
Error: devuelveLosNMasRecientes: n debe ser positivo
```

### Código

```kotlin
data class Evento(val nombre: String, val hora: Int)

fun ultimos(eventos: List<Evento>, n: Int): List<String> {
    require(n < 0) { "n debe ser positivo" } //! corrige: require(n > 0) { "n debe ser positivo" }
    return eventos
        .sortedByDescending { it.hora }
        .take(n)
        .map { it.nombre }
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test
import kotlin.test.assertFailsWith

class UltimosEventosTest {
    private val eventos = listOf(Evento("inicio", 8), Evento("pausa", 11), Evento("cierre", 14))

    @Test
    fun devuelveLosNMasRecientes() {
        assertEquals(listOf("cierre", "pausa"), ultimos(eventos, 2))
    }

    @Test
    fun nCeroLanzaExcepcion() {
        assertFailsWith<IllegalArgumentException> { ultimos(eventos, 0) }
    }
}
```

### Explicación

`require(condición)` expresa lo que **debe cumplirse**, no el caso de error: lanza `IllegalArgumentException` cuando la condición es **falsa**. Con `require(n < 0)`, cualquier `n` positivo hace que salte la excepción con su mensaje, que es lo que muestra el `Error`.

Se lee como «exijo que `n` sea mayor que 0»: `require(n > 0) { "n debe ser positivo" }`. El segundo test seguía pasando por casualidad: con `n = 0` la condición `0 < 0` también es falsa.

## kc-err-06 Búsqueda que distingue mayúsculas {tema=ordenar dificultad=1 ancla=42-listas.md}

`buscarPorTitulo` debe encontrar las películas cuyo título contiene el texto, **escriba como escriba** el usuario las mayúsculas. El test falla:

```text
Fail: noDistingueMayusculas: expected:<[El viaje de Chihiro]> but was:<[]>
```

### Código

```kotlin
data class Pelicula(val titulo: String, val anio: Int)

fun buscarPorTitulo(peliculas: List<Pelicula>, texto: String): List<String> =
    peliculas
        .filter { it.titulo.contains(texto) } //! corrige: .filter { it.titulo.contains(texto, ignoreCase = true) }
        .map { it.titulo }
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class BuscarPeliculaTest {
    private val peliculas = listOf(Pelicula("El viaje de Chihiro", 2001), Pelicula("Coco", 2017))

    @Test
    fun encuentraConLasMismasMayusculas() {
        assertEquals(listOf("Coco"), buscarPorTitulo(peliculas, "Coco"))
    }

    @Test
    fun noDistingueMayusculas() {
        assertEquals(listOf("El viaje de Chihiro"), buscarPorTitulo(peliculas, "VIAJE"))
    }
}
```

### Explicación

`contains` distingue mayúsculas y minúsculas por defecto: `"El viaje…".contains("VIAJE")` es `false`, así que el filtro no deja pasar nada y el resultado es una lista vacía (`[]`).

Se arregla con el parámetro con nombre `ignoreCase = true`. Lo mismo ocurre con `equals`, `startsWith` o `endsWith`.

## kc-err-07 Contar en vez de sumar {tema=agrupar dificultad=2 ancla=43-maps.md#groupby-mapvalues}

`minutosPorApp` debe sumar los minutos de uso de cada aplicación del móvil. Este test falla:

```text
Fail: sumaLosMinutosDeCadaApp: expected:<{Mapas=45, Chat=30}> but was:<{Mapas=2, Chat=3}>
```

### Código

```kotlin
data class Uso(val app: String, val minutos: Int)

fun minutosPorApp(usos: List<Uso>): Map<String, Int> =
    usos
        .groupBy { it.app }
        .mapValues { (_, deLaApp) -> deLaApp.size } //! corrige: .mapValues { (_, deLaApp) -> deLaApp.sumOf { it.minutos } }
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

class UsoMovilTest {
    private val usos = listOf(
        Uso("Mapas", 20), Uso("Chat", 5), Uso("Chat", 10),
        Uso("Mapas", 25), Uso("Chat", 15),
    )

    @Test
    fun sumaLosMinutosDeCadaApp() {
        assertEquals(mapOf("Mapas" to 45, "Chat" to 30), minutosPorApp(usos))
    }
}
```

### Explicación

Tras `groupBy`, cada valor del mapa es la **lista** de usos de esa app. `deLaApp.size` cuenta cuántos usos hay (2 y 3), no cuántos minutos suman. El mensaje lo deja ver: los valores de `but was` son números pequeños, como si fueran recuentos.

Para sumar un campo de cada elemento se usa `sumOf { it.minutos }`. Si de verdad quisieras contar, lo idiomático sería `groupingBy { it.app }.eachCount()`.

## kc-err-08 Los primeros de la cola {tema=ordenar dificultad=1 ancla=42-listas.md}

`siguientes` debe devolver los `n` primeros pacientes de la cola de una consulta. El test falla:

```text
Fail: devuelveLosDosPrimeros: expected:<[Marta, Iker]> but was:<[Sofía, Noel]>
```

### Código

```kotlin
data class Paciente(val nombre: String, val llegada: Int)

fun siguientes(cola: List<Paciente>, n: Int): List<String> =
    cola
        .sortedBy { it.llegada }
        .drop(n) //! corrige: .take(n)
        .map { it.nombre }
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class ColaTest {
    private val cola = listOf(Paciente("Sofía", 905), Paciente("Marta", 830), Paciente("Noel", 910), Paciente("Iker", 845))

    @Test
    fun devuelveLosDosPrimeros() {
        assertEquals(listOf("Marta", "Iker"), siguientes(cola, 2))
    }
}
```

### Explicación

`drop(n)` **descarta** los `n` primeros y devuelve el resto; `take(n)` es el que se **queda** con los `n` primeros. El mensaje lo muestra: `but was` contiene justo los pacientes que llegaron después.

## kc-err-09 ¿Todos o alguno? {tema=ordenar dificultad=1 ancla=42-listas.md}

`grupoAprobado` debe devolver `true` solo si **todos** los alumnos del grupo tienen un 5 o más. El test falla:

```text
Fail: unSuspensoBastaParaQueNoEsteAprobado: expected:<false> but was:<true>
```

### Código

```kotlin
data class Alumno(val nombre: String, val nota: Double)

fun grupoAprobado(alumnos: List<Alumno>): Boolean =
    alumnos.any { it.nota >= 5.0 } //! corrige: alumnos.all { it.nota >= 5.0 }
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class GrupoTest {
    @Test
    fun todosAprobados() {
        assertEquals(true, grupoAprobado(listOf(Alumno("Ana", 6.0), Alumno("Luis", 5.0))))
    }

    @Test
    fun unSuspensoBastaParaQueNoEsteAprobado() {
        assertEquals(false, grupoAprobado(listOf(Alumno("Ana", 6.0), Alumno("Luis", 3.5))))
    }
}
```

### Explicación

`any` devuelve `true` si **al menos uno** cumple la condición; `all` exige que la cumplan **todos**. Con Ana aprobada, `any` ya es `true` aunque Luis suspenda. Para «ninguno» existe `none`.

## kc-err-10 El vuelo más barato {tema=nulos dificultad=1 ancla=42-listas.md}

`masBarato` debe devolver el vuelo más barato hacia un destino. El test falla:

```text
Fail: eligeElMasBarato: expected:<[IB-12]> but was:<[UX-30]>
```

### Código

```kotlin
data class Vuelo(val codigo: String, val destino: String, val precio: Double)

fun masBarato(vuelos: List<Vuelo>, destino: String): String? =
    vuelos
        .filter { it.destino == destino }
        .maxByOrNull { it.precio } //! corrige: .minByOrNull { it.precio }
        ?.codigo
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class VuelosTest {
    private val vuelos = listOf(
        Vuelo("UX-30", "Roma", 140.0), Vuelo("IB-12", "Roma", 89.0),
        Vuelo("VY-77", "Roma", 112.0), Vuelo("FR-05", "Oporto", 39.0),
    )

    @Test
    fun eligeElMasBarato() {
        assertEquals("IB-12", masBarato(vuelos, "Roma"))
    }
}
```

### Explicación

`maxByOrNull` devuelve el elemento con el **mayor** valor: aquí, el vuelo más caro. Para el más barato se usa `minByOrNull`. Las dos devuelven `null` con una lista vacía, por eso se sigue con `?.codigo`.

## kc-err-11 Platos sin gluten {tema=ordenar dificultad=1 ancla=42-listas.md}

`sinGluten` debe devolver los platos que **no** llevan gluten. El test falla:

```text
Fail: soloLosQueNoLlevanGluten: expected:<[Ensalada, Pulpo]> but was:<[Lasaña, Croquetas]>
```

### Código

```kotlin
data class Plato(val nombre: String, val alergenos: Set<String>)

fun sinGluten(platos: List<Plato>): List<String> =
    platos
        .filter { "gluten" in it.alergenos } //! corrige: .filterNot { "gluten" in it.alergenos }
        .map { it.nombre }
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class SinGlutenTest {
    private val carta = listOf(
        Plato("Lasaña", setOf("gluten", "lactosa")), Plato("Ensalada", emptySet()),
        Plato("Croquetas", setOf("gluten", "huevo")), Plato("Pulpo", emptySet()),
    )

    @Test
    fun soloLosQueNoLlevanGluten() {
        assertEquals(listOf("Ensalada", "Pulpo"), sinGluten(carta))
    }
}
```

### Explicación

El filtro está al revés: `filter` se queda con los que **cumplen** la condición, es decir, con los que llevan gluten. Se corrige con `filterNot { … }` o negando la condición: `filter { "gluten" !in it.alergenos }`.

## kc-err-12 Ampliar una suscripción {tema=inmutable dificultad=1 ancla=23-data-classes.md}

`ampliar` debe sumar meses a una suscripción. El test falla:

```text
Fail: sumaLosMesesALosQueYaTenia: expected:<9> but was:<3>
```

### Código

```kotlin
data class Suscripcion(val usuario: String, val plan: String, val meses: Int)

fun ampliar(suscripcion: Suscripcion, extra: Int): Suscripcion {
    require(extra > 0) { "extra debe ser positivo" }
    return suscripcion.copy(meses = extra) //! corrige: return suscripcion.copy(meses = suscripcion.meses + extra)
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class SuscripcionTest {
    @Test
    fun sumaLosMesesALosQueYaTenia() {
        val s = Suscripcion("nora", "premium", 6)
        assertEquals(9, ampliar(s, 3).meses)
    }
}
```

### Explicación

`copy(meses = extra)` **sustituye** el valor del campo por el que le pasas: no suma nada. Para calcular el nuevo valor a partir del anterior hay que usar el campo original: `copy(meses = suscripcion.meses + extra)`.

## kc-err-13 Calificación que nunca llega {tema=inmutable dificultad=2 ancla=12.1-when.md}

`calificacion` debe devolver «Sobresaliente» con un 9 o más. El test falla:

```text
Fail: nueveEsSobresaliente: expected:<[Sobresaliente]> but was:<[Aprobado]>
```

### Código

```kotlin
fun calificacion(nota: Double): String = when {
    nota < 5.0 -> "Suspenso"
    nota >= 5.0 -> "Aprobado" //! corrige: nota < 9.0 -> "Aprobado"
    else -> "Sobresaliente"
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class CalificacionTest {
    @Test
    fun cincoEsAprobado() {
        assertEquals("Aprobado", calificacion(5.0))
    }

    @Test
    fun nueveEsSobresaliente() {
        assertEquals("Sobresaliente", calificacion(9.5))
    }
}
```

### Explicación

Un `when` sin argumento se queda con la **primera** rama verdadera. Cualquier nota que no sea suspenso cumple `nota >= 5.0`, así que la rama `else` nunca se alcanza. Hay que acotar la rama intermedia (`nota < 9.0`) para que las notas altas lleguen al final. El IDE suele avisar con «condition is always true».

## kc-err-14 Una media que pierde decimales {tema=agrupar dificultad=2 ancla=11-variables-tipos-datos.md}

`media` calcula la media de unas puntuaciones enteras. El test falla:

```text
Fail: mediaConDecimales: expected:<7.5> but was:<7.0>
```

### Código

```kotlin
fun media(puntuaciones: List<Int>): Double {
    if (puntuaciones.isEmpty()) return 0.0
    return (puntuaciones.sum() / puntuaciones.size).toDouble() //! corrige: return puntuaciones.average()
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class MediaTest {
    @Test
    fun mediaConDecimales() {
        assertEquals(7.5, media(listOf(7, 8)))
    }

    @Test
    fun listaVaciaDevuelveCero() {
        assertEquals(0.0, media(emptyList()))
    }
}
```

### Explicación

`sum()` y `size` son `Int`, así que `15 / 2` es una **división entera** y da `7`. El `toDouble()` llega tarde: convierte el 7 en 7.0, pero los decimales ya se han perdido. `average()` hace la división en `Double`. También valdría `puntuaciones.sum().toDouble() / puntuaciones.size`.

## kc-err-15 Un saludo sin nombre {tema=nulos dificultad=1 ancla=14-null-safety.md}

`saludo` debe saludar al usuario por su nombre o, si no lo hay, como «invitado». El test falla:

```text
Fail: sinNombreSaludaAlInvitado: expected:<Hola, [invitado]> but was:<Hola, [null]>
```

### Código

```kotlin
fun saludo(nombre: String?): String =
    "Hola, $nombre" //! corrige: "Hola, ${nombre ?: "invitado"}"
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class SaludoTest {
    @Test
    fun conNombre() {
        assertEquals("Hola, Ada", saludo("Ada"))
    }

    @Test
    fun sinNombreSaludaAlInvitado() {
        assertEquals("Hola, invitado", saludo(null))
    }
}
```

### Explicación

Al comparar textos, JUnit marca entre corchetes **solo la parte que difiere**: `Hola, [invitado]` frente a `Hola, [null]`. El principio, `Hola, `, coincide.

Una plantilla de texto con un valor `null` no falla: escribe literalmente `null`. Para dar un valor por defecto se usa el operador Elvis dentro de la plantilla: `${nombre ?: "invitado"}`.
