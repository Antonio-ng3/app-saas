import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { plushGenerateFunction, plushGenerateFailureFunction } from "@/inngest/functions/generate-plush";

// Configure serve with optional signing key for production
const serveConfig: {
    client: typeof inngest;
    functions: (typeof plushGenerateFunction | typeof plushGenerateFailureFunction)[];
    signingKey?: string;
} = {
    client: inngest,
    functions: [plushGenerateFunction, plushGenerateFailureFunction],
};

// Only add signingKey in production (when INNGEST_EVENT_KEY is set)
if (process.env.INNGEST_SIGNING_KEY) {
    serveConfig.signingKey = process.env.INNGEST_SIGNING_KEY;
}

export const { GET, POST, PUT } = serve(serveConfig);
