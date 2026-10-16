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
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Password
import androidx.compose.material.icons.filled.ViewAgenda
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
import com.dam.pmdmlab03.juegos.ahorcado.ui.AhorcadoScreen
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme
import kotlinx.coroutines.launch

enum class SeccionLaboratorio(val titulo: String, val icono: ImageVector) {
    // Bloque Codelabs M3
    CODELAB_SCAFFOLD("Codelab: Scaffold & AppBars", Icons.Filled.ViewAgenda),
    CODELAB_FORMULARIO("Codelab: Formulario & Modales", Icons.Filled.EditNote),
    CODELAB_CATALOGO("Codelab: Catálogo LazyColumn", Icons.Filled.Category),

    // Bloque Retos de Juegos con ViewModel
    JUEGO_AHORCADO("El Ahorcado", Icons.Filled.Password),
    JUEGO_WORDLE("Wordle Compose", Icons.Filled.GridOn),
    JUEGO_MEMORY("Memory Match", Icons.Filled.Casino)
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
fun AppLaboratorio03() {
    var seccionActual by rememberSaveable { mutableStateOf(SeccionLaboratorio.JUEGO_AHORCADO) }
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
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
                    SeccionLaboratorio.CODELAB_SCAFFOLD -> {
                        Text("Pantalla de Codelab 1: Scaffold, FAB y Snackbar", Modifier.padding(16.dp))
                    }
                    SeccionLaboratorio.CODELAB_FORMULARIO -> {
                        Text("Pantalla de Codelab 2: Formulario M3 con validaciones", Modifier.padding(16.dp))
                    }
                    SeccionLaboratorio.CODELAB_CATALOGO -> {
                        Text("Pantalla de Codelab 3: LazyColumn dinámico con tarjetas", Modifier.padding(16.dp))
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

@Preview(name = "Contenedor Principal Drawer", showBackground = true)
@Composable
private fun AppLaboratorio03Preview() {
    PMDMLab03Theme {
        AppLaboratorio03()
    }
}
