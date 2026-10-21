package model

/**
 * Roles disponibles para los alumnos de la academia de héroes.
 */
enum class RolHeroe {
    GUERRERO,
    MAGO,
    EXPLORADOR,
    SANADOR
}

/**
 * Modelo de datos de un Héroe.
 *
 * @property id Identificador único alfanumérico (ej: "H01").
 * @property nombre Nombre identificativo del héroe.
 * @property rol Rol o especialidad marcial/mágica.
 * @property nivel Nivel actual alcanzado (>= 1).
 * @property poder Puntos brutos de poder o combate.
 * @property mentor Nombre del maestro asignado, o null si entrena de forma autónoma.
 */
data class Heroe(
    val id: String,
    val nombre: String,
    val rol: RolHeroe,
    val nivel: Int,
    val poder: Int,
    val mentor: String? = null
)

/**
 * Resultado sellado para operaciones de dominio o interfaz de usuario.
 * Garantiza exhaustividad en sentencias 'when'.
 */
sealed interface AccionResultado {
    data class Exito(val mensaje: String, val heroeActualizado: Heroe) : AccionResultado
    data class Error(val motivo: String) : AccionResultado
}
