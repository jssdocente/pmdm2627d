/*
 * Compose Playground: componentes interactivos de Material 3 (apuntes 3A.2)
 * ------------------------------------------------------------------------
 * Complementa a compose-playground.js y reutiliza sus estilos (.cpg-*).
 * Dibuja los componentes con los colores de referencia de Material 3 y genera
 * el código Compose equivalente a lo que se configura.
 *
 * Uso en un .md:
 *   <div class="cpg" data-cpg="buttons"></div>    -> jerarquía de botones
 *   <div class="cpg" data-cpg="textfield"></div>  -> OutlinedTextField con validación
 *   <div class="cpg" data-cpg="selection"></div>  -> Switch, Checkbox, RadioButton y Slider
 *   <div class="cpg" data-cpg="overlays"></div>   -> menús, AlertDialog y ModalBottomSheet
 *   <div class="cpg" data-cpg="drawer"></div>     -> ModalNavigationDrawer (apuntes 3A.1)
 *   <div class="cpg" data-cpg="topappbar"></div>  -> variantes de TopAppBar y scrollBehavior (apuntes 3A.1)
 *   <div class="cpg" data-cpg="snackbar"></div>   -> SnackbarHostState.showSnackbar (apuntes 3A.1)
 *   <div class="cpg" data-cpg="lazylist"></div>   -> LazyColumn / LazyRow frente a Column, y key (apuntes 3A.3)
 *   <div class="cpg" data-cpg="lazygrid"></div>   -> LazyVerticalGrid / LazyHorizontalGrid y GridCells (apuntes 3A.3)
 *   <div class="cpg" data-cpg="navigation"></div> -> pila de Navigation 3, pestañas y transiciones (apuntes 3B.1)
 *   <div class="cpg" data-cpg="adaptive"></div>   -> ventana redimensionable: clases de tamaño y navegación adaptativa (apuntes 3B.2)
 *   <div class="cpg" data-cpg="koin"></div>       -> resolutor de Koin: single, factory, bind y errores (apuntes 3C.3)
 *   <div class="cpg" data-cpg="semantics"></div>  -> árbol semántico: finders, acciones y errores de los tests de UI (apuntes 3C.4)
 *   <div class="cpg" data-cpg="flowbelt"></div>   -> animación de la cinta transportadora de un Flow (apuntes 52-flows)
 *   <div class="cpg" data-cpg="flowops"></div>    -> diagrama de canicas en vivo con map, filter, take, debounce… (apuntes 52-flows)
 *   <div class="cpg" data-cpg="flowhot"></div>    -> flujo frío, StateFlow y SharedFlow con suscriptores (apuntes 52-flows)
 *   <div class="cpg" data-cpg="mainthread"></div> -> bloquear el hilo principal frente a suspender, y ANR (apuntes 51-corrutinas)
 *   <div class="cpg" data-cpg="coroutines"></div> -> secuencial, async/await, cancelación y errores (apuntes 51-corrutinas)
 *
 * Es una aproximación didáctica: imita el aspecto y el comportamiento de los
 * componentes, no los renderiza con Compose.
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
    return "cpc-" + prefix + "-" + uid;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Resaltado mínimo de Kotlin para el código generado (mismas clases que compose-playground.js).
  var TYPES = "Modifier|Arrangement|Alignment|MaterialTheme|ButtonDefaults|SwitchDefaults|KeyboardOptions|KeyboardType|" +
    "ExposedDropdownMenuDefaults|ExposedDropdownMenuAnchorType|PasswordVisualTransformation|VisualTransformation|Role|R";
  function highlight(code) {
    var re = new RegExp(
      '("(?:[^"\\\\\\n]|\\\\.)*")|(\\/\\/[^\\n]*)|(\\b\\d+(?:\\.\\d+)?f?\\b)|(\\b(?:' + TYPES + ')\\b)|' +
      '(\\b(?:var|val|if|else|by|true|false|null)\\b)|(\\b[A-Z][A-Za-z]*(?=[({]))|(\\.[a-z][A-Za-z]*(?=[\\s({]))', "g");
    return escapeHtml(code).replace(re, function (m, str, com, num, type, kw, fn, method) {
      if (str) return '<span class="cpg-tk-str">' + m + "</span>";
      if (com) return '<span class="cpg-tk-com">' + m + "</span>";
      if (num) return '<span class="cpg-tk-num">' + m + "</span>";
      if (type) return '<span class="cpg-tk-type">' + m + "</span>";
      if (kw) return '<span class="cpg-tk-method">' + m + "</span>";
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

  function yesNo(labelText, value, onChange) {
    return segmented(labelText, [{ value: "si", label: "Sí" }, { value: "no", label: "No" }],
      value ? "si" : "no", function (v) { onChange(v === "si"); });
  }

  function textField(labelText, value, onInput) {
    var id = nextId("txt");
    var input = h("input", { id: id, type: "text", class: "cpg-input", value: value });
    input.addEventListener("input", function () { onInput(input.value); });
    return h("div", { class: "cpg-field" }, [h("label", { for: id, text: labelText }), input]);
  }

  function opts(list) {
    return list.map(function (v) { return typeof v === "string" ? { value: v, label: v } : v; });
  }

  function kstr(s) {
    return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }

  // ----------------------------------------------------- tema de Material 3

  // Esquema de referencia (baseline) de Material 3: el mismo que darkColorScheme() / lightColorScheme().
  var SCHEMES = {
    light: {
      primary: "#6750A4", onPrimary: "#FFFFFF", primaryContainer: "#EADDFF", onPrimaryContainer: "#21005D",
      secondaryContainer: "#E8DEF8", onSecondaryContainer: "#1D192B",
      surface: "#FEF7FF", onSurface: "#1D1B20", onSurfaceVariant: "#49454F",
      surfaceContainerLow: "#F7F2FA", surfaceContainer: "#F3EDF7", surfaceContainerHigh: "#ECE6F0",
      surfaceContainerHighest: "#E6E0E9", outline: "#79747E", outlineVariant: "#CAC4D0",
      error: "#B3261E", onError: "#FFFFFF", scrim: "rgba(0, 0, 0, 0.32)",
      inverseSurface: "#322F35", inverseOnSurface: "#F5EFF7", inversePrimary: "#D0BCFF"
    },
    dark: {
      primary: "#D0BCFF", onPrimary: "#381E72", primaryContainer: "#4F378B", onPrimaryContainer: "#EADDFF",
      secondaryContainer: "#4A4458", onSecondaryContainer: "#E8DEF8",
      surface: "#141218", onSurface: "#E6E0E9", onSurfaceVariant: "#CAC4D0",
      surfaceContainerLow: "#1D1B20", surfaceContainer: "#211F26", surfaceContainerHigh: "#2B2930",
      surfaceContainerHighest: "#36343B", outline: "#938F99", outlineVariant: "#49454F",
      error: "#F2B8B5", onError: "#601410", scrim: "rgba(0, 0, 0, 0.32)",
      inverseSurface: "#E6E0E9", inverseOnSurface: "#322F35", inversePrimary: "#6750A4"
    }
  };

  function siteMode() {
    return document.body && document.body.getAttribute("data-md-color-scheme") === "slate" ? "dark" : "light";
  }

  // Aplica el esquema como variables CSS (--m3-primary…) a la "pantalla" del móvil.
  function applyScheme(el, mode) {
    var s = SCHEMES[mode];
    Object.keys(s).forEach(function (k) {
      el.style.setProperty("--m3-" + k.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); }), s[k]);
    });
    return el;
  }

  // Iconos de Material (Apache 2.0), 24 × 24.
  var ICONS = {
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    visibility: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
    visibilityOff: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z",
    error: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
    moreVert: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
    share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    darkMode: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    arrowBack: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    arrowDropDown: "M7 10l5 5 5-5z",
    favorite: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
  };

  function icon(name, size, extraClass) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size || 24);
    svg.setAttribute("height", size || 24);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "cpc-icon" + (extraClass ? " " + extraClass : ""));
    var p = document.createElementNS(ns, "path");
    p.setAttribute("d", ICONS[name]);
    p.setAttribute("fill", "currentColor");
    svg.appendChild(p);
    return svg;
  }

  // Estructura común: título, panel de controles y salida (escenario + pista + código).
  function shell(root, title, subtitle, stageClass) {
    var controls = h("div", { class: "cpg-controls" });
    var stage = h("div", { class: "cpg-stage cpc-stage" + (stageClass ? " " + stageClass : "") });
    var hint = h("p", { class: "cpg-hint", "aria-live": "polite" });
    var code = codePanel();
    root.appendChild(h("div", { class: "cpg-title" }, [h("strong", { text: title }), h("span", { text: subtitle })]));
    root.appendChild(h("div", { class: "cpg-body" }, [
      h("div", { class: "cpg-panel" }, [controls]),
      h("div", { class: "cpg-output" }, [stage, hint, code.el])
    ]));
    return { controls: controls, stage: stage, hint: hint, code: code };
  }

  function modeControl(state, render) {
    return segmented("Tema", [{ value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }],
      state.mode, function (v) { state.mode = v; render(); });
  }

  // Línea de "lo que está pasando" bajo el móvil: el estado manda.
  function stateLine(text) {
    return h("p", { class: "cpc-state" }, [h("code", { text: text })]);
  }

  // ---------------------------------------------------- playground de botones

  var BUTTONS = {
    Button: { cls: "filled", hint: "Button (filled): máximo énfasis. Úsalo para la acción principal de la pantalla, y solo una vez." },
    FilledTonalButton: { cls: "tonal", hint: "FilledTonalButton: énfasis medio-alto. Una acción importante que no es la principal (por ejemplo, «Añadir a la lista»)." },
    ElevatedButton: { cls: "elevated", hint: "ElevatedButton: tiene sombra. Resérvalo para cuando el botón debe despegarse de un fondo con imágenes o colores." },
    OutlinedButton: { cls: "outlined", hint: "OutlinedButton: énfasis medio. Acciones secundarias que acompañan a la principal, como «Cancelar» junto a «Guardar»." },
    TextButton: { cls: "text", hint: "TextButton: el menor énfasis. Habitual en diálogos, tarjetas y acciones poco importantes." }
  };

  function buttonsPlayground(root) {
    var state = { variant: "Button", text: "Guardar", icon: false, enabled: true, mode: siteMode(), clicks: 0 };
    var ui = shell(root, "Playground: botones de Material 3", "Elige la variante y pulsa el botón");

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(select("Variante", opts(Object.keys(BUTTONS)), state.variant, function (v) { state.variant = v; render(); }));
      ui.controls.appendChild(textField("Texto", state.text, function (v) { state.text = v; renderStage(); renderCode(); }));
      ui.controls.appendChild(yesNo("Icono delante del texto", state.icon, function (v) { state.icon = v; render(); }));
      ui.controls.appendChild(yesNo("enabled", state.enabled, function (v) { state.enabled = v; render(); }));
      ui.controls.appendChild(modeControl(state, render));
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var screen = applyScheme(h("div", { class: "cpc-screen cpc-center" }), state.mode);
      var btn = h("button", {
        type: "button",
        class: "cpc-btn cpc-btn-" + BUTTONS[state.variant].cls + (state.icon ? " cpc-btn-icon" : ""),
        disabled: !state.enabled
      }, [state.icon ? icon("check", 18) : null, h("span", { text: state.text || " " })]);
      btn.addEventListener("click", function () { state.clicks += 1; renderStage(); });
      screen.appendChild(btn);
      ui.stage.appendChild(h("div", { class: "cpc-col" }, [
        screen,
        stateLine(state.enabled ? "onClick ejecutado " + state.clicks + (state.clicks === 1 ? " vez" : " veces")
          : "enabled = false: no se puede pulsar")
      ]));
    }

    function renderCode() {
      var lines = [state.variant + "("];
      lines.push("    onClick = { /* acción */ }" + (state.enabled ? "" : ","));
      if (!state.enabled) lines.push("    enabled = false");
      lines.push(") {");
      if (state.icon) {
        lines.push("    Icon(");
        lines.push("        painter = painterResource(R.drawable.ic_check),");
        lines.push("        contentDescription = null,");
        lines.push("        modifier = Modifier.size(ButtonDefaults.IconSize)");
        lines.push("    )");
        lines.push("    Spacer(Modifier.width(ButtonDefaults.IconSpacing))");
      }
      lines.push("    Text(" + kstr(state.text) + ")");
      lines.push("}");
      ui.code.set(lines.join("\n"));
      ui.hint.textContent = BUTTONS[state.variant].hint;
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // ------------------------------------------------ playground de TextField

  var VALIDATIONS = {
    none: { label: "Sin validación" },
    email: {
      label: "Correo (contiene @)", cond: 'texto.isNotBlank() && !texto.contains("@")', msg: "Introduce un correo válido",
      test: function (t) { return t.trim() !== "" && t.indexOf("@") < 0; }
    },
    min3: {
      label: "Al menos 3 caracteres", cond: "texto.isNotEmpty() && texto.length < 3", msg: "Escribe al menos 3 caracteres",
      test: function (t) { return t.length > 0 && t.length < 3; }
    },
    digits: {
      label: "Solo números", cond: "!texto.all { it.isDigit() }", msg: "Solo se admiten números",
      test: function (t) { return !/^\d*$/.test(t); }
    }
  };
  var LEADING = { none: "Ninguno", mail: "ic_mail", lock: "ic_lock", search: "ic_search" };
  var KEYBOARDS = ["Text", "Email", "Number", "Password"];

  function textFieldPlayground(root) {
    var state = {
      label: "Correo electrónico", placeholder: "usuario@dominio.com", leading: "mail", clear: true,
      validation: "email", supporting: true, keyboard: "Email", value: "", focused: false, showPass: false, mode: siteMode()
    };
    var ui = shell(root, "Playground: OutlinedTextField", "Escribe en el campo y mira cómo reacciona la validación");
    var input, box, labelEl, support, trailing, stateEl;

    function invalid() {
      var v = VALIDATIONS[state.validation];
      return !!(v.test && v.test(state.value));
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(textField("label", state.label, function (v) { state.label = v; renderStage(); renderCode(); }));
      ui.controls.appendChild(textField("placeholder (se ve con el foco y el campo vacío)", state.placeholder, function (v) {
        state.placeholder = v; renderStage(); renderCode();
      }));
      ui.controls.appendChild(select("leadingIcon", Object.keys(LEADING).map(function (k) { return { value: k, label: LEADING[k] }; }),
        state.leading, function (v) { state.leading = v; render(); }));
      ui.controls.appendChild(yesNo("trailingIcon para borrar", state.clear, function (v) { state.clear = v; render(); }));
      ui.controls.appendChild(select("Validación (isError)", Object.keys(VALIDATIONS).map(function (k) {
        return { value: k, label: VALIDATIONS[k].label };
      }), state.validation, function (v) { state.validation = v; render(); }));
      ui.controls.appendChild(yesNo("supportingText", state.supporting, function (v) { state.supporting = v; render(); }));
      ui.controls.appendChild(segmented("keyboardType", opts(KEYBOARDS), state.keyboard, function (v) { state.keyboard = v; render(); }));
      ui.controls.appendChild(modeControl(state, render));
    }

    // Actualiza clases y textos sin volver a crear el <input> (así no pierde el foco al escribir).
    function refresh() {
      var err = invalid();
      var filled = state.value !== "";
      box.className = "cpc-tf" + (state.focused ? " cpc-focused" : "") + (filled ? " cpc-filled" : "") +
        (err ? " cpc-error" : "") + (state.leading !== "none" ? " cpc-has-lead" : "");
      input.placeholder = state.focused && !filled ? state.placeholder : "";
      labelEl.textContent = state.label;
      trailing.innerHTML = "";
      if (state.keyboard === "Password") {
        var b = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": state.showPass ? "Ocultar contraseña" : "Mostrar contraseña" },
          [icon(state.showPass ? "visibilityOff" : "visibility")]);
        b.addEventListener("mousedown", function (e) { e.preventDefault(); });
        b.addEventListener("click", function () { state.showPass = !state.showPass; input.type = state.showPass ? "text" : "password"; refresh(); });
        trailing.appendChild(b);
      } else if (state.clear && filled) {
        var c = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Borrar texto" }, [icon("close")]);
        c.addEventListener("mousedown", function (e) { e.preventDefault(); });
        c.addEventListener("click", function () { state.value = ""; input.value = ""; refresh(); });
        trailing.appendChild(c);
      } else if (err) {
        trailing.appendChild(icon("error", 24, "cpc-err-icon"));
      }
      support.textContent = !state.supporting ? "" : (err ? VALIDATIONS[state.validation].msg : "Texto de ayuda del campo");
      support.className = "cpc-tf-support" + (err ? " cpc-error" : "");
      stateEl.firstChild.textContent = "texto = " + kstr(state.value) + "   isError = " + err;
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var screen = applyScheme(h("div", { class: "cpc-screen cpc-pad" }), state.mode);
      var id = nextId("tf");
      input = h("input", {
        id: id, class: "cpc-tf-input", value: state.value, autocomplete: "off",
        type: state.keyboard === "Password" && !state.showPass ? "password" : "text",
        inputmode: { Text: "text", Email: "email", Number: "numeric", Password: "text" }[state.keyboard]
      });
      input.addEventListener("input", function () { state.value = input.value; refresh(); });
      input.addEventListener("focus", function () { state.focused = true; refresh(); });
      input.addEventListener("blur", function () { state.focused = false; refresh(); });
      labelEl = h("label", { for: id, class: "cpc-tf-label" });
      trailing = h("span", { class: "cpc-tf-trail" });
      box = h("div", null, [
        state.leading !== "none" ? h("span", { class: "cpc-tf-lead" }, [icon(state.leading)]) : null,
        h("div", { class: "cpc-tf-inner" }, [labelEl, input]),
        trailing
      ]);
      support = h("p");
      screen.appendChild(box);
      screen.appendChild(support);
      stateEl = stateLine("");
      ui.stage.appendChild(h("div", { class: "cpc-col cpc-wide" }, [screen, stateEl]));
      refresh();
    }

    function renderCode() {
      var v = VALIDATIONS[state.validation];
      var pass = state.keyboard === "Password";
      var lines = ["var texto by rememberSaveable { mutableStateOf(\"\") }"];
      if (pass) lines.push("var verClave by rememberSaveable { mutableStateOf(false) }");
      if (v.cond) lines.push("val esInvalido = " + v.cond);
      lines.push("", "OutlinedTextField(", "    value = texto,", "    onValueChange = { texto = it },");
      lines.push("    label = { Text(" + kstr(state.label) + ") },");
      if (state.placeholder) lines.push("    placeholder = { Text(" + kstr(state.placeholder) + ") },");
      if (state.leading !== "none") {
        lines.push("    leadingIcon = {", "        Icon(painterResource(R.drawable." + LEADING[state.leading] + "), contentDescription = null)", "    },");
      }
      if (pass) {
        lines.push("    trailingIcon = {");
        lines.push("        IconButton(onClick = { verClave = !verClave }) {");
        lines.push("            Icon(");
        lines.push("                painterResource(if (verClave) R.drawable.ic_visibility_off else R.drawable.ic_visibility),");
        lines.push("                contentDescription = if (verClave) \"Ocultar contraseña\" else \"Mostrar contraseña\"");
        lines.push("            )", "        }", "    },");
        lines.push("    visualTransformation = if (verClave) VisualTransformation.None else PasswordVisualTransformation(),");
      } else if (state.clear) {
        lines.push("    trailingIcon = {");
        lines.push("        if (texto.isNotEmpty()) {");
        lines.push("            IconButton(onClick = { texto = \"\" }) {");
        lines.push("                Icon(painterResource(R.drawable.ic_close), contentDescription = \"Borrar texto\")");
        lines.push("            }", "        }", "    },");
      }
      if (v.cond) lines.push("    isError = esInvalido,");
      if (state.supporting) {
        lines.push(v.cond
          ? "    supportingText = { Text(if (esInvalido) " + kstr(v.msg) + " else \"Texto de ayuda del campo\") },"
          : "    supportingText = { Text(\"Texto de ayuda del campo\") },");
      }
      if (state.keyboard !== "Text") lines.push("    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType." + state.keyboard + "),");
      lines.push("    singleLine = true,", "    modifier = Modifier.fillMaxWidth()", ")");
      ui.code.set(lines.join("\n"));
      ui.hint.textContent = v.cond
        ? "isError se recalcula en cada recomposición a partir de texto: no hace falta un estado aparte para el error. Con isError = true, el borde, la etiqueta y supportingText pasan al color error."
        : "Sin validación el campo nunca se marca como erróneo. Elige una validación para ver cómo isError cambia los colores.";
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // ------------------------------------- playground de controles de selección

  var STEPS = [0, 1, 3, 4, 9];

  function fmt(n) {
    var r = Math.round(n * 100) / 100;
    return String(r).replace(".", ",");
  }

  function selectionPlayground(root) {
    var state = {
      comp: "Switch", mode: siteMode(), enabled: true,
      switchOn: true, thumbIcon: false,
      checked: false, rowToggle: true,
      radio: "Normal",
      min: 1, max: 5, steps: 3, value: 3
    };
    var ui = shell(root, "Playground: Switch, Checkbox, RadioButton y Slider", "Pulsa los controles del móvil");

    function sliderValues() {
      if (state.steps === 0) return null;
      var n = state.steps + 2, out = [];
      for (var i = 0; i < n; i++) out.push(state.min + (state.max - state.min) * i / (n - 1));
      return out;
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(segmented("Componente", opts(["Switch", "Checkbox", "RadioButton", "Slider"]), state.comp, function (v) {
        state.comp = v; render();
      }));
      if (state.comp === "Switch") {
        ui.controls.appendChild(yesNo("thumbContent (icono en el pulgar)", state.thumbIcon, function (v) { state.thumbIcon = v; render(); }));
      }
      if (state.comp === "Checkbox") {
        ui.controls.appendChild(yesNo("Fila entera pulsable (toggleable)", state.rowToggle, function (v) { state.rowToggle = v; render(); }));
      }
      if (state.comp === "Slider") {
        ui.controls.appendChild(select("valueRange: inicio", opts(["0", "1"]), String(state.min), function (v) {
          state.min = Number(v); state.value = Math.max(state.min, Math.min(state.max, state.value)); render();
        }));
        ui.controls.appendChild(select("valueRange: fin", opts(["5", "10", "100"]), String(state.max), function (v) {
          state.max = Number(v); state.value = Math.max(state.min, Math.min(state.max, state.value)); render();
        }));
        ui.controls.appendChild(segmented("steps", opts(STEPS.map(String)), String(state.steps), function (v) {
          state.steps = Number(v); snap(); render();
        }));
      }
      if (state.comp !== "RadioButton") {
        ui.controls.appendChild(yesNo("enabled", state.enabled, function (v) { state.enabled = v; render(); }));
      }
      ui.controls.appendChild(modeControl(state, render));
    }

    function snap() {
      var vals = sliderValues();
      if (!vals) return;
      state.value = vals.reduce(function (best, x) { return Math.abs(x - state.value) < Math.abs(best - state.value) ? x : best; }, vals[0]);
    }

    function switchEl() {
      var b = h("button", {
        type: "button", role: "switch", "aria-checked": state.switchOn ? "true" : "false", "aria-label": "Modo oscuro",
        class: "cpc-switch" + (state.switchOn ? " cpc-on" : "") + (state.thumbIcon ? " cpc-thumb-icon" : ""),
        disabled: !state.enabled
      }, [h("span", { class: "cpc-switch-thumb" }, [state.thumbIcon && state.switchOn ? icon("darkMode", 16) : null])]);
      b.addEventListener("click", function () { state.switchOn = !state.switchOn; renderStage(); renderCode(); });
      return b;
    }

    function checkboxEl(onClick) {
      var b = h("button", {
        type: "button", role: "checkbox", "aria-checked": state.checked ? "true" : "false",
        class: "cpc-check" + (state.checked ? " cpc-on" : ""), disabled: !state.enabled,
        tabindex: onClick ? null : "-1"
      }, [state.checked ? icon("check", 18) : null]);
      if (onClick) b.addEventListener("click", onClick);
      return b;
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var screen = applyScheme(h("div", { class: "cpc-screen cpc-pad" }), state.mode);
      var line = "";
      if (state.comp === "Switch") {
        screen.appendChild(h("div", { class: "cpc-row" }, [h("span", { text: "Modo oscuro" }), switchEl()]));
        line = "activo = " + state.switchOn;
      } else if (state.comp === "Checkbox") {
        var toggle = function () { if (state.enabled) { state.checked = !state.checked; renderStage(); renderCode(); } };
        var row = h("div", { class: "cpc-row cpc-row-start" + (state.rowToggle ? " cpc-row-click" : "") + (state.enabled ? "" : " cpc-disabled") },
          [checkboxEl(state.rowToggle ? null : toggle), h("span", { text: "Acepto las condiciones del servicio" })]);
        if (state.rowToggle) {
          row.setAttribute("role", "checkbox");
          row.setAttribute("aria-checked", state.checked ? "true" : "false");
          row.setAttribute("tabindex", "0");
          row.addEventListener("click", toggle);
          row.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } });
        }
        screen.appendChild(row);
        line = "aceptado = " + state.checked + (state.rowToggle ? "   (pulsa también el texto)" : "   (solo responde la casilla)");
      } else if (state.comp === "RadioButton") {
        var group = h("div", { role: "radiogroup", "aria-label": "Dificultad" });
        ["Fácil", "Normal", "Difícil"].forEach(function (o) {
          var r = h("div", { class: "cpc-row cpc-row-start cpc-row-click", role: "radio", tabindex: "0", "aria-checked": o === state.radio ? "true" : "false" },
            [h("span", { class: "cpc-radio" + (o === state.radio ? " cpc-on" : "") }), h("span", { text: o })]);
          var pick = function () { state.radio = o; renderStage(); renderCode(); };
          r.addEventListener("click", pick);
          r.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); pick(); } });
          group.appendChild(r);
        });
        screen.appendChild(group);
        line = "elegida = " + kstr(state.radio);
      } else {
        screen.appendChild(sliderEl());
        line = "valor = " + fmt(state.value) + "f";
      }
      ui.stage.appendChild(h("div", { class: "cpc-col cpc-wide" }, [screen, stateLine(line)]));
    }

    function sliderEl() {
      var vals = sliderValues();
      var pct = (state.value - state.min) / (state.max - state.min) * 100;
      var range = h("input", {
        type: "range", min: state.min, max: state.max, value: state.value, class: "cpc-slider-input",
        step: vals ? (state.max - state.min) / (state.steps + 1) : "any", disabled: !state.enabled, "aria-label": "Dificultad"
      });
      var label = h("div", { class: "cpc-slider-label", text: "Dificultad: " + fmt(state.steps ? state.value : Math.round(state.value * 10) / 10) });
      var track = h("div", { class: "cpc-slider" + (state.enabled ? "" : " cpc-disabled") }, [
        h("span", { class: "cpc-slider-inactive" }),
        h("span", { class: "cpc-slider-active", style: { width: "calc(" + pct + "% - 6px)" } }),
        h("span", { class: "cpc-slider-inactive-part", style: { left: "calc(" + pct + "% + 6px)" } }),
        h("span", { class: "cpc-slider-handle", style: { left: pct + "%" } })
      ]);
      if (vals) {
        vals.slice(1, -1).forEach(function (x) {
          var p = (x - state.min) / (state.max - state.min) * 100;
          track.appendChild(h("span", { class: "cpc-slider-tick" + (x <= state.value ? " cpc-on" : ""), style: { left: p + "%" } }));
        });
      }
      track.appendChild(range);
      range.addEventListener("input", function () {
        state.value = Number(range.value);
        var p = (state.value - state.min) / (state.max - state.min) * 100;
        track.querySelector(".cpc-slider-active").style.width = "calc(" + p + "% - 6px)";
        track.querySelector(".cpc-slider-inactive-part").style.left = "calc(" + p + "% + 6px)";
        track.querySelector(".cpc-slider-handle").style.left = p + "%";
        Array.prototype.forEach.call(track.querySelectorAll(".cpc-slider-tick"), function (t, i) {
          t.classList.toggle("cpc-on", vals[i + 1] <= state.value);
        });
        label.textContent = "Dificultad: " + fmt(state.steps ? state.value : Math.round(state.value * 10) / 10);
        ui.stage.querySelector(".cpc-state code").textContent = "valor = " + fmt(state.value) + "f";
      });
      return h("div", null, [label, track]);
    }

    function renderCode() {
      var lines, hint;
      var dis = state.enabled ? null : "    enabled = false";
      if (state.comp === "Switch") {
        lines = ["var activo by rememberSaveable { mutableStateOf(" + state.switchOn + ") }", "",
          "Row(", "    modifier = Modifier.fillMaxWidth(),", "    horizontalArrangement = Arrangement.SpaceBetween,",
          "    verticalAlignment = Alignment.CenterVertically", ") {", "    Text(\"Modo oscuro\")", "    Switch(",
          "        checked = activo,", "        onCheckedChange = { activo = it }" + (state.thumbIcon || dis ? "," : "")];
        if (state.thumbIcon) {
          lines.push("        thumbContent = if (activo) {", "            {",
            "                Icon(", "                    painterResource(R.drawable.ic_dark_mode),",
            "                    contentDescription = null,", "                    modifier = Modifier.size(SwitchDefaults.IconSize)",
            "                )", "            }", "        } else null" + (dis ? "," : ""));
        }
        if (dis) lines.push("    " + dis);
        lines.push("    )", "}");
        hint = "Switch activa o desactiva algo al instante (Wi-Fi, notificaciones…). Para aceptar algo que se confirma después, usa Checkbox.";
      } else if (state.comp === "Checkbox") {
        lines = ["var aceptado by rememberSaveable { mutableStateOf(" + state.checked + ") }", ""];
        if (state.rowToggle) {
          lines.push("Row(", "    modifier = Modifier.toggleable(", "        value = aceptado,",
            "        onValueChange = { aceptado = it },", "        role = Role.Checkbox" + (dis ? "," : ""));
          if (dis) lines.push("        enabled = false");
          lines.push("    ),", "    verticalAlignment = Alignment.CenterVertically", ") {",
            "    // onCheckedChange = null: el clic lo gestiona la fila entera",
            "    Checkbox(checked = aceptado, onCheckedChange = null" + (dis ? ", enabled = false" : "") + ")",
            "    Text(\"Acepto las condiciones del servicio\")", "}");
          hint = "Con Modifier.toggleable la fila entera es la zona pulsable: más cómodo en el móvil y más accesible, porque el lector de pantalla lee casilla y texto juntos.";
        } else {
          lines.push("Row(verticalAlignment = Alignment.CenterVertically) {",
            "    Checkbox(", "        checked = aceptado,", "        onCheckedChange = { aceptado = it }" + (dis ? "," : ""));
          if (dis) lines.push("    " + dis);
          lines.push("    )", "    Text(\"Acepto las condiciones del servicio\")", "}");
          hint = "Así solo responde la casilla (48 dp): pulsar el texto no hace nada. Prueba «Fila entera pulsable» para ver la alternativa recomendada.";
        }
      } else if (state.comp === "RadioButton") {
        lines = ["val opciones = listOf(\"Fácil\", \"Normal\", \"Difícil\")",
          "var elegida by rememberSaveable { mutableStateOf(" + kstr(state.radio) + ") }", "",
          "Column(Modifier.selectableGroup()) {", "    opciones.forEach { opcion ->", "        Row(",
          "            modifier = Modifier", "                .fillMaxWidth()", "                .selectable(",
          "                    selected = opcion == elegida,", "                    onClick = { elegida = opcion },",
          "                    role = Role.RadioButton", "                ),",
          "            verticalAlignment = Alignment.CenterVertically", "        ) {",
          "            RadioButton(selected = opcion == elegida, onClick = null)", "            Text(opcion)", "        }", "    }", "}"];
        hint = "RadioButton elige una sola opción de un grupo pequeño y siempre visible. Si hay muchas opciones, usa un ExposedDropdownMenuBox.";
      } else {
        var vals = sliderValues();
        lines = ["var valor by rememberSaveable { mutableFloatStateOf(" + fmt(state.value).replace(",", ".") + "f) }", "",
          "Text(\"Dificultad: ${" + (state.steps ? "valor.roundToInt()" : "\"%.1f\".format(valor)") + "}\")",
          "Slider(", "    value = valor,", "    onValueChange = { valor = it },",
          "    valueRange = " + state.min + "f.." + state.max + "f" + (state.steps || dis ? "," : "")];
        if (state.steps) lines.push("    steps = " + state.steps + (dis ? "," : ""));
        if (dis) lines.push(dis);
        lines.push(")");
        hint = state.steps
          ? "steps = " + state.steps + " son los puntos intermedios: el deslizador admite " + (state.steps + 2) + " valores (" +
            vals.map(fmt).join(", ") + ")."
          : "Con steps = 0 el valor es continuo: cualquier Float entre " + state.min + " y " + state.max + ".";
        if (state.steps && (state.max - state.min) / (state.steps + 1) % 1 !== 0) {
          hint += " Ojo: con este rango salen valores decimales; para enteros, steps = fin − inicio − 1.";
        }
      }
      ui.code.set(lines.join("\n"));
      ui.hint.textContent = hint;
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // ---------------------------------------------- playground de menús y diálogos

  var DIFICULTADES = ["Fácil (6 intentos)", "Normal (5 intentos)", "Difícil (4 intentos)"];
  var OVERLAYS = {
    DropdownMenu: "expandido",
    ExposedDropdownMenuBox: "expandido",
    AlertDialog: "mostrarDialogo",
    ModalBottomSheet: "mostrarHoja"
  };

  function overlaysPlayground(root) {
    var state = {
      comp: "DropdownMenu", open: false, mode: siteMode(), event: "",
      icons: true, divider: true, disabledItem: true,
      selected: DIFICULTADES[1], dialogIcon: true
    };
    var ui = shell(root, "Playground: menús, diálogos y hojas inferiores", "Ábrelos y ciérralos: un estado decide si se ven", "cpc-stage-phone");

    function setOpen(v, ev) {
      state.open = v;
      state.event = ev || "";
      renderStage();
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(select("Componente", opts(Object.keys(OVERLAYS)), state.comp, function (v) {
        state.comp = v; state.open = false; state.event = ""; render();
      }));
      if (state.comp === "DropdownMenu") {
        ui.controls.appendChild(yesNo("leadingIcon en los elementos", state.icons, function (v) { state.icons = v; render(); }));
        ui.controls.appendChild(yesNo("Elemento con enabled = false", state.disabledItem, function (v) { state.disabledItem = v; render(); }));
        ui.controls.appendChild(yesNo("HorizontalDivider", state.divider, function (v) { state.divider = v; render(); }));
      }
      if (state.comp === "AlertDialog") {
        ui.controls.appendChild(yesNo("icon", state.dialogIcon, function (v) { state.dialogIcon = v; render(); }));
      }
      ui.controls.appendChild(modeControl(state, render));
    }

    function menuItem(text, iconName, opt) {
      opt = opt || {};
      var b = h("button", {
        type: "button", role: "menuitem",
        class: "cpc-menu-item" + (opt.error ? " cpc-menu-error" : ""), disabled: !!opt.disabled
      }, [state.icons && iconName ? icon(iconName) : null, h("span", { text: text })]);
      b.addEventListener("click", function (e) { e.stopPropagation(); opt.onClick(); });
      return b;
    }

    function screenBase(title, actions) {
      return h("div", { class: "cpc-phone-bar" }, [h("span", { text: title }), actions || null]);
    }

    function cards(n) {
      var out = [];
      for (var i = 0; i < n; i++) out.push(h("div", { class: "cpc-card" }));
      return out;
    }

    function scrim(onDismiss) {
      var s = h("div", { class: "cpc-scrim" });
      s.addEventListener("click", onDismiss);
      return s;
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.mode);
      var varName = OVERLAYS[state.comp];
      var dismiss = function () { setOpen(false, "onDismissRequest → " + varName + " = false"); };

      if (state.comp === "DropdownMenu") {
        var more = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Más opciones", "aria-expanded": String(state.open) }, [icon("moreVert")]);
        more.addEventListener("click", function () { setOpen(!state.open, "IconButton.onClick → expandido = " + !state.open); });
        phone.appendChild(screenBase("Captura 1", more));
        phone.appendChild(h("div", { class: "cpc-phone-body" }, [h("div", { class: "cpc-photo" }, [icon("favorite", 48)])]));
        if (state.open) {
          var catcher = h("div", { class: "cpc-catcher" });
          catcher.addEventListener("click", dismiss);
          phone.appendChild(catcher);
          var items = [menuItem("Compartir", "share", { onClick: function () { setOpen(false, "onClick: Compartir → expandido = false"); } })];
          if (state.disabledItem) items.push(menuItem("Descargar (No disponible)", "download", { disabled: true, onClick: function () {} }));
          if (state.divider) items.push(h("hr", { class: "cpc-divider" }));
          items.push(menuItem("Eliminar", "delete", { error: true, onClick: function () { setOpen(false, "onClick: Eliminar → expandido = false"); } }));
          phone.appendChild(h("div", { class: "cpc-menu cpc-menu-top", role: "menu" }, items));
        }
      } else if (state.comp === "ExposedDropdownMenuBox") {
        phone.appendChild(screenBase("Nueva partida"));
        var field = h("button", { type: "button", class: "cpc-tf cpc-filled cpc-exposed" + (state.open ? " cpc-focused" : ""), "aria-expanded": String(state.open) }, [
          h("div", { class: "cpc-tf-inner" }, [h("span", { class: "cpc-tf-label", text: "Nivel de dificultad" }), h("span", { class: "cpc-tf-value", text: state.selected })]),
          h("span", { class: "cpc-tf-trail" + (state.open ? " cpc-rotated" : "") }, [icon("arrowDropDown")])
        ]);
        field.addEventListener("click", function () { setOpen(!state.open, "onExpandedChange(" + !state.open + ") → expandido = " + !state.open); });
        var body = h("div", { class: "cpc-phone-body cpc-anchor" }, [field]);
        if (state.open) {
          var catcher2 = h("div", { class: "cpc-catcher" });
          catcher2.addEventListener("click", dismiss);
          phone.appendChild(catcher2);
          body.appendChild(h("div", { class: "cpc-menu cpc-menu-exposed", role: "listbox" }, DIFICULTADES.map(function (d) {
            return menuItem(d, null, { onClick: function () { state.selected = d; setOpen(false, "onClick → dificultad = " + kstr(d) + ", expandido = false"); } });
          })));
        }
        phone.appendChild(body);
      } else if (state.comp === "AlertDialog") {
        var open = h("button", { type: "button", class: "cpc-btn cpc-btn-outlined" }, [h("span", { text: "Reiniciar partidas" })]);
        open.addEventListener("click", function () { setOpen(true, "onClick → mostrarDialogo = true"); });
        phone.appendChild(screenBase("Mis partidas"));
        phone.appendChild(h("div", { class: "cpc-phone-body" }, cards(3).concat([h("div", { class: "cpc-center-row" }, [open])])));
        if (state.open) {
          phone.appendChild(scrim(dismiss));
          var cancel = h("button", { type: "button", class: "cpc-btn cpc-btn-text" }, [h("span", { text: "Cancelar" })]);
          cancel.addEventListener("click", function () { setOpen(false, "dismissButton → mostrarDialogo = false"); });
          var ok = h("button", { type: "button", class: "cpc-btn cpc-btn-text" }, [h("span", { text: "Reiniciar" })]);
          ok.addEventListener("click", function () { setOpen(false, "confirmButton → reiniciar(); mostrarDialogo = false"); });
          phone.appendChild(h("div", { class: "cpc-dialog", role: "alertdialog", "aria-label": "¿Reiniciar las partidas?" }, [
            state.dialogIcon ? h("div", { class: "cpc-dialog-icon" }, [icon("warning")]) : null,
            h("p", { class: "cpc-dialog-title" + (state.dialogIcon ? " cpc-centered" : ""), text: "¿Reiniciar las partidas?" }),
            h("p", { class: "cpc-dialog-text", text: "Se borrarán todas las partidas guardadas. Esta acción no se puede deshacer." }),
            h("div", { class: "cpc-dialog-actions" }, [cancel, ok])
          ]));
        }
      } else {
        var fab = h("button", { type: "button", class: "cpc-fab", "aria-label": "Añadir juego" }, [icon("add")]);
        fab.addEventListener("click", function () { setOpen(true, "FAB.onClick → mostrarHoja = true"); });
        phone.appendChild(screenBase("Biblioteca"));
        phone.appendChild(h("div", { class: "cpc-phone-body" }, cards(4)));
        phone.appendChild(fab);
        if (state.open) {
          phone.appendChild(scrim(dismiss));
          var cancelS = h("button", { type: "button", class: "cpc-btn cpc-btn-text" }, [h("span", { text: "Cancelar" })]);
          cancelS.addEventListener("click", function () { setOpen(false, "Cancelar → mostrarHoja = false"); });
          var add = h("button", { type: "button", class: "cpc-btn cpc-btn-filled" }, [h("span", { text: "Añadir juego" })]);
          add.addEventListener("click", function () { setOpen(false, "Añadir → guardar(); mostrarHoja = false"); });
          var sheet = h("div", { class: "cpc-sheet", role: "dialog", "aria-label": "Nuevo juego" }, [
            h("span", { class: "cpc-sheet-handle" }),
            h("p", { class: "cpc-sheet-title", text: "Nuevo juego" }),
            h("div", { class: "cpc-tf cpc-filled" }, [h("div", { class: "cpc-tf-inner" }, [
              h("span", { class: "cpc-tf-label", text: "Título" }), h("span", { class: "cpc-tf-value", text: "Hollow Knight" })])]),
            h("div", { class: "cpc-dialog-actions" }, [cancelS, add])
          ]);
          phone.appendChild(sheet);
          requestAnimationFrame(function () { sheet.classList.add("cpc-shown"); });
        }
      }

      ui.stage.appendChild(h("div", { class: "cpc-col" }, [
        phone,
        stateLine(varName + " = " + state.open + (state.event ? "   ← " + state.event : ""))
      ]));
    }

    function renderCode() {
      var lines, hint;
      if (state.comp === "DropdownMenu") {
        lines = ["var expandido by remember { mutableStateOf(false) }", "", "Box {",
          "    IconButton(onClick = { expandido = true }) {",
          "        Icon(painterResource(R.drawable.ic_more_vert), contentDescription = \"Más opciones\")", "    }",
          "    DropdownMenu(", "        expanded = expandido,", "        onDismissRequest = { expandido = false }", "    ) {"];
        var item = function (txt, ic, extra) {
          lines.push("        DropdownMenuItem(", "            text = { Text(" + kstr(txt) + ") },");
          if (state.icons) lines.push("            leadingIcon = { Icon(painterResource(R.drawable." + ic + "), contentDescription = null) },");
          (extra || []).forEach(function (l) { lines.push("            " + l); });
          lines.push("            onClick = { expandido = false /* acción */ }", "        )");
        };
        item("Compartir", "ic_share");
        if (state.disabledItem) item("Descargar (No disponible)", "ic_download", ["enabled = false,"]);
        if (state.divider) lines.push("        HorizontalDivider()");
        item("Eliminar", "ic_delete");
        lines.push("    }", "}");
        hint = "El Box agrupa el botón y el menú para que DropdownMenu se coloque junto al botón. Pulsa fuera del menú: se llama a onDismissRequest y somos nosotros quienes ponemos expandido = false.";
      } else if (state.comp === "ExposedDropdownMenuBox") {
        lines = ["val opciones = listOf(" + DIFICULTADES.map(kstr).join(", ") + ")",
          "var dificultad by rememberSaveable { mutableStateOf(opciones[1]) }",
          "var expandido by remember { mutableStateOf(false) }", "",
          "ExposedDropdownMenuBox(", "    expanded = expandido,", "    onExpandedChange = { expandido = it }", ") {",
          "    OutlinedTextField(", "        value = dificultad,", "        onValueChange = {},", "        readOnly = true,",
          "        label = { Text(\"Nivel de dificultad\") },",
          "        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandido) },",
          "        modifier = Modifier", "            .menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable)",
          "            .fillMaxWidth()", "    )",
          "    ExposedDropdownMenu(", "        expanded = expandido,", "        onDismissRequest = { expandido = false }", "    ) {",
          "        opciones.forEach { opcion ->", "            DropdownMenuItem(", "                text = { Text(opcion) },",
          "                onClick = {", "                    dificultad = opcion", "                    expandido = false",
          "                }", "            )", "        }", "    }", "}"];
        hint = "readOnly = true evita el teclado y menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable) une el campo con el menú. Necesita @OptIn(ExperimentalMaterial3Api::class).";
      } else if (state.comp === "AlertDialog") {
        lines = ["var mostrarDialogo by rememberSaveable { mutableStateOf(false) }", "",
          "if (mostrarDialogo) {", "    AlertDialog(", "        onDismissRequest = { mostrarDialogo = false },"];
        if (state.dialogIcon) lines.push("        icon = { Icon(painterResource(R.drawable.ic_warning), contentDescription = null) },");
        lines.push("        title = { Text(\"¿Reiniciar las partidas?\") },",
          "        text = { Text(\"Se borrarán todas las partidas guardadas. Esta acción no se puede deshacer.\") },",
          "        confirmButton = {", "            TextButton(onClick = {", "                reiniciar()",
          "                mostrarDialogo = false", "            }) { Text(\"Reiniciar\") }", "        },",
          "        dismissButton = {", "            TextButton(onClick = { mostrarDialogo = false }) { Text(\"Cancelar\") }",
          "        }", "    )", "}");
        hint = "El diálogo existe mientras mostrarDialogo sea true. Material 3 usa TextButton para las dos acciones; pulsar fuera o el botón Atrás llama a onDismissRequest.";
      } else {
        lines = ["var mostrarHoja by rememberSaveable { mutableStateOf(false) }", "",
          "// En el Scaffold: floatingActionButton = { FloatingActionButton(onClick = { mostrarHoja = true }) { … } }", "",
          "if (mostrarHoja) {", "    ModalBottomSheet(", "        onDismissRequest = { mostrarHoja = false },",
          "        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)", "    ) {",
          "        Column(Modifier.padding(horizontal = 24.dp).padding(bottom = 32.dp)) {",
          "            Text(\"Nuevo juego\", style = MaterialTheme.typography.titleLarge)",
          "            // … OutlinedTextField y botones Cancelar / Añadir juego", "        }", "    }", "}"];
        hint = "skipPartiallyExpanded = true abre la hoja completa (cómodo para formularios). Al pulsar fuera o arrastrarla hacia abajo se llama a onDismissRequest. Necesita @OptIn(ExperimentalMaterial3Api::class).";
      }
      ui.code.set(lines.join("\n"));
      ui.hint.textContent = hint;
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // ---------------------------------------------------- playground del Drawer

  var DRAWER_ITEMS = [
    { label: "Inicio", icon: "home", res: "ic_home" },
    { label: "Favoritos", icon: "favorite", res: "ic_favorite" },
    { label: "Ajustes", icon: "settings", res: "ic_settings" }
  ];

  function drawerPlayground(root) {
    var state = {
      open: false, current: "Inicio", event: "", mode: siteMode(),
      header: true, badge: true, closeOnClick: true, gestures: true
    };
    var ui = shell(root, "Playground: ModalNavigationDrawer", "Ábrelo con la hamburguesa o deslizando desde el borde izquierdo", "cpc-stage-phone");

    function setOpen(v, ev) {
      state.open = v;
      state.event = ev || "";
      renderStage();
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(yesNo("Cabecera con título y HorizontalDivider", state.header, function (v) { state.header = v; render(); }));
      ui.controls.appendChild(yesNo("badge en «Favoritos»", state.badge, function (v) { state.badge = v; render(); }));
      ui.controls.appendChild(yesNo("Cerrar el menú al elegir (drawerState.close())", state.closeOnClick, function (v) { state.closeOnClick = v; render(); }));
      ui.controls.appendChild(yesNo("gesturesEnabled (abrir y cerrar deslizando)", state.gestures, function (v) { state.gestures = v; render(); }));
      ui.controls.appendChild(modeControl(state, render));
    }

    // Deslizar: desde el borde izquierdo abre; hacia la izquierda sobre el panel cierra.
    function addSwipe(phone) {
      var startX = null, fromEdge = false;
      phone.addEventListener("pointerdown", function (e) {
        var r = phone.getBoundingClientRect();
        startX = e.clientX;
        fromEdge = e.clientX - r.left < 24;
      });
      phone.addEventListener("pointerup", function (e) {
        if (startX === null) return;
        var dx = e.clientX - startX;
        startX = null;
        if (!state.gestures) return;
        if (!state.open && fromEdge && dx > 40) setOpen(true, "gesto desde el borde → drawerState = Open");
        else if (state.open && dx < -40) setOpen(false, "gesto hacia la izquierda → drawerState = Closed");
      });
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.mode);
      var menu = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Abrir menú hamburguesa", "aria-expanded": String(state.open) }, [icon("menu")]);
      menu.addEventListener("click", function () { setOpen(true, "IconButton → scope.launch { drawerState.open() }"); });
      phone.appendChild(h("div", { class: "cpc-phone-bar cpc-bar-nav" }, [menu, h("span", { text: state.current })]));
      phone.appendChild(h("div", { class: "cpc-phone-content", text: "Contenido de la pantalla: " + state.current }));
      phone.appendChild(h("span", { class: "cpc-edge", "aria-hidden": "true" }));

      if (state.open) {
        phone.appendChild(scrimEl());
        var items = DRAWER_ITEMS.map(function (it) {
          var sel = it.label === state.current;
          var b = h("button", { type: "button", class: "cpc-drawer-item" + (sel ? " cpc-on" : ""), "aria-current": sel ? "page" : null }, [
            icon(it.icon), h("span", { class: "cpc-drawer-label", text: it.label }),
            state.badge && it.label === "Favoritos" ? h("span", { class: "cpc-drawer-badge", text: "3" }) : null
          ]);
          b.addEventListener("click", function () {
            state.current = it.label;
            if (state.closeOnClick) setOpen(false, "onClick: " + it.label + " → drawerState.close()");
            else setOpen(true, "onClick: " + it.label + " (sin close(): el menú sigue abierto)");
          });
          return b;
        });
        var sheet = h("nav", { class: "cpc-drawer", "aria-label": "Menú lateral" }, [
          state.header ? h("p", { class: "cpc-drawer-title", text: "Mi Aplicación" }) : null,
          state.header ? h("hr", { class: "cpc-divider" }) : null
        ].concat(items));
        phone.appendChild(sheet);
        requestAnimationFrame(function () { sheet.classList.add("cpc-shown"); });
      }
      addSwipe(phone);

      ui.stage.appendChild(h("div", { class: "cpc-col" }, [
        phone,
        stateLine("drawerState = " + (state.open ? "Open" : "Closed") + "   opcionActual = " + kstr(state.current) +
          (state.event ? "\n← " + state.event : ""))
      ]));
    }

    function scrimEl() {
      var s = h("div", { class: "cpc-scrim" });
      s.addEventListener("click", function () { setOpen(false, "pulsar fuera → drawerState = Closed"); });
      return s;
    }

    function renderCode() {
      var lines = ["val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)",
        "val scope = rememberCoroutineScope()", "var opcionActual by rememberSaveable { mutableStateOf(\"Inicio\") }", "",
        "ModalNavigationDrawer(", "    drawerState = drawerState,"];
      if (!state.gestures) lines.push("    gesturesEnabled = false,");
      lines.push("    drawerContent = {", "        ModalDrawerSheet {");
      if (state.header) {
        lines.push("            Text(\"Mi Aplicación\", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(16.dp))",
          "            HorizontalDivider()");
      }
      lines.push("            listOf(" + DRAWER_ITEMS.map(function (i) { return kstr(i.label) + " to R.drawable." + i.res; }).join(", ") + ")");
      lines.push("                .forEach { (texto, icono) ->", "                    NavigationDrawerItem(",
        "                        icon = { Icon(painterResource(icono), contentDescription = null) },",
        "                        label = { Text(texto) },");
      if (state.badge) lines.push("                        badge = { if (texto == \"Favoritos\") Text(\"3\") },");
      lines.push("                        selected = texto == opcionActual,", "                        onClick = {",
        "                            opcionActual = texto");
      if (state.closeOnClick) lines.push("                            scope.launch { drawerState.close() }");
      lines.push("                        },", "                        modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)",
        "                    )", "                }", "        }", "    }", ") {", "    Scaffold(", "        topBar = {", "            TopAppBar(",
        "                title = { Text(opcionActual) },", "                navigationIcon = {",
        "                    IconButton(onClick = { scope.launch { drawerState.open() } }) {",
        "                        Icon(painterResource(R.drawable.ic_menu), contentDescription = \"Abrir menú hamburguesa\")",
        "                    }", "                }", "            )", "        }", "    ) { innerPadding ->",
        "        Text(\"Contenido de la pantalla: $opcionActual\", Modifier.padding(innerPadding))", "    }", "}");
      ui.code.set(lines.join("\n"));
      ui.hint.textContent = !state.closeOnClick
        ? "Sin drawerState.close() la opción cambia, pero el menú se queda abierto tapando la pantalla: el usuario tiene que cerrarlo a mano."
        : !state.gestures
          ? "Con gesturesEnabled = false el menú solo se abre con la hamburguesa. Útil si el contenido también se desliza en horizontal (un mapa, un carrusel)."
          : "open() y close() son funciones suspend, porque animan el panel: por eso se llaman dentro de scope.launch { … }. El Drawer envuelve al Scaffold, no al revés.";
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // ------------------------------------------------- playground de TopAppBar

  // Altura expandida de cada variante (dp ≈ px); todas se contraen a 64.
  var APPBARS = {
    TopAppBar: { h: 64, big: false, center: false },
    CenterAlignedTopAppBar: { h: 64, big: false, center: true },
    MediumTopAppBar: { h: 112, big: true, center: false },
    LargeTopAppBar: { h: 152, big: true, center: false }
  };
  var SCROLL_BEHAVIORS = {
    none: { label: "Sin scrollBehavior" },
    pinned: { label: "pinned", code: "pinnedScrollBehavior()" },
    enterAlways: { label: "enterAlways", code: "enterAlwaysScrollBehavior()" },
    exitUntilCollapsed: { label: "exitUntilCollapsed", code: "exitUntilCollapsedScrollBehavior()" }
  };

  function topAppBarPlayground(root) {
    var state = {
      variant: "TopAppBar", title: "Biblioteca", nav: "menu", actions: 2,
      colors: "default", behavior: "pinned", mode: siteMode()
    };
    var ui = shell(root, "Playground: TopAppBar", "Elige la variante y haz scroll en la lista del móvil", "cpc-stage-phone");

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(select("Variante", opts(Object.keys(APPBARS)), state.variant, function (v) {
        state.variant = v;
        if (!APPBARS[v].big && state.behavior === "exitUntilCollapsed") state.behavior = "pinned";
        if (APPBARS[v].big && state.behavior === "pinned") state.behavior = "exitUntilCollapsed";
        render();
      }));
      ui.controls.appendChild(textField("title", state.title, function (v) { state.title = v; renderStage(); renderCode(); }));
      ui.controls.appendChild(segmented("navigationIcon", [
        { value: "none", label: "Ninguno" }, { value: "menu", label: "Menú" }, { value: "back", label: "Atrás" }
      ], state.nav, function (v) { state.nav = v; render(); }));
      ui.controls.appendChild(segmented("actions (iconos a la derecha)", opts(["0", "1", "2"]), String(state.actions), function (v) {
        state.actions = Number(v); render();
      }));
      ui.controls.appendChild(segmented("colors", [
        { value: "default", label: "Por defecto" }, { value: "primary", label: "primaryContainer" }
      ], state.colors, function (v) { state.colors = v; render(); }));
      ui.controls.appendChild(select("scrollBehavior", Object.keys(SCROLL_BEHAVIORS).map(function (k) {
        return { value: k, label: SCROLL_BEHAVIORS[k].label };
      }), state.behavior, function (v) { state.behavior = v; render(); }));
      ui.controls.appendChild(modeControl(state, render));
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var cfg = APPBARS[state.variant];
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.mode);
      var primary = state.colors === "primary";

      var actions = h("span", { class: "cpc-appbar-actions" });
      if (state.actions >= 1) actions.appendChild(h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Buscar" }, [icon("search")]));
      if (state.actions >= 2) actions.appendChild(h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Más opciones" }, [icon("moreVert")]));
      var smallTitle = h("span", { class: "cpc-appbar-title" + (cfg.center ? " cpc-centered" : ""), text: state.title });
      var row = h("div", { class: "cpc-appbar-row" }, [
        state.nav !== "none"
          ? h("button", { type: "button", class: "cpc-icon-btn", "aria-label": state.nav === "menu" ? "Abrir menú lateral" : "Atrás" },
            [icon(state.nav === "menu" ? "menu" : "arrowBack")])
          : h("span", { class: "cpc-appbar-gap" }),
        smallTitle, actions
      ]);
      var bigTitle = cfg.big ? h("div", { class: "cpc-appbar-big" + (state.variant === "LargeTopAppBar" ? " cpc-large" : ""), text: state.title }) : null;
      var bar = h("div", { class: "cpc-appbar" + (primary ? " cpc-appbar-primary" : ""), style: { height: cfg.h + "px" } }, [row, bigTitle]);
      if (cfg.big) smallTitle.style.opacity = "0";

      var list = h("div", { class: "cpc-scroll" }, [h("div", { style: { height: cfg.h + "px" } })]);
      ["Hollow Knight", "Celeste", "Hades", "Stardew Valley", "Ori", "Cuphead", "Dead Cells", "Outer Wilds", "Tunic", "Inside"].forEach(function (t) {
        list.appendChild(h("div", { class: "cpc-list-row" }, [h("span", { class: "cpc-avatar", text: t.charAt(0) }), h("span", { text: t })]));
      });
      phone.appendChild(list);
      phone.appendChild(bar);

      var stateEl = stateLine("");
      var offset = 0, lastY = 0;
      function update() {
        var y = list.scrollTop, dy = y - lastY;
        lastY = y;
        var height = cfg.h, frac = 0, scrolled = y > 0;
        if (state.behavior === "exitUntilCollapsed" && cfg.big) {
          height = Math.max(64, cfg.h - y);
          frac = (cfg.h - height) / (cfg.h - 64);
          scrolled = frac >= 1;
        }
        if (state.behavior === "enterAlways") {
          offset = y <= 0 ? 0 : Math.max(-cfg.h, Math.min(0, offset - dy));
        } else {
          offset = 0;
        }
        bar.style.height = height + "px";
        bar.style.transform = "translateY(" + offset + "px)";
        bar.classList.toggle("cpc-scrolled", state.behavior !== "none" && scrolled && !primary);
        if (cfg.big) {
          // Como en Compose: un título se va en la primera mitad del colapso y el otro llega en la segunda
          bigTitle.style.opacity = String(Math.max(0, 1 - frac * 2));
          smallTitle.style.opacity = String(Math.max(0, frac * 2 - 1));
        }
        var txt = "scroll = " + Math.round(y) + " px";
        if (state.behavior === "exitUntilCollapsed" && cfg.big) txt += "   collapsedFraction = " + frac.toFixed(2);
        if (state.behavior === "enterAlways") txt += "   heightOffset = " + Math.round(offset) + " px";
        if (state.behavior === "none") txt += "   (la barra no reacciona)";
        stateEl.firstChild.textContent = txt;
      }
      list.addEventListener("scroll", update);
      ui.stage.appendChild(h("div", { class: "cpc-col" }, [phone, stateEl]));
      update();
    }

    function renderCode() {
      var cfg = APPBARS[state.variant];
      var b = SCROLL_BEHAVIORS[state.behavior];
      var lines = [];
      if (b.code) lines.push("val scrollBehavior = TopAppBarDefaults." + b.code, "");
      lines.push("Scaffold(");
      if (b.code) lines.push("    modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),");
      lines.push("    topBar = {", "        " + state.variant + "(", "            title = { Text(" + kstr(state.title) + ") },");
      if (state.nav !== "none") {
        var isMenu = state.nav === "menu";
        lines.push("            navigationIcon = {",
          "                IconButton(onClick = " + (isMenu ? "onMenuClick" : "onBack") + ") {",
          "                    Icon(painterResource(R.drawable." + (isMenu ? "ic_menu" : "ic_arrow_back") + "), contentDescription = " +
            kstr(isMenu ? "Abrir menú lateral" : "Atrás") + ")",
          "                }", "            },");
      }
      if (state.actions > 0) {
        lines.push("            actions = {");
        lines.push("                IconButton(onClick = onBuscar) {",
          "                    Icon(painterResource(R.drawable.ic_search), contentDescription = \"Buscar\")", "                }");
        if (state.actions > 1) {
          lines.push("                IconButton(onClick = { menuAbierto = true }) {",
            "                    Icon(painterResource(R.drawable.ic_more_vert), contentDescription = \"Más opciones\")", "                }");
        }
        lines.push("            },");
      }
      if (state.colors === "primary") {
        lines.push("            colors = TopAppBarDefaults.topAppBarColors(",
          "                containerColor = MaterialTheme.colorScheme.primaryContainer,",
          "                titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer",
          "            ),");
      }
      if (b.code) lines.push("            scrollBehavior = scrollBehavior");
      else lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, "");
      lines.push("        )", "    }", ") { innerPadding ->", "    LazyColumn(contentPadding = innerPadding) {",
        "        items(juegos) { juego -> FilaJuego(juego) }", "    }", "}");
      ui.code.set(lines.join("\n"));
      var hints = {
        none: "Sin scrollBehavior la barra no se entera del scroll: ni cambia de color ni se contrae.",
        pinned: "pinned: la barra se queda fija y, en cuanto el contenido pasa por debajo, cambia al color surfaceContainer para separarse de él.",
        enterAlways: "enterAlways: la barra se esconde al bajar y vuelve en cuanto subes un poco. Deja más sitio al contenido.",
        exitUntilCollapsed: cfg.big
          ? "exitUntilCollapsed: el título grande se encoge hasta la altura de una TopAppBar normal y el título pasa a la fila de iconos."
          : "exitUntilCollapsed está pensado para MediumTopAppBar y LargeTopAppBar: una barra pequeña no tiene nada que contraer."
      };
      ui.hint.textContent = hints[state.behavior] + (b.code ? " Recuerda conectar Modifier.nestedScroll al Scaffold y @OptIn(ExperimentalMaterial3Api::class)." : "");
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // -------------------------------------------------- playground de Snackbar

  var SNACK_DURATIONS = { Short: 4000, Long: 10000, Indefinite: 0 };
  var SNACK_GAMES = ["Hollow Knight", "Celeste", "Hades", "Stardew Valley", "Tunic"];

  function snackbarPlayground(root) {
    var state = {
      games: SNACK_GAMES.slice(), action: true, dismiss: false, duration: "Short", mode: siteMode(),
      queue: [], current: null, last: ""
    };
    var timer = null;
    var ui = shell(root, "Playground: Snackbar", "Borra juegos de la lista y deshaz el borrado desde el aviso", "cpc-stage-phone");

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(yesNo("actionLabel = \"Deshacer\"", state.action, function (v) { state.action = v; render(); }));
      ui.controls.appendChild(yesNo("withDismissAction", state.dismiss, function (v) { state.dismiss = v; render(); }));
      ui.controls.appendChild(segmented("duration (SnackbarDuration)", opts(Object.keys(SNACK_DURATIONS)), state.duration, function (v) {
        state.duration = v; render();
      }));
      var reset = h("button", { type: "button", text: "Restaurar la lista" });
      reset.addEventListener("click", function () {
        clearTimeout(timer); state.games = SNACK_GAMES.slice(); state.queue = []; state.current = null; state.last = ""; renderStage();
      });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [reset]));
      ui.controls.appendChild(modeControl(state, render));
    }

    function borrar(i) {
      var game = state.games.splice(i, 1)[0];
      state.queue.push({ game: game, index: i, action: state.action, dismiss: state.dismiss, duration: state.duration });
      state.last = state.current ? "showSnackbar(…) espera en la cola: hay otro aviso en pantalla" : "";
      if (!state.current) next(); else renderStage();
    }

    function next() {
      state.current = state.queue.shift() || null;
      renderStage();
      var ms = state.current && SNACK_DURATIONS[state.current.duration];
      if (ms) timer = setTimeout(function () { finish("Dismissed", "se agotó la duración"); }, ms);
    }

    function finish(result, why) {
      clearTimeout(timer);
      var c = state.current;
      if (!c) return;
      if (result === "ActionPerformed") state.games.splice(Math.min(c.index, state.games.length), 0, c.game);
      state.last = "SnackbarResult." + result + " (" + why + ")" + (result === "ActionPerformed" ? " → juego restaurado" : "");
      state.current = null;
      renderStage();
      if (state.queue.length) setTimeout(next, 250);
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.mode);
      phone.appendChild(h("div", { class: "cpc-phone-bar" }, [h("span", { text: "Biblioteca" })]));
      var list = h("div", { class: "cpc-list" });
      if (!state.games.length) list.appendChild(h("p", { class: "cpc-empty", text: "No quedan juegos" }));
      state.games.forEach(function (t, i) {
        var del = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Eliminar " + t }, [icon("delete")]);
        del.addEventListener("click", function () { borrar(i); });
        list.appendChild(h("div", { class: "cpc-list-row" }, [h("span", { class: "cpc-avatar", text: t.charAt(0) }), h("span", { class: "cpc-grow", text: t }), del]));
      });
      phone.appendChild(list);
      phone.appendChild(h("span", { class: "cpc-fab-static", "aria-hidden": "true" }, [icon("add")]));

      var c = state.current;
      if (c) {
        var parts = [h("span", { class: "cpc-snack-text", text: "«" + c.game + "» eliminado" })];
        if (c.action) {
          var undo = h("button", { type: "button", class: "cpc-snack-action", text: "Deshacer" });
          undo.addEventListener("click", function () { finish("ActionPerformed", "pulsaste Deshacer"); });
          parts.push(undo);
        }
        if (c.dismiss) {
          var x = h("button", { type: "button", class: "cpc-icon-btn cpc-snack-close", "aria-label": "Cerrar aviso" }, [icon("close")]);
          x.addEventListener("click", function () { finish("Dismissed", "pulsaste la X"); });
          parts.push(x);
        }
        var ms = SNACK_DURATIONS[c.duration];
        if (ms) {
          var bar = h("span", { class: "cpc-snack-timer" });
          bar.style.animationDuration = ms + "ms";
          parts.push(bar);
        }
        phone.appendChild(h("div", { class: "cpc-snackbar", role: "status" }, parts));
      }

      var line = "en pantalla: " + (c ? "«" + c.game + "» (" + c.duration + ")" : "ninguno") + "   en cola: " + state.queue.length;
      if (state.last) line += "\n← " + state.last;
      ui.stage.appendChild(h("div", { class: "cpc-col" }, [phone, stateLine(line)]));
    }

    function renderCode() {
      var args = ["            message = \"«${juego.titulo}» eliminado\""];
      if (state.action) args.push("            actionLabel = \"Deshacer\"");
      if (state.dismiss) args.push("            withDismissAction = true");
      args.push("            duration = SnackbarDuration." + state.duration);
      var lines = ["val snackbarHostState = remember { SnackbarHostState() }", "val scope = rememberCoroutineScope()", "",
        "Scaffold(", "    snackbarHost = { SnackbarHost(hostState = snackbarHostState) }", ") { innerPadding ->",
        "    // … en el onClick del icono de borrar de cada juego:", "    val posicion = juegos.indexOf(juego)", "    juegos.remove(juego)",
        "    scope.launch {", "        val resultado = snackbarHostState.showSnackbar("];
      lines.push(args.join(",\n"));
      lines.push("        )");
      if (state.action) {
        lines.push("        if (resultado == SnackbarResult.ActionPerformed) {", "            juegos.add(posicion, juego)", "        }");
      }
      lines.push("    }", "}");
      ui.code.set(lines.join("\n"));
      var hint = "showSnackbar es una función suspend: la corrutina espera hasta que el aviso desaparece y entonces devuelve el resultado. ";
      if (!state.action) hint += "Sin actionLabel no hay botón: el resultado siempre es Dismissed y no se puede deshacer.";
      else if (state.duration === "Indefinite") hint += "Con Indefinite el aviso no se va solo: pon withDismissAction o una acción para que el usuario pueda cerrarlo.";
      else hint += "Borra varios juegos seguidos: SnackbarHostState los pone en cola y los muestra de uno en uno.";
      ui.hint.textContent = hint;
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // --------------------------------------------- playground de listas Lazy

  var LAZY_TITLES = ["Hollow Knight", "Celeste", "Hades", "Stardew Valley", "Tunic", "Cuphead", "Outer Wilds",
    "Dead Cells", "Ori", "Inside", "Gris", "Disco Elysium", "Undertale", "Terraria", "Spiritfarer", "Obra Dinn"];

  function makeGames(n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push({ id: i + 1, title: LAZY_TITLES[i % LAZY_TITLES.length] });
    return out;
  }

  function lazyListPlayground(root) {
    var state = {
      container: "LazyColumn", count: 100, spacing: 8, padding: 16, key: true, mode: siteMode(),
      games: makeGames(100), nextId: 101, favById: {}, favByPos: {}, created: 0, event: ""
    };
    var ui = shell(root, "Playground: LazyColumn, LazyRow y Column con scroll", "Haz scroll, marca favoritos y elimina el primero", "cpc-stage-phone");
    var composed = {};

    function reset() {
      state.games = makeGames(state.count); state.nextId = state.count + 1;
      state.favById = {}; state.favByPos = {}; state.created = 0; state.event = ""; composed = {};
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(segmented("Contenedor", opts(["LazyColumn", "LazyRow", "Column + verticalScroll"]), state.container, function (v) {
        state.container = v; reset(); render();
      }));
      ui.controls.appendChild(segmented("Número de elementos", opts(["20", "100", "1000"]), String(state.count), function (v) {
        state.count = Number(v); reset(); render();
      }));
      ui.controls.appendChild(yesNo("key = { it.id }", state.key, function (v) { state.key = v; state.favById = {}; state.favByPos = {}; render(); }));
      ui.controls.appendChild(segmented("contentPadding", opts(["0", "16"]), String(state.padding), function (v) { state.padding = Number(v); render(); }));
      ui.controls.appendChild(segmented("spacedBy", opts(["0", "8", "16"]), String(state.spacing), function (v) { state.spacing = Number(v); render(); }));
      var del = h("button", { type: "button", text: "Eliminar el primero", disabled: !state.games.length });
      del.addEventListener("click", function () {
        var g = state.games.shift();
        state.event = "eliminado #" + g.id + " " + g.title + ": todos los demás suben una posición";
        renderStage(true); renderCode();
      });
      var add = h("button", { type: "button", text: "Añadir al principio" });
      add.addEventListener("click", function () {
        var id = state.nextId++;
        state.games.unshift({ id: id, title: LAZY_TITLES[id % LAZY_TITLES.length] });
        state.event = "añadido #" + id + " al principio: todos los demás bajan una posición";
        renderStage(true); renderCode();
      });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Cambiar la lista" }), h("div", { class: "cpg-seg" }, [del, add])]));
      ui.controls.appendChild(modeControl(state, render));
    }

    function isFav(g, i) { return state.key ? !!state.favById[g.id] : !!state.favByPos[i]; }
    function toggleFav(g, i) {
      if (state.key) state.favById[g.id] = !state.favById[g.id];
      else state.favByPos[i] = !state.favByPos[i];
    }

    var scrollPos = 0;

    function renderStage(keepScroll) {
      if (!keepScroll) scrollPos = 0;
      ui.stage.innerHTML = "";
      var horizontal = state.container === "LazyRow";
      var lazy = state.container !== "Column + verticalScroll";
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.mode);
      phone.appendChild(h("div", { class: "cpc-phone-bar" }, [h("span", { text: "Catálogo" })]));
      var vp = h("div", { class: "cpc-lazy-viewport" + (horizontal ? " cpc-lazy-h" : "") });
      phone.appendChild(vp);
      var stateEl = stateLine("");
      var ROW = horizontal ? 112 : 56, pad = state.padding, gap = state.spacing, step = ROW + gap;
      var inner = h("div", { class: "cpc-lazy-inner" });
      vp.appendChild(inner);

      function rowEl(g, i, fresh) {
        var fav = isFav(g, i);
        var heart = h("button", { type: "button", class: "cpc-icon-btn cpc-fav" + (fav ? " cpc-on" : ""), "aria-pressed": String(fav), "aria-label": "Favorito " + g.title }, [icon("favorite", 20)]);
        heart.addEventListener("click", function () { toggleFav(g, i); draw(); });
        var el = h("div", { class: "cpc-lazy-item" + (horizontal ? " cpc-lazy-card" : "") + (fresh ? " cpc-fresh" : "") }, [
          h("span", { class: "cpc-avatar", text: g.title.charAt(0) }),
          h("span", { class: "cpc-lazy-title" }, [h("strong", { text: "#" + g.id }), " " + g.title]),
          heart
        ]);
        return el;
      }

      function draw() {
        var n = state.games.length;
        var total = n ? pad * 2 + n * ROW + (n - 1) * gap : 0;
        inner.innerHTML = "";
        var first = 0, last = n - 1;
        if (lazy) {
          var pos = horizontal ? vp.scrollLeft : vp.scrollTop;
          var size = horizontal ? vp.clientWidth : vp.clientHeight;
          first = Math.max(0, Math.floor((pos - pad) / step) - 1);
          last = Math.min(n - 1, Math.floor((pos + size - pad) / step) + 1);
          inner.style[horizontal ? "width" : "height"] = total + "px";
          inner.style[horizontal ? "height" : "width"] = "100%";
        } else {
          inner.style.height = total + "px";
          inner.style.width = "100%";
        }
        var now = {};
        for (var i = first; i <= last && n; i++) {
          var g = state.games[i];
          var fresh = lazy && !composed[g.id];
          if (!composed[g.id]) state.created++;
          now[g.id] = true;
          var el = rowEl(g, i, fresh);
          var offset = pad + i * step;
          if (horizontal) { el.style.left = offset + "px"; el.style.top = pad + "px"; el.style.bottom = pad + "px"; el.style.width = ROW + "px"; }
          else { el.style.top = offset + "px"; el.style.left = pad + "px"; el.style.right = pad + "px"; el.style.height = ROW + "px"; }
          inner.appendChild(el);
        }
        composed = now;
        var count = n ? last - first + 1 : 0;
        stateEl.firstChild.textContent = "compuestos ahora: " + count + " de " + n + "   filas creadas en total: " + state.created +
          (state.event ? "\n← " + state.event : "");
      }

      vp.addEventListener("scroll", function () {
        scrollPos = horizontal ? vp.scrollLeft : vp.scrollTop;
        if (lazy) draw();
      });
      ui.stage.appendChild(h("div", { class: "cpc-col" }, [phone, stateEl]));
      if (!lazy) composed = {};
      draw();
      if (scrollPos) { vp[horizontal ? "scrollLeft" : "scrollTop"] = scrollPos; draw(); }
    }

    function renderCode() {
      var pad = state.padding ? "PaddingValues(" + state.padding + ".dp)" : null;
      var lines;
      var body = ["        var favorito by remember { mutableStateOf(false) }",
        "        FilaJuego(juego, favorito, onFavorito = { favorito = !favorito })"];
      if (state.container === "Column + verticalScroll") {
        lines = ["Column(", "    modifier = Modifier", "        .verticalScroll(rememberScrollState())" + (pad ? "" : ""),];
        if (pad) lines.push("        .padding(" + state.padding + ".dp),"); else lines[lines.length - 1] += ",";
        lines.push("    verticalArrangement = Arrangement.spacedBy(" + state.spacing + ".dp)", ") {", "    // Se ejecuta para TODOS los juegos, se vean o no");
        if (state.key) {
          lines.push("    juegos.forEach { juego ->", "        key(juego.id) {");
          body.forEach(function (l) { lines.push("    " + l); });
          lines.push("        }", "    }", "}");
        } else {
          lines.push("    juegos.forEach { juego ->");
          body.forEach(function (l) { lines.push(l); });
          lines.push("    }", "}");
        }
      } else {
        var row = state.container === "LazyRow";
        lines = [state.container + "("];
        if (pad) lines.push("    contentPadding = " + pad + ",");
        lines.push("    " + (row ? "horizontalArrangement" : "verticalArrangement") + " = Arrangement.spacedBy(" + state.spacing + ".dp)", ") {");
        if (state.key) lines.push("    items(", "        items = juegos,", "        key = { juego -> juego.id }", "    ) { juego ->");
        else lines.push("    items(juegos) { juego ->");
        body.forEach(function (l) { lines.push(l); });
        lines.push("    }", "}");
      }
      ui.code.set(lines.join("\n"));
      var hint;
      if (state.container === "Column + verticalScroll") {
        hint = "Column compone los " + state.count + " elementos de golpe aunque solo se vean unos pocos. Compáralo con LazyColumn: «compuestos ahora» baja a los que caben en pantalla.";
      } else if (!state.key) {
        hint = "Sin key, el estado de cada fila (el favorito guardado con remember) va unido a la POSICIÓN. Marca algún corazón y pulsa «Eliminar el primero»: los corazones se quedan donde estaban y pasan a otros juegos.";
      } else {
        hint = "Con key, el estado va unido al id del juego: al eliminar o añadir elementos, cada corazón sigue a su juego. Las filas que se iluminan son las que se acaban de componer al hacer scroll.";
      }
      ui.hint.textContent = hint + " (En una app real el favorito iría en el modelo; aquí usamos remember para ver qué le pasa al estado de cada fila).";
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // ------------------------------------------------ playground de cuadrículas

  function lazyGridPlayground(root) {
    var state = {
      orientation: "LazyVerticalGrid", cells: "Adaptive", fixed: 3, adaptive: 110, fixedSize: 96,
      size: 360, spacing: 8, headers: false, mode: siteMode()
    };
    var ui = shell(root, "Playground: LazyVerticalGrid y LazyHorizontalGrid", "Cambia el tipo de celdas y el espacio disponible");
    var PAD = 12, COUNT = 24;

    function vertical() { return state.orientation === "LazyVerticalGrid"; }
    function sizeRange() { return vertical() ? [200, 560] : [140, 420]; }

    function layout() {
      var avail = state.size - PAD * 2, gap = state.spacing, n, cell;
      if (state.cells === "Fixed") { n = state.fixed; cell = (avail - gap * (n - 1)) / n; }
      else if (state.cells === "Adaptive") { n = Math.max(1, Math.floor((avail + gap) / (state.adaptive + gap))); cell = (avail - gap * (n - 1)) / n; }
      else { n = Math.max(1, Math.floor((avail + gap) / (state.fixedSize + gap))); cell = state.fixedSize; }
      return { n: n, cell: Math.max(24, cell) };
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(segmented("Contenedor", opts(["LazyVerticalGrid", "LazyHorizontalGrid"]), state.orientation, function (v) {
        state.orientation = v; state.size = v === "LazyVerticalGrid" ? 360 : 260; render();
      }));
      ui.controls.appendChild(segmented(vertical() ? "columns = GridCells…" : "rows = GridCells…", opts(["Fixed", "Adaptive", "FixedSize"]), state.cells, function (v) {
        state.cells = v; render();
      }));
      if (state.cells === "Fixed") {
        ui.controls.appendChild(segmented("Fixed(count)", opts(["2", "3", "4", "5"]), String(state.fixed), function (v) { state.fixed = Number(v); render(); }));
      } else if (state.cells === "Adaptive") {
        ui.controls.appendChild(segmented("Adaptive(minSize) en dp", opts(["80", "110", "140"]), String(state.adaptive), function (v) { state.adaptive = Number(v); render(); }));
      } else {
        ui.controls.appendChild(segmented("FixedSize(size) en dp", opts(["72", "96", "120"]), String(state.fixedSize), function (v) { state.fixedSize = Number(v); render(); }));
      }
      var r = sizeRange(), id = nextId("size");
      var range = h("input", { id: id, type: "range", min: r[0], max: r[1], step: 10, value: state.size });
      var out = h("span", { class: "cpc-range-value", text: state.size + " dp" });
      range.addEventListener("input", function () { state.size = Number(range.value); out.textContent = state.size + " dp"; renderStage(); renderCode(); });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [
        h("label", { for: id, text: vertical() ? "Ancho disponible (gira el móvil o usa una tablet)" : "Alto de la cuadrícula (Modifier.height)" }),
        range, out
      ]));
      ui.controls.appendChild(segmented("spacedBy", opts(["4", "8", "12"]), String(state.spacing), function (v) { state.spacing = Number(v); render(); }));
      ui.controls.appendChild(yesNo("Cabeceras de sección (span = maxLineSpan)", state.headers, function (v) { state.headers = v; render(); }));
      ui.controls.appendChild(modeControl(state, render));
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var L = layout(), v = vertical();
      var screen = applyScheme(h("div", { class: "cpc-grid-frame" }), state.mode);
      var grid = h("div", { class: "cpc-grid" + (v ? "" : " cpc-grid-h") });
      grid.style.gap = state.spacing + "px";
      grid.style.padding = PAD + "px";
      if (v) {
        screen.style.width = state.size + "px";
        screen.style.height = "360px";
        grid.style.gridTemplateColumns = "repeat(" + L.n + ", " + L.cell + "px)";
      } else {
        screen.style.width = "100%";
        screen.style.maxWidth = "520px";
        screen.style.height = state.size + "px";
        grid.style.gridTemplateRows = "repeat(" + L.n + ", " + L.cell + "px)";
        grid.style.gridAutoColumns = L.cell + "px";
      }
      for (var i = 0; i < COUNT; i++) {
        if (state.headers && i % 8 === 0) {
          grid.appendChild(h("div", { class: "cpc-grid-header", text: "Sección " + (i / 8 + 1) }));
        }
        var tone = ["primary", "secondary", "tertiary"][i % 3];
        grid.appendChild(h("div", { class: "cpc-grid-cell cpc-tone-" + tone }, [
          h("span", { text: LAZY_TITLES[i % LAZY_TITLES.length].charAt(0) })
        ]));
      }
      screen.appendChild(grid);
      var desc = (v ? "columnas = " : "filas = ") + L.n + "   tamaño de celda = " + Math.round(L.cell) + " dp" +
        (state.cells === "FixedSize" ? "   (sobran " + Math.round(state.size - PAD * 2 - (L.n * L.cell + (L.n - 1) * state.spacing)) + " dp)" : "");
      ui.stage.appendChild(h("div", { class: "cpc-col cpc-grid-col" }, [screen, stateLine(desc)]));
    }

    function renderCode() {
      var v = vertical();
      var cells = state.cells === "Fixed" ? "GridCells.Fixed(" + state.fixed + ")"
        : state.cells === "Adaptive" ? "GridCells.Adaptive(minSize = " + state.adaptive + ".dp)"
          : "GridCells.FixedSize(size = " + state.fixedSize + ".dp)";
      var lines = [state.orientation + "(", "    " + (v ? "columns" : "rows") + " = " + cells + ","];
      if (!v) lines.push("    modifier = Modifier.height(" + state.size + ".dp), // ¡Obligatorio darle un alto!");
      lines.push("    contentPadding = PaddingValues(" + PAD + ".dp),",
        "    horizontalArrangement = Arrangement.spacedBy(" + state.spacing + ".dp),",
        "    verticalArrangement = Arrangement.spacedBy(" + state.spacing + ".dp)", ") {");
      if (state.headers) {
        lines.push("    secciones.forEach { seccion ->",
          "        item(span = { GridItemSpan(maxLineSpan) }) {",
          "            Text(seccion.titulo, style = MaterialTheme.typography.titleMedium)", "        }",
          "        items(seccion.juegos, key = { it.id }) { juego -> Portada(juego) }", "    }");
      } else {
        lines.push("    items(juegos, key = { it.id }) { juego -> Portada(juego) }");
      }
      lines.push("}");
      ui.code.set(lines.join("\n"));
      var hints = {
        Fixed: "Fixed(" + state.fixed + "): siempre " + state.fixed + (v ? " columnas" : " filas") + ". Si hay más espacio, las celdas crecen. Ideal para tableros como un Memory 4 × 4.",
        Adaptive: "Adaptive(" + state.adaptive + ".dp): caben tantas " + (v ? "columnas" : "filas") + " como sea posible de al menos " + state.adaptive + " dp, y se reparten el espacio sobrante. Mueve el deslizador: así se adapta al girar el móvil o en una tablet.",
        FixedSize: "FixedSize(" + state.fixedSize + ".dp): las celdas miden exactamente " + state.fixedSize + " dp y caben tantas como quepan. El espacio que sobra no se reparte."
      };
      ui.hint.textContent = hints[state.cells] + (v ? "" : " Una cuadrícula horizontal necesita un alto definido: dentro de una LazyColumn, sin Modifier.height, la app se cierra.");
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // --------------------------------------------- playground de Navigation 3

  var NAV_GAMES = {
    1: { t: "Hollow Knight", p: "Switch" },
    2: { t: "Celeste", p: "PC" },
    7: { t: "Zelda: Tears of the Kingdom", p: "Switch" }
  };
  var NAV_ANIMS = {
    slide: {
      label: "Deslizar en horizontal",
      fwd: "slideInHorizontally { it } togetherWith slideOutHorizontally { -it / 3 }",
      back: "slideInHorizontally { -it / 3 } togetherWith slideOutHorizontally { it }"
    },
    fade: { label: "Fundido", fwd: "fadeIn() togetherWith fadeOut()", back: "fadeIn() togetherWith fadeOut()" },
    vertical: {
      label: "Deslizar en vertical",
      fwd: "slideInVertically { it } togetherWith fadeOut()",
      back: "fadeIn() togetherWith slideOutVertically { it }"
    },
    none: { label: "Sin animación", fwd: "EnterTransition.None togetherWith ExitTransition.None", back: "EnterTransition.None togetherWith ExitTransition.None" }
  };
  var NAV_OPS = [
    { id: "detalle", label: "Ir al detalle 7", code: "pila.add(Detalle(juegoId = 7))" },
    { id: "back", label: "Volver atrás", code: "pila.removeLastOrNull()" },
    { id: "ajustes", label: "Ajustes sin duplicar", code: "if (pila.lastOrNull() != Ajustes) pila.add(Ajustes)" },
    { id: "replace", label: "Sustituir la actual por Catalogo", code: "pila[pila.lastIndex] = Catalogo" },
    { id: "root", label: "Volver al inicio", code: "while (pila.size > 1) pila.removeLastOrNull()" },
    { id: "restart", label: "Empezar de cero", code: "pila.clear(); pila.add(Catalogo)" },
    { id: "clear", label: "Solo pila.clear() 💥", code: "pila.clear()" }
  ];

  function navLabel(k) {
    return k.type === "Detalle" ? "Detalle(juegoId = " + k.id + ")" : k.type;
  }

  function navPlayground(root) {
    var state = {
      mode: "pila", anim: "slide", theme: siteMode(), entryAjustes: true, vmDecorator: true,
      stack: [], tabs: null, sel: "Inicio", closed: false, event: "", vmCounter: 0, sharedVm: null, uid: 0
    };
    var ui = shell(root, "Playground: Navigation 3", "Navega por la mini app y observa cómo cambia la pila", "cpc-stage-phone");
    var host, stackPanel, stateEl, barEl;

    function key(type, id) { state.uid += 1; return { type: type, id: id, uid: state.uid, vm: null }; }

    function reset() {
      state.stack = [key("Catalogo")];
      state.tabs = { Inicio: [key("Catalogo")], Perfil: [key("Perfil")] };
      state.sel = "Inicio"; state.closed = false; state.event = ""; state.vmCounter = 0; state.sharedVm = null;
    }

    function current() { return state.mode === "pila" ? state.stack : state.tabs[state.sel]; }

    function vmFor(entry) {
      if (entry.type !== "Detalle") return null;
      if (state.vmDecorator) {
        if (!entry.vm) { state.vmCounter += 1; entry.vm = { n: state.vmCounter, juegoId: entry.id }; }
        return entry.vm;
      }
      if (!state.sharedVm) { state.vmCounter += 1; state.sharedVm = { n: state.vmCounter, juegoId: entry.id }; }
      return state.sharedVm;
    }

    function cleared(removed) {
      var msgs = [];
      removed.forEach(function (e) { if (e.vm && state.vmDecorator) msgs.push("DetalleViewModel #" + e.vm.n + " destruido (onCleared)"); });
      return msgs.length ? " · " + msgs.join(" · ") : "";
    }

    // ---------- operaciones sobre la pila

    function go(dir, event) {
      state.event = event;
      showScreen(dir);
      drawStack();
      drawState();
    }

    function push(k, code) {
      if (state.closed) return;
      current().push(k);
      go("push", code);
    }

    function back(code) {
      if (state.closed) return;
      var s = current();
      if (state.mode === "tabs") {
        if (s.length > 1) { var r = s.pop(); go("pop", (code || "volver()") + ": quita " + navLabel(r) + " de la pila de " + state.sel + cleared([r])); }
        else if (state.sel !== "Inicio") { state.sel = "Inicio"; go("pop", "volver(): en la raíz de Perfil → seleccionada = Inicio (salir por Inicio)"); }
        else { state.closed = true; go("pop", "volver() en la raíz de Inicio: el sistema cierra la app"); }
        return;
      }
      if (s.length > 1) { var removed = s.pop(); go("pop", (code || "pila.removeLastOrNull()") + cleared([removed])); }
      else if (s.length === 1) { state.closed = true; go("pop", "Solo queda una pantalla: NavDisplay deja pasar el gesto y el sistema cierra la app"); }
    }

    function op(id) {
      var o = NAV_OPS.filter(function (x) { return x.id === id; })[0];
      var s = state.stack;
      if (state.closed && id !== "restart") return;
      if (id === "detalle") push(key("Detalle", 7), o.code);
      else if (id === "back") back(o.code);
      else if (id === "ajustes") {
        if (s.length && s[s.length - 1].type === "Ajustes") go("none", o.code + ": ya estás en Ajustes, no se añade otra");
        else push(key("Ajustes"), o.code);
      } else if (id === "replace") {
        if (!s.length) return;
        var old = s[s.length - 1];
        s[s.length - 1] = key("Catalogo");
        go("push", o.code + ": " + navLabel(old) + " desaparece y no se puede volver a ella" + cleared([old]));
      } else if (id === "root") {
        var rem = s.splice(1);
        go(rem.length ? "pop" : "none", o.code + (rem.length === 1 ? ": se quita 1 pantalla" : rem.length ? ": se quitan " + rem.length + " pantallas" : ": ya estás en el inicio") + cleared(rem));
      } else if (id === "restart") {
        var all = s.splice(0);
        state.closed = false;
        s.push(key("Catalogo"));
        go("none", o.code + ": los dos cambios se aplican a la vez y nunca se ve la pila vacía" + cleared(all));
      } else if (id === "clear") {
        var gone = s.splice(0);
        go("none", o.code + " sin añadir nada después" + cleared(gone));
      }
    }

    // ---------- pantallas de la mini app

    function topBar(title, nav, actions) {
      return h("div", { class: "cpc-phone-bar cpc-bar-nav" }, [
        nav || h("span", { class: "cpc-appbar-gap" }),
        h("span", { class: "cpc-appbar-title", text: title }),
        actions || null
      ]);
    }

    function backBtn() {
      var b = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Volver" }, [icon("arrowBack")]);
      b.addEventListener("click", function () { back(state.mode === "pila" ? "onVolver → pila.removeLastOrNull()" : "onVolver → volver()"); });
      return b;
    }

    function crash(msg) {
      return h("div", { class: "cpc-nav-screen cpc-nav-crash" }, [
        h("p", { class: "cpc-crash-title", text: "💥 La app se ha cerrado" }),
        h("p", { text: msg }),
        h("p", { class: "cpc-crash-hint", text: "Pulsa «Reiniciar la app» en los controles." })
      ]);
    }

    function screenFor(entry) {
      if (state.closed) {
        var reopen = h("button", { type: "button", class: "cpc-launcher-app" }, [h("span", { class: "cpc-avatar", text: "J" }), h("span", { text: "Mis juegos" })]);
        reopen.addEventListener("click", function () { reset(); showScreen("none"); drawStack(); drawState(); });
        return h("div", { class: "cpc-nav-screen cpc-launcher" }, [h("p", { text: "Escritorio de Android" }), reopen]);
      }
      if (!entry) return crash("NavDisplay no tiene ninguna entrada que mostrar: la pila está vacía.");
      if (entry.type === "Ajustes" && !state.entryAjustes) return crash("Has añadido Ajustes a la pila, pero el entryProvider no tiene entry<Ajustes>.");
      var el;
      if (entry.type === "Catalogo") {
        var gear = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Ajustes" }, [icon("settings")]);
        gear.addEventListener("click", function () { push(key("Ajustes"), "onAjustesClick → " + (state.mode === "pila" ? "pila" : "pilaActual") + ".add(Ajustes)"); });
        var list = h("div", { class: "cpc-list" });
        Object.keys(NAV_GAMES).forEach(function (id) {
          var row = h("button", { type: "button", class: "cpc-nav-row" }, [
            h("span", { class: "cpc-nav-row-title", text: NAV_GAMES[id].t }), h("span", { class: "cpc-nav-row-sub", text: NAV_GAMES[id].p })
          ]);
          row.addEventListener("click", function () { push(key("Detalle", Number(id)), "onJuegoClick(" + id + ") → " + (state.mode === "pila" ? "pila" : "pilaActual") + ".add(Detalle(juegoId = " + id + "))"); });
          list.appendChild(row);
        });
        el = h("div", { class: "cpc-nav-screen" }, [topBar("Mis juegos", null, gear), list]);
      } else if (entry.type === "Detalle") {
        var vm = vmFor(entry);
        var shown = NAV_GAMES[vm.juegoId];
        var wrong = vm.juegoId !== entry.id;
        el = h("div", { class: "cpc-nav-screen" }, [
          topBar(shown.t, backBtn()),
          h("div", { class: "cpc-nav-body" }, [
            h("p", { text: "Plataforma: " + shown.p }),
            h("p", { class: "cpc-vm-chip" + (wrong ? " cpc-vm-wrong" : "") }, [
              h("code", { text: "DetalleViewModel #" + vm.n }), " · juegoId = " + vm.juegoId
            ]),
            wrong ? h("p", { class: "cpc-vm-warn", text: "⚠ La clave es Detalle(juegoId = " + entry.id + "), pero el ViewModel compartido sigue con el juego " + vm.juegoId + "." }) : null
          ])
        ]);
      } else if (entry.type === "Ajustes") {
        el = h("div", { class: "cpc-nav-screen" }, [topBar("Ajustes", backBtn()), h("div", { class: "cpc-nav-body" }, [h("p", { text: "Aquí irán los ajustes" })])]);
      } else {
        var cuenta = h("button", { type: "button", class: "cpc-btn cpc-btn-tonal" }, [h("span", { text: "Ajustes de la cuenta" })]);
        cuenta.addEventListener("click", function () { push(key("Ajustes"), "pilaActual.add(Ajustes) (en la pila de Perfil)"); });
        el = h("div", { class: "cpc-nav-screen" }, [topBar("Perfil"), h("div", { class: "cpc-nav-body cpc-nav-profile" }, [
          h("span", { class: "cpc-avatar cpc-avatar-big", text: "A" }), h("p", { class: "cpc-nav-row-title", text: "Ana García" }), cuenta
        ])]);
      }
      return el;
    }

    // Muestra la pantalla de la cima con la animación elegida (dir: push, pop o none).
    function showScreen(dir) {
      var s = current();
      var next = screenFor(s[s.length - 1]);
      var prev = host.lastElementChild;
      var anim = state.anim;
      if (prev && dir !== "none" && anim !== "none") {
        prev.classList.add("cpc-nav-exit-" + anim + "-" + dir);
        next.classList.add("cpc-nav-enter-" + anim + "-" + dir);
        host.appendChild(next);
        setTimeout(function () { if (prev.parentNode) prev.parentNode.removeChild(prev); }, 320);
      } else {
        host.innerHTML = "";
        host.appendChild(next);
      }
      if (barEl) drawBar();
    }

    function drawBar() {
      barEl.innerHTML = "";
      [["Inicio", "home"], ["Perfil", "person"]].forEach(function (t) {
        var b = h("button", { type: "button", class: "cpc-navbar-item" + (state.sel === t[0] ? " cpc-on" : ""), "aria-pressed": String(state.sel === t[0]) }, [
          h("span", { class: "cpc-navbar-icon" }, [icon(t[1])]), h("span", { text: t[0] })
        ]);
        b.addEventListener("click", function () {
          if (state.closed || state.sel === t[0]) return;
          state.sel = t[0];
          go("none", "seleccionada = Pestana." + (t[0] === "Inicio" ? "Inicio" : "Usuario") + ": se muestra la pila de " + t[0] + " tal y como estaba");
        });
        barEl.appendChild(b);
      });
    }

    function stackColumn(title, entries, active, under) {
      var col = h("div", { class: "cpc-navstack-col" + (active ? " cpc-on" : "") }, [h("p", { class: "cpc-navstack-title", text: title })]);
      var list = h("div", { class: "cpc-navstack-list" });
      if (!entries.length) list.appendChild(h("div", { class: "cpc-navstack-empty", text: "(vacía)" }));
      entries.forEach(function (e, i) {
        var top = i === entries.length - 1;
        var cls = "cpc-navstack-card" + (top && active && !state.closed ? " cpc-top" : "") + (under ? " cpc-under" : "");
        var vmTxt = e.vm && state.vmDecorator ? " · vm #" + e.vm.n : "";
        list.appendChild(h("div", { class: cls }, [
          h("span", { class: "cpc-navstack-index", text: String(i) }),
          h("code", { text: navLabel(e) + vmTxt }),
          top && active && !state.closed ? h("span", { class: "cpc-navstack-badge", text: "en pantalla" }) : null
        ]));
      });
      col.appendChild(list);
      return col;
    }

    function drawStack() {
      stackPanel.innerHTML = "";
      if (state.mode === "pila") {
        stackPanel.appendChild(stackColumn("pila (de abajo arriba)", state.stack, true));
      } else {
        stackPanel.appendChild(stackColumn("Pila de Inicio", state.tabs.Inicio, state.sel === "Inicio", state.sel !== "Inicio"));
        stackPanel.appendChild(stackColumn("Pila de Perfil", state.tabs.Perfil, state.sel === "Perfil"));
      }
      if (!state.vmDecorator && state.sharedVm) {
        stackPanel.appendChild(h("p", { class: "cpc-vm-warn", text: "Sin decorador: DetalleViewModel #" + state.sharedVm.n + " vive en la Activity y lo comparten todos los detalles." }));
      }
    }

    function drawState() {
      var txt;
      if (state.mode === "pila") txt = "pila = [" + state.stack.map(navLabel).join(", ") + "]";
      else txt = "seleccionada = " + state.sel + "   Inicio = [" + state.tabs.Inicio.map(navLabel).join(", ") + "]   Perfil = [" + state.tabs.Perfil.map(navLabel).join(", ") + "]";
      if (state.event) txt += "\n← " + state.event;
      stateEl.firstChild.textContent = txt;
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(segmented("Modo", [{ value: "pila", label: "Una pila" }, { value: "tabs", label: "Una pila por pestaña" }], state.mode, function (v) {
        state.mode = v; reset(); render();
      }));
      if (state.mode === "pila") {
        var ops = h("div", { class: "cpc-nav-ops" });
        NAV_OPS.forEach(function (o) {
          var b = h("button", { type: "button", class: o.id === "clear" ? "cpc-danger" : "", title: o.code }, [h("span", { text: o.label }), h("code", { text: o.code })]);
          b.addEventListener("click", function () { op(o.id); });
          ops.appendChild(b);
        });
        ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Operaciones con la pila" }), ops]));
        ui.controls.appendChild(yesNo("entry<Ajustes> en el entryProvider", state.entryAjustes, function (v) { state.entryAjustes = v; render(); }));
      }
      ui.controls.appendChild(yesNo("rememberViewModelStoreNavEntryDecorator()", state.vmDecorator, function (v) {
        state.vmDecorator = v; state.sharedVm = null; state.vmCounter = 0;
        state.stack.concat(state.tabs.Inicio, state.tabs.Perfil).forEach(function (e) { e.vm = null; });
        render();
      }));
      ui.controls.appendChild(select("Transición (transitionSpec / popTransitionSpec)", Object.keys(NAV_ANIMS).map(function (k) {
        return { value: k, label: NAV_ANIMS[k].label };
      }), state.anim, function (v) { state.anim = v; renderCode(); }));
      var r = h("button", { type: "button", text: "Reiniciar la app" });
      r.addEventListener("click", function () { reset(); render(); });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [r]));
      ui.controls.appendChild(modeControl({ get mode() { return state.theme; }, set mode(v) { state.theme = v; } }, function () { render(); }));
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.theme);
      host = h("div", { class: "cpc-nav-host" + (state.mode === "tabs" ? " cpc-with-bar" : "") });
      phone.appendChild(host);
      barEl = null;
      if (state.mode === "tabs") { barEl = h("div", { class: "cpc-navbar" }); phone.appendChild(barEl); }
      var sysBack = h("button", { type: "button", class: "cpc-sysback", "aria-label": "Botón atrás del sistema" }, [h("span", { text: "◁  Atrás del sistema" })]);
      sysBack.addEventListener("click", function () { back(state.mode === "pila" ? "botón atrás → onBack → pila.removeLastOrNull()" : "botón atrás → onBack → volver()"); });
      stackPanel = h("div", { class: "cpc-navstack" });
      stateEl = stateLine("");
      ui.stage.appendChild(h("div", { class: "cpc-col" }, [
        h("div", { class: "cpc-nav-layout" }, [h("div", { class: "cpc-col" }, [phone, sysBack]), applyScheme(stackPanel, state.theme)]),
        stateEl
      ]));
      showScreen("none");
      drawStack();
      drawState();
    }

    function renderCode() {
      var a = NAV_ANIMS[state.anim];
      var deco = ["        rememberSaveableStateHolderNavEntryDecorator()" + (state.vmDecorator ? "," : "")];
      if (state.vmDecorator) deco.push("        rememberViewModelStoreNavEntryDecorator()");
      else deco.push("        // ⚠ falta rememberViewModelStoreNavEntryDecorator()");
      var lines;
      if (state.mode === "pila") {
        lines = ["val pila = rememberNavBackStack(Catalogo)", "", "NavDisplay(", "    backStack = pila,",
          "    onBack = { pila.removeLastOrNull() },", "    entryDecorators = listOf("].concat(deco, ["    ),",
          "    transitionSpec = { " + a.fwd + " },", "    popTransitionSpec = { " + a.back + " },",
          "    entryProvider = entryProvider {",
          "        entry<Catalogo> {", "            PantallaCatalogo(",
          "                onJuegoClick = { id -> pila.add(Detalle(juegoId = id)) },",
          "                onAjustesClick = { pila.add(Ajustes) }", "            )", "        }",
          "        entry<Detalle> { clave ->",
          "            val viewModel = viewModel { DetalleViewModel(juegoId = clave.juegoId) }",
          "            PantallaDetalle(viewModel, onVolver = { pila.removeLastOrNull() })", "        }"]);
        if (state.entryAjustes) lines.push("        entry<Ajustes> { PantallaAjustes(onVolver = { pila.removeLastOrNull() }) }");
        else lines.push("        // ⚠ falta entry<Ajustes>: navegar a Ajustes cierra la app");
        lines.push("    }", ")");
      } else {
        lines = ["var seleccionada by rememberSaveable { mutableStateOf(Pestana.Inicio) }",
          "val pilas = Pestana.entries.associateWith { rememberNavBackStack(it.raiz) }",
          "val pilaActual = pilas.getValue(seleccionada)", "",
          "fun volver() {", "    if (pilaActual.size > 1) pilaActual.removeLastOrNull()   // dentro de la pestaña",
          "    else seleccionada = Pestana.Inicio                      // salir por Inicio", "}", "",
          "// Cada pila con SUS PROPIOS decoradores",
          "val entradasPorPestana = pilas.mapValues { (_, pila) ->",
          "    rememberDecoratedNavEntries(", "        backStack = pila,", "        entryDecorators = listOf("]
          .concat(deco.map(function (l) { return "    " + l; }), ["        ),", "        entryProvider = proveedor", "    )", "}", "",
            "// Inicio siempre debajo; encima, la pestaña seleccionada si es otra",
            "val entradasVisibles =", "    if (seleccionada == Pestana.Inicio) entradasPorPestana.getValue(Pestana.Inicio)",
            "    else entradasPorPestana.getValue(Pestana.Inicio) + entradasPorPestana.getValue(seleccionada)", "",
            "NavDisplay(", "    entries = entradasVisibles,", "    onBack = ::volver,",
            "    transitionSpec = { " + a.fwd + " },", "    popTransitionSpec = { " + a.back + " }", ")"]);
      }
      ui.code.set(lines.join("\n"));
      var hint;
      if (state.mode === "tabs") hint = "Entra en un detalle desde Inicio, cambia a Perfil y vuelve: Inicio sigue en el detalle. Desde la raíz de Perfil, el botón atrás te lleva a Inicio; desde la raíz de Inicio, cierra la app.";
      else if (!state.vmDecorator) hint = "Sin el decorador, el ViewModel vive en la Activity: abre el juego 1, vuelve y abre el 7. Sigues viendo el 1, porque todos los detalles comparten el mismo DetalleViewModel.";
      else if (!state.entryAjustes) hint = "Pulsa el engranaje: Ajustes entra en la pila, pero NavDisplay no sabe qué composable le corresponde y la app se cierra.";
      else hint = "La pantalla visible es siempre la del último elemento de la pila: pantalla visible = f(pila). Prueba las operaciones de la tabla y el botón atrás del sistema.";
      ui.hint.textContent = hint;
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    reset();
    render();
  }

  // ------------------------------------------ playground de diseño adaptativo

  var ADAPT_PRESETS = [
    { label: "Móvil", w: 412, h: 915 },
    { label: "Móvil en horizontal", w: 915, h: 412 },
    { label: "Plegable abierto", w: 673, h: 841 },
    { label: "Tablet en vertical", w: 800, h: 1280 },
    { label: "Tablet en horizontal", w: 1280, h: 800 },
    { label: "Escritorio", w: 1600, h: 900 }
  ];
  var ADAPT_GAMES = [
    { id: 1, t: "Hollow Knight", p: "Switch" }, { id: 2, t: "Celeste", p: "PC" },
    { id: 7, t: "Zelda: Tears of the Kingdom", p: "Switch" }, { id: 3, t: "Hades", p: "PC" },
    { id: 4, t: "Stardew Valley", p: "Switch" }, { id: 5, t: "Tunic", p: "PC" }
  ];

  function widthClass(w) {
    return w < 600 ? "Compact" : w < 840 ? "Medium" : w < 1200 ? "Expanded" : w < 1600 ? "Large" : "Extra-large";
  }
  function heightClass(hh) { return hh < 480 ? "Compact" : hh < 900 ? "Medium" : "Expanded"; }

  function adaptivePlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = { w: 412, h: 915, mode: "listdetail", stack: [], theme: siteMode() };
    var ui = shell(root, "Playground: ventana redimensionable", "Cambia el tamaño de la ventana y mira cómo se adapta la app", "cpc-stage-adapt");
    var info, ruler, frameWrap;

    function reset() { state.stack = [{ type: "Catalogo" }]; }
    reset();

    function renderControls() {
      ui.controls.innerHTML = "";
      var presets = h("div", { class: "cpg-seg" });
      ADAPT_PRESETS.forEach(function (p) {
        var on = p.w === state.w && p.h === state.h;
        var b = h("button", { type: "button", class: on ? "cpg-on" : "", "aria-pressed": String(on), text: p.label + " · " + p.w + "×" + p.h });
        b.addEventListener("click", function () { state.w = p.w; state.h = p.h; render(); });
        presets.appendChild(b);
      });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Dispositivo (tamaño de la ventana en dp)" }), presets]));
      ["w", "h"].forEach(function (k) {
        var id = nextId("adapt");
        var r = h("input", { id: id, type: "range", min: k === "w" ? 320 : 320, max: k === "w" ? 1800 : 1300, step: 1, value: state[k] });
        r.addEventListener("input", function () { state[k] = Number(r.value); renderStage(); renderCode(); syncPresets(); });
        ui.controls.appendChild(h("div", { class: "cpg-field cpc-inline-field" }, [h("label", { for: id, text: k === "w" ? "Ancho" : "Alto" }), r]));
      });
      ui.controls.appendChild(segmented("Contenido de la sección Inicio", [
        { value: "listdetail", label: "Lista-detalle (ListDetailSceneStrategy)" },
        { value: "grid", label: "Lista o cuadrícula (clase de tamaño)" }
      ], state.mode, function (v) { state.mode = v; reset(); render(); }));
      ui.controls.appendChild(modeControl({ get mode() { return state.theme; }, set mode(v) { state.theme = v; } }, function () { render(); }));
    }

    function syncPresets() {
      var bs = ui.controls.querySelectorAll(".cpg-field:first-child .cpg-seg button");
      Array.prototype.forEach.call(bs, function (b, i) {
        var on = ADAPT_PRESETS[i].w === state.w && ADAPT_PRESETS[i].h === state.h;
        b.className = on ? "cpg-on" : "";
        b.setAttribute("aria-pressed", String(on));
      });
      var ranges = ui.controls.querySelectorAll("input[type=range]");
      ranges[0].value = state.w; ranges[1].value = state.h;
    }

    function useBar() { return widthClass(state.w) === "Compact" || heightClass(state.h) === "Compact"; }
    function twoPanes() { return state.w >= 840; }

    function appBar(title, back) {
      return h("div", { class: "cpc-phone-bar cpc-bar-nav" }, [
        back ? (function () {
          var b = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Volver" }, [icon("arrowBack")]);
          b.addEventListener("click", function () { state.stack.pop(); renderStage(); renderCode(); });
          return b;
        })() : h("span", { class: "cpc-appbar-gap" }),
        h("span", { class: "cpc-appbar-title", text: title })
      ]);
    }

    function listPane(selected) {
      var list = h("div", { class: "cpc-list" });
      ADAPT_GAMES.forEach(function (g) {
        var b = h("button", { type: "button", class: "cpc-nav-row" + (selected === g.id ? " cpc-selected" : "") }, [
          h("span", { class: "cpc-nav-row-title", text: g.t }), h("span", { class: "cpc-nav-row-sub", text: g.p })
        ]);
        b.addEventListener("click", function () {
          var last = state.stack[state.stack.length - 1];
          if (last.type === "Detalle") state.stack[state.stack.length - 1] = { type: "Detalle", id: g.id };
          else state.stack.push({ type: "Detalle", id: g.id });
          renderStage(); renderCode();
        });
        list.appendChild(b);
      });
      return h("div", { class: "cpc-pane" }, [appBar("Mis juegos"), list]);
    }

    function detailPane(id, withBack) {
      var g = ADAPT_GAMES.filter(function (x) { return x.id === id; })[0];
      return h("div", { class: "cpc-pane" }, [appBar(g.t, withBack), h("div", { class: "cpc-nav-body" }, [h("p", { text: "Plataforma: " + g.p })])]);
    }

    function content() {
      var last = state.stack[state.stack.length - 1];
      if (state.mode === "grid") {
        var ancha = state.w >= 600;
        var body = h("div", { class: ancha ? "cpc-adapt-grid" : "cpc-list" });
        ADAPT_GAMES.forEach(function (g, i) {
          if (ancha) body.appendChild(h("div", { class: "cpc-adapt-card cpc-tone-" + ["primary", "secondary", "tertiary"][i % 3] }, [
            h("strong", { text: g.t }), h("span", { text: g.p })]));
          else body.appendChild(h("div", { class: "cpc-nav-row cpc-static" }, [h("span", { class: "cpc-nav-row-title", text: g.t }), h("span", { class: "cpc-nav-row-sub", text: g.p })]));
        });
        return h("div", { class: "cpc-pane" }, [appBar("Mis juegos"), body]);
      }
      if (twoPanes()) {
        var sel = last.type === "Detalle" ? last.id : null;
        return h("div", { class: "cpc-panes" }, [
          listPane(sel),
          sel ? detailPane(sel, false) : h("div", { class: "cpc-pane cpc-placeholder" }, [h("p", { text: "Elige un juego de la lista" })])
        ]);
      }
      return last.type === "Detalle" ? detailPane(last.id, true) : listPane(null);
    }

    function navSuite() {
      var items = [["Inicio", "home"], ["Favoritos", "favorite"], ["Perfil", "person"]].map(function (t, i) {
        return h("span", { class: "cpc-navbar-item cpc-suite-item" + (i === 0 ? " cpc-on" : "") }, [
          h("span", { class: "cpc-navbar-icon" }, [icon(t[1])]), h("span", { text: t[0] })]);
      });
      return h("div", { class: useBar() ? "cpc-suite-bar" : "cpc-suite-rail" }, items);
    }

    var handle, col, fixedScale = null;

    // El escenario se crea una vez; drawWindow lo redibuja sin tocar el tirador (para no perder el arrastre).
    function renderStage() {
      ui.stage.innerHTML = "";
      handle = h("span", { class: "cpc-resize", title: "Arrastra para cambiar el tamaño", "aria-hidden": "true" });
      frameWrap = h("div", { class: "cpc-window-wrap" }, [handle]);
      col = h("div", { class: "cpc-col cpc-adapt-col" }, [h("div"), h("div"), frameWrap]);
      ui.stage.appendChild(col);
      handle.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        var sx = e.clientX, sy = e.clientY, sw = state.w, sh = state.h;
        fixedScale = currentScale();
        handle.setPointerCapture(e.pointerId);
        function move(ev) {
          state.w = Math.round(Math.max(320, Math.min(1800, sw + (ev.clientX - sx) / fixedScale)));
          state.h = Math.round(Math.max(320, Math.min(1300, sh + (ev.clientY - sy) / fixedScale)));
          drawWindow(); renderCode(); syncPresets();
        }
        function up() {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          fixedScale = null;
          drawWindow();
        }
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
      });
      drawWindow();
    }

    function currentScale() {
      if (fixedScale) return fixedScale;
      var avail = Math.max(260, (ui.stage.clientWidth || 700) - 32);
      return Math.min(1, avail / state.w, 520 / state.h);
    }

    function drawWindow() {
      if (!frameWrap) return;
      var wc = widthClass(state.w), hc = heightClass(state.h);
      var scale = currentScale();

      // Regla de clases de ancho con la posición actual
      var marks = [[0, "Compact"], [600, "Medium"], [840, "Expanded"], [1200, "Large"], [1600, "Extra-large"]];
      var max = 1800;
      ruler = h("div", { class: "cpc-ruler" });
      marks.forEach(function (m, i) {
        var end = i + 1 < marks.length ? marks[i + 1][0] : max;
        ruler.appendChild(h("span", { class: "cpc-ruler-seg" + (m[1] === wc ? " cpc-on" : ""), style: { left: (m[0] / max * 100) + "%", width: ((end - m[0]) / max * 100) + "%" } }, [
          h("span", { text: m[1] }), m[0] ? h("small", { text: m[0] + " dp" }) : null
        ]));
      });
      ruler.appendChild(h("span", { class: "cpc-ruler-marker", style: { left: Math.min(100, state.w / max * 100) + "%" } }));

      var twoP = state.mode === "listdetail" ? (twoPanes() ? "2 paneles" : "1 panel") : (state.w >= 600 ? "cuadrícula" : "lista");
      info = h("div", { class: "cpc-adapt-info" }, [
        h("span", { class: "cpc-chip-info", text: state.w + " × " + state.h + " dp" }),
        h("span", { class: "cpc-chip-info", text: "ancho " + wc }),
        h("span", { class: "cpc-chip-info", text: "alto " + hc }),
        h("span", { class: "cpc-chip-info cpc-strong", text: useBar() ? "NavigationBar (abajo)" : "NavigationRail (lateral)" }),
        h("span", { class: "cpc-chip-info cpc-strong", text: twoP }),
        h("span", { class: "cpc-chip-info", text: "escala " + Math.round(scale * 100) + " %" })
      ]);

      var win = applyScheme(h("div", { class: "cpc-window" + (useBar() ? " cpc-has-bar" : " cpc-has-rail") }), state.theme);
      win.style.width = state.w + "px";
      win.style.height = state.h + "px";
      win.style.transform = "scale(" + scale + ")";
      win.appendChild(h("div", { class: "cpc-window-main" }, [content()]));
      win.appendChild(navSuite());

      col.replaceChild(info, col.children[0]);
      col.replaceChild(ruler, col.children[1]);
      var old = frameWrap.querySelector(".cpc-window");
      if (old) frameWrap.replaceChild(win, old); else frameWrap.insertBefore(win, handle);
      frameWrap.style.width = (state.w * scale) + "px";
      frameWrap.style.height = (state.h * scale) + "px";
    }

    function renderCode() {
      var lines;
      if (state.mode === "listdetail") {
        lines = ["// Ventana de " + state.w + " × " + state.h + " dp: ancho " + widthClass(state.w) + ", alto " + heightClass(state.h),
          "NavigationSuiteScaffold(   // → " + (useBar() ? "NavigationBar: ancho o alto Compact" : "NavigationRail: ni el ancho ni el alto son Compact"),
          "    navigationSuiteItems = { /* Inicio, Favoritos, Perfil */ }", ") {",
          "    NavDisplay(", "        backStack = pila,   // " + JSON.stringify(state.stack.map(function (k) { return k.type === "Detalle" ? "Detalle(" + k.id + ")" : k.type; })).replace(/"/g, ""),
          "        onBack = { pila.removeLastOrNull() },",
          "        sceneStrategies = listOf(rememberListDetailSceneStrategy()),   // → " + (twoPanes() ? "2 paneles (ancho ≥ 840 dp)" : "1 panel (ancho < 840 dp)"),
          "        entryProvider = entryProvider {",
          "            entry<Catalogo>(metadata = ListDetailSceneStrategy.listPane(", "                detailPlaceholder = { Text(\"Elige un juego de la lista\") }",
          "            )) { /* lista */ }",
          "            entry<Detalle>(metadata = ListDetailSceneStrategy.detailPane()) { clave ->",
          "                PantallaDetalle(clave.juegoId, mostrarVolver = !dosPaneles)   // " + (twoPanes() ? "sin flecha" : "con flecha"),
          "            }", "        }", "    )", "}", "",
          "val dosPaneles = currentWindowAdaptiveInfo().windowSizeClass",
          "    .isWidthAtLeastBreakpoint(WindowSizeClass.WIDTH_DP_EXPANDED_LOWER_BOUND)   // " + twoPanes()];
      } else {
        lines = ["val esAncha = currentWindowAdaptiveInfo().windowSizeClass",
          "    .isWidthAtLeastBreakpoint(WindowSizeClass.WIDTH_DP_MEDIUM_LOWER_BOUND)   // " + (state.w >= 600) + " (" + state.w + " dp)", "",
          "if (esAncha) {", "    LazyVerticalGrid(columns = GridCells.Adaptive(minSize = 180.dp)) { /* tarjetas */ }" + (state.w >= 600 ? "   // ← ahora" : ""),
          "} else {", "    LazyColumn { /* filas */ }" + (state.w < 600 ? "   // ← ahora" : ""), "}"];
      }
      ui.code.set(lines.join("\n"));
      var hint;
      if (state.mode === "grid") hint = "Con menos de 600 dp de ancho se ve una lista; desde 600 dp, una cuadrícula. Lo que cuenta es el ancho de la ventana, no si el dispositivo es un móvil o una tablet.";
      else if (useBar() && twoPanes()) hint = "Móvil en horizontal: el alto es Compact, así que la barra sigue abajo, pero el ancho llega a Expanded y caben lista y detalle a la vez.";
      else if (!twoPanes() && state.w >= 600) hint = "Ancho Medium (600-839 dp): ya hay barra lateral, pero la lista y el detalle siguen viéndose de uno en uno. Por eso la flecha «volver» se oculta a partir de 840 dp, no de 600.";
      else if (twoPanes()) hint = "Ancho de 840 dp o más: lista y detalle juntos. Pulsa otro juego: el detalle se sustituye y la lista no se mueve.";
      else hint = "Ancho Compact: barra inferior y una pantalla cada vez. Pulsa un juego para ir al detalle y la flecha para volver. Prueba a arrastrar la esquina de la ventana.";
      ui.hint.textContent = hint;
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
    // El ancho del escenario solo se conoce cuando ya está en la página
    requestAnimationFrame(function () { renderStage(); });
  }

  // ---------------------------------------------- playground de Koin

  var KOIN_DEPS = {
    CatalogoViewModel: ["ObtenerJuegosUseCase", "AlternarFavoritoUseCase"],
    DetalleViewModel: ["ObservarJuegoUseCase", "AlternarFavoritoUseCase"],
    ObtenerJuegosUseCase: ["JuegoRepositorio"],
    ObservarJuegoUseCase: ["JuegoRepositorio"],
    AlternarFavoritoUseCase: ["JuegoRepositorio"],
    JuegoRepositorio: []
  };
  var KOIN_LAYER = {
    CatalogoViewModel: "ui", DetalleViewModel: "ui", ObtenerJuegosUseCase: "dom",
    ObservarJuegoUseCase: "dom", AlternarFavoritoUseCase: "dom", JuegoRepositorio: "data"
  };
  var KOIN_USECASES = ["ObtenerJuegosUseCase", "ObservarJuegoUseCase", "AlternarFavoritoUseCase"];
  var KOIN_GAMES = [{ id: 1, t: "Hollow Knight" }, { id: 2, t: "Celeste" }, { id: 7, t: "Zelda: TotK" }];

  function koinPlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = {
      decl: {
        repo: "single", bind: true, CatalogoViewModel: true, DetalleViewModel: true,
        ObtenerJuegosUseCase: "factory", ObservarJuegoUseCase: "factory", AlternarFavoritoUseCase: "factory"
      },
      theme: siteMode()
    };
    var rt;
    var ui = shell(root, "Playground: el resolutor de Koin", "Cambia las recetas del módulo y usa la app: mira qué objetos crea Koin");

    function resetRuntime() {
      rt = { counters: {}, singles: {}, stack: [], log: [], error: null, hint: "" };
    }

    function log(msg) { rt.log.push(msg); if (rt.log.length > 9) rt.log.shift(); }
    function implName(type) { return type === "JuegoRepositorio" ? "JuegoRepositorioEnMemoria" : type; }

    // Crea (o reutiliza) un objeto del tipo pedido, resolviendo antes sus dependencias.
    function get(type) {
      var kind;
      if (type === "JuegoRepositorio") {
        if (state.decl.repo === "none") throw { type: type, why: "No hay ninguna receta para JuegoRepositorioEnMemoria." };
        if (!state.decl.bind) throw { type: type, why: "Existe singleOf(::JuegoRepositorioEnMemoria), pero sin bind Koin no sabe que sirve para JuegoRepositorio." };
        kind = state.decl.repo;
      } else if (/ViewModel$/.test(type)) {
        if (!state.decl[type]) throw { type: type, why: "Falta viewModelOf(::" + type + ") en el módulo." };
        kind = "viewModel";
      } else {
        kind = state.decl[type];
        if (kind === "none") throw { type: type, why: "Falta la receta de " + type + " en el módulo." };
      }
      if (kind === "single" && rt.singles[type]) {
        log("reutiliza " + implName(type) + " #" + rt.singles[type].n + " (single)");
        return rt.singles[type];
      }
      var deps = KOIN_DEPS[type].map(get);
      rt.counters[type] = (rt.counters[type] || 0) + 1;
      var obj = { type: type, n: rt.counters[type], deps: deps, kind: kind, favs: type === "JuegoRepositorio" ? {} : null };
      if (kind === "single") rt.singles[type] = obj;
      log("crea " + implName(type) + " #" + obj.n + " (" + kind + ")");
      return obj;
    }

    function open(screen, id) {
      rt.error = null;
      var vmType = screen === "Catalogo" ? "CatalogoViewModel" : "DetalleViewModel";
      log("— koinViewModel<" + vmType + ">()");
      try {
        rt.stack.push({ screen: screen, id: id, vm: get(vmType) });
      } catch (e) {
        if (!e.type) throw e;
        rt.error = e;
        log("💥 NoDefinitionFoundException: " + e.type);
      }
      draw();
    }

    function back() {
      if (rt.error) { rt.error = null; draw(); return; }
      if (rt.stack.length <= 1) return;
      var e = rt.stack.pop();
      log("— sales de " + e.screen + ": " + e.vm.type + " #" + e.vm.n + " → onCleared()");
      draw();
    }

    function rotate() {
      if (!rt.stack.length) return;
      var top = rt.stack[rt.stack.length - 1];
      log("— 🔄 giras el móvil: Activity nueva, pero koinViewModel devuelve el mismo " + top.vm.type + " #" + top.vm.n);
      draw();
    }

    // El repositorio que usa un ViewModel a través de su caso de uso número i
    function repoOf(vm, i) { return vm.deps[i].deps[0]; }

    var phoneEl, graphEl, logEl;

    function renderControls() {
      ui.controls.innerHTML = "";
      var kinds = [{ value: "single", label: "single" }, { value: "factory", label: "factory" }, { value: "none", label: "sin declarar" }];
      ui.controls.appendChild(segmented("datosModule · JuegoRepositorioEnMemoria", kinds, state.decl.repo, function (v) { state.decl.repo = v; restart(); }));
      ui.controls.appendChild(yesNo("bind JuegoRepositorio::class", state.decl.bind, function (v) { state.decl.bind = v; restart(); }));
      KOIN_USECASES.forEach(function (u) {
        ui.controls.appendChild(segmented("dominioModule · " + u, kinds, state.decl[u], function (v) { state.decl[u] = v; restart(); }));
      });
      ["CatalogoViewModel", "DetalleViewModel"].forEach(function (vm) {
        ui.controls.appendChild(yesNo("presentacionModule · viewModelOf(::" + vm + ")", state.decl[vm], function (v) { state.decl[vm] = v; restart(); }));
      });
      var r = h("button", { type: "button", text: "Reiniciar la app" });
      r.addEventListener("click", restart);
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: " " }), r]));
      ui.controls.appendChild(modeControl({ get mode() { return state.theme; }, set mode(v) { state.theme = v; } }, function () { renderStage(); }));
    }

    function restart() {
      resetRuntime();
      renderControls();
      renderCode();
      renderStage();
      log("startKoin { modules(appModules) }");
      open("Catalogo");
    }

    function renderStage() {
      ui.stage.innerHTML = "";
      phoneEl = applyScheme(h("div", { class: "cpc-phone" }), state.theme);
      graphEl = h("div", { class: "cpc-koin-graph" });
      logEl = h("pre", { class: "cpc-koin-log" });
      var rot = h("button", { type: "button", text: "🔄 Girar el móvil" });
      rot.addEventListener("click", rotate);
      var bk = h("button", { type: "button", text: "◁ Atrás del sistema" });
      bk.addEventListener("click", back);
      ui.stage.appendChild(h("div", { class: "cpc-nav-layout" }, [
        h("div", { class: "cpc-col" }, [phoneEl, h("div", { class: "cpg-seg" }, [rot, bk])]),
        h("div", { class: "cpc-koin-side" }, [h("p", { class: "cpc-navstack-title", text: "Objetos vivos (cada flecha: «usa»)" }), graphEl,
          h("p", { class: "cpc-navstack-title", text: "Registro de Koin" }), logEl])
      ]));
      draw();
    }

    function bar(title, backBtn) {
      var kids = [];
      if (backBtn) {
        var b = h("button", { type: "button", class: "cpc-icon-btn", "aria-label": "Volver" }, [icon("arrowBack")]);
        b.addEventListener("click", back);
        kids.push(b);
      } else kids.push(h("span", { class: "cpc-appbar-gap" }));
      kids.push(h("span", { class: "cpc-appbar-title", text: title }));
      return h("div", { class: "cpc-phone-bar cpc-bar-nav" }, kids);
    }

    function drawPhone() {
      phoneEl.innerHTML = "";
      if (rt.error) {
        phoneEl.appendChild(h("div", { class: "cpc-nav-screen cpc-nav-crash" }, [
          h("p", { class: "cpc-crash-title", text: "💥 La app se ha cerrado" }),
          h("p", { class: "cpc-code-msg", text: "NoDefinitionFoundException: No definition found for type '" + rt.error.type + "'" }),
          h("p", { text: rt.error.why }),
          h("p", { class: "cpc-crash-hint", text: "Corrige el módulo o pulsa «Atrás del sistema»." })
        ]));
        return;
      }
      var top = rt.stack[rt.stack.length - 1];
      if (!top) return;
      if (top.screen === "Catalogo") {
        var favs = repoOf(top.vm, 0).favs;
        var list = h("div", { class: "cpc-list" });
        KOIN_GAMES.forEach(function (g) {
          var row = h("button", { type: "button", class: "cpc-nav-row" }, [
            h("span", { class: "cpc-nav-row-title", text: (favs[g.id] ? "★ " : "") + g.t }),
            h("span", { class: "cpc-nav-row-sub", text: "pulsa para ver el detalle" })
          ]);
          row.addEventListener("click", function () { open("Detalle", g.id); });
          list.appendChild(row);
        });
        phoneEl.appendChild(h("div", { class: "cpc-nav-screen" }, [bar("Mis juegos"), list]));
      } else {
        var g = KOIN_GAMES.filter(function (x) { return x.id === top.id; })[0];
        var seen = repoOf(top.vm, 0).favs[g.id];      // lo que lee ObservarJuego
        var fav = h("button", { type: "button", class: "cpc-btn cpc-btn-tonal" }, [h("span", { text: seen ? "★ Quitar de favoritos" : "☆ Marcar como favorito" })]);
        fav.addEventListener("click", function () {
          var repo = repoOf(top.vm, 1);                 // donde escribe AlternarFavorito
          repo.favs[g.id] = !repo.favs[g.id];
          log("AlternarFavoritoUseCase #" + top.vm.deps[1].n + " escribe en JuegoRepositorioEnMemoria #" + repo.n);
          draw();
        });
        phoneEl.appendChild(h("div", { class: "cpc-nav-screen" }, [bar(g.t, true), h("div", { class: "cpc-nav-body" }, [
          h("p", { text: seen ? "★ Es uno de tus favoritos" : "No está en favoritos" }), fav
        ])]));
      }
    }

    function node(obj) {
      var cls = { ui: "cpc-koin-ui", dom: "cpc-koin-dom", data: "cpc-koin-data" }[KOIN_LAYER[obj.type]];
      var el = h("li", null, [h("span", { class: "cpc-koin-node " + cls + (obj.type === "JuegoRepositorio" ? " cpc-repo-" + Math.min(obj.n, 4) : ""), title: implName(obj.type) + " #" + obj.n }, [
        h("code", { text: implName(obj.type).replace("UseCase", "UC").replace("JuegoRepositorioEnMemoria", "RepoEnMemoria") + " #" + obj.n }),
        h("small", { text: obj.kind })
      ])]);
      if (obj.deps.length) {
        var ul = h("ul");
        obj.deps.forEach(function (d) { ul.appendChild(node(d)); });
        el.appendChild(ul);
      }
      return el;
    }

    function draw() {
      drawPhone();
      graphEl.innerHTML = "";
      var ul = h("ul", { class: "cpc-koin-tree" });
      rt.stack.forEach(function (e) { ul.appendChild(node(e.vm)); });
      graphEl.appendChild(ul);
      logEl.textContent = rt.log.map(function (l) { return "[Koin] " + l; }).join("\n");
      renderHint();
    }

    function renderHint() {
      var repos = {};
      rt.stack.forEach(function (e) {
        (function walk(o) { if (o.type === "JuegoRepositorio") repos[o.n] = true; o.deps.forEach(walk); })(e.vm);
      });
      var nRepos = Object.keys(repos).length;
      var hint;
      if (rt.error) hint = "Koin no comprueba las recetas al compilar: el fallo aparece al pedir la pieza, cuando el usuario abre la pantalla. Para descubrirlo antes está el test con verify() del apartado 8.";
      else if (nRepos > 1) hint = "Hay " + nRepos + " repositorios distintos (fíjate en su número y su color). Marca un favorito en el detalle: lo escribe un repositorio y lo lee otro, así que no se ve. Pon el repositorio en single.";
      else if (state.decl.AlternarFavoritoUseCase === "single" || state.decl.ObtenerJuegosUseCase === "single" || state.decl.ObservarJuegoUseCase === "single") hint = "Un caso de uso en single también funciona, porque no guarda estado; pero no aporta nada y lo mantiene en memoria toda la vida de la app. Lo normal es factory.";
      else hint = "Todo correcto: los casos de uso son nuevos en cada ViewModel (factory) y todos comparten el repositorio #1 (single). Abre un juego, márcalo como favorito y vuelve: el catálogo lo muestra con ★.";
      ui.hint.textContent = hint;
    }

    function renderCode() {
      var d = state.decl;
      var lines = ["val datosModule = module {"];
      if (d.repo === "none") lines.push("    // (sin receta para el repositorio)");
      else lines.push("    " + d.repo + "Of(::JuegoRepositorioEnMemoria)" + (d.bind ? " bind JuegoRepositorio::class" : ""));
      lines.push("}", "", "val dominioModule = module {");
      KOIN_USECASES.forEach(function (u) {
        lines.push(d[u] === "none" ? "    // (sin receta para " + u + ")" : "    " + d[u] + "Of(::" + u + ")");
      });
      lines.push("}", "", "val presentacionModule = module {");
      ["CatalogoViewModel", "DetalleViewModel"].forEach(function (vm) {
        lines.push(d[vm] ? "    viewModelOf(::" + vm + ")" : "    // (sin receta para " + vm + ")");
      });
      lines.push("}");
      ui.code.set(lines.join("\n"));
    }

    resetRuntime();
    renderControls();
    renderCode();
    renderStage();
    log("startKoin { modules(appModules) }");
    open("Catalogo");
  }

  // ------------------------------------- playground del árbol semántico (3C.4)

  var SEM_GAMES = {
    tres: [
      { id: 1, t: "Hades", p: "PC", fav: false },
      { id: 2, t: "Celeste", p: "PC", fav: false },
      { id: 7, t: "Zelda", p: "Switch", fav: true }
    ],
    zelda: [{ id: 7, t: "Zelda", p: "Switch", fav: false }]
  };

  var SEM_STATES = [
    { value: "tres", label: "Exito: Hades, Celeste y Zelda ★" },
    { value: "zelda", label: "Exito: solo Zelda (como en 5.4)" },
    { value: "cargando", label: "Cargando" },
    { value: "vacio", label: "Vacio" }
  ];

  var SEM_FINDERS = {
    onNodeWithText: { all: false, by: "text", desc: function (v) { return "Text + InputText + EditableText contains '" + v + "' (ignoreCase: false)"; } },
    onNodeWithContentDescription: { all: false, by: "desc", desc: function (v) { return "ContentDescription = '" + v + "' (ignoreCase: false)"; } },
    onNodeWithTag: { all: false, by: "tag", desc: function (v) { return "TestTag = '" + v + "'"; } },
    onAllNodesWithText: { all: true, by: "text", desc: function (v) { return "Text + InputText + EditableText contains '" + v + "' (ignoreCase: false)"; } }
  };

  var SEM_EXAMPLES = [
    { label: "Pulsar la fila de Zelda", st: "tres", f: "onNodeWithText", v: "Zelda", a: "performClick" },
    { label: "Buscar «PC» con onNodeWithText", st: "tres", f: "onNodeWithText", v: "PC", a: "assertIsDisplayed" },
    { label: "Contar los juegos de «PC»", st: "tres", f: "onAllNodesWithText", v: "PC", a: "assertCountEquals(2)" },
    { label: "Pulsar «Añadir a favoritos» con tres juegos", st: "tres", f: "onNodeWithContentDescription", v: "Añadir a favoritos", a: "performClick" },
    { label: "Pulsar «Añadir a favoritos» como en 5.4", st: "zelda", f: "onNodeWithContentDescription", v: "Añadir a favoritos", a: "performClick" },
    { label: "Buscar «hades» en minúsculas", st: "tres", f: "onNodeWithText", v: "hades", a: "assertIsDisplayed" },
    { label: "Indicador de carga por su testTag", st: "cargando", f: "onNodeWithTag", v: "cargando", a: "assertIsDisplayed" },
    { label: "Comprobar que no hay mensaje de vacío", st: "tres", f: "onNodeWithText", v: "No hay juegos para mostrar", a: "assertDoesNotExist" }
  ];

  function semanticsPlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = { st: "tres", f: "onNodeWithText", v: "Zelda", a: "performClick", theme: siteMode() };
    var ui = shell(root, "Playground: el árbol semántico", "Elige un finder y una acción: mira qué nodos encuentra y si el test pasa");

    // Árbol semántico (ya fusionado) de PantallaCatalogo para el estado elegido.
    function tree() {
      if (state.st === "cargando") return [{ key: "load", label: "ProgressBar · TestTag \"cargando\"", tag: "cargando", texts: [] }];
      if (state.st === "vacio") return [{ key: "empty", label: "Text \"No hay juegos para mostrar\"", texts: ["No hay juegos para mostrar"] }];
      var nodes = [{ key: "title", label: "Text \"Catálogo\"", texts: ["Catálogo"] }];
      SEM_GAMES[state.st].forEach(function (g) {
        var d = g.fav ? "Quitar de favoritos" : "Añadir a favoritos";
        nodes.push({ key: "row" + g.id, label: "fila · onClick · Text \"" + g.t + "\", \"" + g.p + "\"", texts: [g.t, g.p], click: { lambda: "onJuegoClick", id: g.id } });
        nodes.push({ key: "fav" + g.id, label: "Button · ContentDescription \"" + d + "\"", child: true, desc: d, texts: [], click: { lambda: "onFavoritoClick", id: g.id } });
      });
      return nodes;
    }

    function matches(n) {
      var by = SEM_FINDERS[state.f].by;
      if (by === "text") return n.texts.indexOf(state.v) >= 0;
      if (by === "desc") return n.desc === state.v;
      return n.tag === state.v;
    }

    // Ejecuta el test imaginario: devuelve los nodos encontrados, si pasa y qué variables cambian.
    function run() {
      var nodes = tree();
      var hits = nodes.filter(matches);
      var fin = SEM_FINDERS[state.f];
      var res = { hits: hits, ok: true, msg: "", vars: { idPulsado: null, idFavorito: null } };
      var reason = "(" + fin.desc(state.v) + ")";
      if (fin.all) {
        var want = parseInt(state.a.replace(/\D/g, ""), 10);
        res.ok = hits.length === want;
        res.msg = res.ok ? "✓ Test superado: hay " + want + " nodo" + (want === 1 ? "" : "s") + "."
          : "✗ AssertionError: Failed to assert count of nodes.\nReason: Expected '" + want + "' nodes but found '" + hits.length + "' nodes that satisfy: " + reason;
        return res;
      }
      if (state.a === "assertDoesNotExist") {
        res.ok = hits.length === 0;
        res.msg = res.ok ? "✓ Test superado: no existe ningún nodo así."
          : "✗ AssertionError: Failed: assertDoesNotExist.\nReason: Did not expect any node but found '" + hits.length + "' node" + (hits.length === 1 ? "" : "s") + " that satisf" + (hits.length === 1 ? "ies" : "y") + ": " + reason;
        return res;
      }
      var what = state.a === "performClick" ? "perform a gesture" : "assert the following: (Is displayed)";
      if (hits.length === 0) {
        res.ok = false;
        res.msg = "✗ AssertionError: Failed to " + what + ".\nReason: Expected exactly '1' node but could not find any node that satisfies: " + reason;
        return res;
      }
      if (hits.length > 1) {
        res.ok = false;
        res.msg = "✗ AssertionError: Failed to " + what + ".\nReason: Expected exactly '1' node but found '" + hits.length + "' nodes that satisfy: " + reason;
        return res;
      }
      if (state.a === "performClick") {
        var c = hits[0].click;
        if (c) {
          res.vars[c.lambda === "onJuegoClick" ? "idPulsado" : "idFavorito"] = c.id;
          res.msg = "✓ Clic en el nodo: la pantalla llama a " + c.lambda + "(" + c.id + ").";
        } else res.msg = "✓ Se inyecta el clic, pero el nodo no tiene onClick: no pasa nada.";
        return res;
      }
      res.msg = "✓ Test superado: el nodo existe y se ve en pantalla.";
      return res;
    }

    function pick(f, v, a) {
      state.f = f; state.v = v; state.a = a;
      render();
    }

    function actionsFor(f) {
      return SEM_FINDERS[f].all ? ["assertCountEquals(0)", "assertCountEquals(1)", "assertCountEquals(2)", "assertCountEquals(3)"]
        : ["assertIsDisplayed", "assertDoesNotExist", "performClick"];
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      var ex = [{ value: "", label: "— elige un ejemplo —" }].concat(SEM_EXAMPLES.map(function (e, i) { return { value: String(i), label: e.label }; }));
      ui.controls.appendChild(select("Ejemplos", ex, "", function (i) {
        if (i === "") return;
        var e = SEM_EXAMPLES[+i];
        state.st = e.st;
        pick(e.f, e.v, e.a);
      }));
      ui.controls.appendChild(select("Estado que recibe la pantalla", SEM_STATES, state.st, function (v) { state.st = v; render(); }));
      ui.controls.appendChild(select("Finder", opts(Object.keys(SEM_FINDERS)), state.f, function (v) {
        state.f = v;
        if (actionsFor(v).indexOf(state.a) < 0) state.a = actionsFor(v)[0];
        render();
      }));
      ui.controls.appendChild(textField("Valor que se busca (distingue mayúsculas)", state.v, function (v) { state.v = v; renderStage(); renderCode(); }));
      ui.controls.appendChild(select("Acción o comprobación", opts(actionsFor(state.f)), state.a, function (v) { state.a = v; render(); }));
      ui.controls.appendChild(modeControl({ get mode() { return state.theme; }, set mode(v) { state.theme = v; } }, function () { renderStage(); }));
    }

    function renderPhone(hitKeys) {
      var phone = applyScheme(h("div", { class: "cpc-phone" }), state.theme);
      var hit = function (k) { return hitKeys.indexOf(k) >= 0 ? " cpc-sem-hit" : ""; };
      var body;
      if (state.st === "cargando") {
        body = h("div", { class: "cpc-sem-center" }, [h("span", { class: "cpc-sem-spinner" + hit("load"), "aria-label": "Cargando" })]);
      } else if (state.st === "vacio") {
        body = h("div", { class: "cpc-sem-center" }, [h("p", { class: "cpc-sem-mark" + hit("empty"), text: "No hay juegos para mostrar" })]);
      } else {
        body = h("div", { class: "cpc-list" });
        SEM_GAMES[state.st].forEach(function (g) {
          var row = h("div", { class: "cpc-sem-row" + hit("row" + g.id), role: "button", tabindex: "0", title: "Pulsa para buscar esta fila por su texto" }, [
            h("span", { class: "cpc-sem-texts" }, [h("span", { class: "cpc-nav-row-title", text: g.t }), h("span", { class: "cpc-nav-row-sub", text: g.p })])
          ]);
          var heart = h("button", { type: "button", class: "cpc-icon-btn cpc-fav" + (g.fav ? " cpc-on" : "") + hit("fav" + g.id), "aria-label": g.fav ? "Quitar de favoritos" : "Añadir a favoritos", title: "Pulsa para buscar este botón por su descripción" }, [icon("favorite", 20)]);
          heart.addEventListener("click", function (e) { e.stopPropagation(); pick("onNodeWithContentDescription", g.fav ? "Quitar de favoritos" : "Añadir a favoritos", "performClick"); });
          row.addEventListener("click", function () { pick("onNodeWithText", g.t, "performClick"); });
          row.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick("onNodeWithText", g.t, "performClick"); } });
          row.appendChild(heart);
          body.appendChild(row);
        });
      }
      phone.appendChild(h("div", { class: "cpc-nav-screen" }, [
        h("div", { class: "cpc-phone-bar cpc-bar-nav" }, [h("span", { class: "cpc-appbar-gap" }), h("span", { class: "cpc-appbar-title" + hit("title"), text: "Catálogo" })]),
        body
      ]));
      return phone;
    }

    function renderStage() {
      var res = run();
      var hitKeys = res.hits.map(function (n) { return n.key; });
      ui.stage.innerHTML = "";
      var ul = h("ul", { class: "cpc-koin-tree cpc-sem-tree" });
      var root = h("li", null, [h("span", { class: "cpc-koin-node cpc-sem-node" }, [h("code", { text: "Root" })])]);
      var level = h("ul");
      var lastRow = null;
      tree().forEach(function (n) {
        var li = h("li", null, [h("span", { class: "cpc-koin-node cpc-sem-node" + (n.click && !n.child ? " cpc-koin-ui" : "") + (hitKeys.indexOf(n.key) >= 0 ? " cpc-sem-hit" : "") }, [h("code", { text: n.label })])]);
        if (n.child && lastRow) {
          var sub = h("ul");
          sub.appendChild(li);
          lastRow.appendChild(sub);
        } else {
          level.appendChild(li);
          lastRow = li;
        }
      });
      root.appendChild(level);
      ul.appendChild(root);
      var out = h("pre", { class: "cpc-koin-log cpc-sem-result " + (res.ok ? "cpc-sem-ok" : "cpc-sem-fail") });
      out.textContent = res.msg;
      var vars = h("p", { class: "cpc-state" }, [h("code", { text: "idPulsado = " + res.vars.idPulsado + " · idFavorito = " + res.vars.idFavorito })]);
      ui.stage.appendChild(h("div", { class: "cpc-nav-layout" }, [
        h("div", { class: "cpc-col" }, [renderPhone(hitKeys), vars]),
        h("div", { class: "cpc-koin-side" }, [
          h("p", { class: "cpc-navstack-title", text: "Árbol semántico (lo que ve el test)" }),
          h("div", { class: "cpc-koin-graph" }, [ul]),
          h("p", { class: "cpc-navstack-title cpc-sem-gap", text: "Resultado del test · " + res.hits.length + " nodo" + (res.hits.length === 1 ? "" : "s") + " encontrado" + (res.hits.length === 1 ? "" : "s") }),
          out
        ])
      ]));
      renderHint(res);
    }

    function renderHint(res) {
      var hint;
      var fin = SEM_FINDERS[state.f];
      if (!fin.all && res.hits.length > 1) hint = "onNode… exige que haya exactamente un nodo. Si el texto se repite, usa onAllNodes…, busca algo único (el título del juego) o añade un testTag.";
      else if (res.hits.length === 0 && state.a !== "assertDoesNotExist" && !fin.all) {
        var all = tree();
        var ci = all.filter(function (n) { return n.texts.concat(n.desc ? [n.desc] : []).some(function (t) { return t.toLowerCase() === state.v.toLowerCase(); }); });
        if (ci.length) hint = "Existe un nodo con ese texto, pero cambian las mayúsculas: la búsqueda es exacta salvo que pases ignoreCase = true.";
        else if (fin.by === "tag") hint = "Solo encuentra el testTag si el composable lo declara con Modifier.testTag(…). Prueba el estado Cargando.";
        else hint = "Ningún nodo coincide. El test busca en el árbol semántico (textos, descripciones y etiquetas), no en los píxeles de la pantalla.";
      } else if (state.a === "performClick" && res.ok && res.hits[0] && res.hits[0].click) hint = "La pantalla no cambia: es stateless y nadie actualiza el estado. El test solo comprueba que la pantalla avisó, leyendo la variable que guardó la lambda.";
      else if (fin.all) hint = "onAllNodes… devuelve todos los nodos que coinciden, aunque sean varios o ninguno: se comprueban con assertCountEquals, o se elige uno con [0].";
      else if (fin.by === "tag" && res.ok) hint = "El indicador de carga no tiene texto ni descripción: el test lo encuentra por la etiqueta que le pone la pantalla con Modifier.testTag(\"cargando\").";
      else if (state.st === "tres" && state.v === "Zelda") hint = "La fila es clicable, así que reúne en un nodo los textos de sus hijos («Zelda» y «Switch»): por eso el clic llega a onJuegoClick.";
      else hint = "Pulsa una fila o un corazón del móvil para buscarlos, o elige uno de los ejemplos.";
      ui.hint.textContent = hint;
    }

    function stateCode() {
      if (state.st === "cargando") return "CatalogoUiState.Cargando";
      if (state.st === "vacio") return "CatalogoUiState.Vacio";
      if (state.st === "zelda") return "CatalogoUiState.Exito(listOf(Juego(7, \"Zelda\", \"Switch\")), filtro = null)";
      return "CatalogoUiState.Exito(listOf(hades, celeste, zelda), filtro = null)";
    }

    function renderCode() {
      var res = run();
      var lines = [
        "@Test",
        "fun prueba() {",
        "    var idPulsado: Int? = null",
        "    var idFavorito: Int? = null",
        "    composeTestRule.setContent {",
        "        PantallaCatalogo(",
        "            estado = " + stateCode() + ",",
        "            onJuegoClick = { idPulsado = it },",
        "            onFavoritoClick = { idFavorito = it },",
        "            onFiltroCambiado = {}",
        "        )",
        "    }",
        "",
        "    composeTestRule." + state.f + "(" + kstr(state.v) + ")." + state.a + (state.a.indexOf("(") < 0 ? "()" : "")
      ];
      if (res.ok && state.a === "performClick" && res.hits[0] && res.hits[0].click) {
        var c = res.hits[0].click;
        lines.push("", "    assertEquals(" + c.id + ", " + (c.lambda === "onJuegoClick" ? "idPulsado" : "idFavorito") + ")");
      }
      lines.push("}");
      ui.code.set(lines.join("\n"));
    }

    function render() { renderControls(); renderStage(); renderCode(); }
    render();
  }

  // --------------------------------------------- Kotlin Flow (apuntes 52-flows)

  // Bucle de animación con reloj propio: avanza solo mientras no está en pausa
  // y se detiene en cuanto el playground sale del documento.
  function flowClock(root, onFrame) {
    var clock = { now: 0, paused: false };
    var last = null;
    function frame(ts) {
      if (!root.isConnected) return;
      if (last !== null && !clock.paused) clock.now += Math.max(0, Math.min(ts - last, 100));
      last = ts;
      onFrame(clock.now);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return clock;
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Carriles de canicas que se desplazan hacia la izquierda con el tiempo.
  var FL_WINDOW = 5000;

  function marbleLanes(parent) {
    var wrap = h("div", { class: "cfl-lanes" });
    parent.appendChild(wrap);
    var marbles = [];
    return {
      lane: function (label, cls) {
        var track = h("div", { class: "cfl-track" });
        wrap.appendChild(h("div", { class: "cfl-lane " + (cls || "") }, [h("code", { class: "cfl-label", text: label }), track]));
        return {
          add: function (text, t, extra) {
            var el = h("span", { class: "cfl-marble" + (extra ? " " + extra : ""), text: String(text) });
            track.appendChild(el);
            marbles.push({ el: el, t: t });
          },
          end: function (t, text) {
            var el = h("span", { class: "cfl-end", title: text || "fin" });
            track.appendChild(el);
            marbles.push({ el: el, t: t });
          }
        };
      },
      update: function (now) {
        var offset = Math.max(0, now - FL_WINDOW * 0.92);
        marbles = marbles.filter(function (m) {
          var pct = (m.t - offset) / FL_WINDOW * 100;
          if (pct < -8) { m.el.remove(); return false; }
          m.el.style.left = (2 + pct * 0.94) + "%";
          return true;
        });
      }
    };
  }

  // ---- Animación: la cinta transportadora (un valor detrás de otro)

  function flowBeltPlayground(root) {
    root.classList.add("cpc-pg-full");
    var ui = shell(root, "Animación: la cinta transportadora", "Un valor viaja por la cinta; el siguiente no sale hasta que el anterior llega al final");
    var belt, prod, coll, list, box, status;
    var run;

    function reset(now) {
      run = { n: 0, item: null, waitUntil: now + 1000, done: false, restartAt: null };
      list.innerHTML = "";
      status.textContent = "delay(1000)…";
    }

    function renderControls() {
      ui.controls.innerHTML = "";
      var p = h("button", { type: "button", text: clock && clock.paused ? "▶ Reanudar" : "⏸ Pausa" });
      p.addEventListener("click", function () { clock.paused = !clock.paused; renderControls(); });
      var r = h("button", { type: "button", text: "↺ Reiniciar" });
      r.addEventListener("click", function () { reset(clock.now); });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Animación" }), h("div", { class: "cpg-seg" }, [p, r])]));
    }

    ui.stage.innerHTML = "";
    status = h("span", { class: "cfl-status" });
    prod = h("div", { class: "cfl-station cfl-prod" }, [h("strong", { text: "Productor" }), h("code", { text: "flow { emit(i) }" }), status]);
    list = h("div", { class: "cfl-received" });
    coll = h("div", { class: "cfl-station cfl-coll" }, [h("strong", { text: "Consumidor" }), h("code", { text: "collect { }" }), list]);
    box = h("span", { class: "cfl-box", hidden: true });
    belt = h("div", { class: "cfl-belt" }, [
      h("div", { class: "cfl-belt-line" }),
      h("div", { class: "cfl-gate", style: { left: "33%" } }, [h("code", { text: ".map { it * 10 }" })]),
      h("div", { class: "cfl-gate cfl-gate-low", style: { left: "66%" } }, [h("code", { text: ".filter { it > 20 }" })]),
      box
    ]);
    ui.stage.appendChild(h("div", { class: "cfl-belt-wrap" }, [prod, belt, coll]));
    ui.code.set([
      "flow {",
      "    for (i in 1..5) {",
      "        delay(1000)",
      "        emit(i)          // espera aquí hasta que collect termine con el valor",
      "    }",
      "}",
      "    .map { it * 10 }",
      "    .filter { it > 20 }",
      "    .collect { println(it) }"
    ].join("\n"));
    ui.hint.textContent = "El 1 y el 2 se convierten en 10 y 20 y se caen en filter: no llegan al consumidor. Fíjate en que nunca hay dos valores a la vez en la cinta: emit() no vuelve hasta que el valor ha terminado su recorrido.";

    var clock = flowClock(root, function (now) {
      if (!run) reset(now);
      var it = run.item;
      if (!it && !run.done && now >= run.waitUntil) {
        run.n += 1;
        run.item = it = { v: run.n, mapped: false, start: now, drop: null };
        box.hidden = false;
        box.className = "cfl-box";
        status.textContent = "emit(" + run.n + ")";
      }
      if (it) {
        var x = (now - it.start) / 2600;
        if (!it.mapped && x >= 0.33) { it.mapped = true; it.v = it.v * 10; box.classList.add("cfl-mapped"); }
        if (it.mapped && it.drop === null && x >= 0.66 && it.v <= 20) it.drop = now;
        box.textContent = String(it.v);
        if (it.drop !== null) {
          var d = (now - it.drop) / 700;
          box.style.left = "66%";
          box.style.transform = "translate(-50%, " + (-50 + d * 120) + "%)";
          box.style.opacity = String(Math.max(0, 1 - d));
          if (d >= 1) finish(now, null);
        } else {
          box.style.left = Math.min(x, 1) * 100 + "%";
          box.style.transform = "translate(-50%, -50%)";
          box.style.opacity = "1";
          if (x >= 1) finish(now, it.v);
        }
      }
      if (run.done && run.restartAt !== null && now >= run.restartAt) reset(now);
    });
    clock.paused = reducedMotion();

    function finish(now, value) {
      box.hidden = true;
      if (value !== null) list.appendChild(h("code", { text: "println(" + value + ")" }));
      run.item = null;
      if (run.n >= 5) {
        run.done = true;
        run.restartAt = now + 3000;
        status.textContent = "fin del bucle";
        list.appendChild(h("span", { class: "cfl-done", text: "✔ collect termina" }));
      } else {
        run.waitUntil = now + 1000;
        status.textContent = "delay(1000)…";
      }
    }

    renderControls();
  }

  // ---- Playground: la cinta de operadores (diagrama de canicas en vivo)

  var FL_SOURCES = {
    radar: {
      label: "Radar", code: "radarAutovia()",
      values: [115, 118, 120, 142, 119, 155, 120, 168], gaps: [600, 250, 600, 1300, 250, 1300, 600, 1000],
      filter: { code: ".filter { it > 120 }", fn: function (v) { return v > 120; } },
      map: { code: ".map { (it - 120) * 10 }", fn: function (v) { return (v - 120) * 10; } }
    },
    dado: {
      label: "Dado", code: "tiradas   // Flow<Int>: un valor por cada tirada",
      filter: { code: ".filter { it % 2 == 0 }", fn: function (v) { return v % 2 === 0; } },
      map: { code: ".map { it * 10 }", fn: function (v) { return v * 10; } }
    },
    texto: {
      label: "Buscador", code: "textoBuscado   // Flow<String>: el texto tras cada tecla",
      filter: { code: ".filter { it.length >= 3 }", fn: function (v) { return v.length >= 3; } },
      map: { code: ".map { it.uppercase() }", fn: function (v) { return v.toUpperCase(); } }
    }
  };

  var FL_OPS = [
    { value: "", label: "(ninguno)" },
    { value: "filter", label: "filter" },
    { value: "map", label: "map" },
    { value: "take2", label: "take(2)" },
    { value: "debounce", label: "debounce(300)" },
    { value: "distinct", label: "distinctUntilChanged()" }
  ];

  var FL_OP_HINTS = {
    filter: "filter deja pasar solo los valores que cumplen la condición: los demás desaparecen de los carriles de abajo.",
    map: "map transforma cada valor en otro, uno por uno: el número de canicas no cambia. Prueba a ponerlo antes o después de filter: el orden importa.",
    take2: "take(2) entrega dos valores, termina y cancela el flujo de arriba: el radar deja de emitir y el dado o el buscador ya no hacen nada.",
    debounce: "debounce(300) espera 300 ms de silencio antes de dejar pasar el último valor. Teclea deprisa en el buscador: solo pasa el texto en el que te detienes.",
    distinct: "distinctUntilChanged() descarta un valor si es igual al anterior. Tira el dado varias veces hasta que repita."
  };

  function flowOperatorsPlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = { src: "radar", ops: ["filter", "map", ""] };
    var ui = shell(root, "Playground: la cinta de operadores", "Elige una fuente y encadena operadores: cada carril muestra lo que sale de cada uno");
    var lanes, stages, src, out, extra;

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(segmented("Fuente", Object.keys(FL_SOURCES).map(function (k) { return { value: k, label: FL_SOURCES[k].label }; }),
        state.src, function (v) { state.src = v; restart(); }));
      [0, 1, 2].forEach(function (i) {
        ui.controls.appendChild(select("Operador " + (i + 1), FL_OPS, state.ops[i], function (v) { state.ops[i] = v; restart(); }));
      });
      var p = h("button", { type: "button", text: clock.paused ? "▶ Reanudar" : "⏸ Pausa" });
      p.addEventListener("click", function () { clock.paused = !clock.paused; renderControls(); });
      var r = h("button", { type: "button", text: "↺ Reiniciar" });
      r.addEventListener("click", restart);
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Tiempo" }), h("div", { class: "cpg-seg" }, [p, r])]));
    }

    function opCode(op) {
      var s = FL_SOURCES[state.src];
      return { filter: s.filter.code, map: s.map.code, take2: ".take(2)", debounce: ".debounce(300)", distinct: ".distinctUntilChanged()" }[op];
    }

    // Cada etapa recibe valores (push) y avisa del final (complete) a la siguiente.
    function makeStage(op, lane, next, cancelUpstream) {
      var s = FL_SOURCES[state.src];
      var st = { push: null, complete: null, tick: function () {} };
      var closed = false;
      function pass(v) { lane.add(v, clock.now); next.push(v); }
      st.complete = function () { if (closed) return; closed = true; lane.end(clock.now); next.complete(); };
      st.cancel = function () { if (closed) return; closed = true; lane.end(clock.now, "cancelado"); };
      if (op === "filter") st.push = function (v) { if (s.filter.fn(v)) pass(v); };
      else if (op === "map") st.push = function (v) { pass(s.map.fn(v)); };
      else if (op === "take2") {
        var count = 0;
        st.push = function (v) {
          if (closed) return;
          count += 1;
          pass(v);
          if (count >= 2) { st.complete(); cancelUpstream(); }
        };
      } else if (op === "distinct") {
        var has = false, last;
        st.push = function (v) { if (has && v === last) return; has = true; last = v; pass(v); };
      } else if (op === "debounce") {
        var pending = null, due = 0;
        st.push = function (v) { pending = { v: v }; due = clock.now + 300; };
        st.tick = function (now) { if (pending && now >= due) { var v = pending.v; pending = null; pass(v); } };
        st.complete = function () {
          if (closed) return;
          if (pending) { var v = pending.v; pending = null; pass(v); }
          closed = true; lane.end(clock.now); next.complete();
        };
      }
      return st;
    }

    function restart() {
      ui.stage.innerHTML = "";
      var s = FL_SOURCES[state.src];
      var area = h("div", { class: "cfl-area" });
      extra = h("div", { class: "cfl-input" });
      out = h("pre", { class: "cpc-koin-log cfl-console" });
      ui.stage.appendChild(h("div", { class: "cfl-col" }, [area, extra,
        h("p", { class: "cpc-navstack-title", text: "Consola (lo que hace collect con cada valor)" }), out]));
      lanes = marbleLanes(area);
      var active = state.ops.filter(Boolean);
      var srcLane = lanes.lane(s.code.split("   ")[0], "cfl-l-src");
      var collector = {
        push: function (v) { out.textContent += v + "\n"; out.scrollTop = out.scrollHeight; },
        complete: function () { out.textContent += "— collect termina —\n"; }
      };
      stages = [];
      var next = collector;
      var laneObjs = active.map(function (op, i) { return lanes.lane(opCode(op), i === active.length - 1 ? "cfl-l-out" : "cfl-l-op"); });
      for (var j = active.length - 1; j >= 0; j--) {
        stages[j] = makeStage(active[j], laneObjs[j], next, (function (j) {
          // take cancela todo lo que tiene por encima: la fuente y los operadores anteriores
          return function () {
            src.cancel();
            for (var k = 0; k < j; k++) { stages[k].cancel(); }
          };
        })(j));
        next = stages[j];
      }
      var first = next;
      src = {
        cancelled: false, done: false, i: 0, nextAt: clock.now + (s.gaps ? s.gaps[0] : 0),
        emit: function (v) {
          if (this.cancelled || this.done) return;
          srcLane.add(v, clock.now);
          first.push(v);
        },
        cancel: function () { if (this.cancelled || this.done) return; this.cancelled = true; srcLane.end(clock.now, "cancelado"); },
        finish: function () { this.done = true; srcLane.end(clock.now); first.complete(); }
      };
      if (state.src === "dado") {
        var b = h("button", { type: "button", text: "🎲 Tirar el dado" });
        b.addEventListener("click", function () { src.emit(1 + Math.floor(Math.random() * 6)); });
        extra.appendChild(b);
      } else if (state.src === "texto") {
        var input = h("input", { type: "text", class: "cpg-input", placeholder: "Escribe un juego, por ejemplo hades", "aria-label": "Texto del buscador" });
        input.addEventListener("input", function () { src.emit(input.value); });
        extra.appendChild(input);
      } else {
        extra.appendChild(h("span", { class: "cpg-label", text: "El radar emite solo, con pausas irregulares, y termina tras 8 lecturas." }));
      }
      clock.now = 0;
      src.nextAt = s.gaps ? s.gaps[0] : 0;
      out.textContent = "";
      renderCode(active);
      renderHint(active);
      if (clock.paused) { clock.paused = false; }
      renderControls();
    }

    function renderCode(active) {
      var s = FL_SOURCES[state.src];
      var lines = [s.code];
      active.forEach(function (op) { lines.push("    " + opCode(op)); });
      lines.push("    .collect { println(it) }");
      ui.code.set(lines.join("\n"));
    }

    function renderHint(active) {
      var parts = active.filter(function (op, i) { return active.indexOf(op) === i; }).map(function (op) { return FL_OP_HINTS[op]; });
      ui.hint.textContent = parts.length ? parts.join(" ") : "Sin operadores, collect recibe exactamente lo que emite la fuente. Añade alguno para ver cómo cambia cada carril.";
    }

    var clock = flowClock(root, function (now) {
      if (!src) return;
      var s = FL_SOURCES[state.src];
      if (s.values && !src.cancelled && !src.done && now >= src.nextAt) {
        src.emit(s.values[src.i]);
        src.i += 1;
        if (src.i >= s.values.length) src.finish();
        else src.nextAt = now + s.gaps[src.i];
      }
      stages.forEach(function (st) { st.tick(now); });
      lanes.update(now);
    });

    restart();
  }

  // ---- Playground: frío, caliente y StateFlow

  var FL_KINDS = [
    { value: "frio", label: "flow { } (frío)" },
    { value: "state", label: "StateFlow" },
    { value: "shared0", label: "SharedFlow (replay = 0)" },
    { value: "shared1", label: "SharedFlow (replay = 1)" }
  ];

  function flowHotPlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = { kind: "state", auto: true, slow: false };
    var ui = shell(root, "Playground: frío, caliente y StateFlow", "Suscribe y cancela a A, B y C en distintos momentos: mira qué recibe cada uno");
    var lanes, srcLane, subs, rt;
    var NAMES = ["A", "B", "C"];
    var SLOW = 2500;

    function isShared() { return state.kind === "shared0" || state.kind === "shared1"; }

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(select("Tipo de flujo", FL_KINDS, state.kind, function (v) { state.kind = v; restart(); }));
      if (state.kind !== "frio") {
        ui.controls.appendChild(yesNo(state.kind === "state" ? "Cambiar el valor solo, cada segundo" : "Emitir un evento solo, cada segundo", state.auto, function (v) { state.auto = v; rt.nextAuto = clock.now + 1000; renderControls(); }));
        var acts = [];
        if (state.kind === "state") {
          var inc = h("button", { type: "button", text: "value = value + 1" });
          inc.addEventListener("click", function () { setValue(rt.value + 1); });
          var same = h("button", { type: "button", text: "value = mismo valor" });
          same.addEventListener("click", function () { setValue(rt.value); });
          acts = [inc, same];
        } else {
          var em = h("button", { type: "button", text: "emit(evento)" });
          em.addEventListener("click", emitEvent);
          acts = [em];
        }
        ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Fuente" }), h("div", { class: "cpg-seg" }, acts)]));
      }
      var sb = NAMES.map(function (n) {
        var b = h("button", { type: "button", class: subs[n].active ? "cpg-on" : "", text: (subs[n].active ? "Cancelar " : "Suscribir ") + n });
        b.addEventListener("click", function () { toggle(n); });
        return b;
      });
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Suscriptores (collect)" }), h("div", { class: "cpg-seg" }, sb)]));
      if (!isShared()) {
        ui.controls.appendChild(yesNo("A es un colector lento (tarda 2,5 s en procesar cada valor)", state.slow, function (v) { state.slow = v; renderControls(); renderCode(); }));
      }
      var r = h("button", { type: "button", text: "↺ Reiniciar" });
      r.addEventListener("click", restart);
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: " " }), r]));
    }

    function deliver(sub, v, extra) {
      sub.lane.add(v, clock.now, extra);
      sub.last = v;
      sub.got = true;
      if (state.slow && sub.name === "A" && !isShared()) sub.busyUntil = clock.now + SLOW;
    }

    function setValue(v) {
      if (v === rt.value) { srcLane.add("=", clock.now, "cfl-faded"); return; }
      rt.value = v;
      srcLane.add(v, clock.now);
      NAMES.forEach(function (n) {
        var s = subs[n];
        if (s.active && clock.now >= s.busyUntil) deliver(s, v);
      });
    }

    function emitEvent() {
      rt.events += 1;
      var ev = "★" + rt.events;
      srcLane.add(ev, clock.now);
      rt.lastEvent = ev;
      NAMES.forEach(function (n) { if (subs[n].active) deliver(subs[n], ev); });
    }

    function toggle(n) {
      var s = subs[n];
      if (s.active) {
        s.active = false;
        s.lane.end(clock.now, "cancelado");
      } else {
        s.active = true;
        s.busyUntil = 0;
        s.got = false;
        s.last = undefined;
        s.lane.add("▶", clock.now, "cfl-start");
        if (state.kind === "frio") { s.i = 0; s.nextAt = clock.now + 1000; }
        else if (state.kind === "state") deliver(s, rt.value, "cfl-current");
        else if (state.kind === "shared1" && rt.lastEvent) deliver(s, rt.lastEvent, "cfl-current");
      }
      renderControls();
      renderHint();
    }

    function restart() {
      ui.stage.innerHTML = "";
      rt = { value: 0, events: 0, lastEvent: null, nextAuto: 1000 };
      clock.now = 0;
      var col = h("div", { class: "cfl-col" });
      ui.stage.appendChild(col);
      lanes = marbleLanes(col);
      srcLane = lanes.lane(state.kind === "frio" ? "fuente: no hay (cada uno ejecuta la suya)" : state.kind === "state" ? "_contador (valor)" : "_eventos.emit()", "cfl-l-src");
      subs = {};
      NAMES.forEach(function (n) { subs[n] = { name: n, active: false, busyUntil: 0, lane: lanes.lane(n + (n === "A" ? " (puede ser lento)" : "") + " · collect", "cfl-l-out") }; });
      if (state.kind === "state") srcLane.add(0, 0);
      renderControls();
      renderCode();
      renderHint();
    }

    function renderCode() {
      var lines;
      if (state.kind === "frio") {
        lines = ["val numeros: Flow<Int> = flow {", "    for (i in 0..5) {", "        delay(1000)", "        emit(i)", "    }", "}", "",
          "// Cada suscriptor arranca su propia ejecución:",
          "launch { numeros.collect { " + (state.slow ? "delay(2500); " : "") + "println(\"A: $it\") } }",
          "launch { numeros.collect { println(\"B: $it\") } }"];
      } else if (state.kind === "state") {
        lines = ["private val _contador = MutableStateFlow(0)", "val contador: StateFlow<Int> = _contador.asStateFlow()", "",
          "_contador.value = _contador.value + 1   // si es igual al actual, no emite", "",
          "launch { contador.collect { " + (state.slow ? "delay(2500); " : "") + "println(\"A: $it\") } }",
          "launch { contador.collect { println(\"B: $it\") } }"];
      } else {
        lines = ["private val _eventos = MutableSharedFlow<String>(replay = " + (state.kind === "shared1" ? 1 : 0) + ")",
          "val eventos: SharedFlow<String> = _eventos.asSharedFlow()", "",
          "_eventos.emit(\"★1\")   // suspend: dentro de una corrutina", "",
          "launch { eventos.collect { println(\"A: $it\") } }",
          "launch { eventos.collect { println(\"B: $it\") } }"];
      }
      ui.code.set(lines.join("\n"));
    }

    function renderHint() {
      var t = {
        frio: "Suscribe a A, espera a que vaya por el 3 y suscribe a B: B empieza desde 0, porque cada collect ejecuta el bloque flow { } desde el principio. Con A lento, su productor espera: emit() no vuelve hasta que A termina con el valor.",
        state: "Al suscribirse, cada uno recibe el valor actual (canica con borde grueso). «value = mismo valor» no emite nada. Activa el colector lento: A se salta los valores intermedios y recibe solo el último (conflation).",
        shared0: "Suscribe a B tarde: no recibe ninguno de los eventos anteriores, solo los que llegan después. Sirve para avisos de una sola vez, como un Snackbar.",
        shared1: "Con replay = 1, quien se suscribe tarde recibe el último evento. Para un Snackbar no conviene: al girar el móvil, la pantalla volvería a mostrarlo."
      }[state.kind];
      ui.hint.textContent = t;
    }

    var clock = flowClock(root, function (now) {
      if (!rt) return;
      if (state.kind !== "frio" && state.auto && now >= rt.nextAuto) {
        rt.nextAuto = now + 1000;
        if (state.kind === "state") setValue(rt.value + 1); else emitEvent();
      }
      NAMES.forEach(function (n) {
        var s = subs[n];
        if (!s.active) return;
        if (state.kind === "frio") {
          if (s.i <= 5 && now >= s.nextAt && now >= s.busyUntil) {
            deliver(s, s.i);
            s.i += 1;
            s.nextAt = Math.max(now, s.busyUntil) + 1000;
            if (s.i > 5) { s.active = false; s.lane.end(now + 1, "fin"); renderControls(); }
          }
        } else if (state.kind === "state" && s.busyUntil && now >= s.busyUntil) {
          s.busyUntil = 0;
          if (s.last !== rt.value) deliver(s, rt.value, "cfl-conflated");
        }
      });
      lanes.update(now);
    });

    restart();
  }

  // ------------------------------------- corrutinas (apuntes 51-corrutinas)

  // Carril con tramos (inicio, fin) que se desplaza con el tiempo, como los de canicas.
  function segmentLane(parent, label) {
    var track = h("div", { class: "cfl-track ccr-track" });
    parent.appendChild(h("div", { class: "cfl-lane" }, [h("code", { class: "cfl-label", text: label }), track]));
    var segs = [];
    return {
      open: function (t, cls, text) {
        var el = h("span", { class: "ccr-seg " + cls, text: text || "" });
        track.appendChild(el);
        var s = { el: el, start: t, end: null };
        segs.push(s);
        return s;
      },
      close: function (s, t) { if (s && s.end === null) s.end = t; },
      update: function (now) {
        var offset = Math.max(0, now - FL_WINDOW * 1.6 * 0.92);
        var win = FL_WINDOW * 1.6;
        segs = segs.filter(function (s) {
          var end = s.end === null ? now : s.end;
          var l = (s.start - offset) / win * 100, r = (end - offset) / win * 100;
          if (r < -2) { s.el.remove(); return false; }
          s.el.style.left = Math.max(l, 0) + "%";
          s.el.style.width = Math.max(r - Math.max(l, 0), 0.3) + "%";
          return true;
        });
      }
    };
  }

  var MT_MODES = {
    sleep: {
      label: "Thread.sleep(…) en el hilo principal", block: true,
      code: ["Button(onClick = {", "    Thread.sleep(DURACION)        // ❌ bloquea el hilo principal", "    juegos = cargarJuegos()", "}) {", "    Text(\"Cargar\")", "}"],
      hint: "Mientras dura Thread.sleep, el hilo principal no pinta ni atiende toques: la animación se congela y los toques se quedan en cola. Con 8 s y un toque pendiente, Android muestra el diálogo ANR."
    },
    delay: {
      label: "delay(…) dentro de viewModelScope.launch", block: false,
      code: ["fun cargar() {", "    viewModelScope.launch {          // se ejecuta en Main…", "        delay(DURACION)              // …pero aquí se aparta y deja el hilo libre", "        _uiState.value = Exito(juegos)", "    }", "}"],
      hint: "La corrutina se ejecuta en el hilo principal, pero mientras espera en delay está suspendida: el hilo sigue pintando y atendiendo toques. Es lo que pasa con las llamadas suspend de Room o Retrofit."
    },
    calcMain: {
      label: "Cálculo pesado en el hilo principal", block: true,
      code: ["fun cargar() {", "    viewModelScope.launch {", "        val ordenados = ordenarCatalogoEnorme()   // ❌ cálculo sin suspensiones, en Main", "        _uiState.value = Exito(ordenados)", "    }", "}"],
      hint: "Estar dentro de launch no basta: un cálculo largo no tiene puntos de suspensión, así que ocupa el hilo principal todo el rato y la app se congela igual que con Thread.sleep."
    },
    calcDefault: {
      label: "Cálculo pesado con withContext(Dispatchers.Default)", block: false, worker: true,
      code: ["fun cargar() {", "    viewModelScope.launch {", "        val ordenados = withContext(Dispatchers.Default) {", "            ordenarCatalogoEnorme()               // ✅ el cálculo va a otro hilo", "        }", "        _uiState.value = Exito(ordenados)         // de vuelta en Main", "    }", "}"],
      hint: "withContext(Dispatchers.Default) lleva el cálculo a otro hilo. La corrutina espera suspendida en Main y vuelve sola cuando el cálculo termina: la app responde en todo momento."
    }
  };

  function mainThreadPlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = { mode: "sleep", secs: 3, theme: siteMode() };
    var ui = shell(root, "Playground: no bloquees el hilo principal", "Pulsa «Cargar» y, mientras carga, toca el contador: ¿responde?");
    var rt, phone, lanes, mainLane, coLane, bgLane, els = {};

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(select("Cómo se hace la carga", Object.keys(MT_MODES).map(function (k) { return { value: k, label: MT_MODES[k].label }; }),
        state.mode, function (v) { state.mode = v; reset(); }));
      ui.controls.appendChild(segmented("Duración", [{ value: "3", label: "3 s" }, { value: "8", label: "8 s" }], String(state.secs), function (v) { state.secs = +v; reset(); }));
      ui.controls.appendChild(modeControl({ get mode() { return state.theme; }, set mode(v) { state.theme = v; } }, function () { buildStage(); }));
    }

    function reset() {
      rt = { phase: "idle", until: 0, taps: 0, pending: [], anr: false, result: null, mainSeg: null, coSeg: null, bgSeg: null };
      renderControls();
      buildStage();
      renderCode();
      ui.hint.textContent = MT_MODES[state.mode].hint;
    }

    function buildStage() {
      ui.stage.innerHTML = "";
      phone = applyScheme(h("div", { class: "cpc-phone ccr-phone" }), state.theme);
      els.spinner = h("span", { class: "cpc-sem-spinner ccr-spin" });
      els.count = h("span", { class: "ccr-count", text: "0" });
      els.status = h("p", { class: "ccr-status" });
      var plus = h("button", { type: "button", class: "ccr-tap", "aria-label": "Sumar un toque" }, [h("span", { text: "👆 Tócame" })]);
      plus.addEventListener("click", tap);
      els.load = h("button", { type: "button", class: "ccr-load", text: "Cargar" });
      els.load.addEventListener("click", load);
      els.anr = h("div", { class: "ccr-anr", hidden: true }, [
        h("p", { class: "ccr-anr-title", text: "Mis juegos no responde" }),
        h("p", { text: "¿Quieres cerrar la app?" })
      ]);
      var wait = h("button", { type: "button", text: "Esperar" });
      wait.addEventListener("click", function () { els.anr.hidden = true; rt.anrDismissed = true; });
      var close = h("button", { type: "button", text: "Cerrar la app" });
      close.addEventListener("click", reset);
      els.anr.appendChild(h("div", { class: "ccr-anr-actions" }, [wait, close]));
      phone.appendChild(h("div", { class: "cpc-nav-screen" }, [
        h("div", { class: "cpc-phone-bar cpc-bar-nav" }, [h("span", { class: "cpc-appbar-gap" }), h("span", { class: "cpc-appbar-title", text: "Mis juegos" })]),
        h("div", { class: "ccr-body" }, [
          h("div", { class: "ccr-anim" }, [els.spinner, h("small", { text: "animación (se pinta 60 veces por segundo)" })]),
          h("div", { class: "ccr-counter" }, [plus, h("span", { text: "Toques: " }), els.count]),
          els.load, els.status
        ]),
        els.anr
      ]));
      var side = h("div", { class: "cpc-koin-side ccr-side" });
      lanes = h("div", { class: "cfl-lanes" });
      side.appendChild(h("p", { class: "cpc-navstack-title", text: "Qué hace cada hilo" }));
      side.appendChild(lanes);
      mainLane = segmentLane(lanes, "hilo principal (Main)");
      coLane = segmentLane(lanes, "la corrutina");
      bgLane = segmentLane(lanes, "Dispatchers.Default");
      side.appendChild(h("p", { class: "ccr-legend" }, [h("span", { class: "ccr-seg ccr-free" }), h("span", { text: " libre: pinta y responde  " }),
        h("span", { class: "ccr-seg ccr-block" }), h("span", { text: " bloqueado  " }), h("span", { class: "ccr-seg ccr-wait" }), h("span", { text: " suspendida  " }),
        h("span", { class: "ccr-seg ccr-work" }), h("span", { text: " trabajando" })]));
      ui.stage.appendChild(h("div", { class: "cpc-nav-layout" }, [h("div", { class: "cpc-col" }, [phone]), side]));
      rt.mainSeg = mainLane.open(clock ? clock.now : 0, "ccr-free");
      draw();
    }

    function blocked() { return rt.phase === "busy" && MT_MODES[state.mode].block; }

    function tap() {
      if (blocked()) { rt.pending.push(clock.now); draw(); return; }
      rt.taps += 1;
      draw();
    }

    function load() {
      if (rt.phase === "busy") { tap(); return; }
      var m = MT_MODES[state.mode];
      var now = clock.now;
      rt.phase = "busy";
      rt.until = now + state.secs * 1000;
      rt.anrDismissed = false;
      rt.result = null;
      if (m.block) {
        mainLane.close(rt.mainSeg, now);
        rt.mainSeg = mainLane.open(now, "ccr-block", m.label.indexOf("sleep") >= 0 ? "Thread.sleep" : "cálculo");
        rt.coSeg = m.label.indexOf("sleep") >= 0 ? null : coLane.open(now, "ccr-work", "calculando en Main");
      } else {
        rt.coSeg = coLane.open(now, "ccr-wait", m.worker ? "suspendida en withContext" : "suspendida en delay");
        if (m.worker) rt.bgSeg = bgLane.open(now, "ccr-work", "ordenando");
      }
      draw();
    }

    function finish(now) {
      var m = MT_MODES[state.mode];
      rt.phase = "idle";
      if (m.block) { mainLane.close(rt.mainSeg, now); rt.mainSeg = mainLane.open(now, "ccr-free"); }
      coLane.close(rt.coSeg, now);
      bgLane.close(rt.bgSeg, now);
      if (rt.pending.length) {
        rt.taps += rt.pending.length;
        rt.result = rt.pending.length === 1 ? "Se ha procesado de golpe el toque que estaba en cola."
          : "Se han procesado de golpe los " + rt.pending.length + " toques que estaban en cola.";
      }
      rt.pending = [];
      els.anr.hidden = true;
      rt.loaded = true;
      draw();
    }

    function draw() {
      if (!els.count) return;
      els.count.textContent = String(rt.taps) + (rt.pending.length ? " (+" + rt.pending.length + " en cola)" : "");
      els.spinner.classList.toggle("ccr-frozen", blocked());
      els.load.disabled = rt.phase === "busy";
      els.load.textContent = rt.phase === "busy" ? "Cargando…" : "Cargar";
      els.status.textContent = rt.phase === "busy" ? (blocked() ? "⛔ El hilo principal está ocupado" : "⏳ Esperando… la app sigue respondiendo")
        : rt.result ? "✓ 3 juegos cargados. " + rt.result : rt.loaded ? "✓ 3 juegos cargados." : "Pulsa «Cargar».";
    }

    function renderCode() {
      ui.code.set(MT_MODES[state.mode].code.join("\n").replace("DURACION", state.secs * 1000));
    }

    var clock = flowClock(root, function (now) {
      if (!rt) return;
      if (rt.phase === "busy" && now >= rt.until) finish(now);
      if (blocked() && rt.pending.length && !rt.anrDismissed && els.anr.hidden && now - rt.pending[0] >= 5000) els.anr.hidden = false;
      if (mainLane) { mainLane.update(now); coLane.update(now); bgLane.update(now); }
    });

    reset();
  }

  // ---- Playground: async, await y cancelación

  var CR_TASKS = [
    { id: "catalogo", label: "catalogo()", ms: 2000 },
    { id: "amigos", label: "amigos()", ms: 1500 },
    { id: "logros", label: "logros()", ms: 1000 }
  ];

  var CR_MODES = [
    { value: "seq", label: "Secuencial" },
    { value: "async", label: "async + await al final" },
    { value: "fake", label: "async { }.await()" }
  ];

  function coroutinesPlayground(root) {
    root.classList.add("cpc-pg-full");
    var state = { mode: "async", fail: false };
    var ui = shell(root, "Playground: async, await y cancelación", "Elige cómo se piden las tres descargas y pulsa «Ejecutar»");
    var rt, rows, parentRow, log, totalEl, cancelBtn;
    var SCALE = 5000;

    function renderControls() {
      ui.controls.innerHTML = "";
      ui.controls.appendChild(segmented("Cómo se piden", CR_MODES, state.mode, function (v) { state.mode = v; reset(); }));
      ui.controls.appendChild(yesNo("amigos() lanza una excepción a mitad", state.fail, function (v) { state.fail = v; reset(); }));
      var run = h("button", { type: "button", text: "▶ Ejecutar" });
      run.addEventListener("click", start);
      cancelBtn = h("button", { type: "button", text: "✕ Cancelar el scope" });
      cancelBtn.addEventListener("click", cancelAll);
      ui.controls.appendChild(h("div", { class: "cpg-field" }, [h("span", { class: "cpg-label", text: "Acciones" }), h("div", { class: "cpg-seg" }, [run, cancelBtn])]));
    }

    function row(parent, label) {
      var bar = h("span", { class: "ccr-bar" });
      var tag = h("span", { class: "ccr-tag" });
      var track = h("div", { class: "ccr-ttrack" }, [bar, tag]);
      parent.appendChild(h("div", { class: "cfl-lane" }, [h("code", { class: "cfl-label", text: label }), track]));
      return { bar: bar, tag: tag };
    }

    function reset() {
      rt = { running: false, t0: 0, tasks: CR_TASKS.map(function (t) { return { def: t, start: null, end: null, status: "pending" }; }), parent: "idle", end: null };
      renderControls();
      ui.stage.innerHTML = "";
      var col = h("div", { class: "cfl-col" });
      ui.stage.appendChild(col);
      var lanes = h("div", { class: "cfl-lanes" });
      col.appendChild(lanes);
      parentRow = row(lanes, "launch { cargarPantalla() }  ← padre");
      rows = CR_TASKS.map(function (t) { return row(lanes, (state.mode === "seq" ? "" : "async { ") + t.label + (state.mode === "seq" ? "" : " }") + "  · " + t.ms / 1000 + " s"); });
      var scale = h("div", { class: "ccr-scale" });
      for (var s = 0; s <= 5; s++) scale.appendChild(h("span", { style: { left: s * 20 + "%" }, text: s + " s" }));
      col.appendChild(h("div", { class: "cfl-lane" }, [h("span"), scale]));
      totalEl = h("p", { class: "ccr-total" });
      log = h("pre", { class: "cpc-koin-log cfl-console" });
      col.appendChild(totalEl);
      col.appendChild(h("p", { class: "cpc-navstack-title", text: "Consola" }));
      col.appendChild(log);
      renderCode();
      renderHint();
      draw(0);
    }

    function say(t, msg) { log.textContent += "[" + (t / 1000).toFixed(1).replace(".", ",") + " s] " + msg + "\n"; log.scrollTop = log.scrollHeight; }

    function start() {
      reset();
      rt.running = true;
      rt.t0 = clock.now;
      rt.parent = "running";
      say(0, "launch: empieza cargarPantalla()");
      if (state.mode === "async") rt.tasks.forEach(function (t) { begin(t, 0); });
      else begin(rt.tasks[0], 0);
    }

    function begin(t, at) {
      t.start = at;
      t.status = "running";
      t.failAt = state.fail && t.def.id === "amigos" ? at + t.def.ms / 2 : null;
      say(at, t.def.label + " empieza");
    }

    function stopRun(at) {
      rt.running = false;
      rt.end = at;
    }

    function cancelAll() {
      if (!rt.running) return;
      var at = clock.now - rt.t0;
      say(at, "✕ scope.cancel(): la cancelación baja a todos los hijos");
      rt.tasks.forEach(function (t) {
        if (t.status === "running") { t.status = "cancelled"; t.end = at; say(at, "  " + t.def.label + " cancelada"); }
        else if (t.status === "pending") { t.status = "never"; }
      });
      rt.parent = "cancelled";
      stopRun(at);
    }

    function fail(t, at) {
      t.status = "failed";
      t.end = at;
      say(at, "💥 " + t.def.label + " lanza IOException");
      rt.tasks.forEach(function (o) {
        if (o !== t && o.status === "running") { o.status = "cancelled"; o.end = at; say(at, "  " + o.def.label + " cancelada por su hermana"); }
        else if (o.status === "pending") o.status = "never";
      });
      say(at, "el error sube al padre: cargarPantalla() también falla");
      rt.parent = "failed";
      stopRun(at);
    }

    function tick(now) {
      if (!rt.running) return;
      var at = now - rt.t0;
      rt.tasks.forEach(function (t, i) {
        if (t.status !== "running") return;
        if (t.failAt !== null && at >= t.failAt) { fail(t, t.failAt); return; }
        if (at >= t.start + t.def.ms) {
          t.status = "done";
          t.end = t.start + t.def.ms;
          say(t.end, t.def.label + " termina" + (state.mode === "async" ? " (su resultado espera al await)" : ""));
          if (state.mode !== "async" && rt.tasks[i + 1]) begin(rt.tasks[i + 1], t.end);
        }
      });
      if (rt.running && rt.tasks.every(function (t) { return t.status === "done"; })) {
        var end = Math.max.apply(null, rt.tasks.map(function (t) { return t.end; }));
        say(end, "todos los await han vuelto: se pinta la pantalla");
        rt.parent = "done";
        stopRun(end);
      }
    }

    function place(r, from, to, cls, text) {
      if (from === null) { r.bar.style.width = "0"; r.tag.textContent = text || ""; r.tag.style.left = "0"; r.bar.className = "ccr-bar"; return; }
      r.bar.className = "ccr-bar " + cls;
      r.bar.style.left = from / SCALE * 100 + "%";
      r.bar.style.width = Math.max((to - from) / SCALE * 100, 0.4) + "%";
      r.tag.style.left = Math.min(to / SCALE * 100 + 1, 82) + "%";
      r.tag.textContent = text || "";
    }

    function draw(at) {
      rt.tasks.forEach(function (t, i) {
        var to = t.end !== null ? t.end : at;
        var txt = { pending: "", running: "", done: "✓", cancelled: "✕ cancelada", failed: "💥 excepción", never: "no llega a empezar" }[t.status];
        if (t.start === null) place(rows[i], null, null, "", txt);
        else place(rows[i], t.start, to, "ccr-" + t.status, txt);
      });
      if (rt.parent === "idle") place(parentRow, null, null, "", "");
      else place(parentRow, 0, rt.end !== null ? rt.end : at, "ccr-parent-" + rt.parent, { running: "", done: "✓", cancelled: "✕ cancelado", failed: "💥 falla" }[rt.parent]);
      totalEl.textContent = rt.end !== null ? "Tiempo total: " + (rt.end / 1000).toFixed(1).replace(".", ",") + " s" : rt.running ? "Ejecutando…" : "";
      cancelBtn.disabled = !rt.running;
    }

    function renderCode() {
      var lines = ["viewModelScope.launch {"];
      if (state.mode === "seq") {
        lines.push("    val catalogo = catalogo()   // espera 2 s", "    val amigos = amigos()       // y después 1,5 s", "    val logros = logros()       // y después 1 s");
      } else if (state.mode === "async") {
        lines.push("    val c = async { catalogo() }   // las tres empiezan ya", "    val a = async { amigos() }", "    val l = async { logros() }",
          "    pintar(c.await(), a.await(), l.await())   // se espera al final");
      } else {
        lines.push("    val catalogo = async { catalogo() }.await()   // ❌ espera aquí", "    val amigos = async { amigos() }.await()", "    val logros = async { logros() }.await()");
      }
      if (state.mode !== "async") lines.push("    pintar(catalogo, amigos, logros)");
      lines.push("}");
      ui.code.set(lines.join("\n"));
    }

    function renderHint() {
      var t = {
        seq: "Cada llamada suspend espera a la anterior: el tiempo total es la suma (4,5 s). Es lo correcto cuando una tarea necesita el resultado de la otra.",
        async: "Las tres empiezan a la vez y el tiempo total es el de la más lenta (2 s). Prueba a cancelar el scope a mitad, o activa el fallo de amigos(): sus hermanas se cancelan.",
        fake: "Como cada await va justo después de su async, la corrutina espera a que termine cada tarea antes de lanzar la siguiente: el mismo tiempo que en secuencial (4,5 s)."
      }[state.mode];
      ui.hint.textContent = t;
    }

    var clock = flowClock(root, function (now) {
      if (!rt) return;
      tick(now);
      draw(rt.running ? now - rt.t0 : rt.end || 0);
    });

    reset();
  }

  // --------------------------------------------------------------- arranque

  var PLAYGROUNDS = {
    buttons: buttonsPlayground,
    textfield: textFieldPlayground,
    selection: selectionPlayground,
    overlays: overlaysPlayground,
    drawer: drawerPlayground,
    topappbar: topAppBarPlayground,
    snackbar: snackbarPlayground,
    lazylist: lazyListPlayground,
    lazygrid: lazyGridPlayground,
    navigation: navPlayground,
    adaptive: adaptivePlayground,
    koin: koinPlayground,
    semantics: semanticsPlayground,
    flowbelt: flowBeltPlayground,
    flowops: flowOperatorsPlayground,
    flowhot: flowHotPlayground,
    mainthread: mainThreadPlayground,
    coroutines: coroutinesPlayground
  };

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
