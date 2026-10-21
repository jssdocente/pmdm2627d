package app

import model.Game
import model.Genre
import model.Platform
import model.VaultResult
import service.GameAnalyticsService

/**
 * PARTE 2 (FUNCIONALIDAD CLI - 5 PUNTOS): Panel de Control de GameVault.
 *
 * El alumno debe completar las funciones declaradas a continuación para orquestar
 * la aplicación de consola respetando el paradigma declarativo, inmutabilidad (copy)
 * y tipos sellados (sealed interface).
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
 *
 * Debe formatear el catálogo de juegos en una tabla de texto alineada.
 * REGLA: Utilizar joinToString("\n") para generar las filas a partir de la lista.
 * NO utilizar bucles for o print/println repetidos dentro de la función.
 *
 * Formato por fila:
 * "%-5s | %-22s | %-15s | %5d h | %6s | %s"
 * Columnas: ID, TÍTULO, PLATAFORMA, HORAS, SCORE (si es null muestra "N/A", si no "%.1f"), ESTADO ("COMPLETADO" o "PENDIENTE").
 */
fun generarDashboardJuegos(juegos: List<Game>): String {
    TODO("Implementar mediante cabecera + joinToString sin bucles for")
}

/**
 * EJERCICIO 2.2 (2.0 ptos): Registro de partida inmutable.
 *
 * Valida que horasAdicionales sea mayor que 0. Si horasAdicionales <= 0,
 * retorna VaultResult.Error indicando "Las horas jugadas deben ser mayores a 0".
 *
 * Si es válido, crea una NUEVA INSTANCIA usando juego.copy(...) donde:
 * - hoursPlayed se incrementa con horasAdicionales.
 * - isCompleted pasa a true si marcarCompletado es true; si no, conserva el valor previo.
 *
 * Retorna VaultResult.Success con el juego actualizado y el mensaje:
 * "¡Partida registrada en <TITULO>! Total acumulado: <HORAS>h"
 */
fun registrarPartida(juego: Game, horasAdicionales: Int, marcarCompletado: Boolean): VaultResult {
    TODO("Validar y crear copia inmutable con juego.copy() devolviendo VaultResult")
}

/**
 * EJERCICIO 2.3 (1.0 pto): Impresión exhaustiva con 'when'.
 *
 * Evalúa el tipo de VaultResult mediante when exhaustivo:
 * - Si es Success: imprime "✅ <mensaje> [Estado: COMPLETADO | PENDIENTE]"
 * - Si es Error: imprime "❌ ERROR: <reason>"
 */
fun imprimirResultadoOperacion(resultado: VaultResult) {
    TODO("Implementar when exhaustivo sobre VaultResult")
}
