"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/types";
import { Loader2 } from "lucide-react";

export default function PostCardList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const fetchPosts = useCallback(async (cursorParam?: string) => {
    const url = cursorParam
      ? `/api/posts?cursor=${encodeURIComponent(cursorParam)}`
      : "/api/posts";

    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();
    return data;
  }, []);

  useEffect(() => {
    fetchPosts().then((data) => {
      if (data) {
        setPosts(data.posts);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }
      setLoading(false);
    });
  }, [fetchPosts]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    const data = await fetchPosts(cursor);
    if (data) {
      setPosts((prev) => [...prev, ...data.posts]);
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

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        아직 작성된 글이 없습니다.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
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
