import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { AiChatMessage, AiChatPanel, AiChatStatus } from ".";
import type { AiChatPanelProps } from ".";
import { Button } from "../button";

const meta = {
  title: "UI/AI Chat Panel",
  component: AiChatPanel,
  args: {
    labels: {
      title: "Чат с ИИ",
      description: "Работает с содержимым доски",
      close: "Закрыть",
      input: "Сообщение",
      placeholder: "Опишите задачу",
      send: "Отправить",
    },
    counter: "Осталось 18 из 20 запросов на сегодня",
    value: "",
    onValueChange: action("onValueChange"),
    onClose: action("onClose"),
    onSend: action("onSend"),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Управляемый каркас: потребитель задаёт тексты, содержимое, доступность и действия. Допущения вне SVG: панель ограничивается размерами контейнера и высотой экрана; при нехватке высоты прокручивается вся панель, содержимое и textarea тоже прокручиваются, textarea растёт до пяти строк. Тему можно переключить в панели Storybook.",
      },
    },
  },
} satisfies Meta<typeof AiChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  argTypes: { value: { control: false } },
  render: function Interactive(args) {
    const [value, setValue] = useState(args.value);
    return (
      <AiChatPanel
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange(next);
          setValue(next);
        }}
      >
        <p className="text-muted-foreground [font:var(--type-body-s)]">
          Содержимое панели передаёт потребитель.
        </p>
      </AiChatPanel>
    );
  },
};

export const LongText: Story = {
  ...Interactive,
  args: {
    labels: {
      ...meta.args.labels,
      title: "Длинный заголовок панели ".repeat(8),
      description: "Длинное описание работы панели ".repeat(8),
    },
    counter: "Длинный текст счётчика ".repeat(12),
  },
};

export const Disabled: Story = {
  args: { inputDisabled: true, sendDisabled: true },
};

const prompts = [
  "Сделать резюме",
  "Сгруппировать идеи",
  "Предложить дополнения",
  "Черновик схемы",
  "Идеи на стикерах",
];

type ExampleState =
  | "default"
  | "empty"
  | "loading"
  | "review"
  | "error"
  | "limit";

function Example({
  args,
  state,
  long = false,
}: {
  args: AiChatPanelProps;
  state: ExampleState;
  long?: boolean;
}) {
  const [value, setValue] = useState(args.value);
  const question = "Предложи, что ещё добавить в онбординг";
  const answer =
    "Добавил на доску два стикера: чек-лист первых шагов и письмо через день после регистрации. Проверьте черновик и примените его, если подходит";
  return (
    <AiChatPanel
      {...args}
      labels={{
        ...args.labels,
        placeholder:
          state === "limit" ? "Запросы закончились" : args.labels.placeholder,
      }}
      counter={
        state === "limit" ? "Использовано 20 из 20 запросов" : args.counter
      }
      sendDisabled={state === "loading" || state === "limit"}
      value={value}
      onValueChange={(next) => {
        args.onValueChange(next);
        setValue(next);
      }}
    >
      <div className="flex min-h-full min-w-0 flex-col gap-[16px]">
        {state === "empty" ? (
          <p className="text-muted-foreground [font:var(--type-body-s)]">
            ИИ строит схему по описанию, группирует идеи и дополняет то, что уже
            есть на доске
          </p>
        ) : (
          <AiChatMessage variant="user">
            {long ? question.repeat(30) : question}
          </AiChatMessage>
        )}
        {(state === "default" || state === "review") && (
          <AiChatMessage variant="assistant">
            {long ? answer.repeat(30) : answer}
          </AiChatMessage>
        )}
        {state === "loading" && (
          <AiChatStatus variant="loading">Готовлю черновик</AiChatStatus>
        )}
        {state === "review" && (
          <div className="flex flex-wrap gap-[8px]">
            <Button variant="accent" size="small" onClick={action("apply")}>
              Применить
            </Button>
            <Button variant="outline" size="small" onClick={action("cancel")}>
              Отменить
            </Button>
          </div>
        )}
        {state === "error" && (
          <div className="flex flex-col items-start gap-[12px]">
            <AiChatStatus variant="error">
              Не удалось получить ответ
            </AiChatStatus>
            <Button variant="outline" size="small" onClick={action("retry")}>
              Повторить
            </Button>
          </div>
        )}
        {state === "limit" && (
          <AiChatStatus variant="notice">
            Запросы к ИИ на сегодня закончились. Новые появятся завтра
          </AiChatStatus>
        )}
        {(state === "default" || state === "empty") && (
          <div className="mt-auto flex min-w-0 flex-col gap-[8px]">
            <p className="text-muted-foreground [font:var(--type-caption)]">
              Быстрые запросы
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {prompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="extra-small"
                  className="h-auto min-h-[28px] max-w-full py-[3px] [overflow-wrap:anywhere] whitespace-normal"
                  onClick={() => action("quick request")(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AiChatPanel>
  );
}

const exampleParameters = {
  controls: { disable: true },
  docs: {
    description: {
      story:
        "Тексты и состав примера заданы потребителем; Actions показывают вызовы без запросов и переходов. Допущения вне SVG: перенос длинного текста и кнопок, прокрутка содержимого и панели на узких и коротких экранах; индикатор загрузки вращается с учётом prefers-reduced-motion.",
    },
  },
};

export const Default: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="default" />,
};
export const Empty: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="empty" />,
};
export const Loading: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="loading" />,
};
export const Review: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="review" />,
};
export const Error: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="error" />,
};
export const Limit: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="limit" />,
};
export const LongMessages: Story = {
  parameters: exampleParameters,
  render: (args) => <Example args={args} state="default" long />,
};
