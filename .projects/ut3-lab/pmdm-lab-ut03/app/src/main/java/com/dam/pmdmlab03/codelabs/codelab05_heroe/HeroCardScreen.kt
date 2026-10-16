package com.dam.pmdmlab03.codelabs.codelab05_heroe

import androidx.compose.animation.Crossfade
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringArrayResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab03.R
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme

enum class ClaseHeroe(val nombreRes: Int) {
    GUERRERO(R.string.heroe_clase_guerrero),
    MAGO(R.string.heroe_clase_mago),
    PICARO(R.string.heroe_clase_picaro)
}

@Composable
fun HeroCardScreen(modifier: Modifier = Modifier) {
    var claseActual by remember { mutableStateOf(ClaseHeroe.GUERRERO) }

    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = stringResource(id = R.string.heroe_titulo),
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = stringResource(id = R.string.heroe_subtitulo),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
            )

            HorizontalDivider()

            Spacer(modifier = Modifier.height(12.dp))

            // Selector interactivo de clase (FilterChip)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ClaseHeroe.entries.forEach { clase ->
                    FilterChip(
                        selected = claseActual == clase,
                        onClick = { claseActual = clase },
                        label = { Text(stringResource(id = clase.nombreRes)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Ficha de estadísticas y habilidades reactiva
            HeroCardContent(clase = claseActual)
        }
    }
}

@Composable
fun HeroCardContent(
    clase: ClaseHeroe,
    modifier: Modifier = Modifier
) {
    // 1. Selección reactiva del Asset de Imagen según el estado
    val imagenRes = when (clase) {
        ClaseHeroe.GUERRERO -> R.drawable.ic_hero_warrior
        ClaseHeroe.MAGO -> R.drawable.ic_hero_mage
        ClaseHeroe.PICARO -> R.drawable.ic_hero_rogue
    }

    // 2. Selección reactiva del Array de Recursos XML
    val arraySkillsRes = when (clase) {
        ClaseHeroe.GUERRERO -> R.array.skills_guerrero
        ClaseHeroe.MAGO -> R.array.skills_mago
        ClaseHeroe.PICARO -> R.array.skills_picaro
    }
    val habilidades = stringArrayResource(id = arraySkillsRes)

    // 3. Tinte de Color semántico según la clase
    val colorTinte = when (clase) {
        ClaseHeroe.GUERRERO -> MaterialTheme.colorScheme.error
        ClaseHeroe.MAGO -> MaterialTheme.colorScheme.primary
        ClaseHeroe.PICARO -> MaterialTheme.colorScheme.tertiary
    }

    // 4. Valores de estadísticas según clase
    val (vidaActual, vidaMax, manaActual, manaMax, ataque) = when (clase) {
        ClaseHeroe.GUERRERO -> listOf(100, 100, 20, 20, 85)
        ClaseHeroe.MAGO -> listOf(50, 50, 100, 100, 95)
        ClaseHeroe.PICARO -> listOf(70, 70, 45, 45, 75)
    }

    val nombreClase = stringResource(id = clase.nombreRes)

    ElevatedCard(
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Cabecera multicapa con Box: Ilustración + Aura tintada con ColorFilter
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .clip(CircleShape)
                    .background(colorTinte.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Crossfade(targetState = imagenRes, label = "HeroImageTransition") { targetRes ->
                    Image(
                        painter = painterResource(id = targetRes),
                        contentDescription = stringResource(id = R.string.cd_ilustracion_heroe, nombreClase),
                        modifier = Modifier.size(72.dp)
                    )
                }

                // Escudo de clase con tinte semántico ColorFilter.tint
                Image(
                    painter = painterResource(id = R.drawable.ic_shield),
                    contentDescription = stringResource(id = R.string.cd_escudo_defensa),
                    colorFilter = ColorFilter.tint(colorTinte),
                    modifier = Modifier
                        .size(24.dp)
                        .align(Alignment.BottomEnd)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = nombreClase,
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                color = colorTinte
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

            // Barras de Estadísticas con Strings con formato
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Vida (HP)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(stringResource(id = R.string.heroe_stats_vida, vidaActual, vidaMax), style = MaterialTheme.typography.bodyMedium)
                    Text("$vidaActual%", fontWeight = FontWeight.Bold)
                }
                LinearProgressIndicator(
                    progress = { vidaActual.toFloat() / vidaMax.toFloat() },
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    color = MaterialTheme.colorScheme.error
                )

                // Maná (MP)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(stringResource(id = R.string.heroe_stats_mana, manaActual, manaMax), style = MaterialTheme.typography.bodyMedium)
                    Text("$manaActual%", fontWeight = FontWeight.Bold)
                }
                LinearProgressIndicator(
                    progress = { manaActual.toFloat() / manaMax.toFloat() },
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    color = MaterialTheme.colorScheme.primary
                )

                // Fuerza / Ataque
                Text(
                    text = stringResource(id = R.string.heroe_stats_fuerza, ataque),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

            // Lista de Habilidades obtenidas de stringArrayResource
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = stringResource(id = R.string.heroe_seccion_habilidades),
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.primary
                )

                habilidades.forEachIndexed { index, skill ->
                    Text(
                        text = "• ${index + 1}: $skill",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

// ==========================================
// PREVIEWS TEMÁTICAS POR CLASE DE HÉROE
// ==========================================

@Preview(name = "Héroe Guerrero", showBackground = true)
@Composable
private fun HeroCardWarriorPreview() {
    PMDMLab03Theme {
        HeroCardContent(clase = ClaseHeroe.GUERRERO)
    }
}

@Preview(name = "Héroe Mago", showBackground = true)
@Composable
private fun HeroCardMagePreview() {
    PMDMLab03Theme {
        HeroCardContent(clase = ClaseHeroe.MAGO)
    }
}
