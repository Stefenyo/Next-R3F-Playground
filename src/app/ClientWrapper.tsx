"use client";
import * as Scenes from "@/components/scenes";
import { Select, Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import { useState } from "react";

const scenes = {
  circle: <Scenes.CirclesScene />,
  indicator: <Scenes.IndicatorsScene />,
  radialGridRotate: <Scenes.RadialGridRotateScene />,
  radialGridMouse: <Scenes.RadialGridMouseScene />,
} as const;

export default function ClientWrapper() {
  const [scene, setScene] = useState<keyof typeof scenes>("circle");

  const handleSceneChange = (value: keyof typeof scenes) => setScene(value);

  const renderListItems = () => {
    return Object.keys(scenes).map((scene) => (
      <Select.Item key={scene} value={scene}>
        {scene}
      </Select.Item>
    ));
  };

  return (
    <Theme hasBackground={false}>
      <Select.Root defaultValue={scene} onValueChange={handleSceneChange}>
        <Select.Trigger />
        <Select.Content>{renderListItems()}</Select.Content>
      </Select.Root>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: "-1",
        }}
      >
        {scenes[scene]}
      </div>
    </Theme>
  );
}
