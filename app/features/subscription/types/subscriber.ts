export interface CategoryPreferences {
    ai?: boolean;
    startups?: boolean;
    devweb?: boolean;
    indiatech?: boolean;
    dailyindia?: boolean;
    last24hours?: boolean;
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
}