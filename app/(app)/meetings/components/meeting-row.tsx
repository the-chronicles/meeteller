"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Meeting } from "../page";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTimeHHMM(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function relativeDayLabel(d: Date) {
  const today = new Date();
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000);

  if (diff === 0) return "TODAY";
  if (diff === -1) return "YESTERDAY";

  return d
    .toLocaleDateString(undefined, { weekday: "short" })
    .toUpperCase();
}

function durationLabel(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function MeetingRow({ meeting }: { meeting: Meeting }) {
  const isProcessing = meeting.status === "processing";
  const start = new Date(meeting.startISO);

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group block rounded-2xl border bg-white p-4 transition hover:bg-gray-50
                 dark:bg-[#0a0014] dark:hover:bg-white/5"
    >
      <div className="flex gap-4">
        {/* Left date/time box */}
        <div className="w-[92px] shrink-0 rounded-xl bg-gray-100 px-3 py-3 text-center dark:bg-white/10">
          <p className="text-[11px] font-semibold tracking-wide text-gray-600 dark:text-gray-300">
            {relativeDayLabel(start)}
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatTimeHHMM(start)}
          </p>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-[#5b09c4] dark:text-white">
                {meeting.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                {meeting.summary || "Meeting recording and transcript processing."}
              </p>

              {/* Duration under (like screenshot) */}
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Duration:{" "}
                <span className="font-semibold">
                  {durationLabel(meeting.durationMin)}
                </span>
              </p>
            </div>

            {/* Status pill (right) */}
            <div className="shrink-0">
              {isProcessing ? (
                <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm dark:bg-[#0a0014] dark:text-gray-200">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                  Processing
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-2 text-xs font-medium text-white shadow-sm">
                  <CheckCircle2 size={14} className="text-white" />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}