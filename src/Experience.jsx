import {
  Text,
  Html,
  Float,
  Environment,
  PresentationControls,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import gsap from 'gsap';
import { useRef } from "react";

export default function Experience() {
  const computer = useGLTF(
    "https://threejs-journey.com/resources/models/macbook_model.gltf"
  );

  const laptopRef = useRef(null);
  const nameRef = useRef(null);
  const overlayRef = useRef(null);
  const btCloseRef = useRef(null);
  const tl = gsap.timeline();

  const zoomInLaptop = () => {
    if (laptopRef.current && nameRef.current) {

      overlayRef.current.style.display = "none"
      tl.to(nameRef.current.material,{duration:1, ease: "power4.out", opacity:0})
      tl.to(laptopRef.current.position, {duration: 1.5, ease: "power4.out", x: -1.7, y: -0.8, z: 2 }, "-=0.8")
      tl.to(laptopRef.current.rotation, {duration: 1.5, ease: "power4.out", y: -0.7, z:0.075 }, "<")
      tl.to(btCloseRef.current,{duration:1.5,opacity:1}, "<")
      tl.play();
    }
  }
  const zoomOutLaptop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (laptopRef.current && nameRef.current) {
      overlayRef.current.style.display = "block"
      tl.reverse()
      
    }
  }
  


  return (
    <>
      <Environment preset="city" />
      <color args={["#0e1117"]} attach="background" /> {/* fundo escuro elegante */}

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

          <primitive onClick={zoomInLaptop} ref={laptopRef} object={computer.scene} position-y={-1.2}>
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
                  position: "relative"
                }}
              />
              <div ref={overlayRef} onClick={zoomInLaptop} style={{
                  width: "1024px",
                  height: "640px",
                  border: "none",
                  borderRadius: "10px",
                  pointerEvents: "auto",                  
                  position: "absolute",
                  cursor: "pointer",
                  top: 0
                }}>

              </div>
              <div ref={btCloseRef} onClick={zoomOutLaptop} style={{
                  width: "100px",
                  height: "100px",
                  border: "none",
                  color: "black",
                  fontSize: "80px",
                  fontWeight: "bold",
                  background:"white",
                  borderRadius: "10px",
                  pointerEvents: "auto",                  
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems:"center",
                  right:-200,
                  top: -45,
                  opacity: 0,
                  cursor: "pointer",
                }}>
                    X
              </div>
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

      <ContactShadows
        position-y={-1.4}
        opacity={0.4}
        scale={5}
        blur={2.4}
      />
    </>
  );
}
