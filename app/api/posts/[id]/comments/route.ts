import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, author:users(*)")
    .eq("post_id", params.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: comments || [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { content, parent_id } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json({ error: "댓글은 500자까지 입력 가능합니다." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: params.id,
      author_id: userId,
      parent_id: parent_id || null,
      content: content.trim(),
    })
    .select("*, author:users(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
