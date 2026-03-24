import { Suspense } from "react";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCardList from "@/components/feed/PostCardList";
import NewsCardList from "@/components/feed/NewsCardList";
import FloatingWriteButton from "@/components/shared/FloatingWriteButton";

interface FeedPageProps {
  searchParams: { tab?: string };
}

export default function FeedPage({ searchParams }: FeedPageProps) {
  const tab = searchParams.tab || "recommended";

  return (
    <div className="mx-auto max-w-2xl">
      <Suspense fallback={null}>
        <FeedTabs />
      </Suspense>
      <div className="min-h-[60vh]">
        {tab === "news" ? <NewsCardList /> : <PostCardList />}
      </div>
      <FloatingWriteButton />
    </div>
  );
}
