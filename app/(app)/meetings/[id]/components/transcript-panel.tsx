"use client";

export function TranscriptPanel({
  transcript,
}: {
  transcript: { speaker: string; text: string }[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-[#0a0014]">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Transcript
      </h3>

      <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
        {transcript.map((t, idx) => (
          <p key={idx} className="leading-relaxed">
            <span className="font-semibold">{t.speaker}:</span> {t.text}
          </p>
        ))}
      </div>
    </div>
  );
}