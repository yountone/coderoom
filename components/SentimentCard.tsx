import { cn } from "@/components/ui/cn";
import type { HotIssue } from "@/types/analysis";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentCardProps {
  issue: HotIssue;
}

const sentimentConfig = {
  positive: { color: "text-secondary", bg: "bg-green-50", icon: TrendingUp, label: "긍정" },
  negative: { color: "text-negative", bg: "bg-red-50", icon: TrendingDown, label: "부정" },
  neutral: { color: "text-neutral", bg: "bg-gray-100", icon: Minus, label: "중립" },
};

export default function SentimentCard({ issue }: SentimentCardProps) {
  const config = sentimentConfig[issue.sentiment];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-gray-900 text-sm leading-snug">
          {issue.title}
        </h3>
        <span className={cn("shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg", config.bg, config.color)}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        {issue.summary}
      </p>
      <p className="mt-3 text-xs text-gray-500">
        관련 게시글 {issue.relatedPosts}건
      </p>
    </div>
  );
}
