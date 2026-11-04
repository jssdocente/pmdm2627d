---
bloque: 11
titulo: Corrutinas y Flow
apuntes: temas/00-android/00-kotlin/51-corrutinas.md
---

## kt-co-001 {dificultad=2 tipo=salida ancla=42-launch-lanzar-y-olvidar-fire-and-forget}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() {
    runBlocking {
        launch {
            delay(100)
            println("B")
        }
        println("A")
    }
    println("C")
}
```

### A ✔

```text
A
B
C
```

> Correcto. `launch` inicia una corrutina y **no espera** por ella: se imprime `A` enseguida. `runBlocking` no termina hasta que acaban todas sus corrutinas hijas, así que `C` sale después de `B`.

### B

```text
B
A
C
```

> `launch` no bloquea: el código que va detrás (`println("A")`) se ejecuta mientras la corrutina está en `delay(100)`.

### C

```text
A
C
B
```

> `runBlocking` **bloquea** hasta que terminan sus hijas (concurrencia estructurada). `C` no puede salir antes que `B`.

### D

```text
A
C
```

> La corrutina lanzada no se pierde: pertenece al ámbito de `runBlocking`, que la espera antes de terminar.

## kt-co-002 {dificultad=2 tipo=salida ancla=43-si-una-funcion-suspend-devuelve-un-valor-como-se-recoge}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val precio = async { delay(50); 20 }
    val cantidad = async { delay(10); 3 }
    println(precio.await() * cantidad.await())
}
```

### A ✔

`60`

> Correcto. Las dos tareas `async` se ejecutan **en paralelo** y cada una devuelve un `Deferred`. `await()` espera y obtiene su resultado: 20 × 3 = 60.

### B

`23`

> Se multiplican los resultados (`*`), no se suman.

### C

Algo como `DeferredCoroutine{Active}@…`

> Eso se imprimiría con `precio * cantidad` sin `await()`, aunque ni siquiera compilaría. `await()` extrae el valor.

### D

Error de compilación: `async` solo puede devolver `Unit`.

> Eso es `launch`, que devuelve un `Job` sin resultado. `async` existe precisamente para devolver un valor.

## kt-co-003 {dificultad=1 tipo=compila error ancla=3-funciones-de-suspension-suspend-fun}

¿Qué ocurre al compilar este programa?

```kotlin
import kotlinx.coroutines.*

suspend fun cargar(): String {
    delay(10)
    return "ok"
}

fun main() {
    println(cargar())
}
```

### A ✔

Error de compilación: una función `suspend` solo se puede llamar desde una corrutina u otra función `suspend`.

> Correcto. `main` es una función normal. Habría que llamar a `cargar()` dentro de un constructor de corrutinas (`runBlocking { }`, `launch { }`…) o declarar `suspend fun main()`.

### B

Compila e imprime `ok` tras 10 ms.

> El compilador no permite llamar a una función que puede **suspenderse** desde un contexto que no sabe suspenderse.

### C

Compila, pero `delay` lanza una excepción al ejecutarse fuera de una corrutina.

> El error se detecta antes de ejecutar: es el compilador el que comprueba dónde se llaman las funciones `suspend`.

### D

Compila, pero no imprime nada porque nadie espera a la corrutina.

> `cargar()` no crea ninguna corrutina: es una función suspendible. Y tal y como está, el código ni siquiera compila.

## kt-co-004 {dificultad=1 tipo=concepto ancla=2-corrutinas-vs-hilos-tradicionales-threads}

En una app Android, una corrutina va a leer un fichero grande o a consultar una base de datos. ¿Qué *dispatcher* es el adecuado para ese trabajo?

### A ✔

`Dispatchers.IO`

> Correcto. `IO` está pensado para operaciones de entrada/salida que pasan tiempo **esperando** (red, disco, base de datos). Usa un *pool* de hilos amplio y no bloquea el hilo principal.

### B

`Dispatchers.Main`

> El hilo principal dibuja la interfaz. Si se bloquea leyendo un fichero, la app se congela y Android puede mostrar el error ANR. `Main` solo debe usarse para actualizar la UI.

### C

`Dispatchers.Default`

