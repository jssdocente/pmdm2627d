#!/usr/bin/env python3
"""
Lector del banco de ejercicios de código (práctica del examen de Kotlin con TDD).

Solo usa la biblioteca estándar. Formato de cada fichero (`quiz/codigo/NN-tipo.md`):

    ---
    tipo: kata            # kata | error | huecos | parsons | defensa
    titulo: Katas TDD
    apuntes: temas/00-android/00-kotlin
    ---

    ## kc-kata-01 Libros disponibles {tema=ordenar dificultad=1 ancla=42-listas.md}

    Enunciado en Markdown.

    ### Código
    ```kotlin
    ...
    ```

    ### Tests
    ...

Atributos: `tema` (uno o varios de TEMAS, separados por comas), `dificultad` (1-3) y
`ancla` (página de los apuntes, relativa a `apuntes`).

Secciones de cada ejercicio (### Nombre), según el tipo:

- kata:    Código (esqueleto con TODO), Tests, Solución, Pistas (lista).
- error:   Código (con la línea errónea marcada), Tests, Explicación.
- huecos:  Código (con huecos [[respuesta|alternativa]]), Tests (opcional), Explicación.
- parsons: Código (en el orden correcto, con marcas), Tests (opcional), Explicación.
- defensa: Respuesta modelo, Cotejo (lista de puntos para autoevaluarse).

Marcas al final de una línea de código (se quitan antes de publicar):

- `//! corrige: <línea>`  (error) esta es la línea errónea y así queda corregida.
- `//!fijo`               (parsons) línea que no se mueve (firma, llave final).
- `//!distractor`         (parsons) línea que sobra.
- `//!grupo=x`            (parsons) las líneas consecutivas del mismo grupo pueden ir en cualquier orden.
"""

import re
import sys
from pathlib import Path

RE_EJERCICIO = re.compile(r"^##\s+([\w.-]+)\s+(.*?)\s*(?:\{([^}]*)\})?\s*$")
RE_SECCION = re.compile(r"^###\s+(.+?)\s*$")
RE_FENCE = re.compile(r"^\s*(```+|~~~+)")
RE_KOTLIN = re.compile(r"```kotlin[^\n]*\n(.*?)\n```", re.S)
RE_MARCA = re.compile(r"\s*//!\s*(.*)$")
RE_HUECO = re.compile(r"\[\[(.+?)\]\]")

TIPOS = ("kata", "error", "huecos", "parsons", "defensa")
TEMAS = {
    "ordenar": "Filtrar, ordenar y transformar",
    "agrupar": "Agrupar y agregar",
    "nulos": "Búsquedas y nulos",
    "validar": "Validación y excepciones",
    "inmutable": "copy(), when y tipos sellados",
    "tests": "Leer y escribir tests",
}
SECCIONES = {
    "kata": {"Código", "Tests", "Solución", "Pistas"},
    "error": {"Código", "Tests", "Explicación"},
    "huecos": {"Código", "Tests", "Explicación"},
    "parsons": {"Código", "Tests", "Explicación"},
    "defensa": {"Respuesta modelo", "Cotejo"},
}
OBLIGATORIAS = {
    "kata": {"Código", "Tests", "Solución"},
    "error": {"Código", "Tests", "Explicación"},
    "huecos": {"Código", "Explicación"},
    "parsons": {"Código", "Explicación"},
    "defensa": {"Respuesta modelo", "Cotejo"},
}


class ErrorBanco(Exception):
    pass


def _front_matter(texto, ruta):
    if not texto.startswith("---\n"):
        raise ErrorBanco(f"{ruta}: falta la cabecera --- con tipo/titulo/apuntes")
    fin = texto.index("\n---", 4)
    meta = {}
    for linea in texto[4:fin].splitlines():
        if ":" in linea:
            k, v = linea.split(":", 1)
            meta[k.strip()] = v.split("#")[0].strip().strip("\"'")
    return meta, texto[fin + 4:]


def _atributos(cadena):
    attrs = {}
    for trozo in (cadena or "").split():
        k, _, v = trozo.partition("=")
        attrs[k] = v or True
    return attrs


def _trocear(lineas):
    """Secciones por ## / ###, ignorando los encabezados dentro de bloques de código."""
    secciones = []
    actual = ("previo", None, [])
    en_fence = None
    for linea in lineas:
        m_f = RE_FENCE.match(linea)
        if m_f:
            marca = m_f.group(1)
            if en_fence is None:
                en_fence = marca
            elif marca.startswith(en_fence):
                en_fence = None
        if en_fence is None and not m_f:
            m_e = RE_EJERCICIO.match(linea)
            m_s = RE_SECCION.match(linea)
            if m_e:
                secciones.append(actual)
                actual = ("ejercicio", m_e, [])
                continue
            if m_s:
                secciones.append(actual)
                actual = ("seccion", m_s, [])
                continue
        actual[2].append(linea)
    secciones.append(actual)
    return secciones


def codigo_de(texto):
    """Primer bloque ```kotlin de una sección (o cadena vacía)."""
    m = RE_KOTLIN.search(texto or "")
    return m.group(1) if m else ""


def lineas_marcadas(codigo):
    """[(texto_sin_marca, marca)] de cada línea del código."""
    res = []
    for linea in codigo.split("\n"):
        m = RE_MARCA.search(linea)
        if m:
            res.append((linea[: m.start()].rstrip(), m.group(1).strip()))
        else:
            res.append((linea, ""))
    return res


def huecos(codigo):
    """Respuestas aceptadas de cada hueco [[a|b]], en orden de aparición."""
    return [[r.strip() for r in m.group(1).split("|")] for m in RE_HUECO.finditer(codigo)]


