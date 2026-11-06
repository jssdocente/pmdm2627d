---
tipo: defensa
titulo: Explica tu código
apuntes: temas/00-android/00-kotlin
---

## kc-def-01 Recorre un pipeline paso a paso {tema=ordenar,agrupar dificultad=1 ancla=42-listas.md}

Explica qué produce **cada paso** de este *pipeline* con los datos de ejemplo: el tipo de lo que sale de cada línea y su valor.

```kotlin
data class Venta(val vendedor: String, val importe: Double)

val ventas = listOf(Venta("Eva", 120.0), Venta("Leo", 40.0), Venta("Eva", 60.0), Venta("Leo", 15.0))

val resultado = ventas
    .filter { it.importe >= 50.0 }
    .groupBy { it.vendedor }
    .mapValues { (_, lista) -> lista.sumOf { it.importe } }
```

### Respuesta modelo

1. `filter { it.importe >= 50.0 }` recorre las cuatro ventas y deja pasar solo las de 50 € o más. Sale una `List<Venta>` con `Venta("Eva", 120.0)` y `Venta("Eva", 60.0)`: las dos de Leo se descartan.

2. `groupBy { it.vendedor }` agrupa esa lista por vendedor. Sale un `Map<String, List<Venta>>`: `{"Eva" = [Venta(Eva, 120.0), Venta(Eva, 60.0)]}`. Leo no aparece, porque no le quedó ninguna venta tras el filtro.

3. `mapValues { … sumOf { it.importe } }` mantiene las claves y cambia cada lista por la suma de sus importes. Sale un `Map<String, Double>`: `{"Eva" = 180.0}`.

Ninguna operación modifica `ventas`: cada paso devuelve una colección nueva.

### Cotejo

- Indico el **tipo** que sale de cada paso (`List<Venta>`, `Map<String, List<Venta>>`, `Map<String, Double>`).
- Doy el **valor** concreto de cada paso con los datos del ejemplo.
- Explico por qué Leo desaparece del resultado (el filtro va antes de agrupar).
- Menciono que la lista original no cambia.

## kc-def-02 ¿find, first o filter? {tema=nulos dificultad=1 ancla=42-listas.md}

Tu función de búsqueda devuelve `Libro?`. ¿Por qué usas `find { … }` y no `first { … }` ni `filter { … }.first()`? ¿Qué pasaría con cada opción si ningún libro coincide?

### Respuesta modelo

Uso `find { … }` porque devuelve el **primer** elemento que cumple la condición o **`null` si no hay ninguno**. Eso encaja con el tipo de retorno `Libro?`: la función nunca falla, y quien la llama decide qué hacer con el `null` (por ejemplo, con `?:` o `?.let`).

- `first { … }` devuelve el primero, pero si no hay ninguno **lanza** `NoSuchElementException`. Un test que espera `null` terminaría en `Error`.
- `filter { … }.first()` tiene el mismo problema y además es menos eficiente: recorre **toda** la lista para crear una lista intermedia, cuando `find` se detiene en la primera coincidencia.

`firstOrNull { … }` es equivalente a `find`.

### Cotejo

- Digo que `find` devuelve `null` si no encuentra nada, y lo relaciono con el tipo `Libro?`.
- Digo que `first` lanza `NoSuchElementException` cuando no hay coincidencias.
- Explico que `filter().first()` crea una lista intermedia y recorre todo.
- Menciono `firstOrNull` como alternativa equivalente.

## kc-def-03 require y sus tests {tema=validar,tests dificultad=2 ancla=testing/index.md}

En tu función `topN(lista, n)` la primera línea es `require(n > 0) { "n debe ser mayor que 0" }`. Explica qué hace, qué ocurre si `n` vale 0 y cómo comprueba un test ese comportamiento.

### Respuesta modelo

`require(condición) { mensaje }` es una **precondición**: comprueba que los argumentos son válidos antes de hacer nada. Si la condición es verdadera, no hace nada y la función sigue. Si es **falsa**, lanza `IllegalArgumentException` con el mensaje de la lambda.

Con `n = 0`, `0 > 0` es falso, así que la función termina con `IllegalArgumentException: n debe ser mayor que 0` y nunca llega al *pipeline*.

Con `kotlin.test` se comprueba con `assertFailsWith<IllegalArgumentException> { topN(lista, 0) }`: el test pasa **solo si** el bloque lanza esa excepción, y falla si no lanza nada o lanza otra distinta.

Es preferible a un `if (n <= 0) throw IllegalArgumentException(…)` porque expresa la intención en una línea y se lee como «exijo que…».

### Cotejo

