import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImage } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Security: Verify user owns this record
  const [record] = await db
    .select()
    .from(generatedImage)
    .where(
      and(
        eq(generatedImage.id, id),
        eq(generatedImage.userId, session.user.id)
      )
    )
    .limit(1);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete files from storage
  await deleteFile(record.originalImageUrl);
  await deleteFile(record.generatedImageUrl);

  // Delete database record
  await db.delete(generatedImage).where(eq(generatedImage.id, id));

  return NextResponse.json({ success: true });
}
