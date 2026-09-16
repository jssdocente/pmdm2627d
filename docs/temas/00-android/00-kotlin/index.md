# El Lenguaje Kotlin: De Java al Desarrollo Móvil Moderno

Kotlin es un lenguaje de programación moderno, conciso y seguro que se ejecuta en la Máquina Virtual de Java (JVM) y se compila también a JavaScript o código nativo (Kotlin Multiplatform). Desarrollado por JetBrains y adoptado por Google en 2017 como el **lenguaje preferido (*Kotlin-First*) para el desarrollo de aplicaciones Android**, Kotlin sitúa a la **inmutabilidad**, la **seguridad contra nulos** y el **paradigma declarativo** en el núcleo de su arquitectura.

Este bloque formativo está diseñado específicamente para alumnos de 2º de DAM que ya poseen una base sólida en Java y Programación Orientada a Objetos, guiando la transición hacia la sintaxis idiomática requerida por **Jetpack Compose**, **Corrutinas** y la arquitectura recomendada por Google.

---

## 🧭 Mapa de Contenidos

### Fundamentos y Seguridad

- **[Variables, Tipos de Datos e Inmutabilidad](./11-variables-tipos-datos.md):** `val` vs `var`, por qué la inmutabilidad es crítica en entornos móviles, tipos numéricos, String templates y `lateinit` vs `by lazy`.
- **[Control de Flujo: Expresiones y When](./12.1-when.md):** `if` como expresión, `when` exhaustivo, smart casting y comprobación de rangos.
- **[Funciones y Lambdas (El Motor de Compose)](./13-funciones-lambdas.md):** Tipos de función, trailing lambdas, elevación del estado (*State Hoisting*) y lambdas con receptor.
- **[Seguridad contra Nulos (Null Safety)](./14-null-safety.md):** Eliminación del `NullPointerException`, operadores `?.`, `?:`, `as?` y el modismo `objeto?.let { ... }`.

### Programación Orientada a Objetos y Modelado

- **[POO Idiomática en Kotlin](./21-poo.md):** Constructores primarios en cabecera, bloque `init`, propiedades con `field`, clases `open` y `final` por defecto.
- **[Singletons, Companion Object y Objetos Anónimos](./22-objetos-anonimos.md):** Declaraciones de objeto (`object`), sustitución de `static` con `companion object` y expresiones anónimas.
- **[Clases de Datos (Data Classes)](./23-data-classes.md):** Modelado de entidades, generación de `copy()` y derivación de estados inmutables.
- **[Clases de Enumeración (Enum Classes)](./24-enum-classes.md):** Constantes con métodos, propiedad moderna `.entries` y `when` exhaustivo.
- **[Tipos Sellados e Interfaces (Patrón UI State)](./26-sealed-classes.md):** `sealed interface`, `data object` y modelado arquitectural del estado de pantalla en Android.
- **[Genéricos y Varianza](./25-genericos.md):** Clases y funciones genéricas, restricciones (`<T : Comparable<T>>`) y varianza `out` / `in`.

### Idiomática y Concurrencia

- **[Funciones de Ámbito (Scope Functions)](./31-scope-functions.md):** Guía comparativa de `let`, `apply`, `also`, `run` y `with` con casos de uso en Android.
- **[Listas y Operaciones Funcionales](./42-listas.md):** Listas inmutables `List` vs `MutableList`, adición funcional (`+`), transformaciones con `map`, `filter`, `groupBy`.
- **[Colecciones Asociativas (Mapas y Sets)](./43-maps.md):** Almacenamiento clave-valor y conjuntos únicos.
- **[Programación Asíncrona con Corrutinas](./51-corrutinas.md):** La analogía del camarero, ANR, funciones `suspend`, constructores `launch`/`async` y Dispatchers en Android.
- **[Flujos Asíncronos y Reactivos (Flow y StateFlow)](./52-flows.md):** Flujos fríos vs calientes, `StateFlow` en Android, emisión reactiva hacia Compose y Room.
- **[Anexo: La Magia de los DSLs en Kotlin](./61-dsl-en-kotlin.md):** Cómo Compose, Gradle y Koin crean sintaxis declarativa mediante lambdas con receptor, trailing lambdas, funciones de extensión y el operador `invoke`.

---

## 🎯 Laboratorio Práctico (`pmdm-kotlin-lab`)

Accede al bloque de ejercicios estructurados en un único proyecto de IntelliJ IDEA con soluciones comentadas y retos lúdicos graduados:

- **[Laboratorio de Actividades de Kotlin](./ejercicios/index.md):** Guía de configuración del proyecto en IntelliJ IDEA y mapa de retos.

    - [1. Fundamentos e Inmutabilidad](./ejercicios/01-fundamentos-inmutabilidad.md)
    - [2. Funciones, Lambdas y el Ahorcado](./ejercicios/02-funciones-lambdas-nullsafety.md)
    - [3. POO, Sealed Types y Wordle](./ejercicios/03-poo-sealed-types.md)
    - [4. Colecciones, Mappers y Scope Functions](./ejercicios/04-colecciones-scope-functions.md)
    - [5. Corrutinas Asíncronas y Flows](./ejercicios/05-concurrencia-corrutinas.md)
    - [6. Proyecto Final: El Juego del Calamar](./ejercicios/06-proyecto-integrador.md)

---

## 🔗 Recursos Oficiales y de Práctica

- **[Kotlin Playground](https://play.kotlinlang.org/):** Entorno de programación en línea oficial para probar y experimentar con fragmentos de código Kotlin sin instalar nada.
- **[Documentación Oficial de Kotlin](https://kotlinlang.org/docs/home.html):** Manual de referencia oficial de JetBrains.
- **[Android Basics with Compose](https://developer.android.com/courses/android-basics-compose/unit-1?hl=es-419):** Curso interactivo oficial de Google para el desarrollo moderno en Android.