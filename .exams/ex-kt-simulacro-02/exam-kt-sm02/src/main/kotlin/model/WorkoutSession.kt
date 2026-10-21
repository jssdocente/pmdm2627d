package model

/**
 * Tipos de actividades deportivas registradas en FitTrack.
 */
enum class WorkoutType {
    RUNNING,
    CYCLING,
    SWIMMING,
    WALKING,
    HIIT
}

/**
 * Nivel de intensidad percibida del entrenamiento.
 */
enum class Intensity {
    LOW,
    MEDIUM,
    HIGH
}

/**
 * Representa una sesión de entrenamiento deportivo individual.
 *
 * @property id Identificador único alfanumérico (ej: "W01").
 * @property title Nombre descriptivo de la actividad.
 * @property type Disciplina deportiva practicada.
 * @property durationMinutes Duración total en minutos.
 * @property caloriesBurned Calorías estimadas quemadas durante la actividad.
 * @property distanceKm Distancia recorrida en kilómetros, o null si la disciplina no mide distancia (ej. HIIT).
 * @property avgHeartRate Frecuencia cardíaca media en pulsaciones por minuto (bpm), o null si no se monitorizó.
 * @property isCompleted Indica si la sesión fue finalizada por el usuario.
 */
data class WorkoutSession(
    val id: String,
    val title: String,
    val type: WorkoutType,
    val durationMinutes: Int,
    val caloriesBurned: Int,
    val distanceKm: Double? = null,
    val avgHeartRate: Int? = null,
    val isCompleted: Boolean = true
)

/**
 * Resultado sellado para operaciones de registro y ampliación de sesiones.
 * Permite control de flujo exhaustivo en sentencias 'when'.
 */
sealed interface TrackerResult {
    data class Success(val message: String, val updatedSession: WorkoutSession) : TrackerResult
    data class Error(val reason: String) : TrackerResult
}
