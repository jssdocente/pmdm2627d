# Anexo B. Pantalla de inicio (splash)

La **pantalla de inicio** (*splash screen*) es lo que ve el usuario desde que pulsa el icono hasta que la app pinta su primera pantalla. Desde Android 12 la dibuja **el sistema**: tu trabajo ya no es programarla, sino **configurarla** y, si hace falta, decidir cuánto dura.

Este anexo explica cómo funciona, cómo se personaliza con la biblioteca `core-splashscreen` y cómo mantenerla mientras la app comprueba algo imprescindible, como si hay una sesión iniciada.

!!! tip "Practícalo"
    El [Codelab 2.06: Icono y pantalla de inicio](../../02/codelabs/06-icono-pantalla-inicio.md) aplica los apartados 2 y 3 al laboratorio de la UT2, paso a paso.

!!! info "Requisitos previos"
    Conviene haber leído [2.2 §1](../../02/2.2-ciclo-vida-app.md#que-pasa-al-pulsar-el-icono) (qué pasa al pulsar el icono), [2.1 §3.3](../../02/2.1-primeros-pasos.md#33-el-tema-xml-de-la-ventana) (qué es un tema XML) y el [Anexo A](./a-iconos-app-recursos.md) (el icono adaptativo). El apartado 4 usa un `ViewModel` con `StateFlow`, que se estudia en [3C.1](../../03/c-arquitectura/3c.1-capa-ui-viewmodel.md).

---

## 1. Qué hace el sistema desde Android 12

Desde Android 12 (API 31), el sistema muestra una pantalla de inicio en **todas** las apps, quieras o no:

- **Cuándo.** En el arranque en frío (el proceso no existía) y en el templado (el proceso seguía vivo, pero la Activity se vuelve a crear). No aparece cuando la app solo vuelve a primer plano.
- **Qué muestra.** El color de fondo de la ventana y, en el centro, el icono de la app: por defecto, la capa delantera del icono adaptativo, recortada en círculo.
- **Quién la dibuja.** El sistema, a partir del **tema XML** de la Activity. Por eso aparece al instante, antes de que exista tu proceso y antes de cualquier línea de Compose.
- **Cuándo desaparece.** En cuanto la app pinta su primer fotograma.

En Android 11 y anteriores no existía. Durante el arranque se veía el fondo del tema, y la costumbre era crear una pantalla propia con el logotipo y un `delay`. Hoy ese enfoque es un error:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/anexos/images/splash-antes-ahora.svg"
<figcaption>Con una pantalla propia, el usuario ve dos pantallas de inicio y espera un tiempo fijo. Con la del sistema, solo una y solo el tiempo necesario.</figcaption>
</figure>

!!! warning "No hagas una pantalla de inicio en Compose"

    Una ruta `Splash` con un logotipo y `delay(2000)` se muestra **después** de la del sistema: el usuario ve dos pantallas de inicio seguidas y espera 2 segundos aunque la app esté lista mucho antes. Google lo desaconseja expresamente.

---

## 2. Configurarla con `core-splashscreen`

La biblioteca `androidx.core:core-splashscreen` ofrece la misma API en todas las versiones: en Android 12 o superior usa la pantalla del sistema y en las anteriores la imita. El código es el mismo para el `minSdk 26` del curso.

### 2.1. Paso a paso

1. **Añade la dependencia** al catálogo de versiones (`gradle/libs.versions.toml`) y al módulo `app`, como en [2.1 §4.3](../../02/2.1-primeros-pasos.md#43-como-anadir-nuevas-dependencias-durante-el-curso):

    ```toml
    [versions]
    coreSplashscreen = "1.2.0"

    [libraries]
    androidx-core-splashscreen = { group = "androidx.core", name = "core-splashscreen", version.ref = "coreSplashscreen" }
    ```

    ```kotlin
    // app/build.gradle.kts
    dependencies {
        implementation(libs.androidx.core.splashscreen)
    }
    ```

2. **Crea un tema de arranque** en `res/values/themes.xml`, junto al tema normal de la app que ya genera el asistente:

    ```xml
    <resources>
        <!-- Tema normal de la ventana (ya existía) -->
        <style name="Theme.MiApp" parent="android:Theme.Material.Light.NoActionBar" />

        <!-- Tema de la pantalla de inicio -->
        <style name="Theme.MiApp.Splash" parent="Theme.SplashScreen">
            <item name="windowSplashScreenBackground">@color/fondo_splash</item>
            <item name="windowSplashScreenAnimatedIcon">@drawable/ic_launcher_foreground</item>
            <!-- Tema al que vuelve la ventana cuando termina la pantalla de inicio -->
            <item name="postSplashScreenTheme">@style/Theme.MiApp</item>
        </style>
    </resources>
    ```

    El color `fondo_splash` se define en `res/values/colors.xml`.

3. **Asigna el tema de arranque** a la Activity que abre el lanzador, en el `AndroidManifest.xml`:

    ```xml
    <activity
        android:name=".MainActivity"
        android:exported="true"
        android:theme="@style/Theme.MiApp.Splash">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
    </activity>
    ```

4. **Instálala en `MainActivity`**, llamando a `installSplashScreen()` **antes** de `super.onCreate()`:

    ```kotlin
    class MainActivity : ComponentActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            installSplashScreen()          // 1. engancha la pantalla de inicio del tema
            super.onCreate(savedInstanceState)
            enableEdgeToEdge()
            setContent {                   // 2. a partir de aquí, Compose
                MiAppTheme {
                    App()
                }
            }
        }
    }
    ```

Con esto ya funciona: la pantalla de inicio aparece al abrir la app y desaparece sola en cuanto Compose pinta.

### 2.2. Cómo encajan los dos temas

<figure class="arq-fig">
--8<-- "docs/temas/00-android/anexos/images/splash-temas.svg"
<figcaption>La Activity arranca con el tema de la pantalla de inicio y, al terminar, <code>installSplashScreen()</code> la cambia al tema indicado en <code>postSplashScreenTheme</code>.</figcaption>
</figure>

| Atributo | Para qué sirve |
|---|---|
| `windowSplashScreenBackground` | Color de fondo de toda la pantalla. |
| `windowSplashScreenAnimatedIcon` | Icono central. Puede ser un vector o un vector animado (`AnimatedVectorDrawable`). |
| `windowSplashScreenAnimationDuration` | Duración de la animación del icono, en milisegundos. Google recomienda no pasar de 1000. |
| `windowSplashScreenIconBackgroundColor` | Círculo de color detrás del icono. En algunas versiones de Android no se llega a dibujar, así que no confíes en él para el contraste: elige un fondo que contraste con el icono. |
| `postSplashScreenTheme` | Tema que recupera la ventana al terminar. **Obligatorio.** |

!!! note "Modo oscuro"
    Para usar otro color de fondo en modo oscuro, define `fondo_splash` también en `res/values-night/colors.xml`. Es el mismo mecanismo de calificadores que los idiomas de [2.3.2](../../02/2.3.2-imagenes-iconos-recursos.md).

---

## 3. El icono: tamaño y zona visible

El sistema recorta el icono en un círculo que ocupa solo los **dos tercios centrales** del lienzo. Si el logotipo llega hasta los bordes, sale cortado:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/anexos/images/splash-icono-zonas.svg"
<figcaption>Medidas del icono de la pantalla de inicio, con y sin color de fondo para el icono.</figcaption>
</figure>

| Caso | Lienzo del icono | Zona visible (círculo) |
|---|---|---|
| Sin `windowSplashScreenIconBackgroundColor` | 288 × 288 dp | Ø 192 dp |
| Con `windowSplashScreenIconBackgroundColor` | 240 × 240 dp | Ø 160 dp |

Si el icono de la app se creó con *Image Asset Studio* respetando la zona segura ([Anexo A §2](./a-iconos-app-recursos.md#2-crear-el-icono-con-image-asset-studio)), su capa delantera `ic_launcher_foreground` ya cumple esta regla y se puede reutilizar tal cual, como en el tema del paso 2.

---

## 4. Mantenerla mientras la app se prepara

A veces la primera pantalla depende de algo que hay que comprobar al arrancar: por ejemplo, si el usuario ya tiene sesión (Inicio) o no (Login). En lugar de un `delay`, se mantiene la pantalla de inicio **justo el tiempo necesario** con `setKeepOnScreenCondition`.

1. **Un `ViewModel` expone el estado del arranque.** Empieza en `Cargando` y cambia cuando termina la comprobación:

    ```kotlin
    sealed interface Arranque {
        data object Cargando : Arranque
        data object Login : Arranque
        data object Inicio : Arranque
    }

    class ArranqueViewModel(
        private val sesion: SesionRepository
    ) : ViewModel() {

        private val _estado = MutableStateFlow<Arranque>(Arranque.Cargando)
        val estado: StateFlow<Arranque> = _estado.asStateFlow()

        init {
            viewModelScope.launch {
                _estado.value = if (sesion.haySesionActiva()) Arranque.Inicio else Arranque.Login
            }
        }
    }
    ```

2. **La Activity mantiene la pantalla de inicio mientras el estado sea `Cargando`**, y Compose abre directamente la pantalla que corresponde:

    ```kotlin
    class MainActivity : ComponentActivity() {

        private val viewModel: ArranqueViewModel by viewModel() // con Koin; o by viewModels()

        override fun onCreate(savedInstanceState: Bundle?) {
            val splash = installSplashScreen()
            super.onCreate(savedInstanceState)
            splash.setKeepOnScreenCondition { viewModel.estado.value == Arranque.Cargando }

            enableEdgeToEdge()
            setContent {
                MiAppTheme {
                    val estado by viewModel.estado.collectAsStateWithLifecycle()
                    when (estado) {
                        Arranque.Cargando -> Unit             // aún se ve la pantalla de inicio
                        Arranque.Login -> App(inicio = Ruta.Login)
                        Arranque.Inicio -> App(inicio = Ruta.Inicio)
                    }
                }
            }
        }
    }
    ```

- El sistema evalúa la condición **antes de cada fotograma**: debe ser una lectura rápida (aquí, `estado.value`), nunca una operación lenta.
- La navegación **no tiene una ruta `Splash`**: la app arranca ya en Login o en Inicio.
- Solo se espera a lo imprescindible para decidir la primera pantalla, que suele tardar milisegundos. Cargar aquí el catálogo entero o llamar a una API deja la pantalla de inicio congelada: eso se hace después, en la propia pantalla, con su indicador de carga.

### 4.1. Animación de salida (opcional)

Por defecto, la pantalla de inicio desaparece de golpe. Para que se desvanezca, se registra un *listener* sobre el mismo objeto `splash` que devuelve `installSplashScreen()`, en `onCreate` y **antes de `setContent`**. Así queda la Activity completa del apartado anterior (las líneas nuevas están marcadas):

```kotlin hl_lines="9-17"
class MainActivity : ComponentActivity() {

    private val viewModel: ArranqueViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        super.onCreate(savedInstanceState)
        splash.setKeepOnScreenCondition { viewModel.estado.value == Arranque.Cargando }
        // Se ejecuta cuando la pantalla de inicio va a quitarse:
        // primero deja de cumplirse la condición de arriba y después empieza esta animación
        splash.setOnExitAnimationListener { vista ->
            vista.view.animate()                    // vista.view es la pantalla de inicio
                .alpha(0f)                          // se desvanece…
                .setDuration(300L)                  // …en 300 ms
                .withEndAction { vista.remove() }   // imprescindible: si no, no se quita nunca
                .start()
        }

        enableEdgeToEdge()
        setContent {
            // … igual que en el apartado anterior
        }
    }
}
```

- El orden de las dos llamadas a `splash` no importa: las dos solo **registran** qué hacer; el sistema las usa más tarde.
- Si registras el *listener*, quitar la pantalla de inicio pasa a ser **responsabilidad tuya**: por eso `vista.remove()` es obligatorio al acabar la animación.
- Puedes combinar efectos de `animate()`: por ejemplo, `.translationY(-vista.view.height.toFloat())` la desliza hacia arriba en lugar de desvanecerla.

---

## 5. Errores frecuentes

| Síntoma | Causa y solución |
|---|---|
| Se ven dos pantallas de inicio seguidas. | Queda una pantalla propia (ruta `Splash`, `SplashActivity`). Elimínala y usa solo la del sistema. |
| No cambia nada: se ve el fondo y el icono de siempre. | El Manifest no asigna `Theme.MiApp.Splash` a la Activity de arranque, o falta `installSplashScreen()`. |
| Al terminar, la app sale con colores o barras distintos a los esperados. | Falta `postSplashScreenTheme` en el tema, o `installSplashScreen()` se llama después de `super.onCreate()`. |
| La pantalla de inicio no desaparece nunca. | La condición de `setKeepOnScreenCondition` no llega a ser `false` (por ejemplo, una excepción deja el estado en `Cargando`), o en la animación de salida falta `vista.remove()`. |
| El logotipo sale cortado o diminuto. | No respeta la zona visible del [apartado 3](#3-el-icono-tamano-y-zona-visible). Ajusta el relleno en *Image Asset Studio*. |
| Al lanzar desde el IDE no se ve el icono. | En algunas versiones de Android, la pantalla de inicio completa solo aparece al abrir la app desde el lanzador. Cierra la app del todo y ábrela desde su icono. |

---

## 6. Lista de comprobación

- [ ] No hay pantalla de inicio propia ni `delay` al arrancar.
- [ ] La Activity de arranque usa el tema de la pantalla de inicio y este define `postSplashScreenTheme`.
- [ ] `installSplashScreen()` se llama antes de `super.onCreate()`.
- [ ] El icono cabe en la zona visible y contrasta con el fondo, en modo claro y oscuro.
- [ ] Si se usa `setKeepOnScreenCondition`, solo espera a lo imprescindible y siempre termina, también si hay un error.
- [ ] Se ha probado con un arranque en frío desde el icono del lanzador.

---

## 7. Para saber más

- [Pantallas de presentación (Android Developers)](https://developer.android.com/develop/ui/views/launch/splash-screen?hl=es-419)
- [Migrar una pantalla de presentación existente a Android 12 y versiones posteriores](https://developer.android.com/develop/ui/views/launch/splash-screen/migrate?hl=es-419)
- [Inicio de la app: arranque en frío, templado y en caliente](https://developer.android.com/topic/performance/vitals/launch-time?hl=es-419)
