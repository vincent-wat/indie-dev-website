import styles from "../bugs.module.css";

type Mode = "login" | "signup";

type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;

  displayName: string;
  setDisplayName: (v: string) => void;

  email: string;
  setEmail: (v: string) => void;

  password: string;
  setPassword: (v: string) => void;

  loading: boolean;
  error: string | null;

  onSubmit: () => void;
};

export default function AuthPanel({
  mode,
  setMode,
  displayName,
  setDisplayName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onSubmit
}: Props) {
  return (
    <div className={`${styles.page} ${styles.centered}`}>
      <h1 className={styles.h1}>Playtest Bugs</h1>
      <p className={styles.muted}>
        {mode === "signup"
          ? "Create an account to submit and view bug reports."
          : "Log in to submit and view bug reports."}
      </p>

      <div className={styles.toggleRow}>
        <button
          onClick={() => setMode("login")}
          className={`${styles.toggleBtn} ${mode === "login" ? styles.toggleBtnActive : ""}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`${styles.toggleBtn} ${mode === "signup" ? styles.toggleBtnActive : ""}`}
        >
          Sign up
        </button>
      </div>

      <div className={styles.card}>
        {mode === "signup" && (
          <label className={styles.field}>
            <span>Display name</span>
            <input
              className={styles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
        )}

        <label className={styles.field}>
          <span>Email</span>
          <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>Password</span>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          onClick={onSubmit}
          disabled={loading || (mode === "signup" && (displayName.trim().length < 2 || password.length < 8))}
          className={styles.secondaryBtn}
        >
          {loading
            ? mode === "signup"
              ? "Signing up..."
              : "Logging in..."
            : mode === "signup"
              ? "Create account"
              : "Login"}
        </button>

        <div className={styles.smallNote}>
          Demo: tester@demo.com / password, staff@demo.com / password — or create your own account.
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}