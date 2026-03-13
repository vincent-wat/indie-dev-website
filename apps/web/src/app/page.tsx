export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h1 style={{ margin: 0 }}>Pippy Studios</h1>
      <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.85 }}>
        We’re a small indie dev team building games with a focus on tight mechanics and replayability.
      </p>

      <h2 style={{ margin: "10px 0 0" }}>Games & Projects</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800 }}>Project 1 (WIP)</div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Short description of the game. Genre, core hook, and what you’re working on right now.
          </div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Status: Prototype / In Development / Playtesting
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800 }}>Project 2 (Concept)</div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Another short description. You can remove this card if you only have one project.
          </div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Status: Early concept
          </div>
        </div>
      </div>
    </div>
  );
}