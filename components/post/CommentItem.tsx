"use client";

import { useState } from "react";
import TierBadge from "@/components/shared/TierBadge";
import CommentForm from "./CommentForm";
import type { Comment } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  isReply?: boolean;
  onReplySubmitted?: () => void;
}

export default function CommentItem({
  comment,
  postId,
  isReply = false,
  onReplySubmitted,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={isReply ? "ml-10 border-l-2 border-gray-100 pl-4" : ""}>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          {comment.author?.profile_image ? (
            <img
              src={comment.author.profile_image}
              alt={comment.author.nickname}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {comment.author?.nickname?.[0] || "?"}
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900">
            {comment.author?.nickname || "익명"}
          </span>
          {comment.author?.tier && <TierBadge tier={comment.author.tier} />}
          <span className="text-xs text-gray-400">
            {formatRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-gray-700">
          {comment.content}
        </p>
        {!isReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-1 text-xs font-medium text-gray-400 hover:text-primary"
          >
            답글
          </button>
        )}
      </div>

      {showReplyForm && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          placeholder="답글을 입력하세요..."
          onSubmitted={() => {
            setShowReplyForm(false);
            onReplySubmitted?.();
          }}
        />
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          isReply
        />
      ))}
    </div>
  );
}
