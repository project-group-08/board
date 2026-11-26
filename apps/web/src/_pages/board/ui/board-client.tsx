"use client";

import dynamic from "next/dynamic";

// Холст работает только в браузере (WebGPU/WebGL2), поэтому без SSR;
// ssr: false допустим только в клиентском компоненте.
const BoardCanvas = dynamic(
  () => import("./board-canvas").then((module) => module.BoardCanvas),
  { ssr: false },
);

export function BoardClient({ boardId }: { boardId: string }) {
  return <BoardCanvas boardId={boardId} />;
}
