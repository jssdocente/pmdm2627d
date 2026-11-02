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
      error: "#B3261E", onError: "#FFFFFF", scrim: "rgba(0, 0, 0, 0.32)"
    },
    dark: {
      primary: "#D0BCFF", onPrimary: "#381E72", primaryContainer: "#4F378B", onPrimaryContainer: "#EADDFF",
      secondaryContainer: "#4A4458", onSecondaryContainer: "#E8DEF8",
      surface: "#141218", onSurface: "#E6E0E9", onSurfaceVariant: "#CAC4D0",
      surfaceContainerLow: "#1D1B20", surfaceContainer: "#211F26", surfaceContainerHigh: "#2B2930",
      surfaceContainerHighest: "#36343B", outline: "#938F99", outlineVariant: "#49454F",
      error: "#F2B8B5", onError: "#601410", scrim: "rgba(0, 0, 0, 0.32)"
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

  // --------------------------------------------------------------- arranque

  var PLAYGROUNDS = {
    buttons: buttonsPlayground,
    textfield: textFieldPlayground,
    selection: selectionPlayground,
    overlays: overlaysPlayground,
    drawer: drawerPlayground
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