> `Default` está optimizado para trabajo de **CPU** (ordenar listas grandes, cálculos…), con tantos hilos como núcleos. Para esperas de E/S, lo adecuado es `IO`.

### D

Ninguno: las corrutinas nunca bloquean, así que da igual.

> Las funciones `suspend` no bloquean, pero una lectura de fichero clásica sí bloquea el hilo donde se ejecuta. Por eso hay que llevarla a `IO`.

## kt-flow-005 {dificultad=2 tipo=salida ancla=52-flows.md#2-creacion-y-consumo-basico-de-un-flow}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    flow {
        emit(1)
        emit(2)
        emit(3)
    }
        .map { it * it }
        .filter { it > 1 }
        .collect { print("$it ") }
}
```

### A ✔

`4 9`

> Correcto. Cada valor emitido pasa por `map` (al cuadrado: 1, 4, 9) y luego por `filter` (mayores que 1: 4, 9). `collect` los recibe uno a uno.

### B

`1 4 9`

> `filter { it > 1 }` se aplica **después** de `map`, así que descarta el 1.

### C

`2 3`

> El filtro se aplica sobre los valores ya transformados por `map` (1, 4, 9), no sobre los originales.

### D

No imprime nada: falta llamar a `start()` para que el flujo empiece.

> Un `Flow` es frío y empieza a emitir cuando alguien llama a `collect`. No existe ningún `start()`.

## kt-flow-006 {dificultad=3 tipo=salida ancla=52-flows.md#flujos-frios-cold-flows}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val f = flow {
        println("inicio")
        emit(1)
    }
    f.collect { println(it) }
    f.collect { println(it) }
}
```

### A ✔

```text
inicio
1
inicio
1
```

> Correcto. Un `flow { }` es **frío**: el bloque productor se ejecuta **desde el principio** cada vez que alguien lo recolecta. Dos `collect` significan dos ejecuciones.

### B

```text
inicio
1
1
```

> Eso sería un flujo caliente (como `SharedFlow`) que se comparte entre suscriptores. Un `flow { }` repite todo el bloque en cada `collect`.

### C

```text
inicio
1
```

> Un `Flow` no se «gasta» al recolectarlo, como un iterador. Se puede recolectar todas las veces que se quiera.

### D

```text
inicio
inicio
1
1
```

> Los dos `collect` se ejecutan **uno tras otro** (`collect` suspende hasta que el flujo termina), no a la vez.

## kt-flow-007 {dificultad=1 tipo=salida ancla=52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose}

¿Qué imprime este código?

```kotlin
import kotlinx.coroutines.flow.MutableStateFlow

val contador = MutableStateFlow(0)
contador.value = 5
contador.value += 1
println(contador.value)
```

### A ✔

`6`

> Correcto. Un `StateFlow` siempre guarda **el valor actual**, accesible con `.value`. Cada asignación lo sustituye: 0 → 5 → 6.

### B

`0`

> `value` es modificable en un `MutableStateFlow`: no se queda con el valor inicial.

### C

`[0, 5, 6]`

> `StateFlow` no acumula el historial: solo guarda el **último** valor. Los observadores reciben cada cambio, pero `.value` es siempre uno.

### D

Error de compilación: hay que usar `emit()` para cambiar el valor.

> `emit()` también existe, pero es `suspend`. Fuera de una corrutina, lo habitual es asignar `.value` directamente.

## kt-co-008 {dificultad=2 tipo=salida ancla=42-launch-lanzar-y-olvidar-fire-and-forget}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(200)
        println("lenta")
    }
    launch {
        delay(100)
        println("rápida")
    }
    println("lanzadas")
}
```

### A ✔

```text
lanzadas
rápida
lenta
```

> Correcto. Las dos corrutinas se ejecutan **a la vez** (de forma concurrente) y `launch` no espera. Primero se imprime `lanzadas`, y después cada corrutina termina según su `delay`.

### B

```text
lenta
rápida
lanzadas
```

> Las corrutinas no se ejecutan una detrás de otra en el orden en que se lanzan: corren de forma concurrente.

### C

```text
lanzadas
lenta
rápida
```

> La segunda espera menos (100 ms), así que termina antes aunque se lanzase después.

### D

```text
lanzadas
```

> `runBlocking` espera a que terminen sus corrutinas hijas antes de acabar.

## kt-co-009 {dificultad=1 tipo=salida ancla=32-la-solucion-con-suspend-codigo-asincrono-con-sintaxis-secuencial}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

suspend fun doble(n: Int): Int {
    delay(10)
    return n * 2
}

fun main() = runBlocking {
    val a = doble(1)
    val b = doble(2)
    println(a + b)
}
```

