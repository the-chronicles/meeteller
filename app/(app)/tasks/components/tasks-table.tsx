"use client";

import React, { useMemo, useState } from "react";
import { TaskCard } from "./task-card";
import type { Priority, Task, TaskStatus } from "./types";
import type { RangeKey } from "./tasks-filters";

type LaneKey = Priority | "Completed";

const LANES: {
  key: LaneKey;
  title: string;
  subtitle: string;
  headerBg: string;
  border: string;
  tint: string;
}[] = [
  {
    key: "High",
    title: "High priority",
    subtitle: "Do first",
    headerBg: "bg-red-500",
    border: "border-red-200",
    tint: "bg-red-50",
  },
  {
    key: "Medium",
    title: "Medium priority",
    subtitle: "Do next",
    headerBg: "bg-orange-500",
    border: "border-orange-200",
    tint: "bg-orange-50",
  },
  {
    key: "Low",
    title: "Low priority",
    subtitle: "Can wait",
    headerBg: "bg-blue-500",
    border: "border-blue-200",
    tint: "bg-blue-50",
  },
  {
    key: "Completed",
    title: "Completed",
    subtitle: "Done ✅",
    headerBg: "bg-green-600",
    border: "border-green-200",
    tint: "bg-green-50",
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Prepare taxation by-law",
    meeting: "Budget Planning Meeting",
    assignee: "CFO",
    priority: "High",
    status: "Todo",
    dueISO: new Date(Date.now() + 5 * 86400000).toISOString(),
    description: "Draft the by-law and share with legal for review.",
    origin: "meeting",
  },
  {
    id: 2,
    title: "Improve public engagement process",
    meeting: "Council Review",
    assignee: "Council",
    priority: "Medium",
    status: "In Progress",
    dueISO: new Date(Date.now() + 9 * 86400000).toISOString(),
    description: "Define outreach flow and publish comms timeline.",
    origin: "meeting",
  },
  {
    id: 3,
    title: "Send follow-up notes to stakeholders",
    meeting: "Town Hall",
    assignee: "Comms",
    priority: "Low",
    status: "Todo",
    dueISO: new Date(Date.now() + 12 * 86400000).toISOString(),
    description: "Summarize outcomes, action items, and next steps.",
    origin: "meeting",
  },
  {
    id: 4,
    title: "Finalize Q2 roadmap draft",
    meeting: "Weekly Product Sync",
    assignee: "PM",
    priority: "High",
    status: "In Progress",
    dueISO: new Date(Date.now() + 2 * 86400000).toISOString(),
    description: "Lock scope and send for leadership sign-off.",
    origin: "meeting",
  },
  {
    id: 5,
    title: "Ship weekly report",
    assignee: "CFO",
    priority: "Low",
    status: "Done",
    dueISO: new Date(Date.now() - 1 * 86400000).toISOString(),
    description: "Send summary report to leadership.",
    origin: "manual",
  },
];

function withinRange(dueISO: string, range: RangeKey) {
  if (range === "all") return true;
  const days = Number(range);
  const now = Date.now();
  const due = new Date(dueISO).getTime();
  const diffDays = Math.floor((due - now) / 86400000);
  return diffDays <= days;
}

function nextId(tasks: Task[]) {
  return (tasks.reduce((m, t) => Math.max(m, t.id), 0) || 0) + 1;
}

