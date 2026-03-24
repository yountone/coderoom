"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("kakao", { callbackUrl: "/feed" })}
      className="flex items-center gap-2 rounded-lg bg-[#FEE500] px-5 py-3 text-sm font-semibold text-[#191919] transition hover:brightness-95"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 0.6C4.029 0.6 0 3.713 0 7.55c0 2.486 1.656 4.667 4.146 5.893l-1.054 3.85a.3.3 0 00.456.335L7.63 14.87c.448.053.905.08 1.37.08 4.971 0 9-3.113 9-6.95S13.971 0.6 9 0.6"
          fill="#191919"
        />
      </svg>
      카카오로 시작하기
    </button>
  );
}
