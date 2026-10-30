# Anexo A. Iconos de la app y gestión de recursos

Este anexo reúne lo necesario para preparar el **icono de la app** antes de publicarla, y una guía para resolver los problemas más habituales con los **recursos** y con las herramientas del IDE que los gestionan: el *Resource Manager*, *Image Asset Studio* y *Vector Asset Studio*.

Los nombres de menú corresponden a IntelliJ IDEA con el plugin de Android. En Android Studio las opciones son las mismas.

!!! info "Requisito previo"
    Para entender este anexo conviene haber leído [2.3.2 Imágenes, iconos y recursos](../../02/2.3.2-imagenes-iconos-recursos.md): carpetas `res/`, clase `R`, calificadores y diferencia entre mapas de bits y vectores.

---

## 1. El icono de la app

El icono que aparece en la pantalla de inicio del móvil (el *icono del lanzador*) es un recurso especial:

- Se guarda en las carpetas **`mipmap-…`**, no en `drawable`. El motivo es que algunos lanzadores muestran el icono más grande de lo normal y necesitan versiones de mayor densidad que la del propio móvil; Android conserva siempre todas las densidades de `mipmap`.
- Se declara en el `AndroidManifest.xml`:

    ```xml
    <application
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        ... >
    ```

Al crear un proyecto nuevo, el asistente ya genera un icono de ejemplo con esta estructura:

```text
app/src/main/res/
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml            ← icono adaptativo (Android 8.0 / API 26 o superior)
│   └── ic_launcher_round.xml
├── mipmap-mdpi/  …  mipmap-xxxhdpi/
│   ├── ic_launcher.webp           ← versiones en mapa de bits para Android antiguos
│   └── ic_launcher_round.webp
├── drawable/
│   ├── ic_launcher_foreground.xml ← capa delantera (el logotipo)
│   └── ic_launcher_background.xml ← capa de fondo
└── values/
    └── ic_launcher_background.xml ← color de fondo (si es un color liso)
```

### 1.1. El icono adaptativo

Desde Android 8.0, cada fabricante (y cada usuario) puede elegir la **forma** de los iconos: círculo, cuadrado redondeado, gota… Para que tu icono encaje en todas, se define como un **icono adaptativo** formado por capas que el sistema recorta con la forma elegida:

- **Capa de fondo** (*background*): un color liso o una imagen que ocupa todo el lienzo.
- **Capa delantera** (*foreground*): el logotipo, con fondo transparente.
- **Capa monocroma** (*monochrome*, opcional): una versión de un solo color del logotipo para los **iconos temáticos** (lo explicamos en el punto 1.2).

Todas las capas miden **108 × 108 dp**, pero no todo ese lienzo es visible: el sistema recorta los bordes con la máscara y además puede mover o ampliar el icono en animaciones. Por eso el logotipo debe quedar dentro de la **zona segura**, un círculo de **66 dp** de diámetro en el centro.

<figure markdown="span">
  <svg viewBox="0 0 240 240" width="260" role="img" aria-label="Lienzo de 108 dp, máscara visible y zona segura de 66 dp" style="max-width:100%">
    <rect x="12" y="12" width="216" height="216" fill="#a8c7fa" opacity="0.35" stroke="currentColor" stroke-dasharray="4 3"/>
    <rect x="48" y="48" width="144" height="144" rx="40" fill="#a8c7fa" opacity="0.55"/>
    <circle cx="120" cy="120" r="66" fill="none" stroke="#e53935" stroke-width="2.5"/>
    <path d="M100 150 L120 88 L140 150 Z" fill="#1d1b20" opacity="0.8"/>
    <text x="20" y="30" font-size="11" fill="currentColor">108 dp</text>
    <text x="120" y="172" font-size="11" fill="#e53935" text-anchor="middle">66 dp</text>
  </svg>
  <figcaption>Línea discontinua: lienzo de 108 dp. Cuadrado redondeado: parte visible tras aplicar la máscara (unos 72 dp). Círculo rojo: zona segura de 66 dp, donde debe quedar todo lo importante del logotipo.</figcaption>
</figure>

El fichero `mipmap-anydpi-v26/ic_launcher.xml` simplemente junta las capas:

```xml
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
```

### 1.2. Iconos temáticos (capa monocroma)

Desde Android 13, el usuario puede activar los **iconos temáticos**: todos los iconos se muestran en un mismo color que combina con su fondo de pantalla. Para ello el sistema usa la capa `<monochrome>`, que debe ser una silueta de un solo color con fondo transparente (el sistema la recolorea).

