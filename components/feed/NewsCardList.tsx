"use client";

import { useState, useEffect, useCallback } from "react";
import NewsCard from "./NewsCard";
import type { News } from "@/types";
import { Loader2 } from "lucide-react";

export default function NewsCardList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const fetchNews = useCallback(async (cursorParam?: string) => {
    const url = cursorParam
      ? `/api/news?cursor=${encodeURIComponent(cursorParam)}`
      : "/api/news";

    const res = await fetch(url);
    if (!res.ok) return;

    return await res.json();
  }, []);

  useEffect(() => {
    fetchNews().then((data) => {
      if (data) {
        setNews(data.news);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }
      setLoading(false);
    });
  }, [fetchNews]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    const data = await fetchNews(cursor);
    if (data) {
      setNews((prev) => [...prev, ...data.news]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    }
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        아직 등록된 뉴스가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
      {hasMore && (
        <div className="py-4 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            {loadingMore ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              "더 보기"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
