"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/components/ui/cn";

const tabs = [
  { key: "recommended", label: "추천" },
  { key: "news", label: "뉴스" },
];

export default function FeedTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "recommended";

  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() =>
            router.push(
              tab.key === "recommended" ? "/feed" : `/feed?tab=${tab.key}`
            )
          }
          className={cn(
            "flex-1 py-3 text-center text-sm font-semibold transition",
            currentTab === tab.key
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
