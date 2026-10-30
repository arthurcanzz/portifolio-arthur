import "./style.css";
import ReactDOM from "react-dom/client";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import Experience from "./Experience.jsx";

// em tela pequena a cena 3D fica dificil de usar,
// entao abre direto a versao simples do portfolio
const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

function App() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
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

      <p className={`hint ${zoomed ? "hint--hidden" : ""}`}>
        Clique na tela do notebook para abrir o portfólio
      </p>

      <Loader
        containerStyles={{ background: "#0e1117" }}
        barStyles={{ background: "#58a6ff" }}
        dataStyles={{ fontFamily: "Poppins, sans-serif", color: "#e6edf3" }}
        dataInterpolation={(p) => `Carregando ${p.toFixed(0)}%`}
      />
    </>
  );
}

if (isSmallScreen) {
  window.location.replace("./portfolio/index.html");
} else {
  ReactDOM.createRoot(document.querySelector("#root")).render(<App />);
}
