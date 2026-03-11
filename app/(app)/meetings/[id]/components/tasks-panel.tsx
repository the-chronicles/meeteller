"use client";

type ItemStatus = "Completed" | "In Progress" | "Not Started";

function statusPill(status: ItemStatus) {
  if (status === "Completed") {
    return "bg-green-50 text-green-700 border-green-200";
  }
  if (status === "In Progress") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-red-50 text-red-700 border-red-200";
}

export function TasksPanel({
  items,
}: {
  items: {
    id: string;
    title: string;
    assignee: string;
    dueISO: string;
    status: ItemStatus;
  }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Action Items
      </h3>

      <div className="mt-4 space-y-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 dark:bg-[#0a0014]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {t.title}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t.assignee} • Due on {t.dueISO}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusPill(
                t.status,
              )}`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}