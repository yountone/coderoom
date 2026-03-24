import { ExternalLink } from "lucide-react";
import type { News } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

export default function NewsCard({ news }: { news: News }) {
  return (
    <a
      href={news.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-gray-100 bg-white px-4 py-4 transition hover:bg-gray-50"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold leading-snug text-gray-900 line-clamp-2">
            {news.title}
          </h3>
          {news.summary && (
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2">
              {news.summary}
            </p>
          )}
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <ExternalLink className="h-3 w-3" />
            <span>{formatRelativeTime(news.created_at)}</span>
          </div>
        </div>
        {news.thumbnail_url && (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={news.thumbnail_url}
              alt={news.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </a>
  );
}
