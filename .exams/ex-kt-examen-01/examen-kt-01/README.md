# Examen Práctico Oficial: MobilityHub Fleet Command (PMDM - 2º DAM)

¡Bienvenido al **Examen Práctico de Programación en Kotlin**! Esta prueba evalúa de forma rigurosa tus competencias en **pipelines declarativos**, inmutabilidad, control de flujo con tipos sellados y desarrollo guiado por pruebas (**TDD**).

---

## ⏱️ Duración y Puntuación Total

- **Puntuación Máxima:** 10 Puntos
  - **Parte 1 (TDD - Pruebas Unitarias Automatizadas):** 5.0 Puntos
  - **Parte 2 (Funcionalidad CLI en Main):** 5.0 Puntos
- **Requisito Determinante:** Pensamiento declarativo.
  > ⚠️ **Penalización Anti-Imperativo:** El empleo de bucles clásicos (`for`, `while`) junto con acumuladores mutables (`var`, `mutableListOf` + `.add()`) en la resolución de colecciones supondrá una **penalización del 50% de la nota de ese ejercicio**, aun cuando los tests pasen en verde.

---

## 📋 Instrucciones de Trabajo

### Parte 1 (5.0 pts): TDD en `service/FleetAnalyticsService.kt`

Abre `src/test/kotlin/service/FleetAnalyticsServiceTest.kt` y ejecútalo con `./gradlew test` o desde IntelliJ IDEA. Observarás que los tests fallan inicialmente (**Semáforo Rojo**).

Tu labor es sustituir las sentencias `TODO()` en `src/main/kotlin/service/FleetAnalyticsService.kt` mediante **pipelines de funciones de orden superior** (`filter`, `map`, `sortedByDescending`, `groupBy`, etc.) hasta que todos los tests pasen al 100% en verde (**Semáforo Verde**):

1. **`obtenerModelosDisponibles(flota, tipo, bateriaMinima): List<String>` (1.0 pto):**
   - Filtra los vehículos del tipo solicitado que NO estén en mantenimiento (`!it.enMantenimiento`) y cuya batería sea superior o igual a `bateriaMinima` (`it.bateriaPct >= bateriaMinima`).
   - Ordena por nivel de batería de mayor a menor (`bateriaPct` descendente).
   - Retorna los nombres de los modelos en mayúsculas (`it.modelo.uppercase()`).
   - Si no hay coincidencias, devuelve una lista vacía.

2. **`calcularTarifaMediaPorTipo(flota, tipo): Double` (1.0 pto):**
   - Filtra los vehículos del tipo indicado.
   - Calcula la tarifa media por minuto (`map { it.tarifaMinuto }.average()`).
   - Si no hay vehículos de ese tipo o la lista está vacía, devuelve `0.0` de forma segura.

3. **`contarVehiculosOperativosPorTipo(flota): Map<TipoVehiculo, Int>` (1.0 pto):**
   - Filtra solo las unidades operativas que no estén en taller (`!it.enMantenimiento`).
   - Agrupa los vehículos por tipo (`groupBy { it.tipo }`).
   - Mapea cada grupo al recuento de unidades (`mapValues { it.value.size }`).
   - Tipos sin unidades operativas no deben figurar como claves en el mapa.

4. **`topVehiculosMayorUso(flota, limite): List<Vehiculo>` (1.0 pto):**
   - Valida que `limite > 0` con `require()`. Si es `<= 0`, lanza `IllegalArgumentException`.
   - Ordena por `totalViajes` descendente y toma los primeros `limite` elementos (`take()`).
   - Si la lista contiene menos vehículos que el límite, devuelve todos los disponibles ordenados.

5. **`buscarVehiculoPorUbicacion(flota, fragmentoUbicacion): Vehiculo?` (1.0 pto):**
   - Si `fragmentoUbicacion` es nulo o está en blanco (`isNullOrBlank()`), devuelve `null`.
   - Busca el primer vehículo cuya `ubicacionActual` contenga `fragmentoUbicacion` ignorando mayúsculas y minúsculas (`contains(..., ignoreCase = true)`).
   - Si no hay coincidencias, devuelve `null`.

---

### Parte 2 (5.0 pts): Funcionalidad CLI en `app/Main.kt`

Abre `src/main/kotlin/app/Main.kt` y completa las 3 funciones de soporte:

1. **`generarDashboardFlota(flota: List<Vehiculo>): String` (2.0 ptos):**
   - Formatea el estado de la flota en una tabla de consola mediante una cabecera y una única llamada a `flota.joinToString("\n") { ... }`.
   - Formato por fila: `%-5s | %-18s | %-10s | %7d %% | %6.2f €/min | %6d | %-20s | %s`
   - Si `ubicacionActual` es nula, muestra `"N/A"`.
   - Si `enMantenimiento` es true, muestra `"TALLER"`; si es false, `"OPERATIVO"`.
   - **No utilices bucles `for` ni llamadas directas a `println` dentro de la función.**

2. **`registrarViaje(vehiculo, minutosDuracion, consumoBateriaPct, nuevaUbicacion): OperacionFlotaResult` (2.0 ptos):**
   - Validaciones:
     - Si `vehiculo.enMantenimiento`, retorna `OperacionFlotaResult.Error("No se puede iniciar viaje: vehículo en taller")`.
     - Si `minutosDuracion <= 0 || consumoBateriaPct <= 0`, retorna `OperacionFlotaResult.Error("La duración y el consumo deben ser estrictamente positivos")`.
     - Si `vehiculo.bateriaPct < consumoBateriaPct`, retorna `OperacionFlotaResult.Error("Batería insuficiente para realizar el viaje")`.
   - Si es válido, produce una **nueva instancia inmutable** mediante `vehiculo.copy(...)`:
     - `bateriaPct` reducido con `consumoBateriaPct`.
     - `totalViajes` incrementado en 1.
     - `ubicacionActual` actualizada con `nuevaUbicacion`.
   - Retorna `OperacionFlotaResult.Exito` con el mensaje:
     `"Viaje de <MINUTOS> min registrado en <MODELO>. Batería restante: <BATERIA>%"` y el vehículo actualizado.

3. **`imprimirResultadoOperacion(resultado: OperacionFlotaResult)` (1.0 pto):**
   - Evalúa `resultado` mediante un `when` exhaustivo:
     - `is OperacionFlotaResult.Exito`: Imprime `"✅ <mensaje>"`
     - `is OperacionFlotaResult.Error`: Imprime `"❌ ERROR: <motivo>"`

---

## 🛠️ Comandos de Comprobación

```bash
# Ejecutar la suite de pruebas unitarias (Parte 1)
./gradlew test

# Ejecutar la aplicación de consola (Parte 2)
./gradlew run
```
