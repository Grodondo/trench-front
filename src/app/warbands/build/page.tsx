import type { Metadata } from "next";
import WarbandBuilder from "@/components/WarbandBuilder";

export const metadata: Metadata = {
  title: "Build a Warband — Trench Front",
  description: "Build and save your Trench Crusade warband. Choose your faction, muster your units, and equip them for war.",
};

export default function BuildWarbandPage() {
  return <WarbandBuilder />;
}
