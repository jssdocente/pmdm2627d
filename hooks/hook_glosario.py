"""Comprueba los enlaces del glosario contra el sitio compilado.

Como hook de MkDocs avisa en cada `mkdocs build` si un enlace o un ancla de
`temas/glosario.md` deja de existir, y si un enlace a otra página no lleva ancla.
También se puede ejecutar a mano sobre un sitio ya compilado:

    python hooks/hook_glosario.py site
"""
import logging
import posixpath
import re
import sys
from pathlib import Path
from urllib.parse import unquote

GLOSARIO = "temas/glosario.html"
log = logging.getLogger("mkdocs.hooks.glosario")


def _ids(fichero):
    return set(re.findall(r'\bid="([^"]+)"', fichero.read_text(encoding="utf-8")))


def comprobar(site_dir):
    """Devuelve la lista de problemas encontrados en el glosario compilado."""
    site = Path(site_dir)
    html = (site / GLOSARIO).read_text(encoding="utf-8")
    articulo = re.search(r"<article.*?</article>", html, re.S).group(0)
    problemas = []
    for href in sorted(set(re.findall(r'<a [^>]*href="([^"]+)"', articulo))):
        if re.match(r"[a-z]+:", href) or href.startswith(".."):
            continue
        ruta, _, ancla = href.partition("#")
        ancla = unquote(ancla)
        destino = posixpath.normpath(posixpath.join(posixpath.dirname(GLOSARIO), ruta)) if ruta else GLOSARIO
        if not (site / destino).is_file():
            problemas.append(f"{href}: la página no existe")
        elif not ancla:
            problemas.append(f"{href}: enlace sin ancla")
        elif ancla not in _ids(site / destino):
            problemas.append(f"{href}: el ancla no existe")
    return problemas


def on_post_build(config, **kwargs):
    if not (Path(config["site_dir"]) / GLOSARIO).is_file():
        return
    for problema in comprobar(config["site_dir"]):
        log.warning("Glosario: %s", problema)


if __name__ == "__main__":
    fallos = comprobar(sys.argv[1] if len(sys.argv) > 1 else "site")
    print("\n".join(fallos) or "Glosario: todos los enlaces y anclas existen.")
    sys.exit(1 if fallos else 0)
