package com.dam.pmdmlab03.juegos.ahorcado

import com.dam.pmdmlab03.juegos.ahorcado.domain.EstadoAhorcado
import com.dam.pmdmlab03.juegos.ahorcado.domain.EstadoPartida
import com.dam.pmdmlab03.juegos.ahorcado.domain.EventoTurno
import com.dam.pmdmlab03.juegos.ahorcado.domain.enmascarar
import com.dam.pmdmlab03.juegos.ahorcado.domain.estaAdivinada
import com.dam.pmdmlab03.juegos.ahorcado.domain.procesarIntento
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class MotorAhorcadoTest {

    @Test
    fun enmascararPalabra_ocultaLetrasNoProbadas() {
        val mascara = "KOTLIN".enmascarar("OI")
        assertEquals("_ O _ _ I _", mascara)
    }

    @Test
    fun estaAdivinada_detectaVictoriaCorrectamente() {
        assertFalse("KOTLIN".estaAdivinada("KTL"))
        assertTrue("KOTLIN".estaAdivinada("KOTLIN"))
    }

    @Test
    fun procesarIntento_letraAcertada_actualizaEstadoSinRestarVidas() {
        val inicial = EstadoAhorcado(palabraSecreta = "KOTLIN", vidasRestantes = 6)
        val resultado = inicial.procesarIntento('O')

        assertEquals(6, resultado.vidasRestantes)
        assertEquals("O", resultado.letrasProbadas)
        assertEquals(EventoTurno.ACIERTO, resultado.ultimoEvento)
        assertEquals(EstadoPartida.JUGANDO, resultado.estado)
    }

    @Test
    fun procesarIntento_letraFallada_decrementaVidas() {
        val inicial = EstadoAhorcado(palabraSecreta = "KOTLIN", vidasRestantes = 6)
        val resultado = inicial.procesarIntento('Z')

        assertEquals(5, resultado.vidasRestantes)
        assertEquals("Z", resultado.letrasProbadas)
        assertEquals(EventoTurno.FALLO, resultado.ultimoEvento)
        assertEquals(EstadoPartida.JUGANDO, resultado.estado)
    }

    @Test
    fun procesarIntento_sinVidas_pasaADerrota() {
        val inicial = EstadoAhorcado(palabraSecreta = "KOTLIN", vidasRestantes = 1)
        val resultado = inicial.procesarIntento('X')

        assertEquals(0, resultado.vidasRestantes)
        assertEquals(EstadoPartida.DERROTA, resultado.estado)
    }
}
