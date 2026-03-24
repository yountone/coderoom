"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import TierBadge from "@/components/shared/TierBadge";
import type { Tier } from "@/types";

export default function UserAvatar() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
      >
        로그인
      </Link>
    );
  }

  const user = session.user as Record<string, unknown>;
  const profileImage = user.profileImage as string | null;
  const nickname = (user.nickname as string) || session.user.name || "뮤지컬러";
  const tier = (user.tier as Tier) || "Bronze";

  return (
    <div className="flex items-center gap-2">
      <TierBadge tier={tier} />
      <button
        onClick={() => signOut({ callbackUrl: "/feed" })}
        className="flex items-center gap-2"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={nickname}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {nickname[0]}
          </div>
        )}
        <span className="hidden text-sm font-medium text-gray-700 sm:block">
          {nickname}
        </span>
      </button>
    </div>
  );
}
