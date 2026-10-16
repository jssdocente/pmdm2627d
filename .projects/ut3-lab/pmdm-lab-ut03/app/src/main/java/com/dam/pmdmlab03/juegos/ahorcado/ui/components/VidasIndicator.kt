package com.dam.pmdmlab03.juegos.ahorcado.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProgressIndicatorDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab03.ui.theme.DangerRed
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme
import com.dam.pmdmlab03.ui.theme.SuccessGreen
import com.dam.pmdmlab03.ui.theme.WarningOrange

/**
 * Componente que muestra de forma visual las vidas del jugador mediante un LinearProgressIndicator
 * que muta dinámicamente de color según el nivel de alerta (Verde -> Naranja -> Rojo).
 */
@Composable
fun VidasIndicator(
    vidasRestantes: Int,
    vidasMaximas: Int = 6,
    modifier: Modifier = Modifier
) {
    val ratio = if (vidasMaximas > 0) vidasRestantes.toFloat() / vidasMaximas.toFloat() else 0f

    val colorBarra by animateColorAsState(
        targetValue = when {
            vidasRestantes > 3 -> SuccessGreen
            vidasRestantes in 2..3 -> WarningOrange
            else -> DangerRed
        },
        label = "ColorTransicionVidas"
    )

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Filled.Favorite,
                contentDescription = "Icono de vidas",
                tint = colorBarra
            )
            Text(
                text = "Vidas restantes: $vidasRestantes / $vidasMaximas",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        LinearProgressIndicator(
            progress = { ratio },
            modifier = Modifier
                .fillMaxWidth()
                .height(10.dp),
            color = colorBarra,
            trackColor = MaterialTheme.colorScheme.surfaceVariant,
            drawStopIndicator = {}
        )
    }
}

// ==========================================
// PREVIEWS DIDÁCTICAS PARA LOS ALUMNOS
// ==========================================

@Preview(name = "Vidas Llenas (6/6)", showBackground = true)
@Composable
private fun VidasIndicatorPreviewLleno() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            VidasIndicator(vidasRestantes = 6, vidasMaximas = 6)
        }
    }
}

@Preview(name = "Vidas Medias (3/6)", showBackground = true)
@Composable
private fun VidasIndicatorPreviewMedio() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            VidasIndicator(vidasRestantes = 3, vidasMaximas = 6)
        }
    }
}

@Preview(name = "Vidas Críticas (1/6)", showBackground = true)
@Composable
private fun VidasIndicatorPreviewCritico() {
    PMDMLab03Theme {
        Surface(modifier = Modifier.padding(16.dp)) {
            VidasIndicator(vidasRestantes = 1, vidasMaximas = 6)
        }
    }
}
