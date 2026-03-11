"use client";

import { useState } from "react";
import {
  Mail,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
  CalendarDays,
  FolderKanban,
  Link2,
  X,
  Lock,
  MessageSquareText,
  FileText,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type TeamRole = "Admin" | "Member";

type Invitation = {
  id: string;
  email: string;
  role: TeamRole;
  message?: string;
  status: "Pending";
};

const teamFeatures = [
  {
    icon: MessageSquareText,
    title: "Collaborative comments",
    description:
      "Leave comments on meeting summaries, transcripts, and tasks with your team.",
  },
  {
    icon: Users,
    title: "Meeting attendees",
    description:
      "Track attendees across meetings and keep shared context across your workspace.",
  },
  {
    icon: Users,
    title: "Team separation",
    description:
      "Organize meetings, tasks, and members under dedicated team workspaces.",
  },
  {
    icon: Link2,
    title: "Task tracker integrations",
    description:
      "Connect Zapier and other tools to sync tasks into your existing workflow.",
  },
  {
    icon: FileText,
    title: "Pre-meeting recaps",
    description:
      "Get recaps before meetings so your team shows up prepared and aligned.",
  },
  {
    icon: UserPlus,
    title: "Teammate invitations",
    description:
      "Invite teammates, assign roles, and collaborate from one shared workspace.",
  },
];

export default function TeamsPage() {
    const router = useRouter();
  const hasTeamsAccess = true;
//   const hasTeamsAccess = false;

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invites, setInvites] = useState<Invitation[]>([
    {
      id: "1",
      email: "alex@company.com",
      role: "Member",
      status: "Pending",
    },
    {
      id: "2",
      email: "maria@company.com",
      role: "Admin",
      status: "Pending",
    },
  ]);

  const handleInvite = (invite: Omit<Invitation, "id" | "status">) => {
    setInvites((prev) => [
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        status: "Pending",
        ...invite,
      },
      ...prev,
    ]);
    setInviteOpen(false);
  };

  if (!hasTeamsAccess) {
  return <LockedTeamsView onUpgrade={() => router.push("/settings?tab=billing")} />;
}

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-[#0a0014]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ShieldCheck size={14} />
                Teams enabled
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Teams
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                Manage your workspace, members, shared meetings, invitations,
                and collaboration settings from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setInviteOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5b09c4] px-4 py-3 text-sm font-medium text-white hover:opacity-90"
              >
                <Plus size={16} />
                Invite teammate
              </button>

              <button className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
                <Settings2 size={16} />
                Team settings
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Team members"
            value="8"
            helper="2 pending invites"
            icon={Users}
          />
          <StatsCard
            title="Shared meetings"
            value="42"
            helper="Across this workspace"
            icon={CalendarDays}
          />
          <StatsCard
            title="Open tasks"
            value="19"
            helper="Need follow-up"
            icon={FolderKanban}
          />
          <StatsCard
            title="Integrations"
            value="3"
            helper="Zapier, Slack, Notion"
            icon={Link2}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014] xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Members
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your team and roles
                </p>
              </div>
              <button className="text-sm font-medium text-[#5b09c4]">
                View all
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { name: "John Doe", role: "Owner", state: "Active" },
                { name: "Jane Smith", role: "Admin", state: "Active" },
                { name: "Michael Johnson", role: "Member", state: "Invited" },
              ].map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-[#5b09c4]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      member.state === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                    }`}
                  >
                    {member.state}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014] xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Shared meetings
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Meetings accessible across the workspace
                </p>
              </div>
              <button className="text-sm font-medium text-[#5b09c4]">
                Open meetings
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  title: "Weekly Product Sync",
                  meta: "12 attendees • 4 action items • Updated 2h ago",
                },
                {
                  title: "Q2 Planning Review",
                  meta: "8 attendees • 6 action items • Updated yesterday",
                },
                {
                  title: "Client Steering Committee",
                  meta: "5 attendees • 2 comments • Updated 3 days ago",
                },
              ].map((meeting) => (
                <div
                  key={meeting.title}
                  className="rounded-xl border p-4 transition hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {meeting.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {meeting.meta}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Pending invitations
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track outstanding teammate invites
                </p>
              </div>
              <Mail size={18} className="text-gray-400" />
            </div>

            <div className="mt-5 space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {invite.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {invite.role} • Pending acceptance
                    </p>
                  </div>

                  <button className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
                    Resend
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0a0014]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Integrations
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Connect your team workflow tools
                </p>
              </div>
              <Link2 size={18} className="text-gray-400" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { name: "Zapier", state: "Connected" },
                { name: "Slack", state: "Not connected" },
                { name: "Notion", state: "Connected" },
                { name: "Asana", state: "Coming soon" },
              ].map((tool) => (
                <div key={tool.name} className="rounded-xl border p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {tool.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {tool.state}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <InviteTeammateModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
      />
    </>
  );
}

function LockedTeamsView({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-[#0a0014]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
              <Lock size={14} />
              Locked on your current plan
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Unlock Teams
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Bring your team into one shared workspace for meetings, comments,
              attendees, recaps, and task integrations.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onUpgrade}
                className="rounded-xl bg-[#5b09c4] px-5 py-3 text-sm font-medium text-white hover:opacity-90"
              >
                Upgrade to Team Plan
              </button>

              <button className="rounded-xl border px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border bg-linear-to-br from-[#0a0014] to-[#5b09c4] p-6 text-white">
            <p className="text-sm font-medium text-white/80">
              Included with Teams
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-300" />
                Shared team workspace
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-300" />
                Invite and manage teammates
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-300" />
                Team-wide meeting context
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-300" />
                Recaps and integrations
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          What you get with Teams
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Designed for collaboration, visibility, and faster follow-through.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teamFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-[#0a0014]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#5b09c4] dark:bg-purple-500/15">
                <Icon size={20} />
              </div>

              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-white p-6 text-center shadow-sm dark:bg-[#0a0014]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Ready to collaborate with your team?
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Upgrade your workspace to unlock shared meetings, task syncing,
          comments, and invitations.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onUpgrade}
            className="rounded-xl bg-[#5b09c4] px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Upgrade now
          </button>
          <button className="rounded-xl border px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            Compare plans
          </button>
        </div>
      </div>
    </div>
  );
}

function InviteTeammateModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    email: string;
    role: TeamRole;
    message?: string;
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("Member");
  const [message, setMessage] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!email.trim()) return;

    onSubmit({
      email: email.trim(),
      role,
      message: message.trim() || undefined,
    });

    setEmail("");
    setRole("Member");
    setMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl dark:bg-[#0a0014]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Invite teammate
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add someone to your team workspace and assign a role.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5b09c4]/20 dark:bg-[#0a0014]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamRole)}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5b09c4]/20 dark:bg-[#0a0014]"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Personal message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Hey, join our workspace so we can collaborate on meetings and tasks."
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5b09c4]/20 dark:bg-[#0a0014]"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-xl bg-[#5b09c4] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
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