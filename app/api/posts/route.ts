import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { POSTS_PER_PAGE, MAX_CONTENT_LENGTH } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = POSTS_PER_PAGE;

  const supabase = getSupabase();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  let query = supabase
    .from("posts")
    .select("*, author:users(*)")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: posts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hasMore = posts.length > limit;
  const sliced = hasMore ? posts.slice(0, limit) : posts;

  // Check which posts are liked by the current user
  if (userId && sliced.length > 0) {
    const postIds = sliced.map((p: Record<string, unknown>) => p.id);
    const { data: likes } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds);

    const likedSet = new Set(likes?.map((l: Record<string, unknown>) => l.post_id));
    for (const post of sliced) {
      post.liked_by_me = likedSet.has(post.id);
    }
  }

  return NextResponse.json({
    posts: sliced,
    hasMore,
    nextCursor: hasMore ? sliced[sliced.length - 1].created_at : null,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { content, image_url } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `최대 ${MAX_CONTENT_LENGTH}자까지 입력 가능합니다.` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: userId,
      content: content.trim(),
      image_url: image_url || null,
    })
    .select("*, author:users(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
