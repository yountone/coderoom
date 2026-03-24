import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "파일 크기는 5MB 이하만 가능합니다." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const supabase = getSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("post-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}