### A ✔

`6`

> Correcto. Las funciones `suspend` se llaman como funciones normales y se ejecutan **en orden**: se espera a `doble(1)` (2) y luego a `doble(2)` (4). El código asíncrono se lee como si fuese secuencial.

### B

`0`

> `a` y `b` reciben el valor ya calculado: llamar a una función `suspend` espera su resultado.

### C

Error de compilación: hay que usar `await()` para obtener el resultado.

> `await()` es para el `Deferred` que devuelve `async`. Una función `suspend` devuelve directamente su valor.

### D

`3`

> Cada llamada devuelve el **doble** de su argumento: 2 + 4.

## kt-co-010 {dificultad=2 tipo=salida ancla=42-launch-lanzar-y-olvidar-fire-and-forget}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val tarea = launch {
        delay(50)
        println("tarea")
    }
    tarea.join()
    println("después")
}
```

### A ✔

```text
tarea
después
```

> Correcto. `launch` devuelve un `Job`, y `join()` **suspende** hasta que esa corrutina termina. Por eso `después` sale en segundo lugar.

### B

```text
después
tarea
```

> Eso pasaría sin `join()`. Con él, el código espera a que la tarea acabe.

### C

```text
después
```

> `runBlocking` espera a sus hijas, y además `join()` espera explícitamente.

### D

Error de compilación: un `Job` no tiene `join()`.

> `join()` es precisamente la forma de esperar a un `Job` sin resultado.

## kt-co-011 {dificultad=3 tipo=salida ancla=42-launch-lanzar-y-olvidar-fire-and-forget}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val job = launch {
        repeat(5) { i ->
            println("paso $i")
            delay(100)
        }
    }
    delay(250)
    job.cancel()
    println("cancelado")
}
```

### A ✔

```text
paso 0
paso 1
paso 2
cancelado
```

> Correcto. La corrutina imprime en 0, 100 y 200 ms. A los 250 ms se cancela, mientras está en `delay`. Como `delay` es un punto de suspensión cancelable, la corrutina se detiene ahí y no llega a imprimir `paso 3`.

### B

```text
paso 0
paso 1
paso 2
paso 3
paso 4
cancelado
```

> `cancel()` detiene la corrutina en su siguiente punto de suspensión: no espera a que termine.

### C

```text
cancelado
```

> La corrutina empieza enseguida y ya ha impreso tres pasos cuando se cancela.

### D

```text
paso 0
paso 1
cancelado
```

> En 250 ms le da tiempo a imprimir en 0, 100 y 200 ms.

## kt-co-012 {dificultad=2 tipo=salida ancla=2-corrutinas-vs-hilos-tradicionales-threads}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val suma = withContext(Dispatchers.Default) {
        (1..4).sum()
    }
    println(suma)
}
```

### A ✔

`10`

> Correcto. `withContext` ejecuta el bloque en otro *dispatcher* (aquí, el de cálculo) y **devuelve su resultado**, suspendiendo mientras tanto. Es la forma habitual de sacar trabajo del hilo principal.

### B

Algo como `DeferredCoroutine{...}`

> `withContext` no devuelve un `Deferred`: devuelve directamente el valor del bloque.

### C

`kotlin.Unit`

> El bloque termina en `(1..4).sum()`, así que devuelve `Int`.

### D

Error de compilación: no se puede devolver un valor desde otro hilo.

> `withContext` está pensado justo para eso: ejecutar en otro contexto y volver con el resultado.

## kt-co-013 {dificultad=2 tipo=concepto ancla=3-funciones-de-suspension-suspend-fun}

¿Qué significa que una función esté marcada como `suspend`?

### A ✔

Que puede **pausar** su ejecución (por ejemplo, en un `delay` o una petición de red) **sin bloquear el hilo**, y reanudarse después.

> Correcto. Mientras está suspendida, el hilo queda libre para otras tareas (como dibujar la interfaz). Por eso solo se puede llamar desde una corrutina u otra función `suspend`.

### B

Que se ejecuta automáticamente en un hilo nuevo.

> `suspend` no crea hilos ni elige el hilo de ejecución: eso depende del *dispatcher*.

### C

Que su ejecución se pospone hasta que termina el programa.

> Se ejecuta cuando se llama; simplemente puede pausarse en ciertos puntos.

### D

Que no puede devolver ningún valor.

> Una función `suspend` puede devolver cualquier tipo.

## kt-flow-014 {dificultad=1 tipo=salida ancla=52-flows.md#2-creacion-y-consumo-basico-de-un-flow}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    println(flowOf(1, 2, 3).map { it * 10 }.toList())
}
```

