# Programación Asíncrona con Corrutinas en Kotlin

En el desarrollo de aplicaciones móviles, la **concurrencia asíncrona** es un requisito innegociable. Una aplicación móvil debe realizar operaciones que toman tiempo (descargar imágenes, consultar una API REST, leer una base de datos local SQLite/Room) sin **congelar jamás la pantalla** ni bloquear la interacción del usuario a 60 o 120 fotogramas por segundo.

Históricamente en Java y Android se utilizaban hilos manuales (`Thread`), manejadores (`Handler`), `AsyncTask` o complejas librerías de callbacks reactivos (`RxJava`). Kotlin revolucionó este panorama introduciendo las **corrutinas** (*Coroutines*): una solución elegante y ligera que permite escribir **código asíncrono no bloqueante con la misma sencillez y legibilidad que el código secuencial síncrono**.

---

## 1. La Analogía del Camarero: ¿Por qué bloquear un hilo es fatal?

Imagina un restaurante concurrido:

- **El Hilo Principal (*Main Thread* o Hilo de UI):** Es el **único camarero** del restaurante. Su trabajo vital es escuchar al usuario (toques en la pantalla, gestos, teclado) y redibujar los componentes visuales.

- **La Tarea Pesada:** Es un pedido complejo (por ejemplo, descargar el catálogo de juegos desde un servidor).

### El Enfoque Bloqueante (Sin Corrutinas)

Si el camarero toma el pedido, se mete a la cocina y se queda allí de pie 4 segundos esperando a que termine la máquina de café:

- Durante esos 4 segundos, **nadie atiende el comedor**.

- Si un cliente intenta pulsar un botón, la app no responde.

- Si el hilo principal lleva unos 5 segundos sin responder a un toque, Android muestra el temido diálogo del sistema **ANR (Application Not Responding)**, que ofrece al usuario esperar o cerrar la app. Casi todos la cierran.

### El Enfoque con Corrutinas (No Bloqueante)

Con corrutinas, el camarero pasa la comanda a la cocina y, en lugar de quedarse esperando, **apunta en qué punto se quedó y vuelve a la sala a seguir atendiendo**. Cuando la cocina termina, el camarero retoma ese pedido justo donde lo dejó y lleva el plato a la mesa. No ha hecho falta contratar a otro camarero: es **el mismo hilo**, que no se queda parado.

Esa es la idea clave de este tema: **suspender no es irse a otro hilo, es apartarse del hilo mientras se espera**.

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-hilo-principal.svg"
<figcaption>El mismo hilo principal en los dos casos. Con <code>Thread.sleep</code> deja de pintar y de responder; con <code>delay</code> sigue pintando mientras la corrutina espera.</figcaption>
</figure>

### Pruébalo: no bloquees el hilo principal

El móvil tiene una animación y un contador que puedes pulsar en todo momento. Elige cómo se hace la carga y pulsa «Cargar»: mira si la animación se congela y si el contador responde.

<div class="cpg" data-cpg="mainthread"></div>

---

## 2. Corrutinas vs Hilos Tradicionales (*Threads*)

A menudo se confunden, pero su coste en recursos es drásticamente distinto:

| Característica | Hilo Tradicional (`Thread` del SO) | Corrutina de Kotlin |
| :--- | :--- | :--- |
| **Peso en memoria** | **Pesado** (consume ~1 MB de memoria de pila por hilo) | **Ultraligero** (consume unos pocos bytes en memoria) |
| **Creación** | Muy costosa (requiere intervención del kernel del SO) | Prácticamente instantánea (gestionada en espacio de usuario) |
| **Escalabilidad** | Crear 5.000 hilos colapsa la memoria de un teléfono móvil (`OutOfMemoryError`). | Puedes lanzar **100.000 corrutinas** simultáneamente sin problema. |
| **Concepto clave** | "Hilos de hardware/SO" | "Hilos virtuales cooperativos" que se ejecutan sobre un grupo de hilos reales. |

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-hilos.svg"
<figcaption>Una corrutina solo ocupa un hilo mientras está haciendo algo. Al suspenderse, el hilo pasa a ejecutar otra.</figcaption>
</figure>

---

## 3. Funciones de Suspensión (`suspend fun`)

El bloque de construcción fundamental de las corrutinas es la palabra clave **`suspend`**. Para entender qué problema resuelve, vamos a programar **la misma tarea varias veces**, y cada intento nacerá del fallo del anterior.

La tarea es corriente en cualquier app que inicia sesión:

