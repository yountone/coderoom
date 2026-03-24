"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import PostDetail from "@/components/post/PostDetail";
import CommentList from "@/components/post/CommentList";
import type { Post } from "@/types";

export default function PostDetailClient({ postId }: { postId: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/feed")}
          className="mt-4 text-sm text-primary"
        >
          피드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center border-b border-gray-200 bg-white px-4 py-3">
        <button onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="ml-3 text-base font-semibold">게시글</span>
      </div>
      <PostDetail post={post} />
      <CommentList postId={postId} />
    </div>
  );
}
