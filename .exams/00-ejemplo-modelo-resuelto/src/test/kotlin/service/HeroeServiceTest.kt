package service

import model.Heroe
import model.RolHeroe
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

class HeroeServiceTest {

    private val service = HeroeService()

    private val heroesMuestra = listOf(
        Heroe("H01", "Aria", RolHeroe.MAGO, nivel = 5, poder = 85, mentor = "Gandalf"),
        Heroe("H02", "Thorin", RolHeroe.GUERRERO, nivel = 8, poder = 120, mentor = null),
        Heroe("H03", "Kael", RolHeroe.MAGO, nivel = 3, poder = 45, mentor = "Gandalf"),
        Heroe("H04", "Lyra", RolHeroe.SANADOR, nivel = 6, poder = 95, mentor = "Elrond"),
        Heroe("H05", "Vex", RolHeroe.MAGO, nivel = 7, poder = 110, mentor = "Saruman"),
        Heroe("H06", "Brom", RolHeroe.GUERRERO, nivel = 4, poder = 70, mentor = null)
    )

    // ========================================================================
    // TEST 1.1: obtenerNombresHeroesDestacados (filter -> sortedByDescending -> map)
    // ========================================================================

    @Test
    fun `obtenerNombresHeroesDestacados filtra por rol, nivel minimo y ordena por poder descendente`() {
        val resultado = service.obtenerNombresHeroesDestacados(
            heroes = heroesMuestra,
            rolBuscado = RolHeroe.MAGO,
            nivelMinimo = 5
        )

        // Magos con nivel >= 5 son:
        // Vex (nivel 7, poder 110)
        // Aria (nivel 5, poder 85)
        // Kael tiene nivel 3 -> descartado
        val esperado = listOf("VEX", "ARIA")
        assertEquals(esperado, resultado, "Debe devolver los nombres en mayúsculas ordenados por poder descendente")
    }

    @Test
    fun `obtenerNombresHeroesDestacados devuelve lista vacia si ningun heroe cumple los criterios`() {
        val resultado = service.obtenerNombresHeroesDestacados(
            heroes = heroesMuestra,
            rolBuscado = RolHeroe.EXPLORADOR,
            nivelMinimo = 1
        )

        assertTrue(resultado.isEmpty(), "Si no hay exploradores, debe retornar una lista vacía")
    }

    // ========================================================================
    // TEST 1.2: calcularPoderMedio (map -> average)
    // ========================================================================

    @Test
    fun `calcularPoderMedio calcula correctamente el promedio aritmetico de la lista`() {
        val magos = listOf(
            Heroe("H01", "Aria", RolHeroe.MAGO, nivel = 5, poder = 80),
            Heroe("H03", "Kael", RolHeroe.MAGO, nivel = 3, poder = 40)
        )

        val resultado = service.calcularPoderMedio(magos)
        assertEquals(60.0, resultado, 0.001, "La media de 80 y 40 debe ser exactamente 60.0")
    }

    @Test
    fun `calcularPoderMedio devuelve 0_0 cuando la lista proporcionada esta vacia`() {
        val resultado = service.calcularPoderMedio(emptyList())
        assertEquals(0.0, resultado, "Una lista vacía debe producir un promedio de 0.0 de forma segura")
    }

    // ========================================================================
    // TEST 1.3: contarHeroesPorRol (groupBy -> mapValues)
    // ========================================================================

    @Test
    fun `contarHeroesPorRol clasifica y cuenta correctamente los integrantes de cada especialidad`() {
        val mapaRoles = service.contarHeroesPorRol(heroesMuestra)

        assertEquals(3, mapaRoles[RolHeroe.MAGO], "Debe haber 3 magos en la muestra")
        assertEquals(2, mapaRoles[RolHeroe.GUERRERO], "Debe haber 2 guerreros en la muestra")
        assertEquals(1, mapaRoles[RolHeroe.SANADOR], "Debe haber 1 sanador en la muestra")
        assertNull(mapaRoles[RolHeroe.EXPLORADOR], "No debe haber entrada para exploradores al no existir en la muestra")
    }

    // ========================================================================
    // TEST 1.4: obtenerMentoresUnicos (mapNotNull -> distinct -> sorted)
    // ========================================================================

    @Test
    fun `obtenerMentoresUnicos descarta valores null, elimina duplicados y ordena alfabeticamente`() {
        val resultado = service.obtenerMentoresUnicos(heroesMuestra)

        // Mentores en la muestra: Gandalf, null, Gandalf, Elrond, Saruman, null
        // Descartando nulos y duplicados: "Elrond", "Gandalf", "Saruman" (alfabético)
        val esperado = listOf("Elrond", "Gandalf", "Saruman")
        assertEquals(esperado, resultado, "Debe omitir nulos, evitar duplicados y ordenar alfabéticamente")
    }

    // ========================================================================
    // TEST 1.5: buscarHeroePorId (find + safe navigation)
    // ========================================================================

    @Test
    fun `buscarHeroePorId localiza al heroe correspondiente ignorando mayusculas y minusculas`() {
        val heroe = service.buscarHeroePorId(heroesMuestra, "h04")
        assertEquals("Lyra", heroe?.nombre, "Debe encontrar a Lyra ignorando capitalización en el ID")
    }

    @Test
    fun `buscarHeroePorId devuelve null de forma segura ante identificadores inexistentes o nulos`() {
        assertNull(service.buscarHeroePorId(heroesMuestra, "INEXISTENTE"))
        assertNull(service.buscarHeroePorId(heroesMuestra, null))
        assertNull(service.buscarHeroePorId(heroesMuestra, "   "))
    }
}
