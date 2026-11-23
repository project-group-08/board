import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { fn } from "storybook/test";

import { VersionItem } from ".";

const meta = {
  title: "UI/Version Item",
  component: VersionItem,
  args: {
    title: "10 ноября, 09:15",
    author: "Никита",
    selected: false,
    lineTop: true,
    lineBottom: true,
    onSelect: fn(),
  },
  argTypes: { onSelect: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Управляемая кнопка выбора версии для просмотра: потребитель задаёт title, author, selected и onSelect, при необходимости — currentLabel и независимые lineTop/lineBottom. Дату и текст метки компонент не формирует. selected отражается в aria-pressed; Tab, Enter и пробел работают как у нативной кнопки. Current и Selected независимы. Ширина задаётся родителем; title и author занимают каждый не более двух строк с многоточием, полный текст остаётся в доступном имени кнопки. Высота и нижняя линия растут при переносе. Состояние фокуса, сочетание Current + Selected и переменная высота согласованы отдельно и не показаны в SVG. Тема выбирается общей кнопкой Theme в Storybook.",
      },
    },
  },
} satisfies Meta<typeof VersionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[260px] max-w-full">
      <VersionItem {...args} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: '[data-example="hover"] button',
      focusVisible: '[data-example="focus"] button',
    },
  },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-[var(--space-24)] bg-[var(--color-surface)] p-[var(--space-24)]">
      {[
        "default",
        "hover",
        "selected",
        "current",
        "current-selected",
        "focus",
      ].map((state) => (
        <div
          key={state}
          data-example={state}
          className="grid w-[250px] gap-[var(--space-8)]"
        >
          <VersionItem
            {...args}
            selected={state === "selected" || state === "current-selected"}
            currentLabel={state.startsWith("current") ? "Текущая" : undefined}
          />
          <span className="text-muted-foreground [font:var(--type-mono)]">
            {state}
          </span>
        </div>
      ))}
    </div>
  ),
};

function TimelineExample() {
  const [selected, setSelected] = useState(0);
  const versions = [
    { title: "10 ноября, 09:15", author: "Никита", currentLabel: "Текущая" },
    {
      title:
        "Длинное название версии для проверки переноса в узкой панели истории Длинное название версии для проверки переноса в узкой панели истории",
      author:
        "ОченьДлинноеИмяАвтораБезПробеловОченьДлинноеИмяАвтораБезПробеловОченьДлинноеИмяАвтораБезПробелов",
    },
    { title: "8 ноября, 18:30", author: "Анна" },
  ];
  return (
    <div className="w-[180px] max-w-full">
      {versions.map((version, index) => (
        <VersionItem
          key={version.title}
          {...version}
          selected={selected === index}
          onSelect={() => setSelected(index)}
          lineTop={index > 0}
          lineBottom={index < versions.length - 1}
        />
      ))}
    </div>
  );
}

export const Timeline: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Узкий список с длинными title и author: каждое поле обрезается после двух строк. Строки разной высоты расположены вплотную; линии задаёт потребитель.",
      },
    },
  },
  render: () => <TimelineExample />,
};
