import Link from "next/link";

export const metadata = {
  title: "About — Trench Front",
  description: "About the Trench Front community campaign map and battle report system.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          ABOUT TRENCH FRONT
        </h1>
        <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em]">
          What Is This?
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-[#e8d5b0]/80 text-sm leading-relaxed">
        <section className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6">
          <h2 className="text-xl font-serif text-[#c8a96e] mb-3">The Concept</h2>
          <p>
            Trench Front is a community-driven campaign map for{" "}
            <strong className="text-[#c8a96e]">Trench Crusade</strong>, the dark fantasy
            skirmish game by Mike Franchina and Architects of War.
          </p>
          <p className="mt-2">
            Players submit the results of their real tabletop games. Those results collectively shift a
            shared front line — turning isolated home games into part of a global narrative. The front
            updates daily as battles are tallied across 20 named sectors.
          </p>
        </section>

        <section className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6">
          <h2 className="text-xl font-serif text-[#c8a96e] mb-3">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-[#e8d5b0]/70">
            <li>Play a game of Trench Crusade with your regular group.</li>
            <li>
              Go to the{" "}
              <Link href="/submit" className="text-[#c8a96e] hover:underline">
                Submit Battle
              </Link>{" "}
              page and enter your result.
            </li>
            <li>Your result is added to the sector&apos;s tally. Faithful vs. Infernal.</li>
            <li>When one side accumulates enough net victories, the sector changes hands.</li>
            <li>
              Check the{" "}
              <Link href="/map" className="text-[#c8a96e] hover:underline">
                War Map
              </Link>{" "}
              to see how the front has shifted.
            </li>
          </ol>
        </section>

        <section className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6">
          <h2 className="text-xl font-serif text-[#c8a96e] mb-3">Battle Report Generator</h2>
          <p>
            The{" "}
            <Link href="/report/new" className="text-[#c8a96e] hover:underline">
              War Dispatch Generator
            </Link>{" "}
            creates a cinematic, atmospheric report from your battle details. Share
            the unique URL on Discord, Reddit, or social media. Each report gets its own
            page with OG meta tags for rich previews.
          </p>
        </section>

        <section className="bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg p-6">
          <h2 className="text-xl font-serif text-[#c8a96e] mb-3">Rules &amp; Warband Building</h2>
          <p>
            For rules, warband building, and the full game compendium, visit{" "}
            <a
              href="https://trench-companion.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c8a96e] hover:underline"
            >
              Trench Companion
            </a>
            . Trench Front is a complementary community tool, not a replacement for the
            excellent tools that already exist.
          </p>
        </section>

        <section className="bg-[#2e1b0e]/30 border border-[#4a3728] rounded-lg p-6">
          <h2 className="text-xl font-serif text-[#c8a96e] mb-3">Disclaimer</h2>
          <p className="text-[#e8d5b0]/60 text-xs">
            This is an unofficial fan-made community tool. Trench Crusade is the property of
            Mike Franchina and Architects of War. This site is not affiliated with or endorsed
            by the official Trench Crusade team. No copyrighted rules text is reproduced here.
            All user-submitted content is the responsibility of its submitters.
          </p>
        </section>
      </div>
    </div>
  );
}
