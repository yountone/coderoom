import SearchBar from "@/components/SearchBar";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100dvh-56px)] flex flex-col items-center justify-center px-4 pb-20">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">와글맵</h1>
          <p className="text-sm text-gray-500 text-center">
            동네 이름을 검색하면 실시간 민심 리포트를 보여드려요
          </p>
        </div>
        <SearchBar size="lg" />
        <div className="flex flex-wrap justify-center gap-2">
          {["강남", "홍대", "판교", "해운대", "성수동"].map((name) => (
            <a
              key={name}
              href={`/search?q=${encodeURIComponent(name)}`}
              className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-full hover:border-primary/50 hover:text-primary transition-colors"
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
