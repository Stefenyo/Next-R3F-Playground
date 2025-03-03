import dynamic from "next/dynamic";

const CirclesScene = dynamic(() => import("@/components/scenes/CirclesScene"), {
  ssr: false,
});

const IndicatorsScene = dynamic(
  () => import("@/components/scenes/IndicatorsScene"),
  {
    ssr: false,
  }
);

const RadialGridRotateScene = dynamic(
  () => import("@/components/scenes/radialGrid/RadialGridRotateScene"),
  {
    ssr: false,
  }
);

const RadialGridMouseScene = dynamic(
  () => import("@/components/scenes/radialGrid/RadialGridMouseScene"),
  {
    ssr: false,
  }
);

export {
  CirclesScene,
  IndicatorsScene,
  RadialGridRotateScene,
  RadialGridMouseScene,
};
