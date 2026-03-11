"use client";

import Image from "next/image";

/* eslint-disable @typescript-eslint/no-explicit-any */
function Card({ name, role, delay, className, avatar }: any) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`absolute animate-float rounded-xl bg-white px-4 py-3 shadow-lg ${className}`}
    >
      {/* Avatar */}
      <div className="relative mb-2 h-10 w-10">
        <span className="absolute inset-0 rounded-full ring-2 ring-purple-400/40 animate-pulse-soft" />
        <Image
          src={avatar}
          alt={name}
          fill
          className="rounded-full object-cover"
        />
      </div>

      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-gray-500">{role}</p>
    </div>
  );
}

export default function AvatarCards() {
  return (
    <>
      <Card
        name="Esther Howard"
        role="Designer"
        avatar="/avatars/11.jpg"
        delay="0s"
        className="left-[28%] top-[42%] rotate-[-8deg]"
      />

      <Card
        name="Annette Black"
        role="Developer"
        avatar="/avatars/11.jpg"
        delay="1.5s"
        className="left-[48%] top-[30%] rotate-[4deg]"
      />

      <Card
        name="Arlene McCoy"
        role="Product"
        avatar="/avatars/11.jpg"
        delay="3s"
        className="left-[66%] top-[44%] -rotate-3"
      />
    </>
  );
}
