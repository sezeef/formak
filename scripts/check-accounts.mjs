import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function checkAccounts() {
  console.log("🔍 Checking users and accounts...\n");

  const users = await client.execute("SELECT id, name, email, email_verified, is_anonymous FROM user");
  console.log("📋 Users:");
  users.rows.forEach(user => {
    console.log(`  - ${user.email} (${user.name}) - ID: ${user.id}`);
    console.log(`    Verified: ${user.email_verified}, Anonymous: ${user.is_anonymous}`);
  });

  console.log("\n📋 Accounts:");
  const accounts = await client.execute("SELECT id, user_id, provider_id, account_id FROM account");
  if (accounts.rows.length === 0) {
    console.log("  ⚠️  No accounts found!");
  } else {
    accounts.rows.forEach(account => {
      console.log(`  - User ID: ${account.user_id}`);
      console.log(`    Provider: ${account.provider_id}, Account ID: ${account.account_id}`);
    });
  }
}

checkAccounts();
