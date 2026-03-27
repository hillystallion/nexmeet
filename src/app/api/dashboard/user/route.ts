import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const allAttendances = await prisma.attendance.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { checkedIn: "desc" },
  });

  const totalAttended = allAttendances.length;
  const thisWeek = allAttendances.filter((a) => new Date(a.checkedIn) >= startOfWeek).length;
  const thisMonth = allAttendances.filter((a) => new Date(a.checkedIn) >= startOfMonth).length;

  // Calculate streak
  const dates = Array.from(new Set(allAttendances.map((a) => new Date(a.checkedIn).toISOString().split("T")[0]))).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (dates[i] === expected.toISOString().split("T")[0]) {
      streak++;
    } else if (i === 0 && dates[0] !== today) {
      // If user hasn't checked in today, check from yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (dates[0] === yesterday.toISOString().split("T")[0]) {
        streak++;
      } else break;
    } else break;
  }

  const byType: Record<string, number> = {};
  allAttendances.forEach((a) => {
    byType[a.event.type] = (byType[a.event.type] || 0) + 1;
  });

  const recent = allAttendances.slice(0, 5).map((a) => ({
    id: a.id,
    eventTitle: a.event.title,
    eventType: a.event.type,
    checkedIn: a.checkedIn,
  }));

  return NextResponse.json({
    totalAttended,
    thisWeek,
    thisMonth,
    streak,
    byType,
    recent,
  });
}
