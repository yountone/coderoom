import SentimentCard from "./SentimentCard";
import type { HotIssue } from "@/types/analysis";

interface SentimentCardListProps {
  issues: HotIssue[];
}

export default function SentimentCardList({ issues }: SentimentCardListProps) {
  if (issues.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        분석된 이슈가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {issues.map((issue, i) => (
        <SentimentCard key={i} issue={issue} />
      ))}
    </div>
  );
}
