import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { AppError, ERROR_CODES, isErrorWithCode } from "@/lib/error";

let client: ReturnType<typeof createClient> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function createDbClient() {
  return createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });
}

export function _initDb() {
  if (!client) client = createDbClient();
  if (!db) db = drizzle(client);
  return db;
}

async function testConnection(retries = 3, delay = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await client!.execute("SELECT 1");
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1)
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
}

export async function getDb() {
  try {
    _initDb();

    const isConnected = await testConnection();

    if (isConnected) {
      return db!;
    } else {
      throw new Error("Failed to connect to database after multiple attempts");
    }
  } catch (error) {
    console.error("Failed to connect to database: ", error);
    client = null;
    db = null;

    if (
      isErrorWithCode(error) &&
      (error?.code === "UND_ERR_CONNECT_TIMEOUT" || error?.code === "EAI_AGAIN")
    ) {
      throw new AppError(ERROR_CODES.SYS_DB_DOWN);
    } else if (isErrorWithCode(error) && error?.code === "ETIMEDOUT") {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    } else {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }
  }
}

export function getDatabaseStatus() {
  return client != null && db != null;
}
