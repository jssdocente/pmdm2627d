# Bloque 5: Asincronía, Corrutinas y Kotlin Flows

En este quinto bloque te enfrentarás a la **programación asíncrona no bloqueante**, imprescindible para no congelar la pantalla en Android (evitando errores ANR). Aprenderás a utilizar `suspend fun`, constructores de corrutinas (`launch`, `async`), cambio de hilos con `withContext` y flujos reactivos de datos con **`Flow`** y **`StateFlow`**.

📁 **Paquete de trabajo:** `package b05_corrutinas`  
Ubicación en tu proyecto: `src/main/kotlin/b05_corrutinas/`

---

## 🟢 Nivel Básico (Suspensión y Builders)

### Ejercicio 5.1: Funciones de Suspensión con `delay()`
📄 **Archivo:** `E01_SuspendFunDelay.kt`

#### 1. Enunciado y Requisitos
1. Crea una función de suspensión `simularCargaServidor(tarea: String, duracionMs: Long): String`.
2. Dentro de la función, imprime el inicio de la tarea, espera de forma no bloqueante usando `delay(duracionMs)` y devuelve un mensaje de confirmación con el nombre de la tarea completada.
3. Invoca la función dos veces secuencialmente desde un bloque `runBlocking` en `main()`.

#### 2. Salida Esperada en Consola
```text
[INICIO]: Conectando con servidor de base de datos...
-> Completado: Conectando con servidor de base de datos en 1000 ms
[INICIO]: Sincronizando catálogo de juegos...
-> Completado: Sincronizando catálogo de juegos en 1500 ms
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b05_corrutinas

    import kotlinx.coroutines.delay
    import kotlinx.coroutines.runBlocking

    suspend fun simularCargaServidor(tarea: String, duracionMs: Long): String {
        println("[INICIO]: $tarea...")
        delay(duracionMs) // Pausa asíncrona cooperativa (no bloquea el hilo)
        return "-> Completado: $tarea en $duracionMs ms"
    }

    fun main() = runBlocking {
        val r1 = simularCargaServidor("Conectando con servidor de base de datos", 1000)
        println(r1)

        val r2 = simularCargaServidor("Sincronizando catálogo de juegos", 1500)
        println(r2)
    }
    ```

---

### Ejercicio 5.2: `launch` para Tareas en Segundo Plano
📄 **Archivo:** `E02_LaunchFireAndForget.kt`

#### 1. Enunciado y Requisitos
1. En Android es común enviar analíticas de uso a servidores en segundo plano sin detener la ejecución de la UI (*Fire and Forget*).
2. Utiliza `launch` dentro de un `runBlocking` para lanzar una tarea que tarde 800 ms en enviar un log simulado.
3. Comprueba que el código principal continúa ejecutándose inmediatamente sin esperar a que el `launch` finalice.

#### 2. Salida Esperada en Consola
```text
Hilo principal: Usuario ha pulsado el botón 'Ver Detalles'
Hilo principal: Abriendo pantalla inmediatamente...
[SEGUNDO PLANO]: Analítica enviada a Google Analytics (800 ms después)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b05_corrutinas

    import kotlinx.coroutines.delay
    import kotlinx.coroutines.launch
    import kotlinx.coroutines.runBlocking

    fun main() = runBlocking {
        // Lanzamos la corrutina en segundo plano:
        launch {
            delay(800)
            println("[SEGUNDO PLANO]: Analítica enviada a Google Analytics (800 ms después)")
        }

        // El hilo principal sigue sin detenerse:
        println("Hilo principal: Usuario ha pulsado el botón 'Ver Detalles'")
        println("Hilo principal: Abriendo pantalla inmediatamente...")
    }
    ```

---

## 🟡 Nivel Intermedio (Concurrencia Paralela y Dispatchers)

### Ejercicio 5.3: Descarga Concurrente en Paralelo con `async` y `await`
📄 **Archivo:** `E03_AsyncAwaitParalelo.kt`

#### 1. Enunciado y Requisitos
1. Modela dos funciones de suspensión:
   - `obtenerPerfilUsuario(): String`: Tarda 1200 ms y devuelve `"Perfil: Elena (Nivel 40)"`.
   - `obtenerAmigosConectados(): List<String>`: Tarda 1500 ms y devuelve `listOf("Carlos", "Sofía", "Mateo")`.
2. Si se ejecutaran en serie, tardarían `1200 + 1500 = 2700 ms`.
3. Utiliza **`async`** para arrancar ambas peticiones **simultáneamente en paralelo**, y utiliza **`.await()`** para esperar ambos resultados. Mide el tiempo total demostrando que toma aproximadamente 1500 ms (el tiempo de la más lenta).

