# Actividades de Aprendizaje: Laboratorio de Kotlin (`pmdm-kotlin-lab`)

¡Bienvenido al bloque práctico de programación en Kotlin! Este repositorio de actividades está diseñado para que afiances de forma progresiva, rigurosa y aplicada todos los conceptos del lenguaje necesarios para abordar el desarrollo en Android con **Jetpack Compose**.

---

## 🛠️ Entorno de Trabajo: Un Único Proyecto en IntelliJ IDEA

Para maximizar el tiempo de práctica y evitar crear decenas de proyectos independientes, **todas las actividades del curso se desarrollarán dentro de un único proyecto Kotlin/JVM en IntelliJ IDEA**, estructurado limpiamente mediante paquetes temáticos (`package`):

```text
pmdm-kotlin-lab/
├── build.gradle.kts (configuración con dependencias)
└── src/
    ├── main/kotlin/                  <-- CÓDIGO DE PRODUCCIÓN (Ejercicios y Retos jugables)
    │   ├── b01_fundamentos/          <-- Bloque 1: Variables, Inmutabilidad y When
    │   ├── b02_funciones_lambdas/    <-- Bloque 2: Lambdas y Null Safety
    │   ├── b03_poo_sealed/           <-- Bloque 3: POO, Data Classes y Sealed Types
    │   ├── b04_colecciones/          <-- Bloque 4: Colecciones y Scope Functions
    │   ├── b05_corrutinas/           <-- Bloque 5: Asincronía con Corrutinas
    │   └── b06_proyecto_integrador/  <-- Proyecto Final: GameVault CLI
    │
    └── test/kotlin/                  <-- PRUEBAS AUTOMATIZADAS (Suites de Tests Unitarios)
        └── b01_fundamentos/          <-- Tests con kotlin.test y JUnit
```

### Paso 1: Creación del Proyecto en IntelliJ IDEA

1. Abre IntelliJ IDEA y selecciona **New Project**.

2. En el panel izquierdo de generadores, asegúrate de tener seleccionado **Kotlin**.

3. Configura los campos principales de la ventana:

    - **Name:** `pmdm-kotlin-lab`
    - **Location:** Directorio de trabajo local donde guardes tus prácticas del módulo.
    - **Build system:** `Gradle` *(el sistema oficial de compilación y empaquetado en el ecosistema Android)*.
    - **JDK:** Java 17 o superior (**Java 21 recomendado**).
    - **Gradle DSL:** `Kotlin` *(utiliza `build.gradle.kts` con tipado estático, autocompletado y validación de errores en tiempo de edición)*.
    - **Add sample code:** ❌ *Desmarcado* (para evitar la creación de archivos `Main.kt` genéricos en la raíz).
    - **Generate multi-module build:** ❌ *Desmarcado*.

4. Despliega la pestaña **Advanced Settings** y configura:

    - **Gradle distribution:** Selecciona siempre **`Wrapper`**.
    - **Gradle version:** `Auto-select` (o la versión propuesta por el IDE).
    - **GroupId:** Identificador de grupo en notación de dominio inverso (ej. `es.ies.pmdm` o `com.tu_apellido`).
    - **ArtifactId:** `pmdm-kotlin-lab`.

5. Haz clic en **Create**.

!!! info "💡 ¿Por qué es vital usar Gradle `Wrapper` en lugar de `Local installation`?"
    - **Gradle Wrapper (`./gradlew`):** Es el estándar absoluto en la industria profesional y en Android. Genera en la raíz del proyecto los ejecutables `./gradlew` (macOS/Linux), `gradlew.bat` (Windows) y `gradle/wrapper/gradle-wrapper.properties`.
    - **Cero dependencias locales:** El alumno **no necesita tener Gradle instalado en su sistema operativo**. La primera vez que compila o sincroniza, el propio Wrapper descarga automáticamente la versión exacta requerida.
    - **Entorno homogéneo y reproducible:** Garantiza que el código compile de forma idéntica en cualquier sistema operativo (Windows, Mac o Linux) y nos permitirá ejecutar las suites de pruebas automatizadas desde la terminal con `./gradlew test`.

