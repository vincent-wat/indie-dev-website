import { DynaPuff } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Pippy Studios",
  description: "Indie game studio — projects and playtest bug reporting."
};

const dynaPuff = DynaPuff({
  weight: ["400", "700"],
  subsets: ["latin"]
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${dynaPuff.className} min-h-screen bg-white text-black`}
        style={{ fontFamily: `"DynaPuff", system-ui, -apple-system, Segoe UI, Roboto, Arial` }}
      >
        <header className="border-b border-[#eee] px-4 py-3">
          <nav className="flex items-center gap-4">
            <a href="/" className="font-bold no-underline">
              Pippy Studios
            </a>

            <div className="ml-auto flex items-center gap-10">
              <a href="/" className="no-underline hover:underline">
                Home
              </a>
              <a href="/about" className="no-underline hover:underline">
                About
              </a>
              <a href="/bugs" className="no-underline hover:underline">
                Bugs
              </a>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-[1000px] px-4 py-4">{children}</main>
      </body>
    </html>
  );
}