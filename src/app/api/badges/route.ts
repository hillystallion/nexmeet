import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let userId = searchParams.get("userId");

  if (!userId) {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
  }

  const badges = await prisma.badge.findMany({
    where: { userId },
    orderBy: { earnedAt: "desc" },
  });

  return NextResponse.json(badges);
}
