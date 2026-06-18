"use client";

import { useMemo, useRef, useState } from "react";
import { Share2, Link as LinkIcon, FileDown, X, ArrowLeft, Trash2, Play } from "lucide-react";
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
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

function formatAppleNotesDate(date: Date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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

export function MeetingHeader({ meeting }: { meeting: Meeting }) {
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
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Date and time like Apple Notes */}
        <div className="text-xs font-normal text-gray-400 dark:text-zinc-500 select-none">
          {meeting.createdAt ? formatAppleNotesDate(new Date(meeting.createdAt)) : meeting.dateLabel}
        </div>

        <div className="relative flex items-center gap-2" ref={panelRef}>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Playback"
          >
            <Play size={18} />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Share"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={() => deleteMeeting(meeting.id)}
            disabled={deletingMeeting}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 disabled:opacity-60 transition-colors"
            title={deletingMeeting ? "Deleting..." : "Delete"}
          >
            <Trash2 size={18} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0a0014]">
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
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60 dark:hover:bg-white/5 dark:text-white"
              >
                <Share2 size={16} />
                {busy === "share" ? "Sharing..." : "Share (native)"}
              </button>

              <button
                onClick={copyLink}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white"
              >
                <LinkIcon size={16} />
                Copy link
              </button>

              <button
                onClick={downloadPDF}
                disabled={busy !== null}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60 dark:hover:bg-white/5 dark:text-white"
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