1. Autenticar al usuario (`login`), que devuelve un `token`.

2. Con ese `token`, descargar su perfil (`getProfile`).

3. Con el `id` del perfil, descargar su lista de amigos (`getFriends`).

4. Con la lista, actualizar la pantalla (`actualizarUI`).

Cada paso necesita el resultado del anterior, y los tres primeros van por la red: supongamos que tardan un segundo cada uno.

### 3.1. Primer intento: código secuencial

Es lo primero que escribiría cualquiera, porque es como razonamos: una línea detrás de otra, y cada una espera a la anterior.

```kotlin
val token = login(usuario, clave)
val perfil = getProfile(token)
val amigos = getFriends(perfil.id)
actualizarUI(amigos)
```

Se lee perfectamente. El problema es **dónde se queda esperando**: cada llamada retiene el hilo hasta que llega la respuesta. Si este código se ejecuta en el hilo principal, es el camarero del apartado 1 plantado en la cocina durante tres segundos.

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-secuencial-bloquea.svg"
<figcaption>Mientras las tres llamadas esperan a la red, el hilo principal no puede hacer nada más: la pantalla se congela y los toques se ignoran.</figcaption>
</figure>

!!! info "Android ni siquiera te deja intentarlo"

    Si una llamada hace una petición de red bloqueante en el hilo principal, Android lanza `NetworkOnMainThreadException`. El sistema te obliga a sacar ese trabajo de ahí.

### 3.2. Segundo intento: llevarlo a otro hilo

Si el problema es ocupar el hilo principal, la idea natural es abrir otro hilo para esperar. Es como **contratar a un segundo camarero** solo para quedarse en la cocina.

```kotlin
fun cargarAmigos(): List<Amigo> {
    Thread {
        val token = login(usuario, clave)
        val perfil = getProfile(token)
        val amigos = getFriends(perfil.id)
        actualizarUI(amigos) // ❌ No estamos en el hilo principal
        // ¿Cómo le entrego «amigos» a quien me llamó?
    }.start()

    return ??? // ❌ Aquí el hilo acaba de arrancar: aún no hay amigos
}
```

La pantalla ya no se congela, pero aparecen dos problemas nuevos:

- **No puedes devolver el resultado.** `start()` retorna de inmediato, así que `cargarAmigos()` llega a su `return` cuando el otro hilo apenas ha empezado.

- **No puedes tocar la interfaz desde ahí.** La interfaz debe actualizarse desde el hilo principal. Hay que encontrar la forma de volver a él con el resultado.

Las dos cosas se resuelven con lo mismo: que quien hace el trabajo **nos avise cuando termine**.

### 3.3. Tercer intento: un callback

Un **callback** (o *listener*) es un objeto o una función que le entregas a una operación para que te llame cuando acabe. Es el mismo mecanismo que un `onClick`. La función ya no devuelve el resultado: lo pasa a `onSuccess` más adelante.

```kotlin
interface LoginCallback {
    fun onSuccess(token: String)
    fun onError(e: Exception)
}

println("Antes")
login(usuario, clave, object : LoginCallback {
    override fun onSuccess(token: String) {
        println("Token: $token")
    }
    override fun onError(e: Exception) { /* ... */ }
})
println("Después")
```

`login` se encarga de esperar en otro hilo y de avisarnos en el hilo principal. El camarero deja la comanda y vuelve a la sala, así que la pantalla sigue viva. Pero fíjate en qué orden se imprime todo:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-callback-orden.svg"
<figcaption><code>login()</code> solo pone la petición en marcha y retorna. El código de <code>onSuccess</code> se ejecuta más tarde, cuando llega la respuesta.</figcaption>
</figure>

Este es el cambio de mentalidad importante: **el código ya no se ejecuta en el orden en que está escrito**. Y tiene una consecuencia directa: todo lo que necesite el `token` **tiene que escribirse dentro de `onSuccess`**, porque en ningún otro sitio se sabe que ya existe.

### 3.4. Encadenar callbacks: la Pirámide de la Perdición

Con un solo callback todavía se puede leer. Pero nuestra tarea tiene tres pasos, y el segundo necesita el `token`: debe ir dentro del `onSuccess` del primero. El tercero, dentro del `onSuccess` del segundo. Cada paso añade un nivel más:

