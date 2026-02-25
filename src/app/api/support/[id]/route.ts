import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type UpdatePayload = {
  status?: "open" | "in progress" | "resolved";
  reply?: string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as UpdatePayload | null;

  if (!payload) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (payload.status) {
    updates.status = payload.status;
  }
  if (typeof payload.reply === "string") {
    updates.reply = payload.reply.trim();
    updates.replied_at = new Date().toISOString();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "No updates provided" }, { status: 400 });
  }

  const client = supabaseAdmin as any;
  const { error } = await client.from("support_tickets").update(updates).eq("id", id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
