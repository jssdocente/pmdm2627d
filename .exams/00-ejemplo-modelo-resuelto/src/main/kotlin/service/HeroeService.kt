package service

import model.Heroe
import model.RolHeroe

/**
 * Servicio con funciones puras para el procesamiento analítico de héroes.
 * Todas las operaciones se resuelven mediante pipelines declarativos sobre colecciones.
 */
class HeroeService {

    /**
     * Ejercicio 1.1: Pipeline de Filtrado, Ordenación y Transformación.
     *
     * Obtiene los nombres en mayúsculas de los héroes de un rol determinado
     * que alcancen o superen el nivel mínimo especificado, ordenados de mayor a menor poder.
     *
     * Pipeline:
     * 1. filter: Selecciona por rol y nivel.
     * 2. sortedByDescending: Ordena de mayor a menor poder.
     * 3. map: Transforma cada héroe a su nombre en mayúsculas.
     */
    fun obtenerNombresHeroesDestacados(
        heroes: List<Heroe>,
        rolBuscado: RolHeroe,
        nivelMinimo: Int
    ): List<String> =
        heroes
            .filter { it.rol == rolBuscado && it.nivel >= nivelMinimo }
            .sortedByDescending { it.poder }
            .map { it.nombre.uppercase() }

    /**
     * Ejercicio 1.2: Pipeline de Agregación y Métricas Numéricas.
     *
     * Calcula la media aritmética del poder de los héroes proporcionados.
     * Si la lista está vacía, devuelve 0.0 sin lanzar excepciones.
     *
     * Pipeline:
     * 1. Comprobación de vacío con isEmpty().
     * 2. map: Extrae la propiedad 'poder'.
     * 3. average(): Calcula el promedio aritmético.
     */
    fun calcularPoderMedio(heroes: List<Heroe>): Double {
        if (heroes.isEmpty()) return 0.0
        return heroes.map { it.poder }.average()
    }

    /**
     * Ejercicio 1.3: Pipeline de Agrupación y Reducción por Clave.
     *
     * Agrupa a los héroes por su rol y devuelve un mapa donde la clave es el rol
     * y el valor es la cantidad total de héroes inscritos en dicho rol.
     *
     * Pipeline:
     * 1. groupBy: Genera Map<RolHeroe, List<Heroe>>.
     * 2. mapValues: Convierte cada List<Heroe> en su tamaño (size).
     */
    fun contarHeroesPorRol(heroes: List<Heroe>): Map<RolHeroe, Int> =
        heroes
            .groupBy { it.rol }
            .mapValues { (_, listaDeRol) -> listaDeRol.size }

    /**
     * Ejercicio 1.4: Pipeline de Null-Safety y Valores Únicos.
     *
     * Extrae los nombres únicos de todos los maestros/mentores asignados a la academia,
     * descartando automáticamente los héroes que no tienen mentor (valor null)
     * y devolviendo la lista ordenada alfabéticamente.
     *
     * Pipeline:
     * 1. mapNotNull: Extrae el mentor descartando de forma segura los valores nulos.
     * 2. distinct(): Elimina mentores duplicados.
     * 3. sorted(): Ordena alfabéticamente.
     */
    fun obtenerMentoresUnicos(heroes: List<Heroe>): List<String> =
        heroes
            .mapNotNull { it.mentor }
            .distinct()
            .sorted()

    /**
     * Ejercicio 1.5: Búsqueda declarativa con Null-Safety.
     *
     * Localiza a un héroe por su identificador único. Si el identificador recibido
     * es null, está en blanco o no existe ninguna coincidencia, devuelve null de forma segura.
     *
     * Pipeline / Idiomático:
     * 1. requireNotNull o verificación temprana con isNullOrBlank().
     * 2. find: Búsqueda del primer elemento que cumple el predicado.
     */
    fun buscarHeroePorId(heroes: List<Heroe>, idBuscado: String?): Heroe? {
        if (idBuscado.isNullOrBlank()) return null
        return heroes.find { it.id.equals(idBuscado.trim(), ignoreCase = true) }
    }
}
