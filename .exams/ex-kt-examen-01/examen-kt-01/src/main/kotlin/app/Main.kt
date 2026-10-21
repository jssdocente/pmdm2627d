package app

import model.OperacionFlotaResult
import model.TipoVehiculo
import model.Vehiculo
import service.FleetAnalyticsService

/**
 * PARTE 2 (FUNCIONALIDAD CLI - 5 PUNTOS): Panel de Control de MobilityHub.
 *
 * El alumno debe completar las funciones declaradas a continuación para orquestar
 * la aplicación de consola respetando el paradigma declarativo, inmutabilidad (copy)
 * y tipos sellados (sealed interface).
 */
fun main() {
    val service = FleetAnalyticsService()

    val flotaUrbana = listOf(
        Vehiculo("V01", "Xiaomi Pro 2", TipoVehiculo.PATINETE, bateriaPct = 85, tarifaMinuto = 0.20, enMantenimiento = false, ubicacionActual = "Centro Histórico", totalViajes = 140),
        Vehiculo("V02", "Segway Ninebot", TipoVehiculo.PATINETE, bateriaPct = 15, tarifaMinuto = 0.22, enMantenimiento = false, ubicacionActual = "Estación de Tren", totalViajes = 95),
        Vehiculo("V03", "Dualtron Spider", TipoVehiculo.PATINETE, bateriaPct = 90, tarifaMinuto = 0.25, enMantenimiento = true, ubicacionActual = "Taller Central", totalViajes = 210),
        Vehiculo("V04", "Silence S01", TipoVehiculo.MOTO, bateriaPct = 75, tarifaMinuto = 0.35, enMantenimiento = false, ubicacionActual = "Avenida Diagonal", totalViajes = 180),
        Vehiculo("V05", "Niu NQi", TipoVehiculo.MOTO, bateriaPct = 60, tarifaMinuto = 0.31, enMantenimiento = false, ubicacionActual = "Campus Universitario", totalViajes = 110),
        Vehiculo("V06", "Smart EQ", TipoVehiculo.COCHE, bateriaPct = 40, tarifaMinuto = 0.60, enMantenimiento = false, ubicacionActual = "Centro Comercial", totalViajes = 65),
        Vehiculo("V07", "Orbea E-Vibe", TipoVehiculo.BICICLETA, bateriaPct = 95, tarifaMinuto = 0.15, enMantenimiento = false, ubicacionActual = null, totalViajes = 80)
    )

    println("=========================================================================================")
    println("                      🚗 MOBILITYHUB FLEET COMMAND CENTER                                ")
    println("=========================================================================================")
    println()

    // 1. Mostrar tabla formateada
    println("--- ESTADO ACTUAL DE LA FLOTA URBANA ---")
    println(generarDashboardFlota(flotaUrbana))
    println()

    // 2. Métricas del Servicio (Parte 1)
    println("--- ANÁLISIS OPERATIVO (FLEET SERVICE) ---")
    val patinetesListos = service.obtenerModelosDisponibles(flotaUrbana, TipoVehiculo.PATINETE, bateriaMinima = 20)
    println("-> Patinetes listos para alquiler: $patinetesListos")

    val tarifaMediaMoto = service.calcularTarifaMediaPorTipo(flotaUrbana, TipoVehiculo.MOTO)
    println("-> Tarifa media en motos: %.2f €/min".format(tarifaMediaMoto))

    val operativosPorTipo = service.contarVehiculosOperativosPorTipo(flotaUrbana)
    println("-> Unidades operativas fuera de taller: $operativosPorTipo")

    val masUsados = service.topVehiculosMayorUso(flotaUrbana, 2)
    println("-> TOP 2 vehículos más utilizados: ${masUsados.map { "${it.modelo} (${it.totalViajes} viajes)" }}")
    println()

    // 3. Simulación de Registro de Viajes (Inmutabilidad con copy)
    println("--- REGISTRO DE VIAJES Y ACTUALIZACIÓN DE ESTADO ---")
    val motoOperativa = flotaUrbana.first { it.id == "V04" } // Silence S01 (75% batería)
    val patineteEnTaller = flotaUrbana.first { it.id == "V03" } // Dualtron (en taller)

    // Caso A: Viaje válido
    println("[Acción 1] Alquilando Silence S01 (20 min, consumo 25% batería hacia 'Plaza Mayor')...")
    val resultadoValido = registrarViaje(motoOperativa, minutosDuracion = 20, consumoBateriaPct = 25, nuevaUbicacion = "Plaza Mayor")
    imprimirResultadoOperacion(resultadoValido)

    // Caso B: Intento en vehículo inmovilizado
    println("[Acción 2] Intentando alquilar vehículo en taller...")
    val resultadoTaller = registrarViaje(patineteEnTaller, minutosDuracion = 10, consumoBateriaPct = 15, nuevaUbicacion = "Parque Central")
    imprimirResultadoOperacion(resultadoTaller)

    // Caso C: Intento con batería insuficiente
    println("[Acción 3] Intentando viaje con consumo mayor a la batería restante...")
    val resultadoBateria = registrarViaje(motoOperativa, minutosDuracion = 90, consumoBateriaPct = 90, nuevaUbicacion = "Puerto")
    imprimirResultadoOperacion(resultadoBateria)
}