Si tu icono no tiene capa monocroma, el lanzador no puede tematizarlo como tú quieres: según la versión de Android, lo muestra sin tematizar o genera una versión automática. Añadirla te da el control del resultado.

!!! tip "Capa monocroma rápida"
    Si tu capa delantera ya es una silueta sencilla de un color, puedes reutilizarla: `<monochrome android:drawable="@drawable/ic_launcher_foreground" />`. Si tiene varios colores o degradados, crea un vector aparte con solo la silueta.

---

## 2. Crear el icono con Image Asset Studio

*Image Asset Studio* es el asistente del IDE que genera todos los ficheros anteriores a partir de un único logotipo.

### 2.1. Prepara el logotipo

- Mejor en **SVG** (o en PNG de al menos 512 × 512 px).
- Con **fondo transparente**: el fondo se define aparte, en la capa de fondo.
- Sencillo y reconocible a 48 dp: evita textos pequeños y detalles finos.

### 2.2. Paso a paso

1. En el panel del proyecto, cambia la vista a **Android** (desplegable de la parte superior del panel).

2. Haz clic derecho sobre el módulo **`app`** (o sobre su carpeta `res`) y elige **New → Image Asset**.

3. En **Icon type**, deja **Launcher Icons (Adaptive and Legacy)** y en **Name**, `ic_launcher`. Así se sustituyen los ficheros del icono de ejemplo.

4. Pestaña **Foreground Layer**:

    - **Source Asset → Asset Type**: *Image* para tu logotipo, *Clip art* para un icono de Material o *Text* para unas iniciales.
    - **Path**: el fichero de tu logotipo.
    - **Scaling → Resize**: ajusta el tamaño hasta que el logotipo quede **dentro del círculo de la zona segura** que dibuja la vista previa. Prueba también **Trim** para quitar márgenes transparentes del original.

5. Pestaña **Background Layer**: elige un **color** liso (lo más habitual) o una imagen.

6. Pestaña **Options**: comprueba que se generan el icono *Legacy* (para Android anteriores a 8.0), el icono *Round* y el icono para **Google Play** (`ic_launcher-playstore.png`, de 512 × 512 px).

7. Revisa en la vista previa cómo queda con las distintas formas (círculo, cuadrado, *squircle*…). Pulsa **Next**, revisa la lista de ficheros que se van a sobrescribir y pulsa **Finish**.

8. Si tu versión del asistente no permite definir la capa monocroma, añádela a mano en `mipmap-anydpi-v26/ic_launcher.xml` y en `ic_launcher_round.xml`, como en el punto 1.2.

9. **Desinstala** la app del emulador o del móvil y vuelve a instalarla. El lanzador guarda los iconos en caché y a veces no muestra el nuevo hasta que se reinstala.

### 2.3. El icono para Google Play

La ficha de Google Play usa un icono **independiente** de los recursos de la app, que se sube a mano en Play Console:

- **512 × 512 px**, PNG de 32 bits (con transparencia), de **1 MB** como máximo.
- Cuadrado y **sin redondear**: Google Play aplica su propia máscara de esquinas redondeadas y su sombra. Si las añades tú, se verán dobles.

