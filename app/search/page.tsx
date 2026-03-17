import SearchBar from "@/components/SearchBar";
import SentimentCardList from "@/components/SentimentCardList";
import KakaoMap from "@/components/KakaoMap";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? "";

  if (!query) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <p className="text-gray-500 text-center">검색어를 입력해주세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-4 space-y-4">
      <SearchBar defaultValue={query} size="sm" />

      <KakaoMap />

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          &ldquo;{query}&rdquo; 민심 리포트
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-500 text-center py-6">
            검색 버튼을 눌러 분석을 시작하세요.
            <br />
            네이버 카페/블로그 게시글을 수집하고 AI가 분석합니다.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-3">핫이슈</h3>
        <SentimentCardList issues={[]} />
      </section>
    </div>
  );
}
