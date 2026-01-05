import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

import React from "react";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
  ...props
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "glass-card p-6 hover:border-primary/30 transition-all duration-300 group",
        className
      )}
      {...props}
    >
      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
