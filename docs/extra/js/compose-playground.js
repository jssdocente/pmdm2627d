/*
 * Compose Playground para MkDocs
 * ------------------------------
 * Simula en el navegador (con CSS flexbox/grid) cómo colocan Jetpack Compose
 * sus contenedores básicos y cómo se aplica una cadena de modificadores.
 *
 * Uso en un .md:
 *   <div class="cpg" data-cpg="layout"></div>      -> Column / Row / Box
 *   <div class="cpg" data-cpg="modifiers"></div>   -> orden de los Modifier
 *
 * Es una aproximación didáctica: reproduce el comportamiento de Compose en los
 * casos que se trabajan en clase, no el motor de medición real.
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------- utilidades

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === undefined || v === null || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "style") Object.assign(el.style, v);
        else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }

  var uid = 0;
  function nextId(prefix) {
    uid += 1;
    return "cpg-" + prefix + "-" + uid;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Resaltado mínimo de Kotlin para el código generado.
  function highlight(code) {
    var re = /("[^"\n]*")|(\/\/[^\n]*)|(\b0x[0-9A-Fa-f]+\b|\b\d+(?:\.\d+)?f?\b)|(\b(?:Modifier|Arrangement|Alignment|Color|RoundedCornerShape)\b)|(\b[A-Z][A-Za-z]*(?=\())|(\.[a-z][A-Za-z]*(?=[\s({]))/g;
    return escapeHtml(code).replace(re, function (m, str, com, num, type, fn, method) {
      if (str) return '<span class="cpg-tk-str">' + m + "</span>";
      if (com) return '<span class="cpg-tk-com">' + m + "</span>";
      if (num) return '<span class="cpg-tk-num">' + m + "</span>";
      if (type) return '<span class="cpg-tk-type">' + m + "</span>";
      if (fn) return '<span class="cpg-tk-fn">' + m + "</span>";
      if (method) return '<span class="cpg-tk-method">' + m + "</span>";
      return m;
    });
  }

  function codePanel() {
    var code = h("code");
    var btn = h("button", { type: "button", class: "cpg-copy", text: "Copiar" });
    var current = "";
    btn.addEventListener("click", function () {
      var done = function () {
        btn.textContent = "¡Copiado!";
        setTimeout(function () { btn.textContent = "Copiar"; }, 1500);
      };
      try {
        navigator.clipboard.writeText(current).then(done, function () {});
      } catch (e) { /* sin portapapeles: no hacemos nada */ }
    });
    var el = h("div", { class: "cpg-code" }, [btn, h("pre", null, [code])]);
    return {
      el: el,
      set: function (text) {
        current = text;
        code.innerHTML = highlight(text);
      }
    };
  }

  function select(labelText, options, value, onChange) {
    var id = nextId("sel");
    var sel = h("select", { id: id });
    options.forEach(function (o) {
      var opt = h("option", { value: o.value, text: o.label });
      if (o.value === value) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () { onChange(sel.value); });
    return h("div", { class: "cpg-field" }, [h("label", { for: id, text: labelText }), sel]);
  }

  function segmented(labelText, options, value, onChange) {
    var group = h("div", { class: "cpg-seg", role: "group", "aria-label": labelText });
    options.forEach(function (o) {
      var b = h("button", {
        type: "button",
        class: o.value === value ? "cpg-on" : "",
        "aria-pressed": o.value === value ? "true" : "false",
        text: o.label
      });
      b.addEventListener("click", function () { onChange(o.value); });
      group.appendChild(b);
    });
    return h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: labelText }), group]);
  }

  function opts(list) {
    return list.map(function (v) { return typeof v === "string" ? { value: v, label: v } : v; });
  }

  // ------------------------------------------------------ playground de layouts

  var ARRANGEMENT = {
    Column: ["Top", "Center", "Bottom", "SpaceBetween", "SpaceAround", "SpaceEvenly", "spacedBy"],
    Row: ["Start", "Center", "End", "SpaceBetween", "SpaceAround", "SpaceEvenly", "spacedBy"]
  };
  var ALIGNMENT = {
    Column: ["Start", "CenterHorizontally", "End"],
    Row: ["Top", "CenterVertically", "Bottom"],
    Box: ["TopStart", "TopCenter", "TopEnd", "CenterStart", "Center", "CenterEnd", "BottomStart", "BottomCenter", "BottomEnd"]
  };
  var JUSTIFY = {
    Top: "flex-start", Start: "flex-start", Center: "center", Bottom: "flex-end", End: "flex-end",
    SpaceBetween: "space-between", SpaceAround: "space-around", SpaceEvenly: "space-evenly", spacedBy: "flex-start"
  };
  var ALIGN_ITEMS = {
    Start: "flex-start", Top: "flex-start",
    CenterHorizontally: "center", CenterVertically: "center",
    End: "flex-end", Bottom: "flex-end"
  };
  // Tamaño (ancho x alto) de cada caja según el contenedor, para que se aprecie la alineación.
  var SIZES = {
    Column: [[64, 40], [96, 40], [48, 40], [80, 40]],
    Row: [[48, 48], [48, 80], [48, 32], [48, 64]],
    Box: [[150, 110], [104, 76], [64, 52], [36, 36]]
  };
  var BOX_COLORS = ["#ffb4a9", "#ffd54f", "#9be7c4", "#a8c7fa"];
  var LETTERS = ["A", "B", "C", "D"];

  function boxGridPos(a) {
    var v = a.indexOf("Top") === 0 ? "start" : a.indexOf("Bottom") === 0 ? "end" : "center";
    var hz = /Start$/.test(a) ? "start" : /End$/.test(a) ? "end" : "center";
    return { alignSelf: v, justifySelf: hz };
  }

  function layoutPlayground(root) {
    var state = {
      container: root.getAttribute("data-container") || "Column",
      fill: true,
      arrangement: "Top",
      alignment: "Start",
      boxAlignment: "TopStart",
      spacing: 8,
      count: 3,
      children: [0, 1, 2, 3].map(function () { return { weight: 0, align: "" }; })
    };
    if (state.container === "Row") { state.arrangement = "Start"; state.alignment = "Top"; }

    var controls = h("div", { class: "cpg-controls" });
    var childControls = h("div", { class: "cpg-children" });
    var stage = h("div", { class: "cpg-stage cpg-stage-layout" });
    var hint = h("p", { class: "cpg-hint", "aria-live": "polite" });
    var code = codePanel();

    root.appendChild(h("div", { class: "cpg-title" }, [
      h("strong", { text: "Playground: Column, Row y Box" }),
      h("span", { text: "Cambia los parámetros y observa el resultado y el código" })
    ]));
    root.appendChild(h("div", { class: "cpg-body" }, [
      h("div", { class: "cpg-panel" }, [controls, childControls]),
      h("div", { class: "cpg-output" }, [stage, hint, code.el])
    ]));

    function switchContainer(next) {
      var prev = state.container;
      if (prev === next) return;
      state.container = next;
      if (next !== "Box") {
        // Conserva la posición equivalente (Top <-> Start, Bottom <-> End).
        var idx = prev === "Box" ? 0 : ARRANGEMENT[prev].indexOf(state.arrangement);
        state.arrangement = ARRANGEMENT[next][Math.max(0, idx)];
        var aIdx = prev === "Box" ? 0 : ALIGNMENT[prev].indexOf(state.alignment);
        state.alignment = ALIGNMENT[next][Math.max(0, aIdx)];
      }
      state.children.forEach(function (c) { c.align = ""; if (next === "Box") c.weight = 0; });
      render();
    }

    function renderControls() {
      controls.innerHTML = "";
      controls.appendChild(segmented("Contenedor", opts(["Column", "Row", "Box"]), state.container, switchContainer));
      controls.appendChild(segmented("Tamaño del contenedor", [
        { value: "fill", label: "fillMaxSize()" },
        { value: "wrap", label: "Se ajusta al contenido" }
      ], state.fill ? "fill" : "wrap", function (v) { state.fill = v === "fill"; render(); }));

      if (state.container === "Box") {
        controls.appendChild(select("contentAlignment", opts(ALIGNMENT.Box), state.boxAlignment, function (v) {
          state.boxAlignment = v; render();
        }));
      } else {
        var isCol = state.container === "Column";
        controls.appendChild(select(isCol ? "verticalArrangement (eje principal ↕)" : "horizontalArrangement (eje principal ↔)",
          opts(ARRANGEMENT[state.container].map(function (a) {
            return { value: a, label: a === "spacedBy" ? "spacedBy(…)" : a };
          })), state.arrangement, function (v) { state.arrangement = v; render(); }));
        if (state.arrangement === "spacedBy") {
          controls.appendChild(select("Separación", opts([4, 8, 16, 24].map(function (n) {
            return { value: String(n), label: n + ".dp" };
          })), String(state.spacing), function (v) { state.spacing = Number(v); render(); }));
        }
        controls.appendChild(select(isCol ? "horizontalAlignment (eje cruzado ↔)" : "verticalAlignment (eje cruzado ↕)",
          opts(ALIGNMENT[state.container]), state.alignment, function (v) { state.alignment = v; render(); }));
      }
      controls.appendChild(segmented("Número de hijos", opts(["1", "2", "3", "4"]), String(state.count), function (v) {
        state.count = Number(v); render();
      }));
    }

    function renderChildControls() {
      childControls.innerHTML = "";
      childControls.appendChild(h("p", { class: "cpg-sub", text: "Modificadores de cada hijo (solo existen dentro del scope del contenedor)" }));
      var c = state.container;
      for (var i = 0; i < state.count; i++) {
        (function (i) {
          var child = state.children[i];
          var row = h("div", { class: "cpg-child-row" }, [
            h("span", { class: "cpg-chip", style: { background: BOX_COLORS[i] }, text: LETTERS[i] })
          ]);
          var alignOpts = [{ value: "", label: "— (usa el del contenedor)" }];
          if (c === "Box") {
            alignOpts = alignOpts.concat(opts(ALIGNMENT.Box).map(function (o) {
              return { value: o.value, label: "align(" + o.value + ")" };
            }));
          } else {
            alignOpts = alignOpts.concat(opts(ALIGNMENT[c]).map(function (o) {
              return { value: o.value, label: "align(" + o.value + ")" };
            }));
            alignOpts.push({ value: "fill", label: c === "Column" ? "fillMaxWidth()" : "fillMaxHeight()" });
          }
          row.appendChild(select("Alineación propia", alignOpts, child.align, function (v) { child.align = v; render(); }));
          if (c !== "Box") {
            row.appendChild(select("weight", [
              { value: "0", label: "sin weight" },
              { value: "1", label: "weight(1f)" },
              { value: "2", label: "weight(2f)" }
            ], String(child.weight), function (v) { child.weight = Number(v); render(); }));
          }
          childControls.appendChild(row);
        })(i);
      }
    }

    function renderStage() {
      stage.innerHTML = "";
      var c = state.container;
      var frame = h("div", { class: "cpg-frame" });
      var cont = h("div", { class: "cpg-container cpg-c-" + c.toLowerCase() + (state.fill ? " cpg-fill" : "") }, [
        h("span", { class: "cpg-container-label", text: c })
      ]);
      if (c === "Box") {
        var pos = boxGridPos(state.boxAlignment);
        cont.style.alignItems = pos.alignSelf;
        cont.style.justifyItems = pos.justifySelf;
      } else {
        cont.style.justifyContent = JUSTIFY[state.arrangement];
        cont.style.alignItems = ALIGN_ITEMS[state.alignment];
        cont.style.gap = state.arrangement === "spacedBy" ? state.spacing + "px" : "0";
      }
      for (var i = 0; i < state.count; i++) {
        var child = state.children[i];
        var size = SIZES[c][i];
        var el = h("div", { class: "cpg-box", text: LETTERS[i], style: {
          width: size[0] + "px", height: size[1] + "px", background: BOX_COLORS[i]
        } });
        if (c === "Box") {
          if (child.align) {
            var p = boxGridPos(child.align);
            el.style.alignSelf = p.alignSelf;
            el.style.justifySelf = p.justifySelf;
          }
        } else {
          var main = c === "Column" ? "height" : "width";
          var cross = c === "Column" ? "width" : "height";
          if (child.weight) {
            el.style.flex = child.weight + " 1 0";
            el.style[main] = "auto";
          }
          if (child.align === "fill") {
            el.style.alignSelf = "stretch";
            el.style[cross] = "auto";
          } else if (child.align) {
            el.style.alignSelf = ALIGN_ITEMS[child.align];
          }
        }
        cont.appendChild(el);
      }
      frame.appendChild(cont);
      stage.appendChild(frame);
    }

    function arrangementCode() {
      return state.arrangement === "spacedBy"
        ? "Arrangement.spacedBy(" + state.spacing + ".dp)"
        : "Arrangement." + state.arrangement;
    }

    function renderCode() {
      var c = state.container;
      var lines = [c + "("];
      var params = [];
      if (state.fill) params.push("    modifier = Modifier.fillMaxSize()");
      if (c === "Box") {
        params.push("    contentAlignment = Alignment." + state.boxAlignment);
      } else if (c === "Column") {
        params.push("    verticalArrangement = " + arrangementCode());
        params.push("    horizontalAlignment = Alignment." + state.alignment);
      } else {
        params.push("    horizontalArrangement = " + arrangementCode());
        params.push("    verticalAlignment = Alignment." + state.alignment);
      }
      lines.push(params.join(",\n"));
      lines.push(") {");
      for (var i = 0; i < state.count; i++) {
        var child = state.children[i];
        var mods = [];
        if (child.weight) mods.push(".weight(" + child.weight + "f)");
        if (child.align === "fill") mods.push(c === "Column" ? ".fillMaxWidth()" : ".fillMaxHeight()");
        else if (child.align) mods.push(".align(Alignment." + child.align + ")");
        lines.push('    Caja("' + LETTERS[i] + '"' + (mods.length ? ", Modifier" + mods.join("") : "") + ")");
      }
      lines.push("}");
      code.set(lines.join("\n"));
    }

    function renderHint() {
      var c = state.container;
      var msg = "";
      var anyWeight = state.children.slice(0, state.count).some(function (ch) { return ch.weight > 0; });
      if (c === "Box") {
        msg = "En un Box los hijos se apilan: el primero queda al fondo y el último encima. " +
          "contentAlignment coloca a todos; Modifier.align() solo a ese hijo.";
      } else if (!state.fill && state.arrangement !== ARRANGEMENT[c][0] && state.arrangement !== "spacedBy") {
        msg = "⚠️ El " + c + " se ajusta a su contenido, así que no hay espacio libre que repartir: " +
          "el Arrangement no tiene efecto visible. Dale tamaño (fillMaxSize, fillMaxWidth…) para verlo.";
      } else if (anyWeight && /^Space/.test(state.arrangement)) {
        msg = "Los hijos con weight se quedan con todo el espacio sobrante, así que el Arrangement ya no reparte nada.";
      } else if (anyWeight) {
        msg = "weight reparte el espacio sobrante del eje principal entre los hijos que lo tienen, en proporción a su valor.";
      } else if (c === "Column") {
        msg = "Column: el Arrangement actúa en vertical (eje principal) y el Alignment en horizontal (eje cruzado).";
      } else {
        msg = "Row: el Arrangement actúa en horizontal (eje principal) y el Alignment en vertical (eje cruzado).";
      }
      hint.textContent = msg;
    }

    function render() {
      renderControls();
      renderChildControls();
      renderStage();
      renderCode();
      renderHint();
    }

    render();
  }

  // -------------------------------------------------- playground de modificadores

  var MOD_COLORS = [
    { label: "Ámbar", hex: "FFD54F" },
    { label: "Cian", hex: "80DEEA" },
    { label: "Rosa", hex: "F48FB1" },
    { label: "Verde", hex: "A5D6A7" },
    { label: "Lila", hex: "B39DDB" },
    { label: "Rojo", hex: "E53935" },
    { label: "Azul", hex: "1E88E5" }
  ];

  var MOD_TYPES = {
    padding: { label: "padding", def: { v: 16 } },
    background: { label: "background", def: { c: 0 } },
    border: { label: "border", def: { v: 2, c: 5 } },
    clip: { label: "clip", def: { v: 16 } },
    size: { label: "size", def: { v: 120 } },
    clickable: { label: "clickable", def: {} },
    offset: { label: "offset", def: { v: 16 } },
    rotate: { label: "rotate", def: { v: 15 } }
  };

  var PRESETS = [
    { label: "Padding interno", chain: [["background", { c: 0 }], ["padding", { v: 16 }]] },
    { label: "Margen exterior", chain: [["padding", { v: 16 }], ["background", { c: 0 }]] },
    { label: "Doble fondo", chain: [["background", { c: 1 }], ["padding", { v: 16 }], ["background", { c: 0 }], ["padding", { v: 16 }]] },
    { label: "Tarjeta redondeada", chain: [["padding", { v: 8 }], ["clip", { v: 16 }], ["background", { c: 4 }], ["padding", { v: 16 }]] },
    { label: "Área táctil", chain: [["clickable", {}], ["padding", { v: 24 }], ["background", { c: 3 }]] },
    { label: "size antes de padding", chain: [["size", { v: 120 }], ["padding", { v: 24 }], ["background", { c: 2 }]] }
  ];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function modCode(m) {
    switch (m.type) {
      case "padding": return ".padding(" + m.v + ".dp)";
      case "background": return ".background(Color(0xFF" + MOD_COLORS[m.c].hex + "))";
      case "border": return ".border(" + m.v + ".dp, Color(0xFF" + MOD_COLORS[m.c].hex + "))";
      case "clip": return ".clip(RoundedCornerShape(" + m.v + ".dp))";
      case "size": return ".size(" + m.v + ".dp)";
      case "clickable": return ".clickable { /* acción */ }";
      case "offset": return ".offset(x = " + m.v + ".dp, y = " + m.v + ".dp)";
      case "rotate": return ".rotate(" + m.v + "f)";
    }
    return "";
  }

  // Cada modificador envuelve a todo lo que viene después: el primero es la capa exterior.
  function wrap(m, inner) {
    var el = h("div", { class: "cpg-mod cpg-mod-" + m.type }, [inner]);
    switch (m.type) {
      case "padding": el.style.padding = m.v + "px"; break;
      case "background":
        el.style.background = "#" + MOD_COLORS[m.c].hex;
        el.classList.add("cpg-has-bg");
        break;
      case "border":
        el.style.outline = m.v + "px solid #" + MOD_COLORS[m.c].hex;
        el.style.outlineOffset = "-" + m.v + "px";
        break;
      case "clip":
        el.style.borderRadius = m.v + "px";
        el.style.overflow = "hidden";
        break;
      case "size":
        el.style.width = m.v + "px";
        el.style.height = m.v + "px";
        el.classList.add("cpg-sized");
        break;
      case "clickable":
        el.setAttribute("title", "Zona pulsable");
        break;
      case "offset":
        el.style.left = m.v + "px";
        el.style.top = m.v + "px";
        break;
      case "rotate":
        el.style.transform = "rotate(" + m.v + "deg)";
        break;
    }
    return el;
  }

  function modifierPlayground(root) {
    var chain = PRESETS[0].chain.map(function (p) { return Object.assign({ type: p[0] }, clone(p[1])); });
    var addType = "padding";

    var list = h("ol", { class: "cpg-chain" });
    var adder = h("div", { class: "cpg-adder" });
    var presets = h("div", { class: "cpg-presets" });
    var stage = h("div", { class: "cpg-stage cpg-stage-mod" });
    var code = codePanel();

    root.appendChild(h("div", { class: "cpg-title" }, [
      h("strong", { text: "Playground: el orden de los Modifier" }),
      h("span", { text: "Se aplican de arriba abajo: cada uno envuelve a los siguientes" })
    ]));
    root.appendChild(h("div", { class: "cpg-body" }, [
      h("div", { class: "cpg-panel" }, [
        h("p", { class: "cpg-sub", text: "Ejemplos rápidos" }), presets,
        h("p", { class: "cpg-sub", text: "Cadena de modificadores (de fuera a dentro)" }), list, adder
      ]),
      h("div", { class: "cpg-output" }, [stage, code.el])
    ]));

    PRESETS.forEach(function (p) {
      presets.appendChild(h("button", { type: "button", text: p.label, onclick: function () {
        chain = p.chain.map(function (x) { return Object.assign({ type: x[0] }, clone(x[1])); });
        render();
      } }));
    });

    function numberSelect(m, values, suffix) {
      var sel = h("select", { "aria-label": "Valor de " + m.type });
      values.forEach(function (v) {
        var o = h("option", { value: String(v), text: v + suffix });
        if (v === m.v) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () { m.v = Number(sel.value); render(); });
      return sel;
    }

    function colorSelect(m) {
      var sel = h("select", { "aria-label": "Color de " + m.type });
      MOD_COLORS.forEach(function (c, i) {
        var o = h("option", { value: String(i), text: c.label });
        if (i === m.c) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () { m.c = Number(sel.value); render(); });
      return sel;
    }

    function renderList() {
      list.innerHTML = "";
      if (!chain.length) {
        list.appendChild(h("li", { class: "cpg-empty", text: "Sin modificadores: añade alguno abajo." }));
      }
      chain.forEach(function (m, i) {
        var params = [];
        if (m.type === "padding") params.push(numberSelect(m, [0, 4, 8, 16, 24, 32, 48], ".dp"));
        if (m.type === "border") params.push(numberSelect(m, [1, 2, 4, 8], ".dp"), colorSelect(m));
        if (m.type === "background") params.push(colorSelect(m));
        if (m.type === "clip") params.push(numberSelect(m, [0, 8, 16, 32, 64], ".dp"));
        if (m.type === "size") params.push(numberSelect(m, [40, 64, 96, 120, 160, 200], ".dp"));
        if (m.type === "offset") params.push(numberSelect(m, [-16, -8, 8, 16, 32], ".dp"));
        if (m.type === "rotate") params.push(numberSelect(m, [-45, -15, 15, 45, 90], "°"));
        var li = h("li", null, [
          h("code", { text: "." + MOD_TYPES[m.type].label }),
          h("span", { class: "cpg-params" }, params),
          h("span", { class: "cpg-actions" }, [
            h("button", { type: "button", "aria-label": "Subir", title: "Subir", text: "↑", disabled: i === 0,
              onclick: function () { var t = chain[i - 1]; chain[i - 1] = chain[i]; chain[i] = t; render(); } }),
            h("button", { type: "button", "aria-label": "Bajar", title: "Bajar", text: "↓", disabled: i === chain.length - 1,
              onclick: function () { var t = chain[i + 1]; chain[i + 1] = chain[i]; chain[i] = t; render(); } }),
            h("button", { type: "button", "aria-label": "Quitar", title: "Quitar", text: "✕",
              onclick: function () { chain.splice(i, 1); render(); } })
          ])
        ]);
        list.appendChild(li);
      });

      adder.innerHTML = "";
      var sel = h("select", { "aria-label": "Modificador a añadir" });
      Object.keys(MOD_TYPES).forEach(function (k) {
        var o = h("option", { value: k, text: "." + MOD_TYPES[k].label + "(…)" });
        if (k === addType) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () { addType = sel.value; });
      adder.appendChild(sel);
      adder.appendChild(h("button", { type: "button", text: "Añadir al final", disabled: chain.length >= 8, onclick: function () {
        chain.push(Object.assign({ type: addType }, clone(MOD_TYPES[addType].def)));
        render();
      } }));
    }

    function renderStage() {
      stage.innerHTML = "";
      var el = h("span", { class: "cpg-text", text: "Hola Compose" });
      for (var i = chain.length - 1; i >= 0; i--) el = wrap(chain[i], el);
      var outer = h("div", { class: "cpg-bounds" }, [el]);
      stage.appendChild(outer);
      stage.appendChild(h("p", { class: "cpg-legend", text: "Línea discontinua: límites que ocupa el Text en el layout. Pasa el ratón para ver la zona clickable." }));
    }

    function renderCode() {
      if (!chain.length) { code.set('Text(text = "Hola Compose")'); return; }
      var lines = ["Text(", '    text = "Hola Compose",', "    modifier = Modifier"];
      chain.forEach(function (m) { lines.push("        " + modCode(m)); });
      lines.push(")");
      code.set(lines.join("\n"));
    }

    function render() {
      renderList();
      renderStage();
      renderCode();
    }

    render();
  }

  // --------------------------------------------------------------- arranque

  var PLAYGROUNDS = { layout: layoutPlayground, modifiers: modifierPlayground };

  function init() {
    var nodes = document.querySelectorAll(".cpg[data-cpg]:not([data-cpg-ready])");
    Array.prototype.forEach.call(nodes, function (node) {
      var fn = PLAYGROUNDS[node.getAttribute("data-cpg")];
      if (!fn) return;
      node.setAttribute("data-cpg-ready", "");
      node.innerHTML = "";
      fn(node);
    });
  }

  // Material for MkDocs expone document$ (también con navegación instantánea).
  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