- Explico que la condición de `require` es lo que **debe cumplirse** (lanza si es falsa).
- Nombro la excepción: `IllegalArgumentException`, con el mensaje de la lambda.
- Explico cómo lo comprueba el test con `assertFailsWith`.
- Digo que la validación va al principio, antes de calcular nada.

## kc-def-04 ¿Por qué copy()? {tema=inmutable dificultad=2 ancla=23-data-classes.md}

Tu función `registrarDevolucion(prestamo)` devuelve `prestamo.copy(devuelto = true)` en lugar de cambiar el campo del préstamo. ¿Por qué? ¿Qué le pasa al objeto original? ¿Qué comprobaría un test?

### Respuesta modelo

Las propiedades de la *data class* son `val`: el objeto es **inmutable** y no se puede cambiar `prestamo.devuelto`. `copy(devuelto = true)` crea un **objeto nuevo** con todos los campos iguales salvo el que indico, y la función lo devuelve.

El original no cambia. Así, quien tenga una referencia al préstamo antiguo no ve cambios inesperados, y no hay efectos secundarios ocultos: la función solo «devuelve» y no «modifica». Esto facilita los tests y es la misma idea que se usa en Android con el estado de la interfaz.

Un test comprobaría las dos cosas: que el resultado tiene `devuelto == true` y que el préstamo original sigue con `devuelto == false`.

Un error típico es llamar a `copy()` y no usar lo que devuelve: el resultado se pierde y la función devuelve el objeto sin cambios.

### Cotejo

- Explico que `copy()` crea un objeto nuevo y que el original no cambia.
- Relaciono el uso de `copy()` con las propiedades `val` (inmutabilidad).
- Indico qué comprobaría el test (el resultado cambia y el original no).
- Menciono el error de no usar el valor que devuelve `copy()`.

## kc-def-05 when sin else sobre un tipo sellado {tema=inmutable dificultad=2 ancla=26-sealed-classes.md}

Tu función `mostrar(resultado: ResultadoOperacion)` usa `when (resultado)` con una rama `is` por cada subtipo y **sin `else`**. ¿Por qué compila sin `else`? ¿Qué pasaría si mañana añades un tercer subtipo `Pendiente`? ¿Por qué no conviene poner un `else` «por si acaso»?

### Respuesta modelo

`ResultadoOperacion` es una `sealed interface`: el compilador conoce **todos** sus subtipos, porque solo se pueden declarar en el mismo módulo y paquete. Si el `when` cubre todos con `is Exito ->` e `is Error ->`, es **exhaustivo** y no necesita `else`.

Si añado `Pendiente`, el `when` deja de ser exhaustivo y el código **no compila** hasta que añada su rama. El compilador me señala cada sitio que hay que actualizar.

Con un `else`, ese aviso desaparece: el caso nuevo caería en silencio en el `else` y podría mostrar algo incorrecto sin que nadie se entere.

Además, en cada rama `is` hay *smart cast*: dentro de `is Error ->` puedo leer `resultado.motivo` directamente.

### Cotejo

- Explico que `sealed` hace que el compilador conozca todos los subtipos (`when` exhaustivo).
- Digo que al añadir un subtipo el código deja de compilar y eso es una ventaja.
- Explico por qué un `else` oculta ese aviso.
- Menciono el *smart cast* en cada rama.

## kc-def-06 Cómo trabajas con TDD {tema=tests dificultad=1 ancla=testing/index.md}

Te dan un proyecto con un servicio cuyos métodos tienen `TODO("Pendiente de implementar")` y una clase de tests completa, toda en rojo. Explica **cómo trabajas**, paso a paso, hasta dejarlo en verde.

### Respuesta modelo

1. **Leo los tests antes de programar**. Cada test es un requisito: el nombre dice qué se espera, y los datos y el `assertEquals(esperado, real)` dicen exactamente qué valor debe salir, incluidos los casos límite (lista vacía, `null`, `n = 0`…).

2. **Voy de método en método**, ejecutando solo sus tests. Empiezo por el más sencillo.

3. **Rojo → verde**: escribo la implementación más simple que haga pasar esos tests. Si falla, leo el mensaje: `Fail` con `expected:<…> but was:<…>` es un resultado incorrecto; `Error` es una excepción (un `TODO` sin implementar, un `first` sin coincidencias…).

4. **Refactorizo** con los tests en verde: cambio bucles por un *pipeline*, extraigo lo repetido… y vuelvo a ejecutar para comprobar que sigue en verde.

5. **No modifico los tests** para que pasen: son la especificación. Al final ejecuto **todos** a la vez para confirmar que ningún cambio ha roto otro método.

### Cotejo

- Empiezo leyendo los tests como especificación (nombre, datos, valor esperado).
- Trabajo de forma incremental: un método o un test cada vez.
- Distingo `Fail` (valor incorrecto) de `Error` (excepción) al leer los resultados.
- Incluyo la fase de refactorización con los tests en verde.
- Digo que no se cambian los tests y que al final se ejecutan todos.

