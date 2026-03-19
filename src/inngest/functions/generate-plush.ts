import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, generatedImage } from "@/lib/schema";
import { upload } from "@/lib/storage";
import { inngest } from "../client";
import { get } from "@vercel/blob";

// ─── Plush transformation prompt (Portuguese) ────────────────────────────────
// This is the original prompt that produced correct plush toy transformations.
// NOTE: We do NOT use a system message — Gemini image models may interpret system
// messages as "text-only" mode, causing the model to analyze instead of generate.
const PLUSH_PROMPT =
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

/**
 * Extracts the raw base64 portion from a data URL, stripping the header.
 * Returns null if the input is not a data URL.
 */
function extractBase64FromDataUrl(dataUrl: string): string | null {
    const match = dataUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
    return match?.[1] ?? null;
}

/**
 * Checks whether two base64 data URLs represent the same image by comparing
 * a significant chunk of their base64 content (not just the header).
 */
function isSameImage(dataUrl1: string, dataUrl2: string): boolean {
    const b1 = extractBase64FromDataUrl(dataUrl1);
    const b2 = extractBase64FromDataUrl(dataUrl2);
    if (!b1 || !b2) return false;
    // Compare first 500 chars of actual base64 data (enough to detect copies)
    const compareLen = Math.min(500, b1.length, b2.length);
    return b1.substring(0, compareLen) === b2.substring(0, compareLen);
}

