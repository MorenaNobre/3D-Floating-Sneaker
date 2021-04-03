import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { ContactShadows, Environment, useGLTF, OrbitControls } from "drei";
import { HexColorPicker } from "react-colorful";
import { proxy, useProxy } from "valtio";

const state = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
});

function Shoe(props) {
  const group = useRef();
  const snap = useProxy(state);
  const { nodes, materials } = useGLTF("/shoe-draco.glb");

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
    group.current.rotation.x = Math.cos(t / 4) / 8
    group.current.rotation.y = Math.sin(t / 4) / 8
    group.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  const [hovered, setHovered] = useState(null);
  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
      hovered ? cursor : auto
    )}'), auto`;
  }, [hovered]);

  return (
    <group
      ref={group}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(e.object.material.name);
      }}
      onPointerOut={(e) => {
        e.intersections.length === 0 && setHovered(null);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        state.current = e.object.material.name;
      }}
      onPointerMissed={() => {
        state.current = null;
      }}
    >
      <mesh
        material-color={snap.items.laces}
        material={materials.laces}
        geometry={nodes.shoe.geometry}
      />
      <mesh
        material-color={snap.items.mesh}
        material={materials.mesh}
        geometry={nodes.shoe_1.geometry}
      />
      <mesh
        material-color={snap.items.caps}
        material={materials.caps}
        geometry={nodes.shoe_2.geometry}
      />
      <mesh
        material-color={snap.items.inner}
        material={materials.inner}
        geometry={nodes.shoe_3.geometry}
      />
      <mesh
        material-color={snap.items.sole}
        material={materials.sole}
        geometry={nodes.shoe_4.geometry}
      />
      <mesh
        material-color={snap.items.stripes}
        material={materials.stripes}
        geometry={nodes.shoe_5.geometry}
      />
      <mesh
        material-color={snap.items.band}
        material={materials.band}
        geometry={nodes.shoe_6.geometry}
      />
      <mesh
        material-color={snap.items.patch}
        material={materials.patch}
        geometry={nodes.shoe_7.geometry}
      />
    </group>
  );
}

function Picker() {
  const snap = useProxy(state);
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker
        className="picker"
        color={snap.items[snap.current]}
        onChange={(color) => (state.items[snap.current] = color)}
      />
      <h1>{snap.current}</h1>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Canvas
        concurrent
        pixelRatio={[1, 1.5]}
        camera={{ position: [0, 0, 2.35] }}
      >
        <ambientLight intensity={0.3} />
        <spotLight
          intensity={0.3}
          angle={0.1}
          penumbra={1}
          position={[5, 25, 20]}
        />
        <Suspense fallback={null}>
          <Shoe />
          <Environment files="hdr.hdr" />
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -0.8, 0]}
            opacity={0.25}
            width={10}
            height={10}
            blur={2}
            far={1}
          />
        </Suspense>
        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
      <Picker />
    </>
  );
}