## kc-def-07 map o flatMap {tema=ordenar dificultad=2 ancla=42-listas.md}

Cada `Pedido` tiene una lista de `lineas`. Para sumar las unidades de todos los pedidos usas `pedidos.flatMap { it.lineas }`. ¿Qué devolvería `pedidos.map { it.lineas }` y por qué no te sirve? ¿Qué hace exactamente `flatMap`?

### Respuesta modelo

`map { it.lineas }` transforma cada pedido en su lista de líneas, así que el resultado es una **lista de listas**: `List<List<Linea>>`, con una lista interior por pedido. Sobre eso no puedo hacer directamente `groupBy { it.producto }`, porque cada elemento es una lista, no una línea.

`flatMap { it.lineas }` hace lo mismo y además **aplana** el resultado: concatena todas las listas interiores en una sola `List<Linea>`. Equivale a `map { it.lineas }.flatten()`.

Con todas las líneas en una única lista ya puedo agrupar por producto y sumar las unidades.

### Cotejo

- Digo que `map` devuelve una lista de listas (`List<List<Linea>>`).
- Explico que `flatMap` transforma y aplana en una sola lista.
- Menciono la equivalencia con `map` + `flatten()`.
- Relaciono el tipo resultante con lo que necesito hacer después (agrupar o sumar).

## kc-def-08 ¿Qué devuelve groupBy? {tema=agrupar dificultad=2 ancla=43-maps.md#groupby}

En tu solución escribes `ventas.groupBy { it.vendedor }.mapValues { (_, lista) -> lista.sumOf { it.importe } }`. Explica qué tipo devuelve cada una de las dos operaciones, qué es `(_, lista)` y qué otra forma hay de **contar** elementos por clave.

### Respuesta modelo

`groupBy { it.vendedor }` devuelve un `Map<String, List<Venta>>`: cada clave es un vendedor y su valor, la **lista** de sus ventas. Mantiene el orden en que aparece cada clave por primera vez.

`mapValues { … }` recorre las entradas del mapa y cambia cada valor por lo que devuelve la lambda, sin tocar las claves. Aquí cada lista pasa a ser la suma de sus importes, y el resultado es un `Map<String, Double>`.

`(_, lista)` desestructura cada entrada del mapa: el primer componente es la clave, que no necesito y por eso uso `_`, y el segundo es el valor.

Para **contar** existe una forma directa: `groupingBy { it.vendedor }.eachCount()`, que da un `Map<String, Int>` sin crear las listas intermedias. Equivale a `groupBy { … }.mapValues { it.value.size }`.

### Cotejo

- Indico que `groupBy` devuelve un `Map` de clave a **lista** de elementos.
- Explico que `mapValues` cambia los valores y conserva las claves, y digo el tipo final.
- Explico la desestructuración `(_, lista)`.
- Menciono `groupingBy { … }.eachCount()` para contar.

## kc-def-09 Interpreta un test en rojo {tema=tests dificultad=1 ancla=testing/index.md}

Al ejecutar los tests obtienes estas dos líneas. Explica qué significa cada una y qué revisarías en tu código en cada caso.

```text
Fail: ordenaDeMayorAMenor: expected:<[Sara, Ana, Luis]> but was:<[Luis, Ana, Sara]>
Error: codigoInexistenteDevuelveNull: Collection contains no element matching the predicate.
```

### Respuesta modelo

**`Fail`**: el test ha llegado al `assertEquals` y el valor no coincide. `expected` es lo que pedía el test y `but was`, lo que devolvió mi función. Aquí los nombres son los correctos pero **en orden inverso**, así que revisaría la ordenación: seguramente uso `sortedBy` donde hacía falta `sortedByDescending`.

**`Error`**: el test no ha llegado a comprobar nada, porque mi código **lanzó una excepción**. El mensaje es el de `NoSuchElementException`, que lanza `first { … }` cuando ningún elemento cumple la condición. Como el test espera `null`, cambiaría `first` por `find` o `firstOrNull`.

En general: un `Fail` es un resultado incorrecto (comparo `expected` con `but was` para ver en qué se diferencian) y un `Error` es una excepción (un `TODO` sin implementar, un `first` sin coincidencias, un `require` que no se cumple…).

### Cotejo

- Distingo `Fail` (valor distinto) de `Error` (excepción).
- Explico qué son `expected` y `but was`.
- Deduzco la causa del primero (orden invertido: `sortedBy` en lugar de `sortedByDescending`).
- Deduzco la causa del segundo (`first` sin coincidencias) y propongo `find` o `firstOrNull`.

