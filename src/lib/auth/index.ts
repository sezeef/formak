import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { _initDb, getDb } from "@/db";
import authConfig from "@/lib/auth/auth.config";
import {
  USER_ROLES,
  type UserRole,
  twoFactorConfirmationTable
} from "@/db/schema/user";
import { getUserById, transferGuestDataToExistingUser } from "@/db/query/user";
import { getTwoFactorConfirmationByUserId } from "@/db/query/two-factor-token";
import { safeGetUserOrGuest } from "@/lib/user";

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
      if (!user || !user?.id) return false;

      const db = await getDb();
      const existingUser = await getUserById(user.id);
      const loggedInUser = await safeGetUserOrGuest();
      let guest;
      if (loggedInUser && loggedInUser.role === USER_ROLES.GUEST) {
        guest = loggedInUser;
      }

      if (!existingUser) return false;

      // if guest user
      // skip email verification checks
      // skip 2 factor confirmation checks
      if (existingUser.role === USER_ROLES.GUEST) return true;

      // hardline no logins without verified email
      if (!existingUser.emailVerified) return false;

      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (!twoFactorConfirmation) return false;

      await db
        .delete(twoFactorConfirmationTable)
        .where(eq(twoFactorConfirmationTable.id, twoFactorConfirmation.id));

      if (guest) {
        await transferGuestDataToExistingUser({
          guestId: guest.id,
          userId: user.id
        });
      }

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
    async jwt({ token, user }) {
      // return early if this is not triggered by a signIn
      // or signUp event (token creation)
      // or if token.sub (userId) is not present
      if (!user || !token.sub) return token;

      // only happens on token creation to augment data on jwt
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      delete token.image;

      return token;
    }
  },
  adapter: DrizzleAdapter(_initDb()),
  session: { strategy: "jwt" },
  ...authConfig
});
