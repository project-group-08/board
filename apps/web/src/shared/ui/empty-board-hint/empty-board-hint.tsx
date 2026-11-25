import { BotMessageSquare, StickyNote, UserPlus } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { Button } from "../button";

export type EmptyBoardHintProps = {
  onAddSticker: () => void;
  onCreateDraft: () => void;
  onInvite: () => void;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
};

export function EmptyBoardHint({
  onAddSticker,
  onCreateDraft,
  onInvite,
  as: Heading = "h2",
  className,
}: EmptyBoardHintProps) {
  return (
    <div
      className={twMerge(
        "flex w-full min-w-0 flex-col items-center gap-[var(--space-24)] text-center",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-[var(--space-16)]">
        <Heading className="text-foreground tracking-[var(--tracking-title)] [font:var(--type-title)]">
          Начните с первого элемента
        </Heading>
        <p className="text-muted-foreground [font:var(--type-body-s)]">
          Добавьте стикер, попросите ИИ набросать черновик или пригласите
          команду
        </p>
      </div>
      <div className="flex max-w-full flex-wrap justify-center gap-[var(--space-8)]">
        <Button
          variant="outline"
          leadingIcon={<StickyNote strokeWidth={2.25} />}
          onClick={onAddSticker}
        >
          Стикер
        </Button>
        <Button
          variant="accent"
          leadingIcon={<BotMessageSquare strokeWidth={2.25} />}
          onClick={onCreateDraft}
        >
          Черновик с ИИ
        </Button>
        <Button
          variant="outline"
          leadingIcon={<UserPlus strokeWidth={2.25} />}
          onClick={onInvite}
        >
          Пригласить
        </Button>
      </div>
    </div>
  );
}
