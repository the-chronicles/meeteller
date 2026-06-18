"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
// import type { Meeting, MeetingStatus } from "../page";
import { MeetingRow } from "./meeting-row";
import { toast } from "sonner";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";
import { Meeting } from "@/app/types/meeting";
import { useUpdateMeeting } from "@/hooks/useUpdateMeeting";
import api from "@/lib/api";

export function MeetingsTable({
  meetings,
  openCreate,
  setOpenCreate,
}: {
  meetings: Meeting[];
  openCreate: boolean;
  setOpenCreate: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [end, setEnd] = useState(() => {
    const d = new Date();
    d.setHours(11, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [platform, setPlatform] = useState<"google_meet" | "zoom">("google_meet");
  const [integrations, setIntegrations] = useState<{ google: boolean; zoom: boolean }>({
    google: false,
    zoom: false,
  });

  useEffect(() => {
    if (openCreate) {
      api.get("/integrations")
        .then((res) => {
          setIntegrations(res.data);
        })
        .catch(() => {
          // Gracefully ignore
        });
    }
  }, [openCreate]);

  const isGoogleMeet = platform === "google_meet";
  const isZoom = platform === "zoom";
  const isConnected = isGoogleMeet ? integrations.google : isZoom ? integrations.zoom : true;

  const { mutate: createMeeting, isPending } = useCreateMeeting();
  const { mutate: updateMeeting, isPending: isUpdating } = useUpdateMeeting();

  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const reset = () => {
    setTitle("");
    setSummary("");
    const d = new Date();
    d.setHours(10, 0, 0, 0);
    setStart(d.toISOString().slice(0, 16));
    d.setHours(11, 0, 0, 0);
    setEnd(d.toISOString().slice(0, 16));
    setPlatform("google_meet");
  };

  const closeModal = () => {
    setOpenCreate(false);
    setEditingMeeting(null);
    reset();
  };

  useEffect(() => {
    if (!editingMeeting) return;

    setTitle(editingMeeting.title);
    setSummary(editingMeeting.description || "");
  }, [editingMeeting]);

  const submit = () => {
    if (!title.trim()) {
      toast.error("Enter a meeting title.");
      return;
    }

    if (editingMeeting) {
      updateMeeting(
        {
          id: String(editingMeeting.id),
          data: {
            title: title.trim(),
            description: summary.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            setEditingMeeting(null);
            closeModal();
            reset();
          },
        },
      );
      return;
    }

    createMeeting(
      {
        title: title.trim(),
        description: summary.trim() || undefined,
        status: "scheduled",
        startedAt: new Date(start).toISOString(),
        endedAt: new Date(end).toISOString(),
        meetingType: platform,
      },
      {
        onSuccess: () => {
          closeModal();
          reset();
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-3">
        {meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/40 py-12 px-6 text-center dark:border-white/10 dark:bg-zinc-900/10">
            <div className="rounded-full bg-gray-100 p-3 text-gray-400 dark:bg-white/5 dark:text-zinc-500">
              <Plus size={24} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              No meetings found
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-xs">
              Get started by creating your first meeting manually, or record/upload audio.
            </p>
            <button
              onClick={() => setOpenCreate(true)}
              className="mt-4 font-helvetica inline-flex items-center gap-2 rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              New Meeting
            </button>
          </div>
        ) : (
          meetings.map((m) => (
            <MeetingRow
              key={m.id}
              meeting={m}
              onEdit={(meeting) => {
                setEditingMeeting(meeting);

                setOpenCreate(true);
              }}
            />
          ))
        )}
      </div>

      {/* Create modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => closeModal()}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#0a0014]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingMeeting ? "Edit meeting" : "New meeting"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a meeting record manually.
                </p>
              </div>
              <button
                onClick={() => closeModal()}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:bg-[#0a0014] dark:border-white/10 dark:text-white"
                  placeholder="e.g. Product Sync"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Summary (optional)
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:bg-[#0a0014] dark:border-white/10 dark:text-white"
                  placeholder="Short description..."
                />
              </div>

              {!editingMeeting && (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Start</label>
                      <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:bg-[#0a0014] dark:border-white/10 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">End</label>
                      <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:bg-[#0a0014] dark:border-white/10 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:bg-[#0a0014] dark:border-white/10 dark:text-white"
                    >
                      <option value="google_meet">Google Meet</option>
                      <option value="zoom">Zoom</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      A functional join link will be generated automatically.
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
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={submit}
                  disabled={isPending || isUpdating || (!editingMeeting && !isConnected)}
                  className="flex-1 rounded-lg bg-[#5b09c4] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                >
                  {editingMeeting
                    ? isUpdating
                      ? "Saving..."
                      : "Save changes"
                    : isPending
                      ? "Creating..."
                      : "Create meeting"}
                </button>
                <button
                  onClick={() => closeModal()}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
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
