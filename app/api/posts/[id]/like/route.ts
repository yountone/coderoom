import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = getSupabase();
  const postId = params.id;

  // Check if already liked
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .single();

  if (existing) {
    // Unlike
    await supabase.from("likes").delete().eq("id", existing.id);
  } else {
    // Like
    await supabase.from("likes").insert({ user_id: userId, post_id: postId });
  }

  // Get updated count
  const { data: post } = await supabase
    .from("posts")
    .select("likes_count")
    .eq("id", postId)
    .single();

  return NextResponse.json({
    liked: !existing,
    likesCount: post?.likes_count ?? 0,
  });
}
