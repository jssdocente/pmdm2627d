package app

import model.AccionResultado
import model.Heroe
import model.RolHeroe
import service.HeroeService

/**
 * Aplicación de consola que demuestra la orquestación declarativa:
 * - Colecciones inmutables.
 * - Formateo mediante pipelines con joinToString.
 * - Modificación de estado con copy().
 * - Sentencias when exhaustivas sobre tipos sellados (sealed interface).
 */
fun main() {
    val service = HeroeService()

    // 1. Catálogo inicial de datos
    val academia = listOf(
        Heroe("H01", "Aria", RolHeroe.MAGO, nivel = 5, poder = 85, mentor = "Gandalf"),
        Heroe("H02", "Thorin", RolHeroe.GUERRERO, nivel = 8, poder = 120, mentor = null),
        Heroe("H03", "Kael", RolHeroe.MAGO, nivel = 3, poder = 45, mentor = "Gandalf"),
        Heroe("H04", "Lyra", RolHeroe.SANADOR, nivel = 6, poder = 95, mentor = "Elrond"),
        Heroe("H05", "Vex", RolHeroe.MAGO, nivel = 7, poder = 110, mentor = "Saruman"),
        Heroe("H06", "Brom", RolHeroe.GUERRERO, nivel = 4, poder = 70, mentor = null)
    )

    println("==========================================================")
    println("          🏛️  HERO ACADEMY DASHBOARD (KOTLIN)             ")
    println("==========================================================")
    println()

    // 2. PARTE FUNCIONAL 1: Informe formateado mediante Pipeline
    println("--- 1. TABLÓN OFICIAL DE ALUMNOS (PIPELINE FORMAT) ---")
    println(generarInformeHeroes(academia))
    println()

    // 3. Demostración de Servicios Analíticos (TDD)
    println("--- 2. ANÁLISIS RÁPIDO DE LA ACADEMIA ---")
    val poderMedio = service.calcularPoderMedio(academia)
    println("-> Poder medio del escuadrón: %.2f pts".format(poderMedio))

    val mentores = service.obtenerMentoresUnicos(academia)
    println("-> Mentores activos: ${mentores.joinToString(", ")}")

    val resumenRoles = service.contarHeroesPorRol(academia)
    println("-> Distribución por roles: $resumenRoles")

    val magosElite = service.obtenerNombresHeroesDestacados(academia, RolHeroe.MAGO, nivelMinimo = 5)
    println("-> Magos de élite (niv >= 5): $magosElite")
    println()

    // 4. PARTE FUNCIONAL 2: Transición de Estado Inmutable (copy) y When
    println("--- 3. SIMULACIÓN DE PROMOCIÓN DE RANGO (IMMUTABLE STATE) ---")
    val alumno = academia.first() // Aria (nivel 5, poder 85)

    // Caso A: Promoción válida
    val resultadoValido = promocionarHeroe(alumno, nuevoNivel = 6, incrementoPoder = 20)
    mostrarResultado(resultadoValido)

    // Caso B: Intento de degradación o nivel inválido
    val resultadoInvalido = promocionarHeroe(alumno, nuevoNivel = 4, incrementoPoder = 10)
    mostrarResultado(resultadoInvalido)
}

/**
 * PARTE FUNCIONAL: Genera una vista de tabla mediante pipelines funcionales.
 *
 * Evita bucles imperativos con for/while tradicionales y utiliza joinToString
 * para transformar cada elemento inmutable en una fila con formato.
 */
fun generarInformeHeroes(heroes: List<Heroe>): String {
    val cabecera = "ID    | NOMBRE     | ROL        | NIVEL | PODER | MENTOR\n" +
                   "------------------------------------------------------------------"

    val filas = heroes.map { h ->
        val mentorTexto = h.mentor ?: "(Sin mentor)"
        "%-5s | %-10s | %-10s | %-5d | %-5d | %s".format(
            h.id,
            h.nombre,
            h.rol.name,
            h.nivel,
            h.poder,
            mentorTexto
        )
        }.joinToString("\n")


    return "$cabecera\n$filas"
}

/**
 * PARTE FUNCIONAL: Modifica el estado de un héroe respetando la inmutabilidad.
 *
 * No muta propiedades del objeto original (heroe.nivel = 6 ❌), sino que
 * produce una nueva instancia con los cambios aplicados mediante heroe.copy().
 */
fun promocionarHeroe(heroe: Heroe, nuevoNivel: Int, incrementoPoder: Int): AccionResultado {
    if (nuevoNivel <= heroe.nivel) {
        return AccionResultado.Error(
            "El nuevo nivel ($nuevoNivel) debe ser estrictamente superior al actual (${heroe.nivel})"
        )
    }

    val heroePromocionado = heroe.copy(
        nivel = nuevoNivel,
        poder = heroe.poder + incrementoPoder
    )

    return AccionResultado.Exito(
        mensaje = "¡${heroe.nombre} asciende con éxito al nivel $nuevoNivel!",
        heroeActualizado = heroePromocionado
    )
}

/**
 * Muestra el resultado de una operación utilizando un 'when' exhaustivo como expresión.
 */
fun mostrarResultado(resultado: AccionResultado) {
    when (resultado) {
        is AccionResultado.Exito -> {
            println("✅ ÉXITO: ${resultado.mensaje}")
            println("   -> Poder final: ${resultado.heroeActualizado.poder} pts")
        }
        is AccionResultado.Error -> {
            println("❌ RECHAZADO: ${resultado.motivo}")
        }
    }
}
