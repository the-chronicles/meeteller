/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function AccountSettings() {
//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [form, setForm] = useState({
//     displayName: "",
//     fullName: "",
//     email: "",
//     phone: "",
//   });

//   const handleAvatarUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => setAvatar(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <section className="max-w-3xl space-y-10">
//       {/* Header */}
//       <div>
//         {/* <h2 className="text-xl font-semibold">Account</h2> */}
//         <p className="text-sm text-gray-500">
//           Manage your account details and linked accounts.
//         </p>
//       </div>

//       {/* Name fields */}
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <label className="mb-1 block text-sm font-medium">Display name</label>
//           <p className="mb-2 text-xs text-gray-500">Visible to other members</p>
//           <input
//             value={form.displayName}
//             onChange={(e) => setForm({ ...form, displayName: e.target.value })}
//             className="w-full rounded-md border px-3 py-2 text-sm"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium">Full name</label>
//           <p className="mb-2 text-xs text-gray-500">
//             How do you want to be called?
//           </p>
//           <input
//             value={form.fullName}
//             onChange={(e) => setForm({ ...form, fullName: e.target.value })}
//             className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       <hr />

//       {/* Contact */}
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <label className="mb-1 block text-sm font-medium">
//             Email address
//           </label>
//           <p className="mb-2 text-xs text-gray-500">
//             For notifications and logging in
//           </p>
//           <input
//             value={form.email}
//             disabled
//             className="w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-500"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium">Phone number</label>
//           <p className="mb-2 text-xs text-gray-500">
//             For receiving notifications
//           </p>
//           <input
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             className="w-full rounded-md border px-3 py-2 text-sm"
//           />
//         </div>
//       </div>

//       <hr />

//       {/* Linked accounts */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h3 className="text-sm font-medium">Linked accounts</h3>
//           <p className="text-xs text-gray-500">
//             Used to sign in and populate your profile
//           </p>
//         </div>

//         <div className="flex flex-col gap-4">
//           <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
//             <Image src="/google.png" alt="Google" width={22} height={22} />
//             <span>Connect Google</span>
//           </button>
//           <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50">
//             <Image
//               src="/microsoft.png"
//               alt="Microsoft"
//               width={22}
//               height={22}
//             />
//             <span>Connect Microsoft</span>
//           </button>
//         </div>
//       </div>

//       <hr />

//       {/* Delete */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-sm font-medium text-red-600">Delete account</h3>
//           <p className="text-xs text-gray-500">
//             By deleting your account you will lose all your data
//           </p>
//         </div>

//         <button className="text-sm font-medium text-red-600 hover:underline">
//           Delete account…
//         </button>
//       </div>

//       {/* Save */}
//       <div className="flex justify-end">
//         <button className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
//           Save changes
//         </button>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

import { updateProfile } from "@/services/user.service";

export default function AccountSettings() {
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    timezone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        timezone:
          user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await updateProfile(form);

      await refreshUser();

      toast.success("Profile updated successfully.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      {/* Header */}
      {/* <div>
        <h1 className="font-helvetica text-2xl font-semibold text-gray-900 dark:text-white">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your profile information and preferences.
        </p>
      </div> */}

      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-white/10">
              <Image
                src={user?.picture || "/default-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">
                {user?.name || "Meeteller User"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="md:ml-auto">
            <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/10">
              Change photo
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm transition outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>

            <input
              type="text"
              value={form.timezone}
              onChange={(e) =>
                setForm({
                  ...form,
                  timezone: e.target.value,
                })
              }
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm transition outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Bio</label>

            <textarea
              rows={5}
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder="Tell people about yourself..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex h-12 items-center gap-2 rounded-xl bg-[#5b09c4] px-6 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
