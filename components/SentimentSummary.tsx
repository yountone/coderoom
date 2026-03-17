import { cn } from "@/components/ui/cn";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { SentimentResult } from "@/types/analysis";

interface SentimentSummaryProps {
  result: SentimentResult;
}

const sentimentConfig = {
  positive: { color: "text-secondary", bg: "bg-secondary", label: "긍정적", icon: TrendingUp },
  negative: { color: "text-negative", bg: "bg-negative", label: "부정적", icon: TrendingDown },
  neutral: { color: "text-neutral", bg: "bg-neutral", label: "중립적", icon: Minus },
};

export default function SentimentSummary({ result }: SentimentSummaryProps) {
  const config = sentimentConfig[result.overallSentiment];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-5 h-5", config.color)} />
          <span className={cn("text-sm font-semibold", config.color)}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", config.bg)}
              style={{ width: `${result.sentimentScore}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">{result.sentimentScore}점</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>게시글 {result.totalPostsAnalyzed}건 분석</span>
        <span>
          {new Date(result.analyzedAt).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
