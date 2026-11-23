import type { Meta, StoryObj } from "@storybook/react";
import { Hand, MousePointer2 } from "lucide-react";
import { useState } from "react";

import { ToolGroup } from ".";
import { MenuRadioGroup, MenuRadioItem } from "../menu";

const tools = [
  { name: "Выделение", icon: <MousePointer2 />, shortcut: "V" },
  { name: "Рука", icon: <Hand />, shortcut: "H" },
] as const;

function Example({
  disabled = false,
  selected = true,
}: {
  disabled?: boolean;
  selected?: boolean;
}) {
  const [tool, setTool] = useState<(typeof tools)[number]>(tools[0]);
  const [active, setActive] = useState(selected);
  return (
    <ToolGroup
      label={`Выбрать: ${tool.name}`}
      menuLabel="Выбрать другой инструмент"
      icon={tool.icon}
      selected={active}
      disabled={disabled}
      onSelect={() => setActive(true)}
    >
      <MenuRadioGroup
        value={tool.name}
        onValueChange={(name) => {
          const next = tools.find((item) => item.name === name);
          if (next) setTool(next);
          setActive(true);
        }}
      >
        {tools.map((item) => (
          <MenuRadioItem
            key={item.name}
            value={item.name}
            icon={item.icon}
            shortcut={item.shortcut}
          >
            {item.name}
          </MenuRadioItem>
        ))}
      </MenuRadioGroup>
    </ToolGroup>
  );
}

const meta = {
  title: "UI/Tool Group",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Две независимые кнопки: основная вызывает onSelect, стрелка открывает Menu. Потребитель передаёт выбранность, иконку, имена и пункты Menu и обновляет их после выбора; Menu закрывается штатно. Область стрелки — 24 × 36 px, без перекрытия соседей. Disabled блокирует обе кнопки. Тема выбирается общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => (
    <div className="p-[var(--space-64)]">
      <Example />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    pseudo: {
      focusVisible:
        '[data-focus="main"] button:first-child, [data-focus="arrow"] button:nth-child(2)',
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-[var(--space-24)] p-[var(--space-64)]">
      <div>
        <Example selected={false} />
        <p>Default / Open</p>
      </div>
      <div>
        <Example />
        <p>Active / Active + Open</p>
      </div>
      <div>
        <Example disabled />
        <p>Active + Disabled</p>
      </div>
      <div>
        <Example disabled selected={false} />
        <p>Disabled</p>
      </div>
      <div data-focus="main">
        <Example />
        <p>Фокус основной</p>
      </div>
      <div data-focus="arrow">
        <Example />
        <p>Фокус стрелки</p>
      </div>
    </div>
  ),
};

function DisabledExample() {
  const [disabled, setDisabled] = useState(false);
  return (
    <div className="flex items-center gap-[var(--space-24)] p-[var(--space-64)]">
      <Example disabled={disabled} />
      <button
        type="button"
        data-testid="toggle-disabled"
        className="border-border rounded-[var(--radius-sm)] border px-3 py-2 focus-visible:shadow-[var(--shadow-focus)]"
        onClick={() => setDisabled((value) => !value)}
      >
        {disabled ? "Включить группу" : "Отключить группу"}
      </button>
    </div>
  );
}

export const DisableWhileOpen: Story = {
  render: () => <DisabledExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Выберите инструмент, откройте меню и отключите группу. После включения меню закрыто, а выбранный потребителем инструмент сохраняется. Фокус остаётся на внешней кнопке, если отключение выполнено через неё.",
      },
    },
  },
};
