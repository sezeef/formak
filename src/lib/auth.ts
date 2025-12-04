import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { getDb } from "@/db";

const db = await getDb();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [anonymous()],
});
