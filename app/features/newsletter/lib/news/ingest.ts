import { Db } from "mongodb";
import { fetchHackerNews } from "./fetchers/hackernews";
import { fetchRss } from "./fetchers/rss";
import { NormalizedArticle } from "./normalize";

async function safeFetch<T>(
    name: string,
    fn: () => Promise<T>
): Promise<T | null> {
    try {
        return await fn();
    } catch (err) {
        console.error(`[INGEST ERROR] ${name}`, err);
        return null;
    }
}

export async function ingestNews(db: Db) {
    const articles: NormalizedArticle[] = [];

    const hn = await safeFetch("hackernews", fetchHackerNews);

    const toi = await safeFetch("rss_toi", () =>
        fetchRss(
            "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
            "rss_toi",
            "dailyindia"
        )
    );

    const pib = await safeFetch("rss_pib", () =>
        fetchRss(
            "https://pib.gov.in/rss.aspx",
            "rss_pib",
            "dailyindia"
        )
    );

    if (hn) articles.push(...hn);
    if (toi) articles.push(...toi);
    if (pib) articles.push(...pib);

    let inserted = 0;

    for (const article of articles) {
        try {
            await db.collection("newsarticles").insertOne({
                ...article,
                fetchedAt: new Date(),
                expiresAt: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                ),
            });
            inserted++;
        } catch (err: any) {
            if (err.code !== 11000) {
                console.error("Insert error:", err);
            }
        }
    }

    return {
        inserted,
        totalFetched: articles.length,
    };
}
