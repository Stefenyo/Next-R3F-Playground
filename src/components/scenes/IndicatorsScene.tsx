"use client";

import { Canvas } from "@react-three/fiber";
import { Indicators } from "@/components";
import { useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function IndicatorsScene() {
  // Fixes issue related to window not being defined during SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      eventPrefix="client"
      eventSource={window?.document?.body ?? undefined}
    >
      <ambientLight intensity={1} />

      {/* Single diamond in the center */}
      <Indicators position={[0, 0, 0]} />

      <EffectComposer>
        <Bloom
          intensity={0.5} // The bloom intensity.
          luminanceThreshold={0} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={true} // Enables or disables mipmap blur.
        />
      </EffectComposer>
    </Canvas>
  ) : null;
}

export default IndicatorsScene;
