export default function OrbitVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      
      {/* Voice ripples */}
      <div className="absolute h-[220px] w-[220px] rounded-full border border-purple-300 animate-ripple" />
      <div className="absolute h-[220px] w-[220px] rounded-full border border-blue-300 animate-ripple delay-1000" />

      {/* Orbit rings */}
      <div className="absolute h-[380px] w-[380px] rounded-full border border-purple-200 opacity-40 animate-spin-slow" />
      <div className="absolute h-[260px] w-[260px] rounded-full border border-blue-200 opacity-50 animate-spin-reverse" />

      {/* Core speaking pulse */}
      <div className="relative flex items-center justify-center animate-float">
        <div className="absolute h-28 w-28 rounded-full bg-purple-400/20 blur-xl animate-pulse-soft" />
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg animate-pulse-soft" />
      </div>

      {/* Audio wave */}
      <svg
        className="absolute w-full opacity-30"
        viewBox="0 0 1440 120"
        fill="none"
      >
        <path
          d="M0 60 C 240 20, 480 100, 720 60 C 960 20, 1200 100, 1440 60"
          stroke="#93C5FD"
          strokeWidth="2"
        />
      </svg>

    </div>
  );
}
