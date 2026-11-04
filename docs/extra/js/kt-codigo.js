/*
 * Práctica de código para MkDocs
 * ------------------------------
 * Carga el banco de ejercicios en JSON (generado por quiz/hook_codigo.py a partir de
 * quiz/codigo/*.md) y muestra los de un tipo como tarjetas desplegables.
 *
 * Uso en un .md:
 *   <div class="ktc" data-tipo="kata" data-root="../../"></div>      -> catálogo de un tipo
 *   <div class="ktc-tanda" data-root="../../"></div>                 -> tanda configurable
 *   <script src="../../extra/js/kt-codigo.js"></script>
 *
 * Tipos:
 *   - kata:    esqueleto con TODO en Kotlin Playground; los tests JUnit se ejecutan en el navegador.
 *   - error:   pulsa la línea que provoca el fallo del test.
 *   - huecos:  completa los huecos del código.
 *   - parsons: ordena las líneas y descarta la que sobra.
 *   - defensa: responde por escrito y compárate con la respuesta modelo.
 *
 * La tanda admite en la URL ?tipos=kata,error&temas=agrupar&dificultad=1,2&n=5 para abrirla filtrada.
 * El progreso, los borradores y las respuestas se guardan solo en el navegador (localStorage).
 */
(function () {
  "use strict";

  const PLAYGROUND_JS = "https://unpkg.com/kotlin-playground@1";
  const DIFICULTAD = { 1: "Básica", 2: "Media", 3: "Avanzada" };
  const CLAVE_ESTADO = "ktc-estado";

  // ---------- utilidades ----------

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

  function boton(texto, onclick, clase) {
    return el("button", { type: "button", class: "md-button " + (clase || ""), onclick }, texto);
  }

  function barajar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function codigoHtml(lineas) {
    return el("div", { class: "highlight" }, el("pre", {}, el("code", { html: lineas.join("\n") })));
  }

  // Almacenamiento local: puede no estar disponible (modo privado, bloqueos...).
  const almacen = {
    leer(clave, defecto) {
      try {
        const v = localStorage.getItem(clave);
        return v == null ? defecto : JSON.parse(v);
      } catch (e) {
        return defecto;
      }
    },
    guardar(clave, valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
      } catch (e) {
        /* sin persistencia: no pasa nada */
      }
    },
    borrar(prefijo) {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(prefijo))
          .forEach((k) => localStorage.removeItem(k));
      } catch (e) {}
    },
  };

  const estado = {
    resuelto(id) {
      return Boolean(almacen.leer(CLAVE_ESTADO, {})[id]);
    },
    marcar(id) {
      const s = almacen.leer(CLAVE_ESTADO, {});
      s[id] = 1;
      almacen.guardar(CLAVE_ESTADO, s);
      document.dispatchEvent(new CustomEvent("ktc-progreso"));
    },
  };

  // ---------- carga del banco y de Kotlin Playground ----------

  const promesasBanco = {};
  function cargarBanco(base) {
    if (!promesasBanco[base]) {
      promesasBanco[base] = fetch(base + "extra/quiz/codigo.json").then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    }
    return promesasBanco[base];
  }

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

  function temaOscuro() {
    return document.body.getAttribute("data-md-color-scheme") === "slate";
  }

  // ---------- piezas comunes ----------

  function aviso(caja, tipo, ...contenido) {
    caja.replaceChildren(el("div", { class: "ktc-aviso ktc-aviso-" + tipo }, ...contenido));
  }

  function verTests(ej, abierto) {
    if (!ej.tests) return null;
    return el(
      "details",
      { class: "ktc-tests", open: abierto },
      el("summary", {}, "Tests"),
      el("div", { html: ej.tests })
    );
  }

  function explicacion(ej, base) {
    return el(
      "div",
      { class: "ktc-explicacion" },
      el("div", { html: ej.explicacion }),
      ej.enlace ? el("p", { class: "ktc-apuntes" }, el("a", { href: base + ej.enlace }, "📖 Repasa este apartado en los apuntes")) : null
    );
  }

  // ---------- kata TDD ----------

  function kata(ej, cuerpo, ctx) {
    const claveBorrador = "ktc-borrador-" + ej.id;
    const resultado = el("div", { class: "ktc-resultado" });
    const zona = el("div", { class: "ktc-playground" });
    const pistas = el("ol", { class: "ktc-pistas" });
    let pistasVistas = 0;
    let montado = false;

    function montar(codigo) {
      zona.replaceChildren(el("p", { class: "ktc-mute" }, "Cargando Kotlin Playground…"));
      cargarPlayground()
        .then(() => {
          const destino = el("div", {
            "data-target-platform": "junit",
            "data-theme": temaOscuro() ? "darcula" : "idea",
            "data-autoindent": "true",
            "match-brackets": "true",
          });
          destino.textContent = codigo;
          const ocultos = el("textarea", { class: "hidden-dependency" });
          ocultos.textContent = ej.testsCodigo;
          destino.append(ocultos);
          zona.replaceChildren(destino);
          window.KotlinPlayground(destino, {
            onChange: (texto) => almacen.guardar(claveBorrador, texto),
            onTestPassed: () => {
              estado.marcar(ej.id);
              aviso(resultado, "ok", "✔ Todos los tests en verde. Compara tu código con la solución: ¿has usado un pipeline sin bucles ni listas mutables?");
            },
            onTestFailed: () =>
              aviso(resultado, "ko", "Aún hay tests en rojo. Lee el mensaje: «Fail» es un valor incorrecto (compara expected con but was); «Error» es una excepción, como un TODO sin implementar."),
          });
        })
        .catch(() => {
          zona.replaceChildren(el("p", { class: "ktc-aviso ktc-aviso-ko" }, "No se pudo cargar el ejecutor de Kotlin (¿sin conexión?)."));
        });
    }

    ctx.alAbrir(() => {
      if (montado) return;
      montado = true;
      montar(almacen.leer(claveBorrador, ej.codigo));
    });

    cuerpo.append(
      el("div", { html: ej.enunciado }),
      verTests(ej, true),
      el("p", { class: "ktc-mute" }, "Escribe tu código en lugar de los TODO y pulsa ▶ para ejecutar los tests. Tu borrador se guarda en este navegador."),
      zona,
      resultado,
      el(
        "div",
        { class: "ktc-acciones" },
        ej.pistas.length
          ? boton("💡 Pista", (e) => {
              if (pistasVistas < ej.pistas.length) pistas.append(el("li", { html: ej.pistas[pistasVistas++] }));
              if (pistasVistas === ej.pistas.length) e.currentTarget.disabled = true;
            })
          : null,
        boton("↺ Volver al esqueleto", () => {
          if (!confirm("¿Borrar tu código y volver al esqueleto inicial?")) return;
          almacen.guardar(claveBorrador, ej.codigo);
          resultado.replaceChildren();
          montar(ej.codigo);
        })
      ),
      pistas,
      el(
        "details",
        { class: "ktc-solucion" },
        el("summary", {}, "Ver una solución"),
        el("p", { class: "ktc-mute" }, "Mírala cuando tengas los tests en verde, o tras intentarlo de verdad."),
        el("div", { html: ej.solucion }),
        explicacion(ej, ctx.base)
      )
    );
  }

  // ---------- encuentra el error ----------

  function error(ej, cuerpo, ctx) {
    const resultado = el("div", { class: "ktc-resultado" });
    let resuelto = false;
    const filas = ej.lineas.map((html, i) =>
      el(
        "div",
        {
          class: "ktc-linea" + (html.trim() ? "" : " ktc-linea-vacia"),
          role: "button",
          tabindex: html.trim() ? "0" : "-1",
          onclick: () => elegir(i),
          onkeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              elegir(i);
            }
          },
        },
        el("span", { class: "ktc-num" }, String(i + 1)),
        el("code", { html: html || " " })
      )
    );

    function revelar() {
      resuelto = true;
      filas.forEach((f) => {
        f.removeAttribute("role");
        f.removeAttribute("tabindex");
      });
      filas[ej.error].classList.add("ktc-ko");
      filas[ej.error].after(
        el("div", { class: "ktc-linea ktc-correccion" }, el("span", { class: "ktc-num" }, "✔"), el("code", { html: ej.correccion }))
      );
      resultado.append(explicacion(ej, ctx.base));
    }

    function elegir(i) {
      if (resuelto || !ej.lineas[i].trim()) return;
      if (i === ej.error) {
        estado.marcar(ej.id);
        aviso(resultado, "ok", "✔ Esa es la línea. Así quedaría corregida:");
        revelar();
      } else {
        filas[i].classList.add("ktc-no");
        aviso(resultado, "ko", `La línea ${i + 1} es correcta. Vuelve a leer el mensaje del test: ¿qué valor esperaba y cuál ha recibido?`);
      }
    }

    cuerpo.append(
      el("div", { html: ej.enunciado }),
      verTests(ej, false),
      el("p", { class: "ktc-mute" }, "Pulsa la línea que provoca el fallo."),
      el("div", { class: "highlight ktc-codigo" }, el("div", {}, filas)),
      resultado,
      el(
        "div",
        { class: "ktc-acciones" },
        boton("Me rindo", () => {
          if (resuelto) return;
          aviso(resultado, "info", "La línea errónea es la " + (ej.error + 1) + ":");
          revelar();
        })
      )
    );
  }

  // ---------- completa los huecos ----------

  // Sin espacios en los extremos y los internos reducidos a uno (en un literal como ", " el espacio cuenta).
  function normalizar(t) {
    return t.trim().replace(/\s+/g, " ");
  }

  function huecos(ej, cuerpo, ctx) {
    const resultado = el("div", { class: "ktc-resultado" });
    const codigo = codigoHtml(ej.lineas);
    codigo.classList.add("ktc-codigo");
    const entradas = [];
    codigo.querySelectorAll(".ktc-hueco").forEach((hueco) => {
      const i = Number(hueco.dataset.i);
      const largo = Math.max(...ej.respuestas[i].map((r) => r.length), 3);
      const entrada = el("input", {
        type: "text",
        class: "ktc-input",
        size: String(largo + 1),
        autocomplete: "off",
        autocapitalize: "off",
        spellcheck: "false",
        "aria-label": "Hueco " + (i + 1),
        onkeydown: (e) => {
          if (e.key === "Enter") comprobar();
        },
      });
      entradas[i] = entrada;
      hueco.replaceWith(entrada);
    });

    function comprobar() {
      let bien = 0;
      entradas.forEach((entrada, i) => {
        const ok = ej.respuestas[i].some((r) => normalizar(r) === normalizar(entrada.value));
        entrada.classList.toggle("ktc-ok", ok);
        entrada.classList.toggle("ktc-ko", !ok);
        if (ok) bien++;
      });
      if (bien === entradas.length) {
        estado.marcar(ej.id);
        aviso(resultado, "ok", "✔ Todos los huecos son correctos.");
        resultado.append(explicacion(ej, ctx.base));
      } else {
        aviso(resultado, "ko", `${bien} de ${entradas.length} huecos correctos. Los marcados en rojo aún no están bien.`);
      }
    }

    cuerpo.append(
      el("div", { html: ej.enunciado }),
      verTests(ej, false),
      codigo,
      resultado,
      el(
        "div",
        { class: "ktc-acciones" },
        boton("Comprobar", comprobar, "md-button--primary"),
        boton("Ver solución", () => {
          entradas.forEach((entrada, i) => {
            entrada.value = ej.respuestas[i][0];
            entrada.classList.remove("ktc-ko");
          });
          aviso(resultado, "info", "Esta es la solución. Si había otra respuesta válida, aparece en la explicación.");
          resultado.append(explicacion(ej, ctx.base));
        })
      )
    );
  }

  // ---------- Parsons: ordena las líneas ----------

  function parsons(ej, cuerpo, ctx) {
    const resultado = el("div", { class: "ktc-resultado" });
    const indices = ej.lineas.map((_, i) => i);
    const arriba = [];
    const abajo = [];
    let i = 0;
    while (i < indices.length && ej.lineas[i].fijo) arriba.push(i++);
    let j = indices.length - 1;
    while (j >= i && ej.lineas[j].fijo) abajo.unshift(j--);
    const movibles = indices.slice(i, j + 1);

    // Posiciones correctas: cada hueco admite una o varias líneas (las de un mismo grupo).
    const esperadas = movibles.filter((k) => !ej.lineas[k].distractor);
    const ranuras = [];
    esperadas.forEach((k) => {
      const g = ej.lineas[k].grupo;
      const ultima = ranuras[ranuras.length - 1];
      if (g && ultima && ultima.grupo === g) ultima.lineas.push(k);
      else ranuras.push({ grupo: g, lineas: [k] });
    });
    const validasEn = [];
    ranuras.forEach((r) => r.lineas.forEach(() => validasEn.push(r.lineas)));

    let orden = barajar(movibles);
    for (let intento = 0; intento < 5 && orden.join() === movibles.join(); intento++) orden = barajar(movibles);
    const descartadas = new Set();
    const lista = el("ol", { class: "ktc-parsons" });
    let arrastrada = null;

    function fijaHtml(k) {
      return el("div", { class: "ktc-linea ktc-fija" }, el("code", { html: ej.lineas[k].html }));
    }

    function mover(pos, delta) {
      const destino = pos + delta;
      if (destino < 0 || destino >= orden.length) return;
      [orden[pos], orden[destino]] = [orden[destino], orden[pos]];
      pintar(destino);
    }

    function pintar(foco) {
      resultado.replaceChildren();
      lista.replaceChildren(
        ...orden.map((k, pos) => {
          const fuera = descartadas.has(k);
          const fila = el(
            "li",
            {
              class: "ktc-parsons-fila" + (fuera ? " ktc-descartada" : ""),
              draggable: "true",
              "data-k": String(k),
              ondragstart: () => (arrastrada = pos),
              ondragover: (e) => e.preventDefault(),
              ondrop: (e) => {
                e.preventDefault();
                if (arrastrada == null || arrastrada === pos) return;
                const [k2] = orden.splice(arrastrada, 1);
                orden.splice(pos, 0, k2);
                arrastrada = null;
                pintar();
              },
            },
            el("code", { html: ej.lineas[k].html }),
            el(
              "span",
              { class: "ktc-parsons-botones" },
              el("button", { type: "button", title: "Subir", "aria-label": "Subir", onclick: () => mover(pos, -1) }, "↑"),
              el("button", { type: "button", title: "Bajar", "aria-label": "Bajar", onclick: () => mover(pos, 1) }, "↓"),
              el(
                "button",
                {
                  type: "button",
                  title: fuera ? "Recuperar la línea" : "Esta línea sobra",
                  "aria-label": fuera ? "Recuperar la línea" : "Esta línea sobra",
                  onclick: () => {
                    fuera ? descartadas.delete(k) : descartadas.add(k);
                    pintar();
                  },
                },
                fuera ? "↩" : "✕"
              )
            )
          );
          return fila;
        })
      );
      if (foco != null) lista.children[foco].querySelectorAll("button")[0].focus();
    }

    function comprobar() {
      const filas = [...lista.children];
      const dentro = orden.filter((k) => !descartadas.has(k));
      let bien = true;
      let pos = 0;
      filas.forEach((fila, p) => {
        const k = orden[p];
        let ok;
        if (descartadas.has(k)) ok = ej.lineas[k].distractor;
        else ok = !ej.lineas[k].distractor && (validasEn[pos++] || []).includes(k);
        fila.classList.toggle("ktc-ok", ok);
        fila.classList.toggle("ktc-ko", !ok);
        if (!ok) bien = false;
      });
      if (dentro.length !== esperadas.length) bien = false;
      if (bien) {
        estado.marcar(ej.id);
        aviso(resultado, "ok", "✔ Orden correcto.");
        resultado.append(explicacion(ej, ctx.base));
      } else {
        aviso(resultado, "ko", "Todavía no. Las líneas en rojo están fuera de su sitio, sobran o no deberían haberse descartado.");
      }
    }

    pintar();
    cuerpo.append(
      el("div", { html: ej.enunciado }),
      verTests(ej, false),
      el("p", { class: "ktc-mute" }, "Ordena con ↑ ↓ (o arrastrando) y marca con ✕ la línea que sobra."),
      el("div", { class: "highlight ktc-codigo" }, arriba.map(fijaHtml), lista, abajo.map(fijaHtml)),
      resultado,
      el(
        "div",
        { class: "ktc-acciones" },
        boton("Comprobar", comprobar, "md-button--primary"),
        boton("Ver solución", () => {
          aviso(resultado, "info", "Una solución correcta:");
          resultado.append(el("div", { html: ej.solucion }), explicacion(ej, ctx.base));
        })
      )
    );
  }

  // ---------- defensa: explica tu código ----------

  function defensa(ej, cuerpo, ctx) {
    const claveTexto = "ktc-defensa-" + ej.id;
    const claveCotejo = "ktc-cotejo-" + ej.id;
    const marcados = new Set(almacen.leer(claveCotejo, []));
    const texto = el("textarea", {
      class: "ktc-textarea",
      rows: "8",
      placeholder: "Escribe tu explicación como si fuera el examen: con tus palabras, citando funciones y tipos concretos.",
      oninput: (e) => almacen.guardar(claveTexto, e.target.value),
    });
    texto.value = almacen.leer(claveTexto, "");
    const progreso = el("p", { class: "ktc-mute" });
    const modelo = el("div", { class: "ktc-modelo", hidden: true });

    function actualizar() {
      progreso.textContent = `Has cubierto ${marcados.size} de ${ej.cotejo.length} puntos clave.`;
      almacen.guardar(claveCotejo, [...marcados]);
      if (marcados.size === ej.cotejo.length) estado.marcar(ej.id);
    }

    modelo.append(
      el("h4", {}, "Comprueba tu respuesta"),
      el("p", { class: "ktc-mute" }, "Marca los puntos que aparecen en lo que has escrito, no los que sabías pero no pusiste."),
      el(
        "ul",
        { class: "ktc-cotejo" },
        ej.cotejo.map((html, i) => {
          const casilla = el("input", {
            type: "checkbox",
            checked: marcados.has(i),
            onchange: (e) => {
              e.target.checked ? marcados.add(i) : marcados.delete(i);
              actualizar();
            },
          });
          return el("li", {}, el("label", {}, casilla, el("span", { html: html })));
        })
      ),
      progreso,
      el("h4", {}, "Respuesta modelo"),
      el("div", { html: ej.modelo }),
      ej.enlace ? el("p", { class: "ktc-apuntes" }, el("a", { href: ctx.base + ej.enlace }, "📖 Repasa este apartado en los apuntes")) : null
    );

    cuerpo.append(
      el("div", { html: ej.enunciado }),
      texto,
      el(
        "div",
        { class: "ktc-acciones" },
        boton(
          "Ver respuesta modelo",
          (e) => {
            if (!texto.value.trim() && !confirm("Aún no has escrito nada. ¿Ver la respuesta modelo de todos modos?")) return;
            modelo.hidden = false;
            e.currentTarget.remove();
            actualizar();
          },
          "md-button--primary"
        )
      ),
      modelo
    );
  }

  const TIPOS = { kata, error, huecos, parsons, defensa };
  const NOMBRE_TIPO = {
    kata: "Kata TDD",
    error: "Encuentra el error",
    huecos: "Huecos",
    parsons: "Ordena las líneas",
    defensa: "Explica tu código",
  };

  // ---------- montaje de una sección ----------

  function tarjeta(ej, base, prefijo) {
    const icono = el("span", { class: "ktc-icono", "aria-hidden": "true" });
    const tarjetaEl = el(
      "details",
      { class: "ktc-card", id: (prefijo || "") + ej.id },
      el(
        "summary",
        {},
        icono,
        el("span", { class: "ktc-titulo" }, ej.titulo),
        prefijo ? el("span", { class: "ktc-tipo" }, NOMBRE_TIPO[ej.tipo]) : null,
        el("span", { class: "ktc-dif ktc-dif-" + ej.dificultad }, DIFICULTAD[ej.dificultad] || "")
      )
    );
    const cuerpo = el("div", { class: "ktc-cuerpo" });
    tarjetaEl.append(cuerpo);
    const abrir = [];
    const ctx = { base, alAbrir: (f) => abrir.push(f) };
    TIPOS[ej.tipo](ej, cuerpo, ctx);
    tarjetaEl.addEventListener("toggle", () => {
      if (tarjetaEl.open) abrir.forEach((f) => f());
    });
    const refrescar = () => {
      const ok = estado.resuelto(ej.id);
      icono.textContent = ok ? "✔" : "○";
      tarjetaEl.classList.toggle("ktc-hecho", ok);
    };
    document.addEventListener("ktc-progreso", refrescar);
    refrescar();
    return tarjetaEl;
  }

  function montar(raiz) {
    const base = raiz.dataset.root || "";
    const tipo = raiz.dataset.tipo;
    raiz.replaceChildren(el("p", { class: "ktc-mute" }, "Cargando ejercicios…"));
    cargarBanco(base)
      .then((datos) => {
        const ejercicios = datos.ejercicios.filter((e) => e.tipo === tipo);
        const contador = el("p", { class: "ktc-contador" });
        const refrescar = () => {
          const hechos = ejercicios.filter((e) => estado.resuelto(e.id)).length;
          contador.textContent = `Resueltos: ${hechos} de ${ejercicios.length}`;
        };
        document.addEventListener("ktc-progreso", refrescar);
        refrescar();
        raiz.replaceChildren(contador, ...ejercicios.map((e) => tarjeta(e, base)));
        const abrirDesdeUrl = () => {
          const destino = location.hash && raiz.querySelector(location.hash.replace(/[^#\w-]/g, ""));
          if (destino && destino.classList.contains("ktc-card")) {
            destino.open = true;
            destino.scrollIntoView();
          }
        };
        window.addEventListener("hashchange", abrirDesdeUrl);
        abrirDesdeUrl();
      })
      .catch(() => {
        raiz.replaceChildren(el("p", { class: "ktc-aviso ktc-aviso-ko" }, "No se pudieron cargar los ejercicios. Recarga la página."));
      });
  }

  // ---------- tanda configurable ----------

  // Reparte por turnos entre tipos para que no salgan seguidos dos del mismo tipo.
  function intercalar(lista) {
    const porTipo = new Map();
    lista.forEach((e) => {
      if (!porTipo.has(e.tipo)) porTipo.set(e.tipo, []);
      porTipo.get(e.tipo).push(e);
    });
    const res = [];
    while (porTipo.size) {
      for (const [tipo, cola] of [...porTipo]) {
        res.push(cola.shift());
        if (!cola.length) porTipo.delete(tipo);
      }
    }
    return res;
  }

  function tanda(raiz) {
    const base = raiz.dataset.root || "";
    raiz.replaceChildren(el("p", { class: "ktc-mute" }, "Cargando ejercicios…"));
    cargarBanco(base)
      .then((datos) => {
        const guardada = almacen.leer("ktc-config", {});
        const url = new URLSearchParams(location.search);
        const lista = (param, defecto) => (url.get(param) ? url.get(param).split(",") : defecto);
        const config = {
          tipos: lista("tipos", guardada.tipos || Object.keys(TIPOS)),
          temas: lista("temas", guardada.temas || datos.temas.map((t) => t.id)),
          dificultades: lista("dificultad", guardada.dificultades || ["1", "2", "3"]),
          n: url.get("n") || guardada.n || "5",
          pendientes: guardada.pendientes !== false,
        };

        const casillas = (nombre, opciones, marcadas) =>
          el(
            "div",
            { class: "ktc-opciones" },
            opciones.map(([valor, texto]) =>
              el(
                "label",
                { class: "ktc-check" },
                el("input", { type: "checkbox", name: nombre, value: valor, checked: marcadas.includes(valor) }),
                " " + texto
              )
            )
          );
        const marcadas = (nombre) => [...form.querySelectorAll(`input[name="${nombre}"]:checked`)].map((i) => i.value);

        const selectN = el("select", { name: "n" }, ["3", "5", "8", "10", "15"].map((v) => el("option", { value: v, selected: v === config.n }, v)));
        const casillaPendientes = el("input", { type: "checkbox", name: "pendientes", checked: config.pendientes });
        const disponibles = el("p", { class: "ktc-mute" });
        const zona = el("div", { class: "ktc ktc-tanda-zona" });

        const form = el(
          "form",
          { class: "ktc-setup", onsubmit: (e) => e.preventDefault(), onchange: () => actualizar() },
          el("fieldset", {}, el("legend", {}, "Tipo de ejercicio"), casillas("tipos", Object.entries(NOMBRE_TIPO), config.tipos)),
          el("fieldset", {}, el("legend", {}, "Qué quieres practicar"), casillas("temas", datos.temas.map((t) => [t.id, t.titulo]), config.temas)),
          el("fieldset", {}, el("legend", {}, "Dificultad"), casillas("dificultad", Object.entries(DIFICULTAD), config.dificultades)),
          el(
            "div",
            { class: "ktc-fila" },
            el("label", {}, "Ejercicios por tanda: ", selectN),
            el("label", { class: "ktc-check" }, casillaPendientes, " Primero los que aún no he resuelto")
          ),
          disponibles,
          el("div", { class: "ktc-acciones" }, boton("▶ Empezar tanda", () => empezar(), "md-button--primary"))
        );

        function leerConfig() {
          const c = {
            tipos: marcadas("tipos"),
            temas: marcadas("temas"),
            dificultades: marcadas("dificultad"),
            n: selectN.value,
            pendientes: casillaPendientes.checked,
          };
          almacen.guardar("ktc-config", c);
          return c;
        }

        function candidatos(c) {
          return datos.ejercicios.filter(
            (e) =>
              c.tipos.includes(e.tipo) &&
              c.dificultades.includes(String(e.dificultad)) &&
              e.temas.some((t) => c.temas.includes(t))
          );
        }

        function actualizar() {
          const c = leerConfig();
          const todos = candidatos(c);
          const sinResolver = todos.filter((e) => !estado.resuelto(e.id)).length;
          disponibles.textContent = `${todos.length} ejercicios con estos filtros (${sinResolver} sin resolver).`;
        }

        function mostrar(elegidos) {
          const contador = el("p", { class: "ktc-contador" });
          const refrescar = () => {
            const hechos = elegidos.filter((e) => estado.resuelto(e.id)).length;
            contador.textContent = `Tanda: ${hechos} de ${elegidos.length} resueltos` + (hechos === elegidos.length ? " 🎉" : "");
          };
          document.addEventListener("ktc-progreso", refrescar);
          refrescar();
          const tarjetas = elegidos.map((e) => tarjeta(e, base, "t-"));
          zona.replaceChildren(
            contador,
            ...tarjetas,
            el(
              "div",
              { class: "ktc-acciones" },
              boton("🔀 Otra tanda", () => empezar(), "md-button--primary"),
              boton("↻ Repetir los no resueltos", () => {
                const pendientes = elegidos.filter((e) => !estado.resuelto(e.id));
                if (!pendientes.length) {
                  alert("¡Has resuelto todos los de esta tanda!");
                  return;
                }
                mostrar(pendientes);
              }),
              boton("⚙ Cambiar filtros", () => {
                form.hidden = false;
                form.scrollIntoView({ behavior: "smooth" });
              })
            )
          );
          if (tarjetas.length) tarjetas[0].open = true;
          form.hidden = true;
          zona.scrollIntoView({ behavior: "smooth" });
        }

        function empezar() {
          const c = leerConfig();
          const todos = candidatos(c);
          if (!todos.length) {
            disponibles.textContent = "No hay ejercicios con estos filtros: marca más tipos, temas o dificultades.";
            form.hidden = false;
            return;
          }
          let orden = barajar(todos);
          if (c.pendientes) orden = orden.filter((e) => !estado.resuelto(e.id)).concat(orden.filter((e) => estado.resuelto(e.id)));
          mostrar(intercalar(orden.slice(0, Number(c.n))));
        }

        raiz.replaceChildren(form, zona);
        actualizar();
      })
      .catch(() => {
        raiz.replaceChildren(el("p", { class: "ktc-aviso ktc-aviso-ko" }, "No se pudieron cargar los ejercicios. Recarga la página."));
      });
  }

  function iniciar() {
    document.querySelectorAll(".ktc-tanda").forEach(tanda);
    document.querySelectorAll(".ktc[data-tipo]").forEach(montar);
    const reinicio = document.querySelector(".ktc-reiniciar");
    if (reinicio) {
      reinicio.addEventListener("click", () => {
        if (!confirm("¿Borrar todo tu progreso, borradores y respuestas de esta página?")) return;
        almacen.borrar("ktc-");
        location.reload();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
