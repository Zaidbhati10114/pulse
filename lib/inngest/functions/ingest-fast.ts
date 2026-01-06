import { getDb } from "@/lib/mongodb/mongodb";
import { inngest } from "../client";
import { ingestNews } from "@/app/features/newsletter/lib/news/ingest";


export const ingestFast = inngest.createFunction(
    {
        id: "news-ingest-fast",
        name: "News Ingestion (Fast Sources)",
    },
    [
        { cron: "0 * * * *" },               // hourly cron
    ],
    async () => {
        const db = await getDb();
        return await ingestNews(db);
    }
);
