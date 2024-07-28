import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { AppError, ERROR_CODES, isErrorWithCode } from "@/lib/error";

let client: ReturnType<typeof createClient>;
let db: ReturnType<typeof drizzle>;
let isDatabaseUp = false;

export function _initDb() {
  if (db) return db;
  if (client) return drizzle(client);

  client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });

  return drizzle(client);
}

export async function getDb() {
  if (db) return db;

  try {
    if (!client || !db) db = _initDb();
    await client.execute("SELECT 1");
    isDatabaseUp = true;
    console.log("Succeeded establishing a database connection");
    return db;
  } catch (error) {
    console.error("Failed to connect to database: ", error);
    isDatabaseUp = false;
    if (
      isErrorWithCode(error) &&
      (error?.code === "UND_ERR_CONNECT_TIMEOUT" || error?.code === "EAI_AGAIN")
    ) {
      throw new AppError(ERROR_CODES.SYS_DB_DOWN);
      // TODO: impl more descriptive error
    } else if (isErrorWithCode(error) && error?.code === "ETIMEDOUT") {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    } else {
      throw new AppError(ERROR_CODES.SYS_DB_FAILURE);
    }
  }
}

export function getDatabaseStatus() {
  return isDatabaseUp;
}
