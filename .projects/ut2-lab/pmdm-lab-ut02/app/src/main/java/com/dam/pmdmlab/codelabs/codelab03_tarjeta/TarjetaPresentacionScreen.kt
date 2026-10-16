package com.dam.pmdmlab.codelabs.codelab03_tarjeta

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// ============================================================================
// 1. COMPONENTE DE PRESENTACIÓN (STATELESS CONTENT)
// ============================================================================
@Composable
fun TarjetaPresentacionContent(
    nombre: String,
    especialidad: String,
    contadorProyectos: Int,
    onSumarProyecto: () -> Unit,
    onReiniciar: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(0.9f),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = nombre,
                    style = MaterialTheme.typography.headlineMedium
                )
                Text(
                    text = especialidad,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.secondary
                )

                Spacer(modifier = Modifier.height(16.dp))

                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = MaterialTheme.shapes.small
                ) {
                    Text(
                        text = "Proyectos completados: $contadorProyectos",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    Button(onClick = onSumarProyecto) {
                        Text("+1 Proyecto")
                    }
                    OutlinedButton(onClick = onReiniciar) {
                        Text("Reiniciar")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedButton(onClick = onBack) {
            Text("Volver al Menú Principal")
        }
    }
}

// ============================================================================
// 2. VISTAS PREVIAS (@PREVIEW) CON DATOS MOCK
// ============================================================================
@Preview(name = "Tarjeta Inicial - Claro", showBackground = true)
@Composable
private fun TarjetaPresentacionPreviewInicial() {
    Surface {
        TarjetaPresentacionContent(
            nombre = "Ada Lovelace",
            especialidad = "Desarrolladora Kotlin",
            contadorProyectos = 0,
            onSumarProyecto = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(name = "Tarjeta Activa - Varios Proyectos", showBackground = true)
@Composable
private fun TarjetaPresentacionPreviewConDatos() {
    Surface {
        TarjetaPresentacionContent(
            nombre = "Alan Turing",
            especialidad = "Ingeniero de Sistemas",
            contadorProyectos = 12,
            onSumarProyecto = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(
    name = "Tarjeta - Modo Oscuro",
    showBackground = true,
    uiMode = android.content.res.Configuration.UI_MODE_NIGHT_YES
)
@Composable
private fun TarjetaPresentacionPreviewDark() {
    Surface {
        TarjetaPresentacionContent(
            nombre = "Grace Hopper",
            especialidad = "Arquitecta de Compiladores",
            contadorProyectos = 42,
            onSumarProyecto = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

// ============================================================================
// 3. PANTALLA CONTENEDORA (STATEFUL SCREEN)
// ============================================================================
@Composable
fun TarjetaPresentacionScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var proyectos by rememberSaveable { mutableIntStateOf(0) }

    TarjetaPresentacionContent(
        nombre = "Carlos Estudiante",
        especialidad = "Desarrollador Multiplataforma (2º DAM)",
        contadorProyectos = proyectos,
        onSumarProyecto = { proyectos++ },
        onReiniciar = { proyectos = 0 },
        onBack = onBack,
        modifier = modifier
    )
}
