# **Paso 2: genéricos**

Una cola de descargas y una cola de avisos funcionan igual: lo único que cambia es el tipo de lo que guardan. Con **genéricos** escribes esa lógica una vez, sin perder la comprobación de tipos.

- **Dónde trabajas:** `paso2_genericos/` (`Resultado.kt`, `Cola.kt` y `Restricciones.kt`)

- **Tests:** `paso2_genericos/GenericosTest.kt` (8 tests)

- **Apuntes:** [Genéricos](../25-genericos.md)

---

## 1. La idea en un minuto

`T` es un tipo que se decide al usarlo. Una restricción `T : Algo` exige que ese tipo cumpla `Algo`, y a cambio te deja usar sus propiedades:

```kotlin
class Caja<T>(val contenido: T)

fun <T> primero(lista: List<T>): T? = lista.firstOrNull()

fun <T : Comparable<T>> maximo(a: T, b: T): T = if (a > b) a else b
```

`Resultado<T>` junta esto con el paso anterior, porque es un **tipo sellado genérico**:

```kotlin
sealed interface Resultado<out T> {
    data class Exito<out T>(val valor: T) : Resultado<T>
    data class Error(val mensaje: String) : Resultado<Nothing>
}
```

!!! info "¿Qué hacen `out` y `Nothing`?"

    `Error` no lleva ningún valor, así que no depende de `T`. `Nothing` es el tipo que encaja con cualquier otro, y `out T` indica que `T` solo se entrega, nunca se recibe. Juntos permiten usar un mismo `Error` como `Resultado<Int>` o como `Resultado<String>`.

---

## 2. Tu tarea

Hay tres archivos por completar. Las declaraciones de `Resultado` y `ConTamano`, y la propiedad `tamano` de la cola, ya están hechas.

### 2.1. `mapear` (en `Resultado.kt`)

```kotlin
fun <T, R> Resultado<T>.mapear(transformar: (T) -> R): Resultado<R>
```

Aplica `transformar` al valor, solo si lo hay. El resultado puede ser de otro tipo:

| Si el resultado es... | Devuelve | Ejemplo con `{ "$it MB" }` |
| :--- | :--- | :--- |
| `Exito(valor)` | `Exito` con el valor transformado | `Exito(5)` → `Exito("5 MB")` |
| `Error(mensaje)` | El mismo `Error`, **sin llamar** a `transformar` | `Error("sin red")` → `Error("sin red")` |

### 2.2. `valorO` (en `Resultado.kt`)

```kotlin
fun <T> Resultado<T>.valorO(porDefecto: T): T
```

| Si el resultado es... | Devuelve | Ejemplo con `porDefecto = "b"` |
| :--- | :--- | :--- |
| `Exito(valor)` | Su valor | `Exito("a")` → `"a"` |
| `Error(mensaje)` | `porDefecto` | `Error("x")` → `"b"` |

### 2.3. `Cola<T>` (en `Cola.kt`)

Una cola en la que sale primero el que entró primero. Los elementos se guardan en `elementos`, que ya está declarado:

| Método | Qué hace | Devuelve | Si la cola está vacía |
| :--- | :--- | :--- | :--- |
| `encolar(elemento)` | Lo añade al final | Nada | Lo añade igualmente |
| `desencolar()` | Saca el primero | El elemento sacado | `null` |
| `siguiente()` | Consulta el primero **sin sacarlo** | Ese elemento | `null` |

Por ejemplo, tras `encolar("a")` y `encolar("b")`, `siguiente()` devuelve `"a"` y `tamano` sigue en 2. Después, `desencolar()` devuelve `"a"` y `tamano` baja a 1.

??? tip "Pista"

    `ArrayDeque` ya tiene `addLast`, `removeFirstOrNull` y `firstOrNull`.

### 2.4. `mayor` y `totalMb` (en `Restricciones.kt`)

```kotlin
fun <T : ConTamano> mayor(elementos: List<T>): T?
fun <T : ConTamano> totalMb(elementos: List<T>): Int
```

Funcionan con cualquier tipo que implemente `ConTamano`. El test usa una clase propia, `Parche`:

| Función | Qué devuelve | Con `[Parche("a", 10), Parche("b", 30)]` | Con una lista vacía |
| :--- | :--- | :--- | :--- |
| `mayor` | El elemento que más ocupa | `Parche("b", 30)` | `null` |
| `totalMb` | La suma de lo que ocupan | `40` | `0` |

Fíjate en que `mayor` devuelve el tipo real: un `Parche?`, no un `ConTamano?`.

??? tip "Pista"

    Busca `maxByOrNull` y `sumOf`: gracias a la restricción, dentro de la lambda puedes usar `it.tamanoMb`.

---

## 3. Solución

[`Resultado.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.02-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso2_genericos/Resultado.kt) · [`Cola.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.02-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso2_genericos/Cola.kt) · [`Restricciones.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.02-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso2_genericos/Restricciones.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.01-fin...c0.02-fin)

**Siguiente:** [Paso 3: colecciones y Maps](./03-colecciones-maps.md).
