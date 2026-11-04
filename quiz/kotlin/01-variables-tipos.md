---
bloque: 1
titulo: Variables, tipos e inmutabilidad
apuntes: temas/00-android/00-kotlin/11-variables-tipos-datos.md
---

## kt-var-001 {dificultad=2 tipo=salida ancla=31-inmutabilidad-de-la-referencia-vs-inmutabilidad-del-objeto}

¿Qué imprime este código?

```kotlin
val juegos = mutableListOf("Tetris", "Zelda")
juegos.add("Celeste")
println(juegos)
```

### A ✔

`[Tetris, Zelda, Celeste]`

> Correcto. `val` impide **reasignar la referencia** (`juegos = ...`), pero no impide modificar el objeto al que apunta. La lista es mutable (`mutableListOf`), así que `add` funciona.

### B

Error de compilación: `juegos` es `val` y no se puede modificar.

> Confunde inmutabilidad de la **referencia** con inmutabilidad del **objeto**. `val` solo prohíbe `juegos = otraLista`; el contenido de una `MutableList` sí puede cambiar.

### C

`[Tetris, Zelda]`

> `add` no devuelve una lista nueva: modifica la misma lista. Por eso al imprimirla ya aparece `Celeste`.

### D

Lanza `UnsupportedOperationException`.

> Esa excepción aparece al intentar modificar una lista de solo lectura desde Java. Aquí la lista se creó con `mutableListOf`, que sí admite `add`.

## kt-var-002 {dificultad=3 tipo=salida ancla=41-tipos-numericos}

¿Qué imprime este código?

```kotlin
val max = Int.MAX_VALUE
println(max + 1)
println(max.toLong() + 1)
```

### A ✔

```text
-2147483648
2147483648
```

> Correcto. Un `Int` ocupa 32 bits. Al sumar 1 al máximo se produce un **desbordamiento** (*overflow*) y el valor «da la vuelta» al mínimo negativo, sin avisar. Si se convierte antes a `Long` (64 bits), cabe el resultado correcto.

### B

```text
2147483648
2147483648
```

> `max + 1` se calcula como `Int`, y 2147483648 no cabe en un `Int`. Kotlin no amplía el tipo automáticamente.

### C

Lanza `ArithmeticException` en la primera suma.

> La aritmética entera en la JVM **no** comprueba el desbordamiento: el resultado es incorrecto, pero no se lanza ninguna excepción. Por eso conviene elegir bien el tipo.

### D

Error de compilación: el resultado no cabe en un `Int`.

> El compilador no evalúa si la suma se desborda. Compila y el problema aparece en ejecución, como un valor erróneo.

## kt-var-003 {dificultad=2 tipo=salida ancla=53-igualdad-estructural-vs-referencial}

¿Qué imprime este código?

```kotlin
val a = "Kotlin"
val b = StringBuilder("Kot").append("lin").toString()
println(a == b)
println(a === b)
```

### A ✔

```text
true
false
```

> Correcto. `==` compara el **contenido** (llama a `equals`): ambos textos son `"Kotlin"`. `===` compara si son **el mismo objeto** en memoria, y `toString()` del `StringBuilder` crea un `String` nuevo.

### B

```text
true
true
```

> `===` no compara el texto, sino la identidad del objeto. `b` se construye en tiempo de ejecución y es un objeto distinto de `a`, aunque tenga las mismas letras.

### C

```text
false
false
```

> En Kotlin `==` **no** compara referencias como en Java: equivale a `equals`, así que dos `String` con el mismo texto son iguales con `==`.

### D

```text
false
true
```

> Está al revés: `==` es igualdad estructural (contenido) y `===` es igualdad referencial (mismo objeto).

## kt-var-004 {dificultad=2 tipo=compila error ancla=6-conversion-explicita-de-tipos}

¿Qué ocurre al compilar este fragmento?

```kotlin
var puntos = 0
puntos += 1.5
println(puntos)
```

### A ✔

