"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";

export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string; // "ai-[meetingId]-[index]" or "manual-[id]"
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueISO: string;
  assignee: string;
  meeting?: string;
  origin: "meeting" | "manual";
  isDeleted?: boolean;
}

export function useTasks() {
  const { data: meetings = [], isLoading } = useMeetings();
  const [manualTasks, setManualTasks] = useState<Task[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Partial<Task>>>({});

  // Memoize AI tasks from backend meetings
  const aiTasks = useMemo(() => {
    const list: Task[] = [];
    meetings.forEach((meeting) => {
      if (meeting.insights && meeting.insights.actionItems) {
        meeting.insights.actionItems.forEach((item, index) => {
          list.push({
            id: `ai-${meeting.id}-${index}`,
            title: item,
            priority: "Medium",
            status: "To Do",
            dueISO: meeting.createdAt || new Date().toISOString(),
            assignee: meeting.owner?.name || "CFO",
            meeting: meeting.title,
            origin: "meeting",
          });
        });
      }
    });
    return list;
  }, [meetings]);

  const loadLocalData = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const savedManual = localStorage.getItem("meeteller-manual-tasks");
      if (savedManual) {
        const parsed = JSON.parse(savedManual) as Task[];
        const mapped = parsed.map((t) => ({
          ...t,
          status: (t.status as string) === "Todo" ? ("To Do" as const) : t.status,
        }));
        setManualTasks(mapped);
      } else {
        setManualTasks([]);
      }
      const savedOverrides = localStorage.getItem("meeteller-task-overrides");
      if (savedOverrides) {
        const parsed = JSON.parse(savedOverrides) as Record<string, Partial<Task>>;
        const mapped: Record<string, Partial<Task>> = {};
        Object.entries(parsed).forEach(([key, val]) => {
          mapped[key] = {
            ...val,
            status: (val.status as string) === "Todo" ? "To Do" : val.status,
          };
        });
        setOverrides(mapped);
      } else {
        setOverrides({});
      }
    } catch (e) {
      console.error("Error loading local tasks:", e);
    }
  }, []);

  useEffect(() => {
    loadLocalData();

    const handler = () => {
      loadLocalData();
    };
    window.addEventListener("tasks-changed", handler);
    return () => {
      window.removeEventListener("tasks-changed", handler);
    };
  }, [loadLocalData]);

  // Combine and apply overrides
  const tasks = useMemo(() => {
    const aiWithOverrides = aiTasks
      .map((t) => {
        const override = overrides[t.id];
        if (override) {
          return { ...t, ...override };
        }
        return t;
      })
      .filter((t) => !t.isDeleted);

    const manualWithOverrides = manualTasks
      .map((t) => {
        const override = overrides[t.id];
        if (override) {
          return { ...t, ...override };
        }
        return t;
      })
      .filter((t) => !t.isDeleted);

    return [...aiWithOverrides, ...manualWithOverrides];
  }, [aiTasks, manualTasks, overrides]);

  const createTask = useCallback(
    (newTask: Omit<Task, "id" | "origin" | "isDeleted">) => {
      const id = `manual-${Date.now()}`;
      const task: Task = {
        ...newTask,
        id,
        origin: "manual",
      };
      const updated = [task, ...manualTasks];
      localStorage.setItem("meeteller-manual-tasks", JSON.stringify(updated));
      setManualTasks(updated);
      window.dispatchEvent(new Event("tasks-changed"));
    },
    [manualTasks],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      const updatedOverrides = {
        ...overrides,
        [id]: {
          ...(overrides[id] || {}),
          ...patch,
        },
      };
      localStorage.setItem(
        "meeteller-task-overrides",
        JSON.stringify(updatedOverrides),
      );
      setOverrides(updatedOverrides);
      window.dispatchEvent(new Event("tasks-changed"));
    },
    [overrides],
  );

  const deleteTask = useCallback(
    (id: string) => {
      if (id.startsWith("manual-")) {
        const updated = manualTasks.filter((t) => t.id !== id);
        localStorage.setItem("meeteller-manual-tasks", JSON.stringify(updated));
        setManualTasks(updated);
      }
      const updatedOverrides = {
        ...overrides,
        [id]: {
          ...(overrides[id] || {}),
          isDeleted: true,
        },
      };
      localStorage.setItem(
        "meeteller-task-overrides",
        JSON.stringify(updatedOverrides),
      );
      setOverrides(updatedOverrides);
      window.dispatchEvent(new Event("tasks-changed"));
    },
    [manualTasks, overrides],
  );

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
  };
}
