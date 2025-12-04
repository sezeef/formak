import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function verifyDatabase() {
  console.log("🔍 Verifying database structure...\n");

  // Get all tables
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );

  console.log("📋 Tables in database:");
  tables.rows.forEach(row => {
    console.log(`  - ${row.name}`);
  });

  console.log("\n🔍 Checking better-auth tables:");

  // Check session table
  try {
    const sessionCols = await client.execute("PRAGMA table_info(session)");
    console.log("\n✅ session table exists with columns:");
    sessionCols.rows.forEach(col => console.log(`  - ${col.name} (${col.type})`));
  } catch (e) {
    console.log("❌ session table not found");
  }

  // Check account table
  try {
    const accountCols = await client.execute("PRAGMA table_info(account)");
    console.log("\n✅ account table exists with columns:");
    accountCols.rows.forEach(col => console.log(`  - ${col.name} (${col.type})`));
  } catch (e) {
    console.log("❌ account table not found");
  }

  // Check verification table
  try {
    const verificationCols = await client.execute("PRAGMA table_info(verification)");
    console.log("\n✅ verification table exists with columns:");
    verificationCols.rows.forEach(col => console.log(`  - ${col.name} (${col.type})`));
  } catch (e) {
    console.log("❌ verification table not found");
  }

  // Check user table
  try {
    const userCols = await client.execute("PRAGMA table_info(user)");
    console.log("\n✅ user table exists with columns:");
    userCols.rows.forEach(col => console.log(`  - ${col.name} (${col.type})`));
  } catch (e) {
    console.log("❌ user table not found");
  }

  console.log("\n✅ Database verification complete!");
}

verifyDatabase().catch(err => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
