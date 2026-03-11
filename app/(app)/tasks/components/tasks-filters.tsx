/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export type RangeKey = "7" | "30" | "90" | "all";

export function TasksFilters({
  search,
  setSearch,
  range,
  setRange,
  assigneeFilter,
  setAssigneeFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: {
  search: string;
  setSearch: (v: string) => void;
  range: RangeKey;
  setRange: (v: RangeKey) => void;
  assigneeFilter: "all" | "me";
  setAssigneeFilter: (v: "all" | "me") => void;
  statusFilter: "all" | "Todo" | "In Progress" | "Done";
  setStatusFilter: (v: "all" | "Todo" | "In Progress" | "Done") => void;
  priorityFilter: "all" | "High" | "Medium" | "Low";
  setPriorityFilter: (v: "all" | "High" | "Medium" | "Low") => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left: range + filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as RangeKey)}
          className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-[#0a0014]"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value as "all" | "me")}
          className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-[#0a0014]"
        >
          <option value="all">All tasks</option>
          <option value="me">Assigned to me</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-[#0a0014]"
        >
          <option value="all">Status: All</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-[#0a0014]"
        >
          <option value="all">Priority: Any</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Right: search */}
      <div className="w-full md:w-[320px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none
                     focus:ring-2 focus:ring-black/10 dark:bg-[#0a0014]"
        />
      </div>
    </div>
  );
}