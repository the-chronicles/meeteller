"use client";

import { useState } from "react";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <section className="max-w-2xl space-y-8">
      <p className="text-sm text-gray-500">
        Control your security settings and privacy preferences.
      </p>

      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Security</h3>

        <div className="rounded-xl border bg-white divide-y">
          {/* Password */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-sm text-gray-500">
                Update your account password.
              </p>
            </div>

            <button className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
              Change
            </button>
          </div>

          {/* Two-factor auth */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account.
              </p>
            </div>

            <button
              onClick={() => setTwoFactorEnabled((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                twoFactorEnabled
                  ? "border bg-white text-gray-700 hover:bg-gray-50"
                  : "bg-black text-white hover:bg-black/90"
              }`}
            >
              {twoFactorEnabled ? "Disable" : "Enable"}
            </button>
          </div>

          {/* Active sessions */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <p className="text-sm text-gray-500">
                See devices currently logged into your account.
              </p>
            </div>

            <button className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
              View
            </button>
          </div>

          {/* Sign out all */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Sign out all devices</p>
              <p className="text-sm text-gray-500">
                Log out of all active sessions.
              </p>
            </div>

            <button className="rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Privacy</h3>

        <div className="rounded-xl border bg-white divide-y">
          {/* Data usage */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Data usage</p>
              <p className="text-sm text-gray-500">
                Learn how your data is used.
              </p>
            </div>

            <button className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
              View policy
            </button>
          </div>

          {/* Data export */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">Export data</p>
              <p className="text-sm text-gray-500">
                Download a copy of your account data.
              </p>
            </div>

            <button className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-red-600">Danger zone</h3>

        <div className="rounded-xl border border-red-200 bg-red-50">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-red-700">
                Delete account
              </p>
              <p className="text-sm text-red-600">
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
