"""
Hook de MkDocs: convierte el banco de preguntas (quiz/<banco>/*.md) en JSON
para la página de práctica (docs/extra/js/kt-quiz.js).

El Markdown de enunciados, opciones y realimentación se renderiza aquí con las
mismas extensiones del sitio, así el código se resalta igual que en los apuntes.
Se publica en site/extra/quiz/<banco>.json.
"""

import json
import logging
import sys
from pathlib import Path

import markdown

sys.path.insert(0, str(Path(__file__).parent))
import banco  # noqa: E402

log = logging.getLogger("mkdocs.hooks.quiz")
BANCOS = ["kotlin"]


def _md(config):
    return markdown.Markdown(
        extensions=config["markdown_extensions"],
        extension_configs=config["mdx_configs"],
    )


def _html(conv, texto):
    conv.reset()
    return conv.convert(texto)


def _enlace(apuntes, ancla):
    """Enlace a los apuntes desde la raíz del sitio. `ancla` puede ser `id` o `pagina.md#id`
    (página relativa a la carpeta de los apuntes del bloque)."""
    if not apuntes:
        return ""
    pagina, _, frag = ancla.rpartition("#") if "#" in ancla else ("", "", ancla)
    if ancla.endswith(".md"):
        pagina, frag = ancla, ""
    ruta = str(Path(apuntes).parent / pagina) if pagina else apuntes
    return ruta.replace(".md", ".html") + (f"#{frag}" if frag else "")


def on_post_build(config, **kwargs):
    conv = _md(config)
    raiz = Path(config["config_file_path"]).parent / "quiz"
    destino = Path(config["site_dir"]) / "extra" / "quiz"
    destino.mkdir(parents=True, exist_ok=True)
    for nombre in BANCOS:
        bloques = banco.leer_banco(raiz / nombre)
        for e in banco.validar(bloques):
            log.warning("Banco %s: %s", nombre, e)
        salida = {"bloques": [], "preguntas": []}
        for b in bloques:
            salida["bloques"].append({
                "bloque": b["bloque"],
                "titulo": b["titulo"],
                "apuntes": b["apuntes"].replace(".md", ".html"),
            })
            for p in b["preguntas"]:
                salida["preguntas"].append({
                    "id": p["id"],
                    "bloque": p["bloque"],
                    "dificultad": p["dificultad"],
                    "tipo": p["tipo"],
                    "enlace": _enlace(b["apuntes"], p["ancla"]),
                    "enunciado": _html(conv, p["enunciado"]),
                    "codigo": p["codigo"] if p["ejecutable"] else "",
                    "opciones": [
                        {
                            "texto": _html(conv, o["texto"]),
                            "correcta": o["correcta"],
                            "feedback": _html(conv, o["feedback"]),
                        }
                        for o in p["opciones"]
                    ],
                })
        (destino / f"{nombre}.json").write_text(
            json.dumps(salida, ensure_ascii=False), encoding="utf-8"
        )
        log.info("Banco %s: %d preguntas publicadas", nombre, len(salida["preguntas"]))
