import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, generatedImage } from "@/lib/schema";
import { upload } from "@/lib/storage";
import { inngest } from "../client";
import { get } from "@vercel/blob";

// Plush transformation prompt (Portuguese)
const BASE_PLUSH_PROMPT =
    "TRANSFORME a imagem abaixo em um brinquedo de pelúcia. " +
    "NÃO copie a imagem original. Você deve CRIAR uma nova imagem de uma pelúcia baseada no personagem.\n\n" +
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
        const { userId, imageUrl, style: _style, recordId } = event.data as {
            userId: string;
            imageUrl: string;
            style: string;
            recordId: string;
        };

        console.log("[generate-plush] Function started", {
            userId,
            recordId,
            imageUrl: imageUrl.substring(0, 80) + "...",
            style: _style,
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
                    modalities: ["text", "image"],
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: BASE_PLUSH_PROMPT },
                                { type: "image_url", image_url: { url: originalBase64DataUrl } },
                            ],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // Parse image from various response formats
            let base64Data: string | null = null;
            const messageContent = data.choices?.[0]?.message?.content;

            if (Array.isArray(messageContent)) {
                for (const item of messageContent) {
                    if (item?.type === "image_url" && item?.image_url?.url) {
                        const url = item.image_url.url;
                        const match = url.match(/data:image\/[^;]+;base64,(.+)/);
                        if (match?.[1]) { base64Data = match[1]; break; }
                        if (url.startsWith("http")) {
                            const imgResp = await fetch(url);
                            base64Data = Buffer.from(await imgResp.arrayBuffer()).toString("base64");
                            break;
                        }
                    }
                    if (item?.type === "inline_data" && item?.inline_data?.data) {
                        base64Data = item.inline_data.data; break;
                    }
                    if (item?.data && item?.mime_type?.startsWith("image/")) {
                        base64Data = item.data; break;
                    }
                    if (item?.inlineData?.data) {
                        base64Data = item.inlineData.data; break;
                    }
                }
            }

            if (!base64Data && typeof messageContent === "string" && messageContent.includes("data:image")) {
                const match = messageContent.match(/data:image\/[^;]+;base64,(.+)/);
                if (match?.[1]) base64Data = match[1].trim();
            }

            if (!base64Data && data.choices?.[0]?.message?.files) {
                const imageFile = data.choices[0].message.files.find(
                    (f: { type?: string; mime_type?: string; data?: string }) =>
                        f?.type?.startsWith("image/") || f?.mime_type?.startsWith("image/")
                );
                if (imageFile?.data) base64Data = imageFile.data;
            }

            if (!base64Data && data.choices?.[0]?.message?.images) {
                const firstImage = data.choices[0].message.images[0];
                if (firstImage) {
                    const imgUrl =
                        typeof firstImage.image_url === "string"
                            ? firstImage.image_url
                            : firstImage.image_url?.url;
                    if (typeof imgUrl === "string") {
                        const match = imgUrl.match(/data:image\/[^;]+;base64,(.+)/);
                        if (match?.[1]) base64Data = match[1];
                        else if (imgUrl.startsWith("http")) {
                            const imgResp = await fetch(imgUrl);
                            base64Data = Buffer.from(await imgResp.arrayBuffer()).toString("base64");
                        }
                    }
                    if (!base64Data && firstImage.data) base64Data = firstImage.data;
                }
            }

            if (!base64Data) {
                throw new Error("No image data returned from OpenRouter API.");
            }

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
