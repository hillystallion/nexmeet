import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET(req: Request) {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: any = {};
  if (startDate && endDate) {
    where.startTime = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      attendances: {
        include: { user: true },
      },
    },
  });

  const totalEvents = events.length;
  const totalAttendances = events.reduce((sum, e) => sum + e.attendances.length, 0);
  const uniqueUsers = new Set(events.flatMap((e) => e.attendances.map((a) => a.userId))).size;

  const eventsByType: Record<string, { count: number; attendances: number }> = {};
  events.forEach((e) => {
    if (!eventsByType[e.type]) eventsByType[e.type] = { count: 0, attendances: 0 };
    eventsByType[e.type].count++;
    eventsByType[e.type].attendances += e.attendances.length;
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const attendanceByDay: Record<string, number> = {};
  days.forEach((d) => (attendanceByDay[d] = 0));
  events.forEach((e) => {
    const day = days[new Date(e.startTime).getDay()];
    attendanceByDay[day] += e.attendances.length;
  });

  const attendanceByHour: Record<string, number> = {};
  for (let h = 8; h <= 21; h++) {
    const label = h <= 12 ? `${h}am` : `${h - 12}pm`;
    attendanceByHour[label] = 0;
  }
  events.forEach((e) => {
    const hour = new Date(e.startTime).getHours();
    if (hour >= 8 && hour <= 21) {
      const label = hour <= 12 ? `${hour}am` : `${hour - 12}pm`;
      attendanceByHour[label] = (attendanceByHour[label] || 0) + e.attendances.length;
    }
  });

  const topEvents = events
    .map((e) => ({ id: e.id, title: e.title, type: e.type, attendances: e.attendances.length }))
    .sort((a, b) => b.attendances - a.attendances)
    .slice(0, 10);

  const dailyTrend: Record<string, { events: number; attendances: number }> = {};
  events.forEach((e) => {
    const dateKey = new Date(e.startTime).toISOString().split("T")[0];
    if (!dailyTrend[dateKey]) dailyTrend[dateKey] = { events: 0, attendances: 0 };
    dailyTrend[dateKey].events++;
    dailyTrend[dateKey].attendances += e.attendances.length;
  });

  return NextResponse.json({
    totalEvents,
    totalAttendances,
    uniqueUsers,
    eventsByType,
    attendanceByDay,
    attendanceByHour,
    topEvents,
    dailyTrend,
  });
}
