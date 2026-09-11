##  FASE 3: Capa de Presentación - ViewModel {#fase-3-capa-de-presentación}

La capa de presentación gestiona el **estado de la UI** y coordina la lógica de presentación. El ViewModel es el componente central que conecta la UI con los casos de uso.

### ¿Qué es un ViewModel?

El **ViewModel** en MVVM:
- ✅ Gestiona el estado de la UI (HomeUiState)
- ✅ Sobrevive a cambios de configuración (rotación de pantalla)
- ✅ Coordina casos de uso (GameUseCases)
- ✅ Transforma datos del dominio para la UI
- ✅ Maneja eventos del usuario (clicks, búsquedas)
- ✅ NO tiene referencias a Views/Composables (evita memory leaks)

### Arquitectura MVVM

```
┌────────────────────────────────────────┐
│          VIEW (UI)                     │
│      HomeScreen (Composable)           │
│                                        │
│  - Observa uiState                     │
│  - Renderiza según estado              │
│  - Emite eventos al ViewModel          │
└──────────────┬─────────────────────────┘
               │ collectAsState()
               │ viewModel.onEvent()
┌──────────────▼─────────────────────────┐
│         VIEWMODEL                      │
│        HomeViewModel                   │
│                                        │
│  - StateFlow<HomeUiState>              │
│  - Coordina GameUseCases               │
│  - Maneja Resource states              │
│  - Actualiza UI state                  │
└──────────────┬─────────────────────────┘
               │ gameUseCases.method()
┌──────────────▼─────────────────────────┐
│         USE CASES                      │
│        GameUseCases                    │
│                                        │
│  - Lógica de negocio                   │
│  - Transforma datos                    │
└────────────────────────────────────────┘
```


---

###  Paso 3.1: Crear HomeUiState

El estado UI es un **data class inmutable** que representa TODO lo que la UI necesita para renderizarse.

**Ubicación**: `app/src/main/java/com/pmdm/mygamestore/presentation/viewmodel/HomeViewModel.kt`

```kotlin
package com.pmdm.mygamestore.presentation.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.pmdm.mygamestore.data.repository.GamesRepository
import com.pmdm.mygamestore.data.repository.MockGamesRepositoryImpl
import com.pmdm.mygamestore.data.repository.SessionManager
import com.pmdm.mygamestore.data.repository.SessionManagerImpl
import com.pmdm.mygamestore.domain.model.AppError
import com.pmdm.mygamestore.domain.model.Game
import com.pmdm.mygamestore.domain.model.GameCategory
import com.pmdm.mygamestore.domain.model.DateInterval
import com.pmdm.mygamestore.domain.model.Platform
import com.pmdm.mygamestore.domain.model.Resource
import com.pmdm.mygamestore.domain.usecase.GameUseCases
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 *  Estado UI de la pantalla Home
 *
 * PATRÓN: Single Source of Truth
 * - Toda la información de la UI está en un solo objeto
 * - La UI es función del estado: UI = f(state)
 * - Cambio de estado → Recomposición automática
 *
 * Representa TODO lo que la UI necesita para renderizarse.
 *
 * INMUTABILIDAD:
 * - Es data class con val (inmutable)
 * - No se modifica directamente
 * - Se crea nueva instancia con copy()
 *
 * @property games Lista de juegos a mostrar en el grid
 * @property isLoading Indica si hay una operación en progreso
 * @property errorMessage Mensaje de error a mostrar (null si no hay)
 * @property username Nombre del usuario logueado (para TopBar)
 * @property searchQuery Texto actual de búsqueda
 * @property selectedCategory Categoría seleccionada en filtros
 * @property selectedPlatform Plataforma seleccionada en filtros
 * @property selectedInterval Intervalo de fechas seleccionado en filtros
 */
data class HomeUiState(
    val games: List<Game> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val username: String? = null,
    
    // Filtros activos
    val searchQuery: String = "",
    val selectedCategory: GameCategory = GameCategory.ALL,
    val selectedPlatform: Platform = Platform.ALL,
    val selectedInterval: DateInterval = DateInterval.ALL_TIME,
)
```


** Conceptos del Estado UI:**

**1. ¿Por qué data class?**
```kotlin
// data class genera automáticamente:
val state1 = HomeUiState(games = listOf())
val state2 = state1.copy(isLoading = true) // ✅ Copia con cambios

// equals(): compara por contenido
state1 == state2 // false (isLoading es diferente)

// toString(): para debugging
println(state1) // HomeUiState(games=[], isLoading=false, ...)
```


