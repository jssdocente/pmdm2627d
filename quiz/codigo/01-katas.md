---
tipo: kata
titulo: Katas TDD
apuntes: temas/00-android/00-kotlin
---

## kc-kata-01 Libros disponibles {tema=ordenar dificultad=1 ancla=42-listas.md}

Una biblioteca guarda sus libros en una lista. Implementa `titulosDisponibles` para que devuelva los **títulos** de los libros del género indicado que **no están prestados**, en **orden alfabético**.

Resuélvelo con un *pipeline* (`filter`, `map`, `sorted`…), sin bucles ni listas mutables.

### Código

```kotlin
enum class Genero { NOVELA, ENSAYO, COMIC, POESIA }

data class Libro(
    val titulo: String,
    val autor: String,
    val genero: Genero,
    val prestado: Boolean
)

fun titulosDisponibles(libros: List<Libro>, genero: Genero): List<String> {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.Test

class TitulosDisponiblesTest {
    private val libros = listOf(
        Libro("Rayuela", "Julio Cortázar", Genero.NOVELA, prestado = false),
        Libro("Ficciones", "Jorge Luis Borges", Genero.NOVELA, prestado = true),
        Libro("Aura", "Carlos Fuentes", Genero.NOVELA, prestado = false),
        Libro("Persépolis", "Marjane Satrapi", Genero.COMIC, prestado = false),
        Libro("Maus", "Art Spiegelman", Genero.COMIC, prestado = false),
    )

    @Test
    fun soloDevuelveLosDelGeneroPedido() {
        assertEquals(listOf("Maus", "Persépolis"), titulosDisponibles(libros, Genero.COMIC))
    }

    @Test
    fun descartaLosPrestadosYOrdenaPorTitulo() {
        assertEquals(listOf("Aura", "Rayuela"), titulosDisponibles(libros, Genero.NOVELA))
    }

    @Test
    fun generoSinLibrosDevuelveListaVacia() {
        assertTrue(titulosDisponibles(libros, Genero.POESIA).isEmpty())
    }
}
```

### Solución

```kotlin
fun titulosDisponibles(libros: List<Libro>, genero: Genero): List<String> =
    libros
        .filter { it.genero == genero && !it.prestado }
        .map { it.titulo }
        .sorted()
```

### Pistas

- Primero quédate con los libros que cumplen **las dos** condiciones: puedes ponerlas juntas en un solo `filter` con `&&`.
- Después transforma cada `Libro` en su `titulo` con `map`. A partir de ahí tienes una `List<String>`.
- Una lista de `String` se ordena alfabéticamente con `sorted()`. También valdría `sortedBy { it.titulo }` antes del `map`.

## kc-kata-02 Estación meteorológica {tema=agrupar,nulos dificultad=2 ancla=43-maps.md#groupby-mapvalues}

Una estación recoge lecturas diarias de varias ciudades. Implementa dos funciones:

- `mediaPorCiudad`: un mapa con la **temperatura media** de cada ciudad.
- `ciudadMasLluviosa`: la ciudad con **más lluvia acumulada** en total, o `null` si no hay lecturas.

### Código

```kotlin
data class Lectura(
    val ciudad: String,
    val dia: Int,
    val temperatura: Double,
    val lluvia: Double
)

fun mediaPorCiudad(lecturas: List<Lectura>): Map<String, Double> {
    TODO("Pendiente de implementar")
}

fun ciudadMasLluviosa(lecturas: List<Lectura>): String? {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.Test

class EstacionTest {
    private val lecturas = listOf(
        Lectura("Mérida", 1, 30.0, 0.0),
        Lectura("Mérida", 2, 34.0, 2.0),
        Lectura("Oviedo", 1, 18.0, 12.0),
        Lectura("Oviedo", 2, 20.0, 8.0),
        Lectura("Cádiz", 1, 25.0, 1.0),
    )

    @Test
    fun calculaLaMediaDeCadaCiudad() {
        val esperado = mapOf("Mérida" to 32.0, "Oviedo" to 19.0, "Cádiz" to 25.0)
        assertEquals(esperado, mediaPorCiudad(lecturas))
    }

    @Test
    fun sinLecturasElMapaEstaVacio() {
        assertEquals(emptyMap<String, Double>(), mediaPorCiudad(emptyList()))
    }

    @Test
    fun laMasLluviosaSumaTodaSuLluvia() {
        assertEquals("Oviedo", ciudadMasLluviosa(lecturas))
    }

    @Test
    fun sinLecturasNoHayCiudadMasLluviosa() {
        assertNull(ciudadMasLluviosa(emptyList()))
    }
}
```

