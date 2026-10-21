package service

import model.WorkoutSession
import model.WorkoutType

/**
 * PARTE 1 (TDD - 5 PUNTOS): Servicio de Métricas Deportivas en FitTrack (SOLUCIÓN).
 *
 * Implementaciones resueltas mediante PIPELINES DECLARATIVOS idiomáticos de Kotlin.
 */
class WorkoutMetricsService {

    /**
     * PIPELINE 1 (1.0 pto):
     * filter -> sortedByDescending -> map
     */
    fun obtenerSesionesIntensas(
        sesiones: List<WorkoutSession>,
        tipo: WorkoutType,
        caloriasMinimas: Int = 300
    ): List<String> =
        sesiones
            .filter { it.type == tipo && it.caloriesBurned >= caloriasMinimas }
            .sortedByDescending { it.durationMinutes }
            .map { it.title.uppercase() }

    /**
     * PIPELINE 2 (1.0 pto):
     * filter -> mapNotNull -> sum
     */
    fun calcularDistanciaTotalPorTipo(sesiones: List<WorkoutSession>, tipo: WorkoutType): Double =
        sesiones
            .filter { it.type == tipo }
            .mapNotNull { it.distanceKm }
            .sum()

    /**
     * PIPELINE 3 (1.0 pto):
     * groupBy -> mapValues con sumOf
     */
    fun contarCaloriasTotalesPorTipo(sesiones: List<WorkoutSession>): Map<WorkoutType, Int> =
        sesiones
            .groupBy { it.type }
            .mapValues { (_, sesionesGrupo) -> sesionesGrupo.sumOf { it.caloriesBurned } }

    /**
     * PIPELINE 4 (1.0 pto):
     * require -> sortedByDescending -> take
     */
    fun podioSesionesMasLargas(sesiones: List<WorkoutSession>, topN: Int): List<WorkoutSession> {
        require(topN > 0) { "El topN debe ser estrictamente mayor a cero (recibido: $topN)" }
        return sesiones
            .sortedByDescending { it.durationMinutes }
            .take(topN)
    }

    /**
     * PIPELINE 5 (1.0 pto):
     * isNullOrBlank -> find con equals ignoreCase
     */
    fun buscarSesionPorId(sesiones: List<WorkoutSession>, idBuscado: String?): WorkoutSession? {
        if (idBuscado.isNullOrBlank()) return null
        return sesiones.find { it.id.equals(idBuscado.trim(), ignoreCase = true) }
    }
}
