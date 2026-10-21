package app

import model.TrackerResult
import model.WorkoutSession
import model.WorkoutType
import service.WorkoutMetricsService

/**
 * PARTE 2 (FUNCIONALIDAD CLI - 5 PUNTOS): Panel de Control de FitTrack.
 *
 * El alumno debe completar las funciones declaradas a continuación para orquestar
 * la aplicación de consola respetando el paradigma declarativo, inmutabilidad (copy)
 * y tipos sellados (sealed interface).
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
 *
 * Debe formatear el historial de sesiones en una tabla de texto alineada.
 * REGLA: Utilizar joinToString("\n") para generar las filas a partir de la lista.
 * NO utilizar bucles for o print/println repetidos dentro de la función.
 *
 * Formato por fila:
 * "%-5s | %-20s | %-12s | %5d min | %6d kcal | %9s | %8s"
 * Columnas: ID, TÍTULO, DISCIPLINA, TIEMPO, CALORÍAS, DISTANCIA (si es null "N/A", si no "%.2f km"), PULSO (si es null "N/A", si no "%d bpm").
 */
fun generarDashboardEntrenamientos(sesiones: List<WorkoutSession>): String {
    TODO("Implementar mediante cabecera + joinToString sin bucles for")
}

/**
 * EJERCICIO 2.2 (2.0 ptos): Ampliación de sesión inmutable.
 *
 * Valida que minutosExtra > 0 Y caloriasExtra > 0.
 * Si alguno es <= 0, retorna TrackerResult.Error("Los minutos y calorías adicionales deben ser estrictamente positivos").
 *
 * Si es válido, genera una NUEVA INSTANCIA usando sesion.copy(...) con los valores incrementados.
 * Retorna TrackerResult.Success con el mensaje:
 * "¡Sesión ampliada con éxito! Total acumulado: <MINUTOS> min / <CALORIAS> kcal"
 * y la sesión actualizada.
 */
fun ampliarSesion(sesion: WorkoutSession, minutosExtra: Int, caloriasExtra: Int): TrackerResult {
    TODO("Validar y crear copia inmutable con sesion.copy() devolviendo TrackerResult")
}

/**
 * EJERCICIO 2.3 (1.0 pto): Impresión exhaustiva con 'when'.
 *
 * Evalúa el tipo de TrackerResult mediante when exhaustivo:
 * - Si es Success: imprime "✅ <message>"
 * - Si es Error: imprime "❌ ERROR: <reason>"
 */
fun imprimirResultadoOperacion(resultado: TrackerResult) {
    TODO("Implementar when exhaustivo sobre TrackerResult")
}
