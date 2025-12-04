import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function migrateOldUsers() {
  console.log("🔧 Migrating old users to better-auth...\n");

  // Get users without accounts (excluding anonymous users)
  const usersWithoutAccounts = await client.execute(`
    SELECT u.id, u.email, u.name
    FROM user u
    LEFT JOIN account a ON u.id = a.user_id
    WHERE a.id IS NULL
    AND (u.is_anonymous IS NULL OR u.is_anonymous = 0)
    AND u.email NOT LIKE '%@guest%'
  `);

  if (usersWithoutAccounts.rows.length === 0) {
    console.log("✅ No users need migration\n");
    return;
  }

  console.log(`Found ${usersWithoutAccounts.rows.length} users to migrate:\n`);

  for (const user of usersWithoutAccounts.rows) {
    console.log(`Migrating: ${user.email} (${user.name})`);

    // Create account entry - NOTE: password is NULL, users will need to reset
    const accountId = crypto.randomUUID();
    await client.execute({
      sql: `
        INSERT INTO account (
          id,
          user_id,
          provider_id,
          account_id,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        accountId,
        user.id,
        'credential',
        user.id,
        Date.now(),
        Date.now()
      ]
    });

    console.log(`  ✓ Account created (ID: ${accountId})`);
  }

  console.log("\n⚠️  IMPORTANT: Old users have account entries but NO passwords.");
  console.log("They will need to:");
  console.log("1. Use 'Forgot Password' to set a new password, OR");
  console.log("2. Re-register with the same email (better-auth will link accounts)\n");
}

migrateOldUsers();
