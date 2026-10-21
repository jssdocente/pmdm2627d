package app

import model.Game
import model.Genre
import model.Platform
import model.VaultResult
import service.GameAnalyticsService

/**
 * PARTE 2 (FUNCIONALIDAD CLI - 5 PUNTOS): Panel de Control de GameVault (SOLUCIÓN).
 */
fun main() {
    val service = GameAnalyticsService()

    val miBiblioteca = listOf(
        Game("G01", "The Witcher 3", Platform.PC, Genre.RPG, 2015, hoursPlayed = 150, userScore = 9.8, isCompleted = true),
        Game("G02", "Hades", Platform.PC, Genre.INDIE, 2020, hoursPlayed = 85, userScore = 9.5, isCompleted = true),
        Game("G03", "Cyberpunk 2077", Platform.PC, Genre.RPG, 2020, hoursPlayed = 60, userScore = 8.2, isCompleted = false),
        Game("G04", "Bloodborne", Platform.PLAYSTATION, Genre.ACTION, 2015, hoursPlayed = 90, userScore = 9.4, isCompleted = true),
        Game("G05", "Zelda: BotW", Platform.NINTENDO_SWITCH, Genre.ADVENTURE, 2017, hoursPlayed = 130, userScore = 9.9, isCompleted = true),
        Game("G06", "Hollow Knight", Platform.PC, Genre.INDIE, 2017, hoursPlayed = 70, userScore = null, isCompleted = false)
    )

    println("==========================================================================")
    println("                    🎮  GAMEVAULT DASHBOARD v1.0                          ")
    println("==========================================================================")
    println()

    // 1. Mostrar tabla formateada
    println("--- TABLÓN DE JUEGOS EN BIBLIOTECA ---")
    println(generarDashboardJuegos(miBiblioteca))
    println()

    // 2. Métricas del Servicio (Parte 1)
    println("--- MÉTRICAS ANALÍTICAS (SERVICE) ---")
    val completadosPc = service.obtenerTitulosJuegosCompletados(miBiblioteca, Platform.PC)
    println("-> Completados en PC (orden horas desc): $completadosPc")

    val mediaRpg = service.calcularPuntuacionMediaPorGenero(miBiblioteca, Genre.RPG)
    println("-> Nota media en RPG: %.2f".format(mediaRpg))

    val porPlataforma = service.contarJuegosPorPlataforma(miBiblioteca)
    println("-> Títulos por plataforma: $porPlataforma")

    val top2 = service.topJuegosMasJugados(miBiblioteca, 2)
    println("-> TOP 2 más jugados: ${top2.map { "${it.title} (${it.hoursPlayed}h)" }}")
    println()

    // 3. Simulación de Registro de Partida (Inmutabilidad con copy)
    println("--- REGISTRO DE NUEVAS SESIONES DE JUEGO ---")
    val juegoEnProgreso = miBiblioteca.first { it.id == "G03" } // Cyberpunk (60h, pendiente)

    // Caso A: Registro válido
    println("[Acción 1] Registrando 15 horas y marcando como completado...")
    val resultadoValido = registrarPartida(juegoEnProgreso, horasAdicionales = 15, marcarCompletado = true)
    imprimirResultadoOperacion(resultadoValido)

    // Caso B: Intento con horas inválidas
    println("[Acción 2] Registrando -5 horas (inválido)...")
    val resultadoInvalido = registrarPartida(juegoEnProgreso, horasAdicionales = -5, marcarCompletado = false)
    imprimirResultadoOperacion(resultadoInvalido)
}

/**
 * EJERCICIO 2.1 (2.0 ptos): Generador de tabla tabular mediante pipelines funcionales.
 */
fun generarDashboardJuegos(juegos: List<Game>): String {
    val cabecera = "%-5s | %-22s | %-15s | %7s | %6s | %s".format(
        "ID", "TÍTULO", "PLATAFORMA", "HORAS", "SCORE", "ESTADO"
    )
    val separador = "-".repeat(74)

    val filas = juegos.joinToString("\n") { g ->
        val scoreTexto = g.userScore?.let { "%.1f".format(it) } ?: "N/A"
        val estadoTexto = if (g.isCompleted) "COMPLETADO" else "PENDIENTE"

        "%-5s | %-22s | %-15s | %5d h | %6s | %s".format(
            g.id,
            g.title,
            g.platform.name,
            g.hoursPlayed,
            scoreTexto,
            estadoTexto
        )
    }

    return "$cabecera\n$separador\n$filas"
}

/**
 * EJERCICIO 2.2 (2.0 ptos): Registro de partida inmutable.
 */
fun registrarPartida(juego: Game, horasAdicionales: Int, marcarCompletado: Boolean): VaultResult {
    if (horasAdicionales <= 0) {
        return VaultResult.Error("Las horas jugadas deben ser mayores a 0")
    }

    val juegoActualizado = juego.copy(
        hoursPlayed = juego.hoursPlayed + horasAdicionales,
        isCompleted = if (marcarCompletado) true else juego.isCompleted
    )

    return VaultResult.Success(
        message = "¡Partida registrada en ${juego.title}! Total acumulado: ${juegoActualizado.hoursPlayed}h",
        updatedGame = juegoActualizado
    )
}

/**
 * EJERCICIO 2.3 (1.0 pto): Impresión exhaustiva con 'when'.
 */
fun imprimirResultadoOperacion(resultado: VaultResult) {
    when (resultado) {
        is VaultResult.Success -> {
            val estado = if (resultado.updatedGame.isCompleted) "COMPLETADO" else "PENDIENTE"
            println("✅ ${resultado.message} [Estado: $estado]")
        }
        is VaultResult.Error -> {
            println("❌ ERROR: ${resultado.reason}")
        }
    }
}
