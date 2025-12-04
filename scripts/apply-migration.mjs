import { createClient } from "@libsql/client";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const migrationSQL = fs.readFileSync("migrations/0004_migrate_to_better_auth.sql", "utf8");

// Split by statement breakpoint
const statements = migrationSQL
  .split("--> statement-breakpoint")
  .map(s => s.trim())
  .filter(s => s && !s.startsWith("--"));

async function runMigration() {
  console.log("Starting migration to better-auth...\n");

  for (const statement of statements) {
    if (!statement) continue;
    const preview = statement.length > 80 ? statement.substring(0, 77) + "..." : statement;
    console.log("Executing:", preview);
    try {
      await client.execute(statement);
      console.log("✓ Success\n");
    } catch (error) {
      console.error("✗ Error:", error.message);
      // Continue on some errors (like "table already exists")
      if (!error.message.includes("already exists") && !error.message.includes("no such table")) {
        throw error;
      }
      console.log("  (continuing...)\n");
    }
  }

  console.log("\n✅ Migration completed successfully!");
  process.exit(0);
}

runMigration().catch(err => {
  console.error("\n❌ Migration failed:", err);
  process.exit(1);
});
