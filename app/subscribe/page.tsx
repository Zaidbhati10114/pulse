"use client";

import { useState, useEffect } from "react";
import { Check, Mail, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { categories, cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useSubscribe } from "../features/subscription/hooks/useSubscribe";

import { v4 as uuidv4 } from "uuid";
import { useSubscriptionStore } from "@/lib/zustand/store/susbcriptionStore";

export default function Subscribe() {
  // ✅ Initialize with pendingEmail
  const [emailError, setEmailError] = useState("");

  // Get state and actions from Zustand store
  const {
    pendingEmail,
    selectedCategories,
    clearPendingEmail,
    toggleCategory,
    clearAll,
  } = useSubscriptionStore();
  const [email, setEmail] = useState(pendingEmail || "");

  const { subscribe, isLoading } = useSubscribe();

  // Auto-fill email from Zustand store when component mounts
  useEffect(() => {
    if (pendingEmail) {
      // Clear the pending email from store after using it
      clearPendingEmail();
    }
  }, [pendingEmail, clearPendingEmail]);
  //console.log(email, pendingEmail);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value && !validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Select at least one category",
        description: "Choose the topics you're interested in.",
        variant: "destructive",
      });
      return;
    }

    // Convert selected categories to preferences object
    const preferences = categories.reduce((acc, cat) => {
      acc[cat.id] = selectedCategories.includes(cat.id);
      return acc;
    }, {} as Record<string, boolean>);

    // Call subscribe mutation
    subscribe(
      {
        email,
        preferences,
        id: uuidv4(),
      },
      {
        // On success callback
        onSuccess: () => {
          // Clear all subscription state
          clearAll();
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Customize Your <span className="gradient-text">Feed</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Select the categories you&apos;re interested in. We&apos;ll
                curate your perfect tech digest.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div className="glass-card p-6 animate-fade-in-up opacity-0 stagger-1">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={cn(
                      "pl-12",
                      emailError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-destructive">{emailError}</p>
                )}
                {pendingEmail && (
                  <p className="mt-2 text-sm text-green-500 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Email pre-filled from landing page
                  </p>
                )}
              </div>

              {/* Categories Grid */}
              <div className="glass-card p-6 animate-fade-in-up opacity-0 stagger-2">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Select Categories
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                        selectedCategories.includes(cat.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30 bg-secondary/30"
                      )}
                    >
                      <Checkbox
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{cat.emoji}</span>
                          <span className="font-medium text-foreground">
                            {cat.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                      {selectedCategories.includes(cat.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-fade-in-up opacity-0 stagger-3">
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Subscribing...</span>
                  ) : (
                    <>
                      Subscribe to Pulse
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  By subscribing, you agree to our terms. Unsubscribe anytime.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
