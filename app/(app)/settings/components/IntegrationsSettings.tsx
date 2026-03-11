"use client";

import { useState } from "react";

import Image from "next/image";

const INTEGRATIONS = [
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Schedule and join meetings automatically.",
    icon: "/integrations/gmeet.png",
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get meeting reminders and updates in Slack.",
    icon: "/integrations/slacked.png",
    connected: true,
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Create and manage Zoom meetings.",
    icon: "/integrations/zoom.png",
    connected: false,
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Sync meetings with Microsoft Teams.",
    icon: "/integrations/teams.png",
    connected: false,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send notifications to Discord servers.",
    icon: "/integrations/discord.png",
    connected: false,
  },
];

export default function IntegrationsSettings() {
  const [apps, setApps] = useState(INTEGRATIONS);

  const toggleIntegration = (id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, connected: !app.connected } : app,
      ),
    );

    // 👉 Later:
    // if connecting → redirect to OAuth
    // if disconnecting → revoke token
  };

  return (
    <section className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Connect third-party apps and services to your account.
        </p>

        <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90">
          Add app
        </button>
      </div>

      {/* Authorized apps */}
      <div className="rounded-xl border bg-white">
        {apps.map((app, index) => (
          <div
            key={app.id}
            className={`flex items-center justify-between gap-4 px-5 py-4 ${
              index !== apps.length - 1 ? "border-b" : ""
            }`}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-medium">{app.name}</p>
                <p className="text-sm text-gray-500">{app.description}</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {app.connected && (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  Connected
                </span>
              )}

              <button
                onClick={() => toggleIntegration(app.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  app.connected
                    ? "border bg-white text-gray-700 hover:bg-gray-50"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                {app.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
