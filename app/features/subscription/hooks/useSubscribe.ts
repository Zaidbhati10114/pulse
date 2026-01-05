import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export const useSubscribe = () => {
    const router = useRouter();
    const utils = trpc.useUtils()

    // Subscribe mutation
    const subscribeMutation = trpc.subscriber.subscribe.useMutation({
        onSuccess: (data) => {
            if (data.success && data.data) {
                router.push(`/subscribe/${data.data.id}/confirmation`);
            } else {
                toast({
                    title: data.alreadySubscribed
                        ? 'Already Subscribed'
                        : 'Subscription Failed',
                    description: data.message,
                    variant: data.alreadySubscribed ? 'default' : 'destructive',
                });
            }
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to subscribe. Please try again.',
                variant: 'destructive',
            });
        },
    });

    // ✅ Correct: create mutation hook ONCE
    // const getSubscriberMutation =
    //     trpc.subscriber.getSubscriber.useMutation();

    // ✅ Safe function you can call anytime
    const checkEmail = async (email: string) => {
        try {
            const result = await utils.subscriber.getSubscriber.fetch({ email })
            return result
        } catch (error) {
            console.error('Error checking email:', error);
            return {
                success: false,
                message: 'Error checking email',
                data: null,
            };
        }
    };

    return {
        subscribe: subscribeMutation.mutate,
        checkEmail,

        isLoading: subscribeMutation.isPending,
        isError: subscribeMutation.isError,
        isSuccess: subscribeMutation.isSuccess,
    };
};
