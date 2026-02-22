import { NextRequest, NextResponse } from "next/server";

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
  "Transform the subject into a high-quality plush toy doll. " +
  "The result must look like a REAL physical stuffed plush toy professionally photographed, NOT a filter, NOT a cartoon illustration, NOT digital art. " +
  "Requirements: " +
  "- Soft fuzzy faux fur fabric with visible texture and fibers " +
  "- Visible stitching seams and hand-crafted details " +
  "- Large shiny embroidered eyes (NOT painted, real embroidery thread) " +
  "- Small embroidered nose and mouth " +
  "- Plush squishy stuffed appearance with cotton stuffing " +
  "- Rounded cute toy proportions with slightly oversized head " +
  "- Studio product photography style with soft professional lighting " +
  "- Clean white or light gray background " +
  "- The image should look like a photo of an actual handmade plush toy you could hold in your hands, NOT a digital illustration or 3D render.";

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

    // Build the full prompt with style-specific additions
    const stylePrompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS];
    const fullPrompt = `${BASE_PLUSH_PROMPT} ${stylePrompt}`;

    // Call OpenAI DALL-E API for image generation
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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

    // Return the generated image URL
    return NextResponse.json({
      url: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
      style,
    });

  } catch (error) {
    console.error("Error generating plush:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
