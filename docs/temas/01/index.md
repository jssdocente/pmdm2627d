# **UT1. ¿Web, híbrida, multiplataforma o nativa?**

Tienes una idea para una app. Antes de escribir una línea de código hay que tomar una decisión que condiciona todo lo demás: **¿con qué tecnología se construye?** De ella dependen lo que la app podrá hacer, cuánto costará y cuántas personas harán falta para mantenerla.

Este tema te enseña a tomar esa decisión y a defenderla con argumentos. Después explica por qué en este módulo desarrollamos apps nativas para Android, y qué ocurre desde que escribes el código hasta que la app funciona en un móvil.

!!! abstract "Al terminar este tema sabrás"

    - Distinguir las cuatro formas de construir una app y qué hay entre tu código y el sistema en cada una.

    - Elegir la opción adecuada para un caso concreto y justificarla.

    - Explicar cuándo una app nativa compensa su coste y cuándo no.

    - Situar los videojuegos y los formatos Android (reloj, TV y coche) dentro de esa decisión.

    - Reconocer las piezas de una app Android: compilación, ART, APK/AAB y niveles de API.

---

## 1. La respuesta corta

**No hay una opción ganadora**: hay una opción adecuada para cada app. Como primera orientación:

- **Web**, cuando lo importante es llegar a cualquiera con un enlace, sin instalar nada.

- **Híbrida**, cuando ya tienes una web y quieres estar en las tiendas con una app sencilla.

- **Multiplataforma**, cuando necesitas Android e iOS con un solo equipo y una buena experiencia.

- **Nativa**, cuando el valor de la app depende del dispositivo: trabajo en segundo plano, sensores, integración con el sistema, rendimiento máximo o formatos como el reloj y el coche.

El resto del tema justifica estas cuatro frases.

---

## 2. Qué hace distinto a un móvil

En un ordenador de sobremesa puedes ignorar casi siempre los recursos: hay enchufe, ventilador y mucha memoria. Un móvil funciona con batería, sin ventilador y con una red que va y viene. Y, sobre todo, **quien manda es el sistema operativo, no tu app**. Estas restricciones son la razón por la que la elección de tecnología importa:

<figure class="arq-fig">
--8<-- "docs/temas/01/images/restricciones-decision.svg"
<figcaption>Cada restricción del móvil se convierte en una pregunta al elegir tecnología.</figcaption>
</figure>

Los conceptos que conviene recordar:

- **Segundo plano regulado.** Con la pantalla apagada, Android entra en *Doze* y limita la red y las tareas. El trabajo que debe terminar sí o sí se delega en herramientas del sistema como **WorkManager**.

- **Cierre de procesos.** Si falta memoria, el *Low Memory Killer* cierra procesos sin previo aviso. Tu app debe poder recuperar su estado al volver.

- **Calentamiento.** Sin ventilador, si la CPU trabaja mucho tiempo seguido, el sistema reduce su frecuencia (*thermal throttling*) y todo va más lento.

- **Sin conexión.** Lo habitual es guardar los datos en una base de datos local y sincronizar cuando vuelve la red (*offline-first*).

- **Fragmentación.** Conviven tamaños de pantalla, fabricantes con capas propias y versiones de Android distintas.

---

## 3. Las cuatro formas de hacer una app

La diferencia real entre las opciones es **qué hay entre tu código y el sistema operativo**. Cuantas más capas, más código reutilizas y menos control tienes:

<figure class="arq-fig">
--8<-- "docs/temas/01/images/capas-opciones.svg"
<figcaption>Las cuatro opciones acaban en el mismo sistema. Cambia lo que hay por el camino, cómo llega la app al usuario y cuánto código hay que mantener.</figcaption>
</figure>

### 3.1. Web y PWA

