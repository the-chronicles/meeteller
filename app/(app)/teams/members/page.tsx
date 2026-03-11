"use client";

import { MoreHorizontal, Plus, Search, ShieldCheck, UserCog, Users } from "lucide-react";
import { useState } from "react";

type MemberRole = "Owner" | "Admin" | "Member";
type MemberStatus = "Active" | "Invited";

type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
};

const initialMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "Owner",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@company.com",
    role: "Member",
    status: "Invited",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@company.com",
    role: "Member",
    status: "Active",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamMembersPage() {
  const [query, setQuery] = useState("");
  const [members] = useState<Member[]>(initialMembers);

  const filteredMembers = members.filter((member) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    return (
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top hero */}
      <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-[#0a0014]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-300">
              <ShieldCheck size={14} />
              Team members
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Members
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Manage who has access to your team workspace, review roles, and
              keep track of invited and active collaborators.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-[#5b09c4] px-4 py-3 text-sm font-medium text-white hover:opacity-90">
            <Plus size={16} />
            Invite teammate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <MemberStatCard
          icon={Users}
          title="Total members"
          value="8"
          helper="Across your team workspace"
        />
        <MemberStatCard
          icon={UserCog}
          title="Admins"
          value="2"
          helper="Can manage members and settings"
        />
        <MemberStatCard
          icon={ShieldCheck}
          title="Pending invites"
          value="2"
          helper="Waiting for acceptance"
        />
      </div>

      {/* Search + table */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014]">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Team directory
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Search members and review their roles and access.
            </p>
          </div>

          <div className="relative w-full md:w-[320px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full rounded-xl border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black/10 dark:bg-[#0a0014]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-180">
            <div className="grid grid-cols-12 border-b px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <div className="col-span-5">Member</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Access</div>
              <div className="col-span-1" />
            </div>

            <div className="divide-y">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-12 items-center px-4 py-4 text-sm"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-[#5b09c4] dark:bg-purple-500/15">
                      {initials(member.name)}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      {member.role}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>

                  <div className="col-span-2 text-gray-500 dark:text-gray-400">
                    {member.role === "Owner"
                      ? "Full access"
                      : member.role === "Admin"
                        ? "Manage workspace"
                        : "Collaborate"}
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No members found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberStatCard({
  title,
  value,
  helper,
  icon: Icon,
}: {
  title: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#5b09c4] dark:bg-purple-500/15">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}