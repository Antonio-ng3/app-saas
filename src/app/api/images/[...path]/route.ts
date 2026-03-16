import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { head } from "@vercel/blob";
import { db } from "@/lib/db";
import { generatedImage } from "@/lib/schema";
import { eq, and, or } from "drizzle-orm";

/**
 * API route para servir imagens privadas do Vercel Blob
 *
 * Esta rota:
 * 1. Verifica se o usuário está autenticado
 * 2. Verifica se a imagem pertence ao usuário
 * 3. Busca a imagem do Blob usando URL temporária
 * 4. Serve a imagem com os headers apropriados
 *
 * Uso: /api/images/generated/user-id/imagename.jpg
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await req.headers,
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { path } = await params;
    const imagePath = path.join("/");

    // Extrair o userId do caminho da imagem (formato: generated/userId/filename)
    const pathParts = imagePath.split("/");
    const userIdFromPath = pathParts[1]; // ID do usuário no caminho

    if (!userIdFromPath) {
      return new NextResponse("Invalid image path", { status: 400 });
    }

    // Verificar se a imagem pertence ao usuário atual
    // Buscar no banco se existe uma imagem gerada com este pathname
    const userImages = await db
      .select()
      .from(generatedImage)
      .where(
        and(
          eq(generatedImage.userId, session.user.id),
          or(
            eq(generatedImage.originalImageUrl, imagePath),
            eq(generatedImage.generatedImageUrl, imagePath)
          )
        )
      )
      .limit(1);

    // Se a imagem não pertence ao usuário, verificar se é o próprio usuário dono do caminho
    const isOwner = session.user.id === userIdFromPath;

    if (!isOwner && userImages.length === 0) {
      return new NextResponse("Forbidden: Image not owned by user", {
        status: 403,
      });
    }

    // Buscar a imagem do Vercel Blob usando URL temporária
    // O head() retorna uma URL temporária que podemos usar para buscar a imagem
    const blob = await head(imagePath, {
      // Não precisamos passar accessKey aqui porque o BLOB_READ_WRITE_TOKEN
      // já está configurado nas variáveis de ambiente
    });

    if (!blob) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Fetch the image from the temporary URL
    const imageResponse = await fetch(blob.url);

    if (!imageResponse.ok) {
      return new NextResponse("Failed to fetch image", {
        status: imageResponse.status,
      });
    }

    // Get the image content type
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

    // Get the image buffer
    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600", // Cache por 1 hora
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving private image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
