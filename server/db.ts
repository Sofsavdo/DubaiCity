import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:///data/database.db';

if (!DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not found - using in-memory storage for development');
}

let db: any;
let sql: any;

if (DATABASE_URL && DATABASE_URL !== 'sqlite:///data/database.db') {
  try {
    sql = neon(DATABASE_URL);
    db = drizzle(sql, { schema });
    console.log('✅ Connected to PostgreSQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    db = null;
  }
} else {
  // Development uchun mock database
  db = null;
  console.log('⚠️ Using fallback storage (development mode)');
}

export { db };

// Test connection
export async function testConnection() {
  if (sql) {
    try {
      await sql`SELECT 1`;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }
}

if (sql) {
  testConnection();
}