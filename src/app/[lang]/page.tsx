import { redirect } from "next/navigation";
import { safeGetUser } from "@/lib/user";

export default async function HomePage() {
  const user = await safeGetUser();
  user ? redirect("/dashboard") : redirect("/auth/login");
}
