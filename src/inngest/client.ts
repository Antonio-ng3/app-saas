import { Inngest } from "inngest";

// Log configuration for debugging
const isInngestCloud = !!process.env.INNGEST_EVENT_KEY;
console.log("[Inngest Client] Initializing...", {
  mode: isInngestCloud ? "CLOUD" : "DEV_SERVER",
  hasEventKey: isInngestCloud,
});

// Create client with optional event key for Inngest Cloud
// If INNGEST_EVENT_KEY is set, uses Inngest Cloud; otherwise uses Dev Server
export const inngest = new Inngest(
  process.env.INNGEST_EVENT_KEY
    ? {
        id: "plush-generator",
        eventKey: process.env.INNGEST_EVENT_KEY,
      }
    : {
        id: "plush-generator",
      }
);