```kotlin
login(usuario, clave, object : LoginCallback {
    override fun onSuccess(token: String) {
        getProfile(token, object : ProfileCallback {
            override fun onSuccess(perfil: Perfil) {
                getFriends(perfil.id, object : FriendsCallback {
                    override fun onSuccess(amigos: List<Amigo>) {
                        actualizarUI(amigos)
                    }
                    override fun onError(e: Exception) {
                        mostrarError(e)
                    }
                })
            }
            override fun onError(e: Exception) {
                mostrarError(e)
            }
        })
    }
    override fun onError(e: Exception) {
        mostrarError(e)
    }
})
```

Si giras la cabeza, la sangría dibuja una pirámide tumbada. De ahí el nombre: **Pirámide de la Perdición** (*Pyramid of Doom*), o **infierno de los callbacks** (*callback hell*).

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-piramide.svg"
<figcaption>Cada color es un paso de la tarea, metido dentro del anterior. Lo que queríamos hacer queda en el centro, y los errores salen en orden inverso al de los pasos.</figcaption>
</figure>

No es solo una cuestión de estética. La pirámide causa tres problemas reales:

1. **Cuesta seguir el flujo.** Tres pasos que se piensan en línea recta se leen hacia dentro, y cada error queda lejos del paso al que corresponde.

2. **Los errores se dispersan.** Cada nivel necesita su `onError`. Y `try-catch` no sirve de nada, porque cuando el fallo ocurre ese bloque ya ha terminado:

    ```kotlin
    try {
        login(usuario, clave, callback) // Retorna enseguida: aquí no ha fallado nada
    } catch (e: Exception) {
        // Si el servidor falla un segundo después, este catch ya no existe
    }
    ```

3. **No hay una forma sencilla de cancelar.** Si el usuario sale de la pantalla mientras el paso 2 está en marcha, nada detiene la cadena: los pasos siguen ejecutándose y el callback intenta actualizar una pantalla que ya no existe. Eso gasta red y batería, retiene memoria (*memory leak*) y puede cerrar la app.

### 3.5. La solución: `suspend`

Una función marcada con **`suspend`** puede pausar su ejecución (*suspenderse*) y reanudarse más tarde **sin bloquear el hilo** y **sin que escribas ningún callback**. Solo cambia su declaración:

```kotlin
suspend fun login(usuario: String, clave: String): String { /* ... */ }
suspend fun getProfile(token: String): Perfil { /* ... */ }
suspend fun getFriends(id: Int): List<Amigo> { /* ... */ }
```

Vuelven a **devolver su resultado con normalidad**. Y la tarea queda así (cómo se lanza una corrutina desde la interfaz lo verás en el apartado 4):

```kotlin
try {
    val token = login(usuario, clave)
    val perfil = getProfile(token)
    val amigos = getFriends(perfil.id)
    actualizarUI(amigos)
} catch (e: Exception) {
    mostrarError(e)
}
```

Compáralo con el primer intento del apartado 3.1: **son las mismas cuatro líneas**. Volvemos a escribir como razonamos, y `try-catch` vuelve a funcionar.

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-piramide-vs-suspend.svg"
<figcaption>Cada banda une un paso de la pirámide (aquí escrita con lambdas para abreviar) con su línea equivalente. Los tres <code>onError</code> se convierten en un solo <code>catch</code>.</figcaption>
</figure>

La diferencia con el apartado 3.1 no se ve en el código, sino **en lo que hace el hilo** mientras tanto. Compara esta figura con la de 3.1: mismas líneas y mismos tres segundos.

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-suspension-tiempo.svg"
<figcaption>Cada llamada ocupa el hilo un instante y la corrutina se aparta mientras la red trabaja. El hilo principal sigue pintando y atendiendo toques.</figcaption>
</figure>

### 3.6. ¿Qué ocurre por debajo?

Volvamos al camarero, que apunta en qué punto se quedó y vuelve a la sala. Eso mismo hace la corrutina:

1. Al llegar a `login()`, la corrutina **se suspende**: guarda en memoria en qué línea va y el valor de sus variables.

2. El hilo principal queda **libre** para seguir pintando y atendiendo toques.

3. Cuando llega la respuesta, la corrutina **se reanuda** en ese punto, con el resultado ya asignado a `token`, y pasa a la línea siguiente.

¿Te suena? «Cuando termines, continúa por aquí» es justo lo que hacía un callback. **El callback no ha desaparecido: lo genera el compilador por ti**. Al ver `suspend`, Kotlin transforma el código para que el resto de la función sea lo que se ejecuta al volver. Tú escribes líneas seguidas y él se encarga de trocearlas.

