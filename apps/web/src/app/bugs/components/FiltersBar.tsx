import styles from "../bugs.module.css";
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
    <div className={styles.filtersRow}>
      <div className={styles.filtersLabel}>Filters:</div>

      <select
        className={styles.select}
        value={status}
        onChange={(e) => setStatus(e.target.value as Props["status"])}
      >
        <option value="">status: all</option>
        <option value="new">new</option>
        <option value="triaged">triaged</option>
        <option value="in_progress">in_progress</option>
        <option value="fixed">fixed</option>
        <option value="verified">verified</option>
        <option value="closed">closed</option>
      </select>

      <select
        className={styles.select}
        value={severity}
        onChange={(e) => setSeverity(e.target.value as Props["severity"])}
      >
        <option value="">severity: all</option>
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
        <option value="critical">critical</option>
      </select>

      <button onClick={onClear} className={styles.primaryBtn} disabled={loading && false}>
        Clear
      </button>

      <div className={styles.spacer} />
    </div>
  );
}