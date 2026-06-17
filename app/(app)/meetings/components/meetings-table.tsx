"use client";

import { useEffect, useState } from "react";
// import type { Meeting, MeetingStatus } from "../page";
import { MeetingRow } from "./meeting-row";
import { toast } from "sonner";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";
import { Meeting } from "@/app/types/meeting";
import { useUpdateMeeting } from "@/hooks/useUpdateMeeting";

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

  const { mutate: createMeeting, isPending } = useCreateMeeting();
  const { mutate: updateMeeting, isPending: isUpdating } = useUpdateMeeting();

  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const reset = () => {
    setTitle("");
    setSummary("");
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
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-[#0a0014] dark:text-gray-400">
            No meetings found.
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

              <div className="flex gap-2 pt-2">
                <button
                  onClick={submit}
                  disabled={isPending || isUpdating}
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
