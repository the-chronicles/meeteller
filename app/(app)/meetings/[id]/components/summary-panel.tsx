"use client";

import Image from "next/image";

type Attendee = { name: string; avatar: string };

export function SummaryPanel({
  meeting,
}: {
  meeting: {
    meetingName: string;
    dateLabel: string;
    durationLabel: string;
    topic: string;
    attendees: Attendee[];
    objectives: string;
    decisions: string[];
    summary: string;
  };
}) {
  return (
    <div className="space-y-6">
      {/* Top small meta */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {meeting.meetingName} • {meeting.dateLabel} • {meeting.durationLabel}
      </div>

      {/* Overview title */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Meeting Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {meeting.summary}
        </p>
      </div>

      {/* Topic */}
      <div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Topic
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {meeting.topic}
        </p>
      </div>

      {/* Attendees */}
      <div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Attendees
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          {meeting.attendees.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src={a.avatar}
                  alt={a.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {a.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives */}
      <div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Objectives
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {meeting.objectives}
        </p>
      </div>

      {/* Decisions */}
      <div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Key Decisions
        </p>
        <ol className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {meeting.decisions.map((d, idx) => (
            <li key={d} className="flex gap-2">
              <span className="w-5 text-gray-400">{idx + 1}.</span>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}