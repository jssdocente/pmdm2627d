package com.dam.pmdmlab03.codelabs.codelab02_formulario

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class Pregunta(
    val enunciado: String,
    val opciones: List<String>,
    val respuestaCorrecta: String
)

class QuizViewModel : ViewModel() {

    private val bancoPreguntas = listOf(
        Pregunta(
            enunciado = "¿Qué función preserva el estado ante recomposiciones en Compose?",
            opciones = listOf("remember", "saveState", "retainState", "keep"),
            respuestaCorrecta = "remember"
        ),
        Pregunta(
            enunciado = "¿Qué componente se utiliza para listas largas y eficientes?",
            opciones = listOf("ScrollView", "LazyColumn", "RecyclerView", "ColumnList"),
            respuestaCorrecta = "LazyColumn"
        ),
        Pregunta(
            enunciado = "¿Dónde sobrevive el estado ante la rotación de pantalla?",
            opciones = listOf("remember", "MutableList", "ViewModel", "Composable"),
            respuestaCorrecta = "ViewModel"
        )
    )

    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    init {
        iniciarPartida()
    }

    fun iniciarPartida() {
        val primera = bancoPreguntas.first()
        _uiState.value = QuizUiState(
            preguntaActual = primera.enunciado,
            opciones = primera.opciones,
            indicePregunta = 0,
            totalPreguntas = bancoPreguntas.size,
            puntuacion = 0,
            esRespuestaCorrecta = null,
            opcionSeleccionada = null,
            partidaFinalizada = false
        )
    }

    fun seleccionarOpcion(opcion: String) {
        val estadoActual = _uiState.value
        if (estadoActual.opcionSeleccionada != null || estadoActual.partidaFinalizada) return

        val pregunta = bancoPreguntas[estadoActual.indicePregunta]
        val acierto = opcion == pregunta.respuestaCorrecta

        _uiState.update { anterior ->
            anterior.copy(
                opcionSeleccionada = opcion,
                esRespuestaCorrecta = acierto,
                puntuacion = if (acierto) anterior.puntuacion + 10 else anterior.puntuacion
            )
        }
    }

    fun siguientePregunta() {
        val siguienteIndice = _uiState.value.indicePregunta + 1

        if (siguienteIndice < bancoPreguntas.size) {
            val siguiente = bancoPreguntas[siguienteIndice]
            _uiState.update { anterior ->
                anterior.copy(
                    preguntaActual = siguiente.enunciado,
                    opciones = siguiente.opciones,
                    indicePregunta = siguienteIndice,
                    esRespuestaCorrecta = null,
                    opcionSeleccionada = null
                )
            }
        } else {
            _uiState.update { it.copy(partidaFinalizada = true) }
        }
    }
}
