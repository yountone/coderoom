import SearchResults from "@/components/SearchResults";

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

  return <SearchResults query={query} />;
}
