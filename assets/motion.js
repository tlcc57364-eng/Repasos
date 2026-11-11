/* Motion — revelados al hacer scroll, hover-loop en botones,
   contadores, transición entre páginas. Sin dependencias. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var curtain = document.querySelector(".site-in");

  // Quita la cortina del DOM cuando termina de abrirse
  if (curtain) {
    var removeLater = function () { if (!curtain.classList.contains("cover")) curtain.style.visibility = "hidden"; };
    curtain.addEventListener("animationend", removeLater);
    if (reduce) removeLater();
  }

  // ---------- hover-loop: duplica el texto del botón en dos capas ----------
  function enhance(root) {
    (root || document).querySelectorAll(".btn:not([data-hl])").forEach(function (btn) {
      if (btn.children.length) return; // solo botones de texto plano
      var text = btn.textContent.trim();
      var left = "", right = "";
      if (/\s→$/.test(text)) { right = "→"; text = text.replace(/\s→$/, ""); }
      if (/^←\s/.test(text)) { left = "←"; text = text.replace(/^←\s/, ""); }
      var esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      btn.setAttribute("data-hl", "");
      btn.innerHTML =
        (left ? '<span class="arr l" aria-hidden="true">←</span>' : "") +
        '<span class="hl"><span class="hl-a">' + esc + '</span><span class="hl-b" aria-hidden="true">' + esc + "</span></span>" +
        (right ? '<span class="arr r" aria-hidden="true">→</span>' : "");
    });
  }

  // ---------- revelado al hacer scroll ----------
  var io = ("IntersectionObserver" in window && !reduce)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target;
            el.classList.add("in"); io.unobserve(el);
            // al terminar, suelta el atributo para que los hovers no hereden el delay
            if (el.hasAttribute("data-reveal")) {
              el.addEventListener("transitionend", function done(ev) {
                if (ev.target !== el || ev.propertyName !== "opacity") return;
                el.removeEventListener("transitionend", done);
                el.removeAttribute("data-reveal"); el.classList.remove("in");
              });
            }
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" })
    : null;

  function observe(root) {
    (root || document).querySelectorAll("[data-reveal]:not(.in), [data-panel]:not(.in)").forEach(function (el) {
      if (io) io.observe(el); else el.classList.add("in");
    });
  }

  // ---------- contador ----------
  function count(el, to, suffix, dur) {
    suffix = suffix || "";
    if (reduce || !isFinite(to)) { el.textContent = to + suffix; return; }
    dur = dur || 900;
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // expo-out
      el.textContent = Math.round(to * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- transición entre páginas ----------
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || !curtain || reduce) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // anclas en la misma página
    e.preventDefault();
    curtain.style.visibility = "visible";
    curtain.classList.add("cover");
    setTimeout(function () { location.href = a.href; }, 420);
  });
  // Al volver con el botón "atrás" (bfcache) la cortina no debe quedar puesta
  window.addEventListener("pageshow", function (ev) {
    if (ev.persisted && curtain) { curtain.classList.remove("cover"); curtain.style.visibility = "hidden"; }
  });

  window.Motion = { enhance: enhance, observe: observe, count: count, reduce: reduce };

  document.addEventListener("DOMContentLoaded", function () { enhance(); observe(); });
  if (document.readyState !== "loading") { enhance(); observe(); }
})();
