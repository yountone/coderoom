import Link from "next/link";
import { MessageCircle } from "lucide-react";
import TierBadge from "@/components/shared/TierBadge";
import LikeButton from "@/components/shared/LikeButton";
import type { Post } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
  const author = post.author;

  return (
    <Link href={`/post/${post.id}`} className="block">
      <article className="border-b border-gray-100 bg-white px-4 py-4 transition hover:bg-gray-50">
        <div className="flex items-center gap-2">
          {author?.profile_image ? (
            <img
              src={author.profile_image}
              alt={author.nickname}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {author?.nickname?.[0] || "?"}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900">
              {author?.nickname || "익명"}
            </span>
            {author?.tier && <TierBadge tier={author.tier} />}
          </div>
          <span className="ml-auto text-xs text-gray-400">
            {formatRelativeTime(post.created_at)}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-800">
          {post.content}
        </p>

        {post.image_url && (
          <div className="mt-3 overflow-hidden rounded-xl">
            <img
              src={post.image_url}
              alt="첨부 이미지"
              className="w-full object-cover"
              style={{ maxHeight: 300 }}
            />
          </div>
        )}

        <div className="mt-3 flex items-center gap-4">
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
    </Link>
  );
}
