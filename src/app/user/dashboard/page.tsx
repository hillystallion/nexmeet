"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Heatmap } from "@/components/ui/heatmap";
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  Flame,
  Clock,
  Trophy,
  Shield,
  Zap,
  Star,
  Target,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn, EVENT_TYPE_COLORS } from "@/lib/utils";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#6b7280"];

const BADGE_ICONS: Record<string, string> = {
  first_checkin: "🎯",
  streak_3: "🔥",
  streak_7: "⚡",
  events_10: "📅",
  events_25: "🏅",
  events_50: "🏆",
  early_bird: "🌅",
  night_owl: "🦉",
  social_butterfly: "🦋",
  feedback_star: "⭐",
};

interface DashboardData {
  totalAttended: number;
  thisWeek: number;
  thisMonth: number;
  streak: number;
  byType: Record<string, number>;
  recent: Array<{
    id: string;
    eventTitle: string;
    eventType: string;
    checkedIn: string;
  }>;
}

interface BadgeData {
  id: string;
  type: string;
  name: string;
  earnedAt: string;
}

interface AttendanceRecord {
  checkedIn: string;
}

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/user").then((r) => r.json()),
      fetch("/api/badges").then((r) => r.json()),
      fetch("/api/attendance/my").then((r) => r.json()),
    ]).then(([dashData, badgeData, attendanceData]) => {
      setData(dashData);
      setBadges(Array.isArray(badgeData) ? badgeData : []);

      // Build heatmap data from attendance records
      const hmap: Record<string, number> = {};
      if (Array.isArray(attendanceData)) {
        attendanceData.forEach((a: AttendanceRecord) => {
          const dateStr = new Date(a.checkedIn).toISOString().split("T")[0];
          hmap[dateStr] = (hmap[dateStr] || 0) + 1;
        });
      }
      setHeatmapData(hmap);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const pieData = Object.entries(data.byType).map(([name, value]) => ({ name, value }));
  const userPoints = (session?.user as any)?.points || data.totalAttended * 10;
  const userLevel = Math.floor(userPoints / 100) + 1;
  const progressToNext = (userPoints % 100);

  const stats = [
    { label: "Total Attended", value: data.totalAttended, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
    { label: "This Week", value: data.thisWeek, icon: Calendar, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/30" },
    { label: "This Month", value: data.thisMonth, icon: Target, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "Day Streak", value: data.streak, icon: Flame, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
  ];

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-indigo-500" />
        Dashboard
      </h1>

      {/* Points & Level Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium">Your Points</p>
              <p className="text-4xl font-extrabold text-white mt-1">
                <AnimatedCounter value={userPoints} />
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold">
                <Zap className="h-4 w-4" />
                Level {userLevel}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{progressToNext}/100 pts</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-all hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-3xl font-bold">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Attendance Heatmap
          </CardTitle>
          <CardDescription>Your check-in activity over the last 20 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap data={heatmapData} />
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            Achievements
          </CardTitle>
          <CardDescription>{badges.length} badge{badges.length !== 1 ? "s" : ""} earned</CardDescription>
        </CardHeader>
        <CardContent>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <span className="text-2xl">{BADGE_ICONS[badge.type] || "🏅"}</span>
                  <span className="text-xs font-semibold text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">Attend events to earn badges!</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Event Type</CardTitle>
            <CardDescription>Your attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No data yet</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recent.length > 0 ? (
              <div className="space-y-3">
                {data.recent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.eventTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(item.checkedIn).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                    <Badge className={cn("text-white border-0 text-xs", EVENT_TYPE_COLORS[item.eventType])}>
                      {item.eventType}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No activity yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
