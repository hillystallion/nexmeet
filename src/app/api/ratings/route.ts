import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  const where: any = {};
  if (eventId) where.eventId = eventId;

  const ratings = await prisma.rating.findMany({
    where,
    include: {
      user: { select: { name: true, image: true } },
      event: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(ratings);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId, score, comment } = await req.json();

  if (!eventId || !score || score < 1 || score > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  // Check attendance
  const attendance = await prisma.attendance.findUnique({
    where: { userId_eventId: { userId: session.user.id, eventId } },
  });
  if (!attendance) {
    return NextResponse.json(
      { error: "You must attend an event to rate it" },
      { status: 403 }
    );
  }

  // Check existing rating
  const existing = await prisma.rating.findUnique({
    where: { userId_eventId: { userId: session.user.id, eventId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already rated" }, { status: 409 });
  }

  const rating = await prisma.rating.create({
    data: {
      userId: session.user.id,
      eventId,
      score,
      comment: comment || null,
    },
  });

  // Award bonus points for giving feedback
  await prisma.user.update({
    where: { id: session.user.id },
    data: { points: { increment: 5 } },
  });

  return NextResponse.json(rating, { status: 201 });
}
