package service

import model.Game
import model.Genre
import model.Platform
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull
import kotlin.test.assertTrue

class GameAnalyticsServiceTest {

    private val service = GameAnalyticsService()

    private val catalogoPrueba = listOf(
        Game("G01", "The Witcher 3", Platform.PC, Genre.RPG, 2015, hoursPlayed = 150, userScore = 9.8, isCompleted = true),
        Game("G02", "Hades", Platform.PC, Genre.INDIE, 2020, hoursPlayed = 85, userScore = 9.5, isCompleted = true),
        Game("G03", "Cyberpunk 2077", Platform.PC, Genre.RPG, 2020, hoursPlayed = 60, userScore = 8.2, isCompleted = false),
        Game("G04", "Bloodborne", Platform.PLAYSTATION, Genre.ACTION, 2015, hoursPlayed = 90, userScore = 9.4, isCompleted = true),
        Game("G05", "God of War Ragnarok", Platform.PLAYSTATION, Genre.ACTION, 2022, hoursPlayed = 45, userScore = 9.2, isCompleted = true),
        Game("G06", "Gran Turismo 7", Platform.PLAYSTATION, Genre.ACTION, 2022, hoursPlayed = 20, userScore = null, isCompleted = false),
        Game("G07", "Zelda: Breath of the Wild", Platform.NINTENDO_SWITCH, Genre.ADVENTURE, 2017, hoursPlayed = 130, userScore = 9.9, isCompleted = true),
        Game("G08", "Hollow Knight", Platform.PC, Genre.INDIE, 2017, hoursPlayed = 70, userScore = null, isCompleted = true)
    )

    // ========================================================================
    // PIPELINE 1: obtenerTitulosJuegosCompletados
    // ========================================================================

    @Test
    fun `obtenerTitulosJuegosCompletados filtra por plataforma, completados y ordena por horas desc`() {
        val resultado = service.obtenerTitulosJuegosCompletados(catalogoPrueba, Platform.PC)

        // En PC y completados:
        // The Witcher 3 (150h)
        // Hades (85h)
        // Hollow Knight (70h)
        // Cyberpunk está en PC pero NO completado (descartado)
        val esperado = listOf("THE WITCHER 3", "HADES", "HOLLOW KNIGHT")
        assertEquals(esperado, resultado, "Debe devolver títulos en mayúsculas ordenados por horas jugadas desc")
    }

    @Test
    fun `obtenerTitulosJuegosCompletados retorna lista vacia si no hay coincidencias`() {
        val resultado = service.obtenerTitulosJuegosCompletados(catalogoPrueba, Platform.XBOX)
        assertTrue(resultado.isEmpty(), "Para una plataforma sin juegos registrados debe retornar lista vacía")
    }

    // ========================================================================
    // PIPELINE 2: calcularPuntuacionMediaPorGenero
    // ========================================================================

    @Test
    fun `calcularPuntuacionMediaPorGenero calcula la media ignorando valores null`() {
        // En RPG: The Witcher 3 (9.8), Cyberpunk (8.2) -> Media: 9.0
        val mediaRpg = service.calcularPuntuacionMediaPorGenero(catalogoPrueba, Genre.RPG)
        assertEquals(9.0, mediaRpg, 0.001, "La media de 9.8 y 8.2 debe ser exactamente 9.0")

        // En INDIE: Hades (9.5), Hollow Knight (null) -> Media solo de Hades: 9.5
        val mediaIndie = service.calcularPuntuacionMediaPorGenero(catalogoPrueba, Genre.INDIE)
        assertEquals(9.5, mediaIndie, 0.001, "Debe ignorar el valor null de Hollow Knight y calcular la media de 9.5")
    }

