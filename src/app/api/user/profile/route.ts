import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Name is required and cannot be empty" },
      { status: 400 }
    );
  }

  if (name.trim().length > 100) {
    return NextResponse.json(
      { error: "Name must be 100 characters or less" },
      { status: 400 }
    );
  }

  const trimmedName = name.trim();

  const [updatedUser] = await db.update(user)
    .set({ name: trimmedName, updatedAt: new Date() })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json(updatedUser);
}