**2. Single Source of Truth:**
```kotlin
// ❌ MAL: Estado disperso
var games: List<Game> = emptyList()
var isLoading = false
var error: String? = null
// Difícil de sincronizar

// ✅ BIEN: Estado centralizado
val uiState = HomeUiState(
    games = emptyList(),
    isLoading = false,
    errorMessage = null
)
```


---

###  Paso 3.2: Crear HomeViewModel

El ViewModel coordina toda la lógica de la pantalla Home.

```kotlin
/**
 *  ViewModel para la pantalla Home
 *
 * PATRÓN MVVM:
 * - Model: Game, GameUseCases, GamesRepository
 * - View: HomeScreen (Composable)
 * - ViewModel: HomeViewModel (esta clase)
 *
 * RESPONSABILIDADES:
 * ✅ Gestionar el estado de la UI (HomeUiState)
 * ✅ Coordinar casos de uso (GameUseCases)
 * ✅ Manejar eventos del usuario (búsqueda, filtros, clicks)
 * ✅ Transformar Resource en estado UI
 * ✅ Gestionar corrutinas con viewModelScope
 * ✅ NO tiene referencias a Views (evita memory leaks)
 *
 * MANEJO DE RESOURCE:
 * - Resource.Loading → uiState.isLoading = true
 * - Resource.Success → uiState.games = data
 * - Resource.Error → uiState.errorMessage = error
 *
 * IMPORTANTE - Sin DI por ahora:
 * - gameUseCases se instancia directamente aquí
 * - sessionManager se instancia directamente aquí
 * - Cuando se implemente Koin, se recibirán por constructor
 *
 * @param context Contexto de Android (para SessionManager)
 */
class HomeViewModel(
    context: Context
) : ViewModel() {

    //  Dependencias instanciadas directamente (temporal, antes de Koin)
    // Cuando implementes Koin DI, estas líneas se eliminarán
    // y las dependencias se recibirán por constructor
    private val gamesRepository: GamesRepository = MockGamesRepositoryImpl()
    private val gameUseCases = GameUseCases(gamesRepository)
    private val sessionManager: SessionManager = SessionManagerImpl(context)

    //  Estado privado mutable (solo modificable desde el ViewModel)
    private val _uiState = MutableStateFlow(HomeUiState())
    
    //  Estado público inmutable (expuesto a la UI)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        //  Cargar datos iniciales al crear el ViewModel
        loadUsername()
        loadGames()
    }

    /**
     *  Carga el nombre del usuario desde SessionManager
     *
     * Se ejecuta en paralelo con loadGames() gracias a viewModelScope.
     * Cada launch crea una corrutina independiente.
     */
    private fun loadUsername() {
        viewModelScope.launch {
            sessionManager.getUsername()
                .catch { exception ->
                    // Manejo de errores en el Flow
                    // No bloqueamos la carga de juegos si falla esto
                    println("Error loading username: ${exception.message}")
                }
                .collect { username ->
                    _uiState.update { it.copy(username = username) }
                }
        }
    }

    /**
     *  Carga los juegos aplicando filtros activos
     *
     * LÓGICA DE PRIORIDAD DE FILTROS:
     * 1. Búsqueda por texto (mayor prioridad)
     * 2. Intervalo de fechas
     * 3. Plataforma
     * 4. Categoría
     * 5. Todos los juegos (sin filtros)
     *
     * MANEJO DE RESOURCE:
     * - Loading → Mostrar spinner
     * - Success → Mostrar juegos
     * - Error → Mostrar mensaje
     */
    fun loadGames() {
        viewModelScope.launch {
            val currentState = _uiState.value
            
            // Determinar qué UseCase llamar según filtros activos
            val gamesFlow = when {
                //  Prioridad 1: Búsqueda por texto
                currentState.searchQuery.isNotBlank() -> {
                    gameUseCases.searchGames(currentState.searchQuery)
                }
                
                //  Prioridad 2: Filtro por intervalo de fechas
                currentState.selectedInterval != DateInterval.ALL_TIME -> {
                    gameUseCases.getGamesInterval(currentState.selectedInterval)
                }
                
                //  Prioridad 3: Filtro por plataforma
                currentState.selectedPlatform != Platform.ALL -> {
                    gameUseCases.getGamesByPlatform(currentState.selectedPlatform)
                }
                
                //  Prioridad 4: Filtro por categoría
                currentState.selectedCategory != GameCategory.ALL -> {
                    gameUseCases.getGamesByCategory(currentState.selectedCategory)
                }
                
                //  Por defecto: Todos los juegos
                else -> {
                    gameUseCases.getAllGames()
                }
            }

            //  Recolectar el Flow y manejar Resource
            gamesFlow.collect { resource ->
                when (resource) {
                    is Resource.Loading -> {
                        // ⏳ Estado Loading: Mostrar spinner
                        _uiState.update { 
                            it.copy(
                                isLoading = true,
                                errorMessage = null
                            )
                        }
                    }
                    
                    is Resource.Success -> {
                        // ✅ Estado Success: Mostrar juegos
                        _uiState.update { 
                            it.copy(
                                games = resource.data,
                                isLoading = false,
                                errorMessage = null
                            )
                        }
                    }
                    
                    is Resource.Error -> {
                        // ❌ Estado Error: Mostrar mensaje
                        val errorMsg = when (resource.error) {
                            is AppError.NetworkError -> 
                                "No internet connection. Please check your network."
                            is AppError.NotFound -> 
                                "No games found."
                            is AppError.DatabaseError -> 
                                "Database error. Please try again."
                            is AppError.Unauthorized -> 
                                "You need to login to access this content."
                            is AppError.ValidationError -> 
                                resource.error.message
                            is AppError.Unknown -> 
                                resource.error.message
                        }
                        
                        _uiState.update {
                            it.copy(
                                isLoading = false,
                                errorMessage = errorMsg
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     *  Evento: Usuario escribe en la búsqueda
     *
     * @param query Nuevo texto de búsqueda
     */
    fun onSearchQueryChange(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        loadGames() // Recargar con nuevo criterio
    }

    /**
     *  Evento: Usuario selecciona una categoría
     *
     * @param category Nueva categoría
     */
    fun onCategorySelected(category: GameCategory) {
        _uiState.update { 
            it.copy(
                selectedCategory = category,
                // Limpiar otros filtros al seleccionar categoría
                searchQuery = "",
                selectedInterval = DateInterval.ALL_TIME,
                selectedPlatform = Platform.ALL
            )
        }
        loadGames()
    }

    /**
     *  Evento: Usuario selecciona una plataforma
     *
     * @param platform Nueva plataforma
     */
    fun onPlatformSelected(platform: Platform) {
        _uiState.update { 
            it.copy(
                selectedPlatform = platform,
                searchQuery = "",
                selectedInterval = DateInterval.ALL_TIME,
                selectedCategory = GameCategory.ALL
            )
        }
        loadGames()
    }

    /**
     *  Evento: Usuario selecciona un intervalo de fechas
     *
     * @param interval Nuevo intervalo
     */
    fun onIntervalSelected(interval: DateInterval) {
        _uiState.update { 
            it.copy(
                selectedInterval = interval,
                searchQuery = "",
                selectedCategory = GameCategory.ALL,
                selectedPlatform = Platform.ALL
            )
        }
        loadGames()
    }

    /**
     *  Evento: Usuario hace pull-to-refresh
     */
    fun refreshGames() {
        loadGames()
    }

    /**
     * ❌ Limpia el mensaje de error después de mostrarlo
     */
    fun clearError() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    /**
     *  Limpia todos los filtros y vuelve a estado inicial
     */
    fun clearAllFilters() {
        _uiState.update {
            it.copy(
                searchQuery = "",
                selectedCategory = GameCategory.ALL,
                selectedPlatform = Platform.ALL,
                selectedInterval = DateInterval.ALL_TIME
            )
        }
        loadGames()
    }
}
```