#### 2. Salida Esperada en Consola
```text
Iniciando descargas en paralelo...
Perfil recibido: Perfil: Elena (Nivel 40)
Amigos online: [Carlos, Sofía, Mateo]
Tiempo total transcurrido: ~1520 ms (¡Paralelo real!)
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b05_corrutinas

    import kotlinx.coroutines.async
    import kotlinx.coroutines.delay
    import kotlinx.coroutines.runBlocking

    suspend fun obtenerPerfilUsuario(): String {
        delay(1200)
        return "Perfil: Elena (Nivel 40)"
    }

    suspend fun obtenerAmigosConectados(): List<String> {
        delay(1500)
        return listOf("Carlos", "Sofía", "Mateo")
    }

    fun main() = runBlocking {
        println("Iniciando descargas en paralelo...")
        val inicio = System.currentTimeMillis()

        // Arrancamos ambas tareas concurrentemente:
        val perfilDeferred = async { obtenerPerfilUsuario() }
        val amigosDeferred = async { obtenerAmigosConectados() }

        // Esperamos la resolución de ambas:
        val perfil = perfilDeferred.await()
        val amigos = amigosDeferred.await()

        val tiempoTotal = System.currentTimeMillis() - inicio

        println("Perfil recibido: $perfil")
        println("Amigos online: $amigos")
        println("Tiempo total transcurrido: $tiempoTotal ms (¡Paralelo real!)")
    }
    ```

---

### Ejercicio 5.4: Cambio de Hilos con `withContext(Dispatchers.IO)`
📄 **Archivo:** `E04_WithContextDispatchers.kt`

#### 1. Enunciado y Requisitos
1. Crea una función de suspensión `leerArchivoLocal(nombre: String): String`.
2. Dentro de la función, utiliza `withContext(Dispatchers.IO)` para simular la lectura pesada de un archivo en el grupo de hilos de Entrada/Salida.
3. Imprime el nombre del hilo actual (`Thread.currentThread().name`) antes de entrar al `withContext`, dentro de él, y después de salir.

#### 2. Salida Esperada en Consola
```text
Antes: Hilo actual -> main
Dentro de withContext: Hilo actual -> DefaultDispatcher-worker-... (Hilo IO)
Después: Hilo actual -> main (Retorno seguro al hilo original)
Contenido leído: 250 registros de partidas cargados.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b05_corrutinas

    import kotlinx.coroutines.Dispatchers
    import kotlinx.coroutines.delay
    import kotlinx.coroutines.runBlocking
    import kotlinx.coroutines.withContext

    suspend fun leerArchivoLocal(nombre: String): String {
        println("Antes: Hilo actual -> ${Thread.currentThread().name}")

        val datos = withContext(Dispatchers.IO) {
            println("Dentro de withContext: Hilo actual -> ${Thread.currentThread().name} (Hilo IO)")
            delay(500)
            "250 registros de partidas cargados."
        }

        println("Después: Hilo actual -> ${Thread.currentThread().name} (Retorno seguro al hilo original)")
        return datos
    }

    fun main() = runBlocking {
        val resultado = leerArchivoLocal("partidas.dat")
        println("Contenido leído: $resultado")
    }
    ```

---

## 🔴 Nivel Avanzado (Kotlin Flows y Reto de Estado Reactivo)

### Ejercicio 5.5: Emisión de Sensor con Kotlin Flow
📄 **Archivo:** `E05_FlowSensorGps.kt`

#### 1. Enunciado y Requisitos
1. Modela una función `sensorCoordenadas(): Flow<Pair<Double, Double>> = flow { ... }`.
2. Emite 4 pares de coordenadas geográficas simulando el movimiento de un jugador, con un intervalo de 400 ms entre cada una.
3. En `main()`, utiliza operadores de transformación `.map` y `.filter` antes de invocar a `.collect { ... }`.

#### 2. Salida Esperada en Consola
```text
=== RECOLECCIÓN DE SENSOR GPS ===
-> Coordenada procesada: [Lat: 40.4168, Lon: -3.7038]
-> Coordenada procesada: [Lat: 40.4172, Lon: -3.7042]
-> Coordenada procesada: [Lat: 40.4180, Lon: -3.7050]
Recolección finalizada.
```

