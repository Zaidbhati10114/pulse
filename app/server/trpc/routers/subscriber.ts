import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { subscribeSchema, toggleSubscriptionSchema, unsubscribeSchema, updatePreferencesSchema } from '@/app/features/subscription/lib/validations/subscriber';



function generateUnsubscribeToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export const subscriberRouter = router({
    // ============================================
    // SUBSCRIBE
    // ============================================
    subscribe: publicProcedure
        .input(subscribeSchema)
        .mutation(async ({ ctx, input }) => {
            const { email, preferences } = input;

            const existing = await ctx.db
                .collection('subscribers')
                .findOne({ email });

            // Already active
            if (existing?.status === 'active') {
                return {
                    success: true,
                    message: 'Already subscribed',
                    id: existing._id.toString(),
                };
            }

            // Reactivate paused / unsubscribed
            if (existing) {
                await ctx.db.collection('subscribers').updateOne(
                    { email },
                    {
                        $set: {
                            preferences,
                            status: 'active',
                        },
                    }
                );

                return {
                    success: true,
                    message: 'Subscription reactivated',
                    id: existing._id.toString(),
                };
            }

            // Create new subscriber
            const result = await ctx.db.collection('subscribers').insertOne({
                email,
                preferences,
                status: 'active',
                unsubscribeToken: crypto.randomBytes(32).toString('hex'),
                subscribedAt: new Date(),
                timezone: 'Asia/Kolkata',
                emailFrequency: 'daily',
                totalEmailsSent: 0,
                totalEmailsOpened: 0,
                lastOpenedAt: null,
            });

            return {
                success: true,
                message: 'Successfully subscribed',
                id: result.insertedId.toString(), // 🔑 THIS IS THE KEY
            };
        }),

    // ============================================
    // GET SUBSCRIBER (BY EMAIL)
    // ============================================
    getSubscriber: publicProcedure
        .input(z.object({ email: z.string().email() }))
        .query(async ({ ctx, input }) => {
            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ email: input.email });

            if (!subscriber) {
                return { success: false, message: 'Subscriber not found.' };
            }

            return {
                success: true,
                data: {
                    email: subscriber.email,
                    preferences: subscriber.preferences,
                    status: subscriber.status,
                    subscribedAt: subscriber.subscribedAt,
                    lastEmailSent: subscriber.lastEmailSent,
                    timezone: subscriber.timezone,
                    emailFrequency: subscriber.emailFrequency,
                    totalEmailsSent: subscriber.totalEmailsSent,
                    totalEmailsOpened: subscriber.totalEmailsOpened,
                },
            };
        }),

    // ===========GET SUBSCRIBER BY ID ===========
    getSubscriberById: publicProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ _id: new ObjectId(input.id) });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Subscriber not found',
                    data: null,
                };
            }

            return {
                success: true,
                data: {
                    id: subscriber._id.toString(),
                    email: subscriber.email,
                    preferences: subscriber.preferences,
                    status: subscriber.status,
                    subscribedAt: subscriber.subscribedAt,
                },
            };
        }),

    // ============================================
    // UPDATE PREFERENCES
    // ============================================
    updatePreferences: publicProcedure
        .input(updatePreferencesSchema)
        .mutation(async ({ ctx, input }) => {
            const { email, preferences } = input;

            const result = await ctx.db.collection('subscribers').updateOne(
                { email, status: { $ne: 'unsubscribed' } },
                { $set: { preferences } }
            );

            if (result.matchedCount === 0) {
                return {
                    success: false,
                    message: 'Subscriber not found or unsubscribed.',
                };
            }

            return {
                success: true,
                message: 'Preferences updated successfully.',
            };
        }),

    // ============================================
    // UNSUBSCRIBE
    // ============================================
    unsubscribe: publicProcedure
        .input(unsubscribeSchema)
        .mutation(async ({ ctx, input }) => {
            const { token } = input;

            const result = await ctx.db.collection('subscribers').updateOne(
                { unsubscribeToken: token },
                { $set: { status: 'unsubscribed' } }
            );

            if (result.matchedCount === 0) {
                return {
                    success: false,
                    message: 'Invalid unsubscribe token.',
                };
            }

            return {
                success: true,
                message: 'You have been unsubscribed successfully.',
            };
        }),

    // ============================================
    // PAUSE
    // ============================================
    pauseSubscription: publicProcedure
        .input(toggleSubscriptionSchema)
        .mutation(async ({ ctx, input }) => {
            const { email } = input;

            const result = await ctx.db.collection('subscribers').updateOne(
                { email, status: 'active' },
                { $set: { status: 'paused' } }
            );

            if (result.matchedCount === 0) {
                return {
                    success: false,
                    message: 'Subscriber not active or not found.',
                };
            }

            return {
                success: true,
                message: 'Subscription paused.',
            };
        }),

    // ============================================
    // RESUME
    // ============================================
    resumeSubscription: publicProcedure
        .input(toggleSubscriptionSchema)
        .mutation(async ({ ctx, input }) => {
            const { email } = input;

            const result = await ctx.db.collection('subscribers').updateOne(
                { email, status: 'paused' },
                { $set: { status: 'active' } }
            );

            if (result.matchedCount === 0) {
                return {
                    success: false,
                    message: 'Subscription is not paused or does not exist.',
                };
            }

            return {
                success: true,
                message: 'Subscription resumed.',
            };
        }),

    // ============================================
    // LIST SUBSCRIBERS (ADMIN / INTERNAL)
    // ============================================
    getAllSubscribers: publicProcedure
        .input(
            z.object({
                status: z.enum(['active', 'paused', 'unsubscribed']).optional(),
                limit: z.number().min(1).max(100).default(50),
                skip: z.number().min(0).default(0),
            })
        )
        .query(async ({ ctx, input }) => {
            const { status, limit, skip } = input;

            const filter = status ? { status } : {};

            const [items, total] = await Promise.all([
                ctx.db
                    .collection('subscribers')
                    .find(filter)
                    .sort({ subscribedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray(),
                ctx.db.collection('subscribers').countDocuments(filter),
            ]);

            return {
                success: true,
                data: items.map((s) => ({
                    email: s.email,
                    status: s.status,
                    preferences: s.preferences,
                    subscribedAt: s.subscribedAt,
                    lastEmailSent: s.lastEmailSent,
                })),
                pagination: {
                    total,
                    limit,
                    skip,
                    hasMore: skip + limit < total,
                },
            };
        }),
});
