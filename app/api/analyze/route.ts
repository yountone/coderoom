import { NextRequest, NextResponse } from "next/server";
import { analyzeSentiment } from "@/lib/claude";
import type { NaverSearchItem } from "@/types/naver";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { neighborhood, posts } = body as {
      neighborhood: string;
      posts: NaverSearchItem[];
    };

    if (!neighborhood || !posts?.length) {
      return NextResponse.json(
        { error: "neighborhood와 posts가 필요합니다." },
        { status: 400 }
      );
    }

    const result = await analyzeSentiment(neighborhood, posts);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
