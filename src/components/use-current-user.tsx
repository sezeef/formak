import { useSession } from "next-auth/react";
import { USER_ROLES } from "@/db/schema/user";

export function useCurrentUser() {
  const session = useSession();
  const user = session.data?.user;
  if (!user) return;
  if (user.role === USER_ROLES.GUEST) return;
  return user;
}

export function useCurrentUserOrGuest() {
  const session = useSession();
  const user = session.data?.user;
  if (!user) return;
  return user;
}
