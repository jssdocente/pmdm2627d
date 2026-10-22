# Solucionario Oficial: Cuestionario de Evaluación (Kotlin)

**Módulo:** Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM  
**Curso Académico:** 2026 / 2027  
**Total de preguntas:** 30  
**Baremo de corrección:** Acierto: `+1.00 pt` | Fallo: `-0.33 pts` | Blanco: `0.00 pts`  
**Escala:** Normalizada de 0.00 a 10.00 puntos

---

## 1. Plantilla Rápida de Corrección

| 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **C** | **A** | **B** | **B** | **C** | **A** | **B** | **A** | **C** |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **A** | **B** | **C** | **B** | **A** | **B** | **B** | **D** | **B** |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **A** | **C** | **B** | **B** | **A** | **C** | **B** | **A** | **C** | **B** |

---

## 2. Detalle y Justificaciones Pedagógicas

| Nº | Clave | Concepto y Justificación Pedagógica |
| :-: | :---: | :---------------------------------- |
| **01** | **B** | `val` declara una variable de solo lectura; reasignar su valor en la línea 3 produce error de compilación. |
| **02** | **C** | En Kotlin no hay promoción implícita de tipos numéricos; para asignar un `Int` a un `Long` se requiere `entero.toLong()`. |
| **03** | **A** | Cualquier operación compuesta dentro de una plantilla de texto debe encerrarse entre llaves: `${base * (1 + iva)}`. |
| **04** | **B** | La división entre enteros en Kotlin es truncada (`9 / 2 = 4`). Para división real se requeriría `9.0 / 2`. |
| **05** | **B** | `if` es una expresión asignable; como 16 < 18, evalúa y retorna la rama `else` (`"Menor de edad"`). |
| **06** | **C** | Las ramas de `when` se comprueban secuencialmente. Como 7 pertenece al rango `7..8`, esa rama se ejecuta primero (`"Notable"`). |
| **07** | **A** | `until` excluye el límite superior (recorre 1..6) y `step 2` salta de dos en dos, generando `1 3 5 `. |
| **08** | **B** | `when` sin argumento evalúa las ramas como condiciones booleanas; la primera en cumplirse es `puntuacion >= 80` (`"B"`). |
| **09** | **A** | Al ser `apellidos` nulo, la llamada segura `?.` no invoca `.length` y evalúa directamente a `null`. |
| **10** | **C** | El operador Elvis `?:` evalúa la izquierda y, si es nula, toma el valor alternativo de la derecha (`8080`). |
| **11** | **B** | El operador de aserción no nula `!!` fuerza la ejecución y lanza `NullPointerException` si la variable vale `null`. |
| **12** | **A** | El *safe cast* (`as?`) intenta convertir el tipo de forma segura; si no es compatible devuelve `null` sin lanzar excepción. |
| **13** | **B** | Las funciones de expresión única (`=`) omiten llaves y `return`, y el compilador infiere su tipo de retorno (`Int`). |
| **14** | **C** | Los argumentos con nombre permiten omitir parámetros con valores por defecto y pasar solo los necesarios en cualquier orden. |
| **15** | **B** | Sintaxis canónica de función de extensión: `fun String.esLarga(): Boolean = this.length > 5`. |
| **16** | **A** | La lambda fuera de los paréntesis (*trailing lambda*) aplica la transformación a cada elemento mediante el parámetro implícito `it`. |
| **17** | **B** | La función de orden superior recibe la lambda `{ it + 3 }` y la aplica sobre 4: `4 + 3 = 7`. |
| **18** | **B** | Por defecto todas las clases en Kotlin son `final`; para que otra clase herede de ella debe ser explícitamente `open class`. |
| **19** | **D** | En Kotlin la palabra clave `override` es obligatoria para sobrescribir cualquier método abierto de una superclase. |
| **20** | **B** | Polimorfismo dinámico: en tiempo de ejecución se invoca el método sobrescrito de la instancia real (`Perro.hablar()`). |
| **21** | **A** | Las interfaces en Kotlin admiten implementaciones por defecto; las clases que las implementan heredan el método automáticamente. |
| **22** | **C** | La invocación al constructor de la superclase se realiza en la cabecera de la clase derivada: `: Elemento(id)`. |
| **23** | **B** | El compilador genera automáticamente en una `data class`: `equals()`, `hashCode()`, `toString()` y `copy()`. |
| **24** | **B** | La clase estándar compara por identidad de memoria (`==` es false), mientras que la `data class` compara por contenido (`==` es true). |
| **25** | **A** | `copy()` clona la instancia modificando únicamente los argumentos especificados y manteniendo el objeto original inmutable. |
| **26** | **C** | Una `data class` debe tener al menos un parámetro con `val`/`var` en su constructor primario y no puede ser `open` ni `abstract`. |
| **27** | **B** | `apply` devuelve el propio objeto receptor (`this`), mientras que `let` devuelve el resultado de la última expresión de la lambda. |
| **28** | **A** | El patrón `objeto?.let { ... }` garantiza que el bloque solo se ejecuta si el objeto no es nulo, exponiéndolo como `it` no anulable. |
| **29** | **C** | `filter` conserva las cadenas de longitud <= 3 (`"sol"`, `"mar"`, `"rio"`) y `map` las convierte a mayúsculas: `[SOL, MAR, RIO]`. |
| **30** | **B** | El builder `async` inicia una corrutina que devuelve un valor encapsulado en un `Deferred<T>`, cuyo resultado se obtiene con `await()`. |
