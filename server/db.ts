import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Database initialization

export const isDatabaseAvailable = !!process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

if (isDatabaseAvailable) {
  console.log("[DB] DATABASE_URL length:", process.env.DATABASE_URL!.length);
  console.log("[DB] DATABASE_URL prefix:", process.env.DATABASE_URL!.substring(0, 30) + "...");
  
  try {
    console.log("[DB] Creating connection pool...");
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    console.log("[DB] Initializing Drizzle ORM...");
    db = drizzle({ client: pool, schema });
    
    console.log("[DB] Database initialization complete");
    
    // Test connection
    pool.query('SELECT 1 as test').then((result) => {
      console.log("[DB] Connection test successful:", result.rows);
    }).catch((error) => {
      console.error("[DB] Connection test failed:", error.message);
      console.error("[DB] Error code:", error.code);
      console.error("[DB] Error detail:", error.detail);
    });
    
  } catch (error) {
    console.error("[DB] Failed to initialize database:", error);
    console.error("[DB] Error type:", typeof error);
    console.error("[DB] Error details:", error);
  }
} else {
  console.log("[DB] No DATABASE_URL found, using fallback storage");
}

export { db, pool };