#### 3. Solución Comentada
??? tip "Ver solución comentada"
    ```kotlin
    package b05_corrutinas

    import kotlinx.coroutines.delay
    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.flow
    import kotlinx.coroutines.flow.map
    import kotlinx.coroutines.runBlocking

    fun sensorCoordenadas(): Flow<Pair<Double, Double>> = flow {
        val puntos = listOf(
            40.4168 to -3.7038,
            40.4172 to -3.7042,
            40.4180 to -3.7050,
            40.4190 to -3.7060
        )
        for (coord in puntos) {
            delay(400)
            emit(coord)
        }
    }

    fun main() = runBlocking {
        println("=== RECOLECCIÓN DE SENSOR GPS ===")
        sensorCoordenadas()
            .map { "-> Coordenada procesada: [Lat: ${it.first}, Lon: ${it.second}]" }
            .collect { texto -> println(texto) }

        println("Recolección finalizada.")
    }
    ```

---

### Reto 5.6: Gestor de Descargas Asíncrono con `StateFlow`
📄 **Archivo:** `Reto05_DescargasStateFlow.kt`

#### 1. Contexto de Arquitectura Android
Simularás el comportamiento de un `ViewModel` de Android que descarga recursos pesados y expone su estado reactivo en un **`StateFlow`** inmutable para que la UI se actualice automáticamente.

#### 2. Requisitos Técnicos
1. Modela el estado con una `sealed interface DescargaUiState`:
   - `data object EnEspera : DescargaUiState`
   - `data class Progreso(val porcentaje: Int, val recursoActual: String) : DescargaUiState`
   - `data class Completado(val totalRecursos: Int) : DescargaUiState`
   - `data class Error(val motivo: String) : DescargaUiState`
2. Crea una clase `GestorDescargas` con un `MutableStateFlow<DescargaUiState>` privado expuesto como `StateFlow` de solo lectura.
3. Implementa la función `suspend fun iniciarDescarga()` que descargue concurrentemente tres paquetes (Texturas, Audio, Scripts) actualizando el progreso del `StateFlow` paso a paso.
4. En `main()`, observa el `StateFlow` con una corrutina y comprueba cómo la "UI" reacciona a cada emisión.

#### 3. Salida de Ejemplo en Consola
```text
=== SIMULADOR DE DESCARGAS STATEFLOW ===
UI Observa Estado Inicial: EnEspera
-> Arrancando descarga de recursos...
UI Observa: Progreso -> 33% (Descargando Texturas HD...)
UI Observa: Progreso -> 66% (Descargando Banda Sonora SFX...)
UI Observa: Progreso -> 100% (Descargando Scripts de Partida...)
UI Observa: ¡Completado! -> 3 recursos instalados con éxito.
```

#### 4. Solución Comentada
??? tip "Ver solución comentada paso a paso"
    ```kotlin
    package b05_corrutinas

    import kotlinx.coroutines.*
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    import kotlinx.coroutines.flow.asStateFlow
    import kotlinx.coroutines.flow.update

    sealed interface DescargaUiState {
        data object EnEspera : DescargaUiState
        data class Progreso(val porcentaje: Int, val recursoActual: String) : DescargaUiState
        data class Completado(val totalRecursos: Int) : DescargaUiState
        data class Error(val motivo: String) : DescargaUiState
    }

    class GestorDescargas {
        private val _uiState = MutableStateFlow<DescargaUiState>(DescargaUiState.EnEspera)
        val uiState: StateFlow<DescargaUiState> = _uiState.asStateFlow()

        suspend fun iniciarDescarga() = withContext(Dispatchers.IO) {
            val recursos = listOf("Texturas HD", "Banda Sonora SFX", "Scripts de Partida")

            recursos.forEachIndexed { indice, recurso ->
                delay(600) // Simula tiempo de red por cada asset
                val porcentaje = ((indice + 1) * 100) / recursos.size

                _uiState.update {
                    DescargaUiState.Progreso(porcentaje, "Descargando $recurso...")
                }
            }

            delay(300)
            _uiState.update { DescargaUiState.Completado(recursos.size) }
        }
    }

    fun main() = runBlocking {
        println("=== SIMULADOR DE DESCARGAS STATEFLOW ===")
        val gestor = GestorDescargas()

        // Corrutina que simula a Jetpack Compose observando el StateFlow en segundo plano:
        val jobUi = launch {
            gestor.uiState.collect { estado ->
                when (estado) {
                    is DescargaUiState.EnEspera -> println("UI Observa Estado Inicial: EnEspera")
                    is DescargaUiState.Progreso -> println("UI Observa: Progreso -> ${estado.porcentaje}% (${estado.recursoActual})")
                    is DescargaUiState.Completado -> println("UI Observa: ¡Completado! -> ${estado.totalRecursos} recursos instalados con éxito.")
                    is DescargaUiState.Error -> println("UI Observa: Error crítico -> ${estado.motivo}")
                }
            }
        }

        println("-> Arrancando descarga de recursos...")
        gestor.iniciarDescarga()

        jobUi.cancel() // Finalizamos la observación al terminar la prueba
    }
    ```
