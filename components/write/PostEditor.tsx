"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { MAX_CONTENT_LENGTH } from "@/lib/constants";

export default function PostEditor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        const data = await res.json();
        alert(data.error || "이미지 업로드에 실패했습니다.");
        setImagePreview(null);
      }
    } catch {
      alert("이미지 업로드에 실패했습니다.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), image_url: imageUrl }),
      });

      if (res.ok) {
        router.push("/feed");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "글 작성에 실패했습니다.");
      }
    } catch {
      alert("글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500"
          >
            취소
          </button>
          <h1 className="text-base font-semibold">글쓰기</h1>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition disabled:opacity-40"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "등록"}
          </button>
        </div>
      </div>

      <div className="bg-white px-4 py-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="뮤지컬에 대한 이야기를 나눠보세요..."
          className="min-h-[200px] w-full resize-none text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none"
          maxLength={MAX_CONTENT_LENGTH}
        />

        <div className="mt-2 text-right text-xs text-gray-400">
          {content.length}/{MAX_CONTENT_LENGTH}
        </div>

        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="미리보기"
              className="max-h-60 rounded-xl object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
        )}

        <div className="mt-4 border-t border-gray-100 pt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-primary"
          >
            <ImagePlus className="h-5 w-5" />
            사진 추가
          </button>
        </div>
      </div>
    </div>
  );
}
