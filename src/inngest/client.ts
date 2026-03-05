import { Inngest } from "inngest";

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
