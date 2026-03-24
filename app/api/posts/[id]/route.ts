import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*, author:users(*)")
    .eq("id", params.id)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  if (userId) {
    const { data: like } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", params.id)
      .single();

    post.liked_by_me = !!like;
  }

  return NextResponse.json({ post });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as Record<string, unknown> | undefined;
  const userId = user?.id as string | undefined;
  const role = user?.role as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = getSupabase();

  // Check ownership or admin role
  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", params.id)
    .single();

  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  if (post.author_id !== userId && role !== "admin") {
    return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
  }

  const { error } = await supabase.from("posts").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
