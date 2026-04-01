import type { Bug } from "../types";

type Props = {
  status: Bug["status"] | "";
  setStatus: (v: Bug["status"] | "") => void;

  severity: Bug["severity"] | "";
  setSeverity: (v: Bug["severity"] | "") => void;

  onClear: () => void;
  onRefresh: () => void;
  loading: boolean;
};

export default function FiltersBar({
  status,
  setStatus,
  severity,
  setSeverity,
  onClear,
  onRefresh,
  loading
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-xs font-semibold text-black/70">Filters:</div>

      <select
        className="rounded-xl border border-black/10 px-3 py-2 text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value as Props["status"])}
      >
        <option value="">status: all</option>
        <option value="new">new</option>
        <option value="closed">closed</option>
      </select>

      <select
        className="rounded-xl border border-black/10 px-3 py-2 text-sm"
        value={severity}
        onChange={(e) => setSeverity(e.target.value as Props["severity"])}
      >
        <option value="">severity: all</option>
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
        <option value="critical">critical</option>
      </select>

      <button
        onClick={onClear}
        className="btn-primary"
      >
        Clear
      </button>

    </div>
  );
}