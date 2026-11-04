---
tipo: parsons
titulo: Ordena las líneas
apuntes: temas/00-android/00-kotlin
---

## kc-par-01 Ciudades con lluvia {tema=ordenar dificultad=1 ancla=42-listas.md}

Ordena las líneas para que la función devuelva, **sin repetir y en orden alfabético**, las ciudades que han tenido alguna lectura con más lluvia que `minimo`. **Una línea sobra.**

### Código

```kotlin
fun ciudadesConLluvia(lecturas: List<Lectura>, minimo: Double): List<String> = //!fijo
    lecturas
        .filter { it.lluvia > minimo }
        .map { it.ciudad }
        .distinct() //!grupo=a
        .sorted() //!grupo=a
        .sortedBy { it.lluvia } //!distractor
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

data class Lectura(val ciudad: String, val lluvia: Double)

class CiudadesConLluviaTest {
    @Test
    fun ciudadesSinRepetirYOrdenadas() {
        val lecturas = listOf(
            Lectura("Vigo", 12.0), Lectura("Almería", 0.5),
            Lectura("Bilbao", 7.0), Lectura("Vigo", 9.0),
        )
        assertEquals(listOf("Bilbao", "Vigo"), ciudadesConLluvia(lecturas, 5.0))
    }
}
```

### Explicación

- `filter` tiene que ir **antes** que `map`, porque necesita el campo `lluvia` y, después del `map`, solo quedan nombres (`List<String>`).
- `distinct()` y `sorted()` actúan sobre los nombres, así que el orden entre ellas da igual: las dos combinaciones se dan por buenas.
- Sobra `sortedBy { it.lluvia }`: ordenaría por lluvia, no alfabéticamente. Y si la pones después del `map`, ni siquiera compila, porque un `String` no tiene `lluvia`.

## kc-par-02 Las canciones más largas {tema=ordenar,validar dificultad=2 ancla=42-listas.md}

Ordena las líneas: la función valida `n` y devuelve los títulos de las `n` canciones más largas, de más a menos. **Una línea sobra.**

### Código

```kotlin
fun masLargas(canciones: List<Cancion>, n: Int): List<String> { //!fijo
    require(n > 0) { "n debe ser mayor que 0" }
    return canciones
        .sortedByDescending { it.segundos }
        .take(n) //!grupo=b
        .map { it.titulo } //!grupo=b
        .take(n).sortedByDescending { it.segundos } //!distractor
} //!fijo
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test
import kotlin.test.assertFailsWith

data class Cancion(val titulo: String, val segundos: Int)

class MasLargasTest {
    private val canciones = listOf(Cancion("Corta", 95), Cancion("Larga", 420), Cancion("Media", 210))

    @Test
    fun lasDosMasLargas() {
        assertEquals(listOf("Larga", "Media"), masLargas(canciones, 2))
    }

    @Test
    fun nNegativoLanzaExcepcion() {
        assertFailsWith<IllegalArgumentException> { masLargas(canciones, -1) }
    }
}
```

### Explicación

- La validación con `require` va al principio, antes de calcular nada.
- Hay que **ordenar antes de recortar**: si haces `take(n)` primero, te quedas con las `n` primeras de la lista original, no con las más largas. Por eso sobra la línea que recorta y luego ordena.
- `take(n)` y `map { it.titulo }` se pueden intercambiar: recortar y luego transformar da el mismo resultado que transformar y luego recortar.

## kc-par-03 Aparcar en un parking {tema=inmutable dificultad=2 ancla=26-sealed-classes.md}

Ordena el cuerpo de `aparcar`: rechaza las cantidades no válidas y la falta de plazas, y si todo va bien devuelve una **copia** del parking con las plazas ocupadas actualizadas. **Una línea sobra.**

### Código

```kotlin
fun aparcar(parking: Parking, coches: Int): Aparcamiento { //!fijo
    if (coches <= 0) return Aparcamiento.Rechazado("cantidad no válida") //!grupo=g
    if (coches > parking.libres) return Aparcamiento.Rechazado("parking lleno") //!grupo=g
    val actualizado = parking.copy(ocupadas = parking.ocupadas + coches)
    return Aparcamiento.Aceptado(actualizado)
    parking.ocupadas += coches //!distractor
} //!fijo
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

data class Parking(val nombre: String, val plazas: Int, val ocupadas: Int) {
    val libres: Int get() = plazas - ocupadas
}

sealed interface Aparcamiento {
    data class Aceptado(val parking: Parking) : Aparcamiento
    data class Rechazado(val motivo: String) : Aparcamiento
}

class ParkingTest {
    private val parking = Parking("Centro", plazas = 10, ocupadas = 8)

    @Test
    fun aceptaSiHayPlazas() {
        assertEquals(Aparcamiento.Aceptado(parking.copy(ocupadas = 10)), aparcar(parking, 2))
    }

    @Test
    fun rechazaCantidadesNoValidasYFaltaDePlazas() {
        assertEquals(Aparcamiento.Rechazado("cantidad no válida"), aparcar(parking, 0))
        assertEquals(Aparcamiento.Rechazado("parking lleno"), aparcar(parking, 3))
    }
}
```

