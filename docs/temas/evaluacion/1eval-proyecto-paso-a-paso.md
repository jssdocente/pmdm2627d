# **El juego de memoria, paso a paso**

Esta página te acompaña mientras construyes el [proyecto de la 1ª evaluación](1eval-proyecto.md). No es la solución: es el **esqueleto del proyecto**, fichero a fichero, con las piezas que ya conoces explicadas al grano y un `TODO` en cada sitio donde te toca programar a ti.

!!! info "Cómo se usa"

    1. Descarga la [plantilla del proyecto](1eval-proyecto.md#plantilla-readme) y **ejecútala**: ya arranca con un tablero mínimo que funciona. Es tu [punto de partida](#parte-0-tu-punto-de-partida). Todos los ficheros van dentro de `app/src/main/java/com/pm2627/p1ev/memory/` (los tests, en `app/src/test/java/com/pm2627/p1ev/memory/`). El título de cada bloque de código dice la ruta.

    2. Hay dos tipos de fichero. Los que **ya están en la plantilla** (`Carta`, `TableroUiState`, `TableroViewModel`, `TableroScreen` y `MainActivity`) los **amplías** cuando llegues a ellos: el bloque lo indica con «🧩 Ya está en la plantilla». Los demás los **creas** cuando llegues a ellos, no todos de golpe. Lee siempre el comentario de cada fichero: dice qué tiene que hacer esa pieza y por qué.

    3. Completa los `TODO` **en orden** (están numerados). Cada uno lleva una pista y el apartado de los apuntes donde se explica.

    4. El esqueleto **compila** desde el primer momento. Un `TODO("…")` que todavía no has hecho lanza una excepción **solo si se ejecuta**: así sabes qué te falta.

!!! warning "Entiende cada línea que escribes"

    El examen práctico se hace **sobre tu proyecto** y la defensa pide **señalar el fichero y la función** donde ocurre cada cosa. Si un `TODO` lo resuelve otra persona o una IA y no sabes explicarlo, te perderás en tu propio código. Los comentarios del esqueleto son tu mapa: déjalos y amplíalos con tus decisiones.

!!! abstract "Lo que no está aquí: las dos investigaciones"

    El **volteo animado** y el **temporizador con el retardo de fallo y la pausa** los investigas tú, como pide la guía. En el esqueleto solo verás un `TODO investigación` en el sitio donde irán, con el enlace a la [investigación 6.1](1eval-proyecto.md#investigacion-volteo) y a la [6.2](1eval-proyecto.md#investigacion-temporizador).

---

## El mapa del proyecto

Tres capas y tres pantallas. Fíjate en las dos flechas del centro: `onCartaPulsada(id)` es un **evento** que sube al ViewModel, y el `StateFlow` es el **estado** que baja a la pantalla.

<figure class="arq-fig">
--8<-- "docs/temas/evaluacion/img/mapa-proyecto-memory.svg"
<figcaption>Los paquetes del proyecto. El número de cada caja es la parte de esta guía en que la construyes.</figcaption>
</figure>

Y el **orden de trabajo**, el mismo de la guía del proyecto, repartido en tres partes:

| Parte | Qué construyes | Cómo sabes que funciona |
| :--- | :--- | :--- |
| [0 · El punto de partida](#parte-0-tu-punto-de-partida) | Llevas el estado del tablero mínimo de la plantilla al ViewModel | Giras el móvil y las casillas no se pierden |
| [1 · El corazón](#parte-1-el-corazon-modelo-reglas-y-tests) | El modelo, el estado, el ViewModel con las reglas y sus tests | Los tests de emparejar y ganar en verde, **sin pantalla** |
| [2 · La pantalla](#parte-2-la-pantalla-del-tablero) | El tablero: la cuadrícula de cartas pintada desde el estado | La `@Preview` y una partida jugable |
| [3 · Las tres pantallas](#parte-3-las-tres-pantallas) | Inicio, Resultado y la navegación entre ellas | Elegir nivel, jugar, ganar y volver |

---

## Parte 0 · Tu punto de partida

La plantilla no está vacía: trae la **estructura de paquetes** y un **tablero mínimo que ya funciona**. Son seis casillas lisas y un contador de toques. Al tocar una casilla se da la vuelta y enseña su número. Todavía no hay parejas, ni reglas, ni imágenes: eso lo construyes tú, paso a paso, sobre algo que ya ves en el móvil.

| Fichero de la plantilla | Qué hace ahora | Dónde lo amplías |
| :--- | :--- | :--- |
| `ui/tablero/TableroScreen.kt` | Pinta el tablero **y guarda el estado** con `remember` | Aquí (0.2) y en [2.1](#21-screen-y-content-como-se-disena-una-pantalla) a [2.5](#25-la-pantalla-con-estado) |
| `model/Carta.kt` | Una carta con `id` y `bocaArriba` | [1.4](#14-el-modelo-los-niveles-y-las-cartas) |
| `ui/tablero/TableroUiState.kt` | Existe, pero **nadie lo usa** | Aquí (0.2) y en [1.6](#16-el-estado-de-la-partida) |
| `ui/tablero/TableroViewModel.kt` | Existe, pero **nadie lo usa** | Aquí (0.2) y en [1.7](#17-el-viewmodel-las-reglas-del-juego) |
| `MainActivity.kt` | Muestra directamente `TableroScreen` | [3.3](#33-la-app-la-pila-las-pantallas-y-un-viewmodel-por-partida) |

### 0.1. Prueba: gira el móvil

1. Ejecuta la app y da la vuelta a dos o tres casillas.

2. Gira el móvil (en el emulador, con los botones de rotación).

3. Mira el contador y las casillas. ¿Qué ha pasado? ¿Por qué?

El tablero vuelve a empezar: las casillas boca abajo y los toques a 0. No es un error de Compose. `TableroScreen` está hecho **mal a propósito**: guarda el estado de la partida dentro de la pantalla, con `remember`, y al girar Android destruye la Activity y crea otra. Con ella se va todo lo que estaba en la composición. Los apartados [1.1](#11-el-estado-y-la-recomposicion), [1.2](#12-por-que-el-estado-sale-de-la-vista) y [1.3](#13-que-es-un-viewmodel-y-por-que-lo-necesitas) explican qué está pasando; léelos con la app abierta.

### 0.2. Del `remember` al ViewModel

!!! warning "Antes de empezar: ¿qué es un ViewModel?"
    Este paso usa un ViewModel por primera vez en el proyecto. Si no tienes claro qué es, cuánto vive y qué partes tiene, lee antes [1.3 · Qué es un ViewModel](#13-que-es-un-viewmodel-y-por-que-lo-necesitas). Te llevará cinco minutos y es la base de todo lo demás.

El arreglo es sacar el estado de la pantalla y llevarlo al `TableroViewModel`, que ya existe y sobrevive al giro. Hazlo **sin cambiar lo que se ve**: el tablero tiene que seguir funcionando igual, pero ahora sin perderse.

1. **El estado, en `TableroUiState`.** Lo que hoy son dos variables de la pantalla (las cartas y los toques) pasa a ser un único objeto inmutable.

2. **El ViewModel lo crea y lo publica.** En su `MutableStateFlow` privado empieza con las seis cartas boca abajo, y lo expone como `StateFlow` de solo lectura (`uiState`).

3. **El evento sube.** Lo que hacía el `onClick` de la casilla se convierte en una función del ViewModel, `onCartaPulsada(id)`, que publica un estado nuevo con `_uiState.update { it.copy(…) }`.

4. **La pantalla solo pinta y avisa.** `TableroScreen` obtiene el ViewModel con `viewModel()`, lee el estado con `collectAsStateWithLifecycle()` y, al pulsar, llama a `viewModel.onCartaPulsada(carta.id)`. Ya no queda ningún `remember` con datos del juego.

5. **Comprueba.** Gira el móvil: las casillas y el contador siguen ahí.

!!! tip "Lo que acabas de hacer es la arquitectura del proyecto entero"
    El evento **sube** al ViewModel y el estado **baja** a la pantalla (UDF). A partir de aquí no cambias la forma, solo la llenas: el estado crece con el nivel y los movimientos ([1.6](#16-el-estado-de-la-partida)), `onCartaPulsada` pasa de «dar la vuelta» a aplicar las reglas del Memory ([1.7](#17-el-viewmodel-las-reglas-del-juego)) y la pantalla se divide en piezas sin estado ([Parte 2](#parte-2-la-pantalla-del-tablero)).

!!! info "📚 En los apuntes"

    - 3C.1 · [§1.1 Supervivencia ante cambios de configuración](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#11-supervivencia-ante-cambios-de-configuracion) · [§3 StateFlow y UDF](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#3-reactividad-con-stateflow-y-el-patron-udf) · [§4.1 Pantalla contenedora](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#41-pantalla-contenedora-stateful-screen)
    - Compose · [collectAsStateWithLifecycle](../00-android/00-compose/22-state-management.md#2-consumo-seguro-en-compose-collectasstatewithlifecycle)
    - Sesión de clase: [3.05 · ViewModel y UiState (I)](../03/sesiones/s05-viewmodel-uistate-i.md)
    - Glosario: [cambio de configuración](../glosario.md#cambio-de-configuracion) · [ViewModel](../glosario.md#viewmodel) · [UDF](../glosario.md#udf)

---

## Parte 1 · El corazón: modelo, reglas y tests

Antes de dibujar nada, el juego tiene que **funcionar en un test**. Si la lógica está bien, la pantalla solo tiene que pintarla.

### 1.1. El estado y la recomposición

En Compose, la pantalla es una **función del estado**: `UI = f(estado)`. No se cambia un texto «a mano»; se cambia el **dato**, y Compose vuelve a ejecutar las funciones que lo leen. A eso se le llama **recomposición**.

Dos ideas que lo explican todo:

- **Una variable normal no es estado.** Si cambia, nadie avisa a Compose y la pantalla no se entera. Además, en cada recomposición la función se ejecuta otra vez desde el principio, y la variable vuelve a su valor inicial.
- **El estado es un valor observable**: `mutableIntStateOf(0)`, `mutableStateOf(…)` o un `StateFlow`. Al cambiar, Compose recompone **solo** las funciones que lo leen, no la pantalla entera. `remember` sirve para que ese valor sobreviva a las recomposiciones.

<figure class="arq-fig">
--8<-- "docs/temas/evaluacion/img/recomposicion-memory.svg"
<figcaption>Al pulsar una carta solo se vuelven a ejecutar las funciones que leen lo que ha cambiado: esa carta, no el tablero entero.</figcaption>
</figure>

!!! info "📚 En los apuntes"

    - Compose · [Qué es el estado](../00-android/00-compose/22-state-management.md#que-es-el-estado-y-por-que-es-importante) y [remember y mutableStateOf](../00-android/00-compose/22-state-management.md#declarando-el-estado-el-duo-indispensable-remember-y-mutablestateof)
    - Sesión de clase: [2.02 · Estado y state hoisting](../02/sesiones/s02-estado-state-hoisting.md)
    - Glosario: [recomposición](../glosario.md#recomposicion) · [remember](../glosario.md#remember)

### 1.2. Por qué el estado sale de la vista

Si el contador de movimientos o las cartas del tablero vivieran en un `remember` dentro de la pantalla, el juego tendría tres problemas:

1. **Se pierde al girar el móvil.** Android destruye la Activity y crea otra, y con ella se va todo lo que estaba en la composición.

2. **Las reglas quedarían mezcladas con el dibujo.** La pantalla decidiría si dos cartas son pareja, y eso no se puede probar sin pantalla.

3. **La pantalla no se podría ver en una `@Preview`** con un estado inventado, porque crearía su propio estado.

La solución tiene dos pasos. Primero, **elevar el estado** (*state hoisting*): la vista deja de guardarlo y lo recibe como parámetro, y en lugar de cambiarlo, **avisa** con una lambda.

```kotlin
// La vista no guarda nada: recibe el valor y avisa del evento
@Composable
fun Marcador(movimientos: Int, onReiniciar: () -> Unit) {
    Row {
        Text("Movimientos: $movimientos")
        Button(onClick = onReiniciar) { Text("Reiniciar") }
    }
}
```

Segundo, **llevarlo a un ViewModel**, que vive fuera de la Activity y es donde se escriben las reglas. Compruébalo con el contador de movimientos: elige dónde vive y prueba a sumar, a provocar una recomposición y a girar el móvil.

<div class="cpa" data-cpa="estado"></div>

Fíjate en la tabla de abajo: solo con el ViewModel se cumplen las cuatro condiciones. Por eso el proyecto exige que **la pantalla solo pinte el estado y envíe eventos**.

!!! info "📚 En los apuntes"

    - Compose · [State hoisting y UDF](../00-android/00-compose/22-state-management.md#elevacion-del-estado-state-hoisting-y-patron-udf) · [La regla de oro del state hoisting](../00-android/00-compose/22-state-management.md#la-regla-de-oro-del-state-hoisting)
    - 3C.1 · [§1.1 Supervivencia ante cambios de configuración](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#11-supervivencia-ante-cambios-de-configuracion)
    - Glosario: [state hoisting](../glosario.md#state-hoisting) · [rememberSaveable](../glosario.md#remembersaveable)

### 1.3. Qué es un ViewModel y por qué lo necesitas

Un **ViewModel** es una clase de Android Jetpack (`androidx.lifecycle.ViewModel`) que **guarda el estado de una pantalla y la lógica que lo cambia**. No dibuja nada y no sabe nada de Compose: tiene datos y funciones. La pantalla le **pide** el estado para pintarlo y le **avisa** de lo que hace el usuario.

Lo que lo hace especial es **cuánto vive**. Una función `@Composable` se ejecuta una y otra vez, y la Activity se destruye y se vuelve a crear cada vez que giras el móvil. El ViewModel no: Android lo guarda en un **almacén** (`ViewModelStore`) **fuera** de la Activity. Al girar, la Activity nueva pide el ViewModel y recibe **el mismo objeto**, con su estado intacto.

**El almacén (`ViewModelStore`).** Es un objeto de Android que guarda los ViewModel de una pantalla, cada uno con una **clave** (por defecto, el nombre de su clase). Piensa en el guardarropa de un teatro: dejas el abrigo, te dan un número, y aunque salgas un momento al pasillo, al volver te devuelven **tu** abrigo. Solo cuando el teatro cierra se vacía el guardarropa.

<figure class="arq-fig">
--8<-- "docs/temas/evaluacion/img/almacen-viewmodel-memory.svg"
<figcaption>Qué pasa con el almacén al girar el móvil y cuándo se vacía.</figcaption>
</figure>

1. **Cada almacén tiene un dueño.** En el punto de partida, el dueño es la `MainActivity`. Cuando haya navegación ([3.3](#33-la-app-la-pila-las-pantallas-y-un-viewmodel-por-partida)), cada pantalla de la pila tendrá **su propio almacén**, y por eso cada partida tendrá su propio ViewModel.

2. **`viewModel()` busca antes de crear.** Mira en el almacén si ya hay un ViewModel con esa clave. Si no lo hay, lo crea y lo guarda; si lo hay, devuelve **ese**. Simplificado, hace esto:

    ```kotlin
    // Lo que hace viewModel() por dentro (muy simplificado)
    val vm = almacen["TableroViewModel"]       // ¿ya existe? Lo devuelve.
        ?: TableroViewModel().also {           // si no, lo crea…
            almacen["TableroViewModel"] = it   // …y lo guarda.
        }
    ```

3. **Al girar, Android no vacía el almacén.** Destruye la Activity, pero le pasa el almacén a la Activity nueva. Ella llama otra vez a `viewModel()` y encuentra el mismo ViewModel.

4. **Al salir de verdad, sí lo vacía.** Si cierras la pantalla con atrás (o, con navegación, la partida sale de la pila), Android sabe que no va a volver: vacía el almacén y llama a `onCleared()` de cada ViewModel, que cancela sus corrutinas.

La clave de todo: **la Activity es de usar y tirar; el almacén, no**. Por eso el estado del juego va en el ViewModel y no en la pantalla.

| | `remember` en la pantalla | ViewModel |
| :--- | :--- | :--- |
| ¿Dónde vive el dato? | En la composición | En el almacén, fuera de la Activity |
| ¿Sobrevive a una recomposición? | Sí | Sí |
| ¿Sobrevive al giro del móvil? | **No** (es lo que viste en [0.1](#01-prueba-gira-el-movil)) | **Sí** |
| ¿Dónde están las reglas del juego? | Mezcladas con el dibujo | En funciones del ViewModel |
| ¿Se puede probar sin pantalla? | No | **Sí**, con un test normal ([1.8](#18-los-tests-el-juego-funciona-sin-pantalla)) |

**Cuánto vive, paso a paso.** Recorre la animación entera; fíjate sobre todo en los pasos del giro y en el de `onCleared()`:

1. **Nace** la primera vez que la pantalla lo pide.

2. **Sobrevive** al giro: la Activity muere y renace, pero el almacén le devuelve el mismo ViewModel.

3. **Muere** cuando la pantalla se va de verdad (sales de la app con atrás, o la partida sale de la pila de navegación). Justo antes, Android llama a su `onCleared()` y cancela sus corrutinas.

<div class="cpa" data-cpa="giro"></div>

**Sus tres partes.** Todos los ViewModel del curso tienen la misma forma. Es la que ya tiene el `TableroViewModel` de la plantilla:

```kotlin
class TableroViewModel : ViewModel() {                              // 1 · hereda de ViewModel

    private val _uiState = MutableStateFlow(TableroUiState())       // 2 · el estado: privado y modificable…
    val uiState: StateFlow<TableroUiState> = _uiState.asStateFlow() //     …y público de solo lectura

    fun onCartaPulsada(id: Int) {                                   // 3 · un evento: lo que hace el usuario
        _uiState.update { it.copy(/* … */) }                        //     publica un estado NUEVO
    }
}
```

1. **Hereda de `ViewModel`.** Es lo que hace que Android lo guarde en el almacén y lo conserve al girar.

2. **El estado, en un `StateFlow`.** Dentro, un `MutableStateFlow` privado que solo el ViewModel puede cambiar; fuera, un `StateFlow` de solo lectura. La pantalla lo observa y se recompone cada vez que llega un estado nuevo, pero **no puede modificarlo**.

3. **Los eventos, como funciones `onAlgo`.** La pantalla no cambia el estado: llama a `onCartaPulsada(id)`. Dentro se aplican las reglas y se publica un estado nuevo con `copy`.

**Cómo lo usa la pantalla.** Dos líneas, que escribirás en el [paso 0.2](#02-del-remember-al-viewmodel):

```kotlin
val viewModel: TableroViewModel = viewModel()                      // pide el ViewModel (el mismo tras girar)
val estado by viewModel.uiState.collectAsStateWithLifecycle()     // observa su estado
```

`viewModel()` no crea un ViewModel nuevo cada vez: la primera vez lo crea y lo guarda en el almacén, y las siguientes (también después de girar) devuelve el que ya existe. Por eso **nunca** se escribe `TableroViewModel()` a mano dentro de un composable.

!!! danger "Lo que no va en un ViewModel"
    - **Nada de Compose:** ni `@Composable`, ni `remember`, ni `mutableStateOf` para el estado de la pantalla. El ViewModel no importa nada de `androidx.compose`, y por eso se puede probar sin pantalla.
    - **Ninguna referencia a la Activity ni a una vista.** El ViewModel vive más que la Activity: si guardara una, la mantendría viva después de destruirse (una fuga de memoria).
    - **Nada de navegación:** el ViewModel no cambia de pantalla. Expone en el estado que la partida está ganada, y es la pantalla la que avisa hacia fuera ([2.5](#25-la-pantalla-con-estado)).

!!! info "📚 En los apuntes"

    - 3C.1 · [§1 El rol del ViewModel](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#1-el-rol-del-viewmodel-en-la-arquitectura-moderna) · [§1.1 Supervivencia ante cambios de configuración](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#11-supervivencia-ante-cambios-de-configuracion)
    - 3C.1 · [§3 StateFlow y UDF](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#3-reactividad-con-stateflow-y-el-patron-udf) · [§3.1 Implementación del ViewModel](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#31-implementacion-del-viewmodel) · [§4.1 Pantalla contenedora](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#41-pantalla-contenedora-stateful-screen)
    - 3B.1 · [§8 Un ViewModel para cada pantalla](../03/b-navegacion/3b.1-navigation3.md#8-un-viewmodel-para-cada-pantalla)
    - Sesión de clase: [3.05 · Por qué un ViewModel](../03/sesiones/s05-viewmodel-uistate-i.md#1-por-que-un-viewmodel-10-min) · [El ViewModel: StateFlow y eventos](../03/sesiones/s05-viewmodel-uistate-i.md#4-el-viewmodel-stateflow-y-eventos-20-min)
    - Codelab: [3.06 · Quiz con ViewModel: el ViewModel](../03/codelabs/06-quiz-viewmodel.md#5-paso-3-el-viewmodel) · [¿Por qué sobrevive al giro?](../03/codelabs/06-quiz-viewmodel.md#7-paso-5-por-que-sobrevive-al-giro)
    - Glosario: [ViewModel](../glosario.md#viewmodel) · [ViewModelStore](../glosario.md#viewmodelstore) · [viewModelScope](../glosario.md#viewmodelscope) · [StateFlow](../glosario.md#stateflow) · [MVVM](../glosario.md#mvvm)

### 1.4. El modelo: los niveles y las cartas

Los datos del juego, sin nada de Android. Un **nivel** es un dato fijo (unos pocos y conocidos), así que es una `enum class` con propiedades. Una **carta** es un dato inmutable: una `data class` con `val`.

`Nivel.kt` lo creas. 🧩 `Carta.kt` **ya está en la plantilla** con `id` y `bocaArriba`: sustitúyelo por esta versión y completa el `TODO 2`. Al cambiar `bocaArriba` por la situación de la carta, el compilador te señalará los sitios de la pantalla que tienes que adaptar.

```kotlin title="model/Nivel.kt"
package com.pm2627.p1ev.memory.model

/**
 * LOS NIVELES DEL JUEGO
 *
 * Un nivel es un dato fijo: hay unos pocos y se conocen de antemano. Por eso es
 * una enum class, con una constante por nivel (por ejemplo FACIL, MEDIO, DIFICIL).
 *
 * Cada nivel debe saber TODO lo que cambia de un nivel a otro, para que el resto
 * del código no tenga números sueltos:
 *   - cuántas filas y cuántas columnas tiene su tablero;
 *   - cuántas parejas hay (¿lo guardas o se calcula con las filas y columnas?);
 *   - el texto que se muestra en la pantalla de inicio.
 *
 * Prueba de diseño: si mañana hay que añadir un cuarto nivel, solo debería
 * cambiar este fichero.
 *
 * Apuntes: Kotlin · enum con propiedades (24-enum-classes §2)
 */
enum class Nivel {
    // TODO 1: añade las constantes con sus propiedades.
    //   Forma: enum class Nivel(val propiedad: Tipo, …) { CONSTANTE(valor, …), …; }
}
```

```kotlin title="model/Carta.kt"
package com.pm2627.p1ev.memory.model

/**
 * UNA CARTA DEL TABLERO
 *
 * Es un dato inmutable (data class con val): para cambiar una carta no se modifica,
 * se crea otra con copy(…).
 *
 * El estado tiene que poder decir TODO lo que se pinta de cada carta sin preguntar
 * nada más. Piensa qué necesita:
 *   - id: un identificador ÚNICO en el tablero. Lo usa la cuadrícula como key y el
 *     ViewModel para saber qué carta se ha pulsado. (Ya está puesto.)
 *   - qué dibujo muestra boca arriba. Las imágenes están en res/drawable y en el
 *     código son un Int: R.drawable.nombre (puedes anotarlo con @DrawableRes).
 *   - cómo se sabe que dos cartas son pareja. Ojo: no puede ser el id, porque las
 *     dos cartas de una pareja tienen ids distintos.
 *   - en qué situación está: ¿boca abajo?, ¿boca arriba?, ¿ya emparejada?
 *     Si son más de dos situaciones, un Boolean no basta: crea una enum class.
 *
 * Apuntes: Kotlin · data class y copy (23-data-classes) · enum (24-enum-classes)
 */
data class Carta(
    val id: Int,
    // TODO 2: añade el resto de propiedades (dibujo, pareja y situación).
)
```

¿Por qué no varios `Boolean` para la situación de la carta? Porque permiten combinaciones imposibles (boca abajo **y** emparejada a la vez). Compáralo:

<div class="cpa" data-cpa="situacion"></div>

!!! info "📚 En los apuntes"

    - Kotlin · [Enum con propiedades](../00-android/00-kotlin/24-enum-classes.md#2-enums-con-propiedades-y-metodos) · [Enum y when exhaustivo](../00-android/00-kotlin/24-enum-classes.md#5-el-duo-estrella-enum-y-la-expresion-when-exhaustiva) · [entries](../00-android/00-kotlin/24-enum-classes.md#3-iteracion-moderna-entries-vs-values)
    - Kotlin · [Declarar una data class](../00-android/00-kotlin/23-data-classes.md#1-declaracion-de-una-data-class) · [copy y la inmutabilidad](../00-android/00-kotlin/23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad) · [equals basado en contenido](../00-android/00-kotlin/23-data-classes.md#22-equals-y-hashcode-basados-en-contenido)
    - Glosario: [enum class](../glosario.md#enum-class) · [data class](../glosario.md#data-class) · [copy](../glosario.md#copy)

### 1.5. Repartir y barajar

Una función de Kotlin puro que recibe el nivel y devuelve las cartas ya barajadas. Recibe también el `Random`: en la app será `Random.Default` (cada partida distinta) y en un test, `Random(42)` (siempre el mismo orden).

```kotlin title="model/Reparto.kt"
package com.pm2627.p1ev.memory.model

import kotlin.random.Random

/**
 * REPARTIR Y BARAJAR
 *
 * Devuelve las cartas de una partida nueva del nivel indicado, ya barajadas:
 *   - una pareja (dos cartas) por cada dibujo, tantas parejas como diga el nivel;
 *   - cada carta con un id distinto y empezando boca abajo;
 *   - en un orden distinto en cada partida.
 *
 * ¿Por qué recibe un Random? En la app usarás Random.Default, y cada partida sale
 * distinta. En un test le pasarás Random(42): con la misma semilla sale SIEMPRE el
 * mismo orden, y el test es repetible.
 *
 * Pistas: take(n) para coger tantos dibujos como parejas · flatMap para hacer dos
 * cartas de cada dibujo · shuffled(random) para barajar · mapIndexed para dar un id.
 *
 * Apuntes: Kotlin · listas (42-listas §4) · Glosario: shuffled, Random con semilla
 */
fun repartir(nivel: Nivel, dibujos: List<Int>, random: Random): List<Carta> {
    TODO("3: take -> flatMap (dos cartas por dibujo) -> shuffled(random) -> mapIndexed (ids)")
}
```

```kotlin title="model/Dibujos.kt"
package com.pm2627.p1ev.memory.model

/**
 * LOS DIBUJOS DE LAS CARTAS
 *
 * Copia tus imágenes (propias o con licencia libre) en res/drawable, con nombres en
 * minúsculas y sin espacios: zorro.png → R.drawable.zorro.
 *
 * Necesitas al menos tantos dibujos como parejas tenga tu nivel más grande.
 * Recuerda indicar en el README la fuente y la licencia de cada imagen.
 *
 * Apuntes: UT2 · imágenes y recursos (2.3.2)
 */
val dibujos: List<Int> = listOf(
    // TODO 4: R.drawable.tu_imagen_1, R.drawable.tu_imagen_2, …
    //   (importa com.pm2627.p1ev.memory.R cuando escribas el primero)
)
```

!!! info "📚 En los apuntes"

    - Kotlin · [Listas: operaciones funcionales](../00-android/00-kotlin/42-listas.md#4-operaciones-funcionales-imprescindibles) · [groupBy](../00-android/00-kotlin/42-listas.md#44-agrupacion-y-ordenacion-groupby-y-sortedby) · [Inmutabilidad de las listas](../00-android/00-kotlin/42-listas.md#3-inmutabilidad-y-adicion-funcional-de-elementos)
    - UT2 · [Los recursos y la clase R](../02/2.3.2-imagenes-iconos-recursos.md#la-clase-r) · [Mapas de bits y vectores](../02/2.3.2-imagenes-iconos-recursos.md#2-mapas-de-bits-y-vectores)
    - Glosario: [shuffled](../glosario.md#shuffled) · [Random con semilla](../glosario.md#random-semilla)

### 1.6. El estado de la partida

🧩 **Ya está en la plantilla** (y en el [paso 0.2](#02-del-remember-al-viewmodel) le añadiste los toques). Ahora crece: el contador de toques se convierte en el de **movimientos** y entra lo que necesita el nivel.

Todo lo que pinta el tablero, en un único objeto inmutable. Si algo se ve en pantalla, sale de aquí. Cada cambio produce un estado **nuevo**: así el `StateFlow` detecta que es distinto y avisa a la pantalla.

<div class="cpa" data-cpa="turno"></div>

```kotlin title="ui/tablero/TableroUiState.kt"
package com.pm2627.p1ev.memory.ui.tablero

import com.pm2627.p1ev.memory.model.Carta

/**
 * EL ESTADO DE LA PARTIDA: todo lo que pinta la pantalla del tablero.
 *
 * Reglas:
 *   - data class con val: inmutable. Cada cambio crea un estado nuevo con copy(…).
 *   - es la ÚNICA fuente de verdad: si algo se ve en pantalla, sale de aquí.
 *     Nada de remember en la pantalla para los datos del juego.
 *   - lo que se puede CALCULAR a partir de otros datos no se guarda: se escribe como
 *     propiedad calculada (val x: Int get() = …), y así nunca se desincroniza.
 *
 * Piensa qué más necesita:
 *   - las cartas del tablero (ya está);
 *   - lo que la pantalla necesite del nivel (por ejemplo, cuántas columnas pintar);
 *   - el contador de movimientos (una jugada = dos cartas volteadas);
 *   - las parejas encontradas: ¿las guardas o las cuentas con las cartas?
 *   - si la partida está ganada: ¿guardado o calculado?
 *   - cuál es la primera carta del turno: ¿la guardas o la deduces de las cartas?
 *   - el bloqueo del tablero y los segundos llegarán con la investigación 6.2.
 *
 * Apuntes: 3C.1 §2 (modelado inmutable del estado)
 */
data class TableroUiState(
    val cartas: List<Carta> = emptyList(),
    // TODO 5: añade el resto del estado y, en el cuerpo, las propiedades calculadas.
)
```

!!! info "📚 En los apuntes"

    - 3C.1 · [§2 Modelado inmutable del estado](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#2-modelado-inmutable-del-estado-uistate) · [§2.1 Ejemplo: el estado de un juego](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#21-ejemplo-modelado-de-estado-para-un-juego)
    - Compose · [Estado agregado con data class](../00-android/00-compose/22-state-management.md#patron-2-estado-agregado-continuo-data-class)
    - Glosario: [UiState](../glosario.md#uistate) · [inmutabilidad](../glosario.md#inmutabilidad) · [StateFlow](../glosario.md#stateflow)

### 1.7. El ViewModel: las reglas del juego

🧩 **Ya está en la plantilla** y desde el [paso 0.2](#02-del-remember-al-viewmodel) tiene un `onCartaPulsada` que solo da la vuelta a la carta. Sustitúyelo por esta versión: ahora recibe el nivel y el `Random`, reparte las cartas y `onCartaPulsada` aplica las reglas del Memory.

La pantalla **no decide nada**: avisa de que se ha pulsado la carta 7 y el ViewModel aplica las reglas y publica un estado nuevo. Juega una partida y mira el registro de la derecha: cada toque dice qué caso del KDoc de `onCartaPulsada` se ha aplicado (1, 2, 3, 4a o 4b).

<div class="cpa" data-cpa="tablero"></div>

Dos pruebas que merecen la pena:

- Pulsa **dos veces la misma carta**: el segundo toque llega al ViewModel, pero la regla 2 lo ignora y no hay estado nuevo. Luego marca «Quitar la regla 2» y repítelo: la carta se empareja consigo misma.
- Fíjate en el **número** de cada carta: solo se vuelven a dibujar las que cambian en el estado nuevo, no el tablero entero.

```kotlin title="ui/tablero/TableroViewModel.kt"
package com.pm2627.p1ev.memory.ui.tablero

import androidx.lifecycle.ViewModel
import com.pm2627.p1ev.memory.model.Nivel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.random.Random

/**
 * EL VIEWMODEL DE UNA PARTIDA: aquí viven las REGLAS del juego.
 *
 *   - Recibe por el constructor lo que la partida necesita y lo que un test querrá
 *     controlar: el nivel y el Random con el que se baraja.
 *   - Guarda el estado en un MutableStateFlow PRIVADO y lo publica como StateFlow de
 *     solo lectura: la pantalla lo observa, pero no puede cambiarlo.
 *   - Cada cosa que hace el usuario es una función-evento (onAlgo). Dentro se aplican
 *     las reglas y se publica un estado nuevo con _uiState.update { it.copy(…) }.
 *   - No importa nada de Compose: por eso se puede probar sin pantalla.
 *
 * Apuntes: 3C.1 §3 (StateFlow y flujo unidireccional) · Sesión 3.05
 */
class TableroViewModel(
    private val nivel: Nivel,
    private val random: Random = Random.Default,
) : ViewModel() {

    private val _uiState = MutableStateFlow(TableroUiState())
    val uiState: StateFlow<TableroUiState> = _uiState.asStateFlow()

    init {
        onNuevaPartida()
    }

    /**
     * EVENTO: empezar (o volver a empezar) una partida del mismo nivel.
     *
     * Reparte las cartas con repartir(nivel, dibujos, random) y deja todo lo demás
     * como al principio: un TableroUiState nuevo con esas cartas (y lo que necesites
     * del nivel).
     */
    fun onNuevaPartida() {
        TODO("6: _uiState.value = TableroUiState(cartas = repartir(nivel, dibujos, random), …)")
    }

    /**
     * EVENTO: el usuario ha pulsado la carta con este id.
     *
     * Es el corazón del juego. Piensa los casos UNO A UNO y en este orden; en cada
     * uno decide qué estado nuevo se publica, o si no se hace nada:
     *
     *   1. ¿El tablero está bloqueado?             → nada (llega con la investigación 6.2).
     *   2. ¿La carta ya está boca arriba o emparejada? → nada.
     *   3. ¿Es la PRIMERA carta del turno?         → se pone boca arriba.
     *   4. ¿Es la SEGUNDA?                         → se pone boca arriba y cuenta UN movimiento.
     *        a. ¿Son pareja?  → las dos quedan emparejadas. ¿Era la última? → partida ganada.
     *        b. ¿No lo son?   → se ven un momento y vuelven boca abajo, con el tablero
     *                           bloqueado mientras tanto (investigación 6.2). Hasta que
     *                           lo investigues, vuelve a ponerlas boca abajo directamente.
     *
     * Para cambiar UNA carta de una lista inmutable:
     *   cartas.map { if (it.id == id) it.copy(…) else it }
     *
     * Consejo: si crece, sácala en funciones privadas (voltear, resolverTurno…) y deja
     * aquí solo los casos, con un when.
     *
     * Apuntes: 3C.1 §3.1 (implementación del ViewModel) · Glosario: when, copy
     */
    fun onCartaPulsada(id: Int) {
        TODO("7: aplica las reglas en orden y publica el estado nuevo con _uiState.update { … }")
    }

    // TODO investigación 6.2 (temporizador, retardo de fallo y pausa): aquí irán el Job del
    // temporizador, el retardo con bloqueo y los eventos de salir y volver a la app.
    // Guía del proyecto § 6.2.
}
```

!!! tip "La regla, en el ViewModel"
    Que una carta ya descubierta no se pueda pulsar no se resuelve desactivando la carta en la pantalla: lo decide `onCartaPulsada`. Es lo que se puede probar con un test y lo que protege el juego, llegue el toque de donde llegue.

!!! info "📚 En los apuntes"

    - 3C.1 · [§3 StateFlow y UDF](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#3-reactividad-con-stateflow-y-el-patron-udf) · [§3.1 Implementación del ViewModel](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#31-implementacion-del-viewmodel)
    - Sesiones de clase: [3.05 · ViewModel y UiState (I)](../03/sesiones/s05-viewmodel-uistate-i.md) · [3.07 · ViewModel y UiState (II)](../03/sesiones/s07-viewmodel-uistate-ii.md)
    - Investigación 6.2 (bloqueo y temporizador): [guía del proyecto](1eval-proyecto.md#investigacion-temporizador) · [3C.1 §5 Tareas con tiempo](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#5-tareas-con-tiempo-en-el-viewmodel)
    - Glosario: [UDF](../glosario.md#udf) · [when](../glosario.md#when) · [copy](../glosario.md#copy)

### 1.8. Los tests: el juego funciona sin pantalla

Un test prepara un ViewModel, llama a sus eventos como si el usuario pulsara y comprueba el estado. Con `Random(42)` el reparto es siempre el mismo, pero es más robusto **buscar en el estado** qué cartas son pareja que memorizar posiciones.

<div class="cpa" data-cpa="test"></div>

La regla `MainDispatcherRule` va completa: sustituye el hilo principal, que en un test no existe. Cópiala tal cual.

```kotlin title="test · ui/tablero/MainDispatcherRule.kt"
package com.pm2627.p1ev.memory.ui.tablero

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.TestDispatcher
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.rules.TestWatcher
import org.junit.runner.Description

/**
 * Sustituye el hilo principal (Dispatchers.Main) por uno de pruebas: viewModelScope lo
 * usa y en un test de la JVM no existe. Completa: no hay que tocarla.
 *
 * Apuntes: 3C.4 §4.1 (el problema del hilo principal)
 */
@OptIn(ExperimentalCoroutinesApi::class)
class MainDispatcherRule(
    private val testDispatcher: TestDispatcher = UnconfinedTestDispatcher(),
) : TestWatcher() {

    override fun starting(description: Description) {
        Dispatchers.setMain(testDispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}
```

```kotlin title="test · ui/tablero/TableroViewModelTest.kt"
package com.pm2627.p1ev.memory.ui.tablero

import kotlinx.coroutines.test.runTest
import org.junit.Rule
import org.junit.Test

/**
 * TESTS DEL VIEWMODEL: la lógica del juego se prueba SIN pantalla.
 *
 * Cada test sigue tres pasos:
 *   - Arrange (preparar): un ViewModel con Random(42), para que el reparto sea siempre el mismo.
 *   - Act (actuar): llamar a los eventos, como si el usuario pulsara.
 *   - Assert (comprobar): mirar viewModel.uiState.value.
 *
 * Mínimos que pide la guía: emparejar, fallar y ganar.
 *
 * Apuntes: 3C.4 §1.3 (Arrange, Act, Assert) y §4 (probar los ViewModel)
 */
class TableroViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    // TODO 8: usa tu nivel más pequeño, para que los tests sean cortos.
    private fun crearViewModel(): TableroViewModel =
        TODO("TableroViewModel(nivel = Nivel.TU_NIVEL_PEQUEÑO, random = Random(42))")

    /** Ids de dos cartas que SÍ son pareja en el estado actual. */
    private fun idsDeUnaPareja(estado: TableroUiState): Pair<Int, Int> =
        TODO("9: agrupa las cartas por su pareja (groupBy) y coge los dos ids de un grupo")

    /** Ids de dos cartas que NO son pareja en el estado actual. */
    private fun idsQueNoSonPareja(estado: TableroUiState): Pair<Int, Int> =
        TODO("10: coge una carta de dos grupos distintos")

    @Test
    fun `al pulsar dos cartas iguales quedan emparejadas y cuenta un movimiento`() {
        // Arrange: el ViewModel y los ids de una pareja
        // Act: pulsar las dos
        // Assert: las dos emparejadas, 1 movimiento, 1 pareja
        TODO("11")
    }

    @Test
    fun `al pulsar dos cartas distintas no se emparejan y cuenta un movimiento`() = runTest {
        // Con la investigación 6.2 habrá una espera antes de ocultarlas: en el test se
        // avanza el reloj virtual con advanceTimeBy(…) y runCurrent() (3C.1 §5.4).
        TODO("12")
    }

    @Test
    fun `al encontrar todas las parejas la partida queda ganada`() = runTest {
        // Recorre las parejas del estado y pulsa las dos cartas de cada una.
        TODO("13")
    }

    @Test
    fun `pulsar una carta ya descubierta no cambia nada`() {
        TODO("14 (recomendado): pulsa una carta dos veces y compara el estado antes y después")
    }
}
```

Cuando hagas la investigación 6.2, el test de fallar necesitará el **reloj virtual**. Así funciona por dentro: [3C.1 §5.4](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#54-probar-el-tiempo-sin-esperar).

!!! info "📚 En los apuntes"

    - 3C.4 · [§1.3 Arrange, Act, Assert](../03/c-arquitectura/3c.4-testing.md#13-estructura-de-un-test-arrange-act-assert) · [§4 Probar los ViewModel](../03/c-arquitectura/3c.4-testing.md#4-probar-los-viewmodel) · [§4.1 El problema del hilo principal](../03/c-arquitectura/3c.4-testing.md#41-el-problema-del-hilo-principal) · [§6 Ejecutar los tests](../03/c-arquitectura/3c.4-testing.md#6-ejecutar-los-tests)
    - 3C.1 · [§5.4 Probar el tiempo sin esperar](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#54-probar-el-tiempo-sin-esperar)
    - Kotlin · [groupBy](../00-android/00-kotlin/42-listas.md#44-agrupacion-y-ordenacion-groupby-y-sortedby)
    - Glosario: [runTest](../glosario.md#runtest) · [Dispatcher](../glosario.md#dispatcher) · [Random con semilla](../glosario.md#random-semilla)

??? question "Antes de seguir: ¿lo tienes claro?"

    1. ¿Por qué la partida no se pierde al girar el móvil? → Porque el estado está en el ViewModel, que la pantalla nueva recibe tal cual desde su almacén.

    2. ¿Por qué el estado se cambia con `copy` y no modificando la carta? → Porque el `StateFlow` solo avisa si recibe un objeto **distinto**: si cambias el mismo por dentro, la pantalla no se entera.

    3. ¿Por qué `repartir` recibe un `Random`? → Para que en los tests el orden sea siempre el mismo (`Random(42)`) y en la app, distinto cada vez.

---

## Parte 2 · La pantalla del tablero

Tras el [paso 0.2](#02-del-remember-al-viewmodel), `TableroScreen` ya lee el estado del ViewModel, pero sigue haciéndolo **todo en un solo fichero**: observa el ViewModel, pinta el marcador, la cuadrícula y cada casilla. En esta parte la divides en piezas con una responsabilidad cada una y conviertes las casillas en cartas de verdad.

### 2.1. Screen y Content: cómo se diseña una pantalla

Una pantalla con ViewModel se escribe en **dos niveles**:

- **La Screen (con estado, *stateful*)** es la única que conoce el ViewModel. Observa su estado, se lo pasa al contenido y conecta los eventos con las funciones del ViewModel. **No dibuja nada** por sí misma.
- **El Content (sin estado, *stateless*)** no conoce el ViewModel: recibe **el estado y lambdas** como parámetros, pinta y avisa. Lo mismo vale para las piezas más pequeñas, como la carta.

<figure class="arq-fig">
--8<-- "docs/temas/evaluacion/img/screen-content-memory.svg"
<figcaption>La pantalla del tablero en tres piezas. Solo la de arriba conoce el ViewModel.</figcaption>
</figure>

| Pieza | Qué recibe | Qué hace | ¿Se ve en una `@Preview`? |
| :--- | :--- | :--- | :--- |
| `TableroScreen` | El ViewModel (y lo que avisa hacia fuera) | Observa el estado y conecta eventos | No: necesita un ViewModel |
| `TableroContent` | Un `TableroUiState` y `onCartaPulsada` | Pinta el marcador y la cuadrícula | Sí, con un estado inventado |
| `CartaView` | Una `Carta` y un `onClick` | Pinta una carta | Sí, boca abajo y boca arriba |

¿Por qué partirla así?

1. **Se puede ver sin ejecutar la app.** Con un `TableroUiState` inventado ves el tablero en la `@Preview` a mitad de partida, con cartas boca arriba y emparejadas, sin jugar hasta llegar ahí.

2. **Cada pieza hace una sola cosa.** Si algo se pinta mal, el fallo está en el Content o en la carta; si el dato es incorrecto, en el ViewModel. Es la misma pregunta de las [pistas](1eval-proyecto.md#claves): ¿datos, lógica o pantalla?

3. **La pantalla no puede saltarse las reglas.** El Content no tiene acceso al ViewModel ni puede cambiar el estado: solo avisa con `onCartaPulsada(id)`, y la decisión es del ViewModel.

Es *state hoisting* aplicado a la pantalla entera: el estado sube hasta la Screen (y de ahí, al ViewModel) y lo de abajo solo recibe valores y lambdas. Este es el reparto que harás en la plantilla:

| Lo que hoy hace `TableroScreen` | A dónde va |
| :--- | :--- |
| Obtener el ViewModel y leer el estado | Se queda en `TableroScreen` ([2.5](#25-la-pantalla-con-estado)) |
| El marcador y la `LazyVerticalGrid` | `TableroContent` ([2.3](#23-la-cuadricula-lazyverticalgrid)) |
| La función privada `Casilla` | `CartaView`, ya con la imagen ([2.4](#24-la-carta)) |

!!! info "📚 En los apuntes"

    - 3C.1 · [§4 Consumo del ViewModel en Compose](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#4-consumo-del-viewmodel-en-compose) · [§4.1 Pantalla contenedora (stateful)](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#41-pantalla-contenedora-stateful-screen) · [§4.2 Contenido sin estado (stateless)](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#42-componente-de-presentacion-stateless-content)
    - Compose · [State hoisting y UDF](../00-android/00-compose/22-state-management.md#elevacion-del-estado-state-hoisting-y-patron-udf)
    - Codelab: [3.06 · Quiz con ViewModel, paso 4: la pantalla](../03/codelabs/06-quiz-viewmodel.md#6-paso-4-la-pantalla) (`QuizScreen` y `QuizContent`)
    - Sesión de clase: [3.05 · ViewModel y UiState (I)](../03/sesiones/s05-viewmodel-uistate-i.md#5-conectar-el-viewmodel-a-la-app-15-min)
    - Glosario: [state hoisting](../glosario.md#state-hoisting) · [@Preview](../glosario.md#preview)

### 2.2. Qué se vuelve a dibujar

Cuando cambia el estado, Compose solo vuelve a ejecutar las funciones que lo **leen**. Si cambia una carta, se recompone esa carta, no el tablero entero: las demás reciben una `Carta` igual que antes y Compose se las salta. La `key` de la cuadrícula hace que cada celda sea siempre **la misma carta**.

<div class="cpa" data-cpa="memfases"></div>

!!! info "📚 En los apuntes"

    - 3A.4 · [§2 Transformar el dibujo: graphicsLayer](../03/a-diseno/3a.4-animaciones.md#2-transformar-el-dibujo-graphicslayer)
    - Glosario: [recomposición](../glosario.md#recomposicion) · [fases de Compose](../glosario.md#fases-compose)

### 2.3. La cuadrícula: `LazyVerticalGrid`

El tablero es una **cuadrícula**: cartas en filas y columnas. En Compose se hace con `LazyVerticalGrid`, la versión en rejilla de `LazyColumn`. Ya la usa la plantilla; ahora toca entender cada parámetro, porque el tablero del juego cambia de forma según el nivel.

```kotlin
LazyVerticalGrid(
    columns = GridCells.Fixed(3),                       // 1 · cuántas columnas
    horizontalArrangement = Arrangement.spacedBy(8.dp), // 2 · hueco entre columnas
    verticalArrangement = Arrangement.spacedBy(8.dp),   //     y entre filas
) {
    items(cartas, key = { it.id }) { carta ->           // 3 · una celda por carta, con su key
        CartaView(carta, onClick = { … })
    }
}
```

1. **`columns`** decide la forma. Con `GridCells.Fixed(n)` hay siempre `n` columnas y las filas salen solas: 12 cartas en 4 columnas son 3 filas. Con `GridCells.Adaptive(minSize)` caben tantas columnas como permita el ancho; es lo que usa la plantilla para que las casillas no se deformen al girar. **En el juego usarás `Fixed`**, con las columnas del nivel: la forma del tablero es parte del nivel, no del tamaño de la pantalla.

2. **`spacedBy`** deja el mismo hueco entre celdas, sin `padding` en cada carta.

3. **`items(lista, key = …)`** crea una celda por elemento. La **`key`** hace que Compose identifique cada celda por el `id` de la carta y no por su posición: es la que permite que solo se recomponga la carta que cambia ([2.2](#22-que-se-vuelve-a-dibujar)) y que el volteo de la investigación 6.1 ocurra en la carta correcta.

¿Por qué *lazy* si el tablero cabe en pantalla? Porque es el contenedor de rejilla de Compose: no hay una «cuadrícula no lazy». Además, si un nivel no cabe, la cuadrícula hace scroll y solo compone las celdas visibles.

El tamaño de cada carta lo pone la propia carta con `Modifier.aspectRatio(…)`: la columna fija el ancho y la proporción da el alto. Prueba cómo cambia el tablero con las columnas:

<div class="cpa" data-cpa="cuadricula"></div>

!!! info "📚 En los apuntes"

    - 3A.3 · [§1 Column frente a LazyLayout](../03/a-diseno/3a.3-listas-cuadriculas.md#1-el-problema-del-rendimiento-column-con-scroll-vs-lazylayout) · [§3 La key](../03/a-diseno/3a.3-listas-cuadriculas.md#3-la-clave-del-rendimiento-asignacion-de-key) · [§4.1 Modos de cuadrícula](../03/a-diseno/3a.3-listas-cuadriculas.md#41-modos-de-cuadricula) · [§4.2 Tablero de cartas](../03/a-diseno/3a.3-listas-cuadriculas.md#42-ejemplo-tablero-de-cartas-en-cuadricula) · [§4.5 Playground de cuadrículas](../03/a-diseno/3a.3-listas-cuadriculas.md#45-playground-de-cuadriculas)
    - Sesión de clase: [3.01 · De Column a LazyColumn](../03/sesiones/s01-tema-scaffold-listas.md#4-de-column-a-lazycolumn-20-min) · [key: el experimento de ordenar](../03/sesiones/s01-tema-scaffold-listas.md#5-key-el-experimento-de-ordenar-20-min) · [Reto: la biblioteca en cuadrícula](../03/sesiones/s01-tema-scaffold-listas.md#7-reto-expres-la-biblioteca-en-cuadricula-10-min)
    - Codelab: [3.02 · Catálogo con LazyColumn, la lista con key](../03/codelabs/02-catalogo-lazycolumn.md#5-paso-3-la-lista-con-key)
    - Glosario: [LazyVerticalGrid](../glosario.md#lazyverticalgrid)

Con eso ya puedes escribir el contenido del tablero:

```kotlin title="ui/tablero/TableroContent.kt"
package com.pm2627.p1ev.memory.ui.tablero

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview

/**
 * EL CONTENIDO SIN ESTADO (stateless) del tablero: solo pinta y avisa.
 *
 *   - Recibe el estado y lambdas. No conoce el ViewModel ni la navegación.
 *   - Por eso se puede ver en una @Preview con un estado inventado.
 *
 * Qué tiene que pintar:
 *   - arriba, el marcador: movimientos y parejas (y el tiempo, con la investigación 6.2);
 *   - el tablero: LazyVerticalGrid(columns = GridCells.Fixed(columnas)) con
 *     items(estado.cartas, key = { it.id }) { carta -> CartaView(…) }.
 *     ¿De dónde sale el número de columnas? Del estado: por eso lo guardaste allí.
 *
 * La key: sin ella, Compose identifica cada celda por su posición; con ella, por su id.
 * Es lo que hará que el giro de la investigación 6.1 ocurra en la carta correcta.
 *
 * Apuntes: 3A.3 §4.2 (tablero de cartas) · 3A.3 §3 (key) · 2.3.1 (Column, Row, Modifier)
 */
@Composable
fun TableroContent(
    estado: TableroUiState,
    onCartaPulsada: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    TODO("15: Column { marcador ; LazyVerticalGrid { items(…, key = …) { CartaView(…) } } }")
}

/**
 * Vista previa con un estado inventado: no necesita ViewModel ni emulador.
 * Construye un TableroUiState de ejemplo, por ejemplo con repartir(…, Random(1)), y
 * pon alguna carta boca arriba con copy para ver los dos aspectos.
 */
@Preview(showBackground = true)
@Composable
private fun TableroContentPreview() {
    // TODO 16: MemoryTheme { TableroContent(estado = …, onCartaPulsada = {}) }
}
```

### 2.4. La carta

Es la función `Casilla` de la plantilla convertida en una pieza propia y pública, con su `@Preview`. La carta decide qué dibujar **solo con sus datos**. Para las imágenes, `Image` con `painterResource` y un `contentScale` que no las deforme:

<div class="cpa" data-cpa="imagen"></div>

```kotlin title="ui/tablero/CartaView.kt"
package com.pm2627.p1ev.memory.ui.tablero

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.pm2627.p1ev.memory.model.Carta

/**
 * UNA CARTA en pantalla.
 *
 *   - Decide qué dibujar SOLO con los datos de la carta:
 *       boca abajo → el reverso (un color del tema o una imagen tuya);
 *       boca arriba o emparejada → su dibujo:
 *         Image(painterResource(carta.dibujo), contentDescription = …).
 *   - Toda la carta es pulsable: Card(onClick = onClick) { … }.
 *   - Que mantenga su forma en cualquier pantalla: Modifier.aspectRatio(…).
 *   - No decide NADA del juego: si una carta no se puede pulsar, eso lo decide el
 *     ViewModel, no la vista.
 *
 * TODO investigación 6.1 (volteo animado): aquí irá el giro en 3D. Guía del proyecto § 6.1.
 *
 * Apuntes: UT2 · Image (2.3.2 §3) · 3A.1 (colores del tema, colorScheme)
 */
@Composable
fun CartaView(
    carta: Carta,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    TODO("17: Card(onClick = onClick) { if (boca abajo) reverso else Image(painterResource(…)) }")
}
```

!!! info "📚 En los apuntes"

    - UT2 · [§3 Image](../02/2.3.2-imagenes-iconos-recursos.md#3-mostrar-imagenes-con-image) · [contentScale](../02/2.3.2-imagenes-iconos-recursos.md#contentscale-como-se-adapta-la-imagen-a-su-hueco) · [contentDescription](../02/2.3.2-imagenes-iconos-recursos.md#contentdescription-accesibilidad) · [Column](../02/2.3.1-layouts-modificadores.md#2-column-elementos-uno-debajo-de-otro) · [Modifier](../02/2.3.1-layouts-modificadores.md#7-que-es-un-modifier)
    - 3A.1 · [§1.2 colorScheme y roles de color](../03/a-diseno/3a.1-material-design-3-scaffold.md#12-esquemas-de-color-colorscheme-y-roles-semanticos)
    - Investigación 6.1 (volteo): [guía del proyecto](1eval-proyecto.md#investigacion-volteo)
    - Glosario: [painterResource](../glosario.md#painter-resource) · [contentScale](../glosario.md#contentscale) · [@Preview](../glosario.md#preview)

### 2.5. La pantalla con estado

🧩 **Ya está en la plantilla**, y desde el [paso 0.2](#02-del-remember-al-viewmodel) observa el ViewModel. Ahora se queda solo con eso: el dibujo de la cuadrícula y de cada casilla se ha ido a `TableroContent` y `CartaView` ([2.3](#23-la-cuadricula-lazyverticalgrid) y [2.4](#24-la-carta)), y el ViewModel le llega desde fuera, desde la navegación (3.3).

`TableroScreen` es la única que conoce el ViewModel: observa su estado, se lo pasa al contenido y avisa hacia fuera cuando se gana.

```kotlin title="ui/tablero/TableroScreen.kt"
package com.pm2627.p1ev.memory.ui.tablero

import androidx.compose.runtime.Composable

/**
 * LA PANTALLA CON ESTADO (stateful) del tablero.
 *
 * Es la única que conoce el ViewModel. No dibuja nada por sí misma:
 *   - observa el estado con collectAsStateWithLifecycle();
 *   - se lo pasa a TableroContent junto con los eventos (viewModel::onCartaPulsada);
 *   - avisa hacia fuera cuando se gana, para que la navegación cambie de pantalla.
 *
 * ¿Por qué LaunchedEffect para avisar de la victoria? Navegar no es dibujar: debe
 * ocurrir UNA vez cuando la partida pasa a ganada, no en cada recomposición.
 * LaunchedEffect(clave) ejecuta su bloque al entrar y cada vez que cambia la clave.
 *
 * Apuntes: 3C.1 §4.1 (pantalla contenedora) · Compose · efectos (27 §5, LaunchedEffect)
 */
@Composable
fun TableroScreen(
    viewModel: TableroViewModel,
    onPartidaGanada: (movimientos: Int, segundos: Int) -> Unit,
) {
    // TODO 18: observa el estado:
    //   val estado by viewModel.uiState.collectAsStateWithLifecycle()

    // TODO 19: cuando la partida esté ganada, avisa UNA vez:
    //   LaunchedEffect(estado.tuCampoDeGanada) { if (…) onPartidaGanada(…, …) }
    //   (los segundos llegan con la investigación 6.2; mientras tanto, pasa 0)

    // TODO 20: pinta TableroContent(estado, onCartaPulsada = viewModel::onCartaPulsada)
}
```

!!! info "📚 En los apuntes"

    - 3C.1 · [§4.1 Pantalla contenedora (stateful)](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#41-pantalla-contenedora-stateful-screen) · [§4.2 Contenido sin estado (stateless)](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#42-componente-de-presentacion-stateless-content)
    - Compose · [collectAsStateWithLifecycle](../00-android/00-compose/22-state-management.md#2-consumo-seguro-en-compose-collectasstatewithlifecycle) · [LaunchedEffect](../00-android/00-compose/27-compositionlocal-contexto-efectos.md#1-launchedeffect-ejecutar-corrutinas-asociadas-a-un-ciclo-de-vida)
    - Glosario: [collectAsStateWithLifecycle](../glosario.md#collectasstatewithlifecycle) · [LaunchedEffect](../glosario.md#launchedeffect)

??? question "Antes de seguir: ¿lo tienes claro?"

    1. ¿Qué gana `TableroContent` por no conocer el ViewModel? → Que se puede ver en una `@Preview` con cualquier estado inventado, y que solo hace una cosa: pintar.

    2. ¿Para qué sirve la `key` de la cuadrícula? → Para que Compose identifique cada carta por su `id` y no por su posición.

    3. ¿Quién impide pulsar una carta ya descubierta, la carta o el ViewModel? → El ViewModel: la vista solo avisa.

---

## Parte 3 · Las tres pantallas

### 3.1. La pila de pantallas

Navigation 3 guarda una **pila** de claves y dibuja siempre la última. Cada clave lleva solo **datos sencillos**: el nivel al ir al tablero, los movimientos y los segundos al ir al resultado. Pruébalo:

<div class="cpa" data-cpa="navmemory"></div>

```kotlin title="navegacion/Destinos.kt"
package com.pm2627.p1ev.memory.navegacion

import androidx.navigation3.runtime.NavKey
import com.pm2627.p1ev.memory.model.Nivel
import kotlinx.serialization.Serializable

/**
 * LOS DESTINOS (claves) de Navigation 3: una clase por pantalla.
 *
 *   - @Serializable: la pila se guarda (al girar el móvil, por ejemplo) y para eso cada
 *     clave tiene que poder convertirse a texto.
 *   - Solo DATOS SENCILLOS: el nivel, unos números. Nunca las cartas, ni el estado de la
 *     partida, ni el ViewModel.
 *
 * Apuntes: 3B.1 §3 (definir los destinos) · Codelab 3.05
 */
@Serializable
data object Inicio : NavKey

@Serializable
data class Tablero(val nivel: Nivel) : NavKey

// TODO 21: el destino Resultado, con los datos que necesita su pantalla (movimientos y segundos).
```

!!! info "📚 En los apuntes"

    - 3B.1 · [§1 Una pila de pantallas](../03/b-navegacion/3b.1-navigation3.md#1-la-idea-una-pila-de-pantallas) · [§2 Configurar el proyecto](../03/b-navegacion/3b.1-navigation3.md#2-configurar-el-proyecto) · [§3 Definir los destinos](../03/b-navegacion/3b.1-navigation3.md#3-paso-1-definir-los-destinos)
    - Codelab: [3.05 · Navegación con Navigation 3](../03/codelabs/05-navegacion-navigation3.md)
    - Glosario: [NavKey](../glosario.md#navkey) · [pila de navegación](../glosario.md#pila-de-navegacion)

### 3.2. Inicio y resultado

Dos pantallas sencillas, sin ViewModel: reciben datos y avisan con lambdas. **No tocan la pila**: eso se hace en un solo sitio, `MemoryApp`.

```kotlin title="ui/inicio/InicioScreen.kt"
package com.pm2627.p1ev.memory.ui.inicio

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.pm2627.p1ev.memory.model.Nivel

/**
 * PANTALLA DE INICIO: muestra los niveles y deja elegir uno.
 *
 *   - Recorre Nivel.entries: así, si añades un nivel, aparece solo.
 *   - Un botón por nivel, con su texto; al pulsarlo avisa con onNivelElegido(nivel).
 *   - No navega ella misma: no conoce la pila.
 *
 * Apuntes: 2.3.1 (Column) · 3A.2 (botones) · 3B.1 §5 (las pantallas reciben lambdas)
 */
@Composable
fun InicioScreen(
    onNivelElegido: (Nivel) -> Unit,
    modifier: Modifier = Modifier,
) {
    TODO("22: Column { título ; Nivel.entries.forEach { nivel -> Button(onClick = { onNivelElegido(nivel) }) { … } } }")
}
```

```kotlin title="ui/resultado/ResultadoScreen.kt"
package com.pm2627.p1ev.memory.ui.resultado

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * PANTALLA DE RESULTADO: la victoria, con los movimientos y el tiempo.
 *
 *   - Recibe los datos ya calculados: no hace cuentas ni conoce la partida.
 *   - Un botón para volver a jugar, que avisa con onVolverAlInicio().
 *   - Los textos, en strings.xml con parámetros: stringResource(R.string.x, movimientos).
 *
 * Apuntes: 2.3.2 (strings.xml) · 3B.1 §5
 */
@Composable
fun ResultadoScreen(
    movimientos: Int,
    segundos: Int,
    onVolverAlInicio: () -> Unit,
    modifier: Modifier = Modifier,
) {
    TODO("23: Column { ¡Has ganado! ; movimientos ; tiempo ; Button(onClick = onVolverAlInicio) }")
}
```

!!! info "📚 En los apuntes"

    - UT2 · [Column](../02/2.3.1-layouts-modificadores.md#2-column-elementos-uno-debajo-de-otro) · [Textos y colores como recursos (strings.xml)](../02/2.3.2-imagenes-iconos-recursos.md#5-textos-y-colores-como-recursos)
    - 3A.2 · [§1 Los botones de Material 3](../03/a-diseno/3a.2-componentes-interactivos.md#1-la-jerarquia-de-botones-en-material-3)
    - 3B.1 · [§5 Mostrar la pantalla actual: las pantallas reciben lambdas](../03/b-navegacion/3b.1-navigation3.md#5-paso-3-mostrar-la-pantalla-actual-con-navdisplay)
    - Kotlin · [Enum: entries](../00-android/00-kotlin/24-enum-classes.md#3-iteracion-moderna-entries-vs-values)

### 3.3. La app: la pila, las pantallas y un ViewModel por partida

Con el decorador de ViewModel, **cada entrada de la pila tiene el suyo**: nace al entrar en el tablero con su nivel y se destruye al salir de la pila. Mira también qué cambia entre **apilar** el resultado o **sustituir** el tablero por él: es una decisión que tendrás que justificar.

<div class="cpa" data-cpa="mempila"></div>

```kotlin title="navegacion/MemoryApp.kt"
package com.pm2627.p1ev.memory.navegacion

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.navigation3.rememberViewModelStoreNavEntryDecorator
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.runtime.rememberSaveableStateHolderNavEntryDecorator
import androidx.navigation3.ui.NavDisplay

/**
 * LA APP: la pila de pantallas y qué se dibuja para cada destino.
 *
 *   - rememberNavBackStack(Inicio): la pila empieza en la pantalla de inicio y
 *     sobrevive al giro del móvil.
 *   - NavDisplay dibuja siempre la ÚLTIMA clave de la pila.
 *   - El segundo decorador hace que CADA entrada tenga su propio ViewModel, que nace al
 *     entrar y se destruye al salir de la pila. Sin él, todas las partidas compartirían
 *     el mismo ViewModel.
 *   - Las pantallas no tocan la pila: reciben lambdas, y es aquí donde se hace
 *     pila.add(…), pila.removeLastOrNull() o pila[pila.lastIndex] = ….
 *
 * Decide y justifica en el README: al ganar, ¿apilas Resultado o sustituyes el Tablero?
 * Y desde Resultado, ¿a dónde debe llevar el botón atrás?
 *
 * Apuntes: 3B.1 §4 a §8 · Sesiones 3.03, 3.04 y 3.07
 */
@Composable
fun MemoryApp(modifier: Modifier = Modifier) {
    val pila = rememberNavBackStack(Inicio)

    NavDisplay(
        backStack = pila,
        onBack = { pila.removeLastOrNull() },
        modifier = modifier,
        entryDecorators = listOf(
            rememberSaveableStateHolderNavEntryDecorator(),
            rememberViewModelStoreNavEntryDecorator(),
        ),
        entryProvider = entryProvider {
            entry<Inicio> {
                // TODO 24: InicioScreen(onNivelElegido = { nivel -> pila.add(Tablero(nivel)) })
            }
            entry<Tablero> { clave ->
                // TODO 25: crea el ViewModel de ESTA partida con el nivel de su clave:
                //   val viewModel = viewModel { TableroViewModel(clave.nivel) }
                // y pinta TableroScreen(viewModel, onPartidaGanada = { movimientos, segundos -> … })
            }
            // TODO 26: entry<Resultado> { clave -> ResultadoScreen(…) }
        },
    )
}
```

```kotlin title="MainActivity.kt"
package com.pm2627.p1ev.memory

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import com.pm2627.p1ev.memory.navegacion.MemoryApp
import com.pm2627.p1ev.memory.ui.theme.MemoryTheme

/**
 * LA ACTIVITY: solo arranca la app. Toda la interfaz está en MemoryApp.
 * Sustituye TableroScreen por MemoryApp, como aquí. (Completa: no hay que tocarla.)
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MemoryTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    MemoryApp(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}
```

!!! info "📚 En los apuntes"

    - 3B.1 · [§4 Crear la pila](../03/b-navegacion/3b.1-navigation3.md#4-paso-2-crear-la-pila) · [§5 NavDisplay](../03/b-navegacion/3b.1-navigation3.md#5-paso-3-mostrar-la-pantalla-actual-con-navdisplay) · [§6 Volver atrás](../03/b-navegacion/3b.1-navigation3.md#6-volver-atras) · [§7 Operaciones con la pila](../03/b-navegacion/3b.1-navigation3.md#7-operaciones-habituales-con-la-pila) · [§8 Un ViewModel para cada pantalla](../03/b-navegacion/3b.1-navigation3.md#8-un-viewmodel-para-cada-pantalla)
    - Sesiones de clase: [3.03 · Navigation 3 (I)](../03/sesiones/s03-navigation3-i.md) · [3.04 · Navigation 3 (II)](../03/sesiones/s04-navigation3-ii-edge-to-edge.md) · [3.07 · ViewModel y UiState (II)](../03/sesiones/s07-viewmodel-uistate-ii.md)
    - Glosario: [NavDisplay](../glosario.md#navdisplay) · [ViewModelStore](../glosario.md#viewmodelstore)

??? question "Antes de seguir: ¿lo tienes claro?"

    1. ¿Por qué a `Tablero` se le pasa el nivel y no las cartas? → Porque la clave se guarda para restaurar la pila y debe ser pequeña; las cartas las crea el ViewModel de esa partida.

    2. ¿Qué pasa con el ViewModel de la partida al salir del tablero? → Su entrada sale de la pila, se vacía su almacén y se destruye (`onCleared`), con sus corrutinas.

    3. ¿Dónde se toca la pila? → Solo en `MemoryApp`. Las pantallas avisan con lambdas.

---

## Y ahora, lo que investigas tú

Con las tres partes, el juego se puede jugar de principio a fin. Faltan las dos piezas que la guía deja como **investigación**, y que van exactamente en los `TODO investigación` del esqueleto:

| Investigación | Dónde va en el esqueleto | Guía |
| :--- | :--- | :--- |
| **Volteo animado** | `CartaView` | [6.1 · Volteo animado](1eval-proyecto.md#investigacion-volteo) |
| **Temporizador, retardo de fallo y pausa** | `TableroViewModel`, `TableroUiState`, el marcador y `TableroScreen` | [6.2 · Temporizador, retardo y pausa](1eval-proyecto.md#investigacion-temporizador) |

Después, repasa la [lista de comprobación final](1eval-proyecto.md#lista-comprobacion) de la guía y completa el README: el apartado de **cómo fluye un evento** es casi el recorrido de la parte 1, con **tus** nombres.
