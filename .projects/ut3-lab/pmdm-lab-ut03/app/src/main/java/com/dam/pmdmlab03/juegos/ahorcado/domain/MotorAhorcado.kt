package com.dam.pmdmlab03.juegos.ahorcado.domain

/**
 * Devuelve la palabra con las letras acertadas visibles y las no probadas
 * sustituidas por guiones bajos '_', separadas entre sí por un espacio.
 * Ejemplo: "KOTLIN" con probadas "OI" -> "_ O _ _ I _"
 */
fun String.enmascarar(probadas: String): String {
    return this.map { char ->
        if (char in probadas) char else '_'
    }.joinToString(" ")
}

/**
 * Comprueba si la totalidad de las letras de la palabra secreta han sido descubiertas.
 */
fun String.estaAdivinada(probadas: String): Boolean {
    return this.all { char -> char in probadas }
}

/**
 * Función pura de transición: evalúa el intento del jugador y retorna un nuevo
 * EstadoAhorcado inmutable mediante .copy(), registrando el evento y actualizando
 * las vidas y el estado de la partida.
 */
fun EstadoAhorcado.procesarIntento(letraInput: Char?): EstadoAhorcado {
    if (this.estado != EstadoPartida.JUGANDO) return this

    // 1. Cláusula de guarda ante nulos o caracteres vacíos
    val letra = letraInput?.uppercaseChar() ?: return this.copy(
        ultimoEvento = EventoTurno.ENTRADA_INVALIDA,
        ultimaLetraJugada = null
    )

    // 2. Comprobación de letra ya probada
    if (letra in this.letrasProbadas) {
        return this.copy(
            ultimoEvento = EventoTurno.LETRA_REPETIDA,
            ultimaLetraJugada = letra
        )
    }

    val nuevasProbadas = this.letrasProbadas + letra

    // 3. Evaluar acierto
    if (letra in this.palabraSecreta) {
        val victoria = this.palabraSecreta.estaAdivinada(nuevasProbadas)
        return this.copy(
            letrasProbadas = nuevasProbadas,
            estado = if (victoria) EstadoPartida.VICTORIA else EstadoPartida.JUGANDO,
            ultimoEvento = EventoTurno.ACIERTO,
            ultimaLetraJugada = letra
        )
    }

    // 4. Evaluar fallo
    val nuevasVidas = this.vidasRestantes - 1
    val derrota = nuevasVidas <= 0

    return this.copy(
        letrasProbadas = nuevasProbadas,
        vidasRestantes = nuevasVidas.coerceAtLeast(0),
        estado = if (derrota) EstadoPartida.DERROTA else EstadoPartida.JUGANDO,
        ultimoEvento = EventoTurno.FALLO,
        ultimaLetraJugada = letra
    )
}
