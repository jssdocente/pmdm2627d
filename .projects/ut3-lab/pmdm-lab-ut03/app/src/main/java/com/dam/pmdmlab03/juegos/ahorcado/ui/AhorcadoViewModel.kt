package com.dam.pmdmlab03.juegos.ahorcado.ui

import androidx.lifecycle.ViewModel
import com.dam.pmdmlab03.juegos.ahorcado.domain.EstadoAhorcado
import com.dam.pmdmlab03.juegos.ahorcado.domain.enmascarar
import com.dam.pmdmlab03.juegos.ahorcado.domain.procesarIntento
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * ViewModel que gestiona la máquina de estados del juego del Ahorcado.
 * Aplica la arquitectura de UI oficial de Android mediante StateFlow.
 */
class AhorcadoViewModel : ViewModel() {

    // Banco temático de palabras del ecosistema Android y Compose (Opción 1: integrado en ViewModel)
    private val bancoPalabras = listOf(
        "KOTLIN",
        "COMPOSE",
        "ANDROID",
        "SCAFFOLD",
        "VIEWMODEL",
        "SNACKBAR",
        "MATERIAL",
        "SURFACE",
        "DRAWER",
        "CORRUTINA"
    )

    private var estadoDominio = EstadoAhorcado(palabraSecreta = obtenerPalabraAleatoria())

    private val _uiState = MutableStateFlow(crearUiStateDesdeDominio(estadoDominio))
    val uiState: StateFlow<AhorcadoUiState> = _uiState.asStateFlow()

    private fun obtenerPalabraAleatoria(): String = bancoPalabras.random()

    /**
     * Procesa la pulsación de una letra del teclado virtual delegando
     * en la función pura del motor de dominio.
     */
    fun intentarLetra(letra: Char) {
        estadoDominio = estadoDominio.procesarIntento(letra)
        _uiState.update { crearUiStateDesdeDominio(estadoDominio) }
    }

    /**
     * Reinicia la partida seleccionando una nueva palabra secreta y
     * restableciendo todas las vidas y letras probadas.
     */
    fun reiniciarPartida() {
        val nuevaPalabra = obtenerPalabraAleatoria()
        estadoDominio = EstadoAhorcado(palabraSecreta = nuevaPalabra)
        _uiState.update { crearUiStateDesdeDominio(estadoDominio) }
    }

    private fun crearUiStateDesdeDominio(dominio: EstadoAhorcado): AhorcadoUiState {
        return AhorcadoUiState(
            palabraMascara = dominio.palabraSecreta.enmascarar(dominio.letrasProbadas),
            palabraSecreta = dominio.palabraSecreta,
            vidasRestantes = dominio.vidasRestantes,
            vidasMaximas = dominio.vidasMaximas,
            letrasProbadas = dominio.letrasProbadas.toSet(),
            estadoPartida = dominio.estado,
            ultimoEvento = dominio.ultimoEvento
        )
    }
}