### A ✔

`[10, 20, 30]`

> Correcto. `flowOf` crea un flujo con esos valores, `map` transforma cada uno y `toList()` (un operador terminal) los recolecta todos en una lista.

### B

Algo como `kotlinx.coroutines.flow.FlowKt...@1a2b`

> `toList()` recolecta el flujo; lo que se imprime es la lista resultante.

### C

`[1, 2, 3]`

> El `map` multiplica cada valor por 10 antes de recolectarlos.

### D

Error de compilación: un `Flow` no se puede convertir en lista.

> `toList()` es un operador terminal de `Flow` (y es `suspend`, por eso va dentro de `runBlocking`).

## kt-flow-015 {dificultad=2 tipo=salida ancla=52-flows.md#flujos-frios-cold-flows}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    flow {
        var i = 0
        while (true) emit(i++)
    }
        .take(3)
        .collect { print(it) }
}
```

### A ✔

`012`

> Correcto. El flujo sería infinito, pero `take(3)` deja pasar solo los 3 primeros valores y luego **cancela** el productor. Como los flujos son perezosos y fríos, no se calcula nada de más.

### B

Nunca termina (bucle infinito).

> `take(3)` corta el flujo tras el tercer valor, así que el `while (true)` se detiene.

### C

`123`

> `i++` emite primero el valor y luego incrementa: el primer valor es 0.

### D

Lanza `OutOfMemoryError`.

> El flujo no acumula valores en memoria: se emiten de uno en uno bajo demanda.

## kt-flow-016 {dificultad=2 tipo=salida ancla=52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose}

¿Qué imprime este código?

```kotlin
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update

val puntos = MutableStateFlow(10)
puntos.update { it * 2 }
puntos.update { it + 1 }
println(puntos.value)
```

### A ✔

`21`

> Correcto. `update { }` calcula el nuevo valor a partir del actual de forma **atómica** (segura si varios hilos lo modifican a la vez): 10 → 20 → 21.

### B

`10`

> `update` sí modifica el valor del `StateFlow`.

### C

`11`

> Los dos `update` se aplican en orden: primero se duplica y después se suma 1.

### D

`[10, 20, 21]`

> Un `StateFlow` guarda solo el valor **actual**, no el historial.

## kt-flow-017 {dificultad=2 tipo=compila error ancla=52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose}

¿Qué ocurre al compilar este código?

```kotlin
import kotlinx.coroutines.flow.*

val _estado = MutableStateFlow(0)
val estado: StateFlow<Int> = _estado.asStateFlow()
estado.value = 5
```

### A ✔

Error de compilación: un `StateFlow` es de **solo lectura**; `value` solo se puede asignar en el `MutableStateFlow`.

> Correcto. Es el patrón habitual del ViewModel: el `MutableStateFlow` es privado (`_estado`) y hacia fuera solo se expone el `StateFlow`, para que la interfaz pueda **observar** el estado pero no cambiarlo.

### B

Compila: `asStateFlow()` hace una copia modificable.

> Al revés: `asStateFlow()` devuelve una vista de **solo lectura** del mismo flujo.

### C

Compila, y `_estado.value` pasa a valer 5.

> No llega a compilar: `StateFlow.value` no tiene *setter*.

### D

Compila, pero lanza `UnsupportedOperationException`.

> El error se detecta en compilación.

## kt-flow-018 {dificultad=1 tipo=salida ancla=52-flows.md#2-creacion-y-consumo-basico-de-un-flow}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    flowOf("a", "bb", "ccc")
        .filter { it.length > 1 }
        .map { it.uppercase() }
        .collect { println(it) }
}
```

