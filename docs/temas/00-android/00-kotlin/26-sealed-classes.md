# Clases e Interfaces Selladas (Sealed Types) y el Patrón UI State

En el tema anterior aprendimos que los `enum class` permiten restringir un valor a un conjunto cerrado de opciones constantes. Sin embargo, los enums tienen una gran limitación: **cada constante solo puede almacenar los mismos datos fijos definidos en el constructor**.

¿Qué ocurre si queremos representar un resultado que puede ser o bien una **Carga en curso** (sin datos), o bien un **Éxito** (que contiene una lista de 50 videojuegos), o bien un **Error** (que contiene una excepción y un código HTTP)?

Para resolver este problema arquitectural de modelado, Kotlin proporciona los **tipos sellados**: **`sealed interface`** y **`sealed class`**, los cuales representan la máxima expresión del **polimorfismo seguro** en el lenguaje.

---

## 1. Conexión con Conocimientos Previos: El Polimorfismo y sus Desafíos

Antes de entender los tipos sellados, es fundamental refrescar un concepto angular de la Programación Orientada a Objetos aprendido en 1º de DAM: **el polimorfismo**.

### ¿Qué es el Polimorfismo?
El polimorfismo (del griego *"múltiples formas"*) es la capacidad de tratar instancias de distintas clases derivadas a través de una misma referencia común (su superclase o interfaz).

Por ejemplo, si tenemos una interfaz `Notificacion` y clases `Email`, `SMS` y `Push`:

```kotlin
// Tratamos cualquier notificación de forma polimórfica:
fun enviarAlerta(notificacion: Notificacion) {
    notificacion.enviar() // Cada subtipo ejecuta su propia versión del método
}
```

### El Gran Problema del Polimorfismo Abierto Tradicional
En Java y en la POO clásica, las jerarquías de herencia e interfaces son **abiertas por defecto**:

- Cualquier programador, en cualquier archivo o librería externa del proyecto, puede crear una nueva clase `class Fax : Notificacion` e implementarla.
- ¿Qué ocurre si necesitas realizar una acción específica según el tipo concreto de notificación? En Java te veías obligado a usar una cadena de `if-else` con `instanceof`, casteo manual y una rama `else` defensiva:

```java
// Código Java tradicional (frágil y propenso a errores):
if (notificacion instanceof Email) {
    Email e = (Email) notificacion; // Casteo manual redundante
    conectarServidorSmtp(e.getDireccion());
} else if (notificacion instanceof SMS) {
    SMS s = (SMS) notificacion;
    enviarViaModem(s.getTelefono());
} else {
    // Si alguien crea la clase 'Push' y olvida añadir el 'if',
    // el compilador NUNCA avisa y el programa falla en silencio.
    throw new IllegalArgumentException("Tipo de notificación no soportado");
}
```

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/sealed/sealed-abierto.svg"
<figcaption>Una jerarquía abierta admite subtipos nuevos en cualquier parte; una sellada solo los que se declaran en el mismo módulo y paquete, y el compilador los conoce todos.</figcaption>
</figure>

En las arquitecturas móviles modernas, este polimorfismo abierto es peligroso para representar **estados de pantalla o respuestas de red**, porque necesitamos la certeza absoluta de haber controlado **todos los casos posibles**.

---

## 2. La Solución de Kotlin: Tipos Sellados (Polimorfismo Restringido)

Un **tipo sellado** (`sealed interface` o `sealed class`) es **polimorfismo con una jerarquía cerrada y finita**:

- Todas las subclases **directas** deben declararse en el **mismo módulo y el mismo paquete** que el tipo sellado (lo habitual es en el mismo fichero, anidadas dentro de él).

- El compilador lo comprueba **al compilar**: desde otro módulo (por ejemplo, una librería que use tu código) no se puede añadir un subtipo nuevo.

- Como el compilador conoce la lista completa de subtipos, puede comprobar que un `when` los trata todos.

- En ciencias de la computación, este concepto se conoce como **Tipos de Datos Algebraicos** (*Algebraic Data Types* o *Sum Types*).

### ¿Qué es una Interfaz y por qué preferir `sealed interface`?
Una **interfaz tradicional** (`interface`) define un **contrato de comportamiento**: declara *qué* sabe hacer un objeto, desacoplando la definición de la implementación. Una clase puede implementar múltiples interfaces.

