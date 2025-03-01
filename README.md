# Playground - Nextjs and react three fiber

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber
- [Three.js](https://threejs.org/) - JavaScript 3D library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

## Features

- Custom shader implementation for blurred circle edges
- Responsive full-screen canvas
- Optimized performance with React Three Fiber
- Type-safe components with TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Components

- `TrackingCircle`: A component that renders a single circle with blurred edges using a custom GLSL shader and allows subtle mouse tracking.
  The shader uses the `smoothstep` function to create a smooth transition between the circle's edge and the background, creating the blurred effect.

## Components/scenes

- `CirclesScene`: Uses the `TrackingCircle` component to create a scene that renders two blurred circles with different `trackingIntensity`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
