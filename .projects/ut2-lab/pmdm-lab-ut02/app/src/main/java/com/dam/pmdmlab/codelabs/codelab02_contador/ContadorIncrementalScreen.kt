package com.dam.pmdmlab.codelabs.codelab02_contador

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
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
fun ContadorIncrementalContent(
    cuenta: Int,
    onIncrementar: () -> Unit,
    onDecrementar: () -> Unit,
    onReset: () -> Unit,
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
            text = "Mi Primer Composable",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Estado y Recomposición en tiempo real",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(36.dp))

        Surface(
            color = MaterialTheme.colorScheme.primaryContainer,
            shape = MaterialTheme.shapes.extraLarge,
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "$cuenta",
                style = MaterialTheme.typography.displayLarge,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.padding(horizontal = 48.dp, vertical = 24.dp)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = when (cuenta) {
                0 -> "Pulsa '+1' para empezar a contar"
                1 -> "Has pulsado el botón 1 vez"
                else -> "Has pulsado el botón $cuenta veces"
            },
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.secondary
        )

        Spacer(modifier = Modifier.height(32.dp))

        Row(
            modifier = Modifier.fillMaxWidth(0.9f),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedButton(
                onClick = onDecrementar,
                modifier = Modifier.weight(1f),
                enabled = cuenta > 0
            ) {
                Text("-1")
            }

            Button(
                onClick = onIncrementar,
                modifier = Modifier.weight(1.5f)
            ) {
                Text(
                    text = "+1",
                    style = MaterialTheme.typography.titleMedium
                )
            }

            OutlinedButton(
                onClick = onReset,
                modifier = Modifier.weight(1f),
                enabled = cuenta > 0
            ) {
                Text("Reset")
            }
        }

        Spacer(modifier = Modifier.height(48.dp))

        OutlinedButton(onClick = onBack) {
            Text("Volver al Menú Principal")
        }
    }
}

// ============================================================================
// 2. VISTAS PREVIAS (@PREVIEW) CON DATOS MOCK
// ============================================================================
@Preview(name = "Contador en Cero", showBackground = true)
@Composable
private fun ContadorPreviewCero() {
    Surface {
        ContadorIncrementalContent(
            cuenta = 0,
            onIncrementar = {},
            onDecrementar = {},
            onReset = {},
            onBack = {}
        )
    }
}

@Preview(name = "Contador con Valor Activo", showBackground = true)
@Composable
private fun ContadorPreviewActivo() {
    Surface {
        ContadorIncrementalContent(
            cuenta = 15,
            onIncrementar = {},
            onDecrementar = {},
            onReset = {},
            onBack = {}
        )
    }
}

// ============================================================================
// 3. PANTALLA CONTENEDORA (STATEFUL SCREEN)
// ============================================================================
@Composable
fun ContadorIncrementalScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var cuenta by rememberSaveable { mutableIntStateOf(0) }

    ContadorIncrementalContent(
        cuenta = cuenta,
        onIncrementar = { cuenta++ },
        onDecrementar = { if (cuenta > 0) cuenta-- },
        onReset = { cuenta = 0 },
        onBack = onBack,
        modifier = modifier
    )
}
