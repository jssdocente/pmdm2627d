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

1. **`resultado.mapear(transformar)`:** si es `Exito`, aplica la función a su valor y devuelve otro `Exito`, que puede ser de otro tipo. Si es `Error`, lo devuelve igual.

2. **`resultado.valorO(porDefecto)`:** devuelve el valor o, si es `Error`, el valor por defecto.

3. **`Cola<T>`:** completa `encolar`, `desencolar` y `siguiente`. Sale primero el que entró primero, y una cola vacía devuelve `null`.

4. **`mayor(elementos)` y `totalMb(elementos)`:** funcionan con cualquier `T : ConTamano`. Fíjate en que `mayor` devuelve el tipo real: un `Parche?` en el test, no un `ConTamano?`.

??? tip "Pista: `Cola`"

    `ArrayDeque` ya tiene `addLast`, `removeFirstOrNull` y `firstOrNull`.

??? tip "Pista: `mayor` y `totalMb`"

    Busca `maxByOrNull` y `sumOf`: gracias a la restricción, dentro de la lambda puedes usar `it.tamanoMb`.

---

## 3. Solución

[`Resultado.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.02-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso2_genericos/Resultado.kt) · [`Cola.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.02-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso2_genericos/Cola.kt) · [`Restricciones.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.02-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso2_genericos/Restricciones.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.01-fin...c0.02-fin)

**Siguiente:** [Paso 3: colecciones y Maps](./03-colecciones-maps.md).