    @Test
    fun `calcularPuntuacionMediaPorGenero devuelve 0_0 cuando no hay puntuaciones validas o lista vacia`() {
        val mediaStrategy = service.calcularPuntuacionMediaPorGenero(catalogoPrueba, Genre.STRATEGY)
        assertEquals(0.0, mediaStrategy, "Si no hay juegos del género, debe devolver 0.0")

        val mediaVacia = service.calcularPuntuacionMediaPorGenero(emptyList(), Genre.ACTION)
        assertEquals(0.0, mediaVacia, "Con lista vacía debe devolver 0.0")
    }

    // ========================================================================
    // PIPELINE 3: contarJuegosPorPlataforma
    // ========================================================================

    @Test
    fun `contarJuegosPorPlataforma agrupa y cuenta los titulos por cada plataforma`() {
        val conteo = service.contarJuegosPorPlataforma(catalogoPrueba)

        assertEquals(4, conteo[Platform.PC], "Debe haber 4 juegos en PC")
        assertEquals(3, conteo[Platform.PLAYSTATION], "Debe haber 3 juegos en PlayStation")
        assertEquals(1, conteo[Platform.NINTENDO_SWITCH], "Debe haber 1 juego en Nintendo Switch")
        assertNull(conteo[Platform.XBOX], "Plataformas sin juegos no deben estar en el mapa resultante")
    }

    // ========================================================================
    // PIPELINE 4: topJuegosMasJugados
    // ========================================================================

    @Test
    fun `topJuegosMasJugados devuelve los N juegos con mas horas ordenados desc`() {
        val top3 = service.topJuegosMasJugados(catalogoPrueba, limite = 3)

        assertEquals(3, top3.size, "Debe devolver exactamente 3 juegos")
        assertEquals("The Witcher 3", top3[0].title, "1º más jugado: The Witcher 3 (150h)")
        assertEquals("Zelda: Breath of the Wild", top3[1].title, "2º más jugado: Zelda (130h)")
        assertEquals("Bloodborne", top3[2].title, "3º más jugado: Bloodborne (90h)")
    }

    @Test
    fun `topJuegosMasJugados devuelve todos los juegos disponibles si limite supera el tamano`() {
        val listaPequena = listOf(catalogoPrueba[0], catalogoPrueba[1])
        val resultado = service.topJuegosMasJugados(listaPequena, limite = 10)
        assertEquals(2, resultado.size, "Si el límite supera la lista, devuelve todos los disponibles")
    }

    @Test
    fun `topJuegosMasJugados lanza IllegalArgumentException si el limite es menor o igual a cero`() {
        assertFailsWith<IllegalArgumentException>("Debe rechazar límites <= 0") {
            service.topJuegosMasJugados(catalogoPrueba, limite = 0)
        }
        assertFailsWith<IllegalArgumentException>("Debe rechazar límites negativos") {
            service.topJuegosMasJugados(catalogoPrueba, limite = -5)
        }
    }

    // ========================================================================
    // PIPELINE 5: buscarJuegoPorTitulo
    // ========================================================================

    @Test
    fun `buscarJuegoPorTitulo encuentra juego conteniendo texto ignorando mayusculas`() {
        val juego = service.buscarJuegoPorTitulo(catalogoPrueba, "witcher")
        assertEquals("G01", juego?.id, "Debe encontrar 'The Witcher 3' buscando 'witcher'")

        val juegoMayus = service.buscarJuegoPorTitulo(catalogoPrueba, "HADES")
        assertEquals("G02", juegoMayus?.id, "Debe encontrar 'Hades' buscando en mayúsculas")
    }

    @Test
    fun `buscarJuegoPorTitulo retorna null si fragmento es null, blanco o no existe`() {
        assertNull(service.buscarJuegoPorTitulo(catalogoPrueba, "Pokemon"), "Juego inexistente debe dar null")
        assertNull(service.buscarJuegoPorTitulo(catalogoPrueba, null), "Búsqueda null debe dar null de forma segura")
        assertNull(service.buscarJuegoPorTitulo(catalogoPrueba, "   "), "Búsqueda en blanco debe dar null")
    }
}
