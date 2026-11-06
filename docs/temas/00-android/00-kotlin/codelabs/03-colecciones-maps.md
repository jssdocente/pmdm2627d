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

Todo se hace en `Estadisticas.kt`. Los ejemplos usan esta lista, la misma de los tests:

| `id` | `nombre` | `tamanoMb` | `estado` |
| :--- | :--- | :--- | :--- |
| 1 | `mapa.zip` | 300 | `Completada("/mapa.zip")` |
| 2 | `musica.zip` | 120 | `Descargando(40)` |
| 3 | `video.zip` | 900 | `Completada("/video.zip")` |
| 4 | `texturas.zip` | 500 | `Pendiente` |
| 5 | `voces.zip` | 80 | `Fallida("sin red")` |

La función `nombreEstado(estado)` ya está hecha: devuelve `"Pendiente"`, `"Descargando"`, `"Completada"` o `"Fallida"`. Úsala como clave en los mapas.

### 2.1. De lista a lista

Las dos reciben la lista `descargas`, y `lasMasGrandes` también el número `n`:

| Función | Qué devuelve | Resultado con la lista de ejemplo |
| :--- | :--- | :--- |
| `nombresCompletadas`{ style="white-space: nowrap" } | Los nombres de las descargas en estado `Completada`, en el mismo orden | `["mapa.zip", "video.zip"]` |
| `lasMasGrandes`{ style="white-space: nowrap" } | Los nombres de las `n` que más ocupan, de mayor a menor | Con `n = 2`: `["video.zip", "texturas.zip"]` |

??? tip "Pista: `lasMasGrandes`"

    Encadena tres operaciones: `sortedByDescending`, `take` y `map`.

### 2.2. De lista a mapa

Las cuatro reciben la lista `descargas` y devuelven un mapa:

| Función | Clave | Valor | Resultado con la lista de ejemplo |
| :--- | :--- | :--- | :--- |
| `porId`{ style="white-space: nowrap" } | El `id` | La descarga | 5 entradas; la clave `3` da la descarga de `video.zip` |
| `agruparPorEstado`{ style="white-space: nowrap" } | El nombre del estado | La lista de descargas en ese estado | 4 claves; `"Completada"` da las descargas de `mapa.zip` y `video.zip` |
| `contarPorEstado`{ style="white-space: nowrap" } | El nombre del estado | Cuántas hay en ese estado | `{Completada=2, Descargando=1, Pendiente=1, Fallida=1}` |
| `megasPorEstado`{ style="white-space: nowrap" } | El nombre del estado | La suma de sus `tamanoMb` | `{Completada=1200, Descargando=120, Pendiente=500, Fallida=80}` |

??? tip "Pista: `megasPorEstado`"

    Reutiliza `agruparPorEstado`. En `mapValues`, la lambda recibe cada entrada: puedes separarla con `{ (clave, lista) -> ... }` y sumar con `sumOf`.

### 2.3. «Cambiar» un mapa sin modificarlo

Estas dos funciones reciben un mapa como el de `porId` y **devuelven otro**. El original debe quedar igual.

```kotlin
fun cambiarEstado(mapa: Map<Int, Descarga>, id: Int, nuevo: EstadoDescarga): Map<Int, Descarga>
fun quitar(mapa: Map<Int, Descarga>, id: Int): Map<Int, Descarga>
```

| Llamada | Qué devuelve |
| :--- | :--- |
| `cambiarEstado(mapa, 4, Descargando(10))` | Un mapa nuevo en el que la descarga 4 tiene el estado `Descargando(10)` y lo demás no cambia |
| `cambiarEstado(mapa, 99, Pendiente)` | El id 99 no existe: **el mismo mapa** que recibió |
| `quitar(mapa, 1)` | Un mapa nuevo con 4 entradas, sin la descarga 1 |

??? tip "Pista: `cambiarEstado`"

    Busca con `mapa[id]`, que devuelve `null` si no existe, y sal con `?: return mapa`. Para el cambio, usa `copy` y el operador `+`.

---

## 3. Solución

[`Estadisticas.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.03-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso3_colecciones/Estadisticas.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.02-fin...c0.03-fin)

**Más práctica:** [Colecciones y scope functions](../ejercicios/04-colecciones-scope-functions.md). **Siguiente:** [Paso 4: scope functions](./04-scope-functions.md).
