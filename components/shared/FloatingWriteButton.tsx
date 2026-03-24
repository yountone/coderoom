"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default function FloatingWriteButton() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <Link
      href="/write"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90 active:scale-95"
    >
      <Pencil className="h-6 w-6" />
    </Link>
  );
}
