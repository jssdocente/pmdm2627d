package service

import model.Game
import model.Genre
import model.Platform

/**
 * PARTE 1 (TDD - 5 PUNTOS): Servicio de Analítica de Biblioteca en GameVault.
 *
 * El alumno debe implementar cada uno de los siguientes métodos utilizando
 * exclusivamente PIPELINES DECLARATIVOS (filter, map, sortedByDescending, etc.).
 *
 * REGLA DE EVALUACIÓN:
 * El uso de bucles imperativos tradicionales (for, while) con acumuladores mutables
 * (var, mutableListOf + .add()) penaliza el 50% de la puntuación del ejercicio,
 * aun cuando los tests unitarios pasen en verde.
 */
class GameAnalyticsService {

    /**
     * PIPELINE 1 (1.0 pto):
     * Filtra los juegos pertenecientes a la plataforma indicada que hayan sido completados
     * (isCompleted == true), los ordena de mayor a menor número de horas jugadas,
     * y retorna sus títulos convertidos a mayúsculas.
     * Si no hay coincidencias, debe retornar una lista vacía.
     */
    fun obtenerTitulosJuegosCompletados(juegos: List<Game>, plataforma: Platform): List<String> {
        TODO("Implementar mediante pipeline: filter -> sortedByDescending -> map")
    }

    /**
     * PIPELINE 2 (1.0 pto):
     * Calcula la puntuación media (userScore) de los videojuegos del género solicitado.
     * Debe ignorar de forma segura aquellos juegos cuyo userScore sea null.
     * Si no hay juegos del género o ninguno tiene puntuación válida, retorna 0.0.
     */
    fun calcularPuntuacionMediaPorGenero(juegos: List<Game>, genero: Genre): Double {
        TODO("Implementar mediante pipeline: filter -> mapNotNull -> average / comprobación de vacío")
    }

    /**
     * PIPELINE 3 (1.0 pto):
     * Agrupa los videojuegos según su plataforma y devuelve un mapa donde la clave
     * es la plataforma y el valor es el número total de juegos registrados en ella.
     * Las plataformas sin ningún juego en la lista no deben figurar como claves en el mapa.
     */
    fun contarJuegosPorPlataforma(juegos: List<Game>): Map<Platform, Int> {
        TODO("Implementar mediante pipeline: groupBy -> mapValues")
    }

    /**
     * PIPELINE 4 (1.0 pto):
     * Valida que el parámetro limite sea estrictamente mayor que 0 (lanzando IllegalArgumentException
     * si limite <= 0 con require).
     * Devuelve los primeros 'limite' juegos con mayor cantidad de horas jugadas (orden descendente).
     * Si el catálogo contiene menos juegos que el límite solicitado, devuelve todos los disponibles ordenados.
     */
    fun topJuegosMasJugados(juegos: List<Game>, limite: Int): List<Game> {
        TODO("Validar con require y resolver con pipeline: sortedByDescending -> take")
    }

    /**
     * PIPELINE 5 (1.0 pto):
     * Localiza el primer videojuego cuyo título contenga el fragmento buscado
     * (ignorando mayúsculas y minúsculas).
     * Si fragmentoTitulo es null, está en blanco o no existe ninguna coincidencia, devuelve null de forma segura.
     */
    fun buscarJuegoPorTitulo(juegos: List<Game>, fragmentoTitulo: String?): Game? {
        TODO("Validar nulabilidad y buscar con pipeline/función declarativa find")
    }
}
