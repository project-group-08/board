"use client";

import { Board } from "apeiro/react";

import "apeiro/styles.css";

import { useTheme } from "@/shared/lib/theme";

import { boardConfig } from "../config/board-config";

export function BoardCanvas({ boardId }: { boardId: string }) {
  const { theme } = useTheme();

  return (
    <Board
      key={boardId}
      className="h-full w-full"
      config={{ ...boardConfig, theme: theme }}
    />
  );
}
