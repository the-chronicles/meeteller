export default function OrbitVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Voice ripples */}
      <div className="animate-ripple absolute h-[220px] w-[220px] rounded-full border border-red-300" />
      <div className="animate-ripple absolute h-[220px] w-[220px] rounded-full border border-red-200 delay-1000" />

      {/* Orbit rings */}
      <div className="animate-spin-slow absolute h-[380px] w-[380px] rounded-full border border-red-200 opacity-40" />
      <div className="animate-spin-reverse absolute h-[260px] w-[260px] rounded-full border border-red-200 opacity-50" />

      {/* Core speaking pulse */}
      <div className="animate-float relative flex items-center justify-center">
        <div className="animate-pulse-soft absolute h-28 w-28 rounded-full bg-red-400/20 blur-xl" />
        <div className="animate-pulse-soft h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg" />
      </div>

      {/* Audio wave */}
      <svg
        className="absolute w-full opacity-30"
        viewBox="0 0 1440 120"
        fill="none"
      >
        <path
          d="M0 60 C 240 20, 480 100, 720 60 C 960 20, 1200 100, 1440 60"
          stroke="#282828"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
