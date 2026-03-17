import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "와글맵 | WagleMap",
  description: "동네 이름을 검색하면 실시간 동네 민심 리포트를 보여드립니다",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
        <Header />
        <main>{children}</main>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
