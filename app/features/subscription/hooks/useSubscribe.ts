import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export const useSubscribe = () => {
    const router = useRouter();
    const utils = trpc.useUtils();

    const subscribeMutation = trpc.subscriber.subscribe.useMutation({
        onSuccess: (data) => {
            if (data.success) {
                toast({
                    title: 'Subscribed 🎉',
                    description: data.message,
                });

                // ✅ ID-agnostic confirmation route
                router.push(`/subscribe/${data.id}/confirmation`);
            } else {
                toast({
                    title: 'Subscription Failed',
                    description: data.message,
                    variant: 'destructive',
                });
            }
        },

        onError: (error) => {
            toast({
                title: 'Error',
                description:
                    error.message || 'Failed to subscribe. Please try again.',
                variant: 'destructive',
            });
        },
    });

    /**
     * Check if an email already exists
     * (used for pre-submit UX)
     */
    const checkEmail = async (email: string) => {
        try {
            const result = await utils.subscriber.getSubscriber.fetch({ email });
            return result;
        } catch (error) {
            console.error('Error checking email:', error);
            return {
                success: false,
                message: 'Error checking email',
                data: null,
            };
        }
    };


    const getSubscriberById = async (id: string) => {
        try {
            const result =
                await utils.subscriber.getSubscriberById.fetch({ id });

            return result;
        } catch (error) {
            console.error('Error fetching subscriber by id:', error);
            return {
                success: false,
                message: 'Error fetching subscriber',
                data: null,
            };
        }
    };

    return {
        subscribe: subscribeMutation.mutate,
        checkEmail,
        getSubscriberById,

        isLoading: subscribeMutation.isPending,
        isError: subscribeMutation.isError,
        isSuccess: subscribeMutation.isSuccess,
    };
};
