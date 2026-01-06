import { NormalizedArticle, generateContentHash } from "../normalize";

export async function fetchHackerNews(): Promise<NormalizedArticle[]> {
    const idsRes = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    const ids: number[] = await idsRes.json();
    const topIds = ids.slice(0, 30);

    const items = await Promise.all(
        topIds.map(async (id) => {
            const r = await fetch(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            return r.json();
        })
    );

    return items
        .filter((i) => i?.title && i?.url)
        .map((item) => ({
            title: item.title,
            url: item.url,
            description: undefined,
            source: "hackernews",
            category: "ai",
            publishedAt: new Date(item.time * 1000),
            contentHash: generateContentHash(
                item.title,
                item.url,
                "hackernews"
            ),
        }));
}