### Paso 2: Anatomía y Propósito de los Archivos del Proyecto

Una vez generado el proyecto, IntelliJ IDEA mostrará en el explorador de archivos izquierdo la siguiente estructura de ficheros:

```text
pmdm-kotlin-lab/
├── .gradle/             <-- Caché interna y metadatos del motor de compilación Gradle
├── .idea/               <-- Configuración interna del proyecto en IntelliJ IDEA
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar         <-- Binario ejecutable que descarga Gradle
│       └── gradle-wrapper.properties  <-- Especifica la versión exacta de Gradle a usar
├── src/
│   ├── main/
│   │   └── kotlin/      <-- Código fuente de la aplicación (nuestros ejercicios y retos)
│   └── test/
│       └── kotlin/      <-- Pruebas unitarias automatizadas (JUnit / kotlin.test)
├── .gitignore           <-- Archivos temporales y de caché que Git debe ignorar
├── build.gradle.kts     <-- Script principal de compilación, plugins y dependencias
├── gradle.properties    <-- Parámetros de la JVM y rendimiento del demonio de Gradle
├── gradlew              <-- Script ejecutable de consola para macOS y Linux
├── gradlew.bat          <-- Script ejecutable por lotes para Windows
└── settings.gradle.kts  <-- Configuración global inicial del proyecto y módulos
```

#### ¿Qué función cumple cada archivo?

- **`settings.gradle.kts` (Configuración Inicial):**  
  Es el **primer archivo** que Gradle lee al arrancar. Define el nombre del proyecto raíz (`rootProject.name = "pmdm-kotlin-lab"`) y los repositorios globales para descargar plugins. En proyectos más avanzados o en Android, aquí se declaran también los submódulos que componen la aplicación (`include(":app")`).

- **`build.gradle.kts` (El Script Principal de Construcción):**  
  Es el archivo más importante para el programador. En él se configuran:
    - Los **plugins** necesarios (por ejemplo, el plugin oficial de Kotlin para JVM).
    - La versión de **Java** de destino.
    - Los **repositorios** de descarga de librerías (`mavenCentral()`).
    - Las **dependencias externas** que requiere nuestro código (como la biblioteca oficial de Corrutinas o las herramientas de testing).

- **`gradlew` (macOS/Linux) y `gradlew.bat` (Windows):**  
  Son los scripts ejecutables del **Gradle Wrapper**. Permiten compilar el proyecto o ejecutar tareas por consola (`./gradlew test`, `./gradlew build`) desde cualquier terminal, sin necesidad de abrir IntelliJ IDEA y sin tener Gradle preinstalado en el ordenador.

- **Carpeta `gradle/wrapper/`:**  
  Aloja el archivo `gradle-wrapper.properties`, que indica la URL oficial y la versión binaria de Gradle que debe descargarse, junto con el archivo auxiliar `gradle-wrapper.jar`. Ambos deben estar siempre incluidos en el repositorio de control de versiones.

- **`gradle.properties`:**  
  Permite definir parámetros de configuración para la máquina virtual de Java que ejecuta Gradle, como la memoria RAM máxima asignada al demonio de compilación (`org.gradle.jvmargs=-Xmx2048m`).

- **Estructura de Directorios `src/`:**  
  Sigue la convención estándar adoptada universalmente por Maven y Gradle:
    - **`src/main/kotlin/`:** Directorio raíz de nuestro código fuente. Aquí crearemos los paquetes temáticos del curso (`b01_fundamentos`, `b02_funciones_lambdas`, etc.).
    - **`src/test/kotlin/`:** Directorio reservado exclusivamente para las suites de pruebas unitarias automatizadas con `kotlin.test` y JUnit.

- **Carpetas Ocultas (`.gradle/` y `.idea/`):**  
  Son generadas automáticamente por las herramientas para guardar cachés locales, índices de búsqueda y configuraciones del editor. **Nunca deben modificarse manualmente ni subirse a Git** (ya vienen convenientemente ignoradas dentro del archivo `.gitignore`).

