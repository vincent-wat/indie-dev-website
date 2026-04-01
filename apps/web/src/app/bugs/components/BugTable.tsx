import type { Bug } from "../types";

type Props = {
  bugs: Bug[];
  isStaff: boolean;
  onUpdateStatus: (bugId: string, status: Bug["status"]) => void;
};

export default function BugTable({ bugs, isStaff, onUpdateStatus }: Props) {
  const gridCols = isStaff ? "grid-cols-[2fr_3fr_1fr_1fr]" : "grid-cols-[2fr_3fr_1fr]";

  return (
    <div className="overflow-hidden rounded-xl border border-black/10">
      <div className={`grid ${gridCols} gap-3 bg-black/5 p-3 font-bold`}>
        <div>Title</div>
        <div>Description</div>
        <div>Status</div>
        {isStaff && <div>Severity</div>}
      </div>

      {bugs.length === 0 ? (
        <div className="p-3 text-xs text-black/60">No bug reports yet.</div>
      ) : (
        bugs.map((b) => (
          <div key={b.id} className={`grid ${gridCols} gap-3 border-t border-black/10 p-3`}>
            <div className="font-extrabold">{b.title}</div>
            <div className="leading-relaxed text-black/80">{b.description}</div>

            <div>
              {isStaff ? (
                <select
                  className="rounded-xl border border-black/10 px-3 py-2 text-sm"
                  value={b.status}
                  onChange={(e) => onUpdateStatus(b.id, e.target.value as Bug["status"])}
                >
                  <option value="new">new</option>
                  <option value="closed">closed</option>
                </select>
              ) : (
                <span className="text-sm text-black/70">{b.status}</span>
              )}
            </div>

            {isStaff && <div className="text-sm text-black/70">{b.severity}</div>}
          </div>
        ))
      )}
    </div>
  );
}