### Explicación

- Las dos guardas (`if … return`) van primero. Como cada una sale de la función por su cuenta, su orden entre ellas da igual.
- Después se crea la copia y se devuelve. Cualquier línea detrás de un `return` sería código inalcanzable.
- Sobra `parking.ocupadas += coches`: `ocupadas` es `val`, así que **no compila**, y aunque fuera `var`, mutaría el objeto original en lugar de devolver uno nuevo.

## kc-par-04 Informe de gastos {tema=agrupar dificultad=3 ancla=43-maps.md}

Ordena el *pipeline* que genera un informe con el total de cada categoría, **de mayor a menor gasto**, una por línea (por ejemplo, `OCIO: 30.0`). **Una línea sobra.**

### Código

```kotlin
fun informe(gastos: List<Gasto>): String = //!fijo
    gastos
        .groupBy { it.categoria }
        .mapValues { (_, lista) -> lista.sumOf { it.importe } }
        .toList()
        .sortedByDescending { it.second }
        .joinToString("\n") { (categoria, total) -> "$categoria: $total" }
        .forEach { println(it) } //!distractor
```

### Tests

```kotlin
import kotlin.test.assertEquals
import kotlin.test.Test

data class Gasto(val categoria: String, val importe: Double)

class InformeTest {
    @Test
    fun informeOrdenadoDeMayorAMenor() {
        val gastos = listOf(Gasto("COMIDA", 12.0), Gasto("OCIO", 30.0), Gasto("COMIDA", 10.0))
        assertEquals("OCIO: 30.0\nCOMIDA: 22.0", informe(gastos))
    }
}
```

### Explicación

Cada paso necesita lo que produce el anterior, así que solo hay un orden válido:

- `groupBy` crea el mapa categoría → lista de gastos.
- `mapValues` cambia cada lista por su total.
- `toList()` convierte el mapa en una lista de pares `(categoría, total)`, que sí se puede ordenar.
- `sortedByDescending { it.second }` ordena por el total, que es el segundo elemento del par.
- `joinToString("\n")` une las líneas en un único `String`, que es lo que devuelve la función.

Sobra `forEach { println(it) }`: imprime pero no devuelve nada (`Unit`), y la función debe devolver un `String`.

## kc-par-05 Tareas pendientes por prioridad {tema=ordenar dificultad=1 ancla=42-listas.md}

Ordena las líneas para obtener los títulos de las tareas **pendientes**, de más a menos prioridad. **Una línea sobra.**

### Código

```kotlin
fun pendientes(tareas: List<Tarea>): List<String> = //!fijo
    tareas
        .filter { !it.hecha } //!grupo=p
        .sortedByDescending { it.prioridad } //!grupo=p
        .map { it.titulo }
        .filter { it.hecha } //!distractor
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

data class Tarea(val titulo: String, val prioridad: Int, val hecha: Boolean)

class PendientesTest {
    @Test
    fun pendientesDeMasAMenosPrioridad() {
        val tareas = listOf(Tarea("a", 1, false), Tarea("b", 5, true), Tarea("c", 3, false))
        assertEquals(listOf("c", "a"), pendientes(tareas))
    }
}
```

### Explicación

- Primero se filtra y se ordena, mientras los elementos siguen siendo `Tarea`. El `map` va al final, porque después solo quedan títulos.
- `filter` y `sortedByDescending` se pueden intercambiar y el resultado es el mismo, así que se aceptan los dos órdenes. Filtrar antes es algo más eficiente: se ordenan menos elementos.
- Sobra `.filter { it.hecha }`: se queda con las tareas hechas, justo las que no se piden.

## kc-par-06 Retirar unidades del almacén {tema=validar,inmutable dificultad=2 ancla=23-data-classes.md}

Ordena el cuerpo de `retirar`: valida la cantidad y devuelve una copia del artículo con menos stock. **Una línea sobra.**

### Código

