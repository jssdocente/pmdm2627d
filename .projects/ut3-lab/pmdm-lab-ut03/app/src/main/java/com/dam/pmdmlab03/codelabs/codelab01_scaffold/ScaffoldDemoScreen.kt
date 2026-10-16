package com.dam.pmdmlab03.codelabs.codelab01_scaffold

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScaffoldDemoScreen(modifier: Modifier = Modifier) {
    val tareas = remember {
        mutableStateListOf(
            "Configurar el SDK de Android en IntelliJ",
            "Estudiar los roles semánticos de ColorScheme",
            "Resolver el reto del Ahorcado en Compose"
        )
    }

    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var elementoParaBorrar by remember { mutableStateOf<String?>(null) }
    var ultimoBorradoConIndice by remember { mutableStateOf<Pair<Int, String>?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Gestor de Tareas M3") },
                actions = {
                    IconButton(onClick = {
                        scope.launch {
                            snackbarHostState.showSnackbar("Búsqueda no implementada aún")
                        }
                    }) {
                        Icon(Icons.Filled.Search, contentDescription = "Buscar")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    val nuevaTarea = "Nueva tarea creada #${tareas.size + 1}"
                    tareas.add(nuevaTarea)
                    scope.launch {
                        snackbarHostState.showSnackbar("Tarea añadida con éxito")
                    }
                },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Añadir tarea")
            }
        },
        snackbarHost = { SnackbarHost(snackbarHostState) },
        modifier = modifier
    ) { innerPadding ->
        // ¡USO OBLIGATORIO DE INNERPADDING!
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (tareas.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No tienes tareas pendientes 🎉\nPulsa en '+' para añadir una.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(tareas, key = { it }) { tarea ->
                        ElevatedCard(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.elevatedCardColors(
                                containerColor = MaterialTheme.colorScheme.surfaceVariant
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = tarea,
                                    style = MaterialTheme.typography.bodyLarge,
                                    modifier = Modifier.weight(1f)
                                )

                                IconButton(onClick = { elementoParaBorrar = tarea }) {
                                    Icon(
                                        imageVector = Icons.Filled.Delete,
                                        contentDescription = "Borrar",
                                        tint = MaterialTheme.colorScheme.error
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Diálogo Modal de Confirmación
        elementoParaBorrar?.let { tareaABorrar ->
            AlertDialog(
                onDismissRequest = { elementoParaBorrar = null },
                icon = {
                    Icon(
                        imageVector = Icons.Filled.Warning,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.error
                    )
                },
                title = { Text("¿Eliminar tarea?") },
                text = { Text("Se eliminará de la lista: '$tareaABorrar'") },
                confirmButton = {
                    TextButton(
                        onClick = {
                            val indice = tareas.indexOf(tareaABorrar)
                            if (indice != -1) {
                                tareas.removeAt(indice)
                                ultimoBorradoConIndice = Pair(indice, tareaABorrar)
                                elementoParaBorrar = null

                                // Disparo de Snackbar con opción "Deshacer"
                                scope.launch {
                                    val resultado = snackbarHostState.showSnackbar(
                                        message = "Tarea eliminada",
                                        actionLabel = "Deshacer",
                                        duration = SnackbarDuration.Short
                                    )

                                    if (resultado == SnackbarResult.ActionPerformed) {
                                        ultimoBorradoConIndice?.let { (pos, texto) ->
                                            tareas.add(pos.coerceAtMost(tareas.size), texto)
                                        }
                                    }
                                }
                            }
                        }
                    ) {
                        Text("Eliminar", color = MaterialTheme.colorScheme.error)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { elementoParaBorrar = null }) {
                        Text("Cancelar")
                    }
                }
            )
        }
    }
}

// ==========================================
// PREVIEW EN INTELLIJ IDEA
// ==========================================

@Preview(name = "Scaffold con Lista de Tareas", showBackground = true)
@Composable
private fun ScaffoldDemoScreenPreview() {
    PMDMLab03Theme {
        ScaffoldDemoScreen()
    }
}
