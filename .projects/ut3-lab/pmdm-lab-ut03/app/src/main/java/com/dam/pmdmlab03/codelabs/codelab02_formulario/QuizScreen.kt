package com.dam.pmdmlab03.codelabs.codelab02_formulario

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme

// ==========================================
// COMPONIBLE STATEFUL: Inyecta el ViewModel
// ==========================================
@Composable
fun QuizScreen(
    modifier: Modifier = Modifier,
    viewModel: QuizViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    QuizContent(
        uiState = uiState,
        onOpcionClick = viewModel::seleccionarOpcion,
        onSiguienteClick = viewModel::siguientePregunta,
        onReiniciarClick = viewModel::iniciarPartida,
        modifier = modifier
    )
}

// ==========================================
// COMPONIBLE STATELESS: Puro y Testeable
// ==========================================
@Composable
fun QuizContent(
    uiState: QuizUiState,
    onOpcionClick: (String) -> Unit,
    onSiguienteClick: () -> Unit,
    onReiniciarClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Cabecera de Progreso
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Codelab 3: ViewModel y StateFlow",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Pregunta ${uiState.indicePregunta + 1} de ${uiState.totalPreguntas}")
                    Text("Puntos: ${uiState.puntuacion}", fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(8.dp))

                LinearProgressIndicator(
                    progress = { uiState.progreso },
                    modifier = Modifier.fillMaxWidth().height(8.dp)
                )
            }

            // Tarjeta con el enunciado
            ElevatedCard(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.elevatedCardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Text(
                    text = uiState.preguntaActual,
                    style = MaterialTheme.typography.headlineSmall,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(24.dp).fillMaxWidth()
                )
            }

            // Opciones de respuesta
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                uiState.opciones.forEach { opcion ->
                    val yaRespondido = uiState.opcionSeleccionada != null
                    val esEsta = uiState.opcionSeleccionada == opcion

                    val colorBoton = when {
                        esEsta && uiState.esRespuestaCorrecta == true -> ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary
                        )
                        esEsta && uiState.esRespuestaCorrecta == false -> ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.error
                        )
                        else -> ButtonDefaults.filledTonalButtonColors()
                    }

                    FilledTonalButton(
                        onClick = { onOpcionClick(opcion) },
                        enabled = !yaRespondido,
                        colors = colorBoton,
                        modifier = Modifier.fillMaxWidth().height(52.dp)
                    ) {
                        Text(text = opcion, style = MaterialTheme.typography.bodyLarge)
                    }
                }
            }

            // Botón de avance
            Button(
                onClick = onSiguienteClick,
                enabled = uiState.opcionSeleccionada != null,
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Text("Siguiente Pregunta")
            }
        }

        // Diálogo de fin de concurso
        if (uiState.partidaFinalizada) {
            AlertDialog(
                onDismissRequest = {},
                title = { Text("¡Concurso Completado! 🏆") },
                text = { Text("Has obtenido un total de ${uiState.puntuacion} puntos.") },
                confirmButton = {
                    Button(onClick = onReiniciarClick) {
                        Text("Jugar otra vez")
                    }
                }
            )
        }
    }
}

// ==========================================
// PREVIEWS EN INTELLIJ IDEA
// ==========================================

@Preview(name = "Quiz en Marcha", showBackground = true)
@Composable
private fun QuizPreviewEnMarcha() {
    PMDMLab03Theme {
        QuizContent(
            uiState = QuizUiState(
                preguntaActual = "¿Qué función preserva el estado en Compose?",
                opciones = listOf("remember", "saveState", "retainState", "keep"),
                indicePregunta = 0,
                totalPreguntas = 3,
                puntuacion = 10,
                esRespuestaCorrecta = null,
                opcionSeleccionada = null
            ),
            onOpcionClick = {},
            onSiguienteClick = {},
            onReiniciarClick = {}
        )
    }
}
