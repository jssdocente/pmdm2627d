# Actividades de Aprendizaje: Laboratorio de Kotlin (`pmdm-kotlin-lab`)

¡Bienvenido al bloque práctico de programación en Kotlin! Este repositorio de actividades está diseñado para que afiances de forma progresiva, rigurosa y aplicada todos los conceptos del lenguaje necesarios para abordar el desarrollo en Android con **Jetpack Compose**.

---

## 🛠️ Entorno de Trabajo: Un Único Proyecto en IntelliJ IDEA

Para maximizar el tiempo de práctica y evitar crear decenas de proyectos independientes, **todas las actividades del curso se desarrollarán dentro de un único proyecto Kotlin/JVM en IntelliJ IDEA**, estructurado limpiamente mediante paquetes temáticos (`package`):

```text
pmdm-kotlin-lab/
├── build.gradle.kts (configuración con dependencias)
└── src/
    └── main/
        └── kotlin/
            ├── b01_fundamentos/          <-- Bloque 1: Variables, Inmutabilidad y When
            ├── b02_funciones_lambdas/    <-- Bloque 2: Lambdas y Null Safety
            ├── b03_poo_sealed/           <-- Bloque 3: POO, Data Classes y Sealed Types
            ├── b04_colecciones/          <-- Bloque 4: Colecciones y Scope Functions
            ├── b05_corrutinas/           <-- Bloque 5: Asincronía con Corrutinas
            └── b06_proyecto_integrador/  <-- Proyecto Final Acumulativo: GameVault CLI
```

### Paso 1: Creación del Proyecto en IntelliJ IDEA
1. Abre IntelliJ IDEA y selecciona **New Project**.
2. **Name:** `pmdm-kotlin-lab`
3. **Language:** `Kotlin`
4. **Build system:** `Gradle`
5. **JDK:** Java 17 o superior (Java 21 recomendado).
6. Haz clic en **Create**.

### Paso 2: Archivo `build.gradle.kts`
Abre el archivo `build.gradle.kts` generado en la raíz del proyecto y asegúrate de que incluya la dependencia oficial de corrutinas para los ejercicios avanzados:

```kotlin
plugins {
    kotlin("jvm") version "1.9.24" // O versión actual instalada
    application
}

group = "es.ies.pmdm"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Biblioteca de Corrutinas para pruebas en consola (Bloque 5 y 6)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```

Haz clic en el icono del elefante de Gradle con la flecha azul (o pulsa `Ctrl + Shift + O` / `Cmd + Shift + I`) para sincronizar las dependencias.

---

## 🚦 Niveles de Dificultad y Metodología

Cada módulo temático contiene entre **5 y 6 actividades graduadas** para adaptarse al ritmo de cada estudiante:

- 🟢 **Nivel Básico (Consolidación):** Ejercicios guiados para mecanizar la sintaxis idiomática de Kotlin y notar la diferencia respecto a Java.
- 🟡 **Nivel Intermedio (Aplicación):** Problemas de lógica que requieren aplicar inmutabilidad, control de nulos o transformaciones funcionales sin código repetitivo.
- 🔴 **Nivel Avanzado (Ampliación y Reto Móvil):** Pequeños programas completos y casos reales pensados para estudiantes que avanzan con mayor rapidez.

!!! tip "Cómo ejecutar cada ejercicio de forma independiente"
    Cada archivo `.kt` incluye su propia función `fun main()`. En IntelliJ IDEA, verás un **icono verde de reproducción (▶)** en el margen izquierdo junto a `fun main()`. Puedes ejecutar cualquier ejercicio individualmente sin interferir con los demás.

---

## 📚 Itinerario de Módulos Prácticos

1. **[Bloque 1: Fundamentos, Inmutabilidad y Control de Flujo](./01-fundamentos-inmutabilidad.md)**
   *Paquete:* `b01_fundamentos`
2. **[Bloque 2: Funciones, Lambdas y Null Safety](./02-funciones-lambdas-nullsafety.md)**
   *Paquete:* `b02_funciones_lambdas`
3. **[Bloque 3: POO, Data Classes y Tipos Sellados (UiState)](./03-poo-sealed-types.md)**
   *Paquete:* `b03_poo_sealed`
4. **[Bloque 4: Colecciones Funcionales y Scope Functions](./04-colecciones-scope-functions.md)**
   *Paquete:* `b04_colecciones`
5. **[Bloque 5: Programación Asíncrona con Corrutinas](./05-concurrencia-corrutinas.md)**
   *Paquete:* `b05_corrutinas`
6. **[Bloque 6: Proyecto Integrador Final (GameVault CLI)](./06-proyecto-integrador.md)**
   *Paquete:* `b06_proyecto_integrador`
