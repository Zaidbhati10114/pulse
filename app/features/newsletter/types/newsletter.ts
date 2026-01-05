import { Schema, models, model } from 'mongoose';
import { EmailProvider, EmailStatus, NewsCategory, NewsSource } from '../lib/validations/newsletter';
import { CategoryPreferences } from '../../subscription/lib/validations/subscriber';

// TypeScript interfaces
export interface INewsArticle {
    id: string;
    title: string;
    url: string;
    description?: string;
    source: NewsSource;
    category: NewsCategory;
    publishedAt: Date;
    fetchedAt: Date;
    aiSummary?: string;
    summaryGeneratedAt?: Date;
    contentHash: string;
    sentToSubscribers: string[];
    sourceScore?: number;
    expiresAt: Date;
}

export interface INewsArticleDocument extends INewsArticle {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface INewsletterLog {
    id: string;
    subscriberId: string;
    subscriberEmail: string;
    articleIds: string[];
    categories: NewsCategory[];
    status: EmailStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    error?: string;
    retryCount: number;
    nextRetryAt?: Date;
    emailProvider: EmailProvider;
    emailId?: string;
    expiresAt: Date;
}

export interface INewsletterLogDocument extends INewsletterLog {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubscriber {
    id: string;
    email: string;
    preferences: CategoryPreferences;
    status: 'active' | 'paused' | 'unsubscribed';
    unsubscribeToken: string;
    subscribedAt: Date;
    updatedAt?: Date;
    lastEmailSent?: Date;
    timezone?: string;
    emailFrequency?: 'daily' | 'weekly';
    totalEmailsSent?: number;
    totalEmailsOpened?: number;
    lastOpenedAt?: Date;
}

export interface ISubscriberDocument extends ISubscriber {
    _id: string;
    createdAt: Date;
}

// NewsArticle Schema
const newsArticleSchema = new Schema<INewsArticleDocument>(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String },
        source: {
            type: String,
            required: true,
            enum: ['hackernews', 'devto', 'reddit', 'rss_economictimes', 'rss_yourstory', 'rss_toi', 'rss_indiatoday', 'rss_pib']
        },
        category: {
            type: String,
            required: true,
            enum: ['ai', 'startups', 'devweb', 'indiatech', 'dailyindia']
        },
        publishedAt: { type: Date, required: true },
        fetchedAt: { type: Date, default: Date.now },
        aiSummary: { type: String },
        summaryGeneratedAt: { type: Date },
        contentHash: { type: String, required: true, unique: true },
        sentToSubscribers: [{ type: String }],
        sourceScore: { type: Number },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    },
    {
        timestamps: true,
        collection: 'newsarticles'
    }
);

newsArticleSchema.index({ contentHash: 1 }, { unique: true });
newsArticleSchema.index({ category: 1, publishedAt: -1 });
newsArticleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// NewsletterLog Schema
const newsletterLogSchema = new Schema<INewsletterLogDocument>(
    {
        subscriberId: { type: String, required: true, index: true },
        subscriberEmail: { type: String, required: true },
        articleIds: [{ type: String }],
        categories: [{
            type: String,
            enum: ['ai', 'startups', 'devweb', 'indiatech', 'dailyindia']
        }],
        status: {
            type: String,
            required: true,
            enum: ['pending', 'sent', 'delivered', 'failed', 'bounced', 'opened'],
            default: 'pending'
        },
        sentAt: { type: Date },
        deliveredAt: { type: Date },
        openedAt: { type: Date },
        error: { type: String },
        retryCount: { type: Number, default: 0 },
        nextRetryAt: { type: Date },
        emailProvider: {
            type: String,
            required: true,
            enum: ['resend', 'brevo', 'other']
        },
        emailId: { type: String },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    },
    {
        timestamps: true,
        collection: 'newsletterlogs'
    }
);

newsletterLogSchema.index({ subscriberId: 1, createdAt: -1 });
newsletterLogSchema.index({ status: 1, nextRetryAt: 1 });
newsletterLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const NewsArticle = models.NewsArticle || model<INewsArticleDocument>('NewsArticle', newsArticleSchema);
export const NewsletterLog = models.NewsletterLog || model<INewsletterLogDocument>('NewsletterLog', newsletterLogSchema);