import type { Metadata } from "next";
import WorldMapClient from "@/components/WorldMap";

export const metadata: Metadata = {
  title: "World Map — Trench Front",
  description:
    "Explore the official Trench Crusade world map. Discover the kingdoms, demon domains, and contested territories of the eternal war.",
};

export default function WorldMapPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#c8a96e]/50 mb-3">
          Terra Incognita
        </p>
        <h1 className="font-serif text-4xl font-black text-[#c8a96e] mb-4">
          The Lands of the Great Powers
        </h1>
        <p className="text-[#e8d5b0]/60 max-w-2xl mx-auto leading-relaxed">
          <em>…who hold back the foetid dark.</em> Eight centuries of war have reshaped the world.
          Explore the territories of the Faithful kingdoms and the spreading stain of Infernal corruption.
        </p>
      </div>

      <WorldMapClient />

      {/* Attribution */}
      <p className="mt-8 text-center text-xs text-[#c8a96e]/30 font-mono">
        Official world map artwork © Trench Crusade. This is a community tool — not affiliated with or endorsed by the game&apos;s creators.
      </p>
    </main>
  );
}
