package com.dam.pmdmlab.ui.menu

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab.CategoriaReto
import com.dam.pmdmlab.PantallaReto

@Composable
fun LabMenuScreen(
    onSeleccionarReto: (PantallaReto) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "PMDM Lab - UT02",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "Selecciona un codelab o un reto para probar su comportamiento interactivo:",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Sección 1: Codelabs Guiados
        Text(
            text = "📚 Codelabs Guiados",
            style = MaterialTheme.typography.titleLarge
        )

        PantallaReto.entries
            .filter { it.categoria == CategoriaReto.CODELAB_GUIADO && it != PantallaReto.MENU }
            .forEach { reto ->
                ItemRetoCard(reto = reto, onClick = { onSeleccionarReto(reto) })
            }

        Spacer(modifier = Modifier.height(8.dp))

        // Sección 2: Retos Autónomos
        Text(
            text = "🚀 Retos Autónomos (Para el Alumno)",
            style = MaterialTheme.typography.titleLarge
        )

        PantallaReto.entries
            .filter { it.categoria == CategoriaReto.RETO_AUTONOMO }
            .forEach { reto ->
                ItemRetoCard(reto = reto, onClick = { onSeleccionarReto(reto) })
            }
    }
}

@Composable
private fun ItemRetoCard(
    reto: PantallaReto,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = if (reto.categoria == CategoriaReto.CODELAB_GUIADO) {
                MaterialTheme.colorScheme.surfaceVariant
            } else {
                MaterialTheme.colorScheme.tertiaryContainer
            }
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = reto.titulo,
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = reto.descripcion,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun LabMenuScreenPreview() {
    Surface {
        LabMenuScreen(onSeleccionarReto = {})
    }
}
