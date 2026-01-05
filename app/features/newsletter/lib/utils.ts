import { INewsArticleDocument, NewsArticle } from "../types/newsletter";
import { CategoryPreferences, NewsCategory } from "./validations/newsletter";
import crypto from 'crypto';

export function generateContentHash(title: string, url: string): string {

    return crypto
        .createHash('sha256')
        .update(`${title.toLowerCase().trim()}${url.toLowerCase().trim()}`)
        .digest('hex')
        .substring(0, 16);
}

export async function getArticlesForSubscriber(
    subscriberId: string,
    preferences: CategoryPreferences
): Promise<INewsArticleDocument[]> {
    const categories: NewsCategory[] = [];

    if (preferences.ai) categories.push('ai');
    if (preferences.startups) categories.push('startups');
    if (preferences.devweb) categories.push('devweb');
    if (preferences.indiatech) categories.push('indiatech');
    if (preferences.dailyindia) categories.push('dailyindia');

    if (preferences.last24hours) {
        categories.push('ai', 'startups', 'devweb', 'indiatech', 'dailyindia');
    }

    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length === 0) {
        return [];
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return await NewsArticle.find({
        category: { $in: uniqueCategories },
        publishedAt: { $gte: twentyFourHoursAgo },
        sentToSubscribers: { $ne: subscriberId },
        aiSummary: { $exists: true, $ne: null }
    })
        .sort({ publishedAt: -1, sourceScore: -1 })
        .limit(20)
        .lean();
}

export async function markArticlesAsSent(
    articleIds: string[],
    subscriberId: string
): Promise<void> {
    await NewsArticle.updateMany(
        { _id: { $in: articleIds } },
        { $addToSet: { sentToSubscribers: subscriberId } }
    );
}