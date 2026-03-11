import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, generatedImage } from "@/lib/schema";
import { inngest } from "@/inngest/client";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, style } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Check credits upfront (fail fast — no wasted Inngest runs)
    const [currentUser] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please upgrade to continue." },
        { status: 402 }
      );
    }

    // Create a pending record immediately so the client has an ID to poll
    const recordId = randomUUID();
    await db.insert(generatedImage).values({
      id: recordId,
      userId: session.user.id,
      originalImageUrl: null,
      generatedImageUrl: null,
      style: style ?? "classic",
      status: "pending",
      inngestRunId: null, // will be updated below
    });

    // Dispatch to Inngest (returns immediately, < 1s)
    const isCloud = !!process.env.INNGEST_EVENT_KEY;
    console.log("[Inngest] Sending event...", {
      userId: session.user.id,
      recordId,
      mode: isCloud ? "CLOUD" : "DEV_SERVER",
      hasEventKey: isCloud,
      hasSigningKey: !!process.env.INNGEST_SIGNING_KEY,
      isDev: process.env.INNGEST_DEV,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    });

    let result;
    try {
      result = await inngest.send({
        name: "plush/generate.requested",
        data: {
          userId: session.user.id,
          imageUrl,
          style: style ?? "classic",
          recordId,
        },
      });
    } catch (sendError) {
      console.error("[Inngest] Failed to send event!", {
        error: sendError instanceof Error ? sendError.message : sendError,
        stack: sendError instanceof Error ? sendError.stack : undefined,
        mode: isCloud ? "CLOUD" : "DEV_SERVER",
      });

      // Mark the record as failed since the event couldn't be sent
      await db
        .update(generatedImage)
        .set({
          status: "failed",
          errorMessage: "Falha ao enviar evento para processamento.",
        })
        .where(eq(generatedImage.id, recordId));

      return NextResponse.json(
        { error: "Failed to dispatch generation. Check Inngest configuration." },
        { status: 500 }
      );
    }

    console.log("[Inngest] Event sent!", { runId: result.ids?.[0], recordId });

    // Save the Inngest run ID back to the record for polling
    const inngestRunId = result.ids?.[0] ?? null;
    if (inngestRunId) {
      await db
        .update(generatedImage)
        .set({ inngestRunId })
        .where(eq(generatedImage.id, recordId));
    }

    return NextResponse.json(
      { runId: inngestRunId, recordId },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error dispatching plush generation:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

