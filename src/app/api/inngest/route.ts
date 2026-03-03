import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { plushGenerateFunction, plushGenerateFailureFunction } from "@/inngest/functions/generate-plush";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [plushGenerateFunction, plushGenerateFailureFunction],
});
