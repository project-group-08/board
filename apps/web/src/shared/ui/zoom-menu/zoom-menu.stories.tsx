import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { ZoomMenu } from ".";
import { Button } from "../button";

const showAll = action("onShowAll");
const showSelection = action("onShowSelection");
const zoomIn = action("onZoomIn");
const zoomOut = action("onZoomOut");
const setZoom = action("onSetZoom");

function Example() {
  const [zoomPercent, setZoomPercent] = useState(100);
  return (
    <ZoomMenu
      trigger={<Button variant="outline">{zoomPercent}%</Button>}
      zoomPercent={zoomPercent}
      onShowAll={showAll}
      onShowSelection={showSelection}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onSetZoom={(percent) => {
        setZoom(percent);
        setZoomPercent(percent);
      }}
    />
  );
}

const meta = {
  title: "UI/Zoom Menu",
  component: Example,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Масштаб контролируется потребителем, команды выводятся в Actions. В примере только выбор пресета меняет значение: шаги и поведение камеры не заданы. Подсказки клавиш не регистрируют сочетания. Trigger должен быть кнопкой с доступным именем и передавать полученные props и ref на DOM-элемент; Button соответствует этим требованиям. Переключайте тему общей кнопкой Theme.",
      },
    },
  },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => (
    <div className="p-[var(--space-64)]">
      <Example />
    </div>
  ),
};
