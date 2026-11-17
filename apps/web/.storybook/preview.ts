import type { Preview } from "@storybook/nextjs-vite";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import "../src/_app/styles/globals.css";

const preview: Preview = {
  parameters: { layout: "padded" },
  globalTypes: {
    theme: {
      description: "Тема интерфейса",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      document.body.style.backgroundColor = "var(--color-background)";
      return Story();
    },
  ],
};

export default preview;
