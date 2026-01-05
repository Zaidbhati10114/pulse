import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { v4 as uuidv4 } from 'uuid';

import crypto from 'crypto';
import { subscribeSchema, toggleSubscriptionSchema, unsubscribeSchema, updatePreferencesSchema } from '@/app/features/subscription/lib/validations/subscriber';

// Helper function to generate unsubscribe token
function generateUnsubscribeToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export const subscriberRouter = router({
    // Subscribe to newsletter
    subscribe: publicProcedure
        .input(subscribeSchema)
        .mutation(async ({ ctx, input }) => {
            const { email, preferences } = input;

            // Check if subscriber already exists
            const existingSubscriber = await ctx.db
                .collection('subscribers')
                .findOne({ email });

            if (existingSubscriber) {
                // If already subscribed and active
                if (existingSubscriber.status === 'active') {
                    return {
                        success: false,
                        message: 'You are already subscribed to our newsletter!',
                        alreadySubscribed: true,
                    };
                }

                // If previously unsubscribed or paused, reactivate
                const result = await ctx.db.collection('subscribers').updateOne(
                    { email },
                    {
                        $set: {
                            preferences,
                            status: 'active',
                            updatedAt: new Date(),
                        },
                    }
                );

                return {
                    success: true,
                    message: 'Welcome back! Your subscription has been reactivated.',
                    data: {
                        email,
                        preferences,
                        status: 'active',
                    },
                };
            }

            // Create new subscriber
            const unsubscribeToken = generateUnsubscribeToken();

            const newSubscriber = {
                id: uuidv4(),
                email,
                preferences,
                status: 'active' as const,
                unsubscribeToken,
                subscribedAt: new Date(),
                updatedAt: new Date(),
            };

            await ctx.db.collection('subscribers').insertOne(newSubscriber);

            return {
                success: true,
                message: 'Successfully subscribed! You will receive newsletters based on your preferences.',
                data: {
                    id: newSubscriber.id,
                    email: newSubscriber.email,
                    preferences: newSubscriber.preferences,
                    status: newSubscriber.status,
                    subscribedAt: newSubscriber.subscribedAt,
                },
            };
        }),

    // Get subscriber by ID
    // Get subscriber by ID
    getSubscriberById: publicProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ id: input.id });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Subscriber not found.',
                    data: null,
                };
            }

            return {
                success: true,
                data: {
                    id: subscriber.id,
                    email: subscriber.email,
                    preferences: subscriber.preferences,
                    status: subscriber.status,
                    subscribedAt: subscriber.subscribedAt,
                    updatedAt: subscriber.updatedAt,
                },
            };
        }),

    // Update preferences
    updatePreferences: publicProcedure
        .input(updatePreferencesSchema)
        .mutation(async ({ ctx, input }) => {
            const { email, preferences } = input;

            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ email });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Subscriber not found. Please subscribe first.',
                };
            }

            await ctx.db.collection('subscribers').updateOne(
                { email },
                {
                    $set: {
                        preferences,
                        updatedAt: new Date(),
                    },
                }
            );

            return {
                success: true,
                message: 'Your preferences have been updated successfully!',
                data: {
                    email,
                    preferences,
                },
            };
        }),

    // Unsubscribe
    unsubscribe: publicProcedure
        .input(unsubscribeSchema)
        .mutation(async ({ ctx, input }) => {
            const { token } = input;

            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ unsubscribeToken: token });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Invalid unsubscribe token.',
                };
            }

            await ctx.db.collection('subscribers').updateOne(
                { unsubscribeToken: token },
                {
                    $set: {
                        status: 'unsubscribed',
                        updatedAt: new Date(),
                    },
                }
            );

            return {
                success: true,
                message: 'You have been unsubscribed successfully. We are sorry to see you go!',
                data: {
                    email: subscriber.email,
                },
            };
        }),

    // Pause subscription
    pauseSubscription: publicProcedure
        .input(toggleSubscriptionSchema)
        .mutation(async ({ ctx, input }) => {
            const { email } = input;

            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ email });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Subscriber not found.',
                };
            }

            if (subscriber.status === 'unsubscribed') {
                return {
                    success: false,
                    message: 'Cannot pause an unsubscribed account. Please subscribe again.',
                };
            }

            await ctx.db.collection('subscribers').updateOne(
                { email },
                {
                    $set: {
                        status: 'paused',
                        updatedAt: new Date(),
                    },
                }
            );

            return {
                success: true,
                message: 'Your subscription has been paused. You can resume anytime!',
                data: {
                    email,
                    status: 'paused',
                },
            };
        }),

    // Resume subscription
    resumeSubscription: publicProcedure
        .input(toggleSubscriptionSchema)
        .mutation(async ({ ctx, input }) => {
            const { email } = input;

            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ email });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Subscriber not found.',
                };
            }

            if (subscriber.status !== 'paused') {
                return {
                    success: false,
                    message: 'Subscription is not paused.',
                };
            }

            await ctx.db.collection('subscribers').updateOne(
                { email },
                {
                    $set: {
                        status: 'active',
                        updatedAt: new Date(),
                    },
                }
            );

            return {
                success: true,
                message: 'Your subscription has been resumed!',
                data: {
                    email,
                    status: 'active',
                },
            };
        }),

    // Get subscriber details
    getSubscriber: publicProcedure
        .input(z.object({ email: z.string().email() }))
        .query(async ({ ctx, input }) => {
            const subscriber = await ctx.db
                .collection('subscribers')
                .findOne({ email: input.email });

            if (!subscriber) {
                return {
                    success: false,
                    message: 'Subscriber not found.',
                    data: null,
                };
            }

            return {
                success: true,
                data: {
                    email: subscriber.email,
                    preferences: subscriber.preferences,
                    status: subscriber.status,
                    subscribedAt: subscriber.subscribedAt,
                    updatedAt: subscriber.updatedAt,
                },
            };
        }),

    // Get all subscribers (for admin - add auth later)
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

            const [subscribers, total] = await Promise.all([
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
                data: subscribers.map((sub) => ({
                    email: sub.email,
                    preferences: sub.preferences,
                    status: sub.status,
                    subscribedAt: sub.subscribedAt,
                    updatedAt: sub.updatedAt,
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
