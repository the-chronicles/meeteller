/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { DashboardGreeting } from "./components/DashboardGreeting";
import { RecentMeetings } from "./components/recent-meetings";
import { TasksPreview } from "./components/task-preview";
import { SortableWidget } from "./components/SortableWidget";
import { WidgetShell } from "./components/WidgetShell";
import { StatsCards } from "./components/stats-card";
import UpcomingMeetings from "./components/upcoomingMeeting";
import PinnedMeetings from "./components/pinnedMeetings";

type Widget = {
  id: "meetings" | "tasks" | "upcoming-meetings" | "pinned-meetings";
  size: "full" | "half";
};

const DEFAULT_WIDGETS: Widget[] = [
  { id: "meetings", size: "half" },
  { id: "tasks", size: "full" },
  { id: "upcoming-meetings", size: "half" },
  { id: "pinned-meetings", size: "half" },
];

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("dashboard-layout");
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch {
        setWidgets(DEFAULT_WIDGETS);
      }
    }
  }, []);

  // Persist layout
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("dashboard-layout", JSON.stringify(widgets));
  }, [widgets, mounted]);

  function resetDashboard() {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem("dashboard-layout");
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6 dark:bg-black">
      <DashboardGreeting />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT: STATS */}
        <div className="flex-1">
          <StatsCards />
        </div>

        {/* RIGHT: RESET */}
        <div className="flex justify-end">
          <button
            onClick={resetDashboard}
            className="rounded-lg border border-red-200 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:cursor-pointer dark:border-white/10 dark:bg-black dark:hover:bg-white/10"
          >
            Reset Dashboard
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;

          setWidgets((items) => {
            const oldIndex = items.findIndex((w) => w.id === active.id);
            const newIndex = items.findIndex((w) => w.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        }}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {widgets.map((widget) => (
              <SortableWidget key={widget.id} id={widget.id}>
                {({
                  attributes,
                  listeners,
                }: {
                  attributes: Record<string, any>;
                  listeners: Record<string, any>;
                }) => (
                  <div
                    className={
                      widget.size === "full" ? "lg:col-span-3" : "lg:col-span-1"
                    }
                  >
                    {widget.id === "meetings" && (
                      <WidgetShell
                        title="Recent Meetings"
                        dragAttributes={attributes}
                        dragListeners={listeners}
                        onClose={() =>
                          setWidgets((w) =>
                            w.filter((x) => x.id !== "meetings"),
                          )
                        }
                      >
                        <RecentMeetings />
                      </WidgetShell>
                    )}

                    {widget.id === "tasks" && (
                      <WidgetShell
                        title="Tasks"
                        dragAttributes={attributes}
                        dragListeners={listeners}
                        onClose={() =>
                          setWidgets((w) => w.filter((x) => x.id !== "tasks"))
                        }
                      >
                        <TasksPreview />
                      </WidgetShell>
                    )}

                    {widget.id === "upcoming-meetings" && (
                      <WidgetShell
                        title="Upcoming Meetings"
                        dragAttributes={attributes}
                        dragListeners={listeners}
                        onClose={() =>
                          setWidgets((w) =>
                            w.filter((x) => x.id !== "upcoming-meetings"),
                          )
                        }
                      >
                        <UpcomingMeetings />
                      </WidgetShell>
                    )}

                    {widget.id === "pinned-meetings" && (
                      <WidgetShell
                        title="Pinned Meetings"
                        dragAttributes={attributes}
                        dragListeners={listeners}
                        onClose={() =>
                          setWidgets((w) =>
                            w.filter((x) => x.id !== "pinned-meetings"),
                          )
                        }
                      >
                        <PinnedMeetings />
                      </WidgetShell>
                    )}
                  </div>
                )}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
