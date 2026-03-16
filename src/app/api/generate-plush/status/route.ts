import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImage, user } from "@/lib/schema";
import { blobUrlToProxyUrl } from "@/lib/storage";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const recordId = req.nextUrl.searchParams.get("recordId");

        if (!recordId) {
            return NextResponse.json({ error: "recordId is required" }, { status: 400 });
        }

        // Query by recordId, scoped to the authenticated user for security
        const [record] = await db
            .select()
            .from(generatedImage)
            .where(
                and(
                    eq(generatedImage.id, recordId),
                    eq(generatedImage.userId, session.user.id)
                )
            )
            .limit(1);

        if (!record) {
            // Record may not exist yet if Inngest hasn't started — treat as pending
            return NextResponse.json({ status: "pending" });
        }

        if (record.status === "complete") {
            // Fetch updated credits to return alongside the result
            const [currentUser] = await db
                .select({ credits: user.credits })
                .from(user)
                .where(eq(user.id, session.user.id))
                .limit(1);

            // Converte URLs do Blob para URLs do proxy (para acesso a imagens privadas)
            const generatedImageUrl = record.generatedImageUrl
                ? blobUrlToProxyUrl(record.generatedImageUrl)
                : null;
            const originalImageUrl = record.originalImageUrl
                ? blobUrlToProxyUrl(record.originalImageUrl)
                : null;

            return NextResponse.json({
                status: "complete",
                id: record.id,
                generatedImageUrl,
                originalImageUrl,
                style: record.style,
                createdAt: record.createdAt,
                creditsRemaining: currentUser?.credits ?? 0,
            });
        }

        if (record.status === "failed") {
            return NextResponse.json({
                status: "failed",
                error: record.errorMessage ?? "Geração falhou após múltiplas tentativas.",
            });
        }

        // Still pending
        return NextResponse.json({ status: "pending" });
    } catch (error) {
        console.error("Error checking generation status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
