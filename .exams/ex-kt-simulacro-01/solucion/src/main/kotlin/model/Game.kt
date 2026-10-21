package model

/**
 * Plataformas soportadas en GameVault.
 */
enum class Platform {
    PC,
    PLAYSTATION,
    XBOX,
    NINTENDO_SWITCH
}

/**
 * Géneros de videojuegos catalogados.
 */
enum class Genre {
    ACTION,
    RPG,
    ADVENTURE,
    STRATEGY,
    INDIE
}

/**
 * Representa un videojuego dentro de la biblioteca de GameVault.
 *
 * @property id Identificador único alfanumérico (ej: "G01").
 * @property title Título oficial del videojuego.
 * @property platform Plataforma en la que se posee la copia.
 * @property genre Género principal del juego.
 * @property releaseYear Año de lanzamiento original.
 * @property hoursPlayed Total de horas acumuladas de juego.
 * @property userScore Valoración personal del usuario (de 0.0 a 10.0), o null si no se ha valorado.
 * @property isCompleted Indica si el jugador ha finalizado la historia principal.
 */
data class Game(
    val id: String,
    val title: String,
    val platform: Platform,
    val genre: Genre,
    val releaseYear: Int,
    val hoursPlayed: Int,
    val userScore: Double? = null,
    val isCompleted: Boolean = false
)

/**
 * Representa el resultado de una operación de negocio en el inventario/partida.
 * Permite control exhaustivo de flujo con sentencias 'when'.
 */
sealed interface VaultResult {
    data class Success(val message: String, val updatedGame: Game) : VaultResult
    data class Error(val reason: String) : VaultResult
}
