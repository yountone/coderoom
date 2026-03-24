import { cn } from "@/components/ui/cn";
import type { Tier } from "@/types";

const tierConfig: Record<Tier, { label: string; className: string }> = {
  Black: { label: "Black", className: "bg-gray-900 text-white" },
  Gold: { label: "Gold", className: "bg-yellow-500 text-white" },
  Silver: { label: "Silver", className: "bg-gray-400 text-white" },
  Bronze: { label: "Bronze", className: "bg-orange-600 text-white" },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const config = tierConfig[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
