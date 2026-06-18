"use client";

import { useEffect, useState } from "react";
import { type MeetingPlatform } from "@/context/EventProvider";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";
import { toast } from "sonner";
import api from "@/lib/api";

export function ScheduleMeetingDialog({
  open,
  onClose,
  defaultDateISO,
}: {
  open: boolean;
  onClose: () => void;
  defaultDateISO: string; // e.g. selected date start ISO
}) {
  const { mutate: createMeeting, isPending } = useCreateMeeting();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(defaultDateISO.slice(0, 16)); // "YYYY-MM-DDTHH:mm"
  const [end, setEnd] = useState(defaultDateISO.slice(0, 16));
  const [platform, setPlatform] = useState<MeetingPlatform>("google_meet");
  const [integrations, setIntegrations] = useState<{ google: boolean; zoom: boolean }>({
    google: false,
    zoom: false,
  });

  useEffect(() => {
    if (open) {
      api.get("/integrations")
        .then((res) => {
          setIntegrations(res.data);
        })
        .catch(() => {
          // Gracefully ignore
        });
    }
  }, [open]);

  if (!open) return null;

  const isGoogleMeet = platform === "google_meet";
  const isZoom = platform === "zoom";
  const isConnected = isGoogleMeet ? integrations.google : isZoom ? integrations.zoom : true;

  const submit = () => {
    if (!title.trim()) {
      toast.error("Enter a meeting title.");
      return;
    }

    createMeeting(
      {
        title: title.trim(),
        description: `Scheduled via Meeteller for ${platform === "google_meet" ? "Google Meet" : "Zoom"}`,
        status: "scheduled",
        startedAt: new Date(start).toISOString(),
        endedAt: new Date(end).toISOString(),
        meetingType: platform,
      },
      {
        onSuccess: () => {
          onClose();
          setTitle("");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-[#0b0b0b]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold dark:text-white">
            Schedule meeting
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
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
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#282828] dark:text-white dark:placeholder-gray-400"
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
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#282828] dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">End</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#282828] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as MeetingPlatform)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#282828] dark:text-white"
            >
              <option value="google_meet">Google Meet</option>
              <option value="zoom">Zoom</option>
            </select>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-400">
              A join link will be generated automatically.
            </p>

            {!isConnected && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>{isGoogleMeet ? "Google Meet" : "Zoom"}</strong> is not connected. Connect your account to automatically generate real call links.
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await api.get(`/integrations/${isGoogleMeet ? "google" : "zoom"}/auth`);
                        if (response.data?.url) {
                          window.location.href = response.data.url;
                        }
                      } catch {
                        toast.error("Failed to start connection flow.");
                      }
                    }}
                    className="ml-2 shrink-0 rounded-md bg-amber-600 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={submit}
            disabled={!isConnected || isPending}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
