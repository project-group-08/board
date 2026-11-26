import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { action } from "storybook/actions";

import { FileUpload, type FileUploadState } from ".";

const labels = {
  upload: "Загрузить",
  uploading: "Загружаем",
  retry: "Повторить",
  done: "Загружено",
  replace: "Заменить",
  remove: "Удалить",
};

const meta = {
  title: "UI/File Upload",
  component: FileUpload,
  args: {
    labels,
    accept: "image/png,image/jpeg",
    onFileSelect: action("onFileSelect"),
    onRetry: action("onRetry"),
    onRemove: action("onRemove"),
    state: {
      kind: "empty",
      title: "Логотип пространства",
      hint: "PNG или JPG до 10 МБ",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Ограничения и тексты в примерах — данные потребителя, а не проверка файла. Перенос длинного имени и кнопок на узкой ширине, обрезка превью и отключённые действия — допущения: в макете они не показаны. Плитка не является drop-зоной. Для одинаковых имён файлов в разных полях задайте каждому свой contextLabel.",
      },
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Uploading: Story = {
  args: {
    state: {
      kind: "uploading",
      fileName: "logo.png",
      progress: 60,
      progressLabel: "Загрузка logo.png",
    },
  },
};

export const Error: Story = {
  args: {
    state: { kind: "error", fileName: "logo.png", error: "Файл больше 10 МБ" },
  },
};

export const Done: Story = {
  args: { state: { kind: "done", fileName: "logo.png" } },
};

export const DoneWithPreview: Story = {
  args: {
    state: {
      kind: "done",
      fileName: "logo.png",
      previewUrl:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='20' fill='%232563eb'/%3E%3C/svg%3E",
    },
  },
};

export const NarrowAndLongName: Story = {
  args: {
    state: {
      kind: "done",
      fileName:
        "очень-длинное-название-файла-без-пробелов-для-пространства.png",
    },
  },
  render: (args) => (
    <div style={{ width: 200 }}>
      <FileUpload {...args} />
    </div>
  ),
};

const states: FileUploadState[] = [
  {
    kind: "empty",
    title: "Логотип пространства",
    hint: "PNG или JPG до 10 МБ",
  },
  {
    kind: "uploading",
    fileName: "logo.png",
    progress: 60,
    progressLabel: "Загрузка logo.png",
  },
  { kind: "error", fileName: "logo.png", error: "Файл больше 10 МБ" },
  { kind: "done", fileName: "logo.png" },
];

export const AllStates: Story = {
  argTypes: { state: { control: false } },
  render: (args) => (
    <div className="grid max-w-[700px] gap-[32px] bg-[var(--color-surface)] p-[32px] sm:grid-cols-2">
      {states.map((state) => (
        <FileUpload key={state.kind} {...args} state={state} />
      ))}
    </div>
  ),
};

export const TwoInstances: Story = {
  argTypes: {
    state: { control: false },
    contextLabel: { control: false },
  },
  render: (args) => (
    <div className="flex flex-col gap-[24px]">
      <FileUpload
        {...args}
        contextLabel="Аватар"
        state={{ kind: "done", fileName: "logo.png" }}
      />
      <FileUpload
        {...args}
        contextLabel="Обложка"
        state={{ kind: "done", fileName: "logo.png" }}
      />
    </div>
  ),
};

export const FocusTransitions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Демонстрация потребителя: выберите результат, затем файл. Через две секунды состояние изменится без сети. Переведите фокус наружу до завершения, чтобы проверить фоновое обновление.",
      },
    },
  },
  render: function FocusTransitions(args) {
    const [state, setState] = useState<FileUploadState>(args.state);
    const [result, setResult] = useState("done");

    function start(fileName: string) {
      setState({
        kind: "uploading",
        fileName,
        progress: 60,
        progressLabel: `Загрузка ${fileName}`,
      });
      window.setTimeout(() => {
        setState(
          result === "done"
            ? { kind: "done", fileName }
            : { kind: "error", fileName, error: "Не удалось обработать файл" },
        );
      }, 2000);
    }

    return (
      <div className="flex flex-col items-start gap-[16px]">
        <label>
          Результат примера{" "}
          <select
            value={result}
            onChange={(event) => setResult(event.target.value)}
          >
            <option value="done">Успех</option>
            <option value="error">Ошибка</option>
          </select>
        </label>
        <FileUpload
          {...args}
          contextLabel="Логотип"
          state={state}
          onFileSelect={(file) => {
            args.onFileSelect(file);
            start(file.name);
          }}
          onRetry={() => {
            args.onRetry();
            if (state.kind === "error") start(state.fileName);
          }}
          onRemove={() => {
            args.onRemove();
            setState(args.state);
          }}
        />
        <button type="button">Другой элемент</button>
      </div>
    );
  },
};
