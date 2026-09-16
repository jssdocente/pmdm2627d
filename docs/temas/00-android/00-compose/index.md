# Jetpack Compose: Desarrollo Declarativo de Interfaces

**Jetpack Compose** es el kit de herramientas moderno de Google para crear interfaces de usuario nativas en Android (y en múltiples plataformas con Compose Multiplatform). Reemplaza el clásico paradigma imperativo basado en XML (`findViewById`, adaptadores de `RecyclerView`) por un **paradigma puramente declarativo y reactivo**, donde la UI se describe como una función directa del estado: `UI = f(State)`.

---

## Características Principales

- **Paradigma Declarativo:** Defines la pantalla describiendo cómo debe representarse para un estado dado. Cuando el estado cambia, el compilador de Compose ejecuta de forma inteligente y selectiva la **recomposición** de los elementos afectados.
- **Funciones Componibles (`@Composable`):** La UI se estructura a partir de funciones estándar de Kotlin anotadas con `@Composable`. Son modulares, testeables y altamente reutilizables mediante *State Hoisting* y modificadores.
- **Flujo Unidireccional de Datos (UDF):** El estado desciende hacia los componentes visuales y los eventos ascienden hacia los gestores de estado (*ViewModels*), garantizando una arquitectura predecible y desacoplada.
- **Material Design 3 (Material You):** Integración completa y nativa con componentes M3, paletas adaptativas dinámicas según el sistema operativo y jerarquías tonales modernas.
- **Type-Safe Navigation:** Enrutamiento entre pantallas con chequeo estricto de tipos en compilación utilizando `@Serializable` de `kotlinx.serialization`.

---

## Contenido del Módulo

- **[1. Funciones Componibles y Modificadores](./21-composable-functions.md):** Fundamentos de `@Composable`, ciclo de recomposición, anatomía de modificadores y layout containers (`Column`, `Row`, `Box`).
- **[2. Gestión de Estado y UDF](./22-state-management.md):** `remember`, `mutableStateOf`, `rememberSaveable`, elevación de estado (*State Hoisting*), modelado inmutable de `UiState` y consumo de `StateFlow` con `collectAsStateWithLifecycle()`.
- **[3. Listas y Cuadrículas Perezosas](./23-listas-cuadriculas.md):** `LazyColumn`, `LazyRow`, `LazyVerticalGrid` adaptativas, rendimiento óptimo con claves únicas (`key`), animaciones con `Modifier.animateItem()` y control de desplazamiento.
- **[4. Navegación Fuertemente Tipada](./24-navegacion-rutas.md):** `NavHost` tipado con Navigation Compose 2.8+, paso seguro de argumentos serializables y desacoplamiento de vistas mediante lambdas.
- **[5. Material Design 3 y Theming](./25-material-design.md):** `MaterialTheme`, `lightColorScheme`/`darkColorScheme`, color dinámico, estructura con `Scaffold` M3 y componentes clave.
- **[6. Diseño Ágil con @Preview y Datos Mock](./26-preview-diseno-mock.md):** Metodología *Preview-Driven Development*, desacoplamiento Stateful vs Stateless, previsualización de temas y proveedores dinámicos con `@PreviewParameter`.
- **[7. Contexto, CompositionLocal y Efectos Secundarios](./27-compositionlocal-contexto-efectos.md):** Ciclo de vida del `Context` (Application vs Activity), mitigación de fugas de memoria, inyección en el árbol visual con `CompositionLocalProvider` y control de operaciones asíncronas con `LaunchedEffect` y `DisposableEffect`.

---

## Conexión con la Arquitectura Global

En aplicaciones de producción, Compose se encarga exclusivamente de la capa de presentación (*UI Layer*). Para aprender a estructurar los flujos de datos con Clean Architecture, inyección de dependencias con Koin y preparación para Kotlin Multiplatform, consulta el módulo hermano:

- **[Módulo de Arquitectura y KMP con Koin](../02-arquitectura/index.md)**
- **[Guía Oficial de Arquitectura de Google](../02-arquitectura/01-guia-arquitectura-google.md)**
- **[Inyección de Dependencias con Koin](../02-arquitectura/03-inyeccion-dependencias-koin.md)**

---

## Videotutoriales y Demostraciones

!!! info "Creación de un proyecto Android y estructura básica"
    <iframe width="560" height="315" src="https://www.youtube.com/embed/TraKFKUD2lU?si=_lOZXVtTSkWVectx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

!!! info "Lógica de actividades e introducción al ciclo de vida"
    <iframe width="560" height="315" src="https://www.youtube.com/embed/r7dsQTeTN4E?si=MketZH4wNJws48jq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Recursos Adicionales

- [Documentación oficial de Jetpack Compose (Google Developers)](https://developer.android.com/jetpack/compose?hl=es-419)
- [Codelabs oficiales de Android Basics with Compose](https://developer.android.com/courses/android-basics-compose/unit-1?hl=es-419)
- [Repositorio de ejemplos oficiales (Android Architecture Samples)](https://github.com/android/architecture-samples)
