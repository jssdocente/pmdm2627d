# **Guía de Estudio de la 1ª Evaluación**

Esta guía reúne en una sola página **qué tienes que dominar** para la 1ª evaluación y **dónde está cada cosa** en los apuntes. Cada concepto enlaza con su teoría y con los ejercicios que mejor lo practican: no hace falta buscar nada, sigue los enlaces.

La evaluación tiene cuatro partes, y todas se apoyan en las mismas bases:

| Parte | Qué se mide | Sección de esta guía |
| :--- | :--- | :--- |
| **Cuestionarios de Kotlin** | Que entiendes el lenguaje: qué hace un fragmento de código, qué devuelve, por qué falla | [§2](#2-cuestionarios-de-kotlin) |
| **Examen práctico de Kotlin** | Que sabes programar la lógica con tests (TDD) y *pipelines* de colecciones | [§3](#3-examen-practico-de-kotlin) |
| **Proyecto Android** | Que sabes construir una app con Compose, varias pantallas, ViewModel y tests | [§4](#4-el-proyecto-android-los-conceptos-que-lo-sostienen) |
| **Defensa escrita** | Que entiendes y sabes explicar **tu propio** código | [§5](#5-la-defensa-escrita-explicar-tu-propio-codigo) |

!!! tip "Cómo usar esta guía"
    - Estudia en el orden de la [ruta de estudio](#1-ruta-de-estudio): primero Kotlin, después Android. El proyecto se construye sobre el lenguaje.
    - Marca cada casilla ☐ cuando sepas hacerlo **sin mirar los apuntes**.
    - Las preguntas de autoevaluación están plegadas: intenta responder antes de abrir la solución.
    - ⭐ marca lo imprescindible. Si vas justo de tiempo, empieza por ahí.

---

## 1. Ruta de Estudio

| Paso | Qué hacer | Dónde |
| :---: | :--- | :--- |
| 1 | Repasar la teoría de Kotlin bloque a bloque | [§2.1 Las bases de Kotlin](#21-las-bases-de-kotlin-bloque-a-bloque) |
| 2 | Resolver los ejercicios ⭐ de cada bloque | [Laboratorio de Kotlin](../00-android/00-kotlin/ejercicios/index.md) |
| 3 | Entender el formato del examen práctico con el modelo resuelto | [Guía modelo: examen resuelto](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md) |
| 4 | Practicar TDD con los talleres de testing | [Talleres de testing](../00-android/00-kotlin/testing/index.md#6-talleres-practicos-de-testing-de-retos) |
| 5 | Repasar Compose: estado, listas, tema y `Scaffold` | [§4.1 a §4.3](#41-la-interfaz-composables-tema-y-recursos) |
| 6 | Repasar navegación y ViewModel | [§4.4 y §4.5](#44-navegar-entre-pantallas) |
| 7 | Repasar corrutinas, ciclo de vida y tests del ViewModel | [§4.6 a §4.9](#46-tiempo-y-esperas-corrutinas-en-el-viewmodel) |
| 8 | Preparar la explicación de tu propio código | [§5 La defensa escrita](#5-la-defensa-escrita-explicar-tu-propio-codigo) |

Los proyectos de apoyo que vas a usar:

- **Laboratorio de Kotlin** (`pmdm-kotlin-lab`): un único proyecto de consola para todos los ejercicios. Cómo crearlo: [Laboratorio de Kotlin › Entorno de trabajo](../00-android/00-kotlin/ejercicios/index.md#entorno-de-trabajo-un-unico-proyecto-en-intellij-idea).
- **Modelo de examen resuelto**: [descarga el `.zip`](../../_res/00-ejemplo-modelo-resuelto.zip) y explícalo con la [guía modelo](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md).
- **FichaJuego**, el proyecto de clase: [cómo descargarlo y moverte entre tags](../02/sesiones/index.md#el-proyecto-de-clase-fichajuego), y las [guías de clase de la UT3](../03/sesiones/index.md).
- **Laboratorios de Android**: [UT2](../02/2.4-laboratorio-retos.md#1-el-repositorio-del-laboratorio) y [UT3](../03/3.6-laboratorio-retos.md#1-el-repositorio-del-laboratorio), con un tag por codelab.

---

## 2. Cuestionarios de Kotlin

Los cuestionarios son de tipo test y van por bloques del lenguaje. Casi todas las preguntas muestran un fragmento de código y preguntan **qué imprime, qué devuelve, si compila o qué está mal**. No basta con saber escribir Kotlin: hay que saber **leerlo** con precisión.

### 2.1. Las bases de Kotlin, bloque a bloque

| Bloque | Lo que tienes que dominar | Teoría | Práctica ⭐ |
| :--- | :--- | :--- | :--- |
| **Fundamentos y tipos** | `val` frente a `var`, inferencia, tipos básicos, plantillas de `String`, conversiones explícitas | [Variables e inmutabilidad](../00-android/00-kotlin/11-variables-tipos-datos.md), [errores frecuentes](../00-android/00-kotlin/11-variables-tipos-datos.md#8-errores-frecuentes-gotchas) | [Ejercicios 1](../00-android/00-kotlin/ejercicios/01-fundamentos-inmutabilidad.md) (nivel básico) |
| **Control de flujo y expresiones** | `if` y `when` como **expresiones**, `when` exhaustivo, rangos (`..`, `until`, `downTo`, `step`) | [Expresiones y sentencias](../00-android/00-kotlin/12-expresiones-vs-sentencias.md), [`when`](../00-android/00-kotlin/12.1-when.md), [bucles](../00-android/00-kotlin/12.2-bucles-iteracion.md) | [Ejercicios 1](../00-android/00-kotlin/ejercicios/01-fundamentos-inmutabilidad.md) (nivel intermedio) |
| **Null safety** | `?`, `?.`, `?:`, `!!`, *smart casts*, `as?`, `?.let { }` | [Null safety](../00-android/00-kotlin/14-null-safety.md), en especial el [operador Elvis y compañía](../00-android/00-kotlin/14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos) | [Ejercicios 2](../00-android/00-kotlin/ejercicios/02-funciones-lambdas-nullsafety.md) (nivel intermedio) |
| **Funciones, lambdas y extensiones** | Parámetros por defecto y con nombre, funciones de una expresión, lambdas, `it`, funciones de orden superior, extensiones | [Funciones y lambdas](../00-android/00-kotlin/13-funciones-lambdas.md): [orden superior](../00-android/00-kotlin/13-funciones-lambdas.md#3-funciones-de-orden-superior-higher-order-functions) y [extensiones](../00-android/00-kotlin/13-funciones-lambdas.md#5-funciones-de-extension-extension-functions) | [Ejercicios 2](../00-android/00-kotlin/ejercicios/02-funciones-lambdas-nullsafety.md) |
| **POO** | Constructor primario, `init`, propiedades, `open` (las clases son `final` por defecto), clases abstractas, interfaces, polimorfismo | [POO](../00-android/00-kotlin/21-poo.md): [herencia y `open`](../00-android/00-kotlin/21-poo.md#5-herencia-final-por-defecto-y-la-palabra-clave-open) y [polimorfismo](../00-android/00-kotlin/21-poo.md#7-polimorfismo-comprobacion-de-tipos-y-smart-casting) | [Ejercicios 3](../00-android/00-kotlin/ejercicios/03-poo-sealed-types.md) (nivel básico) |
| **`data class`, `enum` y tipos sellados** | Qué genera una `data class`, `copy()`, `enum` con propiedades y `entries`, `sealed interface` con `when` exhaustivo | [Data classes](../00-android/00-kotlin/23-data-classes.md) y su [`copy()`](../00-android/00-kotlin/23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad), [enum](../00-android/00-kotlin/24-enum-classes.md), [tipos sellados](../00-android/00-kotlin/26-sealed-classes.md), [objetos y companion](../00-android/00-kotlin/22-objetos-anonimos.md) | [Ejercicios 3](../00-android/00-kotlin/ejercicios/03-poo-sealed-types.md) (niveles intermedio y avanzado) |
| **Scope functions** | Qué devuelve cada una (`let`, `run`, `with`, `apply`, `also`) y si usa `it` o `this` | [Scope functions](../00-android/00-kotlin/31-scope-functions.md): [tabla maestra](../00-android/00-kotlin/31-scope-functions.md#3-tabla-maestra-de-seleccion-rapida) y [errores frecuentes](../00-android/00-kotlin/31-scope-functions.md#7-errores-frecuentes) | [Laboratorio de scope functions](../00-android/00-kotlin/31-scope-functions.md#6-pruebalo-laboratorio-de-scope-functions), [Ejercicios 4](../00-android/00-kotlin/ejercicios/04-colecciones-scope-functions.md) (nivel intermedio) |
| **Colecciones** | Inmutables frente a mutables, `filter`, `map`, `sortedBy`, `groupBy`, `sumOf`, `maxByOrNull`, `mapNotNull`, `associate`, *pipelines* | [Listas](../00-android/00-kotlin/42-listas.md): [operaciones](../00-android/00-kotlin/42-listas.md#4-operaciones-funcionales-imprescindibles) y [*pipelines*](../00-android/00-kotlin/42-listas.md#5-programacion-fluent-pipelines-de-transformacion-encadenados); [maps](../00-android/00-kotlin/43-maps.md), [sets](../00-android/00-kotlin/44-sets.md) | [Ejercicios 4](../00-android/00-kotlin/ejercicios/04-colecciones-scope-functions.md) |
| **Corrutinas y flujos** | `suspend`, `launch`, `delay`, cancelación, `StateFlow` | [Corrutinas](../00-android/00-kotlin/51-corrutinas.md), [Flows y `StateFlow`](../00-android/00-kotlin/52-flows.md#4-stateflow-el-rey-de-la-arquitectura-en-android-y-compose) | [Ejercicios 5](../00-android/00-kotlin/ejercicios/05-concurrencia-corrutinas.md) (niveles básico e intermedio) |

### 2.2. Las trampas que más se preguntan

Repasa cada una hasta poder explicarla con tus palabras:

- [ ] Un `val` no se puede reasignar, pero si apunta a una `MutableList`, la lista sí puede cambiar ([inmutabilidad](../00-android/00-kotlin/11-variables-tipos-datos.md#3-la-inmutabilidad-en-el-desarrollo-moderno)).
- [ ] `if` y `when` devuelven un valor; un `when` usado como expresión tiene que cubrir todos los casos ([expresiones](../00-android/00-kotlin/12-expresiones-vs-sentencias.md)).
- [ ] `1..5` incluye el 5; `1 until 5`, no. `5 downTo 1 step 2` da 5, 3, 1 ([bucles](../00-android/00-kotlin/12.2-bucles-iteracion.md)).
- [ ] `a ?: b` devuelve `b` solo si `a` es `null`; `!!` lanza `NullPointerException` si es `null` ([null safety](../00-android/00-kotlin/14-null-safety.md#2-operadores-para-el-manejo-seguro-de-nulos)).
- [ ] `let` y `run` devuelven el resultado de la lambda; `apply` y `also` devuelven el propio objeto ([tabla maestra](../00-android/00-kotlin/31-scope-functions.md#3-tabla-maestra-de-seleccion-rapida)).
- [ ] Dos `data class` con los mismos valores son iguales con `==`; dos objetos de una clase normal, no ([data classes](../00-android/00-kotlin/23-data-classes.md#2-metodos-generados-automaticamente-por-el-compilador)).
- [ ] `copy()` crea un objeto nuevo y deja el original como estaba ([`copy()`](../00-android/00-kotlin/23-data-classes.md#3-el-metodo-copy-y-la-inmutabilidad)).
- [ ] Para heredar de una clase hay que marcarla `open`; para sobrescribir un método, también ([herencia](../00-android/00-kotlin/21-poo.md#5-herencia-final-por-defecto-y-la-palabra-clave-open)).
- [ ] `filter`, `map` o `sortedBy` **no cambian** la lista: devuelven otra nueva ([listas](../00-android/00-kotlin/42-listas.md#3-inmutabilidad-y-adicion-funcional-de-elementos)).
- [ ] `maxByOrNull` y `firstOrNull` pueden devolver `null`; `first` lanza una excepción si no hay elementos.
- [ ] Con un `sealed interface`, el `when` no necesita `else` porque el compilador conoce todos los casos ([tipos sellados](../00-android/00-kotlin/26-sealed-classes.md#3-la-combinacion-perfecta-polimorfismo-when-smart-casting)).
- [ ] `delay` suspende la corrutina sin bloquear el hilo; `Thread.sleep` lo bloquea ([corrutinas](../00-android/00-kotlin/51-corrutinas.md#1-la-analogia-del-camarero-por-que-bloquear-un-hilo-es-fatal)).

Cada página de teoría termina con **Retos prácticos** y muchas tienen **Errores frecuentes**: son el mejor material para el test.

### 2.3. Autoevaluación

??? question "1. ¿Qué imprime `println(listOf(3, 1, 2).sorted().first() + listOf(3, 1, 2).first())`?"
    `4`. `sorted()` devuelve una lista **nueva** ordenada (`[1, 2, 3]`), cuyo primer elemento es 1, y la lista original sigue empezando por 3: 1 + 3 = 4.

??? question "2. ¿Qué devuelve `val n: String? = null; n?.length ?: -1`?"
    `-1`. `n?.length` es `null` porque `n` es `null`, y el operador Elvis devuelve el valor de la derecha.

??? question "3. ¿Qué diferencia hay entre `persona.apply { edad = 30 }` y `persona.let { it.edad = 30 }`?"
    Las dos cambian la edad, pero `apply` devuelve la propia `persona` (y dentro se usa `this`), mientras que `let` devuelve el resultado de la lambda, aquí `Unit` (y dentro se usa `it`).

??? question "4. `data class Punto(val x: Int, val y: Int)`: ¿qué imprime `println(Punto(1, 2) == Punto(1, 2))`? ¿Y si quitas `data`?"
    Con `data`, `true`: `equals` compara los valores. Sin `data`, `false`: compara si son el mismo objeto.

??? question "5. ¿Por qué no compila `class Animal` + `class Perro : Animal()`?"
    Porque en Kotlin las clases son `final` por defecto. Hay que declarar `open class Animal`.

??? question "6. ¿Qué tipo tiene `val r = if (x > 0) "positivo" else 0`?"
    `Any`, el supertipo común de `String` e `Int`. Por eso conviene que las dos ramas devuelvan el mismo tipo.

---

## 3. Examen Práctico de Kotlin

El examen práctico es un proyecto de consola con dos partes, explicadas con detalle en la [guía modelo](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#1-estructura-de-la-evaluacion-50-tdd-50-funcionalidad):

- **TDD (50 %):** implementas los métodos marcados con `TODO` hasta que pasen los tests que se te dan.
- **Funcionalidad (50 %):** completas `Main.kt` para mostrar datos, cambiar estados con `copy()` y decidir con `when`.

Se valora que uses **pipelines declarativos de colecciones**, no bucles con listas auxiliares: lee [el cambio de mentalidad de imperativo a declarativo](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#2-el-cambio-de-mentalidad-de-imperativo-a-declarativo-pipelines).

### 3.1. Lo que tienes que saber hacer

| Técnica | Dónde está explicada |
| :--- | :--- |
| ⭐ Filtrar, ordenar y transformar en una cadena | [Pipeline 1](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#41-pipeline-1-filtrado-ordenacion-y-mapeo) |
| ⭐ Sumar o promediar sin dividir entre cero | [Pipeline 2](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#42-pipeline-2-agregacion-numerica-segura) |
| ⭐ Agrupar por una clave y resumir cada grupo | [Pipeline 3](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#43-pipeline-3-agrupacion-y-reduccion-por-clave-groupby-mapvalues) |
| Quedarte solo con los valores que no son `null` | [Pipeline 4](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#44-pipeline-4-null-safety-con-mapnotnull) |
| Buscar un elemento que puede no existir | [Pipeline 5](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#45-pipeline-5-busqueda-con-verificacion-segura) |
| Mostrar una tabla con `joinToString` | [§5.1](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#51-formateo-tabular-con-jointostring) |
| ⭐ Cambiar un estado inmutable con `copy()` | [§5.2](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#52-mutacion-inmutable-de-estado-con-copy) |
| ⭐ Decidir con un `when` exhaustivo sobre un `sealed interface` | [§5.3](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md#53-control-de-flujo-exhaustivo-con-when) |
| Leer un test y saber qué espera | [Estructura AAA](../00-android/00-kotlin/testing/index.md#23-estructura-mental-de-una-prueba-el-patron-aaa-arrange-act-assert), [casos límite](../00-android/00-kotlin/testing/index.md#24-identificacion-de-casos-casos-nominales-vs-casos-limite-edge-cases) |
| Ejecutar los tests y leer el informe | [Formas de ejecutar los tests](../00-android/00-kotlin/testing/index.md#43-formas-de-ejecutar-los-tests), [informe HTML](../00-android/00-kotlin/testing/index.md#44-el-informe-visual-html-generado-por-gradle) |

### 3.2. Ejercicios imprescindibles, en este orden

1. ⭐ **El modelo resuelto.** [Descarga el `.zip`](../../_res/00-ejemplo-modelo-resuelto.zip), borra el cuerpo de los métodos del servicio y vuelve a escribirlos hasta que pasen los tests. Es el mejor simulacro posible.

2. ⭐ **Taller 1 · [Combate RPG](../00-android/00-kotlin/testing/01-test-combate-rpg.md)**: tests de reglas de un juego por turnos.

3. ⭐ **Taller 2 · [Ahorcado con TDD](../00-android/00-kotlin/testing/02-test-ahorcado-tdd.md)**: el ciclo rojo, verde y refactorizar, con estado inmutable.

4. **Taller 3 · [Wordle](../00-android/00-kotlin/testing/03-test-wordle-dominio.md)**, **Taller 4 · [Memory Match](../00-android/00-kotlin/testing/04-test-memory-match.md)** y **Taller 5 · [Carrera con corrutinas](../00-android/00-kotlin/testing/05-test-carrera-corrutinas.md)**.

5. **Los retos avanzados** de cada bloque, que combinan todo con estado inmutable:

    - [Reto 1.12 · Combate RPG por turnos](../00-android/00-kotlin/ejercicios/01-fundamentos-inmutabilidad.md#reto-112-combate-rpg-por-turnos-heroe-vs-dragon-carmesi)
    - [Reto 2.17 · El juego del Ahorcado](../00-android/00-kotlin/ejercicios/02-funciones-lambdas-nullsafety.md#reto-217-el-juego-del-ahorcado-con-arquitectura-de-estado-pura-uistate)
    - [Reto 3.19 · El motor de Wordle](../00-android/00-kotlin/ejercicios/03-poo-sealed-types.md#reto-319-el-motor-de-wordle-con-arquitectura-de-estado-state-companion-object-sealed-types)
    - [Reto 4.16 · Memory Match Engine](../00-android/00-kotlin/ejercicios/04-colecciones-scope-functions.md#reto-416-memory-match-engine-juego-de-parejas-de-cartas-en-cuadricula)
    - [Reto 5.14 · Carrera espacial](../00-android/00-kotlin/ejercicios/05-concurrencia-corrutinas.md#reto-514-carrera-espacial-galactica-space-grand-prix)

6. **El [proyecto integrador](../00-android/00-kotlin/ejercicios/06-proyecto-integrador.md)**, si quieres un repaso completo.

### 3.3. Antes de entregar

- [ ] `./gradlew test` termina en verde y **no has modificado ningún test**.
- [ ] Ningún método conserva un `TODO`: el programa no se cae al ejecutar `Main.kt`.
- [ ] Usas *pipelines* (`filter`, `map`, `groupBy`, `sumOf`…), no bucles que llenan listas auxiliares.
- [ ] Los casos límite (lista vacía, valor que no existe) no lanzan excepciones: `OrNull`, `?:`, `ifEmpty`.
- [ ] Los estados se cambian con `copy()`, nunca con `var` sueltas.

### 3.4. Autoevaluación

??? question "Reescribe como *pipeline*: recorrer `alumnos`, quedarse con los aprobados (`nota >= 5`) y guardar sus nombres en mayúsculas, ordenados"
    ```kotlin
    val aprobados = alumnos
        .filter { it.nota >= 5 }
        .map { it.nombre.uppercase() }
        .sorted()
    ```

??? question "¿Cómo calculas la nota media sin que falle con una lista vacía?"
    `alumnos.map { it.nota }.average()` devuelve `NaN` con una lista vacía. Una forma segura: `if (alumnos.isEmpty()) 0.0 else alumnos.sumOf { it.nota } / alumnos.size`.

??? question "¿Cómo obtienes cuántos alumnos hay de cada grupo?"
    `alumnos.groupingBy { it.grupo }.eachCount()`, o `alumnos.groupBy { it.grupo }.mapValues { it.value.size }`.

---

## 4. El Proyecto Android: los Conceptos que lo Sostienen

El proyecto del trimestre es una **app Android con Jetpack Compose**: varias pantallas, un estado que cambia según unas reglas, cosas que ocurren con el tiempo y tests que lo comprueban. Sea cual sea su temática, se construye con las mismas piezas, todas vistas en clase. Esta sección las recorre una a una: para cada pieza, qué tienes que saber hacer y dónde practicarla.

Ten a mano estos dos recursos durante todo el repaso:

- **FichaJuego**, el proyecto de clase, que tiene las mismas piezas sesión a sesión ([guías de clase de la UT3](../03/sesiones/index.md)).
- **El laboratorio de la UT3**, con un codelab para cada pieza ([3.6 Laboratorio](../03/3.6-laboratorio-retos.md)).

### 4.1. La interfaz: composables, tema y recursos

- [ ] Componer una pantalla con `Column`, `Row`, `Box` y `Modifier` ([2.3.1 Maquetación](../02/2.3.1-layouts-modificadores.md)).
- [ ] Mostrar imágenes de `res/drawable` y textos de `strings.xml`, con `contentDescription` ([2.3.2 Imágenes, iconos y recursos](../02/2.3.2-imagenes-iconos-recursos.md)).
- [ ] Usar colores, tipografía y formas del tema, no valores escritos a mano ([3A.1 Material Design 3](../03/a-diseno/3a.1-material-design-3-scaffold.md)).
- [ ] Estructurar una pantalla con `Scaffold` y aplicar `innerPadding` ([3A.1](../03/a-diseno/3a.1-material-design-3-scaffold.md)).
- [ ] Mostrar diálogos y avisos: `AlertDialog` y `Snackbar` ([3A.2 Componentes interactivos](../03/a-diseno/3a.2-componentes-interactivos.md)).

**Practica con:** [Codelab 2.01 · Tarjeta de presentación](../02/codelabs/01-tarjeta-presentacion.md), [Codelab 2.04 · Dados](../02/codelabs/04-dado-interactivo.md), [Codelab 3.01 · Tema de Material 3](../03/codelabs/01-tema-material3.md), [Codelab 3.03 · Tareas con `Scaffold`](../03/codelabs/03-tareas-scaffold.md) y [Codelab 3.07 · Recursos e idiomas](../03/codelabs/07-ficha-heroe-recursos.md).

### 4.2. El estado y el *state hoisting*

- [ ] Explicar por qué una variable normal no actualiza la pantalla y qué hace `remember` ([Gestión del estado](../00-android/00-compose/22-state-management.md)).
- [ ] Distinguir `remember` de `rememberSaveable` y saber qué se pierde al girar el móvil ([Codelab 2.03 · Ciclo de vida](../02/codelabs/03-ciclo-vida-logcat.md)).
- [ ] ⭐ Separar una pantalla con estado (`…Screen`) de un contenido sin estado (`…Content`) que recibe valores y avisa con lambdas ([Codelab 2.02 · Contador](../02/codelabs/02-contador-incremental.md)).
- [ ] Calcular los valores derivados en lugar de guardarlos ([Codelab 3.04 · Formularios](../03/codelabs/04-propinas-formulario.md#3-paso-1-la-pantalla-con-estado)).

**Practica con:** [Sesión 2.02 · Estado y *state hoisting*](../02/sesiones/s02-estado-state-hoisting.md), [Codelab 2.05 · Semáforo](../02/codelabs/05-semaforo-estados.md) y los retos de la UT2 ([Limonada y Marcador](../02/2.4-laboratorio-retos.md#4-retos-autonomos)).

### 4.3. Listas y cuadrículas

- [ ] Mostrar una colección con `LazyColumn` o `LazyVerticalGrid` ([3A.3 Listas y cuadrículas](../03/a-diseno/3a.3-listas-cuadriculas.md)).
- [ ] ⭐ Dar a cada elemento una `key` única y explicar qué pasa sin ella ([Codelab 3.02, ¿por qué `key`?](../03/codelabs/02-catalogo-lazycolumn.md#por-que-key)).
- [ ] Reaccionar a la pulsación de un elemento avisando con su id.

**Practica con:** [Codelab 3.02 · Catálogo](../03/codelabs/02-catalogo-lazycolumn.md), [Sesión 3.01](../03/sesiones/s01-tema-scaffold-listas.md) y [Listas en Compose](../00-android/00-compose/23-listas-cuadriculas.md).

### 4.4. Navegar entre pantallas

- [ ] Definir cada pantalla como una clave de Navigation 3, con o sin argumentos ([3B.1 §3 Definir los destinos](../03/b-navegacion/3b.1-navigation3.md#3-paso-1-definir-los-destinos)).
- [ ] ⭐ Pasar a otra pantalla **el id**, no el objeto entero ([Codelab 3.05, las claves](../03/codelabs/05-navegacion-navigation3.md#4-paso-2-las-claves-de-cada-pantalla)).
- [ ] Volver atrás y manipular la pila: quitar la última pantalla, volver al inicio, sustituir una pantalla por otra ([3B.1 §6 Volver atrás](../03/b-navegacion/3b.1-navigation3.md#6-volver-atras) y [§7 Operaciones habituales con la pila](../03/b-navegacion/3b.1-navigation3.md#7-operaciones-habituales-con-la-pila)).
- [ ] Mantener las pantallas sin conocer la pila: reciben datos y lambdas ([Codelab 3.05](../03/codelabs/05-navegacion-navigation3.md#5-paso-3-las-dos-pantallas)).

**Practica con:** [Codelab 3.05 · Navigation 3](../03/codelabs/05-navegacion-navigation3.md), [Sesión 3.03](../03/sesiones/s03-navigation3-i.md), [Sesión 3.04](../03/sesiones/s04-navigation3-ii-edge-to-edge.md) y los [retos de 3B.1](../03/b-navegacion/3b.1-navigation3.md#14-retos). Repasa también los [errores frecuentes de Navigation 3](../03/b-navegacion/3b.1-navigation3.md#13-errores-frecuentes).

### 4.5. La arquitectura: ViewModel, `UiState` y flujo unidireccional

Es la pieza central del proyecto: **las reglas del juego o de la app viven en el ViewModel, y la pantalla solo pinta el estado y avisa de lo que hace el usuario**.

- [ ] ⭐ Modelar todo lo que muestra una pantalla en una `data class` `UiState` inmutable ([3C.1 §2](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#2-modelado-inmutable-del-estado-uistate)).
- [ ] ⭐ Publicar el estado con un `MutableStateFlow` privado y un `StateFlow` público, y cambiarlo con `update { it.copy(…) }` ([3C.1 §3](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#3-reactividad-con-stateflow-y-el-patron-udf), [Codelab 3.06, el ViewModel](../03/codelabs/06-quiz-viewmodel.md#5-paso-3-el-viewmodel)).
- [ ] ⭐ Escribir los eventos como funciones del ViewModel y las reglas dentro de ellas (por ejemplo, ignorar una pulsación que no está permitida).
- [ ] Conectar la pantalla con `viewModel()` y `collectAsStateWithLifecycle()` ([3C.1 §4](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#4-consumo-del-viewmodel-en-compose)).
- [ ] Explicar por qué el ViewModel sobrevive al giro de pantalla ([3C.1 §1.1](../03/c-arquitectura/3c.1-capa-ui-viewmodel.md#11-supervivencia-ante-cambios-de-configuracion), [Codelab 3.06 §7](../03/codelabs/06-quiz-viewmodel.md#7-paso-5-por-que-sobrevive-al-giro)).
- [ ] Usar un ViewModel por pantalla, con navegación ([3B.1 §8](../03/b-navegacion/3b.1-navigation3.md#8-un-viewmodel-para-cada-pantalla)).

**Practica con:** [Codelab 3.06 · Quiz con ViewModel](../03/codelabs/06-quiz-viewmodel.md), [Sesión 3.05](../03/sesiones/s05-viewmodel-uistate-i.md), [Sesión 3.06](../03/sesiones/s06-viewmodel-uistate-ii.md) y los retos del laboratorio [El Ahorcado](../03/3.6-laboratorio-retos.md#reto-301-el-ahorcado) y [Wordle](../03/3.6-laboratorio-retos.md#reto-302-wordle), dos juegos completos con esta arquitectura. El patrón `UiState` también está en [Tipos sellados §5](../00-android/00-kotlin/26-sealed-classes.md#5-el-patron-universal-de-arquitectura-en-android-uistate).

### 4.6. Tiempo y esperas: corrutinas en el ViewModel

Muchas apps tienen cosas que pasan con el tiempo: un cronómetro, una espera antes de cambiar algo, una cuenta atrás.

- [ ] Lanzar trabajo en el ViewModel con `viewModelScope.launch` ([Corrutinas §4.2 `launch`](../00-android/00-kotlin/51-corrutinas.md#42-launch-lanzar-y-olvidar-fire-and-forget)).
- [ ] ⭐ Esperar con `delay`, nunca con `Thread.sleep`, que congela la interfaz ([Corrutinas §1](../00-android/00-kotlin/51-corrutinas.md#1-la-analogia-del-camarero-por-que-bloquear-un-hilo-es-fatal)).
- [ ] Guardar el `Job` que devuelve `launch` para poder pararlo con `cancel()`, y evitar lanzar dos veces la misma tarea ([Corrutinas §6 Cancelación](../00-android/00-kotlin/51-corrutinas.md#6-cancelacion-de-corrutinas)).
- [ ] Bloquear las pulsaciones mientras dura una espera con un campo del `UiState`, no con una variable de la pantalla.

**Practica con:** [Ejercicios 5 · Corrutinas y flows](../00-android/00-kotlin/ejercicios/05-concurrencia-corrutinas.md) y el [Taller 5 · Carrera con corrutinas](../00-android/00-kotlin/testing/05-test-carrera-corrutinas.md).

### 4.7. El ciclo de vida: girar y salir de la app

- [ ] Saber qué ocurre al girar el móvil (la `Activity` se destruye y se crea otra) y qué sobrevive ([2.2 Ciclo de vida](../02/2.2-ciclo-vida-app.md), [Codelab 2.03](../02/codelabs/03-ciclo-vida-logcat.md)).
- [ ] Saber qué ocurre al salir de la app con el botón de inicio y volver, y cómo detener lo que no debe seguir funcionando en segundo plano: [*Lifecycle* en Compose (Android Developers)](https://developer.android.com/topic/libraries/architecture/compose?hl=es-419).
- [ ] Explicar por qué se usa `collectAsStateWithLifecycle()` y no `collectAsState()` ([Codelab 3.06 §6](../03/codelabs/06-quiz-viewmodel.md#6-paso-4-la-pantalla)).

### 4.8. Animaciones que siguen al estado

En Compose, una animación **no guarda nada**: se calcula a partir del estado. Si el estado dice que algo está desplegado, girado o visible, la animación lleva el dibujo hasta ahí.

- [ ] Animar un cambio de tamaño o de contenido con `animateContentSize` y `Crossfade` ([Codelab 3.02](../03/codelabs/02-catalogo-lazycolumn.md#4-paso-2-la-tarjeta-de-un-curso), [Codelab 3.07](../03/codelabs/07-ficha-heroe-recursos.md#7-paso-5-la-ficha)).
- [ ] Animar un valor (un ángulo, un color, una opacidad) con `animate*AsState`: [Animaciones basadas en valores (Android Developers)](https://developer.android.com/develop/ui/compose/animation/value-based?hl=es-419).
- [ ] Aplicar transformaciones (giro, escala, transparencia) con `Modifier.graphicsLayer`: [Modificadores gráficos (Android Developers)](https://developer.android.com/develop/ui/compose/graphics/draw/modifiers?hl=es-419).
- [ ] Animar el paso entre pantallas ([3B.1 §11 Animaciones de transición](../03/b-navegacion/3b.1-navigation3.md#11-animaciones-de-transicion)).

### 4.9. Tests del ViewModel

- [ ] Estructurar un test en *Arrange, Act, Assert* ([3C.4 §1.3](../03/c-arquitectura/3c.4-testing.md#13-estructura-de-un-test-arrange-act-assert)).
- [ ] ⭐ Probar un ViewModel: crearlo, llamar a sus eventos y comprobar `uiState.value` ([Codelab 3.06 §8](../03/codelabs/06-quiz-viewmodel.md#8-paso-6-tests-del-viewmodel), [3C.4 §4 Probar los ViewModel](../03/c-arquitectura/3c.4-testing.md#4-probar-los-viewmodel)).
- [ ] Probar código con corrutinas y esperas: el hilo principal en los tests ([3C.4 §4.1](../03/c-arquitectura/3c.4-testing.md#41-el-problema-del-hilo-principal)) y el [Taller 5](../00-android/00-kotlin/testing/05-test-carrera-corrutinas.md).
- [ ] Pasar al ViewModel por el constructor lo que el test necesita controlar (por ejemplo, los datos de partida), como hacen el [quiz](../03/codelabs/06-quiz-viewmodel.md#5-paso-3-el-viewmodel) y el [Ahorcado](../03/c-arquitectura/3c.4-testing.md#55-ejemplo-del-laboratorio-el-ahorcado).
- [ ] Ejecutar los tests y entender los errores frecuentes ([3C.4 §6](../03/c-arquitectura/3c.4-testing.md#6-ejecutar-los-tests) y [§7](../03/c-arquitectura/3c.4-testing.md#7-errores-frecuentes)).

### 4.10. Autoevaluación

??? question "1. Al pulsar un botón, ¿qué recorrido sigue la información hasta que cambia la pantalla?"
    El botón llama a una lambda de la pantalla sin estado, que llega a una función del ViewModel. El ViewModel aplica la regla y publica un `UiState` nuevo en su `StateFlow`. La pantalla, que lo observa con `collectAsStateWithLifecycle()`, se recompone con el estado nuevo.

??? question "2. ¿Por qué el `UiState` es inmutable y se cambia con `copy()`?"
    Porque así cada cambio produce un estado nuevo y completo: Compose detecta que es distinto y recompone, nadie puede modificarlo a medias desde la pantalla y los tests pueden comparar estados con `==`.

??? question "3. ¿Qué pasa si una espera se hace con `Thread.sleep(1000)` en el ViewModel?"
    Se bloquea el hilo principal durante un segundo: la app no responde y no se pinta nada. Con `delay(1000)` dentro de `viewModelScope.launch`, la corrutina se suspende y la interfaz sigue funcionando.

??? question "4. ¿Cómo evitas que una tarea repetitiva (un cronómetro) se lance dos veces?"
    Guardando su `Job` en el ViewModel: antes de lanzarla, se cancela el anterior (o no se lanza si ya está activo).

??? question "5. ¿Por qué se navega pasando el id y no el objeto completo?"
    Porque la clave se guarda para restaurar la pila (al girar, por ejemplo) y debe ser pequeña y serializable. Además, la pantalla de destino busca siempre la versión actual de los datos.

---

## 5. La Defensa Escrita: Explicar tu Propio Código

En la defensa respondes por escrito preguntas sobre **tu** proyecto. Una respuesta vale si señala **el fichero y la función** de tu código donde ocurre lo que explicas. Las respuestas genéricas, que valdrían para cualquier proyecto, no puntúan.

### 5.1. Cómo prepararla

1. **Haz el mapa de tu proyecto.** Una tabla con cada pieza y dónde está:

    | Pieza | Fichero | Función o clase |
    | :--- | :--- | :--- |
    | Estado de la pantalla principal | `…UiState.kt` | `data class …UiState` |
    | Regla al pulsar un elemento | `…ViewModel.kt` | `fun on…(…)` |
    | Navegación entre pantallas | `…App.kt` | `entryProvider { … }` |
    | Espera o temporizador | `…ViewModel.kt` | `viewModelScope.launch { … }` |
    | Tests | `…ViewModelTest.kt` | cada `@Test` |

2. **Sigue un evento de principio a fin** en tu código: desde el `onClick` hasta el cambio de estado y la recomposición, apuntando cada fichero y función por los que pasa ([§4.5](#45-la-arquitectura-viewmodel-uistate-y-flujo-unidireccional)).

3. **Para cada dato, responde dónde vive y por qué ahí:** en el `UiState`, en un `remember` de la pantalla o en una animación. Recuerda que una animación nunca guarda el estado ([§4.8](#48-animaciones-que-siguen-al-estado)).

4. **Rompe tu código a propósito** y observa qué pasa: quita una `key`, el `innerPadding`, un `cancel()` o el bloqueo de una espera. Saber qué se rompe es saber para qué sirve.

5. **Entiende cada línea que entregues.** Si usaste un ejemplo de los apuntes o de la documentación, asegúrate de poder explicarlo con tus palabras.

### 5.2. Ejemplo de respuesta

Con FichaJuego como ejemplo ([sesión 3.06](../03/sesiones/s06-viewmodel-uistate-ii.md)), para la pregunta *«¿Dónde se guarda el número de partidas de cada juego y qué pasa al pulsar +1?»*:

!!! failure "Respuesta que no puntúa"
    Se guarda en el ViewModel, que tiene el estado, y al pulsar se actualiza y la pantalla cambia.

!!! success "Respuesta que puntúa"
    Las partidas se guardan en `JuegoRepositorio.kt`, en `_partidas`, un `MutableStateFlow<Map<Int, Int>>` (id del juego → partidas). Al pulsar +1, la pantalla llama a `onSumarPartida(juegoId)` de `BibliotecaViewModel.kt`, que llama a `repositorio.sumarPartida(juegoId)`. Como el `uiState` del ViewModel se calcula con `combine(repositorio.juegos, repositorio.partidas)`, al cambiar las partidas se emite un `BibliotecaUiState` nuevo y la biblioteca se recompone.

### 5.3. Preguntas para practicar con tu código

Respóndelas por escrito, citando fichero y función:

- [ ] ¿Qué composable de tu proyecto no tiene estado? ¿Qué recibe y de qué avisa?
- [ ] ¿Qué campos tiene tu `UiState` y por qué cada uno?
- [ ] Elige un evento: ¿qué regla aplica el ViewModel y qué parte del estado cambia?
- [ ] ¿Qué `key` usa tu lista o cuadrícula y qué pasaría sin ella?
- [ ] ¿Qué se pasa al navegar a otra pantalla y qué hace la pantalla de destino con ello?
- [ ] ¿Qué ocurre en tu app al girar el móvil? ¿Y al salir con el botón de inicio y volver?
- [ ] Si tu app espera o cuenta tiempo, ¿qué corrutina lo hace, dónde se lanza y dónde se cancela?
- [ ] ¿Qué comprueba cada uno de tus tests y qué pasaría si quitaras la regla que prueba?

---

## 6. Lista Final de Comprobación

- [ ] Leo un fragmento de Kotlin y sé qué imprime, qué devuelve o por qué no compila ([§2](#2-cuestionarios-de-kotlin)).
- [ ] Resuelvo con *pipelines* y TDD un servicio como el del [modelo resuelto](../00-android/00-kotlin/testing/00-guia-simulacro-modelo.md), sin mirar la solución ([§3](#3-examen-practico-de-kotlin)).
- [ ] Construyo una pantalla con `Scaffold`, tema propio, recursos y una lista con `key` ([§4.1 a §4.3](#41-la-interfaz-composables-tema-y-recursos)).
- [ ] Navego entre pantallas con Navigation 3 pasando ids ([§4.4](#44-navegar-entre-pantallas)).
- [ ] Separo la pantalla del ViewModel con `UiState`, `StateFlow` y eventos ([§4.5](#45-la-arquitectura-viewmodel-uistate-y-flujo-unidireccional)).
- [ ] Gestiono esperas y tareas repetitivas con corrutinas que sé parar ([§4.6](#46-tiempo-y-esperas-corrutinas-en-el-viewmodel)).
- [ ] Mi app se comporta bien al girar y al salir de ella ([§4.7](#47-el-ciclo-de-vida-girar-y-salir-de-la-app)).
- [ ] Pruebo las reglas de mi ViewModel con tests ([§4.9](#49-tests-del-viewmodel)).
- [ ] Explico cualquier parte de mi código citando fichero y función ([§5](#5-la-defensa-escrita-explicar-tu-propio-codigo)).
