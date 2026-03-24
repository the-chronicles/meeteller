"use client";

import React from "react";
import Image from "next/image";

const platforms = [
  { name: "Google Meet", logo: "/integrations/gmeet.png" },
  { name: "Zoom", logo: "/integrations/zoom.png" },
  { name: "Slack", logo: "/integrations/slacked.png" },
  { name: "Google Meet", logo: "/integrations/gmeet.png" },
  { name: "Microsoft Teams", logo: "/integrations/teams.png" },
  { name: "Zoom", logo: "/integrations/zoom.png" },
  { name: "Microsoft Teams", logo: "/integrations/teams.png" },
];

function RefinedMeeting() {
  const duplicatedPlatforms = [...platforms, ...platforms];

  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">

        
        <h2 className="mb-4 font-helvetica text-center text-5xl font-semibold text-black">
          Your Meetings. <span className="text-[#5b09c4]">Clarified</span>
        </h2>

        <p className="text-[#8c8b8b] font-light max-w-2xl mx-auto text-center">
          As an <span className="font-medium text-black">individual or a team.</span> Turn
          talk into action for clear decisions and faster progress
        </p>
        </div>

        <div className="relative mt-8">
          {/* Fade edges */}
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l from-white to-transparent" />

          <div className="flex overflow-hidden">
            <div className="animate-marquee flex min-w-max items-center gap-6 py-4">
              {duplicatedPlatforms.map((platform, index) => {
                return (
                  <div
                    key={`${platform.name}-${index}`}
                    className="flex min-w-45 items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={30}
                      height={30  }
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default RefinedMeeting;
