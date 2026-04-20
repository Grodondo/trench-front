import type { Metadata } from "next";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Trench Front — Community Campaign Map",
  description:
    "A community-driven war map for Trench Crusade. Submit battles, shift the front line, generate atmospheric war dispatches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${mono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0d0805] text-[#e8d5b0] font-sans">
        {/* Navigation */}
        <nav className="border-b border-[#2e1b0e] bg-[#1a0f0a]/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-[#c8a96e] font-serif font-bold text-lg tracking-wider group-hover:text-[#d4b87a] transition-colors">
                TRENCH FRONT
              </span>
            </Link>
            <div className="flex gap-5 text-sm flex-wrap justify-end">
              <Link href="/map" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                War Map
              </Link>
              <Link href="/world-map" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                World Map
              </Link>
              <Link href="/factions" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                Factions
              </Link>
              <Link href="/submit" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                Submit Battle
              </Link>
              <Link href="/report/new" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                Report
              </Link>
              <Link href="/frontline" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                Frontline
              </Link>
              <Link href="/warbands" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                Warbands
              </Link>
              <Link href="/about" className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider">
                About
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[#2e1b0e] bg-[#1a0f0a]/50 py-4 mt-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-[#4a3728]">
            <p>
              This is an unofficial fan-made community tool. Trench Crusade is the property of its creators.
              This site is not affiliated with or endorsed by the official Trench Crusade team.
            </p>
            <p className="mt-1">
              Rules &amp; warband building:{" "}
              <a href="https://trench-companion.com" target="_blank" rel="noopener noreferrer" className="text-[#c8a96e]/50 hover:text-[#c8a96e] transition-colors">
                trench-companion.com
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
