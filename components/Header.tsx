"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Drama } from "lucide-react";
import UserAvatar from "@/components/auth/UserAvatar";
import { cn } from "@/components/ui/cn";
import { Suspense } from "react";

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const links = [
    { href: "/feed", label: "추천", active: pathname === "/feed" && !currentTab },
    { href: "/feed?tab=news", label: "뉴스", active: pathname === "/feed" && currentTab === "news" },
  ];

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            link.active
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Drama className="h-5 w-5 text-white" />
            </div>
            <span className="hidden text-lg font-bold text-gray-900 sm:block">
              뮤지컬 커뮤니티
            </span>
          </Link>
          <Suspense fallback={null}>
            <NavLinks />
          </Suspense>
        </div>
        <UserAvatar />
      </div>
    </header>
  );
}
