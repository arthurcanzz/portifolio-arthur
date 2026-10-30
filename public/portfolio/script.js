// links internos (#secao) rolam dentro da propria pagina,
// sem afetar o site de fora quando ela esta dentro do iframe
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href^='#']");
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const y = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: y, behavior: "smooth" });
});

// ---------- carrossel de projetos ----------
// loop infinito: os cards sao duplicados e a faixa volta pro comeco
// quando anda o tamanho de um conjunto. Pausa com o mouse em cima,
// da pra arrastar e as setas andam um card por vez.
(function carousel() {
  const viewport = document.querySelector(".carousel");
  const track = document.querySelector(".carousel-track");
  if (!viewport || !track) return;

  const originals = Array.from(track.children);
  originals.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
    track.appendChild(clone);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPEED = reduceMotion ? 0 : 40; // pixels por segundo

  let x = 0;
  let setWidth = 0;
  let step = 0;
  let hovering = false;
  let dragging = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let nudge = null; // animacao das setas { from, to, start, duration }
  let last = performance.now();

  function measure() {
    const first = track.children[0];
    const firstClone = track.children[originals.length];
    setWidth = firstClone.offsetLeft - first.offsetLeft;
    const second = track.children[1];
    step = second.offsetLeft - first.offsetLeft;
  }

  function wrap(value) {
    if (setWidth === 0) return value;
    while (value <= -setWidth) value += setWidth;
    while (value > 0) value -= setWidth;
    return value;
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (nudge) {
      const t = Math.min((now - nudge.start) / nudge.duration, 1);
      x = nudge.from + (nudge.to - nudge.from) * easeOut(t);
      if (t === 1) nudge = null;
    } else if (!dragging && !hovering) {
      x -= SPEED * dt;
    }

    // quando a faixa da a volta, ajusta tambem a animacao das setas e o arraste
    const wrapped = wrap(x);
    const delta = wrapped - x;
    if (delta !== 0) {
      if (nudge) {
        nudge.from += delta;
        nudge.to += delta;
      }
      if (dragging) dragStartPos += delta;
    }
    x = wrapped;

    track.style.transform = `translate3d(${x}px, 0, 0)`;
    requestAnimationFrame(frame);
  }

  // pausa com o mouse em cima (so em quem usa mouse)
  viewport.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") hovering = true;
  });
  viewport.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") hovering = false;
  });

  // arrastar
  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    nudge = null;
    dragStartX = e.clientX;
    dragStartPos = x;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 5 && !dragMoved) {
      dragMoved = true;
      viewport.classList.add("is-dragging");
    }
    if (dragMoved) x = dragStartPos + dx;
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
  };
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  // se arrastou, o clique no final nao abre o link do card
  viewport.addEventListener(
    "click",
    (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    },
    true
  );

  // evita o "arrastar imagem/link" nativo do navegador
  viewport.addEventListener("dragstart", (e) => e.preventDefault());

  // setas: andam um card
  document.querySelectorAll(".carousel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = Number(btn.dataset.dir);
      nudge = { from: x, to: x - dir * step, start: performance.now(), duration: 450 };
    });
  });

  window.addEventListener("resize", measure);
  measure();
  requestAnimationFrame((now) => {
    last = now;
    requestAnimationFrame(frame);
  });
})();
