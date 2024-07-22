import { DefaultSession } from "next-auth";
import { type UserRole } from "@/db/schema/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}