Error de compilación: `puntos` es `Int` (inferido de `0`) y `puntos + 1.5` es `Double`.

> Correcto. El tipo se infiere **una vez** al declarar: `0` → `Int`. `puntos += 1.5` equivale a `puntos = puntos + 1.5`, que produce un `Double`, y Kotlin no lo convierte implícitamente a `Int`.

### B

Compila e imprime `1.5`.

> Para eso `puntos` tendría que ser `Double` desde el principio, por ejemplo `var puntos = 0.0`. Kotlin es de tipado estático: la variable no cambia de tipo.

### C

Compila e imprime `1`, porque se trunca el decimal.

> Kotlin no hace conversiones de estrechamiento silenciosas (en Java, `+=` sí hace un *cast* implícito). Si quieres truncar, debes escribirlo: `(puntos + 1.5).toInt()`.

### D

Compila, pero lanza `ClassCastException` al ejecutar.

> El error se detecta **en compilación**, no en ejecución: el compilador sabe los tipos de ambos lados y no coinciden.

## kt-var-005 {dificultad=1 tipo=salida ancla=42-caracteres-y-booleanos}

¿Qué imprime este código?

```kotlin
val letra = 'A'
println(letra + 2)
```

### A ✔

`C`

> Correcto. `Char + Int` devuelve otro `Char`: avanza 2 posiciones en la tabla de caracteres, de `A` a `C`.

### B

`67`

> Ese es el código numérico de `C`, pero el resultado de `Char + Int` es un `Char`, no un `Int`. Para obtener el número se usaría `letra.code + 2`.

### C

`A2`

> Eso pasaría al concatenar con un `String` (`"A" + 2`). Aquí `letra` es un `Char` (comillas simples) y la operación es aritmética.

### D

Error de compilación: no se puede sumar un `Char` y un `Int`.

> `Char` define el operador `plus(Int)` precisamente para desplazarse por los caracteres. Lo que no compila es `Char + Char`.

## kt-var-006 {dificultad=3 tipo=compila error ancla=51-plantillas-de-cadenas-string-templates}

¿Qué ocurre con este código?

```kotlin
val n = 3
println("Hay $n0 cajas")
```

### A ✔

Error de compilación: busca una variable llamada `n0`, que no existe.

> Correcto. Tras `$` el nombre de la variable se alarga mientras haya letras, dígitos o `_`, así que se interpreta `$n0`. Para pegar texto justo detrás hay que usar llaves: `"Hay ${n}0 cajas"`.

### B

Imprime `Hay 30 cajas`.

> Eso es lo que imprimiría `"Hay ${n}0 cajas"`. Sin llaves, el compilador no sabe dónde termina el nombre y toma `n0` entero.

### C

Imprime `Hay $n0 cajas` literalmente.

> `$` dentro de una cadena siempre inicia una plantilla. Para escribir el símbolo literal habría que escaparlo: `"\$n0"`.

### D

Imprime `Hay 3 cajas`, ignorando el `0`.

> El compilador no descarta caracteres: el `0` forma parte del identificador `n0`, y como no está declarado, falla.

## kt-var-007 {dificultad=1 tipo=salida ancla=6-conversion-explicita-de-tipos}

¿Qué imprime este código?

```kotlin
val texto = "42"
val numero = texto.toInt() + 1
println(numero)
```

### A ✔

`43`

> Correcto. `toInt()` convierte el `String` en un `Int`, y a partir de ahí `+ 1` es una suma aritmética.

### B

`421`

> Eso pasaría al sumar al `String` (`"42" + 1`). Después de `toInt()` el valor ya es un número.

### C

Error de compilación: no se puede convertir un `String` en `Int`.

> Sí se puede, pero de forma **explícita**, con `toInt()`. Lo que Kotlin no hace son conversiones implícitas.

### D

`"43"`

> `println` no muestra comillas, y además el resultado es un `Int`, no un `String`.

## kt-var-008 {dificultad=2 tipo=salida ancla=6-conversion-explicita-de-tipos}

