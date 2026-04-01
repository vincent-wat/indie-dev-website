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

  const canSubmit =
    token.trim().length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirm;

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
    <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Reset password</h1>

      {!token && (
        <div style={{ color: "crimson" }}>
          Missing reset token. Please use the link from your email.
        </div>
      )}

      <label style={{ display: "grid", gap: 6 }}>
        <span>New password (8+ chars)</span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Confirm new password</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </label>

      <button
        onClick={submit}
        disabled={loading || !canSubmit}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", fontWeight: 800 }}
      >
        {loading ? "Resetting..." : "Reset password"}
      </button>

      {msg && <div style={{ color: "#1b5e20" }}>{msg}</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}