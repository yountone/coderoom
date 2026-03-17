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
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center",
            result.overallSentiment === "positive" && "bg-green-50",
            result.overallSentiment === "negative" && "bg-red-50",
            result.overallSentiment === "neutral" && "bg-gray-100",
          )}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <div>
            <span className={cn("text-sm font-bold", config.color)}>
              {config.label}
            </span>
            <p className="text-xs text-gray-500">{result.sentimentScore}점 / 100점</p>
          </div>
        </div>
        <div className="w-28 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", config.bg)}
            style={{ width: `${result.sentimentScore}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500 pt-1 border-t border-gray-100">
        <span>게시글 {result.totalPostsAnalyzed}건 분석</span>
        <span className="text-gray-300">|</span>
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
