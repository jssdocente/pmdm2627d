# **Paso 3: colecciones y Maps**

Con una lista de descargas aparecen las preguntas reales: cuáles han terminado, cuánto ocupa cada grupo, cómo encuentro una por su id. Todas se responden encadenando operaciones, sin bucles ni variables intermedias.

- **Dónde trabajas:** `paso3_colecciones/Estadisticas.kt`

- **Tests:** `paso3_colecciones/EstadisticasTest.kt` (9 tests)

- **Apuntes:** [Listas](../42-listas.md) y [Maps](../43-maps.md)

---

## 1. La idea en un minuto

Las operaciones de colecciones **no modifican el original: devuelven una colección nueva**. Lo más importante de este paso es pasar de una lista a un mapa:

| Operación | Qué devuelve | Para qué |
| :--- | :--- | :--- |
| `associateBy { it.id }` | `Map<Int, Descarga>` | Encontrar **un** elemento por su clave |
| `groupBy { ... }` | `Map<K, List<Descarga>>` | Repartir en **grupos** |
| `groupingBy { ... }.eachCount()` | `Map<K, Int>` | **Contar** cuántos hay en cada grupo |
| `mapValues { ... }` | `Map<K, R>` | Transformar los **valores**, con las mismas claves |

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/codelabs/images/ck-groupby.svg"
<figcaption><code>groupBy</code> reparte la lista en un mapa de listas, y <code>mapValues</code> cambia el valor de cada clave. Son los datos de los tests de este paso.</figcaption>
</figure>

Un `Map` inmutable se «cambia» creando otro: `+` añade o sustituye una clave y `-` la quita. Es exactamente lo que harás con el estado en el paso 7:

```kotlin
val edades = mapOf("Ana" to 20)
val conLuis = edades + ("Luis" to 22) // {Ana=20, Luis=22}
val sinAna = conLuis - "Ana"          // {Luis=22}
// «edades» sigue siendo {Ana=20}
```

---

## 2. Tu tarea

1. **`nombresCompletadas`:** los nombres de las descargas completadas.

2. **`lasMasGrandes(descargas, n)`:** los nombres de las `n` que más ocupan, de mayor a menor.

3. **`porId`:** un mapa para buscar cada descarga por su id.

4. **`agruparPorEstado`:** usa la función `nombreEstado`, que ya está hecha, como clave.

5. **`contarPorEstado`:** cuántas descargas hay en cada estado.

6. **`megasPorEstado`:** cuántos MB suma cada estado.

7. **`cambiarEstado(mapa, id, nuevo)`:** devuelve un mapa nuevo con esa descarga cambiada. Si el id no existe, devuelve el mismo mapa.

8. **`quitar(mapa, id)`:** devuelve un mapa nuevo sin esa descarga.

??? tip "Pista: `lasMasGrandes`"

    Encadena tres operaciones: `sortedByDescending`, `take` y `map`.

??? tip "Pista: `megasPorEstado`"

    Reutiliza `agruparPorEstado`. En `mapValues`, la lambda recibe cada entrada: puedes separarla con `{ (clave, lista) -> ... }` y sumar con `sumOf`.

??? tip "Pista: `cambiarEstado`"

    Busca con `mapa[id]`, que devuelve `null` si no existe, y sal con `?: return mapa`. Para el cambio, usa `copy` y el operador `+`.

---

## 3. Solución

[`Estadisticas.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.03-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso3_colecciones/Estadisticas.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.02-fin...c0.03-fin)

**Más práctica:** [Colecciones y scope functions](../ejercicios/04-colecciones-scope-functions.md). **Siguiente:** [Paso 4: scope functions](./04-scope-functions.md).
