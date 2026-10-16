package com.dam.pmdmlab03

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBox
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.DataObject
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.Password
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.ViewAgenda
import androidx.compose.material3.DrawerState
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab03.codelabs.codelab01_scaffold.ScaffoldDemoScreen
import com.dam.pmdmlab03.codelabs.codelab01_theming.ThemingScreen
import com.dam.pmdmlab03.codelabs.codelab02_formulario.CalculadoraPropinasScreen
import com.dam.pmdmlab03.codelabs.codelab02_formulario.QuizScreen
import com.dam.pmdmlab03.codelabs.codelab03_catalogo.CatalogoLazyScreen
import com.dam.pmdmlab03.codelabs.codelab04_recursos.ProfileCardScreen
import com.dam.pmdmlab03.codelabs.codelab05_heroe.HeroCardScreen
import com.dam.pmdmlab03.juegos.ahorcado.ui.AhorcadoScreen
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme
import kotlinx.coroutines.launch

enum class SeccionLaboratorio(val titulo: String, val icono: ImageVector) {
    // Bloque Codelabs Formativos M3
    CODELAB_THEMING("1. Theming y Modo Oscuro", Icons.Filled.Palette),
    CODELAB_ESTADO("2. Estado y TextField", Icons.Filled.EditNote),
    CODELAB_VIEWMODEL("3. ViewModel y StateFlow", Icons.Filled.DataObject),
    CODELAB_SCAFFOLD("4. Scaffold y Feedback", Icons.Filled.ViewAgenda),
    CODELAB_CATALOGO("5. Catálogo LazyColumn", Icons.Filled.Category),
    CODELAB_RECURSOS("6. Recursos y Localización", Icons.Filled.AccountBox),
    CODELAB_HEROE("7. Ficha de Héroe RPG", Icons.Filled.Shield),

    // Bloque Retos de Juegos con ViewModel
    JUEGO_AHORCADO("Reto A: El Ahorcado", Icons.Filled.Password),
    JUEGO_WORDLE("Reto B: Wordle Compose", Icons.Filled.GridOn),
    JUEGO_MEMORY("Reto C: Memory Match", Icons.Filled.Casino)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PMDMLab03Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppLaboratorio03()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppLaboratorio03(
    drawerState: DrawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
) {
    var seccionActual by rememberSaveable { mutableStateOf(SeccionLaboratorio.JUEGO_AHORCADO) }
    val scope = rememberCoroutineScope()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                Spacer(Modifier.height(16.dp))
                Text(
                    text = "PMDM Lab - UT03",
                    style = MaterialTheme.typography.headlineSmall,
                    modifier = Modifier.padding(horizontal = 24.dp)
                )
                Text(
                    text = "Material 3 & Jetpack Compose",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 4.dp)
                )

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                SeccionLaboratorio.entries.forEach { seccion ->
                    NavigationDrawerItem(
                        icon = { Icon(seccion.icono, contentDescription = null) },
                        label = { Text(seccion.titulo) },
                        selected = seccionActual == seccion,
                        onClick = {
                            seccionActual = seccion
                            scope.launch { drawerState.close() }
                        },
                        modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                    )
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text(seccionActual.titulo) },
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Filled.Menu, contentDescription = "Abrir menú hamburguesa")
                        }
                    }
                )
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                when (seccionActual) {
                    SeccionLaboratorio.CODELAB_THEMING -> {
                        ThemingScreen()
                    }
                    SeccionLaboratorio.CODELAB_ESTADO -> {
                        CalculadoraPropinasScreen()
                    }
                    SeccionLaboratorio.CODELAB_VIEWMODEL -> {
                        QuizScreen()
                    }
                    SeccionLaboratorio.CODELAB_SCAFFOLD -> {
                        ScaffoldDemoScreen()
                    }
                    SeccionLaboratorio.CODELAB_CATALOGO -> {
                        CatalogoLazyScreen()
                    }
                    SeccionLaboratorio.CODELAB_RECURSOS -> {
                        ProfileCardScreen()
                    }
                    SeccionLaboratorio.CODELAB_HEROE -> {
                        HeroCardScreen()
                    }
                    SeccionLaboratorio.JUEGO_AHORCADO -> {
                        AhorcadoScreen()
                    }
                    SeccionLaboratorio.JUEGO_WORDLE -> {
                        Text("Reto B: Wordle con matriz de casillas y teclado reactivo", Modifier.padding(16.dp))
                    }
                    SeccionLaboratorio.JUEGO_MEMORY -> {
                        Text("Reto C: Memory Match con LazyVerticalGrid de cartas", Modifier.padding(16.dp))
                    }
                }
            }
        }
    }
}

@Preview(name = "Contenedor Principal - Drawer Cerrado",
    device = "spec:width=411dp,height=891dp",
    showSystemUi = true,
    showBackground = true)
@Composable
private fun AppLaboratorio03Preview() {
    PMDMLab03Theme {
        AppLaboratorio03()
    }
}

@Preview(name = "Contenedor Principal - Drawer Abierto", showBackground = true)
@Composable
private fun AppLaboratorio03DrawerAbiertoPreview() {
    PMDMLab03Theme {
        AppLaboratorio03(
            drawerState = rememberDrawerState(initialValue = DrawerValue.Open)
        )
    }
}

