import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function fixColumnNames() {
  console.log("🔧 Fixing column names to match better-auth expectations...\n");

  try {
    // SQLite doesn't support ALTER COLUMN, so we need to:
    // 1. Create new table with correct column names
    // 2. Copy data
    // 3. Drop old table
    // 4. Rename new table

    console.log("1. Creating temporary table with correct column names...");
    await client.execute(`
      CREATE TABLE user_new (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER DEFAULT 0 NOT NULL,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'USER',
        is_anonymous INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    console.log("✓ Temporary table created\n");

    console.log("2. Copying data from old table to new table...");
    await client.execute(`
      INSERT INTO user_new (id, name, email, email_verified, image, role, is_anonymous, created_at, updated_at)
      SELECT
        id,
        name,
        email,
        COALESCE(emailVerified, 0) as email_verified,
        image,
        role,
        is_anonymous,
        CASE
          WHEN typeof(createdAt) = 'text' THEN strftime('%s', createdAt) * 1000
          ELSE createdAt
        END as created_at,
        COALESCE(updatedAt, strftime('%s', 'now') * 1000) as updated_at
      FROM user
    `);
    console.log("✓ Data copied\n");

    console.log("3. Dropping old table...");
    await client.execute("DROP TABLE user");
    console.log("✓ Old table dropped\n");

    console.log("4. Renaming new table...");
    await client.execute("ALTER TABLE user_new RENAME TO user");
    console.log("✓ Table renamed\n");

    console.log("✅ Column names fixed successfully!");
  } catch (error) {
    console.error("\n❌ Fix failed:", error);
    process.exit(1);
  }
}

fixColumnNames();
