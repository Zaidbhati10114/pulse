import { z } from 'zod';

//
// ============================================
// CATEGORY PREFERENCES
// ============================================
//

export const categoryPreferencesSchema = z.object({
    ai: z.boolean().optional(),
    startups: z.boolean().optional(),
    devweb: z.boolean().optional(),
    indiatech: z.boolean().optional(),
    dailyindia: z.boolean().optional(),
    last24hours: z.boolean().optional()
}).refine(
    (prefs) => Object.values(prefs).some(Boolean),
    { message: 'At least one category must be selected' }
);

//
// ============================================
// SUBSCRIPTION ACTIONS
// ============================================
//

export const subscribeSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    preferences: categoryPreferencesSchema
});

export const updatePreferencesSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    preferences: categoryPreferencesSchema
});

export const unsubscribeSchema = z.object({
    token: z.string().min(1, 'Unsubscribe token is required')
});

export const toggleSubscriptionSchema = z.object({
    email: z.string().email().trim().toLowerCase()
});

//
// ============================================
// QUERY / ANALYTICS (OPTIONAL BUT CLEAN)
// ============================================
//

export const getSubscriberStatsSchema = z.object({
    subscriberId: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
}).refine(
    (d) => !d.startDate || !d.endDate || d.startDate <= d.endDate,
    { message: 'Start date must be before end date' }
);

//
// ============================================
// TYPE EXPORTS
// ============================================
//

export type CategoryPreferences = z.infer<typeof categoryPreferencesSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>;
export type ToggleSubscriptionInput = z.infer<typeof toggleSubscriptionSchema>;
export type GetSubscriberStatsInput = z.infer<typeof getSubscriberStatsSchema>;