def rellenar(codigo):
    """Código con cada hueco sustituido por su primera respuesta."""
    return RE_HUECO.sub(lambda m: m.group(1).split("|")[0].strip(), codigo)


def corregido(codigo):
    """(error) Código erróneo sin marcas, código corregido e índice de la línea errónea."""
    malo, bueno, indice = [], [], None
    for i, (texto, marca) in enumerate(lineas_marcadas(codigo)):
        malo.append(texto)
        if marca.startswith("corrige:"):
            indice = i
            sangria = texto[: len(texto) - len(texto.lstrip())]
            bueno.append(sangria + marca[len("corrige:"):].strip())
        else:
            bueno.append(texto)
    return "\n".join(malo), "\n".join(bueno), indice


def parsons(codigo):
    """(parsons) Lista de líneas {texto, fijo, distractor, grupo} y código correcto (sin distractores)."""
    lineas = []
    for texto, marca in lineas_marcadas(codigo):
        attrs = _atributos(marca)
        lineas.append({
            "texto": texto,
            "fijo": bool(attrs.get("fijo")),
            "distractor": bool(attrs.get("distractor")),
            "grupo": attrs.get("grupo") if isinstance(attrs.get("grupo"), str) else "",
        })
    correcto = "\n".join(l["texto"] for l in lineas if not l["distractor"])
    return lineas, correcto


def leer_fichero(ruta):
    ruta = Path(ruta)
    meta, cuerpo = _front_matter(ruta.read_text(encoding="utf-8"), ruta)
    grupo = {
        "tipo": meta.get("tipo", ""),
        "titulo": meta.get("titulo", ruta.stem),
        "apuntes": meta.get("apuntes", ""),
        "ejercicios": [],
    }
    ej = None
    for clase, m, lineas in _trocear(cuerpo.splitlines()):
        texto = "\n".join(lineas).strip()
        if clase == "ejercicio":
            attrs = _atributos(m.group(3))
            ej = {
                "id": m.group(1),
                "titulo": m.group(2).strip(),
                "tipo": grupo["tipo"],
                "dificultad": int(attrs.get("dificultad", 1)),
                "temas": [x for x in str(attrs.get("tema", "")).split(",") if x and x != "True"],
                "ancla": attrs.get("ancla", "") if isinstance(attrs.get("ancla"), str) else "",
                "enunciado": texto,
                "secciones": {},
                "fichero": ruta.name,
            }
            grupo["ejercicios"].append(ej)
        elif clase == "seccion":
            if ej is None:
                raise ErrorBanco(f"{ruta}: sección ### {m.group(1)} fuera de un ejercicio")
            ej["secciones"][m.group(1)] = texto
    return grupo


def validar(grupos):
    errores = []
    vistos = set()
    for g in grupos:
        if g["tipo"] not in TIPOS:
            errores.append(f"{g['titulo']}: tipo desconocido '{g['tipo']}'")
            continue
        for e in g["ejercicios"]:
            eid, sec = e["id"], e["secciones"]
            if eid in vistos:
                errores.append(f"{eid}: id repetido")
            vistos.add(eid)
            if not e["titulo"]:
                errores.append(f"{eid}: falta el título tras el id")
            if not e["temas"]:
                errores.append(f"{eid}: falta el atributo tema")
            for tema in e["temas"]:
                if tema not in TEMAS:
                    errores.append(f"{eid}: tema desconocido '{tema}'")
            if e["dificultad"] not in (1, 2, 3):
                errores.append(f"{eid}: dificultad fuera de 1..3")
            for s in OBLIGATORIAS[g["tipo"]] - sec.keys():
                errores.append(f"{eid}: falta la sección ### {s}")
            for s in sec.keys() - SECCIONES[g["tipo"]]:
                errores.append(f"{eid}: sección ### {s} desconocida para el tipo {g['tipo']}")
            for s in ("Código", "Tests", "Solución"):
                if s in sec and not codigo_de(sec[s]):
                    errores.append(f"{eid}: la sección {s} no tiene un bloque ```kotlin")
            cod = codigo_de(sec.get("Código", ""))
            if g["tipo"] == "error" and corregido(cod)[2] is None:
                errores.append(f"{eid}: ninguna línea lleva la marca //! corrige:")
            if g["tipo"] == "huecos" and not huecos(cod):
                errores.append(f"{eid}: el código no tiene huecos [[...]]")
            if g["tipo"] == "parsons":
                lineas, _ = parsons(cod)
                movibles = [l for l in lineas if not l["fijo"]]
                if len(movibles) < 3:
                    errores.append(f"{eid}: hacen falta al menos 3 líneas que ordenar")
                fijas = [i for i, l in enumerate(lineas) if l["fijo"]]
                for i in fijas:
                    if any(not l["fijo"] for l in lineas[:i]) and any(not l["fijo"] for l in lineas[i + 1:]):
                        errores.append(f"{eid}: las líneas //!fijo solo pueden ir al principio o al final")
            if g["tipo"] == "kata" and "TODO(" not in cod:
                errores.append(f"{eid}: el esqueleto de la kata no tiene ningún TODO(")
    return errores


def leer_banco(carpeta):
    return [leer_fichero(f) for f in sorted(Path(carpeta).glob("*.md"))]


if __name__ == "__main__":
    carpeta = sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent / "codigo"
    grupos = leer_banco(carpeta)
    for g in grupos:
        print(f"{g['tipo']:8} {len(g['ejercicios']):3}  {g['titulo']}")
    errores = validar(grupos)
    for e in errores:
        print("✗", e)
    print(f"{sum(len(g['ejercicios']) for g in grupos)} ejercicios, {len(errores)} errores")
    sys.exit(1 if errores else 0)
