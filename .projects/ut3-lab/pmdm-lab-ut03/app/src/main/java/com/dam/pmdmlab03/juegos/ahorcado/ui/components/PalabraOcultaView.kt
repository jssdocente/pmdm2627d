package com.dam.pmdmlab03.juegos.ahorcado.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme

/**
 * Muestra las letras descubiertas y los huecos pendientes de la palabra secreta
 * en casillas visuales individuales de Material 3.
 */
@Composable
fun PalabraOcultaView(
    palabraMascara: String,
    modifier: Modifier = Modifier
) {
    // La máscara viene formateada como "K _ T L _ N" o "_ _ _ _"
    val caracteres = palabraMascara.split(" ").filter { it.isNotEmpty() }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (charToken in caracteres) {
            val esGuion = charToken == "_"

            ElevatedCard(
                modifier = Modifier
                    .padding(horizontal = 4.dp)
                    .size(width = 40.dp, height = 52.dp),
                colors = CardDefaults.elevatedCardColors(
                    containerColor = if (esGuion) {
                        MaterialTheme.colorScheme.surfaceVariant
                    } else {
                        MaterialTheme.colorScheme.primaryContainer
                    }
                ),
                elevation = CardDefaults.elevatedCardElevation(defaultElevation = 2.dp)
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (esGuion) "" else charToken,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 26.sp
                        ),
                        color = if (esGuion) {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        } else {
                            MaterialTheme.colorScheme.onPrimaryContainer
                        }
                    )
                    // Si es guion, dibujamos una pequeña barra inferior decorativa
                    if (esGuion) {
                        Text(
                            text = "_",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Black
                            ),
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

// ==========================================
// PREVIEWS DIDÁCTICAS PARA LOS ALUMNOS
// ==========================================

@Preview(name = "Palabra recién iniciada", showBackground = true)
@Composable
private fun PalabraOcultaPreviewInicial() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            PalabraOcultaView(palabraMascara = "_ _ _ _ _ _")
        }
    }
}

@Preview(name = "Palabra a medio descubrir", showBackground = true)
@Composable
private fun PalabraOcultaPreviewEnCurso() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            PalabraOcultaView(palabraMascara = "K _ T L _ N")
        }
    }
}