```kotlin
fun retirar(articulo: Articulo, unidades: Int): Articulo { //!fijo
    require(unidades > 0) { "unidades no válidas" } //!grupo=r
    require(unidades <= articulo.stock) { "no hay stock suficiente" } //!grupo=r
    return articulo.copy(stock = articulo.stock - unidades)
    return articulo //!distractor
} //!fijo
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

data class Articulo(val codigo: String, val stock: Int)

class RetirarTest {
    @Test
    fun retiraYValida() {
        assertEquals(Articulo("A1", 7), retirar(Articulo("A1", 10), 3))
        assertFailsWith<IllegalArgumentException> { retirar(Articulo("A1", 10), 11) }
    }
}
```

### Explicación

- Las validaciones van primero; entre ellas, el orden da igual.
- Detrás de un `return` no se ejecuta nada, así que solo puede haber uno al final.
- Sobra `return articulo`: devolvería el artículo sin cambios.

## kc-par-07 Un test en tres pasos {tema=tests dificultad=1 ancla=testing/index.md}

Ordena el cuerpo del test siguiendo el patrón **Preparar → Actuar → Comprobar** (*Arrange, Act, Assert*). **Una línea sobra.**

### Código

```kotlin
import kotlin.test.Test //!fijo
import kotlin.test.assertEquals //!fijo
 //!fijo
class InvitadosTest { //!fijo
    @Test //!fijo
    fun soloLosConfirmados() { //!fijo
        val lista = listOf(Invitado("Leo", true), Invitado("Iris", false))
        val resultado = confirmados(lista)
        assertEquals(listOf("Leo"), resultado)
        println(resultado) //!distractor
    } //!fijo
} //!fijo
```

### Tests

```kotlin
data class Invitado(val nombre: String, val confirmado: Boolean)

fun confirmados(lista: List<Invitado>): List<String> = lista.filter { it.confirmado }.map { it.nombre }
```

### Explicación

- **Preparar**: se crean los datos de entrada.
- **Actuar**: se llama a la función que se prueba y se guarda el resultado.
- **Comprobar**: el `assert` compara lo esperado con lo obtenido.

Sobra `println(resultado)`: un test no debe depender de que alguien lea la consola. Lo que se comprueba va en un `assert`.

## kc-par-08 Gastos de envío {tema=inmutable dificultad=2 ancla=12.1-when.md}

Ordena las ramas del `when` para que el envío sea gratis desde 50 €, con regalo desde 100 €, cueste 4,95 € en el resto de pedidos y un total de 0 sea un pedido vacío. **Una línea sobra.**

### Código

```kotlin
fun envio(total: Double): String = when { //!fijo
    total >= 100.0 -> "envío gratis y regalo"
    total >= 50.0 -> "envío gratis"
    total > 0.0 -> "envío 4,95 €"
    else -> "pedido vacío"
    total < 50.0 -> "envío gratis" //!distractor
} //!fijo
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class EnvioTest {
    @Test
    fun envioSegunElTotal() {
        assertEquals("envío gratis y regalo", envio(120.0))
        assertEquals("envío gratis", envio(50.0))
        assertEquals("envío 4,95 €", envio(12.0))
        assertEquals("pedido vacío", envio(0.0))
    }
}
```

### Explicación

En un `when` sin argumento gana la **primera** rama verdadera, así que las condiciones van de la más exigente a la menos: si `total >= 50.0` fuera antes que `total >= 100.0`, nadie recibiría regalo. `else` siempre va al final.

Sobra `total < 50.0 -> "envío gratis"`: contradice el enunciado.

## kc-par-09 Contar votos {tema=agrupar dificultad=2 ancla=43-maps.md}

Ordena el *pipeline* que cuenta los votos de una encuesta, sin tener en cuenta mayúsculas ni espacios y descartando los votos vacíos. **Una línea sobra.**

### Código

```kotlin
fun recuento(votos: List<String>): Map<String, Int> = //!fijo
    votos
        .map { it.trim().lowercase() }
        .filter { it.isNotEmpty() }
        .groupingBy { it }
        .eachCount()
        .count() //!distractor
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class RecuentoTest {
    @Test
    fun cuentaLosVotosLimpios() {
        assertEquals(mapOf("sí" to 2, "no" to 1), recuento(listOf("Sí", " sí ", "", "NO", "  ")))
    }
}
```

### Explicación

- Hay que **limpiar antes de filtrar**: `"  "` solo queda vacío después de `trim()`. Si filtras primero, ese voto en blanco se cuela.
- `groupingBy { it }` prepara la agrupación y `eachCount()` cuenta cuántas veces aparece cada clave.
- Sobra `.count()`: devolvería un único número (cuántas opciones distintas hay), no el mapa.