¿Qué imprime este código?

```kotlin
println("5".toIntOrNull())
println("cinco".toIntOrNull())
```

### A ✔

```text
5
null
```

> Correcto. `toIntOrNull()` devuelve `null` si el texto no es un número válido, en lugar de lanzar una excepción. Es la forma segura de convertir lo que escribe el usuario.

### B

Lanza `NumberFormatException` en la segunda línea.

> Eso lo haría `"cinco".toInt()`. La variante `OrNull` existe precisamente para evitar la excepción.

### C

```text
5
0
```

> No hay un valor por defecto numérico: el fallo se representa con `null`. Si quieres un 0, añade Elvis: `toIntOrNull() ?: 0`.

### D

```text
5
5
```

> `"cinco"` no se interpreta como número: la conversión solo entiende dígitos.

## kt-var-009 {dificultad=2 tipo=compila error ancla=41-tipos-numericos}

¿Qué ocurre al compilar esta línea?

```kotlin
val precio: Double = 10
```

### A ✔

Error de compilación: `10` es un literal `Int` y no se convierte a `Double` automáticamente.

> Correcto. Kotlin no amplía tipos numéricos de forma implícita, ni siquiera en literales. Hay que escribir `10.0` o `10.toDouble()`.

### B

Compila, y `precio` vale `10.0`.

> En Java (`double precio = 10;`) sí funcionaría. Kotlin es más estricto: el literal debe ser del tipo correcto.

### C

Compila, y `precio` vale `10` como entero.

> Una variable declarada `Double` nunca guarda un `Int`. El compilador rechaza la asignación.

### D

Compila con un aviso (*warning*) de pérdida de precisión.

> No hay ninguna pérdida de precisión: el problema es de tipo, y es un **error**, no un aviso.

## kt-var-010 {dificultad=1 tipo=salida ancla=41-tipos-numericos}

¿Qué imprime este código?

```kotlin
val unidades = 10
val precio = 2.5
println(unidades * precio)
```

### A ✔

`25.0`

> Correcto. `Int * Double` da un `Double`. Al imprimir un `Double` siempre aparece la parte decimal, aunque sea `.0`.

### B

`25`

> El resultado es `Double`, así que se muestra con decimales: `25.0`.

### C

`20`

> No se trunca `2.5` a `2`: la operación se hace en `Double`.

### D

Error de compilación: no se pueden multiplicar `Int` y `Double`.

> Los operadores aritméticos sí admiten mezclar tipos numéricos. Lo que no se permite es **asignar** un tipo a otro sin convertir.

## kt-var-011 {dificultad=2 tipo=salida ancla=52-cadenas-multilinea-raw-strings}

¿Qué imprime este código?

```kotlin
val texto = """
    Hola
      Mundo
""".trimIndent()
println(texto)
```

### A ✔

```text
Hola
  Mundo
```

> Correcto. `trimIndent()` elimina la sangría **común** a todas las líneas (4 espacios) y la primera y última línea vacías. La sangría extra de `Mundo` se conserva.

### B

```text
Hola
Mundo
```

> `trimIndent()` no quita toda la sangría: solo la que comparten todas las líneas. `Mundo` tenía 2 espacios más.

### C

```text
    Hola
      Mundo
```

> Esto sería sin `trimIndent()`. El método quita los 4 espacios comunes.

### D

`Hola Mundo`

> Los saltos de línea de un *raw string* se mantienen: `trimIndent()` no une las líneas.

## kt-var-012 {dificultad=2 tipo=salida ancla=54-formato-de-numeros-y-monedas-decimales-stringformat-y-numberformat}

¿Qué imprime este código?

```kotlin
import java.util.Locale

println(String.format(Locale.US, "%.2f", 2.0 / 3))
```

### A ✔

`0.67`

> Correcto. `%.2f` muestra el número con **dos decimales, redondeando**. Con `Locale.US` el separador decimal es el punto.

### B

`0.66`

> `%.2f` redondea, no trunca: 0.666… pasa a 0.67.

