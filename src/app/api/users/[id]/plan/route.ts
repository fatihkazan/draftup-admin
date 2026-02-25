import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type PlanPayload = {
  subscription_plan?: string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as PlanPayload | null;
  const plan = body?.subscription_plan?.trim();

  if (!plan) {
    return NextResponse.json({ success: false, error: "Plan is required" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("agency_settings")
    .update({ subscription_plan: plan })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
