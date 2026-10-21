# Simulacro 01: GameVault Analytics (PMDM - 2º DAM)

¡Bienvenido al **Simulacro 01 de Kotlin**! Esta prueba práctica evalúa tus competencias en el diseño de **pipelines declarativos**, inmutabilidad, control de tipos sellados y pruebas unitarias (**TDD**).

---

## ⏱️ Duración y Puntuación Total

- **Puntuación Máxima:** 10 Puntos
  - **Parte 1 (TDD - Pruebas Unitarias Automatizadas):** 5.0 Puntos
  - **Parte 2 (Funcionalidad CLI en Main):** 5.0 Puntos
- **Requisito Clave:** Pensamiento declarativo.
  > ⚠️ **Penalización Anti-Imperativo:** El uso innecesario de bucles imperativos clásicos (`for`, `while`) junto con acumuladores mutables (`var`, `mutableListOf` + `.add()`) en la resolución de colecciones supondrá una **penalización del 50% de la nota de ese ejercicio**, aun cuando los tests pasen en verde.

---

## 📋 Instrucciones de Trabajo

### Parte 1 (5.0 pts): TDD en `service/GameAnalyticsService.kt`

Abre `src/test/kotlin/service/GameAnalyticsServiceTest.kt` y ejecútalo con `./gradlew test` o desde IntelliJ IDEA. Observarás que los tests fallan inicialmente (**Semáforo Rojo**).

Tu objetivo es implementar cada uno de los 5 métodos en `src/main/kotlin/service/GameAnalyticsService.kt` usando **pipelines de funciones de orden superior** (`filter`, `map`, `sortedByDescending`, `groupBy`, etc.) hasta que todos los tests pasen en verde (**Semáforo Verde**):

1. **`obtenerTitulosJuegosCompletados(juegos, plataforma): List<String>` (1.0 pto):**
   - Filtra juegos de la plataforma que estén completados (`isCompleted == true`).
   - Ordena por horas jugadas de mayor a menor.
   - Retorna los títulos en mayúsculas.
   - Si no hay coincidencias, retorna una lista vacía.

2. **`calcularPuntuacionMediaPorGenero(juegos, genero): Double` (1.0 pto):**
   - Filtra por el género indicado.
   - Descarta de forma segura los valores nulos (`mapNotNull`).
   - Calcula la media aritmética con `average()`.
   - Si la lista resultante está vacía o no hay puntuaciones válidas, retorna `0.0`.

3. **`contarJuegosPorPlataforma(juegos): Map<Platform, Int>` (1.0 pto):**
   - Agrupa los videojuegos según su plataforma (`groupBy`).
   - Mapea cada grupo a su tamaño (`mapValues`).
   - Plataformas sin juegos en la lista no deben figurar en el mapa.

4. **`topJuegosMasJugados(juegos, limite): List<Game>` (1.0 pto):**
   - Valida que `limite > 0` con `require()`. Si es menor o igual a 0, lanza `IllegalArgumentException`.
   - Ordena por horas jugadas descendente y toma los primeros `limite` elementos (`take()`).
   - Si la lista tiene menos juegos que el límite, devuelve todos los disponibles ordenados.

5. **`buscarJuegoPorTitulo(juegos, fragmentoTitulo): Game?` (1.0 pto):**
   - Si `fragmentoTitulo` es nulo o está en blanco (`isNullOrBlank()`), retorna `null`.
   - Busca el primer juego cuyo título contenga `fragmentoTitulo` ignorando mayúsculas y minúsculas (`contains(..., ignoreCase = true)`).
   - Si no hay coincidencias, retorna `null`.

---

### Parte 2 (5.0 pts): Funcionalidad CLI en `app/Main.kt`

Abre `src/main/kotlin/app/Main.kt` y completa las 3 funciones de soporte:

1. **`generarDashboardJuegos(juegos: List<Game>): String` (2.0 ptos):**
   - Formatea el catálogo en una tabla de consola mediante una cabecera y una única llamada a `juegos.joinToString("\n") { ... }`.
   - Formato por fila: `%-5s | %-22s | %-15s | %5d h | %6s | %s`
   - Si `userScore` es nulo, muestra `"N/A"`; si tiene valor, muestra `"%.1f"`.
   - Si `isCompleted` es true, muestra `"COMPLETADO"`; si es false, muestra `"PENDIENTE"`.
   - **No utilices bucles `for` ni `println` repetidos dentro de la función.**

2. **`registrarPartida(juego: Game, horasAdicionales: Int, marcarCompletado: Boolean): VaultResult` (2.0 ptos):**
   - Valida que `horasAdicionales > 0`. Si no, retorna `VaultResult.Error("Las horas jugadas deben ser mayores a 0")`.
   - Si es válido, crea una **nueva instancia inmutable** mediante `juego.copy(...)`:
     - `hoursPlayed` incrementado con `horasAdicionales`.
     - `isCompleted` pasa a true si `marcarCompletado` es true; en caso contrario mantiene su valor original.
   - Retorna `VaultResult.Success` con el mensaje:
     `"¡Partida registrada en <TITULO>! Total acumulado: <HORAS>h"` y la instancia actualizada.

3. **`imprimirResultadoOperacion(resultado: VaultResult)` (1.0 pto):**
   - Evalúa el tipo de `VaultResult` mediante una expresión `when` exhaustiva:
     - `is VaultResult.Success`: Imprime `"✅ <mensaje> [Estado: COMPLETADO | PENDIENTE]"`
     - `is VaultResult.Error`: Imprime `"❌ ERROR: <reason>"`

---

## 🛠️ Comandos de Comprobación

```bash
# Ejecutar la suite de pruebas unitarias (Parte 1)
./gradlew test

# Ejecutar la aplicación de consola (Parte 2)
./gradlew run
```
