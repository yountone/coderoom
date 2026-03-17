import { NAVER_API_BASE, DEFAULT_DISPLAY_COUNT } from "./constants";
import type { NaverSearchResponse } from "@/types/naver";

async function searchNaver(
  type: "cafearticle" | "blog",
  query: string,
  display: number = DEFAULT_DISPLAY_COUNT
): Promise<NaverSearchResponse> {
  const url = `${NAVER_API_BASE}/${type}?query=${encodeURIComponent(query)}&display=${display}&sort=date`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
    },
  });

  if (!res.ok) {
    throw new Error(`Naver API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function searchCafePosts(query: string, display?: number) {
  return searchNaver("cafearticle", query, display);
}

export async function searchBlogPosts(query: string, display?: number) {
  return searchNaver("blog", query, display);
}