!!! warning "`suspend` no hace que algo deje de bloquear por arte de magia"

    `suspend` permite pausar la función, pero solo se libera el hilo si lo que hay dentro también suspende, como `delay` o las funciones de librerías preparadas para corrutinas. Un `Thread.sleep` dentro de una función `suspend` **sigue bloqueando el hilo**. Para el trabajo bloqueante está `withContext`, que verás en el [apartado 5](#5-despachadores-en-android-dispatchers).

### 3.7. Resumen de los enfoques

| Característica | Secuencial bloqueante | Callbacks | Funciones `suspend` |
| :--- | :--- | :--- | :--- |
| **¿Congela la pantalla?** | Sí, en el hilo principal. | No. | No. |
| **Estructura del código** | Lineal, de arriba abajo. | Anidada en pirámide. | Lineal, de arriba abajo. |
| **Resultado** | Se devuelve con `return`. | Llega como parámetro de `onSuccess`. | Se devuelve con `return`. |
| **Errores** | `try-catch` normal. | Un `onError` en cada nivel. | `try-catch` normal. |
| **Cancelación** | No aplica: el hilo está ocupado hasta que acaba. | Manual y propensa a fugas de memoria. | Automática con su `CoroutineScope` (apartados 4 y 6). |

### Ejemplo Práctico: Declaración de una Función `suspend`

```kotlin
import kotlinx.coroutines.delay

// 'delay' es una función de suspensión propia de Kotlin: pausa la corrutina sin congelar el hilo
suspend fun descargarDatosJuegos(): String {
    println("-> Iniciando descarga de catálogo en segundo plano...")
    delay(2000) // Simula una espera de red de 2 segundos de forma NO bloqueante
    return "Catálogo: 120 videojuegos disponibles"
}
```

!!! warning "Regla de compilación de funciones suspend"
    Una función `suspend` **solo puede ser invocada desde dentro de otra función de suspensión o desde el cuerpo de un constructor de corrutina (*Coroutine Builder*)**. Si intentas llamarla desde una función normal ordinaria, el compilador lanzará un error indicando que falta el contexto de corrutina.

---

## 4. Ámbitos y Constructores: `CoroutineScope` y *Builders*

En la sección anterior vimos que una función marcada con `suspend` puede pausarse y reanudarse sin bloquear el hilo. Pero surge una duda inmediata: **¿cómo y desde dónde llamamos a una función `suspend` por primera vez si estamos en código normal (por ejemplo, al pulsar un botón o al iniciar la app)?**

Para resolver esto, Kotlin utiliza dos conceptos inseparables: el **`CoroutineScope`** (el ámbito de vida) y los **Constructores de Corrutinas (*Coroutine Builders*)**.

---

### 4.1. ¿Qué es un `CoroutineScope` y cuál es su relación con los *Builders*?

Un **`CoroutineScope`** representa el **ámbito de vida** y la frontera de control de las corrutinas. 

> 👨‍👧‍👦 **Analogía Pedagógica:**  
> Piensa en el `CoroutineScope` como en una **oficina o departamento** de una empresa:
> 
> - La oficina (`CoroutineScope`) delimita el horario y el espacio de trabajo.
> - Los empleados que trabajan dentro son las **corrutinas**.
> - Si la oficina cierra sus puertas (por ejemplo, el usuario sale de la pantalla en la app), **todos los trabajos y tareas en marcha dentro de esa oficina se cancelan automáticamente**. Esto evita que sigan consumiendo batería, memoria o datos de red en segundo plano (principio de **Concurrencia Estructurada**).

Los **constructores (*builders*)**, como `launch` o `async`, son las herramientas o métodos que te permiten **crear un nuevo empleado (lanzar una corrutina)** dentro de esa oficina.

Técnicamente en Kotlin, `launch` y `async` son **funciones de extensión** de `CoroutineScope`:

```kotlin
// Solo pueden llamarse sobre un objeto CoroutineScope:
fun CoroutineScope.launch(...): Job
fun <T> CoroutineScope.async(...): Deferred<T>
```

Por eso, el compilador **no te permite** llamar a `launch { }` al aire de forma estática; siempre debes tener un `CoroutineScope` de referencia:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-arbol.svg"
<figcaption>Las corrutinas forman un árbol dentro de su <i>scope</i>. Lo verás con detalle en el apartado 6.</figcaption>
</figure>

En Android no necesitas inventar scopes globales; utilizas los que provee el propio sistema adaptados al ciclo de vida:

- **`viewModelScope`:** Vive mientras el ViewModel esté activo en memoria.
- **`lifecycleScope`:** Atado al ciclo de vida de una pantalla o Activity.
- **`rememberCoroutineScope()`:** Para lanzar corrutinas desde eventos visuales en Jetpack Compose (por ejemplo, al pulsar un botón).

---

### 4.2. `launch`: Lanzar y Olvidar (*Fire and Forget*)

El constructor **`launch`** arranca una corrutina nueva, que avanza a la vez que el código que la lanzó, y devuelve inmediatamente un objeto **`Job`** con el que puedes esperarla (`join()`) o cancelarla (`cancel()`).

!!! info "`launch` no significa «otro hilo»"
    La corrutina se ejecuta en el hilo que diga su *dispatcher* (apartado 5). Un `viewModelScope.launch { }` se ejecuta en el **hilo principal**, y no pasa nada: mientras espera una función `suspend`, se aparta y deja el hilo libre.

Se utiliza cuando la corrutina tiene como objetivo realizar una acción en segundo plano y **no necesitamos que devuelva un dato directo al código que la invocó**.

**Casos típicos de uso:**

- Enviar analíticas o eventos a Firebase.
- Registrar una línea de log.
- Guardar o actualizar un registro en la base de datos local SQLite/Room.
- Actualizar el estado visual de la pantalla en un ViewModel (`_uiState.value = ...`).

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    println("1. Antes de lanzar la corrutina")

    // launch arranca la corrutina y el código de abajo sigue sin esperarla:
    val ticketTrabajo: Job = launch {
        println("2. Guardando datos en base de datos local...")
        delay(1000) // Simula la escritura en disco
        println("4. Guardado finalizado con éxito")
    }

    println("3. El código principal sigue adelante de inmediato")

    // Si queremos esperar explícitamente a que termine, usamos join() sobre el Job:
    ticketTrabajo.join()
    println("5. Fin del proceso")
}
```

**Salida en consola:**
```text
1. Antes de lanzar la corrutina
3. El código principal sigue adelante de inmediato
2. Guardando datos en base de datos local...
4. Guardado finalizado con éxito
5. Fin del proceso
```

---

### 4.3. Si una función `suspend` devuelve un valor, ¿cómo se recoge?

Aquí surge la duda más habitual: **"Si tengo una función `suspend` que devuelve un valor (como un `String`, un `Int` o un `Usuario`), ¿tengo que usar obligatoriamente `async`?"**

La respuesta es: **NO. En la inmensa mayoría de los casos cotidianos, NO necesitas `async`.**

Dentro de cualquier corrutina iniciada con `launch`, puedes invocar directamente a una función `suspend` y recoger su resultado en una variable normal con un simple `=` de asignación. La corrutina se pausará de forma transparente mientras espera el resultado y se reanudará cuando esté listo, **sin congelar la interfaz ni bloquear ningún hilo**.

#### Ejemplo: Llamada secuencial directa con valor de retorno

```kotlin
import kotlinx.coroutines.*

