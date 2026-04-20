import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReportCard from "@/components/ReportCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = await prisma.battleReport.findUnique({ where: { slug } });
  if (!report) return { title: "Report Not Found" };

  const title = `${report.warbandName || report.playerFaction || "Unknown"} — War Dispatch`;
  const description = report.generatedNarrative?.slice(0, 160) || "A war dispatch from the Eternal Crusade.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/report/${slug}`,
      siteName: "Trench Front",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;
  const report = await prisma.battleReport.findUnique({ where: { slug } });

  if (!report) notFound();

  const keyMoments = Array.isArray(report.keyMoments)
    ? (report.keyMoments as string[])
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <p className="text-[#4a3728] text-xs uppercase tracking-[0.3em]">
          ╍╍╍ Classified War Dispatch ╍╍╍
        </p>
      </div>

      <ReportCard
        warbandName={report.warbandName}
        playerFaction={report.playerFaction}
        opponentFaction={report.opponentFaction}
        location={report.location}
        outcome={report.outcome}
        keyMoments={keyMoments}
        generatedNarrative={report.generatedNarrative}
        tone={report.tone}
      />

      <div className="text-center mt-6 space-y-3">
        <p className="text-[#4a3728] text-xs">
          Share this dispatch: <code className="text-[#c8a96e]/60">/report/{slug}</code>
        </p>
        <a
          href="/report/new"
          className="inline-block text-sm text-[#c8a96e] hover:text-[#d4b87a] transition-colors"
        >
          Generate another dispatch →
        </a>
      </div>
    </div>
  );
}
