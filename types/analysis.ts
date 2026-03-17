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

export interface TemperatureFactor {
  name: string;
  score: number;
  description: string;
}

export interface TemperatureIndex {
  overallTemperature: number;
  factors: TemperatureFactor[];
  summary: string;
}

export interface SentimentResult {
  neighborhood: string;
  overallSentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  summary: string;
  keywords: KeywordItem[];
  hotIssues: HotIssue[];
  temperatureIndex?: TemperatureIndex;
  totalPostsAnalyzed: number;
  analyzedAt: string;
}
