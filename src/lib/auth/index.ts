import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { _initDb, getDb } from "@/db";
import authConfig from "@/lib/auth/auth.config";
import { type UserRole, twoFactorConfirmationTable } from "@/db/schema/user";
import { getUserById } from "@/db/query/user";
import { getTwoFactorConfirmationByUserId } from "@/db/query/two-factor-token";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  callbacks: {
    async signIn({ user }) {
      const db = await getDb();
      if (!user || !user?.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;
      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (!twoFactorConfirmation) return false;
      await db
        .delete(twoFactorConfirmationTable)
        .where(eq(twoFactorConfirmationTable.id, twoFactorConfirmation.id));
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.name = token?.name ? token.name : "";
        session.user.email = token?.email ? token.email : "";
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      return token;
    }
  },
  adapter: DrizzleAdapter(_initDb()),
  session: { strategy: "jwt" },
  ...authConfig
});
