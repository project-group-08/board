import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/.gitkeep"],
  },
  {
    rules: {
      "fsd/typo-in-layer-name": "off",
    },
  },
  {
    files: ["./src/_app/**"],
    rules: {
      "fsd/segments-by-purpose": "off",
    },
  },
]);
