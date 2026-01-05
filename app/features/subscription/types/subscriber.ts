import { Schema, models, model } from 'mongoose'
import { ISubscriberDocument } from '../../newsletter/types/newsletter';


const subscriberSchema = new Schema<ISubscriberDocument>(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        preferences: {
            ai: { type: Boolean, default: false },
            startups: { type: Boolean, default: false },
            devweb: { type: Boolean, default: false },
            indiatech: { type: Boolean, default: false },
            dailyindia: { type: Boolean, default: false },
            last24hours: { type: Boolean, default: false }
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'paused', 'unsubscribed'],
            default: 'active'
        },
        unsubscribeToken: { type: String, required: true, unique: true },
        subscribedAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
        lastEmailSent: { type: Date },
        timezone: { type: String, default: 'Asia/Kolkata' },
        emailFrequency: {
            type: String,
            enum: ['daily', 'weekly'],
            default: 'daily'
        },
        totalEmailsSent: { type: Number, default: 0 },
        totalEmailsOpened: { type: Number, default: 0 },
        lastOpenedAt: { type: Date }
    },
    {
        timestamps: true,
        collection: 'subscribers'
    }
);

subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ status: 1, lastEmailSent: 1 });
subscriberSchema.index({ unsubscribeToken: 1 });

export const Subscriber = models.Subscriber || model<ISubscriberDocument>('Subscriber', subscriberSchema);
