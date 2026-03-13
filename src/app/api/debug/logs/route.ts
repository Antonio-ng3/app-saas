import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImage } from "@/lib/schema";

/**
 * DEBUG ENDPOINT - Shows all generation records including failed ones
 * This is temporary for debugging production issues
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get ALL records including pending and failed
  const allRecords = await db
    .select()
    .from(generatedImage)
    .where(eq(generatedImage.userId, session.user.id))
    .orderBy(desc(generatedImage.createdAt));

  // Separate by status
  const failed = allRecords.filter(r => r.status === 'failed');
  const pending = allRecords.filter(r => r.status === 'pending');
  const complete = allRecords.filter(r => r.status === 'complete');

  return NextResponse.json({
    total: allRecords.length,
    failed: failed.length,
    pending: pending.length,
    complete: complete.length,
    records: allRecords.map(r => ({
      id: r.id,
      status: r.status,
      errorMessage: r.errorMessage,
      inngestRunId: r.inngestRunId,
      createdAt: r.createdAt,
    })),
    failedRecords: failed.map(r => ({
      id: r.id,
      errorMessage: r.errorMessage,
      inngestRunId: r.inngestRunId,
      createdAt: r.createdAt,
    }))
  });
}
