# **UT1. Evolución y Entornos de Desarrollo Móvil**

---

## 1. Limitaciones y Retos en el Desarrollo Móvil

A menudo, cuando empezamos a programar venimos del entorno de desarrollo de escritorio o de servidores web, donde los recursos del sistema parecen prácticamente ilimitados: gigabytes de memoria RAM, procesadores multinúcleo a altas velocidades sin restricciones térmicas estrictas, almacenamiento masivo y una alimentación eléctrica constante.

Sin embargo, el entorno móvil plantea un ecosistema radicalmente distinto. Un smartphone es un dispositivo de bolsillo, alimentado por una batería química finita y sujeto a condiciones de conectividad y temperatura muy variables. Ignorar estas limitaciones no solo conduce a un rendimiento deficiente, sino a la desinstalación inmediata de la aplicación por parte del usuario.

Pensemos en el desarrollador de escritorio o backend como el arquitecto de un rascacielos con cimientos profundos y acceso ilimitado a la red eléctrica; en cambio, el desarrollador móvil es como un **ingeniero de Fórmula 1**: cada gramo de peso, cada ciclo de reloj de la CPU, cada llamada a la red y cada milivatio de batería cuentan.

```mermaid
graph TD
    subgraph Retos del Entorno Móvil
        A[Batería Finita] --> R[Optimización Extrema]
        B[Hardware y RAM Limitados] --> R
        C[Conectividad Inestable / Móvil] --> R
        D[Fragmentación Extrema] --> R
        E[Ciclo de Vida Agresivo del SO] --> R
    end
```

### 1.1. Recursos de Hardware: La Eterna Dieta

A pesar de los enormes avances en microelectrónica móvil, los smartphones operan bajo restricciones físicas estrictas:

- **Procesador (CPU y GPU):** Las CPUs móviles (basadas predominantemente en arquitecturas ARM y núcleos big.LITTLE) priorizan la eficiencia energética por encima de la potencia bruta continua. No disponen de ventiladores activos; si una aplicación satura la CPU durante periodos prolongados, el procesador entrará en *thermal throttling* (reducción automática de frecuencia para evitar daños térmicos), ralentizando el dispositivo.
- **Memoria RAM y el Asesino Silencioso (Low Memory Killer):** A diferencia de un PC donde el sistema operativo utiliza memoria virtual (swap) en disco si la RAM se agota, en los sistemas operativos móviles la memoria swap intensiva está limitada para no degradar la memoria flash. Si el sistema detecta presión de memoria, el servicio **Low Memory Killer (LMK)** de Android destruirá procesos en segundo plano sin previo aviso. Nuestra aplicación debe estar preparada en todo momento para restaurar su estado tras ser eliminada de la memoria.
- **Almacenamiento Flash:** Aunque la capacidad ha crecido, sigue siendo finita y compartida con fotos, vídeos y cachés del sistema. Las aplicaciones que superan cientos de megabytes sin justificación sufren mayores tasas de desinstalación.

### 1.2. La Batería: El Recurso Más Crítico

En un dispositivo móvil, cada byte transmitido por la antena celular, cada cálculo matemático y cada píxel iluminado en una pantalla OLED consume energía.

- **Impacto de las Antenas (Radio Móvil):** La antena celular (4G/5G) pasa por estados de energía (*Sleep*, *Idle*, *Active*). Realizar muchas peticiones de red pequeñas y espaciadas en el tiempo despierta la antena repetidamente impidiendo que entre en reposo, lo que dispara el consumo.
- **Mecanismos del Sistema Operativo:** Android implementa políticas muy estrictas como **Doze Mode** y **App Standby**. Cuando el usuario deja el teléfono sobre la mesa con la pantalla apagada, el sistema entra en un sueño profundo, limitando el acceso a la red y posponiendo tareas en segundo plano. El desarrollador no puede pretender ejecutar hilos infinitos; debe delegar el trabajo diferible a herramientas del sistema como **WorkManager**.

### 1.3. Conectividad Móvil: Un Entorno Inestable

Las aplicaciones móviles deben operar con la premisa de que la red es intrínsecamente hostil y cambiante:

- **Transiciones Constantes:** La app debe tolerar el cambio instantáneo entre una red Wi-Fi de alta velocidad, una conexión 5G con baja latencia, una cobertura 3G degradada en un túnel y la pérdida total de señal (*modo avión* o zonas sin cobertura).
- **Enfoque Offline-First:** Las aplicaciones modernas deben diseñarse con una arquitectura *offline-first*, almacenando los datos en una base de datos local (como Room o SQLDelight) y sincronizando con la nube de manera transparente cuando la conectividad se restablezca.

### 1.4. Fragmentación del Ecosistema

La diversidad de dispositivos en el mercado Android es inmensa:

- **Pantallas y Densidades:** Dispositivos que van desde 4 pulgadas hasta pantallas plegables de 8 pulgadas, tablets y pantallas de vehículos, con diferentes densidades de píxeles (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) y relaciones de aspecto variadas (16:9, 19.5:9, 21:9).
- **Variedad de Fabricantes (Capas de Personalización):** Samsung (One UI), Xiaomi (HyperOS), Google (Pixel UI), etc., cada uno con configuraciones de ahorro de batería agresivas y modificaciones sobre el comportamiento estándar de Android AOSP.
- **Versiones de Android en el Mercado:** Conviven dispositivos con versiones que van desde Android 10 hasta Android 16. La aplicación debe fijar una versión mínima (`minSdk`) y verificar capacidades en tiempo de ejecución.

---

## 2. Ecosistema de Opciones en el Desarrollo Móvil Actual

A la hora de crear una aplicación móvil existen distintas aproximaciones técnicas. La elección adecuada impactará directamente en el rendimiento, los costes de mantenimiento y el tiempo de comercialización (*time-to-market*).

```mermaid
graph TD
    A[Enfoques de Desarrollo Móvil] --> B[Nativo Puro]
    A --> C[Híbrido Tradicional / Web-Based]
    A --> D[Multiplataforma de UI Propia]
    A --> E[Kotlin Multiplatform - KMP]
    A --> F[Progressive Web Apps - PWA]

    B --> B1[Android: Kotlin / Jetpack Compose]
    B --> B2[iOS: Swift / SwiftUI]

    C --> C1[Capacitor / Ionic / Cordova]

    D --> D1[Flutter / Dart]
    D --> D2[React Native / JS-TS]

    E --> E1[KMP: Lógica Compartida + UI Nativa]
    E --> E2[Compose Multiplatform: Lógica + UI Compartida]
```

### A. Desarrollo Nativo Puro: Máxima Potencia e Integración

Consiste en programar directamente contra las APIs oficiales de cada plataforma utilizando sus lenguajes y herramientas recomendadas.

