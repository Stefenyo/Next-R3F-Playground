"use client";
import { FC } from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Model from "./Model";
import { Environment } from "@react-three/drei";

const Scene: FC = () => {
  return (
    <Canvas style={{ backgroundColor: "black" }}>
      <directionalLight position={[0, 3, 2]} intensity={3} />
      <Environment preset="studio" />
      <Text fontSize={1.5} position={[0, 0, -2]} font="fonts/roboto-bold.woff">
        Stay Positive
      </Text>
      <Model />
    </Canvas>
  );
};

export default Scene;
