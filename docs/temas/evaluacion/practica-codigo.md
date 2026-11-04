# **Practica Kotlin: código y TDD**

En el examen práctico de Kotlin recibes un proyecto con métodos sin implementar (`TODO`) y sus **tests ya escritos**: tu trabajo es dejarlos en verde con *pipelines* de colecciones, sin bucles ni listas mutables. Aquí puedes entrenar esa forma de trabajar **en el navegador**, sin abrir el IDE ni montar un proyecto.

Puedes trabajar de dos formas: con una **tanda** aleatoria que mezcla tipos y temas, o eligiendo ejercicios concretos en el **catálogo**. Hay cinco tipos de ejercicio, y cada uno entrena una parte de la misma competencia:

| Ejercicio | Qué entrenas |
| :--- | :--- |
| [Katas TDD](#1-katas-tdd) | Implementar funciones hasta que pasen los tests, como en el examen |
| [Encuentra el error](#2-encuentra-el-error) | Leer el mensaje de un test que falla y localizar la causa |
| [Completa los huecos](#3-completa-los-huecos) | Recordar las funciones de colecciones y la sintaxis exacta |
| [Ordena las líneas](#4-ordena-las-lineas) | Entender en qué orden se encadenan las operaciones |
| [Explica tu código](#5-explica-tu-codigo) | Justificar por escrito por qué tu código funciona |

!!! tip "Cómo sacarle partido"
    - Empieza por **leer los tests**: cada uno es un requisito, con los datos y el valor exacto que se espera.
    - En las katas, ejecuta a menudo. Un **Fail** con `expected:<…> but was:<…>` es un resultado incorrecto; un **Error** es una excepción (por ejemplo, un `TODO` que aún no has implementado).
    - Pide las pistas de una en una y deja la solución para el final: compararla con la tuya es donde más se aprende.
    - Tu progreso, tus borradores y tus respuestas se guardan solo en este navegador.

<link rel="stylesheet" href="../../extra/css/kt-codigo.css">

## Tanda de práctica

Elige qué quieres practicar y cuántos ejercicios. Se sortean primero los que aún no has resuelto, así que cada tanda es distinta. Al terminar puedes pedir otra o repetir solo los que se te resistieron.

<div class="ktc-tanda" data-root="../../"></div>

## Catálogo por tipo de ejercicio

Todos los ejercicios, ordenados por tipo. Lo que resuelvas aquí cuenta también para las tandas, y al revés.

### 1. Katas TDD

Cada kata trae un esqueleto con `TODO("Pendiente de implementar")` y una clase de tests con `kotlin.test`, como en el examen. Escribe tu código en el editor y pulsa **▶**: los tests se ejecutan en el servidor de Kotlin Playground y verás cuáles pasan y cuáles no.

<div class="ktc" data-tipo="kata" data-root="../../"></div>

### 2. Encuentra el error

El código compila, pero un test falla. Lee el mensaje (qué esperaba el test y qué recibió) y pulsa la línea que lo provoca.

<div class="ktc" data-tipo="error" data-root="../../"></div>

### 3. Completa los huecos

Escribe en cada hueco lo que falta: el nombre de una función, un valor o una palabra clave. Pulsa **Intro** o **Comprobar**.

<div class="ktc" data-tipo="huecos" data-root="../../"></div>

### 4. Ordena las líneas

Las líneas de una función están desordenadas y **una sobra**. Ordénalas y descarta la que no hace falta. Si dos líneas pueden ir en cualquier orden, se aceptan las dos combinaciones.

<div class="ktc" data-tipo="parsons" data-root="../../"></div>

### 5. Explica tu código

En la corrección cuenta que el código funcione, pero también que **sepas explicar por qué**. Responde por escrito y después compárate con la respuesta modelo, marcando con sinceridad los puntos que has cubierto.

<div class="ktc" data-tipo="defensa" data-root="../../"></div>

<script src="../../extra/js/kt-codigo.js"></script>

!!! info "Sobre los ejercicios"
    Son ejercicios de práctica, **distintos de los del examen**, pero del mismo tipo y nivel. Para practicar las preguntas tipo test, usa la [práctica tipo test](practica-kotlin.md).

    <button type="button" class="md-button ktc-reiniciar">Borrar mi progreso en esta página</button>
