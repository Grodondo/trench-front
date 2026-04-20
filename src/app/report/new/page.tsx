import ReportForm from "@/components/ReportForm";

export const metadata = {
  title: "Battle Report Generator — Trench Front",
  description: "Generate a cinematic war dispatch from your Trench Crusade battle.",
};

export default function NewReportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          WAR DISPATCH GENERATOR
        </h1>
        <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em]">
          Compose Your Battle Report
        </p>
        <p className="text-[#e8d5b0]/50 text-sm mt-3 max-w-md mx-auto">
          Enter the details of your battle and receive an atmospheric war dispatch
          suitable for sharing. The report will be generated as a shareable page.
        </p>
      </div>

      <div className="flex justify-center">
        <ReportForm />
      </div>
    </div>
  );
}
