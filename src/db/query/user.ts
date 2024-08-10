"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { USER_ROLES, userTable } from "@/db/schema/user";
import { formTable } from "@/db/schema/form";

export async function createUser({
  name,
  email,
  password
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const db = await getDb();
    return await db.insert(userTable).values({
      name,
      email,
      password
    });
  } catch (error) {
    console.error("Failed to create user: ", error);
  }
}

export async function createGuestUser() {
  try {
    const db = await getDb();
    const guestId = crypto.randomUUID();
    const password = await bcrypt.hash(guestId, 10);
    return await db
      .insert(userTable)
      .values({
        id: guestId,
        name: `guest-${guestId}`,
        email: `${guestId}@guest.com`,
        password,
        role: USER_ROLES.GUEST
      })
      .returning()
      .then((res) => res[0]);
  } catch (error) {
    console.error("Failed to create guest user: ", error);
  }
}

// Not needed for current flow because we make
// new user login after registering anyway
//
// export async function elevateGuestToUser({
//   id,
//   name,
//   email,
//   password
// }: {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// }) {
//   try {
//     const db = await getDb();
//     return await db
//       .update(userTable)
//       .set({
//         name,
//         email,
//         password,
//         role: USER_ROLES.USER
//       })
//       .where(eq(userTable.id, id));
//   } catch (error) {
//     console.error("Failed to elevate guest user: ", error);
//   }
// }

export async function transferGuestDataToExistingUser({
  guestId,
  userId
}: {
  guestId: string;
  userId: string;
}) {
  try {
    const db = await getDb();
    return await db
      .update(formTable)
      .set({
        userId
      })
      .where(eq(formTable.userId, guestId));
  } catch (error) {
    console.error("Failed to transfer guest data to user: ", error);
  }
}

export async function updateUserPasswordById({
  id,
  password
}: {
  id: string;
  password: string;
}) {
  try {
    const db = await getDb();
    return await db
      .update(userTable)
      .set({ password })
      .where(eq(userTable.id, id));
  } catch (error) {
    console.error("Failed to update user: ", error);
  }
}

export async function updateUserVerifiedById({
  id,
  email
}: {
  id: string;
  email: string;
}) {
  try {
    const db = await getDb();
    return await db
      .update(userTable)
      .set({ email, emailVerified: new Date() })
      .where(eq(userTable.id, id));
  } catch (error) {
    console.error("Failed to update user: ", error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch user: ", error);
  }
}

export async function getUserById(id: string) {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .then((res) => res?.[0]);
  } catch (error) {
    console.error("Failed to fetch user: ", error);
  }
}
