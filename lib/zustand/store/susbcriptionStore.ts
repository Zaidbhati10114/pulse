// store/subscriptionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SubscriptionStore {
    // State
    pendingEmail: string | null;
    selectedCategories: string[];

    // Actions
    setPendingEmail: (email: string) => void;
    clearPendingEmail: () => void;
    setSelectedCategories: (categories: string[]) => void;
    toggleCategory: (categoryId: string) => void;
    clearAll: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
    persist(
        (set, get) => ({
            // Initial state
            pendingEmail: null,
            selectedCategories: [],

            // Set email when user starts subscription
            setPendingEmail: (email) => set({ pendingEmail: email }),

            // Clear email after use
            clearPendingEmail: () => set({ pendingEmail: null }),

            // Set multiple categories at once
            setSelectedCategories: (categories) => set({ selectedCategories: categories }),

            // Toggle a single category
            toggleCategory: (categoryId) => {
                const { selectedCategories } = get();
                const isSelected = selectedCategories.includes(categoryId);

                set({
                    selectedCategories: isSelected
                        ? selectedCategories.filter((id) => id !== categoryId)
                        : [...selectedCategories, categoryId],
                });
            },

            // Clear all state (useful after successful subscription)
            clearAll: () => set({
                pendingEmail: null,
                selectedCategories: []
            }),
        }),
        {
            name: 'subscription-storage', // localStorage key
            // Only persist pendingEmail temporarily (optional)
            partialize: (state) => ({
                pendingEmail: state.pendingEmail
            }),
        }
    )
);