// Esta función suspend devuelve un valor (un String):
suspend fun descargarNombreUsuario(): String {
    delay(1000) // Simula una petición de red
    return "Mario_Bros"
}

// Esta función también devuelve un valor:
suspend fun consultarMonedas(usuario: String): Int {
    delay(500) // Simula una consulta a base de datos
    return 150
}

fun main() = runBlocking {
    // Dentro de una corrutina simplemente llamamos y asignamos:
    launch {
        println("Iniciando consulta...")

        val nombre = descargarNombreUsuario() // Espera 1 seg sin bloquear y guarda el resultado
        val monedas = consultarMonedas(nombre) // Espera 0.5 seg y guarda el resultado

        println("Usuario cargado: $nombre tiene $monedas monedas.")
    }
}
```

**Salida en consola** (la última línea aparece 1,5 segundos después de la primera):

```text
Iniciando consulta...
Usuario cargado: Mario_Bros tiene 150 monedas.
```

> 💡 **Regla de Oro en Android:**  
> Más del 90% del código que escribirás en tus ViewModels funciona exactamente así: un `viewModelScope.launch { ... }` dentro del cual llamas a funciones `suspend` del Repositorio de forma secuencial, limpia y directa.

---

### 4.4. ¿Cuándo y por qué usamos entonces `async` y `await`?

Si ya podemos recoger datos con llamadas directas, **¿para qué demonios sirve `async`?**

La respuesta es una sola palabra: **PARALELISMO**.

Imagina que para mostrar la pantalla de perfil necesitas consultar dos cosas distintas:

1. El catálogo de juegos (tarda 2 segundos).
2. La lista de amigos conectados (tarda 2 segundos).

Si las llamas secuencialmente una tras otra, el usuario esperará **4 segundos** (2 + 2). Pero esas dos peticiones son totalmente independientes entre sí: **¡podrían realizarse las dos a la vez!**

Para eso existe **`async`**: para disparar múltiples tareas a la vez en paralelo y esperar los resultados cuando los necesites.

#### ¿Cómo funciona `async`?

1. **`async { ... }`** arranca la tarea de inmediato, a la vez que el resto del código, y te devuelve un objeto **`Deferred<T>`** (una "promesa" de que habrá un resultado de tipo `T` en el futuro).
2. **`.await()`** es la función que te permite recoger ese valor. Si la tarea aún está en curso cuando llamas a `.await()`, la corrutina se pausa hasta que el dato esté listo.

#### Ejemplo Comparativo de Rendimiento

```kotlin
import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

