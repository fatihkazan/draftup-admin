import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { UserPlanForm } from "./UserPlanForm";

type UserRow = {
  id: string;
  agency_name: string | null;
  email: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
};

export default async function UsersPage() {
  await requireAdmin();

  const { data } = await supabaseAdmin
    .from("agency_settings")
    .select("id, agency_name, email, subscription_plan, subscription_status")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as UserRow[];

  return (
    <AdminShell title="Users">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="grid grid-cols-12 border-b border-zinc-800 px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
          <div className="col-span-3">Agency</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Current Plan</div>
          <div className="col-span-2">Change Plan</div>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-12 items-center border-b border-zinc-800 px-4 py-3 text-sm text-zinc-200 last:border-b-0"
          >
            <div className="col-span-3 truncate">{user.agency_name || "—"}</div>
            <div className="col-span-3 truncate text-zinc-400">{user.email || "—"}</div>
            <div className="col-span-2 capitalize">{user.subscription_status || "inactive"}</div>
            <div className="col-span-2 capitalize">{user.subscription_plan || "freelancer"}</div>
            <div className="col-span-2">
              <UserPlanForm rowId={user.id} currentPlan={user.subscription_plan || "freelancer"} />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
