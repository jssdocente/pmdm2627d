package com.dam.pmdmlab.retos.reto02_marcador

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// ============================================================================
// 1. COMPONENTE DE PRESENTACIÓN PURA (STATELESS)
// ============================================================================

@Composable
fun MarcadorBaloncestoContent(
    puntosLocal: Int,
    puntosVisitante: Int,
    onSumarLocal: (Int) -> Unit,
    onSumarVisitante: (Int) -> Unit,
    onReiniciar: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "🏀 Marcador de Baloncesto",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Control de tanteo interactivo y reactivo",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Indicador central de estado del partido
        val estadoPartido = when {
            puntosLocal > puntosVisitante -> "🏆 Local en cabeza (+${puntosLocal - puntosVisitante})"
            puntosVisitante > puntosLocal -> "🏆 Visitante en cabeza (+${puntosVisitante - puntosLocal})"
            puntosLocal == 0 && puntosVisitante == 0 -> "Balón al aire - Comienza el partido"
            else -> "🤝 Partido Empatado"
        }

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(16.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant)
                .padding(horizontal = 20.dp, vertical = 8.dp)
        ) {
            Text(
                text = estadoPartido,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Paneles de anotación en paralelo (Local y Visitante)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Panel Local
            PanelEquipo(
                nombre = "LOCAL",
                puntos = puntosLocal,
                esLider = puntosLocal > puntosVisitante,
                onSumarPuntos = onSumarLocal,
                modifier = Modifier.weight(1f)
            )

            // Panel Visitante
            PanelEquipo(
                nombre = "VISITANTE",
                puntos = puntosVisitante,
                esLider = puntosVisitante > puntosLocal,
                onSumarPuntos = onSumarVisitante,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Botonera de control (Reset y Salir)
        Button(
            onClick = onReiniciar,
            enabled = puntosLocal > 0 || puntosVisitante > 0,
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.error
            ),
            modifier = Modifier.fillMaxWidth(0.7f)
        ) {
            Text("Reiniciar Partido")
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedButton(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth(0.7f)
        ) {
            Text("Volver al Menú")
        }
    }
}

@Composable
private fun PanelEquipo(
    nombre: String,
    puntos: Int,
    esLider: Boolean,
    onSumarPuntos: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (esLider) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surfaceVariant
            }
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = nombre,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = if (esLider) {
                    MaterialTheme.colorScheme.onPrimaryContainer
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant
                }
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "$puntos",
                style = MaterialTheme.typography.displayMedium,
                fontWeight = FontWeight.Black,
                color = if (esLider) {
                    MaterialTheme.colorScheme.primary
                } else {
                    MaterialTheme.colorScheme.onSurface
                }
            )

            if (esLider) {
                Text(
                    text = "¡Líder!",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
            } else {
                Spacer(modifier = Modifier.height(16.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Botones de puntuación
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Button(
                    onClick = { onSumarPuntos(3) },
                    contentPadding = ButtonDefaults.TextButtonContentPadding,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("+3")
                }
                Spacer(modifier = Modifier.width(4.dp))
                Button(
                    onClick = { onSumarPuntos(2) },
                    contentPadding = ButtonDefaults.TextButtonContentPadding,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("+2")
                }
                Spacer(modifier = Modifier.width(4.dp))
                Button(
                    onClick = { onSumarPuntos(1) },
                    contentPadding = ButtonDefaults.TextButtonContentPadding,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("+1")
                }
            }
        }
    }
}

// ============================================================================
// 2. VISTAS PREVIAS (@PREVIEW) CON DATOS MOCK
// ============================================================================

@Preview(name = "Empate Inicial (0 - 0)", showBackground = true)
@Composable
private fun MarcadorPreviewEmpate() {
    Surface {
        MarcadorBaloncestoContent(
            puntosLocal = 0,
            puntosVisitante = 0,
            onSumarLocal = {},
            onSumarVisitante = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(name = "Victoria Local (68 - 52)", showBackground = true)
@Composable
private fun MarcadorPreviewLocalGanando() {
    Surface {
        MarcadorBaloncestoContent(
            puntosLocal = 68,
            puntosVisitante = 52,
            onSumarLocal = {},
            onSumarVisitante = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(name = "Victoria Visitante (45 - 50)", showBackground = true)
@Composable
private fun MarcadorPreviewVisitanteGanando() {
    Surface {
        MarcadorBaloncestoContent(
            puntosLocal = 45,
            puntosVisitante = 50,
            onSumarLocal = {},
            onSumarVisitante = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

// ============================================================================
// 3. PANTALLA CONTENEDORA (STATEFUL SCREEN)
// ============================================================================

@Composable
fun MarcadorBaloncestoScreen(
    onBack: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var puntosLocal by rememberSaveable { mutableIntStateOf(0) }
    var puntosVisitante by rememberSaveable { mutableIntStateOf(0) }

    MarcadorBaloncestoContent(
        puntosLocal = puntosLocal,
        puntosVisitante = puntosVisitante,
        onSumarLocal = { puntos -> puntosLocal += puntos },
        onSumarVisitante = { puntos -> puntosVisitante += puntos },
        onReiniciar = {
            puntosLocal = 0
            puntosVisitante = 0
        },
        onBack = onBack,
        modifier = modifier
    )
}
