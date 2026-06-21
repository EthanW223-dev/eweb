import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Layers,
  LayoutGrid,
  ListTodo,
  Monitor,
  PanelLeft,
  Plus,
  RotateCw,
  Share2,
  Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";

const STATS = [
  { label: "RELEASED", value: "62", sub: "Posts indexed" },
  { label: "BREADTH", value: "12", sub: "Subject groups" },
  { label: "REMAINING", value: "412", sub: "Ready to draft" },
  { label: "MAX REACH", value: "3,156,200", sub: "Searches a month" },
];

const RECENT = [
  "Best mobility aids for seniors",
  "How to childproof a staircase",
  "Signs a parent needs in-home care",
];

const SUBJECTS = [
  { name: "Elder Care", posts: 28, reach: "1.2M" },
  { name: "Mobility", posts: 19, reach: "840K" },
  { name: "Home Safety", posts: 15, reach: "1.1M" },
];

const INBOX = [
  { q: "What is the safest walk-in tub for elderly?", vol: "18,100", diff: "Low", status: "Drafting" },
  { q: "Do grab bars need to go into studs?", vol: "9,900", diff: "Low", status: "Ready" },
  { q: "When should a senior stop living alone?", vol: "33,200", diff: "Medium", status: "Drafting" },
  { q: "Best fall detection devices 2026", vol: "27,400", diff: "Medium", status: "Ready" },
  { q: "How much does in-home care cost?", vol: "60,500", diff: "High", status: "Drafting" },
];

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Compass;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
        active ? "bg-white/[0.06] text-white/85" : "text-white/60"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-t-2xl bg-[#1a1a1c] text-left shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-[#242427] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2">
          <PanelLeft className="h-3.5 w-3.5 text-white/40" />
          <ChevronLeft className="h-3.5 w-3.5 text-white/40" />
          <ChevronRight className="h-3.5 w-3.5 text-white/25" />
        </div>
        <div className="mx-2 flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#1a1a1c] px-6 py-1 text-[10px] text-white/60">
          <Monitor className="h-3 w-3" />
          questly.ai
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCw className="h-3.5 w-3.5 text-white/40" />
          <Share2 className="h-3.5 w-3.5 text-white/40" />
          <Plus className="h-3.5 w-3.5 text-white/40" />
          <Copy className="h-3.5 w-3.5 text-white/40" />
        </div>
      </div>

      {/* Body: sidebar + main */}
      <CareNestBody />
    </div>
  );
}

export function CareNestBody() {
  return (
    <div className="flex h-full bg-[#1a1a1c]">
        {/* Sidebar */}
        <aside className="w-[22%] border-r border-white/5 bg-[#1e1e21] px-3 py-3.5">
          <div className="mb-4 flex items-center justify-between">
            <Logo className="h-4 w-4 text-white/70" />
            <LayoutGrid className="h-3.5 w-3.5 text-white/30" />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-[#e8553f] text-[9px] font-semibold text-white">
              C
            </div>
            <span className="text-[10px] text-white/80">CareNest</span>
          </div>

          <div className="space-y-0.5">
            <NavItem icon={Compass} label="Uncover" active />
            <NavItem icon={Layers} label="Subjects" />
            <NavItem icon={ListTodo} label="Inbox" />
          </div>

          <div className="mt-5 px-2 text-[8px] font-medium uppercase tracking-wider text-white/30">
            Recent articles
          </div>
          <div className="mt-2 space-y-2">
            {RECENT.map((r) => (
              <div key={r} className="flex items-start gap-1.5 px-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#28c840]/70" />
                <span className="text-[9px] leading-tight text-white/55">{r}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-5 py-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8553f] text-sm font-semibold text-white">
                C
              </div>
              <div>
                <div className="text-sm font-medium text-white">CareNest</div>
                <div className="text-[10px] text-white/45">Aging-in-place resources</div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-gray-900">
              <Sparkles className="h-3.5 w-3.5" />
              Generate
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5">
            {STATS.map((s) => (
              <div key={s.label} className="px-3.5 py-3">
                <div className="text-[8px] font-medium uppercase tracking-wider text-white/35">
                  {s.label}
                </div>
                <div className="mt-1 text-xl font-medium text-white">{s.value}</div>
                <div className="mt-0.5 text-[9px] text-white/40">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Subject cards */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {SUBJECTS.map((sub) => (
              <div
                key={sub.name}
                className="rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/5"
              >
                <div className="text-[11px] font-medium text-white">{sub.name}</div>
                <div className="mt-2 flex items-center justify-between text-[9px] text-white/45">
                  <span>{sub.posts} posts</span>
                  <span>{sub.reach}/mo</span>
                </div>
              </div>
            ))}
          </div>

          {/* Drafting inbox */}
          <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-white/5">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3.5 py-2 text-[8px] font-medium uppercase tracking-wider text-white/35">
              <span className="flex-1">Question</span>
              <span className="w-16 text-right">Volume</span>
              <span className="w-16 text-right">Difficulty</span>
              <span className="w-16 text-right">Status</span>
            </div>
            {INBOX.map((row) => (
              <div
                key={row.q}
                className="flex items-center border-b border-white/5 px-3.5 py-2.5 text-[10px] last:border-b-0"
              >
                <span className="flex-1 truncate pr-2 text-white/70">{row.q}</span>
                <span className="w-16 text-right text-white/50">{row.vol}</span>
                <span className="w-16 text-right text-white/50">{row.diff}</span>
                <span
                  className={`w-16 text-right ${
                    row.status === "Drafting" ? "text-[#febc2e]/80" : "text-[#28c840]/80"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </main>
    </div>
  );
}
