"use client";

import Link from "next/link";
import { Mic, Pin, PinOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";

function formatRecentDate(dateStr: string) {
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return `Today • ${time}`;
  if (isYesterday) return `Yesterday • ${time}`;
  
  const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${d.toLocaleDateString("en-US", dateOptions)} • ${time}`;
}

export function RecentMeetings() {
  const { data: meetings = [], isLoading } = useMeetings();
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("meeteller-pinned-meetings");
    if (saved) {
      try {
        setPinnedIds(JSON.parse(saved));
      } catch {
        setPinnedIds([]);
      }
    }
  }, []);

  const togglePin = (id: string) => {
    let nextPinned: string[];
    if (pinnedIds.includes(id)) {
      nextPinned = pinnedIds.filter((x) => x !== id);
    } else {
      nextPinned = [...pinnedIds, id];
    }
    setPinnedIds(nextPinned);
    localStorage.setItem("meeteller-pinned-meetings", JSON.stringify(nextPinned));
    window.dispatchEvent(new Event("pinned-changed"));
  };

  const recent = useMemo(() => {
    return meetings
      .filter((m) => m.status !== "scheduled")
      .slice(0, 3);
  }, [meetings]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 shadow-sm text-sm text-gray-500">
        Loading recent meetings...
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 shadow-sm text-sm text-gray-500">
        No recent meetings found.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-900 shadow-sm">
      <div className="divide-y divide-gray-100 dark:divide-white/10">
        {recent.map((meeting) => {
          const isPinned = pinnedIds.includes(String(meeting.id));
          const dateLabel = formatRecentDate(meeting.startedAt || meeting.createdAt);

          return (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="
                group flex items-center gap-3 px-4 py-3
                transition hover:bg-gray-50 dark:hover:bg-white/5
              "
            >
              <Mic size={18} className="text-gray-400" />
  
              <div>
                <p className="text-sm font-medium dark:text-white">
                  {meeting.title}
                </p>
                <p className="text-xs text-[#8c8b8b]">
                  {dateLabel}
                </p>
              </div>
  
              {/* PIN / UNPIN */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  togglePin(String(meeting.id));
                }}
                className={`
                  ml-auto rounded-md p-1
                  transition hover:bg-black/5 dark:hover:bg-white/10
                  ${isPinned ? "opacity-100 text-[#5b09c4] dark:text-[#a855f7]" : "opacity-0 group-hover:opacity-100"}
                `}
                title={isPinned ? "Unpin" : "Pin"}
              >
                {isPinned ? (
                  <PinOff size={16} />
                ) : (
                  <Pin size={16} />
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
