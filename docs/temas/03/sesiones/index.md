# **Guía de clases de la UT3**

Seguimos con **una guía por clase**, igual que en la [UT2](../../02/sesiones/index.md): qué hacemos en cada sesión, en qué orden y qué apartado de los apuntes corresponde a cada bloque.

---

## El proyecto de clase continúa: FichaJuego

En la UT3 seguimos trabajando sobre **FichaJuego**, en el mismo repositorio: [github.com/jssdocente/pmdm2627-fichajuego](https://github.com/jssdocente/pmdm2627-fichajuego). Cada sesión tiene su tag de inicio y de fin (`s3.01-inicio`, `s3.01-fin`…). La primera sesión de la UT3 parte del punto en que acabó la UT2.

Si es la primera vez que usas el repositorio, consulta [cómo descargarlo y moverte entre tags](../../02/sesiones/index.md#el-proyecto-de-clase-fichajuego).

!!! info "Tu proyecto: «Mi colección»"
    En paralelo a FichaJuego desarrollarás tu propio proyecto, **«Mi colección»**, con la temática que elijas. Lo que hagamos en clase con FichaJuego es justo lo que necesitarás aplicar en él.

---

## Plan de sesiones

Cada sesión corresponde a una clase de **2 horas**.

| Sesión | Contenido | Apuntes | Proyecto | Codelabs del laboratorio |
| :--- | :--- | :--- | :--- | :--- |
| [**3.01** · Tema de Material 3, Scaffold y listas](./s01-tema-scaffold-listas.md) | Tema propio (colores, tipografía, formas), estructura con `Scaffold` y `TopAppBar`, lista con `LazyColumn` y `key` | [3A.1](../a-diseno/3a.1-material-design-3-scaffold.md), [3A.3](../a-diseno/3a.3-listas-cuadriculas.md) | `s3.01-inicio` → `s3.01-fin` | [3.01](../codelabs/01-tema-material3.md) y [3.02](../codelabs/02-catalogo-lazycolumn.md) |
| [**3.02** · Componentes interactivos](./s02-componentes-interactivos.md) | Botones y FAB, formulario con `OutlinedTextField` validado en una hoja inferior, `Slider` y `AlertDialog` | [3A.2](../a-diseno/3a.2-componentes-interactivos.md) | `s3.02-inicio` → `s3.02-fin` | [3.03](../codelabs/03-tareas-scaffold.md) y [3.04](../codelabs/04-propinas-formulario.md) |
| [**3.03** · Navigation 3 (I)](./s03-navigation3-i.md) | Destinos tipados, la pila de navegación, pantalla de detalle con argumentos y estado compartido entre pantallas | [3B.1 §1-7](../b-navegacion/3b.1-navigation3.md) | `s3.03-inicio` → `s3.03-fin` | [3.05](../codelabs/05-navegacion-navigation3.md) |
| [**3.04** · Navigation 3 (II) y edge-to-edge](./s04-navigation3-ii-edge-to-edge.md) | Volver atrás, barra de navegación inferior con una pila por pestaña, insets, dibujar bajo las barras del sistema y animaciones que siguen al estado | [3B.1 §6 y §10](../b-navegacion/3b.1-navigation3.md#6-volver-atras), [3B.2 §2](../b-navegacion/3b.2-diseno-adaptativo.md#2-edge-to-edge-aprovechar-toda-la-pantalla) | `s3.04-inicio` → `s3.04-fin` | [3.05](../codelabs/05-navegacion-navigation3.md) |
| [**3.05** · ViewModel y UiState (I)](./s05-viewmodel-uistate-i.md) | El ViewModel como contenedor del estado, `UiState` inmutable, `StateFlow`, flujo unidireccional y tests del ViewModel | [3C.1](../c-arquitectura/3c.1-capa-ui-viewmodel.md), [3C.4 §1](../c-arquitectura/3c.4-testing.md#1-que-probar-y-donde) | `s3.05-inicio` → `s3.05-fin` | [3.06](../codelabs/06-quiz-viewmodel.md) |
| [**3.06** · Tiempo y ciclo de vida](./s06-tiempo-ciclo-vida.md) | Cronómetro en el ViewModel: `delay`, `Job`, espera con bloqueo en el `UiState`, pausa con `LifecycleResumeEffect` y tests con tiempo virtual | [3C.1 §5](../c-arquitectura/3c.1-capa-ui-viewmodel.md#5-tareas-con-tiempo-en-el-viewmodel) | `s3.06-inicio` → `s3.06-fin` | [3.08](../codelabs/08-temporizador-pomodoro.md) |
| [**3.07** · ViewModel y UiState (II)](./s07-viewmodel-uistate-ii.md) | Repositorio compartido, un ViewModel por pantalla asociado a su entrada de la pila y estado derivado con `combine` y `stateIn` | [3B.1 §8](../b-navegacion/3b.1-navigation3.md#8-un-viewmodel-para-cada-pantalla), [3C.2 §8-9](../c-arquitectura/3c.2-clean-architecture.md#8-paso-5-viewmodel-que-reciben-sus-dependencias) | `s3.07-inicio` → `s3.07-fin` | Retos [3.01](../3.6-laboratorio-retos.md#reto-301-el-ahorcado) y [3.02](../3.6-laboratorio-retos.md#reto-302-wordle) |

Los codelabs del laboratorio están en el repositorio [pmdm2627-lab-ut3](https://github.com/jssdocente/pmdm2627-lab-ut3): consulta [3.6 Laboratorio de prácticas y codelabs](../3.6-laboratorio-retos.md) para descargarlo.

Las guías se irán publicando a medida que avance la unidad.
