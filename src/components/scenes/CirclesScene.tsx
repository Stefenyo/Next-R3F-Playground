"use client";

import { Canvas } from "@react-three/fiber";
import { TrackingCircle } from "@/components";

function CircleScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <TrackingCircle
        args={[2.6, 75]}
        rotation={[0, 0, 0]}
        circleColor="red"
        edgeBlur={0.15}
        mouseTracking
      />
      <TrackingCircle
        args={[2.6, 75]}
        rotation={[0, 0, 0]}
        circleColor="black"
        edgeBlur={0.15}
        mouseTracking
        trackingIntensity={1.8}
      />
    </Canvas>
  );
}

export default CircleScene;
