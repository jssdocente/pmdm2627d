# Guía de Uso: Script de Corrección Automática

Este directorio contiene la herramienta de corrección automática para los cuestionarios tipo test del módulo **PMDM (2º DAM)**.

---

## 1. Características

- **Sin dependencias externas:** Funciona con el Python estándar de cualquier sistema (no requiere `pip install pyyaml`, aunque si está instalado lo aprovecha).
- **Ordenación alfabética automática:** Ordena los resultados por `Apellidos, Nombre` para volcar directamente las notas a la lista de clase o Séneca.
- **Detección y análisis pedagógico:** Genera un ranking con las preguntas más falladas del cuestionario para saber qué conceptos repasar en el aula.
- **Configuración flexible:** Permite definir penalización por fallo (ej. `-0.33` para 3 errores restan 1 acierto, o `0.0` para no penalizar).
- **Exportación dual:** Genera un informe en **Markdown** y opcionalmente en **CSV** para hojas de cálculo.

---

## 2. Instrucciones de Ejecución

Desde la raíz del repositorio o dentro de `.exams/.cuestionarios/`:

```bash
# Corrección estándar indicando solucionario (admite tanto .md como .yaml) y carpeta de entregas:
python3 .exams/.cuestionarios/bin/corregir.py \
  --solucionario .exams/.cuestionarios/simulacro-01/solucionario.md \
  --entregas ruta/a/entregas_alumnos \
  --salida .exams/.cuestionarios/simulacro-01/calificaciones.md \
  --csv
```

### Argumentos disponibles:
- `--solucionario`, `-s` (Obligatorio): Ruta al archivo de soluciones (`solucionario.md` o `solucionario.yaml`).
- `--entregas`, `-e` (Obligatorio): Carpeta donde están los archivos `.yaml` entregados por los alumnos.
- `--salida`, `-o` (Opcional): Ruta del informe Markdown generado (por defecto `calificaciones.md` en la carpeta de entregas).
- `--csv` (Opcional): Genera adicionalmente un archivo `.csv` tabulado.
