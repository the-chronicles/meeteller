"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AppearanceSettings from "./components/AppearanceSettings";
import AccountSettings from "./components/AccountSettings";
import BillingSettings from "./components/BillingSettings";
import NotificationsSettings from "./components/NotificationsSettings";
import IntegrationsSettings from "./components/IntegrationsSettings";
import TeamsSettings from "./components/TeamsSettings";
import SecuritySettings from "./components/SecuritySettings";

const SETTINGS_TABS = [
  { key: "account", label: "Account" },
  { key: "billing", label: "Billing" },
  { key: "appearance", label: "Appearance" },
  { key: "notifications", label: "Notifications" },
  { key: "integrations", label: "Integrations" },
  { key: "teams", label: "Teams" },
  { key: "security", label: "Privacy & Security" },
] as const;

type TabKey = (typeof SETTINGS_TABS)[number]["key"];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTab = (searchParams.get("tab") as TabKey) || "account";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey | null;
    if (tab && SETTINGS_TABS.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.replace(`${pathname}?tab=${tab}`);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-2">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account, billing, and application preferences.
        </p>
      </div> */}

      <div className="border-b border-gray-200 dark:border-white/10">
        <nav className="scrollbar-none flex gap-8 overflow-x-auto whitespace-nowrap">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative pb-3 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "text-black dark:text-white"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute right-0 -bottom-px left-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "billing" && <BillingSettings />}
        {activeTab === "appearance" && <AppearanceSettings />}
        {activeTab === "notifications" && <NotificationsSettings />}
        {activeTab === "integrations" && <IntegrationsSettings />}
        {activeTab === "teams" && <TeamsSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </div>
    </div>
  );
}
