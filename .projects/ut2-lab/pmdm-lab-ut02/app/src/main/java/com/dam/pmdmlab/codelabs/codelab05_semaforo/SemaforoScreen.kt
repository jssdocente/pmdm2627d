package com.dam.pmdmlab.codelabs.codelab05_semaforo

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// ============================================================================
// 1. MODELO DE DOMINIO: ESTADOS DEL SEMÁFORO
// ============================================================================
enum class FaseSemaforo(
    val titulo: String,
    val descripcion: String,
    val colorActivo: Color
) {
    ROJO(
        titulo = "¡ALTO!",
        descripcion = "Detención obligatoria para todos los vehículos",
        colorActivo = Color(0xFFE53935)
    ),
    AMBAR(
        titulo = "PRECAUCIÓN",
        descripcion = "Deténgase si es seguro hacerlo; cambio inminente a rojo",
        colorActivo = Color(0xFFFFB300)
    ),
    VERDE(
        titulo = "VÍA LIBRE",
        descripcion = "Paso permitido respetando la prioridad peatonal",
        colorActivo = Color(0xFF43A047)
    ),
    PRECAUCION(
        titulo = "MODO NOCHE",
        descripcion = "Cruce con máxima precaución y ceda el paso",
        colorActivo = Color(0xFFFFB300)
    );

    fun siguiente(): FaseSemaforo = when (this) {
        ROJO -> VERDE
        VERDE -> AMBAR
        AMBAR -> ROJO
        PRECAUCION -> ROJO
    }
}

// ============================================================================
// 2. SUB-COMPONENTE VISUAL: LUZ CIRCULAR
// ============================================================================
@Composable
fun LuzCircular(
    colorBase: Color,
    estaEncendida: Boolean,
    modifier: Modifier = Modifier
) {
    val colorFinal = if (estaEncendida) colorBase else colorBase.copy(alpha = 0.18f)

    Box(
        modifier = modifier
            .size(72.dp)
            .clip(CircleShape)
            .background(colorFinal)
            .border(
                width = 3.dp,
                color = if (estaEncendida) Color.White.copy(alpha = 0.7f) else Color.Black.copy(alpha = 0.3f),
                shape = CircleShape
            )
    )
}

// ============================================================================
// 3. COMPONENTE DE PRESENTACIÓN (STATELESS CONTENT)
// ============================================================================
@Composable
fun SemaforoContent(
    faseActual: FaseSemaforo,
    onAvanzarFase: () -> Unit,
    onConmutarModoNoche: () -> Unit,
    onReiniciar: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Semáforo Inteligente",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Chasis exterior del semáforo
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF263238)),
            shape = MaterialTheme.shapes.large,
            elevation = CardDefaults.cardElevation(defaultElevation = 10.dp)
        ) {
            Column(
                modifier = Modifier.padding(horizontal = 24.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                LuzCircular(
                    colorBase = Color(0xFFE53935),
                    estaEncendida = (faseActual == FaseSemaforo.ROJO)
                )

                LuzCircular(
                    colorBase = Color(0xFFFFB300),
                    estaEncendida = (faseActual == FaseSemaforo.AMBAR || faseActual == FaseSemaforo.PRECAUCION)
                )

                LuzCircular(
                    colorBase = Color(0xFF43A047),
                    estaEncendida = (faseActual == FaseSemaforo.VERDE)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Panel de información vial reactivo
        Card(
            modifier = Modifier.fillMaxWidth(0.9f),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = faseActual.titulo,
                    style = MaterialTheme.typography.titleLarge,
                    color = faseActual.colorActivo
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = faseActual.descripcion,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onAvanzarFase,
            modifier = Modifier.fillMaxWidth(0.75f)
        ) {
            Text("Avanzar Fase")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(0.75f),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            OutlinedButton(onClick = onConmutarModoNoche) {
                Text(if (faseActual == FaseSemaforo.PRECAUCION) "Modo Día" else "Modo Noche")
            }
            OutlinedButton(onClick = onReiniciar) {
                Text("Reset")
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedButton(onClick = onBack) {
            Text("Volver al Menú")
        }
    }
}

// ============================================================================
// 4. VISTAS PREVIAS (@PREVIEW) DE CADA FASE
// ============================================================================
@Preview(name = "Fase: Rojo", showBackground = true)
@Composable
private fun SemaforoPreviewRojo() {
    Surface {
        SemaforoContent(
            faseActual = FaseSemaforo.ROJO,
            onAvanzarFase = {},
            onConmutarModoNoche = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(name = "Fase: Verde", showBackground = true)
@Composable
private fun SemaforoPreviewVerde() {
    Surface {
        SemaforoContent(
            faseActual = FaseSemaforo.VERDE,
            onAvanzarFase = {},
            onConmutarModoNoche = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(name = "Fase: Ámbar", showBackground = true)
@Composable
private fun SemaforoPreviewAmbar() {
    Surface {
        SemaforoContent(
            faseActual = FaseSemaforo.AMBAR,
            onAvanzarFase = {},
            onConmutarModoNoche = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

@Preview(name = "Fase: Modo Noche", showBackground = true)
@Composable
private fun SemaforoPreviewNoche() {
    Surface {
        SemaforoContent(
            faseActual = FaseSemaforo.PRECAUCION,
            onAvanzarFase = {},
            onConmutarModoNoche = {},
            onReiniciar = {},
            onBack = {}
        )
    }
}

// ============================================================================
// 5. PANTALLA CONTENEDORA (STATEFUL SCREEN)
// ============================================================================
@Composable
fun SemaforoScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var faseActual by rememberSaveable { mutableStateOf(FaseSemaforo.ROJO) }

    SemaforoContent(
        faseActual = faseActual,
        onAvanzarFase = {
            faseActual = faseActual.siguiente()
        },
        onConmutarModoNoche = {
            faseActual = if (faseActual == FaseSemaforo.PRECAUCION) {
                FaseSemaforo.ROJO
            } else {
                FaseSemaforo.PRECAUCION
            }
        },
        onReiniciar = {
            faseActual = FaseSemaforo.ROJO
        },
        onBack = onBack,
        modifier = modifier
    )
}
