import { BoardClient } from "./board-client";

export async function BoardPage({ params }: PageProps<"/b/[boardId]">) {
  const { boardId } = await params;

  return (
    <main className="h-dvh w-full">
      <BoardClient boardId={boardId} />
    </main>
  );
}
