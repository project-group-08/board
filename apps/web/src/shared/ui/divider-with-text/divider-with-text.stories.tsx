import type { Meta, StoryObj } from "@storybook/react";

import { DividerWithText } from ".";

const meta = {
  title: "UI/Divider With Text",
  component: DividerWithText,
  args: { children: "или" },
  parameters: {
    docs: {
      description: {
        component:
          "Текст обязателен и остаётся доступным; линии декоративны. Внешние отступы задаёт композиция. В узком контейнере длинный текст переносится, а линии могут сократиться до нуля — это временное решение, не определённое SVG.",
      },
    },
  },
} satisfies Meta<typeof DividerWithText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 352px)" }}>
      <DividerWithText {...args} />
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="grid justify-items-start gap-[var(--space-24)]">
      <div style={{ width: "min(100%, 352px)" }}>
        <DividerWithText data-example="default">или</DividerWithText>
      </div>
      <div style={{ width: "min(100%, 352px)" }}>
        <DividerWithText data-example="long">
          Другой способ продолжить работу
        </DividerWithText>
      </div>
      <div style={{ width: "min(100%, 160px)" }}>
        <DividerWithText data-example="narrow">
          Длинный текст без сокращения
        </DividerWithText>
      </div>
      <div style={{ width: "min(100%, 160px)" }}>
        <DividerWithText data-example="unbroken">
          ОченьДлиннаяСтрокаБезПробелов
        </DividerWithText>
      </div>
    </div>
  ),
};
