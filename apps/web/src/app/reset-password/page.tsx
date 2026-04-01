"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ensureCsrfCookie, csrfHeader } from "@/lib/csrf";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function ResetPasswordInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => sp.get("token") ?? "", [sp]);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = token.trim().length > 0 && newPassword.length >= 8 && newPassword === confirm;

  async function submit() {
    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      await ensureCsrfCookie(API_BASE);

      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfHeader()
        },
        body: JSON.stringify({ token, newPassword })
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Reset failed. The link may be expired.");
        return;
      }

      setMsg("Password reset successful. You can now log in.");
      setNewPassword("");
      setConfirm("");

      setTimeout(() => router.push("/bugs"), 800);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[520px] flex-col gap-3">
      <h1 className="m-0 text-3xl font-extrabold">Reset password</h1>

      {!token && (
        <div className="text-sm font-semibold text-red-600">
          Missing reset token. Please use the link from your email.
        </div>
      )}

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">New password (8+ chars)</span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Confirm new password</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2"
        />
      </label>

      <button
        onClick={submit}
        disabled={loading || !canSubmit}
        className="rounded-xl border border-black/10 px-3 py-2 font-extrabold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Resetting..." : "Reset password"}
      </button>

      {msg && <div className="text-sm font-semibold text-green-700">{msg}</div>}
      {error && <div className="text-sm font-semibold text-red-600">{error}</div>}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-black/70">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}