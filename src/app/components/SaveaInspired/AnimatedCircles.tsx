"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { FC, useRef } from "react";
import * as THREE from "three";
import React from "react";
import { TexturedCircle } from "./TexturedCircle";

const AnimatedCircles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerCircleRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (groupRef.current && innerCircleRef.current) {
      const x = state.pointer.x * viewport.width * 0.052;
      const y = state.pointer.y * viewport.height * 0.052;
      const groupLerpSpeed = 0.01;
      const innerCircleLerpSpeed = 0.02; // Slightly faster than the group

      // Group movement
      groupRef.current.position.x +=
        (x - groupRef.current.position.x) * groupLerpSpeed;
      groupRef.current.position.y +=
        (y - groupRef.current.position.y) * groupLerpSpeed;

      // Inner circle additional movement
      const innerX = x * 1.2; // Move 20% further than the group
      const innerY = y * 1.2;
      innerCircleRef.current.position.x +=
        (innerX -
          groupRef.current.position.x -
          innerCircleRef.current.position.x) *
        innerCircleLerpSpeed;
      innerCircleRef.current.position.y +=
        (innerY -
          groupRef.current.position.y -
          innerCircleRef.current.position.y) *
        innerCircleLerpSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <TexturedCircle texturePath="/circle_outer.png" />
      <TexturedCircle ref={innerCircleRef} texturePath="/circle_inner.png" />
    </group>
  );
};

export { AnimatedCircles };
