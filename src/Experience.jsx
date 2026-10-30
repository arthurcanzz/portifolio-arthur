import {
  Text,
  Html,
  Float,
  Environment,
  PresentationControls,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import gsap from "gsap";
import { useRef } from "react";

const MODEL_URL = "https://threejs-journey.com/resources/models/macbook_model.gltf";

// posicao inicial do notebook e posicao com zoom na tela
const START = { position: { x: 0, y: -1.2, z: 0 }, rotation: { x: 0, y: 0, z: 0 } };
const ZOOM = { position: { x: -1.7, y: -0.8, z: 2 }, rotation: { x: 0, y: -0.7, z: 0.075 } };

export default function Experience({ onZoomChange }) {
  const computer = useGLTF(MODEL_URL);

  const laptopRef = useRef(null);
  const nameRef = useRef(null);
  const overlayRef = useRef(null);
  const btCloseRef = useRef(null);
  const zoomed = useRef(false);

  const animateLaptop = (target, duration, ease) => {
    const laptop = laptopRef.current;
    gsap.to(laptop.position, { ...target.position, duration, ease, overwrite: true });
    gsap.to(laptop.rotation, { ...target.rotation, duration, ease, overwrite: true });
  };

  const zoomInLaptop = (ev) => {
    ev?.stopPropagation?.();
    // ignora cliques repetidos enquanto ja esta com zoom
    if (zoomed.current || !laptopRef.current || !nameRef.current) return;
    zoomed.current = true;
    onZoomChange?.(true);

    overlayRef.current.style.display = "none";
    btCloseRef.current.style.pointerEvents = "auto";
    nameRef.current.material.transparent = true;

    gsap.to(nameRef.current.material, { opacity: 0, duration: 0.6, ease: "power2.out", overwrite: true });
    animateLaptop(ZOOM, 1.4, "power4.out");
    gsap.to(btCloseRef.current, { opacity: 1, duration: 0.6, delay: 0.6, overwrite: true });
  };

  const zoomOutLaptop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!zoomed.current || !laptopRef.current) return;
    zoomed.current = false;
    onZoomChange?.(false);

    overlayRef.current.style.display = "block";
    btCloseRef.current.style.pointerEvents = "none";

    // saida com animacao propria: comeca a se mexer na hora, sem o "atraso"
    // que dava ao reverter a entrada (power4.out ao contrario comeca lento)
    gsap.to(btCloseRef.current, { opacity: 0, duration: 0.2, overwrite: true });
    animateLaptop(START, 0.8, "power3.inOut");
    gsap.to(nameRef.current.material, { opacity: 1, duration: 0.5, delay: 0.4, ease: "power2.out", overwrite: true });
  };

  return (
    <>
      <Environment preset="city" />
      <color args={["#0e1117"]} attach="background" />

      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[0, Math.PI / 8]} // limita o movimento vertical
        azimuth={[-1, 0.75]}
        damping={0.1}
        snap
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#0e1117"}
            rotation={[0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />

          <primitive
            onClick={zoomInLaptop}
            onPointerOver={() => { if (!zoomed.current) document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
            ref={laptopRef}
            object={computer.scene}
            position-y={START.position.y}
          >
            <Html
              transform
              wrapperClass="htmlScreen"
              distanceFactor={1.17}
              rotation-x={-0.256}
              position={[0, 1.56, -1.4]}
              occlude={false}
              zIndexRange={[100, 0]}
            >
              <iframe
                title="Portfólio de Arthur Canzian"
                src="./portfolio/index.html"
                style={{
                  width: "1024px",
                  height: "640px",
                  border: "none",
                  borderRadius: "10px",
                  pointerEvents: "auto",
                  backgroundColor: "#0e1117",
                  position: "relative",
                }}
              />
              <div
                ref={overlayRef}
                onClick={zoomInLaptop}
                style={{
                  width: "1024px",
                  height: "640px",
                  border: "none",
                  borderRadius: "10px",
                  pointerEvents: "auto",
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                }}
              />
              <button
                ref={btCloseRef}
                onClick={zoomOutLaptop}
                aria-label="Fechar a tela"
                style={{
                  width: "100px",
                  height: "100px",
                  border: "none",
                  color: "black",
                  fontSize: "80px",
                  fontWeight: "bold",
                  fontFamily: "Poppins, sans-serif",
                  background: "white",
                  borderRadius: "10px",
                  pointerEvents: "none",
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  right: -200,
                  top: -45,
                  opacity: 0,
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </Html>
          </primitive>

          <Text
            font="./Bangers-Regular.ttf"
            fontSize={1}
            position={[2, 0.75, 0.75]}
            rotation-y={-1.25}
            ref={nameRef}
          >
            ARTHUR{"\n"}CANZIAN
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
    </>
  );
}

useGLTF.preload(MODEL_URL);
