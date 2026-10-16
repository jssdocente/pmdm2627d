package com.dam.pmdmlab03.juegos.ahorcado.ui

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dam.pmdmlab03.juegos.ahorcado.domain.EstadoPartida
import com.dam.pmdmlab03.juegos.ahorcado.ui.components.AhorcadoResultDialog
import com.dam.pmdmlab03.juegos.ahorcado.ui.components.PalabraOcultaView
import com.dam.pmdmlab03.juegos.ahorcado.ui.components.TecladoVirtual
import com.dam.pmdmlab03.juegos.ahorcado.ui.components.VidasIndicator
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme

/**
 * Componible Stateful: Punto de entrada a la pantalla del Ahorcado.
 * Se encarga de instanciar el ViewModel y suscribirse a su StateFlow.
 */
@Composable
fun AhorcadoScreen(
    modifier: Modifier = Modifier,
    viewModel: AhorcadoViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    AhorcadoContent(
        uiState = uiState,
        onLetraClick = viewModel::intentarLetra,
        onReiniciar = viewModel::reiniciarPartida,
        modifier = modifier
    )
}

/**
 * Componible Stateless (State Hoisting): Totalmente desacoplado del ViewModel.
 * Permite renderizar vistas previas (@Preview) instantáneas y realizar pruebas unitarias de UI.
 */
@Composable
fun AhorcadoContent(
    uiState: AhorcadoUiState,
    onLetraClick: (Char) -> Unit,
    onReiniciar: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // 1. Cabecera con título y botón de reinicio voluntario
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "El Ahorcado",
                    style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "Descubre la palabra secreta antes de quedarte sin vidas",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.secondary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
                )

                // 2. Indicador visual de vidas (LinearProgressIndicator)
                VidasIndicator(
                    vidasRestantes = uiState.vidasRestantes,
                    vidasMaximas = uiState.vidasMaximas
                )
            }

            // 3. Área central: Fila de casillas de la palabra oculta
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                PalabraOcultaView(palabraMascara = uiState.palabraMascara)
            }

            // 4. Área inferior: Teclado interactivo y control de reinicio
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                TecladoVirtual(
                    letrasProbadas = uiState.letrasProbadas,
                    partidaActiva = uiState.estadoPartida == EstadoPartida.JUGANDO,
                    onLetraClick = onLetraClick
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedButton(
                    onClick = onReiniciar,
                    modifier = Modifier.fillMaxWidth(0.6f)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Refresh,
                        contentDescription = "Reiniciar partida",
                        modifier = Modifier.padding(end = 8.dp)
                    )
                    Text("Reiniciar partida")
                }
            }
        }

        // 5. Diálogo modal automático de fin de partida (Victoria / Derrota)
        AhorcadoResultDialog(
            estadoPartida = uiState.estadoPartida,
            palabraSecreta = uiState.palabraSecreta,
            vidasRestantes = uiState.vidasRestantes,
            onReiniciar = onReiniciar
        )
    }
}

// ==========================================
// PREVIEWS DIDÁCTICAS PARA LOS ALUMNOS
// ==========================================

@Preview(name = "Pantalla Completa - Modo Claro", showBackground = true, showSystemUi = true)
@Composable
private fun AhorcadoScreenPreviewLight() {
    PMDMLab03Theme(darkTheme = false) {
        AhorcadoContent(
            uiState = AhorcadoUiState(
                palabraMascara = "K O T L _ N",
                palabraSecreta = "KOTLIN",
                vidasRestantes = 4,
                vidasMaximas = 6,
                letrasProbadas = setOf('A', 'E', 'K', 'T', 'L', 'N'),
                estadoPartida = EstadoPartida.JUGANDO
            ),
            onLetraClick = {},
            onReiniciar = {}
        )
    }
}

@Preview(
    name = "Pantalla Completa - Modo Oscuro",
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    showSystemUi = true
)
@Composable
private fun AhorcadoScreenPreviewDark() {
    PMDMLab03Theme(darkTheme = true) {
        AhorcadoContent(
            uiState = AhorcadoUiState(
                palabraMascara = "_ _ _ _ _ _",
                palabraSecreta = "ANDROID",
                vidasRestantes = 6,
                vidasMaximas = 6,
                letrasProbadas = emptySet(),
                estadoPartida = EstadoPartida.JUGANDO
            ),
            onLetraClick = {},
            onReiniciar = {}
        )
    }
}
