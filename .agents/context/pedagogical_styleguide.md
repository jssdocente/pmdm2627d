# Guía de Estilo Pedagógico y Estándares de Código

Esta guía define las convenciones de redacción docente, estructura de temas y estándares de código que los agentes deben aplicar al generar o editar material en este repositorio.

---

## 1. Perfil del Estudiante y Tono Pedagógico

### Audiencia
- Estudiantes de **2º curso de DAM** (Ciclo Formativo de Grado Superior).
- Poseen conocimientos previos de:
  - Programación Orientada a Objetos en Java (1º DAM).
  - Bases de datos relacionales SQL (MySQL / PostgreSQL).
  - Entornos IDE (IntelliJ, Eclipse o VSCode) y control de versiones Git básico.
- Se inician por primera vez en:
  - Sintaxis idiomática y paradigmas funcionales de Kotlin.
  - Programación reactiva y declarativa (Jetpack Compose).
  - Ciclo de vida y gestión de memoria en dispositivos móviles.
  - Motores de videojuegos basados en componentes (Unity).

### Tono y Enfoque Didáctico
1. **Pragmático y orientado a proyectos:** Explicar el "por qué" antes del "cómo". Evitar teoría enciclopédica desvinculada de casos reales.
2. **Evolución guiada:** Partir del ejemplo más simple posible (Happy Path) y refinarlo añadiendo gestión de errores, estado y arquitectura.
3. **Señalización explícita de errores comunes ("Gotchas"):** Anticipar fallos típicos que cometen los alumnos (ej. olvidar `remember`, bloquear el hilo principal de UI, no gestionar nulos adecuadamente).
4. **Respeto a las convenciones oficiales:** Emplear las guías de estilo oficiales de Google Android y Jetpack Compose.

---

## 2. Estructura Estándar de una Lección / Tema

Cada nuevo documento de contenido (`.md`) debe estructurarse idealmente en las siguientes secciones:

1. **Título y Breve Introducción:** 2-3 párrafos resumiendo el objetivo del tema y qué problema resuelve.
2. **Conceptos Clave:** Explicación teórica concisa apoyada en esquemas o diagramas Mermaid.
3. **Ejemplo Práctico Paso a Paso:** Código mínimo funcional con explicaciones intercaladas.
4. **Buenas Prácticas y Errores Frecuentes:** Cajas de advertencia (`!!! warning` o `!!! tip`).
5. **Ejercicios Propuestos / Retos:** Pequeños ejercicios graduados por dificultad (Básico, Intermedio, Avanzado) para que los alumnos practiquen de forma autónoma.
6. **Recursos y Enlaces Oficiales:** Enlaces a la documentación de Android Developers, Codelabs o repositorio del módulo.

---

## 3. Estándares de Código: Kotlin y Android (Jetpack Compose)

### 3.1. Nomenclatura y Convenciones
- **Funciones Composable:** En `PascalCase` que devuelven `Unit` y representen elementos de UI:
  ```kotlin
  @Composable
  fun UserProfileCard(user: User, onEditClick: () -> Unit) { ... }
  ```
- **Funciones regulares y lambdas:** En `camelCase`:
  ```kotlin
  fun calculateDiscount(price: Double): Double
  ```
- **Variables de Estado:** Usar nombres claros y descriptivos. Cuando se expone estado desde un ViewModel:
  ```kotlin
  // En el ViewModel:
  private val _uiState = MutableStateFlow(GameListUiState())
  val uiState: StateFlow<GameListUiState> = _uiState.asStateFlow()
  ```

### 3.2. Reglas de Diseño de Composables
1. **State Hoisting (Elevación del Estado):**
   - Siempre que sea posible, hacer los composables **stateless** (sin estado interno acoplado), recibiendo los datos mediante parámetros y notificando eventos mediante callbacks lambda (`() -> Unit`).
2. **Modifiers:**
   - Todo composable reutilizable debe aceptar como primer parámetro opcional `modifier: Modifier = Modifier` y aplicarlo al elemento raíz.
3. **Evitar lógica de negocio en la UI:**
   - La capa de presentación solo debe renderizar el estado y reenviar eventos al `ViewModel`. No realizar cálculos complejos, consultas a BD o llamadas de red dentro de un composable.
4. **Preview con datos de prueba:**
   - Incluir anotaciones `@Preview(showBackground = true)` en componentes aislados para facilitar la visualización en Android Studio.

---

## 4. Estándares de Código: Unity y C#

### 4.1. Nomenclatura
- **Clases y Métodos:** `PascalCase` (ej. `PlayerController`, `TakeDamage`).
- **Variables públicas o serializadas:** `camelCase` con atributo explicativo:
  ```csharp
  [SerializeField] private float movementSpeed = 5f;
  ```
- **Nombres de componentes:** Describir su comportamiento (ej. `HealthSystem`, `CoinCollector`).

### 4.2. Buenas Prácticas en Scripts
- Evitar el uso intensivo de `FindObjectOfType` o `GameObject.Find` en `Update()`. Cachear referencias en `Awake()` o `Start()`.
- Usar `FixedUpdate()` para operaciones de físicas sobre `Rigidbody`.
- Mantener scripts modulares y desacoplados con responsabilidades únicas.
