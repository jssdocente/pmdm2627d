---
search:
  boost: 2
---

# **Glosario del módulo**

Si te encuentras un término y no recuerdas qué era, búscalo aquí. Cada entrada lo define en una o dos frases y te lleva a la sección donde se explica: primero los apuntes de la unidad en que se ve en clase y después la referencia del bloque [Android](00-android/index.md#que-necesito).

!!! info "Lo que recomienda Google y lo que elegimos nosotros"
    Google recomienda separar la app en capas y usar un flujo de datos unidireccional. **Clean Architecture**, **Koin** y **KMP** son elecciones de este módulo, y así se indica en sus entradas. Tienes el detalle en [qué recomienda Google y qué elegimos nosotros](00-android/index.md#que-recomienda-google-y-que-elegimos-nosotros).

Escribe en la caja para filtrar los términos, o usa el índice alfabético.

<div id="glosario-filtro"></div>

**Índice:** [A](#letra-a) · [B](#letra-b) · [C](#letra-c) · [D](#letra-d) · [E](#letra-e) · [F](#letra-f) · [G](#letra-g) · [H](#letra-h) · [I](#letra-i) · [J](#letra-j) · [K](#letra-k) · [L](#letra-l) · [M](#letra-m) · [N](#letra-n) · [O](#letra-o) · [P](#letra-p) · [R](#letra-r) · [S](#letra-s) · [T](#letra-t) · [U](#letra-u) · [V](#letra-v) · [W](#letra-w)

---

## A {#letra-a}

#### AAB (Android App Bundle) {#aab}

Paquete de publicación que se sube a Google Play. No se instala directamente: Google Play genera a partir de él los APK a medida de cada dispositivo.

**Dónde:** [UT1 · APK y AAB](01/index.md#72-apk-y-aab) · [3E.1 · Generar el AAB](03/e-publicacion/3e.1-preparar-lanzamiento.md#6-generar-el-android-app-bundle-aab)<br>
**Ver también:** [APK](#apk) · [R8](#r8)

#### Activity {#activity}

Componente de Android que representa una pantalla y sirve de puerta de entrada a la app. Con Compose, lo habitual es tener una sola, que muestra toda la interfaz.

**Dónde:** [UT2 · La Activity](02/2.2-ciclo-vida-app.md#1-la-activity-en-el-ecosistema-moderno) · [UT2 · Proceso, Application y Activity](02/2.2-ciclo-vida-app.md#proceso-application-y-activity-quien-es-quien)<br>
**Ver también:** [Ciclo de vida](#ciclo-de-vida) · [Componentes de Android](#componentes-de-android)

#### AGP (Android Gradle Plugin) {#agp}

Plugin que enseña a Gradle a compilar apps Android. Su versión tiene que ser compatible con las de Gradle, Kotlin y el JDK.

**Dónde:** [Herramientas · AGP](00-android/00-tools/01-gradle-agp-estructura.md#agp-android-gradle-plugin-el-copiloto) · [Herramientas · Matriz de compatibilidad](00-android/00-tools/04-matriz-compatibilidad.md#5-tabla-maestra-de-compatibilidad)<br>
**Ver también:** [Gradle](#gradle)

#### `AlertDialog` {#alertdialog}

Ventana modal que interrumpe al usuario para pedirle una confirmación o una decisión.

**Dónde:** [3A.2 · Diálogo de alerta](03/a-diseno/3a.2-componentes-interactivos.md#51-dialogo-de-alerta-alertdialog)<br>
**Practica:** [Codelab 3.03 · Confirmar con AlertDialog](03/codelabs/03-tareas-scaffold.md#5-paso-3-confirmar-con-alertdialog)<br>
**Ver también:** [`ModalBottomSheet`](#modalbottomsheet) · [`Snackbar`](#snackbar)

#### Android Vitals {#android-vitals}

Panel de Play Console con datos de calidad de la app publicada, como cierres inesperados o errores de falta de respuesta.

**Dónde:** [3E.2 · Vitals y reseñas](03/e-publicacion/3e.2-publicar-google-play.md#82-android-vitals-y-resenas)<br>
**Ver también:** [Play Console](#play-console)

#### `animate*AsState` {#animate-as-state}

Familia de funciones que anima un valor (color, tamaño…) cuando cambia el estado del que depende.

**Dónde:** [3A.4 · Animar un valor](03/a-diseno/3a.4-animaciones.md#1-animar-un-valor-animateasstate)<br>
**Practica:** [Codelab 3.08 · Pantalla y animaciones](03/codelabs/08-temporizador-pomodoro.md#5-paso-4-la-pantalla-y-las-animaciones)<br>
**Ver también:** [`graphicsLayer`](#graphicslayer)

#### APK {#apk}

El paquete que se instala en un dispositivo. Se usa para pruebas, en el emulador y en tiendas alternativas.

**Dónde:** [UT1 · APK y AAB](01/index.md#72-apk-y-aab)<br>
**Ver también:** [AAB (Android App Bundle)](#aab)

#### App híbrida {#app-hibrida}

Web empaquetada dentro de una app: un contenedor nativo muestra HTML, CSS y JavaScript en un *WebView*. Ionic y Capacitor son ejemplos.

**Dónde:** [UT1 · Híbrida](01/index.md#32-hibrida)<br>
**Ver también:** [WebView](#webview) · [App multiplataforma](#app-multiplataforma) · [App nativa](#app-nativa)

#### App multiplataforma {#app-multiplataforma}

Un solo código que se ejecuta en varias plataformas sin ser una página web. Cada framework lo resuelve a su manera: Flutter, React Native o Compose Multiplatform.

**Dónde:** [UT1 · Multiplataforma](01/index.md#33-multiplataforma)<br>
**Ver también:** [Flutter](#flutter) · [React Native](#react-native) · [KMP (Kotlin Multiplatform)](#kmp) · [CMP (Compose Multiplatform)](#cmp)

#### App nativa {#app-nativa}

App programada directamente contra el SDK de cada plataforma, con sus lenguajes y herramientas oficiales: Kotlin y Compose en Android, Swift y SwiftUI en iOS.

**Dónde:** [UT1 · Nativa](01/index.md#34-nativa) · [UT1 · Por qué nativa en este módulo](01/index.md#6-por-que-en-este-modulo-nativa-para-android)

#### `applicationId` {#applicationid}

Identificador único de la app en Google Play y en el dispositivo. No se puede cambiar tras publicar.

**Dónde:** [3E.1 · `applicationId`](03/e-publicacion/3e.1-preparar-lanzamiento.md#applicationid-eligelo-con-cuidado)<br>
**Ver también:** [`versionCode` y `versionName`](#versioncode)

#### Árbol semántico {#arbol-semantico}

Descripción de la pantalla que usan TalkBack y los tests de Compose para encontrar elementos. Una pantalla accesible también es fácil de probar.

**Dónde:** [3C.4 · El árbol semántico](03/c-arquitectura/3c.4-testing.md#52-encontrar-elementos-el-arbol-semantico)<br>
**Practica:** [Codelab 3.04 · Tests de interfaz](03/codelabs/04-propinas-formulario.md#5-paso-3-tests-de-interfaz)<br>
**Ver también:** [`contentDescription`](#contentdescription) · [Test local y test instrumentado](#test-instrumentado)

#### Argumentos de navegación {#argumentos-de-navegacion}

Ver [`NavKey`](#navkey).

#### Arrange, Act, Assert (AAA) {#aaa}

Las tres fases de un test: preparar el escenario, ejecutar lo que se prueba y comprobar el resultado.

**Dónde:** [3C.4 · Estructura de un test](03/c-arquitectura/3c.4-testing.md#13-estructura-de-un-test-arrange-act-assert) · [Kotlin · Patrón AAA](00-android/00-kotlin/testing/index.md#23-estructura-mental-de-una-prueba-el-patron-aaa-arrange-act-assert)<br>
**Ver también:** [TDD (desarrollo guiado por pruebas)](#tdd)

#### ART (Android Runtime) {#art}

Entorno que ejecuta las apps en el dispositivo; una app Android no se ejecuta en la JVM de escritorio. Sustituyó a la antigua máquina virtual Dalvik.

**Dónde:** [UT1 · Compilación y ejecución](01/index.md#71-compilacion-y-ejecucion)

#### `as?` (casteo seguro) {#casteo-seguro}

Intenta convertir a un tipo y devuelve `null` si no puede, en lugar de lanzar una excepción como `as`.

**Dónde:** [Kotlin · Casteo seguro](00-android/00-kotlin/14-null-safety.md#4-casteo-seguro-de-tipos-as)<br>
**Ver también:** [Smart cast](#smart-cast)

#### `associateBy`, `associateWith` y `associate` {#associateby}

Funciones que convierten una lista en un `Map`. Se diferencian en qué es el valor: el elemento (`associateBy`), un dato calculado (`associateWith`) o lo que elijas (`associate`).

**Dónde:** [Kotlin · De una lista a un Map](00-android/00-kotlin/43-maps.md#de-lista-a-map) · [Kotlin · `associateBy` o `associateWith`](00-android/00-kotlin/43-maps.md#associateby-o-associatewith)<br>
**Practica:** [Codelab de Kotlin · Colecciones y Maps](00-android/00-kotlin/codelabs/03-colecciones-maps.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`Map`](#map) · [`groupBy`](#groupby)

#### `!!` (aserción no nula) {#asercion-no-nula}

Operador que afirma que un valor no es `null`. Si lo es, lanza `NullPointerException`, así que anula la protección de *null safety*.

**Dónde:** [Kotlin · Aserción no nula](00-android/00-kotlin/14-null-safety.md#23-operador-de-asercion-no-nula-not-null-assertion)<br>
**Ver también:** [Null safety](#null-safety) · [`?:` (operador Elvis)](#elvis)

#### `async` y `await` {#async-await}

`async` lanza una corrutina que devolverá un valor, y `await` lo recoge. Sirve para ejecutar trabajos en paralelo.

**Dónde:** [Kotlin · `async` y `await`](00-android/00-kotlin/51-corrutinas.md#44-cuando-y-por-que-usamos-entonces-async-y-await) · [Kotlin · El falso paralelismo](00-android/00-kotlin/51-corrutinas.md#45-el-gran-error-de-principiante-el-falso-paralelismo)<br>
**Practica:** [Codelab de Kotlin · `suspend` y `async`](00-android/00-kotlin/codelabs/05-suspend-async.md#2-la-idea-en-un-minuto)<br>
**Ver también:** [`launch`](#launch) · [Corrutina](#corrutina)

#### AVD (emulador) {#avd}

*Android Virtual Device*: un móvil virtual que se ejecuta en el ordenador para probar la app sin un dispositivo físico.

**Dónde:** [UT2 · Dispositivo de pruebas](02/2.1-primeros-pasos.md#12-configuracion-del-dispositivo-de-pruebas) · [IDE · Crear un emulador](00-android/00-ide-intellij/index.md#81-creacion-de-un-emulador-virtual-avd-android-virtual-device)

## B {#letra-b}

#### Back stack {#back-stack}

Ver [Pila de navegación (*back stack*)](#pila-de-navegacion).

#### BOM (Bill of Materials) {#bom}

Lista de versiones de librerías que funcionan bien juntas. Si usas el BOM de Compose, no indicas la versión de cada librería.

**Dónde:** [Herramientas · El concepto de BOM](00-android/00-tools/01-gradle-agp-estructura.md#el-concepto-de-bom-bill-of-materials)<br>
**Ver también:** [Catálogo de versiones (*version catalog*)](#catalogo-de-versiones)

#### Botones de Material 3 {#botones}

Jerarquía de cinco variantes, según la importancia de la acción: `Button`, `FilledTonalButton`, `ElevatedButton`, `OutlinedButton` y `TextButton`.

**Dónde:** [3A.2 · La jerarquía de botones](03/a-diseno/3a.2-componentes-interactivos.md#1-la-jerarquia-de-botones-en-material-3)

#### `Box` {#box}

Contenedor que apila sus elementos uno encima de otro.

**Dónde:** [UT2 · `Box`](02/2.3.1-layouts-modificadores.md#4-box-elementos-uno-encima-de-otro)<br>
**Ver también:** [`Column` y `Row`](#column-row) · [`Modifier`](#modifier)

#### Build variants {#build-variants}

Ver [Tipos de compilación (*build types*)](#tipos-de-compilacion).

#### `build.gradle.kts` {#build-gradle-kts}

Fichero de configuración de Gradle, escrito en Kotlin. El del módulo `app` declara la versión del SDK, las dependencias y otras opciones de compilación.

**Dónde:** [UT2 · Configuración del módulo](02/2.1-primeros-pasos.md#42-configuracion-del-modulo-de-la-app-appbuildgradlekts) · [Herramientas · `build.gradle.kts`](00-android/00-tools/02-build-gradle.md#2-anatomia-completa-de-un-buildgradlekts-profesional)<br>
**Ver también:** [Gradle](#gradle) · [Catálogo de versiones (*version catalog*)](#catalogo-de-versiones)

## C {#letra-c}

#### Calificadores de recursos {#calificadores}

Sufijos de carpeta que dan varias versiones de un recurso, como `values-en` para inglés o `drawable-night` para modo oscuro. Android elige la adecuada.

**Dónde:** [UT2 · Calificadores](02/2.3.2-imagenes-iconos-recursos.md#calificadores-un-recurso-varias-versiones)<br>
**Practica:** [Codelab 3.07 · La traducción al inglés](03/codelabs/07-ficha-heroe-recursos.md#5-paso-3-la-traduccion-al-ingles)<br>
**Ver también:** [Recursos](#recursos)

#### Callback {#callback}

Función que se pasa a otra para que la llame al terminar. En cadena, da lugar a código difícil de leer, y es lo que `suspend` evita.

**Dónde:** [Kotlin · Callbacks](00-android/00-kotlin/51-corrutinas.md#33-tercer-intento-un-callback) · [Kotlin · La pirámide de la perdición](00-android/00-kotlin/51-corrutinas.md#34-encadenar-callbacks-la-piramide-de-la-perdicion)<br>
**Ver también:** [`suspend`](#suspend)

#### Cambio de configuración {#cambio-de-configuracion}

Cambio del entorno, como girar el móvil o el idioma, que hace que Android destruya y vuelva a crear la Activity. Lo guardado solo con `remember` se pierde.

**Dónde:** [3C.1 · Supervivencia a estos cambios](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#11-supervivencia-ante-cambios-de-configuracion)<br>
**Practica:** [Codelab 2.03 · Girar la pantalla](02/codelabs/03-ciclo-vida-logcat.md#6-paso-4-experimento-2-girar-la-pantalla)<br>
**Ver también:** [`rememberSaveable`](#remembersaveable) · [`ViewModel`](#viewmodel)

#### Cancelación cooperativa {#cancelacion-cooperativa}

Una corrutina no se detiene a la fuerza: la cancelación se atiende en los puntos de suspensión o cuando el código la comprueba.

**Dónde:** [Kotlin · La cancelación es cooperativa](00-android/00-kotlin/51-corrutinas.md#62-la-cancelacion-es-cooperativa)<br>
**Practica:** [Codelab de Kotlin · Cancelación y errores](00-android/00-kotlin/codelabs/06-cancelacion-errores.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`Job`](#job) · [Concurrencia estructurada](#concurrencia-estructurada)

#### Capas (UI, dominio, datos) {#capas}

División de la app por responsabilidades. Google recomienda separar en capas, y la de dominio es opcional. La regla de Clean Architecture añade que el dominio no depende de nadie.

**Dónde:** [3C.2 · Tres capas y una regla](03/c-arquitectura/3c.2-clean-architecture.md#2-la-idea-tres-capas-y-una-regla) · [3C.1 · El mapa de la arquitectura](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#el-mapa-de-la-arquitectura) · [Guía de Google · Tres capas](00-android/02-arquitectura/01-guia-arquitectura-google.md#2-la-arquitectura-en-3-capas-de-google)<br>
**Ver también:** [Clean Architecture](#clean-architecture) · [Separación de responsabilidades](#separacion-de-responsabilidades)

#### Caso de uso (*use case*) {#caso-de-uso}

Clase de la capa de dominio que resuelve una sola acción de negocio, como `ObtenerJuegosUseCase`. Suele tener un único `operator fun invoke()`.

**Dónde:** [3C.2 · Los casos de uso](03/c-arquitectura/3c.2-clean-architecture.md#7-paso-4-los-casos-de-uso) · [Patrones · UseCase](00-android/02-arquitectura/05-glosario-patrones.md#usecase-interactor-caso-de-uso)<br>
**Ver también:** [Capas (UI, dominio, datos)](#capas) · [Repositorio](#repositorio)

#### Catálogo de versiones (*version catalog*) {#catalogo-de-versiones}

Fichero `gradle/libs.versions.toml` que reúne en un solo sitio las versiones de las librerías y los plugins del proyecto.

**Dónde:** [UT2 · El catálogo de versiones](02/2.1-primeros-pasos.md#41-el-catalogo-de-versiones-gradlelibsversionstoml) · [Herramientas · Version catalogs](00-android/00-tools/01-gradle-agp-estructura.md#3-gestion-de-dependencias-version-catalogs)<br>
**Ver también:** [BOM (Bill of Materials)](#bom) · [`build.gradle.kts`](#build-gradle-kts)

#### Ciclo de vida {#ciclo-de-vida}

Estados por los que pasa una Activity (creada, iniciada, reanudada, pausada, detenida, destruida) y métodos con que el sistema lo notifica, como `onCreate` u `onPause`.

**Dónde:** [UT2 · Estados y métodos](02/2.2-ciclo-vida-app.md#2-estados-y-metodos-del-ciclo-de-vida-de-la-activity) · [UT2 · Desde Compose](02/2.2-ciclo-vida-app.md#4-el-ciclo-de-vida-desde-la-perspectiva-de-jetpack-compose)<br>
**Practica:** [Codelab 2.03 · El ciclo de vida](02/codelabs/03-ciclo-vida-logcat.md#2-el-ciclo-de-vida-de-la-activity)<br>
**Ver también:** [Activity](#activity) · [Logcat](#logcat) · [`LifecycleResumeEffect`](#lifecycleresumeeffect)

#### Clase abstracta {#clase-abstracta}

Clase que no se puede instanciar y sirve de base común a otras. Puede tener estado y código, además de miembros `abstract`.

**Dónde:** [Kotlin · Clases abstractas](00-android/00-kotlin/21-poo.md#clases-abstractas-abstract-jerarquias-con-identidad-comun)<br>
**Ver también:** [Interfaz](#interfaz)

#### Clase `R` {#clase-r}

Clase que se genera sola con un identificador por cada recurso: `R.string.titulo`, `R.drawable.logo`.

**Dónde:** [UT2 · La clase R](02/2.3.2-imagenes-iconos-recursos.md#la-clase-r)<br>
**Ver también:** [Recursos](#recursos)

#### Clases de tamaño de ventana {#clases-de-tamano}

Grupos de anchos de ventana, como *Compact* (menos de 600 dp). Se adapta la interfaz según la ventana, no según el tipo de dispositivo.

**Dónde:** [3B.2 · Clases de tamaño](03/b-navegacion/3b.2-diseno-adaptativo.md#3-clases-de-tamano-de-ventana)<br>
**Ver también:** [`NavigationSuiteScaffold`](#navigationsuitescaffold) · [Lista y detalle](#lista-detalle)

#### Clausura (*closure*) {#clausura}

Lambda que captura variables del entorno en que se define y puede leerlas y modificarlas.

**Dónde:** [Kotlin · Clausuras](00-android/00-kotlin/13-funciones-lambdas.md#33-clausuras-closures-captura-y-modificacion-de-variables-del-entorno)<br>
**Ver también:** [Lambda](#lambda)

#### Clave de subida {#clave-de-subida}

Ver [Play App Signing](#play-app-signing).

#### Clean Architecture {#clean-architecture}

Organización en capas en la que las dependencias siempre apuntan hacia el dominio. **Elección del módulo**, no una recomendación de Google.

**Dónde:** [3C.2 · La idea](03/c-arquitectura/3c.2-clean-architecture.md#2-la-idea-tres-capas-y-una-regla) · [3C.2 · Qué hemos ganado](03/c-arquitectura/3c.2-clean-architecture.md#11-que-hemos-ganado) · [Arquitectura · Regla de dependencia](00-android/02-arquitectura/02-clean-architecture.md#regla-de-dependencia)<br>
**Ver también:** [Capas (UI, dominio, datos)](#capas) · [Repositorio](#repositorio) · [Caso de uso (*use case*)](#caso-de-uso) · [Inversión de dependencias](#inversion-de-dependencias)

#### CMP (Compose Multiplatform) {#cmp}

Versión multiplataforma de Jetpack Compose, de JetBrains. Permite compartir también la interfaz entre Android, iOS, escritorio y web.

**Dónde:** [3D.3 · Qué cambia y qué no](03/d-kmp/3d.3-compose-multiplatform.md#1-que-cambia-y-que-no) · [3D.1 · KMP y CMP](03/d-kmp/3d.1-anatomia-proyecto-kmp.md#1-recordatorio-kmp-y-compose-multiplatform)<br>
**Ver también:** [KMP (Kotlin Multiplatform)](#kmp) · [Jetpack Compose](#jetpack-compose)

#### `collectAsStateWithLifecycle` {#collectasstatewithlifecycle}

Recoge un `StateFlow` como estado de Compose, y deja de hacerlo cuando la pantalla no está visible.

**Dónde:** [3C.1 · Consumo en Compose](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#41-pantalla-contenedora-stateful-screen) · [Compose · Consumo seguro](00-android/00-compose/22-state-management.md#2-consumo-seguro-en-compose-collectasstatewithlifecycle)<br>
**Ver también:** [`StateFlow`](#stateflow) · [`ViewModel`](#viewmodel) · [Ciclo de vida](#ciclo-de-vida)

#### Color dinámico (Material You) {#color-dinamico}

Desde Android 12, el esquema de colores de la app se puede generar a partir del fondo de pantalla del usuario.

**Dónde:** [3A.1 · Color dinámico](03/a-diseno/3a.1-material-design-3-scaffold.md#14-color-dinamico-material-you-en-android-12)<br>
**Ver también:** [`ColorScheme` y roles de color](#colorscheme) · [Tema (`MaterialTheme`)](#tema)

#### `ColorScheme` y roles de color {#colorscheme}

Conjunto de colores del tema, con nombres según su función (`primary`, `surface`, `onPrimary`…). Se usan por su rol, no por su valor, y así el modo oscuro funciona solo.

**Dónde:** [3A.1 · Esquemas de color](03/a-diseno/3a.1-material-design-3-scaffold.md#12-esquemas-de-color-colorscheme-y-roles-semanticos)<br>
**Practica:** [Codelab 3.01 · La paleta](03/codelabs/01-tema-material3.md#3-paso-1-la-paleta-en-colorkt)<br>
**Ver también:** [Tema (`MaterialTheme`)](#tema) · [Color dinámico (Material You)](#color-dinamico)

#### `Column` y `Row` {#column-row}

Contenedores que colocan sus elementos uno debajo de otro y uno al lado de otro, respectivamente. Tienen un eje principal y otro cruzado.

**Dónde:** [UT2 · `Column`](02/2.3.1-layouts-modificadores.md#2-column-elementos-uno-debajo-de-otro) · [UT2 · `Row`](02/2.3.1-layouts-modificadores.md#3-row-elementos-uno-al-lado-de-otro)<br>
**Practica:** [Codelab 2.01 · Contenedores básicos](02/codelabs/01-tarjeta-presentacion.md#2-los-contenedores-de-disposicion-basicos-en-compose)<br>
**Ver también:** [`Box`](#box) · [`weight` y `Spacer`](#weight) · [Layout scope](#layout-scope)

#### `combine` y `catch` {#combine-catch}

Operadores de `Flow`: `combine` une varios flujos en uno, y `catch` captura los errores que suben desde más arriba en el flujo.

**Dónde:** [Kotlin · `combine`](00-android/00-kotlin/52-flows.md#combinar-flujos-combine) · [Kotlin · `catch`](00-android/00-kotlin/52-flows.md#errores-en-el-flujo-catch)<br>
**Ver también:** [`Flow`](#flow)

#### `commonMain` y *source sets* {#source-sets}

Un *source set* es una carpeta de código que se compila para ciertas plataformas. `commonMain` se compila para todas; `androidMain` o `jvmMain`, solo para la suya.

**Dónde:** [3D.1 · Los source sets](03/d-kmp/3d.1-anatomia-proyecto-kmp.md#5-los-source-sets-que-codigo-va-donde)<br>
**Ver también:** [KMP (Kotlin Multiplatform)](#kmp) · [`expect` y `actual`](#expect-actual)

#### `companion object` {#companion-object}

Objeto ligado a una clase cuyos miembros se usan a través del nombre de la clase. Es lo más parecido a `static` de Java.

**Dónde:** [Kotlin · Companion object](00-android/00-kotlin/22-objetos-anonimos.md#2-el-objeto-companero-companion-object-y-el-patron-factory-method)<br>
**Ver también:** [`object` (singleton)](#object)

#### Componentes de Android {#componentes-de-android}

Las cuatro piezas declarables en el Manifest: Activity, Service, Broadcast Receiver y Content Provider.

**Dónde:** [Herramientas · Los componentes](00-android/00-tools/03-android-manifest.md#3-los-4-fantasticos-los-componentes-de-android)<br>
**Ver también:** [Activity](#activity) · [Manifest (`AndroidManifest.xml`)](#manifest)

#### `@Composable` {#composable}

Anotación de las funciones que describen una parte de la interfaz. Solo se pueden llamar desde otra función `@Composable`.

**Dónde:** [UT2 · Anatomía de una función composable](02/2.3-primera-app.md#2-anatomia-de-una-funcion-composable) · [Compose · Funciones componibles](00-android/00-compose/21-composable-functions.md#crear-una-funcion-componible)<br>
**Practica:** [Codelab 2.01 · El componente](02/codelabs/01-tarjeta-presentacion.md#3-paso-1-el-componente-tarjetapresentacion)<br>
**Ver también:** [Paradigma declarativo](#paradigma-declarativo) · [Recomposición](#recomposicion)

#### Compose Hot Reload {#compose-hot-reload}

Con la app de escritorio abierta, aplica los cambios en la interfaz sin tener que volver a ejecutarla.

**Dónde:** [3D.1 · Compose Hot Reload](03/d-kmp/3d.1-anatomia-proyecto-kmp.md#compose-hot-reload)<br>
**Ver también:** [CMP (Compose Multiplatform)](#cmp)

#### `CompositionLocal` {#compositionlocal}

Forma de hacer llegar un dato a todo un árbol de composables sin pasarlo como parámetro. Así se reparte, por ejemplo, el tema.

**Dónde:** [3A.1 · Cómo funciona](03/a-diseno/3a.1-material-design-3-scaffold.md#21-como-funciona-compositionlocal) · [3A.1 · Cuándo usarlo](03/a-diseno/3a.1-material-design-3-scaffold.md#25-cuando-usarlo-y-cuando-no)<br>
**Ver también:** [Prop drilling](#prop-drilling) · [Tema (`MaterialTheme`)](#tema)

#### Concurrencia estructurada {#concurrencia-estructurada}

Cada corrutina vive dentro de un ámbito: si este se cancela, se cancelan todas las suyas, y ninguna queda perdida.

**Dónde:** [Kotlin · Concurrencia estructurada](00-android/00-kotlin/51-corrutinas.md#61-cancel-y-la-concurrencia-estructurada)<br>
**Ver también:** [`CoroutineScope`](#coroutinescope) · [Cancelación cooperativa](#cancelacion-cooperativa)

#### Constructor primario {#constructor-primario}

Constructor declarado en la propia cabecera de la clase. Con `val` o `var` en sus parámetros, además define propiedades.

**Dónde:** [Kotlin · Constructor primario](00-android/00-kotlin/21-poo.md#1-clases-y-constructor-primario-idiomatico)<br>
**Ver también:** [`init`](#init)

#### `contentDescription` {#contentdescription}

Texto que describe una imagen o icono para los lectores de pantalla, como TalkBack.

**Dónde:** [UT2 · Accesibilidad](02/2.3.2-imagenes-iconos-recursos.md#contentdescription-accesibilidad)<br>
**Ver también:** [Árbol semántico](#arbol-semantico)

#### `contentScale` {#contentscale}

Indica cómo se adapta una imagen a su hueco: recortándola, encajándola entera, etc.

**Dónde:** [UT2 · `contentScale`](02/2.3.2-imagenes-iconos-recursos.md#contentscale-como-se-adapta-la-imagen-a-su-hueco)

#### `Context` {#context}

Puente entre tu código y el sistema Android, para acceder a recursos y servicios. No se debe guardar en un ViewModel, porque provocaría una fuga de memoria.

**Dónde:** [Compose · El concepto de Context](00-android/00-compose/27-compositionlocal-contexto-efectos.md#1-el-concepto-de-context-en-android-tipos-y-riesgos)<br>
**Ver también:** [`ViewModel`](#viewmodel)

#### `copy()` {#copy}

Método generado en una `data class` que crea un objeto nuevo cambiando solo las propiedades indicadas. El original queda igual.

**Dónde:** [Kotlin · `copy()`](00-android/00-kotlin/23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad)<br>
**Practica:** [Codelab 3.06 · El ViewModel](03/codelabs/06-quiz-viewmodel.md#5-paso-3-el-viewmodel)<br>
**Ver también:** [`data class`](#data-class) · [Inmutabilidad](#inmutabilidad)

#### Coroutine {#coroutine}

Ver [Corrutina](#corrutina).

#### `CoroutineScope` {#coroutinescope}

Ámbito en el que se lanzan las corrutinas y que controla cuánto viven. En una app, lo habitual es `viewModelScope`.

**Dónde:** [Kotlin · Ámbitos y builders](00-android/00-kotlin/51-corrutinas.md#41-que-es-un-coroutinescope-y-cual-es-su-relacion-con-los-builders)<br>
**Ver también:** [`viewModelScope`](#viewmodelscope) · [Concurrencia estructurada](#concurrencia-estructurada)

#### Corrutina {#corrutina}

Tarea que puede suspenderse y reanudarse sin bloquear el hilo en que corre, lo que permite escribir código asíncrono de forma secuencial.

**Dónde:** [Kotlin · Por qué no bloquear un hilo](00-android/00-kotlin/51-corrutinas.md#1-la-analogia-del-camarero-por-que-bloquear-un-hilo-es-fatal) · [Kotlin · Corrutinas e hilos](00-android/00-kotlin/51-corrutinas.md#2-corrutinas-vs-hilos-tradicionales-threads)<br>
**Ver también:** [`suspend`](#suspend) · [`launch`](#launch) · [`CoroutineScope`](#coroutinescope) · [Hilo principal](#hilo-principal)

## D {#letra-d}

#### `data class` {#data-class}

Clase pensada para contener datos. El compilador genera `toString()`, `equals()`, `hashCode()`, `copy()` y las funciones de desestructuración.

**Dónde:** [Kotlin · Data classes](00-android/00-kotlin/23-data-classes.md#2-metodos-generados-automaticamente-por-el-compilador)<br>
**Ver también:** [`copy()`](#copy) · [`UiState`](#uistate)

#### DataSource {#datasource}

Pieza que habla directamente con una fuente de datos concreta, como una base de datos o una API. La usa el repositorio.

**Dónde:** [Patrones · DataSource](00-android/02-arquitectura/05-glosario-patrones.md#datasource-fuente-de-datos)<br>
**Ver también:** [Repositorio](#repositorio) · [DTO (Data Transfer Object)](#dto)

#### Delegación con `by` {#delegacion}

Encarga a otro objeto el trabajo de una propiedad o de una interfaz. Es lo que permite escribir `var x by remember { … }` o `by lazy`.

**Dónde:** [Codelab 2.02 · El delegado `by`](02/codelabs/02-contador-incremental.md#la-magia-del-delegado-by-en-kotlin) · [Kotlin · Delegación de propiedades](00-android/00-kotlin/61-dsl-en-kotlin.md#ingrediente-3-delegacion-de-propiedades-con-by-remember-by-by-lazy-by-inject) · [Kotlin · Delegación de interfaces](00-android/00-kotlin/21-poo.md#la-magia-de-kotlin-delegacion-de-interfaces-by)<br>
**Ver también:** [`remember`](#remember)

#### Densidad y `dp` {#dp}

Las pantallas tienen distinta densidad de píxeles. `dp` es la unidad que se ve igual de grande en todas; `sp` hace lo mismo para el texto.

**Dónde:** [UT2 · Densidades de pantalla y dp](02/2.3.2-imagenes-iconos-recursos.md#densidades-de-pantalla-y-dp)<br>
**Ver también:** [Recursos](#recursos)

#### Dependency injection {#dependency-injection}

Ver [Inyección de dependencias (DI)](#inyeccion-de-dependencias).

#### `derivedStateOf` {#derivedstateof}

Estado calculado a partir de otros, que solo provoca recomposición cuando cambia su resultado. Es útil, por ejemplo, con el *scroll* de una lista.

**Dónde:** [Compose · `derivedStateOf`](00-android/00-compose/23-listas-cuadriculas.md#uso-de-derivedstateof-para-evitar-recomposiciones-continuas)<br>
**Ver también:** [Recomposición](#recomposicion)

#### Dispatcher {#dispatcher}

Decide en qué hilos se ejecuta una corrutina: `Main` para la interfaz, `IO` para red y disco, `Default` para cálculo.

**Dónde:** [Kotlin · Despachadores](00-android/00-kotlin/51-corrutinas.md#5-despachadores-en-android-dispatchers)<br>
**Ver también:** [`withContext`](#withcontext) · [Hilo principal](#hilo-principal)

#### `DisposableEffect` {#disposableeffect}

Efecto secundario para registrar algo al entrar en la composición y limpiarlo al salir, como un *listener*.

**Dónde:** [Compose · `DisposableEffect`](00-android/00-compose/27-compositionlocal-contexto-efectos.md#3-disposableeffect-registrar-y-limpiar-listeners-usando-el-context)<br>
**Ver también:** [Efecto secundario (*side effect*)](#efecto-secundario)

#### `DropdownMenu` {#dropdownmenu}

Menú flotante con opciones. Para seleccionar un valor en un formulario está `ExposedDropdownMenuBox`.

**Dónde:** [3A.2 · Menú desplegable](03/a-diseno/3a.2-componentes-interactivos.md#41-menu-desplegable-contextual-dropdownmenu) · [3A.2 · Menús expuestos](03/a-diseno/3a.2-componentes-interactivos.md#42-menus-expuestos-para-formularios-exposeddropdownmenubox)

#### DSL (lenguaje específico de dominio) {#dsl}

Sintaxis a medida para una tarea concreta, construida con lambdas con receptor y otras funciones de Kotlin. Compose, Koin y `build.gradle.kts` son DSL.

**Dónde:** [Kotlin · Qué es un DSL](00-android/00-kotlin/61-dsl-en-kotlin.md#1-que-es-un-dsl-interno) · [Kotlin · Ingredientes de un DSL](00-android/00-kotlin/61-dsl-en-kotlin.md#2-los-6-ingredientes-de-la-magia-sintactica)<br>
**Ver también:** [Lambda con receptor](#lambda-con-receptor)

#### DTO (Data Transfer Object) {#dto}

Clase que refleja el formato en que llegan los datos de una API externa. Se convierte con un *mapper* antes de pasar al dominio.

**Dónde:** [3C.2 · Modelos en cada capa](03/c-arquitectura/3c.2-clean-architecture.md#10-modelos-en-cada-capa-avance-de-ut4) · [Patrones · DTO](00-android/02-arquitectura/05-glosario-patrones.md#dto-data-transfer-object)<br>
**Ver también:** [Mapper](#mapper) · [Modelo de dominio](#modelo-de-dominio)

## E {#letra-e}

#### Edge-to-edge {#edge-to-edge}

La app dibuja en toda la pantalla, también bajo las barras del sistema. Luego debe dejar libres las zonas necesarias con los *insets*.

**Dónde:** [3B.2 · Edge-to-edge](03/b-navegacion/3b.2-diseno-adaptativo.md#2-edge-to-edge-aprovechar-toda-la-pantalla)<br>
**Ver también:** [Insets](#insets) · [`Scaffold`](#scaffold)

#### Efecto secundario (*side effect*) {#efecto-secundario}

Acción que sale del alcance de un composable, como una llamada a red o un *log*. Debe controlarse con una API de efectos, porque la recomposición repite el código.

**Dónde:** [Compose · Efectos secundarios](00-android/00-compose/27-compositionlocal-contexto-efectos.md#5-efectos-secundarios-side-effects-cruzando-la-frontera-de-la-composicion)<br>
**Ver también:** [`LaunchedEffect`](#launchedeffect) · [`DisposableEffect`](#disposableeffect) · [`rememberCoroutineScope`](#remembercoroutinescope) · [`LifecycleResumeEffect`](#lifecycleresumeeffect)

#### Elevación de estado {#elevacion-de-estado}

Ver [State hoisting (elevación de estado)](#state-hoisting).

#### `ElevatedCard` {#elevatedcard}

Tarjeta con sombra de Material 3, que agrupa información sobre un mismo elemento.

**Dónde:** [3A.3 · Tarjetas de colección](03/a-diseno/3a.3-listas-cuadriculas.md#5-diseno-de-tarjetas-de-coleccion-elevatedcard)<br>
**Ver también:** [`LazyVerticalGrid`](#lazyverticalgrid)

#### `?:` (operador Elvis) {#elvis}

Devuelve el valor de la izquierda si no es `null` y, si lo es, el de la derecha.

**Dónde:** [Kotlin · Operador Elvis](00-android/00-kotlin/14-null-safety.md#22-operador-elvis)<br>
**Ver también:** [Null safety](#null-safety) · [`?.` (llamada segura)](#llamada-segura)

#### Emulador {#emulador}

Ver [AVD (emulador)](#avd).

#### `entryProvider` {#entryprovider}

En Navigation 3, indica qué composable corresponde a cada clave de la pila, con `entry<TipoDeClave>`.

**Dónde:** [3B.1 · Mostrar la pantalla actual](03/b-navegacion/3b.1-navigation3.md#5-paso-3-mostrar-la-pantalla-actual-con-navdisplay)<br>
**Ver también:** [`NavDisplay`](#navdisplay) · [`NavKey`](#navkey)

#### `enum class` {#enum-class}

Tipo con un conjunto cerrado de valores, que pueden tener propiedades y métodos. Con `entries` se recorren todos.

**Dónde:** [Kotlin · Enums con propiedades](00-android/00-kotlin/24-enum-classes.md#2-enums-con-propiedades-y-metodos) · [Kotlin · `entries`](00-android/00-kotlin/24-enum-classes.md#3-iteracion-moderna-entries-vs-values)<br>
**Practica:** [Codelab 2.05 · El modelo](02/codelabs/05-semaforo-estados.md#2-paso-1-el-modelo-fasesemaforo)<br>
**Ver también:** [Tipos sellados (`sealed`)](#tipos-sellados)

#### Estado (`State`, `mutableStateOf`) {#estado}

Valor que puede cambiar y del que depende la interfaz. Si es observable, como `mutableStateOf`, su cambio provoca una recomposición.

**Dónde:** [Compose · Qué es el estado](00-android/00-compose/22-state-management.md#que-es-el-estado-en-jetpack-compose) · [Compose · Observación de estado](00-android/00-compose/22-state-management.md#observacion-de-estado)<br>
**Practica:** [Codelab 2.02 · `mutableIntStateOf`](02/codelabs/02-contador-incremental.md#pieza-1-el-estado-observable-mutableintstateof)<br>
**Ver también:** [`remember`](#remember) · [Recomposición](#recomposicion) · [State hoisting (elevación de estado)](#state-hoisting)

#### `expect` y `actual` {#expect-actual}

Mecanismo de KMP para el código propio de cada plataforma: `commonMain` declara lo que espera (`expect`), y cada plataforma lo implementa (`actual`).

**Dónde:** [3D.1 · `expect` y `actual`](03/d-kmp/3d.1-anatomia-proyecto-kmp.md#10-codigo-especifico-de-cada-plataforma-expect-y-actual) · [3D.2 · Cuál elijo](03/d-kmp/3d.2-compartir-logica.md#63-cual-elijo)<br>
**Ver también:** [`commonMain` y *source sets*](#source-sets) · [KMP (Kotlin Multiplatform)](#kmp)

#### Expresión y sentencia {#expresion-y-sentencia}

Una expresión devuelve un valor; una sentencia solo ejecuta una acción. En Kotlin, `if` y `when` son expresiones.

**Dónde:** [Kotlin · Expresiones y sentencias](00-android/00-kotlin/12-expresiones-vs-sentencias.md#diferencias-entre-expresiones-y-sentencias)<br>
**Ver también:** [`when`](#when)

#### Extension function {#extension-function}

Ver [Función de extensión](#funcion-de-extension).

## F {#letra-f}

#### Fake {#fake}

Implementación sencilla pero funcional de una interfaz, escrita por ti y con datos en memoria, para usarla en los tests.

**Dónde:** [3C.4 · Fakes frente a mocks](03/c-arquitectura/3c.4-testing.md#31-fakes-frente-a-mocks) · [3C.4 · Un repositorio de prueba](03/c-arquitectura/3c.4-testing.md#32-un-repositorio-de-prueba-controlable)<br>
**Ver también:** [Mock](#mock) · [Repositorio](#repositorio)

#### `filterKeys` y `filterValues` {#filterkeys}

Filtran un `Map` según su clave o su valor, y devuelven otro `Map`.

**Dónde:** [Kotlin · Filtrar un Map](00-android/00-kotlin/43-maps.md#filtrar-un-map)<br>
**Ver también:** [`Map`](#map) · [`mapValues`](#mapvalues)

#### Firma de la app {#firma}

Toda app debe estar firmada para instalarse: la firma demuestra quién la publica y que no se ha alterado. La clave se guarda en un *keystore*.

**Dónde:** [3E.1 · Por qué hay que firmar](03/e-publicacion/3e.1-preparar-lanzamiento.md#41-por-que-hay-que-firmar) · [3E.1 · Crear la clave de subida](03/e-publicacion/3e.1-preparar-lanzamiento.md#43-crear-la-clave-de-subida) · [3E.1 · Firmar sin exponer contraseñas](03/e-publicacion/3e.1-preparar-lanzamiento.md#44-firmar-desde-gradle-sin-exponer-las-contrasenas)<br>
**Ver también:** [Play App Signing](#play-app-signing) · [AAB (Android App Bundle)](#aab)

#### `Flow` {#flow}

Flujo asíncrono que emite varios valores a lo largo del tiempo. Es frío: no hace nada hasta que alguien lo recoge con `collect`.

**Dónde:** [Kotlin · Qué es un Flow](00-android/00-kotlin/52-flows.md#1-que-es-un-flow-la-analogia-de-la-cinta-transportadora) · [Kotlin · Creación y consumo](00-android/00-kotlin/52-flows.md#2-creacion-y-consumo-basico-de-un-flow) · [Kotlin · Operadores](00-android/00-kotlin/52-flows.md#6-operadores-de-transformacion-comunes)<br>
**Practica:** [Codelab de Kotlin · Flow y StateFlow](00-android/00-kotlin/codelabs/07-flow-stateflow.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [Flujo frío y flujo caliente](#flujo-frio-caliente) · [`StateFlow`](#stateflow) · [Programación reactiva](#programacion-reactiva)

#### Flujo frío y flujo caliente {#flujo-frio-caliente}

Un flujo frío empieza a emitir por cada colector que se conecta, y uno caliente emite aunque nadie escuche. `Flow` es frío; `StateFlow` y `SharedFlow`, calientes.

**Dónde:** [Kotlin · Fríos y calientes](00-android/00-kotlin/52-flows.md#3-flujos-frios-cold-streams-vs-flujos-calientes-hot-streams)<br>
**Ver también:** [`Flow`](#flow) · [`StateFlow`](#stateflow) · [`SharedFlow`](#sharedflow)

#### `fold` y `reduce` {#fold}

Recorren una lista y combinan cada elemento con un acumulador para obtener un único valor. `fold` recibe el valor inicial, y `reduce` empieza por el primer elemento.

**Dónde:** [Kotlin · `fold` y `reduce`](00-android/00-kotlin/42-listas.md#415-fold-reduce)<br>
**Practica:** [Ejercicios de Kotlin · Ejercicio 4.15](00-android/00-kotlin/ejercicios/04-colecciones-scope-functions.md#ejercicio-415-acumuladores-funcionales-puros-fold-frente-a-reduce)<br>
**Ver también:** [Pipeline de colecciones](#pipeline)

#### Flutter {#flutter}

Framework multiplataforma de Google, en lenguaje Dart. Dibuja cada píxel con su motor gráfico propio, así que se ve igual en todas partes.

**Dónde:** [UT1 · Multiplataforma](01/index.md#33-multiplataforma)<br>
**Ver también:** [React Native](#react-native) · [CMP (Compose Multiplatform)](#cmp)

#### Función de extensión {#funcion-de-extension}

Función que se añade a una clase existente sin heredar de ella ni modificarla: `fun String.esEmail(): Boolean`.

**Dónde:** [Kotlin · Funciones de extensión](00-android/00-kotlin/13-funciones-lambdas.md#5-funciones-de-extension-extension-functions)<br>
**Ver también:** [Mapper](#mapper)

#### Función de orden superior {#funcion-de-orden-superior}

Función que recibe otra función como parámetro o la devuelve. `map`, `filter` y los composables contenedores lo son.

**Dónde:** [Kotlin · Orden superior](00-android/00-kotlin/13-funciones-lambdas.md#3-funciones-de-orden-superior-higher-order-functions)<br>
**Ver también:** [Lambda](#lambda) · [Trailing lambda](#trailing-lambda)

## G {#letra-g}

#### Genéricos {#genericos}

Clases y funciones con parámetros de tipo, como `List<T>`, que funcionan con cualquier tipo sin perder la comprobación del compilador.

**Dónde:** [Kotlin · Clases genéricas](00-android/00-kotlin/25-genericos.md#1-clases-genericas) · [Kotlin · Restricciones de tipo](00-android/00-kotlin/25-genericos.md#3-restricciones-de-tipo-upper-bounds) · [Kotlin · Varianza](00-android/00-kotlin/25-genericos.md#4-varianza-en-kotlin-covarianza-out-y-contravarianza-in)<br>
**Practica:** [Codelab de Kotlin · Genéricos](00-android/00-kotlin/codelabs/02-genericos.md#1-la-idea-en-un-minuto)

#### Gradle {#gradle}

Herramienta que construye el proyecto: descarga dependencias, compila y empaqueta. Se configura con Kotlin DSL.

**Dónde:** [UT2 · Sistema de compilación](02/2.1-primeros-pasos.md#4-sistema-de-compilacion-gradle-con-kotlin-dsl) · [Herramientas · Gradle](00-android/00-tools/01-gradle-agp-estructura.md#gradle-el-motor-de-construccion) · [Herramientas · Tareas desde la terminal](00-android/00-tools/02-build-gradle.md#4-ejecutar-tareas-de-gradle-desde-la-terminal)<br>
**Ver también:** [AGP (Android Gradle Plugin)](#agp) · [`build.gradle.kts`](#build-gradle-kts) · [Sync y build](#sync)

#### `graphicsLayer` {#graphicslayer}

Modificador que transforma el dibujo (rotación, escala, opacidad) sin volver a medir ni colocar el elemento.

**Dónde:** [3A.4 · `graphicsLayer`](03/a-diseno/3a.4-animaciones.md#2-transformar-el-dibujo-graphicslayer)<br>
**Ver también:** [`animate*AsState`](#animate-as-state)

#### `groupBy` {#groupby}

Reparte una lista en un `Map` cuyas claves son los grupos y cuyos valores son listas con los elementos de cada grupo. Suele ir seguido de `mapValues` para resumir cada grupo.

**Dónde:** [Kotlin · `groupBy`](00-android/00-kotlin/43-maps.md#groupby) · [Kotlin · `groupBy` + `mapValues`](00-android/00-kotlin/43-maps.md#groupby-mapvalues)<br>
**Practica:** [Codelab de Kotlin · Colecciones y Maps](00-android/00-kotlin/codelabs/03-colecciones-maps.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`Map`](#map) · [`mapValues`](#mapvalues) · [`associateBy`](#associateby)

## H {#letra-h}

#### Higher-order function {#higher-order-function}

Ver [Función de orden superior](#funcion-de-orden-superior).

#### Hilo principal {#hilo-principal}

Hilo que dibuja la interfaz y atiende al usuario. Si se bloquea, la app se congela: el trabajo largo debe suspenderse o ir a otro hilo.

**Dónde:** [Kotlin · Por qué no bloquear un hilo](00-android/00-kotlin/51-corrutinas.md#1-la-analogia-del-camarero-por-que-bloquear-un-hilo-es-fatal)<br>
**Ver también:** [Corrutina](#corrutina) · [Dispatcher](#dispatcher)

#### Hilt {#hilt}

Herramienta de inyección de dependencias recomendada por Google. En este módulo usamos Koin.

**Dónde:** [Arquitectura · Koin frente a Hilt](00-android/02-arquitectura/03-inyeccion-dependencias-koin.md#por-que-koin-frente-a-hilt)<br>
**Ver también:** [Koin](#koin)

## I {#letra-i}

#### Icono adaptativo {#icono-adaptativo}

Icono formado por una capa de fondo y otra de primer plano, que cada dispositivo recorta con su propia forma.

**Dónde:** [Anexo A · El icono adaptativo](00-android/anexos/a-iconos-app-recursos.md#11-el-icono-adaptativo)<br>
**Practica:** [Codelab 2.06 · Image Asset Studio](02/codelabs/06-icono-pantalla-inicio.md#3-paso-1-el-icono-con-image-asset-studio)<br>
**Ver también:** [Pantalla de inicio (*splash*)](#splash)

#### Igualdad estructural y referencial {#igualdad}

`==` compara el contenido, y `===` comprueba si son el mismo objeto.

**Dónde:** [Kotlin · Igualdad](00-android/00-kotlin/11-variables-tipos-datos.md#53-igualdad-estructural-vs-referencial)<br>
**Ver también:** [`data class`](#data-class)

#### `Image` e `Icon` {#image-icon}

Composables para mostrar imágenes e iconos. `Icon` se tiñe con el color del tema, y `Image` mantiene los colores originales.

**Dónde:** [UT2 · `Image`](02/2.3.2-imagenes-iconos-recursos.md#3-mostrar-imagenes-con-image) · [UT2 · `Icon`](02/2.3.2-imagenes-iconos-recursos.md#4-iconos-con-icon)<br>
**Ver también:** [`contentDescription`](#contentdescription) · [`contentScale`](#contentscale) · [Recursos](#recursos)

#### Inferencia de tipos {#inferencia-de-tipos}

El compilador deduce el tipo de una variable a partir de su valor. No hace falta escribirlo, pero el tipo sigue siendo fijo.

**Dónde:** [Kotlin · Inferencia de tipos](00-android/00-kotlin/11-variables-tipos-datos.md#2-inferencia-de-tipos)<br>
**Ver también:** [`val` y `var`](#val-var)

#### `init` {#init}

Bloque que se ejecuta al crear un objeto, justo con el constructor primario. Se usa, por ejemplo, para validar parámetros.

**Dónde:** [Kotlin · El bloque `init`](00-android/00-kotlin/21-poo.md#el-bloque-init)<br>
**Ver también:** [Constructor primario](#constructor-primario)

#### Inmutabilidad {#inmutabilidad}

Un dato inmutable no cambia tras crearse: para modificarlo se crea otro. Un `val` que apunta a una lista mutable no hace inmutable la lista.

**Dónde:** [Kotlin · Inmutabilidad](00-android/00-kotlin/11-variables-tipos-datos.md#3-la-inmutabilidad-en-el-desarrollo-moderno) · [3C.1 · Estado inmutable](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#2-modelado-inmutable-del-estado-uistate)<br>
**Ver también:** [`val` y `var`](#val-var) · [`copy()`](#copy) · [`UiState`](#uistate)

#### Insets {#insets}

Tamaño de las zonas que ocupa el sistema, como la barra de estado o la de navegación. Sirven para que el contenido no quede tapado.

**Dónde:** [3B.2 · Insets](03/b-navegacion/3b.2-diseno-adaptativo.md#22-insets-las-zonas-que-no-debes-tapar) · [3B.2 · Con Scaffold](03/b-navegacion/3b.2-diseno-adaptativo.md#23-con-scaffold-lo-habitual)<br>
**Ver también:** [Edge-to-edge](#edge-to-edge)

#### Intent filter {#intent-filter}

Declaración en el Manifest de lo que sabe hacer un componente: ser la puerta de entrada (`LAUNCHER`) o abrir ciertos enlaces (*deep linking*).

**Dónde:** [Herramientas · Intent filters](00-android/00-tools/03-android-manifest.md#4-intent-filters-la-publicidad-de-tus-capacidades)<br>
**Ver también:** [Manifest (`AndroidManifest.xml`)](#manifest)

#### Interactor {#interactor}

Ver [Caso de uso (*use case*)](#caso-de-uso).

#### Interfaz {#interfaz}

Contrato de capacidades que una clase se compromete a cumplir. Una clase puede implementar varias, pero solo heredar de una.

**Dónde:** [Kotlin · Interfaces](00-android/00-kotlin/21-poo.md#interfaces-interface-el-contrato-de-capacidades)<br>
**Ver también:** [Clase abstracta](#clase-abstracta) · [Tipos sellados (`sealed`)](#tipos-sellados)

#### Inversión de dependencias {#inversion-de-dependencias}

Principio por el que la lógica de alto nivel no depende de los detalles, sino de abstracciones. En la práctica, el dominio define la interfaz del repositorio y la capa de datos la implementa.

**Dónde:** [3C.2 · El contrato del repositorio](03/c-arquitectura/3c.2-clean-architecture.md#5-paso-2-el-contrato-del-repositorio) · [Patrones · DIP y DI](00-android/02-arquitectura/05-glosario-patrones.md#inversion-de-dependencias-dip-e-inyeccion-di)<br>
**Ver también:** [Inyección de dependencias (DI)](#inyeccion-de-dependencias) · [Repositorio](#repositorio)

#### Inyección de dependencias (DI) {#inyeccion-de-dependencias}

Una clase recibe desde fuera lo que necesita, en lugar de crearlo ella misma. Eso permite cambiar piezas y hacer pruebas con facilidad.

**Dónde:** [3C.3 · Qué es](03/c-arquitectura/3c.3-inyeccion-dependencias-koin.md#1-que-es-la-inyeccion-de-dependencias) · [3C.2 · Quién crea las piezas](03/c-arquitectura/3c.2-clean-architecture.md#9-paso-6-quien-crea-y-conecta-las-piezas)<br>
**Ver también:** [Koin](#koin) · [Inversión de dependencias](#inversion-de-dependencias)

#### Ionic y Capacitor {#ionic-y-capacitor}

Ver [App híbrida](#app-hibrida).

## J {#letra-j}

#### Jetpack Compose {#jetpack-compose}

Kit de herramientas de Google para construir la interfaz de las apps Android de forma declarativa, en Kotlin.

**Dónde:** [UT2 · El paradigma declarativo](02/2.3-primera-app.md#1-el-paradigma-declarativo-ui-fstate)<br>
**Ver también:** [Paradigma declarativo](#paradigma-declarativo) · [`@Composable`](#composable) · [CMP (Compose Multiplatform)](#cmp)

#### `Job` {#job}

Lo que devuelve `launch`: el «mando a distancia» de una corrutina. Si se guarda, se puede cancelar.

**Dónde:** [3C.1 · Una tarea que se puede parar](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#51-una-tarea-que-se-puede-parar-job)<br>
**Practica:** [Codelab 3.08 · El ViewModel y su Job](03/codelabs/08-temporizador-pomodoro.md#3-paso-2-el-viewmodel-y-su-job)<br>
**Ver también:** [`launch`](#launch) · [Cancelación cooperativa](#cancelacion-cooperativa)

## K {#letra-k}

#### Keystore {#keystore}

Ver [Firma de la app](#firma).

#### KMP (Kotlin Multiplatform) {#kmp}

Tecnología para compartir código Kotlin (modelos, casos de uso, ViewModel…) entre plataformas. **Elección del módulo**, no una recomendación de Google.

**Dónde:** [UT1 · KMP y Compose Multiplatform](01/index.md#kmp) · [3D.1 · KMP y CMP](03/d-kmp/3d.1-anatomia-proyecto-kmp.md#1-recordatorio-kmp-y-compose-multiplatform) · [3D.2 · Qué va a cada sitio](03/d-kmp/3d.2-compartir-logica.md#1-el-plan-que-va-a-cada-sitio)<br>
**Ver también:** [CMP (Compose Multiplatform)](#cmp) · [`commonMain` y *source sets*](#source-sets) · [`expect` y `actual`](#expect-actual)

#### Koin {#koin}

Librería de inyección de dependencias con un DSL en Kotlin, compatible con KMP. Las piezas se declaran con `singleOf` y `viewModelOf`, y se obtienen con `koinViewModel()`. **Elección del módulo**: la opción de Google es Hilt.

**Dónde:** [3C.3 · Describir las piezas](03/c-arquitectura/3c.3-inyeccion-dependencias-koin.md#3-paso-1-describir-las-piezas-en-un-modulo) · [3C.3 · Arrancar Koin](03/c-arquitectura/3c.3-inyeccion-dependencias-koin.md#4-paso-2-arrancar-koin) · [3C.3 · Obtener los ViewModel](03/c-arquitectura/3c.3-inyeccion-dependencias-koin.md#5-paso-3-obtener-los-viewmodel-en-compose)<br>
**Ver también:** [Inyección de dependencias (DI)](#inyeccion-de-dependencias) · [Hilt](#hilt)

## L {#letra-l}

#### Lambda {#lambda}

Función sin nombre que se trata como un valor: se guarda en una variable o se pasa como parámetro. Si recibe un parámetro, se llama `it` por defecto.

**Dónde:** [Kotlin · De la función a la lambda](00-android/00-kotlin/13-funciones-lambdas.md#paso-3-la-expresion-lambda-maxima-sintesis) · [Kotlin · `it`](00-android/00-kotlin/13-funciones-lambdas.md#21-el-parametro-implicito-it) · [Kotlin · Lambdas en Compose](00-android/00-kotlin/13-funciones-lambdas.md#4-lambdas-el-motor-de-jetpack-compose)<br>
**Ver también:** [Función de orden superior](#funcion-de-orden-superior) · [Trailing lambda](#trailing-lambda) · [Lambda con receptor](#lambda-con-receptor)

#### Lambda con receptor {#lambda-con-receptor}

Lambda en la que `this` es un objeto concreto, de modo que se accede a sus miembros directamente. `Column { … }` y `apply { … }` se apoyan en ellas.

**Dónde:** [Kotlin · Lambdas con receptor](00-android/00-kotlin/13-funciones-lambdas.md#43-regla-3-lambdas-con-receptor-function-literals-with-receiver)<br>
**Ver también:** [DSL (lenguaje específico de dominio)](#dsl) · [Layout scope](#layout-scope) · [Scope functions](#scope-functions)

#### `lateinit` y `by lazy` {#lateinit-lazy}

Dos formas de no inicializar una propiedad al declararla: `lateinit var` la asigna más tarde y `by lazy` calcula un `val` la primera vez que se usa.

**Dónde:** [Kotlin · Si no podemos inicializar de inmediato](00-android/00-kotlin/11-variables-tipos-datos.md#7-adelanto-que-ocurre-si-no-podemos-inicializar-una-variable-de-inmediato)<br>
**Ver también:** [Delegación con `by`](#delegacion)

#### `launch` {#launch}

Lanza una corrutina que no devuelve ningún resultado: «lanzar y olvidar».

**Dónde:** [Kotlin · `launch`](00-android/00-kotlin/51-corrutinas.md#42-launch-lanzar-y-olvidar-fire-and-forget)<br>
**Ver también:** [`async` y `await`](#async-await) · [`Job`](#job) · [`viewModelScope`](#viewmodelscope)

#### `LaunchedEffect` {#launchedeffect}

Efecto secundario que lanza una corrutina al entrar en la composición, y la cancela al salir o cuando cambia su clave.

**Dónde:** [Compose · `LaunchedEffect`](00-android/00-compose/27-compositionlocal-contexto-efectos.md#1-launchedeffect-ejecutar-corrutinas-asociadas-a-un-ciclo-de-vida)<br>
**Ver también:** [Efecto secundario (*side effect*)](#efecto-secundario) · [`rememberCoroutineScope`](#remembercoroutinescope)

#### Layout scope {#layout-scope}

Receptor que ofrece modificadores exclusivos dentro de un contenedor: `weight` en `ColumnScope` y `RowScope`, `align` en `BoxScope`.

**Dónde:** [Compose · Los layout scopes](00-android/00-compose/21-composable-functions.md#los-layout-scopes-rowscope-columnscope-y-boxscope)<br>
**Ver también:** [Lambda con receptor](#lambda-con-receptor) · [`weight` y `Spacer`](#weight)

#### `LazyColumn` y `LazyRow` {#lazycolumn}

Listas que solo componen los elementos visibles, a diferencia de una `Column` con *scroll*, que los compone todos.

**Dónde:** [3A.3 · El problema del rendimiento](03/a-diseno/3a.3-listas-cuadriculas.md#1-el-problema-del-rendimiento-column-con-scroll-vs-lazylayout) · [3A.3 · `LazyColumn`](03/a-diseno/3a.3-listas-cuadriculas.md#2-listas-verticales-con-lazycolumn) · [3A.3 · Asignar `key`](03/a-diseno/3a.3-listas-cuadriculas.md#3-la-clave-del-rendimiento-asignacion-de-key)<br>
**Practica:** [Codelab 3.02 · `Column` y `LazyColumn`](03/codelabs/02-catalogo-lazycolumn.md#2-column-frente-a-lazycolumn)<br>
**Ver también:** [`LazyVerticalGrid`](#lazyverticalgrid)

#### `LazyVerticalGrid` {#lazyverticalgrid}

Cuadrícula perezosa, que puede tener un número fijo de columnas o adaptarlo al ancho disponible.

**Dónde:** [3A.3 · Cuadrículas](03/a-diseno/3a.3-listas-cuadriculas.md#4-cuadriculas-adaptativas-con-lazyverticalgrid)<br>
**Ver también:** [`LazyColumn` y `LazyRow`](#lazycolumn)

#### `let`, `run`, `with`, `apply`, `also` {#let-run-with-apply-also}

Ver [Scope functions](#scope-functions).

#### `LifecycleResumeEffect` {#lifecycleresumeeffect}

Efecto que se ejecuta cuando la app vuelve a primer plano y se limpia cuando sale de él. Sirve, por ejemplo, para pausar un cronómetro.

**Dónde:** [3C.1 · Parar al salir de la app](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#53-parar-al-salir-de-la-app-lifecycleresumeeffect)<br>
**Practica:** [Codelab 3.08 · Parar al salir](03/codelabs/08-temporizador-pomodoro.md#6-paso-5-parar-al-salir-de-la-app)<br>
**Ver también:** [Ciclo de vida](#ciclo-de-vida) · [Efecto secundario (*side effect*)](#efecto-secundario)

#### Lista y detalle {#lista-detalle}

Diseño que muestra una lista y su detalle a la vez en pantallas grandes, y por separado en un móvil.

**Dónde:** [3B.2 · Lista y detalle a la vez](03/b-navegacion/3b.2-diseno-adaptativo.md#5-lista-y-detalle-a-la-vez-con-navigation-3)<br>
**Ver también:** [Clases de tamaño de ventana](#clases-de-tamano)

#### `?.` (llamada segura) {#llamada-segura}

Accede a un miembro solo si el objeto no es `null`; si lo es, la expresión entera vale `null`.

**Dónde:** [Kotlin · Llamada segura](00-android/00-kotlin/14-null-safety.md#21-llamada-segura-safe-call-operator)<br>
**Ver también:** [Null safety](#null-safety) · [`?:` (operador Elvis)](#elvis)

#### Logcat {#logcat}

Registro del sistema donde aparecen los mensajes de `Log.d()` y los errores de la app. Es la primera herramienta de depuración.

**Dónde:** [UT2 · Depuración con Logcat](02/2.2-ciclo-vida-app.md#3-depuracion-del-ciclo-de-vida-con-logcat)<br>
**Practica:** [Codelab 2.03 · Logcat en IntelliJ IDEA](02/codelabs/03-ciclo-vida-logcat.md#4-paso-2-logcat-en-intellij-idea)<br>
**Ver también:** [Ciclo de vida](#ciclo-de-vida)

## M {#letra-m}

#### Manifest (`AndroidManifest.xml`) {#manifest}

Fichero que describe la app al sistema: nombre, icono, componentes y permisos.

**Dónde:** [UT2 · El archivo Manifest](02/2.1-primeros-pasos.md#31-el-archivo-androidmanifestxml) · [Herramientas · Permisos y hardware](00-android/00-tools/03-android-manifest.md#1-permisos-y-hardware-declarando-intenciones)<br>
**Ver también:** [Componentes de Android](#componentes-de-android) · [Intent filter](#intent-filter)

#### `Map` {#map}

Colección de pares clave-valor en la que cada clave aparece una sola vez. `Map` es de solo lectura, y `MutableMap` se puede modificar.

**Dónde:** [Kotlin · Qué método uso](00-android/00-kotlin/43-maps.md#que-metodo-uso) · [Kotlin · De una lista a un Map](00-android/00-kotlin/43-maps.md#de-lista-a-map)<br>
**Practica:** [Codelab de Kotlin · Colecciones y Maps](00-android/00-kotlin/codelabs/03-colecciones-maps.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`associateBy`](#associateby) · [`groupBy`](#groupby) · [`mapValues`](#mapvalues)

#### `mapValues` y `mapKeys` {#mapvalues}

Crean otro `Map` cambiando sus valores (`mapValues`) o sus claves (`mapKeys`). Dentro de la lambda, `it` es la entrada completa, no el valor.

**Dónde:** [Kotlin · `mapValues`](00-android/00-kotlin/43-maps.md#mapvalues) · [Kotlin · `mapKeys`](00-android/00-kotlin/43-maps.md#mapkeys)<br>
**Practica:** [Codelab de Kotlin · Colecciones y Maps](00-android/00-kotlin/codelabs/03-colecciones-maps.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`Map`](#map) · [`groupBy`](#groupby)

#### Mapper {#mapper}

Función que convierte un modelo de una capa al de otra, normalmente como función de extensión: `JuegoDto.toDomain()`.

**Dónde:** [3C.2 · Modelos en cada capa](03/c-arquitectura/3c.2-clean-architecture.md#10-modelos-en-cada-capa-avance-de-ut4) · [Arquitectura · Patrón Mapper](00-android/02-arquitectura/02-clean-architecture.md#patron-mapper)<br>
**Ver también:** [DTO (Data Transfer Object)](#dto) · [Modelo de dominio](#modelo-de-dominio) · [Función de extensión](#funcion-de-extension)

#### Material 3 {#material-3}

Sistema de diseño de Google, con componentes, colores, tipografía y formas. En Compose se usa mediante `MaterialTheme`.

**Dónde:** [3A.1 · El sistema de diseño](03/a-diseno/3a.1-material-design-3-scaffold.md#1-el-sistema-de-diseno-material-3-arquitectura-y-theming)<br>
**Ver también:** [Tema (`MaterialTheme`)](#tema) · [`ColorScheme` y roles de color](#colorscheme) · [`Scaffold`](#scaffold)

#### Material You {#material-you}

Ver [Color dinámico (Material You)](#color-dinamico).

#### `minSdk`, `targetSdk` y `compileSdk` {#minsdk}

Los tres niveles de API de un proyecto: el mínimo en que se puede instalar la app, aquel para el que está probada, y con el que se compila.

**Dónde:** [UT1 · `minSdk`, `targetSdk` y `compileSdk`](01/index.md#73-minsdk-targetsdk-y-compilesdk) · [Herramientas · Versiones del SDK](00-android/00-tools/02-build-gradle.md#32-versiones-del-sdk-compilesdk-vs-minsdk-vs-targetsdk) · [3E.1 · `targetSdk` y Google Play](03/e-publicacion/3e.1-preparar-lanzamiento.md#targetsdk-el-requisito-de-google-play)<br>
**Ver también:** [Nivel de API](#nivel-de-api)

#### Mock {#mock}

Objeto generado por una librería, como MockK, al que se le indica qué responder en cada llamada. En el curso preferimos los *fakes*.

**Dónde:** [3C.4 · Fakes frente a mocks](03/c-arquitectura/3c.4-testing.md#31-fakes-frente-a-mocks)<br>
**Ver también:** [Fake](#fake)

#### `ModalBottomSheet` {#modalbottomsheet}

Hoja que sube desde la parte inferior de la pantalla, con contenido o acciones adicionales.

**Dónde:** [3A.2 · Hojas inferiores](03/a-diseno/3a.2-componentes-interactivos.md#52-hojas-deslizantes-inferiores-modalbottomsheet)<br>
**Ver también:** [`AlertDialog`](#alertdialog)

#### `ModalNavigationDrawer` {#modalnavigationdrawer}

Menú lateral, o «menú hamburguesa», que aparece sobre el contenido.

**Dónde:** [3A.1 · El menú hamburguesa](03/a-diseno/3a.1-material-design-3-scaffold.md#6-el-menu-hamburguesa-con-modalnavigationdrawer)<br>
**Ver también:** [`Scaffold`](#scaffold) · [`NavigationSuiteScaffold`](#navigationsuitescaffold)

#### Modelo de dominio {#modelo-de-dominio}

Clase de datos que representa un concepto de la aplicación, sin rastro de anotaciones de base de datos ni de red.

**Dónde:** [3C.2 · El modelo de dominio](03/c-arquitectura/3c.2-clean-architecture.md#4-paso-1-el-modelo-de-dominio) · [Patrones · Entidad de dominio](00-android/02-arquitectura/05-glosario-patrones.md#entidad-de-dominio-domain-entity-domain-model)<br>
**Ver también:** [Capas (UI, dominio, datos)](#capas) · [DTO (Data Transfer Object)](#dto)

#### `Modifier` {#modifier}

Objeto encadenable que configura un composable: tamaño, relleno, fondo, clics. El orden en que se encadena cambia el resultado.

**Dónde:** [UT2 · ¿Qué es un `Modifier`?](02/2.3.1-layouts-modificadores.md#7-que-es-un-modifier) · [UT2 · El orden importa](02/2.3.1-layouts-modificadores.md#8-el-orden-de-los-modificadores-importa)<br>
**Ver también:** [`weight` y `Spacer`](#weight) · [Layout scope](#layout-scope)

#### MVVM (Model-View-ViewModel) {#mvvm}

Patrón que separa la vista del estado y la lógica de presentación, que pasan al ViewModel. En los apuntes verás esa misma idea descrita como capa de UI con ViewModel y UDF.

**Dónde:** [3C.1 · El rol del ViewModel](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#1-el-rol-del-viewmodel-en-la-arquitectura-moderna)<br>
**Ver también:** [`ViewModel`](#viewmodel) · [UDF (flujo de datos unidireccional)](#udf) · [Capas (UI, dominio, datos)](#capas)

## N {#letra-n}

#### `NavDisplay` {#navdisplay}

En Navigation 3, observa la pila y muestra la pantalla que corresponde al último elemento.

**Dónde:** [3B.1 · `NavDisplay`](03/b-navegacion/3b.1-navigation3.md#5-paso-3-mostrar-la-pantalla-actual-con-navdisplay)<br>
**Practica:** [Codelab 3.05 · La pila y NavDisplay](03/codelabs/05-navegacion-navigation3.md#6-paso-4-la-pila-y-navdisplay)<br>
**Ver también:** [Pila de navegación (*back stack*)](#pila-de-navegacion) · [`entryProvider`](#entryprovider)

#### Navigation 3 {#navigation-3}

Biblioteca de navegación que se usa en clase. La pila es una lista que manejas tú: navegar es añadir o quitar elementos.

**Dónde:** [3B.1 · La idea](03/b-navegacion/3b.1-navigation3.md#1-la-idea-una-pila-de-pantallas) · [3B.1 · Configurar el proyecto](03/b-navegacion/3b.1-navigation3.md#2-configurar-el-proyecto)<br>
**Practica:** [Codelab 3.05 · La navegación es una lista](03/codelabs/05-navegacion-navigation3.md#2-la-navegacion-es-una-lista)<br>
**Ver también:** [Pila de navegación (*back stack*)](#pila-de-navegacion) · [`NavKey`](#navkey) · [`NavDisplay`](#navdisplay) · [Navigation Compose](#navigation-compose)

#### Navigation Compose {#navigation-compose}

Biblioteca anterior a Navigation 3, basada en `NavHost` y `NavController`. Es útil para reconocerla en proyectos existentes; en clase se usa Navigation 3.

**Dónde:** [Compose · El contenedor `NavHost`](00-android/00-compose/24-navegacion-rutas.md#3-el-contenedor-navhost-tipado)<br>
**Ver también:** [Navigation 3](#navigation-3)

#### `NavigationSuiteScaffold` {#navigationsuitescaffold}

Elige la navegación adecuada al tamaño de la ventana, sin escribir cada caso: barra inferior, riel o cajón lateral.

**Dónde:** [3B.2 · Navegación adaptativa](03/b-navegacion/3b.2-diseno-adaptativo.md#4-navegacion-adaptativa-con-navigationsuitescaffold)<br>
**Ver también:** [Clases de tamaño de ventana](#clases-de-tamano)

#### `NavKey` {#navkey}

Interfaz que implementan las claves de las pantallas en Navigation 3. Cada clave también lleva `@Serializable`, y sus propiedades son los argumentos.

**Dónde:** [3B.1 · Definir los destinos](03/b-navegacion/3b.1-navigation3.md#3-paso-1-definir-los-destinos)<br>
**Practica:** [Codelab 3.05 · Las claves](03/codelabs/05-navegacion-navigation3.md#4-paso-2-las-claves-de-cada-pantalla)<br>
**Ver también:** [Navigation 3](#navigation-3) · [Pila de navegación (*back stack*)](#pila-de-navegacion)

#### Nivel de API {#nivel-de-api}

Número entero que identifica cada versión de Android. Es lo que se indica en `minSdk`, `targetSdk` y `compileSdk`.

**Dónde:** [UT1 · Versiones y niveles de API](01/index.md#versiones-api)<br>
**Ver también:** [`minSdk`, `targetSdk` y `compileSdk`](#minsdk)

#### Null safety {#null-safety}

El sistema de tipos distingue `String` (nunca nulo) de `String?` (puede serlo), y el compilador obliga a tratar el caso nulo.

**Dónde:** [Kotlin · Tipos anulables](00-android/00-kotlin/14-null-safety.md#1-tipos-no-anulables-vs-tipos-anulables) · [Kotlin · Operadores](00-android/00-kotlin/14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)<br>
**Ver también:** [`?:` (operador Elvis)](#elvis) · [`?.` (llamada segura)](#llamada-segura) · [`!!` (aserción no nula)](#asercion-no-nula) · [Smart cast](#smart-cast)

## O {#letra-o}

#### `object` (singleton) {#object}

Declara una clase y su única instancia a la vez, sin necesidad de constructor.

**Dónde:** [Kotlin · Declaración de objetos](00-android/00-kotlin/22-objetos-anonimos.md#1-declaracion-de-objetos-el-patron-singleton-nativo)<br>
**Ver también:** [`companion object`](#companion-object)

#### Offline-first {#offline-first}

Estrategia en la que la app lee de la base de datos local, para funcionar sin conexión, y sincroniza con la red en segundo plano.

**Dónde:** [Guía de Google · Offline-first](00-android/02-arquitectura/01-guia-arquitectura-google.md#15-estrategia-sin-conexion-primero-offline-first) · [Guía de Google · En el repositorio](00-android/02-arquitectura/01-guia-arquitectura-google.md#la-estrategia-offline-first-en-el-repositorio)<br>
**Ver también:** [Repositorio](#repositorio) · [SSOT (fuente única de verdad)](#ssot)

#### Ofuscación {#ofuscacion}

Ver [R8](#r8).

#### `open` {#open}

Permite heredar de una clase o sobrescribir un método. En Kotlin, sin `open`, las clases y sus métodos son `final`.

**Dónde:** [Kotlin · Herencia y `open`](00-android/00-kotlin/21-poo.md#5-herencia-final-por-defecto-y-la-palabra-clave-open)<br>
**Ver también:** [Clase abstracta](#clase-abstracta)

#### `OutlinedTextField` {#outlinedtextfield}

Campo de texto con borde. Como todo en Compose, no guarda el texto: lo recibe en `value` y avisa de los cambios en `onValueChange`.

**Dónde:** [3A.2 · Anatomía y validación](03/a-diseno/3a.2-componentes-interactivos.md#21-anatomia-y-validacion-reactiva)<br>
**Practica:** [Codelab 3.04 · Un campo sigue el estado](03/codelabs/04-propinas-formulario.md#2-un-campo-de-texto-tambien-sigue-el-estado)<br>
**Ver también:** [State hoisting (elevación de estado)](#state-hoisting)

## P {#letra-p}

#### Pantalla de inicio (*splash*) {#splash}

Pantalla que muestra el sistema al arrancar la app. Desde Android 12 siempre existe, y se personaliza con `core-splashscreen`.

**Dónde:** [Anexo B · Qué hace el sistema](00-android/anexos/b-pantalla-inicio-splash.md#1-que-hace-el-sistema-desde-android-12) · [Anexo B · Configurarla](00-android/anexos/b-pantalla-inicio-splash.md#2-configurarla-con-core-splashscreen)<br>
**Practica:** [Codelab 2.06 · `core-splashscreen`](02/codelabs/06-icono-pantalla-inicio.md#4-paso-2-la-biblioteca-core-splashscreen)<br>
**Ver también:** [Icono adaptativo](#icono-adaptativo)

#### Paradigma declarativo {#paradigma-declarativo}

Se describe **qué** debe verse según el estado, no **cómo** cambiarlo paso a paso. Se resume en la fórmula `UI = f(state)`.

**Dónde:** [UT2 · `UI = f(State)`](02/2.3-primera-app.md#1-el-paradigma-declarativo-ui-fstate)<br>
**Ver también:** [Jetpack Compose](#jetpack-compose) · [Estado (`State`, `mutableStateOf`)](#estado) · [Recomposición](#recomposicion)

#### Patrón de ranuras {#patron-de-ranuras}

Ver [Slot API (patrón de ranuras)](#slot-api).

#### Pila de navegación (*back stack*) {#pila-de-navegacion}

Lista de pantallas abiertas. Se ve la última; navegar añade una y volver atrás la quita. En Navigation 3 se crea con `rememberNavBackStack`.

**Dónde:** [3B.1 · Una pila de pantallas](03/b-navegacion/3b.1-navigation3.md#1-la-idea-una-pila-de-pantallas) · [3B.1 · Crear la pila](03/b-navegacion/3b.1-navigation3.md#4-paso-2-crear-la-pila) · [3B.1 · Operaciones habituales](03/b-navegacion/3b.1-navigation3.md#7-operaciones-habituales-con-la-pila)<br>
**Ver también:** [Navigation 3](#navigation-3) · [`NavDisplay`](#navdisplay)

#### Pipeline de colecciones {#pipeline}

Cadena de operaciones como `filter`, `map` o `sortedBy`, cada una de las cuales devuelve una lista nueva. Es la alternativa declarativa a los bucles con listas auxiliares.

**Dónde:** [Kotlin · Operaciones funcionales](00-android/00-kotlin/42-listas.md#4-operaciones-funcionales-imprescindibles) · [Kotlin · Pipelines](00-android/00-kotlin/42-listas.md#5-programacion-fluent-pipelines-de-transformacion-encadenados)<br>
**Practica:** [Codelab de Kotlin · Colecciones y Maps](00-android/00-kotlin/codelabs/03-colecciones-maps.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`Sequence`](#sequence) · [`Map`](#map) · [`groupBy`](#groupby)

#### Pirámide de tests {#piramide-de-tests}

Reparto recomendado de las pruebas: muchas unitarias en la base, y pocas de interfaz en la punta, que son más lentas.

**Dónde:** [3C.4 · La pirámide de tests](03/c-arquitectura/3c.4-testing.md#11-la-piramide-de-tests)<br>
**Ver también:** [Test local y test instrumentado](#test-instrumentado)

#### Pistas de prueba {#pistas-de-prueba}

Grupos de lanzamiento de Play Console: prueba interna, cerrada, abierta y producción. Cada una tiene su propia versión y sus propios usuarios.

**Dónde:** [3E.2 · Pistas de prueba](03/e-publicacion/3e.2-publicar-google-play.md#6-pistas-de-prueba-probar-antes-de-publicar) · [3E.2 · El requisito de testers](03/e-publicacion/3e.2-publicar-google-play.md#61-el-requisito-de-12-testers-durante-14-dias)<br>
**Ver también:** [Play Console](#play-console)

#### Play App Signing {#play-app-signing}

Sistema de dos claves de Google Play: Google guarda la clave de firma de la app, y tú, la clave de subida con que firmas el AAB.

**Dónde:** [3E.1 · Dos claves](03/e-publicacion/3e.1-preparar-lanzamiento.md#42-play-app-signing-dos-claves)<br>
**Ver también:** [Firma de la app](#firma) · [AAB (Android App Bundle)](#aab)

#### Play Console {#play-console}

Panel web desde el que se crea la app, se rellena su ficha y sus declaraciones, y se gestionan los lanzamientos en Google Play.

**Dónde:** [3E.2 · Crear la app](03/e-publicacion/3e.2-publicar-google-play.md#3-crear-la-app-en-play-console) · [3E.2 · La ficha de la tienda](03/e-publicacion/3e.2-publicar-google-play.md#5-la-ficha-de-la-tienda) · [3E.2 · Crear un lanzamiento](03/e-publicacion/3e.2-publicar-google-play.md#7-crear-un-lanzamiento)<br>
**Ver también:** [Pistas de prueba](#pistas-de-prueba) · [Android Vitals](#android-vitals)

#### Polimorfismo {#polimorfismo}

Un mismo mensaje produce distinto comportamiento según el objeto que lo recibe. Se usa a través de un tipo común, como una interfaz.

**Dónde:** [Kotlin · Polimorfismo](00-android/00-kotlin/21-poo.md#7-polimorfismo-comprobacion-de-tipos-y-smart-casting) · [Kotlin · Polimorfismo restringido](00-android/00-kotlin/26-sealed-classes.md#2-la-solucion-de-kotlin-tipos-sellados-polimorfismo-restringido)<br>
**Ver también:** [Interfaz](#interfaz) · [Tipos sellados (`sealed`)](#tipos-sellados)

#### `@Preview` {#preview}

Anotación que dibuja un composable en el IDE, sin ejecutar la app. Admite varias configuraciones, como modo oscuro o distintos tamaños.

**Dónde:** [UT2 · La anotación `@Preview`](02/2.3-primera-app.md#5-dominio-de-la-anotacion-preview) · [Compose · Datos simulados](00-android/00-compose/26-preview-diseno-mock.md#4-creacion-de-datos-simulados-mock-data)<br>
**Practica:** [Codelab 2.01 · Vistas previas](02/codelabs/01-tarjeta-presentacion.md#4-paso-2-vistas-previas-con-preview)<br>
**Ver también:** [Stateful y stateless](#stateful-stateless)

#### Programación reactiva {#programacion-reactiva}

En lugar de preguntar cada vez por un dato (*pull*), el código se suscribe y reacciona cuando cambia (*push*), como una hoja de cálculo.

**Dónde:** [Kotlin · El paradigma reactivo](00-android/00-kotlin/52-flows.md#0-fundamentos-del-paradigma-reactivo-de-preguntar-pull-a-reaccionar-push)<br>
**Ver también:** [`Flow`](#flow) · [`StateFlow`](#stateflow)

#### Prop drilling {#prop-drilling}

Problema de pasar un dato por muchos niveles de composables que no lo usan solo para que llegue a uno que sí.

**Dónde:** [Compose · El problema y su solución](00-android/00-compose/27-compositionlocal-contexto-efectos.md#2-el-problema-del-prop-drilling-y-la-solucion-con-compositionlocal)<br>
**Ver también:** [`CompositionLocal`](#compositionlocal)

#### PWA (Progressive Web App) {#pwa}

Web que usa APIs modernas para ser instalable, funcionar sin conexión y enviar notificaciones. Solo puede hacer lo que le permita el navegador de cada plataforma.

**Dónde:** [UT1 · Web y PWA](01/index.md#31-web-y-pwa)<br>
**Ver también:** [App híbrida](#app-hibrida)

## R {#letra-r}

#### R8 {#r8}

Herramienta que reduce, ofusca y optimiza el código al compilar para `release`. Se activa con `isMinifyEnabled = true`.

**Dónde:** [3E.1 · Reducir y proteger el código](03/e-publicacion/3e.1-preparar-lanzamiento.md#5-reducir-y-proteger-el-codigo-con-r8)<br>
**Ver también:** [Tipos de compilación (*build types*)](#tipos-de-compilacion) · [AAB (Android App Bundle)](#aab)

#### Rangos {#rangos}

Secuencias de valores: `1..5` incluye el 5, `1 until 5` no lo incluye, y `downTo` y `step` cuentan hacia atrás o a saltos.

**Dónde:** [Kotlin · Bucle `for` y progresiones](00-android/00-kotlin/12.2-bucles-iteracion.md#2-el-bucle-for-y-las-progresiones-numericas)<br>
**Ver también:** [`when`](#when)

#### React Native {#react-native}

Framework multiplataforma de Meta, en JavaScript o TypeScript. A diferencia de Flutter, muestra componentes nativos reales.

**Dónde:** [UT1 · Multiplataforma](01/index.md#33-multiplataforma)<br>
**Ver también:** [Flutter](#flutter)

#### Recomposición {#recomposicion}

Proceso por el que Compose vuelve a ejecutar los composables cuyo estado ha cambiado para actualizar la pantalla. No es lo mismo que el ciclo de vida de la Activity.

**Dónde:** [UT2 · Recomposición y ciclo de vida](02/2.2-ciclo-vida-app.md#41-recomposicion-vs-ciclo-de-vida-del-sistema) · [Compose · Actualización de funciones](00-android/00-compose/21-composable-functions.md#actualizacion-de-funciones-componibles)<br>
**Practica:** [Codelab 2.02 · El gran error del principiante](02/codelabs/02-contador-incremental.md#2-el-gran-error-del-principiante-en-compose)<br>
**Ver también:** [Estado (`State`, `mutableStateOf`)](#estado) · [`remember`](#remember)

#### Recursos {#recursos}

Lo que no es código y vive en `res/`: textos, colores, imágenes y otros. Android elige la versión adecuada según idioma, densidad o tema.

**Dónde:** [UT2 · Los recursos](02/2.3.2-imagenes-iconos-recursos.md#1-los-recursos-de-una-app-android) · [UT2 · Textos y colores](02/2.3.2-imagenes-iconos-recursos.md#5-textos-y-colores-como-recursos)<br>
**Practica:** [Codelab 2.04 · Los recursos](02/codelabs/04-dado-interactivo.md#2-los-recursos-de-una-app-android)<br>
**Ver también:** [Clase `R`](#clase-r) · [Calificadores de recursos](#calificadores)

#### `remember` {#remember}

Conserva un valor entre recomposiciones. Se pierde si la pantalla sale de la composición o la Activity se vuelve a crear.

**Dónde:** [UT2 · `remember` y `rememberSaveable`](02/2.2-ciclo-vida-app.md#42-remember-vs-remembersaveable) · [Compose · `remember` y `mutableStateOf`](00-android/00-compose/22-state-management.md#declarando-el-estado-el-duo-indispensable-remember-y-mutablestateof)<br>
**Practica:** [Codelab 2.02 · `remember`](02/codelabs/02-contador-incremental.md#pieza-2-el-guardian-de-la-memoria-remember)<br>
**Ver también:** [`rememberSaveable`](#remembersaveable) · [Estado (`State`, `mutableStateOf`)](#estado) · [Delegación con `by`](#delegacion)

#### `rememberCoroutineScope` {#remembercoroutinescope}

Da un ámbito de corrutinas ligado a la composición, para lanzar corrutinas desde un evento del usuario, como un clic.

**Dónde:** [Compose · `rememberCoroutineScope`](00-android/00-compose/27-compositionlocal-contexto-efectos.md#2-remembercoroutinescope-lanzar-corrutinas-desde-eventos-del-usuario)<br>
**Ver también:** [`LaunchedEffect`](#launchedeffect) · [`CoroutineScope`](#coroutinescope)

#### `rememberSaveable` {#remembersaveable}

Como `remember`, pero el valor también sobrevive a los cambios de configuración y a que el sistema cierre la app en segundo plano.

**Dónde:** [UT2 · `remember` y `rememberSaveable`](02/2.2-ciclo-vida-app.md#42-remember-vs-remembersaveable)<br>
**Practica:** [Codelab 2.03 · El arreglo](02/codelabs/03-ciclo-vida-logcat.md#7-paso-5-el-arreglo-remembersaveable)<br>
**Ver también:** [`remember`](#remember) · [Cambio de configuración](#cambio-de-configuracion)

#### Repositorio {#repositorio}

Pieza que centraliza el acceso a los datos y oculta de dónde vienen. Con Clean Architecture, la interfaz está en el dominio y la implementación, en la capa de datos.

**Dónde:** [3C.2 · El contrato del repositorio](03/c-arquitectura/3c.2-clean-architecture.md#5-paso-2-el-contrato-del-repositorio) · [3C.2 · La implementación en memoria](03/c-arquitectura/3c.2-clean-architecture.md#6-paso-3-la-implementacion-en-memoria) · [Patrones · Repository](00-android/02-arquitectura/05-glosario-patrones.md#repository-repositorio)<br>
**Ver también:** [Caso de uso (*use case*)](#caso-de-uso) · [DataSource](#datasource) · [SSOT (fuente única de verdad)](#ssot) · [Fake](#fake)

#### Room {#room}

Librería de Android para usar una base de datos SQLite local, que puede exponer los datos como `Flow`. Aquí se presenta como avance.

**Dónde:** [3C.2 · Modelos en cada capa](03/c-arquitectura/3c.2-clean-architecture.md#10-modelos-en-cada-capa-avance-de-ut4) · [Kotlin · De Room a Compose](00-android/00-kotlin/52-flows.md#7-la-conexion-final-de-room-a-jetpack-compose)<br>
**Ver también:** [DTO (Data Transfer Object)](#dto) · [Offline-first](#offline-first)

#### `runBlocking` {#runblocking}

Crea un ámbito de corrutinas y bloquea el hilo hasta que terminan. Se ve en ejemplos de consola; no se usa en una app.

**Dónde:** [Kotlin · `runBlocking`](00-android/00-kotlin/51-corrutinas.md#46-que-es-runblocking-y-por-que-lo-vemos-en-los-ejemplos)<br>
**Ver también:** [`runTest`](#runtest)

#### `runTest` {#runtest}

Ejecuta un test con corrutinas en tiempo virtual, de modo que un `delay` no hace esperar de verdad.

**Dónde:** [3C.1 · Probar el tiempo sin esperar](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#54-probar-el-tiempo-sin-esperar) · [3C.4 · Test de un caso de uso](03/c-arquitectura/3c.4-testing.md#33-test-de-un-caso-de-uso)<br>
**Practica:** [Codelab 3.08 · Tiempo virtual](03/codelabs/08-temporizador-pomodoro.md#7-paso-6-tests-con-tiempo-virtual)<br>
**Ver también:** [`runBlocking`](#runblocking) · [Turbine](#turbine)

## S {#letra-s}

#### `Scaffold` {#scaffold}

Estructura de una pantalla de Material, con huecos para la barra superior e inferior, el botón flotante y el contenido.

**Dónde:** [3A.1 · El contenedor `Scaffold`](03/a-diseno/3a.1-material-design-3-scaffold.md#3-estructura-de-pantalla-el-contenedor-scaffold)<br>
**Practica:** [Codelab 3.03 · Los huecos de Scaffold](03/codelabs/03-tareas-scaffold.md#2-los-huecos-de-scaffold)<br>
**Ver también:** [Slot API (patrón de ranuras)](#slot-api) · [`TopAppBar`](#topappbar) · [`Snackbar`](#snackbar) · [Insets](#insets)

#### Scope functions {#scope-functions}

`let`, `run`, `with`, `apply` y `also` ejecutan un bloque sobre un objeto. Se diferencian en cómo lo nombran (`this` o `it`) y en qué devuelven.

**Dónde:** [Kotlin · Tabla maestra](00-android/00-kotlin/31-scope-functions.md#3-tabla-maestra-de-seleccion-rapida) · [Kotlin · Cuál elegir](00-android/00-kotlin/31-scope-functions.md#4-guia-visual-cual-debo-elegir-en-3-preguntas) · [Kotlin · Errores frecuentes](00-android/00-kotlin/31-scope-functions.md#7-errores-frecuentes)<br>
**Practica:** [Codelab de Kotlin · Scope functions](00-android/00-kotlin/codelabs/04-scope-functions.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [Lambda con receptor](#lambda-con-receptor)

#### Sealed class / interface {#sealed-class-interface}

Ver [Tipos sellados (`sealed`)](#tipos-sellados).

#### Separación de responsabilidades {#separacion-de-responsabilidades}

Principio de que cada clase se ocupe de una sola cosa. Es la base de las recomendaciones de arquitectura de Google.

**Dónde:** [Guía de Google · Separación de responsabilidades](00-android/02-arquitectura/01-guia-arquitectura-google.md#11-separacion-de-responsabilidades-separation-of-concerns)<br>
**Ver también:** [Capas (UI, dominio, datos)](#capas)

#### `Sequence` {#sequence}

Colección perezosa: procesa cada elemento solo cuando hace falta, y no crea una lista intermedia en cada paso del pipeline.

**Dónde:** [Kotlin · Secuencias perezosas](00-android/00-kotlin/42-listas.md#6-listas-impacientes-eager-vs-secuencias-perezosas-lazy-sequences)<br>
**Ver también:** [Pipeline de colecciones](#pipeline) · [`Flow`](#flow)

#### `SharedFlow` {#sharedflow}

Flujo caliente sin valor actual, para difundir eventos puntuales como mostrar un aviso.

**Dónde:** [Kotlin · SharedFlow](00-android/00-kotlin/52-flows.md#5-sharedflow-emision-de-eventos-unicos-one-shot-events)<br>
**Ver también:** [`StateFlow`](#stateflow) · [Flujo frío y flujo caliente](#flujo-frio-caliente)

#### Side effect {#side-effect}

Ver [Efecto secundario (*side effect*)](#efecto-secundario).

#### Single Source of Truth {#single-source-of-truth}

Ver [SSOT (fuente única de verdad)](#ssot).

#### Singleton {#singleton}

Ver [`object` (singleton)](#object).

#### Slot API (patrón de ranuras) {#slot-api}

Un composable deja huecos que se rellenan con otros composables, recibidos como parámetros. `Scaffold` y el parámetro `content` son ejemplos.

**Dónde:** [UT2 · Slot APIs](02/2.3-primera-app.md#4-el-patron-de-ranuras-slot-apis-y-el-concepto-de-content)<br>
**Practica:** [Codelab 3.03 · Los huecos de Scaffold](03/codelabs/03-tareas-scaffold.md#2-los-huecos-de-scaffold)<br>
**Ver también:** [`Scaffold`](#scaffold) · [Trailing lambda](#trailing-lambda)

#### Smart cast {#smart-cast}

Tras comprobar un tipo con `is` o descartar `null`, el compilador trata la variable como de ese tipo sin necesidad de convertirla.

**Dónde:** [Kotlin · Smart casts](00-android/00-kotlin/14-null-safety.md#3-comprobaciones-y-smart-casts) · [Kotlin · Cuándo es posible](00-android/00-kotlin/21-poo.md#cuando-es-posible-el-smart-cast-regla-de-oro)<br>
**Ver también:** [`when`](#when) · [`as?` (casteo seguro)](#casteo-seguro)

#### `Snackbar` {#snackbar}

Aviso temporal en la parte inferior de la pantalla, que puede incluir una acción como «Deshacer».

**Dónde:** [3A.1 · Notificaciones temporales](03/a-diseno/3a.1-material-design-3-scaffold.md#5-notificaciones-temporales-con-snackbar)<br>
**Practica:** [Codelab 3.03 · Deshacer con Snackbar](03/codelabs/03-tareas-scaffold.md#6-paso-4-deshacer-con-snackbar)<br>
**Ver también:** [`Scaffold`](#scaffold)

#### SSOT (fuente única de verdad) {#ssot}

*Single Source of Truth*: cada dato tiene un único dueño, que es el único que lo modifica. Los demás lo observan.

**Dónde:** [Guía de Google · SSOT](00-android/02-arquitectura/01-guia-arquitectura-google.md#13-fuente-unica-de-verdad-single-source-of-truth-ssot) · [Patrones · SSOT](00-android/02-arquitectura/05-glosario-patrones.md#ssot-single-source-of-truth)<br>
**Ver también:** [UDF (flujo de datos unidireccional)](#udf) · [Repositorio](#repositorio)

#### State hoisting (elevación de estado) {#state-hoisting}

Sacar el estado de un composable: recibe el valor como parámetro y comunica los cambios con una lambda. Así queda sin estado y es reutilizable.

**Dónde:** [UT2 · Stateful y Stateless](02/2.3-primera-app.md#3-patron-de-diseno-stateful-screen-vs-stateless-content) · [Compose · La regla de oro](00-android/00-compose/22-state-management.md#la-regla-de-oro-del-state-hoisting) · [Patrones · State hoisting](00-android/02-arquitectura/05-glosario-patrones.md#state-hoisting-elevacion-de-estado)<br>
**Practica:** [Codelab 2.02 · El componente sin estado](02/codelabs/02-contador-incremental.md#4-paso-1-el-componente-sin-estado-contadorcontent)<br>
**Ver también:** [Stateful y stateless](#stateful-stateless) · [UDF (flujo de datos unidireccional)](#udf) · [Estado (`State`, `mutableStateOf`)](#estado)

#### `StateFlow` {#stateflow}

Flujo caliente que siempre tiene un valor actual y avisa de cada cambio. El ViewModel lo usa para exponer el estado de la pantalla.

**Dónde:** [3C.1 · `StateFlow` y UDF](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#3-reactividad-con-stateflow-y-el-patron-udf) · [Kotlin · StateFlow](00-android/00-kotlin/52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose)<br>
**Practica:** [Codelab 3.06 · El ViewModel](03/codelabs/06-quiz-viewmodel.md#5-paso-3-el-viewmodel)<br>
**Ver también:** [`UiState`](#uistate) · [UDF (flujo de datos unidireccional)](#udf) · [`collectAsStateWithLifecycle`](#collectasstatewithlifecycle) · [`stateIn`](#statein)

#### Stateful y stateless {#stateful-stateless}

Un composable *stateful* guarda o recibe su estado de un ViewModel; uno *stateless* solo recibe datos y lambdas. Separarlos en `Screen` y `Content` facilita las previews y los tests.

**Dónde:** [UT2 · Screen y Content](02/2.3-primera-app.md#3-patron-de-diseno-stateful-screen-vs-stateless-content) · [3C.1 · Consumo en Compose](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#4-consumo-del-viewmodel-en-compose)<br>
**Ver también:** [State hoisting (elevación de estado)](#state-hoisting) · [`@Preview`](#preview)

#### `stateIn` {#statein}

Operador que convierte un `Flow` frío en un `StateFlow`. Es la forma habitual de exponer en un ViewModel lo que llega del repositorio.

**Dónde:** [3C.2 · ViewModel con dependencias](03/c-arquitectura/3c.2-clean-architecture.md#81-el-catalogo) · [Kotlin · De Flow frío a StateFlow](00-android/00-kotlin/52-flows.md#71-de-flow-frio-a-stateflow-el-operador-statein)<br>
**Ver también:** [`StateFlow`](#stateflow) · [`ViewModel`](#viewmodel)

#### `suspend` {#suspend}

Marca una función que puede pausarse sin bloquear el hilo y reanudarse después. Solo se puede llamar desde una corrutina o desde otra función `suspend`.

**Dónde:** [Kotlin · La solución: `suspend`](00-android/00-kotlin/51-corrutinas.md#35-la-solucion-suspend) · [Kotlin · Qué ocurre por debajo](00-android/00-kotlin/51-corrutinas.md#36-que-ocurre-por-debajo)<br>
**Practica:** [Codelab de Kotlin · `suspend` y `async`](00-android/00-kotlin/codelabs/05-suspend-async.md#2-la-idea-en-un-minuto)<br>
**Ver también:** [Corrutina](#corrutina) · [Callback](#callback)

#### `Switch`, `Checkbox` y `Slider` {#controles-de-seleccion}

Controles de selección: un interruptor, una casilla de verificación y un deslizador. También se controlan con estado elevado.

**Dónde:** [3A.2 · Controles de selección](03/a-diseno/3a.2-componentes-interactivos.md#3-controles-de-seleccion-switch-checkbox-y-slider)<br>
**Practica:** [Codelab 3.04 · Slider y Switch](03/codelabs/04-propinas-formulario.md#el-slider-y-el-switch)<br>
**Ver también:** [State hoisting (elevación de estado)](#state-hoisting)

#### Sync y build {#sync}

Sincronizar (*sync*) hace que el IDE lea la configuración de Gradle y descargue dependencias. Construir (*build*) compila de verdad el proyecto.

**Dónde:** [Herramientas · Sync vs. Build](00-android/00-tools/01-gradle-agp-estructura.md#51-sync-vs-build-sincronizar-vs-construir)<br>
**Ver también:** [Gradle](#gradle)

## T {#letra-t}

#### TDD (desarrollo guiado por pruebas) {#tdd}

Primero se escribe un test que falla, luego el código mínimo para que pase, y después se mejora: rojo, verde, refactorizar.

**Dónde:** [Testing · El ciclo TDD](00-android/00-kotlin/testing/02-test-ahorcado-tdd.md#1-la-filosofia-tdd-el-ciclo-rojo-verde-refactorizar)<br>
**Ver también:** [Arrange, Act, Assert (AAA)](#aaa)

#### Tema (`MaterialTheme`) {#tema}

Colores, tipografía y formas comunes a toda la app, disponibles desde cualquier composable. Se define en `Theme.kt`.

**Dónde:** [3A.1 · Anatomía de un tema](03/a-diseno/3a.1-material-design-3-scaffold.md#11-la-anatomia-de-un-tema-en-compose)<br>
**Practica:** [Codelab 3.01 · Las piezas del tema](03/codelabs/01-tema-material3.md#2-las-piezas-del-tema)<br>
**Ver también:** [`ColorScheme` y roles de color](#colorscheme) · [`CompositionLocal`](#compositionlocal) · [Material 3](#material-3)

#### Test local y test instrumentado {#test-instrumentado}

Un test local (`src/test`) corre en el ordenador, en la JVM. Uno instrumentado (`src/androidTest`) necesita un emulador o un móvil.

**Dónde:** [3C.4 · Tests locales e instrumentados](03/c-arquitectura/3c.4-testing.md#12-tests-locales-y-tests-instrumentados) · [3C.4 · Ejecutar los tests](03/c-arquitectura/3c.4-testing.md#6-ejecutar-los-tests)<br>
**Ver también:** [Pirámide de tests](#piramide-de-tests) · [Árbol semántico](#arbol-semantico)

#### Tipos de compilación (*build types*) {#tipos-de-compilacion}

Variantes de una misma app. `debug` se usa al desarrollar y `release` es la versión que se publica.

**Dónde:** [3E.1 · Debug y release](03/e-publicacion/3e.1-preparar-lanzamiento.md#2-tipos-de-compilacion-debug-y-release) · [Herramientas · Build variants](00-android/00-tools/01-gradle-agp-estructura.md#53-build-variants-debug-vs-release)<br>
**Ver también:** [R8](#r8) · [Firma de la app](#firma)

#### Tipos sellados (`sealed`) {#tipos-sellados}

Jerarquía cerrada de subtipos que el compilador conoce por completo, de modo que un `when` no necesita `else`. Es la forma habitual de modelar los estados de una pantalla.

**Dónde:** [Kotlin · Tipos sellados](00-android/00-kotlin/26-sealed-classes.md#2-la-solucion-de-kotlin-tipos-sellados-polimorfismo-restringido) · [Kotlin · `when` exhaustivo](00-android/00-kotlin/26-sealed-classes.md#3-la-combinacion-perfecta-polimorfismo-when-smart-casting) · [Kotlin · `enum` o `sealed`](00-android/00-kotlin/26-sealed-classes.md#4-cuadro-comparativo-enum-class-vs-sealed-interface)<br>
**Practica:** [Codelab de Kotlin · Tipos sellados](00-android/00-kotlin/codelabs/01-tipos-sellados.md#1-la-idea-en-un-minuto)<br>
**Ver también:** [`when`](#when) · [`UiState`](#uistate) · [`enum class`](#enum-class)

#### `TopAppBar` {#topappbar}

Barra superior de la pantalla, con el título y las acciones principales.

**Dónde:** [3A.1 · Barras de aplicación](03/a-diseno/3a.1-material-design-3-scaffold.md#4-barras-de-aplicacion-superiores-topappbar)<br>
**Ver también:** [`Scaffold`](#scaffold)

#### Trailing lambda {#trailing-lambda}

Si el último parámetro de una función es otra función, la lambda se escribe fuera de los paréntesis. Por eso `Column { … }` se lee como una estructura.

**Dónde:** [Kotlin · Trailing lambda](00-android/00-kotlin/13-funciones-lambdas.md#32-como-invocarla-de-la-llamada-convencional-a-la-trailing-lambda) · [Kotlin · En Compose](00-android/00-kotlin/13-funciones-lambdas.md#41-regla-1-jerarquias-visuales-con-trailing-lambdas-en-compose)<br>
**Ver también:** [Lambda](#lambda) · [Slot API (patrón de ranuras)](#slot-api)

#### Turbine {#turbine}

Librería para los tests de `Flow`, que lee sus valores emitidos uno a uno.

**Dónde:** [3C.4 · Comprobar varias emisiones](03/c-arquitectura/3c.4-testing.md#34-comprobar-varias-emisiones-con-turbine)<br>
**Ver también:** [`Flow`](#flow) · [`runTest`](#runtest)

## U {#letra-u}

#### UDF (flujo de datos unidireccional) {#udf}

*Unidirectional Data Flow*: el estado baja del ViewModel a la interfaz, y los eventos suben de la interfaz al ViewModel.

**Dónde:** [3C.1 · `StateFlow` y UDF](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#3-reactividad-con-stateflow-y-el-patron-udf) · [Compose · Arquitectura UDF](00-android/00-compose/22-state-management.md#arquitectura-udf-unidirectional-data-flow) · [Guía de Google · UDF](00-android/02-arquitectura/01-guia-arquitectura-google.md#14-flujo-de-datos-unidireccional-unidirectional-data-flow-udf)<br>
**Practica:** [Codelab 3.06 · El flujo unidireccional](03/codelabs/06-quiz-viewmodel.md#2-el-flujo-unidireccional)<br>
**Ver también:** [State hoisting (elevación de estado)](#state-hoisting) · [`ViewModel`](#viewmodel) · [SSOT (fuente única de verdad)](#ssot)

#### `UiState` {#uistate}

Objeto inmutable que describe todo lo que muestra una pantalla en un momento dado. Suele ser una `data class` o una `sealed interface`.

**Dónde:** [3C.1 · Modelado inmutable](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#2-modelado-inmutable-del-estado-uistate) · [Compose · Dos patrones](00-android/00-compose/22-state-management.md#modelado-profesional-del-estado-uistate) · [Kotlin · Patrón universal](00-android/00-kotlin/26-sealed-classes.md#5-el-patron-universal-de-arquitectura-en-android-uistate)<br>
**Practica:** [Codelab 3.06 · El estado de la pantalla](03/codelabs/06-quiz-viewmodel.md#4-paso-2-el-estado-de-la-pantalla)<br>
**Ver también:** [`ViewModel`](#viewmodel) · [`StateFlow`](#stateflow) · [Tipos sellados (`sealed`)](#tipos-sellados) · [`data class`](#data-class)

#### Unidirectional Data Flow {#unidirectional-data-flow}

Ver [UDF (flujo de datos unidireccional)](#udf).

#### Use case {#use-case}

Ver [Caso de uso (*use case*)](#caso-de-uso).

## V {#letra-v}

#### `val` y `var` {#val-var}

`val` declara una referencia que no se puede reasignar, y `var`, una que sí. Por defecto se prefiere `val`.

**Dónde:** [Kotlin · `val` y `var`](00-android/00-kotlin/11-variables-tipos-datos.md#1-declaracion-de-variables-val-vs-var)<br>
**Ver también:** [Inmutabilidad](#inmutabilidad) · [Inferencia de tipos](#inferencia-de-tipos)

#### Varianza (`in`, `out`) {#varianza}

Indica si un tipo genérico solo produce valores (`out`) o solo los consume (`in`), y con ello qué conversiones entre tipos genéricos están permitidas.

**Dónde:** [Kotlin · Varianza](00-android/00-kotlin/25-genericos.md#4-varianza-en-kotlin-covarianza-out-y-contravarianza-in)<br>
**Ver también:** [Genéricos](#genericos)

#### Version catalog {#version-catalog}

Ver [Catálogo de versiones (*version catalog*)](#catalogo-de-versiones).

#### `versionCode` y `versionName` {#versioncode}

`versionCode` es un entero que debe crecer en cada subida a Google Play, y `versionName` es el texto de versión que ve el usuario.

**Dónde:** [3E.1 · `versionCode` y `versionName`](03/e-publicacion/3e.1-preparar-lanzamiento.md#versioncode-y-versionname)<br>
**Ver también:** [`applicationId`](#applicationid)

#### `ViewModel` {#viewmodel}

Clase que guarda el estado de una pantalla y su lógica. Sobrevive a los cambios de configuración y no conoce ni Compose ni el `Context`.

**Dónde:** [3C.1 · El rol del ViewModel](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#1-el-rol-del-viewmodel-en-la-arquitectura-moderna) · [3C.1 · Implementación](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#31-implementacion-del-viewmodel) · [3B.1 · Un ViewModel para cada pantalla](03/b-navegacion/3b.1-navigation3.md#8-un-viewmodel-para-cada-pantalla)<br>
**Practica:** [Codelab 3.06 · El ViewModel](03/codelabs/06-quiz-viewmodel.md#5-paso-3-el-viewmodel)<br>
**Ver también:** [`UiState`](#uistate) · [`StateFlow`](#stateflow) · [`viewModelScope`](#viewmodelscope) · [Cambio de configuración](#cambio-de-configuracion)

#### `viewModelScope` {#viewmodelscope}

Ámbito de corrutinas del ViewModel. Cancela todas sus corrutinas cuando el ViewModel se destruye.

**Dónde:** [3C.1 · Tareas con tiempo](03/c-arquitectura/3c.1-capa-ui-viewmodel.md#5-tareas-con-tiempo-en-el-viewmodel)<br>
**Ver también:** [`CoroutineScope`](#coroutinescope) · [`Job`](#job) · [`ViewModel`](#viewmodel)

## W {#letra-w}

#### WebView {#webview}

Navegador incrustado dentro de una app. Es la pieza en la que se apoyan las apps híbridas.

**Dónde:** [UT1 · Híbrida](01/index.md#32-hibrida)<br>
**Ver también:** [App híbrida](#app-hibrida)

#### `weight` y `Spacer` {#weight}

`weight` reparte el espacio sobrante de una `Column` o `Row` en proporciones, y `Spacer` deja un hueco.

**Dónde:** [UT2 · Repartir el espacio](02/2.3.1-layouts-modificadores.md#5-repartir-el-espacio-weight-y-spacer)<br>
**Ver también:** [`Column` y `Row`](#column-row) · [Layout scope](#layout-scope)

#### `when` {#when}

Selección múltiple de Kotlin, usable como expresión. Comprueba valores, rangos o tipos, y debe cubrir todos los casos cuando devuelve un valor.

**Dónde:** [Kotlin · `when` como expresión](00-android/00-kotlin/12.1-when.md#2-when-como-expresion-su-primer-superpoder) · [Kotlin · `when` y smart cast](00-android/00-kotlin/12.1-when.md#4-when-para-comprobar-tipos-con-smart-casting)<br>
**Ver también:** [Tipos sellados (`sealed`)](#tipos-sellados) · [Smart cast](#smart-cast) · [Expresión y sentencia](#expresion-y-sentencia)

#### `withContext` {#withcontext}

Cambia de dispatcher dentro de una corrutina y devuelve el resultado, por ejemplo para hacer una lectura en `Dispatchers.IO`.

**Dónde:** [Kotlin · `withContext`](00-android/00-kotlin/51-corrutinas.md#cambio-de-contexto-seguro-con-withcontext)<br>
**Ver también:** [Dispatcher](#dispatcher)
