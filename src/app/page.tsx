import { pages } from "@/lib/constants/ui";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(pages.scheduled.path);
}