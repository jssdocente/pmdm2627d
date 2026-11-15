/*
 * Conceptos animados para MkDocs
 * ------------------------------
 * Animaciones paso a paso: a la izquierda el código, con la línea activa
 * resaltada; a la derecha, lo que ocurre; debajo, una frase que lo explica.
 *
 * Uso en un .md:
 *   <div class="cpa" data-cpa="viewmodel"></div>  -> qué es un ViewModel y cuánto vive (apuntes 3C.1)
 *
 * Es una aproximación didáctica: dibuja lo que pasa, no ejecuta Android.
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------- utilidades

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Resaltado mínimo de Kotlin: comentarios, cadenas, palabras clave y números.
  var KT = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(val|var|fun|class|data|object|private|override|return|if|else|while|true|false|null|init)\b|\b(\d[\d_]*)\b/g;

  function kotlin(line) {
    var out = "", last = 0, m;
    KT.lastIndex = 0;
    while ((m = KT.exec(line))) {
      out += esc(line.slice(last, m.index));
      var cls = m[1] ? "com" : m[2] ? "str" : m[3] ? "kw" : "num";
      out += '<span class="cpa-' + cls + '">' + esc(m[0]) + "</span>";
      last = KT.lastIndex;
    }
    return out + esc(line.slice(last));
  }

  // ------------------------------------------------------- motor paso a paso

  function stepper(root, cfg) {
    root.innerHTML =
      '<div class="cpa-title">' + esc(cfg.title) + "<span>" + esc(cfg.subtitle) + "</span></div>" +
      '<div class="cpa-body"><div class="cpa-code" role="region" aria-label="Código"></div>' +
      '<div class="cpa-scene" aria-live="polite"></div></div>' +
      '<div class="cpa-foot"><p class="cpa-caption"></p><div class="cpa-ctrl">' +
      '<button type="button" class="b-prev" aria-label="Paso anterior">◀</button>' +
      '<button type="button" class="pri b-next">▶ Siguiente</button>' +
      '<button type="button" class="b-play">⏵ Reproducir</button>' +
      '<button type="button" class="b-reset" aria-label="Volver al principio">⟲</button>' +
      '<div class="cpa-dots"></div></div></div>';

    var code = root.querySelector(".cpa-code");
    var scene = root.querySelector(".cpa-scene");
    var caption = root.querySelector(".cpa-caption");
    var dots = root.querySelector(".cpa-dots");
    var bPrev = root.querySelector(".b-prev");
    var bNext = root.querySelector(".b-next");
    var bPlay = root.querySelector(".b-play");
    var i = -1, timer = null;

    code.innerHTML = cfg.code.map(function (l) {
      return '<span class="cpa-ln">' + (kotlin(l) || " ") + "</span>";
    }).join("");
    var lines = code.children;

    cfg.steps.forEach(function (_, k) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Paso " + (k + 1));
      d.onclick = function () { stop(); go(k); };
      dots.appendChild(d);
    });

    function go(k) {
      var prev = i >= 0 && k > i ? cfg.steps[i].s : null;
      i = k;
      var st = cfg.steps[k];
      for (var n = 0; n < lines.length; n++) {
        lines[n].className = "cpa-ln" + ((st.hl || []).indexOf(n) >= 0 ? " on" : "");
      }
      if (st.hl && st.hl.length && lines[st.hl[0]]) {
        var ln = lines[st.hl[0]];
        code.scrollTop = Math.max(0, ln.offsetTop - code.clientHeight / 2);
      }
      caption.innerHTML = st.txt;
      cfg.render(scene, st.s, prev);
      Array.prototype.forEach.call(dots.children, function (d, n) {
        d.className = n === k ? "on" : "";
      });
      bPrev.disabled = k === 0;
      bNext.disabled = k === cfg.steps.length - 1;
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; bPlay.textContent = "⏵ Reproducir"; }
    }

    bPrev.onclick = function () { stop(); if (i > 0) go(i - 1); };
    bNext.onclick = function () { stop(); if (i < cfg.steps.length - 1) go(i + 1); };
    root.querySelector(".b-reset").onclick = function () { stop(); i = -1; go(0); };
    bPlay.onclick = function () {
      if (timer) { stop(); return; }
      bPlay.textContent = "⏸ Pausa";
      if (i === cfg.steps.length - 1) { i = -1; go(0); }
      timer = setInterval(function () {
        if (i >= cfg.steps.length - 1) { stop(); return; }
        go(i + 1);
      }, 4200);
    };
    go(0);
  }

  // ------------------------------------------------- ViewModel: qué y cuánto

  var VM_CODE = [
    "class FichaJuegoViewModel : ViewModel() {",
    "    private val _uiState = MutableStateFlow(FichaJuegoUiState())",
    "    init { Log.d(\"VM\", \"creado\") }",
    "    fun onSumarPartida() {",
    "        _uiState.update { it.copy(partidas = it.partidas + 1) }",
    "        viewModelScope.launch { … }   // una corrutina del ViewModel",
    "    }",
    "    override fun onCleared() { Log.d(\"VM\", \"onCleared\") }",
    "}",
    "",
    "@Composable",
    "fun FichaJuegoApp() {",
    "    var toques by remember { mutableIntStateOf(0) }",
    "    var toquesG by rememberSaveable { mutableIntStateOf(0) }",
    "    val viewModel: FichaJuegoViewModel = viewModel()",
    "    …",
    "}",
    "",
    "// Navigation 3: un almacén por entrada de la pila",
    "entryDecorators = listOf(",
    "    rememberSaveableStateHolderNavEntryDecorator(),",
    "    rememberViewModelStoreNavEntryDecorator()",
    ")"
  ];

  function slot(label, value, cls) {
    return '<div class="cpa-slot ' + (cls || "") + '"><span>' + label + "</span><b>" + value + "</b></div>";
  }

  function renderViewModel(sc, s, prev) {
    if (s.ents) {
      var obj = function (id, j) {
        return '<div class="cpa-obj"><b>DetalleViewModel ' + id + "</b><br>juegoId = " + j + "</div>";
      };
      sc.innerHTML =
        '<div class="cpa-ents"><div><h4>Con el decorador</h4>' +
        '<div class="cpa-store"><div class="cpa-lbl">almacén de Detalle(1)</div>' + obj("@a1", 1) + "</div>" +
        '<div class="cpa-store"><div class="cpa-lbl">almacén de Detalle(7)</div>' + obj("@b7", 7) + "</div>" +
        '<p class="cpa-note ok">Cada entrada, su ViewModel. Al sacarla de la pila, su almacén se vacía y llega onCleared().</p></div>' +
        '<div><h4>Sin el decorador</h4>' +
        '<div class="cpa-store"><div class="cpa-lbl">almacén de la Activity, uno para todo</div>' + obj("@a1", 1) +
        '<p class="cpa-note">Detalle(7) pide un DetalleViewModel: ya hay uno, y recibe el del juego 1.</p></div>' +
        '<p class="cpa-note bad">Abres el juego 7 y ves el juego 1. Y ninguno se destruye al volver atrás.</p></div></div>';
      return;
    }
    var a = s.act, vm = s.vm;
    var logs = (s.log || []).map(function (l, k) {
      var nuevo = prev && (prev.log || []).length <= k;
      return '<div class="' + (nuevo ? "new" : "") + '">' + esc(l) + "</div>";
    }).join("") || '<span class="cpa-note">vacío</span>';

    var act =
      '<div class="cpa-act' + (a.dead ? " dead" : "") + (a.isNew && prev ? " pop" : "") + '">' +
      '<div class="cpa-act-h"><span>Activity nº ' + a.n + "</span><span>" + (a.dead ? "destruida" : "en pantalla") + "</span></div>" +
      slot("remember", a.rem, a.rem === "✗" ? "lost" : "") +
      slot("rememberSaveable", a.sav, a.sav === "✗" ? "lost" : "") +
      slot("viewModel()", a.ref || "—", a.ref ? "ref" : "") + "</div>";

    var look = '<div class="cpa-look">' + (s.look
      ? '<span class="arrow">→</span>busca FichaJuego&shy;ViewModel<br><span class="' + s.look.k + '">' + s.look.r + "</span>"
      : "") + "</div>";

    var nuevoVm = prev && vm && (!prev.vm || prev.vm.id !== vm.id);
    var store =
      '<div class="cpa-store' + (s.store ? "" : " gone") + '"><div class="cpa-lbl">' +
      (s.store ? "ViewModelStore · " + s.store : "almacén eliminado") + "</div>" +
      (vm
        ? '<div class="cpa-obj' + (vm.dead ? " dead" : "") + (nuevoVm ? " pop" : "") + '"><b>FichaJuegoViewModel ' + vm.id +
          "</b><br>partidas = " + vm.p + "<br>viewModelScope: " + vm.jobs + "</div>"
        : '<p class="cpa-note">vacío</p>') + "</div>";

    sc.innerHTML =
      '<div class="cpa-vm">' + act + look + store +
      (s.bundle ? '<div class="cpa-bundle">Bundle: toquesG = ' + s.bundle + "</div><div></div><div></div>" : "") +
      '<div class="cpa-log"><div class="cpa-lbl">Logcat · tag:VM</div>' + logs + "</div></div>";
  }

  var VM_ID = "@1a2b", VM_ID2 = "@7f3c";
  var BUSCA_NO = { k: "miss", r: "no está → lo crea" };
  var BUSCA_SI = { k: "hit", r: "¡está! → el mismo" };

  var VM_STEPS = [
    { hl: [0, 8],
      txt: "Un ViewModel es una clase de Kotlin que hereda de <code>ViewModel</code>. Guarda el estado y las reglas de una pantalla. Lo importante es <b>dónde vive</b>: no dentro de la Activity, sino en un almacén aparte.",
      s: { act: { n: 1, rem: 0, sav: 0 }, store: "dueño: la pantalla", vm: null } },
    { hl: [14],
      txt: "La primera vez, <code>viewModel()</code> <b>busca</b> en el almacén un FichaJuegoViewModel. No hay ninguno, así que lo crea y lo guarda allí. Se ejecuta el <code>init</code>.",
      s: { act: { n: 1, rem: 0, sav: 0, ref: VM_ID }, store: "dueño: la pantalla", vm: { id: VM_ID, p: 0, jobs: "sin corrutinas" }, look: BUSCA_NO, log: ["VM: creado " + VM_ID] } },
    { hl: [3, 4, 5, 12, 13],
      txt: "Pulsas tres veces. Las tres cajas valen 3 y el ViewModel ha lanzado una corrutina. Cada recomposición vuelve a llamar a <code>viewModel()</code>: <b>lo encuentra</b> y devuelve el mismo objeto. No se crea ninguno nuevo.",
      s: { act: { n: 1, rem: 3, sav: 3, ref: VM_ID }, store: "dueño: la pantalla", vm: { id: VM_ID, p: 3, jobs: "1 corrutina activa" }, look: BUSCA_SI, log: ["VM: creado " + VM_ID] } },
    { hl: [12, 13],
      txt: "Giras el móvil. Android <b>destruye la Activity</b> y, con ella, lo que había en <code>remember</code>. Lo de <code>rememberSaveable</code> se guarda antes en el <b>Bundle</b>. El almacén de ViewModels <b>se conserva</b>: girar no cierra la pantalla.",
      s: { act: { n: 1, rem: "✗", sav: "→ Bundle", dead: true }, store: "dueño: la pantalla", vm: { id: VM_ID, p: 3, jobs: "1 corrutina activa" }, bundle: 3, log: ["VM: creado " + VM_ID] } },
    { hl: [14],
      txt: "Se crea la <b>Activity nº 2</b>. <code>remember</code> vuelve a empezar en 0, <code>rememberSaveable</code> se recupera del Bundle y <code>viewModel()</code> encuentra <b>el mismo</b> " + VM_ID + ", con sus 3 partidas y su corrutina sin interrumpir. No hay otro <code>init</code>.",
      s: { act: { n: 2, rem: 0, sav: 3, ref: VM_ID, isNew: true }, store: "dueño: la pantalla", vm: { id: VM_ID, p: 3, jobs: "1 corrutina activa" }, look: BUSCA_SI, log: ["VM: creado " + VM_ID] } },
    { hl: [7],
      txt: "Ahora sales de verdad (atrás desde la primera pantalla). El almacén se vacía: llega <code>onCleared()</code> y <code>viewModelScope</code> <b>cancela todas sus corrutinas</b>. Por eso un temporizador del ViewModel no se queda contando para siempre.",
      s: { act: { n: 2, rem: "✗", sav: "✗", dead: true }, store: null, vm: { id: VM_ID, p: 3, jobs: "✕ corrutina cancelada", dead: true }, log: ["VM: creado " + VM_ID, "VM: onCleared"] } },
    { hl: [13, 14],
      txt: "<b>¿Y si Android cierra la app</b> en segundo plano para liberar memoria? Se pierde todo lo que estaba en memoria, almacén incluido. Al volver hay una Activity nº 3 y un ViewModel <b>nuevo</b> en 0. Solo se salva <code>rememberSaveable</code>, porque viajó en el Bundle.",
      s: { act: { n: 3, rem: 0, sav: 3, ref: VM_ID2, isNew: true }, store: "dueño: la pantalla", vm: { id: VM_ID2, p: 0, jobs: "sin corrutinas" }, look: BUSCA_NO, bundle: 3, log: ["VM: creado " + VM_ID, "(Android cierra el proceso)", "VM: creado " + VM_ID2] } },
    { hl: [18, 19, 20, 21, 22],
      txt: "¿De quién es el almacén? Con Navigation 3 y el decorador, <b>cada entrada de la pila tiene el suyo</b>: cada detalle tiene su ViewModel, que muere al salir de la pila. Sin el decorador, todas usan el de la Activity y lo comparten.",
      s: { ents: true } }
  ];

  // ----------------------------------------------------------------- arranque

  var DEMOS = {
    viewmodel: {
      title: "¿Qué es y para qué sirve un ViewModel?",
      subtitle: "Avanza paso a paso o pulsa Reproducir",
      code: VM_CODE,
      steps: VM_STEPS,
      render: renderViewModel
    }
  };

  function init() {
    var nodes = document.querySelectorAll(".cpa[data-cpa]:not([data-cpa-ready])");
    Array.prototype.forEach.call(nodes, function (node) {
      var cfg = DEMOS[node.getAttribute("data-cpa")];
      if (!cfg) return;
      node.setAttribute("data-cpa-ready", "");
      stepper(node, cfg);
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
