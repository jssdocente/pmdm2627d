# **Paso 6: cancelación y errores**

La red falla y los usuarios cambian de idea. Aquí la descarga pasa a dar siempre un estado con el que trabajar, y se puede detener en cualquier momento.

- **Dónde trabajas:** `paso6_cancelacion/Seguridad.kt`

- **Tests:** `paso6_cancelacion/SeguridadTest.kt` (10 tests)

- **Apuntes:** [Cancelación](../51-corrutinas.md#6-cancelacion-de-corrutinas) y [Manejo de errores](../51-corrutinas.md#7-manejo-de-errores-con-try-catch)

---

## 1. La idea en un minuto

Con `suspend`, `try-catch` vuelve a funcionar como siempre. Solo hay una trampa, y es la más importante de este paso: **la cancelación se comunica con una excepción**, `CancellationException`. Si un `catch (e: Exception)` la captura y sigue adelante, la corrutina ya no se detiene como debe. Por eso se vuelve a lanzar:

```kotlin
try {
    trabajar()
} catch (e: CancellationException) {
    throw e // Cancelar no es un error: se deja pasar
} catch (e: Exception) {
    tratarError(e)
}
```

---

## 2. Tu tarea

Todo se hace en `Seguridad.kt`. En este paso se llama directamente a `servidor.descargar(nombre)`, sin pedir permiso antes. Los tests usan un `ServidorFalso` configurado para fallar con `roto.zip`, y cada llamada tarda un segundo:

| Llamada | Qué ocurre |
| :--- | :--- |
| `servidor.descargar("a.zip")` | Devuelve `"/descargas/a.zip"` |
| `servidor.descargar("roto.zip")` | Lanza `IOException("No se pudo descargar roto.zip")` |

### 2.1. `descargaSegura`

```kotlin
suspend fun descargaSegura(servidor: Servidor, nombre: String): EstadoDescarga
```

Convierte el resultado de la descarga en un estado:

| Qué ocurre | Qué hace | Ejemplo |
| :--- | :--- | :--- |
| La descarga va bien | Devuelve `Completada(ruta)` | `"a.zip"` → `Completada("/descargas/a.zip")` |
| Salta una excepción | Devuelve `Fallida(mensaje de la excepción)` | `"roto.zip"` → `Fallida("No se pudo descargar roto.zip")` |
| Cancelan la corrutina | Vuelve a lanzar la `CancellationException` | No devuelve ningún estado |

### 2.2. `descargaConLimite`

```kotlin
suspend fun descargaConLimite(servidor: Servidor, nombre: String, limiteMs: Long): EstadoDescarga
```

Pone un tiempo máximo a la descarga, que tarda un segundo:

| `limiteMs` | Qué ocurre | Devuelve |
| :--- | :--- | :--- |
| `2000` | Le da tiempo | `Completada("/descargas/a")` |
| `500` | No le da tiempo | `Fallida("Tiempo agotado")` |

??? tip "Pista"

    `withTimeoutOrNull` devuelve el resultado del bloque, o `null` si se acaba el tiempo. Combínalo con `?:`.

### 2.3. `conReintentos`

```kotlin
suspend fun <T> conReintentos(veces: Int, bloque: suspend () -> T): T
```

Ejecuta `bloque` hasta un máximo de `veces` intentos, y es **genérica**: sirve para cualquier tipo de resultado. Con `veces = 3`:

| Qué ocurre | Intentos | Resultado |
| :--- | :--- | :--- |
| El primero falla y el segundo va bien | 2 | Devuelve el valor del segundo, sin hacer un tercero |
| Fallan los tres | 3 | Deja salir la excepción del último |
| Lanza `CancellationException` | 1 | Deja salir la excepción, sin reintentar |

??? tip "Pista"

    Usa `repeat(veces - 1)` con un `try` que hace `return bloque()` y un `catch` vacío para los fallos. Fuera del `repeat`, un último `return bloque()` sin `try` deja salir la excepción.

### 2.4. `iniciarCancelable`

```kotlin
fun CoroutineScope.iniciarCancelable(
    servidor: Servidor,
    nombre: String,
    alCambiar: (EstadoDescarga) -> Unit,
): Job
```

Lanza la descarga con `launch`, devuelve su `Job` y avisa de cada cambio llamando a `alCambiar`. Estos son los avisos, en orden:

| Qué ocurre | Avisos que recibe `alCambiar` |
| :--- | :--- |
| La descarga termina | `Descargando(0)` y luego `Completada("/descargas/a")` |
| Cancelan el `Job` a mitad | `Descargando(0)` y luego `Fallida("Cancelada")` |

Tras avisar de la cancelación, vuelve a lanzar la `CancellationException` para que la corrutina termine como cancelada.

---

## 3. Solución

[`Seguridad.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.06-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso6_cancelacion/Seguridad.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.05-fin...c0.06-fin)

**Siguiente:** [Paso 7: `Flow` y `StateFlow`](./07-flow-stateflow.md).
