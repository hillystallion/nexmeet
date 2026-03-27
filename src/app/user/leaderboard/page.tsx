"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Trophy, Flame, Shield, Crown, Star, Medal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  streak: number;
  image: string | null;
  _count: {
    attendances: number;
    badges: number;
  };
}

const levelColors: Record<number, string> = {
  1: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  2: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  3: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
  4: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  5: "bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-800 dark:to-yellow-800 text-amber-800 dark:text-amber-200",
};

const podiumColors = [
  "from-amber-400/20 via-yellow-300/10 to-amber-400/20 border-amber-400/50",
  "from-gray-300/20 via-gray-200/10 to-gray-300/20 border-gray-400/50",
  "from-orange-400/20 via-amber-300/10 to-orange-400/20 border-orange-400/50",
];

const podiumIcons = [Crown, Medal, Medal];

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          Leaderboard
        </h1>
        <Badge variant="secondary" className="gap-1">
          <Zap className="h-3 w-3" />
          {users.length} participants
        </Badge>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((user, i) => {
          const PodiumIcon = podiumIcons[i];
          const isMe = session?.user?.id === user.id;
          return (
            <Card
              key={user.id}
              className={cn(
                "relative overflow-hidden border-2 transition-all hover:scale-[1.02]",
                isMe && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-950"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", podiumColors[i])} />
              <CardContent className="relative p-6 text-center">
                <PodiumIcon
                  className={cn(
                    "h-8 w-8 mx-auto mb-3",
                    i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : "text-orange-500"
                  )}
                />
                <div
                  className={cn(
                    "w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold",
                    i === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white" :
                    i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
                    "bg-gradient-to-br from-orange-400 to-amber-500 text-white"
                  )}
                >
                  {getInitials(user.name)}
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1", levelColors[user.level] || levelColors[1])}>
                  Level {user.level}
                </div>
                <p className="text-3xl font-extrabold mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <AnimatedCounter value={user.points} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {user.streak}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    {user._count.attendances}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    {user._count.badges}
                  </span>
                </div>
                {isMe && (
                  <Badge className="mt-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    You
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {rest.map((user, i) => {
                const rank = i + 4;
                const isMe = session?.user?.id === user.id;
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      isMe && "bg-indigo-50/50 dark:bg-indigo-900/10"
                    )}
                  >
                    <span className="text-sm font-bold text-gray-400 w-8 text-center">
                      #{rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        {isMe && <Badge className="text-[10px] py-0 px-1.5">You</Badge>}
                      </div>
                      <div className={cn("inline-flex items-center px-1.5 py-0 rounded-full text-[10px] font-semibold", levelColors[user.level] || levelColors[1])}>
                        Lv. {user.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        {user.streak}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        {user._count.attendances}
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 min-w-[60px] text-right">
                        {user.points} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
