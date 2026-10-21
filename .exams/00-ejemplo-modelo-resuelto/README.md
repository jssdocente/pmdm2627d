# Proyecto Modelo Resuelto: HeroAcademy (PMDM)

Este proyecto sirve como **guía de referencia y modelo de resolución** para los simulacros y el examen práctico de programación en Kotlin del módulo PMDM (2º DAM).

---

## 🎯 Estructura de la Evaluación (50% TDD / 50% Funcionalidad)

Los exámenes y simulacros constan de dos partes complementarias:

1. **Parte 1 (50% - TDD / Pruebas Unitarias Automatizadas):**
   - En `src/test/kotlin/service/HeroeServiceTest.kt` se proporciona una suite completa de tests unitarios que definen los requisitos exactos de la lógica de negocio.
   - En `src/main/kotlin/service/HeroeService.kt` el alumno encontrará los métodos con `TODO("Pendiente de implementar")`.
   - **Objetivo:** Implementar los métodos utilizando **pipelines declarativos** hasta que la ejecución de `./gradlew test` pase al 100% en verde.

2. **Parte 2 (50% - Funcionalidad / CLI en Main):**
   - En `src/main/kotlin/app/Main.kt` se proporciona un esqueleto ejecutable con datos de prueba y la firma de funciones de orquestación (`TODO`).
   - **Objetivo:** Completar las funciones para mostrar los datos en consola, gestionar estados inmutables con `.copy()` y controlar flujos con `when` sobre `sealed interface`.

---

## 🚀 Cómo Ejecutar el Proyecto

### Ejecutar las pruebas unitarias (TDD)
```bash
./gradlew test
```
O desde IntelliJ IDEA: botón secundario en la carpeta `src/test/kotlin` -> **Run 'Tests in 'test''**.

### Ejecutar la aplicación de consola (Main)
```bash
./gradlew run
```
O desde IntelliJ IDEA: abrir `src/main/kotlin/app/Main.kt` y pulsar el triángulo verde `Run` junto a `fun main()`.

---

## 🧠 Mentalidad Declarativa: Comparativa Imperativo vs. Pipeline

### Ejemplo 1: Filtrado, ordenación y transformación
*«Obtener los nombres en mayúsculas de los magos con nivel >= 5 ordenados por poder descendente».*

```kotlin
// ❌ ENFOQUE IMPERATIVO (1º DAM - A evitar)
val lista = mutableListOf<String>()
for (h in heroes) {
    if (h.rol == RolHeroe.MAGO && h.nivel >= 5) {
        lista.add(h.nombre.uppercase())
    }
}
// Requiere ordenación manual adicional...

// ✅ PIPELINE DECLARATIVO (PMDM - Kotlin)
heroes
    .filter { it.rol == RolHeroe.MAGO && it.nivel >= 5 }
    .sortedByDescending { it.poder }
    .map { it.nombre.uppercase() }
```

### Ejemplo 2: Agrupación y conteo
*«Contar cuántos héroes hay registrados en cada rol».*

```kotlin
// ❌ ENFOQUE IMPERATIVO (1º DAM - A evitar)
val mapa = mutableMapOf<RolHeroe, Int>()
for (h in heroes) {
    val actual = mapa[h.rol] ?: 0
    mapa[h.rol] = actual + 1
}

// ✅ PIPELINE DECLARATIVO (PMDM - Kotlin)
heroes
    .groupBy { it.rol }
    .mapValues { (_, lista) -> lista.size }
```

### Ejemplo 3: Inmutabilidad con `copy()`
*«Modificar el nivel y poder de un héroe».*

```kotlin
// ❌ MUTACIÓN DIRECTA (A evitar en estados reactivos)
heroe.nivel = nuevoNivel // Error si la propiedad es val, mala práctica si es var

// ✅ NUEVA INSTANCIA INMUTABLE CON COPY
val heroeActualizado = heroe.copy(
    nivel = nuevoNivel,
    poder = heroe.poder + incremento
)
```
