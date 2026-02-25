import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  email?: string | null;
  plan?: string | null;
  created_at: string;
};

function badgeClasses(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "in progress" || normalized === "in_progress") {
    return "border-blue-500/30 bg-blue-500/20 text-blue-300";
  }
  if (normalized === "resolved") {
    return "border-emerald-500/30 bg-emerald-500/20 text-emerald-300";
  }
  return "border-amber-500/30 bg-amber-500/20 text-amber-300";
}

export default async function SupportPage() {
  await requireAdmin();

  const { data } = await getSupabaseAdmin()
    .from("support_tickets")
    .select("id, subject, status, email, plan, created_at")
    .order("created_at", { ascending: false });

  const tickets = (data ?? []) as Ticket[];

  return (
    <AdminShell title="Support Tickets">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="grid grid-cols-12 border-b border-zinc-800 px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
          <div className="col-span-4">Subject</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">View</div>
        </div>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="grid grid-cols-12 items-center border-b border-zinc-800 px-4 py-3 text-sm text-zinc-200 last:border-b-0"
          >
            <div className="col-span-4 truncate">{ticket.subject}</div>
            <div className="col-span-3 truncate text-zinc-400">{ticket.email || "—"}</div>
            <div className="col-span-2 capitalize text-zinc-300">{ticket.plan || "—"}</div>
            <div className="col-span-2">
              <span className={`rounded-md border px-2 py-1 text-xs capitalize ${badgeClasses(ticket.status || "open")}`}>
                {ticket.status || "open"}
              </span>
            </div>
            <div className="col-span-1 text-right">
              <Link className="text-[#22C55E] hover:underline" href={`/support/${ticket.id}`}>
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
