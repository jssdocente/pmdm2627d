# **Paso 4: scope functions**

Las *scope functions* no hacen nada que no puedas hacer de otra forma, pero dejan el código más directo si eliges bien. Los tests solo comprueban el resultado, así que **la disciplina aquí es tuya**: cada función indica cuál debes usar.

- **Dónde trabajas:** `paso4_scope/Peticiones.kt`

- **Tests:** `paso4_scope/PeticionesTest.kt` (6 tests)

- **Apuntes:** [Scope functions](../31-scope-functions.md)

---

## 1. La idea en un minuto

Dos preguntas bastan para elegir: **cómo te refieres al objeto** dentro del bloque (`this` o `it`) y **qué devuelve** el bloque.

| Función | Dentro del bloque | Devuelve | Úsala para |
| :--- | :--- | :--- | :--- |
| `apply` | `this` | El objeto | **Configurar** un objeto recién creado |
| `also` | `it` | El objeto | Hacer algo **de paso**: un registro, una comprobación |
| `let` | `it` | El resultado | Trabajar con un **nulable** usando `?.let` |
| `run` | `this` | El resultado | **Calcular** algo a partir de un objeto |
| `with` | `this` | El resultado | Hacer **varias consultas** a un mismo objeto |

---

## 2. Tu tarea

1. **`crearPeticion(url)` con `apply`:** una `Peticion` con esa `url`, 3 reintentos y la cabecera `Accept` con el valor `*/*`.

2. **`nombreDesdeUrl(url)` con `let`:** lo que hay tras la última barra, o `"sin-nombre"` si la url es `null` o termina en barra.

3. **`registrar(descarga, log)` con `also`:** añade `"Añadida: nombre"` al registro y devuelve la misma descarga.

4. **`tamanoLegible(descarga)` con `run`:** `"2 GB"` a partir de 1024 MB, con división entera, o `"300 MB"`.

5. **`resumen(descargas)` con `with`:** `"3 descargas, 900 MB"`.

??? tip "Pista: `crearPeticion`"

    Dentro de `apply`, el parámetro `url` tapa a la propiedad con el mismo nombre. Escribe `this.url = url`.

??? tip "Pista: `nombreDesdeUrl`"

    `substringAfterLast('/')` devuelve una cadena vacía si la url termina en barra. `takeIf { it.isNotBlank() }` convierte ese caso en `null`, y `?:` hace el resto.

---

## 3. Solución

[`Peticiones.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.04-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso4_scope/Peticiones.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.03-fin...c0.04-fin)

**Más práctica:** [Colecciones y scope functions](../ejercicios/04-colecciones-scope-functions.md). **Siguiente:** [Paso 5: `suspend` y `async`](./05-suspend-async.md).
