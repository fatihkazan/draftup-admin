"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TicketDetailFormProps = {
  ticketId: string;
  initialStatus: string;
  initialReply: string;
};

export function TicketDetailForm({
  ticketId,
  initialStatus,
  initialReply,
}: TicketDetailFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || "open");
  const [reply, setReply] = useState(initialReply || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    setSuccess("");

    const response = await fetch(`/api/support/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reply }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || "Failed to save ticket.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess("Ticket updated.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white"
        >
          <option value="open">open</option>
          <option value="in progress">in progress</option>
          <option value="resolved">resolved</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400">Reply</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white"
          placeholder="Write a reply for the user..."
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-300">{success}</p>}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#22C55E" }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
