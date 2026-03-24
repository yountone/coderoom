"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import TierBadge from "@/components/shared/TierBadge";
import LikeButton from "@/components/shared/LikeButton";
import { MessageCircle } from "lucide-react";
import type { Post } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

export default function PostDetail({ post }: { post: Post }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const user = session?.user as Record<string, unknown> | undefined;
  const userId = user?.id as string | undefined;
  const role = user?.role as string | undefined;
  const canDelete = userId === post.author_id || role === "admin";

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/feed");
        router.refresh();
      }
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const author = post.author;

  return (
    <article className="bg-white px-4 py-4">
      <div className="flex items-center gap-2">
        {author?.profile_image ? (
          <img
            src={author.profile_image}
            alt={author.nickname}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {author?.nickname?.[0] || "?"}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900">
              {author?.nickname || "익명"}
            </span>
            {author?.tier && <TierBadge tier={author.tier} />}
          </div>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(post.created_at)}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto text-gray-400 transition hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800">
        {post.content}
      </p>

      {post.image_url && (
        <div className="mt-4 overflow-hidden rounded-xl">
          <img
            src={post.image_url}
            alt="첨부 이미지"
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
        <LikeButton
          postId={post.id}
          initialCount={post.likes_count}
          initialLiked={post.liked_by_me ?? false}
        />
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments_count}</span>
        </div>
      </div>
    </article>
  );
}
