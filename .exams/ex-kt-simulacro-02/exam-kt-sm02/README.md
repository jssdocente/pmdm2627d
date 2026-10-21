# Simulacro 02: FitTrack Fitness Dashboard (PMDM - 2º DAM)

¡Bienvenido al **Simulacro 02 de Kotlin**! Esta prueba práctica consolida tus destrezas en **pipelines declarativos**, inmutabilidad, tratamiento seguro de tipos nulables y pruebas unitarias (**TDD**).

---

## ⏱️ Duración y Puntuación Total

- **Puntuación Máxima:** 10 Puntos
  - **Parte 1 (TDD - Pruebas Unitarias Automatizadas):** 5.0 Puntos
  - **Parte 2 (Funcionalidad CLI en Main):** 5.0 Puntos
- **Requisito Clave:** Pensamiento declarativo.
  > ⚠️ **Penalización Anti-Imperativo:** El uso innecesario de bucles imperativos clásicos (`for`, `while`) junto con acumuladores mutables (`var`, `mutableListOf` + `.add()`) en la resolución de colecciones supondrá una **penalización del 50% de la nota de ese ejercicio**, aun cuando los tests pasen en verde.

---

## 📋 Instrucciones de Trabajo

### Parte 1 (5.0 pts): TDD en `service/WorkoutMetricsService.kt`

Abre `src/test/kotlin/service/WorkoutMetricsServiceTest.kt` y ejecútalo con `./gradlew test` o desde IntelliJ IDEA. Observarás que los tests fallan inicialmente (**Semáforo Rojo**).

Tu objetivo es implementar cada uno de los 5 métodos en `src/main/kotlin/service/WorkoutMetricsService.kt` usando **pipelines de funciones de orden superior** (`filter`, `map`, `sortedByDescending`, `groupBy`, etc.) hasta que todos los tests pasen en verde (**Semáforo Verde**):

1. **`obtenerSesionesIntensas(sesiones, tipo, caloriasMinimas): List<String>` (1.0 pto):**
   - Filtra sesiones del tipo indicado con `caloriesBurned >= caloriasMinimas`.
   - Ordena por duración en minutos de mayor a menor (`durationMinutes` descendente).
   - Retorna los títulos en mayúsculas (`it.title.uppercase()`).
   - Si no hay coincidencias, retorna una lista vacía.

2. **`calcularDistanciaTotalPorTipo(sesiones, tipo): Double` (1.0 pto):**
   - Filtra por el tipo de deporte solicitado.
   - Descarta de forma segura los valores nulos de distancia (`mapNotNull { it.distanceKm }`).
   - Suma total con `sum()`. Si no hay distancias o la lista está vacía, devuelve `0.0`.

3. **`contarCaloriasTotalesPorTipo(sesiones): Map<WorkoutType, Int>` (1.0 pto):**
   - Agrupa las sesiones por tipo (`groupBy { it.type }`).
   - Mapea cada grupo a la suma total de sus calorías (`mapValues { it.value.sumOf { s -> s.caloriesBurned } }`).
   - Tipos sin sesiones no deben figurar en el mapa.

4. **`podioSesionesMasLargas(sesiones, topN): List<WorkoutSession>` (1.0 pto):**
   - Valida que `topN > 0` con `require()`. Si es `<= 0`, lanza `IllegalArgumentException`.
   - Ordena por duración en minutos descendente y toma los primeros `topN` elementos (`take()`).
   - Si la lista tiene menos sesiones que el límite, devuelve todas las disponibles ordenadas.

5. **`buscarSesionPorId(sesiones, idBuscado): WorkoutSession?` (1.0 pto):**
   - Si `idBuscado` es nulo o está en blanco (`isNullOrBlank()`), retorna `null`.
   - Busca la primera sesión cuyo `id` coincida ignorando mayúsculas y minúsculas (`equals(..., ignoreCase = true)`).
   - Si no hay coincidencias, retorna `null`.

---

### Parte 2 (5.0 pts): Funcionalidad CLI en `app/Main.kt`

Abre `src/main/kotlin/app/Main.kt` y completa las 3 funciones de soporte:

1. **`generarDashboardEntrenamientos(sesiones: List<WorkoutSession>): String` (2.0 ptos):**
   - Formatea el historial de entrenamientos en una tabla de consola mediante una cabecera y una única llamada a `sesiones.joinToString("\n") { ... }`.
   - Formato por fila: `%-5s | %-20s | %-12s | %5d min | %6d kcal | %10s | %8s`
   - Si `distanceKm` es nulo, muestra `"N/A"`; si no, `"%.2f km"`.
   - Si `avgHeartRate` es nulo, muestra `"N/A"`; si no, `"%d bpm"`.
   - **No utilices bucles `for` ni llamadas directas a `println` dentro de la función.**

2. **`ampliarSesion(sesion: WorkoutSession, minutosExtra: Int, caloriasExtra: Int): TrackerResult` (2.0 ptos):**
   - Valida que `minutosExtra > 0` y `caloriasExtra > 0`. Si no, retorna `TrackerResult.Error("Los minutos y calorías adicionales deben ser estrictamente positivos")`.
   - Si es válido, crea una **nueva instancia inmutable** mediante `sesion.copy(...)`:
     - `durationMinutes` incrementado con `minutosExtra`.
     - `caloriesBurned` incrementado con `caloriasExtra`.
   - Retorna `TrackerResult.Success` con el mensaje:
     `"¡Sesión ampliada con éxito! Total acumulado: <MINUTOS> min / <CALORIAS> kcal"` y la sesión actualizada.

3. **`imprimirResultadoOperacion(resultado: TrackerResult)` (1.0 pto):**
   - Evalúa `resultado` mediante un `when` exhaustivo:
     - `is TrackerResult.Success`: Imprime `"✅ <message>"`
     - `is TrackerResult.Error`: Imprime `"❌ ERROR: <reason>"`

---

## 🛠️ Comandos de Comprobación

```bash
# Ejecutar la suite de pruebas unitarias (Parte 1)
./gradlew test

# Ejecutar la aplicación de consola (Parte 2)
./gradlew run
```
