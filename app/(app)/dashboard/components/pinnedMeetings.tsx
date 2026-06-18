"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { RealisticPin } from "./RealisticPin";
import { PIN_STYLES } from "@/lib/pinnedColors";
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

const COLORS = ["green", "purple", "blue", "yellow", "pink"];
const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3"];

export default function PinnedMeetings() {
  const { data: meetings = [], isLoading } = useMeetings();
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  const loadPinned = () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("meeteller-pinned-meetings");
    if (saved) {
      try {
        setPinnedIds(JSON.parse(saved));
      } catch {
        setPinnedIds([]);
      }
    } else {
      setPinnedIds([]);
    }
  };

  useEffect(() => {
    loadPinned();
    const handler = () => {
      loadPinned();
    };
    window.addEventListener("pinned-changed", handler);
    return () => {
      window.removeEventListener("pinned-changed", handler);
    };
  }, []);

  const pinnedList = useMemo(() => {
    return meetings
      .filter((m) => pinnedIds.includes(String(m.id)))
      .map((m, i) => ({
        ...m,
        color: COLORS[i % COLORS.length],
        rotate: ROTATIONS[i % ROTATIONS.length],
      }));
  }, [meetings, pinnedIds]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black text-sm text-gray-500">
        Loading pinned meetings...
      </div>
    );
  }

  if (pinnedList.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black text-sm text-gray-500 text-center">
        No pinned meetings. Hover over recent meetings and click the pin icon to pin them!
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {pinnedList.map((m) => {
          const style = PIN_STYLES[m.color as keyof typeof PIN_STYLES];
          const dateLabel = formatRecentDate(m.startedAt || m.createdAt);

          return (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className={clsx(
                "relative rounded-xl p-4",
                "bg-linear-to-br",
                style.card,
                style.glow,
                "shadow-lg transition hover:shadow-xl",
                "animate-pin-drop",
                m.rotate,
              )}
            >
              <RealisticPin color={style.pin} />
 
              <div className="mt-6 flex items-start gap-3">
                <Mic size={18} className="text-gray-400" />
                <div>
                  <p className="font-medium md:text-xs lg:text-[12px] text-gray-900 dark:text-white leading-snug">
                    {m.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 md:text-xs lg:text-[12px] leading-snug mt-0.5">
                    {dateLabel}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
