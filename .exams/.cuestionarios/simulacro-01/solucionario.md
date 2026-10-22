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
| **B** | **C** | **A** | **B** | **D** | **B** | **C** | **A** | **C** | **B** |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **A** | **D** | **C** | **A** | **B** | **B** | **C** | **A** | **C** |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **B** | **D** | **A** | **B** | **A** | **C** | **B** | **C** | **B** |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **A** | **D** | **C** | **A** | **B** | **D** | **B** | **C** | **B** |

---

## 2. Detalle y Justificaciones Pedagógicas

| Nº | Clave | Concepto y Justificación Pedagógica |
| :-: | :---: | :---------------------------------- |
| **01** | **B** | `val` declara una referencia de solo lectura (inmutable). Kotlin impide su reasignación en tiempo de compilación. |
| **02** | **C** | No existe conversión implícita de tipos numéricos; Kotlin exige llamada explícita como `entero.toLong()`. |
| **03** | **A** | Las variables simples usan `$variable`, pero cualquier operación o expresión compuesta requiere llaves `${expresion}`. |
| **04** | **B** | `trimMargin()` elimina el margen inicial delimitado por el carácter pipe `\|` en las cadenas multilínea (*raw strings*). |
| **05** | **D** | Kotlin es de tipado estático: el compilador infiere el tipo de la variable y rechaza tipos incompatibles posteriores. |
| **06** | **B** | En Kotlin `if` es una expresión que devuelve un valor (reemplazando al operador ternario). Como 16 < 18, evalúa el `else`. |
| **07** | **C** | Las ramas de `when` se comprueban secuencialmente. Como 7 entra en el rango `7..8`, esa rama se ejecuta primero. |
| **08** | **A** | Un `when` sin argumento evalúa las ramas como condiciones booleanas secuenciales (sustituye a múltiples `if - else if`). |
| **09** | **C** | `until` excluye el límite superior (recorre 1..6) y `step 2` salta de dos en dos: produce `1 3 5 `. |
| **10** | **B** | Bucle decreciente con `downTo` y `step 3`: parte de 8, pasa a 5 y finaliza en 2 (inclusivo): `8 5 2 `. |
| **11** | **B** | En Kotlin `String` no admite `null`. Para almacenar valores nulos el tipo debe ser explícitamente anulable `String?`. |
| **12** | **A** | Si la referencia inicial es nula, el operador de llamada segura `?.` interrumpe la cadena y devuelve `null`. |
| **13** | **D** | El operador Elvis (`?:`) admite a su derecha instrucciones de control como `return` o `throw` para salida anticipada. |
| **14** | **C** | El operador `!!` (aserto de no nulidad) fuerza la desreferenciación; si el valor es `null` lanza `NullPointerException`. |
| **15** | **A** | El *safe cast* (`as?`) intenta convertir el tipo y, si no es compatible, devuelve `null` sin lanzar excepción. |
| **16** | **B** | Las funciones de expresión única (`=`) omiten llaves y `return`, y el compilador infiere su tipo de retorno (`Int`). |
| **17** | **B** | Los parámetros con valores por defecto se omiten en la llamada; los argumentos nombrados permiten especificar solo los deseados. |
| **18** | **C** | Las funciones de extensión se declaran anteponiendo el receptor `fun String.nombre()`, y `this` representa la instancia. |
| **19** | **A** | Si el último parámetro es una lambda, se puede escribir fuera de los paréntesis de la llamada (*trailing lambda*). |
| **20** | **C** | En lambdas de un único parámetro, Kotlin proporciona implícitamente el identificador `it` para referenciarlo. |
| **21** | **B** | La sintaxis `operar(5): { it + 1 }` es errónea; los dos puntos `:` no forman parte de la invocación de funciones en Kotlin. |
| **22** | **B** | Por defecto todas las clases en Kotlin son `final`. Para permitir que otra clase herede de ella debe ser `open class`. |
| **23** | **D** | Al sobrescribir métodos abiertos en Kotlin es estrictamente obligatoria la palabra clave `override fun`. |
| **24** | **A** | Las clases abstractas no admiten instanciación directa y delegan sus métodos abstractos a las subclases concretas. |
| **25** | **B** | Principio de polimorfismo dinámico: se ejecuta el método de la instancia real en memoria (`ImpresoraColor.imprimir()`). |
| **26** | **A** | Las interfaces en Kotlin admiten métodos con cuerpo por defecto; las clases que las implementan solo deben implementar los abstractos. |
| **27** | **C** | Si dos interfaces colisionan en un método con cuerpo, la subclase desambigua llamando a `super<Interfaz>.metodo()`. |
| **28** | **B** | La delegación al constructor de la superclase se define en la cabecera del constructor primario: `: Elemento(id)`. |
| **29** | **C** | El compilador autogenera en una `data class` los métodos `equals()`, `hashCode()`, `toString()` y `copy()`. |
| **30** | **B** | Una clase normal compara por identidad de memoria (`==` es false), mientras que `data class` compara por contenido (`==` es true). |
| **31** | **B** | `copy()` clona la instancia inmutable modificando solo los parámetros indicados y dejando inalterado el objeto original. |
| **32** | **A** | Una `data class` exige al menos un parámetro en su constructor primario marcado obligatoriamente con `val` o `var`. |
| **33** | **D** | Se prefiere `class` estándar en clases con lógica compleja de negocio, estado mutable y servicios de persistencia o red. |
| **34** | **C** | `let` ejecuta el bloque con el contexto como `it` y devuelve el resultado de la última expresión evaluada (11). |
| **35** | **A** | `apply` expone el objeto como `this` y devuelve siempre el propio objeto receptor ya configurado. |
| **36** | **B** | El propósito idiomático de `also` es ejecutar acciones secundarias (como logs o auditorías) sin alterar el retorno del objeto. |
| **37** | **D** | `run` devuelve el resultado de la última expresión de la lambda, mientras que `apply` devuelve el propio objeto receptor. |
| **38** | **B** | `listOf()` produce una lista de solo lectura (`List`), que no expone métodos de mutación como `add()`. Se requiere `mutableListOf()`. |
| **39** | **C** | `filter` selecciona los pares `[10, 20, 30]` y `map` divide cada uno entre dos: `[5, 10, 15]`. |
| **40** | **B** | `launch` devuelve un `Job` sin resultado, mientras que `async` devuelve un `Deferred<T>` cuyo valor se espera con `await()`. |
