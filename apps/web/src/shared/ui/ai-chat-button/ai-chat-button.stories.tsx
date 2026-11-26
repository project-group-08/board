import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { AiChatButton } from ".";

const meta = {
  title: "UI/AI Chat Button",
  component: AiChatButton,
  args: {
    "aria-label": "Открыть ИИ-чат",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Состояния open и loading управляются потребителем. Допущение для Loading: индикатор вращается, но кнопка остаётся доступной; при reduced motion вращение отключено. Сочетание open + loading не показано в макете: сохраняется синее оформление Open с индикатором. Disabled задаётся отдельно. Тема выбирается переключателем Theme.",
      },
    },
  },
} satisfies Meta<typeof AiChatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    pseudo: { hover: '[data-ai-chat-state="hover"]' },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-[var(--space-24)] rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-32)]">
      {(
        [
          "default",
          "hover",
          "open",
          "loading",
          "open-loading",
          "disabled",
        ] as const
      ).map((state) => (
        <div
          key={state}
          className="grid justify-items-start gap-[var(--space-12)]"
        >
          <AiChatButton
            {...args}
            data-ai-chat-state={state}
            open={state === "open" || state === "open-loading"}
            loading={state === "loading" || state === "open-loading"}
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
