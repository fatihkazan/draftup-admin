import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { TicketDetailForm } from "./TicketDetailForm";

type Ticket = {
  id: string;
  subject: string;
  description: string | null;
  email: string | null;
  status: string;
  priority: string | null;
  plan: string | null;
  reply: string | null;
  created_at: string;
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const { data } = await getSupabaseAdmin()
    .from("support_tickets")
    .select("id, subject, description, email, status, priority, plan, reply, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const ticket = data as Ticket;

  return (
    <AdminShell title="Ticket Details">
      <div className="mb-4">
        <Link className="text-sm text-zinc-400 hover:text-white" href="/support">
          ← Back to tickets
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="mb-3 text-base font-semibold text-white">{ticket.subject}</h3>
          <div className="space-y-2 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-500">Email:</span> {ticket.email || "—"}
            </p>
            <p>
              <span className="text-zinc-500">Plan:</span> {ticket.plan || "—"}
            </p>
            <p>
              <span className="text-zinc-500">Priority:</span> {ticket.priority || "normal"}
            </p>
            <p>
              <span className="text-zinc-500">Created:</span>{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200">
            {ticket.description || "No description provided."}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <TicketDetailForm
            ticketId={ticket.id}
            initialStatus={ticket.status || "open"}
            initialReply={ticket.reply || ""}
          />
        </div>
      </div>
    </AdminShell>
  );
}
