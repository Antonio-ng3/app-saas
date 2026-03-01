import { NextRequest, NextResponse } from "next/server";
import { upload } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a safe filename with extension based on MIME type
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };

    const ext = mimeToExt[file.type] || ".jpg";
    const filename = `upload-${Date.now()}${ext}`;

    // Upload to storage (no folder since upload() adds /uploads/ automatically)
    const result = await upload(buffer, filename);

    return NextResponse.json({
      url: result.url,
      pathname: result.pathname,
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
