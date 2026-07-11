import { useMeetingTranscript } from "@/hooks/useMeetings";
import { useEffect, useRef } from "react";

export function LiveTranscript({ meetingId }: { meetingId?: number }) {
  const { data: transcriptData, isLoading } = useMeetingTranscript(
    meetingId?.toString() || "",
    meetingId ? 2000 : undefined
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const segments = transcriptData?.segments || [];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [segments.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-4 dark:border-white/10">
        <h3 className="text-sm font-medium">Live transcript</h3>
        <p className="text-xs text-gray-500">Auto-generated</p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm scroll-smooth"
      >
        {meetingId ? (
          isLoading && segments.length === 0 ? (
            <p className="text-xs text-gray-400">Loading transcript...</p>
          ) : segments.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Waiting for transcription to begin...</p>
          ) : (
            segments.map((seg: any) => (
              <p key={seg.id || seg.createdAt}>
                <strong>{seg.speaker || "Speaker"}:</strong> {seg.text}
              </p>
            ))
          )
        ) : (
          <>
            <p><strong>Alex:</strong> Let’s start with onboarding updates.</p>
            <p><strong>Sarah:</strong> Design handoff is ready.</p>
          </>
        )}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-500" />
          <span className="text-xs italic text-gray-400">Listening…</span>
        </div>
      </div>
    </div>
  );
}
