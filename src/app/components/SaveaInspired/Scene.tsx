"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import React from "react";
import { AnimatedCircles } from "./AnimatedCircles";

// Inspired by https://www.savea.com/
function Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000000" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <AnimatedCircles />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
