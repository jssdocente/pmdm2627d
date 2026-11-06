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

Usa `servidor.descargar(nombre)` directamente: `ServidorFalso` falla con los nombres que le indiques.

1. **`descargaSegura`:** devuelve `Completada(ruta)` o `Fallida(mensaje)`, y deja pasar la cancelación.

2. **`descargaConLimite`:** si tarda más de `limiteMs`, devuelve `Fallida("Tiempo agotado")`. Usa `withTimeoutOrNull`.

3. **`conReintentos(veces, bloque)`:** una función **genérica** que reintenta hasta `veces`. Si la última falla, deja salir la excepción. La cancelación no se reintenta.

4. **`iniciarCancelable`:** lanza con `launch`. Avisa con `Descargando(0)` y luego con `Completada(ruta)`. Si la cancelan, avisa con `Fallida("Cancelada")` y vuelve a lanzar la excepción.

??? tip "Pista: `descargaConLimite`"

    `withTimeoutOrNull` devuelve el resultado del bloque, o `null` si se acaba el tiempo. Combínalo con `?:`.

??? tip "Pista: `conReintentos`"

    Usa `repeat(veces - 1)` con un `try` que hace `return bloque()` y un `catch` vacío para los fallos. Fuera del `repeat`, un último `return bloque()` sin `try` deja salir la excepción.

---

## 3. Solución

[`Seguridad.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.06-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso6_cancelacion/Seguridad.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.05-fin...c0.06-fin)

**Siguiente:** [Paso 7: `Flow` y `StateFlow`](./07-flow-stateflow.md).
