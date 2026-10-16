package com.dam.pmdmlab

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.dam.pmdmlab.codelabs.codelab01_ciclovida.CicloVidaScreen
import com.dam.pmdmlab.codelabs.codelab02_contador.ContadorIncrementalScreen
import com.dam.pmdmlab.codelabs.codelab03_tarjeta.TarjetaPresentacionScreen
import com.dam.pmdmlab.codelabs.codelab04_dados.DadoRollerScreen
import com.dam.pmdmlab.codelabs.codelab05_semaforo.SemaforoScreen
import com.dam.pmdmlab.retos.reto01_limonada.LimonadaScreen
import com.dam.pmdmlab.retos.reto02_marcador.MarcadorBaloncestoScreen
import com.dam.pmdmlab.ui.menu.LabMenuScreen
import com.dam.pmdmlab.ui.theme.PMDMLabTheme

class MainActivity : ComponentActivity() {

    companion object {
        private const val TAG = "CicloVidaDemo"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "===> onCreate: Activity creada.")

        setContent {
            PMDMLabTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    LabApp()
                }
            }
        }
    }

    override fun onStart() {
        super.onStart()
        Log.d(TAG, "===> onStart: Activity visible.")
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "===> onResume: Activity interactiva.")
    }

    override fun onPause() {
        super.onPause()
        Log.d(TAG, "===> onPause: Activity en pausa.")
    }

    override fun onStop() {
        super.onStop()
        Log.d(TAG, "===> onStop: Activity detenida.")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "===> onDestroy: Activity destruida.")
    }
}

@Composable
fun LabApp() {
    var pantallaActual by rememberSaveable { mutableStateOf(PantallaReto.MENU) }

    when (pantallaActual) {
        PantallaReto.MENU -> {
            LabMenuScreen(
                onSeleccionarReto = { nuevoReto -> pantallaActual = nuevoReto }
            )
        }
        PantallaReto.CODELAB_1 -> {
            CicloVidaScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
        PantallaReto.CODELAB_2 -> {
            ContadorIncrementalScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
        PantallaReto.CODELAB_3 -> {
            TarjetaPresentacionScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
        PantallaReto.CODELAB_4 -> {
            DadoRollerScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
        PantallaReto.CODELAB_5 -> {
            SemaforoScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
        PantallaReto.RETO_1 -> {
            LimonadaScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
        PantallaReto.RETO_2 -> {
            MarcadorBaloncestoScreen(onBack = { pantallaActual = PantallaReto.MENU })
        }
    }
}

@Preview(name = "Contenedor LabApp - Menú Principal", showBackground = true)
@Composable
private fun LabAppPreview() {
    PMDMLabTheme {
        LabApp()
    }
}
