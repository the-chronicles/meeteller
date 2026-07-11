"use client";

import { Task } from "./types";

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

function formatOrdinalDate(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  return `${day}${suffix} ${month}`;
}

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
      ? "text-red-600 dark:text-red-400"
      : task.priority === "Medium"
        ? "text-orange-600 dark:text-orange-400"
        : "text-blue-600 dark:text-blue-400";

  const statusBadge = (() => {
    switch (task.status) {
      case "To Do":
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
            To Do
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-inset ring-green-700/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20">
            In Progress
          </span>
        );
      default:
        return null;
    }
  })();

  return (
    <div
      {...draggableProps}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(task)}
      className="flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-3.5 transition hover:bg-gray-50 hover:shadow-xs dark:border-white/10 dark:bg-[#1f1f1f] dark:hover:bg-white/5 text-left w-full space-y-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight flex-1">
          {task.title}
        </h3>
        {statusBadge}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 leading-none">
        <span>{formatOrdinalDate(task.dueISO)}</span>
        <span>•</span>
        <span className={`${priorityColor} font-medium`}>{task.priority}</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 leading-none">
        <span className="truncate max-w-[150px]">
          {task.meeting || "Manual task"}
        </span>
        <span>•</span>
        <span className="truncate max-w-[120px]">{task.assignee}</span>
      </div>
    </div>
  );
}
