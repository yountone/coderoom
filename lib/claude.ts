import Anthropic from "@anthropic-ai/sdk";
import type { NaverSearchItem } from "@/types/naver";
import type { SentimentResult } from "@/types/analysis";

const anthropic = new Anthropic();

export async function analyzeSentiment(
  neighborhood: string,
  posts: NaverSearchItem[]
): Promise<SentimentResult> {
  const postsText = posts
    .map((p, i) => `[${i + 1}] ${p.title}\n${p.description}`)
    .join("\n\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `당신은 동네 민심 분석 전문가입니다. 아래는 "${neighborhood}" 지역과 관련된 네이버 카페/블로그 게시글입니다.

이 게시글들을 분석하여 다음 JSON 형식으로 결과를 반환해주세요:
{
  "overallSentiment": "positive" | "negative" | "neutral",
  "sentimentScore": 0~100 (100이 가장 긍정적),
  "summary": "전반적인 동네 분위기 요약 (2-3문장)",
  "keywords": [{"keyword": "키워드", "count": 출현횟수, "sentiment": "positive|negative|neutral"}],
  "hotIssues": [{"title": "이슈 제목", "summary": "요약", "sentiment": "positive|negative|neutral", "relatedPosts": 관련글수}],
  "temperatureIndex": {
    "overallTemperature": 0~100 (100이 가장 뜨거움, 부동산 관점에서 동네의 열기),
    "factors": [
      {"name": "개발 호재", "score": 0~100, "description": "관련 개발 뉴스 요약"},
      {"name": "교육 인프라", "score": 0~100, "description": "교육 환경 요약"},
      {"name": "교통 인프라", "score": 0~100, "description": "교통 환경 요약"},
      {"name": "생활 편의시설", "score": 0~100, "description": "편의시설 요약"},
      {"name": "주민 만족도", "score": 0~100, "description": "주민 만족도 요약"}
    ],
    "summary": "부동산 관점의 동네 온도 요약 (1~2문장)"
  }
}

부동산 관점에서 동네의 '온도'도 함께 분석해주세요. 개발 호재, 교육/교통 인프라, 생활 편의시설, 주민 만족도를 기준으로 평가합니다.

게시글 목록:
${postsText}

JSON만 반환해주세요.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  let jsonText = content.text.trim();
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  }

  const parsed = JSON.parse(jsonText);

  return {
    neighborhood,
    ...parsed,
    totalPostsAnalyzed: posts.length,
    analyzedAt: new Date().toISOString(),
  };
}
