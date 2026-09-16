# Listas y Cuadrículas en Compose

En Jetpack Compose, las listas y cuadrículas de elementos se renderizan mediante los componentes perezosos (`LazyLayouts`): `LazyColumn`, `LazyRow`, `LazyVerticalGrid` y `LazyHorizontalGrid`. A diferencia de `Column` o `Row` tradicionales (que instancian y componen todos sus hijos de golpe en memoria), los componentes *Lazy* sólo componen, miden y dibujan los elementos que entran en la ventana de visualización (*viewport*), emulando y superando la eficiencia del antiguo `RecyclerView` de Android Views.

---

## 1. LazyColumn y LazyRow

`LazyColumn` produce una lista de desplazamiento vertical, mientras que `LazyRow` genera una horizontal. Ambos proporcionan un `LazyListScope` donde se declaran los elementos mediante las funciones `item()` (para un único elemento o cabeceras) o `items()` (para colecciones).

### Lista básica con LazyColumn

```kotlin
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun ListaNombres(nombres: List<String>) {
    LazyColumn {
        item {
            Text(text = "Cabecera de la lista")
        }
        items(nombres) { nombre ->
            Text(text = "Hola, $nombre!")
        }
    }
}
```

### Espaciado y Relleno Recomendados

En lugar de colocar separadores manuales o márgenes individuales en cada elemento, las buenas prácticas de Jetpack Compose recomiendan usar `contentPadding` y `Arrangement.spacedBy()`:

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.ui.unit.dp

@Composable
fun ListaConEspaciado(usuarios: List<Usuario>) {
    LazyColumn(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(
            items = usuarios,
            key = { usuario -> usuario.id }
        ) { usuario ->
            TarjetaUsuario(usuario = usuario)
        }
    }
}
```

!!! tip "Padding de barras del sistema"
    Al usar `Scaffold`, debes pasar el `innerPadding` recibido en el parámetro lambda al `contentPadding` del `LazyColumn`. De este modo, la lista se desplazará por debajo de las barras translúcidas sin quedar cortada.

---

## 2. La Clave Única (`key`): Recomposición Eficiente

Por defecto, si no se especifica una clave en `items()`, Compose utiliza la **posición numérica (índice)** del elemento en la lista como su identificador.

!!! danger "El peligro de omitir `key`"
    Si la lista cambia por una inserción al principio, eliminación intermedia o reordenación (ej. ordenamiento alfabético):

    - Sin `key`: Compose asume que todos los elementos cambiaron porque sus índices cambiaron, forzando la recomposición innecesaria de toda la lista y perdiendo cualquier estado interno (como animaciones o inputs de texto).
    - Con `key`: Compose identifica cada elemento por su ID único, reutiliza los composables ya existentes y reordena únicamente las vistas desplazadas en pantalla.

```kotlin
// Incorreto: omitir key fuerza recomposiciones masivas al modificar la lista
items(listaJuegos) { juego ->
    JuegoItem(juego)
}

// Correcto: clave estable e inequívoca
items(
    items = listaJuegos,
    key = { juego -> juego.id } // Garantiza identidad estable
) { juego ->
    JuegoItem(juego)
}
```

### Animaciones de Lista con `Modifier.animateItem()`

A partir de Jetpack Compose 1.7+, la asignación de una clave única permite animar automáticamente inserciones, eliminaciones y reordenaciones aplicando `Modifier.animateItem()`:

```kotlin
@Composable
fun ListaAnimada(juegos: List<Juego>) {
    LazyColumn {
        items(
            items = juegos,
            key = { it.id }
        ) { juego ->
            TarjetaJuego(
                juego = juego,
                modifier = Modifier.animateItem() // Anima suavemente cambios en la lista
            )
        }
    }
}
```

---

## 3. Control y Observación del Scroll

Para inspeccionar o manipular programáticamente la posición de la lista (por ejemplo, para mostrar un botón flotante "Volver arriba"), se utiliza `rememberLazyListState()`.

### Uso de `derivedStateOf` para evitar recomposiciones continuas

El estado `listState.firstVisibleItemIndex` cambia con muchísima frecuencia durante un desplazamiento. Observarlo directamente dentro de la composición provocaría cientos de recomposiciones por segundo. La solución idónea es utilizar `derivedStateOf`:

```kotlin
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

