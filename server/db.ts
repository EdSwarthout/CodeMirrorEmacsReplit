import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const isDatabaseAvailable = !!process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

if (isDatabaseAvailable) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db, pool };