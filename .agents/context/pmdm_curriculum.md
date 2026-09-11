# Plan de Estudios y Currículo: Módulo PMDM (2º DAM)

## 1. Identificación y Objetivos Formativos

- **Módulo:** Programación Multimedia y Dispositivos Móviles (Código oficial FP: PMDM).
- **Ciclo:** Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM).
- **Temporalización:** Segundo curso académico, Trimestres 1 y 2 (160 horas lectivas totales, 4 horas semanales).
- **Objetivo general:** Capacitar al alumnado para diseñar, desarrollar y desplegar aplicaciones nativas para dispositivos móviles y aplicaciones interactivas/videojuegos multimedia, aplicando arquitecturas modernas, patrones de diseño de la industria y buenas prácticas de ingeniería de software.

---

## 2. Bloque 1: Desarrollo de Aplicaciones Android (Nativo)

Este bloque ocupa la mayor parte del curso y se centra en el ecosistema Android moderno promovido por Google.

### 2.1. Lenguaje Kotlin
Los alumnos proceden de 1º de DAM con base sólida en Java y Programación Orientada a Objetos. La transición a Kotlin profundiza en:
- **Inmutabilidad y Null Safety:** `val` vs `var`, tipos anulables `String?`, operador elvis `?:`, safe call `?.`, smart casts.
- **Sintaxis Expresiva:** Expresiones vs sentencias, estructuras de control avanzadas (`when`), lambdas y funciones de orden superior.
- **POO Avanzada en Kotlin:** Data classes, sealed classes/interfaces, enum classes, objetos anónimos y Singletons (`object`), herencia y delegación.
- **Colecciones y Operaciones Funcionales:** Listas, Sets, Maps, transformaciones (`map`, `filter`, `fold`, `flatMap`).
- **Scope Functions:** `let`, `run`, `apply`, `also`, `with` y sus casos de uso.
- **Concurrencia Asíncrona:** Corrutinas de Kotlin (`suspend functions`, `Dispatchers`, `CoroutineScope`, `launch`, `async`).

### 2.2. Entorno y Herramientas Android
- **Android Studio:** Configuración del SDK, emuladores (AVD), depuración, Profiler y Logcat.
- **Sistema de compilación Gradle:** Estructura modular, plugins de Android (AGP), dependencias y catálogos de versiones (`libs.versions.toml`).
- **Archivo AndroidManifest.xml:** Declaración de componentes (Activities), permisos normales y peligrosos, metadatos y configuración de la aplicación.

### 2.3. Interfaz de Usuario Declarativa con Jetpack Compose
- **Fundamentos Declarativos:** Paradigma declarativo vs imperativo (XML tradicional). Funciones `@Composable`.
- **Gestión del Estado:** State hoisting, `remember`, `rememberSaveable`, `mutableStateOf`, flujo unidireccional de datos (UDF).
- **Diseño y Maquetación:** `Box`, `Column`, `Row`, Modifiers (`padding`, `fillMaxWidth`, `clickable`, etc.).
- **Listas y Cuadrículas Eficientes:** `LazyColumn`, `LazyRow`, `LazyVerticalGrid` y optimización de rendimiento.
- **Navegación:** Navigation Compose, grafo de navegación, paso de argumentos tipados y buenas prácticas de rutas.
- **Sistema de Diseño:** Material Design 3 (Material You), temas (`Theme.kt`), paletas de color dinámicas, tipografía, formas y componentes visuales (`Scaffold`, `TopAppBar`, `FloatingActionButton`, etc.).

### 2.4. Arquitectura y Persistencia
- **Patrón MVVM / Arquitectura Recomendada por Google:** Separación en capas (UI Layer, Domain Layer, Data Layer), uso de `ViewModel`, `StateFlow` y eventos unidireccionales.
- **Persistencia Local con Room:** Entidades (`@Entity`), DAOs (`@Dao`), base de datos (`@Database`), operaciones CRUD asíncronas con corrutinas.
- **Inyección de Dependencias:** Inversión de control y DI ligero con **Koin** (módulos, inyección en ViewModels).
- **Conectividad de Red y APIs:** Consumo de APIs REST (Retrofit / Ktor Client), serialización JSON (Kotlinx Serialization / Moshi).
- **Servicios Cloud / Backend as a Service:** Integración con **Firebase** (Firebase Authentication, Firestore).
- **Empaquetado y Distribución:** Generación de artefactos (APK / Android App Bundle - AAB), firma de apps y preparación para Google Play Store.

### 2.5. Proyecto Guía: GameVault
Proyecto de referencia desarrollado de forma incremental a lo largo de las clases:
- Gestión de catálogo de videojuegos personales.
- Autenticación con email/contraseña y Google Sign-In mediante Firebase.
- Almacenamiento local de biblioteca personal con Room.
- Consulta de APIs externas de videojuegos para búsqueda e importación.
- Soporte para temas oscuro/claro y multiidioma (internacionalización `strings.xml`).

---

## 3. Bloque 2: Programación Multimedia y Videojuegos (Unity + C#)

Este bloque aborda los conceptos de desarrollo multimedia interactivo y motores de juegos:
- **Conceptos Fundamentales de Motores de Videojuegos:** Bucle de juego (Game Loop), escenas, GameObjects, Componentes y Prefabs.
- **Lenguaje C# aplicado a Unity:** Scripts de comportamiento (`MonoBehaviour`), métodos de ciclo de vida (`Awake`, `Start`, `Update`, `FixedUpdate`).
- **Físicas y Colisiones:** Rigidbodies, Colliders, detección de eventos (`OnCollisionEnter`, `OnTriggerEnter`).
- **Entrada del Usuario (Input System):** Manejo de controles táctiles para dispositivos móviles y teclado/gamepad.
- **UI en Videojuegos:** Canvas, paneles, HUD de puntuación y vidas, menús interactivos.
- **Audio y Efectos:** AudioSource, AudioListener, gestión de efectos sonoros y música de fondo.
- **Despliegue Multiplataforma:** Build para Android y WebGL.
