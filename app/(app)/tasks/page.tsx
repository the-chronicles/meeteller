"use client";

import { useState } from "react";
import { TasksHeader } from "./components/tasks-header";
import { TasksFilters, type RangeKey } from "./components/tasks-filters";
import { TasksTable } from "./components/tasks-table";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<RangeKey>("30");

  const [assigneeFilter, setAssigneeFilter] = useState<"all" | "me">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Todo" | "In Progress" | "Done">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "High" | "Medium" | "Low">("all");

  return (
    <div className="space-y-6">
      <TasksHeader />

      <TasksFilters
        search={search}
        setSearch={setSearch}
        range={range}
        setRange={setRange}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <TasksTable
        search={search}
        range={range}
        assigneeFilter={assigneeFilter}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
    </div>
  );
}