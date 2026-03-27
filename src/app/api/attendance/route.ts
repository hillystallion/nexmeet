import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const eventId = searchParams.get("eventId");

  const where: any = {};
  if (userId) where.userId = userId;
  if (eventId) where.eventId = eventId;

  const attendances = await prisma.attendance.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, code: true } },
      event: { select: { id: true, title: true, type: true, startTime: true, endTime: true } },
    },
    orderBy: { checkedIn: "desc" },
  });

  return NextResponse.json(attendances);
}

export async function POST(req: Request) {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, eventId } = await req.json();

  const user = await prisma.user.findUnique({ where: { code } });
  if (!user) {
    return NextResponse.json({ error: "User not found with this code" }, { status: 404 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, featured: true, capacity: true, hostId: true },
  });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Check capacity
  if (event.capacity) {
    const currentCount = await prisma.attendance.count({ where: { eventId } });
    if (currentCount >= event.capacity) {
      return NextResponse.json({ error: "Event is at full capacity" }, { status: 403 });
    }
  }

  const existing = await prisma.attendance.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already checked in", user: { name: user.name } }, { status: 409 });
  }

  const pointsEarned = event.featured ? 20 : 10;

  const attendance = await prisma.attendance.create({
    data: { userId: user.id, eventId, points: pointsEarned },
    include: {
      user: { select: { name: true, email: true } },
      event: { select: { title: true } },
    },
  });

  // Award points to user
  await prisma.user.update({
    where: { id: user.id },
    data: { points: { increment: pointsEarned } },
  });

  return NextResponse.json(attendance, { status: 201 });
}
