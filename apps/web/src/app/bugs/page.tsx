"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "playtester" | "staff" | "admin";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: Role;
  };
};

type Bug = {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string | null;
  expectedResult: string | null;
  actualResult: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: "new" | "triaged" | "in_progress" | "fixed" | "verified" | "closed";
  reporterId: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE = "http://localhost:4000";

function loadAuth() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("pippy_auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { token: string; user: LoginResponse["user"] };
  } catch {
    return null;
  }
}

function saveAuth(token: string, user: LoginResponse["user"]) {
  localStorage.setItem("pippy_auth", JSON.stringify({ token, user }));
}

function clearAuth() {
  localStorage.removeItem("pippy_auth");
}

export default function BugsPage() {
  const [auth, setAuth] = useState<{ token: string; user: LoginResponse["user"] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("tester@demo.com");
  const [password, setPassword] = useState("password");

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Bug["severity"]>("medium");

  const isStaff = useMemo(() => auth?.user.role === "staff" || auth?.user.role === "admin", [auth]);

  useEffect(() => {
    const existing = loadAuth();
    if (existing) setAuth(existing);
  }, []);

  async function login() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        setError("Login failed. Check email/password.");
        return;
      }

      const data = (await res.json()) as LoginResponse;
      saveAuth(data.token, data.user);
      setAuth({ token: data.token, user: data.user });
    } catch {
      setError("Network error while logging in.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBugs(token: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/playtest/bugs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
    if (auth?.token) fetchBugs(auth.token);
  }, [auth?.token]);

  async function submitBug() {
    if (!auth?.token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/playtest/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ title, description, severity })
      });

      if (!res.ok) {
        setError("Failed to submit bug. Make sure title/description are long enough.");
        return;
      }

      setTitle("");
      setDescription("");
      setSeverity("medium");
      setShowModal(false);
      await fetchBugs(auth.token);
    } catch {
      setError("Network error while submitting bug.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bugId: string, status: Bug["status"]) {
    if (!auth?.token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/playtest/bugs/${bugId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        setError("Failed to update status (staff/admin only).");
        return;
      }

      await fetchBugs(auth.token);
    } catch {
      setError("Network error while updating status.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuth();
    setAuth(null);
    setBugs([]);
    setError(null);
  }

  if (!auth) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Playtest Bugs</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Log in to submit and view bug reports.
        </p>

        <div style={{ display: "grid", gap: 10, border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }} />
          </label>

          <button
            onClick={login}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", fontWeight: 700 }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Demo: tester@demo.com / password, staff@demo.com / password
          </div>

          {error && <div style={{ color: "crimson" }}>{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Playtest Bugs</h1>
          <div style={{ opacity: 0.75 }}>
            Logged in as <strong>{auth.user.displayName}</strong> ({auth.user.role})
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", fontWeight: 700 }}
          >
            Submit a bug
          </button>
          <button
            onClick={() => fetchBugs(auth.token)}
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Refresh
          </button>
          <button
            onClick={logout}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: isStaff ? "2fr 3fr 1fr 1fr" : "2fr 3fr 1fr", gap: 0, padding: 12, background: "#fafafa", fontWeight: 700 }}>
          <div>Title</div>
          <div>Description</div>
          <div>Status</div>
          {isStaff && <div>Severity</div>}
        </div>

        {bugs.length === 0 ? (
          <div style={{ padding: 12, opacity: 0.75 }}>No bug reports yet.</div>
        ) : (
          bugs.map((b) => (
            <div key={b.id} style={{ display: "grid", gridTemplateColumns: isStaff ? "2fr 3fr 1fr 1fr" : "2fr 3fr 1fr", padding: 12, borderTop: "1px solid #eee", gap: 12 }}>
              <div style={{ fontWeight: 700 }}>{b.title}</div>
              <div style={{ opacity: 0.85, lineHeight: 1.4 }}>{b.description}</div>

              <div>
                {isStaff ? (
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value as Bug["status"])}
                    style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
                  >
                    <option value="new">new</option>
                    <option value="triaged">triaged</option>
                    <option value="in_progress">in_progress</option>
                    <option value="fixed">fixed</option>
                    <option value="verified">verified</option>
                    <option value="closed">closed</option>
                  </select>
                ) : (
                  <span>{b.status}</span>
                )}
              </div>

              {isStaff && <div>{b.severity}</div>}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: "white", width: "100%", maxWidth: 520, borderRadius: 14, padding: 14, border: "1px solid #eee" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Submit a bug</div>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
              >
                Close
              </button>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span>Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", resize: "vertical" }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Severity</span>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Bug["severity"])}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="critical">critical</option>
                </select>
              </label>

              <button
                onClick={submitBug}
                disabled={loading || title.trim().length < 3 || description.trim().length < 10}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", fontWeight: 800 }}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}