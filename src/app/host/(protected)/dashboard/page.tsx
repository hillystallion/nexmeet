"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn, formatTime } from "@/lib/utils";

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#6b7280"];

interface DashboardData {
  totalEvents: number;
  totalAttendances: number;
  activeUsers: number;
  upcomingEvents: number;
  recentCheckins: Array<{
    id: string;
    checkedIn: string;
    user: { name: string; email: string };
    event: { title: string };
  }>;
  eventsByType: Record<string, number>;
  weeklyTrend: Array<{
    week: string;
    events: number;
    attendances: number;
  }>;
}

export default function HostDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/host")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const pieData = Object.entries(data.eventsByType).map(([name, value]) => ({ name, value }));

  const stats = [
    { label: "Total Events", value: data.totalEvents, icon: Calendar, color: "text-indigo-500" },
    { label: "Total Check-ins", value: data.totalAttendances, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Active Users", value: data.activeUsers, icon: Users, color: "text-purple-500" },
    { label: "Upcoming", value: data.upcomingEvents, icon: TrendingUp, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-emerald-500" />
        Organizer Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-all hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-gray-50 dark:bg-gray-800/50")}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-3xl font-bold"><AnimatedCounter value={stat.value} /></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Trend</CardTitle>
            <CardDescription>Last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="events" fill="#6366f1" radius={[4, 4, 0, 0]} name="Events" />
                  <Bar dataKey="attendances" fill="#10b981" radius={[4, 4, 0, 0]} name="Check-ins" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Events by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Events by Type</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600 dark:text-gray-400">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Check-ins</CardTitle>
          <CardDescription>Latest attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentCheckins.length > 0 ? (
            <div className="space-y-2">
              {data.recentCheckins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="font-medium text-sm">{checkin.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{checkin.event.title}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(checkin.checkedIn)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No check-ins yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