- **Android:** Lenguaje **Kotlin** (apoyado históricamente en Java; ver [Sección 3: De Java a Kotlin](#3-de-java-a-kotlin-la-transicion-historica-del-lenguaje-en-android)), entornos **Android Studio** o **IntelliJ IDEA** (ver [Sección 9](#9-entornos-de-desarrollo-integrados-ides-para-el-ecosistema-movil)), interfaz declarativa con **Jetpack Compose**.
- **iOS:** Lenguaje **Swift** (anteriormente Objective-C), entorno **Xcode** (exclusivo de macOS), interfaz declarativa con **SwiftUI**.

!!! info "Ventajas e Inconvenientes del Enfoque Nativo"

    - **Ventajas:** Rendimiento óptimo sin capas de traducción; acceso el primer día a cualquier nueva API del sistema operativo; integración de diseño al 100% con las guías de estilo de cada plataforma (Material 3 en Android, Human Interface Guidelines en iOS).
    - **Inconvenientes:** Coste económico y de tiempo duplicado. Requiere mantener dos bases de código distintas y contar con dos equipos de ingenieros especializados.

---

### B. Frameworks Híbridos y Multiplataforma Tradicionales

Surgen con el lema *"Write Once, Run Anywhere"* buscando abaratar costes unificando el código fuente.

#### 1. Basados en WebView (Ionic / Capacitor)

- Empaquetan una aplicación web (HTML5, CSS3, JavaScript/TypeScript) dentro de un contenedor nativo (*WebView*).
- **Limitación:** El rendimiento gráfico y la fluidez son inferiores, existiendo latencia en animaciones complejas y un aspecto que delata que no es una aplicación nativa.

#### 2. React Native (Meta)

- Utiliza **JavaScript o TypeScript** con el paradigma declarativo de React.
- **Funcionamiento:** En sus versiones modernas (con la nueva arquitectura *Fabric* y *TurboModules* con C++), sustituye el antiguo puente asíncrono (*bridge*) por la interfaz JSI (*JavaScript Interface*), renderizando componentes nativos reales de cada plataforma.
- **Uso ideal:** Empresas con fuertes equipos frontend web que buscan reutilizar conocimientos para el mundo móvil.

#### 3. Flutter (Google)

- Utiliza el lenguaje **Dart**.
- **Funcionamiento:** Flutter no utiliza los componentes de UI nativos del sistema. En su lugar, incluye su propio motor gráfico de alto rendimiento (**Impeller / Skia**) y dibuja cada botón, texto y animación directamente sobre un lienzo (*Canvas*).
- **Ventajas:** Control absoluto sobre cada píxel de la pantalla e interfaces visualmente idénticas en todas las plataformas.
- **Inconvenientes:** Mayor tamaño del ejecutable inicial y necesidad de aprender un lenguaje (Dart) con menor penetración fuera de Flutter.

---

## 3. De Java a Kotlin: La Transición Histórica del Lenguaje en Android

Uno de los aspectos más intrigantes para cualquier estudiante que se introduce en el desarrollo móvil tras cursar programación en Java (como ocurre habitualmente en 1º de DAM) es: **¿Por qué Android ya no se programa principalmente en Java? ¿Por qué Google apostó con tanta determinación por Kotlin?**

La respuesta combina una apasionante batalla legal y estratégica en los tribunales con una necesidad imperiosa de modernización técnica.

```mermaid
graph LR
    A["2008: Android 1.0<br/>Java lenguaje oficial"] --> B["2010: Litigio Legal<br/>Demanda Oracle vs Google"]
    B --> C["2010: Nace Kotlin<br/>JetBrains busca modernizar la JVM"]
    C --> D["2016: Kotlin 1.0<br/>Versión estable y adopción"]
    D --> E["2017: Google I/O<br/>Soporte oficial de primer nivel"]
    E --> F["2019: Android Kotlin-First<br/>Google prioriza Kotlin"]
    F --> G["2021: Jetpack Compose<br/>UI declarativa exclusiva de Kotlin"]
```

### 3.1. Contexto Histórico: El Origen con Java y el Litigio Oracle vs Google

Cuando Android fue concebido a mediados de los 2000 por Andy Rubin y posteriormente adquirido por Google, la elección de **Java** como lenguaje principal fue una decisión de negocio brillante:

- En 2008, Java era el lenguaje más extendido del planeta.
- Permitía a Google atraer de inmediato a millones de programadores experimentados sin exigirles aprender un lenguaje nuevo.

Sin embargo, esta decisión desencadenó dos graves problemas a largo plazo:

1. **El Macro-Litigio Legal: *Oracle contra Google* (2010 - 2021):**

    - En 2010, **Oracle Corporation** compró **Sun Microsystems** (los creadores originales de Java) y demandó inmediatamente a Google por infracción de patentes y derechos de autor.
    - La acusación se centraba en que Android utilizaba las especificaciones de 37 paquetes y cerca de 11.500 líneas de código de cabecera de las APIs de Java (como `java.lang`, `java.util`, etc.) reimplementadas sobre la máquina virtual Dalvik sin pagar licencias comerciales.
    - El litigio se prolongó durante más de una década, con reclamaciones de daños que superaban los **9.000 millones de dólares**. Aunque en abril de 2021 el Tribunal Supremo de EE.UU. falló a favor de Google dictaminando que la reimplementación de APIs constituía un uso legítimo (*Fair Use*), la incertidumbre legal durante esos 11 años forzó a Google a buscar alternativas para no depender del futuro de Java ni de las decisiones corporativas de Oracle.

2. **El Estancamiento Técnico de Java en Dispositivos Móviles:**

    - Por razones de arquitectura y compatibilidad con versiones antiguas del sistema operativo, Android se quedó "atrapado" durante años en las especificaciones de **Java 6 y Java 7**.
    - Mientras el ecosistema general de Java evolucionaba con lambdas, streams y nuevas APIs en Java 8 y posteriores, los desarrolladores de Android no podían utilizarlas sin complejas herramientas de desazucarado (*desugaring*) o retrocompatibilidad. El código Android en Java se volvía cada vez más verboso, anticuado y propenso a errores.

---

### 3.2. La Llegada de Kotlin y la Era "Kotlin-First"

En 2010, la compañía europea **JetBrains** (famosa por crear los mejores entornos de desarrollo del mercado, entre ellos IntelliJ IDEA) comenzó a diseñar un nuevo lenguaje de programación para la máquina virtual: **Kotlin**.

JetBrains buscaba un lenguaje que resolviera las grandes carencias de Java, pero con un requisito irrenunciable: **100% de interoperabilidad bidireccional con Java**.

El impacto en la comunidad de Android fue tan abrumador que Google tomó decisiones históricas:

- **Google I/O 2017:** Google anuncia oficialmente que Kotlin pasa a ser un **lenguaje de primera clase (*First-Class Language*)** para Android, soportado de forma nativa en Android Studio junto a Java y C++.
- **Google I/O 2019: Anuncio "Kotlin-First":** Google declara que el desarrollo en Android pasa a ser oficialmente **Kotlin-First** (*"Android development will become increasingly Kotlin-first"*). A partir de ese momento:

    - Todas las nuevas librerías oficiales de **Android Jetpack** se conciben y diseñan prioritariamente en Kotlin.
    - La documentación oficial y los ejemplos de código pasan a priorizar Kotlin.
    - Los nuevos frameworks revolucionarios de Google (como **Jetpack Compose**) se construyen de forma exclusiva sobre las capacidades avanzadas de Kotlin.

---

### 3.3. Motivos Técnicos de Ingeniería: ¿Por qué Kotlin es Superior a Java en Móvil?

La transición a Kotlin no fue solo una jugada legal; fue principalmente una **victoria técnica aplastante de diseño de lenguajes**. Despliega cada uno de los siguientes apartados para analizar en detalle las razones de ingeniería y acceder a los recursos donde ampliar conocimientos:

??? info "1. Seguridad Frente a Nulos (*Null Safety* Integrada en el Sistema de Tipos)"

    El creador de la referencia nula, Sir Tony Hoare, la denominó públicamente su *"error del millón de dólares"*. En Java, cualquier variable de objeto puede apuntar a `null`, y si intentamos invocar un método sobre ella sin comprobarlo previamente, la aplicación sufrirá un catastrófico **`NullPointerException` (NPE)** que provocará el cierre forzoso de la aplicación en el dispositivo del usuario.

    Kotlin resuelve esto de raíz integrando la nulabilidad en el propio sistema de tipos del compilador:

    === "Java (Peligro en Tiempo de Ejecución)"

        ```java
        // En Java, el compilador permite esto sin advertencia:
        String nombre = null;
        int longitud = nombre.length(); // ¡CRASH! NullPointerException en el dispositivo
        ```

    === "Kotlin (Seguridad en Tiempo de Compilación)"

        ```kotlin
        // El compilador prohíbe asignar null a un tipo estándar:
        var nombre: String = "Ana"
        // nombre = null // ¡ERROR DE COMPILACIÓN! El código ni siquiera compila

        // Si explícitamente permitimos nulos con '?', el compilador nos exige gestionarlo:
        var apellido: String? = null
        val longitud = apellido?.length ?: 0 // Operador Elvis: seguro, limpio y sin crash
        ```

    ---

    :material-arrow-right-circle: **Para profundizar en detalle:** Consulta la guía monográfica [**14. Null Safety en Kotlin**](../00-android/00-kotlin/14-null-safety.md), donde se estudian en profundidad los operadores de llamada segura (`?.`), el operador Elvis (`?:`), el aserto no nulo (`!!`) y el casteo seguro (`as?`).

??? info "2. Concisión y Eliminación de Código Repetitivo (*Boilerplate* con Data Classes)"

    En Java, modelar una simple entidad de datos (POJO) requiere decenas de líneas de código rutinario para getters, setters, constructores, `equals()`, `hashCode()` y `toString()`. En Kotlin, una **`data class`** lo resuelve de forma limpia, expresiva y mantenible en una única línea de código:

    === "Java: 45 Líneas de Código (POJO)"

        ```java
        public class Juego {
            private final int id;
            private final String titulo;
            private final double precio;

            public Juego(int id, String titulo, double precio) {
                this.id = id;
                this.titulo = titulo;
                this.precio = precio;
            }

            public int getId() { return id; }
            public String getTitulo() { return titulo; }
            public double getPrecio() { return precio; }

            @Override
            public boolean equals(Object o) { /* ... 10 líneas de comparación ... */ }
            @Override
            public int hashCode() { /* ... 5 líneas de cálculo de hash ... */ }
            @Override
            public String toString() { /* ... 5 líneas de formato ... */ }
        }
        ```

    === "Kotlin: 1 Línea de Código (`data class`)"

        ```kotlin
        data class Juego(val id: Int, val titulo: String, val precio: Double)
        // El compilador autogenera: getters, equals, hashCode, toString, componentN() y copy()
        ```

    ---

    :material-arrow-right-circle: **Para profundizar en detalle:** Consulta la guía monográfica [**23. Data Classes en Kotlin**](../00-android/00-kotlin/23-data-classes.md), donde se analizan la desestructuración de datos, la función `.copy()` y las directrices de inmutabilidad recomendadas en Android.

??? info "3. Funciones de Extensión (*Extension Functions*)"

    Kotlin permite añadir nuevas funciones a clases existentes (incluso pertenecientes a librerías de terceros o del propio SDK de Android) sin necesidad de heredar de ellas ni crear farragosas clases utilitarias (`Utils.java`):

    ```kotlin
    // Extendemos la clase Context nativa de Android con un método propio:
    fun Context.toast(mensaje: String) {
        Toast.makeText(this, mensaje, Toast.LENGTH_SHORT).show()
    }

    // Ahora cualquier Activity o Service puede invocarlo directamente de forma natural:
    toast("¡Partida guardada con éxito!")
    ```

    ---

    :material-arrow-right-circle: **Para profundizar en detalle:** Consulta la guía monográfica [**13. Funciones y Lambdas en Kotlin**](../00-android/00-kotlin/13-funciones-lambdas.md), donde se explica la sintaxis de funciones de extensión, parámetros con nombre, valores por defecto y funciones de orden superior.

??? info "4. Concurrencia Moderna y Asincronía con Corrutinas"

    En Android, cualquier tarea que consuma tiempo (consultas a base de datos Room, llamadas a una API REST o lectura de archivos) **no puede ejecutarse en el hilo principal (*Main Thread / UI Thread*)**, porque congelaría la pantalla provocando el temido error **ANR (Application Not Responding)**.

    - **En Java:** La asincronía tradicionalmente requería `Thread`, `Handler` o la problemática clase `AsyncTask` (deprecada por Google por provocar fugas de memoria al retener referencias vivas a actividades destruidas), o recurrir a librerías externas complejas como RxJava.
    - **En Kotlin:** Las **Corrutinas** permiten escribir código asíncrono no bloqueante con sintaxis secuencial ordinaria mediante `suspend fun`. Además, incorporan **concurrencia estructurada**: si el usuario abandona una pantalla, todas las tareas asíncronas ligadas a su `viewModelScope` se cancelan automáticamente, impidiendo fugas de memoria y gasto inútil de batería.

    ```kotlin
    // Código asíncrono con Corrutinas en Kotlin: secuencial, legible y seguro
    suspend fun cargarDatosJuego(id: Int): Juego {
        val juego = apiService.getGameById(id) // Se suspende sin congelar la UI
        database.gameDao().insert(juego)        // Se guarda en Room en segundo plano
        return juego
    }
    ```

    ---

    :material-arrow-right-circle: **Para profundizar en detalle:** Consulta las guías monográficas [**51. Corrutinas en Kotlin**](../00-android/00-kotlin/51-corrutinas.md) y [**52. Corrutinas de Forma Sencilla**](../00-android/00-kotlin/52-corrutinas-sencillo.md) para dominar `launch`, `async`, `Dispatchers` (IO, Main, Default) y la cancelación estructurada.

??? info "5. Interoperabilidad 100% Bidireccional con Java"

    Kotlin no exige reescribir un proyecto desde cero. Un proyecto Android puede contener archivos `.java` y archivos `.kt` conviviendo pacíficamente en el mismo módulo:

    - Puedes instanciar una clase Java desde un fichero Kotlin exactamente igual que si fuera de Kotlin.
    - Puedes invocar código Kotlin desde un fichero Java tradicional sin necesidad de adaptadores.
    - Toda la inmensa biblioteca de código abierto construida en Java durante más de 25 años sigue siendo 100% aprovechable en Kotlin.

    ---

    :material-arrow-right-circle: **Para profundizar en detalle:** Consulta la guía monográfica [**21. Programación Orientada a Objetos en Kotlin**](../00-android/00-kotlin/21-poo.md) para comprender cómo compila Kotlin a bytecode de la JVM y cómo interactúa con clases Java, interfaces y herencia.

??? info "6. El Pilar Obligatorio para Jetpack Compose"

    La revolución de las interfaces declarativas (**Jetpack Compose**) no habría sido viable técnicamente con Java. Compose aprovecha características intrínsecas de Kotlin como los **Domain-Specific Languages (DSLs) tipados**, las funciones componibles anotadas (`@Composable`), los parámetros con valores por defecto y las llamadas con funciones lambda finales (*trailing lambdas*).

    ```kotlin
    // Jetpack Compose se apoya en trailing lambdas y funciones de Kotlin:
    @Composable
    fun TarjetaJuego(juego: Juego, onClick: () -> Unit) {
        Card(onClick = onClick) {
            Text(text = juego.titulo)
        }
    }
    ```

    ---

    :material-arrow-right-circle: **Para profundizar en detalle:** Consulta la guía monográfica [**Introducción a Jetpack Compose**](../00-android/00-compose/index.md) para descubrir el ciclo de vida de los composables, recomposición y diseño declarativo.

---

### 3.4. Tabla Resumen: Comparativa Directa Java vs Kotlin en Android

| Característica | Java en Android | Kotlin en Android |
| :--- | :--- | :--- |
| **Seguridad de Nulos** | Nula en el compilador. Riesgo constante de `NullPointerException` en runtime. | **Garantizada por el sistema de tipos**. Distinción estricta entre `T` y `T?`. |
| **Verbosidad del Código** | Alta. Requiere código repetitivo (*boilerplate*) para POJOs, constructores y getters. | **Muy baja**. `data class`, inferencia de tipos y propiedades automáticas. |
| **Concurrencia Asíncrona** | Compleja: `Thread`, callbacks anidados (*callback hell*), fugas de memoria con `AsyncTask`. | **Moderna y limpia: Corrutinas** y `Flow` con concurrencia estructurada. |
| **Extensibilidad** | Solo mediante herencia o clases estáticas utilitarias (`StringUtils.metodo()`). | **Funciones de Extensión** directas sobre cualquier clase (`objeto.metodo()`). |
| **Paradigma Funcional** | Parcial (introducido en Java 8 de forma limitada). | **Ciudadano de primera clase**: lambdas idiomáticas, funciones de orden superior. |
| **Soporte de Jetpack Compose** | No compatible. Compose requiere Kotlin. | **Soporte nativo absoluto**. Diseñado específicamente para y con Kotlin. |
| **Estatus en Google** | Soportado por legado histórico. | **Lenguaje Oficial y Preferente ("Kotlin-First")**. |

!!! info "Profundiza en la Sintaxis de Kotlin"

    Para aprender y practicar la sintaxis completa del lenguaje, consulta la sección monográfica de los apuntes: [**Fundamentos de Programación en Kotlin**](../00-android/00-kotlin/index.md).

---

## 4. Kotlin Multiplatform (KMP): La Revolución Multiplataforma

**Kotlin Multiplatform (KMP)** no es un framework híbrido más: es una tecnología desarrollada por **JetBrains** y respaldada oficialmente por **Google** que replantea por completo la estrategia de código compartido en la industria del software.

### 4.1. Filosofía de KMP: Código Compartido Donde Aporta Valor

La premisa tradicional de los frameworks híbridos solía ser "comparte el 100% de la aplicación, incluida la interfaz, a costa de intermediarios y puentes". KMP introduce una perspectiva mucho más sensata:

> **"Comparte la lógica de negocio que es idéntica en todas las plataformas, y decide libremente cuánta interfaz de usuario quieres compartir."**

```mermaid
graph TD
    subgraph KMP Clásico: Lógica Compartida
        CM[commonMain: Lógica de Negocio en Kotlin]
        CM -->|Compilado a JVM Bytecode| AND[UI Android con Jetpack Compose]
        CM -->|Compilado a Binario Nativo / Framework vía LLVM| IOS[UI iOS con SwiftUI / Swift]
        CM -->|Compilado a JS / Wasm| WEB[Web Frontend]
    end
```

A diferencia de React Native (que requiere un runtime de JavaScript en tiempo de ejecución) o Flutter (que empaqueta su propio motor de renderizado gráfico completo), **KMP se compila al formato nativo que cada plataforma espera**:

- Para **Android**, Kotlin compila a **bytecode de la JVM/DEX**, integrándose como código nativo de primera clase.
- Para **iOS**, el compilador de **Kotlin/Native** utiliza **LLVM** para generar un binario ejecutable o un `.framework` nativo de Apple que Swift consume sin wrappers ni penalización de rendimiento.

---

### 4.2. Adopción Oficial de Google en AndroidX

Un hito decisivo en la consolidación de KMP fue el anuncio oficial de **Google** adoptando Kotlin Multiplatform como tecnología recomendada para compartir código entre Android e iOS.

Librerías oficiales de **AndroidX** que ya tienen soporte oficial de KMP:

- **Room KMP:** La base de datos relacional estándar de Android ahora corre sobre iOS usando el mismo código de entidades y DAOs.
- **DataStore:** Almacenamiento clave-valor reactivo y transaccional compartido.
- **Lifecycle & ViewModel:** Los `ViewModel` de Jetpack y sus estados ahora pueden residir en el módulo común y ser consumidos tanto por Compose como por SwiftUI.
- **Paging:** Paginación eficiente de listas compartida.
- **Annotations & Collections:** Colecciones optimizadas de Android disponibles en iOS y Desktop.

---

### 4.3. Estructura de un Proyecto KMP

En un proyecto estándar de KMP, la estructura del código en el módulo compartido (habitualmente llamado `shared` o `composeApp`) organiza las fuentes por plataformas mediante los llamados **Source Sets**:

```
mi-proyecto-kmp/
├── composeApp/ (o shared/)
│   └── src/
│       ├── commonMain/         <-- Código 100% compartido
│       │   ├── kotlin/         <-- Modelos, Repositorios, Red, Casos de Uso
│       │   └── resources/      <-- Strings, imágenes y fuentes comunes
│       ├── androidMain/        <-- Código específico de Android (usa Android SDK)
│       ├── iosMain/            <-- Código específico de iOS (usa APIs de Apple / Cocoa)
│       ├── desktopMain/        <-- Código específico de JVM Desktop (Windows/Mac/Linux)
│       └── wasmJsMain/         <-- Código para WebAssembly (Navegador)
├── iosApp/                     <-- Proyecto Xcode de iOS (consume el framework de Kotlin)
└── build.gradle.kts            <-- Configuración Gradle Multiplataforma
```

#### Configuración del `build.gradle.kts` Multiplataforma:

```kotlin
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.composeMultiplatform)
}

kotlin {
    // Objetivos de compilación (Targets)
    androidTarget()
    
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "SharedApp"
            isStatic = true
        }
    }
    
    jvm("desktop")

    // Configuración de dependencias por Source Set
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.serialization.json)
            implementation(libs.koin.core)
        }
        androidMain.dependencies {
            implementation(libs.ktor.client.okhttp)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
    }
}
```

---

### 4.4. El Mecanismo Clave: `expect` y `actual`

¿Qué ocurre cuando el código compartido en `commonMain` necesita acceder a una funcionalidad que solo existe en el hardware o en el sistema operativo concreto (por ejemplo, obtener el modelo del dispositivo, guardar en el Keychain/Keystore o consultar el nivel de batería)?

Kotlin proporciona un patrón de diseño a nivel de compilador mediante las palabras clave **`expect`** y **`actual`**.

```mermaid
classDiagram
    class CommonMain {
        <<expect>>
        +getPlatform(): Platform
    }
    class AndroidMain {
        <<actual>>
        +getPlatform(): Platform (Retorna "Android API " + Build.VERSION.SDK_INT)
    }
    class IosMain {
        <<actual>>
        +getPlatform(): Platform (Retorna UIDevice.currentDevice.systemName)
    }
    CommonMain <|-- AndroidMain : Implementa
    CommonMain <|-- IosMain : Implementa
```

#### Paso 1: Declarar el contrato en `commonMain` (`expect`)

```kotlin
// Archivo: commonMain/kotlin/com/example/Platform.kt
interface Platform {
    val name: String
    val osVersion: String
}

// Declaramos que esperamos que cada plataforma proporcione esta función
expect fun getPlatform(): Platform
```

#### Paso 2: Implementar en `androidMain` (`actual`)

En `androidMain`, tenemos acceso total a todo el SDK de Android (`android.os.Build`, `Context`, etc.):

```kotlin
// Archivo: androidMain/kotlin/com/example/Platform.android.kt
import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android"
    override val osVersion: String = "${Build.VERSION.SDK_INT}"
}

actual fun getPlatform(): Platform = AndroidPlatform()
```

#### Paso 3: Implementar en `iosMain` (`actual`)

En `iosMain`, Kotlin nos permite importar directamente los frameworks de Apple (**Foundation**, **UIKit**, etc.) como si fueran clases de Kotlin:

```kotlin
// Archivo: iosMain/kotlin/com/example/Platform.ios.kt
import platform.UIKit.UIDevice

class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName()
    override val osVersion: String = UIDevice.currentDevice.systemVersion
}

actual fun getPlatform(): Platform = IOSPlatform()
```

---

### 4.5. Ecosistema de Librerías Estándar en KMP

Para construir aplicaciones reales sin reinventar la rueda, el ecosistema KMP cuenta con un conjunto de bibliotecas de primer nivel respaldadas por la comunidad y grandes compañías:

| Necesidad Arquitectónica | Librería KMP Estándar | Equivalente Tradicional en Android |
| :--- | :--- | :--- |
| **Cliente HTTP / Red** | **Ktor Client** | Retrofit / OkHttp |
| **Serialización JSON** | **`kotlinx.serialization`** | Gson / Moshi / Jackson |
| **Persistencia Local (BD)** | **Room KMP** / **SQLDelight** | Room (solo Android) / SQLite |
| **Almacenamiento Clave-Valor** | **Multiplatform Settings** / **DataStore** | SharedPreferences / DataStore |
| **Inyección de Dependencias** | **Koin** | Hilt / Dagger |
| **Concurrencia Asíncrona** | **Kotlinx Coroutines & Flow** | RxJava / Threads / Handlers |
| **Carga y Caché de Imágenes** | **Coil 3 (KMP)** / **Kamel** | Glide / Picasso / Coil 2 |
| **Navegación Multiplataforma** | **Navigation Compose KMP** / **Voyager** | Jetpack Navigation |

#### Ejemplo Práctico de Consumo de API en `commonMain`:

```kotlin
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable

@Serializable
data class Game(val id: Int, val title: String, val rating: Double)

class GameRepository(private val client: HttpClient) {
    suspend fun fetchGames(): List<Game> {
        return client.get("https://api.example.com/games").body()
    }
}
```
*Este único bloque de código se ejecuta idénticamente en Android, iOS, Windows, Mac y navegador web.*

---

### 4.6. Compose Multiplatform (CMP): Llevando la UI a Todas Partes

Si bien KMP nació enfocado en la lógica compartida con UI nativa (Jetpack Compose en Android y SwiftUI en iOS), **JetBrains** dio el siguiente paso natural con **Compose Multiplatform (CMP)**.

```mermaid
graph LR
    subgraph Compose Multiplatform
        UI[Código Declarativo @Composable] --> ANDROID[Android: Render Nativo AndroidX]
        UI --> IOS[iOS: Renderizado mediante Skiko / Metal]
        UI --> DESK[Desktop: Renderizado mediante Skiko / DirectX / OpenGL]
        UI --> WASM[Web: Renderizado mediante WebAssembly / Canvas]
    end
```

- **¿Qué es CMP?** Es una extensión de Jetpack Compose que permite usar exactamente la misma sintaxis declarativa de Kotlin para describir la interfaz de usuario en Android, iOS, Escritorio y Web.
- **¿Cómo funciona en iOS?** En iOS, Compose Multiplatform utiliza **Skiko** (un motor gráfico ligero basado en **Skia**, la misma tecnología gráfica que emplean Google Chrome y Flutter) para dibujar sobre una vista de Metal nativa a 60/120 FPS.
- **Ventaja competitiva frente a Flutter:** No aprendes un lenguaje nuevo (todo es Kotlin), puedes integrar vistas SwiftUI nativas dentro de Compose cuando lo desees (`UIKitView`) y tienes acceso directo a todas las APIs de Apple sin necesidad de programar complejos "Method Channels".

---

### 4.7. Matriz Comparativa: KMP vs Flutter vs React Native vs Nativo Puro

| Criterio | Nativo Puro | Kotlin Multiplatform (KMP/CMP) | Flutter | React Native |
| :--- | :--- | :--- | :--- | :--- |
| **Lenguaje** | Kotlin (Android) / Swift (iOS) | **Kotlin** | Dart | JavaScript / TypeScript |
| **Rendimiento** | Máximo (100% nativo) | **Nativo en lógica y compilación** | Casi nativo (motor propio Skia) | Casi nativo (con JSI / Fabric) |
| **Estrategia de UI** | Nativa independiente | **Flexible:** 100% nativa o CMP compartida | Compartida (dibuja su propio Canvas) | Componentes nativos mapeados |
| **Interoperabilidad** | Innecesaria | **Total y directa** (compila a `.framework` en iOS) | Requiere puentes (*Platform Channels*) | Requiere módulos nativos puente |
| **Curva de Adopción** | Requiere dos equipos | **Gradual:** Puedes empezar con un solo módulo | "Todo o nada" en la mayoría de casos | "Todo o nada" para la app |
| **Soporte Corporativo** | Google / Apple | **JetBrains & Google** | Google | Meta (Facebook) |
| **Ideal para...** | Apps con uso intensivo de APIs exclusivas | Proyectos que buscan maximizar código compartido sin perder potencia nativa | Apps con diseño idéntico muy estilizado | Equipos con fuerte base web React |

---

## 5. Evolución de los Paradigmas de Interfaz: De Imperativo a Declarativo

Uno de los saltos cualitativos más importantes en el desarrollo de software moderno ha sido la transición del paradigma imperativo al paradigma declarativo en el diseño de interfaces.

```mermaid
graph TD
    subgraph Paradigma Imperativo - Histórico
        A1[El desarrollador programa el CÓMO] --> A2[Búsqueda manual: findViewById]
        A2 --> A3[Mutación de propiedades: setText, setVisibility]
        A3 --> A4[Riesgo de desincronización de estado]
    end

    subgraph Paradigma Declarativo - Moderno
        B1[El desarrollador describe el QUÉ] --> B2[UI = f estado]
        B2 --> B3[Cuando el estado cambia, la UI se recompone sola]
        B3 --> B4[Código predecible, testeable y sin bugs de estado]
    end
```

### 5.1. El Enfoque Imperativo Clásico (XML / Android Views)

Durante más de una década, construir una pantalla en Android requería:

1. Diseñar la estructura visual en un archivo XML (`activity_main.xml`).

2. Enlazar los elementos desde la actividad en Java o Kotlin mediante `findViewById` o View Binding.

3. Mutar manualmente cada vista cuando cambiaban los datos:

    ```kotlin
    // Enfoque imperativo: Nosotros manipulamos la vista paso a paso
    val textView = findViewById<TextView>(R.id.tvMensaje)
    val progressBar = findViewById<ProgressBar>(R.id.progressBar)
    
    if (cargando) {
        progressBar.visibility = View.VISIBLE
        textView.text = "Cargando datos..."
    } else {
        progressBar.visibility = View.GONE
        textView.text = "Datos recibidos: ${datos.total}"
    }
    ```

*Problema clásico:* Si el programador olvidaba ocultar la barra de progreso en uno de los muchos caminos de error, la vista quedaba en un estado inconsistente con la realidad interna de la aplicación.

### 5.2. El Enfoque Declarativo Moderno (Jetpack Compose / SwiftUI)

En el paradigma declarativo no manipulamos directamente los componentes gráficos. En su lugar, describimos **cómo debe verse la pantalla para cualquier estado posible**:

> **UI = f(Estado)**

```kotlin
// Enfoque declarativo con Jetpack Compose: La UI es un reflejo reactivo del estado
@Composable
fun PantallaDatos(uiState: DatosUiState) {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        if (uiState.isLoading) {
            CircularProgressIndicator()
            Text(text = "Cargando datos...")
        } else {
            Text(text = "Datos recibidos: ${uiState.total}")
        }
    }
}
```
Cuando el estado (`DatosUiState`) cambia, el framework se encarga de calcular de forma inteligente qué partes de la pantalla han cambiado y redibujarlas automáticamente (**Recomposición**). Es imposible que la interfaz quede desincronizada con el estado.

---

## 6. El Ciclo de Vida de una Aplicación Móvil como Producto

Una aplicación móvil no es un simple programa de ordenador: es un producto vivo que atraviesa distintas fases con las que el usuario y el sistema operativo interactúan a lo largo del tiempo.

```mermaid
journey
    title Viaje de la Aplicación en el Dispositivo del Usuario
    section Adquisición
      Búsqueda en Google Play (ASO): 5: Usuario
      Instalación y Verificación: 4: SO / Tienda
    section Uso
      Primer Arranque & Splash Screen: 4: App
      Solicitud de Permisos en Runtime: 3: Usuario
      Uso Regular & Segundo Plano: 5: App / SO
    section Mantenimiento
      Actualizaciones Automáticas: 5: Tienda
      Optimización de Batería (Doze): 4: SO
    section Fin
      Desinstalación y Limpieza de Sandbox: 2: Usuario / SO
```

### 6.1. Fases del Ciclo de Vida

1. **Descubrimiento (Marketing y ASO):**

    - Las tiendas oficiales (**Google Play Store** y **Apple App Store**) son el principal canal.
    - **ASO (App Store Optimization):** Estrategias para optimizar palabras clave, icono, capturas de pantalla y valoraciones con el fin de aparecer en las primeras posiciones de búsqueda.

2. **Instalación y Seguridad:**

    - **Tiendas Oficiales:** El sistema verifica la firma criptográfica del paquete (`.apk` / `.aab` o `.ipa`) y crea un directorio privado y aislado para la aplicación (**Sandbox**).
    - **Sideloading (Fuentes desconocidas):** En Android es posible instalar paquetes directamente desde un navegador o tiendas alternativas (como F-Droid). Por seguridad, el sistema bloquea estas acciones por defecto exigiendo confirmación explícita del usuario.

3. **Ejecución y Permisos en Tiempo de Ejecución (Runtime Permissions):**

    - Desde Android 6.0 (API 23), los permisos sensibles (cámara, ubicación precisa, micrófono, notificaciones a partir de Android 13) ya no se conceden al instalar la app.
    - La aplicación debe solicitarlos en el momento exacto en que va a utilizarlos, explicando el motivo al usuario y gestionando de forma elegante la posibilidad de que el usuario los rechace.

4. **Actualización:**

    - Se descargan mediante deltas (solo los bytes que han cambiado). El sistema operativo exige que la actualización esté firmada con exactamente la misma clave criptográfica privada que la versión anterior; de lo contrario, la instalación será bloqueada para evitar suplantaciones de identidad.

5. **Desinstalación y Datos Residuales:**

    - Al desinstalar la app, el sistema elimina por completo el ejecutable y el almacenamiento privado (*sandbox* interno: base de datos Room, preferencias y cachés).
    - Los archivos guardados en carpetas públicas compartidas (como `DCIM/` o `Descargas/`) y los datos almacenados en servidores en la nube no se borran con la desinstalación local.

---

## 7. Arquitectura del Sistema Android y Entorno de Ejecución

Para entender qué ocurre cuando pulsamos el botón "Run" en nuestro IDE, debemos conocer la maquinaria interna de Android.

### 7.1. De Código Fuente a Código Máquina: El Proceso de Compilación

A diferencia de una aplicación Java de escritorio convencional, Android no ejecuta directamente archivos `.class` ni empaqueta un archivo `.jar`.

```mermaid
graph LR
    KT[Código Fuente Kotlin .kt] --> KTC[Compilador Kotlin kotlinc]
    KTC --> CLASS[Bytecode Java .class]
    CLASS --> D8[Compilador DEX / D8 y R8]
    D8 --> DEX[Archivos DEX classes.dex]
    RES[Recursos res/ y Manifest] --> AAPT2[AAPT2]
    DEX --> PACK[Empaquetador APK / AAB]
    AAPT2 --> PACK
    PACK --> SIGN[Firma Criptográfica zipalign/apksigner]
    SIGN --> FINAL[Artefacto Final APK / AAB]
```

1. **Compilación a Bytecode:** `kotlinc` compila los ficheros `.kt` a bytecode tradicional de la JVM (`.class`).

2. **Desechado y Optimización con D8 / R8:** El compilador **D8** convierte el bytecode Java en formato **DEX (Dalvik Executable)**, optimizado específicamente para consumir la mínima memoria posible. La herramienta **R8** analiza el código, elimina clases y métodos no utilizados (*tree-shaking*), optimiza llamadas y ofusca el código renombrando identificadores para dificultar la ingeniería inversa.

3. **Empaquetado de Recursos con AAPT2:** Compila los archivos XML, imágenes y recursos generando el binario compilado y la clase `R.java`.

---

### 7.2. La Máquina Virtual: De Dalvik a ART (Android Runtime)

Históricamente, Android ejecutaba el código sobre la máquina virtual **Dalvik**, pero desde Android 5.0 (Lollipop) el sistema utiliza **ART (Android Runtime)**:

- **Dalvik (Histórico):** Utilizaba compilación **JIT (Just-In-Time)**. Cada vez que el usuario abría una app, el código DEX se traducía a código máquina en tiempo real sobre la marcha. Esto consumía mucha CPU y drenaba la batería.

- **ART (Moderno):** Utiliza un modelo híbrido extremadamente avanzado:

    - **Compilación AOT (Ahead-Of-Time):** Durante la instalación o en periodos de inactividad mientras el teléfono carga, ART compila porciones críticas de código directamente a lenguaje máquina nativo (`.oat` / `.elf`).
    - **Perfiles Guiados por el Uso (Profile-Guided Optimization - PGO):** El sistema analiza qué partes de la app utiliza con más frecuencia el usuario y compila de forma prioritaria solo esas rutinas.
    - **Baseline Profiles:** Los desarrolladores pueden empaquetar un archivo de perfil en su app para que el dispositivo precompile la aplicación nada más instalarse, logrando arranques hasta un 40% más rápidos sin esperar al aprendizaje del sistema.

---

### 7.3. Formatos de Distribución: APK vs AAB (Android App Bundle)

| Característica | APK (Android Package) | AAB (Android App Bundle) |
| :--- | :--- | :--- |
| **Definición** | Formato de instalación clásico (`.apk`). Contiene todos los recursos para todos los dispositivos posibles. | Formato de publicación moderno (`.aab`). Contiene el código completo pero no es directamente instalable. |
| **Destino** | Emuladores, pruebas directas y tiendas alternativas (F-Droid). | **Obligatorio para publicar en Google Play Store**. |
| **Tamaño en el Dispositivo** | Mayor (incluye imágenes para todas las resoluciones y librerías C++ para todas las arquitecturas de CPU). | **Hasta un 30-40% más ligero**. Google Play genera un *Split APK* personalizado que solo contiene los recursos exactos que necesita el teléfono que lo descarga. |
| **Entrega Dinámica** | No soportada. | Permite descargar módulos de funcionalidades bajo demanda (*Play Feature Delivery*). |

---

## 8. El SDK de Android y la Tríada de Versiones en Gradle

El **SDK (Software Development Kit)** es la colección de herramientas, cabeceras y librerías que Google proporciona para desarrollar aplicaciones. En Android Studio se gestiona a través del **SDK Manager** dividiéndose en dos grandes apartados:

1. **SDK Platforms:** Versiones concretas del sistema operativo (que contienen el fichero esencial `android.jar` contra el que programamos y las imágenes de sistema para los emuladores).

2. **SDK Tools:** Herramientas independientes de la versión del SO (compiladores, emulador, analizadores de rendimiento y herramientas de línea de comandos).

---

### 8.1. La Tríada Clave en Gradle: `minSdk`, `compileSdk` y `targetSdk`

En todo archivo `build.gradle.kts` de un módulo Android encontraremos tres números esenciales que cualquier desarrollador debe comprender a la perfección:

```kotlin
android {
    compileSdk = 35 // Android 15

    defaultConfig {
        applicationId = "com.docente.gamevault"
        minSdk = 26     // Android 8.0 Oreo
        targetSdk = 35  // Android 15
        
        versionCode = 1
        versionName = "1.0.0"
    }
}
```

```mermaid
graph LR
    MIN[minSdk: El Suelo] -->|Dispositivos permitidos| TARGET[targetSdk: La Promesa]
    TARGET -->|Compatibilidad de comportamiento| COMPILE[compileSdk: El Techo del Compilador]
```

#### 1. `compileSdk` (El Techo del Compilador)

- Indica la versión del SDK de Android con la que el compilador comprobará tu código.
- Define qué clases y métodos de la API de Android puedes invocar en tu código fuente. No afecta al comportamiento en tiempo de ejecución en el teléfono del usuario.

#### 2. `minSdk` (El Suelo de Compatibilidad)

- Define la versión **mínima** de Android que requiere un dispositivo para poder instalar y ejecutar la aplicación.
- Si un usuario tiene un teléfono con una versión inferior a tu `minSdk`, Google Play ni siquiera le mostrará la aplicación en los resultados de búsqueda.
- *Compromiso del desarrollador:* Un `minSdk` muy bajo (ej. API 21) permite llegar a más dispositivos antiguos, pero impide usar APIs modernas directamente y requiere código de compatibilidad adicional. Un `minSdk` razonable actual se sitúa habitualmente entre el API 24 (Android 7.0) y el API 26 (Android 8.0).

#### 3. `targetSdk` (La Promesa de Comportamiento al Sistema Operativo)

- Indica a Android: *"He probado y diseñado mi app para comportarse según las reglas de seguridad y privacidad de esta versión de Android"*.
- **Mecanismo de compatibilidad hacia atrás:** Si ejecutas tu app en un teléfono con Android 15 pero tu `targetSdk` es 33, Android activará modos de compatibilidad para no romper tu app aunque las políticas de permisos hayan cambiado en Android 15.
- **Exigencia de Google Play:** Google obliga a que todas las aplicaciones publicadas o actualizadas en la Play Store tengan un `targetSdk` reciente (normalmente no superior a 1 año respecto a la última versión estable de Android).

---

### 8.2. Herramientas Esenciales de Línea de Comandos: ADB Práctico

Dentro de las *SDK Platform-Tools*, la herramienta más versátil para el desarrollador es **ADB (Android Debug Bridge)**. Permite comunicar nuestro ordenador de desarrollo con cualquier dispositivo físico o emulador conectado por USB o Wi-Fi.

Principales comandos que todo desarrollador móvil debe dominar:

```bash
# 1. Comprobar qué dispositivos o emuladores están conectados y autorizados
adb devices

# 2. Instalar una aplicación directamente (la opción -r reinstala manteniendo datos)
adb install -r app-release.apk

# 3. Desinstalar una aplicación indicando su Application ID
adb uninstall com.docente.gamevault

# 4. Ver el flujo de registros (logs) del sistema en tiempo real
adb logcat

# 5. Filtrar el logcat solo para mostrar los logs de nuestra aplicación o una etiqueta concreta
adb logcat -s "GameVaultTag"

# 6. Abrir un terminal de comandos dentro del sistema operativo del dispositivo
adb shell

# 7. Copiar archivos entre el ordenador y el móvil
adb push mi_archivo_local.json /sdcard/Download/
adb pull /sdcard/Download/captura.png ./captura_en_pc.png

# 8. Reiniciar el servidor daemon de ADB en caso de problemas de conexión
adb kill-server
adb start-server
```

---

### 8.3. Evolución de Versiones y Niveles de API de Android

| Versión de Android | Nombre Clave (Postre) | Nivel de API | Año de Lanzamiento | Hito Tecnológico Destacado |
| :---: | :---: | :---: | :---: | :--- |
| **Android 8.0 / 8.1** | Oreo | 26 / 27 | 2017 | Project Treble (modularización del SO) y límites a servicios en background. |
| **Android 9.0** | Pie | 28 | 2018 | Soporte para navegación por gestos y restricciones a la cámara en segundo plano. |
| **Android 10** | Quince Tart *(Fin de nombres públicos de postres)* | 29 | 2019 | Almacenamiento aislado (*Scoped Storage*) y soporte oficial para dispositivos plegables. |
| **Android 11** | Red Velvet Cake | 30 | 2020 | Permisos de un solo uso y burbujas de conversación nativas. |
| **Android 12 / 12L** | Snow Cone | 31 / 32 | 2021 | Rediseño radical **Material You (Material 3)** y Privacy Dashboard. |
| **Android 13** | Tiramisu | 33 | 2022 | Permiso obligatorio de notificaciones (`POST_NOTIFICATIONS`) y selector de fotos seguro. |
| **Android 14** | Upside Down Cake | 34 | 2023 | Mayor restricción a alarmas exactas y soporte avanzado para pantallas ultra HDR. |
| **Android 15** | Vanilla Ice Cream | 35 | 2024 | Espacio privado (*Private Space*), mejoras en rendimiento de renderizado y edge-to-edge forzado. |
| **Android 16** | Baklava | 36 | 2025 | Integración avanzada de modelos de IA locales (Gemini Nano) en el runtime del sistema. |

---

## 9. Entornos de Desarrollo Integrados (IDEs) para el Ecosistema Móvil

El título de esta unidad formativa hace referencia a dos pilares inseparables: la **evolución tecnológica** de las plataformas móviles y los **entornos de desarrollo** utilizados para construirlas.

Un IDE moderno para desarrollo móvil no es un mero editor de texto; es una estación de trabajo compleja que integra editor con análisis estático en tiempo real, compiladores nativos, gestor de dependencias (**Gradle**), depurador interactivo, emuladores de hardware (**AVD**) y analizadores de memoria y red.

```mermaid
graph TD
    A["IntelliJ Platform (JetBrains Engine)"] --> B["IntelliJ IDEA (Community / Ultimate)"]
    A --> C["Android Studio (Google)"]
    
    B -->|Especialización| B1["Desarrollo KMP/CMP, Backend Ktor, Web y Móvil"]
    C -->|Especialización| C1["Desarrollo Nativo Exclusivo Android y Google Play"]
    
    D["Xcode (Apple / macOS)"] -->|Obligatorio para| D1["Compilación Nativa iOS y Toolchain Apple"]
```

### 9.1. La Plataforma Común: IntelliJ IDEA y Android Studio

Para entender el panorama actual de herramientas en el ecosistema Android y Kotlin, es clave conocer un detalle de ingeniería fundamental:

> **Android Studio está desarrollado por Google sobre la base de código abierto de IntelliJ IDEA Community Edition (JetBrains).**

Por este motivo, ambos entornos comparten el mismo motor de indexación, idénticos atajos de teclado, el mismo depurador y una integración total con el lenguaje Kotlin. La elección entre uno u otro dependerá del alcance y objetivos del proyecto:

- **Android Studio (Google):** La opción de referencia si el objetivo es desarrollar exclusivamente para Android (teléfonos, tablets, Wear OS, Android Auto o Android TV). Incluye herramientas hiperespecializadas como *Layout Inspector*, *Compose Preview* nativo, *Device File Explorer* y gestión directa de emuladores dentro de pestañas de la propia ventana del IDE.

- **IntelliJ IDEA (JetBrains):** El estándar de la industria para desarrollo con **Kotlin Multiplatform (KMP)** y **Compose Multiplatform (CMP)**. Permite gestionar en una única ventana el proyecto completo: la lógica común, la aplicación Android, los servicios backend (por ejemplo en Ktor o Spring Boot) e incluso los módulos para Desktop o Web.

    Además, los estudiantes de Formación Profesional pueden solicitar una **licencia educativa gratuita de IntelliJ IDEA Ultimate**, que añade soporte avanzado para bases de datos (DataGrip integrado), perfiladores de rendimiento y herramientas web avanzadas.

- **Xcode (Apple):** Es el entorno oficial y exclusivo de macOS para compilar aplicaciones iOS en Swift/SwiftUI. En proyectos multiplataforma con KMP, Xcode es necesario para generar el empaquetado final (`.ipa`) y probar la app en los simuladores de iPhone/iPad.

---

### 9.2. Requisitos del Sistema y Virtualización Hardware

El desarrollo móvil es una de las disciplinas más exigentes en hardware para el ordenador anfitrión. Durante una sesión de trabajo habitual se ejecutan simultáneamente el IDE, el demonio en segundo plano de **Gradle**, los analizadores de código y el **emulador de Android (AVD)**, que es una máquina virtual completa ejecutando el kernel de Android.

Para trabajar de manera fluida se requieren:

- **Procesador (CPU) con Virtualización:** Es imprescindible disponer de virtualización asistida por hardware activada en la BIOS/UEFI (**Intel VT-x** o **AMD-V**). En ordenadores con procesadores **Apple Silicon (M1/M2/M3/M4)**, la virtualización es nativa (arquitectura ARM sobre ARM) y el emulador opera con un rendimiento y eficiencia extraordinarios.

- **Memoria RAM:** Se recomiendan **16 GB de RAM** como estándar de trabajo (el sistema operativo, el IDE, Gradle y el emulador consumen fácilmente entre 12 y 14 GB de memoria combinada). Si se dispone de 8 GB de RAM, se aconseja depurar directamente sobre un **dispositivo físico real conectado por USB** para no sobrecargar el equipo con el emulador.

- **Almacenamiento:** Unidad de estado sólido (**SSD**) con al menos 20-30 GB de espacio libre para alojar las imágenes de sistema del SDK y la caché local de dependencias de Gradle (`.gradle/caches`).

---

### 9.3. Guía Práctica de Configuración y Puesta a Punto

En el módulo PMDM abordamos el desarrollo desde una perspectiva profesional e interoperable, preparando al alumno tanto para proyectos Android nativos como para proyectos multiplataforma con KMP.

!!! tip "Guía Práctica Paso a Paso en el Módulo"

    Para preparar y configurar en detalle tu entorno de desarrollo, consulta la guía monográfica disponible en los apuntes:
    
    - [**Configuración de IntelliJ IDEA para Desarrollo Móvil y KMP**](../00-android/00-ide-intellij/index.md): Instalación del JDK 17, configuración del SDK de Android, creación de emuladores AVD, ajustes de memoria de Gradle y activación de licencias educativas.
    - [**Terminal Moderna y Herramientas CLI (Warp + Shell)**](../00-android/00-tools/05-terminal-warp.md): Instalación de terminales aceleradas por GPU y utilidades de línea de comandos para agilizar el flujo de trabajo con Gradle y ADB.
    - [**Estructura del Proyecto y Gradle**](../00-android/00-tools/01-gradle-agp-estructura.md): Comprensión de los archivos de configuración, plugins y version catalogs (`libs.versions.toml`).
    - [**Matriz de Compatibilidad**](../00-android/00-tools/04-matriz-compatibilidad.md): Reglas de compatibilidad entre JDK, Gradle, AGP y Kotlin.

---

## 10. Resumen y Conclusiones

A continuación se sintetizan los aprendizajes fundamentales de la unidad mediante un mapa conceptual global, las ideas fuerza en tarjetas de síntesis y una lista de autoevaluación pedagógica.

### 10.1. Mapa Conceptual de la Unidad

```mermaid
mindmap
  root((UT1: Ecosistema Móvil))
    Restricciones Físicas
      Batería finita y Doze Mode
      Memoria RAM y Low Memory Killer
      Conectividad inestable y Offline-First
      Fragmentación de pantallas y versiones
    Lenguajes y Paradigmas
      Java vs Kotlin: De la JVM a Kotlin-First
      Imperativo histórico vs Declarativo moderno
      Reactividad: UI = f(Estado)
      KMP: Lógica de negocio nativa compartida
      CMP: UI compartida multiplataforma
    Runtime y Compilación Android
      Proceso: kotlinc a bytecode y D8/R8 a DEX
      Máquina Virtual ART: Compilación híbrida AOT/JIT
      Distribución: Binarios APK vs Split AAB
      Tríada Gradle: minSdk / targetSdk / compileSdk
    Entornos de Desarrollo
      IntelliJ Platform compartida
      Android Studio: Especializado Android
      IntelliJ IDEA: KMP, Backend y Móvil
      Requisitos: 16 GB RAM y VT-x/AMD-V
```

---

### 10.2. Ideas Clave de la Unidad

<div class="grid cards" markdown>

-   :material-battery-alert:{ .lg .middle } __1. Recursos y Arquitectura Offline-First__

    ---

    La batería finita, el cierre imprevisto de procesos por el **Low Memory Killer (LMK)** y la variabilidad de la red obligan a descartar suposiciones de escritorio y diseñar con persistencia local y sincronización transparente en segundo plano.

-   :material-language-kotlin:{ .lg .middle } __2. De Java a Kotlin: La Era "Kotlin-First"__

    ---

    Tras el conflicto legal con Oracle y el estancamiento técnico de Java, Google adoptó **Kotlin** por su seguridad frente a nulos (*Null Safety*), concisión con `data class`, concurrencia estructurada con Corrutinas y por ser la base imprescindible de Jetpack Compose.

-   :material-view-quilt:{ .lg .middle } __3. Paradigma Declarativo: UI = f(Estado)__

    ---

    Tanto **Jetpack Compose** como **SwiftUI** sustituyen la mutación imperativa manual (`findViewById`) por interfaces reactivas que se recomponen automáticamente según el estado, erradicando los errores de desincronización visual.

-   :material-layers-triple:{ .lg .middle } __4. Kotlin Multiplatform (KMP)__

    ---

    Revoluciona el código compartido: compila la lógica a bytecode JVM en Android y a binario nativo vía LLVM en iOS, sin capas intermedias ni penalización de rendimiento, con el respaldo oficial conjunto de **Google y JetBrains**.

-   :material-monitor-dashboard:{ .lg .middle } __5. Compose Multiplatform (CMP)__

    ---

    Lleva la UI declarativa de Jetpack Compose más allá de Android: dibuja interfaces nativas fluidas (60/120 FPS) en iOS (Skia/Metal), Escritorio y Web sin necesidad de aprender un lenguaje adicional ni recurrir a puentes lentos.

-   :material-cog-sync:{ .lg .middle } __6. Runtime Android y Tríada de Gradle__

    ---

    El compilador D8/R8 y el runtime **ART** (con compilación híbrida AOT/JIT) maximizan la fluidez. En Gradle, dominar el suelo (`minSdk`), la promesa (`targetSdk`) y el techo (`compileSdk`) es vital para la compatibilidad.

-   :material-laptop-account:{ .lg .middle } __7. Entornos de Desarrollo (IDEs)__

    ---

    **Android Studio** e **IntelliJ IDEA** comparten el mismo motor de JetBrains. Adoptar IntelliJ IDEA en el módulo permite unificar en una sola herramienta el desarrollo Android, los proyectos KMP/CMP y los servicios backend en Kotlin.

</div>

---

### 10.3. Autoevaluación: ¿Qué debo dominar al finalizar la UT1?

!!! abstract "🎯 Checklist de Competencias Adquiridas"

    Antes de abordar la programación práctica de aplicaciones, comprueba que eres capaz de responder afirmativamente a los siguientes conceptos clave:

    - [x] **Comprendo los retos físicos del móvil:** Sé explicar por qué el sistema operativo destruye procesos en memoria (LMK) y cómo afecta el *Doze Mode* al consumo de batería.
    - [x] **Comprendo la transición histórica de Java a Kotlin:** Sé explicar las razones legales (litigio Oracle vs Google) y las ventajas técnicas (Null Safety en compilación, eliminación de *boilerplate* con `data class`, corrutinas y base obligatoria para Compose) por las que Android es oficialmente "Kotlin-First".
    - [x] **Diferencio el paradigma imperativo del declarativo:** Entiendo la fórmula reactiva **$UI = f(Estado)$** frente a la manipulación tradicional con `findViewById`.
    - [x] **Distingo KMP de otros frameworks:** Conozco la diferencia entre compilar a binario nativo (KMP), empaquetar un motor gráfico propio (Flutter) o interpretar sobre un puente JS (React Native).
    - [x] **Entiendo el ciclo de vida del producto móvil:** Sé cómo operan el aislamiento *Sandbox*, los permisos sensibles en tiempo de ejecución y las firmas criptográficas de actualización.
    - [x] **Domino la tríada de versiones de Android:** Sé exactamente qué función cumplen y qué implicaciones tienen `minSdk`, `compileSdk` y `targetSdk` en el archivo `build.gradle.kts`.
    - [x] **Conozco el proceso de compilación y ART:** Sé qué transformaciones ocurren desde el código fuente `.kt` hasta los ficheros DEX y las ventajas del modelo híbrido AOT/JIT de ART.
    - [x] **Tengo preparado mi entorno de desarrollo:** Conozco la relación técnica entre Android Studio e IntelliJ IDEA, los requisitos de virtualización del ordenador y dispongo de las herramientas de taller configuradas.
