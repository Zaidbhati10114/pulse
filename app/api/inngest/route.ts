import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { ingestFast } from "@/lib/inngest/functions/ingest-fast";


export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [ingestFast],
});
