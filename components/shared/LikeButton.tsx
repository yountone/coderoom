"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/components/ui/cn";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
}

export default function LikeButton({
  postId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (loading) return;

    setLoading(true);
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.likesCount);
      } else {
        setLiked(liked);
        setCount(count);
      }
    } catch {
      setLiked(liked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
      className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-primary"
    >
      <Heart
        className={cn("h-4 w-4", liked && "fill-primary text-primary")}
      />
      <span>{count}</span>
    </button>
  );
}
