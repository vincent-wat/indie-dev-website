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
    <div className="mx-auto flex max-w-[520px] flex-col gap-3">
      <h1 className="m-0 text-3xl font-extrabold">Forgot password</h1>

      <p className="m-0 leading-relaxed text-black/80">
        Enter your email and we’ll send you a password reset link.
      </p>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2"
        />
      </label>

      <button
        onClick={submit}
        disabled={loading || email.trim().length === 0}
        className="rounded-xl border border-black/10 px-3 py-2 font-extrabold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send reset link"}
      </button>

      {msg && <div className="text-sm font-semibold text-green-700">{msg}</div>}
      {error && <div className="text-sm font-semibold text-red-600">{error}</div>}
    </div>
  );
}