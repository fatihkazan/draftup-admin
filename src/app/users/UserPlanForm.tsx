"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserPlanFormProps = {
  rowId: string;
  currentPlan: string;
};

const plans = ["freelancer", "starter", "growth", "scale"];

export function UserPlanForm({ rowId, currentPlan }: UserPlanFormProps) {
  const router = useRouter();
  const [plan, setPlan] = useState(currentPlan || "freelancer");
  const [saving, setSaving] = useState(false);

  async function savePlan() {
    setSaving(true);
    const response = await fetch(`/api/users/${rowId}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_plan: plan }),
    });
    setSaving(false);
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-100"
      >
        {plans.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={savePlan}
        disabled={saving}
        className="rounded-lg px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: "#22C55E" }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
