"use client";

import { Circle, type ShapeProps } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

interface Props extends ShapeProps<typeof THREE.CircleGeometry> {
  edgeBlur?: number;
  circleColor?: string;
  mouseTracking?: boolean;
  trackingIntensity?: number;
}

function TrackingCircle({
  edgeBlur = 0.15,
  circleColor = "white",
  args = [1, 75],
  rotation = [0, 0, 0],
  mouseTracking = false,
  trackingIntensity = 1,
  ...props
}: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const circleRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const targetPosition = useRef({ x: 0, y: 0 });

  // Custom shader material for blurred edges
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        color: { value: new THREE.Color(circleColor) },
        radius: { value: 1 },
        blur: { value: edgeBlur },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float radius;
        uniform float blur;
        varying vec2 vUv;
        
        void main() {
          // Calculate distance from center (0.5, 0.5)
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center) * 2.0; // Normalize to [0,1] range
          
          // Create soft edge using smoothstep
          float alpha = 1.0 - smoothstep(radius - blur, radius, dist);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [circleColor, edgeBlur]);

  useFrame((state) => {
    if (circleRef?.current && mouseTracking) {
      targetPosition.current.x =
        state.pointer.x * viewport.width * 0.052 * trackingIntensity;
      targetPosition.current.y =
        state.pointer.y * viewport.height * 0.052 * trackingIntensity;

      gsap.to(circleRef.current.position, {
        x: targetPosition.current.x,
        y: targetPosition.current.y,
        duration: 4, // Lower equal faster
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });

  return (
    <Circle ref={circleRef} args={args} rotation={rotation} {...props}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </Circle>
  );
}

export { TrackingCircle };
