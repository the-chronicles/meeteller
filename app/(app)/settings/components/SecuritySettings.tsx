"use client";

import { useState } from "react";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <section className="max-w-2xl space-y-8">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Control your security settings and privacy preferences.
      </p>

      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Security</h3>

        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 dark:border-white/10 dark:bg-zinc-900 dark:divide-white/10">
          {/* Password */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your account password.
              </p>
            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:bg-zinc-800 dark:border-white/10 dark:text-gray-300 dark:hover:bg-zinc-700">
              Change
            </button>
          </div>

          {/* Two-factor auth */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account.
              </p>
            </div>

            <button
              onClick={() => setTwoFactorEnabled((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                twoFactorEnabled
                  ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-zinc-800 dark:border-white/10 dark:text-gray-300 dark:hover:bg-zinc-700"
                  : "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              }`}
            >
              {twoFactorEnabled ? "Disable" : "Enable"}
            </button>
          </div>

          {/* Active sessions */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                See devices currently logged into your account.
              </p>
            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:bg-zinc-800 dark:border-white/10 dark:text-gray-300 dark:hover:bg-zinc-700">
              View
            </button>
          </div>

          {/* Sign out all */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Sign out all devices</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Log out of all active sessions.
              </p>
            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/10 dark:hover:bg-red-500/20">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Privacy</h3>

        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 dark:border-white/10 dark:bg-zinc-900 dark:divide-white/10">
          {/* Data usage */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Data usage</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Learn how your data is used.
              </p>
            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:bg-zinc-800 dark:border-white/10 dark:text-gray-300 dark:hover:bg-zinc-700">
              View policy
            </button>
          </div>

          {/* Data export */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Export data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download a copy of your account data.
              </p>
            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:bg-zinc-800 dark:border-white/10 dark:text-gray-300 dark:hover:bg-zinc-700">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-red-600">Danger zone</h3>

        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/15">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Delete account
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Permanently delete your account and all data.
              </p>
            </div>

            <button className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