### C

`0.6666666666666666`

> Ese es el `toString()` del `Double`. El formato `%.2f` limita la salida a dos decimales.

### D

`0,67`

> Saldría coma con un `Locale` español. Aquí se indica `Locale.US`, que usa punto.

## kt-var-013 {dificultad=2 tipo=salida ancla=51-plantillas-de-cadenas-string-templates}

¿Qué imprime este código?

```kotlin
val precio = 5
println("Cuesta \$$precio")
```

### A ✔

`Cuesta $5`

> Correcto. `\$` escribe un símbolo de dólar literal; justo después, `$precio` es una plantilla que inserta el valor 5.

### B

`Cuesta $precio`

> Solo el primer `$` está escapado. El segundo sí inicia una plantilla.

### C

`Cuesta \5`

> `\$` es una secuencia de escape que produce `$`; la barra no se imprime.

### D

Error de compilación: no se puede escapar `$`.

> Sí se puede: `\$` es la forma de escribir el símbolo dentro de una cadena normal.

## kt-var-014 {dificultad=3 tipo=salida ancla=2-inferencia-de-tipos}

¿Qué imprime este código?

```kotlin
val grande = 3_000_000_000
println(grande::class.simpleName)
```

### A ✔

`Long`

> Correcto. Al inferir el tipo de un literal entero, Kotlin usa `Int` si cabe y `Long` si no cabe. 3 000 millones supera el máximo de `Int` (unos 2 147 millones). Los `_` solo mejoran la legibilidad.

### B

`Int`

> Un `Int` llega hasta 2 147 483 647. Este literal no cabe, así que se infiere `Long`.

### C

Error de compilación: hay que añadir el sufijo `L`.

> El sufijo `L` fuerza `Long`, pero no es obligatorio cuando el literal no cabe en un `Int`: el compilador lo deduce solo.

### D

Error de compilación: no se permiten `_` en un número.

> Los guiones bajos están permitidos en los literales numéricos para separar miles: `1_000_000`.

## kt-var-015 {dificultad=1 tipo=salida ancla=42-caracteres-y-booleanos}

¿Qué imprime este código?

```kotlin
val conectado = true
val bloqueado = false
println(conectado && !bloqueado)
```

### A ✔

`true`

> Correcto. `!bloqueado` es `true`, y `true && true` es `true`.

### B

`false`

> El `!` niega `bloqueado` (que es `false`), así que la condición queda `true && true`.

### C

`1`

> En Kotlin los `Boolean` no son números: se imprimen como `true` o `false`.

### D

Error de compilación: hay que escribir `and` y `not`.

> Existen funciones `and()` y `not()`, pero los operadores `&&`, `||` y `!` son la forma habitual.

## kt-var-016 {dificultad=1 tipo=concepto ancla=3-la-inmutabilidad-en-el-desarrollo-moderno}

¿Qué recomendación sobre `val` y `var` siguen las guías de estilo de Kotlin?

### A ✔

Usar `val` por defecto y cambiar a `var` solo cuando sea necesario reasignar.

> Correcto. Cuantas menos variables cambien, más fácil es razonar sobre el código y evitar errores, sobre todo con concurrencia y con el estado de la interfaz en Android.

### B

Usar `var` por defecto, porque `val` es más lento.

> `val` no es más lento. Simplemente impide reasignar la referencia, lo que hace el código más seguro.

### C

Usar `val` solo para constantes conocidas en compilación, como `PI`.

> Para eso existe `const val`. Un `val` normal sirve para cualquier valor que no se reasigne, aunque se calcule en ejecución.

### D

Es indiferente: el compilador convierte `val` en `var`.

> Al contrario: el compilador **impide** reasignar un `val`, y esa garantía es justo lo que aporta.

## kt-var-017 {dificultad=2 tipo=salida ancla=42-caracteres-y-booleanos}

¿Qué imprime este código?

```kotlin
val c = '7'
println(c.digitToInt() + 1)
println(c.code)
```

