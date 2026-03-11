import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq, and, isNotNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImage } from "@/lib/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await db
    .select()
    .from(generatedImage)
    .where(
      and(
        eq(generatedImage.userId, session.user.id),
        eq(generatedImage.status, "complete"),
        isNotNull(generatedImage.generatedImageUrl)
      )
    )
    .orderBy(desc(generatedImage.createdAt));

  return NextResponse.json(images);
}
