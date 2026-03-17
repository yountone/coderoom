"use client";

import { useEffect, useRef, useState } from "react";
import type { MapCoordinate } from "@/types/map";

interface KakaoMapProps {
  center?: MapCoordinate;
  className?: string;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
      };
    };
  }
}

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  className,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [sdkReady, setSdkReady] = useState(false);

  // SDK 로드 감지
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSdk = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          setSdkReady(true);
        });
        return true;
      }
      return false;
    };

    if (checkSdk()) return;

    // SDK가 아직 로드되지 않았으면 폴링
    const interval = setInterval(() => {
      if (checkSdk()) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // 지도 생성 및 center 변경 처리
  useEffect(() => {
    if (!sdkReady || !mapRef.current) return;

    const position = new window.kakao.maps.LatLng(center.lat, center.lng);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
        center: position,
        level: 5,
      });
    } else {
      (mapInstanceRef.current as { setCenter: (pos: unknown) => void }).setCenter(position);
    }
  }, [sdkReady, center]);

  return (
    <div
      ref={mapRef}
      className={className ?? "w-full h-48 sm:h-64 rounded-2xl bg-gray-100"}
    />
  );
}
