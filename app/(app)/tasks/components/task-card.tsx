"use client";

import { Calendar } from "lucide-react";
import { Task } from "./types";

export function TaskCard({
  task,
  onOpen,
  draggableProps,
}: {
  task: Task;
  onOpen: (t: Task) => void;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const priorityColor =
    task.priority === "High"
      ? "text-red-600"
      : task.priority === "Medium"
        ? "text-orange-600"
        : "text-blue-600";

  return (
    <div
      {...draggableProps}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(task)}
      className="flex cursor-pointer items-start justify-between rounded-xl border bg-white p-3 transition hover:shadow-sm dark:bg-[#0a0014]"
    >
      <div className="space-y-1">
        <h3 className="font-medium">{task.title}</h3>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {task.meeting ? (
            <>
              From <span className="font-medium">{task.meeting}</span>
            </>
          ) : (
            <span className="font-medium">Manual task</span>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Assigned to {task.assignee}</span>
          <span className={priorityColor}>{task.priority} priority</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700 dark:bg-white/10 dark:text-gray-200">
            {task.status}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
        <Calendar size={14} className="shrink-0" />
        <span className="leading-none">
          {new Date(task.dueISO).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
