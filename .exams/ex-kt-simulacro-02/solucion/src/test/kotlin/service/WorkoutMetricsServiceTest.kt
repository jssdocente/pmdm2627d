package service

import model.WorkoutSession
import model.WorkoutType
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull
import kotlin.test.assertTrue

class WorkoutMetricsServiceTest {

    private val service = WorkoutMetricsService()

    private val sesionesMuestra = listOf(
        WorkoutSession("W01", "Carrera Matutina", WorkoutType.RUNNING, durationMinutes = 45, caloriesBurned = 450, distanceKm = 8.5, avgHeartRate = 155),
        WorkoutSession("W02", "Paseo al Parque", WorkoutType.WALKING, durationMinutes = 30, caloriesBurned = 120, distanceKm = 2.8, avgHeartRate = 95),
        WorkoutSession("W03", "Ruta de Montana", WorkoutType.CYCLING, durationMinutes = 90, caloriesBurned = 780, distanceKm = 32.0, avgHeartRate = 142),
        WorkoutSession("W04", "HIIT Explosivo", WorkoutType.HIIT, durationMinutes = 25, caloriesBurned = 320, distanceKm = null, avgHeartRate = 168),
        WorkoutSession("W05", "Series 5K", WorkoutType.RUNNING, durationMinutes = 25, caloriesBurned = 280, distanceKm = 5.0, avgHeartRate = 162),
        WorkoutSession("W06", "Tirada Larga", WorkoutType.RUNNING, durationMinutes = 70, caloriesBurned = 650, distanceKm = 14.2, avgHeartRate = 148),
        WorkoutSession("W07", "Circuito HIIT Tabata", WorkoutType.HIIT, durationMinutes = 20, caloriesBurned = 240, distanceKm = null, avgHeartRate = 170)
    )

    // ========================================================================
    // PIPELINE 1: obtenerSesionesIntensas (filter -> sortedByDescending -> map)
    // ========================================================================

    @Test
    fun `obtenerSesionesIntensas filtra por tipo, calorias minimas y ordena por duracion desc`() {
        val resultado = service.obtenerSesionesIntensas(sesionesMuestra, WorkoutType.RUNNING, caloriasMinimas = 300)

        val esperado = listOf("TIRADA LARGA", "CARRERA MATUTINA")
        assertEquals(esperado, resultado, "Debe devolver los títulos en mayúsculas ordenados por duración descendente")
    }

    @Test
    fun `obtenerSesionesIntensas devuelve lista vacia si no hay coincidencias`() {
        val resultado = service.obtenerSesionesIntensas(sesionesMuestra, WorkoutType.SWIMMING, caloriasMinimas = 100)
        assertTrue(resultado.isEmpty(), "Para un tipo sin sesiones debe devolver lista vacía")
    }

    // ========================================================================
    // PIPELINE 2: calcularDistanciaTotalPorTipo (filter -> mapNotNull -> sum)
    // ========================================================================

    @Test
    fun `calcularDistanciaTotalPorTipo suma distancias no nulas del deporte seleccionado`() {
        val distanciaRunning = service.calcularDistanciaTotalPorTipo(sesionesMuestra, WorkoutType.RUNNING)
        assertEquals(27.7, distanciaRunning, 0.001, "La suma de 8.5, 5.0 y 14.2 debe ser 27.7")

        val distanciaBici = service.calcularDistanciaTotalPorTipo(sesionesMuestra, WorkoutType.CYCLING)
        assertEquals(32.0, distanciaBici, 0.001)
    }

    @Test
    fun `calcularDistanciaTotalPorTipo devuelve 0_0 ante disciplinas sin distancia o lista vacia`() {
        val distanciaHiit = service.calcularDistanciaTotalPorTipo(sesionesMuestra, WorkoutType.HIIT)
        assertEquals(0.0, distanciaHiit, "HIIT sin distancias debe retornar 0.0")

        val distanciaVacia = service.calcularDistanciaTotalPorTipo(emptyList(), WorkoutType.RUNNING)
        assertEquals(0.0, distanciaVacia, "Lista vacía debe retornar 0.0")
    }

    // ========================================================================
    // PIPELINE 3: contarCaloriasTotalesPorTipo (groupBy -> mapValues con sumOf)
    // ========================================================================

    @Test
    fun `contarCaloriasTotalesPorTipo acumula las calorias de cada tipo de ejercicio`() {
        val caloriasMapa = service.contarCaloriasTotalesPorTipo(sesionesMuestra)

        assertEquals(1380, caloriasMapa[WorkoutType.RUNNING], "RUNNING debe sumar 1380 kcal")
        assertEquals(560, caloriasMapa[WorkoutType.HIIT], "HIIT debe sumar 560 kcal")
        assertEquals(780, caloriasMapa[WorkoutType.CYCLING], "CYCLING debe sumar 780 kcal")
        assertEquals(120, caloriasMapa[WorkoutType.WALKING], "WALKING debe sumar 120 kcal")
        assertNull(caloriasMapa[WorkoutType.SWIMMING], "SWIMMING no debe figurar en el mapa")
    }

    // ========================================================================
    // PIPELINE 4: podioSesionesMasLargas (require -> sortedByDescending -> take)
    // ========================================================================

    @Test
    fun `podioSesionesMasLargas devuelve las N sesiones de mayor duracion ordenadas desc`() {
        val top3 = service.podioSesionesMasLargas(sesionesMuestra, topN = 3)

        assertEquals(3, top3.size, "Debe retornar 3 sesiones")
        assertEquals("W03", top3[0].id, "1º: Ruta de Montana (90 min)")
        assertEquals("W06", top3[1].id, "2º: Tirada Larga (70 min)")
        assertEquals("W01", top3[2].id, "3º: Carrera Matutina (45 min)")
    }

    @Test
    fun `podioSesionesMasLargas devuelve todas las sesiones si topN supera el tamano`() {
        val listaBreve = listOf(sesionesMuestra[0], sesionesMuestra[1])
        val resultado = service.podioSesionesMasLargas(listaBreve, topN = 10)
        assertEquals(2, resultado.size, "Debe devolver los 2 disponibles ordenados")
    }

    @Test
    fun `podioSesionesMasLargas lanza IllegalArgumentException si topN es menor o igual a cero`() {
        assertFailsWith<IllegalArgumentException>("topN = 0 debe lanzar excepción") {
            service.podioSesionesMasLargas(sesionesMuestra, topN = 0)
        }
        assertFailsWith<IllegalArgumentException>("topN negativo debe lanzar excepción") {
            service.podioSesionesMasLargas(sesionesMuestra, topN = -2)
        }
    }

    // ========================================================================
    // PIPELINE 5: buscarSesionPorId (find con ignoreCase)
    // ========================================================================

    @Test
    fun `buscarSesionPorId encuentra la sesion correcta ignorando mayusculas`() {
        val sesion = service.buscarSesionPorId(sesionesMuestra, "w04")
        assertEquals("HIIT Explosivo", sesion?.title, "Debe encontrar 'HIIT Explosivo' con id 'w04'")
    }

    @Test
    fun `buscarSesionPorId devuelve null de forma segura ante valores invalidos o nulos`() {
        assertNull(service.buscarSesionPorId(sesionesMuestra, "W99"), "ID inexistente debe dar null")
        assertNull(service.buscarSesionPorId(sesionesMuestra, null), "ID null debe dar null")
        assertNull(service.buscarSesionPorId(sesionesMuestra, "   "), "ID en blanco debe dar null")
    }
}