---

###  Paso 3.3: Crear HomeViewModelFactory

El Factory es necesario porque HomeViewModel necesita Context, que no se puede pasar directamente.

```kotlin
/**
 *  Factory para crear HomeViewModel
 *
 * PROPÓSITO:
 * - ViewModel necesita Context para SessionManager
 * - ViewModelProvider.Factory permite pasar parámetros al constructor
 *
 * IMPORTANTE - TEMPORAL:
 * ✅ Esta factory es TEMPORAL
 * ✅ Solo existe porque HomeViewModel necesita Context
 * ✅ Cuando se implemente Koin DI, esta clase se ELIMINARÁ
 * ✅ En su lugar: viewModel = koinViewModel()
 *
 * MIGRACIÓN A KOIN:
 * ```kotlin
 * // Antes (con Factory)
 * val viewModel: HomeViewModel = viewModel(
 *     factory = HomeViewModelFactory(context)
 * )
 *
 * // Después (con Koin)
 * val viewModel: HomeViewModel = koinViewModel()
 * ```
 *
 * @param context Contexto de Android
 */
class HomeViewModelFactory(
    private val context: Context
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            return HomeViewModel(context) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }
}
```


---

###  Conceptos clave del ViewModel

#### 1. **StateFlow vs MutableStateFlow**

