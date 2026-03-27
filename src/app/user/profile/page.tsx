"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import QRCode from "react-qr-code";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { QrCode, User, Mail, Hash, Trophy, Zap, Shield, Flame } from "lucide-react";

interface BadgeData {
  id: string;
  type: string;
  name: string;
}

interface StatsData {
  totalAttended: number;
  streak: number;
}

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/badges").then((r) => r.json()).then((d) => Array.isArray(d) && setBadges(d));
      fetch("/api/dashboard/user").then((r) => r.json()).then(setStats);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;

  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      {/* QR Code Card */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-white text-lg font-bold mb-1">Your QR Code</h2>
            <p className="text-indigo-200 text-sm">Show this to an organizer to check in</p>
          </div>
        </div>
        <CardContent className="flex flex-col items-center py-8">
          <div className="p-4 bg-white rounded-2xl shadow-lg shadow-indigo-500/10">
            <QRCode
              value={user.code || ""}
              size={200}
              level="H"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Code</p>
            <div className="flex items-center gap-2 justify-center">
              <Hash className="h-5 w-5 text-indigo-500" />
              <span className="text-2xl font-mono font-bold tracking-widest text-gray-900 dark:text-white">
                {user.code}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">
                <AnimatedCounter value={stats.totalAttended} />
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Events</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">
                <AnimatedCounter value={stats.streak} />
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">
                <AnimatedCounter value={badges.length} />
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Badges</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-500" />
              Your Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50"
                >
                  <span>{BADGE_ICONS[badge.type] || "🏅"}</span>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <QrCode className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
              <Badge>Attendee</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