suspend fun descargarCatalogo(): String {
    delay(2000) // Tarda 2 segundos
    return "Catálogo de 50 juegos"
}

suspend fun descargarAmigos(): String {
    delay(2000) // Tarda 2 segundos
    return "3 amigos conectados"
}

fun main() = runBlocking {
    println("--- Enfoque Concurrente con async en paralelo ---")
    val tiempo = measureTimeMillis {
        // 1. Disparamos ambas peticiones A LA VEZ en segundo plano:
        val diferidoCatalogo: Deferred<String> = async { descargarCatalogo() }
        val diferidoAmigos: Deferred<String> = async { descargarAmigos() }

        // 2. Esperamos los resultados:
        val catalogo = diferidoCatalogo.await()
        val amigos = diferidoAmigos.await()

        println("Resultado: $catalogo | $amigos")
    }

    println("Tiempo total transcurrido: $tiempo ms (¡Solo ~2 segundos, no 4!)")
}
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-async.svg"
<figcaption>Las tres formas de pedir dos datos que tardan 2 segundos cada uno. Solo la segunda los pide a la vez.</figcaption>
</figure>

---

### 4.5. El Gran Error de Principiante: El "Falso Paralelismo"

Un fallo muy habitual entre los alumnos es escribir esto:

```kotlin
// ❌ ERROR TÍPICO: Llamar a .await() inmediatamente
val catalogo = async { descargarCatalogo() }.await() // Se detiene y espera 2 segundos aquí...
val amigos = async { descargarAmigos() }.await()     // ...y no arranca esta hasta que termina la primera

// ¡Tiempo total = 4 segundos! Has perdido todas las ventajas del paralelismo.
```

**La regla para usar `async` correctamente es:**

1. Dispara primero **todas** las tareas con `async`.

2. Espera y recoge los resultados con `.await()` **al final**.

### Pruébalo: `async`, `await` y cancelación

Elige cómo se piden las tres descargas y pulsa «Ejecutar». Mientras se ejecutan, puedes cancelar el *scope* o hacer que falle una de ellas (lo explicamos en el apartado 6).

<div class="cpg" data-cpg="coroutines"></div>

---

### 4.6. ¿Qué es `runBlocking` y por qué lo vemos en los ejemplos?

En casi todos los ejemplos de código verás `fun main() = runBlocking { ... }`.

- En una aplicación de consola estándar, cuando la función `main` llega al final, el programa se cierra inmediatamente, matando cualquier corrutina que estuviera en curso en segundo plano.
- **`runBlocking`** es un constructor especial que **bloquea el hilo actual del sistema** hasta que la corrutina y todas sus hijas terminen. Así evitamos que el programa de consola se cierre antes de tiempo.

!!! danger "⚠️ Peligro: ¡PROHIBIDO usar `runBlocking` en la interfaz de Android!"
    En Android **nunca** debes usar `runBlocking` en el hilo principal ni en componentes visuales.
    
    Si usas `runBlocking` en Android, congelarás la pantalla por completo, el usuario no podrá interactuar y el sistema operativo forzará el cierre de la app mostrando el error **ANR (Application Not Responding)**.
    
    En Android siempre debes usar constructores no bloqueantes como `viewModelScope.launch { ... }` o `LaunchedEffect`.

---

### 4.7. Resumen Práctico de Decisión

