import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const type = searchParams.get("type");
  const hostId = searchParams.get("hostId");

  const where: any = {};
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.startTime = { gte: start, lte: end };
  }
  if (type) where.type = type;
  if (hostId) where.hostId = hostId;

  const events = await prisma.event.findMany({
    where,
    include: {
      host: { select: { name: true } },
      _count: { select: { attendances: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description || null,
      type: body.type || "Meeting",
      location: body.location || null,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      hostId,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
