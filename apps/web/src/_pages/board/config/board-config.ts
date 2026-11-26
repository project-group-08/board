import type { BoardOptions } from "apeiro/react";

export const boardConfig = {
  grid: "lines",
  camera: {
    minZoom: 0.1,
    maxZoom: 8,
    zoomStep: 1.1,
    wheelZoomSensitivity: 0.5,
  },
} satisfies BoardOptions;
