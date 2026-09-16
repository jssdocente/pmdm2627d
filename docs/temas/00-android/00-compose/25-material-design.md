# Material Design 3 (Material You) en Jetpack Compose

**Material Design 3 (M3)** es el sistema de diseño actual y oficial de Google para Android. Presenta soporte para temas adaptativos y colores dinámicos (*Material You*), componentes renovados con esquinas más redondeadas, jerarquías tonales expresivas y una tipografía refinada.

En Jetpack Compose, Material 3 se implementa a través de la biblioteca `androidx.compose.material3`.

---

## 1. El Tema de la Aplicación (`MaterialTheme`)

Un tema en Compose envuelve la jerarquía visual y proporciona valores coherentes a través de tres pilares accesibles globalmente mediante `MaterialTheme`:

- `MaterialTheme.colorScheme`: Paleta cromática activa (primarios, secundarios, fondos, superficies y errores).
- `MaterialTheme.typography`: Escala de tipos (`displayLarge`, `headlineMedium`, `titleLarge`, `bodyMedium`, `labelSmall`, etc.).
- `MaterialTheme.shapes`: Formas y radios de curvatura (`small`, `medium`, `large`, `extraLarge`).

### Definición del Tema y Color Dinámico

A partir de Android 12 (API 31), Compose permite habilitar **Color Dinámico**, extrayendo una paleta armonizada a partir del fondo de pantalla del usuario:

```kotlin
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val EsquemaClaro = lightColorScheme(
    primary = Color(0xFF6750A4),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFEADDFF),
    onPrimaryContainer = Color(0xFF21005D),
    surface = Color(0xFFFEF7FF),
    onSurface = Color(0xFF1D1B20)
)

private val EsquemaOscuro = darkColorScheme(
    primary = Color(0xFFD0BCFF),
    onPrimary = Color(0xFF381E72),
    primaryContainer = Color(0xFF4F378B),
    onPrimaryContainer = Color(0xFFEADDFF),
    surface = Color(0xFF141218),
    onSurface = Color(0xFFE6E0E9)
)

@Composable
fun MiAplicacionTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true, // Color dinámico activado por defecto
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> EsquemaOscuro
        else -> EsquemaClaro
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = TipografiaApp,
        shapes = FormasApp,
        content = content
    )
}
```

---

## 2. Tipografía en Material 3

La escala de tipografía en M3 sustituye los antiguos nombres de M2 (`h1`, `body1`) por nombres normalizados en camelCase:

```kotlin
import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val TipografiaApp = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp
    )
)
```

Para aplicar estilos tipográficos en la interfaz:

```kotlin
Text(
    text = "Bienvenido a GameVault",
    style = MaterialTheme.typography.titleLarge,
    color = MaterialTheme.colorScheme.onSurface
)
```

---

## 3. Estructura de Pantalla: `Scaffold` M3

El composable `Scaffold` implementa la estructura visual básica de una pantalla de Material Design, coordinando la barra superior (*TopAppBar*), la barra de navegación inferior (*NavigationBar*), el botón flotante (*FloatingActionButton*) y el área de contenido.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PantallaPrincipalScaffold(
    onNuevoJuegoClick: () -> Unit
) {
    val scrollBehavior = TopAppBarDefaults.pinnedScrollBehavior(rememberTopAppBarState())

    Scaffold(
        modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("GameVault") },
                scrollBehavior = scrollBehavior
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = true,
                    onClick = { /* Navegar a Inicio */ },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Inicio") },
                    label = { Text("Inicio") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = { /* Navegar a Perfil */ },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Perfil") },
                    label = { Text("Perfil") }
                )
            }
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onNuevoJuegoClick) {
                Icon(Icons.Default.Add, contentDescription = "Añadir Juego")
            }
        }
    ) { innerPadding ->
        // OBLIGATORIO: Aplicar innerPadding al contenedor de contenido para evitar solapamientos con las barras
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Text("Contenido de la pantalla")
        }
    }
}
```

!!! danger "Uso obligatorio de `innerPadding`"
    El parámetro lambda `innerPadding` proporcionado por `Scaffold` contiene las dimensiones exactas de las barras superior e inferior. Si no lo aplicas con `Modifier.padding(innerPadding)` al contenido principal, tus componentes quedarán ocultos detrás del `TopAppBar` o del `NavigationBar`.

---

## 4. Componentes Clave en Material 3

Material 3 diversifica sus componentes mediante variantes tonales y elevadas:

### Tarjetas (*Cards*)

Compose ofrece tres variantes de tarjetas con distinta jerarquía visual:

- `Card` (o contenedor relleno estándar).
- `ElevatedCard` (con sombra y elevación sobre el fondo).
- `OutlinedCard` (con borde sutil, sin elevación).

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun EjemplosTarjetas() {
    Column {
        ElevatedCard(
            elevation = CardDefaults.elevatedCardElevation(defaultElevation = 4.dp),
            modifier = Modifier.padding(8.dp)
        ) {
            Text("Tarjeta con elevación", modifier = Modifier.padding(16.dp))
        }

        OutlinedCard(
            modifier = Modifier.padding(8.dp)
        ) {
            Text("Tarjeta con borde", modifier = Modifier.padding(16.dp))
        }
    }
}
```

### Botones en M3

Material 3 proporciona una amplia jerarquía de botones para guiar la atención del usuario:

- `Button`: Acción primaria destacada.
- `FilledTonalButton`: Acción secundaria de peso medio.
- `OutlinedButton`: Acción de peso secundario con borde.
- `TextButton`: Acciones terciarias de baja prioridad (ej. "Cancelar").

```kotlin
// Botón primario
Button(onClick = { /* Confirmar */ }) {
    Text("Guardar")
}

// Botón tonal secundario
FilledTonalButton(onClick = { /* Filtrar */ }) {
    Text("Filtrar")
}

// Botón de texto terciario
TextButton(onClick = { /* Cancelar */ }) {
    Text("Cancelar")
}
```

---

## 5. Recursos y Enlaces Relacionados

- [Guía oficial de migración a Material 3 en Compose](https://developer.android.com/develop/ui/compose/designsystems/material3): Documentación de Google para la transición y uso de M3.
- [Catálogo de componentes Material 3](https://m3.material.io/components): Especificación oficial de diseño interactivo.
- [Arquitectura y Capa UI](../02-arquitectura/01-guia-arquitectura-google.md#capa-ui-layer): Cómo conectar el diseño y temas con el modelado de estados de la UI.
