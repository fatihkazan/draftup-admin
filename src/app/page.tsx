import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type PlanCountRow = {
  subscription_plan: string | null;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function Home() {
  await requireAdmin();

  const [usersRes, planRes] = await Promise.all([
    getSupabaseAdmin().from("agency_settings").select("id", { count: "exact", head: true }),
    getSupabaseAdmin().from("agency_settings").select("subscription_plan").eq("subscription_status", "active"),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const activePlans = (planRes.data ?? []) as PlanCountRow[];

  const planCounts = activePlans.reduce<Record<string, number>>((acc, row) => {
    const plan = row.subscription_plan || "freelancer";
    acc[plan] = (acc[plan] ?? 0) + 1;
    return acc;
  }, {});

  const prices: Record<string, number> = {
    freelancer: 19,
    starter: 49,
    growth: 99,
    scale: 199,
  };
  const mrr = Object.entries(planCounts).reduce(
    (sum, [plan, count]) => sum + (prices[plan] ?? 0) * count,
    0
  );

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Total Users</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalUsers}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-400">MRR</p>
          <p className="mt-2 text-3xl font-semibold text-white">{formatMoney(mrr)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Active Subscriptions</p>
          <p className="mt-2 text-3xl font-semibold text-white">{activePlans.length}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h3 className="mb-3 text-sm font-semibold text-white">Active Subscriptions by Plan</h3>
        <div className="grid gap-3 md:grid-cols-4">
          {["freelancer", "starter", "growth", "scale"].map((plan) => (
            <div key={plan} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs uppercase tracking-wide text-zinc-400">{plan}</p>
              <p className="mt-1 text-xl font-semibold text-[#22C55E]">{planCounts[plan] ?? 0}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