### A ✔

```text
BB
CCC
```

> Correcto. Los operadores de `Flow` funcionan como los de las colecciones: `filter` descarta `"a"` y `map` pasa el resto a mayúsculas.

### B

```text
A
BB
CCC
```

> `filter { it.length > 1 }` elimina `"a"`, que tiene longitud 1.

### C

```text
bb
ccc
```

> El `map` aplica `uppercase()` a cada valor que pasa el filtro.

### D

No imprime nada: falta llamar a `launch`.

> `collect` ya se está llamando dentro de una corrutina (`runBlocking`).

## kt-co-019 {dificultad=3 tipo=salida ancla=43-si-una-funcion-suspend-devuelve-un-valor-como-se-recoge}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val a = async { delay(100); println("A"); 1 }
    val b = async { delay(50); println("B"); 2 }
    println(a.await() + b.await())
}
```

### A ✔

```text
B
A
3
```

> Correcto. Las dos tareas `async` arrancan a la vez. `B` termina antes (50 ms) e imprime primero. `a.await()` espera a `A` (100 ms), y para entonces `B` ya ha terminado, así que la suma sale enseguida.

### B

```text
A
B
3
```

> Aunque se espera primero a `a`, las dos corrutinas ya están en marcha desde que se crean con `async`, y `B` termina antes.

### C

```text
3
```

> Los `println` de dentro de cada `async` también se ejecutan.

### D

```text
A
3
B
```

> La suma necesita los dos resultados, así que no puede imprimirse antes de que `B` termine.

## kt-co-020 {dificultad=2 tipo=concepto ancla=4-ambitos-y-constructores-coroutinescope-y-builders}

¿Por qué no debe usarse `runBlocking` en el código de una app Android (por ejemplo, en un ViewModel)?

### A ✔

Porque **bloquea el hilo** que lo llama hasta que terminan sus corrutinas. En el hilo principal congelaría la interfaz. Su uso es para `main` de consola y para tests.

> Correcto. En Android se lanzan corrutinas en ámbitos que no bloquean, como `viewModelScope.launch { }`.

### B

Porque no existe en Android.

> Existe (forma parte de `kotlinx.coroutines`), pero no es adecuado para la app.

### C

Porque solo admite una corrutina hija.

> Admite tantas como se quiera; el problema es que bloquea.

### D

Porque no permite llamar a funciones `suspend`.

> Dentro de `runBlocking` sí se pueden llamar.

## kt-co-021 {dificultad=3 tipo=salida ancla=41-que-es-un-coroutinescope-y-cual-es-su-relacion-con-los-builders}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

suspend fun cargar(): String = coroutineScope {
    launch {
        delay(50)
        println("hijo terminado")
    }
    "listo"
}

fun main() = runBlocking {
    println(cargar())
}
```

### A ✔

```text
hijo terminado
listo
```

> Correcto. `coroutineScope` no termina (ni devuelve su valor) hasta que **todas** sus corrutinas hijas han acabado. Es la concurrencia estructurada: ninguna corrutina se queda «suelta».

### B

```text
listo
hijo terminado
```

> El valor `"listo"` es la última expresión, pero `coroutineScope` espera a su hija antes de devolverlo.

### C

```text
listo
```

> La corrutina hija no se pierde: el ámbito la espera.

### D

Error de compilación: `coroutineScope` no puede devolver un valor.

> Devuelve el valor de su última expresión, igual que `run` o `withContext`.

