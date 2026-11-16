# **Clase extra · Corrutinas y *Flow* en vivo**

Un laboratorio para entender **de verdad** las corrutinas, los *scopes* y los *flows* trabajando en pareja: uno levanta un servidor en su PC y el otro se conecta a él. Primero se ve cada idea resuelta en un ejemplo y después la aplicas tú en un ejercicio gemelo.

!!! abstract "Ficha de la clase"

    - **Duración:** 2 partes de 2 h.
    - **Apuntes de referencia:** [Corrutinas](../../00-android/00-kotlin/51-corrutinas.md), [Flows](../../00-android/00-kotlin/52-flows.md) y [Tipos sellados y UiState](../../00-android/00-kotlin/26-sealed-classes.md).
    - **Proyecto:** `pmdm2627-lab-flows`, una rama por estación (ver [Ramas y tags](#ramas-y-tags)).
    - **Necesitas:** haber leído los apuntes de corrutinas, IntelliJ IDEA con JDK 17 o superior y una pareja con la que conectarte (si no tienes, el profesor levanta un servidor para ti).

!!! info "Clase extra: puedes hacerla en cualquier momento"
    No tiene número porque no depende de ninguna otra sesión. Solo necesitas haber leído los apuntes de corrutinas y de flows de Kotlin. Cada estación es independiente: puedes hacerlas en el orden que quieras.

---

## 🎯 Objetivos

Al terminar la clase sabrás:

- Pedir varias cosas **a la vez** con `async` y reconocer cuándo no se puede (hay una dependencia).
- Elegir entre **`coroutineScope`** y **`supervisorScope`** según un fallo deba o no arrastrar a los hermanos.
- **Cancelar** corrutinas al cerrar una pantalla, y tratar errores con reintentos y límites de tiempo.
- Explicar con datos la diferencia entre un flujo **frío** y uno **caliente**, y comprobar cuántas conexiones abre cada uno (*parte 2*).
- Convertir un flujo frío en caliente con **`stateIn`** y **`shareIn`**, y decidir cuándo se conecta con `WhileSubscribed` (*parte 2*).
- Encadenar **`debounce`**, **`flatMapLatest`** y **`combine`** para montar un buscador que no satura al servidor (*parte 2*).

---

## ✅ Antes de empezar

1. Clona el repositorio una sola vez:

    ```bash
    git clone https://github.com/jssdocente/pmdm2627-lab-flows.git lab-flows
    ```

2. Abre la carpeta `lab-flows` en IntelliJ IDEA y espera a que Gradle termine de sincronizar.

3. **Por defecto todo funciona sin red**, con un mercado simulado dentro de tu propio programa. No necesitas hacer nada más para empezar.

4. Para conectarte al servidor de tu pareja, mira el [bloque 8](#8-conecta-con-el-servidor-de-tu-pareja-10-min).

!!! tip "El mercado es una tienda de videojuegos"
    Hay **juegos** (catálogo, detalle de cada uno, precios en vivo) y **jugadores** (perfil, logros, amigos, ranking). Los ejemplos resueltos usan los **juegos** y tus ejercicios usan los **jugadores**: es la misma idea con otros datos.

---

## 🧭 Cómo se trabaja cada estación

El laboratorio se divide en **estaciones**. Todas siguen el mismo ciclo:

1. **Predice.** Lee el ejemplo resuelto y contesta antes de ejecutarlo la pregunta que te hace la guía. Apúntala.

2. **Ejecuta el ejemplo.** Abre su `Main.kt` y pulsa ▶ junto a `fun main`. Compara con lo que habías predicho.

3. **Tu turno.** Abre el ejercicio de `ejercicio/`: cada `TODO("Pendiente de implementar")` es algo que tienes que escribir. El comentario sobre la función te dice qué debe hacer y te da una pista.

4. **Pasa los tests.** Haz clic derecho sobre el paquete de la estación dentro de `src/test/kotlin` y elige **Run 'Tests in …'**. El mensaje de cada fallo te explica por qué falla.

5. **Compara con la solución.** Cuando hayas terminado, abre el enlace «Ver la solución en GitHub» del final de la estación: te enseña **solo lo que cambia** respecto a tu punto de partida.

!!! warning "El ejemplo ya está resuelto, el ejercicio no"
    Los tests del **ejemplo** pasan desde el principio. Los del **ejercicio** fallan hasta que lo resuelvas: es lo esperado, no un error.

---

## 🌿 Ramas y tags

Cada estación vive en **su propia rama**, y esa rama es tu punto de partida: no arrastra nada de las otras estaciones, así que puedes hacerlas en cualquier orden. Desde la rama de la estación, crea la tuya para no perder tu trabajo:

```bash
git switch estacion-1          # punto de partida de la estación 1
git switch -c mi-estacion1     # tu rama de trabajo
```

| Estación | Rama | Tag de partida | Tag de la solución |
| :---: | :--- | :--- | :--- |
| 1 · Paralelismo | `estacion-1` | `e1-ejemplo` | `e1-solucion` |
| 2 · Scopes | `estacion-2` | `e2-ejemplo` | `e2-solucion` |
| 3 · Errores y cancelación | `estacion-3` | `e3-ejemplo` | `e3-solucion` |
| 4 · Frío frente a caliente | `estacion-4` | `e4-ejemplo` | `e4-solucion` |
| 5 · De frío a caliente | `estacion-5` | `e5-ejemplo` | `e5-solucion` |
| 6 · Operadores | `estacion-6` | `e6-ejemplo` | `e6-solucion` |

Cada bloque de esta guía empieza con un recuadro que te dice en qué rama estás. **Si te pierdes**, vuelve al tag de partida y empieza de nuevo la estación; también puedes descargar cualquier tag como `.zip` desde la pestaña **Tags** del repositorio.

---

# Parte 1 · Corrutinas y *scopes*

---

## ⏱️ Agenda de la parte 1

| # | Min | Bloque | Rama / tag | Apuntes |
| :---: | :---: | :--- | :--- | :--- |
| 0 | 10 | Preparación: el repo y el mercado simulado | `main` | — |
| 1 | 10 | Estación 1 · Ejemplo: secuencial frente a paralelo | `estacion-1` · `e1-ejemplo` | [§4.4](../../00-android/00-kotlin/51-corrutinas.md#44-cuando-y-por-que-usamos-entonces-async-y-await) |
| 2 | 15 | Estación 1 · Tu turno: la ficha del jugador | `estacion-1` · `e1-ejemplo` | [§4.5](../../00-android/00-kotlin/51-corrutinas.md#45-el-gran-error-de-principiante-el-falso-paralelismo) |
| 3 | 10 | Estación 2 · Ejemplo: aislar fallos con los scopes | `estacion-2` · `e2-ejemplo` | [§6.1](../../00-android/00-kotlin/51-corrutinas.md#61-cancel-y-la-concurrencia-estructurada) y [§6.3](../../00-android/00-kotlin/51-corrutinas.md#63-aislar-fallos-coroutinescope-frente-a-supervisorscope) |
| 4 | 20 | Estación 2 · Tu turno: el panel y el vigilante | `estacion-2` · `e2-ejemplo` | [§6.3](../../00-android/00-kotlin/51-corrutinas.md#63-aislar-fallos-coroutinescope-frente-a-supervisorscope) |
| 5 | 10 | Estación 3 · Ejemplo: reintentos y cancelación | `estacion-3` · `e3-ejemplo` | [§6.2](../../00-android/00-kotlin/51-corrutinas.md#62-la-cancelacion-es-cooperativa) y [§7](../../00-android/00-kotlin/51-corrutinas.md#7-manejo-de-errores-con-try-catch) |
| 6 | 15 | Estación 3 · Tu turno: el perfil con reintentos | `estacion-3` · `e3-ejemplo` | [§7](../../00-android/00-kotlin/51-corrutinas.md#7-manejo-de-errores-con-try-catch) |
| 7 ⏩ | 15 | Estación 3 · Tu turno: la pantalla que cancela | `estacion-3` · `e3-ejemplo` | [Tipos sellados](../../00-android/00-kotlin/26-sealed-classes.md#5-el-patron-universal-de-arquitectura-en-android-uistate) |
| 8 ⏩ | 10 | Conecta con el servidor de tu pareja | `estacion-1` | — |
| 9 | 5 | Comprobación rápida y cierre | — | — |
| | **120** | | | |

---

## 0 · Preparación (10 min)

Antes de nada, comprueba que el proyecto funciona:

!!! info "Punto de partida: rama `main`"

    ```bash
    git switch main
    ```

!!! example "Manos a la obra"

    1. Abre `src/test/kotlin/.../api/MercadoSimuladoTest.kt` y ejecútalo: deben pasar los dos tests.

    2. Echa un vistazo a `api/MercadoApi.kt`. Es lo único que necesitas saber del mercado: unas funciones `suspend` para las peticiones sueltas y, más adelante, flujos para lo que llega en vivo.

    3. Fíjate en `api/MercadoSimulado.kt`: tiene un `Caos` con la latencia (lo que tarda cada petición) y los fallos. Los ejemplos y los tests usan **300 ms** por petición para que los tiempos sean fáciles de calcular.

!!! tip "¿Por qué un mercado simulado?"
    Tu código solo usa la interfaz `MercadoApi`. Da igual que los datos vengan de una simulación o del servidor de tu pareja: se cambia con un fichero de configuración y **tu código no se toca**.

---

## 1 · Estación 1 · Ejemplo: secuencial frente a paralelo (10 min)

!!! info "Punto de partida: rama `estacion-1` · tag `e1-ejemplo`"

    ```bash
    git switch estacion-1
    git switch -c mi-estacion1
    ```

Abre `estacion1/ejemplo/VitrinaDeJuegos.kt`. Hay dos formas de cargar la vitrina de la tienda (el catálogo y la ficha de cada juego):

- **Secuencial**: cada llamada `suspend` espera a la anterior. No se bloquea ningún hilo, pero el tiempo total es la **suma** de todas las esperas. → [§4.5 El falso paralelismo](../../00-android/00-kotlin/51-corrutinas.md#45-el-gran-error-de-principiante-el-falso-paralelismo)
- **Paralela**: los detalles no dependen unos de otros, así que se lanzan todos a la vez con `async` y se esperan con `awaitAll()`. → [§4.4 `async` y `await`](../../00-android/00-kotlin/51-corrutinas.md#44-cuando-y-por-que-usamos-entonces-async-y-await)
- Pero **el catálogo sí hay que pedirlo antes**: los detalles se piden por `id`, y los ids salen del catálogo. Esa dependencia se respeta.

La regla que te llevas: **lo dependiente, en orden; lo independiente, a la vez.**

!!! example "Manos a la obra"

    1. **Predice** antes de ejecutar: con 6 juegos y 300 ms por petición, ¿cuánto tarda la versión secuencial? ¿Y la paralela?

    2. Abre `estacion1/ejemplo/Main.kt` y pulsa ▶ junto a `fun main`.

    3. Compara con tu predicción.

??? success "Respuesta"
    **Secuencial: unos 2100 ms** (el catálogo, 300, y después 6 detalles uno tras otro, 6 × 300). **Paralela: unos 600 ms** (el catálogo, 300, y después los 6 detalles a la vez, 300).

---

## 2 · Estación 1 · Tu turno: la ficha del jugador (15 min)

Abre `estacion1/ejercicio/FichaDeJugador.kt`. Hay dos `TODO`:

- `cargarFicha`: carga el **perfil, los logros y los amigos** de un jugador a la vez. Las tres peticiones son independientes.
- `cargarFichasDeAmigos`: devuelve la ficha de **cada amigo** de un jugador. Primero hay que saber quiénes son (dependencia) y después se cargan todas las fichas a la vez.

!!! example "Manos a la obra"

    1. Implementa `cargarFicha`. Mira cómo `cargarVitrinaParalela` lanza los detalles con `async`.

    2. Implementa `cargarFichasDeAmigos`. Es el mismo patrón que la vitrina: lo dependiente primero, y después lo independiente a la vez.

    3. Ejecuta los tests de `estacion1`. Si algún tiempo no coincide, el mensaje te dice dónde estás esperando de más.

    4. Ejecuta `estacion1/ejercicio/Main.kt` y comprueba que los tiempos están cerca de los objetivos (300 ms y 600 ms).

!!! warning "Gotcha"
    Si metes `await()` dentro del mismo `map` que lanza el `async`, vuelves a pedir las cosas una a una. Primero **lanza todo** y después **espera**. → [§4.5](../../00-android/00-kotlin/51-corrutinas.md#45-el-gran-error-de-principiante-el-falso-paralelismo)

!!! success "Compara con la solución"
    Cuando hayas terminado: [ver la solución en GitHub](https://github.com/jssdocente/pmdm2627-lab-flows/compare/e1-ejemplo...e1-solucion) · tag `e1-solucion`.

---

## 3 · Estación 2 · Ejemplo: aislar fallos con los *scopes* (10 min)

!!! info "Punto de partida: rama `estacion-2` · tag `e2-ejemplo`"

    ```bash
    git switch estacion-2
    git switch -c mi-estacion2
    ```

Ya sabes que **los errores suben**: si un hijo falla, el padre cancela a los hermanos. Abre `estacion2/ejemplo/PortadaDeTienda.kt`. La portada de la tienda necesita el catálogo (imprescindible) y la ficha de un juego destacado (un extra).

- **`coroutineScope`**: si falla el destacado, se cancela el catálogo y falla **la portada entera**. Todo o nada. → [§6.1](../../00-android/00-kotlin/51-corrutinas.md#61-cancel-y-la-concurrencia-estructurada)
- **`supervisorScope`**: un `async` que falla **no cancela a su hermano**. El error queda guardado y salta en su `await()`. → [§6.3](../../00-android/00-kotlin/51-corrutinas.md#63-aislar-fallos-coroutinescope-frente-a-supervisorscope)
- Por eso **decides dónde recoges cada error**: el catálogo se espera sin protección y el destacado con `intentar { destacado.await() }`.

El mismo fichero `VigilanteDeCatalogo.kt` muestra un **scope propio**: cada refresco va en su `launch` con su propio `try-catch` dentro, y `detener()` cancela el scope y, con él, a todos sus hijos a la vez.

!!! example "Manos a la obra"

    1. **Predice**: con el servidor fallando en «detalle», ¿qué imprime la versión «todo o nada»? ¿Y la «resistente»?

    2. Ejecuta `estacion2/ejemplo/Main.kt`.

    3. Fíjate en la última parte: cuenta los hijos vivos del scope antes y después de `detener()`.

??? success "Respuesta"
    «Todo o nada» imprime que **la portada entera ha fallado**. La «resistente» devuelve los 6 juegos y marca el destacado como **no disponible**. Antes de `detener()` el scope tiene 2 hijos vivos y después ninguno.

---

## 4 · Estación 2 · Tu turno: el panel y el vigilante (20 min)

En `estacion2/ejercicio/` hay dos ejercicios:

- `PanelDeJugador.kt` · `cargarPanelDeJugador`: carga a la vez el perfil, los logros y los amigos. El **perfil es imprescindible** (si falla, falla todo) y los **logros y los amigos son opcionales**: si fallan, el panel se devuelve igualmente con esa sección como un `Result` fallido.
- `VigilanteDeJugador.kt` · `iniciar` y `detener`: refresca los logros y los amigos cada segundo, cada uno en su propia corrutina. Si fallan los logros, los amigos **siguen** refrescándose.

!!! example "Manos a la obra"

    1. Implementa `cargarPanelDeJugador`. Es `cargarPortadaResistente` con una sección opcional más.

    2. Implementa `iniciar` y `detener` del vigilante. Pregúntate **dónde** va el control del error para que un fallo en una corrutina no pare a la otra.

    3. Ejecuta los tests de `estacion2`.

!!! warning "Gotcha"
    Un `launch` que falla **sin** `try-catch` dentro no tiene a nadie que recoja su error: en Android cierra la app. Usa `intentar { … }` dentro de cada `launch`. → [§6.3](../../00-android/00-kotlin/51-corrutinas.md#63-aislar-fallos-coroutinescope-frente-a-supervisorscope)

!!! success "Compara con la solución"
    [Ver la solución en GitHub](https://github.com/jssdocente/pmdm2627-lab-flows/compare/e2-ejemplo...e2-solucion) · tag `e2-solucion`.

---

## 5 · Estación 3 · Ejemplo: reintentos y cancelación (10 min)

!!! info "Punto de partida: rama `estacion-3` · tag `e3-ejemplo`"

    ```bash
    git switch estacion-3
    git switch -c mi-estacion3
    ```

Un servidor real falla, y a veces tarda. Abre `estacion3/ejemplo/DetalleResiliente.kt`:

- Cada intento sale mal de **dos formas**: el mercado **falla** (`ErrorMercado`, que se captura con `try-catch`) o **tarda demasiado** (`withTimeoutOrNull` cancela la petición y devuelve `null`). Las dos se tratan igual: se reintenta.
- Entre un intento y el siguiente hay una pausa. Tras el último no hace falta esperar: se lanza el error.
- Solo se captura `ErrorMercado`, **nunca** `Exception`: así no te tragas la `CancellationException`. → [§6.2](../../00-android/00-kotlin/51-corrutinas.md#62-la-cancelacion-es-cooperativa)

Para probarlo hay un `MercadoInestable` (en `estacion3/`) que **falla las primeras veces y luego acierta**. Es un *decorador*: envuelve a otro mercado y solo cambia lo que necesita.

Después, `PantallaDeDetalle.kt` muestra **dos reglas de cancelación** que casi toda pantalla necesita, con el estado modelado como `sealed interface`:

- **Al abrir otro juego** se cancela la carga anterior: si no, una respuesta lenta del antiguo pisaría el estado del nuevo.
- **Al cerrar la pantalla** se cancela la carga en curso. Es lo que hace `viewModelScope` por ti cuando se destruye el ViewModel.

!!! example "Manos a la obra"

    1. **Predice**: con 2 fallos antes de acertar, 100 ms por petición y 200 ms de pausa, ¿cuánto tarda en conseguir el detalle?

    2. Ejecuta `estacion3/ejemplo/Main.kt` y fíjate también en el estado de la pantalla antes y después de cerrarla.

??? success "Respuesta"
    **Unos 700 ms**: 3 intentos de 100 ms y 2 pausas de 200 ms (la pausa no se hace tras el último). Después de `cerrar()`, el estado se queda en `Cargando`: la respuesta **nunca se aplica**.

---

## 6 · Estación 3 · Tu turno: el perfil con reintentos (15 min)

Abre `estacion3/ejercicio/PerfilResiliente.kt`. Implementa `cargarPerfilResiliente`: el mismo patrón que `cargarDetalleResiliente`, con el perfil de un jugador.

!!! example "Manos a la obra"

    1. Implementa `cargarPerfilResiliente` con sus intentos, el límite de cada intento y la pausa entre ellos.

    2. Ejecuta los tests: hay uno que comprueba que, tras el último intento, **no** se espera.

    3. Prueba a cambiar `catch (e: ErrorMercado)` por `catch (e: Exception)`. Los tests siguen pasando, pero ¿qué estarías rompiendo? Vuelve a dejarlo como estaba.

??? success "Respuesta"
    Con `Exception` te tragas también la `CancellationException`: si cancelan la corrutina mientras reintenta, **seguiría reintentando**. Esos tests no lo detectan, pero en una app real dejarías trabajo huérfano.

---

## 7 ⏩ · Estación 3 · Tu turno: la pantalla que cancela (15 min)

Abre `estacion3/ejercicio/PantallaDeJugador.kt`. El estado ya está modelado como `sealed interface` (`SinDatos`, `Cargando`, `Listo`, `Error`). Escribe `abrir` y `cerrar`.

!!! example "Manos a la obra"

    1. En `abrir`, cancela la carga anterior y lanza una nueva con `scope.launch`: pasa a `Cargando`, y cuando llega el perfil, a `Listo`. Si el mercado falla, a `Error`.

    2. En `cerrar`, cancela la carga en curso. **No cambies el estado**: la respuesta simplemente no se aplica.

    3. Ejecuta los tests. Uno de ellos abre un jugador, abre otro antes de que termine el primero y comprueba que la respuesta del primero **no** pisa el estado.

!!! success "Compara con la solución"
    [Ver la solución en GitHub](https://github.com/jssdocente/pmdm2627-lab-flows/compare/e3-ejemplo...e3-solucion) · tag `e3-solucion`.

---

## 8 ⏩ · Conecta con el servidor de tu pareja (10 min)

Hasta ahora todo ha ido con el mercado simulado. Ahora lo vas a hacer **de verdad**, entre dos PCs.

!!! info "Punto de partida: rama `estacion-1`"

    ```bash
    git switch estacion-1
    ```

!!! example "Manos a la obra"

    1. **Quien hace de servidor** abre un terminal en la carpeta del proyecto y ejecuta:

        ```bash
        ./gradlew :servidor:run
        ```

        Al arrancar imprime una o más **IPs**. Díctale a tu pareja la que empiece por `192.168.` o `10.`.

    2. **Quien hace de cliente** copia `mercado.properties.ejemplo` como `mercado.properties` y pone en `servidor.host` esa IP.

    3. El cliente ejecuta `estacion1/ejemplo/Main.kt`. La primera línea debe decir **Mercado: REMOTO**.

    4. El servidor abre `http://localhost:8080` en el navegador: es el panel de control. Prueba a subir la **latencia** a 1000 ms o los **fallos** al 30 %, y que el cliente vuelva a ejecutar.

    5. **Cambiad de papeles.**

!!! warning "Si no conecta"
    - El **cortafuegos** del PC suele bloquear las conexiones entrantes: permite Java o el puerto `8080`.
    - Comprobad que los dos PCs están en la **misma red**.
    - Si no hay forma, vuelve a `servidor.host=simulado`: tu código no cambia.

---

## 🧪 Comprobación rápida

??? success "1 · ¿Por qué `cargarVitrinaParalela` no pide los detalles a la vez que el catálogo?"
    Porque los detalles se piden por `id`, y los ids salen del catálogo: hay una **dependencia**. Lo dependiente va en orden; lo independiente, a la vez.

??? success "2 · En un `supervisorScope`, ¿dónde recoges el error de un `async` opcional?"
    En su **`await()`**, por ejemplo con `intentar { destacado.await() }`. El `async` guarda la excepción hasta que alguien la pide.

??? success "3 · ¿Qué riesgo tiene `catch (e: Exception)` en un reintento?"
    Que también captura la `CancellationException`: si cancelan la corrutina, sigue reintentando.

??? success "4 · ¿Para qué sirve `carga?.cancel()` al abrir otro juego?"
    Para que la respuesta lenta del juego anterior no llegue después y **pise el estado** del nuevo.

---

## 🏠 Para casa

- Termina los bloques que no diera tiempo a hacer en clase.

- **Reto:** añade a `cargarFicha` un límite de tiempo: si los amigos tardan más de 2 s, la ficha se devuelve igualmente sin ellos. ¿Qué scope necesitas?

- Lee antes de la parte 2 el apartado [Flujos fríos y calientes](../../00-android/00-kotlin/52-flows.md#3-flujos-frios-cold-streams-vs-flujos-calientes-hot-streams) de los apuntes de Flow.

---

# Parte 2 · *Flows* fríos, calientes y operadores

En la parte 1 cada petición tenía **una** respuesta. Ahora el servidor **va enviando datos con el tiempo**: precios que cambian, ofertas que salen, un ranking que se actualiza. Eso son los *flows*.

---

## ⏱️ Agenda de la parte 2

| # | Min | Bloque | Rama / tag | Apuntes |
| :---: | :---: | :--- | :--- | :--- |
| 0 | 5 | Preparación de la parte 2 | `main` | — |
| 1 | 10 | Estación 4 · Ejemplo: frío frente a caliente | `estacion-4` · `e4-ejemplo` | [§3](../../00-android/00-kotlin/52-flows.md#3-flujos-frios-cold-streams-vs-flujos-calientes-hot-streams) |
| 2 | 15 | Estación 4 · Tu turno: el ranking y el resumen | `estacion-4` · `e4-ejemplo` | [§4](../../00-android/00-kotlin/52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose) y [§5](../../00-android/00-kotlin/52-flows.md#5-sharedflow-emision-de-eventos-unicos-one-shot-events) |
| 3 | 10 | Estación 5 · Ejemplo: de frío a caliente | `estacion-5` · `e5-ejemplo` | [§7.1](../../00-android/00-kotlin/52-flows.md#71-de-flow-frio-a-stateflow-el-operador-statein) |
| 4 | 15 | Estación 5 · Tu turno: la tabla de clasificación | `estacion-5` · `e5-ejemplo` | [§7.1](../../00-android/00-kotlin/52-flows.md#71-de-flow-frio-a-stateflow-el-operador-statein) |
| 5 | 10 | Estación 6 · Ejemplo: la cadena de operadores | `estacion-6` · `e6-ejemplo` | [§6](../../00-android/00-kotlin/52-flows.md#6-operadores-de-transformacion-comunes) |
| 6 | 25 | Estación 6 · Tu turno: el buscador de amigos | `estacion-6` · `e6-ejemplo` | [§6](../../00-android/00-kotlin/52-flows.md#6-operadores-de-transformacion-comunes) |
| 7 ⏩ | 15 | Cuenta las conexiones en el servidor de tu pareja | `estacion-4` | — |
| 8 ⏩ | 10 | Experimento: ¿y si no esperamos a nadie? | `estacion-5` | — |
| 9 | 5 | Comprobación rápida y cierre | — | — |
| | **120** | | | |

---

## 0 · Preparación de la parte 2 (5 min)

Cada estación sigue siendo independiente, y conservas tus ramas de la parte 1. Comprueba que tienes el repositorio al día:

```bash
git fetch --all --tags
```

!!! tip "Antes de seguir"
    Si no hiciste la parte 1, no pasa nada: puedes empezar aquí. Solo necesitas haber leído en los apuntes de Flow la [diferencia entre flujos fríos y calientes](../../00-android/00-kotlin/52-flows.md#3-flujos-frios-cold-streams-vs-flujos-calientes-hot-streams).

---

## 1 · Estación 4 · Ejemplo: frío frente a caliente (10 min)

!!! info "Punto de partida: rama `estacion-4` · tag `e4-ejemplo`"

    ```bash
    git switch estacion-4
    git switch -c mi-estacion4
    ```

Abre `estacion4/ejemplo/FriosYCalientes.kt`. Dos flujos del mercado, dos comportamientos:

- **`precios(juegoId)` es frío**: no hace nada hasta que alguien lo colecta, y **cada `collect` lo ejecuta desde el principio con su propia conexión**. Tres colectores son tres conexiones, y cada uno recibe su secuencia completa. → [§3 Fríos y calientes](../../00-android/00-kotlin/52-flows.md#3-flujos-frios-cold-streams-vs-flujos-calientes-hot-streams)
- **`ofertas` es caliente**: ya está emitiendo aunque nadie escuche. Quien llega tarde **solo ve lo que ocurre a partir de que llega**: las ofertas anteriores se han perdido (un `SharedFlow` sin `replay` no recuerda nada). → [§5 `SharedFlow`](../../00-android/00-kotlin/52-flows.md#5-sharedflow-emision-de-eventos-unicos-one-shot-events)
- Para **comprobarlo con datos**, la API tiene `estadisticas()`: el servidor cuenta cuántas conexiones ha visto abrir.

!!! example "Manos a la obra"

    1. **Predice** antes de ejecutar: (a) si 3 colectores se enganchan al flujo frío `precios`, ¿cuántas conexiones ve el servidor? (b) un colector llega 3 s tarde al flujo caliente `ofertas`: ¿verá la oferta que salió a los 2 s?

    2. Ejecuta `estacion4/ejemplo/Main.kt`. Tarda unos 10 segundos: es el tiempo real de las ofertas.

    3. Compara con tu predicción y fíjate en la última línea de la parte caliente: ofertas emitidas en total frente a las que has visto tú.

??? success "Respuesta"
    **(a) Tres conexiones**, una por colector. **(b) No**: llega a los 3 s, así que se pierde la de los 2 s y solo ve las que salen después.

---

## 2 · Estación 4 · Tu turno: el ranking y el resumen (15 min)

Abre `estacion4/ejercicio/ClasificacionEnVivo.kt`. Hay dos `TODO`:

- `contarConexionesRanking`: lanza `colectores` colectores sobre `api.ranking()` (flujo **frío**), que recoge cada uno 3 rondas, y devuelve cuántas conexiones ha abierto el servidor.
- `resumenParaColectorTardio`: un colector llega tarde y pide el **resumen del mercado** (`api.resumen`, un `StateFlow`, que es **caliente**). Devuelve el primer valor que reciba.

!!! example "Manos a la obra"

    1. **Predice**: ¿cuántas conexiones esperas para 2 colectores del ranking? ¿Y para 3?

    2. Implementa `contarConexionesRanking`. Es `contarConexionesPrecios`, con otro flujo.

    3. Implementa `resumenParaColectorTardio`. Un `StateFlow` **siempre tiene un valor**, aunque llegues tarde: usa `first()`.

    4. Ejecuta los tests de `estacion4`. Fíjate en el último: comprueba que el colector tardío **no espera** a la siguiente oferta.

!!! warning "Gotcha"
    No confundas los dos calientes: un `SharedFlow` sin `replay` (las ofertas) **no recuerda nada** a quien llega tarde, pero un `StateFlow` (el resumen) **siempre entrega su último valor** nada más engancharte.

!!! success "Compara con la solución"
    [Ver la solución en GitHub](https://github.com/jssdocente/pmdm2627-lab-flows/compare/e4-ejemplo...e4-solucion) · tag `e4-solucion`.

---

## 3 · Estación 5 · Ejemplo: de frío a caliente (10 min)

!!! info "Punto de partida: rama `estacion-5` · tag `e5-ejemplo`"

    ```bash
    git switch estacion-5
    git switch -c mi-estacion5
    ```

Si tres pantallas colectan un flujo frío, son tres conexiones. Abre `estacion5/ejemplo/CotizadorDeJuego.kt`: dos operadores convierten el flujo frío en caliente **con una sola conexión para todos**. → [§7.1 `stateIn`](../../00-android/00-kotlin/52-flows.md#71-de-flow-frio-a-stateflow-el-operador-statein)

- **`stateIn`**: un `StateFlow` que siempre tiene un valor (el último, o el inicial si aún no ha llegado nada).
- **`shareIn(…, replay = 1)`**: un `SharedFlow` que reparte lo que llega y recuerda el último valor para quien llega tarde.
- **`SharingStarted.WhileSubscribed(5_000)`** decide **cuándo se conecta**: con el primer colector, y se desconecta cuando se va el último y pasan 5 s sin nadie. Esa espera evita reconectar si alguien se va un momento, por ejemplo al girar la pantalla.

!!! example "Manos a la obra"

    1. **Predice**: tres colectores se enganchan a `precioEnVivo`, ¿cuántas conexiones abre el servidor? Si se van todos y uno nuevo llega 2 s después, ¿se reconecta? ¿Y si llega 6 s después?

    2. Ejecuta `estacion5/ejemplo/Main.kt` (unos 11 s) y compara.

??? success "Respuesta"
    **Una** conexión para los tres. A los **2 s no se reconecta** (sigue viva, no han pasado los 5 s) y a los **6 s sí** (la conexión se cerró y hay que abrir otra). Antes de que nadie escuche, hay **0** conexiones: el flujo no se conecta hasta el primer colector.

---

## 4 · Estación 5 · Tu turno: la tabla de clasificación (15 min)

Abre `estacion5/ejercicio/TablaDeClasificacion.kt`. Convierte `api.ranking()`, que es frío, en caliente de dos formas, siempre con `WhileSubscribed(PARADA_TRAS_MS)`:

- `clasificacion`: un `StateFlow` con `emptyList()` como valor inicial.
- `ultimasClasificaciones`: un `SharedFlow` con `replay = 1`.

!!! example "Manos a la obra"

    1. Implementa `clasificacion` con `stateIn` y `ultimasClasificaciones` con `shareIn`. Es `CotizadorDeJuego`, con otro flujo.

    2. Ejecuta los tests de `estacion5`. Hay uno que comprueba que **tres pantallas comparten una sola conexión**, y otro que comprueba que se **reconecta solo si pasan más de 5 s** sin nadie.

!!! warning "Gotcha"
    Con `SharingStarted.Eagerly` el flujo se conecta **aunque no haya nadie escuchando** y no se desconecta nunca: gastas conexión para nada. `WhileSubscribed` es la opción habitual en una pantalla.

!!! success "Compara con la solución"
    [Ver la solución en GitHub](https://github.com/jssdocente/pmdm2627-lab-flows/compare/e5-ejemplo...e5-solucion) · tag `e5-solucion`.

---

## 5 · Estación 6 · Ejemplo: la cadena de operadores (10 min)

!!! info "Punto de partida: rama `estacion-6` · tag `e6-ejemplo`"

    ```bash
    git switch estacion-6
    git switch -c mi-estacion6
    ```

Abre `estacion6/ejemplo/BuscadorDeJuegos.kt`. Un buscador con favoritos es una **cadena de operadores** sobre dos flujos de entrada: lo que se escribe y los favoritos. → [§6 Operadores](../../00-android/00-kotlin/52-flows.md#6-operadores-de-transformacion-comunes)

- **`debounce(esperaMs)`**: espera a que el usuario deje de teclear. Sin él, cada tecla («p», «pi», «pix») sería una petición.
- **`distinctUntilChanged()`**: no repite la búsqueda si el texto final es igual al anterior.
- **`flatMapLatest { … }`**: lanza una búsqueda por cada consulta y **cancela la anterior si aún no ha terminado**. Así una respuesta lenta de «pix» no pisa la de «tur».
- **`combine(buscar, favoritos)`**: junta los dos flujos y recalcula la lista cuando cambia **cualquiera**, **sin repetir la petición** si solo cambian los favoritos. → [Combinar flujos](../../00-android/00-kotlin/52-flows.md#combinar-flujos-combine)
- **`stateIn`**: expone el resultado como `StateFlow`, que es lo que consume una pantalla.

!!! example "Manos a la obra"

    1. **Predice**: escribes «pix» letra a letra con 100 ms entre teclas y el buscador espera 300 ms. ¿Cuántas peticiones al catálogo se hacen por esa búsqueda? ¿Y al marcar un favorito?

    2. Ejecuta `estacion6/ejemplo/Main.kt`.

??? success "Respuesta"
    **Una** petición por «pix» (el `debounce` descarta «p» y «pi») y **ninguna** al marcar un favorito (el `combine` solo recalcula la lista con los datos que ya tiene).

---

## 6 · Estación 6 · Tu turno: el buscador de amigos (25 min)

Abre `estacion6/ejercicio/BuscadorDeAmigos.kt`. Las entradas ya están hechas (`consulta` y `favoritos`, con `escribir` y `alternarFavorito`). Escribe `resultados`: una cadena de operadores que espera a que el usuario deje de teclear, pide `api.amigos(jugadorId)` y filtra por nombre (sin distinguir mayúsculas), lo junta con los favoritos y lo expone como `StateFlow`.

!!! example "Manos a la obra"

    1. Escribe `resultados` siguiendo los cuatro pasos del comentario. Es `BuscadorDeJuegos` con las peticiones de amigos.

    2. Ejecuta los tests de `estacion6`. Cada uno comprueba un operador: si falla el de `debounce`, te falta esperar; si falla el de `flatMapLatest`, estás dejando que una respuesta antigua pise la nueva; si falla el de `combine`, marcar un favorito vuelve a pedir los amigos.

    3. **Prueba a romperlo**: cambia `flatMapLatest` por `flatMapConcat` y ejecuta los tests. ¿Cuál falla y por qué? Después déjalo como estaba.

??? success "Respuesta al punto 3"
    Falla el test de `flatMapLatest`: `flatMapConcat` **no cancela** la búsqueda anterior, la espera, así que la respuesta antigua llega y se aplica antes que la nueva.

!!! success "Compara con la solución"
    [Ver la solución en GitHub](https://github.com/jssdocente/pmdm2627-lab-flows/compare/e6-ejemplo...e6-solucion) · tag `e6-solucion`.

---

## 7 ⏩ · Cuenta las conexiones en el servidor de tu pareja (15 min)

Aquí ves lo de la estación 4 **desde el lado del servidor**.

!!! info "Punto de partida: rama `estacion-4`"

    ```bash
    git switch estacion-4
    ```

!!! example "Manos a la obra"

    1. **Quien hace de servidor** ejecuta `./gradlew :servidor:run` y abre `http://localhost:8080`. El panel tiene una sección con las **conexiones a precios y a ranking** que ha visto abrir. Si no recuerdas cómo conectar, repasa el [bloque de conexión](#8-conecta-con-el-servidor-de-tu-pareja-10-min) de la parte 1.

    2. **Quien hace de cliente** apunta `mercado.properties` a su IP y ejecuta `estacion4/ejemplo/Main.kt`.

    3. El servidor mira el panel: ¿cuántas conexiones a precios ve al acabar? Coincide con lo que predijo el cliente.

    4. **Cambiad de papeles.** Ahora el cliente ejecuta su solución de `contarConexionesRanking` y el servidor comprueba que ve exactamente las conexiones que debía.

---

## 8 ⏩ · Experimento: ¿y si no esperamos a nadie? (10 min)

!!! info "Punto de partida: tu rama `mi-estacion5`, con la estación 5 resuelta"

    Si no la tienes, usa `git switch estacion-5` y escribe antes la solución.

!!! example "Manos a la obra"

    1. En `TablaDeClasificacion`, cambia `SharingStarted.WhileSubscribed(PARADA_TRAS_MS)` de `clasificacion` por `SharingStarted.Eagerly`.

    2. Ejecuta los tests: ¿cuál falla?

    3. Piensa qué pasaría en una app real con ese cambio: la conexión se abriría **al crear la clase** y no se cerraría nunca, aunque ninguna pantalla mirase la clasificación.

    4. Déjalo como estaba.

??? success "Respuesta"
    Falla el test que comprueba que **se reconecta solo si pasan más de 5 s sin nadie**: con `Eagerly` la conexión nunca se cierra. En la app real, gastarías batería y datos con la pantalla fuera de vista.

---

## 🧪 Comprobación rápida de la parte 2

??? success "1 · Tres pantallas colectan el mismo flujo frío. ¿Cuántas conexiones? ¿Y si usan un `stateIn` con `WhileSubscribed`?"
    **Tres**, una por colector. Con `stateIn` y `WhileSubscribed`, **una** para todas.

??? success "2 · ¿En qué se diferencian un `SharedFlow` sin `replay` y un `StateFlow` para quien llega tarde?"
    El `SharedFlow` sin `replay` **no le entrega nada** de lo anterior. El `StateFlow` **siempre le entrega su último valor** nada más engancharse.

??? success "3 · ¿Para qué sirven los 5 s de `WhileSubscribed(5_000)`?"
    Para no cerrar y reabrir la conexión si el último colector se va **un momento** (por ejemplo, al girar la pantalla): si vuelve antes de 5 s, la conexión sigue viva.

??? success "4 · ¿Por qué `flatMapLatest` y no `flatMapConcat` en un buscador?"
    `flatMapLatest` **cancela** la búsqueda anterior cuando llega una nueva, así que una respuesta lenta y vieja nunca pisa a la actual.

---

## 🏠 Para casa

- Termina los bloques que no diera tiempo a hacer en clase.

- **Reto:** añade a `BuscadorDeAmigos` un tercer flujo de entrada, un `Boolean` «solo favoritos», y úsalo en el `combine` para filtrar la lista. ¿Hay que volver a pedir los amigos al activarlo?

- Mira cómo expone `stateIn` un ViewModel de Android en los apuntes de [De Room a Jetpack Compose](../../00-android/00-kotlin/52-flows.md#7-la-conexion-final-de-room-a-jetpack-compose): es exactamente el patrón de la estación 5.
