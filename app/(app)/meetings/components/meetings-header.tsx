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
        <h1 className="text-2xl font-semibold">Meetings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All your recorded and processed meetings
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings..."
            className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none
                       focus:ring-2 focus:ring-black/10 dark:bg-[#0a0014]"
          />
        </div>

        <button
          onClick={onNewMeeting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} />
          New Meeting
        </button>
      </div>
    </div>
  );
}