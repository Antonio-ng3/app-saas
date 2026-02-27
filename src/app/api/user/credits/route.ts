import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: { credits: true },
  });

  return NextResponse.json({ credits: userData?.credits ?? 5 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { credits } = body;

  // Validate credits value
  if (typeof credits !== 'number' || credits < 0 || !Number.isFinite(credits)) {
    return NextResponse.json(
      { error: "Invalid credits value. Must be a non-negative number." },
      { status: 400 }
    );
  }

  const [updatedUser] = await db.update(user)
    .set({ credits })
    .where(eq(user.id, session.user.id))
    .returning();

  return NextResponse.json({ credits: updatedUser?.credits ?? 0 });
}
