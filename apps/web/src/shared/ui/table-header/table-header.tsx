export type TableHeaderProps =
  | {
      kind: "trash";
      labels: { name: string; deletedBy: string; deletedAt: string };
    }
  | {
      kind: "members";
      labels: { member: string; role: string };
    };

export function TableHeader(props: TableHeaderProps) {
  const labels =
    props.kind === "trash"
      ? [props.labels.name, props.labels.deletedBy, props.labels.deletedAt]
      : [props.labels.member, props.labels.role];

  return (
    <div className="@container w-full min-w-0">
      <div
        data-slot="table-header"
        className={`text-muted-foreground hidden min-w-0 items-center gap-[var(--space-16)] px-[var(--space-16)] py-[var(--space-8)] [font:var(--type-caption)] @min-[720px]:grid ${
          props.kind === "trash"
            ? "@min-[720px]:grid-cols-[minmax(0,1fr)_200px_183px_128px]"
            : "@min-[720px]:grid-cols-[minmax(0,1fr)_200px_32px]"
        }`}
      >
        {labels.map((label, index) => (
          <span key={index} className="min-w-0 [overflow-wrap:anywhere]">
            {label}
          </span>
        ))}
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
