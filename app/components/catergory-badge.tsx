import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const CategoryBadge = ({
  emoji,
  label,
  selected,
  onClick,
  className,
}: CategoryBadgeProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
        "border-2 hover:scale-[1.02] active:scale-[0.98]",
        selected
          ? "bg-primary/20 border-primary text-foreground shadow-lg"
          : "glass-card border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <span className="text-lg">{emoji}</span>
      <span>{label}</span>
    </button>
  );
};

export default CategoryBadge;
