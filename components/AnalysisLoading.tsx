interface AnalysisLoadingProps {
  step: "collecting" | "analyzing";
}

export default function AnalysisLoading({ step }: AnalysisLoadingProps) {
  const messages = {
    collecting: "네이버 카페/블로그 게시글을 수집하고 있어요...",
    analyzing: "AI가 동네 민심을 분석하고 있어요...",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-2 border-carrot-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">{messages[step]}</p>
          <p className="text-xs text-gray-500 mt-1">잠시만 기다려주세요</p>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-carrot-400 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-carrot-400 animate-pulse [animation-delay:0.2s]" />
          <div className="w-2 h-2 rounded-full bg-carrot-400 animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}