---

### Paso 3: Configuración de Dependencias en `build.gradle.kts`

Abre el archivo `build.gradle.kts` generado en la raíz del proyecto y comprueba que incluya la configuración base y la biblioteca de corrutinas para los bloques avanzados:

```kotlin
plugins {
    kotlin("jvm") version "2.1.0" // O la versión generada por el asistente (ej. 2.x)
    application
}

group = "es.ies.pmdm"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Biblioteca de Corrutinas para pruebas en consola (Bloques 5 y 6)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

// Permite ejecutar cualquier archivo con: ./gradlew ejecutar -P clase=...
tasks.register<JavaExec>("ejecutar") {
    group = "application"
    description = "Ejecuta cualquier fichero Kotlin con fun main()"
    classpath = sourceSets["main"].runtimeClasspath

    // Toma la clase indicada con -P clase=... (o -Pclase=...)
    val targetClass = project.findProperty("clase") as? String
        ?: ""

    if (targetClass.isNotEmpty()) {
        mainClass.set(targetClass)
    }
}
```

??? info "🔍 Anatomía detallada: ¿Qué hace cada línea de `build.gradle.kts` y por qué es imprescindible?"
    
    - **`plugins { kotlin("jvm") version "..." }` (Motor del Lenguaje):**  
      Gradle es un motor genérico que desconoce qué es Kotlin. Esta línea descarga el compilador oficial de JetBrains (`kotlinc`) y "enseña" a Gradle cómo compilar los archivos `.kt` hacia bytecode de la Máquina Virtual de Java (`.class`).  
      *(📖 **Referencia con Android:** En el módulo de desarrollo móvil utilizaremos el plugin de aplicaciones Android `com.android.application` junto al plugin del compilador de Compose, como se explica en profundidad en [Herramientas: Anatomía de build.gradle.kts](../../00-tools/02-build-gradle.md). En este laboratorio inicial usamos `kotlin("jvm")` porque ejecutamos algoritmos y lógica de consola sin necesidad de emuladores).*

    - **`application` (Empaquetado y Ejecución):**  
      Plugin auxiliar de Gradle que añade capacidades de ejecución de aplicaciones en la JVM.

    - **`group` y `version` (Metadatos del Proyecto):**  
      Establecen las coordenadas Maven del proyecto. `group` identifica al autor u organización (`es.ies.pmdm`), y `version` gestiona el versionado semántico del código.

    - **`repositories { mavenCentral() }` (Almacén de Librerías):**  
      Indica a Gradle el servidor seguro en la nube de donde debe descargar automáticamente las dependencias externas (bibliotecas JAR) sin tener que copiarlas a mano.

    - **`dependencies { ... }` (Librerías Externas):**  
      Aquí se declaran las herramientas que necesita el proyecto:
        - `implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")`: Descarga la librería oficial de **corrutinas y programación reactiva (`StateFlow`)**, esencial para resolver los retos asíncronos del Bloque 5 y el proyecto integrador.
        - `testImplementation(kotlin("test"))`: Proporciona las funciones de aserción estándar (`assertEquals`, `assertTrue`) para verificar la corrección del código en `src/test/kotlin/`.

    - **`tasks.test { useJUnitPlatform() }` (Motor de Testing):**  
      Configura la tarea de ejecución de pruebas para que utilice el motor moderno **JUnit Platform (JUnit 5)**, permitiendo que `./gradlew test` genere los informes interactivos de calidad en formato HTML.

    - **`tasks.register<JavaExec>("ejecutar") { ... }` (Lanzador Dinámico de Ejercicios):**  
      Registra una tarea personalizada de ejecución Java. Permite pasarle por parámetro cualquier archivo `.kt` del proyecto (con `-P clase=...`) sin tener que modificar el archivo `build.gradle.kts` cada vez que quieras probar un ejercicio diferente.

