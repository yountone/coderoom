export interface KeywordItem {
  keyword: string;
  count: number;
  sentiment: "positive" | "negative" | "neutral";
}

export interface HotIssue {
  title: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  relatedPosts: number;
}

export interface SentimentResult {
  neighborhood: string;
  overallSentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  summary: string;
  keywords: KeywordItem[];
  hotIssues: HotIssue[];
  totalPostsAnalyzed: number;
  analyzedAt: string;
}
