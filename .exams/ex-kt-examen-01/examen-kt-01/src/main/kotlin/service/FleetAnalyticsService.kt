package service

import model.TipoVehiculo
import model.Vehiculo

/**
 * PARTE 1 (TDD - 5 PUNTOS): Servicio de Analítica de Flota en MobilityHub.
 *
 * El alumno debe implementar cada uno de los métodos utilizando exclusivamente
 * PIPELINES DECLARATIVOS (filter, map, sortedByDescending, groupBy, etc.).
 *
 * REGLA DE EVALUACIÓN:
 * El uso de bucles imperativos tradicionales (for, while) con acumuladores mutables
 * (var, mutableListOf + .add()) penaliza el 50% de la puntuación del ejercicio,
 * aun cuando los tests pasen en verde.
 */
class FleetAnalyticsService {

    /**
     * PIPELINE 1 (1.0 pto):
     * Filtra los vehículos del tipo solicitado que NO estén en mantenimiento (!enMantenimiento)
     * y tengan un nivel de batería mayor o igual a bateriaMinima (bateriaPct >= bateriaMinima).
     * Los ordena de mayor a menor porcentaje de batería (descendente),
     * y devuelve los nombres de sus modelos convertidos a mayúsculas.
     * Si no hay coincidencias, devuelve una lista vacía.
     */
    fun obtenerModelosDisponibles(
        flota: List<Vehiculo>,
        tipo: TipoVehiculo,
        bateriaMinima: Int = 20
    ): List<String> {
        TODO("Implementar mediante pipeline: filter -> sortedByDescending -> map")
    }

    /**
     * PIPELINE 2 (1.0 pto):
     * Calcula la tarifa media por minuto de los vehículos del tipo indicado.
     * Si no hay vehículos de ese tipo en la lista (o la lista está vacía), devuelve 0.0 de forma segura.
     */
    fun calcularTarifaMediaPorTipo(flota: List<Vehiculo>, tipo: TipoVehiculo): Double {
        TODO("Implementar mediante pipeline: filter -> map -> average / comprobación de vacío")
    }

    /**
     * PIPELINE 3 (1.0 pto):
     * Agrupa únicamente los vehículos que NO estén en mantenimiento por su tipo
     * y cuenta cuántos vehículos operativos existen de cada categoría.
     * Devuelve un Map<TipoVehiculo, Int> con el recuento.
     * Los tipos de vehículo sin unidades operativas no deben figurar como claves en el mapa.
     */
    fun contarVehiculosOperativosPorTipo(flota: List<Vehiculo>): Map<TipoVehiculo, Int> {
        TODO("Implementar mediante pipeline: filter -> groupBy -> mapValues")
    }

    /**
     * PIPELINE 4 (1.0 pto):
     * Valida que limite sea estrictamente mayor que 0 (lanzando IllegalArgumentException con require si limite <= 0).
     * Devuelve los primeros 'limite' vehículos con mayor número de viajes acumulados (totalViajes descendente).
     * Si la lista contiene menos vehículos que el límite solicitado, devuelve todos los disponibles ordenados.
     */
    fun topVehiculosMayorUso(flota: List<Vehiculo>, limite: Int): List<Vehiculo> {
        TODO("Validar con require y resolver con pipeline: sortedByDescending -> take")
    }

    /**
     * PIPELINE 5 (1.0 pto):
     * Localiza el primer vehículo cuya ubicacionActual contenga el fragmento indicado
     * (ignorando mayúsculas y minúsculas).
     * Si fragmentoUbicacion es null, está en blanco o no existe ninguna coincidencia, devuelve null de forma segura.
     */
    fun buscarVehiculoPorUbicacion(flota: List<Vehiculo>, fragmentoUbicacion: String?): Vehiculo? {
        TODO("Validar nulabilidad y buscar con función declarativa find")
    }
}
