"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => {
    const stored = localStorage.getItem("recent-searches");
    return stored ? JSON.parse(stored) : [];
  });

  const saveSearch = (value: string) => {
    if (!value.trim()) return;

    const updated = [value, ...recent.filter((r) => r !== value)].slice(0, 5);

    setRecent(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* Dialog */}
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-2xl rounded-2xl bg-white p-4 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/80">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-black/5 pb-3 dark:border-white/10">
          <Search className="h-4 w-4 opacity-60" />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveSearch(query);
            }}
            placeholder="Search anything..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          {/* Filter */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="rounded-lg p-2 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 rounded-xl bg-black/5 p-3 text-sm dark:bg-white/5">
            <p className="mb-2 text-xs font-medium opacity-70">Filters</p>

            <div className="flex flex-wrap gap-2">
              {["Meetings", "Tasks", "Notes", "People"].map((f) => (
                <button
                  key={f}
                  className="rounded-full bg-white px-3 py-1 text-xs shadow dark:bg-zinc-800"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-4">
          {query ? (
            <p className="text-sm text-gray-500">Searching for “{query}”…</p>
          ) : recent.length > 0 ? (
            <>
              <p className="mb-2 text-xs font-medium opacity-70">
                Recent searches
              </p>

              <ul className="space-y-1">
                {recent.map((item) => (
                  <li
                    key={item}
                    onClick={() => setQuery(item)}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-gray-500">Start typing to search…</p>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-4 text-right text-xs opacity-50">
          Press <kbd className="rounded bg-black/10 px-1">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}