### Solución

```kotlin
fun mediaPorCiudad(lecturas: List<Lectura>): Map<String, Double> =
    lecturas
        .groupBy { it.ciudad }
        .mapValues { (_, deLaCiudad) -> deLaCiudad.map { it.temperatura }.average() }

fun ciudadMasLluviosa(lecturas: List<Lectura>): String? =
    lecturas
        .groupBy { it.ciudad }
        .mapValues { (_, deLaCiudad) -> deLaCiudad.sumOf { it.lluvia } }
        .maxByOrNull { it.value }
        ?.key
```

### Pistas

- `groupBy { it.ciudad }` te da un `Map<String, List<Lectura>>`: la clave es la ciudad y el valor, sus lecturas.
- `mapValues` transforma solo los valores del mapa y conserva las claves. Dentro, calcula la media (`average()`) o la suma (`sumOf`).
- Para quedarte con la entrada de mayor valor usa `maxByOrNull { it.value }`: devuelve `null` si el mapa está vacío, y por eso el resultado es `String?`.

## kc-kata-03 Cafetería: lo más vendido {tema=agrupar,validar dificultad=2 ancla=42-listas.md}

En una cafetería, cada pedido tiene varias líneas (producto y unidades). Implementa:

- `unidadesPorProducto`: cuántas unidades se han vendido de cada producto, sumando **todos** los pedidos.
- `masVendidos`: los nombres de los `n` productos con más unidades, de más a menos. Si `n` no es mayor que 0, debe lanzar `IllegalArgumentException`.

### Código

```kotlin
data class Linea(val producto: String, val unidades: Int)

data class Pedido(val mesa: Int, val lineas: List<Linea>)

fun unidadesPorProducto(pedidos: List<Pedido>): Map<String, Int> {
    TODO("Pendiente de implementar")
}

fun masVendidos(pedidos: List<Pedido>, n: Int): List<String> {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test
import kotlin.test.assertFailsWith

class CafeteriaTest {
    private val pedidos = listOf(
        Pedido(1, listOf(Linea("café", 2), Linea("tostada", 1))),
        Pedido(2, listOf(Linea("café", 1), Linea("zumo", 3))),
        Pedido(3, listOf(Linea("café", 2), Linea("tostada", 1), Linea("zumo", 1))),
    )

    @Test
    fun sumaLasUnidadesDeTodosLosPedidos() {
        val esperado = mapOf("café" to 5, "tostada" to 2, "zumo" to 4)
        assertEquals(esperado, unidadesPorProducto(pedidos))
    }

    @Test
    fun devuelveLosNMasVendidosDeMasAMenos() {
        assertEquals(listOf("café", "zumo"), masVendidos(pedidos, 2))
    }

    @Test
    fun siNEsMayorQueLosProductosLosDevuelveTodos() {
        assertEquals(listOf("café", "zumo", "tostada"), masVendidos(pedidos, 10))
    }

    @Test
    fun nCeroLanzaExcepcion() {
        assertFailsWith<IllegalArgumentException> { masVendidos(pedidos, 0) }
    }
}
```

### Solución

```kotlin
fun unidadesPorProducto(pedidos: List<Pedido>): Map<String, Int> =
    pedidos
        .flatMap { it.lineas }
        .groupBy { it.producto }
        .mapValues { (_, lineas) -> lineas.sumOf { it.unidades } }

fun masVendidos(pedidos: List<Pedido>, n: Int): List<String> {
    require(n > 0) { "n debe ser mayor que 0" }
    return unidadesPorProducto(pedidos)
        .entries
        .sortedByDescending { it.value }
        .take(n)
        .map { it.key }
}
```

### Pistas