Haz clic en el icono del elefante de Gradle con la flecha azul (o pulsa `Ctrl + Shift + O` en Windows/Linux o `Cmd + Shift + I` en macOS) para sincronizar las dependencias.

---

### Paso 4: Dos Formas de Ejecutar tus Ejercicios

Una vez sincronizado el proyecto, puedes ejecutar cualquier ejercicio tanto desde el entorno visual como desde la terminal:

#### 1. Desde el Entorno Gráfico (IntelliJ IDEA)
En cualquier archivo `.kt` que contenga una función `fun main()`, verás un **icono verde de reproducción (▶)** en el margen izquierdo del editor. Haz clic sobre él y selecciona **Run**.

#### 2. Desde la Terminal con Gradle Wrapper
Para ejecutar cualquier ejercicio directamente desde la línea de comandos, utiliza la tarea `ejecutar` pasando el nombre completo de la clase mediante `-P clase=...`:

!!! tip "💡 La Regla del sufijo `Kt` en Bytecode"
    En Kotlin, cuando un archivo contiene directamente funciones como `fun main()` sin una `class` exterior, el compilador genera internamente una clase en la JVM añadiendo el sufijo **`Kt`** al nombre del fichero:
    
    - **Fichero fuente:** `src/main/kotlin/b01_fundamentos/E00_CalentamientoFundamentos.kt`
    - **Nombre de clase compilada:** `b01_fundamentos.E00_CalentamientoFundamentosKt`

Abre tu terminal en la raíz de `pmdm-kotlin-lab` y ejecuta el comando según tu sistema operativo:

=== "macOS / Linux"
    ```bash
    ./gradlew ejecutar -P clase=b01_fundamentos.E00_CalentamientoFundamentosKt
    ```

=== "Windows (CMD / PowerShell)"
    ```cmd
    gradlew.bat ejecutar -P clase=b01_fundamentos.E00_CalentamientoFundamentosKt
    ```

*(Gradle compilará automáticamente los cambios que hayas hecho en el código, configurará el classpath con todas las librerías necesarias y mostrará la salida en la terminal).*

---

## 🚦 Niveles de Dificultad y Metodología de Andamiaje Cognitivo

Cada módulo temático contiene una amplia batería graduada de actividades estructurada en 4 fases para adaptarse al ritmo de cada estudiante:

- 🌱 **Fase 0: Calentamiento Guiado ("Gimnasio de Sintaxis"):** Batería inicial de micro-ejercicios atómicos (con prefijo `E00_`) para romper mano rápidamente. Incluye ejercicios modelo resueltos con **pestañas comparativas `Kotlin` vs `Java`** para anclar el nuevo lenguaje sobre los conocimientos de 1º de DAM, seguidos de retos cortos con solución oculta.
- 🟢 **Nivel Básico (Consolidación):** Ejercicios guiados para mecanizar la sintaxis idiomática de Kotlin, el tipado y notar la diferencia respecto a Java.
- 🟡 **Nivel Intermedio (Aplicación):** Problemas de lógica que requieren aplicar inmutabilidad, control de nulos, funciones de orden superior o transformaciones funcionales sin código repetitivo.
- 🔴 **Nivel Avanzado (Reto Lúdico Incremental):** Cada bloque culmina con un **juego interactivo** que ensambla todas las piezas vistas hasta ese momento. Cada reto incluye:

    - 📊 **Diagrama Mermaid** (flujo de control o arquitectura de datos) para enseñar al alumno a modelar el problema antes de escribir código.
    - 🧠 **Preguntas de reflexión previa** para desarrollar pensamiento crítico y algorítmico.
    - 💡 **Pistas progresivas desplegables** que guían la resolución paso a paso sin desvelar la solución de golpe.

!!! tip "Cómo ejecutar cada ejercicio de forma independiente"
    Cada archivo `.kt` incluye su propia función `fun main()`. En IntelliJ IDEA, verás un **icono verde de reproducción (▶)** en el margen izquierdo junto a `fun main()`. Puedes ejecutar cualquier ejercicio individualmente sin interferir con los demás.

