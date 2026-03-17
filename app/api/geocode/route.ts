import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "검색어가 필요합니다." }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Kakao REST API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=1`,
      {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      }
    );

    if (!res.ok) {
      throw new Error(`Kakao API error: ${res.status}`);
    }

    const data = await res.json();

    if (data.documents && data.documents.length > 0) {
      const doc = data.documents[0];
      return NextResponse.json({
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
        placeName: doc.place_name || doc.address_name,
      });
    }

    // 키워드 검색 실패 시 주소 검색 시도
    const addressRes = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}&size=1`,
      {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      }
    );

    if (addressRes.ok) {
      const addressData = await addressRes.json();
      if (addressData.documents && addressData.documents.length > 0) {
        const doc = addressData.documents[0];
        return NextResponse.json({
          lat: parseFloat(doc.y),
          lng: parseFloat(doc.x),
          placeName: doc.address_name,
        });
      }
    }

    return NextResponse.json({ lat: null, lng: null, placeName: null });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "지오코딩 실패" },
      { status: 500 }
    );
  }
}
