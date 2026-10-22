#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Corrección Automática de Cuestionarios Tipo Test
Módulo: Programación Multimedia y Dispositivos Móviles (PMDM) - 2º DAM
Profesor: Jesús Salvador Sánchez García

Uso:
  python3 corregir.py --solucionario <ruta_solucionario.yaml> --entregas <carpeta_entregas> [--salida <reporte.md>]
"""

import sys
import os
import re
import argparse
from datetime import datetime

# Parser ligero de YAML nativo por si PyYAML no está instalado en el sistema
def cargar_yaml_ligero(ruta_archivo):
    """
    Parser simple de YAML optimizado para plantillas de examen:
    - Secciones: clave:
    - Subclaves con indentación de 2 espacios
    - Manejo de cadenas con o sin comillas y comentarios #
    """
    try:
        import yaml
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except ImportError:
        pass

    # Fallback sin dependencias
    datos = {}
    seccion_actual = None

    with open(ruta_archivo, 'r', encoding='utf-8') as f:
        for linea in f:
            linea_limpia = linea.split('#')[0].rstrip()
            if not linea_limpia.strip():
                continue

            # Seccion principal (sin indentacion)
            match_seccion = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*$', linea_limpia)
            if match_seccion:
                seccion_actual = match_seccion.group(1).lower()
                datos[seccion_actual] = {}
                continue

            # Elemento dentro de seccion
            match_sub = re.match(r'^\s{2,4}([a-zA-Z0-9_-]+)\s*:\s*(.*)$', linea_limpia)
            if match_sub and seccion_actual:
                k = match_sub.group(1)
                v = match_sub.group(2).strip().strip('"\'')
                # Intentar convertir numeros
                try:
                    if '.' in v:
                        v = float(v)
                    elif v.isdigit() or (v.startswith('-') and v[1:].isdigit()):
                        v = int(v)
                except ValueError:
                    pass
                datos[seccion_actual][k] = v
                continue

            # Clave: valor de nivel superior
            match_simple = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', linea_limpia)
            if match_simple:
                k = match_simple.group(1).lower()
                v = match_simple.group(2).strip().strip('"\'')
                datos[k] = v
                seccion_actual = None

    return datos


def cargar_solucionario(ruta_archivo):
    """
    Carga el solucionario desde un archivo .yaml o .md (Markdown).
    Si es Markdown, extrae las soluciones de la tabla oficial.
    """
    if ruta_archivo.endswith('.md'):
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            contenido = f.read()

        # Buscar filas de tabla con formato | 01 | B | ... o | **01** | **B** | ...
        patron = r'\|\s*\*{0,2}(\d+)\*{0,2}\s*\|\s*\*{0,2}([A-Da-d])\*{0,2}\s*\|'
        coincidencias = re.findall(patron, contenido)
        soluciones = {int(num): letra.upper() for num, letra in coincidencias}

        return {
            "cuestionario": {
                "titulo": "Evaluación Tipo Test: Kotlin",
                "total_preguntas": len(soluciones),
                "nota_maxima": 10.0,
                "acierto": 1.0,
                "fallo": 0.33,
                "blanco": 0.0
            },
            "soluciones": soluciones
        }

    return cargar_yaml_ligero(ruta_archivo)


def normalizar_clave_pregunta(k):
    """Convierte '1', '01', 'p01', 1 a entero para comparaciones fiables."""
    s = str(k).strip().lower()
    if s.startswith('p'):
        s = s[1:]
    try:
        return int(s)
    except ValueError:
        return s


def corregir_entrega(datos_alumno, datos_solucionario):
    alumno = datos_alumno.get('alumno', {})
    apellidos = str(alumno.get('apellidos', 'Desconocido')).strip()
    nombre = str(alumno.get('nombre', 'Sin nombre')).strip()
    dni = str(alumno.get('dni', 'Sin DNI')).strip()
    grupo = str(alumno.get('grupo', '2DAM')).strip()

    respuestas_alumno = datos_alumno.get('respuestas', {})
    respuestas_correctas = datos_solucionario.get('soluciones', {})
    config = datos_solucionario.get('cuestionario', {})

    nota_maxima = float(config.get('nota_maxima', 10.0))
    ptos_acierto = float(config.get('acierto', 1.0))
    penalizacion_fallo = abs(float(config.get('fallo', 0.33)))
    ptos_blanco = float(config.get('blanco', 0.0))

    # Normalizar diccionarios por numero de pregunta
    norm_sol = {normalizar_clave_pregunta(k): str(v).strip().upper() for k, v in respuestas_correctas.items()}
    norm_alu = {normalizar_clave_pregunta(k): str(v).strip().upper() for k, v in respuestas_alumno.items()}

    total_preguntas = len(norm_sol)
    aciertos = 0
    fallos = 0
    blancos = 0
    detalles_fallos = []

    for num in sorted(norm_sol.keys()):
        resp_correcta = norm_sol[num]
        resp_dada = norm_alu.get(num, "")

        if not resp_dada or resp_dada in ["", "-", "BLANCO", "NULL"]:
            blancos += 1
        elif resp_dada == resp_correcta:
            aciertos += 1
        else:
            fallos += 1
            detalles_fallos.append((num, resp_dada, resp_correcta))

    # Calculo de puntuacion
    puntos_brutos = (aciertos * ptos_acierto) - (fallos * penalizacion_fallo) + (blancos * ptos_blanco)
    if puntos_brutos < 0:
        puntos_brutos = 0.0

    puntos_maximos_posibles = total_preguntas * ptos_acierto
    nota_final = (puntos_brutos / puntos_maximos_posibles) * nota_maxima if puntos_maximos_posibles > 0 else 0.0
    nota_final = round(nota_final, 2)

    return {
        "apellidos": apellidos,
        "nombre": nombre,
        "nombre_completo": f"{apellidos}, {nombre}",
        "dni": dni,
        "grupo": grupo,
        "total_preguntas": total_preguntas,
        "aciertos": aciertos,
        "fallos": fallos,
        "blancos": blancos,
        "puntos_brutos": round(puntos_brutos, 2),
        "nota_final": nota_final,
        "detalles_fallos": detalles_fallos
    }


def main():
    parser = argparse.ArgumentParser(
        description="Corrector automático de cuestionarios tipo test para PMDM 2º DAM."
    )
    parser.add_argument(
        "--solucionario", "-s", required=True,
        help="Ruta al archivo solucionario.yaml del cuestionario"
    )
    parser.add_argument(
        "--entregas", "-e", required=True,
        help="Carpeta que contiene los archivos de respuestas (.yaml/.yml) de los alumnos"
    )
    parser.add_argument(
        "--salida", "-o", default=None,
        help="Ruta del archivo Markdown donde guardar las calificaciones (por defecto genera calificaciones.md)"
    )
    parser.add_argument(
        "--csv", action="store_true",
        help="Genera también un archivo .csv con las notas para importar a hojas de cálculo"
    )

    args = parser.parse_args()

    if not os.path.isfile(args.solucionario):
        print(f"Error: No se encuentra el archivo solucionario: {args.solucionario}", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(args.entregas):
        print(f"Error: No se encuentra la carpeta de entregas: {args.entregas}", file=sys.stderr)
        sys.exit(1)

    datos_solucionario = cargar_solucionario(args.solucionario)
    config = datos_solucionario.get('cuestionario', {})
    titulo_cuestionario = config.get('titulo', 'Cuestionario Kotlin')

    archivos_entregas = [
        os.path.join(args.entregas, f)
        for f in os.listdir(args.entregas)
        if f.endswith('.yaml') or f.endswith('.yml')
    ]

    if not archivos_entregas:
        print(f"Aviso: No se encontraron archivos .yaml en {args.entregas}")
        sys.exit(0)

    resultados = []
    conteo_fallos_por_pregunta = {}

    for archivo in archivos_entregas:
        try:
            datos_alumno = cargar_yaml_ligero(archivo)
            res = corregir_entrega(datos_alumno, datos_solucionario)
            res['archivo'] = os.path.basename(archivo)
            resultados.append(res)

            # Acumular fallos por pregunta para analisis pedagogico
            for num, _, _ in res['detalles_fallos']:
                conteo_fallos_por_pregunta[num] = conteo_fallos_por_pregunta.get(num, 0) + 1
        except Exception as e:
            print(f"Error al procesar {archivo}: {e}", file=sys.stderr)

    # Ordenar alfabeticamente por Apellidos, Nombre
    resultados.sort(key=lambda r: (r['apellidos'].lower(), r['nombre'].lower()))

    # Estadisticas globales
    total_alumnos = len(resultados)
    notas = [r['nota_final'] for r in resultados]
    nota_media = round(sum(notas) / total_alumnos, 2) if total_alumnos > 0 else 0.0
    aprobados = sum(1 for n in notas if n >= 5.0)
    pct_aprobados = round((aprobados / total_alumnos) * 100, 1) if total_alumnos > 0 else 0.0

    # Determinar ruta de salida
    ruta_salida = args.salida
    if not ruta_salida:
        ruta_salida = os.path.join(args.entregas, "calificaciones.md")

    # Construir informe en Markdown
    lineas = []
    lineas.append(f"# Calificaciones: {titulo_cuestionario}")
    lineas.append("")
    lineas.append(f"- **Fecha de corrección:** {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    lineas.append(f"- **Total alumnos evaluados:** {total_alumnos}")
    lineas.append(f"- **Nota media del grupo:** {nota_media} / 10.0")
    lineas.append(f"- **Aprobados:** {aprobados} ({pct_aprobados}%) | **Suspensos:** {total_alumnos - aprobados}")
    lineas.append("")
    lineas.append("---")
    lineas.append("")
    lineas.append("## Tabla de Calificaciones (Orden Alfabético)")
    lineas.append("")
    lineas.append("| Nº | Apellidos, Nombre | DNI | Aciertos | Fallos | Blancos | Nota Final | Estado |")
    lineas.append("| :-: | :---------------- | :---: | :------: | :----: | :-----: | :--------: | :----: |")

    for i, r in enumerate(resultados, start=1):
        estado = "APROBADO" if r['nota_final'] >= 5.0 else "**SUSPENSO**"
        lineas.append(
            f"| {i:02d} | {r['nombre_completo']} | {r['dni']} | {r['aciertos']} | {r['fallos']} | {r['blancos']} | **{r['nota_final']:.2f}** | {estado} |"
        )

    lineas.append("")
    lineas.append("---")
    lineas.append("")
    lineas.append("## Preguntas con Mayor Número de Fallos (Para Repaso en Clase)")
    lineas.append("")
    if conteo_fallos_por_pregunta:
        ranking_fallos = sorted(conteo_fallos_por_pregunta.items(), key=lambda x: x[1], reverse=True)[:5]
        lineas.append("| Pregunta | Alumnos que fallaron | % de fallo sobre el grupo |")
        lineas.append("| :------: | :------------------: | :------------------------: |")
        for num, cant in ranking_fallos:
            pct = round((cant / total_alumnos) * 100, 1)
            lineas.append(f"| **Pregunta {num:02d}** | {cant} | {pct}% |")
    else:
        lineas.append("No se registraron fallos en ninguna pregunta.")

    lineas.append("")

    with open(ruta_salida, 'w', encoding='utf-8') as f:
        f.write("\n".join(lineas))

    print(f"Informe de calificaciones generado con éxito en: {ruta_salida}")

    # Si se solicita CSV
    if args.csv:
        ruta_csv = os.path.splitext(ruta_salida)[0] + ".csv"
        with open(ruta_csv, 'w', encoding='utf-8') as f:
            f.write("Orden,Apellidos,Nombre,DNI,Grupo,Aciertos,Fallos,Blancos,NotaFinal,Estado\n")
            for i, r in enumerate(resultados, start=1):
                estado = "APROBADO" if r['nota_final'] >= 5.0 else "SUSPENSO"
                f.write(f'{i},"{r["apellidos"]}","{r["nombre"]}","{r["dni"]}","{r["grupo"]}",{r["aciertos"]},{r["fallos"]},{r["blancos"]},{r["nota_final"]:.2f},{estado}\n')
        print(f"Archivo CSV generado en: {ruta_csv}")


if __name__ == "__main__":
    main()