- Las líneas están **dentro** de cada pedido. `flatMap { it.lineas }` las junta todas en una única `List<Linea>`.
- Con todas las líneas juntas, el problema es como el de la estación: `groupBy` + `mapValues` + `sumOf`.
- En `masVendidos`, la validación va primero: `require(condición)` lanza `IllegalArgumentException` cuando la condición es **falsa**.
- Reutiliza `unidadesPorProducto`. Para ordenar un mapa, recorre sus `entries` y ordénalas por `value`. `take(n)` no falla si hay menos de `n` elementos.

## kc-kata-04 Buscador de canciones {tema=nulos dificultad=2 ancla=14-null-safety.md}

Una aplicación de música necesita dos utilidades para su lista de reproducción:

- `buscar`: la **primera** canción cuyo título contiene el texto, **sin distinguir mayúsculas**. Devuelve `null` si el texto es `null` o está en blanco, o si ninguna canción coincide.
- `duracionTotal`: la duración de toda la lista con el formato `m:ss`, por ejemplo `7:05`. Una lista vacía dura `0:00`.

### Código

```kotlin
data class Cancion(val titulo: String, val artista: String, val segundos: Int)

fun buscar(canciones: List<Cancion>, texto: String?): Cancion? {
    TODO("Pendiente de implementar")
}

fun duracionTotal(canciones: List<Cancion>): String {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.Test

class PlaylistTest {
    private val lista = listOf(
        Cancion("Mediterráneo", "Serrat", 205),
        Cancion("La flaca", "Jarabe de Palo", 260),
        Cancion("Mediterranean Blues", "Varios", 140),
    )

    @Test
    fun encuentraLaPrimeraSinDistinguirMayusculas() {
        assertEquals("Mediterráneo", buscar(lista, "MEDITERR")?.titulo)
    }

    @Test
    fun textoNuloOEnBlancoDevuelveNull() {
        assertNull(buscar(lista, null))
        assertNull(buscar(lista, "   "))
    }

    @Test
    fun sinCoincidenciasDevuelveNull() {
        assertNull(buscar(lista, "rock"))
    }

    @Test
    fun formateaLaDuracionTotalConDosCifrasDeSegundos() {
        assertEquals("10:05", duracionTotal(lista))
        assertEquals("3:25", duracionTotal(lista.take(1)))
    }

    @Test
    fun listaVaciaDuraCero() {
        assertEquals("0:00", duracionTotal(emptyList()))
    }
}
```

### Solución

```kotlin
fun buscar(canciones: List<Cancion>, texto: String?): Cancion? {
    if (texto.isNullOrBlank()) return null
    return canciones.find { it.titulo.contains(texto, ignoreCase = true) }
}

fun duracionTotal(canciones: List<Cancion>): String {
    val total = canciones.sumOf { it.segundos }
    val segundos = (total % 60).toString().padStart(2, '0')
    return "${total / 60}:$segundos"
}
```

### Pistas

- `isNullOrBlank()` comprueba a la vez que el texto no sea `null` ni esté vacío o lleno de espacios. Después de esa guarda, Kotlin sabe que `texto` ya no es nulo (*smart cast*).
- `find { … }` devuelve el primer elemento que cumple la condición, o `null` si no hay ninguno. `contains(texto, ignoreCase = true)` compara sin distinguir mayúsculas.
- Minutos: `total / 60` (división entera). Segundos: `total % 60`. Para que `5` se escriba `05`, usa `padStart(2, '0')`.

## kc-kata-05 Venta de entradas de cine {tema=inmutable dificultad=3 ancla=26-sealed-classes.md}

Una sesión de cine tiene un aforo y un número de entradas vendidas. Implementa:

- `vender`: intenta vender `entradas` entradas y devuelve un `ResultadoVenta`.

    - Si `entradas` no es mayor que 0 → `Rechazada("cantidad no válida")`.
    - Si no quedan suficientes libres → `Rechazada("aforo completo")`.
    - Si se puede → `Vendida` con una **copia** de la sesión con las vendidas actualizadas. La sesión original no cambia.

- `mensaje`: el texto que mostraría la aplicación, `"OK: quedan N libres"` o `"ERROR: motivo"`. Usa un `when` **sin `else`**.

### Código

