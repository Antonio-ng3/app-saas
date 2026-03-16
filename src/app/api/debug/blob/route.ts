import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

/**
 * Quick diagnostics endpoint to test Vercel Blob storage
 * GET /api/debug/blob
 */
export async function GET() {
  const diagnostics: Record<string, any> = {
    // Environment
    env: {
      NODE_ENV: process.env.NODE_ENV,
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN
        ? `${process.env.BLOB_READ_WRITE_TOKEN.slice(0, 15)}...${process.env.BLOB_READ_WRITE_TOKEN.slice(-10)}`
        : "NOT SET",
      FORCE_LOCAL_STORAGE: process.env.FORCE_LOCAL_STORAGE || "NOT SET",
    },
    // Other blob-related env keys (without values)
    otherBlobKeys: Object.keys(process.env).filter(k => k.includes("BLOB")),
  };

  // Try to upload a test file
  try {
    const testData = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    const filename = `debug-test-${Date.now()}.png`;

    const blob = await put(filename, testData, {
      access: "public",
    });

    diagnostics.upload = {
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      size: testData.length,
    };

    // Try to delete the test file
    try {
      await del(blob.url);
      diagnostics.delete = {
        success: true,
        message: "Upload e delete OK",
      };
    } catch (deleteError: any) {
      diagnostics.delete = {
        success: false,
        error: deleteError.message,
        stack: deleteError.stack,
      };
    }
  } catch (error: any) {
    diagnostics.upload = {
      success: false,
      error: error.message,
      stack: error.stack,
    };
    diagnostics.delete = {
      success: false,
      error: "Upload falhou, delete não testado",
    };
  }

  return NextResponse.json(diagnostics);
}
