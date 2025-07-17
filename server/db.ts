import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

// Optional database connection - fallback to in-memory storage if not available
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log('Database connection established');
  } catch (error) {
    console.warn('Database connection failed, falling back to in-memory storage:', error);
    pool = null;
    db = null;
  }
} else {
  console.log('DATABASE_URL not set, using in-memory storage');
}

export { pool, db };