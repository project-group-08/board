import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { SearchInput } from ".";

const meta = {
  title: "UI/Search Input",
  component: SearchInput,
  args: {
    "aria-label": "Поиск досок",
    clearLabel: "Очистить поиск",
    placeholder: "Поиск досок",
    shortcut: "Ctrl K",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Полю необходимо доступное имя: label, aria-label или aria-labelledby; placeholder не заменяет подпись. onChange получает реальные события ввода, onValueChange — значение при вводе и собственной очистке. Shortcut только отображается, глобальные клавиши не обрабатываются.",
      },
    },
  },
} satisfies Meta<typeof SearchInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <SearchInput {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledSearch(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "min(100%, 320px)" }}>
        <SearchInput {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 320px)" }}>
      <label htmlFor="search-example">Поиск досок</label>
      <SearchInput
        {...args}
        aria-label={undefined}
        id="search-example"
        name="query"
        defaultValue="Архитектура"
      />
    </div>
  ),
};

export const States: Story = {
  parameters: { pseudo: { focus: '[data-search-state="focus"]' } },
  render: (args) => (
    <div
      style={{
        padding: 32,
        background: "var(--color-surface)",
        borderRadius: 12,
        display: "grid",
        gap: 24,
      }}
    >
      {(["default", "focus", "filled"] as const).map((state) => (
        <div
          key={state}
          style={{ width: "min(100%, 320px)", display: "grid", gap: 8 }}
        >
          <SearchInput
            {...args}
            data-search-state={state}
            defaultValue={state === "filled" ? "Архитектура" : ""}
          />
          <span
            style={{
              font: "var(--type-mono)",
              color: "var(--color-muted-foreground)",
            }}
          >
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const ShortcutWidths: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      {[
        { label: "Обычный shortcut · 320px", width: 320, shortcut: "Ctrl K" },
        {
          label: "Длинный shortcut · 320px",
          width: 320,
          shortcut: "Ctrl Shift Alt Очень длинная подсказка",
        },
        { label: "Скрытый shortcut · 180px", width: 180, shortcut: "Ctrl K" },
      ].map((example) => (
        <div
          key={example.label}
          style={{
            display: "grid",
            gap: 8,
            width: `min(100%, ${example.width}px)`,
          }}
        >
          <span>{example.label}</span>
          <SearchInput
            {...args}
            aria-label={example.label}
            shortcut={example.shortcut}
          />
        </div>
      ))}
    </div>
  ),
};
