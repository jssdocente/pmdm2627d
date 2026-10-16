package com.dam.pmdmlab03.codelabs.codelab03_catalogo

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Architecture
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.DataObject
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Storage
import androidx.compose.ui.graphics.vector.ImageVector

data class CursoTecnologico(
    val id: Int,
    val titulo: String,
    val nivel: String,
    val icono: ImageVector,
    val descripcionCorta: String,
    val contenidoDetallado: String
)

val CATALOGO_CURSOS = listOf(
    CursoTecnologico(
        id = 1,
        titulo = "Jetpack Compose Fundamentos",
        nivel = "Básico",
        icono = Icons.Filled.PhoneAndroid,
        descripcionCorta = "Construcción declarativa de interfaces modernas en Android.",
        contenidoDetallado = "Aprende funciones Composable, modificadores de tamaño, layouts básicos (Row, Column, Box) y arquitectura reactiva con remember y mutableStateOf."
    ),
    CursoTecnologico(
        id = 2,
        titulo = "Material Design 3 & Theming",
        nivel = "Intermedio",
        icono = Icons.Filled.Architecture,
        descripcionCorta = "Diseño profesional accesible y soporte de Modo Oscuro.",
        contenidoDetallado = "Domina los roles de color semánticos de ColorScheme, escalas tipográficas adaptativas, radios de curvatura con Shapes y tokens de diseño Material You."
    ),
    CursoTecnologico(
        id = 3,
        titulo = "Arquitectura de UI con ViewModel",
        nivel = "Avanzado",
        icono = Icons.Filled.DataObject,
        descripcionCorta = "Supervivencia a rotaciones y flujo unidireccional (UDF).",
        contenidoDetallado = "Estructura pantallas con StateFlow y UiState inmutable, desacoplando la lógica de negocio de la interfaz gráfica y evitando fugas de memoria."
    ),
    CursoTecnologico(
        id = 4,
        titulo = "Persistencia Local con Room",
        nivel = "Avanzado",
        icono = Icons.Filled.Storage,
        descripcionCorta = "Bases de datos SQLite reactivas con corrutinas de Kotlin.",
        contenidoDetallado = "Mapeo relacional con @Entity, consultas seguras en tiempo de compilación con @Dao y flujos en tiempo real con Flow."
    ),
    CursoTecnologico(
        id = 5,
        titulo = "Kotlin Corrutinas y Asincronía",
        nivel = "Intermedio",
        icono = Icons.Filled.Code,
        descripcionCorta = "Programación asíncrona no bloqueante en el hilo de UI.",
        contenidoDetallado = "Gestiona suspensiones con suspend, despachadores Dispatchers.IO / Main, constructores launch / async y manejo de excepciones estructurado."
    )
)
