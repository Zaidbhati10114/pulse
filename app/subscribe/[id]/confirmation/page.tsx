"use client";

import { useParams, useRouter } from "next/navigation";
import { PartyPopper, Clock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { trpc } from "@/lib/trpc/client";

import { categories } from "@/lib/utils";
import CategoryBadge from "@/app/components/catergory-badge";

export default function SubscriptionConfirmation() {
  const router = useRouter();
  const params = useParams();
  const subscriberId = params.id as string;

  // Fetch subscriber data from database using ID
  const {
    data: subscriberData,
    isLoading,
    isError,
  } = trpc.subscriber.getSubscriberById.useQuery(
    { id: subscriberId },
    {
      enabled: !!subscriberId,
      retry: 1,
    }
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Header /> */}
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">
                Loading your subscription...
              </p>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  // Handle error or no data
  if (isError || !subscriberData?.success || !subscriberData.data) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Header /> */}
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="glass-card p-8">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Subscription Not Found
                </h1>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find your subscription details.
                </p>
                <Button
                  variant="hero"
                  onClick={() => router.push("/subscribe")}
                >
                  Go to Subscribe
                </Button>
              </div>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  const subscriber = subscriberData.data;

  // Get selected categories from preferences
  const selectedCategories = categories.filter(
    (cat) =>
      subscriber.preferences[cat.id as keyof typeof subscriber.preferences]
  );

  const handleBrowseArchive = () => {
    router.push("/archive");
  };

  const handleUnsubscribe = () => {
    router.push("/unsubscribe");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center p-8">
              {/* Celebration Icon */}
              <div className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6 animate-scale-in">
                <PartyPopper className="h-14 w-14 text-primary" />
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                🎉 Welcome to <span className="gradient-text">Pulse!</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                You&apos;ve successfully subscribed. Get ready for amazing
                content!
              </p>

              {/* Email Confirmation */}
              <div className="glass-card p-4 rounded-2xl mb-6 inline-flex items-center gap-3 bg-secondary/50">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-foreground font-medium">
                  {subscriber.email}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                  ✓{" "}
                  {subscriber.status.charAt(0).toUpperCase() +
                    subscriber.status.slice(1)}
                </span>
              </div>

              {/* Schedule Info */}
              <div className="flex items-center justify-center gap-2 mb-8 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-sm">
                  You&apos;ll receive your newsletter at{" "}
                  <span className="text-foreground font-semibold">
                    6:00 PM IST
                  </span>{" "}
                  every day
                </p>
              </div>

              {/* Subscribed Topics */}
              {selectedCategories.length > 0 && (
                <div className="glass-card p-6 rounded-2xl mb-8 bg-secondary/30">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                    Your Subscribed Topics
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {selectedCategories.map((cat) => (
                      <CategoryBadge
                        key={cat.id}
                        emoji={cat.emoji}
                        label={cat.label}
                        selected={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleBrowseArchive}
                  className="gap-2"
                >
                  Browse Archive
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/")}
                  className="gap-2"
                >
                  Go to Homepage
                </Button>
              </div>

              {/* Unsubscribe Link */}
              <p className="mt-6 text-sm text-muted-foreground">
                Changed your mind?{" "}
                <button
                  onClick={handleUnsubscribe}
                  className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                >
                  Unsubscribe anytime
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