```kotlin
data class Sesion(val pelicula: String, val sala: Int, val aforo: Int, val vendidas: Int) {
    val libres: Int get() = aforo - vendidas
}

sealed interface ResultadoVenta {
    data class Vendida(val sesion: Sesion) : ResultadoVenta
    data class Rechazada(val motivo: String) : ResultadoVenta
}

fun vender(sesion: Sesion, entradas: Int): ResultadoVenta {
    TODO("Pendiente de implementar")
}

fun mensaje(resultado: ResultadoVenta): String {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.Test

class VentaTest {
    private val sesion = Sesion("Arrival", sala = 3, aforo = 50, vendidas = 46)

    @Test
    fun venderActualizaUnaCopiaDeLaSesion() {
        val resultado = vender(sesion, 3)
        assertTrue(resultado is ResultadoVenta.Vendida)
        assertEquals(49, (resultado as ResultadoVenta.Vendida).sesion.vendidas)
        assertEquals(46, sesion.vendidas)
    }

    @Test
    fun sePuedenVenderExactamenteLasLibres() {
        assertTrue(vender(sesion, 4) is ResultadoVenta.Vendida)
    }

    @Test
    fun cantidadCeroONegativaSeRechaza() {
        assertEquals(ResultadoVenta.Rechazada("cantidad no válida"), vender(sesion, 0))
        assertEquals(ResultadoVenta.Rechazada("cantidad no válida"), vender(sesion, -2))
    }

    @Test
    fun masEntradasQueLibresSeRechaza() {
        assertEquals(ResultadoVenta.Rechazada("aforo completo"), vender(sesion, 5))
    }

    @Test
    fun elMensajeDependeDelResultado() {
        assertEquals("OK: quedan 1 libres", mensaje(vender(sesion, 3)))
        assertEquals("ERROR: aforo completo", mensaje(vender(sesion, 9)))
    }
}
```

### Solución

```kotlin
fun vender(sesion: Sesion, entradas: Int): ResultadoVenta = when {
    entradas <= 0 -> ResultadoVenta.Rechazada("cantidad no válida")
    entradas > sesion.libres -> ResultadoVenta.Rechazada("aforo completo")
    else -> ResultadoVenta.Vendida(sesion.copy(vendidas = sesion.vendidas + entradas))
}

fun mensaje(resultado: ResultadoVenta): String = when (resultado) {
    is ResultadoVenta.Vendida -> "OK: quedan ${resultado.sesion.libres} libres"
    is ResultadoVenta.Rechazada -> "ERROR: ${resultado.motivo}"
}
```

### Pistas

- Un `when` sin argumento funciona como una cadena de `if / else if`: la primera condición verdadera gana. Pon primero los casos de error.
- `sesion.copy(vendidas = …)` crea una sesión **nueva** que solo cambia ese campo. La original sigue igual, que es lo que comprueba el primer test.
- En `mensaje`, como `ResultadoVenta` es `sealed`, el compilador sabe que solo hay dos casos y no necesitas `else`. Tras `is ResultadoVenta.Vendida`, el *smart cast* te deja usar `resultado.sesion`.

## kc-kata-06 Lista de tareas {tema=ordenar dificultad=1 ancla=42-listas.md}

Una aplicación de tareas necesita dos utilidades:

- `separar`: un par con los títulos de las tareas **hechas** y los de las **pendientes**, en el orden original.
- `porcentajeHechas`: el porcentaje de tareas hechas, como número entero (división entera). Si no hay tareas, `0`.

### Código

```kotlin
data class Tarea(val titulo: String, val prioridad: Int, val hecha: Boolean)

fun separar(tareas: List<Tarea>): Pair<List<String>, List<String>> {
    TODO("Pendiente de implementar")
}

fun porcentajeHechas(tareas: List<Tarea>): Int {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class TareasTest {
    private val tareas = listOf(
        Tarea("Comprar pan", 1, hecha = true),
        Tarea("Estudiar Kotlin", 3, hecha = false),
        Tarea("Llamar al taller", 2, hecha = true),
        Tarea("Regar plantas", 1, hecha = false),
    )

    @Test
    fun separaHechasYPendientes() {
        val (hechas, pendientes) = separar(tareas)
        assertEquals(listOf("Comprar pan", "Llamar al taller"), hechas)
        assertEquals(listOf("Estudiar Kotlin", "Regar plantas"), pendientes)
    }

    @Test
    fun calculaElPorcentajeEntero() {
        assertEquals(50, porcentajeHechas(tareas))
        assertEquals(33, porcentajeHechas(tareas.take(3).drop(1) + tareas[3]))
    }

    @Test
    fun sinTareasElPorcentajeEsCero() {
        assertEquals(0, porcentajeHechas(emptyList()))
    }
}
```

