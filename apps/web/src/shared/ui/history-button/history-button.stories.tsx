import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { HistoryButton } from ".";

const meta = {
  title: "UI/History Button",
  component: HistoryButton,
  args: {
    "aria-label": "Открыть историю",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Открытие и действие управляются потребителем. Допущения для не показанных в макете состояний: focus-visible использует обводку IconButton, disabled — его прозрачность; при open подсветка сохраняется при наведении и фокусе. Тема выбирается переключателем Theme.",
      },
    },
  },
} satisfies Meta<typeof HistoryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    pseudo: {
      hover: '[data-history-state="hover"], [data-history-state="open-hover"]',
      focusVisible:
        '[data-history-state="focus"], [data-history-state="open-focus"]',
    },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-[var(--space-24)] rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-32)]">
      {(
        [
          "default",
          "hover",
          "open",
          "focus",
          "disabled",
          "open-hover",
          "open-focus",
        ] as const
      ).map((state) => (
        <div
          key={state}
          className="grid justify-items-start gap-[var(--space-12)]"
        >
          <HistoryButton
            {...args}
            data-history-state={state}
            open={state.startsWith("open")}
            disabled={state === "disabled"}
          />
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};