Una web se abre en el navegador con un enlace, se actualiza al instante y funciona en cualquier dispositivo. Una **PWA** (*Progressive Web App*) es una web que además usa APIs modernas para [ser instalable, funcionar sin conexión y enviar notificaciones](https://web.dev/articles/what-are-pwas).

Su límite es que **solo puede hacer lo que le permita el navegador**, y eso cambia según la plataforma. En iOS, todos los navegadores usan el motor de Apple (WebKit), [no hay diálogo de instalación](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) y las [notificaciones web solo llegan si el usuario ha añadido la web a la pantalla de inicio](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/).

### 3.2. Híbrida

Una app híbrida es **una web empaquetada dentro de una app**: un contenedor nativo muestra tu HTML, CSS y JavaScript en un *WebView*, un navegador incrustado. Los *plugins* dan acceso a funciones del dispositivo como la cámara. **Ionic** y **Capacitor** son los ejemplos habituales.

Se publica en las tiendas y reutiliza lo que ya tienes en web, pero la interfaz sigue siendo una página web: en animaciones complejas o listas muy largas se nota.

### 3.3. Multiplataforma

Un solo código se ejecuta en Android e iOS, pero **sin ser una página web**. Cada framework lo resuelve de una forma:

| Framework | Lenguaje | Cómo dibuja la interfaz | Encaja si… |
| :--- | :--- | :--- | :--- |
| **Flutter** (Google) | Dart | Con su [motor gráfico propio, Impeller](https://docs.flutter.dev/perf/impeller): dibuja cada píxel y se ve igual en todas partes | Quieres un diseño propio idéntico en todas las plataformas |
| **React Native** (Meta) | JavaScript o TypeScript | Con componentes nativos reales, gracias a su [Nueva Arquitectura](https://reactnative.dev/architecture/landing-page) | Tu equipo ya domina React |
| **KMP** (JetBrains) | Kotlin | Comparte la lógica y deja la interfaz nativa en cada plataforma | Quieres compartir lógica sin renunciar a la interfaz nativa |
| **KMP + Compose Multiplatform** | Kotlin | Con Compose: nativo en Android; en iOS, con su propio motor gráfico | Ya sabes Compose y quieres compartir también la interfaz |

!!! warning "«Híbrida» y «multiplataforma» no son lo mismo"

    Verás que mucha gente llama «híbrida» a cualquier app que no sea nativa. En este módulo usamos los términos con precisión: **híbrida** es solo la que se apoya en un WebView. Flutter, React Native y KMP son **multiplataforma**, porque no ejecutan una página web.

### 3.4. Nativa

Se programa directamente contra el SDK de cada plataforma, con sus lenguajes y herramientas oficiales:

- **Android:** Kotlin y Jetpack Compose.

- **iOS:** Swift y SwiftUI, con Xcode (solo en macOS).

Sin capas intermedias tienes acceso completo al sistema, desde el primer día en que aparece una función nueva, y la app sigue las convenciones visuales de la plataforma. El precio es claro: **si quieres estar en Android y en iOS, escribes y mantienes dos apps**.

---

## 4. Qué puede hacer cada una

Esta tabla es la que consultarás al decidir. Observa las filas de segundo plano y de hardware: ahí está la razón principal para elegir nativa.

| Criterio | Web / PWA | Híbrida | Multiplataforma | Nativa |
| :--- | :--- | :--- | :--- | :--- |
| **Instalación** | Ninguna; opcional en la pantalla de inicio | Tienda de apps | Tienda de apps | Tienda de apps |
| **Actualización** | Inmediata | Tienda (la parte web puede cambiar antes) | Tienda | Tienda |
| **Notificaciones** | Android: sí. iOS: solo instalada en la pantalla de inicio | Sí, con plugin | Sí | Sí |
| **Trabajo en segundo plano** | Muy limitado | Limitado, con plugins | Sí, con código específico | **Completo** |
| **Bluetooth, NFC, USB** | Android: parcial, según navegador. iOS: no | Con plugins | Con módulos nativos | **Completo** |
| **Sin conexión** | Sí, con límites de almacenamiento | Sí | Sí | Sí |
| **Funciones nuevas del sistema** | Cuando las adopte el navegador | Cuando exista un plugin | Cuando las adopte el framework, o con código propio | **Desde el primer día** |
| **Reloj, TV y coche** | No | No | Depende del framework | **Con guías y bibliotecas oficiales** |
| **Animaciones y listas largas** | Las más limitadas | Limitadas | Buenas | **Las mejores** |
| **Bases de código** | Una | Una | Una, con partes específicas | **Una por plataforma** |
| **Equipo** | Web | Web | Uno, con apoyo nativo puntual | Uno por plataforma |

Visto en conjunto, hay un compromiso de fondo: **ganar alcance con un solo código suele costar acceso al dispositivo**.

<figure class="arq-fig">
--8<-- "docs/temas/01/images/mapa-compromisos.svg"
<figcaption>Mapa orientativo: sirve para razonar el compromiso, no mide nada. Un framework concreto puede quedar por encima o por debajo.</figcaption>
</figure>

!!! tip "Cuándo la nativa no compensa"

    Si tu app es un catálogo, un formulario o la carta de un restaurante, pagar dos desarrollos no aporta nada al usuario. Elegir nativa «porque es mejor» es un error tan frecuente como elegir web para una app que debe registrar una ruta con la pantalla apagada.

---

## 5. Cómo decidir

### 5.1. Las preguntas, en orden

Empieza por lo que descarta más opciones. La primera respuesta afirmativa te da un buen punto de partida:

<figure class="arq-fig">
--8<-- "docs/temas/01/images/arbol-decision.svg"
<figcaption>Un punto de partida, no una ley: presupuesto, plazos y lo que ya sabe el equipo pueden cambiar la decisión final.</figcaption>
</figure>

### 5.2. Cuatro casos resueltos

| Caso | Lo que importa | Decisión | Por qué no las demás |
| :--- | :--- | :--- | :--- |
| **Carta de un restaurante** con un código QR | Abrirla en segundos, sin instalar nada | **Web** | Nadie instala una app para leer una carta |
| **Partes de trabajo** de una empresa que ya tiene su web interna | Reutilizar lo que hay; formularios y una foto | **Híbrida** | Una web sencilla no aparece en las tiendas ni usa la cámara con tanta comodidad; rehacerla sería caro |
| **Startup** con una app de reservas para Android e iOS y tres programadores | Dos plataformas, buena experiencia, poco equipo | **Multiplataforma** | Dos desarrollos nativos no caben en el equipo; el WebView se quedaría corto si la interfaz crece |
| **App de deporte** que registra el GPS con la pantalla apagada y tiene versión de reloj | Segundo plano fiable, sensores y otro formato | **Nativa**, con KMP si llega iOS | La web y la híbrida no pueden garantizarlo, y el reloj pide bibliotecas específicas |

Fíjate en el último caso: decidir nativa no impide compartir código más adelante.

### 5.3. ¿Y si es un videojuego?

Los videojuegos son un caso aparte. Una interfaz normal se redibuja cuando algo cambia; un juego de acción **dibuja continuamente muchas veces por segundo**, con física, colisiones y sonido. Por eso, lo habitual no es programar sobre las herramientas de interfaz, sino usar un **motor de videojuegos**. La propia Google señala que [un motor permite concentrarse en el juego](https://developer.android.com/games/engines/engines-overview) en lugar de construir toda la tecnología desde cero.

| Opción | Lenguaje | Se usa para… |
| :--- | :--- | :--- |
| [**Unity**](https://unity.com/products/unity-engine) | C# | Juegos móviles 2D y 3D para varias plataformas: es una elección muy común en móvil |
| [**Unreal Engine**](https://dev.epicgames.com/documentation/en-us/unreal-engine/android-support-for-unreal-engine) | C++ y Blueprints (visual) | 3D de alta calidad gráfica, en dispositivos potentes |
| [**Godot**](https://godotengine.org/) | GDScript, C# y C++ | 2D y 3D con un motor libre y gratuito (licencia MIT) |
| **Defold** y **Cocos** | Según el motor | Otros motores [que Google recoge en su guía](https://developer.android.com/games/engines/engines-overview), frecuentes en 2D y móvil |
| [**AGDK**](https://developer.android.com/games/agdk/overview) con C/C++ y Vulkan | C o C++ | Crear o adaptar tu propio motor, cuando necesitas el máximo control. Es la opción nativa de Android, y la más costosa |
| [**libGDX**](https://libgdx.com/) y [**KorGE**](https://korge.org/) | Java / Kotlin | Programar el juego como código, sin el editor de un motor grande |
| [**Flame**](https://docs.flutter.dev/resources/games-toolkit) (con Flutter) | Dart | Juegos 2D casuales, sobre todo si ya usas Flutter |
| **Phaser** y similares | JavaScript | Juegos 2D en el navegador, sin instalación |
| **Compose** | Kotlin | Juegos sencillos por turnos, como un tablero o un puzle: no hay bucle de juego exigente |

!!! note "Para decidir entre motores"

    Antes de elegir, comprueba tres cosas: si el juego es 2D o 3D, en qué plataformas debe publicarse y qué condiciones tiene la licencia. Estas cambian con el tiempo, así que léelas en la web oficial de cada motor.

---

## 6. Por qué en este módulo: nativa para Android

Android es la mejor plataforma para empezar, y no porque la nativa sea siempre la mejor opción:

- **Es la plataforma mayoritaria.** Unos 7 de cada 10 móviles usan Android, tanto [en España](https://gs.statcounter.com/os-market-share/mobile/spain) como [en el mundo](https://gs.statcounter.com/os-market-share/mobile/worldwide) (StatCounter, octubre de 2026).

- **Lo que aprendes se transfiere.** Ciclo de vida, estado, permisos o arquitectura existen aunque un framework los oculte. Si los entiendes aquí, sabrás qué ocurre por debajo en cualquier otra opción.

- **La interfaz declarativa es común.** Compose, SwiftUI, Flutter y React comparten la idea de que la interfaz es una función del estado.

- **No te cierra puertas.** Con Kotlin ya tienes el lenguaje de KMP.

- **No exige un equipo concreto.** Para desarrollar para iOS necesitas un Mac; para Android, no.

### 6.1. Por qué Kotlin y no Java

Android nació en 2008 con Java, el lenguaje que ya conocían millones de programadores. Vienes de Java, así que es normal preguntarse por qué lo cambiamos. La respuesta tiene dos partes:

<figure class="arq-fig">
--8<-- "docs/temas/01/images/java-kotlin.svg"
<figcaption>Dos historias que transcurren en paralelo. Kotlin no nace por la demanda de Oracle, pero el litigio dio a Google un motivo más para no depender de Java.</figcaption>
</figure>

- **Legal.** En 2010, Oracle compró Sun y demandó a Google por usar las APIs de Java. El Tribunal Supremo de EE. UU. falló en 2021 a favor de Google, pero fueron once años de incertidumbre.

- **Técnica.** Android arrastró durante años versiones antiguas de Java mientras Kotlin ofrecía un lenguaje más seguro y conciso, y 100 % interoperable con Java.

Java sigue funcionando en Android y puede convivir con Kotlin en un mismo proyecto. Pero las bibliotecas nuevas se diseñan primero para Kotlin, y **Compose exige Kotlin**.

| Aspecto | Java | Kotlin | Para saber más |
| :--- | :--- | :--- | :--- |
| **Nulos** | `NullPointerException` en ejecución | El compilador distingue `String` de `String?` | [Null Safety](../00-android/00-kotlin/14-null-safety.md) |
| **Clases de datos** | Constructor, getters, `equals`, `hashCode`… | `data class`, en una línea | [Data classes](../00-android/00-kotlin/23-data-classes.md) |
| **Extender clases** | Herencia o clases `Utils` | Funciones de extensión | [Funciones y lambdas](../00-android/00-kotlin/13-funciones-lambdas.md) |
| **Asincronía** | Hilos y *callbacks* | Corrutinas | [Corrutinas](../00-android/00-kotlin/51-corrutinas.md) |
| **Interfaz** | No compatible con Compose | Compose | [Jetpack Compose](../00-android/00-compose/index.md) |

### 6.2. Compartir código: KMP y Compose Multiplatform {#kmp}

**Kotlin Multiplatform (KMP)** permite escribir parte del código en Kotlin una sola vez y compilarlo para cada plataforma: a bytecode en Android y a binario nativo en iOS. Google lo [soporta oficialmente para compartir lógica de negocio entre Android e iOS](https://developer.android.com/kotlin/multiplatform). **Compose Multiplatform** da un paso más: comparte también la interfaz.

<figure class="arq-fig">
--8<-- "docs/temas/01/images/que-se-comparte.svg"
<figcaption>KMP decide cuánto se comparte: desde solo la lógica hasta casi toda la app.</figcaption>
</figure>

No es gratis: el equipo sigue necesitando conocer cada plataforma, y Compose Multiplatform en iOS dibuja con su propio motor, no con componentes de Apple. Lo practicarás en [UT3: Kotlin Multiplatform](../03/d-kmp/3d.1-anatomia-proyecto-kmp.md), y tienes un resumen de las bibliotecas en [Ecosistema multiplataforma](../00-android/02-arquitectura/04-ecosistema-kmp-multiplataforma.md).

### 6.3. Reloj, TV y coche: ¿hace falta KMP? {#formatos-android}

Es una confusión muy habitual. **Wear OS, Android TV, Android Auto y Android Automotive son Android**, así que no necesitas KMP para llegar a ellos: escribes Kotlin nativo. Lo que cambia es la interfaz, porque un reloj, un televisor y un coche no se usan como un móvil.

<figure class="arq-fig">
--8<-- "docs/temas/01/images/formatos-android.svg"
<figcaption>La lógica se reutiliza; cada formato tiene su propia interfaz. KMP solo entra en juego cuando sales de Android.</figcaption>
</figure>

| Formato | Interfaz | Lo que lo hace distinto |
| :--- | :--- | :--- |
| **Teléfono y tablet** | Compose con Material 3 | Es el caso base de este módulo |
| [**Wear OS**](https://developer.android.com/training/wearables/compose) | Compose, con bibliotecas `androidx.wear.compose` | Pantalla mínima y sesiones de segundos. No reutilices sin más los componentes de móvil |
| [**Android TV**](https://developer.android.com/training/tv/playback/compose) | Compose, con `androidx.tv:tv-material` | Se maneja con mando a distancia a varios metros: no hay pantalla táctil |
| [**Android Auto**](https://developer.android.com/training/cars) | Car App Library (plantillas) | La app corre en el móvil y se muestra en la pantalla del coche. No diseñas libremente: las plantillas limitan las distracciones |
| [**Android Automotive OS**](https://developer.android.com/training/cars) | Car App Library al conducir; Views o Compose en algunas apps con el coche parado (vídeo, juegos) | Android funciona en el propio coche, sin móvil |

¿Dónde encaja entonces cada herramienta?

- **Solo formatos Android:** un módulo Android normal con la lógica (por ejemplo, `:core`) y un módulo por interfaz. **KMP no aporta nada**, porque no sales de la plataforma.

- **También iOS:** ese módulo pasa a ser KMP y la lógica se reutiliza en todos los destinos.

- **Apple Watch y Apple TV:** KMP tiene [destinos para watchOS y tvOS](https://kotlinlang.org/docs/native-target-support.html), [en Beta](https://kotlinlang.org/docs/multiplatform/supported-platforms.html), para compartir la lógica. La interfaz se hace en SwiftUI.

!!! warning "Compose Multiplatform no cubre reloj, TV ni coche"

    Sus plataformas son [Android, iOS, escritorio y web](https://kotlinlang.org/docs/multiplatform/compose-compatibility-and-versioning.html). Las bibliotecas de Wear OS y TV son de Jetpack, solo para Android, y la Car App Library usa plantillas propias. Que se llamen «Compose» no significa que sean multiplataforma.

---

## 7. Del código al móvil

Ya has elegido nativa. Veamos las piezas que usarás en cada proyecto.

### 7.1. Compilación y ejecución

Una app Android no se ejecuta en la JVM de escritorio ni se empaqueta en un `.jar`:

<figure class="arq-fig">
--8<-- "docs/temas/01/images/de-kt-a-dispositivo.svg"
<figcaption>El código y los recursos siguen caminos separados hasta empaquetarse. El dispositivo ejecuta el resultado con ART, no con la JVM.</figcaption>
</figure>

**ART** (*Android Runtime*) sustituyó a la antigua máquina virtual Dalvik. Observa qué partes de la app se usan más y las compila a código máquina. Con los [Baseline Profiles](https://developer.android.com/topic/performance/baselineprofiles/overview), que mejoran la velocidad de ejecución en torno a un 30 % desde el primer arranque, la app puede indicarlo de antemano.

### 7.2. APK y AAB

| | APK | AAB (*Android App Bundle*) |
| :--- | :--- | :--- |
| **Qué es** | El paquete que se instala | Un paquete de publicación; no se instala directamente |
| **Para qué** | Pruebas, emulador y tiendas alternativas | [Obligatorio para apps nuevas en Google Play](https://developer.android.com/guide/app-bundle) |
| **Qué recibe el usuario** | Todo lo que incluya el paquete | Solo lo que necesita su dispositivo: Google Play genera los APK a medida |

El sistema verifica la firma del paquete y da a cada app un directorio privado (*sandbox*). Una actualización debe ir firmada con la misma clave que la versión anterior. Los permisos sensibles, como la cámara o la ubicación, se piden mientras se usa la app, y el usuario puede rechazarlos. Lo verás con detalle en [Publicación](../03/e-publicacion/3e.1-preparar-lanzamiento.md).

### 7.3. `minSdk`, `targetSdk` y `compileSdk`

Cada versión de Android tiene un **nivel de API**, un número entero. Con él configuras tres valores en `build.gradle.kts`:

```kotlin
android {
    compileSdk = 37

    defaultConfig {
        minSdk = 26
        targetSdk = 36
    }
}
```

<figure class="arq-fig">
--8<-- "docs/temas/01/images/regla-sdk.svg"
<figcaption>Los valores de los proyectos de este módulo. Cada uno responde a una pregunta distinta.</figcaption>
</figure>

- Con `minSdk = 26` llegas a más del 99 % de los dispositivos, [según apilevels.com](https://apilevels.com/).

- Google Play [exige `targetSdk` 36 o superior](https://developer.android.com/google/play/requirements/target-sdk) para publicar apps nuevas y actualizaciones de móvil. El requisito sube cada año.

!!! warning "Error frecuente"

    Subir `compileSdk` no cambia el comportamiento de tu app, solo las APIs que puedes usar. Subir `targetSdk` **sí** lo cambia: aceptas las reglas de esa versión. Pruébala antes de subirlo.

### 7.4. Versiones de Android y niveles de API {#versiones-api}

Lo que configuras es el nivel de API. El nombre interno no se usa al programar, pero lo verás en documentación y en el código de Android.

| Versión | Nombre interno | API | Año | Qué recordar |
| :---: | :---: | :---: | :---: | :--- |
| **Android 8** | Oreo | 26 / 27 | 2017 | `minSdk` de este módulo. Canales de notificación |
| **Android 9** | Pie | 28 | 2018 | Navegación por gestos |
| **Android 10** | Quince Tart | 29 | 2019 | Almacenamiento aislado (*Scoped Storage*) y modo oscuro |
| **Android 11** | Red Velvet Cake | 30 | 2020 | Permisos de un solo uso |
| **Android 12** | Snow Cone | 31 / 32 | 2021 | Material You y colores dinámicos |
| **Android 13** | Tiramisu | 33 | 2022 | Permiso para notificaciones y selector de fotos |
| **Android 14** | Upside Down Cake | 34 | 2023 | Acceso parcial a fotos y vídeos |
| **Android 15** | Vanilla Ice Cream | 35 | 2024 | Interfaz de borde a borde obligatoria |
| **Android 16** | Baklava | 36 | 2025 | `targetSdk` de este módulo. Empieza el nuevo calendario de lanzamientos |
| **Android 17** | Cinnamon Bun | 37 | 2026 | `compileSdk` de este módulo. Más exigencia de adaptarse a pantallas grandes |

Desde Android 16, la versión principal se publica en el segundo trimestre del año, con una actualización menor del SDK en el cuarto.

---

## 8. El entorno de desarrollo

| IDE | Para qué | En este módulo |
| :--- | :--- | :--- |
| **IntelliJ IDEA** (JetBrains) | Android, KMP y backend en una sola herramienta. Desde la versión 2025.3 tiene [una única distribución](https://blog.jetbrains.com/idea/2025/12/intellij-idea-unified-release/) | **Es el que usamos** |
| **Android Studio** (Google) | Solo Android, con herramientas especializadas. Está construido sobre la plataforma IntelliJ, así que los dos se manejan casi igual | Alternativa válida |
| **Xcode** (Apple) | Compilar para iOS. Solo en macOS | Solo si pruebas KMP en iOS |

El desarrollo móvil pide bastante al ordenador, porque el emulador es una máquina virtual completa. Se recomiendan **16 GB de RAM** y la **virtualización activada en la BIOS/UEFI** (Intel VT-x o AMD-V). Con menos memoria, prueba en un móvil real conectado por USB.

!!! tip "Prepara tu equipo"

    - [Configuración de IntelliJ IDEA](../00-android/00-ide-intellij/index.md): JDK, SDK de Android, emuladores y licencias.

    - [Gradle y estructura del proyecto](../00-android/00-tools/01-gradle-agp-estructura.md) y [`build.gradle.kts`](../00-android/00-tools/02-build-gradle.md).

    - [Matriz de compatibilidad](../00-android/00-tools/04-matriz-compatibilidad.md): qué versiones de JDK, Gradle, AGP y Kotlin funcionan juntas.

    - [Terminal y herramientas de línea de comandos](../00-android/00-tools/05-terminal-warp.md).

??? info "Comandos de ADB que usarás a menudo"

    **ADB** (*Android Debug Bridge*) conecta tu ordenador con un móvil o un emulador:

    ```bash
    # Ver los dispositivos conectados
    adb devices

    # Instalar un APK (-r reinstala conservando los datos)
    adb install -r app-debug.apk

    # Desinstalar una app por su identificador
    adb uninstall com.pmdm.lab.ut2

    # Ver los registros filtrados por etiqueta
    adb logcat -s "MiEtiqueta"

    # Reiniciar ADB si deja de detectar el dispositivo
    adb kill-server
    adb start-server
    ```

---

## 9. Resumen

- La pregunta no es qué tecnología es mejor, sino **qué necesita esta app**.

- **Web:** alcance inmediato, limitada por el navegador. **Híbrida:** una web dentro de una app. **Multiplataforma:** un código sin WebView, con su propia capa. **Nativa:** todo el sistema, con una base de código por plataforma.

- **La nativa compensa** cuando el valor depende del dispositivo, y no compensa en una app de contenido o de formularios.

- Los **videojuegos** son un caso aparte: lo normal es usar un motor.

- **Wear OS, TV y coche son Android:** llegas con nativo. KMP sirve para salir de Android.

- `minSdk` es el suelo, `targetSdk` la promesa y `compileSdk` el techo.

---

## 10. Ejercicios: decide y defiende

Para cada caso, indica la opción elegida, **las dos razones de más peso** y **qué pierdes** con ella. No hay una única respuesta correcta: se evalúa el razonamiento.

### Básico

1. El ayuntamiento quiere publicar los horarios de los autobuses. Se consultan de forma puntual, sobre todo por turistas.

2. Un fabricante de bicicletas quiere una app que se conecte por Bluetooth a su sensor y registre la ruta con la pantalla apagada.

### Intermedio

3. Una tienda online con una web moderna quiere estar en Google Play y en la App Store antes de tres meses, con notificaciones de ofertas.

4. Una aplicación de música para Android quiere llegar también a relojes, televisores y coches. Propón cómo organizarías los módulos. ¿Usarías KMP?

### Avanzado

5. Un banco tiene apps nativas separadas para Android e iOS, y las reglas de cálculo de comisiones divergen entre ambas. Quiere corregirlo sin rehacer las interfaces.

6. Un estudio de dos personas quiere publicar un juego de plataformas 2D en móvil y en navegador, con presupuesto mínimo. Compara al menos dos opciones del apartado 5.3.

---

## 11. Autoevaluación

Antes de pasar al siguiente tema, comprueba si puedes hacer esto sin mirar los apuntes:

- [ ] Explico qué hay entre mi código y el sistema en cada una de las cuatro opciones.

- [ ] Sé por qué Flutter y React Native no son apps híbridas.

- [ ] Dado un caso, elijo una opción y digo qué gano y qué pierdo.

- [ ] Pongo un ejemplo en el que la nativa compensa y otro en el que no.

- [ ] Explico por qué un juego suele hacerse con un motor y nombro dos opciones.

- [ ] Sé qué cambia en un reloj, una TV y un coche, y por qué no hace falta KMP para llegar a ellos.

- [ ] Distingo qué comparten KMP y Compose Multiplatform.

- [ ] Describo el camino de un `.kt` hasta el dispositivo.

- [ ] Explico qué hacen `minSdk`, `targetSdk` y `compileSdk`.

- [ ] Tengo el entorno instalado y he arrancado un emulador o un móvil real.