### Solución

```kotlin
fun separar(tareas: List<Tarea>): Pair<List<String>, List<String>> {
    val (hechas, pendientes) = tareas.partition { it.hecha }
    return hechas.map { it.titulo } to pendientes.map { it.titulo }
}

fun porcentajeHechas(tareas: List<Tarea>): Int =
    if (tareas.isEmpty()) 0 else tareas.count { it.hecha } * 100 / tareas.size
```

### Pistas

- `partition { condición }` divide una lista en dos de una sola pasada y devuelve un `Pair`: primero las que cumplen la condición y después las que no. Puedes desestructurarlo con `val (a, b) = …`.
- Un `Pair` se construye con `a to b`.
- `count { it.hecha }` cuenta los elementos que cumplen la condición. Multiplica por 100 **antes** de dividir: con enteros, `1 / 3 * 100` da 0.

## kc-kata-07 Liga de fútbol sala {tema=agrupar dificultad=3 ancla=42-listas.md}

Una liga escolar guarda los resultados de los partidos. Implementa:

- `puntosDe`: los puntos de un equipo, sumando todos sus partidos (victoria 3, empate 1, derrota 0), juegue en casa o fuera.
- `clasificacion`: los nombres de todos los equipos que aparecen en algún partido, **sin repetir**, de más a menos puntos.

### Código

```kotlin
data class Partido(val local: String, val visitante: String, val golesLocal: Int, val golesVisitante: Int)

fun puntosDe(equipo: String, partidos: List<Partido>): Int {
    TODO("Pendiente de implementar")
}

fun clasificacion(partidos: List<Partido>): List<String> {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class LigaTest {
    private val partidos = listOf(
        Partido("Delfines", "Halcones", 3, 1),
        Partido("Linces", "Delfines", 2, 2),
        Partido("Halcones", "Linces", 0, 4),
        Partido("Delfines", "Linces", 1, 0),
    )

    @Test
    fun sumaVictoriasYEmpatesEnCasaYFuera() {
        assertEquals(7, puntosDe("Delfines", partidos))
        assertEquals(4, puntosDe("Linces", partidos))
        assertEquals(0, puntosDe("Halcones", partidos))
    }

    @Test
    fun equipoSinPartidosTieneCeroPuntos() {
        assertEquals(0, puntosDe("Osos", partidos))
    }

    @Test
    fun clasificacionDeMasAMenosPuntosSinRepetir() {
        assertEquals(listOf("Delfines", "Linces", "Halcones"), clasificacion(partidos))
    }
}
```

### Solución

```kotlin
fun puntosDe(equipo: String, partidos: List<Partido>): Int =
    partidos.sumOf { p ->
        val (aFavor, enContra) = when (equipo) {
            p.local -> p.golesLocal to p.golesVisitante
            p.visitante -> p.golesVisitante to p.golesLocal
            else -> return@sumOf 0
        }
        when {
            aFavor > enContra -> 3
            aFavor == enContra -> 1
            else -> 0
        }
    }

fun clasificacion(partidos: List<Partido>): List<String> =
    partidos
        .flatMap { listOf(it.local, it.visitante) }
        .distinct()
        .sortedByDescending { puntosDe(it, partidos) }
```

### Pistas

- `sumOf { … }` puede devolver un valor calculado con lógica: para cada partido, decide cuántos puntos aporta al equipo (0 si no juega).
- Un `when (equipo)` con ramas `p.local ->` y `p.visitante ->` te dice si el equipo jugó en casa o fuera. Con eso obtienes sus goles a favor y en contra.
- Para la clasificación, cada partido aporta **dos** nombres: `flatMap { listOf(it.local, it.visitante) }` los junta todos. Después quita repetidos y ordena reutilizando `puntosDe`.

## kc-kata-08 Carta con alérgenos {tema=nulos,ordenar dificultad=2 ancla=14-null-safety.md}

Un restaurante quiere filtrar su carta según la alergia del cliente:

- `aptos`: los nombres de los platos que **no contienen** el alérgeno, en el orden de la carta. Si la alergia es `null`, todos los platos.
- `masBaratoApto`: el plato apto más barato, o `null` si no hay ninguno.

