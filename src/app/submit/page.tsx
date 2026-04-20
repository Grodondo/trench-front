import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "Submit Battle — Trench Front",
  description: "Report a battle from the front. Your game shapes the war.",
};

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#c8a96e] tracking-wider mb-2">
          SUBMIT BATTLE
        </h1>
        <p className="text-[#4a3728] text-sm uppercase tracking-[0.3em]">
          Report from the Front Line
        </p>
        <p className="text-[#e8d5b0]/50 text-sm mt-3 max-w-md mx-auto">
          Submit the results of your tabletop game. Your battle will contribute to
          the global front line. Maximum 3 submissions per 24 hours.
        </p>
      </div>

      <div className="flex justify-center">
        <SubmitForm />
      </div>
    </div>
  );
}
