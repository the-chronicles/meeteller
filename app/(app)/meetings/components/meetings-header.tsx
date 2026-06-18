"use client";

import { Plus, Search } from "lucide-react";

export function MeetingsHeader({
  query,
  setQuery,
  onNewMeeting,
}: {
  query: string;
  setQuery: (v: string) => void;
  onNewMeeting: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-helvetica text-2xl font-semibold text-gray-900 dark:text-white">Meetings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All your recorded and processed meetings
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-[260px]">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-[#282828] dark:text-white dark:focus:ring-white/10"
          />
        </div>

        <button
          onClick={onNewMeeting}
          className="font-helvetica inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white hover:opacity-90 shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} />
          New Meeting
        </button>
      </div>
    </div>
  );
}
