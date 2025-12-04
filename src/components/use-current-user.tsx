import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  if (!user) return;
  if (user.isAnonymous) return;
  return user;
}

export function useCurrentUserOrGuest() {
  const { data: session } = authClient.useSession();
  return session?.user;
}

// import { useSession } from "next-auth/react";
//
// export function useCurrentUser() {
//   const session = useSession();
//   const user = session.data?.user;
//   if (!user) return;
//   if (user.role === USER_ROLES.GUEST) return;
//   return user;
// }
//
// export function useCurrentUserOrGuest() {
//   const session = useSession();
//   const user = session.data?.user;
//   if (!user) return;
//   return user;
// }
