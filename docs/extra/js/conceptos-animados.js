/*
 * Conceptos animados para MkDocs
 * ------------------------------
 * Animaciones paso a paso: a la izquierda el código, con la línea activa
 * resaltada; a la derecha, lo que ocurre; debajo, una frase que lo explica.
 *
 * Uso en un .md:
 *   <div class="cpa" data-cpa="viewmodel"></div>   -> qué es un ViewModel y cuánto vive (apuntes 3C.1 §1.1)
 *   <div class="cpa" data-cpa="stateflow"></div>   -> UiState inmutable que viaja por un StateFlow (apuntes 3C.1 §3)
 *   <div class="cpa" data-cpa="udf"></div>         -> eventos que suben y estado que baja, con espera bloqueada (apuntes 3C.1 §3)
 *   <div class="cpa" data-cpa="fases"></div>       -> composición, diseño y dibujo al animar (apuntes 3A.4 §2)
 *   <div class="cpa" data-cpa="volteo"></div>      -> giro 3D que sigue al estado (apuntes 3A.4 §2)
 *   <div class="cpa" data-cpa="job"></div>         -> el Job del temporizador y el ciclo de vida (apuntes 3C.1 §5.3)
 *   <div class="cpa" data-cpa="virtual"></div>     -> el reloj virtual de runTest (apuntes 3C.1 §5.4)
 *   <div class="cpa" data-cpa="pila"></div>        -> apilar o sustituir, y la vida del ViewModel de cada entrada (apuntes 3B.1 §8)
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
        lines[n].className = "cpa-ln" + ((st.hl || []).indexOf(n) >= 0 ? (st.bad ? " on bad" : " on") : "");
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

  // ------------------------------------------------------------ utilidades UI

  function frame(root, title, subtitle) {
    root.innerHTML = '<div class="cpa-title">' + esc(title) + "<span>" + esc(subtitle) + "</span></div>" +
      '<div class="cpa-pad"></div>';
    return root.querySelector(".cpa-pad");
  }

  function vivo(root) {
    return document.body.contains(root);
  }

  // ------------------------------------------- UiState inmutable y StateFlow

  var SF_CODE = [
    "data class FichaJuegoUiState(",
    "    val partidas: Int = 0,",
    "    val favorito: Boolean = false",
    ")",
    "",
    "class FichaJuegoViewModel : ViewModel() {",
    "    private val _uiState = MutableStateFlow(FichaJuegoUiState())",
    "    val uiState: StateFlow<FichaJuegoUiState> = _uiState.asStateFlow()",
    "",
    "    fun onSumarPartida() {",
    "        _uiState.update { it.copy(partidas = it.partidas + 1) }",
    "    }",
    "}",
    "",
    "// En la pantalla",
    "val estado by viewModel.uiState.collectAsStateWithLifecycle()",
    "Text(\"Partidas: ${estado.partidas}\")",
    "",
    "// ❌ Lo que NO se hace (con un campo mutable):",
    "_uiState.value.partidasMutables.add(1)"
  ];

  function sfBox(b, nuevo) {
    var f = function (k, v) {
      var c = (b.chg || []).indexOf(k) >= 0 ? "chg" : (b.bad || []).indexOf(k) >= 0 ? "bad" : "";
      return "<div>" + (c ? '<span class="' + c + '">' : "") + k + " = " + v + (c ? "</span>" : "") + "</div>";
    };
    return '<div class="cpa-uis ' + (b.st || "") + (nuevo ? " pop" : "") + '"><div class="h">UiState #' + b.id +
      (b.st === "viejo" ? " · ya nadie lo usa" : "") + (b.st === "mutado" ? " · ¡cambiado por dentro!" : "") + "</div>" +
      f("partidas", b.partidas) + f("favorito", b.favorito) + "</div>";
  }

  function renderStateFlow(sc, s, prev) {
    var ids = prev ? prev.boxes.map(function (b) { return b.id; }) : [];
    var boxes = s.boxes.map(function (b) { return sfBox(b, prev && ids.indexOf(b.id) < 0); }).join("");
    var flash = prev && prev.screen.recomp !== s.screen.recomp;
    sc.innerHTML =
      '<div class="cpa-sf"><div class="cpa-sf-vm"><div class="cpa-lbl">ViewModel · _uiState</div>' + boxes +
      '<div class="cpa-lbl" style="margin-top:.4rem">valor del StateFlow → <b>UiState #' + s.value + "</b></div></div>" +
      '<div class="cpa-pipe"><span class="cpa-lbl">StateFlow</span>' +
      (s.tok ? '<span class="cpa-tok ' + s.tok.dir + '"><span class="cpa-pill ' + s.tok.k + '">' + s.tok.t + "</span></span>" : "") +
      '<span class="cpa-lbl">' + (s.sub ? "suscrita ✓" : "sin suscribir") + "</span></div>" +
      '<div class="cpa-phone' + (flash ? " flash" : "") + '"><div class="cpa-lbl">Pantalla</div>' +
      '<div class="big">' + (s.sub ? "Partidas: " + s.screen.partidas : "…") + '</div><div class="cpa-note">recomposiciones: ' + s.screen.recomp + "</div>" +
      '<span class="cpa-fakebtn">+1 partida</span>' +
      (s.ro ? '<div class="cpa-note">🔒 solo lectura: no puede escribir en el estado</div>' : "") +
      (s.warn ? '<div class="cpa-warn">' + s.warn + "</div>" : "") + "</div></div>";
  }

  var B1 = { id: 1, partidas: 0, favorito: false };
  var B2 = { id: 2, partidas: 1, favorito: false, chg: ["partidas"] };
  function con(o, x) { var r = {}, k; for (k in o) r[k] = o[k]; for (k in (x || {})) r[k] = x[k]; return r; }

  var SF_STEPS = [
    { hl: [0, 1, 2, 3], txt: "El estado es una <b>data class</b> con <code>val</code>: una foto de todo lo que se pinta. Una vez creada, no cambia.",
      s: { boxes: [], value: "–", sub: false, screen: { partidas: 0, recomp: 0 } } },
    { hl: [6], txt: "El ViewModel crea el primer estado y lo guarda en un <b>MutableStateFlow</b> privado: una caja que siempre tiene <b>un</b> valor, el último.",
      s: { boxes: [B1], value: 1, sub: false, screen: { partidas: 0, recomp: 0 } } },
    { hl: [7], txt: "Hacia fuera solo enseña un <b>StateFlow</b> de solo lectura. La pantalla podrá leerlo, pero nunca escribir en él.",
      s: { boxes: [B1], value: 1, sub: false, ro: true, screen: { partidas: 0, recomp: 0 } } },
    { hl: [15, 16], txt: "La pantalla se <b>suscribe</b> con <code>collectAsStateWithLifecycle()</code>: recibe el valor actual al momento y pinta «Partidas: 0».",
      s: { boxes: [B1], value: 1, sub: true, ro: true, screen: { partidas: 0, recomp: 1 }, tok: { dir: "down", k: "st", t: "#1" } } },
    { hl: [9], txt: "El usuario pulsa «+1». La pantalla no toca el estado: <b>llama a un evento</b> del ViewModel.",
      s: { boxes: [B1], value: 1, sub: true, ro: true, screen: { partidas: 0, recomp: 1 }, tok: { dir: "up", k: "ev", t: "onSumarPartida()" } } },
    { hl: [10], txt: "<code>copy</code> crea un <b>UiState #2</b> nuevo con un solo campo distinto. El #1 no se toca: sigue valiendo 0.",
      s: { boxes: [B1, B2], value: 1, sub: true, ro: true, screen: { partidas: 0, recomp: 1 } } },
    { hl: [10], txt: "<code>update</code> guarda el #2 en el StateFlow. Como el #2 es <b>distinto</b> del #1, el StateFlow lo emite.",
      s: { boxes: [B1, B2], value: 2, sub: true, ro: true, screen: { partidas: 0, recomp: 1 }, tok: { dir: "down", k: "st", t: "#2" } } },
    { hl: [15, 16], txt: "La pantalla recibe el #2 y se <b>recompone</b>: «Partidas: 1». El #1 ya no lo usa nadie.",
      s: { boxes: [con(B1, { st: "viejo" }), B2], value: 2, sub: true, ro: true, screen: { partidas: 1, recomp: 2 } } },
    { hl: [19], bad: true, txt: "<b>El error clásico:</b> cambiar el objeto por dentro. El dato cambia, pero el StateFlow ve <b>el mismo objeto</b> y no emite: la pantalla se queda con el valor viejo.",
      s: { boxes: [con(B1, { st: "viejo" }), con(B2, { st: "mutado", chg: [], bad: ["partidas"], partidas: "1 → 2 (por dentro)" })], value: 2, sub: true, ro: true,
        screen: { partidas: 1, recomp: 2 }, warn: "La pantalla dice 1 y el dato es 2: nadie ha avisado." } }
  ];

  // ---------------------------------------- composición, diseño y dibujo

  var FASES_CODE = [
    "@Composable",
    "fun FichaJuegoScreen(estado: FichaUiState, …) {",
    "    Portada(estado.portada)",
    "    FilaValoracion(estado.favorito, onFavorito)",
    "    FilaPartidas(estado.partidas, onSumar)",
    "}",
    "",
    "@Composable",
    "fun FilaValoracion(esFavorito: Boolean, …) {",
    "    val escala by animateFloatAsState(",
    "        targetValue = if (esFavorito) 1.25f else 1f",
    "    )",
    "    Icon(…, modifier = Modifier.graphicsLayer {",
    "        scaleX = escala   // se lee al DIBUJAR",
    "        scaleY = escala",
    "    })",
    "}",
    "",
    "// ⚠️ Alternativa: leer el valor al COMPONER",
    "Icon(…, modifier = Modifier.scale(escala))"
  ];

  var NODOS = [["FichaJuegoScreen", 0], ["Portada", 1], ["FilaValoracion", 1], ["Icon ♥", 2], ["FilaPartidas", 1]];

  function renderFases(sc, s) {
    var arbol = NODOS.map(function (n) {
      var cls = s.comp.indexOf(n[0]) >= 0 ? "c" : s.draw.indexOf(n[0]) >= 0 ? "d" : s.skip ? "s" : "";
      var c = s.cnt[n[0]] || [0, 0];
      return '<div class="cpa-node i' + n[1] + " " + cls + '"><span>' + n[0] + "</span><small>comp " + c[0] + " · dibujo " + c[1] + "</small></div>";
    }).join("");
    var fase = function (k, t, d) {
      return '<div class="cpa-phase' + (s.ph.indexOf(k) >= 0 ? " on" : "") + '">' + t + "<small>" + d + "</small></div>";
    };
    sc.innerHTML = '<div class="cpa-ph"><div><div class="cpa-lbl">Árbol de la pantalla</div>' + arbol +
      '<p class="cpa-note"><span class="cpa-sw c"></span> se recompone · <span class="cpa-sw d"></span> solo se redibuja</p>' +
      '<div class="cpa-heartrow"><span class="cpa-heart" style="transform:scale(' + s.esc + ");color:" + (s.fav ? "var(--cpa-err)" : "var(--cpa-muted)") + '">♥</span> <code>escala = ' + s.esc.toFixed(2) + "</code></div></div>" +
      '<div class="cpa-phases"><div class="cpa-lbl">Fases de un fotograma</div>' +
      fase("c", "1 · Composición", "qué se muestra: ejecuta las funciones") +
      fase("l", "2 · Diseño", "dónde va: mide y coloca") +
      fase("d", "3 · Dibujo", "cómo se ve: pinta los píxeles") +
      (s.fps ? '<p class="cpa-note" style="text-align:center">' + s.fps + "</p>" : "") + "</div></div>";
  }

  var TODOS = ["FichaJuegoScreen", "Portada", "FilaValoracion", "Icon ♥", "FilaPartidas"];
  var FASES_STEPS = [
    { hl: [1, 2, 3, 4], txt: "La primera vez se ejecutan las tres fases para todo el árbol.",
      s: { comp: TODOS, draw: [], ph: ["c", "l", "d"], esc: 1, fav: false, cnt: { "FichaJuegoScreen": [1, 1], "Portada": [1, 1], "FilaValoracion": [1, 1], "Icon ♥": [1, 1], "FilaPartidas": [1, 1] } } },
    { hl: [4], txt: "Cambia <code>partidas</code>. Solo se recomponen quien lo lee y su padre. <b>Portada</b> y <b>FilaValoracion</b> se <b>saltan</b>: sus parámetros no han cambiado.",
      s: { skip: true, comp: ["FichaJuegoScreen", "FilaPartidas"], draw: [], ph: ["c", "l", "d"], esc: 1, fav: false, cnt: { "FichaJuegoScreen": [2, 2], "Portada": [1, 1], "FilaValoracion": [1, 1], "Icon ♥": [1, 1], "FilaPartidas": [2, 2] } } },
    { hl: [3, 9, 10], txt: "Pulsas el favorito: cambia <code>esFavorito</code>. Se recompone <b>FilaValoracion</b> y la animación recibe un destino nuevo: 1.25.",
      s: { skip: true, comp: ["FichaJuegoScreen", "FilaValoracion"], draw: [], ph: ["c", "l", "d"], esc: 1, fav: true, cnt: { "FichaJuegoScreen": [3, 3], "Portada": [1, 1], "FilaValoracion": [2, 2], "Icon ♥": [1, 2], "FilaPartidas": [2, 2] } } },
    { hl: [12, 13, 14], txt: "Fotograma a fotograma, <code>escala</code> sube. Como se lee <b>dentro de la lambda</b> de <code>graphicsLayer</code>, solo se repite el <b>dibujo</b> del icono. Cero recomposiciones.",
      s: { skip: true, comp: [], draw: ["Icon ♥"], ph: ["d"], esc: 1.12, fav: true, fps: "fotograma 6 de unos 18", cnt: { "FichaJuegoScreen": [3, 3], "Portada": [1, 1], "FilaValoracion": [2, 2], "Icon ♥": [1, 8], "FilaPartidas": [2, 2] } } },
    { hl: [12, 13, 14], txt: "Llega al destino. El icono se ha dibujado muchas veces y <b>FilaValoracion</b> se ha compuesto una sola. Es lo que hace barato un giro de carta.",
      s: { skip: true, comp: [], draw: ["Icon ♥"], ph: ["d"], esc: 1.25, fav: true, fps: "fotograma 18 de unos 18", cnt: { "FichaJuegoScreen": [3, 3], "Portada": [1, 1], "FilaValoracion": [2, 2], "Icon ♥": [1, 20], "FilaPartidas": [2, 2] } } },
    { hl: [19], bad: true, txt: "Si el valor se lee <b>al componer</b> (fuera de la lambda), cada fotograma recompone FilaValoracion y repite las tres fases. Funciona, pero hace mucho más trabajo.",
      s: { skip: true, comp: ["FilaValoracion", "Icon ♥"], draw: [], ph: ["c", "l", "d"], esc: 1.25, fav: true, fps: "18 fotogramas = 18 recomposiciones", cnt: { "FichaJuegoScreen": [3, 3], "Portada": [1, 1], "FilaValoracion": [20, 20], "Icon ♥": [19, 20], "FilaPartidas": [2, 2] } } }
  ];

  // ------------------------------------------ pila y vida de cada ViewModel

  var PILA_CODE = [
    "@Serializable data object Inicio : NavKey",
    "@Serializable data class Partida(val nivel: Int) : NavKey",
    "@Serializable data class Fin(val puntos: Int) : NavKey",
    "",
    "val pila = rememberNavBackStack(Inicio)",
    "",
    "NavDisplay(",
    "    backStack = pila,",
    "    entryDecorators = listOf(",
    "        rememberSaveableStateHolderNavEntryDecorator(),",
    "        rememberViewModelStoreNavEntryDecorator()",
    "    ),",
    "    entryProvider = entryProvider {",
    "        entry<Partida> { clave ->",
    "            val vm = viewModel { PartidaViewModel(clave.nivel) }",
    "            …",
    "        }",
    "    }",
    ")",
    "",
    "// Opción A",
    "pila.add(Fin(puntos = 120))",
    "// Opción B",
    "pila[pila.lastIndex] = Fin(puntos = 120)",
    "",
    "pila.removeLastOrNull()   // atrás"
  ];

  function renderPila(sc, s, prev) {
    var cima = s.stack[s.stack.length - 1];
    var pila = s.stack.map(function (e, k) {
      var nueva = prev && !prev.stack.some(function (p) { return p.uid === e.uid; });
      return '<div class="cpa-entry' + (k === s.stack.length - 1 ? " top" : "") + (e.gone ? " gone" : "") + (nueva ? " pop" : "") + '">' + e.k +
        (e.vm ? '<br><span class="cpa-vmc' + (e.dead ? " dead" : "") + '">' + e.vm + "</span>" : "") + "</div>";
    }).join("");
    sc.innerHTML = '<div class="cpa-nav"><div><div class="cpa-lbl">La pila (abajo, la primera)</div><div class="cpa-stack">' + pila + "</div></div>" +
      '<div><div class="cpa-lbl">Lo que se ve: la cima</div><div class="cpa-screen' + (s.rot ? " flash" : "") + '"><b>' + cima.scr + '</b><div class="cpa-note">' + (cima.sub || "") + "</div></div>" +
      (s.q ? '<p class="cpa-q">' + s.q + "</p>" : "") + "</div></div>";
  }

  var E_INI = { uid: 1, k: "Inicio", scr: "Inicio", sub: "elige nivel" };
  var E_PAR = { uid: 2, k: "Partida(nivel = 2)", vm: "PartidaViewModel(nivel = 2) · creado", scr: "Partida", sub: "nivel 2: el ViewModel lo recibe en el constructor" };
  var E_PAR2 = con(E_PAR, { vm: "PartidaViewModel(nivel = 2) · el mismo" });
  var E_FIN = { uid: 3, k: "Fin(puntos = 120)", scr: "Fin", sub: "120 puntos" };
  var PILA_STEPS = [
    { hl: [0, 1, 2], txt: "Cada destino es una <b>clave</b>. Lleva solo <b>datos sencillos</b>: un número de nivel, unos puntos. Nunca el estado entero.", s: { stack: [E_INI] } },
    { hl: [4], txt: "La pila empieza con <code>Inicio</code>. Lo que se ve es siempre la <b>cima</b>.", s: { stack: [E_INI] } },
    { hl: [13, 14], txt: "Se elige el nivel 2: <code>pila.add(Partida(nivel = 2))</code>. El decorador crea un ViewModel <b>para esta entrada</b> y le pasa el nivel.", s: { stack: [E_INI, E_PAR] } },
    { hl: [10, 14], txt: "Giras el móvil: la Activity y la pantalla se <b>recrean</b>, pero el ViewModel de la entrada es <b>el mismo objeto</b>. Por eso la partida no se pierde.", s: { stack: [E_INI, E_PAR2], rot: true } },
    { hl: [20, 21], txt: "Opción A: <b>apilar</b> el final. La partida y su ViewModel siguen vivos debajo.", s: { stack: [E_INI, E_PAR2, E_FIN] } },
    { hl: [25], txt: "Con la opción A, atrás vuelve a la partida terminada.", s: { stack: [E_INI, E_PAR2], q: "¿Tiene sentido volver a una partida acabada? Piensa qué espera quien juega." } },
    { hl: [22, 23], txt: "Opción B: <b>sustituir</b> la cima. La entrada de la partida sale de la pila: su ViewModel se destruye y <code>viewModelScope</code> cancela sus corrutinas.",
      s: { stack: [E_INI, con(E_PAR2, { gone: true, dead: true, vm: "onCleared() · corrutinas canceladas" }), E_FIN] } },
    { hl: [25], txt: "Con la opción B, atrás lleva a Inicio. Ninguna opción es «la buena» siempre: <b>decide y justifícalo</b>.", s: { stack: [E_INI], q: "Cada opción da un botón atrás distinto. ¿Cuál quieres en tu app y por qué?" } }
  ];

  // ------------------------------------------------- tiempo virtual en tests

  var VIRTUAL_CODE = [
    "@Test",
    "fun `cuenta tres segundos`() = runTest {",
    "    viewModel.onEmpezar(juegoId = 1)",
    "    try {",
    "        advanceTimeBy(3_000)",
    "        runCurrent()",
    "        assertEquals(3, viewModel.uiState.value.cronometro.segundos)",
    "        // advanceUntilIdle()   ⚠️ con el cronómetro en marcha",
    "    } finally {",
    "        viewModel.onPausar()",
    "    }",
    "}"
  ];

  function renderVirtual(sc, s, prev) {
    if (sc._anim) { clearTimeout(sc._anim); cancelAnimationFrame(sc._anim); }
    var gen = (sc._gen || 0) + 1; sc._gen = gen;
    var v0 = prev ? prev.vt : 0, s0 = prev ? prev.seg : 0;
    sc.innerHTML = '<div class="cpa-tt"><div class="cpa-clock"><div class="cpa-lbl">Reloj virtual</div><div class="v vt">' + v0 + " ms</div></div>" +
      '<div class="cpa-clock"><div class="cpa-lbl">Tiempo real</div><div class="v">' + s.rt + "</div></div>" +
      '<div class="cpa-clock"><div class="cpa-lbl">segundos</div><div class="v sg">' + s0 + "</div></div>" +
      '<div class="cpa-clock"><div class="cpa-lbl">Corrutinas vivas</div><div class="v">' + s.jobs + "</div></div>" +
      '<div class="cpa-queue"><div class="cpa-lbl">Agenda del planificador (lo que espera un delay)</div>' +
      (s.q.length ? s.q.map(function (x) { return '<span class="q">' + x + "</span>"; }).join("") : '<span class="cpa-note">vacía</span>') + "</div>" +
      '<div class="cpa-res ' + (s.res || "") + '">' + (s.spin ? '<span class="cpa-spin">⟳</span> ' : "") + (s.msg || "") + "</div></div>";
    var vt = sc.querySelector(".vt"), sg = sc.querySelector(".sg");
    if (s.spin) {
      var t = v0;
      (function giro() {
        if (gen !== sc._gen || !vivo(sc)) return;
        t += 1000; vt.textContent = t + " ms"; sg.textContent = Math.floor(t / 1000);
        sc._anim = setTimeout(giro, 140);
      })();
      return;
    }
    var t0 = performance.now();
    (function paso(now) {
      if (gen !== sc._gen) return;
      var p = Math.min(1, ((now || t0) - t0) / 900);
      vt.textContent = Math.round(v0 + (s.vt - v0) * p) + " ms";
      sg.textContent = Math.floor(s0 + (s.seg - s0) * p + 1e-9);
      if (p < 1) sc._anim = requestAnimationFrame(paso);
    })();
  }

  var VIRTUAL_STEPS = [
    { hl: [1], txt: "<code>runTest</code> crea un <b>reloj virtual</b> en 0 ms. (La regla <code>MainDispatcherRule</code> hace que <code>viewModelScope</code> use ese reloj.)",
      s: { vt: 0, rt: "0 ms", seg: 0, jobs: 0, q: [] } },
    { hl: [2], txt: "<code>onEmpezar</code> lanza el bucle del cronómetro. Llega a <code>delay(1_000)</code> y, en vez de esperar, <b>apunta una cita</b> en la agenda para t = 1000.",
      s: { vt: 0, rt: "0 ms", seg: 0, jobs: 1, q: ["tic del cronómetro → t = 1000"] } },
    { hl: [4, 5], txt: "<code>advanceTimeBy(3_000)</code> mueve el reloj y ejecuta las citas que vencen por el camino: tres tics. En tiempo real, <b>casi nada</b>.",
      s: { vt: 3000, rt: "≈ 2 ms", seg: 3, jobs: 1, q: ["tic del cronómetro → t = 4000"] } },
    { hl: [6], txt: "La comprobación pasa: el estado dice 3 segundos. El bucle sigue vivo y ya tiene la siguiente cita apuntada.",
      s: { vt: 3000, rt: "≈ 2 ms", seg: 3, jobs: 1, q: ["tic del cronómetro → t = 4000"], res: "ok", msg: "✓ assertEquals(3, segundos)" } },
    { hl: [7], bad: true, txt: "<b>¿Y si…?</b> <code>advanceUntilIdle()</code> avanza «hasta que no quede nada». Pero cada tic apunta otro: la agenda <b>nunca se vacía</b> y el test se queda colgado.",
      s: { vt: 3000, rt: "∞", seg: 3, jobs: 1, q: ["tic → t + 1000", "tic → t + 1000", "…"], spin: true, res: "bad", msg: "el test no termina nunca" } },
    { hl: [8, 9], txt: "(Volvemos al test sin esa línea.) Por eso se para en el <code>finally</code>: <code>onPausar()</code> cancela el Job y su cita desaparece de la agenda.",
      s: { vt: 3000, rt: "≈ 2 ms", seg: 3, jobs: 0, q: [] } },
    { hl: [11], txt: "Al final de <code>runTest</code> la agenda está vacía: el test termina en verde en milisegundos, aunque «han pasado» tres segundos.",
      s: { vt: 3000, rt: "≈ 3 ms", seg: 3, jobs: 0, q: [], res: "ok", msg: "✓ test en verde" } }
  ];

  // ----------------------------- eventos que suben, estado que baja (FichaJuego)

  var JUEGOS = [{ id: 1, t: "Hollow Knight" }, { id: 2, t: "Stardew Valley" }, { id: 3, t: "Celeste" }];

  function buildUdf(root) {
    var pad = frame(root, "Los eventos suben, el estado baja", "Pulsa los botones de las fichas");
    pad.innerHTML =
      '<div class="cpa-ctrl"><button type="button" class="b-reset">Reiniciar</button>' +
      '<label><input type="checkbox" class="o-slow"> Cámara lenta</label>' +
      '<label><input type="checkbox" class="o-norule"> Quitar <code>if (guardando) return</code></label></div>' +
      '<div class="cpa-flow"><div class="cpa-box"><div class="cpa-lbl">Pantalla (composable)</div><div class="o-total cpa-total"></div><div class="o-fichas"></div>' +
      '<p class="cpa-note o-nota"></p></div>' +
      '<div class="cpa-fpipe"><span class="l t">↑ eventos</span><span class="l b">↓ StateFlow</span></div>' +
      '<div class="cpa-box"><div class="cpa-lbl">ViewModel</div><div class="cpa-state o-state"></div>' +
      '<div class="cpa-bar"><i class="o-bar"></i></div><div class="cpa-evlog o-log"></div></div></div>';
    var q = function (c) { return pad.querySelector(c); };
    var st, marcas, pipe = q(".cpa-fpipe");
    function lento() { return q(".o-slow").checked ? 3 : 1; }
    function log(m, c) { var d = document.createElement("div"); d.textContent = m; if (c) d.className = c; q(".o-log").insertBefore(d, q(".o-log").firstChild); }
    function copia(o) { return JSON.parse(JSON.stringify(o)); }
    function total(s) { return JUEGOS.reduce(function (a, j) { return a + (s.partidas[j.id] || 0); }, 0); }
    function token(tipo, texto, sube, fin) {
      var t = document.createElement("div"); t.className = "cpa-token " + tipo; t.textContent = texto;
      var h = pipe.clientHeight || 160; t.style.transitionDuration = (0.55 * lento()) + "s"; t.style.top = (sube ? h - 40 : 18) + "px";
      pipe.appendChild(t);
      requestAnimationFrame(function () { requestAnimationFrame(function () { t.style.top = (sube ? 18 : h - 40) + "px"; }); });
      setTimeout(function () { t.style.opacity = 0; setTimeout(function () { t.remove(); }, 300); if (fin) fin(); }, 550 * lento());
    }
    function emitir(n) { var a = st; st = n; pintarEstado(a); token("st", "UiState nuevo", false, function () { recomponer(a); }); }
    function onSumarPartida(id) {
      if (st.guardando && !q(".o-norule").checked) { log("onSumarPartida(" + id + ") ignorado: guardando", "ign"); return; }
      var n = copia(st); n.partidas[id] = (n.partidas[id] || 0) + 1; log("+1 partida al juego " + id, "ok"); emitir(n);
    }
    function onTerminar(id) {
      if (st.guardando && !q(".o-norule").checked) { log("onTerminar(" + id + ") ignorado: guardando", "ign"); return; }
      var n = copia(st); n.guardando = true; log("guardando = true, espera 2 s…", "co"); emitir(n);
      var ini = performance.now(), d = 2000 * lento(), bar = q(".o-bar");
      (function an(t) { if (!vivo(root)) return; var p = Math.min(1, (t - ini) / d); bar.style.width = (p * 100) + "%"; if (p < 1) requestAnimationFrame(an); else bar.style.width = "0"; })(ini);
      setTimeout(function () {
        if (!vivo(root)) return;
        var m = copia(st); m.partidas[id] = (m.partidas[id] || 0) + 1; m.guardando = false;
        log("partida guardada en el juego " + id + "; guardando = false"); emitir(m);
      }, d);
    }
    function pintarEstado(a) {
      var L = ["FichaJuegoUiState("];
      var p = JUEGOS.map(function (j) {
        var ch = a && (a.partidas[j.id] || 0) !== (st.partidas[j.id] || 0);
        return (ch ? '<span class="chg">' : "") + j.id + "=" + (st.partidas[j.id] || 0) + (ch ? "</span>" : "");
      }).join(", ");
      L.push("  partidas = {" + p + "}");
      var cg = a && a.guardando !== st.guardando;
      L.push((cg ? '<span class="chg">' : "") + "  guardando = " + st.guardando + (cg ? "</span>" : ""));
      L.push(")");
      L.push('<span class="cpa-com">// derivado: totalPartidas = ' + total(st) + "</span>");
      q(".o-state").innerHTML = L.join("\n");
    }
    function recomponer(a) {
      var tot = q(".o-total"); tot.textContent = "Total de partidas: " + total(st);
      if (a && total(a) !== total(st)) { tot.classList.remove("flash"); void tot.offsetWidth; tot.classList.add("flash"); }
      JUEGOS.forEach(function (j, k) {
        var el = q(".o-fichas").children[k];
        var cambia = a && ((a.partidas[j.id] || 0) !== (st.partidas[j.id] || 0) || a.guardando !== st.guardando);
        el.querySelector(".n").textContent = st.partidas[j.id] || 0;
        el.classList.toggle("bloq", st.guardando);
        if (cambia) { marcas[k]++; el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
        var b = el.querySelector(".cpa-badge"); b.textContent = marcas[k]; b.style.display = marcas[k] ? "" : "none";
      });
      q(".o-nota").textContent = st.guardando ? "Guardando: los toques siguen llegando al ViewModel, que es quien los ignora." : "La pantalla solo pinta el estado y envía eventos.";
    }
    function montar() {
      st = { partidas: { 1: 2, 2: 0, 3: 5 }, guardando: false };
      marcas = JUEGOS.map(function () { return 0; });
      var cont = q(".o-fichas"); cont.innerHTML = "";
      JUEGOS.forEach(function (j) {
        var el = document.createElement("div"); el.className = "cpa-ficha";
        el.innerHTML = '<span class="t">' + j.t + '</span><span class="n"></span><button type="button" class="mas">+1</button><button type="button" class="fin">Terminar</button><span class="cpa-badge"></span>';
        el.querySelector(".mas").onclick = function () { token("ev", "onSumarPartida(" + j.id + ")", true, function () { onSumarPartida(j.id); }); };
        el.querySelector(".fin").onclick = function () { token("ev", "onTerminar(" + j.id + ")", true, function () { onTerminar(j.id); }); };
        cont.appendChild(el);
      });
      q(".o-log").innerHTML = ""; log("estado inicial"); pintarEstado(null); recomponer(null);
    }
    q(".b-reset").onclick = montar;
    montar();
  }

  // --------------------------------------------------- el giro sigue al estado

  function buildVolteo(root) {
    var pad = frame(root, "El giro sigue al estado", "Pulsa la carta, también a medio giro");
    pad.innerHTML =
      '<div class="cpa-v"><div><div class="cpa-stage"><div class="cpa-flip back" role="button" tabindex="0" aria-label="Pulsar carta"><div class="cpa-face"></div></div></div>' +
      '<svg class="cpa-tl" viewBox="0 0 400 70" preserveAspectRatio="none" aria-label="Ángulo en el tiempo"></svg>' +
      '<p class="cpa-note">Ángulo de los últimos fotogramas (0° abajo, 180° arriba). La raya es 90°, donde cambia la cara.</p></div>' +
      '<div><div class="cpa-ctrl"><button type="button" class="pri o-btn">Pulsar carta</button><label><input type="checkbox" class="o-slow"> Cámara lenta ×5</label></div>' +
      '<div class="cpa-ctrl"><label>cameraDistance <input type="range" class="o-cam" min="1" max="24" value="8"> <code class="o-camv"></code></label></div>' +
      '<div class="cpa-ctrl"><label><input type="checkbox" class="o-comp" checked> Compensar el anverso con 180°</label><label><input type="checkbox" class="o-swap" checked> Cambiar de cara a 90°</label></div>' +
      '<table class="cpa-vals"><tr><td>Estado</td><td class="o-e"></td></tr><tr><td><code>targetValue</code></td><td class="o-t"></td></tr>' +
      '<tr><td>Valor de este fotograma</td><td class="o-v"></td></tr><tr><td>Cara que se dibuja</td><td class="o-c"></td></tr>' +
      '<tr><td>Recomposiciones</td><td class="o-r"></td></tr><tr><td>Fotogramas dibujados</td><td class="o-f"></td></tr></table>' +
      '<p class="cpa-note">Desmarca «Compensar» y mira el texto: sale en espejo. Desmarca «Cambiar de cara» y verás el reverso por detrás. Baja <code>cameraDistance</code> a 1: la carta se deforma.</p></div></div>';
    var q = function (c) { return pad.querySelector(c); };
    var arriba = false, val = 0, desde = 0, hasta = 0, t0 = 0, dur = 450, anim = false, rec = 0, fr = 0, hist = [];
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function pulsar() {
      arriba = !arriba; rec++; desde = val; hasta = arriba ? 180 : 0; t0 = performance.now(); anim = true;
      dur = 450 * Math.max(0.35, Math.abs(hasta - desde) / 180) * (q(".o-slow").checked ? 5 : 1);
      requestAnimationFrame(paso);
    }
    function paso(now) {
      if (!anim || !vivo(root)) return;
      var t = Math.min(1, (now - t0) / dur); val = desde + (hasta - desde) * ease(t); fr++; dibujar();
      if (t < 1) requestAnimationFrame(paso); else anim = false;
    }
    function dibujar() {
      var cam = +q(".o-cam").value; q(".o-camv").textContent = cam + " × densidad";
      q(".cpa-stage").style.perspective = (cam * 48) + "px";
      var anverso = q(".o-swap").checked ? val > 90 : false, f = q(".cpa-flip"), cara = q(".cpa-face");
      f.className = "cpa-flip " + (anverso ? "front" : "back"); f.style.transform = "rotateY(" + val.toFixed(1) + "deg)";
      cara.innerHTML = anverso ? "🦊<small>ZORRO</small>" : "?<small>PMDM</small>";
      cara.style.transform = anverso && q(".o-comp").checked ? "rotateY(180deg)" : "none";
      q(".o-e").textContent = "bocaArriba = " + arriba; q(".o-t").textContent = arriba ? "180f" : "0f";
      q(".o-v").textContent = val.toFixed(1) + "°";
      q(".o-c").textContent = anverso ? ("anverso" + (q(".o-comp").checked ? " (compensado)" : " ¡en espejo!")) : "reverso";
      q(".o-r").textContent = rec; q(".o-f").textContent = fr;
      hist.push(val); if (hist.length > 120) hist.shift();
      var pts = hist.map(function (v, i) { return (i * 400 / 119).toFixed(1) + "," + (66 - v / 180 * 62).toFixed(1); }).join(" ");
      q(".cpa-tl").innerHTML = '<line x1="0" x2="400" y1="35" y2="35" stroke="currentColor" stroke-dasharray="4 4" opacity=".35"/>' +
        '<polyline fill="none" stroke="var(--cpa-primary)" stroke-width="2" points="' + pts + '"/>';
    }
    q(".cpa-flip").onclick = pulsar;
    q(".cpa-flip").onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pulsar(); } };
    q(".o-btn").onclick = pulsar;
    [".o-cam", ".o-comp", ".o-swap"].forEach(function (c) { q(c).oninput = dibujar; q(c).onchange = dibujar; });
    dibujar();
  }

  // ------------------------------------------ el Job y el ciclo de vida

  function buildJob(root) {
    var pad = frame(root, "Un temporizador que se puede parar", "Prueba los botones y las casillas");
    pad.innerHTML =
      '<div class="cpa-ttop"><div><div class="cpa-lbl">segundos en el UiState</div><div class="cpa-seg o-seg">0</div></div>' +
      '<div class="cpa-ctrl"><button type="button" class="pri o-start">onEmpezar()</button><button type="button" class="o-pause">onPausar()</button>' +
      '<button type="button" class="o-home">Botón «Inicio»</button><button type="button" class="o-rot">Girar el móvil</button><button type="button" class="o-reset">Reiniciar</button></div></div>' +
      '<div class="cpa-ctrl"><label><input type="checkbox" class="o-forget"> Olvidar <code>jobCronometro?.cancel()</code> y la comprobación de <code>enMarcha</code></label>' +
      '<label><input type="checkbox" class="o-nolife"> Sin <code>LifecycleResumeEffect</code></label></div>' +
      '<svg class="cpa-jobs" viewBox="0 0 640 210" aria-label="Línea de tiempo del temporizador"></svg><p class="cpa-note o-note"></p>';
    var q = function (c) { return pad.querySelector(c); };
    var VENTANA = 20, COLORES = ["#7c3aed", "#c2410c", "#0f766e", "#b45309", "#be185d", "#1d4ed8"];
    var T0, vm, vida, giros, sig, reloj;
    function ahora() { return (performance.now() - T0) / 1000; }
    function nota(t) { q(".o-note").textContent = t; }
    function vivas() { return vm.jobs.filter(function (j) { return j.b === null; }); }
    function lanzar() { var j = { id: sig++, a: ahora(), b: null, ult: ahora() }; vm.jobs.push(j); vm.ref = j; }
    function cancelar(j) { if (j && j.b === null) j.b = ahora(); }
    function arrancar() { if (!q(".o-forget").checked) cancelar(vm.ref); lanzar(); }
    function enPantalla() { return vida[vida.length - 1].on; }
    function reiniciar() {
      T0 = performance.now(); vm = { seg: 0, enMarcha: false, ref: null, jobs: [] }; vida = [{ on: true, a: 0, b: null }]; giros = []; sig = 1;
      q(".o-home").textContent = "Botón «Inicio»"; nota("Pulsa onEmpezar().");
    }
    q(".o-start").onclick = function () {
      if (!q(".o-forget").checked && vm.enMarcha) { nota("onEmpezar ignorado: ya está en marcha."); return; }
      vm.enMarcha = true; arrancar(); var n = vivas().length;
      nota(n > 1 ? "¡Hay " + n + " corrutinas contando a la vez! Has perdido el mando de las anteriores." : "Corrutina lanzada y guardada en jobCronometro.");
    };
    q(".o-pause").onclick = function () {
      cancelar(vm.ref); vm.enMarcha = false; var n = vivas().length;
      nota(n ? "onPausar solo cancela el último Job: " + n + " corrutina(s) siguen contando y ya no se pueden parar." : "Pausado: el Job se ha cancelado.");
    };
    q(".o-home").onclick = function () {
      var on = !enPantalla(), t = ahora(); vida[vida.length - 1].b = t; vida.push({ on: on, a: t, b: null });
      this.textContent = on ? "Botón «Inicio»" : "Volver a la app";
      if (q(".o-nolife").checked) { nota(on ? "Vuelves… y el tiempo ha seguido contando fuera." : "La app no se ve, pero el ViewModel sigue vivo y el tiempo sigue contando."); return; }
      if (!on) { cancelar(vm.ref); nota("onPauseOrDispose → onSalirDeLaApp(): se cancela el Job, pero enMarcha sigue a true."); }
      else if (vm.enMarcha) { arrancar(); nota("Al volver → onVolverALaApp(): enMarcha es true, así que relanza."); }
      else nota("Al volver: estaba en pausa, no relanza.");
    };
    q(".o-rot").onclick = function () {
      giros.push(ahora());
      if (!q(".o-nolife").checked && enPantalla()) { cancelar(vm.ref); if (vm.enMarcha) arrancar(); }
      nota("La pantalla se recrea; el ViewModel, sus segundos y su estado siguen. (El efecto se sale y vuelve a entrar.)");
    };
    q(".o-reset").onclick = reiniciar;
    function tic() {
      if (!vivo(root)) { clearInterval(reloj); return; }
      var t = ahora();
      vm.jobs.forEach(function (j) { if (j.b !== null) return; while (t - j.ult >= 1) { j.ult += 1; vm.seg++; } });
      q(".o-seg").textContent = vm.seg;
      var x0 = Math.max(0, t - VENTANA), X = function (s) { return 90 + (s - x0) / VENTANA * 540; };
      var svg = '<text x="4" y="30" font-size="12" fill="currentColor">Ciclo de vida</text><text x="4" y="52" font-size="12" fill="currentColor">Corrutinas</text>';
      vida.forEach(function (s) {
        var b = s.b === null ? t : s.b; if (b < x0) return; var a = Math.max(s.a, x0);
        svg += '<rect x="' + X(a) + '" y="18" width="' + Math.max(0, X(b) - X(a)) + '" height="18" rx="4" fill="' + (s.on ? "var(--cpa-ok)" : "var(--cpa-border)") + '" opacity=".85"/>';
        if (X(b) - X(a) > 90) svg += '<text x="' + (X(a) + 6) + '" y="31" font-size="11" fill="' + (s.on ? "#fff" : "currentColor") + '">' + (s.on ? "en primer plano" : "en segundo plano") + "</text>";
      });
      var fila = 0;
      vm.jobs.forEach(function (j) {
        var b = j.b === null ? t : j.b; if (b < x0) return;
        var a = Math.max(j.a, x0), y = 58 + (fila % 6) * 24, c = COLORES[(j.id - 1) % COLORES.length]; fila++;
        svg += '<rect x="' + X(a) + '" y="' + y + '" width="' + Math.max(2, X(b) - X(a)) + '" height="18" rx="4" fill="' + c + '" opacity="' + (j === vm.ref ? 1 : 0.55) + '"/>';
        svg += '<text x="10" y="' + (y + 13) + '" font-size="11" font-weight="600" fill="' + c + '">Job ' + j.id + '</text><text x="44" y="' + (y + 13) + '" font-size="10" fill="currentColor" opacity=".75">' +
          (j === vm.ref ? "🎮 mando" : (j.b === null ? "sin mando" : "parado")) + "</text>";
        if (j.b !== null) svg += '<text x="' + (X(b) + 3) + '" y="' + (y + 13) + '" font-size="12" fill="var(--cpa-err)">✕</text>';
        for (var s = Math.ceil(j.a + 1); s <= b; s++) { if (s >= x0) svg += '<circle cx="' + X(s) + '" cy="' + (y + 9) + '" r="2.5" fill="#fff"/>'; }
      });
      giros.forEach(function (r) {
        if (r < x0) return;
        svg += '<line x1="' + X(r) + '" x2="' + X(r) + '" y1="12" y2="200" stroke="var(--cpa-warn)" stroke-dasharray="3 3"/><text x="' + (X(r) + 3) + '" y="12" font-size="10" fill="var(--cpa-warn)">giro</text>';
      });
      svg += '<line x1="' + X(t) + '" x2="' + X(t) + '" y1="10" y2="205" stroke="currentColor" opacity=".4"/>' +
        '<text x="4" y="205" font-size="10" fill="currentColor" opacity=".7">● = un tic que suma 1 segundo</text>';
      q(".cpa-jobs").innerHTML = svg;
    }
    reiniciar();
    reloj = setInterval(tic, 100);
  }

  // ----------------------------------------------------------------- arranque

  var DEMOS = {
    viewmodel: {
      title: "¿Qué es y para qué sirve un ViewModel?",
      subtitle: "Avanza paso a paso o pulsa Reproducir",
      code: VM_CODE,
      steps: VM_STEPS,
      render: renderViewModel
    },
    stateflow: { title: "Un estado inmutable que viaja por un StateFlow", subtitle: "Avanza paso a paso o pulsa Reproducir", code: SF_CODE, steps: SF_STEPS, render: renderStateFlow },
    fases: { title: "Qué se vuelve a ejecutar: composición, diseño y dibujo", subtitle: "Avanza paso a paso o pulsa Reproducir", code: FASES_CODE, steps: FASES_STEPS, render: renderFases },
    pila: { title: "Apilar o sustituir: la pila y la vida de cada ViewModel", subtitle: "Avanza paso a paso o pulsa Reproducir", code: PILA_CODE, steps: PILA_STEPS, render: renderPila },
    virtual: { title: "Probar el tiempo sin esperar: el reloj virtual", subtitle: "Avanza paso a paso o pulsa Reproducir", code: VIRTUAL_CODE, steps: VIRTUAL_STEPS, render: renderVirtual },
    udf: { build: buildUdf },
    volteo: { build: buildVolteo },
    job: { build: buildJob }
  };

  function init() {
    var nodes = document.querySelectorAll(".cpa[data-cpa]:not([data-cpa-ready])");
    Array.prototype.forEach.call(nodes, function (node) {
      var cfg = DEMOS[node.getAttribute("data-cpa")];
      if (!cfg) return;
      node.setAttribute("data-cpa-ready", "");
      if (cfg.build) cfg.build(node); else stepper(node, cfg);
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
