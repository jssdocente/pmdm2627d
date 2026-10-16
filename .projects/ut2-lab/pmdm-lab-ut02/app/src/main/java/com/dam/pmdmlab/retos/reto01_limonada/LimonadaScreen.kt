package com.dam.pmdmlab.retos.reto01_limonada

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

/**
 * Reto Autónomo 1: El Juego de la Limonada (Lemonade App)
 *
 * TODO PARA EL ALUMNO:
 * 1. Modelar las 4 fases con un enum class FaseLimonada: ARBOL, LIMON, VASO_LLENO, VASO_VACIO.
 * 2. Gestionar el estado con rememberSaveable para que resista giros de pantalla.
 * 3. En la fase ARBOL: pulsar calcula exprimidos aleatorios con (2..4).random().
 * 4. En la fase LIMON: cada toque decrementa los exprimidos restantes. Al llegar a 0, avanza.
 * 5. Separar en LimonadaContent (Stateless) y LimonadaScreen (Stateful).
 */

enum class FaseLimonada(val titulo: String, val instruccion: String) {
    ARBOL("Árbol de Limones", "Toca el árbol para seleccionar un limón"),
    LIMON("Limón", "Toca el limón para exprimirlo"),
    VASO_LLENO("Vaso de Limonada", "Toca el vaso para beber la limonada"),
    VASO_VACIO("Vaso Vacío", "Toca el vaso vacío para volver a empezar")
}

@Composable
fun LimonadaScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var fase by rememberSaveable { mutableStateOf(FaseLimonada.ARBOL) }
    var exprimidosRestantes by rememberSaveable { mutableIntStateOf(0) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "🍋 Reto: Lemonade App",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Reto autónomo para el alumno (Google Android Basics)",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(28.dp))

        Card(
            modifier = Modifier.fillMaxWidth(0.9f),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = fase.titulo,
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = if (fase == FaseLimonada.LIMON) {
                        "${fase.instruccion} (Quedan: $exprimidosRestantes)"
                    } else {
                        fase.instruccion
                    },
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        when (fase) {
                            FaseLimonada.ARBOL -> {
                                exprimidosRestantes = (2..4).random()
                                fase = FaseLimonada.LIMON
                            }
                            FaseLimonada.LIMON -> {
                                exprimidosRestantes--
                                if (exprimidosRestantes <= 0) {
                                    fase = FaseLimonada.VASO_LLENO
                                }
                            }
                            FaseLimonada.VASO_LLENO -> {
                                fase = FaseLimonada.VASO_VACIO
                            }
                            FaseLimonada.VASO_VACIO -> {
                                fase = FaseLimonada.ARBOL
                            }
                        }
                    }
                ) {
                    Text(
                        text = when (fase) {
                            FaseLimonada.ARBOL -> "Recoger Limón"
                            FaseLimonada.LIMON -> "¡Exprimir!"
                            FaseLimonada.VASO_LLENO -> "Beber Limonada"
                            FaseLimonada.VASO_VACIO -> "Volver al Árbol"
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(36.dp))

        OutlinedButton(onClick = onBack) {
            Text("Volver al Menú")
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun LimonadaScreenPreview() {
    Surface {
        LimonadaScreen(onBack = {})
    }
}
