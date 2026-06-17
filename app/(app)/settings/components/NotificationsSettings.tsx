"use client";

import { useState } from "react";

export default function NotificationsSettings() {
  const [notifications, setNotifications] = useState({
    emailProduct: true,
    emailBilling: true,
    emailSecurity: true,
    inAppMentions: true,
    inAppUpdates: false,
    inAppAnnouncements: true,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section className="max-w-2xl space-y-8">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Control how and when you get notifications.
      </p>

      {/* Email Notifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email notifications</h3>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          <ToggleRow
            label="Product updates"
            description="New features, improvements, and updates."
            enabled={notifications.emailProduct}
            onToggle={() => toggle("emailProduct")}
          />
          <ToggleRow
            label="Billing & payments"
            description="Invoices, receipts, and billing alerts."
            enabled={notifications.emailBilling}
            onToggle={() => toggle("emailBilling")}
          />
          <ToggleRow
            label="Security alerts"
            description="Login alerts and important security notices."
            enabled={notifications.emailSecurity}
            onToggle={() => toggle("emailSecurity")}
            border={false}
          />
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">In-app notifications</h3>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          {/* <ToggleRow
            label="Mentions & replies"
            description="When someone mentions or replies to you."
            enabled={notifications.inAppMentions}
            onToggle={() => toggle("inAppMentions")}
          /> */}
          <ToggleRow
            label="System updates"
            description="Important changes affecting your workspace."
            enabled={notifications.inAppUpdates}
            onToggle={() => toggle("inAppUpdates")}
          />
          <ToggleRow
            label="Announcements"
            description="News and product announcements."
            enabled={notifications.inAppAnnouncements}
            onToggle={() => toggle("inAppAnnouncements")}
            border={false}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------
   Toggle Row Component
--------------------------------- */

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  border = true,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  border?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 ${
        border ? "border-b border-gray-100 dark:border-white/10" : ""
      }`}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={enabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? "bg-[#5b09c4]" : "bg-gray-200 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