```kotlin
// Privado: Solo el ViewModel puede modificar
private val _uiState = MutableStateFlow(HomeUiState())

// Público: La UI solo puede observar (read-only)
val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
```


**¿Por qué este patrón?**
- ✅ Encapsulación: La UI no puede modificar el estado
- ✅ Unidirectional Data Flow: Solo el ViewModel actualiza
- ✅ Previene bugs: Cambios solo desde un lugar

#### 2. **update { } vs value =**

```kotlin
// ❌ Menos seguro en concurrencia
_uiState.value = _uiState.value.copy(isLoading = true)

// ✅ Thread-safe, atómico
_uiState.update { it.copy(isLoading = true) }
```


**update()** garantiza que:
- Las actualizaciones son atómicas
- No se pierde ningún cambio en concurrencia
- Sintaxis más limpia

#### 3. **viewModelScope**

```kotlin
// ✅ Se cancela automáticamente cuando ViewModel se destruye
viewModelScope.launch {
    // Operaciones asíncronas
}

// ❌ No uses GlobalScope (no se cancela nunca)
GlobalScope.launch { ... }
```


**Ventajas de viewModelScope:**
- Vinculado al ciclo de vida del ViewModel
- Se cancela automáticamente en onCleared()
- Previene memory leaks

#### 4. **Flow.collect vs Flow.collectLatest**

```kotlin
// collect: Procesa cada emisión completa
flow.collect { value ->
    // Se ejecuta para cada valor
}

// collectLatest: Cancela emisión anterior si llega una nueva
flow.collectLatest { value ->
    // Solo procesa el valor más reciente
    // Útil para búsquedas en tiempo real
}
```


#### 5. **catch operator para manejo de errores**

```kotlin
flow
    .catch { exception ->
        // Maneja errores en el Flow
        emit(defaultValue)
    }
    .collect { value ->
        // Procesar valor
    }
```


---

###  Flujo completo de datos con Resource

```
┌─────────────────────────────────────────────────┐
│  1. Usuario escribe "zelda" en búsqueda         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  2. HomeScreen llama:                           │
│     viewModel.onSearchQueryChange("zelda")      │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  3. HomeViewModel:                              │
│     _uiState.update { searchQuery = "zelda" }   │
│     loadGames()                                 │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  4. loadGames() determina UseCase:              │
│     gameUseCases.searchGames("zelda")           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  5. GameUseCases:                               │
│     gamesRepository.searchGames("zelda")        │
│     .map { ordenar por relevancia }             │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  6. MockGamesRepositoryImpl:                    │
│     emit(Resource.Loading)                      │
│     delay(800)                                  │
│     val filtered = mockGames.filter()           │
│     emit(Resource.Success(filtered))            │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  7. GameUseCases.map:                           │
│     when (Resource.Success) {                   │
│       ordenar por relevancia                    │
│       Resource.Success(sorted)                  │
│     }                                           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  8. HomeViewModel.collect:                      │
│     when (resource) {                           │
│       Loading → isLoading = true                │
│       Success → games = resource.data           │
│       Error → errorMessage = ...                │
│     }                                           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│  9. HomeScreen recompone:                       │
│     val uiState by viewModel.uiState            │
│                    .collectAsState()            │
│     LazyVerticalGrid(uiState.games)             │
└─────────────────────────────────────────────────┘
```


---

### ✅ Resumen de la Fase 3

Has completado la **capa de presentación - ViewModel** con:

1. ✅ **HomeUiState** con todos los datos necesarios para la UI:
   - Lista de juegos
   - Estados de loading y error
   - Username del usuario
   - Filtros activos (búsqueda, categoría, plataforma, intervalo)

2. ✅ **HomeViewModel** con funcionalidades completas:
   - Gestión de estado con StateFlow
   - Coordinación de GameUseCases
   - Manejo de Resource (Loading, Success, Error)
   - Eventos del usuario (búsqueda, filtros)
   - Integración con SessionManager
   - Prioridad de filtros lógica

3. ✅ **HomeViewModelFactory** temporal para inyección de Context

4. ✅ **Manejo robusto de errores** con mensajes específicos por tipo

**Estructura completa hasta ahora:**
```
domain/
  ├─ model/
  │   ├─ Game.kt
  │   ├─ GameEnums.kt
  │   └─ Resource.kt
  └─ usecase/
      └─ GameUseCases.kt

data/
  ├─ local/
  │   └─ MockGamesDataSource.kt
  └─ repository/
      ├─ GamesRepository.kt
      └─ MockGamesRepositoryImpl.kt

presentation/
  └─ viewmodel/
      └─ HomeViewModel.kt (con Factory)
```
