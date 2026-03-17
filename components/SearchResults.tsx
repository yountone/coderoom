"use client";

import { useEffect, useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import SentimentSummary from "@/components/SentimentSummary";
import SentimentCardList from "@/components/SentimentCardList";
import KeywordTags from "@/components/KeywordTags";
import KakaoMap from "@/components/KakaoMap";
import AnalysisLoading from "@/components/AnalysisLoading";
import TemperatureGauge from "@/components/TemperatureGauge";
import type { SentimentResult } from "@/types/analysis";
import type { NaverSearchItem, NaverSearchResponse } from "@/types/naver";
import type { MapCoordinate } from "@/types/map";
import { AlertCircle } from "lucide-react";

interface SearchResultsProps {
  query: string;
}

type LoadingStep = "idle" | "collecting" | "analyzing" | "done" | "error";

export default function SearchResults({ query }: SearchResultsProps) {
  const [step, setStep] = useState<LoadingStep>("idle");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<MapCoordinate>({ lat: 37.5665, lng: 126.978 });

  const runAnalysis = useCallback(async () => {
    setStep("collecting");
    setError(null);
    setResult(null);

    try {
      const naverRes = await fetch(`/api/naver?q=${encodeURIComponent(query)}`);
      if (!naverRes.ok) {
        const err = await naverRes.json();
        throw new Error(err.error || "게시글 수집에 실패했습니다.");
      }

      const naverData: { cafe: NaverSearchResponse; blog: NaverSearchResponse } =
        await naverRes.json();

      const allPosts: NaverSearchItem[] = [
        ...naverData.cafe.items,
        ...naverData.blog.items,
      ];

      if (allPosts.length === 0) {
        throw new Error("관련 게시글을 찾을 수 없습니다. 다른 동네 이름으로 검색해보세요.");
      }

      setStep("analyzing");

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neighborhood: query, posts: allPosts }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || "분석에 실패했습니다.");
      }

      const analysisResult: SentimentResult = await analyzeRes.json();
      setResult(analysisResult);
      setStep("done");

      fetch("/api/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          neighborhood: query,
          result: analysisResult,
          analyzed_at: analysisResult.analyzedAt,
        }),
      }).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setStep("error");
    }
  }, [query]);

  useEffect(() => {
    fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.lat && data.lng) {
          setMapCenter({ lat: data.lat, lng: data.lng });
        }
      })
      .catch(() => {});
  }, [query]);

  useEffect(() => {
    async function checkCacheAndRun() {
      try {
        const cacheRes = await fetch(
          `/api/cache?neighborhood=${encodeURIComponent(query)}`
        );
        const cacheData = await cacheRes.json();

        if (cacheData.cached && cacheData.data?.result) {
          setResult(cacheData.data.result);
          setStep("done");
          return;
        }
      } catch {
        // 캐시 실패 시 무시하고 분석 진행
      }

      runAnalysis();
    }

    checkCacheAndRun();
  }, [query, runAnalysis]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-5 space-y-5">
      <SearchBar defaultValue={query} size="sm" />

      <KakaoMap center={mapCenter} className="w-full h-48 sm:h-64 rounded-2xl bg-gray-200 border border-gray-200" />

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          <span className="text-carrot-600">{query}</span> 민심 리포트
        </h2>

        {(step === "collecting" || step === "analyzing") && (
          <AnalysisLoading step={step} />
        )}

        {step === "error" && (
          <div className="bg-white rounded-2xl border border-red-100 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-negative shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 font-semibold">분석 실패</p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
                <button
                  onClick={runAnalysis}
                  className="mt-3 text-sm text-carrot-600 font-semibold hover:underline"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "done" && result && <SentimentSummary result={result} />}
      </section>

      {step === "done" && result?.temperatureIndex && (
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-3">온도 지수</h3>
          <TemperatureGauge temperatureIndex={result.temperatureIndex} />
        </section>
      )}

      {step === "done" && result && (
        <>
          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">주요 키워드</h3>
            <KeywordTags keywords={result.keywords} />
          </section>

          <section>
            <h3 className="text-base font-bold text-gray-900 mb-3">핫이슈</h3>
            <SentimentCardList issues={result.hotIssues} />
          </section>
        </>
      )}

      {step === "idle" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 text-center py-6">
            분석을 준비하고 있습니다...
          </p>
        </div>
      )}
    </div>
  );
}
