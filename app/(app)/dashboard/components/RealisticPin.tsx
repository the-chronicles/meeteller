import clsx from "clsx";

export function RealisticPin({ color }: { color: string }) {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
      {/* PIN HEAD */}
      <div
        className={clsx(
          "relative h-4 w-4 rounded-full shadow-lg",
          color
        )}
      >
        {/* glossy highlight */}
        <span className="absolute left-[3px] top-[3px] h-[6px] w-[6px] rounded-full bg-white/50" />
      </div>

      {/* NEEDLE */}
      <div className="h-5 w-[2px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-sm" />
    </div>
  );
}
