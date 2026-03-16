import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Quick diagnostics endpoint to test database connection
 * GET /api/debug/db
 */
export async function GET() {
  const diagnostics: Record<string, any> = {
    // Environment
    env: {
      NODE_ENV: process.env.NODE_ENV,
      POSTGRES_URL: process.env.POSTGRES_URL
        ? `${process.env.POSTGRES_URL.slice(0, 15)}...${process.env.POSTGRES_URL.slice(-10)}`
        : "NOT SET",
      DATABASE_URL: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.slice(0, 15)}...${process.env.DATABASE_URL.slice(-10)}`
        : "NOT SET",
    },
    // Other database-related env keys (without values)
    otherDbKeys: Object.keys(process.env).filter(k =>
      k.includes("DATABASE") || k.includes("NEON") || k.includes("POSTGRES") || k.includes("PG")
    ),
  };

  // Try to execute a simple query
  try {
    const result = await db.execute(sql`SELECT NOW() as time, current_database() as db, version() as version`);
    diagnostics.query = {
      success: true,
      result,
    };
  } catch (error: any) {
    diagnostics.query = {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }

  // Try to list tables
  try {
    const tables = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    diagnostics.tables = {
      success: true,
      count: tables.length,
      tables: tables.map((r: any) => r.table_name),
    };
  } catch (error: any) {
    diagnostics.tables = {
      success: false,
      error: error.message,
    };
  }

  return NextResponse.json(diagnostics);
}
