"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { cn, EVENT_TYPE_COLORS } from "@/lib/utils";

interface ReportData {
  totalEvents: number;
  totalAttendances: number;
  uniqueUsers: number;
  eventsByType: Record<string, { count: number; attendances: number }>;
  attendanceByDay: Record<string, number>;
  attendanceByHour: Record<string, number>;
  topEvents: Array<{ id: string; title: string; type: string; attendances: number }>;
  dailyTrend: Record<string, { events: number; attendances: number }>;
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const params = new URLSearchParams({ startDate, endDate });
    const res = await fetch(`/api/reports?${params}`);
    const report = await res.json();
    setData(report);
    setLoading(false);
  };

  const exportExcel = async () => {
    if (!data) return;
    const XLSX = await import("xlsx");

    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryData = [
      ["Metric", "Value"],
      ["Total Events", data.totalEvents],
      ["Total Attendances", data.totalAttendances],
      ["Unique Users", data.uniqueUsers],
      ["Date Range", `${startDate} to ${endDate}`],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");

    // Sheet 2: By Type
    const typeData = [["Type", "Events", "Attendances"]];
    Object.entries(data.eventsByType).forEach(([type, val]) => {
      typeData.push([type, val.count as any, val.attendances as any]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(typeData), "By Type");

    // Sheet 3: By Day
    const dayData = [["Day", "Attendances"]];
    Object.entries(data.attendanceByDay).forEach(([day, count]) => {
      dayData.push([day, count as any]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dayData), "By Day");

    // Sheet 4: By Hour
    const hourData = [["Hour", "Attendances"]];
    Object.entries(data.attendanceByHour).forEach(([hour, count]) => {
      hourData.push([hour, count as any]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(hourData), "By Hour");

    // Sheet 5: Top Events
    const topData = [["Event", "Type", "Attendances"]];
    data.topEvents.forEach((e) => {
      topData.push([e.title, e.type, e.attendances as any]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(topData), "Top Events");

    // Sheet 6: Daily Trend
    const trendData = [["Date", "Events", "Attendances"]];
    Object.entries(data.dailyTrend).sort().forEach(([date, val]) => {
      trendData.push([date, val.events as any, val.attendances as any]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trendData), "Daily Trend");

    XLSX.writeFile(wb, `attendance-report-${startDate}-to-${endDate}.xlsx`);
  };

  const dayChartData = data
    ? Object.entries(data.attendanceByDay).map(([name, value]) => ({ name, value }))
    : [];

  const hourChartData = data
    ? Object.entries(data.attendanceByHour).map(([name, value]) => ({ name, value }))
    : [];

  const trendChartData = data
    ? Object.entries(data.dailyTrend)
        .sort()
        .map(([date, val]) => ({ date: date.slice(5), ...val }))
    : [];

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileSpreadsheet className="h-6 w-6 text-emerald-500" />
        Reports
      </h1>

      {/* Date range */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              onClick={fetchReport}
              className="bg-gradient-to-r from-emerald-600 to-teal-600"
              disabled={!startDate || !endDate || loading}
            >
              {loading ? "Loading..." : "Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                <p className="text-3xl font-bold">{data.totalEvents}</p>
                <p className="text-xs text-gray-500">Total Events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-3xl font-bold">{data.totalAttendances}</p>
                <p className="text-xs text-gray-500">Total Check-ins</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-3xl font-bold">{data.uniqueUsers}</p>
                <p className="text-xs text-gray-500">Unique Users</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dayChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Trend */}
          {trendChartData.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="attendances" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Top Events</CardTitle>
                <CardDescription>Most attended events</CardDescription>
              </div>
              <Button onClick={exportExcel} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.topEvents.map((event, i) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <Badge className={cn("text-white border-0 text-xs mt-1", EVENT_TYPE_COLORS[event.type])}>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    <span className="font-bold text-lg">{event.attendances}</span>
                  </div>
                ))}
                {data.topEvents.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No events in this range</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* By Type breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Breakdown by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(data.eventsByType).map(([type, val]) => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", EVENT_TYPE_COLORS[type])} />
                      <span className="font-medium text-sm">{type}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {val.count} events · {val.attendances} check-ins
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