---

## 📚 Itinerario de Módulos Prácticos y Retos Incrementales

1. **[Bloque 1: Fundamentos, Inmutabilidad y Control de Flujo](./01-fundamentos-inmutabilidad.md)**  
   *Paquete:* `b01_fundamentos`  
   📖 **Teoría de referencia:** [Variables y Tipos de Datos](../11-variables-tipos-datos.md), [Expresiones](../12-expresiones-vs-sentencias.md) y [Control de Flujo con When](../12.1-when.md)  
   🎮 **Reto Lúdico:** *Combate RPG por Turnos: Héroe vs Dragón Carmesí* (Diagrama de Estados)

2. **[Bloque 2: Funciones, Lambdas y Null Safety](./02-funciones-lambdas-nullsafety.md)**  
   *Paquete:* `b02_funciones_lambdas`  
   📖 **Teoría de referencia:** [Funciones y Lambdas](../13-funciones-lambdas.md) y [Null Safety](../14-null-safety.md)  
   🎮 **Reto Lúdico:** *El Juego del Ahorcado Funcional (Hangman)* (Diagrama de Flujo Puro)

3. **[Bloque 3: POO, Data Classes y Tipos Sellados (UiState)](./03-poo-sealed-types.md)**  
   *Paquete:* `b03_poo_sealed`  
   📖 **Teoría de referencia:** [POO](../21-poo.md), [Data Classes](../23-data-classes.md), [Enum Classes](../24-enum-classes.md) y [Sealed Classes](../26-sealed-classes.md)  
   🎮 **Reto Lúdico:** *El Motor de Wordle en Consola* (Diagrama de Clases y Dominio)

4. **[Bloque 4: Colecciones Funcionales y Scope Functions](./04-colecciones-scope-functions.md)**  
   *Paquete:* `b04_colecciones`  
   📖 **Teoría de referencia:** [Arrays](../41-arrays.md), [Listas](../42-listas.md), [Maps](../43-maps.md), [Sets](../44-sets.md) y [Scope Functions](../31-scope-functions.md)  
   🎮 **Reto Lúdico:** *Deck Builder RPG: Saqueo y Forja de Cartas* (Diagrama de Pipeline Funcional)

5. **[Bloque 5: Programación Asíncrona con Corrutinas y Flows](./05-concurrencia-corrutinas.md)**  
   *Paquete:* `b05_corrutinas`  
   📖 **Teoría de referencia:** [Corrutinas y Funciones de Suspensión](../51-corrutinas.md) y [Flujos Asíncronos (Flow)](../52-flows.md)  
   🎮 **Reto Lúdico:** *Carrera Espacial Galáctica en Tiempo Real* (Diagrama de Concurrencia y StateFlow)

6. **[Bloque 6: Proyecto Integrador Final ("El Juego del Calamar")](./06-proyecto-integrador.md)**  
   *Paquete:* `b06_proyecto_integrador`  
   📖 **Teoría de referencia:** [Data Classes](../23-data-classes.md), [Sealed Interfaces](../26-sealed-classes.md), [Flows Reactivos](../52-flows.md) y [Corrutinas](../51-corrutinas.md)  
   🦑 **Reto Acumulativo:** *Simulador "Luz Roja, Luz Verde" - 50m* (Clean Architecture + Flow Engine)

---

## 🧪 Pruebas Unitarias y Automatización con Gradle (`src/test`)

Cada uno de los retos lúdicos implementados en consola cuenta con una contrapartida orientada a la calidad y la ingeniería de software profesional en la sección **Testing de Retos**:

- Aprende a refactorizar tus programas en **funciones puras** deterministas.
- Diseña matrices de prueba que cubran casos límite (*edge cases*) y eviten regresiones.
- Automatiza la suite completa con `./gradlew test` y visualiza los informes HTML generados por Gradle.

👉 **[Consultar la Guía de Testing Unitario y Automatización con Gradle](../testing/index.md)**
