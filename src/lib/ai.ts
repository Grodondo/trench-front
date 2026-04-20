import Groq from "groq-sdk";

export function isAIAvailable(): boolean {
  return !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
}

interface NarrativeParams {
  warbandName: string | null;
  playerFaction: string;
  opponentFaction: string;
  location: string;
  outcome: "VICTORY" | "DEFEAT" | "DRAW";
  keyMoments: string[];
  tone: string;
}

const SYSTEM_PROMPT = `You are a grim war correspondent embedded in the eternal trenches of Trench Crusade — an alternate history dark fantasy where the First Crusade of 1099 unleashed Hell on Earth, and the war has never ended. It is now 1914.

Write atmospheric battle dispatches in the style of WWI field reports crossed with biblical horror. Use period-appropriate language: formal, cold, haunted. Treat the supernatural as mundane fact. Be vivid but economical. Reference the hellish, divine, and deeply human aspects of this endless war.

Format: A single flowing paragraph of 3–5 sentences. No headers. No bullet points. No markdown. End with a memorable, haunting final line that lingers.`;

export async function generateAINarrative(params: NarrativeParams): Promise<string> {
  if (!isAIAvailable()) {
    throw new Error("Groq API key not configured.");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const outcomePhrase =
    params.outcome === "VICTORY"
      ? "a victory"
      : params.outcome === "DEFEAT"
      ? "a defeat"
      : "a drawn engagement with no clear victor";

  const tonePhrase =
    params.tone === "HEROIC"
      ? "heroic and triumphant — honour was upheld despite the cost"
      : params.tone === "PYRRHIC"
      ? "pyrrhic — won at catastrophic cost, leaving the victors wondering if they lost more than they gained"
      : "grim and haunted — survival feels like punishment, not reward";

  const momentsLine =
    params.keyMoments.length > 0
      ? `\nKey moments of the engagement: ${params.keyMoments.join("; ")}.`
      : "";

  const userPrompt = `Write a battle dispatch for this engagement:
- Reporting warband: ${params.warbandName ?? "Unnamed warband"} (${params.playerFaction})
- Enemy: ${params.opponentFaction}
- Theatre: ${params.location}
- Result: ${outcomePhrase}
- Tone: ${tonePhrase}${momentsLine}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 450,
    temperature: 0.88,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content?.trim()) throw new Error("Empty AI response.");
  return content.trim();
}