## kt-co-022 {dificultad=2 tipo=salida ancla=el-enfoque-con-corrutinas-no-bloqueante}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() {
    runBlocking {
        launch {
            repeat(3) { print("a"); delay(100) }
        }
        launch {
            delay(50)
            repeat(3) { print("b"); delay(100) }
        }
    }
}
```

### A ✔

`ababab`

> Correcto. Las dos corrutinas se **intercalan** en el mismo hilo. Cada `delay` suspende su corrutina y deja que avance la otra. La primera imprime en 0, 100 y 200 ms, y la segunda en 50, 150 y 250 ms.

### B

`aaabbb`

> `delay` no bloquea el hilo: mientras una corrutina espera, la otra se ejecuta.

### C

`bababa`

> La segunda corrutina empieza con un `delay(50)`, así que la primera `a` sale antes.

### D

No imprime nada, porque `main` termina antes.

> `runBlocking` espera a que terminen sus corrutinas hijas.

## kt-co-023 {dificultad=2 tipo=salida ancla=43-si-una-funcion-suspend-devuelve-un-valor-como-se-recoge}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val tareas = listOf(3, 1, 2).map { n ->
        async {
            delay(10L * n)
            n * n
        }
    }
    println(tareas.awaitAll())
}
```

### A ✔

`[9, 1, 4]`

> Correcto. Se lanzan tres tareas en paralelo y `awaitAll()` espera a todas. Los resultados vuelven **en el orden de la lista**, no en el orden en que terminan.

### B

`[1, 4, 9]`

> Aunque la tarea del 1 termina antes, `awaitAll` respeta el orden de la lista original.

### C

`[3, 1, 2]`

> Cada tarea devuelve el cuadrado de su número.

### D

`14`

> `awaitAll()` devuelve la lista de resultados, no su suma.

## kt-co-024 {dificultad=3 tipo=salida ancla=4-ambitos-y-constructores-coroutinescope-y-builders}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val lenta = withTimeoutOrNull(100) {
        delay(500)
        "hecho"
    }
    val rapida = withTimeoutOrNull(500) {
        delay(50)
        "hecho"
    }
    println("$lenta $rapida")
}
```

### A ✔

`null hecho`

> Correcto. `withTimeoutOrNull` cancela el bloque si tarda más del tiempo indicado y devuelve `null`. La primera tarea necesita 500 ms y solo tiene 100; la segunda termina a tiempo.

### B

`hecho hecho`

> La primera se cancela al pasar 100 ms, antes de terminar su `delay(500)`.

### C

Lanza `TimeoutCancellationException`.

> Esa excepción la lanza `withTimeout`. La variante `OrNull` devuelve `null`.

### D

`null null`

> La segunda termina en 50 ms, dentro de su límite de 500.

## kt-co-025 {dificultad=3 tipo=salida ancla=42-launch-lanzar-y-olvidar-fire-and-forget}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val job = launch {
        try {
            delay(1000)
            println("terminado")
        } finally {
            println("limpieza")
        }
    }
    delay(50)
    job.cancelAndJoin()
    println("fin")
}
```

### A ✔

```text
limpieza
fin
```

> Correcto. Al cancelar, el `delay` lanza una `CancellationException` dentro de la corrutina. El `finally` se ejecuta (es el sitio para liberar recursos) y `terminado` nunca se imprime. `cancelAndJoin` espera a que acabe esa limpieza.

### B

```text
terminado
limpieza
fin
```

> La corrutina se cancela durante el `delay(1000)`, así que no llega a `terminado`.

### C

```text
fin
```

> El bloque `finally` se ejecuta también al cancelar.

### D

```text
fin
limpieza
```

> `cancelAndJoin` espera a que la corrutina termine (incluido el `finally`) antes de continuar.

## kt-co-026 {dificultad=1 tipo=concepto ancla=2-corrutinas-vs-hilos-tradicionales-threads}

En Android, una corrutina ha descargado datos en segundo plano y ahora tiene que **actualizar la interfaz**. ¿En qué *dispatcher* debe hacerlo?

### A ✔

`Dispatchers.Main`

> Correcto. En Android solo el hilo principal puede modificar la interfaz. En un ViewModel, `viewModelScope` ya usa `Main` por defecto, y el trabajo pesado se lleva a `IO` con `withContext`.

### B

`Dispatchers.IO`

> `IO` es para el trabajo de entrada/salida, no para tocar la interfaz.

### C

`Dispatchers.Default`

> `Default` es para cálculos intensivos, no para la interfaz.

### D

Da igual: cualquier hilo puede modificar la interfaz.

> Tocar la interfaz desde otro hilo provoca errores en Android.

