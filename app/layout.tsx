import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SessionProvider from "@/components/auth/SessionProvider";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "뮤지컬 커뮤니티",
  description: "뮤지컬을 사랑하는 사람들의 커뮤니티",
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
      <body
        className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <SessionProvider>
          <Header />
          <main className="pb-20">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
