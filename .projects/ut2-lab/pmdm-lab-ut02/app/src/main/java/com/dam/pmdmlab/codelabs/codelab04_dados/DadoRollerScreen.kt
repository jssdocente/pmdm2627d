package com.dam.pmdmlab.codelabs.codelab04_dados

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
fun DadoRollerContent(
    valorDado: Int,
    totalTiradas: Int,
    onLanzarDado: () -> Unit,
    onReiniciarTiradas: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Lanzador de Dados",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Toca el botón para realizar una tirada",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Componente visual: Cara del Dado
        CaraDado(valor = valorDado)

        Spacer(modifier = Modifier.height(24.dp))

        // Badge con el total de tiradas acumuladas
        Surface(
            color = MaterialTheme.colorScheme.secondaryContainer,
            shape = MaterialTheme.shapes.medium
        ) {
            Text(
                text = "Tiradas realizadas: $totalTiradas",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSecondaryContainer
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Botón principal de lanzamiento
        Button(
            onClick = onLanzarDado,
            modifier = Modifier.fillMaxWidth(0.7f)
        ) {
            Text(
                text = "¡Lanzar Dado!",
                style = MaterialTheme.typography.titleMedium
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Botón secundario para reiniciar tiradas
        OutlinedButton(
            onClick = onReiniciarTiradas,
            modifier = Modifier.fillMaxWidth(0.7f),
            enabled = totalTiradas > 0
        ) {
            Text("Reiniciar Tiradas")
        }

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedButton(onClick = onBack) {
            Text("Volver al Menú")
        }
    }
}

@Composable
fun CaraDado(valor: Int, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.size(140.dp),
        shape = MaterialTheme.shapes.large,
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "$valor",
                style = MaterialTheme.typography.displayLarge,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }
    }
}

// ============================================================================
// 2. VISTAS PREVIAS (@PREVIEW) CON DATOS MOCK
// ============================================================================
@Preview(name = "Dado - Estado Inicial (1)", showBackground = true)
@Composable
private fun DadoRollerPreviewInicial() {
    Surface {
        DadoRollerContent(
            valorDado = 1,
            totalTiradas = 0,
            onLanzarDado = {},
            onReiniciarTiradas = {},
            onBack = {}
        )
    }
}

@Preview(name = "Dado - Tirada Avanzada (6)", showBackground = true)
@Composable
private fun DadoRollerPreviewAvanzado() {
    Surface {
        DadoRollerContent(
            valorDado = 6,
            totalTiradas = 15,
            onLanzarDado = {},
            onReiniciarTiradas = {},
            onBack = {}
        )
    }
}

// ============================================================================
// 3. PANTALLA CONTENEDORA (STATEFUL SCREEN)
// ============================================================================
@Composable
fun DadoRollerScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var valorDado by rememberSaveable { mutableIntStateOf(1) }
    var totalTiradas by rememberSaveable { mutableIntStateOf(0) }

    DadoRollerContent(
        valorDado = valorDado,
        totalTiradas = totalTiradas,
        onLanzarDado = {
            valorDado = (1..6).random()
            totalTiradas++
        },
        onReiniciarTiradas = {
            valorDado = 1
            totalTiradas = 0
        },
        onBack = onBack,
        modifier = modifier
    )
}
