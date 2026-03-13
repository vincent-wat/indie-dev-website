export default function AboutPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h1 style={{ margin: 0 }}>About</h1>

      <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.85 }}>
        Pippy Studios is a 2-person indie dev team based in LA. We handle design, engineering, and production
        end-to-end, with a focus on shipping polished games.
      </p>

      <h2 style={{ margin: "10px 0 0" }}>Team</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800 }}>Developer 1</div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Role/focus: gameplay, systems, tools, etc.
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800 }}>Developer 2</div>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Role/focus: art, design, UI, production, etc.
          </div>
        </div>
      </div>
    </div>
  );
}