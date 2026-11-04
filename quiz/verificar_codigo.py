#!/usr/bin/env python3
"""
Verifica el banco de ejercicios de código compilando y ejecutando sus tests con kotlinc,
kotlin.test y JUnit 4 (lo mismo que usa Kotlin Playground con data-target-platform="junit").

- kata:    el esqueleto compila y algún test falla; con la solución pasan todos.
- error:   el código erróneo falla y el mensaje del bloque ```text del enunciado aparece
           en la salida; con la línea corregida pasan todos.
- huecos:  rellenando cada hueco con su primera respuesta, compila y pasan los tests.
- parsons: en el orden correcto (sin distractores), compila y pasan los tests.

Uso:
  python3 quiz/verificar_codigo.py [--solo id1,id2] [--junit ruta.jar --hamcrest ruta.jar]

Requiere `kotlinc` y `kotlin` (`sdk install kotlin`). Los jar de JUnit 4 y Hamcrest se buscan
en la caché de Gradle si no se indican; los de kotlin.test, junto a kotlinc.
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import codigo as banco  # noqa: E402

RE_TEXT = re.compile(r"```text\n(.*?)\n```", re.S)
RE_CLASE_TEST = re.compile(r"^class\s+(\w+)", re.M)
CACHE_GRADLE = Path.home() / ".gradle/caches/modules-2/files-2.1"


def buscar_jar(grupo, nombre):
    candidatos = sorted((CACHE_GRADLE / grupo / nombre).glob(f"*/*/{nombre}-*.jar"))
    candidatos = [c for c in candidatos if not re.search(r"-(sources|javadoc)\.jar$", c.name)]
    return str(candidatos[-1]) if candidatos else None


def herramienta(nombre):
    ruta = shutil.which(nombre)
    if ruta:
        return ruta
    sdk = Path.home() / ".sdkman/candidates/kotlin/current/bin" / nombre
    return str(sdk) if sdk.exists() else None


class Ejecutor:
    def __init__(self, cp):
        self.cp = cp
        self.kotlinc = herramienta("kotlinc")
        self.kotlin = herramienta("kotlin")
        if not (self.kotlinc and self.kotlin):
            sys.exit("No encuentro kotlinc/kotlin (instala con `sdk install kotlin`).")

    def probar(self, ficheros):
        """Compila los ficheros {nombre: código} y ejecuta sus clases de test.
        Devuelve (compila, todos_pasan, salida)."""
        with tempfile.TemporaryDirectory() as tmp:
            rutas = []
            for nombre, texto in ficheros.items():
                ruta = Path(tmp) / nombre
                ruta.write_text(texto + "\n", encoding="utf-8")
                rutas.append(str(ruta))
            out = Path(tmp) / "out"
            comp = subprocess.run(
                [self.kotlinc, *rutas, "-cp", self.cp, "-d", str(out), "-nowarn"],
                capture_output=True, text=True,
            )
            if comp.returncode != 0:
                return False, False, comp.stderr
            clases = [c for t in ficheros.values() for c in RE_CLASE_TEST.findall(t) if "@Test" in t]
            clases = [c for c in clases if (out / f"{c}.class").exists() and c.endswith("Test")]
            run = subprocess.run(
                [self.kotlin, "-cp", f"{out}{os.pathsep}{self.cp}", "org.junit.runner.JUnitCore", *clases],
                capture_output=True, text=True, timeout=120,
            )
            return True, run.returncode == 0, run.stdout + run.stderr


def sin_funciones(esqueleto, solucion):
    """Quita del esqueleto las funciones que define la solución (de `fun nombre(` a su `}` de primer nivel)."""
    nombres = set(re.findall(r"^fun\s+(\w+)\s*\(", solucion, re.M))
    res, saltando = [], False
    for linea in esqueleto.split("\n"):
        m = re.match(r"^fun\s+(\w+)\s*\(", linea)
        if m and m.group(1) in nombres:
            saltando = True
        if not saltando:
            res.append(linea)
        elif linea == "}":
            saltando = False
    return "\n".join(res)


def mensajes_esperados(enunciado):
    """Partes de los mensajes `Fail: test: …` / `Error: test: …` que deben salir en JUnit."""
    res = []
    for bloque in RE_TEXT.findall(enunciado):
        for linea in bloque.splitlines():
            m = re.match(r"^(?:Fail|Error):\s*\w+:\s*(.+)$", linea.strip())
            if m:
                res.append(m.group(1))
    return res


def verificar(ej, ejecutor):
    tipo, sec = ej["tipo"], ej["secciones"]
    cod = banco.codigo_de(sec.get("Código", ""))
    tests = banco.codigo_de(sec.get("Tests", ""))
    problemas = []

    def con_tests(principal):
        f = {"Codigo.kt": principal}
        if tests:
            f["Tests.kt"] = tests
        return f

    if tipo == "kata":
        ok_c, ok_t, salida = ejecutor.probar(con_tests(cod))
        if not ok_c:
            problemas.append("el esqueleto no compila:\n" + salida)
        elif ok_t:
            problemas.append("con el esqueleto los tests ya pasan")
        sol = banco.codigo_de(sec["Solución"])
        ok_c, ok_t, salida = ejecutor.probar(con_tests(sin_funciones(cod, sol) + "\n\n" + sol))
        if not (ok_c and ok_t):
            problemas.append("la solución no pasa los tests:\n" + salida)
    elif tipo == "error":
        malo, bueno, _ = banco.corregido(cod)
        ok_c, ok_t, salida = ejecutor.probar(con_tests(malo))
        if not ok_c:
            problemas.append("el código erróneo no compila:\n" + salida)
        elif ok_t:
            problemas.append("el código erróneo pasa los tests")
        else:
            for m in mensajes_esperados(ej["enunciado"]):
                if m not in salida:
                    problemas.append(f"el mensaje del enunciado no aparece en la salida: {m}\n{salida}")
        ok_c, ok_t, salida = ejecutor.probar(con_tests(bueno))
        if not (ok_c and ok_t):
            problemas.append("el código corregido no pasa los tests:\n" + salida)
    elif tipo in ("huecos", "parsons"):
        principal = banco.rellenar(cod) if tipo == "huecos" else banco.parsons(cod)[1]
        ok_c, ok_t, salida = ejecutor.probar(con_tests(principal))
        if not (ok_c and ok_t):
            problemas.append("la versión correcta no compila o no pasa los tests:\n" + salida)
    return problemas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("carpeta", nargs="?", default=str(Path(__file__).parent / "codigo"))
    ap.add_argument("--solo", default="")
    ap.add_argument("--junit", default=buscar_jar("junit", "junit"))
    ap.add_argument("--hamcrest", default=buscar_jar("org.hamcrest", "hamcrest-core"))
    ap.add_argument("--hilos", type=int, default=4)
    args = ap.parse_args()
    if not (args.junit and args.hamcrest):
        sys.exit("No encuentro los jar de JUnit 4 / Hamcrest: indícalos con --junit y --hamcrest.")

    grupos = banco.leer_banco(args.carpeta)
    errores = banco.validar(grupos)
    for e in errores:
        print("✗", e)
    solo = set(filter(None, args.solo.split(",")))
    ejercicios = [e for g in grupos for e in g["ejercicios"]
                  if e["tipo"] != "defensa" and (not solo or e["id"] in solo)]

    lib = Path(herramienta("kotlinc") or ".").resolve().parent.parent / "lib"
    kotlin_test = [str(lib / j) for j in ("kotlin-test.jar", "kotlin-test-junit.jar")]
    if not all(Path(j).exists() for j in kotlin_test):
        sys.exit(f"No encuentro kotlin-test.jar / kotlin-test-junit.jar en {lib}.")
    ejecutor = Ejecutor(os.pathsep.join([args.junit, args.hamcrest, *kotlin_test]))
    fallos = 0
    with ThreadPoolExecutor(args.hilos) as pool:
        for ej, problemas in zip(ejercicios, pool.map(lambda e: verificar(e, ejecutor), ejercicios)):
            if problemas:
                fallos += 1
                print(f"✗ {ej['id']}")
                for p in problemas:
                    print("   ", p.replace("\n", "\n    "))
            else:
                print(f"✓ {ej['id']}")
    print(f"{len(ejercicios)} ejercicios verificados, {fallos} con problemas, {len(errores)} errores de formato")
    sys.exit(1 if fallos or errores else 0)


if __name__ == "__main__":
    main()
