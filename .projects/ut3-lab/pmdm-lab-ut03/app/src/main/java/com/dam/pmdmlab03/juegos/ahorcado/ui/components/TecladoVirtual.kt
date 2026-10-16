package com.dam.pmdmlab03.juegos.ahorcado.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.FilledTonalButton
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
 * Teclado virtual interactivo compuesto por botones FilledTonalButton.
 * Deshabilita automáticamente las letras que el jugador ya ha intentado
 * o bloquea la interacción si la partida ha concluido.
 */
@Composable
fun TecladoVirtual(
    letrasProbadas: Set<Char>,
    partidaActiva: Boolean,
    onLetraClick: (Char) -> Unit,
    modifier: Modifier = Modifier
) {
    // Abecedario organizado en filas equilibradas para pantallas móviles
    val filasTeclado = listOf(
        listOf('A', 'B', 'C', 'D', 'E', 'F', 'G'),
        listOf('H', 'I', 'J', 'K', 'L', 'M', 'N'),
        listOf('Ñ', 'O', 'P', 'Q', 'R', 'S', 'T'),
        listOf('U', 'V', 'W', 'X', 'Y', 'Z')
    )

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        for (fila in filasTeclado) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                for (letra in fila) {
                    val yaProbada = letra in letrasProbadas
                    val habilitado = partidaActiva && !yaProbada

                    FilledTonalButton(
                        onClick = { onLetraClick(letra) },
                        enabled = habilitado,
                        modifier = Modifier
                            .defaultMinSize(minWidth = 38.dp, minHeight = 44.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = letra.toString(),
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
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

@Preview(name = "Teclado Completo Habilitado", showBackground = true)
@Composable
private fun TecladoVirtualPreviewActivo() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            TecladoVirtual(
                letrasProbadas = emptySet(),
                partidaActiva = true,
                onLetraClick = {}
            )
        }
    }
}

@Preview(name = "Teclado con Letras Deshabilitadas", showBackground = true)
@Composable
private fun TecladoVirtualPreviewConProbadas() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            TecladoVirtual(
                letrasProbadas = setOf('A', 'E', 'I', 'O', 'U', 'S', 'T'),
                partidaActiva = true,
                onLetraClick = {}
            )
        }
    }
}
