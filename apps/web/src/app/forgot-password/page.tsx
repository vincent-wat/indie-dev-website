"use client";

import { useState } from "react";
import { ensureCsrfCookie, csrfHeader } from "@/lib/csrf";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      await ensureCsrfCookie(API_BASE);

      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfHeader()
        },
        body: JSON.stringify({ email })
      });

      // Always show a generic success message (prevents account enumeration)
      if (!res.ok && res.status !== 400) {
        setError("Something went wrong. Try again.");
        return;
      }

      setMsg("If an account exists for that email, a reset link has been sent.");
      setEmail("");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Forgot password</h1>
      <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.6 }}>
        Enter your email and we’ll send you a password reset link.
      </p>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </label>

      <button
        onClick={submit}
        disabled={loading || email.trim().length === 0}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", fontWeight: 800 }}
      >
        {loading ? "Sending..." : "Send reset link"}
      </button>

      {msg && <div style={{ color: "#1b5e20" }}>{msg}</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </div>
  );
}