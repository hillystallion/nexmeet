import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyHostToken } from "@/lib/host-auth";

export async function GET() {
  const hostId = await verifyHostToken();
  if (!hostId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activity = await prisma.attendance.findMany({
    where: { event: { hostId } },
    include: {
      user: { select: { name: true, email: true, image: true } },
      event: { select: { title: true, type: true } },
    },
    orderBy: { checkedIn: "desc" },
    take: 20,
  });

  return NextResponse.json(activity);
}
