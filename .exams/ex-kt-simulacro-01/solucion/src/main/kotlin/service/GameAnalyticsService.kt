package service

import model.Game
import model.Genre
import model.Platform

/**
 * PARTE 1 (TDD - 5 PUNTOS): Servicio de Analítica de Biblioteca en GameVault (SOLUCIÓN).
 *
 * Implementaciones resueltas mediante PIPELINES DECLARATIVOS idiomáticos de Kotlin.
 */
class GameAnalyticsService {

    /**
     * PIPELINE 1 (1.0 pto):
     * filter -> sortedByDescending -> map
     */
    fun obtenerTitulosJuegosCompletados(juegos: List<Game>, plataforma: Platform): List<String> =
        juegos
            .filter { it.platform == plataforma && it.isCompleted }
            .sortedByDescending { it.hoursPlayed }
            .map { it.title.uppercase() }

    /**
     * PIPELINE 2 (1.0 pto):
     * filter -> mapNotNull -> average
     */
    fun calcularPuntuacionMediaPorGenero(juegos: List<Game>, genero: Genre): Double {
        val puntuaciones = juegos
            .filter { it.genre == genero }
            .mapNotNull { it.userScore }

        return if (puntuaciones.isEmpty()) 0.0 else puntuaciones.average()
    }

    /**
     * PIPELINE 3 (1.0 pto):
     * groupBy -> mapValues
     */
    fun contarJuegosPorPlataforma(juegos: List<Game>): Map<Platform, Int> =
        juegos
            .groupBy { it.platform }
            .mapValues { (_, juegosEnPlataforma) -> juegosEnPlataforma.size }

    /**
     * PIPELINE 4 (1.0 pto):
     * require -> sortedByDescending -> take
     */
    fun topJuegosMasJugados(juegos: List<Game>, limite: Int): List<Game> {
        require(limite > 0) { "El límite debe ser estrictamente mayor que cero (recibido: $limite)" }
        return juegos
            .sortedByDescending { it.hoursPlayed }
            .take(limite)
    }

    /**
     * PIPELINE 5 (1.0 pto):
     * isNullOrBlank -> find con contains ignoreCase
     */
    fun buscarJuegoPorTitulo(juegos: List<Game>, fragmentoTitulo: String?): Game? {
        if (fragmentoTitulo.isNullOrBlank()) return null
        return juegos.find { it.title.contains(fragmentoTitulo.trim(), ignoreCase = true) }
    }
}
