package com.dam.pmdmlab

enum class CategoriaReto {
    CODELAB_GUIADO,
    RETO_AUTONOMO
}

enum class PantallaReto(
    val titulo: String,
    val descripcion: String,
    val categoria: CategoriaReto
) {
    MENU(
        titulo = "Menú Principal",
        descripcion = "Catálogo de prácticas y retos interactivos",
        categoria = CategoriaReto.CODELAB_GUIADO
    ),
    CODELAB_1(
        titulo = "Codelab 1: Ciclo de Vida y Logcat",
        descripcion = "Trazas en Logcat y experimento de rotación (remember vs rememberSaveable)",
        categoria = CategoriaReto.CODELAB_GUIADO
    ),
    CODELAB_2(
        titulo = "Codelab 2: Contador Incremental",
        descripcion = "Estado mutable, recomposición reactiva e interactividad con botones",
        categoria = CategoriaReto.CODELAB_GUIADO
    ),
    CODELAB_3(
        titulo = "Codelab 3: Tarjeta y Previews",
        descripcion = "Layouts con Column/Row/Box, arquitectura Stateless/Stateful y vistas mock",
        categoria = CategoriaReto.CODELAB_GUIADO
    ),
    CODELAB_4(
        titulo = "Codelab 4: Dado Interactivo",
        descripcion = "Generación aleatoria de tiradas (1..6) y diseño de cara de dado",
        categoria = CategoriaReto.CODELAB_GUIADO
    ),
    CODELAB_5(
        titulo = "Codelab 5: Semáforo Inteligente",
        descripcion = "Máquina de estados formal con enum class, luces circulares y modo noche",
        categoria = CategoriaReto.CODELAB_GUIADO
    ),
    RETO_1(
        titulo = "Reto 1: Lemonade App 🍋",
        descripcion = "Máquina de estados secuencial con interacción dinámica (Árbol, Limón, Vaso)",
        categoria = CategoriaReto.RETO_AUTONOMO
    ),
    RETO_2(
        titulo = "Reto 2: Marcador Baloncesto 🏀",
        descripcion = "Gestión de doble tanteo simultáneo (+3, +2, +1), indicador de líder y reset",
        categoria = CategoriaReto.RETO_AUTONOMO
    )
}
