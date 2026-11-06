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

Todo se hace en `Peticiones.kt`. En cada función se indica cuál debes usar.

### 2.1. `crearPeticion`, con `apply`

```kotlin
fun crearPeticion(url: String): Peticion
```

Crea una `Peticion` y deja configuradas sus tres propiedades:

| Propiedad | Valor |
| :--- | :--- |
| `url` | La que recibe la función |
| `reintentos` | `3` |
| `cabeceras` | Una entrada con la clave `"Accept"` y el valor `"*/*"` |

??? tip "Pista"

    Dentro de `apply`, el parámetro `url` tapa a la propiedad con el mismo nombre. Escribe `this.url = url`.

### 2.2. `nombreDesdeUrl`, con `let`

```kotlin
fun nombreDesdeUrl(url: String?): String
```

Devuelve lo que hay tras la última barra. Si no hay nada que extraer, devuelve `"sin-nombre"`:

| `url` | Devuelve |
| :--- | :--- |
| `"https://x.es/juegos/a.zip"` | `"a.zip"` |
| `null` | `"sin-nombre"` |
| `"https://x.es/"` (acaba en barra) | `"sin-nombre"` |

??? tip "Pista"

    `substringAfterLast('/')` devuelve una cadena vacía si la url termina en barra. `takeIf { it.isNotBlank() }` convierte ese caso en `null`, y `?:` hace el resto.

### 2.3. `registrar`, con `also`

```kotlin
fun registrar(descarga: Descarga, log: MutableList<String>): Descarga
```

Hace dos cosas:

- **Anota:** añade a `log` el texto `Añadida:` seguido del nombre. Para `a.zip`, la entrada es `"Añadida: a.zip"`.

- **Devuelve:** la misma descarga que recibió, no una copia.

### 2.4. `tamanoLegible`, con `run`

```kotlin
fun tamanoLegible(descarga: Descarga): String
```

Por debajo de 1024 MB lo expresa en MB. A partir de 1024 MB lo expresa en GB, con división entera:

| `tamanoMb` | Devuelve |
| :--- | :--- |
| 300 | `"300 MB"` |
| 1024 | `"1 GB"` |
| 2100 | `"2 GB"` |

### 2.5. `resumen`, con `with`

```kotlin
fun resumen(descargas: List<Descarga>): String
```

Devuelve el número de descargas y la suma de sus megas. Para dos descargas de 300 y 600 MB, devuelve `"2 descargas, 900 MB"`.

---

## 3. Solución

[`Peticiones.kt` resuelto](https://github.com/jssdocente/pmdm2627-lab-kotlin/blob/c0.04-fin/src/main/kotlin/com/pmdm/lab/kotlin/paso4_scope/Peticiones.kt) · [Todos los cambios de este paso](https://github.com/jssdocente/pmdm2627-lab-kotlin/compare/c0.03-fin...c0.04-fin)

**Más práctica:** [Colecciones y scope functions](../ejercicios/04-colecciones-scope-functions.md). **Siguiente:** [Paso 5: `suspend` y `async`](./05-suspend-async.md).
