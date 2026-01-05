"use client";

import { Mail, Zap } from "lucide-react";
import EmailInput from "./components/email-input";
import { categories, features, stats } from "@/lib/utils";
import CategoryBadge from "./components/catergory-badge";
import NewsletterPreview from "./components/newsletter-preview";
import FeatureCard from "./components/feature-card";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/lib/zustand/store/susbcriptionStore";
import { useState } from "react";
import { useSubscribe } from "./features/subscription/hooks/useSubscribe";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const setPendingEmail = useSubscriptionStore(
    (state) => state.setPendingEmail
  );
  const { checkEmail } = useSubscribe();
  const handleSubscribe = async (email: string) => {
    setIsChecking(true);

    try {
      // Check if email already exists
      const result = await checkEmail(email);
      //console.log("Result:", result);

      if (result.success) {
        // Email already exists
        toast.error("Email Already Subscribed,Please use a different one");
        //console.log("Email already ");
        return;
      } else {
        // Email doesn't exist, proceed to subscribe page
        setPendingEmail(email);
        router.push("/subscribe");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Failed to verify email. Please try again");
    } finally {
      setIsChecking(false);
    }
  };

  //console.log(setPendingEmail);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Glow Effects */}
          <div className="hero-glow -top-40 -left-40 opacity-50" />
          <div className="hero-glow -bottom-40 -right-40 opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  AI-Curated Tech News
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up opacity-0 stagger-1">
                <span className="text-foreground">Your Daily Dose of</span>
                <br />
                <span className="gradient-text">Tech Intelligence</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up opacity-0 stagger-2">
                Stay ahead with AI-summarized news from startups, AI, dev
                trends, and the Indian tech ecosystem. Delivered fresh to your
                inbox.
              </p>

              {/* Email Signup */}
              <div className="max-w-xl mx-auto mb-12 animate-fade-in-up opacity-0 stagger-3">
                <EmailInput
                  onSubmit={handleSubscribe}
                  buttonText="Subscribe Free"
                  size="lg"
                  isChecking={isChecking}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Join 10,000+ tech enthusiasts. No spam, unsubscribe anytime.
                </p>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up opacity-0 stagger-4">
                {categories.map((cat, idx) => (
                  <CategoryBadge
                    key={idx}
                    emoji={cat.emoji}
                    label={cat.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                >
                  <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose <span className="gradient-text">Pulse</span>?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We combine the power of AI with human curation to bring you the
                most relevant tech news, tailored to your interests.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  className="animate-fade-in-up opacity-0"
                  style={
                    { animationDelay: `${0.1 * idx}s` } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Preview Section */}
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  See What&apos;s Inside a{" "}
                  <span className="gradient-text">Pulse</span> Newsletter
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every issue is carefully crafted with AI summaries, key
                  insights, and actionable takeaways. Here&apos;s a sneak peek
                  at what you&apos;ll receive.
                </p>
                <ul className="space-y-3">
                  {[
                    "AI-generated summaries for quick reading",
                    "Curated stories across 6 categories",
                    "Weekly trends and insights",
                    "Exclusive startup spotlights",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <div className="p-1 rounded-full bg-primary/20">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <NewsletterPreview />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
              <div className="hero-glow top-0 left-1/2 -translate-x-1/2 opacity-30" />
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Stay Informed?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of developers, founders, and tech enthusiasts
                  who start their day with Pulse.
                </p>
                <EmailInput
                  onSubmit={handleSubscribe}
                  buttonText="Get Started Free"
                  size="lg"
                  className="max-w-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
