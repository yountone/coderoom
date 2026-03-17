import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-gray-900">와글맵</span>
        </Link>
      </div>
    </header>
  );
}
