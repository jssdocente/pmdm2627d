# Desarrollo de Aplicaciones Android con Kotlin y Jetpack Compose

En este bloque formativo abordaremos el desarrollo de aplicaciones móviles nativas modernas para Android, utilizando **Kotlin** como lenguaje oficial y **Jetpack Compose** como motor declarativo de interfaz de usuario, complementado con las recomendaciones de arquitectura de Google (**Clean Architecture**, **UDF**, **Inyección de Dependencias con Koin** y **Kotlin Multiplatform**).

---

## Enlaces de Interés y Entornos

- [Página de descarga de Android Studio](https://developer.android.com/studio?hl=es-419)
- [Kotlin Playground oficial](https://play.kotlinlang.org/)
- [Android Developers: Guía de Arquitectura de apps](https://developer.android.com/topic/architecture?hl=es-419)

---

## Estructura del Bloque Android

1. **[Fundamentos del Lenguaje Kotlin](./00-kotlin/index.md)**

    - Sintaxis básica, tipado estático, inmutabilidad y nulos seguros (*null safety*).
    - Colecciones (listas impacientes vs `Sequence` perezosas).
    - Programación asíncrona: Corrutinas, `suspend`, `Job`, `CoroutineScope` y mitigación del infierno de callbacks.
    - [Anexo: La Magia de los DSLs en Kotlin](./00-kotlin/61-dsl-en-kotlin.md).

2. **[Jetpack Compose: Desarrollo Declarativo](./00-compose/index.md)**

    - [Funciones Componibles y Modificadores](./00-compose/21-composable-functions.md)
    - [Gestión del Estado y Flujo Unidireccional (UDF)](./00-compose/22-state-management.md)
    - [Listas y Cuadrículas Perezosas (LazyLayouts)](./00-compose/23-listas-cuadriculas.md)
    - [Navegación Fuertemente Tipada (Type-Safe Navigation)](./00-compose/24-navegacion-rutas.md)
    - [Material Design 3 y Theming](./00-compose/25-material-design.md)
    - [Diseño Ágil con @Preview y Datos Mock](./00-compose/26-preview-diseno-mock.md)
    - [Contexto, CompositionLocal y Efectos Secundarios](./00-compose/27-compositionlocal-contexto-efectos.md)

3. **[Arquitectura de Software y KMP](./02-arquitectura/index.md)**

    - [Guía Oficial de Arquitectura de Google (UI, Domain, Data)](./02-arquitectura/01-guia-arquitectura-google.md)
    - [Clean Architecture en Android](./02-arquitectura/02-clean-architecture.md)
    - [Inyección de Dependencias con Koin](./02-arquitectura/03-inyeccion-dependencias-koin.md)
    - [Ecosistema Multiplataforma (KMP y CMP)](./02-arquitectura/04-ecosistema-kmp-multiplataforma.md)
    - [Glosario y Patrones Clave (ViewModel, Repository, UseCase)](./02-arquitectura/05-glosario-patrones.md)
    - [Testing en Android y KMP](./02-arquitectura/06-testing-android-kmp.md)

4. **[Entorno de Desarrollo y Herramientas](./00-ide-intellij/index.md)**

    - Configuración de Android Studio, IntelliJ IDEA, Gradle y emuladores.

---

## Codelabs y Recursos Oficiales

- [Unidad 1: Mi primera app para Android (Codelabs básicos)](https://developer.android.com/courses/android-basics-compose/unit-1?hl=es-419)
- [Unidad 2: Construir interfaz de usuario con Jetpack Compose](https://developer.android.com/courses/android-basics-compose/unit-2?hl=es-419)
- [Unidad 3: Arquitectura, colecciones y listas en Compose](https://developer.android.com/courses/android-basics-compose/unit-3?hl=es-419)
- [Unidad 4: Navegación y arquitectura de apps (ViewModel y StateFlow)](https://developer.android.com/courses/android-basics-compose/unit-4?hl=es-419)
- [Unidad 5: Obtención de datos de Internet y llamadas REST](https://developer.android.com/courses/android-basics-compose/unit-5?hl=es-419)
- [Unidad 6: Persistencia de datos local con Room](https://developer.android.com/courses/android-basics-compose/unit-6?hl=es-419)