| Situación | Qué debes usar | Ejemplo |
| :--- | :--- | :--- |
| **Quiero lanzar una tarea sin esperar su resultado (guardar en BD, analítica, actualizar UI)** | `launch` | `viewModelScope.launch { repo.guardar(item) }` |
| **Quiero llamar a una función `suspend` y recoger su resultado** | Llamada directa dentro de un `launch` | `viewModelScope.launch { val data = repo.cargar() }` |
| **Tengo dos o más peticiones independientes y quiero ejecutarlas a la vez para ahorrar tiempo** | `async` + `.await()` | `val d1 = async { ... }; val d2 = async { ... }; d1.await(); d2.await()` |
| **Estoy en una función `main()` de consola** | `runBlocking` | `fun main() = runBlocking { ... }` |
| **Estoy escribiendo un test de algo que usa corrutinas** | `runTest` | `` @Test fun `carga los datos`() = runTest { ... } `` (ver [3C.4](../../03/c-arquitectura/3c.4-testing.md)) |





## 5. Despachadores en Android (*Dispatchers*)

Un **Dispatcher** indica en qué grupo de hilos (*Thread Pool*) debe ejecutarse una corrutina determinada:

| Despachador | Diseñado para | Ejemplos en Android |
| :--- | :--- | :--- |
| **`Dispatchers.Main`** | Operaciones exclusivas de Interfaz de Usuario (hilo principal). | Actualizar estados de Jetpack Compose, animaciones, navegación. |
| **`Dispatchers.IO`** | Operaciones de Entrada/Salida **bloqueantes** (que esperan sin hacer cálculo). | Leer o escribir ficheros con `java.io`, librerías antiguas que no tienen funciones `suspend`. |
| **`Dispatchers.Default`** | Tareas intensivas en cómputo de procesador. | Parseo de JSONs masivos, ordenación de listas gigantescas, compresión o filtros de imagen. |

### Cambio de Contexto Seguro con `withContext`
Permite cambiar temporalmente de hilo para una operación pesada y regresar automáticamente al hilo original:

```kotlin
import kotlinx.coroutines.*

suspend fun cargarCatalogoYActualizarUi() {
    // 1. Cambiamos al hilo de Entrada/Salida para descargar
    val datos = withContext(Dispatchers.IO) {
        println("Descargando en hilo de red: ${Thread.currentThread().name}")
        delay(1500)
        listOf("Metroid", "Pokemon", "Zelda")
    }

    // 2. Al salir de withContext, volvemos automáticamente al hilo original (Main)
    println("Actualizando pantalla en Compose con: $datos")
}
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/corrutinas/corr-withcontext.svg"
<figcaption><code>withContext</code> lleva la corrutina a otro hilo solo durante su bloque y la devuelve al de antes.</figcaption>
</figure>

!!! tip "Las funciones `suspend` de Room y Retrofit ya son seguras"
    Google recomienda que toda función `suspend` sea **segura para el hilo principal** (*main-safe*): que se pueda llamar desde Main sin bloquearlo. Las funciones `suspend` de **Room** y **Retrofit** ya lo son, porque cambian de hilo por dentro. Por eso en un ViewModel basta con `viewModelScope.launch { repositorio.cargar() }`, **sin** `withContext(Dispatchers.IO)`. Usa `withContext` solo cuando tú escribas código bloqueante o cálculo pesado.

---

## 6. Cancelación de Corrutinas

Cancelar es tan importante como lanzar: si el usuario sale de una pantalla, no tiene sentido seguir descargando sus datos. En Android casi nunca cancelas a mano, porque lo hace el *scope* (`viewModelScope` se cancela al destruirse el ViewModel), pero conviene entender cómo funciona.

### 6.1. `cancel()` y la concurrencia estructurada

Cada `launch` y cada `async` devuelve un `Job`, y cada `Job` es **hijo** del *scope* o de la corrutina que lo lanzó. Así se forma un árbol con dos reglas:

- **La cancelación baja:** cancelar un padre cancela a todos sus hijos (y a los hijos de estos).
- **Los errores suben:** si un hijo falla, el error sube al padre, que **cancela a los hermanos** y lo propaga hacia arriba.

Es el árbol de la figura del apartado 4.1, y lo puedes probar con los botones «Cancelar el scope» y «Falla una tarea» del playground del apartado 4.5.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val job = launch {
        repeat(10) { i ->
            println("Descargando parte $i…")
            delay(500)
        }
    }

    delay(1300)
    println("El usuario pulsa «Cancelar»")
    job.cancel()   // pide la cancelación…
    job.join()     // …y espera a que termine de verdad
    println("Descarga cancelada")
}
```

**Salida en consola:**

```text
Descargando parte 0…
Descargando parte 1…
Descargando parte 2…
El usuario pulsa «Cancelar»
Descarga cancelada
```

### 6.2. La cancelación es cooperativa

