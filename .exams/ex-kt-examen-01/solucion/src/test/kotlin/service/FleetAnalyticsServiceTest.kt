package service

import model.TipoVehiculo
import model.Vehiculo
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull
import kotlin.test.assertTrue

class FleetAnalyticsServiceTest {

    private val service = FleetAnalyticsService()

    private val flotaPrueba = listOf(
        Vehiculo("V01", "Xiaomi Pro 2", TipoVehiculo.PATINETE, bateriaPct = 85, tarifaMinuto = 0.20, enMantenimiento = false, ubicacionActual = "Centro Histórico", totalViajes = 140),
        Vehiculo("V02", "Segway Ninebot", TipoVehiculo.PATINETE, bateriaPct = 15, tarifaMinuto = 0.22, enMantenimiento = false, ubicacionActual = "Estación de Tren", totalViajes = 95),
        Vehiculo("V03", "Dualtron Spider", TipoVehiculo.PATINETE, bateriaPct = 90, tarifaMinuto = 0.25, enMantenimiento = true, ubicacionActual = "Taller Central", totalViajes = 210),
        Vehiculo("V04", "Silence S01", TipoVehiculo.MOTO, bateriaPct = 75, tarifaMinuto = 0.35, enMantenimiento = false, ubicacionActual = "Avenida Diagonal", totalViajes = 180),
        Vehiculo("V05", "Niu NQi", TipoVehiculo.MOTO, bateriaPct = 60, tarifaMinuto = 0.31, enMantenimiento = false, ubicacionActual = "Campus Universitario", totalViajes = 110),
        Vehiculo("V06", "Smart EQ", TipoVehiculo.COCHE, bateriaPct = 40, tarifaMinuto = 0.60, enMantenimiento = false, ubicacionActual = "Centro Comercial", totalViajes = 65),
        Vehiculo("V07", "Orbea E-Vibe", TipoVehiculo.BICICLETA, bateriaPct = 95, tarifaMinuto = 0.15, enMantenimiento = false, ubicacionActual = null, totalViajes = 80)
    )

    // ========================================================================
    // PIPELINE 1: obtenerModelosDisponibles (filter -> sortedByDescending -> map)
    // ========================================================================

    @Test
    fun `obtenerModelosDisponibles filtra por tipo, operativos, bateria minima y ordena por bateria desc`() {
        val resultado = service.obtenerModelosDisponibles(flotaPrueba, TipoVehiculo.PATINETE, bateriaMinima = 20)

        val esperado = listOf("XIAOMI PRO 2")
        assertEquals(esperado, resultado, "Solo debe incluir Xiaomi Pro 2 en mayúsculas")
    }

    @Test
    fun `obtenerModelosDisponibles devuelve lista vacia si no hay unidades disponibles`() {
        val resultado = service.obtenerModelosDisponibles(flotaPrueba, TipoVehiculo.COCHE, bateriaMinima = 80)
        assertTrue(resultado.isEmpty(), "Para coches con batería >= 80% no hay coincidencias")
    }

    // ========================================================================
    // PIPELINE 2: calcularTarifaMediaPorTipo (filter -> map -> average)
    // ========================================================================

    @Test
    fun `calcularTarifaMediaPorTipo calcula correctamente el precio medio del tipo`() {
        val mediaMoto = service.calcularTarifaMediaPorTipo(flotaPrueba, TipoVehiculo.MOTO)
        assertEquals(0.33, mediaMoto, 0.001, "La media de 0.35 y 0.31 debe ser exactamente 0.33")
    }

    @Test
    fun `calcularTarifaMediaPorTipo devuelve 0_0 cuando no hay vehiculos del tipo o lista vacia`() {
        val listaSinCoches = flotaPrueba.filter { it.tipo != TipoVehiculo.COCHE }
        val resultado = service.calcularTarifaMediaPorTipo(listaSinCoches, TipoVehiculo.COCHE)
        assertEquals(0.0, resultado, "Si no hay coches en la lista debe retornar 0.0 de forma segura")

        val resultadoVacia = service.calcularTarifaMediaPorTipo(emptyList(), TipoVehiculo.PATINETE)
        assertEquals(0.0, resultadoVacia, "Con lista vacía debe retornar 0.0")
    }

