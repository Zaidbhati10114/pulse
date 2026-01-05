import { Calendar, User } from "lucide-react";
import CategoryBadge from "./catergory-badge";

const NewsletterPreview = () => {
  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Dec 28, 2024</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Pulse Team</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-4">
        This Week in Tech: AI Agents Take Center Stage
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <CategoryBadge emoji="🤖" label="AI" className="text-xs" />
        <CategoryBadge emoji="🚀" label="Startups" className="text-xs" />
        <CategoryBadge emoji="💻" label="Dev/Web" className="text-xs" />
      </div>

      <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
        <p>
          <span className="text-primary font-semibold">🔥 Top Story:</span>{" "}
          OpenAI&apos;s new agent framework promises to revolutionize how we
          build autonomous systems. Here&apos;s what developers need to know...
        </p>
        <p>
          <span className="text-primary font-semibold">💡 AI Summary:</span>{" "}
          This week saw major announcements from tech giants, with AI agents
          becoming the hottest topic. Microsoft, Google, and emerging startups
          are all racing to define the future of autonomous AI systems.
        </p>
        <p className="border-l-2 border-primary pl-4 italic">
          &quot;The next wave of AI isn&apos;t about chat—it&apos;s about agents
          that can actually do things.&quot;
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Preview of our weekly newsletter • Subscribe to read more
        </p>
      </div>
    </div>
  );
};

export default NewsletterPreview;
