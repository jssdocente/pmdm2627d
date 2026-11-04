#!/usr/bin/env python3
"""
Lector del banco de preguntas tipo test (formato Markdown estructurado).

Solo usa la biblioteca estándar, para poder reutilizarse tal cual en el
repositorio privado (generar exámenes compatibles con corregir.py).

Formato de cada fichero de bloque (`quiz/kotlin/NN-nombre.md`):

    ---
    bloque: 5
    titulo: Null safety
    apuntes: temas/00-android/00-kotlin/14-null-safety.md
    ---

    ## kt-null-001 {dificultad=1 tipo=salida ancla=22-operador-elvis}

    Enunciado en Markdown (puede llevar bloques ```kotlin).

    ### A ✔

    Texto de la opción (Markdown, admite bloques de código multilínea).

    > Realimentación de esta opción (por qué es correcta / incorrecta).

    ### B

    ...

Atributos de la pregunta (entre llaves, `clave=valor` o `clave` sola):

- dificultad: 1 (básica), 2 (media), 3 (trampa).
- tipo: salida | compila | concepto.
- ancla: id del apartado de los apuntes al que enlazar.
- error: (tipo compila) el código NO compila.
- excepcion=Nombre: (tipo salida) la ejecución lanza esa excepción.
- ejecutable / noejecutable: fuerza mostrar u ocultar el botón de ejecutar.
"""

import re
import sys
from pathlib import Path

RE_PREGUNTA = re.compile(r"^##\s+([\w.-]+)\s*(?:\{([^}]*)\})?\s*$")
RE_OPCION = re.compile(r"^###\s+([A-Z])\s*(✔)?\s*$")
RE_FENCE = re.compile(r"^\s*(```+|~~~+)")
RE_CODIGO_KOTLIN = re.compile(r"```kotlin[^\n]*\n(.*?)\n```", re.S)


class ErrorBanco(Exception):
    pass


def _front_matter(texto, ruta):
    if not texto.startswith("---\n"):
        raise ErrorBanco(f"{ruta}: falta la cabecera --- con bloque/titulo/apuntes")
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
        if "=" in trozo:
            k, v = trozo.split("=", 1)
            attrs[k] = v
        else:
            attrs[trozo] = True
    return attrs


def _trocear(lineas):
    """Divide en secciones por encabezados ## / ###, ignorando los que estén dentro de bloques de código."""
    secciones = []  # (tipo, match, [lineas])
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
            m_p = RE_PREGUNTA.match(linea)
            m_o = RE_OPCION.match(linea)
            if m_p:
                secciones.append(actual)
                actual = ("pregunta", m_p, [])
                continue
            if m_o:
                secciones.append(actual)
                actual = ("opcion", m_o, [])
                continue
        actual[2].append(linea)
    secciones.append(actual)
    return secciones


def _separar_feedback(lineas):
    """La realimentación es la cita (> ...) final de la opción."""
    while lineas and not lineas[-1].strip():
        lineas.pop()
    fb = []
    while lineas and lineas[-1].startswith(">"):
        fb.insert(0, re.sub(r"^>\s?", "", lineas.pop()))
    return "\n".join(lineas).strip(), "\n".join(fb).strip()


def leer_bloque(ruta):
    ruta = Path(ruta)
    meta, cuerpo = _front_matter(ruta.read_text(encoding="utf-8"), ruta)
    bloque = {
        "bloque": int(meta.get("bloque", 0)),
        "titulo": meta.get("titulo", ruta.stem),
        "apuntes": meta.get("apuntes", ""),
        "preguntas": [],
    }
    pregunta = None
    for tipo, m, lineas in _trocear(cuerpo.splitlines()):
        if tipo == "pregunta":
            attrs = _atributos(m.group(2))
            enunciado = "\n".join(lineas).strip()
            codigo = RE_CODIGO_KOTLIN.search(enunciado)
            pregunta = {
                "id": m.group(1),
                "bloque": bloque["bloque"],
                "dificultad": int(attrs.get("dificultad", 1)),
                "tipo": attrs.get("tipo", "concepto"),
                "ancla": attrs.get("ancla", ""),
                "error": bool(attrs.get("error")),
                "excepcion": attrs.get("excepcion", ""),
                "enunciado": enunciado,
                "codigo": codigo.group(1) if codigo else "",
                "opciones": [],
            }
            ejecutable = pregunta["codigo"] and pregunta["tipo"] in ("salida", "compila")
            if attrs.get("ejecutable"):
                ejecutable = bool(pregunta["codigo"])
            if attrs.get("noejecutable"):
                ejecutable = False
            pregunta["ejecutable"] = bool(ejecutable)
            bloque["preguntas"].append(pregunta)
        elif tipo == "opcion":
            if pregunta is None:
                raise ErrorBanco(f"{ruta}: opción ### {m.group(1)} fuera de una pregunta")
            texto, feedback = _separar_feedback(list(lineas))
            pregunta["opciones"].append({
                "letra": m.group(1),
                "texto": texto,
                "correcta": bool(m.group(2)),
                "feedback": feedback,
            })
        elif tipo == "previo" and pregunta is not None:
            pass
    return bloque


def validar(bloques):
    errores = []
    vistos = {}
    for b in bloques:
        for p in b["preguntas"]:
            pid = p["id"]
            if pid in vistos:
                errores.append(f"{pid}: id repetido (también en bloque {vistos[pid]})")
            vistos[pid] = b["bloque"]
            ops = p["opciones"]
            if not 3 <= len(ops) <= 4:
                errores.append(f"{pid}: tiene {len(ops)} opciones (se esperan 3 o 4)")
            if sum(o["correcta"] for o in ops) != 1:
                errores.append(f"{pid}: debe tener exactamente una opción con ✔")
            for o in ops:
                if not o["feedback"]:
                    errores.append(f"{pid}: la opción {o['letra']} no tiene realimentación (> ...)")
                if not o["texto"]:
                    errores.append(f"{pid}: la opción {o['letra']} está vacía")
            if p["tipo"] not in ("salida", "compila", "concepto"):
                errores.append(f"{pid}: tipo desconocido '{p['tipo']}'")
            if p["dificultad"] not in (1, 2, 3):
                errores.append(f"{pid}: dificultad fuera de 1..3")
            if p["tipo"] in ("salida", "compila") and not p["codigo"]:
                errores.append(f"{pid}: tipo {p['tipo']} sin bloque ```kotlin en el enunciado")
    return errores


def leer_banco(carpeta):
    bloques = [leer_bloque(f) for f in sorted(Path(carpeta).glob("*.md"))]
    return sorted(bloques, key=lambda b: b["bloque"])


if __name__ == "__main__":
    carpeta = sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent / "kotlin"
    bloques = leer_banco(carpeta)
    errores = validar(bloques)
    for b in bloques:
        cuenta = {d: sum(p["dificultad"] == d for p in b["preguntas"]) for d in (1, 2, 3)}
        print(f"Bloque {b['bloque']:>2} · {b['titulo']:<40} {len(b['preguntas']):>3} preguntas  (dif. {cuenta[1]}/{cuenta[2]}/{cuenta[3]})")
    print(f"Total: {sum(len(b['preguntas']) for b in bloques)} preguntas")
    for e in errores:
        print("ERROR:", e)
    sys.exit(1 if errores else 0)
