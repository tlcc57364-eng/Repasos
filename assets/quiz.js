/* Motor de quiz genérico. Lee window.QUIZ_DATA (ver assets/data/*.js). */
(function () {
  "use strict";
  var DATA = window.QUIZ_DATA;
  if (!DATA) return;

  var KEY = "repasos:" + DATA.subject.toLowerCase().replace(/\s+/g, "-");
  var LETTERS = ["A", "B", "C", "D", "E", "F"];
  var bankIds = Object.keys(DATA.banks);

  var state = {
    bank: bankIds[0],
    mode: "quiz",
    shuffle: true,
    flaggedOnly: false,
    session: null
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var view = $("#view");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(text, isCode) { return isCode ? "<code>" + esc(text) + "</code>" : esc(text); }
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

  // ---- storage (opcional, nunca rompe la página) ----
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(obj) { try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {} }

  function bank() { return DATA.banks[state.bank]; }
  function hasFlags(b) { return b.questions.some(function (q) { return q.flagged; }); }

  // ---- encabezado ----
  function renderStats() {
    var M = window.Motion;
    function put(el, n, suf) { if (n == null) { el.textContent = "—"; return; } if (M) M.count(el, n, suf); else el.textContent = n + (suf || ""); }
    put($("#st-exam"), DATA.banks.examen ? DATA.banks.examen.questions.length : null);
    put($("#st-extra"), DATA.banks.extra ? DATA.banks.extra.questions.length : null);
    var best = load().best || {};
    put($("#st-best"), best[state.bank], "%");
  }

  function renderBankTabs() {
    var nav = $("#banks");
    nav.innerHTML = bankIds.map(function (id) {
      var b = DATA.banks[id];
      return '<button role="tab" data-bank="' + id + '" aria-selected="' + (id === state.bank) + '">' +
        esc(b.title) + " · " + b.questions.length + "</button>";
    }).join("");
    Array.prototype.forEach.call($("#modes").children, function (btn) {
      btn.setAttribute("aria-selected", btn.dataset.mode === state.mode);
    });
    $("#bank-desc").textContent = state.mode === "summary"
      ? "Conceptos clave para la última pasada."
      : bank().description;
    var showOpts = state.mode !== "summary";
    $("#opts-bar").querySelector(".modes").style.display = showOpts ? "" : "none";
    $("#flag-wrap").style.display = hasFlags(bank()) ? "" : "none";
    $("#opt-shuffle").closest("label").style.display = state.mode === "quiz" ? "" : "none";
  }

  // ---- sesión de quiz ----
  function newSession(onlyIdx) {
    var qs = bank().questions;
    var idx = onlyIdx || range(qs.length).filter(function (i) {
      return !(state.flaggedOnly && hasFlags(bank())) || qs[i].flagged;
    });
    if (state.shuffle) idx = shuffled(idx);
    state.session = {
      bank: state.bank,
      items: idx.map(function (qi) {
        var n = qs[qi].options.length;
        return { qi: qi, order: qs[qi].tf ? range(n) : shuffled(range(n)), chosen: null };
      }),
      cur: 0,
      done: false,
      partial: !!onlyIdx || state.flaggedOnly
    };
  }

  function renderQuiz() {
    var s = state.session;
    if (!s || s.bank !== state.bank) { newSession(); s = state.session; }
    if (!s.items.length) {
      view.innerHTML = '<div class="card empty quiz"><h2 class="h2">No hay preguntas con este filtro</h2></div>';
      return;
    }
    if (s.done) return renderResults();

    var it = s.items[s.cur];
    var q = bank().questions[it.qi];
    var enter = s.shown !== s.cur;
    s.shown = s.cur;
    var just = state.just; state.just = false;
    var answered = it.chosen !== null;
    var ok = answered && it.chosen === q.answer;
    var nOk = s.items.filter(function (x) { return x.chosen !== null && x.chosen === bank().questions[x.qi].answer; }).length;
    var nAns = s.items.filter(function (x) { return x.chosen !== null; }).length;

    var opts = it.order.map(function (oi, pos) {
      var cls = "opt", mark = "";
      if (answered) {
        if (oi === q.answer) { cls += " correct"; mark = "Correcta"; }
        else if (oi === it.chosen) { cls += " wrong"; mark = "Tu respuesta"; }
        else cls += " dim";
      }
      return '<button class="' + cls + '" style="--i:' + pos + '" data-oi="' + oi + '"' + (answered ? " disabled" : "") + ">" +
        '<span class="k">' + LETTERS[pos] + "</span>" +
        "<span>" + fmt(q.options[oi], q.code) + "</span>" +
        '<span class="mark">' + mark + "</span></button>";
    }).join("");

    var dots = s.items.map(function (x, i) {
      var c = "";
      if (x.chosen !== null) c = x.chosen === bank().questions[x.qi].answer ? "ok" : "bad";
      if (i === s.cur) c += " cur";
      return '<button class="' + c + '" data-go="' + i + '" aria-label="Pregunta ' + (i + 1) + '">' + (i + 1) + "</button>";
    }).join("");

    var last = s.cur === s.items.length - 1;
    view.innerHTML =
      '<div class="quiz">' +
        '<article class="card qcard' + (enter ? " enter" : "") + (just ? " just" : "") + '">' +
          '<div class="qmeta">' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
              '<span class="tag dark">' + (s.cur + 1) + " / " + s.items.length + "</span>" +
              '<span class="tag">' + esc(q.topic || DATA.subject) + "</span>" +
              (q.flagged ? '<span class="tag volt"><span class="dot" style="background:#000"></span>Fallada en el intento</span>' : "") +
              (q.tf ? '<span class="tag ghost">Verdadero / Falso</span>' : "") +
            "</div>" +
            '<span class="mono-label">Aciertos ' + nOk + " / " + nAns + "</span>" +
          "</div>" +
          '<div class="progress"><span style="width:' + Math.round((nAns / s.items.length) * 100) + '%"></span></div>' +
          '<h2 class="qtext">' + esc(q.q) + "</h2>" +
          '<div class="opts">' + opts + "</div>" +
          '<div class="feedback ' + (answered ? "show " + (ok ? "ok" : "bad") : "") + '" aria-live="polite">' +
            (answered
              ? '<span class="mono-label">' + (ok ? "Correcto" : "Incorrecto") + "</span>" +
                "<h4>" + (ok ? "¡Bien!" : "La correcta era:") + "</h4>" +
                (ok ? "" : '<p class="ans"><b>' + fmt(q.options[q.answer], q.code) + "</b></p>") +
                "<p>" + esc(q.exp) + "</p>"
              : "") +
          "</div>" +
          '<div class="qnav">' +
            '<button class="btn ghost" data-act="prev"' + (s.cur === 0 ? " disabled" : "") + ">← Anterior</button>" +
            '<span class="kbd-hint">1–' + q.options.length + " responder · Enter seguir</span>" +
            '<div class="right">' +
              '<button class="btn ghost" data-act="restart">Reiniciar</button>' +
              '<button class="btn' + (answered ? " wait" : "") + '" data-act="next"' + (answered ? "" : " disabled") + ">" +
                (last ? "Ver resultado →" : "Siguiente →") + "</button>" +
            "</div>" +
          "</div>" +
          '<div class="dots">' + dots + "</div>" +
        "</article>" +
      "</div>";
    motion();
    if (just) { var nb = view.querySelector('[data-act="next"]'); if (nb) nb.focus({ preventScroll: true }); }
  }

  function motion() { if (window.Motion) { window.Motion.enhance(view); window.Motion.observe(view); } }

  function answer(oi) {
    var it = state.session.items[state.session.cur];
    if (it.chosen !== null) return;
    it.chosen = oi;
    state.just = true;
    renderQuiz();
  }

  function next() {
    var s = state.session;
    if (s.items[s.cur].chosen === null) return;
    if (s.cur < s.items.length - 1) { s.cur++; renderQuiz(); }
    else finish();
    scrollToQuiz();
  }

  function finish() {
    var s = state.session;
    s.done = true;
    var total = s.items.length;
    var okN = s.items.filter(function (x) { return x.chosen === bank().questions[x.qi].answer; }).length;
    var pct = Math.round((okN / total) * 100);
    if (!s.partial) {
      var st = load();
      st.best = st.best || {};
      if (st.best[state.bank] == null || pct > st.best[state.bank]) st.best[state.bank] = pct;
      save(st);
      renderStats();
    }
    renderResults();
  }

  function renderResults() {
    var s = state.session;
    var qs = bank().questions;
    var wrong = s.items.filter(function (x) { return x.chosen !== qs[x.qi].answer; });
    var okN = s.items.length - wrong.length;
    var pct = Math.round((okN / s.items.length) * 100);
    var verdict = pct >= 90 ? "Listo para el examen." : pct >= 70 ? "Vas bien, repasa las falladas." : pct >= 50 ? "A medio camino. Otra vuelta." : "Toca repasar con calma.";

    var review = wrong.map(function (x, k) {
      var q = qs[x.qi];
      return '<div class="item" style="--i:' + Math.min(k, 12) + '">' +
        '<span class="mono-label">' + esc(q.topic || "") + "</span>" +
        '<p style="font-weight:500">' + esc(q.q) + "</p>" +
        '<p class="mine">' + fmt(q.options[x.chosen], q.code) + "</p>" +
        '<p><span class="tag">Correcta</span> ' + fmt(q.options[q.answer], q.code) + "</p>" +
        '<p class="muted">' + esc(q.exp) + "</p></div>";
    }).join("");

    view.innerHTML =
      '<div class="quiz">' +
        '<div class="card dark results">' +
          '<span class="mono-label" style="color:var(--smoke)">Resultado · ' + esc(bank().title) + (s.partial ? " (parcial)" : "") + "</span>" +
          '<div class="big" style="margin-top:16px"><span id="big-pct">0%</span></div>' +
          '<p class="h2" style="margin-top:16px">' + okN + " de " + s.items.length + " correctas</p>" +
          '<p style="color:var(--smoke);margin:8px 0 0">' + verdict + "</p>" +
          '<div class="row">' +
            '<button class="btn light" data-act="restart">Repetir todo</button>' +
            (wrong.length ? '<button class="btn ghost" style="color:#fff;border-color:#fff" data-act="retry-wrong">Repetir solo las ' + wrong.length + " falladas</button>" : "") +
            '<button class="btn ghost" style="color:#fff;border-color:#fff" data-act="to-study">Modo estudio</button>' +
          "</div>" +
        "</div>" +
        (wrong.length
          ? '<section style="margin-top:40px"><h2 class="h2">Para repasar</h2><div class="review">' + review + "</div></section>"
          : '<div class="card" style="margin-top:16px"><p class="h2">Sin errores. 🎯</p></div>') +
      "</div>";
    var big = $("#big-pct");
    if (window.Motion) window.Motion.count(big, pct, "%", 1200); else big.textContent = pct + "%";
    motion();
  }

  // ---- modo estudio ----
  function renderStudy() {
    var qs = bank().questions;
    var list = range(qs.length).filter(function (i) {
      return !(state.flaggedOnly && hasFlags(bank())) || qs[i].flagged;
    });
    view.innerHTML =
      '<div style="display:flex;gap:8px;margin-top:24px;flex-wrap:wrap">' +
        '<button class="btn ghost" data-act="open-all">Abrir todas</button>' +
        '<button class="btn ghost" data-act="close-all">Cerrar todas</button>' +
      "</div>" +
      '<div class="study">' + list.map(function (i) {
        var q = qs[i];
        return "<details>" +
          '<summary><span class="n">' + String(i + 1).padStart(2, "0") + "</span>" +
          "<span>" + esc(q.q) + (q.flagged ? ' <span class="dot" title="Fallada en el intento"></span>' : "") + "</span>" +
          '<span class="plus">+</span></summary>' +
          '<div class="body"><ul>' + q.options.map(function (o, oi) {
            return '<li class="' + (oi === q.answer ? "ok" : "") + '">' + (oi === q.answer ? "✓ " : "") + fmt(o, q.code) + "</li>";
          }).join("") + "</ul><p>" + esc(q.exp) + "</p></div></details>";
      }).join("") + "</div>";
    motion();
  }

  // ---- resumen ----
  function renderSummary() {
    view.innerHTML =
      '<div class="card summary"><table><thead><tr><th>Concepto</th><th>Idea central</th></tr></thead><tbody>' +
      DATA.summary.map(function (r, k) { return '<tr style="--i:' + k + '"><td>' + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
    motion();
  }

  function render() {
    renderBankTabs();
    view.classList.remove("view-in"); void view.offsetWidth; view.classList.add("view-in");
    if (state.session) state.session.shown = state.session.cur; // ya anima view-in
    if (state.mode === "quiz") renderQuiz();
    else if (state.mode === "study") renderStudy();
    else renderSummary();
  }

  function scrollToQuiz() {
    var top = view.getBoundingClientRect().top;
    if (top < 0) view.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---- eventos ----
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.bank) { state.bank = t.dataset.bank; state.session = null; renderStats(); render(); return; }
    if (t.dataset.mode) { state.mode = t.dataset.mode; render(); return; }
    if (t.dataset.oi != null && t.classList.contains("opt")) { answer(+t.dataset.oi); return; }
    if (t.dataset.go != null) { state.session.cur = +t.dataset.go; renderQuiz(); return; }
    switch (t.dataset.act) {
      case "next": next(); break;
      case "prev": if (state.session.cur > 0) { state.session.cur--; renderQuiz(); } break;
      case "restart": newSession(); renderQuiz(); scrollToQuiz(); break;
      case "retry-wrong":
        var qs = bank().questions;
        newSession(state.session.items.filter(function (x) { return x.chosen !== qs[x.qi].answer; }).map(function (x) { return x.qi; }));
        renderQuiz(); scrollToQuiz(); break;
      case "to-study": state.mode = "study"; render(); break;
      case "open-all": view.querySelectorAll("details").forEach(function (d) { d.open = true; }); break;
      case "close-all": view.querySelectorAll("details").forEach(function (d) { d.open = false; }); break;
    }
  });

  $("#opt-shuffle").addEventListener("change", function (e) { state.shuffle = e.target.checked; state.session = null; render(); });
  $("#opt-flagged").addEventListener("change", function (e) { state.flaggedOnly = e.target.checked; state.session = null; render(); });

  document.addEventListener("keydown", function (e) {
    if (state.mode !== "quiz" || !state.session || state.session.done) return;
    if (e.target.matches("input, textarea")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var it = state.session.items[state.session.cur];
    if (!it) return;
    var k = e.key.toUpperCase();
    var pos = /^[1-6]$/.test(k) ? +k - 1 : LETTERS.indexOf(k);
    if (pos >= 0 && pos < it.order.length && it.chosen === null) { e.preventDefault(); answer(it.order[pos]); return; }
    if ((e.key === "Enter" || e.key === "ArrowRight") && it.chosen !== null) {
      if (e.target.closest && e.target.closest("button") && e.key === "Enter") return; // deja que el botón enfocado actúe
      e.preventDefault(); next();
    }
    if (e.key === "ArrowLeft" && state.session.cur > 0) { state.session.cur--; renderQuiz(); }
  });

  renderStats();
  render();
})();
