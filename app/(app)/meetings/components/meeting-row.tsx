"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";
import { Meeting } from "@/app/types/meeting";

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

  return d.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase();
}

export function MeetingRow({
  meeting,
  onEdit,
}: {
  meeting: Meeting;

  onEdit?: (meeting: Meeting) => void;
}) {
  const isProcessing = meeting.status === "processing";

  const isLive = meeting.status === "live";

  const isScheduled = meeting.status === "scheduled";
  const start = meeting.startedAt
    ? new Date(meeting.startedAt)
    : new Date(meeting.createdAt);

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#0a0014] dark:hover:bg-white/5"
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
              <h3 className="font-helvetica truncate text-lg font-semibold text-[#5b09c4] dark:text-white">
                {meeting.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                {meeting.description ||
                  "Meeting recording and transcript processing."}
              </p>
            </div>

            {/* Status pill (right) */}
            <div className="flex shrink-0 items-center gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    onEdit(meeting);
                  }}
                  className="rounded-lg border border-gray-200 p-2 transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
                >
                  <Pencil size={14} />
                </button>
              )}

              {isProcessing ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm dark:border-white/10 dark:bg-[#0a0014] dark:text-gray-200">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                  Processing
                </span>
              ) : isLive ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-sm">
                  Live
                </span>
              ) : isScheduled ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-2 text-xs font-medium text-white shadow-sm">
                  Scheduled
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
