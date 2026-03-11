export default function MeetingControls() {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full bg-white px-6 py-3 shadow-lg animate-rise-in">
      <button className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200">
        🎤
      </button>
      <button className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200">
        🎧
      </button>
      <button className="h-10 w-10 rounded-full bg-red-500 text-white hover:bg-red-600">
        ⏹
      </button>
    </div>
  );
}
