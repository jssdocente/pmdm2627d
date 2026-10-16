package com.dam.pmdmlab03.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Indigo80,
    onPrimary = Indigo40,
    primaryContainer = SurfaceVariantDark,
    onPrimaryContainer = Indigo80,
    secondary = Teal80,
    onSecondary = Teal40,
    surface = NeutralDark,
    onSurface = NeutralLight,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = NeutralLight
)

private val LightColorScheme = lightColorScheme(
    primary = Indigo40,
    onPrimary = NeutralLight,
    primaryContainer = SurfaceVariantLight,
    onPrimaryContainer = Indigo40,
    secondary = Teal40,
    onSecondary = NeutralLight,
    surface = NeutralLight,
    onSurface = NeutralDark,
    surfaceVariant = SurfaceVariantLight,
    onSurfaceVariant = NeutralDark
)

@Composable
fun PMDMLab03Theme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}
