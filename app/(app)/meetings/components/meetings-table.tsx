"use client";

import { useState } from "react";
import type { Meeting, MeetingStatus } from "../page";
import { MeetingRow } from "./meeting-row";

export function MeetingsTable({
  meetings,
  openCreate,
  setOpenCreate,
  onCreate,
}: {
  meetings: Meeting[];
  openCreate: boolean;
  setOpenCreate: (v: boolean) => void;
  onCreate: (m: Omit<Meeting, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startISO, setStartISO] = useState(() => {
    // default datetime-local value
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [durationMin, setDurationMin] = useState(30);
  const [status, setStatus] = useState<MeetingStatus>("processing");

  const reset = () => {
    setTitle("");
    setSummary("");
    setDurationMin(30);
    setStatus("processing");
  };

  const submit = () => {
    if (!title.trim()) return;

    // datetime-local -> ISO
    const iso = new Date(startISO).toISOString();

    onCreate({
      title: title.trim(),
      summary: summary.trim() || undefined,
      startISO: iso,
      durationMin,
      status,
    });

    setOpenCreate(false);
    reset();
  };

  return (
    <>
      <div className="space-y-3">
        {meetings.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500 dark:bg-[#0a0014] dark:text-gray-400">
            No meetings found.
          </div>
        ) : (
          meetings.map((m) => <MeetingRow key={m.id} meeting={m} />)
        )}
      </div>

      {/* Create modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpenCreate(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-[#0a0014]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">New meeting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a meeting record manually.
                </p>
              </div>
              <button
                onClick={() => setOpenCreate(false)}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  placeholder="e.g. Product Sync"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Summary (optional)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  placeholder="Short description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Start</label>
                  <input
                    type="datetime-local"
                    value={startISO}
                    onChange={(e) => setStartISO(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Duration (min)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MeetingStatus)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-[#0a0014]"
                  >
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={submit}
                  className="flex-1 rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Create meeting
                </button>
                <button
                  onClick={() => setOpenCreate(false)}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}