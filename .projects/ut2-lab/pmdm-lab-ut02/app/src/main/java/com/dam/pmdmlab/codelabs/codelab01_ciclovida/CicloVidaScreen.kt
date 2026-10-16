package com.dam.pmdmlab.codelabs.codelab01_ciclovida

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
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
fun CicloVidaContent(
    cuentaVolatil: Int,
    cuentaGuardada: Int,
    onIncrementarVolatil: () -> Unit,
    onIncrementarGuardada: () -> Unit,
    onReiniciarTodo: () -> Unit,
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
            text = "Ciclo de Vida y Persistencia",
            style = MaterialTheme.typography.headlineSmall
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Compara el comportamiento tras rotar el teléfono",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(28.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.errorContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Volátil (remember)",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
                Text(
                    text = "$cuentaVolatil",
                    style = MaterialTheme.typography.displayMedium,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onIncrementarVolatil,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.error
                    )
                ) {
                    Text("+1 Volátil")
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Persistente (rememberSaveable)",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Text(
                    text = "$cuentaGuardada",
                    style = MaterialTheme.typography.displayMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Spacer(modifier = Modifier.height(8.dp))
                Button(onClick = onIncrementarGuardada) {
                    Text("+1 Persistente")
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            OutlinedButton(onClick = onReiniciarTodo) {
                Text("Reiniciar")
            }
            Button(onClick = onBack) {
                Text("Volver al Menú")
            }
        }
    }
}

// ============================================================================
// 2. VISTAS PREVIAS (@PREVIEW) CON DATOS MOCK
// ============================================================================
@Preview(name = "CicloVida - Estado Inicial", showBackground = true)
@Composable
private fun CicloVidaPreviewInicial() {
    Surface {
        CicloVidaContent(
            cuentaVolatil = 0,
            cuentaGuardada = 0,
            onIncrementarVolatil = {},
            onIncrementarGuardada = {},
            onReiniciarTodo = {},
            onBack = {}
        )
    }
}

@Preview(name = "CicloVida - Contadores Avanzados", showBackground = true)
@Composable
private fun CicloVidaPreviewConValores() {
    Surface {
        CicloVidaContent(
            cuentaVolatil = 8,
            cuentaGuardada = 14,
            onIncrementarVolatil = {},
            onIncrementarGuardada = {},
            onReiniciarTodo = {},
            onBack = {}
        )
    }
}

// ============================================================================
// 3. PANTALLA CONTENEDORA (STATEFUL SCREEN)
// ============================================================================
@Composable
fun CicloVidaScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var cuentaVolatil by remember { mutableIntStateOf(0) }
    var cuentaGuardada by rememberSaveable { mutableIntStateOf(0) }

    CicloVidaContent(
        cuentaVolatil = cuentaVolatil,
        cuentaGuardada = cuentaGuardada,
        onIncrementarVolatil = { cuentaVolatil++ },
        onIncrementarGuardada = { cuentaGuardada++ },
        onReiniciarTodo = {
            cuentaVolatil = 0
            cuentaGuardada = 0
        },
        onBack = onBack,
        modifier = modifier
    )
}
