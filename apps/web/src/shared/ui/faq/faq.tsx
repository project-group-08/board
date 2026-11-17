import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export type FaqRootProps = {
  children: ReactNode;
  multiple?: boolean;
  defaultValue?: string[];
};

export type FaqItemProps = {
  value: string;
  question: string;
  answer: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

function Root({ children, multiple = false, defaultValue }: FaqRootProps) {
  return (
    <Accordion.Root
      multiple={multiple}
      defaultValue={multiple ? defaultValue : defaultValue?.slice(0, 1)}
    >
      {children}
    </Accordion.Root>
  );
}

function Item({ value, question, answer, as: Heading = "h3" }: FaqItemProps) {
  return (
    <Accordion.Item value={value} className="w-full min-w-0">
      <Accordion.Header render={<Heading />}>
        <Accordion.Trigger className="group text-foreground hover:text-muted-foreground flex w-full min-w-0 cursor-pointer items-start justify-between gap-[var(--space-16)] text-left [font:var(--type-body-medium)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent">
          <span className="min-w-0 [overflow-wrap:anywhere]">{question}</span>
          <ChevronDown
            aria-hidden="true"
            size={16}
            strokeWidth={2.25}
            className="text-muted-foreground mt-[var(--space-4)] size-[16px] shrink-0 group-data-[panel-open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="text-muted-foreground pt-[var(--space-8)] [overflow-wrap:anywhere] [font:var(--type-body)]">
        {answer}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export const Faq = { Root, Item };