Cancelar una corrutina **no la detiene a la fuerza**: solo le pide que pare. La corrutina se detiene en el siguiente **punto de suspensión** (`delay`, `withContext`, una llamada `suspend` de Room o Retrofit…), donde se lanza una `CancellationException` que la hace terminar.

Un bucle de cálculo que nunca se suspende **no se entera** de que lo han cancelado. Para que coopere, comprueba de vez en cuando si sigue activo:

```kotlin
val job = launch(Dispatchers.Default) {
    for (i in 1..1_000_000) {
        ensureActive()          // si la han cancelado, termina aquí
        calcularPaso(i)         // cálculo sin ningún punto de suspensión
    }
}
```

!!! danger "No te tragues la `CancellationException`"
    La cancelación viaja como una excepción, `CancellationException`. Si escribes `catch (e: Exception)`, también la capturas y la corrutina **sigue funcionando aunque la hayan cancelado**. Captura excepciones concretas (`IOException`, `HttpException`…) o, si capturas `Exception`, vuelve a lanzar la de cancelación:

    ```kotlin
    try {
        val datos = repositorio.cargar()
    } catch (e: CancellationException) {
        throw e                                  // deja que la cancelación siga su camino
    } catch (e: Exception) {
        _uiState.value = UiState.Error(e.message)
    }
    ```

---

## 7. Manejo de Errores con `try-catch`

A diferencia de los callbacks antiguos donde las excepciones se perdían entre hilos, en las corrutinas puedes capturar errores de operaciones asíncronas con la sintaxis clásica de `try-catch`:

```kotlin
import kotlinx.coroutines.*

suspend fun descargarConFalloSeguro() {
    try {
        withContext(Dispatchers.IO) {
            delay(1000)
            throw java.io.IOException("Error 503: Servidor de GameVault no disponible")
        }
    } catch (e: java.io.IOException) {
        println("Error capturado limpiamente: ${e.message}")
        // Aquí actualizamos el UiState a CatalogoUiState.Error(...)
    }
}
```

Dónde se recoge el error depende de cómo se lanzó la corrutina:

- **Llamada `suspend` directa:** con un `try-catch` alrededor de la llamada, como en el ejemplo.
- **`async`:** la excepción se guarda y se lanza al llamar a `.await()`, así que el `try-catch` va alrededor del `await()`.
- **`launch`:** si nadie la captura dentro, la excepción sube al padre y cancela a los hermanos (apartado 6.1). Por eso el `try-catch` se escribe **dentro** del `launch`.

---

## 8. Retos Prácticos

### 🟢 Reto 1: Saludo con retardo (Básico)
Crea una función de suspensión `saludarConRetardo(nombre: String, tiempoMs: Long)` que imprima "Iniciando espera...", espere el tiempo indicado usando `delay()` y luego imprima "¡Hola, $nombre!". Pruébala dentro de un bloque `runBlocking`.

??? tip "Ver solución"
    ```kotlin
    import kotlinx.coroutines.*

    suspend fun saludarConRetardo(nombre: String, tiempoMs: Long) {
        println("Iniciando espera para $nombre...")
        delay(tiempoMs)
        println("¡Hola, $nombre tras ${tiempoMs}ms!")
    }

    fun main() = runBlocking {
        saludarConRetardo("Mario", 1000)
    }
    ```

### 🟡 Reto 2: Descargas concurrentes con `async` (Intermedio)
Simula la carga de un juego descargando en paralelo sus texturas (demora 1.5 s) y sus sonidos (demora 1.0 s). Mide el tiempo total demostrando que no supera los 1.6 segundos al ejecutarse en paralelo.

??? tip "Ver solución"
    ```kotlin
    import kotlinx.coroutines.*

    suspend fun cargarTexturas(): String {
        delay(1500)
        return "Texturas 4K"
    }

    suspend fun cargarSonidos(): String {
        delay(1000)
        return "Efectos SFX"
    }

    fun main() = runBlocking {
        val inicio = System.currentTimeMillis()

        val texturas = async { cargarTexturas() }
        val sonidos = async { cargarSonidos() }

        println("Recursos listos: ${texturas.await()} y ${sonidos.await()}")
        val totalMs = System.currentTimeMillis() - inicio
        println("Tiempo total en paralelo: $totalMs ms (menos de 2 segundos)")
    }
    ```

---

!!! tip "Practícalo en el codelab"

    Pon en práctica este tema con tests que te corrigen al momento: [Codelab de Kotlin, Pasos 5 y 6](./codelabs/05-suspend-async.md).
