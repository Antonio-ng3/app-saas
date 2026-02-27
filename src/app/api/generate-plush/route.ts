import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// Style-specific prompts to append to the base prompt
const STYLE_PROMPTS = {
  "classic-teddy": "Classic teddy bear style with warm golden-brown fur, traditional black button eyes, floppy ears, soft rounded body, vintage charm, hand-stitched details.",
  "modern-cute": "Modern cute kawaii style with big sparkling embroidered eyes, pastel pink and cream colors, extra fluffy premium fur, tiny embroidered nose, sweet smile, rosy cheeks.",
  "cartoon": "Cartoon style with exaggerated cute features, big head, small body, vibrant rainbow colors, expressive embroidered face, glossy shine on fur, toy-like aesthetic.",
  "realistic": "Realistic plush with detailed faux fur texture, lifelike proportions preserving original subject's features, natural color palette, high-quality artisan craftsmanship, visible fabric weave.",
  "mini": "Mini pocket-sized plush, cute and tiny with small embroidered details, palm of your hand size (10cm), adorable chibi proportions, oversized head, tiny body.",
} as const;

// Base prompt for transforming to plush - enhanced for better results
const BASE_PLUSH_PROMPT =
  "A high-quality professional product photograph of a handcrafted plush toy doll sitting on a plain background. " +
  "The plush toy is a recreation of the subject described below. " +
  "Requirements: " +
  "- The doll is made of soft, fuzzy, textured fabrics like felt, velvet, and plush faux fur. " +
  "- It should have large, expressive, shiny black embroidered eyes with subtle reflections. " +
  "- The nose and mouth should be small and carefully embroidered. " +
  "- It features visible artisan craftsmanship, including high-quality stitching and seams. " +
  "- The proportions are cute and rounded (chibi-style) with a slightly oversized head. " +
  "- Professional studio lighting with soft shadows, creating a high-end toy commercial look. " +
  "- NOT a digital illustration, NOT a 3D render, but a REAL physical object photograph.";

async function getImageBase64(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith("/")) {
    // Local file path
    const filePath = join(process.cwd(), "public", imageUrl);
    const buffer = await readFile(filePath);
    const mimeType = imageUrl.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${mimeType}; base64, ${buffer.toString("base64")} `;
  }

  // External URL
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return `data:${contentType}; base64, ${Buffer.from(buffer).toString("base64")} `;
}

async function analyzeSubject(imageUrl: string, apiKey: string): Promise<string> {
  try {
    const base64Image = await getImageBase64(imageUrl);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey} `,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and describe the subject for a plush toy recreation. " +
                  "Focus on: 1. Hair/Head features (color, style, length), 2. Clothing/Outfit (colors, specific items like jackets or shirts), 3. Key identification features (facial expression, pose, accessories). " +
                  "Describe the subject as if explaining to someone who will sew a doll of them. Be concise but specific about colors and items."
              },
              {
                type: "image_url",
                image_url: { url: base64Image }
              }
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error("Vision API error:", await response.text());
      return "";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Error analyzing subject:", error);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, style } = body;

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

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // Step 1: Analyze the image to get a description of the subject
    const subjectDescription = await analyzeSubject(imageUrl, apiKey);

    // Step 2: Build the full prompt with description and style
    const stylePrompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS];
    const fullPrompt = `${BASE_PLUSH_PROMPT} \n\nSubject description: ${subjectDescription} \n\nStyle specific details: ${stylePrompt} `;

    // Step 3: Call OpenAI DALL-E API for image generation
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey} `,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      return NextResponse.json(
        { error: "Failed to generate image", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.data || !data.data[0] || !data.data[0].url) {
      return NextResponse.json(
        { error: "Invalid response from image generation API" },
        { status: 500 }
      );
    }

    const plushImageUrl = data.data[0].url;

    // Return the generated image URL
    return NextResponse.json({
      url: plushImageUrl,
      revisedPrompt: data.data[0].revised_prompt,
      style,
      subjectDescription, // For testing/debugging
    });

  } catch (error) {
    console.error("Error generating plush:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
