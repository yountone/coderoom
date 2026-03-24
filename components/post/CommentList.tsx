"use client";

import { useState, useEffect, useCallback } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import type { Comment } from "@/types";
import { Loader2 } from "lucide-react";

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      // Build nested structure
      const flat: Comment[] = data.comments;
      const rootComments: Comment[] = [];
      const childMap = new Map<string, Comment[]>();

      for (const c of flat) {
        if (c.parent_id) {
          const children = childMap.get(c.parent_id) || [];
          children.push(c);
          childMap.set(c.parent_id, children);
        } else {
          rootComments.push(c);
        }
      }

      for (const root of rootComments) {
        root.replies = childMap.get(root.id) || [];
      }

      setComments(rootComments);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 py-3 text-sm font-semibold text-gray-700">
        댓글 {comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}개
      </div>

      {comments.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySubmitted={fetchComments}
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-0">
        <CommentForm postId={postId} onSubmitted={fetchComments} />
      </div>
    </div>
  );
}
