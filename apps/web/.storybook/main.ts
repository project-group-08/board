import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["storybook-addon-pseudo-states"],
  framework: "@storybook/nextjs-vite",
};

export default config;
