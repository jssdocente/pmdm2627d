"""
Hook de MkDocs: convierte el banco de ejercicios de código (quiz/codigo/*.md) en JSON
para la página de práctica de código (docs/extra/js/kt-codigo.js).

Los textos se renderizan con las mismas extensiones del sitio; las líneas de código
interactivas (errores, huecos, Parsons) se resaltan una a una con Pygments.
Se publica en site/extra/quiz/codigo.json.
"""

import json
import logging
import re
import sys
from pathlib import Path

import markdown
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import KotlinLexer

sys.path.insert(0, str(Path(__file__).parent))
import codigo as banco  # noqa: E402

log = logging.getLogger("mkdocs.hooks.codigo")
LEXER = KotlinLexer()
FORMATO = HtmlFormatter(nowrap=True)
RE_ITEM = re.compile(r"^-\s+", re.M)


def _md(config):
    return markdown.Markdown(
        extensions=config["markdown_extensions"],
        extension_configs=config["mdx_configs"],
    )


def _html(conv, texto):
    conv.reset()
    return conv.convert(texto or "")


def _bloque(conv, codigo):
    return _html(conv, f"```kotlin\n{codigo}\n```") if codigo else ""


def _linea(texto):
    """Una línea de Kotlin resaltada (sin saltos)."""
    return highlight(texto, LEXER, FORMATO).rstrip("\n") if texto.strip() else texto


def _items(conv, texto):
    """Cada elemento `- …` de una lista Markdown, renderizado por separado."""
    trozos = [t.strip() for t in RE_ITEM.split(texto or "") if t.strip()]
    return [_html(conv, t) for t in trozos]


def _enlace(apuntes, ancla):
    if not (apuntes and ancla):
        return ""
    pagina, _, frag = ancla.partition("#")
    return f"{apuntes.rstrip('/')}/{pagina.replace('.md', '.html')}" + (f"#{frag}" if frag else "")


def _huecos_html(codigo):
    """Código con cada hueco convertido en <span class="ktc-hueco" data-i="n">, resaltado línea a línea."""
    contador = iter(range(10_000))
    marcado = banco.RE_HUECO.sub(lambda m: f"KTCHUECO{next(contador)}", codigo)
    lineas = [_linea(l) for l in marcado.split("\n")]
    return [re.sub(r"KTCHUECO(\d+)", r'<span class="ktc-hueco" data-i="\1"></span>', l) for l in lineas]


def ejercicio_json(conv, apuntes, ej):
    sec = ej["secciones"]
    cod = banco.codigo_de(sec.get("Código", ""))
    tests = banco.codigo_de(sec.get("Tests", ""))
    datos = {
        "id": ej["id"],
        "tipo": ej["tipo"],
        "titulo": ej["titulo"],
        "dificultad": ej["dificultad"],
        "temas": ej["temas"],
        "enlace": _enlace(apuntes, ej["ancla"]),
        "enunciado": _html(conv, ej["enunciado"]),
        "tests": _bloque(conv, tests),
        "explicacion": _html(conv, sec.get("Explicación", "")),
    }
    if ej["tipo"] == "kata":
        datos.update({
            "codigo": cod,
            "testsCodigo": tests,
            "solucion": _bloque(conv, banco.codigo_de(sec["Solución"])),
            "pistas": _items(conv, sec.get("Pistas", "")),
        })
    elif ej["tipo"] == "error":
        malo, bueno, indice = banco.corregido(cod)
        datos.update({
            "lineas": [_linea(l) for l in malo.split("\n")],
            "error": indice,
            "correccion": _linea(bueno.split("\n")[indice]),
        })
    elif ej["tipo"] == "huecos":
        datos.update({
            "lineas": _huecos_html(cod),
            "respuestas": banco.huecos(cod),
            "solucion": _bloque(conv, banco.rellenar(cod)),
        })
    elif ej["tipo"] == "parsons":
        lineas, correcto = banco.parsons(cod)
        datos.update({
            "lineas": [
                {"html": _linea(l["texto"]), "fijo": l["fijo"], "distractor": l["distractor"], "grupo": l["grupo"]}
                for l in lineas
            ],
            "solucion": _bloque(conv, correcto),
        })
    elif ej["tipo"] == "defensa":
        datos.update({
            "modelo": _html(conv, sec.get("Respuesta modelo", "")),
            "cotejo": _items(conv, sec.get("Cotejo", "")),
        })
    return datos


def on_post_build(config, **kwargs):
    conv = _md(config)
    raiz = Path(config["config_file_path"]).parent / "quiz" / "codigo"
    destino = Path(config["site_dir"]) / "extra" / "quiz"
    destino.mkdir(parents=True, exist_ok=True)
    grupos = banco.leer_banco(raiz)
    for e in banco.validar(grupos):
        log.warning("Banco de código: %s", e)
    salida = {
        "temas": [{"id": k, "titulo": v} for k, v in banco.TEMAS.items()],
        "ejercicios": [ejercicio_json(conv, g["apuntes"], e) for g in grupos for e in g["ejercicios"]],
    }
    (destino / "codigo.json").write_text(json.dumps(salida, ensure_ascii=False), encoding="utf-8")
    log.info("Banco de código: %d ejercicios publicados", len(salida["ejercicios"]))
