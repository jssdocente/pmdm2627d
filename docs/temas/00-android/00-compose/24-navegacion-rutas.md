# Navegación Segura (Type-Safe Navigation) en Jetpack Compose

La navegación en Jetpack Compose gestiona la transición entre pantallas, el paso de argumentos y la pila de retroceso (*back stack*). A partir de **Navigation Compose 2.8+**, Google introdujo el soporte nativo para **Type-Safe Navigation** basado en el compilador de `kotlinx.serialization`, eliminando por completo los antiguos Strings mágicos ("ruta/{id}") y los riesgos de `ClassCastException` o errores tipográficos en tiempo de ejecución.

---

## 1. Configuración del Proyecto

Para habilitar la navegación fuertemente tipada, es necesario aplicar el plugin de serialización de Kotlin y la biblioteca oficial de Navigation Compose.

=== "build.gradle.kts (App)"
    ```kotlin
    plugins {
        alias(libs.plugins.android.application)
        alias(libs.plugins.kotlin.android)
        alias(libs.plugins.kotlin.compose)
        // Plugin oficial de serialización de Kotlin
        alias(libs.plugins.kotlin.serialization)
    }

    dependencies {
        implementation(libs.androidx.navigation.compose) // >= 2.8.0
        implementation(libs.kotlinx.serialization.json)
    }
    ```

=== "libs.versions.toml"
    ```toml
    [versions]
    navigationCompose = "2.8.5"
    kotlinxSerialization = "1.7.3"
    kotlin = "2.0.21"

    [libraries]
    androidx-navigation-compose = { module = "androidx.navigation:navigation-compose", version.ref = "navigationCompose" }
    kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinxSerialization" }

    [plugins]
    kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
    ```

---

## 2. Definición de Destinos Tipados (`@Serializable`)

Cada pantalla o destino de navegación se modela como una estructura de Kotlin anotada con `@Serializable`:

- **Destinos sin argumentos:** Se definen como `data object`.
- **Destinos con argumentos obligatorios u opcionales:** Se definen como `data class`.

```kotlin
import kotlinx.serialization.Serializable

// Pantallas simples sin argumentos
@Serializable
data object Inicio

@Serializable
data object Perfil

// Pantalla que requiere argumentos de tipo primitivo
@Serializable
data class DetalleJuego(
    val juegoId: Long,
    val titulo: String,
    val esFavorito: Boolean = false // Argumento opcional con valor por defecto
)
```

!!! tip "Clases Selladas para agrupar rutas"
    Puedes agrupar todas las rutas de un grafo o funcionalidad bajo una `sealed interface`:
    ```kotlin
    sealed interface RutaJuegos {
        @Serializable data object Catalogo : RutaJuegos
        @Serializable data class Detalle(val juegoId: Long) : RutaJuegos
    }
    ```

---

## 3. El Contenedor `NavHost` Tipado

El `NavHost` asocia cada tipo serializable a una función composable mediante el método genérico `composable<T>()`:

```kotlin
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Inicio
    ) {
        // 1. Destino Inicio
        composable<Inicio> {
            PantallaInicio(
                onJuegoClick = { id, titulo ->
                    // Navegación con tipado estricto
                    navController.navigate(DetalleJuego(juegoId = id, titulo = titulo))
                },
                onIrAPerfil = {
                    navController.navigate(Perfil)
                }
            )
        }

        // 2. Destino Detalle (recupera argumentos con toRoute)
        composable<DetalleJuego> { backStackEntry ->
            val args: DetalleJuego = backStackEntry.toRoute()

            PantallaDetalleJuego(
                juegoId = args.juegoId,
                titulo = args.titulo,
                onVolver = { navController.popBackStack() }
            )
        }

        // 3. Destino Perfil
        composable<Perfil> {
            PantallaPerfil(
                onVolver = { navController.popBackStack() }
            )
        }
    }
}
```

---

## 4. Obtención de Argumentos en el ViewModel

En lugar de extraer los argumentos en la función composable y pasarlos manualmente al ViewModel, la arquitectura recomendada por Google permite extraerlos directamente dentro del ViewModel mediante el `SavedStateHandle`:

```kotlin
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.navigation.toRoute

class DetalleJuegoViewModel(
    savedStateHandle: SavedStateHandle,
    private val obtenerJuegoUseCase: ObtenerJuegoUseCase
) : ViewModel() {

    // Extrae los argumentos serializados directamente del SavedStateHandle
    private val args = savedStateHandle.toRoute<DetalleJuego>()
    val juegoId: Long = args.juegoId

    init {
        cargarDetalle(juegoId)
    }

    private fun cargarDetalle(id: Long) {
        // Lógica de carga
    }
}
```

!!! info "Inyección de dependencias con Koin"
    Koin inyecta automáticamente el `SavedStateHandle` en los ViewModels registrados con `viewModelOf(::DetalleJuegoViewModel)`. Revisa la sección de [Inyección de Dependencias con Koin](../02-arquitectura/03-inyeccion-dependencias-koin.md#dsl-declarativo-koin) para los detalles.

---

## 5. Buena Práctica: Desacoplamiento de Pantallas mediante Lambdas

Una pantalla composable **NUNCA** debe recibir una instancia de `NavController` como parámetro. Recibir el `NavController` acopla la vista a la biblioteca de navegación, impide su reutilización en vistas previas (`@Preview`) y dificulta los tests unitarios.

=== "Anti-patrón (Acoplado)"
    ```kotlin
    // INCORRECTO: Acoplado rígidamente a NavController
    @Composable
    fun PantallaInicio(navController: NavController) {
        Button(onClick = { navController.navigate(Perfil) }) {
            Text("Ver Perfil")
        }
    }
    ```

=== "Patrón Recomendado (Desacoplado con Lambdas)"
    ```kotlin
    // CORRECTO: La pantalla solo notifica qué eventos suceden
    @Composable
    fun PantallaInicio(
        onIrAPerfil: () -> Unit,
        onJuegoClick: (Long) -> Unit
    ) {
        Button(onClick = onIrAPerfil) {
            Text("Ver Perfil")
        }
    }
    ```

---

## 6. Operaciones de Pila y Retroceso (*Back Stack*)

Para manipular el flujo de navegación y evitar pantallas duplicadas al avanzar o cerrar sesión:

```kotlin
// Volver a la pantalla anterior
navController.popBackStack()

// Volver a una pantalla concreta limpiando las intermedias
navController.navigate(Inicio) {
    popUpTo<Inicio> {
        inclusive = true // Elimina también Inicio antes de recrearlo
    }
    launchSingleTop = true // Evita múltiples copias si ya está en el tope
}
```

---

## 7. Navegación en Entornos Multiplataforma (KMP)

A partir de Jetpack Compose Multiplatform (CMP 1.7+), la biblioteca oficial `androidx.navigation:navigation-compose` ya es compatible con Kotlin Multiplatform (Android, iOS y Desktop) compartiendo las mismas clases `@Serializable` y contratos tipados.

Para profundizar en cómo orquestar la navegación en arquitecturas limpias y KMP, consulta:

- [Ecosistema Multiplataforma y Navegación KMP](../02-arquitectura/04-ecosistema-kmp-multiplataforma.md#librerias-esenciales-del-ecosistema-kmp)
- [Guía de Arquitectura de Google](../02-arquitectura/01-guia-arquitectura-google.md#capa-ui-layer)
