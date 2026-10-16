package com.dam.pmdmlab03.juegos.ahorcado.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.SentimentVeryDissatisfied
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab03.juegos.ahorcado.domain.EstadoPartida
import com.dam.pmdmlab03.ui.theme.DangerRed
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme
import com.dam.pmdmlab03.ui.theme.SuccessGreen

/**
 * Diálogo modal de Material 3 que notifica el fin de la partida.
 * Se activa automáticamente al alcanzar el estado de Victoria o Derrota.
 */
@Composable
fun AhorcadoResultDialog(
    estadoPartida: EstadoPartida,
    palabraSecreta: String,
    vidasRestantes: Int,
    onReiniciar: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (estadoPartida == EstadoPartida.JUGANDO) return

    val esVictoria = estadoPartida == EstadoPartida.VICTORIA

    AlertDialog(
        onDismissRequest = { /* Modal bloqueante hasta que decida reiniciar */ },
        icon = {
            Icon(
                imageVector = if (esVictoria) Icons.Filled.EmojiEvents else Icons.Filled.SentimentVeryDissatisfied,
                contentDescription = null,
                tint = if (esVictoria) SuccessGreen else DangerRed
            )
        },
        title = {
            Text(
                text = if (esVictoria) "¡Enhorabuena! Has ganado 🎉" else "¡Partida Perdida! 💀",
                style = MaterialTheme.typography.titleLarge,
                textAlign = TextAlign.Center
            )
        },
        text = {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                if (esVictoria) {
                    Text(
                        text = "¡Has descubierto la palabra secreta conservando $vidasRestantes vida(s)!",
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center
                    )
                } else {
                    Text(
                        text = "Te has quedado sin vidas.",
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "La palabra secreta era:",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.secondary
                    )
                    Text(
                        text = palabraSecreta,
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    )
                }
            }
        },
        confirmButton = {
            Button(onClick = onReiniciar) {
                Text("Jugar de nuevo")
            }
        },
        modifier = modifier
    )
}

// ==========================================
// PREVIEWS DIDÁCTICAS PARA LOS ALUMNOS
// ==========================================

@Preview(name = "Diálogo de Victoria", showBackground = true)
@Composable
private fun AhorcadoResultDialogPreviewVictoria() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            AhorcadoResultDialog(
                estadoPartida = EstadoPartida.VICTORIA,
                palabraSecreta = "KOTLIN",
                vidasRestantes = 4,
                onReiniciar = {}
            )
        }
    }
}

@Preview(name = "Diálogo de Derrota", showBackground = true)
@Composable
private fun AhorcadoResultDialogPreviewDerrota() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            AhorcadoResultDialog(
                estadoPartida = EstadoPartida.DERROTA,
                palabraSecreta = "SCAFFOLD",
                vidasRestantes = 0,
                onReiniciar = {}
            )
        }
    }
}
