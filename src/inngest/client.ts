import { Inngest } from "inngest";

// Determine if we should use Inngest Cloud
const hasCloudKeys = !!process.env.INNGEST_EVENT_KEY;
const isDevMode = process.env.INNGEST_DEV === "1" && !hasCloudKeys;

console.log("[Inngest Client] Initializing...", {
  mode: hasCloudKeys ? "CLOUD" : "DEV_SERVER",
  hasEventKey: hasCloudKeys,
  hasSigningKey: !!process.env.INNGEST_SIGNING_KEY,
  isDev: isDevMode,
  INNGEST_DEV_env: process.env.INNGEST_DEV,
});

// Create client:
// - If INNGEST_EVENT_KEY is set → use Inngest Cloud (force isDev: false to prevent INNGEST_DEV override)
// - Otherwise → use local Dev Server
export const inngest = new Inngest(
  hasCloudKeys
    ? {
      id: "plush-generator",
      eventKey: process.env.INNGEST_EVENT_KEY!,
      isDev: false, // Explicitly disable dev mode when using cloud keys
    }
    : {
      id: "plush-generator",
      isDev: true,
    }
);