Una **`sealed interface`** conserva las virtudes de una interfaz (una clase puede implementar varias, y no obliga a llamar a ningún constructor del padre), pero le añade una cerradura de seguridad: **el compilador conoce exactamente qué clases implementan dicho contrato**.

**`sealed interface` es la opción habitual** en la documentación y los ejemplos oficiales de Android para modelar estados. `sealed class` se reserva para cuando todos los subtipos comparten datos o código que conviene declarar una sola vez en el padre (lo verás en el apartado 2.1).

### Sintaxis Moderna con `data object` y `data class`
Para estados sin datos (como "Cargando"), usamos `data object` (instancia única tipo Singleton con `toString()` legible). Para estados con datos, usamos `data class`:

```kotlin
// Definición del contrato cerrado de estados de pantalla
sealed interface CatalogoUiState {

    // 1. Estado sin datos: 'data object' reutiliza una única instancia eficiente en memoria
    data object Cargando : CatalogoUiState

    // 2. Estado de éxito: 'data class' transporta los datos descargados
    data class Exito(val listaJuegos: List<String>, val totalRegistros: Int) : CatalogoUiState

    // 3. Estado de error: transporta los detalles del fallo
    data class Error(val mensaje: String, val codigoHttp: Int = 500) : CatalogoUiState
}
```

### 2.1. ¿Y cuándo `sealed class`?

Cuando **todos** los subtipos comparten un dato, una `sealed class` permite declararlo una sola vez en el constructor del padre. Así se puede usar sin necesidad de un `when`:

```kotlin
sealed class Notificacion(val destinatario: String) {        // dato común a todas
    class Email(destinatario: String, val asunto: String) : Notificacion(destinatario)
    class Sms(destinatario: String, val texto: String) : Notificacion(destinatario)
}

fun registrar(n: Notificacion) = println("Enviada a ${n.destinatario}")   // todas lo tienen
```

Si los subtipos no comparten nada (como `Cargando`, `Exito` y `Error`), usa `sealed interface`.

---

## 3. La Combinación Perfecta: Polimorfismo + `when` + *Smart Casting*

Cuando combinamos tipos sellados con la estructura de control `when`, se produce una de las sinergias más potentes y elegantes de Kotlin:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/sealed/sealed-when.svg"
<figcaption>El <code>when</code> reparte el estado por un camino para cada subtipo, y en cada camino el compilador ya sabe de qué tipo es (<i>smart cast</i>). Si falta un subtipo, no compila.</figcaption>
</figure>

Observa la implementación:

```kotlin
fun renderizarPantalla(estado: CatalogoUiState) {
    // El polimorfismo nos permite recibir el tipo base 'CatalogoUiState'
    when (estado) {
        CatalogoUiState.Cargando -> {      // un 'data object' es único: se compara sin 'is'
            println("⏳ Mostrando indicador circular de carga en Compose...")
        }
        is CatalogoUiState.Exito -> {
            // ¡SMART CASTING EN ACCIÓN!
            // El compilador sabe que aquí 'estado' es exactamente CatalogoUiState.Exito.
            // Accedemos a sus propiedades sin ningún casteo '((Exito) estado)':
            println("✅ Renderizando ${estado.totalRegistros} juegos:")
            estado.listaJuegos.forEach { println("   - $it") }
        }
        is CatalogoUiState.Error -> {
            // ¡Smart Cast automático a CatalogoUiState.Error!
            println("❌ Error [${estado.codigoHttp}]: ${estado.mensaje}")
        }
        // ¡No se necesita rama 'else'! El compilador sabe que no existen más casos posibles.
    }
}
```

### ¿Por qué esta sinergia es revolucionaria?

1. **Polimorfismo elegante:** La función `renderizarPantalla` solo depende del tipo padre `CatalogoUiState`.

2. **Seguridad en tiempo de compilación (Exhaustividad):** El compilador comprueba que has cubierto todas las ramas. Si mañana añades un nuevo estado `data object Vacio : CatalogoUiState`, el compilador detendrá la compilación marcando un error hasta que gestiones esa nueva pantalla en el `when`.

3. **Cero casteos manuales (*Smart Casting*):** Olvídate de los errores `ClassCastException` de Java. El compilador hace la conversión de tipo de manera automática y segura dentro del bloque `is`.

