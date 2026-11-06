# Desarrollo de Aplicaciones Android con Kotlin y Jetpack Compose

Este bloque es la **referencia del módulo**: reúne lo que necesitas sobre Kotlin, las herramientas, Jetpack Compose y la arquitectura de una app. Las unidades de trabajo ([UT2](../02/index.md) y [UT3](../03/index.md)) marcan el orden en clase y enlazan aquí cuando hace falta profundizar en un concepto.

No hace falta leerlo de principio a fin. Búscalo cuando lo necesites.

---

## Qué necesito

| Si necesitas… | Ve a | Qué incluye |
| :--- | :--- | :--- |
| **Aprender o repasar Kotlin** | [El lenguaje Kotlin](./00-kotlin/index.md) | Apuntes, [codelab](./00-kotlin/codelabs/index.md), [laboratorio](./00-kotlin/ejercicios/index.md), [tests](./00-kotlin/testing/index.md) y prácticas online: [🎯 tipo test](../evaluacion/practica-kotlin.md) y [🧪 código y TDD](../evaluacion/practica-codigo.md) |
| **Preparar el entorno** | [IntelliJ IDEA](./00-ide-intellij/index.md) y [herramientas del proyecto](./00-tools/index.md) | El IDE, Gradle, `build.gradle`, compatibilidad de versiones, Manifest y terminal |
| **Entender un concepto de Compose** | [Jetpack Compose](./00-compose/index.md) | [Funciones componibles](./00-compose/21-composable-functions.md), [estado](./00-compose/22-state-management.md), [listas](./00-compose/23-listas-cuadriculas.md), [Material Design](./00-compose/25-material-design.md), [previews](./00-compose/26-preview-diseno-mock.md) y [`CompositionLocal`](./00-compose/27-compositionlocal-contexto-efectos.md) |
| **Organizar una app** | [Arquitectura y KMP](./02-arquitectura/index.md) | [Guía de Google](./02-arquitectura/01-guia-arquitectura-google.md), [Clean Architecture](./02-arquitectura/02-clean-architecture.md), [Koin](./02-arquitectura/03-inyeccion-dependencias-koin.md), [KMP](./02-arquitectura/04-ecosistema-kmp-multiplataforma.md), [testing](./02-arquitectura/06-testing-android-kmp.md) y [patrones de arquitectura](./02-arquitectura/05-glosario-patrones.md) |
| **Saber qué significa un término** | [Glosario](../glosario.md) | Definición breve de cada concepto del módulo y enlaces a donde se explica |
| **Resolver una tarea concreta** | Anexos | [Iconos de la app y recursos](./anexos/a-iconos-app-recursos.md) y [pantalla de inicio](./anexos/b-pantalla-inicio-splash.md) |

!!! info "¿Cómo se navega entre pantallas?"
    En clase usamos **Navigation 3**, explicado en [3B.1](../03/b-navegacion/3b.1-navigation3.md). La página de [navegación con rutas](./00-compose/24-navegacion-rutas.md) de este bloque trata Navigation Compose, la versión anterior, que te encontrarás en muchos proyectos existentes.

---

## Qué recomienda Google y qué elegimos nosotros

Conviene no mezclarlo, porque no todo lo que usamos es una recomendación oficial:

- **Recomendaciones de Google:** Kotlin, Jetpack Compose, la separación en capas y el flujo unidireccional de datos, recogidos en su [guía de arquitectura](https://developer.android.com/topic/architecture?hl=es-419).

- **Elecciones del módulo:** organizar el código con **Clean Architecture**, inyectar dependencias con **Koin** en lugar de Hilt, que es la opción de Google, y compartir código con **Kotlin Multiplatform**. Los apuntes de [Koin](./02-arquitectura/03-inyeccion-dependencias-koin.md#por-que-koin-frente-a-hilt) explican por qué.

---

## Para probar y consultar

- [Kotlin Playground](https://play.kotlinlang.org/): ejecuta código Kotlin en el navegador, sin instalar nada.

- [Guía de arquitectura de apps de Android](https://developer.android.com/topic/architecture?hl=es-419): la referencia oficial de Google.

Tienes más documentación y cursos en los [recursos de la portada](../../index.md#recursos).
