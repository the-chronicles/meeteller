"use client";

import { useMemo, useRef, useState } from "react";
import {
  Share2,
  Link as LinkIcon,
  FileDown,
  X,
  ArrowLeft,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { useDeleteMeeting } from "@/hooks/useDeleteMeeting";

type Meeting = {
  id: string;
  title: string;
  subtitle: string;
  meetingName: string;
  dateLabel: string;
  durationLabel: string;
  createdAt?: string;
};

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatAppleNotesDate(date: Date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}${suffix} ${month} ${year} at ${hours}:${minutes} ${ampm}`;
}

interface MeetingHeaderProps {
  meeting: Meeting;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function MeetingHeader({
  meeting,
  isPlaying,
  onPlayToggle,
}: MeetingHeaderProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<null | "pdf" | "share">(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const { mutate: deleteMeeting, isPending: deletingMeeting } =
    useDeleteMeeting();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setOpen(false);
      toast.success("Meeting link copied.");
    } catch {
      toast.error("Unable to copy the meeting link.");
    }
  };

  async function exportPDFBlob(): Promise<Blob> {
    // Install deps:
    // npm i html2canvas jspdf
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const el = document.getElementById("meeting-summary");
    if (!el) throw new Error("Meeting summary element not found");

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById("meeting-summary");
        if (clonedEl) {
          clonedEl.classList.remove(
            "dark:bg-[#282828]",
            "dark:border-white/10",
            "bg-[#282828]",
          );
          clonedEl.classList.add("bg-white", "text-gray-900");
          clonedEl.style.backgroundColor = "#ffffff";
          clonedEl.style.color = "#111827";

          const childs = clonedEl.querySelectorAll("*");
          childs.forEach((child) => {
            const h = child as HTMLElement;
            h.classList.remove(
              "dark:text-white",
              "dark:text-zinc-300",
              "dark:text-zinc-400",
              "dark:text-zinc-500",
              "dark:border-white/10",
              "text-white",
              "text-zinc-300",
              "text-zinc-400",
            );

            if (
              h.classList.contains("dark:bg-zinc-900/50") ||
              h.classList.contains("bg-zinc-900/50")
            ) {
              h.classList.remove("dark:bg-zinc-900/50", "bg-zinc-900/50");
              h.classList.add("bg-gray-50");
              h.style.backgroundColor = "#f9fafb";
            }

            if (
              !h.classList.contains("text-emerald-500") &&
              !h.classList.contains("text-green-500") &&
              !h.classList.contains("text-red-500") &&
              !h.classList.contains("bg-[#5b09c4]")
            ) {
              h.style.color = "#1f2937";
            }
          });
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 0;
    let remaining = imgHeight;

    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
      remaining -= pageHeight;

      if (remaining > 0) {
        pdf.addPage();
        y -= pageHeight;
      }
    }

    return pdf.output("blob");
  }

  const downloadPDF = async () => {
    try {
      setBusy("pdf");

      const blob = await exportPDFBlob();

      // If html2canvas produced something invalid/empty
      if (!blob || blob.size === 0) {
        throw new Error(
          "Generated PDF is empty. Check CORS/tainted canvas issues.",
        );
      }

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // Avoid replaceAll() issues on older Safari
      const safeName = (meeting.meetingName || "meeting")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]+/g, "");

      a.download = `${safeName}_summary.pdf`;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      a.remove();

      // Give the browser time to start the download before revoking
      setTimeout(() => URL.revokeObjectURL(url), 10_000);

      setOpen(false);
      toast.success("Meeting summary downloaded.");
    } catch (e) {
      console.error("PDF download failed:", e);
      toast.error("Unable to download the meeting summary.");
    } finally {
      setBusy(null);
    }
  };

  const shareNative = async () => {
    try {
      setBusy("share");

      const baseData: ShareData = {
        title: meeting.meetingName,
        text: `${meeting.meetingName} • ${meeting.dateLabel} • ${meeting.durationLabel}`,
        url: shareUrl,
      };

      // Try sharing PDF file when supported
      try {
        const blob = await exportPDFBlob();
        const file = new File([blob], "meeting-summary.pdf", {
          type: "application/pdf",
        });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ ...baseData, files: [file] });
          setOpen(false);
          toast.success("Meeting shared.");
          return;
        }
      } catch {
        // ignore pdf failure and fallback to link share
      }

      if (navigator.share) {
        await navigator.share(baseData);
        setOpen(false);
        toast.success("Meeting shared.");
      } else {
        await copyLink();
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      toast.error("Unable to share this meeting.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="w-full bg-transparent py-3">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/meetings"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Date and time like Apple Notes */}
        <div className="text-xs font-normal text-gray-400 select-none dark:text-zinc-500">
          {meeting.createdAt
            ? formatAppleNotesDate(new Date(meeting.createdAt))
            : meeting.dateLabel}
        </div>

        <div className="relative flex items-center gap-2" ref={panelRef}>
          <button
            onClick={onPlayToggle}
            className={`cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/5 ${
              isPlaying
                ? "bg-[#5b09c4]/10 text-[#5b09c4] dark:text-[#a78bfa]"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
            title={isPlaying ? "Pause Playback" : "Voice Playback"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
            title="Share"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={() => deleteMeeting(meeting.id)}
            disabled={deletingMeeting}
            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-950/30"
            title={deletingMeeting ? "Deleting..." : "Delete"}
          >
            <Trash2 size={18} />
          </button>

          {open && (
            <div className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0a0014]">
              <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                Share options
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              </div>

              <button
                onClick={shareNative}
                disabled={busy !== null}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60 dark:text-white dark:hover:bg-white/5"
              >
                <Share2 size={16} />
                {busy === "share" ? "Sharing..." : "Share (native)"}
              </button>

              <button
                onClick={copyLink}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
              >
                <LinkIcon size={16} />
                Copy link
              </button>

              <button
                onClick={downloadPDF}
                disabled={busy !== null}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60 dark:text-white dark:hover:bg-white/5"
              >
                <FileDown size={16} />
                {busy === "pdf" ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
