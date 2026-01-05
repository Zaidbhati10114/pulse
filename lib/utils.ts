import { clsx, type ClassValue } from "clsx"
import { Clock, Gift, Sparkles, TrendingUp } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const categories = [
  {
    id: "ai",
    emoji: "💻",
    label: "AI & Tech",
    description: "Latest in tech and innovation",
  },
  {
    id: "startups",
    emoji: "💼",
    label: "Startups",
    description: "Startups and tech ",
  },
  {
    id: "devweb",
    emoji: "🔬",
    label: "Dev/Web",
    description: "Dev/Web news",
  },
  {
    id: "indiatech",
    emoji: "🏥",
    label: "India Tech",
    description: "India Tech news",
  },
  {
    id: "dailyindia",
    emoji: "🎬",
    label: "Daily India",
    description: "Daily India",
  },
  {
    id: "last24hours",
    emoji: "⚽",
    label: "Last 24 Hours",
    description: "Latest news from last 24 hours",
  },
];

export const stats = [
  { value: "10K+", label: "Subscribers" },
  { value: "500+", label: "Newsletters Sent" },
  { value: "98%", label: "Open Rate" },
];

export const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Summaries",
    description: "Get the gist of every story in seconds. Our AI reads so you don't have to."
  },
  {
    icon: Gift,
    title: "Free Forever",
    description: "No credit card required. Quality tech news should be accessible to everyone."
  },
  {
    icon: Clock,
    title: "5-Minute Read",
    description: "Carefully curated content that respects your time. No fluff, just substance."
  },
  {
    icon: TrendingUp,
    title: "Stay Ahead",
    description: "Be the first to know about trends that matter. From AI to startups."
  },
];

