"use client";

import { TasksPanel } from "./tasks-panel";

type TaskItem = {
  id: string;
  title: string;
  assignee: string;
  dueISO: string;
  status: "Completed" | "In Progress" | "Not Started";
};

export function SummaryPanel({
  meeting,
  tasks = [],
}: {
  meeting: {
    meetingName: string;
    objectives: string;
    decisions: string[];
    summary: string;
  };
  tasks?: TaskItem[];
}) {
  return (
    <div className="space-y-6">
      {/* Meeting Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {meeting.meetingName}
        </h1>
      </div>

      {/* Overview */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Meeting Overview
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {meeting.summary}
        </p>
      </div>

      {/* Objectives */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Objectives
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {meeting.objectives}
        </p>
      </div>

      {/* Key Decisions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Key Decisions
        </h3>
        {meeting.decisions.length === 0 ? (
          <p className="mt-1 text-sm text-gray-400 dark:text-zinc-500 italic">
            No decisions recorded.
          </p>
        ) : (
          <ol className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {meeting.decisions.map((d, idx) => (
              <li key={d} className="flex gap-2">
                <span className="w-5 text-gray-400">{idx + 1}.</span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Action Items */}
      <div className="border-t border-gray-200 pt-6 dark:border-white/10">
        <TasksPanel items={tasks} />
      </div>
    </div>
  );
}