## kc-def-10 ¿Por qué un pipeline y no un bucle? {tema=ordenar dificultad=1 ancla=42-listas.md}

Un compañero resuelve «nombres de los productos con stock, ordenados por precio» con un `for`, una `mutableListOf` y un `if`. Tú usas `filter`, `sortedBy` y `map`. Explica qué ventajas tiene tu versión.

### Respuesta modelo

Mi versión es **declarativa**: cada paso dice *qué* quiero (filtrar los que tienen stock, ordenar por precio, quedarme con el nombre) y no *cómo* recorrer la lista. Se lee de arriba abajo en el mismo orden que el enunciado.

No uso **estado mutable**: no hay una lista auxiliar que se va rellenando ni variables que cambian dentro del bucle. Cada operación devuelve una colección nueva y la original no se modifica, así que hay menos sitios donde equivocarse (olvidar un `add`, ordenar la lista equivocada…).

Cada operación es una pieza **probada y reutilizable** de la biblioteca estándar, y el compilador comprueba los tipos entre pasos: si pongo el `map` antes del `sortedBy { it.precio }`, ni siquiera compila.

Por último, el resultado es una expresión que puedo devolver directamente con `=`, lo que hace la función más corta y fácil de testear.

### Cotejo

- Explico que el pipeline describe *qué* se quiere, en el orden del enunciado.
- Menciono que no hay estado mutable ni listas auxiliares, y que la original no cambia.
- Digo que el compilador comprueba los tipos entre pasos.
- Relaciono la ventaja con la facilidad de leer y testear el código.

## kc-def-11 ¿Por qué no usas !!? {tema=nulos dificultad=2 ancla=14-null-safety.md}

En tu función `nombreDelSocio(socios, codigo): String` escribes `socios.find { it.codigo == codigo }?.nombre ?: "desconocido"`. Un compañero propone `socios.find { it.codigo == codigo }!!.nombre`. Explica qué hace cada operador de tu versión y por qué la otra es peor.

### Respuesta modelo

`find` devuelve `Socio?`: puede no haber ningún socio con ese código.

- `?.nombre` es una **llamada segura**: si el socio existe, lee su nombre; si es `null`, no lanza nada y toda la expresión vale `null`.
- `?: "desconocido"` es el operador **Elvis**: si lo de la izquierda es `null`, usa el valor por defecto. Así la función siempre devuelve un `String` válido.

`!!` le dice al compilador «confía en mí, no es nulo». Si me equivoco, lanza `NullPointerException` en tiempo de ejecución: es justo el error que el sistema de tipos de Kotlin intenta evitar. Un test con un código inexistente terminaría en `Error`.

Solo tendría sentido `!!` si fuera imposible que el valor fuese nulo, y aun así es mejor expresarlo con una comprobación clara (`requireNotNull` o un `?: error(…)` con mensaje).

### Cotejo

- Digo que `find` devuelve un tipo anulable.
- Explico `?.` (llamada segura) y `?:` (valor por defecto).
- Explico que `!!` lanza `NullPointerException` si el valor es nulo.
- Relaciono el problema con un test de un caso inexistente.

## kc-def-12 ¿Qué tests añadirías? {tema=tests,validar dificultad=2 ancla=testing/index.md}

Tu función `mediaDe(notas: List<Double>): Double` solo tiene un test, con `listOf(6.0, 8.0)` y resultado `7.0`. ¿Qué otros tests añadirías y por qué? Indica qué esperaría cada uno.

### Respuesta modelo

Un único caso «normal» no garantiza nada en los **casos límite**, que es donde suelen estar los errores:

1. **Lista vacía**: `average()` daría `NaN`. Decidiría qué debe devolver (por ejemplo, `0.0`) y lo fijaría con un test `assertEquals(0.0, mediaDe(emptyList()))`.

2. **Un solo elemento**: la media de `listOf(9.5)` es `9.5`. Comprueba que no hay errores al dividir.

3. **Media con decimales**: `listOf(7.0, 8.0)` debe dar `7.5`. Detecta una división entera por error.

4. **Valores no válidos**, si el enunciado los prohíbe (por ejemplo, notas negativas o mayores que 10): un test con `assertFailsWith<IllegalArgumentException>` comprobaría que la función los rechaza con `require`.

Cada test tendría un nombre que diga qué comprueba, como `listaVaciaDevuelveCero`, para que un fallo se entienda sin leer el código.

### Cotejo

- Incluyo el caso de la lista vacía y explico el problema del `NaN`.
- Incluyo al menos otro caso límite (un elemento, decimales…).
- Propongo un test de validación con `assertFailsWith` si hay valores no válidos.
- Indico el valor esperado de cada test y uso nombres descriptivos.