El fichero `ic_launcher-playstore.png` que genera *Image Asset Studio* cumple estos requisitos. Antes de publicar, comprueba siempre los requisitos vigentes en la [ayuda de Play Console](https://support.google.com/googleplay/android-developer/answer/9866151?hl=es), porque Google los revisa periódicamente.

!!! note "La pantalla de bienvenida también usa el icono"
    Desde Android 12, al abrir la app el sistema muestra una pantalla de bienvenida (*splash screen*) con el icono de la app en el centro. Un icono bien centrado en la zona segura se ve bien también ahí.

---

## 3. El Resource Manager y los asistentes de recursos

### 3.1. Resource Manager

El *Resource Manager* es una ventana que muestra todos los recursos del módulo agrupados por tipo (*Drawable*, *Color*, *Mip Map*, *Font*, *String*…) con su vista previa.

- **Abrirlo:** menú **View → Tool Windows → Resource Manager**. Normalmente queda como pestaña en el lateral izquierdo.
- **Elegir módulo:** en la parte superior hay un desplegable con el módulo; debe estar seleccionado `app`.
- **Importar imágenes:** pulsa **+ → Import Drawables** o arrastra los ficheros a la ventana. El asistente propone un nombre válido y la densidad de cada imagen.
- **Ver dónde se usa un recurso:** clic derecho sobre él → **Find Usages**.
- **Renombrar un recurso:** clic derecho → **Refactor → Rename** (o `Shift + F6`). Así se actualizan también todas las referencias en el código. Si cambias el nombre del fichero a mano desde el explorador del sistema, las referencias quedan rotas.

### 3.2. Vector Asset Studio

Convierte un icono de Material o un fichero **SVG** en un *Vector Drawable* de Android:

1. Clic derecho sobre el módulo `app` (vista *Android*) → **New → Vector Asset**.

2. Elige **Clip art** (iconos de Material) o **Local file (SVG, PSD)**.

3. Ajusta el nombre (por ejemplo, `ic_logo`) y el tamaño en dp. Revisa los **avisos** que aparecen en la parte inferior: indican si alguna parte del SVG no se ha podido convertir.

4. Pulsa **Next** y **Finish**. El fichero aparece en `res/drawable/`.

---

## 4. Solución de problemas

Cada problema indica el **síntoma**, la **causa** más probable y la **solución**. Prueba las soluciones en el orden en que aparecen: las primeras son las más frecuentes.

### 4.1. «Image Asset» o «Vector Asset» no aparecen en el menú, o están en gris

Es el problema más habitual. El IDE solo muestra estos asistentes cuando reconoce que estás dentro de un **módulo Android correctamente sincronizado**.

1. **Haz clic en el sitio correcto.** Cambia la vista del panel del proyecto a **Android** y haz clic derecho sobre el módulo **`app`** o sobre su carpeta **`res`**. Si haces clic sobre la carpeta raíz del proyecto o sobre una carpeta cualquiera en la vista *Project*, las opciones no aparecen.

2. **Espera a que termine la sincronización y la indexación.** Mientras la barra inferior muestre *Gradle sync* o *Indexing…*, el IDE todavía no sabe qué es cada carpeta.

3. **Sincroniza con Gradle.** Menú **File → Sync Project with Gradle Files** (icono del elefante). Si la sincronización falla, abre la ventana **Build** y corrige el error que indique: mientras falle, el IDE no reconoce el módulo Android.

4. **Comprueba los plugins (solo IntelliJ IDEA).** En **Settings → Plugins → Installed** deben estar instalados y **activados** los plugins **Android** y **Android Design Tools**. Los asistentes de recursos dependen de ellos. Tras activarlos, reinicia el IDE.

5. **Abre el proyecto correctamente.** Si abriste una subcarpeta (por ejemplo, `app/`) en lugar de la carpeta raíz, el IDE no ve el proyecto Gradle. Cierra el proyecto y ábrelo con **File → Open** seleccionando la carpeta que contiene `settings.gradle.kts`.

6. **Último recurso:** **File → Invalidate Caches… → Invalidate and Restart**. Borra las cachés del IDE y vuelve a indexar el proyecto.

### 4.2. No encuentro el Resource Manager, o aparece vacío

- Ábrelo desde **View → Tool Windows → Resource Manager**.
- Comprueba que en el desplegable superior está seleccionado el módulo **`app`**.
- Si aparece vacío o sin el módulo, la causa suele ser una sincronización con Gradle fallida: vuelve al punto 4.1, pasos 3 a 6.

### 4.3. `R` aparece en rojo («Unresolved reference: R»)

Cuando **cualquier** recurso tiene un error, Android no puede generar la clase `R` y **todas** las referencias a `R` se ponen en rojo a la vez, aunque el error esté en un solo fichero.

1. **Mira la ventana Build** tras **Build → Rebuild Project**: el primer error suele indicar el fichero culpable.

2. **Nombres no válidos:** un fichero con mayúsculas, espacios o guiones en `res/`.

3. **XML mal formado:** una etiqueta sin cerrar en `strings.xml`, `colors.xml` o un vector.

4. **Apóstrofos sin escapar en los textos:** en `strings.xml`, `Don't` da error; hay que escribir `Don\'t`. Es muy habitual al traducir al inglés.

5. **`import android.R`:** si el fichero Kotlin importa `android.R`, tus recursos no existen ahí. Borra ese `import` y usa el `R` de tu app.

6. **El paquete de `R` no es el que esperas:** la clase `R` se genera en el paquete indicado por `namespace` en `app/build.gradle.kts`, no en el paquete de tus ficheros Kotlin. Si has movido o renombrado paquetes, importa `<namespace>.R`; por ejemplo, `import com.dam.pmdmlab02.R`.

### 4.4. Falla la tarea `:app:mergeDebugResources` o aparece «Resource compilation failed»

El mensaje de error indica el fichero problemático. Las causas habituales son:

- **Nombre de fichero no válido** (mayúsculas, espacios, guiones, empieza por número).
- **Dos recursos con el mismo nombre** en la misma carpeta y distinta extensión: `logo.png` y `logo.xml`.
- **Un fichero en la carpeta equivocada:** por ejemplo, una imagen dentro de `values/`.
- **Un vector con elementos no admitidos** (ver 4.5).

### 4.5. El SVG no se importa, o el vector se ve distinto al original

Los *Vector Drawables* de Android no admiten todo lo que permite SVG. Suelen dar problemas los **textos** (conviértelos a trazados en el editor de diseño), los **filtros** (desenfoques, sombras), las **máscaras** y los estilos CSS.

- Lee los avisos que muestra *Vector Asset Studio* antes de pulsar *Finish*.
- Simplifica el SVG en el editor (Figma, Inkscape, Illustrator): convierte textos y trazos a rellenos y elimina efectos.
- Si es una ilustración muy compleja, quizá sea mejor exportarla como **WebP**.

### 4.6. He cambiado el icono, pero en el móvil sigue saliendo el antiguo

1. **Desinstala la app y vuelve a instalarla.** El lanzador guarda los iconos en caché.

2. **Revisa `mipmap-anydpi-v26`.** En Android 8.0 o superior se usa el icono **adaptativo** de esa carpeta, no los PNG o WebP de `mipmap-xxhdpi` y similares. Si solo has sustituido esas imágenes, en los móviles actuales no verás ningún cambio.

3. **Revisa el manifiesto:** `android:icon` y `android:roundIcon` deben apuntar a los recursos que has cambiado.

4. **En el emulador:** si persiste, apágalo y haz un arranque en frío (*Cold Boot Now* desde el *Device Manager*).

### 4.7. El icono sale recortado, demasiado pequeño o con un fondo que no esperaba

- **Recortado:** el logotipo se sale de la zona segura de 66 dp. Vuelve a *Image Asset Studio* y redúcelo con **Resize**.
- **Muy pequeño:** el original tiene márgenes transparentes grandes. Activa **Trim** o recorta la imagen antes de importarla.
- **Fondo blanco o de otro color:** revisa la pestaña **Background Layer**, y comprueba que la capa delantera tiene fondo transparente.

### 4.8. El icono temático sale mal o no aparece

- **No cambia al activar los iconos temáticos:** falta la capa `<monochrome>` en `ic_launcher.xml` (y en `ic_launcher_round.xml`).
- **Sale como un cuadrado o una mancha:** la capa monocroma tiene fondo opaco. Debe ser una silueta con fondo transparente.
- Recuerda que el usuario debe activar los iconos temáticos en los ajustes de fondo de pantalla y estilo de su móvil, y que no todos los lanzadores los admiten.

### 4.9. He añadido una imagen pero no aparece en el autocompletado

- Comprueba que está en **`app/src/main/res/drawable/`** y no en otra carpeta (por ejemplo, `app/res/` o `src/res/`).
- Comprueba que el nombre es válido.
- Compila el proyecto (**Build → Make Project**) para que se regenere la clase `R`.

---

## 5. Lista de comprobación antes de publicar

- [ ] El icono es adaptativo y el logotipo queda dentro de la zona segura en todas las formas.
- [ ] Tiene capa monocroma para los iconos temáticos.
- [ ] Existen las versiones *legacy* y *round* (si la app admite Android anteriores a 8.0).
- [ ] Se ve bien en modo claro y oscuro, y a tamaño pequeño.
- [ ] El icono de Google Play es de 512 × 512 px, cuadrado y sin máscara.
- [ ] No queda en el proyecto el icono de ejemplo del asistente (el robot verde sobre fondo con cuadrícula).

---

## 6. Para saber más

- [Iconos adaptativos (Android Developers)](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive?hl=es-419)
- [Crear iconos de app con Image Asset Studio](https://developer.android.com/studio/write/create-app-icons?hl=es-419)
- [Agregar gráficos vectoriales multidensidad (Vector Asset Studio)](https://developer.android.com/studio/write/vector-asset-studio?hl=es-419)
- [Administrar los recursos de la app con Resource Manager](https://developer.android.com/studio/write/resource-manager?hl=es-419)
- [Requisitos de recursos gráficos de Google Play](https://support.google.com/googleplay/android-developer/answer/9866151?hl=es)
