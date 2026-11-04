/*
 * Práctica tipo test para MkDocs
 * ------------------------------
 * Carga un banco de preguntas en JSON (generado por quiz/hook_mkdocs.py a partir
 * de quiz/<banco>/*.md) y monta una tanda aleatoria que intercala bloques.
 *
 * Uso en un .md:
 *   <div class="ktq" data-banco="kotlin" data-root="../../"></div>
 *   <script src="../../extra/js/kt-quiz.js"></script>
 *
 * Modos:
 *   - Práctica: realimentación inmediata de cada opción + botón para ejecutar el código.
 *   - Simulacro: sin realimentación hasta entregar; baremo +1 / -0,33 / 0, nota sobre 10.
 *
 * La URL admite ?bloques=5,6 para abrir la página filtrada por bloques.
 * Las estadísticas (vistas/falladas) se guardan solo en el navegador (localStorage).
 */
(function () {
  "use strict";

  const LETRAS = ["A", "B", "C", "D"];
  const PENALIZACION = 0.33;
  const PLAYGROUND_JS = "https://unpkg.com/kotlin-playground@1";
  const DIFICULTAD = { 1: "Básica", 2: "Media", 3: "Trampa" };

  // ---------- utilidades ----------

  function barajar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function el(tag, attrs, ...hijos) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
    }
    for (const h of hijos.flat()) {
      if (h == null || h === false) continue;
      n.append(h instanceof Node ? h : document.createTextNode(String(h)));
    }
    return n;
  }

  function fmt(n) {
    return n.toFixed(2).replace(".", ",");
  }

  // Almacenamiento local: puede no estar disponible (modo privado, bloqueos...).
  const almacen = {
    clave: "ktq-stats",
    leer() {
      try {
        return JSON.parse(localStorage.getItem(this.clave)) || {};
      } catch (e) {
        return {};
      }
    },
    anotar(id, acierto) {
      try {
        const s = this.leer();
        const r = s[id] || { v: 0, f: 0 };
        r.v++;
        if (!acierto) r.f++;
        r.u = acierto ? 1 : 0;
        s[id] = r;
        localStorage.setItem(this.clave, JSON.stringify(s));
      } catch (e) {
        /* sin persistencia: no pasa nada */
      }
    },
    borrar() {
      try {
        localStorage.removeItem(this.clave);
      } catch (e) {}
    },
  };

  // Intercala bloques: reparte por turnos, sin repetir bloque seguido si se puede.
  function intercalar(preguntas, n) {
    const porBloque = new Map();
    for (const p of barajar(preguntas)) {
      if (!porBloque.has(p.bloque)) porBloque.set(p.bloque, []);
      porBloque.get(p.bloque).push(p);
    }
    const res = [];
    let ultimo = null;
    while (res.length < n && porBloque.size) {
      let orden = barajar([...porBloque.keys()]);
      if (orden.length > 1 && orden[0] === ultimo) orden.push(orden.shift());
      for (const b of orden) {
        if (res.length >= n) break;
        const cola = porBloque.get(b);
        res.push(cola.pop());
        ultimo = b;
        if (!cola.length) porBloque.delete(b);
      }
    }
    return res;
  }

  // ---------- Kotlin Playground (se carga solo cuando hace falta) ----------

  let promesaPlayground = null;
  function cargarPlayground() {
    if (window.KotlinPlayground) return Promise.resolve();
    if (!promesaPlayground) {
      promesaPlayground = new Promise((ok, ko) => {
        const s = el("script", { src: PLAYGROUND_JS });
        s.onload = ok;
        s.onerror = () => {
          promesaPlayground = null;
          ko(new Error("No se pudo cargar Kotlin Playground"));
        };
        document.head.append(s);
      });
    }
    return promesaPlayground;
  }

  function programaEjecutable(codigo) {
    if (/\bfun\s+main\s*\(/.test(codigo)) return codigo;
    const lineas = codigo.split("\n");
    const imports = lineas.filter((l) => l.startsWith("import "));
    const sangrado = lineas.filter((l) => !l.startsWith("import ")).map((l) => (l ? "    " + l : l)).join("\n");
    return (imports.length ? imports.join("\n") + "\n\n" : "") + "fun main() {\n" + sangrado + "\n}";
  }

  function botonEjecutar(codigo) {
    const caja = el("div", { class: "ktq-run" });
    const boton = el("button", { class: "md-button ktq-run-btn", type: "button" }, "▶ Ejecútalo tú");
    boton.addEventListener("click", () => {
      boton.disabled = true;
      boton.textContent = "Cargando Kotlin Playground…";
      const oscuro = document.body.getAttribute("data-md-color-scheme") === "slate";
      const destino = el("div", {
        class: "ktq-run-code",
        "data-theme": oscuro ? "darcula" : "idea",
        "data-autoindent": "true",
        "match-brackets": "true",
      });
      destino.textContent = programaEjecutable(codigo);
      caja.append(
        el("p", { class: "ktq-run-hint" }, "Ejecuta el código y prueba a cambiarlo: es la mejor forma de entender la respuesta."),
        destino
      );
      cargarPlayground()
        .then(() => {
          window.KotlinPlayground(destino);
          boton.remove();
        })
        .catch(() => {
          boton.textContent = "No se pudo cargar el ejecutor (¿sin conexión?)";
        });
    });
    caja.append(boton);
    return caja;
  }

  // ---------- aplicación ----------

  class Practica {
    constructor(raiz) {
      this.raiz = raiz;
      this.base = raiz.dataset.root || "";
      this.banco = raiz.dataset.banco || "kotlin";
      this.datos = null;
    }

    async iniciar() {
      this.raiz.replaceChildren(el("p", { class: "ktq-cargando" }, "Cargando preguntas…"));
      try {
        const r = await fetch(`${this.base}extra/quiz/${this.banco}.json`, { cache: "no-cache" });
        if (!r.ok) throw new Error(r.status);
        this.datos = await r.json();
      } catch (e) {
        this.raiz.replaceChildren(el("div", { class: "admonition failure" },
          el("p", { class: "admonition-title" }, "No se ha podido cargar el banco de preguntas"),
          el("p", {}, "Recarga la página. Si el problema continúa, avisa al profesor.")));
        return;
      }
      this.bloques = new Map(this.datos.bloques.map((b) => [b.bloque, b]));
      this.pantallaInicio();
    }

    // ----- configuración de la tanda -----

    pantallaInicio() {
      const stats = almacen.leer();
      const param = new URLSearchParams(location.search).get("bloques");
      const marcados = param ? new Set(param.split(",").map(Number)) : null;
      const total = this.datos.preguntas.length;

      const casillasBloque = this.datos.bloques.map((b) => {
        const n = this.datos.preguntas.filter((p) => p.bloque === b.bloque).length;
        return el("label", { class: "ktq-check" },
          el("input", { type: "checkbox", name: "bloque", value: b.bloque, checked: !marcados || marcados.has(b.bloque) }),
          ` ${b.bloque}. ${b.titulo} `, el("span", { class: "ktq-mute" }, `(${n})`));
      });
      const casillasDif = [1, 2, 3].map((d) =>
        el("label", { class: "ktq-check ktq-inline" },
          el("input", { type: "checkbox", name: "dificultad", value: d, checked: true }), ` ${DIFICULTAD[d]}`));

      const contador = el("strong", {});
      const selectN = el("select", { name: "n" },
        [10, 20, 30, 40].map((n) => el("option", { value: n, selected: n === 20 }, `${n} preguntas`)),
        el("option", { value: 9999 }, "Todas las disponibles"));
      const soloFalladas = el("input", { type: "checkbox", name: "falladas" });
      const nFalladas = Object.values(stats).filter((s) => s.u === 0).length;

      const form = el("form", { class: "ktq-setup" },
        el("fieldset", {},
          el("legend", {}, "Modo"),
          el("label", { class: "ktq-check" }, el("input", { type: "radio", name: "modo", value: "practica", checked: true }),
            " ", el("strong", {}, "Práctica"), " — corrección y explicación al momento, y puedes ejecutar el código."),
          el("label", { class: "ktq-check" }, el("input", { type: "radio", name: "modo", value: "simulacro" }),
            " ", el("strong", {}, "Simulacro"), ` — como en el examen: sin ayudas hasta entregar; acierto +1, fallo −${fmt(PENALIZACION)}, en blanco 0.`)),
        el("fieldset", {},
          el("legend", {}, "Bloques"),
          el("div", { class: "ktq-acciones-mini" },
            el("button", { type: "button", class: "ktq-link", onclick: () => marcarTodos(true) }, "Todos"), " · ",
            el("button", { type: "button", class: "ktq-link", onclick: () => marcarTodos(false) }, "Ninguno")),
          el("div", { class: "ktq-grid-bloques" }, casillasBloque)),
        el("fieldset", {},
          el("legend", {}, "Dificultad y cantidad"),
          el("div", {}, casillasDif),
          el("div", { class: "ktq-fila" }, selectN),
          el("label", { class: "ktq-check" }, soloFalladas, ` Solo las que fallé la última vez `,
            el("span", { class: "ktq-mute" }, `(${nFalladas})`))),
        el("p", { class: "ktq-disponibles" }, "Preguntas disponibles con este filtro: ", contador),
        el("div", { class: "ktq-acciones" },
          el("button", { type: "submit", class: "md-button md-button--primary" }, "Empezar"),
          Object.keys(stats).length
            ? el("button", { type: "button", class: "ktq-link", onclick: () => { almacen.borrar(); this.pantallaInicio(); } },
                "Borrar mi historial")
            : null),
        el("p", { class: "ktq-mute ktq-nota" }, `Banco: ${total} preguntas. Tu progreso solo se guarda en este navegador.`));

      const marcarTodos = (v) => {
        form.querySelectorAll('input[name="bloque"]').forEach((c) => (c.checked = v));
        actualizar();
      };
      const filtro = () => {
        const bs = new Set([...form.querySelectorAll('input[name="bloque"]:checked')].map((c) => +c.value));
        const ds = new Set([...form.querySelectorAll('input[name="dificultad"]:checked')].map((c) => +c.value));
        return this.datos.preguntas.filter((p) =>
          bs.has(p.bloque) && ds.has(p.dificultad) && (!soloFalladas.checked || (stats[p.id] && stats[p.id].u === 0)));
      };
      const actualizar = () => (contador.textContent = filtro().length);
      form.addEventListener("change", actualizar);
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const pool = filtro();
        if (!pool.length) {
          contador.textContent = "0 — cambia el filtro";
          return;
        }
        const modo = form.querySelector('input[name="modo"]:checked').value;
        this.empezar(modo, intercalar(pool, +selectN.value));
      });
      actualizar();
      this.raiz.replaceChildren(form);
    }

    empezar(modo, preguntas) {
      this.modo = modo;
      this.tanda = preguntas.map((p) => ({
        p,
        opciones: barajar(p.opciones),
        elegida: null, // índice en opciones barajadas
      }));
      this.actual = 0;
      this.entregado = false;
      this.pintarPregunta();
    }

    // ----- pregunta -----

    cabecera(i) {
      const { p } = this.tanda[i];
      const b = this.bloques.get(p.bloque);
      const hechas = this.tanda.filter((t) => t.elegida !== null);
      const aciertos = hechas.filter((t) => t.opciones[t.elegida].correcta).length;
      return el("div", { class: "ktq-head" },
        el("span", { class: "ktq-num" }, `Pregunta ${i + 1} / ${this.tanda.length}`),
        el("span", { class: "ktq-chip" }, `${b.bloque}. ${b.titulo}`),
        el("span", { class: `ktq-chip ktq-dif-${p.dificultad}` }, DIFICULTAD[p.dificultad]),
        this.modo === "practica"
          ? el("span", { class: "ktq-marcador" }, `✔ ${aciertos} · ✘ ${hechas.length - aciertos}`)
          : el("span", { class: "ktq-marcador" }, `Respondidas ${hechas.length} / ${this.tanda.length}`),
        el("div", { class: "ktq-barra" }, el("div", { style: `width:${(100 * (i + 1)) / this.tanda.length}%` })));
    }

    enlaceApuntes(p) {
      if (!p.enlace) return null;
      const href = this.base + p.enlace;
      return el("a", { class: "ktq-apuntes", href, target: "_blank", rel: "noopener" }, "📖 Repásalo en los apuntes");
    }

    // Bloque de realimentación de una pregunta ya contestada (práctica o revisión).
    realimentacion(t) {
      const { p, opciones, elegida } = t;
      const correcta = opciones.findIndex((o) => o.correcta);
      const caja = el("div", { class: "ktq-feedback" });
      if (elegida === null) {
        caja.classList.add("ktq-fb-blanco");
        caja.append(el("p", { class: "ktq-fb-titulo" }, `En blanco. La correcta era la ${LETRAS[correcta]}.`),
          el("div", { html: opciones[correcta].feedback }));
      } else if (elegida === correcta) {
        caja.classList.add("ktq-fb-ok");
        caja.append(el("p", { class: "ktq-fb-titulo" }, "✔ ¡Correcto!"), el("div", { html: opciones[correcta].feedback }));
      } else {
        caja.classList.add("ktq-fb-ko");
        caja.append(
          el("p", { class: "ktq-fb-titulo" }, `✘ Has elegido la ${LETRAS[elegida]}: incorrecta`),
          el("div", { html: opciones[elegida].feedback }),
          el("p", { class: "ktq-fb-titulo ktq-fb-sub" }, `La correcta es la ${LETRAS[correcta]}`),
          el("div", { html: opciones[correcta].feedback }));
      }
      const resto = opciones
        .map((o, i) => ({ o, i }))
        .filter(({ i }) => i !== correcta && i !== elegida);
      if (resto.length) {
        caja.append(el("details", { class: "ktq-resto" },
          el("summary", {}, "¿Y por qué fallan las demás?"),
          resto.map(({ o, i }) => el("div", { class: "ktq-resto-item" },
            el("strong", {}, `${LETRAS[i]}) `), el("div", { html: o.feedback })))));
      }
      const pie = el("div", { class: "ktq-fb-pie" }, this.enlaceApuntes(p));
      caja.append(pie);
      if (p.codigo) caja.append(botonEjecutar(p.codigo));
      return caja;
    }

    pintarOpciones(t, bloqueado, alElegir) {
      const correcta = t.opciones.findIndex((o) => o.correcta);
      return el("div", { class: "ktq-opciones" },
        t.opciones.map((o, i) => {
          const clases = ["ktq-opcion"];
          if (t.elegida === i) clases.push("ktq-elegida");
          if (bloqueado && i === correcta) clases.push("ktq-ok");
          if (bloqueado && t.elegida === i && i !== correcta) clases.push("ktq-ko");
          return el("button", {
            type: "button", class: clases.join(" "), disabled: bloqueado,
            onclick: () => alElegir(i),
          }, el("span", { class: "ktq-letra" }, LETRAS[i]), el("div", { class: "ktq-texto", html: o.texto }));
        }));
    }

    pintarPregunta() {
      const i = this.actual;
      const t = this.tanda[i];
      const practica = this.modo === "practica";
      const contestada = practica && t.elegida !== null;

      const tarjeta = el("div", { class: "ktq-card" },
        this.cabecera(i),
        el("div", { class: "ktq-enunciado", html: t.p.enunciado }),
        this.pintarOpciones(t, contestada, (k) => {
          if (practica) {
            t.elegida = k;
            almacen.anotar(t.p.id, t.opciones[k].correcta);
          } else {
            t.elegida = t.elegida === k ? null : k; // pulsar de nuevo la deja en blanco
          }
          this.pintarPregunta();
        }));

      if (contestada) tarjeta.append(this.realimentacion(t));

      const nav = el("div", { class: "ktq-nav" });
      if (practica) {
        nav.append(el("button", { type: "button", class: "ktq-link", onclick: () => this.pantallaInicio() }, "Abandonar"));
        if (contestada) {
          const ultima = i === this.tanda.length - 1;
          nav.append(el("button", {
            type: "button", class: "md-button md-button--primary",
            onclick: () => (ultima ? this.resultados() : (this.actual++, this.pintarPregunta())),
          }, ultima ? "Ver resultados" : "Siguiente →"));
        } else {
          nav.append(el("span", { class: "ktq-mute" }, "Elige una opción"));
        }
      } else {
        nav.append(
          el("button", { type: "button", class: "md-button", disabled: i === 0, onclick: () => { this.actual--; this.pintarPregunta(); } }, "← Anterior"),
          el("span", { class: "ktq-mute" }, t.elegida === null ? "Sin responder (en blanco)" : "Pulsa otra vez tu opción para dejarla en blanco"),
          i < this.tanda.length - 1
            ? el("button", { type: "button", class: "md-button md-button--primary", onclick: () => { this.actual++; this.pintarPregunta(); } }, "Siguiente →")
            : el("button", { type: "button", class: "md-button md-button--primary", onclick: () => this.entregar() }, "Entregar"));
        tarjeta.append(nav, this.indice());
        this.raiz.replaceChildren(tarjeta);
        return this.scrollArriba();
      }
      tarjeta.append(nav);
      this.raiz.replaceChildren(tarjeta);
      if (!contestada) this.scrollArriba();
    }

    indice() {
      return el("div", { class: "ktq-indice" },
        this.tanda.map((t, k) => el("button", {
          type: "button",
          class: "ktq-ind" + (t.elegida !== null ? " ktq-ind-hecha" : "") + (k === this.actual ? " ktq-ind-actual" : ""),
          onclick: () => { this.actual = k; this.pintarPregunta(); },
        }, k + 1)),
        el("button", { type: "button", class: "ktq-link ktq-entregar", onclick: () => this.entregar() }, "Entregar ya"));
    }

    scrollArriba() {
      const top = this.raiz.getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    }

    entregar() {
      const blancos = this.tanda.filter((t) => t.elegida === null).length;
      if (blancos && !confirm(`Tienes ${blancos} pregunta(s) en blanco. ¿Entregar de todas formas?`)) return;
      for (const t of this.tanda) if (t.elegida !== null) almacen.anotar(t.p.id, t.opciones[t.elegida].correcta);
      this.entregado = true;
      this.resultados();
    }

    // ----- resultados -----

    resultados() {
      const tot = this.tanda.length;
      const ok = this.tanda.filter((t) => t.elegida !== null && t.opciones[t.elegida].correcta).length;
      const blanco = this.tanda.filter((t) => t.elegida === null).length;
      const ko = tot - ok - blanco;

      const porBloque = new Map();
      for (const t of this.tanda) {
        const r = porBloque.get(t.p.bloque) || { ok: 0, n: 0 };
        r.n++;
        if (t.elegida !== null && t.opciones[t.elegida].correcta) r.ok++;
        porBloque.set(t.p.bloque, r);
      }

      const resumen = el("div", { class: "ktq-card ktq-resultados" }, el("h2", {}, "Resultado"));
      if (this.modo === "simulacro") {
        const nota = Math.max(0, ok - ko * PENALIZACION) / tot * 10;
        resumen.append(el("p", { class: "ktq-nota-final " + (nota >= 5 ? "ktq-aprobado" : "ktq-suspenso") }, fmt(nota), el("small", {}, " / 10")),
          el("p", {}, `Aciertos ${ok} · Fallos ${ko} · En blanco ${blanco}  (acierto +1, fallo −${fmt(PENALIZACION)})`));
      } else {
        resumen.append(el("p", { class: "ktq-nota-final" }, `${ok} / ${tot}`, el("small", {}, " aciertos")));
      }

      resumen.append(el("table", { class: "ktq-tabla" },
        el("thead", {}, el("tr", {}, el("th", {}, "Bloque"), el("th", {}, "Aciertos"), el("th", {}, ""))),
        el("tbody", {}, [...porBloque.entries()].sort((a, b) => a[0] - b[0]).map(([bq, r]) => {
          const b = this.bloques.get(bq);
          const pct = Math.round((100 * r.ok) / r.n);
          return el("tr", {},
            el("td", {}, b.apuntes ? el("a", { href: this.base + b.apuntes }, `${b.bloque}. ${b.titulo}`) : `${b.bloque}. ${b.titulo}`),
            el("td", {}, `${r.ok} / ${r.n}`),
            el("td", {}, el("div", { class: "ktq-mini-barra" }, el("div", { style: `width:${pct}%`, class: pct >= 50 ? "ok" : "ko" }))));
        }))));

      const falladas = this.tanda.filter((t) => t.elegida === null || !t.opciones[t.elegida].correcta).map((t) => t.p);
      resumen.append(el("div", { class: "ktq-acciones" },
        falladas.length
          ? el("button", { type: "button", class: "md-button md-button--primary", onclick: () => this.empezar("practica", barajar(falladas)) },
              `Repetir las ${falladas.length} falladas`)
          : null,
        el("button", { type: "button", class: "md-button", onclick: () => this.pantallaInicio() }, "Nueva tanda")));

      const piezas = [resumen];
      if (this.modo === "simulacro") {
        piezas.push(el("h2", {}, "Revisión con explicaciones"));
        this.tanda.forEach((t, k) => {
          piezas.push(el("div", { class: "ktq-card ktq-revision" },
            el("div", { class: "ktq-head" }, el("span", { class: "ktq-num" }, `Pregunta ${k + 1}`),
              el("span", { class: "ktq-chip" }, `${t.p.bloque}. ${this.bloques.get(t.p.bloque).titulo}`)),
            el("div", { class: "ktq-enunciado", html: t.p.enunciado }),
            this.pintarOpciones(t, true, () => {}),
            this.realimentacion(t)));
        });
      }
      this.raiz.replaceChildren(...piezas);
      this.scrollArriba();
    }
  }

  function arrancar() {
    document.querySelectorAll(".ktq").forEach((n) => {
      if (!n.dataset.ktqListo) {
        n.dataset.ktqListo = "1";
        new Practica(n).iniciar();
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
