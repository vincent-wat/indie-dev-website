import type { Bug } from "../types";

type Props = {
  open: boolean;
  loading: boolean;

  title: string;
  setTitle: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  severity: Bug["severity"];
  setSeverity: (v: Bug["severity"]) => void;

  onClose: () => void;
  onSubmit: () => void;
};

export default function SubmitBugModal({
  open,
  loading,
  title,
  setTitle,
  description,
  setDescription,
  severity,
  setSeverity,
  onClose,
  onSubmit
}: Props) {
  if (!open) return null;

  const disabled = loading || title.trim().length < 3 || description.trim().length < 10;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/35 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl border border-black/10 bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-extrabold">Submit a bug</div>
          <button
            onClick={onClose}
            className="rounded-xl border border-black/10 px-3 py-2 font-bold"
          >
            Close
          </button>
        </div>

        <div className="mt-3 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">Title</span>
            <input
              className="rounded-xl border border-black/10 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              className="resize-y rounded-xl border border-black/10 px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">Severity</span>
            <select
              className="rounded-xl border border-black/10 px-3 py-2 text-sm"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Bug["severity"])}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
          </label>

          <button
            onClick={onSubmit}
            disabled={disabled}
            className="rounded-xl border border-black/10 px-3 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}