## kt-co-027 {dificultad=2 tipo=concepto ancla=41-que-es-un-coroutinescope-y-cual-es-su-relacion-con-los-builders}

¿Qué ventaja tiene lanzar las corrutinas de un ViewModel con `viewModelScope.launch { }`?

### A ✔

Que se **cancelan automáticamente** cuando se destruye el ViewModel, así no quedan tareas trabajando para una pantalla que ya no existe.

> Correcto. Es la concurrencia estructurada aplicada a Android: el ciclo de vida de las corrutinas queda ligado al del ViewModel.

### B

Que se ejecutan siempre en un hilo nuevo.

> `viewModelScope` usa `Dispatchers.Main` por defecto; no crea hilos.

### C

Que siguen ejecutándose aunque se cierre la app.

> Al contrario: se cancelan cuando el ViewModel ya no se necesita.

### D

Que no necesitan funciones `suspend`.

> Dentro de `launch` se usan funciones `suspend` con normalidad.

## kt-co-028 {dificultad=1 tipo=salida ancla=32-la-solucion-con-suspend-codigo-asincrono-con-sintaxis-secuencial}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

suspend fun paso(n: Int) {
    delay(10)
    println("paso $n")
}

fun main() = runBlocking {
    paso(1)
    paso(2)
    println("fin")
}
```

### A ✔

```text
paso 1
paso 2
fin
```

> Correcto. Las llamadas a funciones `suspend` son **secuenciales** por defecto: cada una termina antes de que empiece la siguiente. Para ejecutarlas en paralelo habría que usar `launch` o `async`.

### B

```text
fin
paso 1
paso 2
```

> Llamar a una función `suspend` espera a que termine; no la lanza en segundo plano.

### C

```text
paso 2
paso 1
fin
```

> No hay concurrencia: se ejecutan en el orden del código.

### D

Error de compilación: hay que llamar a `paso` con `launch`.

> Dentro de una corrutina (`runBlocking`) se puede llamar directamente a una función `suspend`.

## kt-flow-029 {dificultad=2 tipo=salida ancla=52-flows.md#2-creacion-y-consumo-basico-de-un-flow}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    flowOf(1, 2)
        .onEach { print("[$it]") }
        .map { it * 2 }
        .collect { print(it) }
}
```

### A ✔

`[1]2[2]4`

> Correcto. Un `Flow` procesa los valores **de uno en uno**: el 1 pasa por `onEach`, `map` y `collect` antes de que empiece el 2. No se procesa primero toda la colección en cada paso.

### B

`[1][2]24`

> Eso pasaría con una `List` (cada operación recorre toda la colección antes de la siguiente). Un `Flow` va valor a valor.

### C

`24`

> `onEach` ejecuta su acción por cada valor, sin modificarlo.

### D

`[2]2[4]4`

> `onEach` está **antes** del `map`, así que ve los valores originales.

## kt-flow-030 {dificultad=2 tipo=salida ancla=52-flows.md#2-creacion-y-consumo-basico-de-un-flow}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    println(flowOf(3, 4, 5).first { it > 3 })
}
```

### A ✔

`4`

> Correcto. `first { }` es un operador terminal: recolecta hasta encontrar el primer valor que cumple la condición, lo devuelve y **cancela** el resto del flujo.

### B

`3`

> El 3 no es mayor que 3.

### C

`[4, 5]`

> `first` devuelve un único valor; filtrar sería `filter`.

### D

`5`

> Devuelve el **primero** que cumple, no el último.

## kt-flow-031 {dificultad=3 tipo=salida ancla=52-flows.md#flujos-frios-cold-flows}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    flow {
        println("emito 1")
        emit(1)
        println("emito 2")
        emit(2)
    }.collect { println("recibo $it") }
}
```

### A ✔

```text
emito 1
recibo 1
emito 2
recibo 2
```

> Correcto. Por defecto, productor y consumidor se ejecutan en la misma corrutina: `emit` **suspende** hasta que el `collect` termina de procesar el valor, y solo entonces continúa el productor.

### B

```text
emito 1
emito 2
recibo 1
recibo 2
```

> El productor no se adelanta: cada `emit` espera a que el valor se procese.

