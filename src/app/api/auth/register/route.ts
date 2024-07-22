import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { USER_ROLES, userTable } from "@/db/schema/user";
import { RegisterSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    // preparing & validating data
    const data = await req.json();
    const validatedFields = RegisterSchema.safeParse(data);
    if (validatedFields.error) {
      throw new Error(validatedFields.error.message);
    }
    const { name, email, password } = validatedFields.data;
    const hashedPassword = await hash(password, 10);

    // inserting user into db
    await db.insert(userTable).values({
      name,
      email,
      password: hashedPassword,
      role: USER_ROLES.USER
    });

    return NextResponse.json({
      message: `Registration Success: User \"${name}/${email}\" has been registered`
    });
  } catch (e: any) {
    console.error(`Registration Error: ${e.message}`);
    return NextResponse.json({
      message: "Registration Failure: failed to register user"
    });
  }
}
