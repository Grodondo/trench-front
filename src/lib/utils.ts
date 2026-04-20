import { createHash } from "crypto";

export function hashIP(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "default-salt";
  return createHash("sha256").update(ip + salt).digest("hex");
}

export function sanitizeText(text: string, maxLength: number): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s.,!?'"-]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  const week = Math.ceil(((diff / oneWeek) + start.getDay() + 1) / 7);
  return now.getFullYear() * 100 + week;
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export function formatCrusadeDate(): string {
  const baseYear = 1099;
  const now = new Date();
  const crusadeYear = baseYear + (now.getFullYear() - 2024) + 815;
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return `Anno Domini ${crusadeYear}, Day ${dayOfYear} of the Eternal Crusade`;
}