## kc-par-10 Teléfono de un contacto {tema=nulos dificultad=2 ancla=14-null-safety.md}

Ordena el cuerpo de `telefonoDe`: si el nombre está en blanco devuelve `"sin nombre"`, si el contacto no existe `"no existe"`, y si existe pero no tiene teléfono `"sin teléfono"`. **Una línea sobra.**

### Código

```kotlin
fun telefonoDe(contactos: List<Contacto>, nombre: String?): String { //!fijo
    if (nombre.isNullOrBlank()) return "sin nombre"
    val contacto = contactos.find { it.nombre == nombre } ?: return "no existe"
    return contacto.telefono ?: "sin teléfono"
    val contacto = contactos.first { it.nombre == nombre } //!distractor
} //!fijo
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

data class Contacto(val nombre: String, val telefono: String?)

class TelefonoTest {
    private val agenda = listOf(Contacto("Ana", "600111222"), Contacto("Leo", null))

    @Test
    fun cadaCasoSuRespuesta() {
        assertEquals("600111222", telefonoDe(agenda, "Ana"))
        assertEquals("sin teléfono", telefonoDe(agenda, "Leo"))
        assertEquals("no existe", telefonoDe(agenda, "Eva"))
        assertEquals("sin nombre", telefonoDe(agenda, null))
    }
}
```

### Explicación

- La guarda del nombre va primero: después, `nombre` ya es `String`.
- `find { … } ?: return …` busca el contacto y, si no existe, sale de la función en la misma línea.
- Sobra la versión con `first`: lanzaría `NoSuchElementException` cuando el contacto no existe, en vez de devolver `"no existe"`.

## kc-par-11 Ticket de compra {tema=ordenar dificultad=2 ancla=42-listas.md}

Ordena el *pipeline* que genera un ticket: una línea por producto con unidades, en orden alfabético, con el formato `pan x2`. **Una línea sobra.**

### Código

```kotlin
fun ticket(lineas: List<LineaTicket>): String = //!fijo
    lineas
        .filter { it.unidades > 0 } //!grupo=t
        .sortedBy { it.producto } //!grupo=t
        .map { "${it.producto} x${it.unidades}" }
        .joinToString("\n")
        .forEach { println(it) } //!distractor
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

data class LineaTicket(val producto: String, val unidades: Int)

class TicketTest {
    @Test
    fun ticketOrdenadoSinLineasVacias() {
        val lineas = listOf(LineaTicket("pan", 2), LineaTicket("aceite", 1), LineaTicket("sal", 0))
        assertEquals("aceite x1\npan x2", ticket(lineas))
    }
}
```

### Explicación

- `filter` y `sortedBy` trabajan sobre las líneas del ticket y se pueden intercambiar: las dos combinaciones son válidas.
- El `map` convierte cada línea en texto, así que va después: tras él ya no hay `unidades` ni `producto` por los que filtrar u ordenar.
- `joinToString("\n")` une los textos y devuelve el `String` final. Sobra `forEach { println(it) }`, que imprime y no devuelve nada.

## kc-par-12 Lista de la compra semanal {tema=ordenar,agrupar dificultad=2 ancla=42-listas.md}

Ordena el *pipeline*: los ingredientes de las recetas planificadas para la semana, **sin repetir** y en orden alfabético. **Una línea sobra.**

### Código

```kotlin
fun listaCompra(recetas: List<Receta>): List<String> = //!fijo
    recetas
        .filter { it.planificada }
        .flatMap { it.ingredientes }
        .distinct() //!grupo=d
        .sorted() //!grupo=d
        .map { it.ingredientes } //!distractor
```

### Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

data class Receta(val nombre: String, val ingredientes: List<String>, val planificada: Boolean)

class CompraTest {
    @Test
    fun ingredientesSinRepetirYOrdenados() {
        val recetas = listOf(
            Receta("Tortilla", listOf("huevo", "patata", "aceite"), true),
            Receta("Flan", listOf("huevo", "leche", "azúcar"), false),
            Receta("Ensalada", listOf("lechuga", "aceite"), true),
        )
        assertEquals(listOf("aceite", "huevo", "lechuga", "patata"), listaCompra(recetas))
    }
}
```

### Explicación

- `filter` va primero, mientras aún hay recetas con su campo `planificada`.
- `flatMap { it.ingredientes }` convierte una lista de recetas en **una sola** lista de ingredientes. Con `map` tendrías una lista de listas, por eso sobra.
- `distinct()` y `sorted()` actúan sobre los textos y su orden da igual.
