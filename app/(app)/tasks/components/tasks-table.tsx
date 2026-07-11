"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { TaskCard } from "./task-card";
import type { Priority, Task, TaskStatus } from "./types";
import type { RangeKey } from "./tasks-filters";
import { useTasks } from "@/hooks/useTasks";

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

function withinRange(dueISO: string, range: RangeKey) {
  if (range === "all") return true;
  const days = Number(range);
  const now = Date.now();
  const due = new Date(dueISO).getTime();
  const diffDays = Math.floor((due - now) / 86400000);
  return diffDays <= days;
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
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const [selected, setSelected] = useState<Task | null>(null);
  const [draggedOverLane, setDraggedOverLane] = useState<LaneKey | null>(null);

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
    status: "To Do",
    due: new Date().toISOString().slice(0, 10),
  });

  const myName = "CFO";

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter((t) => {
      if (!withinRange(t.dueISO, range)) return false;
      if (assigneeFilter === "me" && t.assignee !== myName) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter)
        return false;

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
  const onDragStart = (taskId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropToLane = (lane: LaneKey) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/taskId");
    if (!id) return;

    if (lane === "Completed") {
      updateTask(id, { status: "Done" });
    } else {
      const task = tasks.find((t) => t.id === id);
      updateTask(id, {
        priority: lane,
        status: task?.status === "Done" ? "To Do" : task?.status,
      });
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  // ---------------------------
  // Drawer actions
  // ---------------------------
  const updateSelected = (patch: Partial<Task>) => {
    if (!selected) return;
    const merged = { ...selected, ...patch };
    setSelected(merged);
    updateTask(selected.id, patch);
  };

  const deleteSelected = () => {
    if (!selected) return;
    deleteTask(selected.id);
    setSelected(null);
    toast.success("Task deleted.");
  };

  // ---------------------------
  // Create task
  // ---------------------------
  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Enter a task title.");
      return;
    }

    const dueISO = new Date(newTask.due).toISOString();

    createTask({
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      assignee: newTask.assignee.trim() || myName,
      priority: newTask.priority,
      status: newTask.status,
      dueISO,
    });

    setShowCreate(false);
    setNewTask((v) => ({
      ...v,
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
    }));
    toast.success("Task created.");
  };

  return (
    <>
      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Drag tasks between columns • Drop into{" "}
          <span className="font-medium">Completed</span> to mark done
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white"
        >
          + New task
        </button>
      </div>

      {/* Board */}
      <div className="grid items-start gap-4 lg:grid-cols-4">
        {LANES.map((col) => {
          const isExpanded =
            grouped[col.key].length > 0 || draggedOverLane === col.key;

          return (
            <section
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedOverLane !== col.key) {
                  setDraggedOverLane(col.key);
                }
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                if (
                  e.clientX < rect.left ||
                  e.clientX >= rect.right ||
                  e.clientY < rect.top ||
                  e.clientY >= rect.bottom
                ) {
                  setDraggedOverLane(null);
                }
              }}
              onDrop={(e) => {
                onDropToLane(col.key)(e);
                setDraggedOverLane(null);
              }}
              className={`rounded-2xl border ${col.border} overflow-hidden bg-white transition-all duration-300 dark:bg-[#282828]`}
            >
              {/* Sticky colored header */}
              <div
                className={`sticky top-0 z-10 ${col.headerBg} px-4 py-4 text-white`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{col.title}</p>
                    {/* <p className="text-xs opacity-90">{col.subtitle}</p> */}
                  </div>
                  <div className="text-3xl leading-none font-semibold">
                    {counts[col.key]}
                  </div>
                </div>
              </div>

              {/* Column body (scroll inside) */}
              <div
                className={`transition-all duration-300 ${col.tint} dark:bg-transparent ${
                  isExpanded ? "p-4" : "p-0"
                }`}
              >
                <div
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? "max-h-[500px] min-h-[100px] space-y-3 overflow-y-auto pr-1"
                      : "h-0 overflow-hidden"
                  }`}
                >
                  {grouped[col.key].length === 0 ? (
                    <div className="flex h-[80px] items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-white/50 text-xs text-gray-500 dark:border-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                      Drop to add task
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

                {!isExpanded && (
                  <div className="m-4 flex h-[70px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-xs font-medium text-gray-400 select-none dark:border-zinc-700 dark:text-zinc-500">
                    Drop tasks here
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-[#282828]">
            {/* <div className="flex items-start justify-between">
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
            </div> */}

            <div className="mt-4 space-y-3">
              <div>
                {/* <label className="text-xs text-gray-500">Title</label> */}
                <input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((v) => ({ ...v, title: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#282828]"
                  placeholder="Title"
                />
              </div>

              <div>
                {/* <label className="text-xs text-gray-500">
                  Description (optional)
                </label> */}
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((v) => ({ ...v, description: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#282828]"
                  rows={3}
                  placeholder="Description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  {/* <label className="text-xs text-gray-500">Assignee</label> */}
                  <input
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask((v) => ({ ...v, assignee: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#282828]"
                    placeholder="Assignee"
                  />
                </div>

                <div>
                  {/* <label className="text-xs text-gray-500">Due date</label> */}
                  <input
                    type="date"
                    value={newTask.due}
                    onChange={(e) =>
                      setNewTask((v) => ({ ...v, due: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#282828]"
                  />
                </div>

                <div>
                  {/* <label className="text-xs text-gray-500">Priority</label> */}
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask((v) => ({
                        ...v,
                        priority: e.target.value as Priority,
                      }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#282828]"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  {/* <label className="text-xs text-gray-500">Status</label> */}
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask((v) => ({
                        ...v,
                        status: e.target.value as TaskStatus,
                      }))
                    }
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#282828]"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreateTask}
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
          <div
            className="absolute inset-0 bg-black/25"
            onClick={() => setSelected(null)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl dark:bg-[#282828]">
            <div className="flex items-start justify-between border-b p-5">
              <div>
                <h3 className="text-lg font-semibold">{selected.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selected.meeting ? (
                    <>
                      From{" "}
                      <span className="font-medium">{selected.meeting}</span>
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
                    onChange={(e) =>
                      updateSelected({ priority: e.target.value as Priority })
                    }
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
                    onChange={(e) =>
                      updateSelected({ status: e.target.value as TaskStatus })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <p className="mb-1 text-xs text-gray-500">Assignee</p>
                  <input
                    value={selected.assignee}
                    onChange={(e) =>
                      updateSelected({ assignee: e.target.value })
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  />
                </div>

                <div className="col-span-2">
                  <p className="mb-1 text-xs text-gray-500">Due date</p>
                  <input
                    type="date"
                    value={selected.dueISO.slice(0, 10)}
                    onChange={(e) =>
                      updateSelected({
                        dueISO: new Date(e.target.value).toISOString(),
                      })
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
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white"
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
