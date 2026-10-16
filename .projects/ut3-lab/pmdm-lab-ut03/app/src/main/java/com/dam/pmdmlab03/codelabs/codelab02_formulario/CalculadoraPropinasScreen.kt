package com.dam.pmdmlab03.codelabs.codelab02_formulario

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Euro
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dam.pmdmlab03.ui.theme.PMDMLab03Theme
import java.util.Locale
import kotlin.math.ceil

@Composable
fun CalculadoraPropinasScreen(modifier: Modifier = Modifier) {
    var importeInput by remember { mutableStateOf("") }
    var porcentajePropina by remember { mutableFloatStateOf(10f) }
    var redondearAlAlza by remember { mutableStateOf(false) }

    val importe = importeInput.toDoubleOrNull() ?: 0.0
    val importePropinaBruta = importe * (porcentajePropina / 100)
    val totalBruto = importe + importePropinaBruta
    val totalFinal = if (redondearAlAlza) ceil(totalBruto) else totalBruto

    val esError = importeInput.isNotEmpty() && importeInput.toDoubleOrNull() == null

    CalculadoraPropinasContent(
        importeInput = importeInput,
        onImporteChange = { importeInput = it },
        porcentajePropina = porcentajePropina,
        onPorcentajeChange = { porcentajePropina = it },
        redondearAlAlza = redondearAlAlza,
        onRedondearChange = { redondearAlAlza = it },
        propinaCalculada = importePropinaBruta,
        totalCalculado = totalFinal,
        esError = esError,
        modifier = modifier
    )
}

@Composable
fun CalculadoraPropinasContent(
    importeInput: String,
    onImporteChange: (String) -> Unit,
    porcentajePropina: Float,
    onPorcentajeChange: (Float) -> Unit,
    redondearAlAlza: Boolean,
    onRedondearChange: (Boolean) -> Unit,
    propinaCalculada: Double,
    totalCalculado: Double,
    esError: Boolean,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Calculadora de Propinas",
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = "Experimenta cómo cada pulsación de tecla y ajuste de estado recalculan la interfaz en tiempo real.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            HorizontalDivider()

            // 1. Campo de texto con validación y borrado
            OutlinedTextField(
                value = importeInput,
                onValueChange = onImporteChange,
                label = { Text("Importe de la cuenta") },
                leadingIcon = { Icon(Icons.Filled.Euro, contentDescription = null) },
                trailingIcon = {
                    if (importeInput.isNotEmpty()) {
                        IconButton(onClick = { onImporteChange("") }) {
                            Icon(Icons.Filled.Clear, contentDescription = "Limpiar campo")
                        }
                    }
                },
                isError = esError,
                supportingText = {
                    if (esError) {
                        Text("Introduce un valor numérico válido (ej. 25.50)")
                    } else {
                        Text("Base imponible de la factura")
                    }
                },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Decimal,
                    imeAction = ImeAction.Done
                ),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // 2. Control deslizante de porcentaje (Slider)
            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Porcentaje de propina:")
                    Text(
                        text = "${porcentajePropina.toInt()}%",
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                Slider(
                    value = porcentajePropina,
                    onValueChange = onPorcentajeChange,
                    valueRange = 0f..30f,
                    steps = 5,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // 3. Conmutador de redondeo (Switch)
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "¿Redondear total al alza?",
                    style = MaterialTheme.typography.bodyLarge
                )
                Switch(
                    checked = redondearAlAlza,
                    onCheckedChange = onRedondearChange
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 4. Tarjeta de resultado final destacado
            ElevatedCard(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.elevatedCardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Propina estimada: ${String.format(Locale.getDefault(), "%.2f €", propinaCalculada)}",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Total a Pagar:",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )

                    Text(
                        text = String.format(Locale.getDefault(), "%.2f €", totalCalculado),
                        style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
        }
    }
}

// ==========================================
// PREVIEWS DIDÁCTICAS EN INTELLIJ IDEA
// ==========================================

@Preview(name = "Calculadora con Datos", showBackground = true)
@Composable
private fun CalculadoraPropinasPreviewConDatos() {
    PMDMLab03Theme {
        CalculadoraPropinasContent(
            importeInput = "50.0",
            onImporteChange = {},
            porcentajePropina = 15f,
            onPorcentajeChange = {},
            redondearAlAlza = false,
            onRedondearChange = {},
            propinaCalculada = 7.5,
            totalCalculado = 57.5,
            esError = false
        )
    }
}

@Preview(name = "Calculadora con Error", showBackground = true)
@Composable
private fun CalculadoraPropinasPreviewError() {
    PMDMLab03Theme {
        CalculadoraPropinasContent(
            importeInput = "abc",
            onImporteChange = {},
            porcentajePropina = 10f,
            onPorcentajeChange = {},
            redondearAlAlza = false,
            onRedondearChange = {},
            propinaCalculada = 0.0,
            totalCalculado = 0.0,
            esError = true
        )
    }
}
