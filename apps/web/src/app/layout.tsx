export const metadata = {
  title: "Pippy Studios",
  description: "Indie game studio — projects and playtest bug reporting."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        <header style={{ borderBottom: "1px solid #eee", padding: "12px 16px" }}>
          <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="/" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>
              Pippy Studios
            </a>
            <a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a>
            <a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a>
            <a href="/bugs" style={{ textDecoration: "none", color: "inherit" }}>Bugs</a>
          </nav>
        </header>

        <main style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}