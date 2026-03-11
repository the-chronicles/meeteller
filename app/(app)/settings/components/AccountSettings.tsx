"use client";

import { useState } from "react";
import Image from "next/image";

export default function AccountSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section className="max-w-3xl space-y-10">
      {/* Header */}
      <div>
        {/* <h2 className="text-xl font-semibold">Account</h2> */}
        <p className="text-sm text-gray-500">
          Manage your account details and linked accounts.
        </p>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Display name</label>
          <p className="mb-2 text-xs text-gray-500">Visible to other members</p>
          <input
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <p className="mb-2 text-xs text-gray-500">
            How do you want to be called?
          </p>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <hr />

      {/* Contact */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email address
          </label>
          <p className="mb-2 text-xs text-gray-500">
            For notifications and logging in
          </p>
          <input
            value={form.email}
            disabled
            className="w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone number</label>
          <p className="mb-2 text-xs text-gray-500">
            For receiving notifications
          </p>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <hr />

      {/* Linked accounts */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium">Linked accounts</h3>
          <p className="text-xs text-gray-500">
            Used to sign in and populate your profile
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button className="rounded-md flex items-center gap-2 border px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
            <Image src="/google.png" alt="Google" width={22} height={22} />
            <span>Connect Google</span>
          </button>
          <button className="rounded-md border flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
            <Image src="/microsoft.png" alt="Microsoft" width={22} height={22} />
            <span>Connect Microsoft</span>
          </button>
        </div>
      </div>

      <hr />

      {/* Delete */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-red-600">Delete account</h3>
          <p className="text-xs text-gray-500">
            By deleting your account you will lose all your data
          </p>
        </div>

        <button className="text-sm font-medium text-red-600 hover:underline">
          Delete account…
        </button>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Save changes
        </button>
      </div>
    </section>
  );
}
