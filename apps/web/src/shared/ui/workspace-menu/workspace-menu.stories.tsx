import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { WorkspaceMenu } from ".";
import { WorkspaceSwitcher } from "../workspace-switcher";

const items = [
  {
    id: "team",
    name: "Проектная группа",
    meta: "8 участников",
    markFallback: "П",
  },
  {
    id: "personal",
    name: "Личное пространство",
    meta: "1 участник",
    markFallback: "Л",
  },
];

function Example({ onCreate }: { onCreate: () => void }) {
  const [selectedId, setSelectedId] = useState("team");
  const selected = items.find((item) => item.id === selectedId)!;
  return (
    <WorkspaceMenu
      trigger={
        <WorkspaceSwitcher
          name={selected.name}
          meta={selected.meta}
          markFallback={selected.markFallback}
        />
      }
      items={items}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onCreate={onCreate}
    />
  );
}

const meta = {
  title: "UI/Workspace Menu",
  component: Example,
  args: { onCreate: action("onCreate") },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Данные и выбранный ID управляются потребителем. ID пространств должны быть уникальными; потребитель синхронизирует данные trigger с выбранным ID. Trigger должен передавать полученные props и ref на интерактивный DOM-элемент; WorkspaceSwitcher соответствует этому требованию. Создание вызывает onCreate. Галочка обозначает выбор; фон показывает подсвеченный пункт. Переключайте тему общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: ({ onCreate }) => (
    <div className="p-[var(--space-64)]">
      <Example onCreate={onCreate} />
    </div>
  ),
};
