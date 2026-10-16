package com.dam.pmdmlab03.juegos.ahorcado.domain

/**
 * Estados posibles en los que puede encontrarse una partida del juego.
 */
enum class EstadoPartida {
    JUGANDO,
    VICTORIA,
    DERROTA
}

/**
 * Notificación semántica del resultado del último turno jugado.
 */
enum class EventoTurno {
    ACIERTO,
    FALLO,
    LETRA_REPETIDA,
    ENTRADA_INVALIDA
}

/**
 * Fotografía inmutable de la situación del juego en un instante dado.
 * Representa la Fuente Única de la Verdad del dominio.
 */
data class EstadoAhorcado(
    val palabraSecreta: String,
    val letrasProbadas: String = "",
    val vidasRestantes: Int = 6,
    val vidasMaximas: Int = 6,
    val estado: EstadoPartida = EstadoPartida.JUGANDO,
    val ultimoEvento: EventoTurno? = null,
    val ultimaLetraJugada: Char? = null
)
