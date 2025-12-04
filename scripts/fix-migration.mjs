import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function fixMigration() {
  console.log("🔧 Fixing migration issues...\n");

  // 1. Drop and recreate session table
  console.log("1. Recreating session table...");
  try {
    await client.execute("DROP TABLE IF EXISTS session");
    await client.execute(`
      CREATE TABLE session (
        id TEXT PRIMARY KEY NOT NULL,
        expires_at INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        user_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
      )
    `);
    console.log("✓ Session table recreated\n");
  } catch (error) {
    console.error("✗ Error:", error.message, "\n");
  }

  // 2. Drop password-reset-token table
  console.log("2. Dropping password-reset-token table...");
  try {
    await client.execute("DROP TABLE IF EXISTS `password-reset-token`");
    console.log("✓ password-reset-token table dropped\n");
  } catch (error) {
    console.error("✗ Error:", error.message, "\n");
  }

  // 3. Add isAnonymous column to user table if it doesn't exist
  console.log("3. Adding isAnonymous column to user table...");
  try {
    // Check if column exists
    const userInfo = await client.execute("PRAGMA table_info(user)");
    const hasIsAnonymous = userInfo.rows.some(col => col.name === "isAnonymous" || col.name === "is_anonymous");

    if (!hasIsAnonymous) {
      await client.execute("ALTER TABLE user ADD COLUMN is_anonymous INTEGER");
      console.log("✓ isAnonymous column added\n");
    } else {
      console.log("✓ isAnonymous column already exists\n");
    }
  } catch (error) {
    console.error("✗ Error:", error.message, "\n");
  }

  console.log("✅ Migration fixes applied!");
}

fixMigration().catch(err => {
  console.error("\n❌ Fix failed:", err);
  process.exit(1);
});
