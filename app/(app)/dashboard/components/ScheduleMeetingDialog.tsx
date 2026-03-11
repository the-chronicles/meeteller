"use client";

import { useState } from "react";
import { useEvents, type MeetingPlatform, type CalEvent } from "@/context/EventProvider";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function makeMeetLink(platform: MeetingPlatform) {
  if (platform === "google_meet") {
    // mock-like meet code; replace later with Google Calendar "conferenceData"
    const code = `${uid().slice(0, 3)}-${uid().slice(0, 4)}-${uid().slice(0, 3)}`;
    return `https://meet.google.com/${code}`;
  }
  // mock zoom meeting url; replace later with Zoom API
  const meetingId = String(Math.floor(1e10 + Math.random() * 9e10));
  const pwd = uid().slice(0, 8);
  return `https://zoom.us/j/${meetingId}?pwd=${pwd}`;
}

export function ScheduleMeetingDialog({
  open,
  onClose,
  defaultDateISO,
}: {
  open: boolean;
  onClose: () => void;
  defaultDateISO: string; // e.g. selected date start ISO
}) {
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(defaultDateISO.slice(0, 16)); // "YYYY-MM-DDTHH:mm"
  const [end, setEnd] = useState(defaultDateISO.slice(0, 16));
  const [platform, setPlatform] = useState<MeetingPlatform>("google_meet");

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) return;

    const joinUrl = makeMeetLink(platform);

    const e: CalEvent = {
      id: `evt_${uid()}`,
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      source: "internal",
      status: "confirmed",
      color: platform === "google_meet" ? "green" : "purple",
      isMeeting: true,
      platform,
      joinUrl,
      location: platform === "google_meet" ? "Google Meet" : "Zoom",
    };

    addEvent(e);
    onClose();
    setTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Schedule meeting</h3>
          <button onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g. Team Sync"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-gray-500">Start</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">End</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as MeetingPlatform)}
              className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="google_meet">Google Meet</option>
              <option value="zoom">Zoom</option>
            </select>
            <p className="mt-1 text-xs text-gray-400">
              A join link will be generated automatically.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={submit}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}