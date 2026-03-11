"use client";

import { useMemo, useRef, useState } from "react";
import { Share2, Link as LinkIcon, FileDown, X } from "lucide-react";

type Meeting = {
  id: string;
  title: string;
  subtitle: string;
  meetingName: string;
  dateLabel: string;
  durationLabel: string;
};

export function MeetingHeader({ meeting }: { meeting: Meeting }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<null | "pdf" | "share">(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setOpen(false);
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
      throw new Error("Generated PDF is empty. Check CORS/tainted canvas issues.");
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
  } catch (e) {
    console.error("PDF download failed:", e);
    // optional: show a toast/snackbar here
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
          return;
        }
      } catch {
        // ignore pdf failure and fallback to link share
      }

      if (navigator.share) {
        await navigator.share(baseData);
        setOpen(false);
      } else {
        await copyLink();
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {meeting.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {meeting.subtitle}
          </p>
        </div>

        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:bg-[#0a0014] dark:hover:bg-white/5"
          >
            <Share2 size={16} />
            Share
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg dark:bg-[#0a0014]">
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
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60 dark:hover:bg-white/5"
              >
                <Share2 size={16} />
                {busy === "share" ? "Sharing..." : "Share (native)"}
              </button>

              <button
                onClick={copyLink}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <LinkIcon size={16} />
                Copy link
              </button>

              <button
                onClick={downloadPDF}
                disabled={busy !== null}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60 dark:hover:bg-white/5"
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