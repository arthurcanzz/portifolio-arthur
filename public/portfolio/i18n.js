// traducao PT / EN do portfolio
// o texto em portugues fica no proprio HTML; aqui so tem o ingles.
// na primeira troca, o portugues original e guardado no elemento pra poder voltar.
(function i18n() {
  const EMAIL_LINK =
    '<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=arthurteo2007@gmail.com" target="_blank" rel="noopener noreferrer">arthurteo2007@gmail.com</a>';

  const EN = {
    "page.title": "Arthur Canzian | Portfolio",
    "page.description":
      "Portfolio of Arthur Canzian, Software Engineering student at FIAP and front-end developer focused on interactive and 3D experiences.",

    "hero.title": "Hi, I'm Arthur 👋",
    "hero.text":
      "I'm a Software Engineering student at FIAP (2026–2029) and a front-end developer focused on interactive and 3D experiences. I work with HTML, CSS, JavaScript, React, Vue.js, Node.js, Three.js, GSAP and Blender. I worked with ARKx, an AR/VR and creative technology studio, on immersive experiences and brand projects. I'm looking for a web development internship.",
    "hero.alt": "Photo of Arthur Canzian",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    "projects.title": "Projects",
    "projects.prev": "Previous project",
    "projects.next": "Next project",
    "projects.view": "View project",

    "p1.tag": "ARKx · Immersive experience",
    "p1.title": "Tarsila do Amaral immersive experience",
    "p1.text":
      "In Blender, I built the camera path and laid out the 3D elements of the scene, creating a one-shot effect that connects Tarsila do Amaral's paintings in an immersive experience for visitors.",
    "p2.tag": "Personal project · SaaS",
    "p2.text":
      "Sales, inventory and finance management platform for resellers, with subscription plans and Pix payments through Asaas.",
    "p3.tag": "Personal project",
    "p3.text":
      "Poker training platform with an animated landing page, a level quiz and a table simulator against bots with different play styles, user accounts and session reports.",
    "p4.tag": "Personal project · AI",
    "p4.text":
      "MCP server that connects Claude to the Spotify API: it creates playlists and controls playback through conversation, based on the music I listen to most.",
    "p5.tag": "FIAP x JOVI Challenge",
    "p5.text":
      "Concept for an AI feature in JOVI smartphone cameras: distraction alerts during class and class summaries organized by AI. Team project (SafeTech), including storytelling and a short campaign video.",
    "p6.tag": "Personal tool",
    "p6.text":
      "Prospecting tool that finds local businesses through the Google Places API, flags those without a website and scores the leads most likely to become clients.",

    "chip.camera": "Camera animation",
    "chip.scene": "Scene composition",
    "chip.render": "API on Render",
    "chip.ai": "AI",
    "chip.product": "Product",
    "chip.team": "Teamwork",

    "skills.text": "Technologies I use to turn ideas into digital experiences, from front-end to 3D.",

    "feedback.title": "Feedback",
    "feedback.alt": "Photo of Tiago",
    "feedback.role": "Co-founder and Head of XR at ARKx",
    "feedback.quote":
      "\"Arthur is a dedicated and curious professional. He is always willing to learn and improve his skills, showing great potential for software development. His attention to detail and proactivity make him a valuable member of any tech team.\"",

    "contact.title": "Contact",
    "contact.text":
      "I'm open to internship opportunities, collaborations and challenging projects. If you'd like to talk, send me a message here or email me at " +
      EMAIL_LINK +
      ".",
    "form.name": "Name",
    "form.message": "Message",
    "form.send": "Send message",
  };

  const STORAGE_KEY = "portfolio-lang";

  function readSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function save(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // sem localStorage (aba anonima bloqueada etc.), so nao lembra a escolha
    }
  }

  // guarda o portugues original de cada elemento antes da primeira troca
  const PT_ATTRS = [
    ["data-i18n", "innerHTML"],
    ["data-i18n-placeholder", "placeholder"],
    ["data-i18n-aria", "aria-label"],
    ["data-i18n-alt", "alt"],
  ];

  function remember() {
    PT_ATTRS.forEach(([attr, prop]) => {
      document.querySelectorAll(`[${attr}]`).forEach((el) => {
        const store = `pt${attr.replace("data-i18n", "")}`;
        if (el.hasAttribute(`data-${store}`)) return;
        const value = prop === "innerHTML" ? el.innerHTML.trim() : el.getAttribute(prop);
        el.setAttribute(`data-${store}`, value);
      });
    });
  }

  const ptTitle = document.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  const ptDesc = metaDesc ? metaDesc.content : "";

  function apply(lang) {
    const en = lang === "en";
    PT_ATTRS.forEach(([attr, prop]) => {
      document.querySelectorAll(`[${attr}]`).forEach((el) => {
        const key = el.getAttribute(attr);
        const store = `pt${attr.replace("data-i18n", "")}`;
        const value = en && EN[key] ? EN[key] : el.getAttribute(`data-${store}`);
        if (prop === "innerHTML") el.innerHTML = value;
        else el.setAttribute(prop, value);
      });
    });

    document.documentElement.lang = en ? "en" : "pt-BR";
    document.title = en ? EN["page.title"] : ptTitle;
    if (metaDesc) metaDesc.content = en ? EN["page.description"] : ptDesc;

    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      const active = btn.dataset.setLang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function setLang(lang) {
    if (lang !== "pt" && lang !== "en") return;
    save(lang);
    apply(lang);
    // avisa a pagina de fora (cena 3D), se estiver dentro do iframe
    if (window.parent !== window) {
      window.parent.postMessage({ type: "portfolio-lang", lang }, window.location.origin);
    }
  }

  // dentro da tela do notebook o botao fica na pagina de fora, entao esconde este
  // (?full=1 = pagina em tela cheia quando a cena 3D falha: ai mostra o botao)
  const fullPage = new URLSearchParams(window.location.search).has("full");
  if (window.parent !== window && !fullPage) document.documentElement.classList.add("in-frame");

  remember();

  const browserLang = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
  apply(readSaved() || browserLang);

  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.setLang));
  });

  // a pagina de fora manda o idioma quando o botao dela e clicado
  window.addEventListener("message", (e) => {
    if (e.origin !== window.location.origin) return;
    if (e.data && e.data.type === "portfolio-lang") apply(e.data.lang);
  });
})();
