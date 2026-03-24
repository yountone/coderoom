import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { NEWS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = NEWS_PER_PAGE;

  const supabase = getSupabase();

  let query = supabase
    .from("news")
    .select("*, author:users(*)")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: news, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hasMore = news.length > limit;
  const sliced = hasMore ? news.slice(0, limit) : news;

  return NextResponse.json({
    news: sliced,
    hasMore,
    nextCursor: hasMore ? sliced[sliced.length - 1].created_at : null,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as Record<string, unknown> | undefined;
  const userId = user?.id as string | undefined;
  const role = user?.role as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (role !== "admin") {
    return NextResponse.json({ error: "관리자만 뉴스를 작성할 수 있습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { title, summary, external_url, thumbnail_url } = body;

  if (!title || !external_url) {
    return NextResponse.json({ error: "제목과 링크는 필수입니다." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("news")
    .insert({
      author_id: userId,
      title,
      summary: summary || null,
      external_url,
      thumbnail_url: thumbnail_url || null,
    })
    .select("*, author:users(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ news: data }, { status: 201 });
}
