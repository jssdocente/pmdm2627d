/*
 * Conceptos animados para MkDocs
 * ------------------------------
 * Animaciones paso a paso: a la izquierda el código, con la línea activa
 * resaltada; a la derecha, lo que ocurre; debajo, una frase que lo explica.
 *
 * Uso en un .md:
 *   <div class="cpa" data-cpa="estado"></div>      -> var, remember, rememberSaveable o ViewModel: dónde vive el estado (proyecto, paso a paso)
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

  // ------------------------------- Memory: un turno, estado a estado (guía exprés)
  // Solo enseña el esqueleto que publica la guía (firmas y TODO), nunca las reglas resueltas.

  var TURNO_CODE = [
    "data class TableroUiState(",
    "    val cartas: List<Carta> = emptyList(),",
    "    // TODO 5: el resto del estado (movimientos, …)",
    ")",
    "",
    "class TableroViewModel(nivel: Nivel, …) : ViewModel() {",
    "    private val _uiState = MutableStateFlow(TableroUiState())",
    "    val uiState: StateFlow<TableroUiState> = _uiState.asStateFlow()",
    "",
    "    init { onNuevaPartida() }",
    "",
    "    fun onNuevaPartida() {",
    "        _uiState.value = TableroUiState(cartas = repartir(…), …)",
    "    }",
    "",
    "    fun onCartaPulsada(id: Int) {",
    "        // TODO 7: las reglas, caso a caso",
    "        _uiState.update { it.copy(/* … */) }",
    "    }",
    "}",
    "",
    "// TableroScreen",
    "val estado by viewModel.uiState.collectAsStateWithLifecycle()",
    "TableroContent(estado, onCartaPulsada = viewModel::onCartaPulsada)",
    "",
    "// ❌ Lo que NO se hace (un estado con una lista mutable):",
    "_uiState.value.cartasMutables[0] = cartaVolteada"
  ];

  // Cuatro cartas, dos parejas. a = boca abajo, b = boca arriba, p = emparejada.
  var TURNO_DIB = { 1: "🍎", 2: "🐱", 3: "🍎", 4: "🐱" };

  function turnoChip(id, sit, chg, big) {
    var cls = "cpa-tc " + sit + (chg ? " chg" : "") + (big ? " big" : "");
    return '<span class="' + cls + '">' + (sit === "a" ? "?" : TURNO_DIB[id]) + "</span>";
  }

  function turnoBox(b, nuevo) {
    var chips = [1, 2, 3, 4].map(function (id, n) {
      return turnoChip(id, b.c[n], (b.chg || []).indexOf(id) >= 0);
    }).join("");
    var mov = (b.chg || []).indexOf("mov") >= 0 ? '<span class="chg">movimientos = ' + b.mov + "</span>" : "movimientos = " + b.mov;
    var bad = b.st === "mutado";
    return '<div class="cpa-uis ' + (b.st || "") + (nuevo ? " pop" : "") + '"><div class="h">UiState #' + b.id +
      (b.st === "viejo" ? " · ya nadie lo usa" : "") + (bad ? " · ¡cambiado por dentro!" : "") + "</div>" +
      '<div class="cpa-tcs' + (bad ? " bad" : "") + '">cartas = ' + chips + "</div><div>" + mov + "</div>" +
      '<div class="cpa-note">… lo que añadas en el TODO 5</div></div>';
  }

  function renderTurno(sc, s, prev) {
    var ids = prev ? prev.boxes.map(function (b) { return b.id; }) : [];
    var boxes = s.boxes.map(function (b) { return turnoBox(b, prev && ids.indexOf(b.id) < 0); }).join("");
    var flash = prev && prev.screen.recomp !== s.screen.recomp;
    var tablero = s.sub ? '<div class="cpa-tab">' + [1, 2, 3, 4].map(function (id, n) {
      return '<span class="cpa-tcw">' + turnoChip(id, s.screen.c[n], false, true) +
        (s.tap === id ? '<span class="cpa-tap" aria-hidden="true">👆</span>' : "") + "</span>";
    }).join("") + '</div><div class="cpa-note">Movimientos: ' + s.screen.mov + "</div>" : '<div class="big">…</div>';
    sc.innerHTML =
      '<div class="cpa-sf"><div class="cpa-sf-vm"><div class="cpa-lbl">TableroViewModel · _uiState</div>' + boxes +
      '<div class="cpa-lbl" style="margin-top:.4rem">valor del StateFlow → <b>UiState #' + s.value + "</b></div></div>" +
      '<div class="cpa-pipe"><span class="cpa-lbl">StateFlow</span>' +
      (s.tok ? '<span class="cpa-tok ' + s.tok.dir + '"><span class="cpa-pill ' + s.tok.k + '">' + s.tok.t + "</span></span>" : "") +
      '<span class="cpa-lbl">' + (s.sub ? "suscrita ✓" : "sin suscribir") + "</span></div>" +
      '<div class="cpa-phone' + (flash ? " flash" : "") + '"><div class="cpa-lbl">TableroScreen</div>' + tablero +
      '<div class="cpa-note">recomposiciones: ' + s.screen.recomp + "</div>" +
      (s.ro ? '<div class="cpa-note">🔒 solo lectura: no puede escribir en el estado</div>' : "") +
      (s.ok ? '<div class="cpa-note"><b>' + s.ok + "</b></div>" : "") +
      (s.warn ? '<div class="cpa-warn">' + s.warn + "</div>" : "") + "</div></div>";
  }

  var T1 = { id: 1, c: ["a", "a", "a", "a"], mov: 0 };
  var T2 = { id: 2, c: ["b", "a", "a", "a"], mov: 0, chg: [1] };
  var T3 = { id: 3, c: ["p", "a", "p", "a"], mov: 1, chg: [1, 3, "mov"] };
  var P0 = { c: ["a", "a", "a", "a"], mov: 0 };
  var P1 = { c: ["b", "a", "a", "a"], mov: 0 };
  var P2 = { c: ["p", "a", "p", "a"], mov: 1 };
  function pant(p, r) { return { c: p.c, mov: p.mov, recomp: r }; }

  var TURNO_STEPS = [
    { hl: [0, 1, 2, 3], txt: "El estado del tablero es una <b>foto</b> de todo lo que se pinta: una <code>data class</code> con <code>val</code>. Lo que añadas en el TODO 5 también será <code>val</code>.",
      s: { boxes: [], value: "–", sub: false, screen: pant(P0, 0) } },
    { hl: [6, 9, 11, 12], txt: "Al crearse el ViewModel, <code>init</code> llama a <code>onNuevaPartida()</code>: reparte las cartas y guarda el <b>UiState #1</b> en el <code>MutableStateFlow</code> privado. Todas boca abajo, 0 movimientos.",
      s: { boxes: [T1], value: 1, sub: false, screen: pant(P0, 0) } },
    { hl: [7], txt: "Hacia fuera solo se publica un <b>StateFlow</b> de solo lectura: la pantalla podrá mirar el estado, pero nunca cambiarlo.",
      s: { boxes: [T1], value: 1, sub: false, ro: true, screen: pant(P0, 0) } },
    { hl: [22, 23], txt: "<code>TableroScreen</code> se suscribe con <code>collectAsStateWithLifecycle()</code>, recibe el #1 y se lo pasa a <code>TableroContent</code>, que pinta cuatro cartas boca abajo.",
      s: { boxes: [T1], value: 1, sub: true, ro: true, screen: pant(P0, 1), tok: { dir: "down", k: "st", t: "#1" } } },
    { hl: [15, 23], txt: "El usuario pulsa la carta 1. La carta <b>no se da la vuelta sola</b>: <code>TableroContent</code> solo avisa con <code>onCartaPulsada(1)</code>, y el evento sube al ViewModel.",
      s: { boxes: [T1], value: 1, sub: true, ro: true, tap: 1, screen: pant(P0, 1), tok: { dir: "up", k: "ev", t: "onCartaPulsada(1)" } } },
    { hl: [16, 17], txt: "El ViewModel aplica las reglas (eso es tu <b>TODO 7</b>). Es la primera carta del turno, así que <code>copy</code> crea un <b>UiState #2</b> con la carta 1 boca arriba. El #1 no se toca.",
      s: { boxes: [T1, T2], value: 1, sub: true, ro: true, screen: pant(P0, 1) } },
    { hl: [17], txt: "<code>update</code> guarda el #2. Es <b>distinto</b> del #1, así que el StateFlow lo emite hacia la pantalla.",
      s: { boxes: [T1, T2], value: 2, sub: true, ro: true, screen: pant(P0, 1), tok: { dir: "down", k: "st", t: "#2" } } },
    { hl: [22, 23], txt: "La pantalla recibe el #2 y se <b>recompone</b>: la carta 1 enseña su dibujo. Nadie la ha volteado a mano: se ha pintado un estado nuevo.",
      s: { boxes: [con(T1, { st: "viejo" }), T2], value: 2, sub: true, ro: true, screen: pant(P1, 2) } },
    { hl: [15, 23], txt: "Ahora pulsa la carta 3. Otra vez, solo sube un evento: <code>onCartaPulsada(3)</code>.",
      s: { boxes: [T2], value: 2, sub: true, ro: true, tap: 3, screen: pant(P1, 2), tok: { dir: "up", k: "ev", t: "onCartaPulsada(3)" } } },
    { hl: [16, 17], txt: "Es la segunda carta y las dos son 🍎: según las reglas, quedan <b>emparejadas</b> y cuenta un movimiento. Un solo <code>copy</code> cambia varias cosas a la vez en el <b>UiState #3</b>.",
      s: { boxes: [T2, T3], value: 2, sub: true, ro: true, screen: pant(P1, 2) } },
    { hl: [17, 22, 23], txt: "El StateFlow emite el #3 y la pantalla se recompone: la pareja en verde y «Movimientos: 1».",
      s: { boxes: [con(T2, { st: "viejo" }), T3], value: 3, sub: true, ro: true, screen: pant(P2, 3), tok: { dir: "down", k: "st", t: "#3" } } },
    { hl: [15, 16], txt: "¿Y si se pulsa otra vez la carta 1, que ya está emparejada? La regla dice <b>no hacer nada</b>: no hay <code>copy</code>, no hay estado nuevo y la pantalla <b>no se recompone</b>. Lo decide el ViewModel, no la pantalla.",
      s: { boxes: [T3], value: 3, sub: true, ro: true, tap: 1, ok: "sin estado nuevo: nada que pintar", screen: pant(P2, 3), tok: { dir: "up", k: "ev", t: "onCartaPulsada(1)" } } },
    { hl: [25, 26], bad: true, txt: "<b>El error clásico:</b> cambiar una carta por dentro de una lista mutable. El dato cambia, pero el StateFlow ve <b>el mismo objeto</b> y no emite: la pantalla sigue pintando lo de antes.",
      s: { boxes: [con(T3, { st: "mutado", chg: [2], c: ["p", "b", "p", "a"] })], value: 3, sub: true, ro: true, screen: pant(P2, 3),
        warn: "La carta 2 está boca arriba en el dato, pero no en la pantalla: nadie ha avisado." } }
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

  // ------------------------- Memory: el tablero jugable (eventos suben, estado baja)
  // Muestra el comportamiento que describe el KDoc de onCartaPulsada, nunca su código.

  function memChip(d, sit, extra) {
    return '<span class="cpa-tc ' + sit + (extra ? " " + extra : "") + '">' + (sit === "a" ? "?" : d) + "</span>";
  }

  function buildTablero(root) {
    var DIBS = ["🍎", "🐱", "⭐"];
    var pad = frame(root, "Juega: el evento sube, el estado baja", "Pulsa las cartas del tablero");
    pad.innerHTML =
      '<div class="cpa-ctrl"><button type="button" class="b-nueva">Nueva partida</button>' +
      '<label><input type="checkbox" class="o-slow"> Cámara lenta</label>' +
      '<label><input type="checkbox" class="o-norule"> Quitar la regla 2 (carta ya descubierta → nada)</label></div>' +
      '<div class="cpa-flow"><div class="cpa-box"><div class="cpa-lbl">TableroContent · sin estado</div>' +
      '<div class="cpa-mtab o-tab"></div><div class="cpa-total o-mov"></div><p class="cpa-note o-nota"></p></div>' +
      '<div class="cpa-fpipe"><span class="l t">↑ eventos</span><span class="l b">↓ StateFlow</span></div>' +
      '<div class="cpa-box"><div class="cpa-lbl">TableroViewModel</div><div class="cpa-state o-state"></div>' +
      '<div class="cpa-evlog o-log"></div></div></div>';
    var q = function (c) { return pad.querySelector(c); };
    var st, marcas, num = 0, pipe = q(".cpa-fpipe");
    function lento() { return q(".o-slow").checked ? 3 : 1; }
    function log(m, c) { var d = document.createElement("div"); d.innerHTML = m; if (c) d.className = c; q(".o-log").insertBefore(d, q(".o-log").firstChild); }
    function copia(o) { return JSON.parse(JSON.stringify(o)); }
    function token(tipo, texto, sube, fin) {
      var t = document.createElement("div"); t.className = "cpa-token " + tipo; t.textContent = texto;
      var h = pipe.clientHeight || 160; t.style.transitionDuration = (0.55 * lento()) + "s"; t.style.top = (sube ? h - 40 : 18) + "px";
      pipe.appendChild(t);
      requestAnimationFrame(function () { requestAnimationFrame(function () { t.style.top = (sube ? 18 : h - 40) + "px"; }); });
      setTimeout(function () { t.style.opacity = 0; setTimeout(function () { t.remove(); }, 300); if (fin) fin(); }, 550 * lento());
    }
    function emitir(n) { var a = st; st = n; num++; pintarEstado(a); token("st", "UiState #" + num, false, function () { recomponer(a); }); }
    function carta(o, id) { return o.cartas.filter(function (c) { return c.id === id; })[0]; }
    function barajar() {
      var d = DIBS.concat(DIBS);
      for (var k = d.length - 1; k > 0; k--) { var r = Math.floor(Math.random() * (k + 1)), x = d[k]; d[k] = d[r]; d[r] = x; }
      return d.map(function (x, k) { return { id: k + 1, d: x, s: "a" }; });
    }

    function onCartaPulsada(id) {
      if (st.bloq) { log("onCartaPulsada(" + id + ") → <b>1.</b> tablero bloqueado: nada", "ign"); return; }
      var c = carta(st, id), libre = c.s === "a";
      if (!libre && !q(".o-norule").checked) { log("onCartaPulsada(" + id + ") → <b>2.</b> ya descubierta: nada, sin estado nuevo", "ign"); return; }
      var arriba = st.cartas.filter(function (x) { return x.s === "b"; });
      var n = copia(st), nc = carta(n, id);
      if (!arriba.length) {
        nc.s = "b"; log("onCartaPulsada(" + id + ") → <b>3.</b> primera del turno: boca arriba", "ok"); emitir(n); return;
      }
      var pr = arriba[0], np = carta(n, pr.id);
      n.mov++;
      if (pr.d === c.d) {
        nc.s = "p"; np.s = "p";
        if (pr.id === c.id) log("onCartaPulsada(" + id + ") → <b>4a.</b> ¡pareja… consigo misma! Sin la regla 2, el juego se rompe", "ign");
        else log("onCartaPulsada(" + id + ") → <b>4a.</b> ¡pareja! emparejadas · movimientos = " + n.mov, "ok");
        emitir(n);
        if (n.cartas.every(function (x) { return x.s === "p"; })) log("todas emparejadas: <b>partida ganada</b>", "ok");
        return;
      }
      nc.s = "b"; n.bloq = true;
      log("onCartaPulsada(" + id + ") → <b>4b.</b> no son pareja: se ven un momento, tablero bloqueado", "co");
      emitir(n);
      setTimeout(function () {
        if (!vivo(root) || st.cartas.length !== n.cartas.length) return;
        var m = copia(st); carta(m, id).s = "a"; carta(m, pr.id).s = "a"; m.bloq = false;
        log("…y vuelven boca abajo; desbloqueado", "co"); emitir(m);
      }, 1300 * lento());
    }

    function pintarEstado(a) {
      var ch = a ? st.cartas.map(function (c, k) { return a.cartas[k].s !== c.s || a.cartas[k].d !== c.d; }) : [];
      var L = ["TableroUiState("];
      L.push("  cartas = " + st.cartas.map(function (c, k) { return memChip(c.d, c.s, ch[k] ? "chg" : ""); }).join(""));
      var cm = a && a.mov !== st.mov;
      L.push((cm ? '<span class="chg">' : "") + "  movimientos = " + st.mov + (cm ? "</span>" : ""));
      L.push('  <span class="cpa-com">// … lo que añadas en el TODO 5</span>');
      if (st.bloq) L.push('  <span class="cpa-com">// bloqueado: investigación 6.2</span>');
      L.push(")");
      q(".o-state").innerHTML = L.join("\n");
    }

    function recomponer(a) {
      var tab = q(".o-tab");
      st.cartas.forEach(function (c, k) {
        var w = tab.children[k], b = w.querySelector("button");
        b.className = "cpa-tc big " + c.s; b.textContent = c.s === "a" ? "?" : c.d;
        b.setAttribute("aria-label", "Carta " + c.id + (c.s === "a" ? ", boca abajo" : c.s === "b" ? ", boca arriba" : ", emparejada"));
        if (a && (a.cartas[k].s !== c.s || a.cartas[k].d !== c.d)) {
          marcas[k]++; w.classList.remove("flash"); void w.offsetWidth; w.classList.add("flash");
        }
        var g = w.querySelector(".cpa-badge"); g.textContent = marcas[k]; g.style.display = marcas[k] ? "" : "none";
      });
      var par = st.cartas.filter(function (x) { return x.s === "p"; }).length; par = Math.floor(par / 2);
      var mv = q(".o-mov"); mv.textContent = "Movimientos: " + st.mov + " · Parejas: " + par + "/" + DIBS.length;
      if (a && a.mov !== st.mov) { mv.classList.remove("flash"); void mv.offsetWidth; mv.classList.add("flash"); }
      q(".o-nota").textContent = par === DIBS.length ? "¡Partida ganada! Pulsa «Nueva partida»." :
        st.bloq ? "Bloqueado: los toques siguen llegando al ViewModel, que es quien los ignora." :
        "La carta no se da la vuelta sola: solo avisa. El número de cada carta cuenta cuántas veces se ha vuelto a dibujar.";
    }

    function montar(nuevo) {
      st = { cartas: barajar(), mov: 0, bloq: false }; num = 1;
      marcas = st.cartas.map(function () { return 0; });
      var tab = q(".o-tab"); tab.innerHTML = "";
      st.cartas.forEach(function (c) {
        var w = document.createElement("span"); w.className = "cpa-tcw";
        w.innerHTML = '<button type="button"></button><span class="cpa-badge"></span>';
        w.querySelector("button").onclick = function () { token("ev", "onCartaPulsada(" + c.id + ")", true, function () { onCartaPulsada(c.id); }); };
        tab.appendChild(w);
      });
      q(".o-log").innerHTML = ""; log(nuevo ? "onNuevaPartida(): reparte y publica UiState #1" : "init → onNuevaPartida(): UiState #1");
      pintarEstado(null); recomponer(null);
    }
    q(".b-nueva").onclick = function () { token("ev", "onNuevaPartida()", true, function () { montar(true); }); };
    montar(false);
  }

  // ------------------------------- Memory (guía exprés): giro, test, fases y pila
  // Tablero fijo de 6 cartas: parejas 1-5 (🍎), 2-4 (🐱) y 3-6 (⭐).

  var M6 = ["🍎", "🐱", "⭐", "🐱", "🍎", "⭐"];
  function miniTab(sits, opts) {
    opts = opts || {};
    return '<div class="cpa-mtab mini">' + sits.map(function (sit, k) {
      var cls = (opts.hl || []).indexOf(k + 1) >= 0 ? "chg" : "";
      if (opts.ver && sit === "a") return '<span class="cpa-tc a ver ' + cls + '">' + M6[k] + "</span>";
      return memChip(M6[k], sit, cls);
    }).join("") + "</div>";
  }

  // ---- §1.3 · la partida sobrevive al giro

  var GIRO_CODE = [
    "class TableroViewModel(nivel: Nivel, …) : ViewModel() {",
    "    private val _uiState = MutableStateFlow(TableroUiState())",
    "    val uiState: StateFlow<TableroUiState> = _uiState.asStateFlow()",
    "    init { onNuevaPartida() }",
    "    // al destruirse: onCleared() y viewModelScope cancela sus corrutinas",
    "}",
    "",
    "// MemoryApp",
    "entry<Tablero> { clave ->",
    "    val viewModel = viewModel { TableroViewModel(clave.nivel) }",
    "    TableroScreen(viewModel, …)",
    "}",
    "",
    "// TableroScreen",
    "val estado by viewModel.uiState.collectAsStateWithLifecycle()",
    "",
    "// ❌ La partida guardada en la pantalla:",
    "var cartas by remember { mutableStateOf(repartir(…)) }"
  ];

  var G_INI = ["a", "a", "a", "a", "a", "a"];
  var G_MID = ["p", "p", "a", "p", "p", "a"];

  function renderGiro(sc, s, prev) {
    var a = s.act, vm = s.vm;
    var logs = (s.log || []).map(function (l, k) {
      var nuevo = prev && (prev.log || []).length <= k;
      return '<div class="' + (nuevo ? "new" : "") + '">' + esc(l) + "</div>";
    }).join("") || '<span class="cpa-note">vacío</span>';
    var act = '<div class="cpa-act' + (a.dead ? " dead" : "") + (a.isNew && prev ? " pop" : "") + '">' +
      '<div class="cpa-act-h"><span>Activity nº ' + a.n + "</span><span>" + (a.dead ? "destruida" : "en pantalla") + "</span></div>" +
      '<div class="cpa-lbl">' + (a.scr || "TableroScreen") + "</div>" +
      (a.tab ? miniTab(a.tab) + '<div class="cpa-note">Movimientos: ' + a.mov + "</div>" : '<div class="cpa-note">' + (a.txt || "…") + "</div>") +
      (a.rem ? slot("si la partida estuviera en remember", a.rem, a.rem.indexOf("✗") >= 0 ? "lost" : "") : "") +
      slot("viewModel { … }", a.ref || "—", a.ref ? "ref" : "") + "</div>";
    var look = '<div class="cpa-look">' + (s.look
      ? '<span class="arrow">→</span>busca Tablero&shy;ViewModel<br><span class="' + s.look.k + '">' + s.look.r + "</span>" : "") + "</div>";
    var nuevoVm = prev && vm && (!prev.vm || prev.vm.id !== vm.id);
    var store = '<div class="cpa-store' + (s.store ? "" : " gone") + '"><div class="cpa-lbl">' +
      (s.store ? "ViewModelStore · " + s.store : "almacén eliminado") + "</div>" +
      (vm ? '<div class="cpa-obj' + (vm.dead ? " dead" : "") + (nuevoVm ? " pop" : "") + '"><b>TableroViewModel ' + vm.id +
        "</b><br>nivel = " + vm.niv + "<br>" + (vm.tab ? miniTab(vm.tab) : "") + "movimientos = " + vm.mov + "</div>"
        : '<p class="cpa-note">vacío</p>') + "</div>";
    sc.innerHTML = '<div class="cpa-vm">' + act + look + store +
      '<div class="cpa-log"><div class="cpa-lbl">Logcat</div>' + logs + "</div></div>";
  }

  var GV1 = "@4c1e", GV2 = "@9b07";
  var GIRO_STEPS = [
    { hl: [0, 5], txt: "El ViewModel de la partida es una clase que hereda de <code>ViewModel</code>. Lo importante es <b>dónde vive</b>: no dentro de la pantalla, sino en un <b>almacén</b> aparte que Android conserva.",
      s: { act: { n: 1, scr: "Inicio", txt: "elige nivel" }, store: "entrada Tablero(FACIL)", vm: null } },
    { hl: [8, 9, 3], txt: "Se entra en el tablero. <code>viewModel { … }</code> busca en el almacén: no hay ninguno, así que crea un <code>TableroViewModel(FACIL)</code>. Su <code>init</code> reparte las cartas.",
      s: { act: { n: 1, tab: G_INI, mov: 0, ref: GV1 }, look: BUSCA_NO, store: "entrada Tablero(FACIL)", vm: { id: GV1, niv: "FACIL", tab: G_INI, mov: 0 }, log: ["TableroViewModel " + GV1 + " creado · reparte"] } },
    { hl: [9, 14], txt: "Se juega: dos parejas y 5 movimientos. Cada recomposición vuelve a pedir el ViewModel y <b>lo encuentra</b>: el mismo objeto, con el mismo estado.",
      s: { act: { n: 1, tab: G_MID, mov: 5, ref: GV1, rem: "2 parejas, 5 mov." }, look: BUSCA_SI, store: "entrada Tablero(FACIL)", vm: { id: GV1, niv: "FACIL", tab: G_MID, mov: 5 }, log: ["TableroViewModel " + GV1 + " creado · reparte"] } },
    { hl: [16, 17], bad: true, txt: "Giras el móvil. Android <b>destruye la Activity</b> y todo lo que había dentro. Si la partida estuviera en un <code>remember</code> de la pantalla, se perdería aquí. El almacén, en cambio, <b>se conserva</b>.",
      s: { act: { n: 1, tab: G_MID, mov: 5, dead: true, rem: "✗ perdida" }, store: "entrada Tablero(FACIL)", vm: { id: GV1, niv: "FACIL", tab: G_MID, mov: 5 }, log: ["TableroViewModel " + GV1 + " creado · reparte", "(giro: Activity destruida)"] } },
    { hl: [9, 14], txt: "Se crea la <b>Activity nº 2</b>. <code>viewModel { … }</code> encuentra <b>el mismo</b> " + GV1 + " y <code>collectAsStateWithLifecycle()</code> recibe su estado: el tablero aparece igual. No hay otro <code>init</code>: no se vuelve a repartir.",
      s: { act: { n: 2, tab: G_MID, mov: 5, ref: GV1, isNew: true, rem: "✗ empezaría de cero" }, look: BUSCA_SI, store: "entrada Tablero(FACIL)", vm: { id: GV1, niv: "FACIL", tab: G_MID, mov: 5 }, log: ["TableroViewModel " + GV1 + " creado · reparte", "(giro: Activity destruida)"] } },
    { hl: [4], txt: "Ahora sales del tablero (atrás, a Inicio). La entrada sale de la pila, su almacén se vacía y llega <code>onCleared()</code>: <code>viewModelScope</code> cancela sus corrutinas. El temporizador de la investigación 6.2 se para solo.",
      s: { act: { n: 2, scr: "Inicio", txt: "elige nivel" }, store: null, vm: { id: GV1, niv: "FACIL", tab: G_MID, mov: 5, dead: true }, log: ["TableroViewModel " + GV1 + " creado · reparte", "(giro: Activity destruida)", "TableroViewModel " + GV1 + " onCleared"] } },
    { hl: [8, 9, 3], txt: "Otra partida: una entrada nueva, un almacén nuevo y un <code>TableroViewModel</code> <b>nuevo</b> que reparte de nuevo. Cada partida, su ViewModel.",
      s: { act: { n: 2, tab: G_INI, mov: 0, ref: GV2 }, look: BUSCA_NO, store: "entrada Tablero(FACIL) nueva", vm: { id: GV2, niv: "FACIL", tab: G_INI, mov: 0 }, log: ["TableroViewModel " + GV1 + " creado · reparte", "(giro: Activity destruida)", "TableroViewModel " + GV1 + " onCleared", "TableroViewModel " + GV2 + " creado · reparte"] } }
  ];

  // ---- §1.8 · el juego, probado sin pantalla

  var TEST_CODE = [
    "class TableroViewModelTest {",
    "    @get:Rule val mainDispatcherRule = MainDispatcherRule()",
    "",
    "    private fun crearViewModel() =",
    "        TableroViewModel(nivel = …, random = Random(42))",
    "    private fun idsDeUnaPareja(estado: TableroUiState): Pair<Int, Int> = …",
    "",
    "    @Test",
    "    fun `al pulsar dos cartas iguales quedan emparejadas…`() {",
    "        // Arrange: el ViewModel y los ids de una pareja",
    "        // Act: pulsar las dos",
    "        // Assert: las dos emparejadas, 1 movimiento, 1 pareja",
    "    }",
    "}"
  ];

  var TESTS = ["iguales: emparejadas y 1 movimiento", "distintas: no se emparejan", "todas las parejas: ganada", "carta ya descubierta: nada"];

  function renderTest(sc, s, prev) {
    var lista = TESTS.map(function (t, k) {
      var r = s.res[k];
      return '<div class="cpa-tr ' + (r === "✓" ? "ok" : r === "✗" ? "ko" : "") + '"><b>' + r + "</b> " + t + "</div>";
    }).join("");
    var checks = (s.checks || []).map(function (c) {
      return '<div class="cpa-tr ' + (c[0] === "✓" ? "ok" : "ko") + '"><b>' + c[0] + "</b> " + c[1] + "</div>";
    }).join("");
    sc.innerHTML = '<div class="cpa-tst">' +
      '<div class="cpa-box"><div class="cpa-lbl">JVM del ordenador · sin emulador, sin pantalla</div>' +
      (s.fase ? '<div class="cpa-fase">' + s.fase + "</div>" : "") +
      (s.main ? '<div class="cpa-note">Dispatchers.Main → <b>' + s.main + "</b></div>" : "") +
      (s.vm ? '<div class="cpa-obj' + (prev && !prev.vm ? " pop" : "") + '"><b>TableroViewModel</b> · Random(42)<br>' +
        miniTab(s.vm.tab, { ver: true, hl: s.vm.hl }) + "movimientos = " + s.vm.mov +
        (s.vm.nota ? '<div class="cpa-note">' + s.vm.nota + "</div>" : "") + "</div>" : "") +
      (s.act ? '<div class="cpa-evlog">' + s.act.map(function (x) { return "<div>" + esc(x) + "</div>"; }).join("") + "</div>" : "") +
      checks + "</div>" +
      '<div class="cpa-box"><div class="cpa-lbl">Resultado de ./gradlew test</div>' + lista +
      '<div class="cpa-note">' + s.sum + "</div></div></div>";
  }

  var R0 = ["✗", "✗", "✗", "✗"];
  var TEST_STEPS = [
    { hl: [0, 13], txt: "Un test es una clase normal que se ejecuta en la <b>JVM del ordenador</b>: sin emulador y sin pantalla. Con los TODO del esqueleto, los cuatro tests fallan. Así empieza tu proyecto: en <b>rojo</b>.",
      s: { res: R0, sum: "4 tests, 4 fallos" } },
    { hl: [1], txt: "<code>viewModelScope</code> usa el hilo principal, que en la JVM no existe. <code>MainDispatcherRule</code> lo cambia por uno de pruebas antes de cada test. Va completa: cópiala tal cual.",
      s: { res: R0, sum: "4 tests, 4 fallos", main: "uno de pruebas" } },
    { hl: [3, 4, 9], txt: "<b>Arrange.</b> Se crea el ViewModel con <code>Random(42)</code>: el reparto sale <b>siempre igual</b>. Y el test ve el estado entero, también lo que hay debajo de las cartas boca abajo.",
      s: { res: R0, sum: "4 tests, 4 fallos", main: "uno de pruebas", fase: "Arrange · preparar", vm: { tab: G_INI, mov: 0 } } },
    { hl: [5, 9], txt: "No memorices posiciones: <b>búscalas en el estado</b>. <code>idsDeUnaPareja</code> agrupa las cartas por su pareja y devuelve dos ids del mismo grupo, aquí el 1 y el 5.",
      s: { res: R0, sum: "4 tests, 4 fallos", main: "uno de pruebas", fase: "Arrange · preparar", vm: { tab: G_INI, mov: 0, hl: [1, 5], nota: "idsDeUnaPareja → (1, 5)" } } },
    { hl: [10], txt: "<b>Act.</b> El test llama a los eventos <b>como si el usuario pulsara</b>: <code>onCartaPulsada(1)</code> y <code>onCartaPulsada(5)</code>. Nadie toca una pantalla.",
      s: { res: R0, sum: "4 tests, 4 fallos", main: "uno de pruebas", fase: "Act · actuar", act: ["onCartaPulsada(1)", "onCartaPulsada(5)"], vm: { tab: ["p", "a", "a", "a", "p", "a"], mov: 1, hl: [1, 5] } } },
    { hl: [11], txt: "<b>Assert.</b> Se mira <code>viewModel.uiState.value</code> y se comprueba lo que dice el nombre del test. Todo cuadra: el primer test pasa a <b>verde</b>.",
      s: { res: ["✓", "✗", "✗", "✗"], sum: "4 tests, 1 correcto, 3 fallos", main: "uno de pruebas", fase: "Assert · comprobar", vm: { tab: ["p", "a", "a", "a", "p", "a"], mov: 1 },
        checks: [["✓", "las cartas 1 y 5, emparejadas"], ["✓", "movimientos = 1"], ["✓", "1 pareja encontrada"]] } },
    { hl: [11], bad: true, txt: "¿Y si se te olvida contar el movimiento en <code>onCartaPulsada</code>? El test lo detecta al momento, sin abrir el emulador ni jugar una partida: <code>expected:&lt;1&gt; but was:&lt;0&gt;</code>.",
      s: { res: ["✗", "✗", "✗", "✗"], sum: "4 tests, 4 fallos", main: "uno de pruebas", fase: "Assert · comprobar", vm: { tab: ["p", "a", "a", "a", "p", "a"], mov: 0 },
        checks: [["✓", "las cartas 1 y 5, emparejadas"], ["✗", "movimientos: esperaba 1, hay 0"]] } },
    { hl: [7, 8], txt: "Los demás tests siguen la misma receta. Cuando los cuatro estén en verde, las reglas funcionan, y la pantalla solo tendrá que pintarlas.",
      s: { res: ["✓", "✓", "✓", "✓"], sum: "4 tests, 4 correctos" } }
  ];

  // ---- §2.1 · qué se vuelve a dibujar al voltear una carta

  var MFASES_CODE = [
    "@Composable",
    "fun TableroScreen(viewModel: TableroViewModel, …) {",
    "    val estado by viewModel.uiState.collectAsStateWithLifecycle()",
    "    TableroContent(estado, onCartaPulsada = viewModel::onCartaPulsada)",
    "}",
    "",
    "@Composable",
    "fun TableroContent(estado: TableroUiState, onCartaPulsada: (Int) -> Unit) {",
    "    Marcador(movimientos = …, parejas = …)",
    "    LazyVerticalGrid(columns = GridCells.Fixed(…)) {",
    "        items(estado.cartas, key = { it.id }) { carta ->",
    "            CartaView(carta, onClick = { onCartaPulsada(carta.id) })",
    "        }",
    "    }",
    "}",
    "",
    "// Investigación 6.1: el ángulo se lee al DIBUJAR",
    "Modifier.graphicsLayer { rotationY = angulo }",
    "// ⚠️ Parece lo mismo, pero se lee al COMPONER:",
    "Modifier.graphicsLayer(rotationY = angulo)"
  ];

  var MNODOS = [["TableroScreen", 0], ["TableroContent", 1], ["Marcador", 2], ["LazyVerticalGrid", 2]]
    .concat([1, 2, 3, 4, 5, 6].map(function (n) { return ["CartaView " + n, 3]; }));

  function renderMemFases(sc, s) {
    var arbol = MNODOS.map(function (n) {
      var cls = s.comp.indexOf(n[0]) >= 0 ? "c" : s.draw.indexOf(n[0]) >= 0 ? "d" : s.skip ? "s" : "";
      var c = s.cnt[n[0]] || [1, 1];
      return '<div class="cpa-node i' + n[1] + " " + cls + '"><span>' + n[0] + "</span><small>comp " + c[0] + " · dibujo " + c[1] + "</small></div>";
    }).join("");
    var fase = function (k, t, d) {
      return '<div class="cpa-phase' + (s.ph.indexOf(k) >= 0 ? " on" : "") + '">' + t + "<small>" + d + "</small></div>";
    };
    sc.innerHTML = '<div class="cpa-ph"><div><div class="cpa-lbl">Árbol de la pantalla</div>' + arbol +
      '<p class="cpa-note"><span class="cpa-sw c"></span> se recompone · <span class="cpa-sw d"></span> solo se redibuja</p></div>' +
      '<div class="cpa-phases"><div class="cpa-lbl">El tablero</div>' + miniTab(s.tab, { hl: s.hl }) +
      (s.giro ? '<p class="cpa-note" style="text-align:center">carta 5 girando: <code>angulo = ' + s.giro + "°</code></p>" : "") +
      '<div class="cpa-lbl" style="margin-top:.5rem">Fases de un fotograma</div>' +
      fase("c", "1 · Composición", "qué se muestra: ejecuta las funciones") +
      fase("l", "2 · Diseño", "dónde va: mide y coloca") +
      fase("d", "3 · Dibujo", "cómo se ve: pinta los píxeles") +
      (s.fps ? '<p class="cpa-note" style="text-align:center">' + s.fps + "</p>" : "") + "</div></div>";
  }

  function cuenta(base, cambios) {
    var r = {}, k;
    MNODOS.forEach(function (n) { r[n[0]] = (base[n[0]] || [1, 1]).slice(); });
    for (k in cambios) r[k] = cambios[k];
    return r;
  }
  var MF_TODOS = MNODOS.map(function (n) { return n[0]; });
  var MF1 = cuenta({}, {});
  var MF2 = cuenta(MF1, { "TableroScreen": [2, 2], "TableroContent": [2, 2], "LazyVerticalGrid": [2, 2], "CartaView 1": [2, 2] });
  var MF3 = cuenta(MF2, { "TableroScreen": [3, 3], "TableroContent": [3, 3], "LazyVerticalGrid": [3, 3], "Marcador": [2, 2], "CartaView 1": [3, 3], "CartaView 5": [2, 2] });
  var MF4 = cuenta(MF3, { "CartaView 5": [2, 10] });
  var MF5 = cuenta(MF3, { "CartaView 5": [20, 20] });

  var MFASES_STEPS = [
    { hl: [1, 2, 3, 7, 8, 9, 10, 11], txt: "La primera vez se ejecutan las tres fases para <b>todo</b> el árbol: la pantalla, el marcador, la cuadrícula y las seis cartas.",
      s: { comp: MF_TODOS, draw: [], ph: ["c", "l", "d"], cnt: MF1, tab: G_INI } },
    { hl: [2, 3, 10, 11], txt: "Pulsas la carta 1 y llega un estado nuevo. Se recomponen quienes lo leen y <b>solo la carta 1</b>. Las otras cinco reciben una <code>Carta</code> igual que antes (data class: <code>equals</code>) y Compose <b>se las salta</b>. El marcador, también: sus números no han cambiado.",
      s: { skip: true, comp: ["TableroScreen", "TableroContent", "LazyVerticalGrid", "CartaView 1"], draw: [], ph: ["c", "l", "d"], cnt: MF2, tab: ["b", "a", "a", "a", "a", "a"], hl: [1] } },
    { hl: [8, 10, 11], txt: "Pulsas la carta 5: ¡pareja! Cambian las cartas 1 y 5 y los movimientos. Se recomponen esas dos cartas y el <b>marcador</b>. Las cartas 2, 3, 4 y 6 siguen sin tocarse.",
      s: { skip: true, comp: ["TableroScreen", "TableroContent", "Marcador", "LazyVerticalGrid", "CartaView 1", "CartaView 5"], draw: [], ph: ["c", "l", "d"], cnt: MF3, tab: ["p", "a", "a", "a", "p", "a"], hl: [1, 5] } },
    { hl: [10], txt: "La <code>key</code> (el <code>id</code>) le dice a Compose <b>qué carta es cuál</b>, no por su posición. Así, lo que recuerda cada celda (como el ángulo de su giro) se queda en la carta correcta.",
      s: { skip: true, comp: [], draw: [], ph: [], cnt: MF3, tab: ["p", "a", "a", "a", "p", "a"], hl: [1, 5] } },
    { hl: [16, 17], txt: "Investigación 6.1: si la carta <b>gira</b>, el ángulo cambia en cada fotograma. Leído <b>dentro de la lambda</b> de <code>graphicsLayer</code>, solo se repite el <b>dibujo</b> de esa carta. Cero recomposiciones.",
      s: { skip: true, comp: [], draw: ["CartaView 5"], ph: ["d"], cnt: MF4, tab: ["p", "a", "a", "a", "p", "a"], giro: 90, fps: "fotograma 9 de unos 18" } },
    { hl: [18, 19], bad: true, txt: "Con <code>graphicsLayer(rotationY = angulo)</code>, el ángulo se lee <b>al componer</b>: cada fotograma recompone la carta y repite las tres fases. Funciona, pero hace mucho más trabajo.",
      s: { skip: true, comp: ["CartaView 5"], draw: [], ph: ["c", "l", "d"], cnt: MF5, tab: ["p", "a", "a", "a", "p", "a"], giro: 180, fps: "18 fotogramas = 18 recomposiciones" } }
  ];

  // ---- §3.3 · la pila del Memory y un ViewModel por partida

  var MPILA_CODE = [
    "@Serializable data object Inicio : NavKey",
    "@Serializable data class Tablero(val nivel: Nivel) : NavKey",
    "// TODO 21: Resultado(…)",
    "",
    "val pila = rememberNavBackStack(Inicio)",
    "NavDisplay(",
    "    backStack = pila,",
    "    onBack = { pila.removeLastOrNull() },",
    "    entryDecorators = listOf(",
    "        rememberSaveableStateHolderNavEntryDecorator(),",
    "        rememberViewModelStoreNavEntryDecorator(),",
    "    ),",
    "    entryProvider = entryProvider {",
    "        entry<Inicio> { … pila.add(Tablero(nivel)) }",
    "        entry<Tablero> { clave ->",
    "            val viewModel = viewModel { TableroViewModel(clave.nivel) }",
    "            …",
    "        }",
    "    }",
    ")",
    "",
    "// Al ganar, ¿opción A o B?",
    "pila.add(Resultado(…))",
    "pila[pila.lastIndex] = Resultado(…)"
  ];

  var MP_INI = { uid: 1, k: "Inicio", scr: "Inicio", sub: "FACIL · MEDIO · DIFICIL" };
  var MP_TAB = { uid: 2, k: "Tablero(FACIL)", vm: "TableroViewModel(FACIL) · creado", scr: "Tablero", sub: "nivel FACIL: el ViewModel lo recibe en el constructor" };
  var MP_TAB2 = con(MP_TAB, { vm: "TableroViewModel(FACIL) · el mismo" });
  var MP_RES = { uid: 3, k: "Resultado(…)", scr: "Resultado", sub: "¡Has ganado! · 9 movimientos · 42 s" };
  var MP_TABM = { uid: 4, k: "Tablero(MEDIO)", vm: "TableroViewModel(MEDIO) · nuevo", scr: "Tablero", sub: "otra partida, otro ViewModel" };
  var MPILA_STEPS = [
    { hl: [0, 1, 2], txt: "Cada destino es una <b>clave</b> con solo <b>datos sencillos</b>: el nivel para el tablero; para el resultado, lo que pinta su pantalla. Nunca las cartas ni el ViewModel.", s: { stack: [MP_INI] } },
    { hl: [4, 5, 6], txt: "La pila empieza con <code>Inicio</code>. <code>NavDisplay</code> dibuja siempre la <b>cima</b>.", s: { stack: [MP_INI] } },
    { hl: [13, 14, 15], txt: "Se elige FACIL: <code>pila.add(Tablero(FACIL))</code>. El decorador da a <b>esta entrada</b> su propio almacén y <code>viewModel { … }</code> crea el ViewModel con el nivel de la clave.", s: { stack: [MP_INI, MP_TAB] } },
    { hl: [10, 15], txt: "Giras el móvil: la pantalla se recrea, pero el ViewModel de la entrada es <b>el mismo objeto</b>. La partida sigue.", s: { stack: [MP_INI, MP_TAB2], rot: true } },
    { hl: [21, 22], txt: "Al ganar, opción A: <b>apilar</b> el resultado. El tablero y su ViewModel siguen vivos debajo.", s: { stack: [MP_INI, MP_TAB2, MP_RES] } },
    { hl: [7], txt: "Con la opción A, atrás desde Resultado vuelve al tablero de una partida <b>ya ganada</b>.", s: { stack: [MP_INI, MP_TAB2], q: "¿Tiene sentido volver a una partida acabada? Piensa qué espera quien juega." } },
    { hl: [21, 23], txt: "Opción B: <b>sustituir</b> el tablero por el resultado. La entrada del tablero sale de la pila: su ViewModel recibe <code>onCleared()</code> y sus corrutinas (el temporizador) se cancelan.",
      s: { stack: [MP_INI, con(MP_TAB2, { gone: true, dead: true, vm: "onCleared() · corrutinas canceladas" }), MP_RES] } },
    { hl: [7], txt: "Con la opción B, atrás lleva a Inicio. Ninguna es «la buena» siempre: <b>decide y justifícalo en el README</b>.", s: { stack: [MP_INI], q: "Cada opción da un botón atrás distinto. ¿Cuál quieres en tu Memory y por qué?" } },
    { hl: [13, 15], txt: "Nueva partida en MEDIO: una entrada nueva y un <code>TableroViewModel(MEDIO)</code> <b>nuevo</b>, que reparte desde cero. Nada se arrastra de la partida anterior.", s: { stack: [MP_INI, MP_TABM] } }
  ];

  // ------------------------------- Memory (guía exprés): playgrounds propios

  function codeHtml(lines) {
    return lines.map(function (l) { return '<span class="cpa-ln">' + (kotlin(l) || " ") + "</span>"; }).join("");
  }
  function radios(nombre, ops, val) {
    var g = "cpa-" + nombre + "-" + Math.random().toString(36).slice(2, 7);
    return ops.map(function (o) {
      return '<label><input type="radio" name="' + g + '" value="' + o[0] + '"' + (o[0] === val ? " checked" : "") + "> " + o[1] + "</label>";
    }).join("");
  }
  function onRadios(pad, sel, fn) {
    Array.prototype.forEach.call(pad.querySelectorAll(sel + " input"), function (r) { r.onchange = function () { fn(r.value); }; });
  }

  // ---- §1.4 · la situación de la carta: Boolean o enum

  function buildSituacion(root) {
    var pad = frame(root, "¿Dos Boolean o una enum para la situación de la carta?", "Elige el modelo y prueba todas las combinaciones");
    pad.innerHTML = '<div class="cpa-ctrl o-mod">' + radios("mod", [["bool", "Dos <code>Boolean</code>"], ["enum", "Una <code>enum class</code>"]], "bool") + "</div>" +
      '<div class="cpa-ctrl o-val"></div>' +
      '<div class="cpa-est"><div class="cpa-code o-code"></div><div class="cpa-sit"><div class="o-carta"></div><p class="cpa-note o-nota"></p></div></div>' +
      '<table class="cpa-vals cpa-tabla o-tabla"></table>';
    var q = function (c) { return pad.querySelector(c); };
    var modo = "bool", arriba = false, emp = false, sit = "BOCA_ABAJO";
    var SITS = [["BOCA_ABAJO", "boca abajo", "a"], ["BOCA_ARRIBA", "boca arriba", "b"], ["EMPAREJADA", "emparejada", "p"]];
    function valores() {
      if (modo === "bool") {
        q(".o-val").innerHTML = '<label><input type="checkbox" class="o-ar"' + (arriba ? " checked" : "") + "> <code>bocaArriba</code></label>" +
          '<label><input type="checkbox" class="o-em"' + (emp ? " checked" : "") + "> <code>emparejada</code></label>";
        q(".o-ar").onchange = function () { arriba = this.checked; pintar(); };
        q(".o-em").onchange = function () { emp = this.checked; pintar(); };
      } else {
        q(".o-val").innerHTML = radios("sit", SITS.map(function (x) { return [x[0], "<code>" + x[0] + "</code>"]; }), sit);
        onRadios(pad, ".o-val", function (v) { sit = v; pintar(); });
      }
    }
    function pintar() {
      var cod, carta, nota, tabla, bad = false;
      if (modo === "bool") {
        cod = ["data class Carta(", "    val id: Int,", "    …,", "    val bocaArriba: Boolean,", "    val emparejada: Boolean,", ")", "",
          "// Carta actual:", "Carta(id = 3, …, bocaArriba = " + arriba + ", emparejada = " + emp + ")"];
        bad = !arriba && emp;
        carta = bad ? '<span class="cpa-tc big bad">¿?</span>' : memChip("⭐", emp ? "p" : arriba ? "b" : "a", "big");
        nota = bad ? "<b class=\"cpa-bad-txt\">Combinación imposible:</b> boca abajo y emparejada a la vez. ¿Qué pinta CartaView? El compilador no lo impide: tendrías que acordarte tú en cada <code>copy</code>."
          : "Prueba a marcar <code>emparejada</code> sin <code>bocaArriba</code>.";
        tabla = "<tr><th>bocaArriba</th><th>emparejada</th><th></th></tr>" + [[false, false], [true, false], [true, true], [false, true]].map(function (c) {
          var mal = !c[0] && c[1];
          return "<tr><td>" + c[0] + "</td><td>" + c[1] + "</td><td>" + (mal ? '<span class="cpa-bad-txt">✘ imposible</span>' : '<span class="cpa-ok-txt">✔ válida</span>') + "</td></tr>";
        }).join("") + "<tr><td colspan=\"3\">4 combinaciones, <b>1 imposible</b></td></tr>";
      } else {
        var x = SITS.filter(function (y) { return y[0] === sit; })[0];
        cod = ["enum class Situacion { BOCA_ABAJO, BOCA_ARRIBA, EMPAREJADA }  // por ejemplo", "", "data class Carta(", "    val id: Int,", "    …,", "    val situacion: Situacion,", ")", "",
          "// CartaView: el when obliga a tratar todas", "when (carta.situacion) {", "    Situacion.BOCA_ABAJO -> Reverso()", "    Situacion.BOCA_ARRIBA, Situacion.EMPAREJADA -> Dibujo(…)", "}"];
        carta = memChip("⭐", x[2], "big");
        nota = "Solo existen las situaciones que has escrito. Si añades una nueva, el <code>when</code> deja de compilar hasta que la trates.";
        tabla = "<tr><th>situacion</th><th></th></tr>" + SITS.map(function (y) { return "<tr><td><code>" + y[0] + "</code></td><td><span class=\"cpa-ok-txt\">✔ válida</span></td></tr>"; }).join("") +
          "<tr><td colspan=\"2\">3 valores, <b>0 imposibles</b></td></tr>";
      }
      q(".o-code").innerHTML = codeHtml(cod);
      if (bad) q(".o-code").lastChild.className = "cpa-ln on bad";
      q(".o-carta").innerHTML = carta;
      q(".o-nota").innerHTML = nota;
      q(".o-tabla").innerHTML = tabla;
    }
    onRadios(pad, ".o-mod", function (v) { modo = v; valores(); pintar(); });
    valores(); pintar();
  }

  // ---- §2.2 · la cuadrícula: columnas y key

  function buildCuadricula(root) {
    var pad = frame(root, "La cuadrícula del tablero", "Cambia las columnas, pulsa cartas y vuelve a repartir");
    pad.innerHTML = '<div class="cpa-ctrl"><label>columnas <select class="o-col"><option>2</option><option selected>3</option><option>4</option><option>6</option></select></label>' +
      '<label>parejas <select class="o-par"><option>3</option><option selected>6</option><option>8</option></select></label>' +
      '<label><input type="checkbox" class="o-key" checked> <code>key = { it.id }</code></label>' +
      '<button type="button" class="o-rep">Nueva partida (otro reparto)</button></div>' +
      '<div class="cpa-est"><div class="cpa-code o-code"></div><div><div class="cpa-phone"><div class="cpa-lbl">TableroContent</div><div class="cpa-mtab o-tab"></div></div>' +
      '<p class="cpa-note o-nota"></p></div></div>';
    var q = function (c) { return pad.querySelector(c); };
    var DIB = ["🍎", "🐱", "⭐", "🌙", "🍄", "🎈", "🐟", "🌵"];
    var cartas = [], recuerdo = {};
    function repartir() {
      var n = +q(".o-par").value, d = [];
      for (var k = 0; k < n; k++) { d.push(DIB[k]); d.push(DIB[k]); }
      for (k = d.length - 1; k > 0; k--) { var r = Math.floor(Math.random() * (k + 1)), x = d[k]; d[k] = d[r]; d[r] = x; }
      cartas = d.map(function (x, k) { return { id: k + 1, d: x }; });
    }
    function clave(c, k) { return q(".o-key").checked ? "id" + c.id : "pos" + k; }
    function pintar(nota) {
      var col = +q(".o-col").value, key = q(".o-key").checked;
      q(".o-code").innerHTML = codeHtml([
        "LazyVerticalGrid(columns = GridCells.Fixed(" + col + ")) {",
        "    items(estado.cartas" + (key ? ", key = { it.id }" : "") + ") { carta ->",
        "        CartaView(carta, onClick = { onCartaPulsada(carta.id) })",
        "    }",
        "}",
        "",
        "// Cada celda recuerda cosas suyas, por ejemplo el giro (inv. 6.1).",
        "// " + (key ? "Con key, lo recordado va con la CARTA (su id)." : "Sin key, lo recordado se queda en la POSICIÓN.")
      ]);
      var tab = q(".o-tab");
      tab.style.gridTemplateColumns = "repeat(" + col + ", auto)";
      tab.innerHTML = cartas.map(function (c, k) {
        var r = recuerdo[clave(c, k)];
        return '<button type="button" class="cpa-tc big ' + (r ? "b" : "a") + '" data-k="' + k + '" aria-label="Carta ' + c.id + '">' + (r ? c.d : "?") +
          '<small class="cpa-cid">' + c.id + "</small></button>";
      }).join("");
      Array.prototype.forEach.call(tab.children, function (b) {
        b.onclick = function () { var k = +b.dataset.k, c = cartas[k], ck = clave(c, k); recuerdo[ck] = !recuerdo[ck]; pintar(); };
      });
      q(".o-nota").innerHTML = nota || ("Las mismas " + cartas.length + " cartas en " + col + " columnas: el número de columnas sale del estado (del nivel). Pulsa dos o tres cartas para darles la vuelta y luego reparte otra vez.");
    }
    q(".o-col").onchange = function () { pintar(); };
    q(".o-par").onchange = function () { repartir(); recuerdo = {}; pintar(); };
    q(".o-key").onchange = function () { recuerdo = {}; pintar(); };
    q(".o-rep").onclick = function () {
      var antes = {}; cartas.forEach(function (c, k) { if (recuerdo[clave(c, k)]) antes[c.id] = true; });
      var mezcla = cartas.slice(); for (var k = mezcla.length - 1; k > 0; k--) { var r = Math.floor(Math.random() * (k + 1)), x = mezcla[k]; mezcla[k] = mezcla[r]; mezcla[r] = x; }
      cartas = mezcla;
      pintar(q(".o-key").checked
        ? "Con <code>key</code>, cada carta conserva lo suyo aunque cambie de sitio: siguen de cara las mismas cartas (mira su número)."
        : "<b class=\"cpa-bad-txt\">Sin key</b>, lo recordado se ha quedado en las <b>posiciones</b>: ahora están de cara otras cartas. Es lo que pasaría con el giro de una carta.");
    };
    repartir(); pintar();
  }

  // ---- §2.2 · la imagen de la carta: contentScale

  var IMG_CARTA = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ef476f"/></linearGradient></defs>' +
    '<rect width="300" height="200" fill="url(#g)"/><circle cx="40" cy="40" r="14" fill="#fff" opacity=".7"/><circle cx="260" cy="160" r="14" fill="#fff" opacity=".7"/>' +
    '<text x="150" y="135" font-size="110" text-anchor="middle">🐱</text></svg>');

  function buildImagen(root) {
    var CS = {
      Fit: ["contain", "Se ve <b>entera</b> y sin deformar; si la forma no coincide, sobran bandas."],
      Crop: ["cover", "<b>Llena</b> la carta sin deformar; recorta lo que sobra por los lados."],
      FillBounds: ["fill", "<b class=\"cpa-bad-txt\">Deforma</b> la imagen para llenar la carta. Casi nunca es lo que quieres."],
      Inside: ["scale-down", "Como Fit, pero <b>nunca la agranda</b> más que su tamaño original."]
    };
    var pad = frame(root, "La imagen de la carta", "Elige la forma de la carta y el contentScale");
    pad.innerHTML = '<div class="cpa-ctrl o-cs">' + radios("cs", Object.keys(CS).map(function (k) { return [k, "<code>" + k + "</code>"]; }), "Fit") + "</div>" +
      '<div class="cpa-ctrl"><label>forma de la carta <select class="o-ar"><option value="0.75" selected>aspectRatio(3f / 4f)</option><option value="1">aspectRatio(1f)</option></select></label></div>' +
      '<div class="cpa-est"><div class="cpa-code o-code"></div><div class="cpa-imgw"><div class="cpa-cimg o-carta"><img alt="Dibujo de ejemplo: un gato sobre fondo de color" src="' + IMG_CARTA + '"></div>' +
      '<p class="cpa-note o-nota"></p></div></div>';
    var q = function (c) { return pad.querySelector(c); };
    var cs = "Fit";
    function pintar() {
      var ar = q(".o-ar").value;
      q(".o-carta").style.aspectRatio = ar === "1" ? "1 / 1" : "3 / 4";
      q(".o-carta img").style.objectFit = CS[cs][0];
      q(".o-code").innerHTML = codeHtml([
        "Card(onClick = onClick, modifier = Modifier." + (ar === "1" ? "aspectRatio(1f)" : "aspectRatio(3f / 4f)") + ") {",
        "    Image(",
        "        painter = painterResource(carta.dibujo),",
        "        contentDescription = …,",
        "        contentScale = ContentScale." + cs + ",",
        "        modifier = Modifier.fillMaxSize(),",
        "    )",
        "}"
      ]);
      q(".o-code").children[4].className = "cpa-ln on";
      q(".o-nota").innerHTML = CS[cs][1] + " El dibujo de ejemplo es apaisado (3:2).";
    }
    onRadios(pad, ".o-cs", function (v) { cs = v; pintar(); });
    q(".o-ar").onchange = pintar;
    pintar();
  }

  // ---- §3.1 · la pila del Memory, para jugar

  function buildNavMemory(root) {
    var pad = frame(root, "Navega por el Memory", "Usa la mini app y el botón atrás; mira cómo cambia la pila");
    pad.innerHTML = '<div class="cpa-ctrl o-op">Al ganar: ' + radios("op", [["add", "apilar Resultado"], ["set", "sustituir el Tablero"]], "add") +
      '<button type="button" class="o-reset">Reiniciar</button></div>' +
      '<div class="cpa-nav"><div><div class="cpa-lbl">La pila (abajo, la primera)</div><div class="cpa-stack o-pila"></div>' +
      '<div class="cpa-evlog o-log"></div></div>' +
      '<div><div class="cpa-lbl">Lo que se ve: la cima</div><div class="cpa-screen o-pant"></div>' +
      '<div class="cpa-ctrl"><button type="button" class="o-atras">◁ Atrás (sistema)</button></div></div></div>';
    var q = function (c) { return pad.querySelector(c); };
    var pila, n, cerrada;
    function log(t, c) { var d = document.createElement("div"); d.innerHTML = t; if (c) d.className = c; q(".o-log").insertBefore(d, q(".o-log").firstChild); }
    function quitar(e) { if (e.vm) log("TableroViewModel " + e.vm + " · onCleared()", "co"); }
    function pintar() {
      q(".o-pila").innerHTML = pila.map(function (e, k) {
        return '<div class="cpa-entry' + (k === pila.length - 1 ? " top" : "") + '">' + e.k + (e.vm ? '<br><span class="cpa-vmc">TableroViewModel ' + e.vm + "</span>" : "") + "</div>";
      }).join("") || '<p class="cpa-note">vacía</p>';
      var c = pila[pila.length - 1], p = q(".o-pant");
      if (cerrada) { p.innerHTML = "<b>La app se ha cerrado</b><div class=\"cpa-note\">La pila se quedó vacía.</div>"; }
      else if (c.t === "ini") {
        p.innerHTML = "<b>Inicio</b><div class=\"cpa-note\">elige nivel</div>" + ["FACIL", "MEDIO", "DIFICIL"].map(function (nv) { return '<button type="button" class="cpa-fakebtn" data-n="' + nv + '">' + nv + "</button>"; }).join(" ");
        Array.prototype.forEach.call(p.querySelectorAll("button"), function (b) {
          b.onclick = function () { n++; var e = { t: "tab", k: "Tablero(" + b.dataset.n + ")", vm: "@" + (n * 4099).toString(16).slice(-4) }; pila.push(e);
            log("pila.add(Tablero(" + b.dataset.n + "))"); log("TableroViewModel " + e.vm + " · creado", "ok"); pintar(); };
        });
      } else if (c.t === "tab") {
        p.innerHTML = "<b>" + c.k + "</b><div class=\"cpa-note\">jugando…</div>" + miniTab(["p", "a", "b", "a", "p", "a"]) + '<button type="button" class="cpa-fakebtn o-gana">Simular victoria</button>';
        p.querySelector(".o-gana").onclick = function () {
          var r = { t: "res", k: "Resultado(…)" };
          if (q(".o-op input:checked").value === "add") { pila.push(r); log("pila.add(Resultado(…))"); }
          else { quitar(pila[pila.length - 1]); pila[pila.length - 1] = r; log("pila[pila.lastIndex] = Resultado(…)"); }
          pintar();
        };
      } else {
        p.innerHTML = "<b>Resultado</b><div class=\"cpa-note\">¡Has ganado! · 9 movimientos · 42 s</div>" + '<button type="button" class="cpa-fakebtn o-vol">Volver al inicio</button>';
        p.querySelector(".o-vol").onclick = function () {
          while (pila.length > 1) quitar(pila.pop());
          log("while (pila.size > 1) pila.removeLastOrNull()"); pintar();
        };
      }
    }
    q(".o-atras").onclick = function () {
      if (cerrada) return;
      var e = pila.pop(); log("atrás → pila.removeLastOrNull()"); quitar(e);
      if (!pila.length) cerrada = true;
      else if (pila[pila.length - 1].t === "tab" && e.t === "res") log("<b>Has vuelto a una partida ya ganada.</b> ¿Es lo que quieres?", "ign");
      pintar();
    };
    function reset() { pila = [{ t: "ini", k: "Inicio" }]; n = 0; cerrada = false; q(".o-log").innerHTML = ""; log("rememberNavBackStack(Inicio)"); pintar(); }
    q(".o-reset").onclick = reset;
    reset();
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

  // ------------------------------------------------ ¿dónde vive el estado?

  var ESTADO_MODOS = {
    var: {
      nombre: "var normal",
      code: [
        "@Composable",
        "fun Marcador() {",
        "    var movimientos = 0",
        "    Button(onClick = { movimientos++ }) {",
        "        Text(\"Movimientos: $movimientos\")",
        "    }",
        "}"
      ],
      giro: false, test: false, vista: true
    },
    remember: {
      nombre: "remember",
      code: [
        "@Composable",
        "fun Marcador() {",
        "    var movimientos by remember { mutableIntStateOf(0) }",
        "    Button(onClick = { movimientos++ }) {",
        "        Text(\"Movimientos: $movimientos\")",
        "    }",
        "}"
      ],
      giro: false, test: false, vista: true
    },
    saveable: {
      nombre: "rememberSaveable",
      code: [
        "@Composable",
        "fun Marcador() {",
        "    var movimientos by rememberSaveable { mutableIntStateOf(0) }",
        "    Button(onClick = { movimientos++ }) {",
        "        Text(\"Movimientos: $movimientos\")",
        "    }",
        "}"
      ],
      giro: true, test: false, vista: true
    },
    vm: {
      nombre: "ViewModel",
      code: [
        "// Simplificado: en el proyecto, movimientos va dentro de TableroUiState",
        "class TableroViewModel : ViewModel() {",
        "    private val _movimientos = MutableStateFlow(0)",
        "    val movimientos = _movimientos.asStateFlow()",
        "    fun onJugada() = _movimientos.update { it + 1 }  // la regla, aquí",
        "}",
        "",
        "@Composable",
        "fun Marcador(movimientos: Int, onJugada: () -> Unit) {",
        "    Button(onClick = onJugada) {",
        "        Text(\"Movimientos: $movimientos\")",
        "    }",
        "}"
      ],
      giro: true, test: true, vista: false
    }
  };

  function buildEstado(root) {
    var pad = frame(root, "¿Dónde vive el estado?", "Elige dónde se guardan los movimientos y pruébalo");
    var grupo = "cpa-est-" + Math.random().toString(36).slice(2, 7);
    var radios = Object.keys(ESTADO_MODOS).map(function (k) {
      return '<label><input type="radio" name="' + grupo + '" value="' + k + '"' + (k === "var" ? " checked" : "") + "> <code>" + ESTADO_MODOS[k].nombre + "</code></label>";
    }).join("");
    pad.innerHTML =
      '<div class="cpa-ctrl o-modos">' + radios + "</div>" +
      '<div class="cpa-est"><div class="cpa-code o-code" role="region" aria-label="Código"></div>' +
      '<div><div class="cpa-phone o-phone"><div class="cpa-lbl o-act"></div><div class="big o-pant"></div>' +
      '<button type="button" class="cpa-fakebtn o-mas">+1 movimiento</button></div>' +
      '<div class="cpa-ctrl"><button type="button" class="o-rec">Otra cosa recompone la pantalla</button>' +
      '<button type="button" class="o-giro">Girar el móvil</button><button type="button" class="o-reset">Reiniciar</button></div>' +
      '<table class="cpa-vals o-mem"></table></div></div>' +
      '<p class="cpa-caption o-msg"></p>' +
      '<table class="cpa-vals cpa-tabla o-tabla"></table>';
    var q = function (c) { return pad.querySelector(c); };
    var modo, dato, pantalla, recomp, actividad;
    function msg(t) { q(".o-msg").innerHTML = t; }
    function flash() { var p = q(".o-phone"); p.classList.remove("flash"); void p.offsetWidth; p.classList.add("flash"); }
    function pintar() {
      var m = ESTADO_MODOS[modo];
      q(".o-code").innerHTML = m.code.map(function (l) { return '<span class="cpa-ln">' + (kotlin(l) || " ") + "</span>"; }).join("");
      q(".o-act").textContent = "Activity nº " + actividad;
      q(".o-pant").textContent = "Movimientos: " + pantalla;
      var desfase = dato !== pantalla;
      q(".o-mem").innerHTML =
        "<tr><td>Valor guardado</td><td>movimientos = " + dato + (desfase ? ' <b class="cpa-bad-txt">≠ pantalla</b>' : "") + "</td></tr>" +
        "<tr><td>Dónde está</td><td>" + (modo === "vm" ? "en el ViewModel, fuera de la Activity" : modo === "saveable" ? "en la composición (y en el Bundle al girar)" : "dentro de la función composable") + "</td></tr>" +
        "<tr><td>Recomposiciones</td><td>" + recomp + "</td></tr>";
      var si = function (b) { return b ? '<span class="cpa-ok-txt">✔ sí</span>' : '<span class="cpa-bad-txt">✘ no</span>'; };
      q(".o-tabla").innerHTML =
        "<tr><td>¿La pantalla se entera del cambio?</td><td>" + si(modo !== "var") + "</td></tr>" +
        "<tr><td>¿Sobrevive al giro del móvil?</td><td>" + si(m.giro) + "</td></tr>" +
        "<tr><td>¿La regla se puede probar sin pantalla?</td><td>" + si(m.test) + "</td></tr>" +
        "<tr><td>¿La vista solo pinta, sin decidir?</td><td>" + si(!m.vista) + "</td></tr>";
    }
    function reiniciar(texto) {
      dato = 0; pantalla = 0; recomp = 1; actividad = 1;
      msg(texto || "Pulsa «+1 movimiento» varias veces y después prueba los otros dos botones.");
      pintar();
    }
    q(".o-mas").onclick = function () {
      dato++;
      if (modo === "var") {
        msg("El valor ha cambiado, pero <b>nadie avisa a Compose</b>: una variable normal no es estado. La pantalla no se recompone y sigue mostrando " + pantalla + ".");
      } else {
        pantalla = dato; recomp++; flash();
        msg(modo === "vm"
          ? "El botón llama a <code>onJugada()</code>. El ViewModel aplica la regla y publica el valor nuevo; la pantalla, que lo observa, se recompone."
          : "<code>mutableIntStateOf</code> es estado observable: al cambiar, Compose <b>recompone</b> las funciones que lo leen.");
      }
      pintar();
    };
    q(".o-rec").onclick = function () {
      recomp++; flash();
      if (modo === "var") {
        dato = 0; pantalla = 0;
        msg("Al recomponer, la función se <b>vuelve a ejecutar</b> desde el principio: <code>var movimientos = 0</code> otra vez. Lo que hubiera, se pierde. Por eso hace falta <code>remember</code>.");
      } else {
        pantalla = dato;
        msg("La función se ha vuelto a ejecutar, pero el valor <b>sigue</b>: " + (modo === "vm" ? "está en el ViewModel, no en la función." : "<code>remember</code> lo guarda entre recomposiciones."));
      }
      pintar();
    };
    q(".o-giro").onclick = function () {
      actividad++; recomp = 1; flash();
      if (modo === "var" || modo === "remember") {
        dato = 0; pantalla = 0;
        msg("Al girar, Android <b>destruye la Activity y crea otra</b>. Lo guardado en la composición desaparece con ella: vuelve a 0.");
      } else if (modo === "saveable") {
        pantalla = dato;
        msg("<code>rememberSaveable</code> lo guarda en el Bundle y lo recupera. Funciona con datos pequeños, pero la <b>regla</b> (contar la jugada) sigue dentro de la vista y no se puede probar sin pantalla.");
      } else {
        pantalla = dato;
        msg("La Activity nueva recibe <b>el mismo ViewModel</b>, con su valor. Y la regla está fuera de la vista: se puede probar con un test.");
      }
      pintar();
    };
    q(".o-reset").onclick = function () { reiniciar(); };
    Array.prototype.forEach.call(pad.querySelectorAll(".o-modos input"), function (r) {
      r.onchange = function () { modo = r.value; reiniciar("Ahora los movimientos viven en <code>" + ESTADO_MODOS[modo].nombre + "</code>. Repite las pruebas."); };
    });
    modo = "var";
    reiniciar();
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
    giro: { title: "La partida sobrevive al giro: el ViewModel de cada partida", subtitle: "Avanza paso a paso o pulsa Reproducir", code: GIRO_CODE, steps: GIRO_STEPS, render: renderGiro },
    test: { title: "El juego, probado sin pantalla", subtitle: "Avanza paso a paso o pulsa Reproducir", code: TEST_CODE, steps: TEST_STEPS, render: renderTest },
    memfases: { title: "Qué se vuelve a dibujar al voltear una carta", subtitle: "Avanza paso a paso o pulsa Reproducir", code: MFASES_CODE, steps: MFASES_STEPS, render: renderMemFases },
    mempila: { title: "La pila del Memory: un ViewModel por partida", subtitle: "Avanza paso a paso o pulsa Reproducir", code: MPILA_CODE, steps: MPILA_STEPS, render: renderPila },
    turno: { title: "Un turno del Memory, estado a estado", subtitle: "Avanza paso a paso o pulsa Reproducir", code: TURNO_CODE, steps: TURNO_STEPS, render: renderTurno },
    stateflow: { title: "Un estado inmutable que viaja por un StateFlow", subtitle: "Avanza paso a paso o pulsa Reproducir", code: SF_CODE, steps: SF_STEPS, render: renderStateFlow },
    fases: { title: "Qué se vuelve a ejecutar: composición, diseño y dibujo", subtitle: "Avanza paso a paso o pulsa Reproducir", code: FASES_CODE, steps: FASES_STEPS, render: renderFases },
    pila: { title: "Apilar o sustituir: la pila y la vida de cada ViewModel", subtitle: "Avanza paso a paso o pulsa Reproducir", code: PILA_CODE, steps: PILA_STEPS, render: renderPila },
    virtual: { title: "Probar el tiempo sin esperar: el reloj virtual", subtitle: "Avanza paso a paso o pulsa Reproducir", code: VIRTUAL_CODE, steps: VIRTUAL_STEPS, render: renderVirtual },
    udf: { build: buildUdf },
    tablero: { build: buildTablero },
    situacion: { build: buildSituacion },
    cuadricula: { build: buildCuadricula },
    imagen: { build: buildImagen },
    navmemory: { build: buildNavMemory },
    estado: { build: buildEstado },
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
