import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Database initialization

export const isDatabaseAvailable = !!process.env.DATABASE_URL;

let db: ReturnType<typeof neonDrizzle> | ReturnType<typeof pgDrizzle> | null = null;
let pool: NeonPool | PgPool | null = null;

function isNeonDatabase(url: string): boolean {
  return url.includes('neon.tech') || url.includes('neon.db');
}

if (isDatabaseAvailable) {
  console.log("[DB] DATABASE_URL length:", process.env.DATABASE_URL!.length);
  console.log("[DB] DATABASE_URL prefix:", process.env.DATABASE_URL!.substring(0, 30) + "...");
  
  const isNeon = isNeonDatabase(process.env.DATABASE_URL!);
  console.log("[DB] Database type:", isNeon ? "Neon (serverless)" : "Standard PostgreSQL");
  
  // Parse the URL to see connection details
  try {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    console.log("[DB] Parsed connection details:");
    console.log("[DB]   Protocol:", dbUrl.protocol);
    console.log("[DB]   Hostname:", dbUrl.hostname);
    console.log("[DB]   Port:", dbUrl.port || (isNeon ? "5432 (default)" : "5432 (default)"));
    console.log("[DB]   Database:", dbUrl.pathname);
    console.log("[DB]   Username:", dbUrl.username);
  } catch (urlError) {
    console.error("[DB] Failed to parse DATABASE_URL:", urlError);
  }
  
  try {
    if (isNeon) {
      console.log("[DB] Creating Neon serverless connection pool...");
      pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
      
      console.log("[DB] Initializing Drizzle ORM with Neon adapter...");
      db = neonDrizzle({ client: pool as NeonPool, schema });
    } else {
      console.log("[DB] Creating standard PostgreSQL connection pool...");
      pool = new PgPool({ connectionString: process.env.DATABASE_URL });
      
      console.log("[DB] Initializing Drizzle ORM with PostgreSQL adapter...");
      db = pgDrizzle({ client: pool as PgPool, schema });
    }
    
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
      console.error("[DB] Connection type:", isNeon ? "Neon" : "Standard PostgreSQL");
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