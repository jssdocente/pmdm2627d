/* Filtro de la página del glosario: muestra en vivo las entradas que coinciden.
   Sin JavaScript, la página se sigue viendo completa, con su índice A-Z. */
(function () {
  function normalizar(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  function iniciar() {
    var hueco = document.getElementById("glosario-filtro");
    if (!hueco) return;

    var primeraLetra = hueco.parentElement.querySelector("h2");
    if (!primeraLetra) return;

    // Agrupa cada entrada (#### y sus párrafos) para poder moverla u ocultarla
    var todo = document.createElement("div");
    var resultados = document.createElement("div");
    resultados.hidden = true;
    primeraLetra.parentElement.insertBefore(todo, primeraLetra);
    while (todo.nextSibling) todo.appendChild(todo.nextSibling);
    todo.parentElement.insertBefore(resultados, todo);

    var entradas = [];
    var actual = null;
    Array.prototype.slice.call(todo.children).forEach(function (nodo) {
      if (nodo.tagName === "H2") {
        actual = null;
      } else if (nodo.tagName === "H4") {
        actual = document.createElement("div");
        actual.className = "glosario-entrada";
        todo.insertBefore(actual, nodo);
        actual.appendChild(nodo);
        var nombre = nodo.textContent.replace("¶", "");
        entradas.push({ nodo: actual, nombre: normalizar(nombre), definicion: "" });
      } else if (actual) {
        actual.appendChild(nodo);
        var entrada = entradas[entradas.length - 1];
        // El primer párrafo es la definición; en las remisiones («Ver …») no se busca
        if (!entrada.leida && nodo.tagName === "P") {
          entrada.leida = true;
          if (nodo.textContent.indexOf("Ver ") !== 0) {
            entrada.definicion = normalizar(nodo.textContent);
          }
        }
      }
    });
    // Recuerda dónde vuelve cada entrada al quitar el filtro
    entradas.forEach(function (e) {
      e.marca = document.createComment("");
      e.nodo.parentElement.insertBefore(e.marca, e.nodo);
    });

    var indice = hueco.nextElementSibling;
    var caja = document.createElement("input");
    caja.type = "search";
    caja.placeholder = "Filtrar términos…";
    caja.setAttribute("aria-label", "Filtrar los términos del glosario");
    caja.autocomplete = "off";
    var estado = document.createElement("p");
    estado.className = "glosario-estado";
    estado.setAttribute("role", "status");
    hueco.appendChild(caja);
    hueco.appendChild(estado);

    function puntuar(entrada, palabras, consulta) {
      if (entrada.nombre === consulta || entrada.nombre.indexOf(consulta + " ") === 0) return 0;
      if (palabras.every(function (p) { return entrada.nombre.indexOf(p) !== -1; })) return 1;
      if (palabras.every(function (p) { return entrada.definicion.indexOf(p) !== -1; })) return 2;
      return -1;
    }

    function restaurar() {
      entradas.forEach(function (e) {
        e.marca.parentElement.insertBefore(e.nodo, e.marca);
      });
    }

    function actualizarUrl(valor) {
      // No se usa «q»: Material lo reserva para abrir su buscador general
      var busqueda = valor ? "?termino=" + encodeURIComponent(valor) : "";
      history.replaceState(null, "", location.pathname + busqueda + location.hash);
    }

    function filtrar() {
      var consulta = normalizar(caja.value);
      restaurar();
      actualizarUrl(caja.value.trim());
      if (!consulta) {
        todo.hidden = false;
        resultados.hidden = true;
        if (indice) indice.hidden = false;
        estado.textContent = "";
        return;
      }
      var palabras = consulta.split(/\s+/);
      var encontradas = [];
      entradas.forEach(function (e, i) {
        var nivel = puntuar(e, palabras, consulta);
        if (nivel !== -1) encontradas.push({ e: e, nivel: nivel, i: i });
      });
      encontradas.sort(function (a, b) { return a.nivel - b.nivel || a.i - b.i; });
      encontradas.forEach(function (r) { resultados.appendChild(r.e.nodo); });
      todo.hidden = true;
      resultados.hidden = false;
      if (indice) indice.hidden = true;
      if (encontradas.length === 0) {
        estado.textContent = "Ningún término coincide. Prueba con otra palabra o con el buscador general del sitio.";
      } else {
        estado.textContent = encontradas.length === 1 ? "1 término" : encontradas.length + " términos";
      }
    }

    caja.addEventListener("input", filtrar);

    // Un enlace a una entrada que el filtro oculta («Ver también», índice lateral)
    // quita el filtro y lleva hasta ella
    window.addEventListener("hashchange", function () {
      var destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (destino && todo.contains(destino) && todo.hidden) {
        caja.value = "";
        filtrar();
        destino.scrollIntoView();
      }
    });

    var inicial = new URLSearchParams(location.search).get("termino");
    if (inicial) {
      caja.value = inicial;
      filtrar();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
