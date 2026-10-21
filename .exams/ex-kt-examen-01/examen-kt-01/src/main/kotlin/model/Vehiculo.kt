package model

/**
 * Tipos de vehículos ecológicos disponibles en la flota de MobilityHub.
 */
enum class TipoVehiculo {
    PATINETE,
    BICICLETA,
    MOTO,
    COCHE
}

/**
 * Representa una unidad de vehículo urbano en la flota.
 *
 * @property id Identificador alfanumérico único (ej: "V01").
 * @property modelo Marca o modelo comercial del vehículo.
 * @property tipo Categoría o tipo de vehículo.
 * @property bateriaPct Nivel actual de batería expresado en porcentaje (0 a 100).
 * @property tarifaMinuto Precio base de alquiler en euros por minuto.
 * @property enMantenimiento Indica si la unidad está inmovilizada en taller para revisión.
 * @property ubicacionActual Barrio o zona GPS donde está estacionado, o null si está en tránsito.
 * @property totalViajes Cantidad acumulada de viajes completados por la unidad.
 */
data class Vehiculo(
    val id: String,
    val modelo: String,
    val tipo: TipoVehiculo,
    val bateriaPct: Int,
    val tarifaMinuto: Double,
    val enMantenimiento: Boolean = false,
    val ubicacionActual: String? = null,
    val totalViajes: Int = 0
)

/**
 * Resultado sellado para operaciones de alquiler y mantenimiento de flota.
 * Facilita control exhaustivo mediante sentencias 'when'.
 */
sealed interface OperacionFlotaResult {
    data class Exito(val mensaje: String, val vehiculoActualizado: Vehiculo) : OperacionFlotaResult
    data class Error(val motivo: String) : OperacionFlotaResult
}
