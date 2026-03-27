import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      host: { select: { name: true } },
      attendances: {
        include: {
          user: { select: { id: true, name: true, email: true, code: true } },
        },
        orderBy: { checkedIn: "desc" },
      },
      _count: { select: { attendances: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      type: body.type,
      location: body.location,
      startTime: body.startTime ? new Date(body.startTime) : undefined,
      endTime: body.endTime ? new Date(body.endTime) : undefined,
    },
  });
  return NextResponse.json(event);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.attendance.deleteMany({ where: { eventId: params.id } });
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
