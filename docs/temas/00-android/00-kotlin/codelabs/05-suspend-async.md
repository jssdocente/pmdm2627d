# **Paso 5: de callbacks a `suspend`, y en paralelo**

Descargar un fichero requiere tres llamadas encadenadas al servidor: pedir permiso, obtener el enlace y descargar. Es el mismo problema que la pirámide de los apuntes, y aquí lo vas a resolver tú.

- **Dónde trabajas:** `paso5_suspend/Descargas.kt`

- **Para leer:** `paso5_suspend/PiramideCallbacks.kt`

- **Tests:** `paso5_suspend/DescargasTest.kt` (5 tests)

- **Apuntes:** [Funciones de suspensión](../51-corrutinas.md#3-funciones-de-suspension-suspend-fun) y [`async` y `await`](../51-corrutinas.md#44-cuando-y-por-que-usamos-entonces-async-y-await)

---

## 1. Lee primero la pirámide

Así queda la tarea con callbacks, en `PiramideCallbacks.kt`:

```kotlin
servidor.pedirPermiso(nombre, { token ->
    servidor.obtenerEnlace(token, { enlace ->
        servidor.descargar(enlace, { ruta ->
            alTerminar(ruta)
        }, { e -> alFallar(e) })
    }, { e -> alFallar(e) })
}, { e -> alFallar(e) })
```

El `Servidor` del paquete `modelo` hace lo mismo con funciones `suspend`, que devuelven su resultado con normalidad. Sus respuestas están en la tarea, más abajo.

---

## 2. La idea en un minuto

| Herramienta | Qué hace | Cuándo |
| :--- | :--- | :--- |
| Llamada directa | Espera sin bloquear y devuelve el valor | Un paso **depende** del anterior |
| `launch` | Lanza una corrutina y devuelve un `Job` | Empezar algo **sin esperar** un resultado |
| `async` y `await` | Lanza una corrutina que **devuelve un valor** | Varias tareas **independientes** a la vez |
| `coroutineScope` | Crea un ámbito y espera a todos sus hijos | Lanzar corrutinas **desde una función `suspend`** |

!!! tip "Los tests no esperan de verdad"

    `runTest` usa un reloj virtual: las esperas se saltan, pero `currentTime` sigue contándolas. Por eso un test puede comprobar que algo «tarda 3 segundos» y acabar al instante.

---

## 3. Tu tarea

Todo se hace en `Descargas.kt`. Los tests usan un `ServidorFalso` en el que cada llamada tarda un segundo y devuelve esto:

| Llamada | Devuelve |
| :--- | :--- |
| `servidor.pedirPermiso("a.zip")` | `"token-a.zip"` |
| `servidor.obtenerEnlace("token-a.zip")` | `"enlace-a.zip"` |
| `servidor.descargar("enlace-a.zip")` | `"/descargas/a.zip"` |

### 3.1. `descargarUna`

```kotlin
suspend fun descargarUna(servidor: Servidor, nombre: String): String
```

Escribe la misma tarea que la pirámide, en línea recta:

1. Pide permiso con el `nombre` y guarda el token.

2. Obtiene el enlace con ese token.

3. Descarga con ese enlace y devuelve la ruta.

**Comprobación:** `descargarUna(servidor, "a.zip")` devuelve `"/descargas/a.zip"` y tarda 3 s, porque son tres llamadas seguidas.

### 3.2. `descargarVarias`

```kotlin
suspend fun descargarVarias(servidor: Servidor, nombres: List<String>): List<String>
```

Descarga todos los ficheros **a la vez** y devuelve las rutas en el mismo orden que los nombres. Reutiliza `descargarUna`.

**Comprobación:** con `["a", "b", "c"]` devuelve `["/descargas/a", "/descargas/b", "/descargas/c"]` y tarda **3 s, no 9 s**.

??? tip "Pista"

    Dentro de `coroutineScope { }`, usa `map` para crear un `async` por cada nombre y termina con `awaitAll()`. Si llamas a `await()` dentro del propio `map`, irán una detrás de otra y el test de los 3 s fallará.

### 3.3. `descargarEnSegundoPlano`

```kotlin
fun CoroutineScope.descargarEnSegundoPlano(
    servidor: Servidor,
    nombre: String,
    alTerminar: (String) -> Unit,
): Job
```

Lanza la descarga con `launch` y retorna **sin esperarla**. Es una extensión de `CoroutineScope` porque `launch` necesita un *scope*:

- **Al llamarla:** devuelve el `Job` de la corrutina al momento, y `alTerminar` aún no se ha ejecutado.

- **Cuando acaba la descarga:** llama a `alTerminar` con la ruta, por ejemplo `alTerminar("/descargas/a")`.

---

## 4. Solución

[`Descargas.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.05-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso5_suspend/Descargas.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.04-fin...c0.05-fin)

**Más práctica:** [Corrutinas y flows](../ejercicios/05-concurrencia-corrutinas.md). **Siguiente:** [Paso 6: cancelación y errores](./06-cancelacion-errores.md).