/**
 * EJERCICIO 2.1 (2.0 ptos): Generador de tabla tabular mediante pipelines funcionales.
 *
 * Debe formatear la flota en una tabla de texto alineada.
 * REGLA: Utilizar joinToString("\n") para generar las filas a partir de la lista.
 * NO utilizar bucles for o print/println repetidos dentro de la función.
 *
 * Formato por fila:
 * "%-5s | %-18s | %-10s | %7d %% | %6.2f €/min | %6d | %-20s | %s"
 * Columnas: ID, MODELO, TIPO, BATERÍA, TARIFA, VIAJES, UBICACIÓN (si es null "N/A", si no valor), ESTADO ("TALLER" si enMantenimiento, si no "OPERATIVO").
 */
fun generarDashboardFlota(flota: List<Vehiculo>): String {
    TODO("Implementar mediante cabecera + joinToString sin bucles for")
}

/**
 * EJERCICIO 2.2 (2.0 ptos): Registro de viaje inmutable.
 *
 * Validaciones:
 * 1. Si vehiculo.enMantenimiento == true, retorna OperacionFlotaResult.Error("No se puede iniciar viaje: vehículo en taller").
 * 2. Si minutosDuracion <= 0 o consumoBateriaPct <= 0, retorna OperacionFlotaResult.Error("La duración y el consumo deben ser estrictamente positivos").
 * 3. Si vehiculo.bateriaPct < consumoBateriaPct, retorna OperacionFlotaResult.Error("Batería insuficiente para realizar el viaje").
 *
 * Si es válido, genera una NUEVA INSTANCIA usando vehiculo.copy(...) donde:
 * - bateriaPct se reduce restando consumoBateriaPct.
 * - totalViajes se incrementa en 1.
 * - ubicacionActual se actualiza con nuevaUbicacion.
 *
 * Retorna OperacionFlotaResult.Exito con el mensaje:
 * "Viaje de <MINUTOS> min registrado en <MODELO>. Batería restante: <BATERIA>%"
 * y el vehículo actualizado.
 */
fun registrarViaje(
    vehiculo: Vehiculo,
    minutosDuracion: Int,
    consumoBateriaPct: Int,
    nuevaUbicacion: String
): OperacionFlotaResult {
    TODO("Validar y crear copia inmutable con vehiculo.copy() devolviendo OperacionFlotaResult")
}

/**
 * EJERCICIO 2.3 (1.0 pto): Impresión exhaustiva con 'when'.
 *
 * Evalúa el tipo de OperacionFlotaResult mediante when exhaustivo:
 * - Si es Exito: imprime "✅ <mensaje>"
 * - Si es Error: imprime "❌ ERROR: <motivo>"
 */
fun imprimirResultadoOperacion(resultado: OperacionFlotaResult) {
    TODO("Implementar when exhaustivo sobre OperacionFlotaResult")
}
