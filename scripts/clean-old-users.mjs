import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function cleanOldUsers() {
  console.log("🧹 Cleaning old users...\n");

  // Delete old users (those without account entries and not anonymous)
  const result = await client.execute(`
    DELETE FROM user
    WHERE id IN (
      SELECT u.id
      FROM user u
      LEFT JOIN account a ON u.id = a.user_id
      WHERE a.id IS NULL
      AND (u.is_anonymous IS NULL OR u.is_anonymous = 0)
    )
  `);

  console.log(`✅ Deleted ${result.rowsAffected} old users\n`);

  // Show remaining users
  const users = await client.execute("SELECT id, name, email, is_anonymous FROM user");
  console.log(`📋 Remaining users (${users.rows.length}):`);
  users.rows.forEach(user => {
    const type = user.is_anonymous ? "[ANONYMOUS]" : "[REGISTERED]";
    console.log(`  ${type} ${user.email} (${user.name})`);
  });
}

cleanOldUsers();
