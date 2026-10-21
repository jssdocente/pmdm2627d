package service

import model.WorkoutSession
import model.WorkoutType

/**
 * PARTE 1 (TDD - 5 PUNTOS): Servicio de Métricas Deportivas en FitTrack.
 *
 * El alumno debe implementar cada uno de los métodos utilizando exclusivamente
 * PIPELINES DECLARATIVOS (filter, map, sortedByDescending, groupBy, etc.).
 *
 * REGLA DE EVALUACIÓN:
 * El uso de bucles imperativos clásicos (for, while) con acumuladores mutables (var, mutableListOf + .add())
 * penaliza el 50% de la puntuación del ejercicio, aun cuando los tests pasen en verde.
 */
class WorkoutMetricsService {

    /**
     * PIPELINE 1 (1.0 pto):
     * Filtra las sesiones del tipo indicado que hayan superado las calorías mínimas (caloriesBurned >= caloriasMinimas),
     * las ordena por duración en minutos de mayor a menor (descendente),
     * y retorna los títulos en mayúsculas.
     * Si no hay coincidencias, devuelve una lista vacía.
     */
    fun obtenerSesionesIntensas(
        sesiones: List<WorkoutSession>,
        tipo: WorkoutType,
        caloriasMinimas: Int = 300
    ): List<String> {
        TODO("Implementar mediante pipeline: filter -> sortedByDescending -> map")
    }

    /**
     * PIPELINE 2 (1.0 pto):
     * Calcula la suma total de kilómetros recorridos en las sesiones del deporte indicado.
     * Debe descartar de forma segura aquellas sesiones donde distanceKm sea null (ej. disciplinas de fuerza o HIIT).
     * Si no hay sesiones del tipo indicado o ninguna tiene distancia registrada, devuelve 0.0.
     */
    fun calcularDistanciaTotalPorTipo(sesiones: List<WorkoutSession>, tipo: WorkoutType): Double {
        TODO("Implementar mediante pipeline: filter -> mapNotNull -> sum / comprobación de vacío")
    }

    /**
     * PIPELINE 3 (1.0 pto):
     * Agrupa las sesiones por tipo de entrenamiento y calcula el total de calorías quemadas en cada disciplina.
     * Devuelve un Map<WorkoutType, Int> donde el valor es la suma acumulada de calorías de ese grupo.
     * Los deportes sin sesiones registradas no deben figurar como claves en el mapa.
     */
    fun contarCaloriasTotalesPorTipo(sesiones: List<WorkoutSession>): Map<WorkoutType, Int> {
        TODO("Implementar mediante pipeline: groupBy -> mapValues con sumOf")
    }

    /**
     * PIPELINE 4 (1.0 pto):
     * Valida que topN sea estrictamente mayor que 0 (lanzando IllegalArgumentException con require si topN <= 0).
     * Devuelve las topN sesiones con mayor duración en minutos (orden descendente).
     * Si la lista contiene menos sesiones que topN, devuelve todas las disponibles ordenadas.
     */
    fun podioSesionesMasLargas(sesiones: List<WorkoutSession>, topN: Int): List<WorkoutSession> {
        TODO("Validar con require y resolver con pipeline: sortedByDescending -> take")
    }

    /**
     * PIPELINE 5 (1.0 pto):
     * Localiza la primera sesión cuyo identificador coincida con idBuscado (ignorando mayúsculas y minúsculas).
     * Si idBuscado es null, está en blanco o no existe ninguna coincidencia, devuelve null de forma segura.
     */
    fun buscarSesionPorId(sesiones: List<WorkoutSession>, idBuscado: String?): WorkoutSession? {
        TODO("Validar nulabilidad y buscar con función declarativa find")
    }
}
