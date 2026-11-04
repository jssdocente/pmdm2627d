#!/usr/bin/env python3
"""
Verifica el banco de preguntas compilando y ejecutando el código con kotlinc.

- tipo=salida   -> la salida real debe coincidir con la opción correcta
                   (su bloque ```text o su único `código` en línea).
                   Con excepcion=Nombre, la ejecución debe lanzar esa excepción.
- tipo=compila  -> con `error` el código NO debe compilar; sin él, debe compilar.

Uso:
  python3 quiz/verificar.py [carpeta_banco] [--solo id1,id2] [--cp ruta.jar]

Requiere `kotlinc` y `kotlin` en el PATH (por ejemplo, `sdk install kotlin`).
Para las preguntas de corrutinas añade el jar de kotlinx-coroutines con --cp.
"""

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import banco  # noqa: E402

RE_TEXT = re.compile(r"```text\n(.*?)\n```", re.S)
RE_INLINE = re.compile(r"^`([^`]+)`$")


def esperado(pregunta):
    correcta = next(o for o in pregunta["opciones"] if o["correcta"])
    m = RE_TEXT.search(correcta["texto"])
    if m:
        return m.group(1)
    m = RE_INLINE.match(correcta["texto"].strip())
    return m.group(1) if m else None


def programa(pid, codigo):
    """Fichero Kotlin con paquete propio; envuelve en main() si hace falta."""
    imports = [l for l in codigo.splitlines() if l.startswith("import ")]
    resto = "\n".join(l for l in codigo.splitlines() if not l.startswith("import "))
    if not re.search(r"\bfun\s+main\s*\(", resto):
        resto = "fun main() {\n" + resto + "\n}"
    paquete = "q_" + re.sub(r"\W", "_", pid)
    return paquete, f'@file:JvmName("Main")\npackage {paquete}\n' + "\n".join(imports) + "\n" + resto + "\n"


def normalizar(texto):
    return "\n".join(l.rstrip() for l in texto.strip("\n").splitlines()).rstrip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("carpeta", nargs="?", default=str(Path(__file__).parent / "kotlin"))
    ap.add_argument("--solo", default="")
    ap.add_argument("--cp", default="")
    args = ap.parse_args()

    if not shutil.which("kotlinc"):
        sys.exit("No se encuentra kotlinc en el PATH")

    bloques = banco.leer_banco(args.carpeta)
    errores = banco.validar(bloques)
    preguntas = [p for b in bloques for p in b["preguntas"]]
    if args.solo:
        ids = set(args.solo.split(","))
        preguntas = [p for p in preguntas if p["id"] in ids]

    tmp = Path(tempfile.mkdtemp(prefix="quiz-"))
    cp = ["-cp", args.cp] if args.cp else []
    compilables, que_fallan, sin_comprobar = [], [], []
    for p in preguntas:
        if p["tipo"] == "compila" and p["error"]:
            que_fallan.append(p)
        elif p["tipo"] in ("salida", "compila"):
            compilables.append(p)
        elif p["codigo"]:
            compilables.append(p)  # concepto con código: al menos que compile

    # 1) Todo lo que debe compilar, en una sola pasada de kotlinc.
    fuentes = tmp / "ok"
    fuentes.mkdir()
    paquetes = {}
    for p in compilables:
        paquete, src = programa(p["id"], p["codigo"])
        paquetes[p["id"]] = paquete
        (fuentes / f"{paquete}.kt").write_text(src, encoding="utf-8")
    jar = tmp / "banco.jar"
    if compilables:
        print(f"Compilando {len(compilables)} fragmentos…", flush=True)
        r = subprocess.run(["kotlinc", *cp, str(fuentes), "-d", str(jar), "-nowarn"],
                           capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stderr)
            sys.exit("Hay fragmentos que deberían compilar y no compilan (ver arriba)")

    # 2) Ejecutar y comparar salidas.
    runcp = str(jar) + ((":" + args.cp) if args.cp else "")
    for p in compilables:
        if p["tipo"] != "salida":
            continue
        r = subprocess.run(["kotlin", "-cp", runcp, f"{paquetes[p['id']]}.Main"],
                           capture_output=True, text=True, timeout=60)
        if p["excepcion"]:
            if p["excepcion"] not in r.stderr:
                errores.append(f"{p['id']}: se esperaba {p['excepcion']} y no se lanzó (stderr: {r.stderr.strip()[:200]})")
            continue
        if r.returncode != 0:
            errores.append(f"{p['id']}: falla al ejecutar: {r.stderr.strip()[:300]}")
            continue
        esp = esperado(p)
        if esp is None:
            sin_comprobar.append(f"{p['id']}: salida real ->\n{r.stdout}")
        elif normalizar(esp) != normalizar(r.stdout):
            errores.append(f"{p['id']}: salida distinta\n  esperada: {esp!r}\n  real:     {r.stdout!r}")

    # 3) Lo que NO debe compilar, de uno en uno.
    for p in que_fallan:
        d = tmp / p["id"]
        d.mkdir()
        _, src = programa(p["id"], p["codigo"])
        (d / "q.kt").write_text(src, encoding="utf-8")
        r = subprocess.run(["kotlinc", *cp, str(d / "q.kt"), "-d", str(d / "out"), "-nowarn"],
                           capture_output=True, text=True)
        if r.returncode == 0:
            errores.append(f"{p['id']}: se esperaba error de compilación y compila")
        else:
            primera = next((l for l in r.stderr.splitlines() if "error:" in l), "").split("error:")[-1].strip()
            print(f"  {p['id']}: no compila, como se esperaba → {primera}")

    shutil.rmtree(tmp, ignore_errors=True)
    for s in sin_comprobar:
        print("REVISAR A MANO:", s)
    for e in errores:
        print("ERROR:", e)
    print(f"{len(preguntas)} preguntas revisadas, {len(errores)} errores")
    sys.exit(1 if errores else 0)


if __name__ == "__main__":
    main()