!!! danger "¿Por qué está PROHIBIDO usar la rama `else` en tipos sellados?"
    Si añades una rama `else -> { ... }` a un `when` que evalúa un tipo sellado, **anulas la protección del compilador**. 
    
    Si en el futuro agregas un estado `data object SinConexion : CatalogoUiState`, el compilador no te avisará de que olvidaste diseñarle una pantalla; el flujo caerá silenciosamente en el `else`, provocando bugs ocultos en producción. **Nunca pongas `else` con tipos sellados.**

Sin `else`, añadir `SinConexion` hace que el proyecto deje de compilar con este error, que te lleva directo a todos los `when` que tienes que completar:

```text
e: 'when' expression must be exhaustive. Add the 'CatalogoUiState.SinConexion' branch or an 'else' branch.
```

### 3.1. `when` como expresión: devolver un valor

`when` también puede **devolver un valor**: el de la rama que se ejecute. Así se usa casi siempre con los estados de pantalla, y también en Compose:

```kotlin
val titulo: String = when (estado) {
    CatalogoUiState.Cargando -> "Cargando…"
    is CatalogoUiState.Exito -> "${estado.totalRegistros} juegos"
    is CatalogoUiState.Error -> "Error ${estado.codigoHttp}"
}

@Composable
fun PantallaCatalogo(estado: CatalogoUiState) {
    when (estado) {
        CatalogoUiState.Cargando -> CircularProgressIndicator()
        is CatalogoUiState.Exito -> ListaJuegos(estado.listaJuegos)
        is CatalogoUiState.Error -> MensajeError(estado.mensaje)
    }
}
```

### 3.2. Jerarquías anidadas

Un subtipo sellado puede tener, a su vez, subtipos. El `when` puede tratarlos uno a uno o todos juntos a través de su padre:

```kotlin
sealed interface Resultado {
    data class Exito(val datos: String) : Resultado
    sealed interface Error : Resultado {
        data object SinRed : Error
        data class Servidor(val codigo: Int) : Error
    }
}

fun describir(r: Resultado): String = when (r) {
    is Resultado.Exito -> "OK: ${r.datos}"
    Resultado.Error.SinRed -> "Revisa tu conexión"
    is Resultado.Error.Servidor -> "El servidor respondió ${r.codigo}"
}

fun esCorrecto(r: Resultado): Boolean = when (r) {
    is Resultado.Exito -> true
    is Resultado.Error -> false        // cubre SinRed y Servidor a la vez
}
```

---

## 4. Cuadro Comparativo: `enum class` vs `sealed interface`

| Criterio | `enum class` | `sealed interface` / `sealed class` |
| :--- | :--- | :--- |
| **Conjunto de casos** | Fijo y estático | Jerarquía cerrada de tipos |
| **Instancias** | Única por cada constante | Múltiples instancias posibles por cada subclase |
| **Estructura de datos** | Idéntica para todas las constantes | Cada subclase puede tener propiedades y constructores únicos |
| **Exhaustividad en `when`** | Sí (sin `else`) | Sí (sin `else`) con Smart Cast automático |
| **Caso de uso típico** | Días de la semana, roles fijos, temas claro/oscuro | **Estados de UI en Android (`UiState`), resultados de operaciones de red (`Result`)** |

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/sealed/sealed-enum.svg"
<figcaption>Las constantes de un <code>enum</code> son cajas iguales con los mismos campos; los subtipos sellados son cajas distintas, cada una con sus propios datos.</figcaption>
</figure>

---

## 5. El Patrón Universal de Arquitectura en Android: `UiState`

En la arquitectura moderna recomendada por Google (MVVM con Jetpack Compose), la pantalla nunca almacena múltiples booleanos desincronizados como `var estaCargando = false`, `var hayError = false`, `var datos = null`.

¿Por qué? Porque varias variables independientes pueden **contradecirse**:

```kotlin
// ❌ Tres variables que nadie obliga a mantener coherentes
var cargando = false
var mensajeError: String? = null
var juegos: List<String>? = null
```

Con tres variables de dos valores cada una hay 8 combinaciones posibles, pero solo 3 tienen sentido. Las otras 5 son **estados imposibles** que el código permite igualmente (por ejemplo, «cargando» y «con error» a la vez):

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/sealed/sealed-imposibles.svg"
<figcaption>Con booleanos, nada impide llegar a una combinación absurda. Con un tipo sellado, los estados imposibles ni siquiera se pueden escribir.</figcaption>
</figure>