    // ========================================================================
    // PIPELINE 3: contarVehiculosOperativosPorTipo (filter -> groupBy -> mapValues)
    // ========================================================================

    @Test
    fun `contarVehiculosOperativosPorTipo cuenta solo vehiculos que no esten en taller`() {
        val conteo = service.contarVehiculosOperativosPorTipo(flotaPrueba)

        assertEquals(2, conteo[TipoVehiculo.PATINETE], "Debe haber 2 patinetes operativos")
        assertEquals(2, conteo[TipoVehiculo.MOTO], "Debe haber 2 motos operativas")
        assertEquals(1, conteo[TipoVehiculo.COCHE], "Debe haber 1 coche operativo")
        assertEquals(1, conteo[TipoVehiculo.BICICLETA], "Debe haber 1 bicicleta operativa")
    }

    // ========================================================================
    // PIPELINE 4: topVehiculosMayorUso (require -> sortedByDescending -> take)
    // ========================================================================

    @Test
    fun `topVehiculosMayorUso devuelve los N vehiculos con mas viajes ordenados desc`() {
        val top3 = service.topVehiculosMayorUso(flotaPrueba, limite = 3)

        assertEquals(3, top3.size, "Debe retornar 3 vehículos")
        assertEquals("V03", top3[0].id, "1º: Dualtron (210 viajes)")
        assertEquals("V04", top3[1].id, "2º: Silence (180 viajes)")
        assertEquals("V01", top3[2].id, "3º: Xiaomi (140 viajes)")
    }

    @Test
    fun `topVehiculosMayorUso devuelve todos los disponibles si el limite supera el total`() {
        val listaBreve = listOf(flotaPrueba[0], flotaPrueba[1])
        val resultado = service.topVehiculosMayorUso(listaBreve, limite = 10)
        assertEquals(2, resultado.size, "Si el límite supera la lista, devuelve todos los disponibles ordenados")
    }

    @Test
    fun `topVehiculosMayorUso lanza IllegalArgumentException si el limite es menor o igual a cero`() {
        assertFailsWith<IllegalArgumentException>("Límite 0 debe lanzar excepción") {
            service.topVehiculosMayorUso(flotaPrueba, limite = 0)
        }
        assertFailsWith<IllegalArgumentException>("Límite negativo debe lanzar excepción") {
            service.topVehiculosMayorUso(flotaPrueba, limite = -4)
        }
    }

    // ========================================================================
    // PIPELINE 5: buscarVehiculoPorUbicacion (isNullOrBlank -> find con contains ignoreCase)
    // ========================================================================

    @Test
    fun `buscarVehiculoPorUbicacion encuentra el vehiculo por fragmento de ubicacion ignoreCase`() {
        val vehiculo = service.buscarVehiculoPorUbicacion(flotaPrueba, "tren")
        assertEquals("V02", vehiculo?.id, "Debe encontrar el patinete en 'Estación de Tren' con 'tren'")

        val diagonal = service.buscarVehiculoPorUbicacion(flotaPrueba, "DIAGONAL")
        assertEquals("V04", diagonal?.id, "Debe encontrar la moto con 'DIAGONAL'")
    }

    @Test
    fun `buscarVehiculoPorUbicacion devuelve null si la ubicacion es nula, vacia o no existe`() {
        assertNull(service.buscarVehiculoPorUbicacion(flotaPrueba, "Aeropuerto"), "Ubicación inexistente debe dar null")
        assertNull(service.buscarVehiculoPorUbicacion(flotaPrueba, null), "Ubicación null debe dar null")
        assertNull(service.buscarVehiculoPorUbicacion(flotaPrueba, "   "), "Ubicación en blanco debe dar null")
    }
}