### A ✔

```text
8
55
```

> Correcto. `digitToInt()` interpreta el carácter como dígito (7). En cambio, `code` da su código en la tabla de caracteres (el `'7'` es el 55).

### B

```text
8
7
```

> `code` no es el valor del dígito, sino la posición del carácter en la tabla Unicode, que es 55 para `'7'`.

### C

```text
56
55
```

> `digitToInt()` devuelve el valor del dígito (7), no su código. Sumar 1 al código sería `c.code + 1`.

### D

```text
71
55
```

> `digitToInt()` devuelve un `Int`, así que `+ 1` suma, no concatena.

## kt-var-018 {dificultad=3 tipo=salida ancla=5-cadenas-de-texto-string}

¿Qué imprime este código?

```kotlin
println("abc" < "abd")
println("Zeta" < "alfa")
```

### A ✔

```text
true
true
```

> Correcto. Los `String` se comparan carácter a carácter según su código. `'c'` va antes que `'d'`. Y las **mayúsculas van antes que las minúsculas** (`'Z'` = 90 < `'a'` = 97), así que `"Zeta"` es «menor» que `"alfa"`.

### B

```text
true
false
```

> Alfabéticamente lo esperaríamos, pero la comparación usa los códigos de los caracteres, y las mayúsculas tienen códigos menores que las minúsculas.

### C

Error de compilación: no se pueden comparar `String` con `<`.

> `String` implementa `Comparable`, así que admite `<`, `>`, `<=` y `>=`.

### D

```text
false
false
```

> `"abc"` y `"abd"` solo difieren en la última letra, y `'c'` va antes que `'d'`.

## kt-var-019 {dificultad=2 tipo=salida ancla=41-tipos-numericos}

¿Qué imprime este código?

```kotlin
println(0.1 + 0.2 == 0.3)
println(0.1 + 0.2)
```

### A ✔

```text
false
0.30000000000000004
```

> Correcto. `Double` representa los números en binario, y 0.1 o 0.2 no tienen una representación exacta. La suma da un valor muy cercano a 0.3, pero no idéntico. Por eso el dinero no se guarda en `Double`.

### B

```text
true
0.3
```

> Matemáticamente sería así, pero la aritmética de coma flotante tiene errores de redondeo.

### C

```text
false
0.3
```

> Si la comparación da `false` es porque la suma no es exactamente 0.3. Al imprimirla se ve la diferencia.

### D

Error de compilación: no se pueden comparar `Double` con `==`.

> Se puede (compila), pero no es fiable con decimales. Lo correcto es comparar con un margen: `abs(a - b) < 1e-9`.

## kt-var-020 {dificultad=2 tipo=compila error ancla=1-declaracion-de-variables-val-vs-var}

¿Qué ocurre al compilar este fragmento?

```kotlin
val nombre: String
println(nombre)
```

### A ✔

Error de compilación: `nombre` se usa antes de inicializarse.

> Correcto. Se puede declarar un `val` sin valor y asignarlo más tarde (una sola vez), pero el compilador comprueba que tenga valor antes de usarlo.

### B

Imprime `null`.

> Kotlin no da valores por defecto a las variables locales, y además `String` no admite `null`.

### C

Imprime una cadena vacía.

> No existe un valor por defecto: o se inicializa, o no compila.

### D

Error de compilación: un `val` siempre debe inicializarse en la misma línea.

> No es obligatorio en la misma línea: `val x: Int` seguido de `x = 5` es válido. El fallo está en usarlo sin haberle dado valor.

## kt-var-021 {dificultad=3 tipo=salida ancla=41-tipos-numericos}

¿Qué imprime este código?

```kotlin
println(-7 % 3)
println((-7).mod(3))
```

### A ✔

```text
-1
2
```

> Correcto. `%` es el **resto** y conserva el signo del dividendo: −7 = 3·(−2) − 1. En cambio, `mod()` devuelve siempre un valor con el signo del divisor (aquí, entre 0 y 2): −7 = 3·(−3) + 2. Es útil para índices circulares.