export const plushGenerateFunction = inngest.createFunction(
    {
        id: "generate-plush",
        retries: 3,
        concurrency: {
            limit: 2,
            key: "event.data.userId",
        },
        rateLimit: {
            limit: 5,
            period: "1h",
            key: "event.data.userId",
        },
    },
    { event: "plush/generate.requested" },
    async ({ event, step }) => {
        const { userId, imageUrl, recordId } = event.data as {
            userId: string;
            imageUrl: string;
            recordId: string;
        };

        console.log("[generate-plush] Function started", {
            userId,
            recordId,
            imageUrl: imageUrl.substring(0, 80) + "...",
            appUrl: process.env.NEXT_PUBLIC_APP_URL,
            hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
            hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        });

        // ─── Step 1: Fetch original image and convert to base64 ──────────────────
        const { originalImageUrl, originalBase64DataUrl } = await step.run(
            "upload-original-image",
            async () => {
                let originalBuffer: ArrayBuffer;
                let contentType = "image/png";

                // Verifica se a URL é do Vercel Blob (storage privado)
                if (imageUrl.includes("blob.vercel-storage.com")) {
                    console.log("[generate-plush] Fetching image from private Blob storage");
                    const blobResult = await get(imageUrl, { access: "private" });
                    if (!blobResult || !blobResult.stream) {
                        throw new Error(
                            `Failed to fetch image from private Blob storage. ` +
                            `Result: ${blobResult ? `statusCode=${blobResult.statusCode}` : "null"}`
                        );
                    }
                    console.log("[generate-plush] Blob get() succeeded", {
                        statusCode: blobResult.statusCode,
                        contentType: blobResult.blob.contentType,
                        size: blobResult.blob.size,
                        pathname: blobResult.blob.pathname,
                    });

                    // Converte ReadableStream para ArrayBuffer
                    const reader = blobResult.stream.getReader();
                    const chunks: Uint8Array[] = [];
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                    }
                    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                    const combined = new Uint8Array(totalLength);
                    let offset = 0;
                    for (const chunk of chunks) {
                        combined.set(chunk, offset);
                        offset += chunk.length;
                    }
                    originalBuffer = combined.buffer;
                    contentType = blobResult.blob.contentType || "image/png";

                    console.log("[generate-plush] Blob image read complete", {
                        bytesRead: totalLength,
                        contentType,
                    });
                } else {
                    // Fetch normal para URLs locais ou públicas
                    const fullImageUrl = imageUrl.startsWith("http")
                        ? imageUrl
                        : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${imageUrl}`;

                    console.log("[generate-plush] Fetching image via HTTP", { fullImageUrl });
                    const originalResponse = await fetch(fullImageUrl);
                    if (!originalResponse.ok) {
                        throw new Error(`Failed to fetch original image: ${originalResponse.status}`);
                    }
                    contentType = originalResponse.headers.get("content-type") || "image/png";
                    originalBuffer = await originalResponse.arrayBuffer();
                }

                const bufferNode = Buffer.from(originalBuffer);
                const originalBase64DataUrl = `data:${contentType};base64,${bufferNode.toString("base64")}`;

                console.log("[generate-plush] Original image prepared", {
                    bufferSizeBytes: bufferNode.length,
                    dataUrlLength: originalBase64DataUrl.length,
                    contentType,
                });

                const originalResult = await upload(
                    bufferNode,
                    `original-${Date.now()}.png`,
                    `bob-app-saas/originals/${userId}`
                );

                return { originalImageUrl: originalResult.url, originalBase64DataUrl };
            }
        );

        // ─── Step 2: Call OpenRouter API ─────────────────────────────────────────
        const { generatedImageUrl } = await step.run("call-openrouter-api", async () => {
            const apiKey = process.env.OPENROUTER_API_KEY;
            if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

            // IMPORTANT: Use Sourceful Riverflow for true image-to-image transformation!
            // Gemini models do NOT support img2img - they only do text-to-image (generate from scratch)
            const imageModel =
                process.env.OPENROUTER_IMAGE_MODEL || "sourceful/riverflow-v2-fast";

            // Extract input base64 for echo comparison later
            const inputBase64 = extractBase64FromDataUrl(originalBase64DataUrl);
            const inputBase64Length = inputBase64?.length ?? 0;

            console.log("[generate-plush] Calling OpenRouter API", {
                model: imageModel,
                promptLength: PLUSH_PROMPT.length,
                imageDataUrlLength: originalBase64DataUrl.length,
                inputBase64Length,
            });

            // ── Build request ────────────────────────────────────────────────────
            // IMPORTANT: Different models use different modalities:
            // - Sourceful models: modalities: ["image"] (image-only output)
            // - Gemini/Flux models: modalities: ["image", "text"] (text + image output)
            const isSourceful = imageModel.startsWith("sourceful/");
            const requestBody = {
                model: imageModel,
                modalities: isSourceful ? ["image"] : ["image", "text"],
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: PLUSH_PROMPT },
                            {
                                type: "image_url",
                                image_url: { url: originalBase64DataUrl },
                            },
                        ],
                    },
                ],
                image_config: {
                    aspect_ratio: "1:1",
                    image_size: "2K",
                },
            };

            console.log("[generate-plush] Request body keys", {
                model: requestBody.model,
                isSourceful,
                modalities: requestBody.modalities,
                messageCount: requestBody.messages.length,
                messageRoles: requestBody.messages.map(m => m.role),
                hasImageConfig: true,
            });

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                    "X-Title": "Plush Generator",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("[generate-plush] OpenRouter API error", {
                    status: response.status,
                    error: errorText.substring(0, 500),
                });
                throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // ── Log full response structure ──────────────────────────────────────
            const message = data.choices?.[0]?.message;
            const messageKeys = message ? Object.keys(message) : [];
            const imagesCount = message?.images?.length ?? 0;
            const contentType = typeof message?.content;
            const contentIsArray = Array.isArray(message?.content);
            const contentLength = contentIsArray
                ? message.content.length
                : typeof message?.content === "string"
                    ? message.content.length
                    : 0;

            console.log("[generate-plush] OpenRouter response structure", {
                hasChoices: !!data.choices?.length,
                messageKeys,
                imagesCount,
                contentType,
                contentIsArray,
                contentLength,
                hasFiles: !!message?.files?.length,
                // Log text content (if string) for debugging
                textContentPreview: typeof message?.content === "string"
                    ? message.content.substring(0, 200)
                    : contentIsArray
                        ? message.content
                            .filter((i: { type?: string }) => i?.type === "text")
                            .map((i: { text?: string }) => i?.text?.substring(0, 100))
                        : null,
            });

            // Log raw response structure (first 2000 chars) for full debugging
            console.log("[generate-plush] Raw response (truncated)", {
                raw: JSON.stringify(data).substring(0, 2000),
            });

            // ─── Parse generated image from response ─────────────────────────────
            let base64Data: string | null = null;
            let parseSource = "none";

            // ── Priority 1: message.images (OpenRouter documented format) ────────
            const messageImages = message?.images;
            if (Array.isArray(messageImages) && messageImages.length > 0) {
                console.log("[generate-plush] Trying message.images[]", {
                    count: messageImages.length,
                    itemKeys: messageImages.map((img: Record<string, unknown>) => Object.keys(img)),
                });
                for (const img of messageImages) {
                    // Handle both image_url and imageUrl (SDK vs JSON format)
                    const imgUrl =
                        typeof img.image_url === "string"
                            ? img.image_url
                            : img.image_url?.url
                            ?? img.imageUrl?.url
                            ?? (typeof img.imageUrl === "string" ? img.imageUrl : null);

                    if (typeof imgUrl === "string") {
                        const match = imgUrl.match(/data:image\/[^;]+;base64,(.+)/);
                        if (match?.[1]) {
                            // Check if this is an echo of the input
                            if (isSameImage(imgUrl, originalBase64DataUrl)) {
                                console.warn("[generate-plush] ⚠ message.images contains ECHOED input! Skipping.");
                                continue;
                            }
                            base64Data = match[1];
                            parseSource = "message.images[].image_url.url (data URL)";
                            break;
                        }
                        if (imgUrl.startsWith("http")) {
                            const imgResp = await fetch(imgUrl);
                            base64Data = Buffer.from(await imgResp.arrayBuffer()).toString("base64");
                            parseSource = "message.images[].image_url.url (HTTP)";
                            break;
                        }
                    }
                    if (!base64Data && img.data) {
                        base64Data = img.data;
                        parseSource = "message.images[].data";
                        break;
                    }
                }
            }

            // ── Priority 2: message.content[] (multimodal content array) ─────────
            if (!base64Data) {
                const messageContent = message?.content;
                if (Array.isArray(messageContent)) {
                    console.log("[generate-plush] Trying message.content[]", {
                        itemCount: messageContent.length,
                        itemTypes: messageContent.map(
                            (i: { type?: string }) => i?.type || "unknown"
                        ),
                    });

                    for (const item of messageContent) {
                        if (item?.type === "image_url" && item?.image_url?.url) {
                            const url = item.image_url.url;
                            // Skip if this is the echoed input image
                            if (isSameImage(url, originalBase64DataUrl)) {
                                console.warn("[generate-plush] ⚠ Skipping echoed input image in content[]");
                                continue;
                            }
                            const match = url.match(/data:image\/[^;]+;base64,(.+)/);
                            if (match?.[1]) {
                                base64Data = match[1];
                                parseSource = "message.content[].image_url (data URL)";
                                break;
                            }
                            if (url.startsWith("http")) {
                                const imgResp = await fetch(url);
                                base64Data = Buffer.from(await imgResp.arrayBuffer()).toString("base64");
                                parseSource = "message.content[].image_url (HTTP)";
                                break;
                            }
                        }
                        if (item?.type === "inline_data" && item?.inline_data?.data) {
                            base64Data = item.inline_data.data;
                            parseSource = "message.content[].inline_data";
                            break;
                        }
                        if (item?.data && item?.mime_type?.startsWith("image/")) {
                            base64Data = item.data;
                            parseSource = "message.content[].data+mime_type";
                            break;
                        }
                        if (item?.inlineData?.data) {
                            base64Data = item.inlineData.data;
                            parseSource = "message.content[].inlineData";
                            break;
                        }
                    }
                }

                // Check content as string with embedded base64
                if (
                    !base64Data &&
                    typeof message?.content === "string" &&
                    message.content.includes("data:image")
                ) {
                    const match = message.content.match(
                        /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/
                    );
                    if (match?.[1]) {
                        base64Data = match[1].trim();
                        parseSource = "message.content (string with embedded base64)";
                    }
                }
            }

            // ── Priority 3: message.files[] (alternative format) ─────────────────
            if (!base64Data && message?.files) {
                const imageFile = message.files.find(
                    (f: { type?: string; mime_type?: string; data?: string }) =>
                        f?.type?.startsWith("image/") || f?.mime_type?.startsWith("image/")
                );
                if (imageFile?.data) {
                    base64Data = imageFile.data;
                    parseSource = "message.files[]";
                }
            }

            if (!base64Data) {
                console.error("[generate-plush] ❌ No image data found in response!", {
                    responseKeys: Object.keys(data),
                    messageKeys,
                    rawResponse: JSON.stringify(data).substring(0, 2000),
                });
                throw new Error("No image data returned from OpenRouter API.");
            }

            // ── Output diagnostics ───────────────────────────────────────────────
            const outputBase64Length = base64Data.length;
            const sizeDiffPercent = inputBase64Length > 0
                ? Math.abs(outputBase64Length - inputBase64Length) / inputBase64Length * 100
                : 100;

            console.log("[generate-plush] ✅ Image extracted successfully", {
                parseSource,
                outputBase64Length,
                inputBase64Length,
                sizeDiffPercent: `${sizeDiffPercent.toFixed(1)}%`,
                estimatedOutputSizeKB: Math.round((outputBase64Length * 3) / 4 / 1024),
                // If the output is suspiciously similar in size to the input, warn
                possibleCopy: sizeDiffPercent < 5 ? "⚠ WARNING: Output size very similar to input!" : "OK",
            });

            const buffer = Buffer.from(base64Data, "base64");
            const generatedResult = await upload(
                buffer,
                `generated-${Date.now()}.png`,
                `bob-app-saas/generated/${userId}`
            );

            return { generatedImageUrl: generatedResult.url };
        });

        // ─── Step 3: Save result & debit credit ──────────────────────────────────
        const record = await step.run("save-result-and-debit-credit", async () => {
            // Update the pending record to complete
            const [updated] = await db
                .update(generatedImage)
                .set({
                    status: "complete",
                    originalImageUrl,
                    generatedImageUrl,
                })
                .where(eq(generatedImage.id, recordId))
                .returning();

            // Debit 1 credit only on success
            const [currentUser] = await db
                .select({ credits: user.credits })
                .from(user)
                .where(eq(user.id, userId))
                .limit(1);

            if (currentUser && currentUser.credits > 0) {
                await db
                    .update(user)
                    .set({ credits: currentUser.credits - 1 })
                    .where(eq(user.id, userId));
            }

            return updated;
        });

        return {
            recordId: record?.id,
            generatedImageUrl: record?.generatedImageUrl,
        };
    }
);

// Failure handler — mark record as failed without deducting credits
export const plushGenerateFailureFunction = inngest.createFunction(
    { id: "generate-plush-failure" },
    { event: "inngest/function.failed" },
    async ({ event, step }) => {
        // Only handle failures from our function
        if (event.data.function_id !== "generate-plush") return;

        const { recordId } = event.data.event?.data ?? {};
        if (!recordId) return;

        await step.run("mark-as-failed", async () => {
            await db
                .update(generatedImage)
                .set({
                    status: "failed",
                    errorMessage: event.data.error?.message ?? "Geração falhou após múltiplas tentativas.",
                })
                .where(eq(generatedImage.id, recordId));
        });
    }
);
