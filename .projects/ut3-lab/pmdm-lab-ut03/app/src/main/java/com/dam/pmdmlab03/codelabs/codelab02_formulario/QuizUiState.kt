package com.dam.pmdmlab03.codelabs.codelab02_formulario

/**
 * Fotografía inmutable de la pantalla del concurso.
 * Representa la Única Fuente de la Verdad (Single Source of Truth).
 */
data class QuizUiState(
    val preguntaActual: String = "",
    val opciones: List<String> = emptyList(),
    val indicePregunta: Int = 0,
    val totalPreguntas: Int = 0,
    val puntuacion: Int = 0,
    val esRespuestaCorrecta: Boolean? = null,
    val opcionSeleccionada: String? = null,
    val partidaFinalizada: Boolean = false
) {
    val progreso: Float
        get() = if (totalPreguntas > 0) (indicePregunta + 1).toFloat() / totalPreguntas.toFloat() else 0f
}
