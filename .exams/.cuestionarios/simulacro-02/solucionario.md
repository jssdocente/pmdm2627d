# Solucionario Oficial: Cuestionario de Evaluación (Kotlin)

**Módulo:** Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM  
**Curso Académico:** 2026 / 2027  
**Total de preguntas:** 40  
**Baremo de corrección:** Acierto: `+1.00 pt` | Fallo: `-0.33 pts` | Blanco: `0.00 pts`  
**Escala:** Normalizada de 0.00 a 10.00 puntos

---

## 1. Plantilla Rápida de Corrección

| 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **C** | **A** | **B** | **D** | **B** | **A** | **C** | **B** | **B** |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **A** | **C** | **B** | **C** | **B** | **A** | **B** | **A** | **C** | **B** |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **D** | **B** | **A** | **C** | **B** | **A** | **C** | **B** | **A** | **C** |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **D** | **A** | **B** | **C** | **A** | **B** | **C** | **B** | **A** |

---

## 2. Detalle y Justificaciones Pedagógicas

| Nº | Clave | Concepto y Justificación Pedagógica |
| :-: | :---: | :---------------------------------- |
| **01** | **B** | `numeros` está declarada con `val`, por lo que su referencia es inmutable y no puede reasignarse a otra lista. |
| **02** | **C** | Los literales con decimales como `3.14` se infieren por defecto como `Double`. Para `Float` se requiere sufijo `f`. |
| **03** | **A** | La división entre dos enteros (`7 / 2`) produce una división truncada entera (`3`). |
| **04** | **B** | `$usuario.length` solo interpola la variable `$usuario`, dejando `.length` como texto plano literal. Se requiere `${usuario.length}`. |
| **05** | **D** | `val` fomenta la inmutabilidad, previene efectos secundarios indeseados y facilita el diseño de aplicaciones concurrentes robustas. |
| **06** | **B** | `try-catch` es una expresión en Kotlin que devuelve el valor de la rama capturada (`80`). |
| **07** | **A** | La comprobación `is String` aplica *Smart Cast* automático, permitiendo acceder a `${item.length}` de forma segura. |
| **08** | **C** | La propiedad `.indices` proporciona el rango de índices válidos de la colección (`0..size - 1`). |
| **09** | **B** | El operador `!in 1..10` verifica si el número no pertenece al rango; como 12 no está en 1..10, entra en el `if`. |
| **10** | **B** | El bucle `do-while` ejecuta su cuerpo siempre al menos una primera vez antes de evaluar la condición de parada. |
| **11** | **A** | La llamada segura `?.` sobre una variable nula no invoca el método y evalúa directamente a `null`. |
| **12** | **C** | Encadenamiento Elvis: evalúa de izquierda a derecha buscando el primer valor no nulo; al ser los dos primeros nulos, devuelve `"Produccion"`. |
| **13** | **B** | Kotlin realiza *Smart Cast* automático tras comprobar explícitamente `!= null` sobre variables locales inmutables. |
| **14** | **C** | Una función con retorno `String?` no puede asignarse a una variable de tipo estricto no anulable `String`. |
| **15** | **B** | Abusar del operador `!!` suprime las comprobaciones de nulos en compilación y reintroduce el riesgo de `NullPointerException` en tiempo de ejecución. |
| **16** | **A** | El tipo de retorno por defecto de las funciones que no devuelven un valor útil es `Unit` (equivalente moderno a `void`). |
| **17** | **B** | Los argumentos nombrados clarifican el código y evitan errores de asignación cuando hay múltiples parámetros consecutivos del mismo tipo. |
| **18** | **A** | Los métodos miembros de la clase siempre tienen prioridad sobre funciones de extensión con la misma firma. |
| **19** | **C** | Al ser la lambda el último parámetro, se extrae fuera de los paréntesis de la llamada (*trailing lambda*). |
| **20** | **B** | El tipo de función para una acción sin parámetros y sin retorno es `() -> Unit`. |
| **21** | **D** | En una lambda multilínea, el resultado de la última expresión evaluada (`producto - suma`) es el valor devuelto. |
| **22** | **B** | Los métodos en Kotlin son `final` por defecto; se debe marcar explícitamente `open fun` en la clase base para permitir su sobrescritura. |
| **23** | **A** | Kotlin exige obligatoriamente la palabra clave `override` para sobrescribir cualquier método o propiedad. |
| **24** | **C** | Las clases abstractas pueden combinar métodos abstractos (sin cuerpo) y métodos concretos con implementación por defecto. |
| **25** | **B** | Polimorfismo dinámico: al iterar sobre una lista de interfaz, cada elemento invoca su propia implementación (`Email Push `). |
| **26** | **A** | Las interfaces en Kotlin pueden declarar propiedades abstractas o con getters personalizados, pero no pueden almacenar estado en memoria. |
| **27** | **C** | Un constructor secundario delega en el constructor primario de la clase mediante la sintaxis `: this(...)`. |
| **28** | **B** | Se utiliza `super.calcularSalario()` para invocar la lógica original del método sobrescrito en la superclase. |
| **29** | **A** | El método `toString()` autogenerado por una `data class` imprime el nombre de la clase seguido de sus propiedades y valores. |
| **30** | **C** | `data class` genera `equals()` y `hashCode()` basados en sus propiedades; dos instancias con mismos datos se tratan como duplicadas en un `HashSet`. |
| **31** | **B** | Las `data class` no pueden ser declaradas como `open` ni `abstract`; ninguna clase puede heredar de una `data class`. |
| **32** | **D** | El compilador solo incluye en `equals()` y `hashCode()` las propiedades del constructor primario, ignorando las declaradas en el cuerpo. |
| **33** | **A** | Su principal ventaja es eliminar código repetitivo (*boilerplate*) generando de forma fiable `equals`, `hashCode`, `toString` y `copy`. |
| **34** | **B** | El patrón `objeto?.let { ... }` ejecuta el bloque únicamente si el objeto no es nulo, garantizando que `it` sea de tipo no nulo dentro de la lambda. |
| **35** | **C** | Ambas devuelven el propio receptor, pero `apply` expone el contexto como `this` (configuración) y `also` como `it` (acciones secundarias). |
| **36** | **A** | `with(receptor)` recibe el objeto por argumento, expone sus miembros como `this` y devuelve el resultado de la última expresión. |
| **37** | **B** | `run { ... }` agrupa un bloque de código y devuelve el resultado evaluado por su última expresión (`String`). |
| **38** | **C** | `.any { it == 10 }` evalúa a `true` si al menos un elemento de la colección cumple la condición. |
| **39** | **B** | En colecciones vacías, `firstOrNull()` devuelve `null` de forma segura, mientras que `first()` lanza una excepción `NoSuchElementException`. |
| **40** | **A** | Una función `suspend` puede suspenderse sin bloquear el hilo, y solo puede llamarse desde otra función `suspend` o dentro de una corrutina. |
