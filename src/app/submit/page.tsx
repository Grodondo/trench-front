import { redirect } from "next/navigation";

export default function SubmitPage() {
  redirect("/map?tab=submit");
}
