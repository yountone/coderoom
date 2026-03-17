import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-carrot-600 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">와글맵</span>
        </Link>
        <span className="text-xs text-gray-500 hidden sm:block">우리 동네 민심 리포트</span>
      </div>
    </header>
  );
}
