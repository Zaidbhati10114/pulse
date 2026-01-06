import crypto from "crypto";
import { NewsSource, NewsCategory } from "../validations/newsletter";


export interface NormalizedArticle {
    title: string;
    url: string;
    description?: string;
    source: NewsSource;
    category: NewsCategory;
    publishedAt: Date;
    contentHash: string;
}

export function normalizeUrl(url: string) {
    try {
        const u = new URL(url);
        u.search = "";
        return u.toString();
    } catch {
        return url;
    }
}

export function generateContentHash(
    title: string,
    url: string,
    source: string
) {
    const base = `${title.toLowerCase()}|${normalizeUrl(url)}|${source}`;
    return crypto.createHash("sha256").update(base).digest("hex");
}
