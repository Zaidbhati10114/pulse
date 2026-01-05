import { z } from 'zod';

// Category preferences validation
export const categoryPreferencesSchema = z.object({
    ai: z.boolean().optional(),
    startups: z.boolean().optional(),
    devweb: z.boolean().optional(),
    indiatech: z.boolean().optional(),
    dailyindia: z.boolean().optional(),
    last24hours: z.boolean().optional(),
}).refine(
    (data) => Object.values(data).some(value => value === true),
    {
        message: "At least one category must be selected",
    }
);

// Subscribe validation
export const subscribeSchema = z.object({
    id: z.string().min(1),
    email: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    preferences: categoryPreferencesSchema,
});

// Update preferences validation
export const updatePreferencesSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    preferences: categoryPreferencesSchema,
});

// Unsubscribe validation
export const unsubscribeSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

// Pause/Resume subscription validation
export const toggleSubscriptionSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
});