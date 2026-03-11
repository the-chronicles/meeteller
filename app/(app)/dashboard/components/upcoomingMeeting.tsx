"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { generateDays } from "@/lib/date";
import { useEvents } from "@/context/EventProvider";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { useRouter } from "next/navigation";

export default function UpcomingMeetings() {
  const router = useRouter();

  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const days = generateDays(7);

  const meetingsForDay = events
    .filter((e) => e.isMeeting)
    .filter((e) => isSameDay(parseISO(e.start), selectedDate))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const defaultISO = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(10, 0, 0, 0);
    return d.toISOString();
  }, [selectedDate]);

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm text-white"
        >
          + Add New
        </button>
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        {days.map((day) => {
          const active = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`flex w-14 flex-col items-center rounded-lg px-3 py-2 text-sm transition ${active ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <span className="text-xs">{format(day, "EEE")}</span>
              <span className="font-semibold">{format(day, "dd")}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {meetingsForDay.length === 0 && (
          <p className="text-sm text-gray-500">No meetings scheduled.</p>
        )}

        {meetingsForDay.map((m) => (
          <button
            key={m.id}
            onClick={() => router.push(`/calendar?eventId=${m.id}`)}
            className="w-full text-left"
            type="button"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 text-sm text-gray-500">
                {format(parseISO(m.start), "HH:mm")}
              </div>

              <div className="relative">
                <span className="block h-3 w-3 rounded-full bg-emerald-500" />
              </div>

              <div className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm">
                <p className="font-medium">{m.title}</p>

                <p className="text-xs text-gray-500">
                  {format(parseISO(m.start), "HH:mm")} –{" "}
                  {format(parseISO(m.end), "HH:mm")}
                  {m.platform
                    ? ` · ${m.platform === "google_meet" ? "Google Meet" : "Zoom"}`
                    : ""}
                </p>

                {m.joinUrl && (
                  <a
                    href={m.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 inline-block text-xs text-emerald-600 hover:underline"
                  >
                    Join link
                  </a>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <ScheduleMeetingDialog
        open={open}
        onClose={() => setOpen(false)}
        defaultDateISO={defaultISO}
      />
    </div>
  );
}
