"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Radio, Clock, RefreshCw } from "lucide-react";
import { cn, EVENT_TYPE_COLORS } from "@/lib/utils";

interface ActivityItem {
  id: string;
  checkedIn: string;
  user: { name: string; email: string; image: string | null };
  event: { title: string; type: string };
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivity = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    const res = await fetch("/api/activity");
    const data = await res.json();
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(() => fetchActivity(), 10000);
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-500" />
          Live Activity Feed
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <Radio className="h-4 w-4 animate-pulse" />
            <span className="font-medium">Live</span>
          </div>
          <button
            onClick={() => fetchActivity(true)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className={cn("h-4 w-4 text-gray-400", refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Activity className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No activity yet</h3>
            <p className="text-sm text-gray-400 mt-1">Check-ins will appear here in real-time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card
              key={item.id}
              className={cn(
                "transition-all hover:shadow-lg",
                i === 0 && "ring-1 ring-emerald-500/20"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(item.user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{item.user.name}</span>
                      <span className="text-gray-500 dark:text-gray-400"> checked in to </span>
                      <span className="font-semibold">{item.event.title}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge className={cn("text-white border-0 text-[10px]", EVENT_TYPE_COLORS[item.event.type])}>
                        {item.event.type}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(item.checkedIn)}
                      </span>
                    </div>
                  </div>
                  {i === 0 && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
