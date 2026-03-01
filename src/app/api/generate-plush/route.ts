import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, generatedImage } from "@/lib/schema";
import { upload } from "@/lib/storage";

// Plush transformation prompt
const BASE_PLUSH_PROMPT =
  "Uma versão de pelúcia macia e de alta qualidade do personagem principal desta imagem, " +
  "com cabeça desproporcionalmente grande, corpo pequeno e membros curtos. " +
  "Feita de tecido felpudo e aconchegante, com costuras visíveis e detalhes faciais bordados " +
  "(olhos, nariz e boca bordados - não são olhos realistas). " +
  "A pelúcia mantém a mesma pose, posição e roupa do personagem original, " +
  "parecendo sentar ou ficar em pé naturalmente no mesmo lugar. " +
  "Mantenha o fundo original completamente inalterado — mesmo ambiente, mesma iluminação, " +
  "mesma profundidade de campo, mesma composição. Apenas o objeto é transformado em um brinquedo de pelúcia. " +
  "A expressão deve ser fofa e expressiva, com uma estética de pelúcia colecionável. " +
  "O brinquedo de pelúcia deve parecer profissionalmente confeccionado, com iluminação suave e uniforme " +
  "que combine com a cena. O visual geral deve ser adorável e semelhante a um brinquedo, " +
  "como uma pelúcia colecionável de alta qualidade que alguém colocou na cena original.";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, style } = body;

    // Fetch current credits
    const [currentUser] = await db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please upgrade to continue." },
        { status: 402 } // Payment Required
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    if (!style || !STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS]) {
      return NextResponse.json(
        { error: "Invalid style. Must be one of: " + Object.keys(STYLE_PROMPTS).join(", ") },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const imageModel = process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3.1-flash-image-preview";

    // DEBUG: Log configuration
    console.log('[DEBUG] Image Generation Config:', {
      model: imageModel,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey?.slice(0, 10) + '...',
    });

    // Upload original image to storage and prepare base64 for AI model
    let originalImageUrl: string;
    let originalBase64DataUrl: string;
    try {
      // Construct full URL if imageUrl is relative (e.g., /uploads/...)
      const fullImageUrl = imageUrl.startsWith('http')
        ? imageUrl
        : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${imageUrl}`;

      const originalResponse = await fetch(fullImageUrl);
      const contentType = originalResponse.headers.get('content-type') || 'image/png';
      const originalBuffer = await originalResponse.arrayBuffer();
      const bufferNode = Buffer.from(originalBuffer);

      // Create base64 data URL to send to the AI model
      originalBase64DataUrl = `data:${contentType};base64,${bufferNode.toString('base64')}`;

      const originalResult = await upload(
        bufferNode,
        `original-${Date.now()}.png`,
        `bob-app-saas/originals/${session.user.id}`
      );
      originalImageUrl = originalResult.url;
    } catch (error) {
      console.error("Error uploading original image:", error);
      return NextResponse.json(
        {
          error: "Failed to upload original image",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }

    // Build the full prompt
    const fullPrompt = BASE_PLUSH_PROMPT;

    // Generate image using OpenRouter Chat Completions API with multimodal output
    let generatedImageUrl: string;
    try {
      console.log('[DEBUG] Starting image generation with prompt length:', fullPrompt.length);
      console.log('[DEBUG] Using model:', imageModel);

      // Call OpenRouter Chat Completions API - the model returns image as a file
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Plush Generator',
        },
        body: JSON.stringify({
          model: imageModel,
          modalities: ['text', 'image'],
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: originalBase64DataUrl },
                },
                {
                  type: 'text',
                  text: fullPrompt,
                },
              ],
            },
          ],
        }),
      });

      console.log('[DEBUG] OpenRouter response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ERROR] OpenRouter API error:', response.status, errorText);

        // Try to parse as JSON
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`OpenRouter API error: ${JSON.stringify(errorJson)}`);
        } catch {
          throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('[DEBUG] OpenRouter response structure:', JSON.stringify(data, null, 2).slice(0, 500));

      // For multimodal models, the image comes back in different formats
      // Check for image in various possible locations
      let base64Data: string | null = null;

      const messageContent = data.choices?.[0]?.message?.content;

      if (messageContent) {
        if (Array.isArray(messageContent)) {
          console.log('[DEBUG] Content is an array with', messageContent.length, 'items');
          for (const item of messageContent) {
            console.log('[DEBUG] Content item type:', item?.type, 'keys:', Object.keys(item || {}));

            // Format 1: image_url with data URL
            if (item?.type === 'image_url' && item?.image_url?.url) {
              const url = item.image_url.url;
              const match = url.match(/data:image\/[^;]+;base64,(.+)/);
              if (match?.[1]) {
                base64Data = match[1];
                console.log('[DEBUG] Found image via image_url type');
                break;
              }
              // If it's a plain URL (not data URL), try to fetch it
              if (url.startsWith('http')) {
                const imgResp = await fetch(url);
                const imgBuf = await imgResp.arrayBuffer();
                base64Data = Buffer.from(imgBuf).toString('base64');
                console.log('[DEBUG] Found image via image_url fetch');
                break;
              }
            }

            // Format 2: inline_data (Gemini native format via OpenRouter)
            if (item?.type === 'inline_data' && item?.inline_data?.data) {
              base64Data = item.inline_data.data;
              console.log('[DEBUG] Found image via inline_data type');
              break;
            }

            // Format 3: item has direct data and mime_type (no type field)
            if (item?.data && (item?.mime_type?.startsWith('image/') || item?.type?.startsWith('image/'))) {
              base64Data = item.data;
              console.log('[DEBUG] Found image via direct data field');
              break;
            }

            // Format 4: Gemini multimodal part with inline image
            if (item?.inlineData?.data) {
              base64Data = item.inlineData.data;
              console.log('[DEBUG] Found image via inlineData (camelCase)');
              break;
            }
          }
        }

        // Option 2: Content is a string with embedded base64 data URL
        if (!base64Data && typeof messageContent === 'string' && messageContent.includes('data:image')) {
          const match = messageContent.match(/data:image\/[^;]+;base64,(.+)/);
          if (match?.[1]) {
            base64Data = match[1].trim();
            console.log('[DEBUG] Found image in content string with data URL');
          }
        }
      }

      // Option 3: Image in files array
      if (!base64Data && data.choices?.[0]?.message?.files) {
        console.log('[DEBUG] Checking files array...');
        const files = data.choices[0].message.files;
        const imageFile = files.find((f: any) => f?.type?.startsWith('image/') || f?.mime_type?.startsWith('image/'));
        if (imageFile?.data) {
          base64Data = imageFile.data;
          console.log('[DEBUG] Found image in files array');
        }
      }

      // Option 4: Check top-level images array (some OpenRouter formats)
      if (!base64Data && data.choices?.[0]?.message?.images) {
        console.log('[DEBUG] Checking images array...', JSON.stringify(data.choices[0].message.images).slice(0, 200));
        const images = data.choices[0].message.images;
        const firstImage = images[0];
        if (firstImage) {
          // image_url can be a string "data:image/..." or an object { url: "data:image/..." }
          const imgUrl = typeof firstImage.image_url === 'string'
            ? firstImage.image_url
            : firstImage.image_url?.url;

          if (typeof imgUrl === 'string') {
            const match = imgUrl.match(/data:image\/[^;]+;base64,(.+)/);
            if (match?.[1]) {
              base64Data = match[1];
              console.log('[DEBUG] Found image in images array (image_url)');
            } else if (imgUrl.startsWith('http')) {
              // It's a regular URL, fetch it
              const imgResp = await fetch(imgUrl);
              const imgBuf = await imgResp.arrayBuffer();
              base64Data = Buffer.from(imgBuf).toString('base64');
              console.log('[DEBUG] Found image in images array (fetched URL)');
            }
          }

          if (!base64Data && firstImage.data) {
            base64Data = firstImage.data;
            console.log('[DEBUG] Found image in images array (data field)');
          }
        }
      }

      if (!base64Data) {
        console.error('[ERROR] No image data found in response. Full response:', JSON.stringify(data, null, 2));
        throw new Error('No image data returned from API. The model may not support image generation.');
      }

      // Create buffer from base64
      const buffer = Buffer.from(base64Data, 'base64');

      console.log('[DEBUG] Buffer created, size:', buffer.length);

      const generatedResult = await upload(
        buffer,
        `generated-${Date.now()}.png`,
        `bob-app-saas/generated/${session.user.id}`
      );
      generatedImageUrl = generatedResult.url;
    } catch (error) {
      // Enhanced error logging
      console.error("[ERROR] Image generation failed:");
      console.error("[ERROR] Error name:", error instanceof Error ? error.name : typeof error);
      console.error("[ERROR] Error message:", error instanceof Error ? error.message : String(error));
      console.error("[ERROR] Error cause:", error instanceof Error ? (error as any).cause : undefined);

      return NextResponse.json(
        {
          error: "Failed to generate image",
          details: error instanceof Error ? error.message : "Unknown error",
          errorName: error instanceof Error ? error.name : undefined,
        },
        { status: 500 }
      );
    }

    // Deduct 1 credit after successful generation
    const [updatedUser] = await db
      .update(user)
      .set({ credits: currentUser.credits - 1 })
      .where(eq(user.id, session.user.id))
      .returning({ credits: user.credits });

    // Save generation record to database
    const [record] = await db.insert(generatedImage).values({
      id: randomUUID(),
      userId: session.user.id,
      originalImageUrl,
      generatedImageUrl,
      style,
    }).returning();

    // Return the generated image with database record
    return NextResponse.json({
      id: record?.id,
      originalImageUrl: record?.originalImageUrl,
      generatedImageUrl: record?.generatedImageUrl,
      style: record?.style,
      createdAt: record?.createdAt,
      creditsRemaining: updatedUser?.credits ?? currentUser.credits - 1,
    });

  } catch (error) {
    console.error("Error generating plush:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
