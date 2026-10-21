package service

import model.TipoVehiculo
import model.Vehiculo

/**
 * PARTE 1 (TDD - 5 PUNTOS): Servicio de Analítica de Flota en MobilityHub (SOLUCIÓN).
 *
 * Implementaciones resueltas mediante PIPELINES DECLARATIVOS idiomáticos de Kotlin.
 */
class FleetAnalyticsService {

    /**
     * PIPELINE 1 (1.0 pto):
     * filter -> sortedByDescending -> map
     */
    fun obtenerModelosDisponibles(
        flota: List<Vehiculo>,
        tipo: TipoVehiculo,
        bateriaMinima: Int = 20
    ): List<String> =
        flota
            .filter { it.tipo == tipo && !it.enMantenimiento && it.bateriaPct >= bateriaMinima }
            .sortedByDescending { it.bateriaPct }
            .map { it.modelo.uppercase() }

    /**
     * PIPELINE 2 (1.0 pto):
     * filter -> map -> average
     */
    fun calcularTarifaMediaPorTipo(flota: List<Vehiculo>, tipo: TipoVehiculo): Double {
        val tarifas = flota
            .filter { it.tipo == tipo }
            .map { it.tarifaMinuto }

        return if (tarifas.isEmpty()) 0.0 else tarifas.average()
    }

    /**
     * PIPELINE 3 (1.0 pto):
     * filter -> groupBy -> mapValues
     */
    fun contarVehiculosOperativosPorTipo(flota: List<Vehiculo>): Map<TipoVehiculo, Int> =
        flota
            .filter { !it.enMantenimiento }
            .groupBy { it.tipo }
            .mapValues { (_, vehiculosGrupo) -> vehiculosGrupo.size }

    /**
     * PIPELINE 4 (1.0 pto):
     * require -> sortedByDescending -> take
     */
    fun topVehiculosMayorUso(flota: List<Vehiculo>, limite: Int): List<Vehiculo> {
        require(limite > 0) { "El límite debe ser estrictamente mayor que cero (recibido: $limite)" }
        return flota
            .sortedByDescending { it.totalViajes }
            .take(limite)
    }

    /**
     * PIPELINE 5 (1.0 pto):
     * isNullOrBlank -> find con contains ignoreCase
     */
    fun buscarVehiculoPorUbicacion(flota: List<Vehiculo>, fragmentoUbicacion: String?): Vehiculo? {
        if (fragmentoUbicacion.isNullOrBlank()) return null
        return flota.find {
            it.ubicacionActual?.contains(fragmentoUbicacion.trim(), ignoreCase = true) == true
        }
    }
}
