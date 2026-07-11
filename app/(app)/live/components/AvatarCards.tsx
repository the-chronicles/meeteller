"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
function Card({ name, role, delay, className, avatar }: any) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`hidden sm:block absolute animate-float rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg dark:border-white/10 dark:bg-zinc-900 ${className}`}
    >
      {/* Avatar */}
      <div className="relative mb-2 h-10 w-10">
        <span className="absolute inset-0 rounded-full ring-2 ring-purple-400/40 animate-pulse-soft" />
        <img
          src={avatar}
          alt={name}
          className="rounded-full object-cover h-10 w-10"
        />
      </div>

      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-gray-500">{role}</p>
    </div>
  );
}

const SLOTS = [
  { className: "left-[20%] top-[40%] rotate-[-8deg]", delay: "0s" },
  { className: "left-[40%] top-[25%] rotate-[4deg]", delay: "1.5s" },
  { className: "left-[60%] top-[20%] -rotate-3", delay: "3s" },
  { className: "left-[80%] top-[35%] rotate-[6deg]", delay: "0.8s" },
  { className: "left-[30%] top-[55%] rotate-[-5deg]", delay: "2.2s" },
  { className: "left-[55%] top-[60%] rotate-[2deg]", delay: "1.7s" },
];

export default function AvatarCards({
  participants = [],
}: {
  participants: { name: string; role?: string }[];
}) {
  return (
    <>
      {participants.slice(0, SLOTS.length).map((member, i) => {
        const slot = SLOTS[i];
        const seed = encodeURIComponent(member.name);
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        return (
          <Card
            key={member.name}
            name={member.name}
            role={member.role || "Participant"}
            avatar={avatarUrl}
            delay={slot.delay}
            className={slot.className}
          />
        );
      })}
    </>
  );
}