@Composable
fun PantallaListaScroll(articulos: List<Articulo>) {
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()

    // derivedStateOf garantiza que la UI solo se recomponga cuando el booleano cambie de true a false o viceversa
    val mostrarBotonArriba by remember {
        derivedStateOf { listState.firstVisibleItemIndex > 3 }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            state = listState,
            modifier = Modifier.fillMaxSize()
        ) {
            items(articulos, key = { it.id }) { articulo ->
                FilaArticulo(articulo = articulo)
            }
        }

        AnimatedVisibility(
            visible = mostrarBotonArriba,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp)
        ) {
            FloatingActionButton(
                onClick = {
                    coroutineScope.launch {
                        listState.animateScrollToItem(0)
                    }
                }
            ) {
                Icon(Icons.Default.KeyboardArrowUp, contentDescription = "Subir al inicio")
            }
        }
    }
}
```

---

## 4. Cuadrículas: LazyVerticalGrid y LazyHorizontalGrid

Para mostrar catálogos, galerías multimedia o tarjetas en columnas múltiples se emplean `LazyVerticalGrid` o `LazyHorizontalGrid`.

El diseño de las columnas o filas se especifica mediante el parámetro `columns` o `rows`:

- `GridCells.Fixed(count)`: Fija un número exacto de columnas/filas sin importar el ancho del dispositivo.
- `GridCells.Adaptive(minSize)`: Diseña automáticamente tantas columnas como quepan, garantizando que cada celda tenga al menos el ancho mínimo especificado (ideal para diseño responsivo en tablets y móviles).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

@Composable
fun GaleriaJuegos(juegos: List<Juego>) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 140.dp),
        contentPadding = PaddingValues(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            items = juegos,
            key = { juego -> juego.id }
        ) { juego ->
            TarjetaJuegoCuadricula(juego = juego)
        }
    }
}
```

---

## 5. Separadores con Material 3

Cuando la UI requiera una línea divisoria física entre elementos en lugar de espaciado transparente, se debe emplear `HorizontalDivider` de Material 3:

```kotlin
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

@Composable
fun ListaConDivisores(elementos: List<String>) {
    LazyColumn {
        itemsIndexed(
            items = elementos,
            key = { index, item -> "$index-$item" }
        ) { index, item ->
            ElementoFila(texto = item)

            // Añade divisor a todos salvo al último
            if (index < elementos.lastIndex) {
                HorizontalDivider(
                    thickness = 0.5.dp,
                    color = MaterialTheme.colorScheme.outlineVariant
                )
            }
        }
    }
}
```

---

## 6. Vinculación con Arquitectura y UiState

En una arquitectura limpia y moderna, la lista no debe gestionar su propia lógica de obtención de datos. El Composable debe recibir el estado inmutable desde la capa de UI (`UiState`) y propagar los clics hacia el ViewModel mediante eventos:

```kotlin
@Composable
fun PantallaBiblioteca(
    uiState: BibliotecaUiState.Exito, // Sealed interface de UI
    onJuegoClick: (Long) -> Unit,      // Evento hacia el ViewModel
    modifier: Modifier = Modifier
) {
    LazyColumn(modifier = modifier) {
        items(
            items = uiState.juegos,
            key = { it.id }
        ) { juego ->
            TarjetaJuego(
                juego = juego,
                onClick = { onJuegoClick(juego.id) }
            )
        }
    }
}
```

Para ver cómo estructurar y gestionar estos estados con `StateFlow` y Clean Architecture, consulta:

- [Guía de Arquitectura de Google y Capa UI](../02-arquitectura/01-guia-arquitectura-google.md#capa-ui-layer)
- [Gestión de Estado y UDF en Compose](./22-state-management.md#modelado-del-uistate)
