package com.dam.pmdmlab03.juegos.ahorcado.ui

import com.dam.pmdmlab03.juegos.ahorcado.domain.EstadoPartida
import com.dam.pmdmlab03.juegos.ahorcado.domain.EventoTurno

/**
 * Representa la fotografía completa y reactiva del estado visual de la pantalla del Ahorcado.
 * Diseñada para que la interfaz Compose solo deba renderizar este modelo inmutable.
 */
data class AhorcadoUiState(
    val palabraMascara: String = "",
    val palabraSecreta: String = "",
    val vidasRestantes: Int = 6,
    val vidasMaximas: Int = 6,
    val letrasProbadas: Set<Char> = emptySet(),
    val estadoPartida: EstadoPartida = EstadoPartida.JUGANDO,
    val ultimoEvento: EventoTurno? = null
) {
    /**
     * Progreso normalizado entre 0.0f y 1.0f para alimentar componentes como LinearProgressIndicator.
     */
    val ratioVidas: Float
        get() = if (vidasMaximas > 0) vidasRestantes.toFloat() / vidasMaximas.toFloat() else 0f

    /**
     * Determina si la partida ha llegado a un estado terminal (Victoria o Derrota).
     */
    val esFinDePartida: Boolean
        get() = estadoPartida == EstadoPartida.VICTORIA || estadoPartida == EstadoPartida.DERROTA
}
