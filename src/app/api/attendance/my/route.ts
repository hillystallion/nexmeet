import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attendances = await prisma.attendance.findMany({
    where: { userId: session.user.id },
    include: {
      event: {
        include: {
          host: { select: { name: true } },
        },
      },
    },
    orderBy: { checkedIn: "desc" },
  });

  return NextResponse.json(attendances);
}
