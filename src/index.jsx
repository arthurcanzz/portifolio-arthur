import "./style.css";
import ReactDOM from "react-dom/client";
import { Component, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import Experience from "./Experience.jsx";

// em tela pequena a cena 3D fica dificil de usar,
// entao abre direto a versao simples do portfolio
const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

const STORAGE_KEY = "portfolio-lang";

const FLAGS = {
  pt: { src: "./flags/br.svg", label: "Português" },
  en: { src: "./flags/us.svg", label: "English" },
};

const TEXTS = {
  pt: {
    hint: "Clique na tela do notebook para abrir o portfólio",
    loading: "Carregando",
    title: "Arthur Canzian | Portfólio",
  },
  en: {
    hint: "Click the laptop screen to open the portfolio",
    loading: "Loading",
    title: "Arthur Canzian | Portfolio",
  },
};

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch (e) {
    // sem localStorage, segue pelo idioma do navegador
  }
  return (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
}

function sendLangToScreen(lang) {
  document.querySelectorAll("iframe").forEach((frame) => {
    frame.contentWindow?.postMessage({ type: "portfolio-lang", lang }, window.location.origin);
  });
}

// se a cena 3D falhar (ex: o modelo nao carregar), mostra a versao simples
// do portfolio em tela cheia em vez de deixar a pagina em branco
class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Cena 3D nao carregou, usando a versao simples:", error);
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function App() {
  const [zoomed, setZoomed] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [lang, setLang] = useState(initialLang);
  const t = TEXTS[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.title = t.title;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignora: so nao lembra a escolha
    }
    sendLangToScreen(lang);
  }, [lang, t.title]);

  // a pagina dentro da tela tambem pode trocar o idioma
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "portfolio-lang" && (e.data.lang === "pt" || e.data.lang === "en")) {
        setLang(e.data.lang);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <>
      <SceneBoundary
        onFail={() => setSceneFailed(true)}
        fallback={
          <iframe
            className="fallback-frame"
            title="Portfólio de Arthur Canzian"
            src="./portfolio/index.html?full=1"
            onLoad={() => sendLangToScreen(lang)}
          />
        }
      >
        <Canvas
          className="r3f"
          camera={{
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [-3, 1.5, 4],
          }}
        >
          <Suspense fallback={null}>
            <Experience onZoomChange={setZoomed} />
          </Suspense>
        </Canvas>
      </SceneBoundary>

      {/* na versao de reserva o botao de idioma e o da propria pagina */}
      {!sceneFailed && (
      <div className="lang-switch" role="group" aria-label="Idioma / Language">
        {["pt", "en"].map((code) => (
          <button
            key={code}
            type="button"
            className={lang === code ? "is-active" : ""}
            aria-pressed={lang === code}
            aria-label={FLAGS[code].label}
            title={FLAGS[code].label}
            onClick={() => setLang(code)}
          >
            <img src={FLAGS[code].src} alt="" width="26" height="18" />
          </button>
        ))}
      </div>
      )}

      {!sceneFailed && <p className={`hint ${zoomed ? "hint--hidden" : ""}`}>{t.hint}</p>}

      {!sceneFailed && (
        <Loader
          containerStyles={{ background: "#0e1117" }}
          barStyles={{ background: "#58a6ff" }}
          dataStyles={{ fontFamily: "Poppins, sans-serif", color: "#e6edf3" }}
          dataInterpolation={(p) => `${t.loading} ${p.toFixed(0)}%`}
        />
      )}
    </>
  );
}

if (isSmallScreen) {
  window.location.replace("./portfolio/index.html");
} else {
  ReactDOM.createRoot(document.querySelector("#root")).render(<App />);
}
