export function ListeningIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600" />
      </span>

      <span className="text-gray-700 dark:text-gray-300">
        Listening…
      </span>
    </div>
  );
}
