"use client";

import { useReseedMutation } from "@/state/api";
import { useState } from "react";

type Props = {
  className?: string;
  label?: string;
  confirm?: boolean;
  anchorDaysAgo?: number; // default 90
  deltaDays?: number; // if provided, overrides anchorDaysAgo logic
};

export default function ReseedButton({
  className = "",
  label = "Reseed DB",
  confirm = true,
  anchorDaysAgo = 90,
  deltaDays,
}: Props) {
  const [reseed, { isLoading }] = useReseedMutation();
  const [msg, setMsg] = useState<string | null>(null);

  const handleClick = async () => {
    if (confirm && !window.confirm("This will wipe & reseed the DB. Continue?"))
      return;

    try {
      const res = await reseed(
        deltaDays != null ? { deltaDays } : { anchorDaysAgo },
      ).unwrap();
      setMsg(`Done. Dates shifted by ${res.deltaDays} days.`);
    } catch (e: any) {
      setMsg(e?.data?.error ?? "Reseed failed");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={[
          "rounded px-3 py-2 text-white",
          isLoading
            ? "cursor-not-allowed bg-gray-500"
            : "bg-blue-primary hover:bg-blue-600",
          className,
        ].join(" ")}
      >
        {isLoading ? "Reseeding..." : label}
      </button>
      {msg && (
        <span className="text-sm text-gray-600 dark:text-neutral-300">
          {msg}
        </span>
      )}
    </div>
  );
}
