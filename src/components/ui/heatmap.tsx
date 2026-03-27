"use client";

import { cn } from "@/lib/utils";

interface HeatmapProps {
  data: Record<string, number>;
  className?: string;
}

export function Heatmap({ data, className }: HeatmapProps) {
  // Generate last 20 weeks of dates
  const today = new Date();
  const weeks: Date[][] = [];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 20 * 7 + (7 - today.getDay()));

  const currentDate = new Date(startDate);
  let currentWeek: Date[] = [];

  while (currentDate <= today) {
    currentWeek.push(new Date(currentDate));
    if (currentDate.getDay() === 6 || currentDate.getTime() === today.getTime()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
    if (count === 2) return "bg-emerald-400 dark:bg-emerald-700";
    return "bg-emerald-600 dark:bg-emerald-500";
  };

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  // Get month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = week[0]?.getMonth();
    if (month !== undefined && month !== lastMonth) {
      monthLabels.push({
        label: week[0].toLocaleDateString("en-US", { month: "short" }),
        col: i,
      });
      lastMonth = month;
    }
  });

  return (
    <div className={cn("overflow-x-auto", className)}>
      {/* Month labels */}
      <div className="flex ml-8 mb-1 gap-0">
        {monthLabels.map((m, i) => (
          <div
            key={i}
            className="text-[10px] text-gray-400 dark:text-gray-500"
            style={{ marginLeft: i === 0 ? m.col * 14 : (m.col - (monthLabels[i - 1]?.col || 0)) * 14 - 20 }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-0">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[12px] text-[10px] text-gray-400 dark:text-gray-500 leading-[12px] w-6 text-right pr-1">
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {Array.from({ length: 7 }, (_, di) => {
                const day = week.find((d) => d.getDay() === di);
                if (!day) return <div key={di} className="w-[12px] h-[12px]" />;
                const dateStr = day.toISOString().split("T")[0];
                const count = data[dateStr] || 0;
                return (
                  <div
                    key={di}
                    className={cn(
                      "w-[12px] h-[12px] rounded-[2px] transition-colors",
                      getColor(count)
                    )}
                    title={`${dateStr}: ${count} check-in${count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 ml-8 text-[10px] text-gray-400 dark:text-gray-500">
        <span>Less</span>
        <div className="w-[12px] h-[12px] rounded-[2px] bg-gray-100 dark:bg-gray-800" />
        <div className="w-[12px] h-[12px] rounded-[2px] bg-emerald-200 dark:bg-emerald-900" />
        <div className="w-[12px] h-[12px] rounded-[2px] bg-emerald-400 dark:bg-emerald-700" />
        <div className="w-[12px] h-[12px] rounded-[2px] bg-emerald-600 dark:bg-emerald-500" />
        <span>More</span>
      </div>
    </div>
  );
}
