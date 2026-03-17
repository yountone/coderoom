import { cn } from "@/components/ui/cn";
import type { KeywordItem } from "@/types/analysis";

interface KeywordTagsProps {
  keywords: KeywordItem[];
}

const sentimentColor = {
  positive: "bg-green-50 text-secondary border-green-200",
  negative: "bg-red-50 text-negative border-red-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function KeywordTags({ keywords }: KeywordTagsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw) => (
        <span
          key={kw.keyword}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border",
            sentimentColor[kw.sentiment]
          )}
        >
          {kw.keyword}
          <span className="opacity-50 font-medium">{kw.count}</span>
        </span>
      ))}
    </div>
  );
}
