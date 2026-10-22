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
| **B** | **A** | **C** | **B** | **B** | **A** | **C** | **B** | **A** | **D** |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **B** | **A** | **B** | **C** | **A** | **B** | **D** | **B** | **A** | **B** |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **C** | **B** | **A** | **B** | **D** | **C** | **B** | **A** | **B** | **A** |

---

## 2. Detalle y Justificaciones Pedagógicas

| Nº | Clave | Concepto y Justificación Pedagógica |
| :-: | :---: | :---------------------------------- |
| **01** | **B** | `lista` es una variable `val` (referencia inmutable); modificar sus elementos es válido, pero reasignarla a otra lista produce error de compilación. |
| **02** | **A** | El sufijo `f` en un literal decimal (`36.6f`) fuerza al compilador a inferir el tipo como `Float`. |
| **03** | **C** | `trimMargin()` recorta el margen hasta el delimitador predeterminado `\|` en cada línea de la cadena multilínea. |
| **04** | **B** | `.toIntOrNull()` intenta la conversión y, al contener caracteres no numéricos (`"100pts"`), devuelve `null` de forma segura. |
| **05** | **B** | `try-catch` es una expresión que devuelve el valor de la rama capturada (`-1` al fallar el parseo de `"abc"`). |
| **06** | **A** | La comprobación `is Int` aplica *Smart Cast* automático, evaluando `15 * 2 = 30` en la rama correspondiente. |
| **07** | **C** | Bucle decreciente con `downTo` y `step 3`: parte de 10, pasa a 7 y finaliza en 4 (inclusivo): `10 7 4 `. |
| **08** | **B** | La propiedad `.indices` proporciona el rango de índices válidos de la colección para iterar con un bucle `for`. |
| **09** | **A** | Al encontrar un valor nulo, la cadena de llamadas seguras `?.` interrumpe la evaluación y propaga `null`. |
| **10** | **D** | El operador Elvis permite ejecutar una salida anticipada mediante `return` si la variable evaluada es nula. |
| **11** | **B** | El compilador aplica *Smart Cast* tras validar `!= null` sobre variables locales inmutables, permitiendo llamar a `.uppercase()`. |
| **12** | **A** | El operador `as?` (safe cast) devuelve `null` de forma segura si el objeto no es compatible con el tipo de destino (`Int`). |
| **13** | **B** | Los argumentos nombrados permiten pasar parámetros en cualquier orden e ignorar aquellos con valores por defecto. |
| **14** | **C** | Dentro de una función de extensión, `this` hace referencia a la instancia concreta del objeto receptor sobre la que se invoca. |
| **15** | **A** | Al ser la expresión lambda el último parámetro de la función, se puede extraer fuera de los paréntesis (*trailing lambda*). |
| **16** | **B** | Las funciones sin valor de retorno útil devuelven por defecto el tipo `Unit`. |
| **17** | **D** | En una lambda multilínea, el resultado de la última expresión evaluada (`cuadrado + doble = 9 + 6 = 15`) es el valor devuelto. |
| **18** | **B** | En Kotlin las clases son `final` por defecto; se requiere `open class` en la superclase para permitir herencia. |
| **19** | **A** | Es estrictamente obligatorio usar la palabra clave `override` para sobrescribir cualquier método o propiedad abierta. |
| **20** | **B** | Polimorfismo dinámico: al recorrer la lista de supertipo, cada elemento ejecuta su propia versión del método (`Ejecutando tarea base; Realizando copia de seguridad; `). |
| **21** | **C** | Si una interfaz proporciona una implementación con cuerpo por defecto, implementarla en la subclase es opcional. |
| **22** | **B** | En caso de colisión de firmas entre múltiples interfaces, la clase desambigua llamando a `super<A>.sincronizar()`. |
| **23** | **A** | El método `toString()` autogenerado por una `data class` imprime el nombre de la clase junto a sus propiedades y valores. |
| **24** | **B** | El método `copy()` devuelve una nueva instancia modificando únicamente los parámetros indicados y dejando inmutable la original. |
| **25** | **D** | El compilador solo incluye en `equals()` y `hashCode()` las propiedades del constructor primario, ignorando las declaradas en el cuerpo `{}`. |
| **26** | **C** | Para clases de servicio, repositorios o controladores con lógica compleja y estado mutable, se prefiere `class` estándar. |
| **27** | **B** | `with` evalúa el bloque exponiendo el receptor como `this` y devuelve el resultado de la última expresión (`length = 9`). |
| **28** | **A** | `also` expone el contexto como `it` y devuelve siempre el propio objeto receptor original, siendo ideal para depuración o logs. |
| **29** | **B** | `listOf()` produce una lista de solo lectura inmutable, mientras que `mutableListOf()` permite añadir o borrar elementos. |
| **30** | **A** | El modificador `suspend` indica que la función puede suspenderse sin bloquear el hilo, y solo puede llamarse desde otra función `suspend` o dentro de una corrutina. |
