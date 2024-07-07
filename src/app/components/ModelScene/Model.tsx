import { MeshProps, useFrame, useThree } from "@react-three/fiber";
import { FC, useRef } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { Mesh } from "three";
import { useControls } from "leva";

const Model: FC = () => {
  const meshRef = useRef<Mesh>(null);

  const { nodes } = useGLTF("/models/3D_plus.glb");
  const { viewport } = useThree();

  useFrame(() => {
    meshRef.current!.rotation.y += 0.03;
    // meshRef.current!.rotation.x += 0.01;
    meshRef.current!.rotation.z += 0.02;
  });

  const materialProps = useControls({
    thickness: { value: 0.25, min: 0, max: 1 },
    roughness: { value: 0.15, min: 0, max: 1 },
    transmission: { value: 1, min: 0, max: 1 },
    ior: { value: 1.5, min: 1, max: 2 },
    chromaticAberration: { value: 0.1, min: 0, max: 0.1 },
    backside: { value: true },
  });

  return (
    <group scale={viewport.width / 4}>
      <mesh ref={meshRef} {...(nodes?.Cube as unknown as MeshProps)}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
};

export default Model;
