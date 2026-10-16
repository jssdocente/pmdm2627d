package com.dam.pmdmlab03.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val Shapes = Shapes(
    small = RoundedCornerShape(8.dp),     // Chips, botones pequeños
    medium = RoundedCornerShape(16.dp),   // Tarjetas ElevatedCard, campos de texto
    large = RoundedCornerShape(24.dp),    // Diálogos modales AlertDialog, BottomSheets
    extraLarge = RoundedCornerShape(32.dp)
)
