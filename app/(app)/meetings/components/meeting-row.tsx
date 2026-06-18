"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";
import { Meeting } from "@/app/types/meeting";

function formatAppleNotesDay(d: Date) {
  const today = new Date();
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const diffTime = target.getTime() - current.getTime();
  const diffDays = Math.round(diffTime / 86400000);

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === -1) {
    return "Yesterday";
  }
  if (diffDays === 1) {
    return "Tomorrow";
  }

  if (diffDays < 0 && diffDays > -7) {
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }

  const dateStr = d.toLocaleDateString("en-GB"); // "DD/MM/YYYY"

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;

  return `${dateStr}`;
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
      className="group block rounded-2xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#282828] dark:hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="font-helvetica truncate text-lg font-semibold text-black transition-colors group-hover:text-black dark:text-white dark:group-hover:text-zinc-200">
            {meeting.title}
          </h3>

          <p className="mt-0.5 text-xs font-normal text-gray-400 dark:text-zinc-500">
            {formatAppleNotesDay(start)}
          </p>

          <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {meeting.description ||
              "Meeting recording and transcript processing."}
          </p>

          {isScheduled && meeting.externalMeetingUrl && (
            <a
              href={meeting.externalMeetingUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="mt-2 inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Join {meeting.meetingType === "zoom" ? "Zoom Call" : "Google Meet"} →
            </a>
          )}
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
    </Link>
  );
}
