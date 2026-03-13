import styles from "../bugs.module.css";
import type { Bug } from "../types";

type Props = {
  bugs: Bug[];
  isStaff: boolean;
  onUpdateStatus: (bugId: string, status: Bug["status"]) => void;
};

export default function BugTable({ bugs, isStaff, onUpdateStatus }: Props) {
  return (
    <div className={styles.table}>
      <div className={`${styles.tableHead} ${isStaff ? styles.grid4 : styles.grid3}`}>
        <div>Title</div>
        <div>Description</div>
        <div>Status</div>
        {isStaff && <div>Severity</div>}
      </div>

      {bugs.length === 0 ? (
        <div className={styles.smallNote} style={{ padding: 12 }}>
          No bug reports yet.
        </div>
      ) : (
        bugs.map((b) => (
          <div key={b.id} className={`${styles.tableRow} ${isStaff ? styles.grid4 : styles.grid3}`}>
            <div className={styles.bold}>{b.title}</div>
            <div className={styles.desc}>{b.description}</div>

            <div>
              {isStaff ? (
                <select
                  className={styles.select}
                  value={b.status}
                  onChange={(e) => onUpdateStatus(b.id, e.target.value as Bug["status"])}
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
  );
}