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
  
  // Parse the URL to see connection details
  try {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    console.log("[DB] Parsed connection details:");
    console.log("[DB]   Protocol:", dbUrl.protocol);
    console.log("[DB]   Hostname:", dbUrl.hostname);
    console.log("[DB]   Port:", dbUrl.port);
    console.log("[DB]   Database:", dbUrl.pathname);
    console.log("[DB]   Username:", dbUrl.username);
  } catch (urlError) {
    console.error("[DB] Failed to parse DATABASE_URL:", urlError);
  }
  
  try {
    console.log("[DB] Creating connection pool...");
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    console.log("[DB] Initializing Drizzle ORM...");
    db = drizzle({ client: pool, schema });
    
    console.log("[DB] Database initialization complete");
    
    // Test connection with more detailed error reporting
    pool.query('SELECT 1 as test').then((result) => {
      console.log("[DB] Connection test successful:", result.rows);
    }).catch((error) => {
      console.error("[DB] Connection test failed:", error.message);
      console.error("[DB] Error code:", error.code);
      console.error("[DB] Error errno:", error.errno);
      console.error("[DB] Error syscall:", error.syscall);
      console.error("[DB] Error address:", error.address);
      console.error("[DB] Error port:", error.port);
      console.error("[DB] Full error object:", JSON.stringify(error, null, 2));
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