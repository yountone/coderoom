import { NextRequest, NextResponse } from "next/server";
import { searchCafePosts, searchBlogPosts } from "@/lib/naver";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "검색어(q)를 입력해주세요." }, { status: 400 });
  }

  try {
    const [cafe, blog] = await Promise.all([
      searchCafePosts(q),
      searchBlogPosts(q),
    ]);

    return NextResponse.json({ cafe, blog });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
