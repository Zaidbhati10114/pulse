import { z } from 'zod';

//
// ============================================
// ENUMS (SINGLE SOURCE OF TRUTH)
// ============================================
//

export const newsSourceSchema = z.enum([
    'hackernews',
    'devto',
    'reddit',
    'rss_economictimes',
    'rss_yourstory',
    'rss_toi',
    'rss_indiatoday',
    'rss_pib'
]);

export const newsCategorySchema = z.enum([
    'ai',
    'startups',
    'devweb',
    'indiatech',
    'dailyindia'
]);

export const emailStatusSchema = z.enum([
    'pending',
    'sent',
    'delivered',
    'failed',
    'bounced',
    'opened'
]);

export const emailProviderSchema = z.enum([
    'resend',
    'brevo',
    'other'
]);

//
// ============================================
// NEWS ARTICLE (RAW INGESTION)
// ============================================
//

export const createNewsArticleSchema = z.object({
    title: z.string().min(5).max(300).trim(),
    url: z.string().url().trim(),
    description: z.string().max(500).optional(),
    source: newsSourceSchema,
    category: newsCategorySchema,
    publishedAt: z.coerce.date(),
    sourceScore: z.number().min(0).optional()
});

export const bulkCreateNewsArticlesSchema = z.object({
    articles: z.array(createNewsArticleSchema)
        .min(1)
        .max(100)
});

export const queryNewsArticlesSchema = z.object({
    category: newsCategorySchema.optional(),
    source: newsSourceSchema.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    limit: z.number().int().min(1).max(100).default(20),
    skip: z.number().int().min(0).default(0)
}).refine(
    (d) => !d.startDate || !d.endDate || d.startDate <= d.endDate,
    { message: 'Start date must be before end date' }
);

//
// ============================================
// DAILY NEWSLETTER (AI SUMMARY SNAPSHOT)
// ============================================
//

export const createDailyNewsletterSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD (IST)'),
    category: newsCategorySchema,
    articleIds: z.array(z.string()).min(1).max(50),
    aiSummary: z.string().min(200).max(5000),
    modelUsed: z.string().optional()
});

export const queryDailyNewsletterSchema = z.object({
    date: z.string().optional(),
    category: newsCategorySchema.optional()
});

//
// ============================================
// NEWSLETTER DELIVERY LOGS
// ============================================
//

export const createNewsletterLogSchema = z.object({
    subscriberId: z.string().min(1),
    subscriberEmail: z.string().email(),
    articleIds: z.array(z.string()).min(1).max(50),
    categories: z.array(newsCategorySchema).min(1),
    emailProvider: emailProviderSchema
});

export const updateNewsletterLogSchema = z.object({
    id: z.string().min(1),
    status: emailStatusSchema,
    emailId: z.string().optional(),
    error: z.string().max(1000).optional(),
    sentAt: z.coerce.date().optional(),
    deliveredAt: z.coerce.date().optional(),
    openedAt: z.coerce.date().optional()
});

export const queryNewsletterLogsSchema = z.object({
    subscriberId: z.string().optional(),
    status: emailStatusSchema.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    limit: z.number().int().min(1).max(100).default(50),
    skip: z.number().int().min(0).default(0)
});

export const retryFailedEmailsSchema = z.object({
    maxRetries: z.number().int().min(1).max(5).default(3),
    subscriberId: z.string().optional()
});

//
// ============================================
// CRON / JOB VALIDATIONS
// ============================================
//

export const fetchNewsSchema = z.object({
    categories: z.array(newsCategorySchema).optional(),
    forceRefresh: z.boolean().default(false)
});

export const generateDailySummariesSchema = z.object({
    date: z.string().optional(),
    category: newsCategorySchema.optional(),
    forceRegenerate: z.boolean().default(false)
});

export const sendNewslettersSchema = z.object({
    testMode: z.boolean().default(false),
    testEmail: z.string().email().optional(),
    batchSize: z.number().int().min(1).max(100).default(50),
    subscriberIds: z.array(z.string()).optional()
}).refine(
    (d) => !d.testMode || !!d.testEmail,
    { message: 'testEmail is required when testMode is enabled' }
);

//
// ============================================
// WEBHOOK VALIDATIONS
// ============================================
//

export const resendWebhookSchema = z.object({
    type: z.enum([
        'email.sent',
        'email.delivered',
        'email.bounced',
        'email.opened'
    ]),
    data: z.object({
        email_id: z.string(),
        to: z.string().email(),
        created_at: z.string().datetime()
    })
});

export const brevoWebhookSchema = z.object({
    event: z.enum([
        'delivered',
        'hard_bounce',
        'soft_bounce',
        'opened',
        'click'
    ]),
    email: z.string().email(),
    'message-id': z.string(),
    date: z.string()
});

//
// ============================================
// TYPE EXPORTS
// ============================================
//

export type NewsSource = z.infer<typeof newsSourceSchema>;
export type NewsCategory = z.infer<typeof newsCategorySchema>;

export type CreateNewsArticle = z.infer<typeof createNewsArticleSchema>;
export type BulkCreateNewsArticles = z.infer<typeof bulkCreateNewsArticlesSchema>;
export type QueryNewsArticles = z.infer<typeof queryNewsArticlesSchema>;

export type CreateDailyNewsletter = z.infer<typeof createDailyNewsletterSchema>;
export type QueryDailyNewsletter = z.infer<typeof queryDailyNewsletterSchema>;

export type EmailStatus = z.infer<typeof emailStatusSchema>;
export type EmailProvider = z.infer<typeof emailProviderSchema>;
export type CreateNewsletterLog = z.infer<typeof createNewsletterLogSchema>;
export type UpdateNewsletterLog = z.infer<typeof updateNewsletterLogSchema>;
export type QueryNewsletterLogs = z.infer<typeof queryNewsletterLogsSchema>;
export type RetryFailedEmails = z.infer<typeof retryFailedEmailsSchema>;

export type FetchNews = z.infer<typeof fetchNewsSchema>;
export type GenerateDailySummaries = z.infer<typeof generateDailySummariesSchema>;
export type SendNewsletters = z.infer<typeof sendNewslettersSchema>;

export type ResendWebhook = z.infer<typeof resendWebhookSchema>;
export type BrevoWebhook = z.infer<typeof brevoWebhookSchema>;
