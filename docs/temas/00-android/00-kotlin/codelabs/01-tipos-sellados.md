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

Todo se hace en `Estados.kt`. Tienes tres funciones por completar.

### 2.1. `describir`

```kotlin
fun describir(estado: EstadoDescarga): String
```

Devuelve el texto que vería el usuario. Hay un texto distinto para cada estado:

| Si `estado` es... | Devuelve | Ejemplo de resultado |
| :--- | :--- | :--- |
| `Pendiente` | El texto fijo `En cola` | `"En cola"` |
| `Descargando(progreso)` | `Descargando`, el progreso y `%` | `Descargando(40)` → `"Descargando 40 %"` |
| `Completada(ruta)` | `Guardada en` y la ruta | `Completada("/a.zip")` → `"Guardada en /a.zip"` |
| `Fallida(motivo)` | `Error:` y el motivo | `Fallida("sin red")` → `"Error: sin red"` |

### 2.2. `estaTerminada`

```kotlin
fun EstadoDescarga.estaTerminada(): Boolean
```

Es una función de extensión: se llama como `estado.estaTerminada()`, y dentro `this` es el estado. Indica si la descarga ya no va a avanzar más:

| Si el estado es... | Devuelve |
| :--- | :--- |
| `Pendiente` | `false` |
| `Descargando` | `false` |
| `Completada` | `true` |
| `Fallida` | `true` |

??? tip "Pista"

    No necesitas `when`: basta con comprobar `this is ...` con cada uno de los dos subtipos y unirlos con `||`.

### 2.3. `avanzar`

```kotlin
fun avanzar(estado: EstadoDescarga, incremento: Int, ruta: String): EstadoDescarga
```

Calcula el estado siguiente cuando llegan más datos. `incremento` son los puntos que se suman al progreso, y `ruta` es dónde se guardará el fichero si la descarga termina:

| Si `estado` es... | Condición | Devuelve | Ejemplo |
| :--- | :--- | :--- | :--- |
| `Pendiente` | Siempre | `Descargando` con el incremento | `avanzar(Pendiente, 10, "/a")` → `Descargando(10)` |
| `Descargando` | Progreso + incremento es menor que 100 | `Descargando` con la suma | `avanzar(Descargando(30), 20, "/a")` → `Descargando(50)` |
| `Descargando` | Progreso + incremento es 100 o más | `Completada(ruta)` | `avanzar(Descargando(90), 50, "/a")` → `Completada("/a")` |
| `Completada` o `Fallida` | Siempre | El mismo estado, sin cambios | `avanzar(Fallida("x"), 10, "/a")` → `Fallida("x")` |

??? tip "Pista"

    Escribe `when` con una rama por estado. En la rama de `Descargando`, calcula primero la suma en un `val` y decide después qué devolver. Puedes juntar dos casos en una rama separándolos con una coma.

---

## 3. Compruébalo: rompe el `when` a propósito

Cuando los tests estén en verde, añade temporalmente un estado `Pausada` a `EstadoDescarga` en el paquete `modelo` y compila. El compilador señalará cada `when` que no lo trata, también en otros archivos. Eso es lo que te da un tipo sellado y no te da un `else`. Después, quítalo.

---

## 4. Solución

[`Estados.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.01-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso1_sellados/Estados.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/main...c0.01-fin)

**Más práctica:** [POO y tipos sellados](../ejercicios/03-poo-sealed-types.md). **Siguiente:** [Paso 2: genéricos](./02-genericos.md).
