# **Codelab de Kotlin: gestor de descargas**

Si vas justo de tiempo, este es el camino corto para practicar Kotlin. En siete pasos construirás las piezas de un **gestor de descargas**: los mismos conceptos de los apuntes, usados en un único problema en lugar de en ejercicios sueltos.

Cada paso dura unos 20-30 minutos. Tú escribes el código y **los tests te dicen si está bien**, igual que en el examen práctico de Kotlin.

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/codelabs/images/ck-pasos.svg"
<figcaption>Los pasos van de lo más sencillo a lo más complejo. Si solo tienes tiempo para cuatro, haz los marcados con una estrella.</figcaption>
</figure>

| Paso | Qué construyes | Qué practicas |
| :--- | :--- | :--- |
| [1 ★](./01-tipos-sellados.md) | Estados de una descarga | `sealed interface`, `when` exhaustivo |
| [2](./02-genericos.md) | `Resultado<T>` y `Cola<T>` | Clases y funciones genéricas, restricciones |
| [3 ★](./03-colecciones-maps.md) | Estadísticas de la cola | `filter`, `groupBy`, `associateBy`, `mapValues`, operaciones con `Map` |
| [4](./04-scope-functions.md) | Crear y procesar descargas | `apply`, `let`, `also`, `run`, `with` |
| [5 ★](./05-suspend-async.md) | De callbacks a `suspend`, y en paralelo | `suspend`, `launch`, `async` |
| [6](./06-cancelacion-errores.md) | Cancelar y tratar fallos | `Job`, `try-catch`, tiempo límite, reintentos |
| [7 ★](./07-flow-stateflow.md) | Progreso en vivo y estado de la cola | `flow { }`, `map`, `StateFlow`, `update` |

---

## 1. Prepara el proyecto

Solo tienes que hacerlo una vez:

```bash
git clone https://github.com/jssdocente/pmdm2627-lab-kotlin.git lab-kotlin
```

Después abre la carpeta `lab-kotlin` en IntelliJ IDEA y espera a que Gradle termine de sincronizar. Necesitas un JDK 17 o superior.

---

## 2. Cómo se trabaja

Todos los pasos siguen el mismo ciclo:

1. Abre el paquete del paso en `src/main/kotlin`, por ejemplo `paso1_sellados`.

2. Sustituye cada `TODO("Pendiente de implementar")` por tu código. La página del paso indica qué debe devolver cada función en cada caso, con ejemplos.

3. En `src/test/kotlin`, haz clic derecho sobre el paquete del paso y elige **Run 'Tests in ...'**.

4. Lee los fallos, corrige y repite hasta que todos estén en verde.

5. Compara con la solución usando los enlaces del final de la página del paso.

!!! tip "Los pasos son independientes"

    Si un paso se te atasca, no te bloquea: puedes pasar al siguiente y volver después. Todos comparten el modelo `Descarga` y `EstadoDescarga`, que ya viene hecho.

??? info "¿Por qué veo tests en rojo de otros pasos?"

    El proyecto trae ya los siete pasos, y los que aún no has hecho fallan con `NotImplementedError`: es lo normal. Ejecuta solo los tests del paso en el que estás. Al terminar los siete, todo el proyecto estará en verde.

??? info "¿Tengo que usar ramas o tags?"

    No. Trabajas en tu copia y el repositorio original no cambia. La rama `soluciones` y sus tags (`c0.01-fin`, `c0.02-fin`…) solo guardan las soluciones, y las verás con un enlace.

    Si quieres, puedes hacer commits para guardar tu progreso:

    ```bash
    git add .
    git commit -m "Paso 1 terminado"
    ```

??? info "¿Y si no quiero usar Git?"

    En la [página del repositorio](https://github.com/jssdocente/pmdm2627-lab-kotlin), pulsa **Code › Download ZIP**, descomprímelo en una ruta corta y sin acentos (por ejemplo `C:\PMDM\lab-kotlin`) y abre esa carpeta en IntelliJ IDEA. Lo demás es igual.

??? info "¿Puedo ejecutar los tests desde la terminal?"

    Sí. Cambia el nombre del paquete según el paso:

    ```bash
    ./gradlew test --tests "com.pmdm.lab.kotlin.paso1_sellados.*"
    ```

---

## 3. El modelo que comparten todos los pasos

Ya está escrito en el paquete `modelo`, así que no tienes que tocarlo:

```kotlin
sealed interface EstadoDescarga {
    data object Pendiente : EstadoDescarga
    data class Descargando(val progreso: Int) : EstadoDescarga
    data class Completada(val ruta: String) : EstadoDescarga
    data class Fallida(val motivo: String) : EstadoDescarga
}

data class Descarga(
    val id: Int,
    val nombre: String,
    val tamanoMb: Int,
    val estado: EstadoDescarga = EstadoDescarga.Pendiente,
)
```

**Empieza por el [Paso 1: tipos sellados](./01-tipos-sellados.md).**