### B

```text
1
1
```

> Con números negativos, `%` conserva el signo del dividendo (−7), así que el resultado es negativo.

### C

```text
-1
-1
```

> `mod()` existe justamente para que el resultado no sea negativo cuando el divisor es positivo.

### D

```text
2
2
```

> `%` en Kotlin (y en Java) no es el módulo matemático: con dividendo negativo da un resto negativo.

## kt-var-022 {dificultad=1 tipo=salida ancla=1-declaracion-de-variables-val-vs-var}

¿Qué imprime este código?

```kotlin
val a = 5
var b = a
b += 1
println("$a $b")
```

### A ✔

`5 6`

> Correcto. `var b = a` copia el **valor** 5 en `b`. Modificar `b` después no afecta a `a`.

### B

`6 6`

> Con números, asignar una variable a otra copia el valor; no quedan «enlazadas».

### C

Error de compilación: no se puede asignar un `val` a un `var`.

> Sí se puede: se copia el valor de `a` en una variable nueva y mutable.

### D

`5 5`

> `b += 1` sí modifica `b`, que pasa a valer 6.

## kt-var-023 {dificultad=3 tipo=compila error ancla=3-la-inmutabilidad-en-el-desarrollo-moderno}

¿Qué ocurre al compilar este programa?

```kotlin
fun main() {
    const val MAXIMO = 10
    println(MAXIMO)
}
```

### A ✔

Error de compilación: `const` no se puede usar en una variable local.

> Correcto. `const val` solo se admite en el nivel superior del fichero, dentro de un `object` o en un `companion object`, y siempre con valores conocidos en compilación (números, `String`…).

### B

Compila e imprime `10`.

> Dentro de una función habría que usar un `val` normal.

### C

Error de compilación: `const` solo admite `String`.

> `const` admite tipos primitivos y `String`. El problema es dónde está declarada.

### D

Compila con un aviso y trata `MAXIMO` como un `val` normal.

> Es un error, no un aviso.

## kt-var-024 {dificultad=2 tipo=salida ancla=41-tipos-numericos}

¿Qué imprime este código?

```kotlin
println(7L / 2)
println(7 / 2.0f)
```

### A ✔

```text
3
3.5
```

> Correcto. `Long / Int` es una división **entera** (resultado `Long`: 3). En la segunda, uno de los operandos es `Float`, así que el resultado es `Float`: 3.5.

### B

```text
3.5
3.5
```

> El sufijo `L` indica `Long`, que también es un tipo entero: la división descarta los decimales.

### C

```text
3
3.0
```

> `7 / 2.0f` divide entre un `Float`, así que conserva los decimales.

### D

Error de compilación: no se pueden mezclar `Long` e `Int`.

> Los operadores aritméticos admiten mezclar tipos numéricos; el resultado toma el tipo «más amplio».

## kt-var-025 {dificultad=3 tipo=salida ancla=41-tipos-numericos}

¿Qué imprime este código?

```kotlin
val b: Byte = 127
println(b + 1)
println((b + 1).toByte())
```

### A ✔

```text
128
-128
```

> Correcto. Las operaciones aritméticas con `Byte` dan un `Int`, así que `b + 1` vale 128 sin problemas. Pero 128 no cabe en un `Byte` (de −128 a 127): al convertirlo, se desborda y da la vuelta a −128.

### B

```text
-128
-128
```

> `b + 1` ya no es un `Byte`, sino un `Int`, así que no se desborda.

### C

```text
128
128
```

> Un `Byte` no puede representar 128. `toByte()` hace que el valor dé la vuelta.

### D

Lanza `ArithmeticException` al convertir.

> Las conversiones numéricas no comprueban el desbordamiento: el valor da la vuelta sin avisar.

## kt-var-026 {dificultad=2 tipo=compila error ancla=41-tipos-numericos}

¿Qué ocurre al compilar esta línea?

```kotlin
val temperatura: Float = 21.5
```

