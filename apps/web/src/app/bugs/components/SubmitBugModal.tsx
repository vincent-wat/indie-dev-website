import styles from "../bugs.module.css";
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Submit a bug</div>
          <button onClick={onClose} className={styles.primaryBtn}>
            Close
          </button>
        </div>

        <div className={styles.modalBody}>
          <label className={styles.field}>
            <span>Title</span>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label className={styles.field}>
            <span>Description</span>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </label>

          <label className={styles.field}>
            <span>Severity</span>
            <select
              className={styles.select}
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
            disabled={loading || title.trim().length < 3 || description.trim().length < 10}
            className={styles.secondaryBtn}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}