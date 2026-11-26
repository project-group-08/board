import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { LinkAccessMenu } from ".";
import type { LinkAccessValue } from ".";
import { Button } from "../button";

const labels = {
  none: "Нет доступа",
  view: "Могут смотреть",
  edit: "Могут редактировать",
};
const onValueChange = action("onValueChange");

function Example() {
  const [value, setValue] = useState<LinkAccessValue>("view");
  return (
    <LinkAccessMenu
      trigger={<Button variant="outline">{labels[value]}</Button>}
      value={value}
      labels={labels}
      onValueChange={(next) => {
        onValueChange(next);
        setValue(next);
      }}
    />
  );
}

const meta = {
  title: "UI/Link Access Menu",
  component: Example,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Выбор управляется потребителем; компонент только сообщает новое значение и закрывает меню. Trigger должен передавать полученные props и ref на интерактивный DOM-элемент и иметь доступное имя; Button соответствует этим требованиям. Переключайте тему общей кнопкой Theme. Для сравнения с макетом откройте меню с выбранным «Могут смотреть» и наведите указатель на «Могут редактировать»: галочка и подсветка независимы. Выбор выводится в Actions.",
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
