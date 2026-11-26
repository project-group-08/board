import type { Meta, StoryObj } from "@storybook/react";
import { MousePointer2 } from "lucide-react";

import { ToolButton } from ".";

const meta = {
  title: "UI/Tool Button",
  component: ToolButton,
  args: {
    "aria-label": "Выбрать указатель",
    children: <MousePointer2 strokeWidth={2.25} />,
    selected: false,
  },
  argTypes: { children: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Кнопка 36 × 36 px с декоративной иконкой и обязательным доступным именем. selected управляется потребителем и передаётся в aria-pressed; нажатие само его не меняет. Disabled блокирует действие. Тема выбирается общей кнопкой Theme на панели Storybook.",
      },
    },
  },
} satisfies Meta<typeof ToolButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: '[data-tool-state="hover"], [data-tool-state="selected-hover"]',
      focusVisible:
        '[data-tool-state="focus"], [data-tool-state="selected-focus"]',
    },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-[var(--space-24)] rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-32)]">
      {(
        [
          "default",
          "hover",
          "selected",
          "disabled",
          "focus",
          "selected-hover",
          "selected-focus",
          "selected-disabled",
        ] as const
      ).map((state) => (
        <div
          key={state}
          className="grid justify-items-start gap-[var(--space-12)]"
        >
          <ToolButton
            {...args}
            selected={state.startsWith("selected")}
            disabled={state.endsWith("disabled")}
            data-tool-state={state}
          />
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};
