# **Paso 1: estados con tipos sellados**

Una descarga solo puede estar en cuatro estados, y dos de ellos llevan datos propios. Con un `enum` no podrías guardar el progreso de una y el motivo de error de otra. Con un **tipo sellado** sí, y además el compilador conoce todos los casos.

- **Dónde trabajas:** `paso1_sellados/Estados.kt`

- **Tests:** `paso1_sellados/EstadosTest.kt` (6 tests)

- **Apuntes:** [Tipos sellados](../26-sealed-classes.md)

---

## 1. La idea en un minuto

`when` sobre un tipo sellado es **exhaustivo**: no hace falta `else`, y si mañana se añade un estado, el compilador marca cada `when` que no lo trate. Dentro de cada rama, `is` convierte el valor al subtipo (*smart cast*) y puedes usar sus propiedades:

```kotlin
sealed interface Respuesta {
    data object Cargando : Respuesta
    data class Datos(val texto: String) : Respuesta
}

fun longitud(respuesta: Respuesta): Int = when (respuesta) {
    Respuesta.Cargando -> 0
    is Respuesta.Datos -> respuesta.texto.length // smart cast
}
```

---

## 2. Tu tarea

1. **`describir(estado)`:** devuelve `"En cola"`, `"Descargando 40 %"`, `"Guardada en /ruta"` o `"Error: motivo"`.

2. **`estado.estaTerminada()`:** una función de extensión que es cierta en `Completada` y `Fallida`.

3. **`avanzar(estado, incremento, ruta)`:** calcula el estado siguiente:

    - `Pendiente` pasa a `Descargando(incremento)`.

    - `Descargando` suma el incremento y, al llegar a 100 o más, pasa a `Completada(ruta)`.

    - Una descarga terminada no cambia.

??? tip "Pista: `estaTerminada`"

    No necesitas `when`: basta con comprobar `this is ...` con cada uno de los dos subtipos y unirlos con `||`.

??? tip "Pista: `avanzar`"

    Escribe `when` con una rama por caso. En la rama de `Descargando`, calcula primero el nuevo progreso en un `val` y decide después qué estado devolver. Puedes juntar dos casos en una rama separándolos con una coma.

---

## 3. Compruébalo: rompe el `when` a propósito

Cuando los tests estén en verde, añade temporalmente un estado `Pausada` a `EstadoDescarga` en el paquete `modelo` y compila. El compilador señalará cada `when` que no lo trata, también en otros archivos. Eso es lo que te da un tipo sellado y no te da un `else`. Después, quítalo.

---

## 4. Solución

[`Estados.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.01-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso1_sellados/Estados.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/main...c0.01-fin)

**Más práctica:** [POO y tipos sellados](../ejercicios/03-poo-sealed-types.md). **Siguiente:** [Paso 2: genéricos](./02-genericos.md).
