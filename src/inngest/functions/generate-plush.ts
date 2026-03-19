import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, generatedImage } from "@/lib/schema";
import { upload } from "@/lib/storage";
import { inngest } from "../client";
import { get } from "@vercel/blob";

// ─── System instruction: sets the model role as an image generator ───────────
const SYSTEM_PROMPT =
    "You are an expert image generation AI. When the user provides a photo and asks you to transform it, " +
    "you MUST generate a completely NEW image based on their instructions. " +
    "Do NOT return or copy the original image. Do NOT describe the image in text. " +
    "Your response MUST contain a newly generated image that follows the user's transformation instructions. " +
    "The generated image should be visually distinct from the input — it must look like a plush toy, not a photo.";

// ─── Plush transformation prompt (Portuguese) ────────────────────────────────
// This is the original prompt that produced correct plush toy transformations.
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
            forceLocalStorage: process.env.FORCE_LOCAL_STORAGE,
        });

        // ─── Step 1: Upload original image ───────────────────────────────────────
        const { originalImageUrl, originalBase64DataUrl } = await step.run(
            "upload-original-image",
            async () => {
                let originalBuffer: ArrayBuffer;
                let contentType = "image/png";

                // Verifica se a URL é do Vercel Blob (storage privado)
                if (imageUrl.includes("blob.vercel-storage.com")) {
                    // Usa a função get do Vercel Blob para acessar imagem privada
                    const blobResult = await get(imageUrl, { access: "private" });
                    if (!blobResult || !blobResult.stream) {
                        throw new Error("Failed to fetch image from private Blob storage");
                    }
                    // Converte ReadableStream para ArrayBuffer
                    const reader = blobResult.stream.getReader();
                    const chunks: Uint8Array[] = [];
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                    }
                    // Combina todos os chunks em um único ArrayBuffer
                    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                    const combined = new Uint8Array(totalLength);
                    let offset = 0;
                    for (const chunk of chunks) {
                        combined.set(chunk, offset);
                        offset += chunk.length;
                    }
                    originalBuffer = combined.buffer;
                    contentType = blobResult.blob.contentType || "image/png";
                } else {
                    // Fetch normal para URLs locais ou públicas
                    const fullImageUrl = imageUrl.startsWith("http")
                        ? imageUrl
                        : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${imageUrl}`;

                    const originalResponse = await fetch(fullImageUrl);
                    if (!originalResponse.ok) {
                        throw new Error(`Failed to fetch original image: ${originalResponse.status}`);
                    }
                    contentType = originalResponse.headers.get("content-type") || "image/png";
                    originalBuffer = await originalResponse.arrayBuffer();
                }

                const bufferNode = Buffer.from(originalBuffer);
                const originalBase64DataUrl = `data:${contentType};base64,${bufferNode.toString("base64")}`;

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

            const imageModel =
                process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3.1-flash-image-preview";

            console.log("[generate-plush] Calling OpenRouter API", {
                model: imageModel,
                promptLength: PLUSH_PROMPT.length,
                hasSystemPrompt: true,
                imageDataUrlLength: originalBase64DataUrl.length,
            });

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                    "X-Title": "Plush Generator",
                },
                body: JSON.stringify({
                    model: imageModel,
                    // Per OpenRouter docs: use ["image", "text"] for models that output both
                    modalities: ["image", "text"],
                    messages: [
                        // System message to force generator behavior
                        {
                            role: "system",
                            content: SYSTEM_PROMPT,
                        },
                        // User message: text prompt FIRST, then reference image
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
                    // Image configuration for consistent output quality
                    image_config: {
                        aspect_ratio: "1:1",
                        image_size: "2K",
                    },
                }),
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

            console.log("[generate-plush] OpenRouter API response structure", {
                hasChoices: !!data.choices?.length,
                messageKeys: data.choices?.[0]?.message
                    ? Object.keys(data.choices[0].message)
                    : [],
                hasImages: !!data.choices?.[0]?.message?.images?.length,
                contentType: typeof data.choices?.[0]?.message?.content,
                contentIsArray: Array.isArray(data.choices?.[0]?.message?.content),
                hasFiles: !!data.choices?.[0]?.message?.files?.length,
            });

            // ─── Parse generated image from response ─────────────────────────────
            // PRIORITY ORDER (per OpenRouter documentation):
            //   1. message.images[] — OpenRouter's documented response format
            //   2. message.content[] — array of multimodal content parts
            //   3. message.files[] — alternative file format
            //   4. message.content (string) — embedded base64 in text
            let base64Data: string | null = null;

            // ── Priority 1: message.images (OpenRouter documented format) ────────
            // This is where OpenRouter places GENERATED images, separate from echoed inputs
            const messageImages = data.choices?.[0]?.message?.images;
            if (Array.isArray(messageImages) && messageImages.length > 0) {
                console.log("[generate-plush] Found images in message.images[]", {
                    count: messageImages.length,
                });
                for (const img of messageImages) {
                    const imgUrl =
                        typeof img.image_url === "string"
                            ? img.image_url
                            : img.image_url?.url;
                    if (typeof imgUrl === "string") {
                        const match = imgUrl.match(/data:image\/[^;]+;base64,(.+)/);
                        if (match?.[1]) {
                            base64Data = match[1];
                            console.log("[generate-plush] Extracted base64 from message.images data URL");
                            break;
                        }
                        if (imgUrl.startsWith("http")) {
                            const imgResp = await fetch(imgUrl);
                            base64Data = Buffer.from(await imgResp.arrayBuffer()).toString("base64");
                            console.log("[generate-plush] Downloaded image from message.images URL");
                            break;
                        }
                    }
                    if (!base64Data && img.data) {
                        base64Data = img.data;
                        console.log("[generate-plush] Extracted base64 from message.images .data");
                        break;
                    }
                }
            }

            // ── Priority 2: message.content[] (multimodal content array) ─────────
            // Some responses include generated images in the content array.
            // We skip items that look like the echoed input image.
            if (!base64Data) {
                const messageContent = data.choices?.[0]?.message?.content;
                if (Array.isArray(messageContent)) {
                    console.log("[generate-plush] Parsing message.content array", {
                        itemCount: messageContent.length,
                        itemTypes: messageContent.map(
                            (i: { type?: string }) => i?.type || "unknown"
                        ),
                    });

                    // Collect all image items from content, skip any that match the input
                    const inputPrefix = originalBase64DataUrl.substring(0, 100);
                    for (const item of messageContent) {
                        if (item?.type === "image_url" && item?.image_url?.url) {
                            const url = item.image_url.url;
                            // Skip if this looks like the echoed input image
                            if (url.substring(0, 100) === inputPrefix) {
                                console.log("[generate-plush] Skipping echoed input image in content");
                                continue;
                            }
                            const match = url.match(/data:image\/[^;]+;base64,(.+)/);
                            if (match?.[1]) {
                                base64Data = match[1];
                                console.log("[generate-plush] Extracted base64 from content image_url");
                                break;
                            }
                            if (url.startsWith("http")) {
                                const imgResp = await fetch(url);
                                base64Data = Buffer.from(await imgResp.arrayBuffer()).toString("base64");
                                console.log("[generate-plush] Downloaded image from content URL");
                                break;
                            }
                        }
                        if (item?.type === "inline_data" && item?.inline_data?.data) {
                            base64Data = item.inline_data.data;
                            console.log("[generate-plush] Extracted from inline_data");
                            break;
                        }
                        if (item?.data && item?.mime_type?.startsWith("image/")) {
                            base64Data = item.data;
                            console.log("[generate-plush] Extracted from data+mime_type");
                            break;
                        }
                        if (item?.inlineData?.data) {
                            base64Data = item.inlineData.data;
                            console.log("[generate-plush] Extracted from inlineData");
                            break;
                        }
                    }
                }

                // Check content as string with embedded base64
                if (
                    !base64Data &&
                    typeof data.choices?.[0]?.message?.content === "string" &&
                    data.choices[0].message.content.includes("data:image")
                ) {
                    const match = data.choices[0].message.content.match(
                        /data:image\/[^;]+;base64,(.+)/
                    );
                    if (match?.[1]) {
                        base64Data = match[1].trim();
                        console.log("[generate-plush] Extracted base64 from content string");
                    }
                }
            }

            // ── Priority 3: message.files[] (alternative format) ─────────────────
            if (!base64Data && data.choices?.[0]?.message?.files) {
                const imageFile = data.choices[0].message.files.find(
                    (f: { type?: string; mime_type?: string; data?: string }) =>
                        f?.type?.startsWith("image/") || f?.mime_type?.startsWith("image/")
                );
                if (imageFile?.data) {
                    base64Data = imageFile.data;
                    console.log("[generate-plush] Extracted base64 from message.files");
                }
            }

            if (!base64Data) {
                console.error("[generate-plush] No image data found in response", {
                    responseKeys: Object.keys(data),
                    firstChoiceMessageKeys: data.choices?.[0]?.message
                        ? Object.keys(data.choices[0].message)
                        : [],
                    rawResponse: JSON.stringify(data).substring(0, 1000),
                });
                throw new Error("No image data returned from OpenRouter API.");
            }

            console.log("[generate-plush] Successfully extracted generated image", {
                base64Length: base64Data.length,
                estimatedSizeKB: Math.round((base64Data.length * 3) / 4 / 1024),
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
