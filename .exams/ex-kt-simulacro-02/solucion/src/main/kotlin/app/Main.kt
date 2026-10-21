package app

import model.TrackerResult
import model.WorkoutSession
import model.WorkoutType
import service.WorkoutMetricsService

/**
 * PARTE 2 (FUNCIONALIDAD CLI - 5 PUNTOS): Panel de Control de FitTrack (SOLUCIÓN).
 */
fun main() {
    val service = WorkoutMetricsService()

    val historialSesiones = listOf(
        WorkoutSession("W01", "Carrera Matutina", WorkoutType.RUNNING, durationMinutes = 45, caloriesBurned = 450, distanceKm = 8.5, avgHeartRate = 155),
        WorkoutSession("W02", "Paseo al Parque", WorkoutType.WALKING, durationMinutes = 30, caloriesBurned = 120, distanceKm = 2.8, avgHeartRate = 95),
        WorkoutSession("W03", "Ruta de Montana", WorkoutType.CYCLING, durationMinutes = 90, caloriesBurned = 780, distanceKm = 32.0, avgHeartRate = 142),
        WorkoutSession("W04", "HIIT Explosivo", WorkoutType.HIIT, durationMinutes = 25, caloriesBurned = 320, distanceKm = null, avgHeartRate = 168),
        WorkoutSession("W05", "Series 5K", WorkoutType.RUNNING, durationMinutes = 25, caloriesBurned = 280, distanceKm = 5.0, avgHeartRate = 162),
        WorkoutSession("W06", "Tirada Larga", WorkoutType.RUNNING, durationMinutes = 70, caloriesBurned = 650, distanceKm = 14.2, avgHeartRate = 148)
    )

    println("==========================================================================")
    println("                    🏃 FITTRACK FITNESS DASHBOARD                         ")
    println("==========================================================================")
    println()

    // 1. Mostrar tabla formateada
    println("--- HISTORIAL DE ENTRENAMIENTOS REGISTRADOS ---")
    println(generarDashboardEntrenamientos(historialSesiones))
    println()

    // 2. Métricas del Servicio (Parte 1)
    println("--- ANÁLISIS DE RENDIMIENTO (METRICS SERVICE) ---")
    val intensasRunning = service.obtenerSesionesIntensas(historialSesiones, WorkoutType.RUNNING, caloriasMinimas = 300)
    println("-> Running intenso (>= 300 kcal, orden desc): $intensasRunning")

    val kmTotalesRunning = service.calcularDistanciaTotalPorTipo(historialSesiones, WorkoutType.RUNNING)
    println("-> Kilómetros totales en Running: %.2f km".format(kmTotalesRunning))

    val caloriasPorDeporte = service.contarCaloriasTotalesPorTipo(historialSesiones)
    println("-> Gasto calórico por disciplina: $caloriasPorDeporte")

    val podio = service.podioSesionesMasLargas(historialSesiones, topN = 3)
    println("-> PODIO sesiones más largas: ${podio.map { "${it.title} (${it.durationMinutes} min)" }}")
    println()

    // 3. Simulación de Ampliación de Sesión (Inmutabilidad con copy)
    println("--- AMPLIACIÓN DE SESIONES EN VIVO ---")
    val sesionActiva = historialSesiones.first { it.id == "W04" } // HIIT (25 min, 320 kcal)

    // Caso A: Ampliación válida
    println("[Acción 1] Añadiendo 10 min y 130 kcal a la sesión HIIT...")
    val resultadoValido = ampliarSesion(sesionActiva, minutosExtra = 10, caloriasExtra = 130)
    imprimirResultadoOperacion(resultadoValido)

    // Caso B: Intento con parámetros inválidos
    println("[Acción 2] Intentando añadir 0 minutos y -50 kcal (inválido)...")
    val resultadoInvalido = ampliarSesion(sesionActiva, minutosExtra = 0, caloriasExtra = -50)
    imprimirResultadoOperacion(resultadoInvalido)
}

/**
 * EJERCICIO 2.1 (2.0 ptos): Generador de tabla tabular mediante pipelines funcionales.
 */
fun generarDashboardEntrenamientos(sesiones: List<WorkoutSession>): String {
    val cabecera = "%-5s | %-20s | %-12s | %9s | %11s | %10s | %8s".format(
        "ID", "TÍTULO", "DISCIPLINA", "TIEMPO", "CALORÍAS", "DISTANCIA", "PULSO"
    )
    val separador = "-".repeat(88)

    val filas = sesiones.joinToString("\n") { s ->
        val distanciaTexto = s.distanceKm?.let { "%.2f km".format(it) } ?: "N/A"
        val pulsoTexto = s.avgHeartRate?.let { "$it bpm" } ?: "N/A"

        "%-5s | %-20s | %-12s | %5d min | %6d kcal | %10s | %8s".format(
            s.id,
            s.title,
            s.type.name,
            s.durationMinutes,
            s.caloriesBurned,
            distanciaTexto,
            pulsoTexto
        )
    }

    return "$cabecera\n$separador\n$filas"
}

/**
 * EJERCICIO 2.2 (2.0 ptos): Ampliación de sesión inmutable.
 */
fun ampliarSesion(sesion: WorkoutSession, minutosExtra: Int, caloriasExtra: Int): TrackerResult {
    if (minutosExtra <= 0 || caloriasExtra <= 0) {
        return TrackerResult.Error("Los minutos y calorías adicionales deben ser estrictamente positivos")
    }

    val sesionActualizada = sesion.copy(
        durationMinutes = sesion.durationMinutes + minutosExtra,
        caloriesBurned = sesion.caloriesBurned + caloriasExtra
    )

    return TrackerResult.Success(
        message = "¡Sesión ampliada con éxito! Total acumulado: ${sesionActualizada.durationMinutes} min / ${sesionActualizada.caloriesBurned} kcal",
        updatedSession = sesionActualizada
    )
}

/**
 * EJERCICIO 2.3 (1.0 pto): Impresión exhaustiva con 'when'.
 */
fun imprimirResultadoOperacion(resultado: TrackerResult) {
    when (resultado) {
        is TrackerResult.Success -> println("✅ ${resultado.message}")
        is TrackerResult.Error -> println("❌ ERROR: ${resultado.reason}")
    }
}
