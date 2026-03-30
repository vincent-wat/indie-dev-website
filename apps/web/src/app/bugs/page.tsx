"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./bugs.module.css";

import type { Bug, AuthResponse } from "./types";
import AuthPanel from "./components/AuthPanel";
import BugTable from "./components/BugTable";
import SubmitBugModal from "./components/SubmitBugModal";
import FiltersBar from "./components/FiltersBar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

export default function BugsPage() {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("New Tester");
  const [email, setEmail] = useState("tester@demo.com");
  const [password, setPassword] = useState("password");

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Bug["severity"]>("medium");

  const [statusFilter, setStatusFilter] = useState<Bug["status"] | "">("");
  const [severityFilter, setSeverityFilter] = useState<Bug["severity"] | "">("");

  const [sessionMsg, setSessionMsg] = useState<string | null>(null);

  const isStaff = useMemo(() => user?.role === "staff" || user?.role === "admin", [user]);

  async function logout(message?: string) {
    const csrf = getCookie("pippy_csrf") ?? "";
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": csrf }
      });
    } catch {
      // ignore
    }

    setUser(null);
    setBugs([]);
    setError(null);
    setSessionMsg(message ?? null);
  }

  useEffect(() => {
  (async () => {
    try {
      await fetch(`${API_BASE}/auth/csrf`, { credentials: "include" });
    } catch {
      // ignore
    }

      try {
       const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
       if (!res.ok) return;
       const data = (await res.json()) as AuthResponse;
       setUser(data.user);
     } catch {
       // ignore
     }
    })();
  }, []);

  async function authSubmit() {
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const body = mode === "signup" ? { email, password, displayName } : { email, password };
      const csrf = getCookie("pippy_csrf") ?? "";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "X-CSRF-Token": csrf
        },
        credentials: "include",
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        if (mode === "signup" && res.status === 409) setError("That email is already in use.");
        else if (mode === "signup") setError("Signup failed. Check inputs (password must be 8+ chars).");
        else setError("Login failed. Check email/password.");
        return;
      }

      const data = (await res.json()) as AuthResponse;
      setUser(data.user);
      setSessionMsg(null);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBugs() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (severityFilter) params.set("severity", severityFilter);

    const url = `${API_BASE}/playtest/bugs${params.toString() ? `?${params.toString()}` : ""}`;

    try {
      const res = await fetch(url, { credentials: "include" });

      if (res.status === 401) {
        await logout("Session expired. Please log in again.");
        return;
      }

      if (!res.ok) {
        setError("Failed to fetch bug reports.");
        return;
      }

      const data = (await res.json()) as Bug[];
      setBugs(data);
    } catch {
      setError("Network error while fetching bug reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) fetchBugs();
  }, [user, statusFilter, severityFilter]);

  async function submitBug() {
    const csrf = getCookie("pippy_csrf") ?? "";
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/playtest/bugs`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf 
        },
        body: JSON.stringify({ title, description, severity })
      });

      if (res.status === 401) {
        await logout("Session expired. Please log in again.");
        return;
      }

      if (!res.ok) {
        setError("Failed to submit bug. Make sure title/description are long enough.");
        return;
      }

      setTitle("");
      setDescription("");
      setSeverity("medium");
      setShowModal(false);
      await fetchBugs();
    } catch {
      setError("Network error while submitting bug.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bugId: string, status: Bug["status"]) {
    const csrf = getCookie("pippy_auth") ?? "";
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/playtest/bugs/${bugId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json", 
          "X-CSRF-Token": csrf
        },
        body: JSON.stringify({ status })
      });

      if (res.status === 401) {
        await logout("Session expired. Please log in again.");
        return;
      }

      if (!res.ok) {
        setError("Failed to update status (staff/admin only).");
        return;
      }

      await fetchBugs();
    } catch {
      setError("Network error while updating status.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className={`${styles.page} ${styles.centered}`}>
        <AuthPanel
          mode={mode}
          setMode={setMode}
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          onSubmit={authSubmit}
        />

        {sessionMsg && (
          <div className={styles.smallNote} style={{ marginTop: 12, textAlign: "center" }}>
            {sessionMsg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.h1}>Playtest Bugs</h1>
          <div className={styles.smallNote}>
            Logged in as <span className={styles.bold}>{user.displayName}</span> ({user.role})
          </div>
        </div>

        <div className={styles.rightActions}>
          <button onClick={() => setShowModal(true)} className={styles.secondaryBtn}>
            Submit a bug
          </button>
          <button onClick={() => fetchBugs()} disabled={loading} className={styles.primaryBtn}>
            Refresh
          </button>
          <button onClick={() => logout()} className={styles.primaryBtn}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <FiltersBar
        status={statusFilter}
        setStatus={setStatusFilter}
        severity={severityFilter}
        setSeverity={setSeverityFilter}
        loading={loading}
        onClear={() => {
          setStatusFilter("");
          setSeverityFilter("");
        }}
        onRefresh={() => fetchBugs()}
      />

      <BugTable bugs={bugs} isStaff={!!isStaff} onUpdateStatus={updateStatus} />

      <SubmitBugModal
        open={showModal}
        loading={loading}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        severity={severity}
        setSeverity={setSeverity}
        onClose={() => setShowModal(false)}
        onSubmit={submitBug}
      />
    </div>
  );
}