En su lugar, el `ViewModel` expone un único flujo reactivo de tipo sellado inmutable, y la pantalla pinta una cosa distinta para cada estado:

<figure class="arq-fig">
--8<-- "docs/temas/00-android/00-kotlin/images/sealed/sealed-pantallas.svg"
<figcaption>Un estado, una pantalla: el <code>when</code> de la pantalla decide qué se dibuja.</figcaption>
</figure>

```kotlin
fun main() {
    // 1. La app arranca y empieza a descargar datos
    var estadoPantalla: CatalogoUiState = CatalogoUiState.Cargando
    renderizarPantalla(estadoPantalla)

    // 2. La descarga finaliza correctamente
    estadoPantalla = CatalogoUiState.Exito(
        listaJuegos = listOf("Zelda: Breath of the Wild", "Super Mario Odyssey"),
        totalRegistros = 2
    )
    renderizarPantalla(estadoPantalla)

    // 3. O bien ocurre un corte de conexión a internet
    estadoPantalla = CatalogoUiState.Error("Sin conexión a la base de datos de GameVault", 503)
    renderizarPantalla(estadoPantalla)
}
```

### Pruébalo: booleanos frente a `sealed interface`

En el modo **Booleanos**, enciende y apaga las tres variables y mira qué pinta una pantalla que las usa por separado. En el modo **sealed interface**, añade subtipos nuevos, quita ramas del `when` o ponle un `else`, y mira qué responde el compilador.

<div class="cpg" data-cpg="sealed"></div>

Cosas que conviene probar:

- En **Booleanos**, busca las 5 combinaciones imposibles: ¿qué ve el usuario en cada una?
- En **sealed interface**, añade `Vacio` sin tocar el `when`: no compila. Añade luego un `else`: compila, pero `Vacio` muestra la pantalla genérica sin que nadie se entere.

---

## 6. Retos Prácticos

### 🟢 Reto 1: Modelado de Estado de Autenticación (Básico)
Diseña una `sealed interface AuthState` con tres estados:

1. `data object NoAutenticado : AuthState`

2. `data object Autenticando : AuthState`

3. `data class Autenticado(val token: String, val email: String) : AuthState`

Crea una función `evaluarSesion(estado: AuthState)` que imprima el mensaje adecuado con un `when` exhaustivo.

??? tip "Ver solución"
    ```kotlin
    sealed interface AuthState {
        data object NoAutenticado : AuthState
        data object Autenticando : AuthState
        data class Autenticado(val token: String, val email: String) : AuthState
    }

    fun evaluarSesion(estado: AuthState) {
        when (estado) {
            AuthState.NoAutenticado -> println("Mostrar pantalla de Login/Registro.")
            AuthState.Autenticando -> println("Cargando credenciales con Firebase Auth...")
            is AuthState.Autenticado -> println("Bienvenido ${estado.email}. Token activo: ${estado.token}")
        }
    }

    fun main() {
        evaluarSesion(AuthState.Autenticando)
        evaluarSesion(AuthState.Autenticado("JWT_777", "alumno@dam.es"))
    }
    ```

### 🟡 Reto 2: Respuesta genérica de API (Intermedio)
Diseña una `sealed interface RespuestaApi<out T>` que admita un tipo genérico:

- `data class Correcta<T>(val datos: T) : RespuestaApi<T>`
- `data class Fallo(val mensaje: String, val codigo: Int) : RespuestaApi<Nothing>`

Escribe un programa que cree una respuesta correcta con un entero y otra de fallo, evaluando ambas.

??? tip "Ver solución"
    ```kotlin
    sealed interface RespuestaApi<out T> {
        data class Correcta<T>(val datos: T) : RespuestaApi<T>
        data class Fallo(val mensaje: String, val codigo: Int) : RespuestaApi<Nothing>
    }

    fun main() {
        val respuestaServidor: RespuestaApi<String> = RespuestaApi.Correcta("Datos del perfil sincronizados")
        val errorServidor: RespuestaApi<String> = RespuestaApi.Fallo("Timeout de red al conectar", 408)

        fun <T> procesar(r: RespuestaApi<T>) {
            when (r) {
                is RespuestaApi.Correcta -> println("Éxito en API: ${r.datos}")
                is RespuestaApi.Fallo -> println("Fallo [${r.codigo}]: ${r.mensaje}")
            }
        }

        procesar(respuestaServidor)
        procesar(errorServidor)
    }
    ```
