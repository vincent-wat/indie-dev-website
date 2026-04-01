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
    <div className="mx-auto flex max-w-[520px] flex-col gap-3">
      <h1 className="m-0 text-3xl font-extrabold">Playtest Bugs</h1>

      <p className="m-0 leading-relaxed text-black/80">
        {mode === "signup"
          ? "Create an account to submit and view bug reports."
          : "Log in to submit and view bug reports."}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("login")}
          className={`rounded-xl border border-black/10 px-3 py-2 font-bold ${
            mode === "login" ? "bg-black/5" : "bg-white"
          }`}
        >
          Login
        </button>

        <button
          onClick={() => setMode("signup")}
          className={`rounded-xl border border-black/10 px-3 py-2 font-bold ${
            mode === "signup" ? "bg-black/5" : "bg-white"
          }`}
        >
          Sign up
        </button>
      </div>

      <div className="grid gap-3 rounded-xl border border-black/10 p-3">
        {mode === "signup" && (
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">Display name</span>
            <input
              className="rounded-xl border border-black/10 px-3 py-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
        )}

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Email</span>
          <input
            className="rounded-xl border border-black/10 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Password</span>
          <input
            className="rounded-xl border border-black/10 px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          onClick={onSubmit}
          disabled={loading || (mode === "signup" && (displayName.trim().length < 2 || password.length < 8))}
          className="rounded-xl border border-black/10 px-3 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? mode === "signup"
              ? "Signing up..."
              : "Logging in..."
            : mode === "signup"
              ? "Create account"
              : "Login"}
        </button>

        <div className="text-xs text-black/60">
          Demo: tester@demo.com / password, staff@demo.com / password — or create your own account.
        </div>

        {error && <div className="text-sm font-semibold text-red-600">{error}</div>}
      </div>

      <a href="/forgot-password" className="text-xs text-black/70 hover:underline">
        Forgot password?
      </a>
    </div>
  );
}