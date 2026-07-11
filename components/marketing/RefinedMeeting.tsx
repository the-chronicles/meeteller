"use client";

import React from "react";
import Lottie from "lottie-react";
import tetsAnimation from "@/public/illustrations/Tets.json";
import notesAnimation from "@/public/illustrations/meeteller_notes_arrive.json";
import soundAnimation from "@/public/illustrations/Audio&Voice-A-002.json";
import summary from "@/public/illustrations/sum.json";

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
    <section className="overflow-hidden bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <div className="mb-3 text-sm tracking-[0.5] text-white uppercase"></div>
          {/* <h2 className="font-helvetica mb-4 text-center text-5xl font-semibold text-black">
            Your Meetings. <span className="text-[#5b09c4]">Clarified</span>
          </h2> */}

          <p className="mx-auto max-w-2xl text-center font-light text-[#8c8b8b]">
            The average meeting does not end when everyone leaves. It continues
            with questions like, &quot;What did we agree on?&quot; and &quot;Who
            is doing what?&quot; left unanswered. There should be a simpler way.{" "}
            {/* <span className="font-medium text-black">
              individual or a team.
            </span>{" "}
            Turn talk into action for clear decisions and faster progress */}
          </p>
        </div>
        <div className="mt-14 text-center">
          <div className="mb-3 text-sm tracking-[0.5] text-white uppercase">
            [ solution ]
          </div>
          <h2 className="font-helvetica text-center text-xl font-semibold text-white">
            Leave with clarity. Not more work.
          </h2>

          <p className="mx-auto max-w-2xl text-center font-light text-[#8c8b8b]">
            When the meeting is over, the work should be ready to move
            forward—not start all over again.
            {/* <span className="font-medium text-black">
              individual or a team.
            </span>{" "}
            Turn talk into action for clear decisions and faster progress */}
          </p>
        </div>

        {/* <div className="relative mt-8">
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
                      height={30}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}

        <div className="grid px-4 py-10 md:grid-cols-3">
          {[
            {
              label: "Crystal-Clear Summaries",
              subtitle: " Skip the 60-minute replay. Read the 5mins version.",
              animation: summary,
            },
            {
              label: "Action Items, Assigned",
              subtitle:
                "Who’s doing what, by when. Pulled straight from the conversation.",
              animation: soundAnimation,
            },
            {
              label: "Searchable Memory",
              subtitle:
                "“What did we decide about pricing?” Find it in seconds.",
              animation: soundAnimation,
            },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center border border-white/10 p-6 text-center"
            >
              <div className="mb-5 flex h-96 w-full items-center justify-center overflow-hidden">
                <Lottie
                  animationData={feature.animation}
                  loop={true}
                  className="h-full w-full"
                />
              </div>
              <p className="text-base font-semibold text-white">
                {feature.label}
              </p>
              <p className="text-sm font-light text-white">
                {feature.subtitle}
              </p>
            </div>
          ))}
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
