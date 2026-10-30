# **Guía de clases de la UT2**

Esta sección recoge **una guía por clase**. Cada guía te dice qué vamos a hacer en la sesión, en qué orden y qué apartado de los apuntes corresponde a cada bloque. Los apuntes siguen siendo la referencia completa: la guía solo los ordena en el tiempo.

Todas las clases de la UT2 trabajan sobre un mismo **proyecto de clase**, **FichaJuego**, que construimos paso a paso a partir de la plantilla del curso.

---

## El proyecto de clase: FichaJuego

- **Punto de partida:** la plantilla `ProyectoComposeBase` del curso (IntelliJ IDEA 2026.2, AGP 9.1.1, compileSdk 37), ya renombrada a `com.pmdm.fichajuego`.
- **Repositorio:** [github.com/jssdocente/pmdm2627-fichajuego](https://github.com/jssdocente/pmdm2627-fichajuego).
- **Un tag por sesión:** cada clase tiene un tag de inicio (`s2.01-inicio`) y otro de fin (`s2.01-fin`). Si faltas a una clase, descarga el tag de fin y continúa desde ahí.

```bash
git clone https://github.com/jssdocente/pmdm2627-fichajuego.git fichajuego
cd fichajuego
git checkout s2.01-inicio      # el punto de partida de la sesión
git switch -c mi-trabajo       # tu rama para trabajar
```

!!! tip "¿Sin Git?"
    En la página del repositorio, en **Tags**, cada tag se puede descargar como `.zip`. Descomprímelo en una ruta corta y sin acentos (por ejemplo `C:\PMDM\fichajuego`), igual que la plantilla.

---

## Plan de sesiones

Cada sesión corresponde a una clase de **2 horas**.

| Sesión | Contenido | Apuntes | Proyecto |
| :--- | :--- | :--- | :--- |
| [**2.01** · Primer contacto con Compose](./s01-primer-contacto-compose.md) | Funciones composable, árbol de la composición, `MainActivity`, `@Preview`, `Column`, `Row`, `Box` y `Modifier` | [2.3](../2.3-primera-app.md), [2.3.1](../2.3.1-layouts-modificadores.md) | `s2.01-inicio` → `s2.01-fin` |
| [**2.02** · Estado y *state hoisting*](./s02-estado-state-hoisting.md) | Estado y recomposición, `remember` y `rememberSaveable`, elevación del estado | [2.3 §3](../2.3-primera-app.md), [2.2 §4](../2.2-ciclo-vida-app.md), [Gestión del estado](../../00-android/00-compose/22-state-management.md) | `s2.02-inicio` → `s2.02-fin` |
| **2.03** · Imágenes, iconos y recursos *(pendiente)* | La portada real con `Image`, iconos, textos en `strings.xml` | [2.3.2](../2.3.2-imagenes-iconos-recursos.md) | `s2.03-inicio` → `s2.03-fin` |

Las sesiones se irán publicando a medida que avance la unidad.
