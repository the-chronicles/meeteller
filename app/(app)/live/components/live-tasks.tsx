export function LiveTasks() {
  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-[#0a0014]">
      <h3 className="text-sm font-medium mb-3">Action Items</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Finalize Q3 budget</span>
          <span className="text-purple-600">High</span>
        </div>

        <div className="flex justify-between">
          <span>Compliance review</span>
          <span className="text-blue-600">Medium</span>
        </div>
      </div>
    </div>
  );
}
