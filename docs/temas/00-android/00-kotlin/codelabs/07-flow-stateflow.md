# **Paso 7: progreso con `Flow` y estado con `StateFlow`**

Una función `suspend` devuelve **un** valor, pero el progreso de una descarga son **muchos** valores a lo largo del tiempo. Eso es un `Flow`. Y el estado de toda la cola, que la pantalla debe conocer en cada momento, es un `StateFlow`. Con este paso se juntan todas las piezas, y es el patrón que usarás en un `ViewModel`.

- **Dónde trabajas:** `paso7_flujos/` (`Flujos.kt` y `GestorDescargas.kt`)

- **Tests:** `paso7_flujos/FlujosTest.kt` (12 tests)

- **Apuntes:** [Flujos asíncronos](../52-flows.md)

---

## 1. La idea en un minuto

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/codelabs/images/ck-gestor.svg"
<figcaption>El progreso viaja por un flujo frío hasta el gestor, que lo guarda en un <code>StateFlow</code>. La pantalla solo observa ese estado.</figcaption>
</figure>

- **`flow { }` es frío:** no hace nada hasta que alguien lo recoge con `collect` o `toList`.

- **`map`** transforma cada valor del flujo, igual que en una lista.

- **`StateFlow` es caliente:** siempre tiene un valor actual en `.value`, y quien lo observa recibe los cambios.

- **`update { }`** cambia el estado de forma segura aunque varias corrutinas escriban a la vez. Recibe el valor actual y devuelve el nuevo.

```kotlin
private val _contador = MutableStateFlow(0)
val contador: StateFlow<Int> = _contador.asStateFlow()

fun sumar() {
    _contador.update { actual -> actual + 1 }
}
```

---

## 2. Tu tarea

### 2.1. `progreso` (en `Flujos.kt`)

```kotlin
fun progreso(pasos: Int, retardoMs: Long): Flow<Int>
```

Crea un flujo que, en cada uno de los `pasos`, primero espera `retardoMs` y después emite el porcentaje. El porcentaje es `paso * 100 / pasos`, con `paso` de 1 a `pasos`:

| Llamada | Emite | Tiempo total |
| :--- | :--- | :--- |
| `progreso(4, 100)` | 25, 50, 75 y 100 | 400 ms |
| `progreso(2, 100)` | 50 y 100 | 200 ms |

### 2.2. `comoEstados` (en `Flujos.kt`)

```kotlin
fun Flow<Int>.comoEstados(ruta: String): Flow<EstadoDescarga>
```

Transforma cada porcentaje en un estado:

| Porcentaje recibido | Estado emitido | Ejemplo con `ruta = "/a"` |
| :--- | :--- | :--- |
| Menos de 100 | `Descargando(porcentaje)` | `50` → `Descargando(50)` |
| 100 o más | `Completada(ruta)` | `100` → `Completada("/a")` |

### 2.3. `GestorDescargas` (en `GestorDescargas.kt`)

La clase ya tiene sus propiedades: `scope` para lanzar corrutinas, `pasos` y `retardoMs` para el progreso, y el estado `_descargas`, un mapa cuya clave es el id de cada descarga. Completa estos cuatro métodos:

| Método | Qué hace | Si el id no existe |
| :--- | :--- | :--- |
| `agregar(descarga)` | Añade la descarga al mapa, con su `id` como clave | No aplica |
| `cambiarEstado(id, nuevo)` | Sustituye el estado de esa descarga | No cambia nada |
| `iniciar(id)` | Lanza su descarga y devuelve el `Job` | Devuelve `Job().apply { complete() }`, un `Job` ya terminado |
| `activas()` | Devuelve un flujo con cuántas están en estado `Descargando` | No aplica |

**`agregar` y `cambiarEstado`** deben escribir con `_descargas.update { }`. La operación sobre el mapa es la misma que en el paso 3.

??? tip "Pista: `cambiarEstado`"

    Dentro de `update`, si no encuentras el id, devuelve el mapa sin cambios con `?: return@update mapa`.

**`iniciar(id)`** sigue estos pasos:

1. Busca la descarga en `_descargas.value`. Si no existe, devuelve el `Job` terminado de la tabla.

2. Lanza una corrutina con `scope.launch` y devuelve su `Job`.

3. Dentro de ella, crea el flujo `progreso(pasos, retardoMs)` y conviértelo con `comoEstados`. La ruta es `/descargas/` seguido del nombre: para `a.zip`, `"/descargas/a.zip"`.

4. Recógelo con `collect` y llama a `cambiarEstado(id, estado)` con cada valor.

**Comprobación:** con `pasos = 2` y `retardoMs = 100`, a los 100 ms la descarga está en `Descargando(50)` y al final en `Completada("/descargas/a.zip")`.

**`activas()`** se deriva de `descargas` con `map`. Si hay dos descargas y solo una está en `Descargando`, el flujo emite `1`.

---

## 3. La recompensa: míralo funcionar

Con los tests en verde, ejecuta `Main.kt` con el botón ▶ de IntelliJ o desde la terminal:

```bash
./gradlew run
```

```text
mapa.zip: en cola | musica.zip: en cola
mapa.zip: 20 % | musica.zip: 20 %
mapa.zip: 40 % | musica.zip: 40 %
mapa.zip: 60 % | musica.zip: 60 %
mapa.zip: 80 % | musica.zip: 80 %
mapa.zip: lista | musica.zip: lista
```

Lo que hace `println` aquí es lo que hará un composable en Android: **observar el estado y pintarlo**.

---

## 4. Solución

[`Flujos.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.07-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso7_flujos/Flujos.kt) · [`GestorDescargas.kt`](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.07-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso7_flujos/GestorDescargas.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.06-fin...c0.07-fin)

## ¿Y ahora?

- **Para consolidar:** el [Reto 5.14](../ejercicios/05-concurrencia-corrutinas.md#reto-514-carrera-espacial-galactica-space-grand-prix) usa `StateFlow` y `SharedFlow` en una carrera entre naves.

- **Reto final:** el [Proyecto Integrador](../ejercicios/06-proyecto-integrador.md) lo junta todo en una sola simulación.

- **Para entrenar el examen:** la [práctica de código y TDD](../../../evaluacion/practica-codigo.md).
