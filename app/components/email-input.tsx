"use client";
import { useState } from "react";

import { Mail, ArrowRight, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmailInputProps {
  onSubmit: (email: string) => void;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  size?: "default" | "lg";
  isChecking?: boolean;
}

const EmailInput = ({
  onSubmit,
  buttonText = "Subscribe",
  placeholder = "Enter your email",
  className,
  size = "default",
  isChecking = false,
}: EmailInputProps) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      setIsValid(validateEmail(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    await onSubmit(email);
    setIsSubmitting(false);
  };

  const isLarge = size === "lg";

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn("flex flex-col sm:flex-row gap-3", isLarge && "gap-4")}
      >
        <div className="relative flex-1">
          <Mail
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
              isLarge ? "h-6 w-6" : "h-5 w-5"
            )}
          />
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            disabled={isChecking}
            onChange={handleChange}
            className={cn(
              "pl-12",
              isLarge && "h-14 text-base pl-14",
              isValid === true &&
                "border-green-500 focus-visible:ring-green-500",
              isValid === false &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {isValid !== null && (
            <div
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2",
                isValid ? "text-green-500" : "text-destructive"
              )}
            >
              {isValid ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
          )}
        </div>
        <Button
          type="submit"
          variant="hero"
          size={isLarge ? "lg" : "default"}
          disabled={!isValid || isSubmitting || isChecking}
          className={cn("group", isLarge && "px-8")}
        >
          {isChecking ? ( // NEW: Show checking state
            <span className="animate-pulse">Checking...</span>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
      {isValid === false && email.length > 0 && (
        <p className="mt-2 text-sm text-destructive animate-fade-in">
          Please enter a valid email address
        </p>
      )}
    </form>
  );
};

export default EmailInput;
