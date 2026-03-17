"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/components/ui/cn";

interface SearchBarProps {
  defaultValue?: string;
  size?: "lg" | "sm";
}

export default function SearchBar({ defaultValue = "", size = "lg" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "flex items-center bg-white border border-gray-200 rounded-full shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/50",
          size === "lg" ? "px-5 py-3" : "px-4 py-2"
        )}
      >
        <Search className={cn("text-gray-400 shrink-0", size === "lg" ? "w-5 h-5" : "w-4 h-4")} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="동네 이름을 검색하세요 (예: 강남, 홍대, 판교)"
          className={cn(
            "flex-1 ml-3 bg-transparent outline-none text-gray-900 placeholder:text-gray-400",
            size === "lg" ? "text-base" : "text-sm"
          )}
        />
        <button
          type="submit"
          className={cn(
            "shrink-0 bg-primary text-white rounded-full font-medium transition-colors hover:bg-primary/90 active:bg-primary/80",
            size === "lg" ? "px-5 py-2 text-sm" : "px-4 py-1.5 text-xs"
          )}
        >
          검색
        </button>
      </div>
    </form>
  );
}