### Código

```kotlin
data class Plato(val nombre: String, val precio: Double, val alergenos: Set<String>)

fun aptos(platos: List<Plato>, alergia: String?): List<String> {
    TODO("Pendiente de implementar")
}

fun masBaratoApto(platos: List<Plato>, alergia: String?): Plato? {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class CartaTest {
    private val carta = listOf(
        Plato("Lasaña", 11.5, setOf("gluten", "lactosa")),
        Plato("Ensalada", 8.0, emptySet()),
        Plato("Croquetas", 7.0, setOf("gluten", "huevo", "lactosa")),
        Plato("Pulpo", 15.0, emptySet()),
    )

    @Test
    fun quitaLosPlatosConElAlergeno() {
        assertEquals(listOf("Ensalada", "Pulpo"), aptos(carta, "gluten"))
    }

    @Test
    fun sinAlergiaTodosSonAptos() {
        assertEquals(4, aptos(carta, null).size)
    }

    @Test
    fun elMasBaratoEntreLosAptos() {
        assertEquals("Croquetas", masBaratoApto(carta, null)?.nombre)
        assertEquals("Ensalada", masBaratoApto(carta, "lactosa")?.nombre)
    }

    @Test
    fun siNingunoEsAptoDevuelveNull() {
        assertNull(masBaratoApto(carta.take(1), "gluten"))
    }
}
```

### Solución

```kotlin
private fun filtrarAptos(platos: List<Plato>, alergia: String?): List<Plato> =
    if (alergia == null) platos else platos.filterNot { alergia in it.alergenos }

fun aptos(platos: List<Plato>, alergia: String?): List<String> =
    filtrarAptos(platos, alergia).map { it.nombre }

fun masBaratoApto(platos: List<Plato>, alergia: String?): Plato? =
    filtrarAptos(platos, alergia).minByOrNull { it.precio }
```

### Pistas

- `filterNot { … }` es lo contrario de `filter`: se queda con los que **no** cumplen la condición. `x in conjunto` comprueba si un elemento está en un `Set`.
- Las dos funciones comparten el mismo filtro: extráelo a una función auxiliar y reutilízalo.
- `minByOrNull { it.precio }` devuelve el elemento con el menor valor, o `null` si la lista está vacía.

## kc-kata-09 Recuento de una encuesta {tema=agrupar,nulos dificultad=2 ancla=43-maps.md#groupingby-eachcount}

Una encuesta abierta recoge votos escritos a mano, con espacios y mayúsculas al azar. Implementa:

- `recuento`: cuántos votos tiene cada opción. Antes de contar, cada voto se limpia con `trim()` y `lowercase()`; los votos en blanco no cuentan.
- `ganador`: la opción con más votos, o `null` si no hay ningún voto válido.

### Código

```kotlin
fun recuento(votos: List<String>): Map<String, Int> {
    TODO("Pendiente de implementar")
}

fun ganador(votos: List<String>): String? {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class EncuestaTest {
    private val votos = listOf("Playa", " montaña", "playa ", "", "CIUDAD", "Playa", "  ", "Montaña")

    @Test
    fun limpiaLosVotosYDescartaLosBlancos() {
        assertEquals(mapOf("playa" to 3, "montaña" to 2, "ciudad" to 1), recuento(votos))
    }

    @Test
    fun ganaLaOpcionConMasVotos() {
        assertEquals("playa", ganador(votos))
    }

    @Test
    fun sinVotosValidosNoHayGanador() {
        assertNull(ganador(listOf("", "   ")))
    }
}
```

### Solución

```kotlin
fun recuento(votos: List<String>): Map<String, Int> =
    votos
        .map { it.trim().lowercase() }
        .filter { it.isNotEmpty() }
        .groupingBy { it }
        .eachCount()

fun ganador(votos: List<String>): String? =
    recuento(votos).maxByOrNull { it.value }?.key
```

### Pistas

- Limpia primero (`map { it.trim().lowercase() }`) y descarta después los vacíos: así `"  "` se convierte en `""` y se filtra.
- Para contar repeticiones, `groupingBy { it }.eachCount()` devuelve directamente un `Map<String, Int>`. También vale `groupBy { it }.mapValues { it.value.size }`.
- `maxByOrNull` sobre un mapa trabaja con sus entradas: `?.key` te da la opción, o `null` si el mapa está vacío.

