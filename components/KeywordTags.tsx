import { cn } from "@/components/ui/cn";
import type { KeywordItem } from "@/types/analysis";

interface KeywordTagsProps {
  keywords: KeywordItem[];
}

const sentimentColor = {
  positive: "bg-secondary/10 text-secondary border-secondary/20",
  negative: "bg-negative/10 text-negative border-negative/20",
  neutral: "bg-neutral/10 text-neutral border-neutral/20",
};

export default function KeywordTags({ keywords }: KeywordTagsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw) => (
        <span
          key={kw.keyword}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border",
            sentimentColor[kw.sentiment]
          )}
        >
          {kw.keyword}
          <span className="opacity-60">({kw.count})</span>
        </span>
      ))}
    </div>
  );
}
