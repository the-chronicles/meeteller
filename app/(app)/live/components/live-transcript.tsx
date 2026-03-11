export function LiveTranscript() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-4">
        <h3 className="text-sm font-medium">Live transcript</h3>
        <p className="text-xs text-gray-500">Auto-generated</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        <p><strong>Alex:</strong> Let’s start with onboarding updates.</p>
        <p><strong>Sarah:</strong> Design handoff is ready.</p>
        <p className="italic text-gray-400">Listening…</p>
      </div>
    </div>
  );
}