### A ✔

Error de compilación: `21.5` es un literal `Double`; para un `Float` hay que escribir `21.5f`.

> Correcto. Kotlin no convierte `Double` en `Float` de forma implícita, porque podría perder precisión.

### B

Compila y `temperatura` vale `21.5`.

> El literal sin sufijo es `Double`, y no se asigna automáticamente a un `Float`.

### C

Compila con un aviso de pérdida de precisión.

> En Kotlin es un error de tipos, no un aviso.

### D

Compila, pero redondea a `22`.

> No compila, y además un `Float` admite decimales.

## kt-var-027 {dificultad=1 tipo=salida ancla=5-cadenas-de-texto-string}

¿Qué imprime este código?

```kotlin
println("  Kotlin  ".trim().length)
```

### A ✔

`6`

> Correcto. `trim()` elimina los espacios del principio y del final, y queda `"Kotlin"`, de 6 caracteres.

### B

`10`

> Esa es la longitud con los espacios. `trim()` los quita antes de medir.

### C

`8`

> `trim()` quita los espacios de **los dos** extremos.

### D

Error de compilación: `trim()` devuelve `Unit`.

> `trim()` devuelve un `String` nuevo, sin los espacios.

## kt-var-028 {dificultad=2 tipo=salida ancla=5-cadenas-de-texto-string}

¿Qué imprime este código?

```kotlin
println("ab".repeat(2) + "7".padStart(3, '0'))
```

### A ✔

`abab007`

> Correcto. `repeat(2)` repite la cadena dos veces, y `padStart(3, '0')` rellena por la izquierda con ceros hasta llegar a 3 caracteres.

### B

`ab2007`

> `repeat(2)` no añade el número: repite el texto.

### C

`abab700`

> `padStart` rellena por el **principio**. Por el final sería `padEnd`.

### D

`abab7`

> `padStart(3, '0')` garantiza una longitud de 3, así que añade dos ceros.

## kt-var-029 {dificultad=1 tipo=salida ancla=5-cadenas-de-texto-string}

¿Qué imprime este código?

```kotlin
println("Programacion".substring(0, 3).uppercase())
```

### A ✔

`PRO`

> Correcto. `substring(0, 3)` toma los caracteres de las posiciones 0, 1 y 2 (el final no se incluye) y `uppercase()` los pasa a mayúsculas.

### B

`PROG`

> El índice final de `substring` es **exclusivo**: el 3 no se incluye.

### C

`pro`

> Después se aplica `uppercase()`.

### D

`ROG`

> Los índices empiezan en 0, así que se toma desde la `P`.

## kt-var-030 {dificultad=2 tipo=salida ancla=5-cadenas-de-texto-string}

¿Qué imprime este código?

```kotlin
var s = "hola"
s.uppercase()
println(s)
```

### A ✔

`hola`

> Correcto. Los `String` son **inmutables**: `uppercase()` no modifica `s`, sino que devuelve una cadena nueva, que aquí se descarta. Habría que escribir `s = s.uppercase()`.

### B

`HOLA`

> Ningún método de `String` modifica la cadena original. Hay que guardar el resultado.

### C

Error de compilación: hay que asignar el resultado de `uppercase()`.

> Compila (como mucho, el IDE avisa de que el resultado no se usa), pero no cambia `s`.

### D

`Hola`

> `uppercase()` pasaría a mayúsculas todo el texto, pero su resultado no se guarda.

## kt-var-031 {dificultad=2 tipo=salida ancla=6-conversion-explicita-de-tipos}

¿Qué imprime este código?

```kotlin
println(10.toString(2))
println("ff".toInt(16))
```

### A ✔

```text
1010
255
```

> Correcto. `toString(radix)` convierte el número a texto en otra base (10 en binario es 1010), y `toInt(radix)` interpreta un texto en esa base (`ff` en hexadecimal es 255).

### B

```text
10
ff
```

> El argumento es la **base**, así que el resultado cambia de representación.

### C