## kc-kata-10 Almacén: reponer y retirar {tema=validar,inmutable,ordenar dificultad=2 ancla=23-data-classes.md}

El almacén de una tienda controla su stock. Implementa:

- `aReponer`: los códigos de los artículos con **menos stock que su mínimo**, primero los que más unidades necesitan (mínimo − stock).
- `retirar`: devuelve una **copia** del artículo con `unidades` menos. Debe lanzar `IllegalArgumentException` si `unidades` no es mayor que 0 o si supera el stock.

### Código

```kotlin
data class Articulo(val codigo: String, val nombre: String, val stock: Int, val minimo: Int)

fun aReponer(articulos: List<Articulo>): List<String> {
    TODO("Pendiente de implementar")
}

fun retirar(articulo: Articulo, unidades: Int): Articulo {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class AlmacenTest {
    private val articulos = listOf(
        Articulo("A1", "Tornillos", stock = 40, minimo = 100),
        Articulo("A2", "Tuercas", stock = 300, minimo = 100),
        Articulo("A3", "Arandelas", stock = 90, minimo = 100),
        Articulo("A4", "Clavos", stock = 0, minimo = 50),
    )

    @Test
    fun reponerOrdenadoPorLoQueFalta() {
        assertEquals(listOf("A1", "A4", "A3"), aReponer(articulos))
    }

    @Test
    fun retirarDevuelveUnaCopiaConMenosStock() {
        val tuercas = articulos[1]
        assertEquals(250, retirar(tuercas, 50).stock)
        assertEquals(300, tuercas.stock)
    }

    @Test
    fun retirarCantidadesNoValidasLanzaExcepcion() {
        assertFailsWith<IllegalArgumentException> { retirar(articulos[0], 0) }
        assertFailsWith<IllegalArgumentException> { retirar(articulos[0], 41) }
    }
}
```

### Solución

```kotlin
fun aReponer(articulos: List<Articulo>): List<String> =
    articulos
        .filter { it.stock < it.minimo }
        .sortedByDescending { it.minimo - it.stock }
        .map { it.codigo }

fun retirar(articulo: Articulo, unidades: Int): Articulo {
    require(unidades > 0) { "unidades no válidas" }
    require(unidades <= articulo.stock) { "no hay stock suficiente" }
    return articulo.copy(stock = articulo.stock - unidades)
}
```

### Pistas

- `sortedByDescending` admite cualquier expresión, no solo un campo: `{ it.minimo - it.stock }`.
- Puedes encadenar dos `require`, uno por cada condición que debe cumplirse.
- `copy(stock = …)` crea el artículo nuevo; el test comprueba que el original no cambia.

## kc-kata-11 Reservas de hotel {tema=inmutable,nulos dificultad=3 ancla=26-sealed-classes.md}

Un hotel asigna habitaciones. Implementa `reservar`:

- Si `noches` no es mayor que 0 → `Rechazada("noches no válidas")`.
- Si no, busca la habitación **libre** más **barata** con capacidad suficiente para los huéspedes. Si no hay ninguna → `Rechazada("sin habitaciones")`.
- Si la hay → `Confirmada` con una **copia** de la habitación marcada como ocupada y el precio total (precio por noche × noches).

### Código

