"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined" || !window.kakao?.maps) {
      return;
    }

    window.kakao.maps.load(() => {
      const position = new window.kakao.maps.LatLng(center.lat, center.lng);
      new window.kakao.maps.Map(mapRef.current!, {
        center: position,
        level: 5,
      });
    });
  }, [center]);

  return (
    <div
      ref={mapRef}
      className={className ?? "w-full h-48 sm:h-64 rounded-2xl bg-gray-100"}
    />
  );
}
