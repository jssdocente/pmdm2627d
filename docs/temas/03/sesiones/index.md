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

| Sesión | Contenido | Apuntes | Proyecto |
| :--- | :--- | :--- | :--- |
| [**3.01** · Tema de Material 3, Scaffold y listas](./s01-tema-scaffold-listas.md) | Tema propio (colores, tipografía, formas), estructura con `Scaffold` y `TopAppBar`, lista con `LazyColumn` y `key` | [3A.1](../a-diseno/3a.1-material-design-3-scaffold.md), [3A.3](../a-diseno/3a.3-listas-cuadriculas.md) | `s3.01-inicio` → `s3.01-fin` |
| [**3.02** · Componentes interactivos](./s02-componentes-interactivos.md) | Botones y FAB, formulario con `OutlinedTextField` validado en una hoja inferior, `Slider` y `AlertDialog` | [3A.2](../a-diseno/3a.2-componentes-interactivos.md) | `s3.02-inicio` → `s3.02-fin` |
| [**3.03** · Navigation 3 (I)](./s03-navigation3-i.md) | Destinos tipados, la pila de navegación, pantalla de detalle con argumentos y estado compartido entre pantallas | [3B.1 §1-7](../b-navegacion/3b.1-navigation3.md) | `s3.03-inicio` → `s3.03-fin` |
| [**3.04** · Navigation 3 (II) y edge-to-edge](./s04-navigation3-ii-edge-to-edge.md) | Volver atrás, barra de navegación inferior con una pila por pestaña, insets y dibujar bajo las barras del sistema | [3B.1 §6 y §10](../b-navegacion/3b.1-navigation3.md#6-volver-atras), [3B.2 §2](../b-navegacion/3b.2-diseno-adaptativo.md#2-edge-to-edge-aprovechar-toda-la-pantalla) | `s3.04-inicio` → `s3.04-fin` |
| [**3.05** · ViewModel y UiState (I)](./s05-viewmodel-uistate-i.md) | El ViewModel como contenedor del estado, `UiState` inmutable, `StateFlow`, flujo unidireccional y tests del ViewModel | [3C.1](../c-arquitectura/3c.1-capa-ui-viewmodel.md), [3C.4 §1](../c-arquitectura/3c.4-testing.md#1-que-probar-y-donde) | `s3.05-inicio` → `s3.05-fin` |
| [**3.06** · ViewModel y UiState (II)](./s06-viewmodel-uistate-ii.md) | Repositorio compartido, un ViewModel por pantalla asociado a su entrada de la pila y estado derivado con `combine` y `stateIn` | [3B.1 §8](../b-navegacion/3b.1-navigation3.md#8-un-viewmodel-para-cada-pantalla), [3C.2 §8-9](../c-arquitectura/3c.2-clean-architecture.md#8-paso-5-viewmodel-que-reciben-sus-dependencias) | `s3.06-inicio` → `s3.06-fin` |

Las guías se irán publicando a medida que avance la unidad.
