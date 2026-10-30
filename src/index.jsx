import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";

// em tela pequena a cena 3D fica dificil de usar,
// entao abre direto a versao simples do portfolio
const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

if (isSmallScreen) {
  window.location.replace("./portfolio/index.html");
} else {
  const root = ReactDOM.createRoot(document.querySelector("#root"));

  root.render(
    <Canvas
      className="r3f"
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [-3, 1.5, 4],
      }}
    >
      <Experience />
    </Canvas>
  );
}