Lanza `NumberFormatException` con `"ff"`.

> En base 16, `f` es un dígito válido.

### D

```text
1010
ff
```

> `toInt(16)` interpreta el texto como hexadecimal y devuelve el número 255.

## kt-var-032 {dificultad=2 tipo=salida ancla=6-conversion-explicita-de-tipos}

¿Qué imprime este código?

```kotlin
println(3.99.toInt())
println((-3.99).toInt())
```

### A ✔

```text
3
-3
```

> Correcto. `toInt()` **trunca**: descarta la parte decimal sin redondear, tanto en positivos como en negativos (hacia el cero).

### B

```text
4
-4
```

> `toInt()` no redondea. Para redondear se usa `roundToInt()`.

### C

```text
3
-4
```

> Truncar va hacia el cero: −3.99 pasa a −3, no a −4 (eso sería redondear hacia abajo con `floor`).

### D

Error de compilación: un `Double` no se puede convertir en `Int`.

> Sí se puede, de forma explícita, con `toInt()`.

## kt-var-033 {dificultad=3 tipo=salida ancla=6-conversion-explicita-de-tipos}

¿Qué imprime este código?

```kotlin
import kotlin.math.roundToInt

println(2.5.roundToInt())
println(2.4.roundToInt())
```

### A ✔

```text
3
2
```

> Correcto. `roundToInt()` redondea al entero más cercano, y los empates (`.5`) van hacia arriba.

### B

```text
2
2
```

> Eso sería truncar (`toInt()`). `roundToInt()` redondea, así que 2.5 pasa a 3.

### C

```text
3
3
```

> 2.4 está más cerca de 2 que de 3.

### D

```text
2.5
2.4
```

> `roundToInt()` devuelve un `Int`, sin decimales.

## kt-var-034 {dificultad=1 tipo=salida ancla=5-cadenas-de-texto-string}

¿Qué imprime este código?

```kotlin
val s = "Kotlin"
println(s[0])
println(s.last())
```

### A ✔

```text
K
n
```

> Correcto. Con `[]` se accede a un carácter por su índice (empezando en 0), y `last()` devuelve el último.

### B

```text
o
n
```

> El índice 0 es el **primer** carácter, la `K`.

### C

Error de compilación: un `String` no admite `[]`.

> `String` admite el operador `[]` para leer caracteres (es como llamar a `get`).

### D

```text
K
i
```

> `last()` es el último carácter, `n`.

## kt-var-035 {dificultad=1 tipo=salida ancla=53-igualdad-estructural-vs-referencial}

¿Qué imprime este código?

```kotlin
println("Hola" == "hola")
println("Hola".equals("hola", ignoreCase = true))
```

### A ✔

```text
false
true
```

> Correcto. `==` distingue mayúsculas de minúsculas. Para compararlas sin distinguir se usa `equals` con `ignoreCase = true`.

### B

```text
true
true
```

> `==` compara el contenido **exacto**, y `H` no es lo mismo que `h`.

### C

```text
false
false
```

> Con `ignoreCase = true` sí se consideran iguales.

### D

Error de compilación: `equals` no admite un segundo argumento.

> `String.equals` tiene un parámetro opcional `ignoreCase`.

## kt-var-036 {dificultad=2 tipo=salida ancla=52-cadenas-multilinea-raw-strings}

¿Qué imprime este código?

```kotlin
val texto = """uno
dos
tres"""
println(texto.lines().size)
println(texto.length)
```

### A ✔

```text
3
12
```

> Correcto. Un *raw string* conserva los saltos de línea. `lines()` lo divide en 3 líneas, y `length` cuenta los 10 caracteres visibles más los 2 saltos de línea.

### B

```text
1
10
```

> Los saltos de línea son caracteres reales dentro de la cadena: hay 3 líneas.

### C

```text
3
10
```

> `length` también cuenta los dos `\n`.

### D

Error de compilación: un *raw string* no puede ocupar varias líneas.

> Para eso existen precisamente las cadenas con triple comilla.