```kotlin
data class Habitacion(val numero: Int, val capacidad: Int, val precioNoche: Double, val ocupada: Boolean)

sealed interface ResultadoReserva {
    data class Confirmada(val habitacion: Habitacion, val total: Double) : ResultadoReserva
    data class Rechazada(val motivo: String) : ResultadoReserva
}

fun reservar(habitaciones: List<Habitacion>, huespedes: Int, noches: Int): ResultadoReserva {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class HotelTest {
    private val habitaciones = listOf(
        Habitacion(101, capacidad = 2, precioNoche = 70.0, ocupada = true),
        Habitacion(102, capacidad = 2, precioNoche = 80.0, ocupada = false),
        Habitacion(201, capacidad = 4, precioNoche = 120.0, ocupada = false),
        Habitacion(202, capacidad = 3, precioNoche = 95.0, ocupada = false),
    )

    @Test
    fun eligeLaLibreMasBarataConCapacidad() {
        val esperado = ResultadoReserva.Confirmada(habitaciones[3].copy(ocupada = true), 285.0)
        assertEquals(esperado, reservar(habitaciones, huespedes = 3, noches = 3))
    }

    @Test
    fun noUsaLasOcupadas() {
        val resultado = reservar(habitaciones, huespedes = 1, noches = 1)
        assertEquals(ResultadoReserva.Confirmada(habitaciones[1].copy(ocupada = true), 80.0), resultado)
    }

    @Test
    fun rechazaSinHabitacionesONochesNoValidas() {
        assertEquals(ResultadoReserva.Rechazada("sin habitaciones"), reservar(habitaciones, 5, 2))
        assertEquals(ResultadoReserva.Rechazada("noches no válidas"), reservar(habitaciones, 2, 0))
    }
}
```

### Solución

```kotlin
fun reservar(habitaciones: List<Habitacion>, huespedes: Int, noches: Int): ResultadoReserva {
    if (noches <= 0) return ResultadoReserva.Rechazada("noches no válidas")
    val elegida = habitaciones
        .filter { !it.ocupada && it.capacidad >= huespedes }
        .minByOrNull { it.precioNoche }
        ?: return ResultadoReserva.Rechazada("sin habitaciones")
    return ResultadoReserva.Confirmada(elegida.copy(ocupada = true), elegida.precioNoche * noches)
}
```

### Pistas

- La validación de `noches` va primero, como una guarda con `return`.
- `filter` + `minByOrNull` te da la habitación buscada o `null`. Con el operador Elvis puedes salir directamente: `?: return ResultadoReserva.Rechazada(…)`.
- Tras el Elvis, `elegida` ya no es nula (*smart cast*): construye el resultado con `elegida.copy(ocupada = true)`.

## kc-kata-12 Boletín de notas {tema=ordenar,inmutable dificultad=2 ancla=12.1-when.md}

Implementa `boletin`: un texto con una línea por alumno, **ordenado por nombre**, con el formato `Nombre: nota (calificación)`. Las calificaciones son: menos de 5, `Suspenso`; menos de 7, `Aprobado`; menos de 9, `Notable`; el resto, `Sobresaliente`.

### Código

```kotlin
data class Nota(val alumno: String, val nota: Double)

fun calificacion(nota: Double): String {
    TODO("Pendiente de implementar")
}

fun boletin(notas: List<Nota>): String {
    TODO("Pendiente de implementar")
}
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class BoletinTest {
    @Test
    fun calificacionSegunLosLimites() {
        assertEquals("Suspenso", calificacion(4.9))
        assertEquals("Aprobado", calificacion(5.0))
        assertEquals("Notable", calificacion(7.0))
        assertEquals("Sobresaliente", calificacion(9.0))
    }

    @Test
    fun boletinOrdenadoPorNombre() {
        val notas = listOf(Nota("Rubén", 6.5), Nota("Alba", 9.2), Nota("Hugo", 4.0))
        val esperado = "Alba: 9.2 (Sobresaliente)\nHugo: 4.0 (Suspenso)\nRubén: 6.5 (Aprobado)"
        assertEquals(esperado, boletin(notas))
    }

    @Test
    fun sinNotasElBoletinEstaVacio() {
        assertEquals("", boletin(emptyList()))
    }
}
```

### Solución

```kotlin
fun calificacion(nota: Double): String = when {
    nota < 5.0 -> "Suspenso"
    nota < 7.0 -> "Aprobado"
    nota < 9.0 -> "Notable"
    else -> "Sobresaliente"
}

fun boletin(notas: List<Nota>): String =
    notas
        .sortedBy { it.alumno }
        .joinToString("\n") { "${it.alumno}: ${it.nota} (${calificacion(it.nota)})" }
```

### Pistas

- En un `when` sin argumento las ramas se evalúan **en orden**: si empiezas por `nota < 5.0`, la siguiente rama ya sabe que la nota es al menos 5.
- `joinToString("\n") { … }` transforma cada elemento y une los textos con saltos de línea. Con una lista vacía devuelve `""`.
- Reutiliza `calificacion` dentro de la plantilla de texto: `${calificacion(it.nota)}`.
