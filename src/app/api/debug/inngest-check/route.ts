import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

/**
 * Quick diagnostics endpoint to check Inngest configuration
 * GET /api/debug/inngest-check
 */
export async function GET() {
  const diagnostics: Record<string, any> = {
    // Environment
    env: {
      NODE_ENV: process.env.NODE_ENV,
      INNGEST_DEV: process.env.INNGEST_DEV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    // Inngest Keys (masked)
    inngest: {
      INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY
        ? `${process.env.INNGEST_EVENT_KEY.slice(0, 10)}...${process.env.INNGEST_EVENT_KEY.slice(-10)}`
        : "NOT SET",
      INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY
        ? `${process.env.INNGEST_SIGNING_KEY.slice(0, 10)}...${process.env.INNGEST_SIGNING_KEY.slice(-10)}`
        : "NOT SET",
    },
    // Other keys
    other: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? "SET" : "NOT SET",
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? "SET" : "NOT SET",
      FORCE_LOCAL_STORAGE: process.env.FORCE_LOCAL_STORAGE || "NOT SET",
    },
    // Inngest client detection
    client: {
      hasCloudKeys: !!process.env.INNGEST_EVENT_KEY,
      mode: !!process.env.INNGEST_EVENT_KEY ? "CLOUD" : "DEV_SERVER",
    },
  };

  // Try to send a test event
  try {
    const testEventResult = await inngest.send({
      name: "test/diagnostics",
      data: {
        timestamp: new Date().toISOString(),
        message: "Diagnostic test event",
      },
    });
    diagnostics.testEvent = {
      success: true,
      result: testEventResult,
    };
  } catch (error: any) {
    diagnostics.testEvent = {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }

  return NextResponse.json(diagnostics);
}
