"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSubmitted?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  postId,
  parentId,
  onSubmitted,
  placeholder = "댓글을 입력하세요...",
}: CommentFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          parent_id: parentId || null,
        }),
      });

      if (res.ok) {
        setContent("");
        onSubmitted?.();
      }
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
        placeholder={session?.user ? placeholder : "로그인 후 댓글을 작성할 수 있습니다."}
        className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none"
        disabled={!session?.user}
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || submitting}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
