import SearchBar from "@/components/SearchBar";
import { MapPin, TrendingUp, Users, ThermometerSun } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100dvh-56px)] flex flex-col items-center justify-center px-4 pb-20">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-carrot-600 flex items-center justify-center shadow-lg shadow-carrot-600/20">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">와글맵</h1>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            동네 이름을 검색하면<br />
            실시간 민심 리포트를 보여드려요
          </p>
        </div>

        <SearchBar size="lg" />

        <div className="flex flex-wrap justify-center gap-2">
          {["강남", "홍대", "판교", "해운대", "성수동"].map((name) => (
            <a
              key={name}
              href={`/search?q=${encodeURIComponent(name)}`}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full hover:border-carrot-400 hover:text-carrot-600 transition-colors font-medium"
            >
              {name}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 w-full mt-4">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <TrendingUp className="w-5 h-5 text-carrot-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">민심 분석</p>
            <p className="text-[11px] text-gray-500 mt-0.5">긍정/부정 파악</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <ThermometerSun className="w-5 h-5 text-carrot-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">온도 지수</p>
            <p className="text-[11px] text-gray-500 mt-0.5">부동산 열기</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <Users className="w-5 h-5 text-carrot-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">핫이슈</p>
            <p className="text-[11px] text-gray-500 mt-0.5">주요 관심사</p>
          </div>
        </div>
      </div>
    </div>
  );
}
