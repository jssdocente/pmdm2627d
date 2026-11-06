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

**En `Flujos.kt`:**

1. **`progreso(pasos, retardoMs)`:** en cada paso espera y emite el porcentaje. Con 4 pasos emite 25, 50, 75 y 100.

2. **`flujo.comoEstados(ruta)`:** convierte cada porcentaje en `Descargando`, o en `Completada(ruta)` al llegar a 100.

**En `GestorDescargas.kt`:**

3. **`agregar(descarga)`:** la añade al mapa con su id como clave.

4. **`cambiarEstado(id, nuevo)`:** como en el paso 3, pero dentro de `update`. Si el id no existe, no cambia nada.

5. **`iniciar(id)`:** lanza en `scope` una corrutina que recoge el progreso convertido en estados y llama a `cambiarEstado` con cada valor. Devuelve el `Job`.

6. **`activas()`:** un flujo con el número de descargas en estado `Descargando`, derivado de `descargas`.

??? tip "Pista: `cambiarEstado`"

    Dentro de `update`, si no encuentras el id, devuelve el mapa sin cambios con `?: return@update mapa`.

??? tip "Pista: `iniciar`"

    Primero busca la descarga, para conocer su nombre: la ruta es `"/descargas/nombre"`. Si no existe, el comentario de la función te da el `Job` que debes devolver. Después encadena `progreso(pasos, retardoMs).comoEstados(...).collect { ... }` dentro de `scope.launch`.

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