### C

```text
recibo 1
recibo 2
```

> El bloque del `flow` también se ejecuta, e imprime.

### D

No imprime nada, porque un `Flow` es frío.

> Es frío, pero aquí sí se recolecta con `collect`.

## kt-flow-032 {dificultad=3 tipo=concepto ancla=52-flows.md#caracteristicas-clave-de-stateflow}

Un `MutableStateFlow<Int>` vale 5 y le asignas otra vez `5`. ¿Qué ocurre con sus observadores?

### A ✔

No reciben nada: un `StateFlow` solo emite cuando el valor **cambia** (compara con `equals`).

> Correcto. Esta «distinción» automática evita recomposiciones inútiles en Compose. Por eso, si el estado es una `data class`, hay que crear una copia nueva con `copy()` en lugar de modificar el objeto.

### B

Reciben otra vez el 5.

> `StateFlow` descarta los valores iguales al actual.

### C

Se lanza una excepción por valor repetido.

> No hay ninguna excepción: simplemente no se emite.

### D

El `StateFlow` se reinicia a su valor inicial.

> El valor sigue siendo 5.

## kt-flow-033 {dificultad=1 tipo=salida ancla=52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val estado = MutableStateFlow("inicial")
    println(estado.first())
}
```

### A ✔

`inicial`

> Correcto. Un `StateFlow` **siempre tiene un valor**, así que el nuevo observador recibe enseguida el actual. Por eso exige un valor inicial al crearlo.

### B

No termina nunca, porque nadie emite.

> Un `StateFlow` emite su valor actual al empezar a recolectarlo.

### C

`null`

> El valor inicial es `"inicial"`, no `null`.

### D

Lanza `NoSuchElementException`.

> Hay un valor disponible desde el principio.

## kt-flow-034 {dificultad=1 tipo=compila error ancla=52-flows.md#caracteristicas-clave-de-stateflow}

¿Qué ocurre al compilar esta línea?

```kotlin
import kotlinx.coroutines.flow.MutableStateFlow

val contador = MutableStateFlow<Int>()
```

### A ✔

Error de compilación: un `MutableStateFlow` necesita un **valor inicial**.

> Correcto. Un `StateFlow` siempre tiene un estado actual, así que hay que indicarlo al crearlo: `MutableStateFlow(0)`.

### B

Compila y empieza valiendo 0.

> No hay un valor por defecto: hay que indicarlo.

### C

Compila y empieza valiendo `null`.

> El tipo es `Int` (no anulable), y además falta el argumento obligatorio.

### D

Compila, pero lanza una excepción al leer `value`.

> No llega a compilar.

## kt-flow-035 {dificultad=2 tipo=salida ancla=52-flows.md#2-creacion-y-consumo-basico-de-un-flow}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val total = flowOf(1, 2, 3, 4)
        .filter { it % 2 == 0 }
        .map { it * 10 }
        .toList()
        .sum()
    println(total)
}
```

### A ✔

`60`

> Correcto. Pasan el filtro 2 y 4, se multiplican por 10 (20 y 40), y `toList()` los recolecta para sumarlos.

### B

`100`

> El filtro deja solo los pares.

### C

`[20, 40]`

> Después de `toList()` se llama a `sum()`.

### D

Error de compilación: `sum()` no existe en un `Flow`.

> `sum()` se llama sobre la `List` que devuelve `toList()`.

## kt-co-036 {dificultad=2 tipo=salida ancla=42-launch-lanzar-y-olvidar-fire-and-forget}

¿Qué imprime este programa?

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val job = launch { delay(100) }
    println(job.isActive)
    job.join()
    println("${job.isActive} ${job.isCompleted}")
}
```

### A ✔

```text
true
false true
```

> Correcto. Un `Job` informa del estado de su corrutina. Recién lanzada está activa; después de `join()` ha terminado, así que ya no está activa y está completada.

### B

```text
false
false true
```

> Justo después de `launch`, la corrutina ya está activa.

### C

```text
true
true false
```

> `join()` espera a que termine, así que después ya está completada.

### D

Error de compilación: un `Job` no tiene `isActive`.

> `isActive`, `isCompleted` e `isCancelled` son propiedades de `Job`.
