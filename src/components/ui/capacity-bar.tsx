"use client";

import { cn } from "@/lib/utils";

interface CapacityBarProps {
  current: number;
  max: number;
  className?: string;
}

export function CapacityBar({ current, max, className }: CapacityBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const isFull = current >= max;

  const getColor = () => {
    if (percentage >= 90) return "from-red-500 to-red-600";
    if (percentage >= 70) return "from-amber-500 to-orange-500";
    if (percentage >= 50) return "from-yellow-500 to-amber-500";
    return "from-emerald-500 to-teal-500";
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          {current} / {max} spots
        </span>
        {isFull ? (
          <span className="font-semibold text-red-500">FULL</span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            {max - current} remaining
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            getColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
