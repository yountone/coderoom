import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { CACHE_TTL_HOURS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const neighborhood = request.nextUrl.searchParams.get("neighborhood");

  if (!neighborhood) {
    return NextResponse.json({ error: "neighborhood 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("analysis_cache")
      .select("*")
      .eq("neighborhood", neighborhood)
      .gte("analyzed_at", cutoff)
      .order("analyzed_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ cached: false });
    }

    return NextResponse.json({ cached: true, data });
  } catch {
    return NextResponse.json({ cached: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const { error } = await supabase
      .from("analysis_cache")
      .upsert(body, { onConflict: "neighborhood" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
