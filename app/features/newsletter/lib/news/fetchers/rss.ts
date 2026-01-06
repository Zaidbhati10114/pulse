import Parser from "rss-parser";
import { NormalizedArticle, generateContentHash } from "../normalize";
import { NewsSource, NewsCategory } from "../../validations/newsletter";


const parser = new Parser();

export async function fetchRss(
    url: string,
    source: NewsSource,
    category: NewsCategory
): Promise<NormalizedArticle[]> {
    const feed = await parser.parseURL(url);

    return (feed.items || [])
        .filter((i) => i.title && i.link)
        .map((item) => ({
            title: item.title!,
            url: item.link!,
            description: item.contentSnippet,
            source,
            category,
            publishedAt: item.pubDate
                ? new Date(item.pubDate)
                : new Date(),
            contentHash: generateContentHash(
                item.title!,
                item.link!,
                source
            ),
        }));
}
