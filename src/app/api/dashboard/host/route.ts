import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET() {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalEvents = await prisma.event.count({ where: { hostId } });
  const totalAttendances = await prisma.attendance.count({
    where: { event: { hostId } },
  });

  const monthAttendances = await prisma.attendance.findMany({
    where: {
      event: { hostId },
      checkedIn: { gte: startOfMonth },
    },
    select: { userId: true },
  });
  const activeUsers = new Set(monthAttendances.map((a) => a.userId)).size;

  const upcomingEvents = await prisma.event.count({
    where: { hostId, startTime: { gte: now } },
  });

  const recentCheckins = await prisma.attendance.findMany({
    where: { event: { hostId } },
    include: {
      user: { select: { name: true, email: true } },
      event: { select: { title: true } },
    },
    orderBy: { checkedIn: "desc" },
    take: 10,
  });

  const events = await prisma.event.findMany({
    where: { hostId },
    include: { _count: { select: { attendances: true } } },
  });

  const eventsByType: Record<string, number> = {};
  events.forEach((e) => {
    eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
  });

  // Weekly trend (last 4 weeks)
  const weeklyTrend = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekEvents = await prisma.event.count({
      where: { hostId, startTime: { gte: weekStart, lte: weekEnd } },
    });
    const weekAttendances = await prisma.attendance.count({
      where: { event: { hostId }, checkedIn: { gte: weekStart, lte: weekEnd } },
    });

    weeklyTrend.push({
      week: `Week ${4 - i}`,
      events: weekEvents,
      attendances: weekAttendances,
    });
  }

  return NextResponse.json({
    totalEvents,
    totalAttendances,
    activeUsers,
    upcomingEvents,
    recentCheckins,
    eventsByType,
    weeklyTrend,
  });
}