export function TasksTable({
  search,
  range,
  assigneeFilter,
  statusFilter,
  priorityFilter,
}: {
  search: string;
  range: RangeKey;
  assigneeFilter: "all" | "me";
  statusFilter: "all" | TaskStatus;
  priorityFilter: "all" | Priority;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selected, setSelected] = useState<Task | null>(null);

  // Create task modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    assignee: string;
    priority: Priority;
    status: TaskStatus;
    due: string; // yyyy-mm-dd
  }>({
    title: "",
    description: "",
    assignee: "CFO",
    priority: "Medium",
    status: "Todo",
    due: new Date().toISOString().slice(0, 10),
  });

  const myName = "CFO";

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter((t) => {
      if (!withinRange(t.dueISO, range)) return false;
      if (assigneeFilter === "me" && t.assignee !== myName) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

      if (!q) return true;

      return (
        t.title.toLowerCase().includes(q) ||
        (t.meeting || "").toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      );
    });
  }, [tasks, search, range, assigneeFilter, statusFilter, priorityFilter]);

  const grouped = useMemo(() => {
    // 3 priority lanes contain NOT-DONE tasks
    const by: Record<LaneKey, Task[]> = {
      High: [],
      Medium: [],
      Low: [],
      Completed: [],
    };

    for (const t of visibleTasks) {
      if (t.status === "Done") by.Completed.push(t);
      else by[t.priority].push(t);
    }
    return by;
  }, [visibleTasks]);

  const counts = useMemo(() => {
    const c: Record<LaneKey, number> = {
      High: 0,
      Medium: 0,
      Low: 0,
      Completed: 0,
    };
    for (const t of visibleTasks) {
      if (t.status === "Done") c.Completed += 1;
      else c[t.priority] += 1;
    }
    return c;
  }, [visibleTasks]);

  // ---------------------------
  // Drag & Drop
  // ---------------------------
  const onDragStart = (taskId: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/taskId", String(taskId));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropToLane = (lane: LaneKey) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/taskId"));
    if (!id) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        // Dropping into Completed forces Done
        if (lane === "Completed") {
          return { ...t, status: "Done" };
        }

        // Dropping into priority lanes sets priority, and if it was Done, bring it back to Todo
        return {
          ...t,
          priority: lane,
          status: t.status === "Done" ? "Todo" : t.status,
        };
      }),
    );
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  // ---------------------------
  // Drawer actions
  // ---------------------------
  const updateSelected = (patch: Partial<Task>) => {
    if (!selected) return;
    const merged = { ...selected, ...patch };
    setSelected(merged);
    setTasks((prev) => prev.map((t) => (t.id === selected.id ? merged : t)));
  };

  const deleteSelected = () => {
    if (!selected) return;
    setTasks((prev) => prev.filter((t) => t.id !== selected.id));
    setSelected(null);
  };

  // ---------------------------
  // Create task
  // ---------------------------
  const createTask = () => {
    if (!newTask.title.trim()) return;

    const dueISO = new Date(newTask.due).toISOString();

    setTasks((prev) => [
      {
        id: nextId(prev),
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        assignee: newTask.assignee.trim() || myName,
        priority: newTask.priority,
        status: newTask.status,
        dueISO,
        origin: "manual",
      },
      ...prev,
    ]);

    setShowCreate(false);
    setNewTask((v) => ({
      ...v,
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
    }));
  };

  return (
    <>
      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Drag tasks between columns • Drop into <span className="font-medium">Completed</span> to mark done
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white"
        >
          + New task
        </button>
      </div>

      {/* Board */}
      <div className="grid gap-4 lg:grid-cols-4">
        {LANES.map((col) => (
          <section
            key={col.key}
            onDrop={onDropToLane(col.key)}
            onDragOver={onDragOver}
            className={`rounded-2xl border ${col.border} overflow-hidden bg-white dark:bg-[#0a0014]`}
          >
            {/* Sticky colored header */}
            <div className={`sticky top-0 z-10 ${col.headerBg} px-4 py-4 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{col.title}</p>
                  <p className="text-xs opacity-90">{col.subtitle}</p>
                </div>
                <div className="text-3xl font-semibold leading-none">
                  {counts[col.key]}
                </div>
              </div>
            </div>

            {/* Column body (scroll) */}
            <div className={`p-4 ${col.tint} dark:bg-transparent`}>
              <div className="h-[calc(100vh-360px)] overflow-y-auto pr-1 space-y-3">
                {grouped[col.key].length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-white/70 p-4 text-sm text-gray-500 dark:bg-white/5 dark:text-gray-300">
                    Drop tasks here.
                  </div>
                ) : (
                  grouped[col.key].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onOpen={setSelected}
                      draggableProps={{
                        draggable: true,
                        onDragStart: onDragStart(task.id),
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-[#0a0014]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Create task</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add a manual task to your board.
                </p>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500">Title</label>
                <input
                  value={newTask.title}
                  onChange={(e) => setNewTask((v) => ({ ...v, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  placeholder="e.g. Follow up with client"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Description (optional)</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask((v) => ({ ...v, description: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  rows={3}
                  placeholder="Add context..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Assignee</label>
                  <input
                    value={newTask.assignee}
                    onChange={(e) => setNewTask((v) => ({ ...v, assignee: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                    placeholder="e.g. CFO"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Due date</label>
                  <input
                    type="date"
                    value={newTask.due}
                    onChange={(e) => setNewTask((v) => ({ ...v, due: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask((v) => ({ ...v, priority: e.target.value as Priority }))}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask((v) => ({ ...v, status: e.target.value as TaskStatus }))}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={createTask}
                  className="flex-1 rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white"
                >
                  Create task
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer (task details) */}
      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/25" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 h-full shadow-2xl w-full max-w-md bg-white dark:bg-[#0a0014]">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-semibold">{selected.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selected.meeting ? (
                    <>
                      From <span className="font-medium">{selected.meeting}</span>
                    </>
                  ) : (
                    <span className="font-medium">Manual task</span>
                  )}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-200">
                {selected.description || "No description yet."}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs text-gray-500">Priority</p>
                  <select
                    value={selected.priority}
                    onChange={(e) => updateSelected({ priority: e.target.value as Priority })}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-xs text-gray-500">Status</p>
                  <select
                    value={selected.status}
                    onChange={(e) => updateSelected({ status: e.target.value as TaskStatus })}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <p className="mb-1 text-xs text-gray-500">Assignee</p>
                  <input
                    value={selected.assignee}
                    onChange={(e) => updateSelected({ assignee: e.target.value })}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  />
                </div>

                <div className="col-span-2">
                  <p className="mb-1 text-xs text-gray-500">Due date</p>
                  <input
                    type="date"
                    value={selected.dueISO.slice(0, 10)}
                    onChange={(e) =>
                      updateSelected({ dueISO: new Date(e.target.value).toISOString() })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateSelected({ status: "Done" })}
                  className="flex-1 rounded-lg bg-[#5b09c4] px-3 py-2 text-sm font-medium text-white"
                >
                  Mark Done
                </button>
                <button
                  onClick={deleteSelected}
                  className="rounded-lg bg-red-500 text-white px-3 py-2 text-sm"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Backend hook: sync status/priority changes to your API.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}