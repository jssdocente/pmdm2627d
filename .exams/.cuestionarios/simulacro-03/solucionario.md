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
| **B** | **C** | **A** | **B** | **C** | **A** | **B** | **A** | **C** | **B** |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **C** | **A** | **B** | **B** | **A** | **B** | **C** | **A** | **B** | **A** |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **C** | **B** | **B** | **A** | **C** | **B** | **A** | **C** | **B** | **A** |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **C** | **B** | **A** | **C** | **B** | **A** | **D** | **B** | **A** | **C** |

---

## 2. Detalle y Justificaciones Pedagógicas

| Nº | Clave | Concepto y Justificación Pedagógica |
| :-: | :---: | :---------------------------------- |
| **01** | **B** | `val` garantiza la inmutabilidad de la variable (referencia), pero el estado interno del objeto puede mutar si sus propiedades son `var`. |
| **02** | **C** | Los caracteres (`Char`) no se tratan como números enteros en Kotlin; compararlos directamente con un `Int` genera error de compilación. Se requiere `'A'.code`. |
| **03** | **A** | El operador `&&` evalúa con cortocircuito de izquierda a derecha: si `lista != null` es falso, la segunda parte nunca se evalúa. |
| **04** | **B** | `.toIntOrNull()` intenta la conversión a entero devolviendo `null` de forma segura en caso de error de formato. |
| **05** | **C** | `==` comprueba igualdad de contenido (invoca `equals()`), mientras que `===` comprueba si ambas referencias apuntan al mismo objeto en memoria. |
| **06** | **A** | En una estructura `when` se pueden agrupar múltiples valores en la misma rama separándolos por comas (`1, 2, 3, 4, 5 ->`). |
| **07** | **B** | Cuando `if` se utiliza como expresión (para devolver un resultado asignable), la rama `else` es estrictamente obligatoria. |
| **08** | **A** | Se puede iterar directamente sobre un `String` carácter por carácter; el `break` detiene el bucle antes de imprimir `'t'`: imprime `Ko`. |
| **09** | **C** | El bucle decrementa `n` antes de imprimir: para 5 imprime 4, para 4 imprime 3 y para 3 imprime 2; al valer 2 la condición `2 > 2` detiene el bucle. |
| **10** | **B** | El bloque `when` sobre un booleano es exhaustivo si cubre tanto `true` como `false`, por lo que la rama `else` no es obligatoria. |
| **11** | **C** | El operador Elvis (`?:`) admite la instrucción `throw` a su derecha para interrumpir el flujo lanzando una excepción si la variable es nula. |
| **12** | **A** | Las funciones de extensión pueden definirse sobre receptores anulables (`CharSequence?`), gestionando el caso de nulidad internamente. |
| **13** | **B** | `dato as? Int` falla de forma segura produciendo `null`, y el operador Elvis posterior devuelve el valor alternativo `-1`. |
| **14** | **B** | Las plantillas de cadenas interpolan valores nulos como el texto literal `"null"`, sin lanzar excepciones. |
| **15** | **A** | La comprobación `is String` dentro del `when` aplica *Smart Cast* automático, permitiendo acceder a los métodos de `String` directamente. |
| **16** | **B** | Si el callback o lambda es el último argumento, la convención de Kotlin permite escribirlo fuera de los paréntesis (*trailing lambda*). |
| **17** | **C** | La lambda `{ it * it }` toma el único argumento implícito `it` y devuelve su cuadrado sin requerir la palabra `return`. |
| **18** | **A** | La sintaxis `fun String?.oVacio(): String = this ?: ""` define una función de extensión sobre el tipo anulable `String?`. |
| **19** | **B** | Se puede pasar una función existente como parámetro utilizando la sintaxis de referencia a función con doble dos puntos `::println`. |
| **20** | **A** | Los valores por defecto en Kotlin se evalúan en tiempo de ejecución en cada invocación en la que se omite el argumento. |
| **21** | **C** | Las funciones de una sola línea pueden devolver un bloque `when` directamente tras el signo igual `=`, omitiendo llaves y `return`. |
| **22** | **B** | Al heredar de una clase con constructor primario sin argumentos, se debe invocar explícitamente al constructor: `class Derivada : Base()`. |
| **23** | **B** | Las propiedades declaradas como `open val` en la superclase pueden sobrescribirse en las clases derivadas con `override val`. |
| **24** | **A** | A través de una referencia de tipo interfaz (`Volador`), solo se pueden invocar los métodos definidos formalmente en dicha interfaz. |
| **25** | **C** | En Kotlin una clase puede implementar múltiples interfaces separándolas simplemente por comas (`class Documento : A, B`). |
| **26** | **B** | En Kotlin un método marcado con `override` permanece abierto para sus subclases a menos que se declare explícitamente como `final override fun`. |
| **27** | **A** | El bloque `init` se ejecuta inmediatamente tras el constructor primario y la inicialización de las propiedades en orden de declaración. |
| **28** | **C** | Principio de polimorfismo: la función procesa cualquier subclase de `Forma` invocando la implementación adecuada en tiempo de ejecución. |
| **29** | **B** | `p1 == p2` evalúa a `true` (igualdad de propiedades en `data class`), pero `p1 === p2` es `false` (son dos instancias distintas en memoria). |
| **30** | **A** | El método `copy()` permite modificar múltiples propiedades a la vez mediante argumentos nombrados (`copy(email = ..., telefono = ...)`). |
| **31** | **C** | Las `data class` pueden implementar interfaces sin ninguna restricción y proveer la implementación de sus miembros. |
| **32** | **B** | En entidades con relaciones bidireccionales circulares, los métodos autogenerados `toString()`, `equals()` y `hashCode()` producen recursión infinita (`StackOverflowError`). |
| **33** | **A** | Para comparar entidades por un identificador de negocio único (ID) ignorando otros campos, se usa `class` estándar sobrescribiendo `equals()` manualmente. |
| **34** | **C** | `apply` es la función idónea para inicializar objetos, ya que ejecuta un bloque de configuración (`this`) y devuelve el propio objeto receptor. |
| **35** | **B** | `run` sobre un objeto receptor ejecuta el bloque exponiendo el contexto como `this` y devuelve el resultado de la última expresión (`"NILTOK"`). |
| **36** | **A** | `also` expone el contexto como `it` y devuelve siempre la instancia receptora original intacta (`retorno === lista` es `true`). |
| **37** | **D** | `let`, `run` y `with` devuelven el resultado de la lambda, mientras que `apply` y `also` devuelven el propio objeto receptor. |
| **38** | **B** | `groupBy { it.length }` agrupa los elementos en un mapa `Map<Int, List<String>>` según el criterio especificado. |
| **39** | **A** | `reduce` acumula consecutivamente los valores de la lista multiplicándolos entre sí (`1 * 2 * 3 * 4 = 24`). |
| **40** | **C** | `Dispatchers.IO` está diseñado específicamente para operaciones intensivas de entrada/salida (ficheros, red y bases de datos Room). |
